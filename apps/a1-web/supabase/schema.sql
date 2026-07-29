-- A1 Web — Supabase schema (SHARED workspace)
-- Run in the Supabase dashboard: SQL Editor → New Query → paste & run. Idempotent.
--
-- Scope: data is shared across signed-in users. Role-based policies reserve
-- governance and backlog writes for editors and administrators.

-- ─── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Access roles ────────────────────────────────────────────────────────────
-- Hosted roles are assigned in auth.users.raw_app_meta_data. User metadata is
-- intentionally ignored because account holders can edit it themselves.
create or replace function public.a1_current_role()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select case coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'user')
    when 'admin' then 'admin'
    when 'editor' then 'editor'
    else 'user'
  end;
$$;

create or replace function public.a1_has_min_role(required_role text)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select
    case public.a1_current_role()
      when 'admin' then 3
      when 'editor' then 2
      else 1
    end
    >=
    case required_role
      when 'admin' then 3
      when 'editor' then 2
      else 1
    end;
$$;

revoke all on function public.a1_current_role() from public;
revoke all on function public.a1_has_min_role(text) from public;
grant execute on function public.a1_current_role() to authenticated;
grant execute on function public.a1_has_min_role(text) to authenticated;

-- ─── Administrator user-management audit ────────────────────────────────────
-- Account listing, invitations, role changes and deletions run through the server-only
-- Netlify function. Browser clients receive no direct table privileges.
create table if not exists public.a1_user_admin_audit (
  id              uuid        primary key default gen_random_uuid(),
  actor_user_id   uuid        references auth.users(id) on delete set null,
  actor_email     text,
  target_user_id  uuid        references auth.users(id) on delete set null,
  target_email    text,
  action          text        not null
                                check (action in ('user_invited', 'role_changed', 'user_deleted')),
  previous_role   text
                                check (previous_role is null or previous_role in ('user', 'editor', 'admin')),
  new_role        text
                                check (
                                  (action = 'user_deleted' and new_role is null)
                                  or
                                  (action <> 'user_deleted' and new_role in ('user', 'editor', 'admin'))
                                ),
  created_at      timestamptz not null default now()
);

create index if not exists a1_user_admin_audit_created_idx
  on public.a1_user_admin_audit (created_at desc);

create index if not exists a1_user_admin_audit_target_idx
  on public.a1_user_admin_audit (target_user_id, created_at desc);

create index if not exists a1_user_admin_audit_email_idx
  on public.a1_user_admin_audit (target_email, created_at desc);

alter table public.a1_user_admin_audit enable row level security;
revoke all on table public.a1_user_admin_audit from anon, authenticated;
grant select, insert on table public.a1_user_admin_audit to service_role;

comment on table public.a1_user_admin_audit is
  'Server-only audit history for A1 account invitations, role changes and deletions.';

-- Successful A1 sign-ins. Authenticated clients can only call the trusted
-- recorder function; the browser cannot read or write the audit table.
create table if not exists public.a1_user_login_audit (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        references auth.users(id) on delete set null,
  user_email    text,
  signed_in_at  timestamptz not null default now()
);

create index if not exists a1_user_login_audit_user_idx
  on public.a1_user_login_audit (user_id, signed_in_at desc);

create index if not exists a1_user_login_audit_email_idx
  on public.a1_user_login_audit (user_email, signed_in_at desc);

create index if not exists a1_user_login_audit_signed_in_idx
  on public.a1_user_login_audit (signed_in_at desc);

alter table public.a1_user_login_audit enable row level security;
revoke all on table public.a1_user_login_audit from anon, authenticated;
grant select on table public.a1_user_login_audit to service_role;

create or replace function public.a1_record_login()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  login_user_id uuid := auth.uid();
  login_email text := auth.jwt() ->> 'email';
begin
  if login_user_id is null then
    raise exception 'Authentication is required.';
  end if;

  if not exists (
    select 1
    from public.a1_user_login_audit
    where user_id = login_user_id
      and signed_in_at > now() - interval '30 seconds'
  ) then
    insert into public.a1_user_login_audit (user_id, user_email)
    values (login_user_id, login_email);
  end if;
end;
$$;

revoke all on function public.a1_record_login() from public;
grant execute on function public.a1_record_login() to authenticated;

comment on table public.a1_user_login_audit is
  'Server-timestamped successful A1 sign-ins, retained for administrator review.';

-- ─── Shared workspace bundle ─────────────────────────────────────────────────
-- A single row (id = 1) holds the full bundle (the app's exportEnvelope():
-- projects + pages + patterns + themes). Every signed-in user reads and writes it.

create table if not exists public.shared_state (
  id         int         primary key default 1,
  data       text        not null default '',
  updated_at timestamptz not null default now(),
  constraint shared_state_singleton check (id = 1)
);

alter table public.shared_state enable row level security;

drop policy if exists "shared_state: read"  on public.shared_state;
drop policy if exists "shared_state: write" on public.shared_state;
create policy "shared_state: read"  on public.shared_state for select to authenticated using (true);
create policy "shared_state: write" on public.shared_state for all    to authenticated using (true) with check (true);

drop trigger if exists shared_state_updated_at on public.shared_state;
create trigger shared_state_updated_at
  before update on public.shared_state
  for each row execute function public.set_updated_at();

-- ─── Workspace labels (shared) ───────────────────────────────────────────────
-- A single row (id = 1) stores workspace-level label overrides and custom labels:
-- { locales: string[], items: [{ key, en, es, ... }] }. Project-specific label
-- overrides remain part of the project model. The client keeps a local cache for
-- offline/dev mode, but this table is the Supabase source of truth when signed in.

create table if not exists public.workspace_labels (
  id         int         primary key default 1,
  data       jsonb       not null default '{"locales":["en","es","fr","de","pt","ja","zh","ar"],"items":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint workspace_labels_singleton check (id = 1)
);

alter table public.workspace_labels enable row level security;

drop policy if exists "workspace_labels: read"  on public.workspace_labels;
drop policy if exists "workspace_labels: write" on public.workspace_labels;
create policy "workspace_labels: read"  on public.workspace_labels for select to authenticated using (true);
create policy "workspace_labels: write" on public.workspace_labels for all    to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

drop trigger if exists workspace_labels_updated_at on public.workspace_labels;
create trigger workspace_labels_updated_at
  before update on public.workspace_labels
  for each row execute function public.set_updated_at();

-- Migrate the most-recent per-user bundle into the shared row, then retire the
-- old per-user table. Guarded so a fresh project (no user_projects) just skips it.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'user_projects'
  ) then
    insert into public.shared_state (id, data)
    select 1, data from public.user_projects order by updated_at desc limit 1
    on conflict (id) do nothing;
    drop table public.user_projects;
  end if;
end $$;

-- ─── Image library (shared) ──────────────────────────────────────────────────
-- Bytes live in a public-read Storage bucket under a flat `shared/<id>` path;
-- this table holds the per-image metadata. Globally keyed by id (not per user)
-- so every signed-in user sees and manages every image; `user_id` records the
-- uploader only. Recreated to switch the key from (user_id, id) → id.

drop table if exists public.user_images cascade;

create table public.user_images (
  id          text     primary key,
  user_id     uuid     references auth.users(id) on delete set null,  -- uploader
  name        text     not null default 'Image',
  type        text     not null default 'image/png',
  size        integer  not null default 0,
  width       integer  not null default 0,
  height      integer  not null default 0,
  created_at  bigint   not null default 0,
  updated_at  bigint   not null default 0,
  crop        jsonb,
  project_ids text[]   not null default '{}',
  categories  text[]   not null default '{}'
);

alter table public.user_images enable row level security;

drop policy if exists "user_images: read"  on public.user_images;
drop policy if exists "user_images: write" on public.user_images;
create policy "user_images: read"  on public.user_images for select to authenticated using (true);
create policy "user_images: write" on public.user_images for all    to authenticated using (true) with check (true);

-- Storage bucket: public-read; any signed-in user may write anywhere in it.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

drop policy if exists "images: public read" on storage.objects;
drop policy if exists "images: insert own"  on storage.objects;
drop policy if exists "images: update own"  on storage.objects;
drop policy if exists "images: delete own"  on storage.objects;
drop policy if exists "images: write"       on storage.objects;

create policy "images: public read" on storage.objects for select
  using (bucket_id = 'images');
create policy "images: write" on storage.objects for all to authenticated
  using (bucket_id = 'images') with check (bucket_id = 'images');

-- ─── Edit history (shared, attributed) ──────────────────────────────────────
-- An append-only log of changes to a page / theme / pattern, each tagged with the
-- user who made it. Shared: every signed-in user reads the whole log and can add
-- to it (and rename entries). `snapshot` holds the object's state after the change
-- so an entry can be restored. Attached to the object via (entity_type, entity_id).

create table if not exists public.edit_history (
  id          uuid        primary key default gen_random_uuid(),
  entity_type text        not null,   -- 'page' | 'theme' | 'pattern'
  entity_id   text        not null,
  label       text        not null default 'Edit',
  user_id     uuid        references auth.users(id) on delete set null,
  user_email  text,
  snapshot    text,                   -- object JSON after the change (for restore)
  created_at  timestamptz not null default now()
);

create index if not exists edit_history_entity_idx
  on public.edit_history (entity_type, entity_id, created_at);

alter table public.edit_history enable row level security;

drop policy if exists "edit_history: read"   on public.edit_history;
drop policy if exists "edit_history: insert" on public.edit_history;
drop policy if exists "edit_history: update" on public.edit_history;
create policy "edit_history: read"   on public.edit_history for select to authenticated using (true);
create policy "edit_history: insert" on public.edit_history for insert to authenticated with check (true);
create policy "edit_history: update" on public.edit_history for update to authenticated using (true) with check (true);

-- ─── delete_user ─────────────────────────────────────────────────────────────
-- Called from the client via supabase.rpc('delete_user'). Deletes the calling
-- user from auth.users; shared data is left intact (it belongs to everyone).
create or replace function public.delete_user()
returns void
language sql
security definer
set search_path = public
as $$
  delete from auth.users where id = auth.uid();
$$;

-- ─── Backlog (shared, attributed) — a lightweight Jira ───────────────────────
-- A ticketing tool: editors and administrators see and edit every ticket (one
-- shared workspace), each tagged with who created it. A user's "queue" is just a
-- filtered view (created-by-me / assigned-to-me / awaiting-my-answer). Tickets
-- carry a human ref A1-<number> from a sequence, a status workflow, a suggested
-- priority + complexity, a scope (what part of the system it's about), a comment
-- /Q&A thread + activity log, votes, screenshot attachments, and notifications.

create sequence if not exists public.backlog_number_seq start 1;

create table if not exists public.backlog_items (
  id                 uuid        primary key default gen_random_uuid(),
  number             bigint      not null unique default nextval('public.backlog_number_seq'),
  title              text        not null,
  description        text,
  type               text        not null default 'feature'
                       check (type in ('feature', 'bug', 'epic')),
  status             text        not null default 'new'
                       check (status in ('new','triaged','accepted','in_progress','paused','done','released','wont_fix','duplicate','cancelled')),
  priority           text        check (priority in ('p0','p1','p2','p3')),       -- suggested; nullable
  complexity         text        check (complexity in ('xs','s','m','l','xl')),    -- suggested; nullable
  scope_kind         text        not null default 'general'
                       check (scope_kind in ('general','component','foundation','theme','pattern','project','package','app')),
  scope_ref          text,                                                          -- e.g. component id
  scope_label        text,                                                          -- human label for display
  created_by         uuid        references auth.users(id) on delete set null,
  created_by_email   text,
  assignee_id        uuid        references auth.users(id) on delete set null,
  assignee_email     text,
  awaiting_requester boolean     not null default false,
  duplicate_of       uuid        references public.backlog_items(id) on delete set null,
  links              jsonb       not null default '[]'::jsonb,                      -- related ticket ids (symmetric "linked tickets", A1-218)
  attachment_refs    text[]      not null default '{}',                            -- a1img://<id> refs
  vote_count         integer     not null default 0,                               -- denormalized (trigger-kept)
  reviews            jsonb       not null default '{}'::jsonb,                      -- virtual-team reviews, keyed by persona id: { "product-owner": { at, sig } }
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- A1-164: migrate existing workspaces from chore to epic vocabulary.
update public.backlog_items set type = 'feature' where type = 'chore';
alter table public.backlog_items drop constraint if exists backlog_items_type_check;
alter table public.backlog_items add constraint backlog_items_type_check
  check (type in ('feature', 'bug', 'epic'));
-- Existing DBs: add the virtual-team review column.
--   alter table public.backlog_items add column if not exists reviews jsonb not null default '{}'::jsonb;
-- Existing DBs: add the linked-tickets column (A1-218).
--   alter table public.backlog_items add column if not exists links jsonb not null default '[]'::jsonb;
-- Existing DBs: add the paused workflow status.
--   alter table public.backlog_items drop constraint if exists backlog_items_status_check;
--   alter table public.backlog_items add constraint backlog_items_status_check
--     check (status in ('new','triaged','accepted','in_progress','paused','done','released','wont_fix','duplicate','cancelled'));
-- Existing DBs predating the merge / link feature (A1-161): ensure the duplicate-link
-- column exists (it has shipped in the create-table above since the backlog launched, so
-- only the very earliest DBs need this).
--   alter table public.backlog_items add column if not exists duplicate_of uuid references public.backlog_items(id) on delete set null;

create index if not exists backlog_items_status_idx   on public.backlog_items (status);
create index if not exists backlog_items_created_idx   on public.backlog_items (created_by);
create index if not exists backlog_items_assignee_idx  on public.backlog_items (assignee_id);

alter table public.backlog_items enable row level security;
drop policy if exists "backlog_items: read"  on public.backlog_items;
drop policy if exists "backlog_items: write" on public.backlog_items;
create policy "backlog_items: read"  on public.backlog_items for select to authenticated
  using ((select public.a1_has_min_role('editor')));
create policy "backlog_items: write" on public.backlog_items for all    to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

drop trigger if exists backlog_items_updated_at on public.backlog_items;
create trigger backlog_items_updated_at
  before update on public.backlog_items
  for each row execute function public.set_updated_at();

-- Per-ticket comment / Q&A thread + activity log (kind = 'activity' rows are the log).
create table if not exists public.backlog_comments (
  id         uuid        primary key default gen_random_uuid(),
  item_id    uuid        not null references public.backlog_items(id) on delete cascade,
  kind       text        not null default 'comment'
               check (kind in ('comment','question','answer','activity')),
  body       text,
  meta       jsonb,                                       -- e.g. {"field":"status","from":"new","to":"triaged"}
  user_id    uuid        references auth.users(id) on delete set null,
  user_email text,
  created_at timestamptz not null default now()
);

create index if not exists backlog_comments_item_idx on public.backlog_comments (item_id, created_at);

alter table public.backlog_comments enable row level security;
drop policy if exists "backlog_comments: read"  on public.backlog_comments;
drop policy if exists "backlog_comments: write" on public.backlog_comments;
create policy "backlog_comments: read"  on public.backlog_comments for select to authenticated
  using ((select public.a1_has_min_role('editor')));
create policy "backlog_comments: write" on public.backlog_comments for all    to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

-- One vote per user per ticket. A trigger keeps backlog_items.vote_count in sync.
create table if not exists public.backlog_votes (
  item_id    uuid        not null references public.backlog_items(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (item_id, user_id)
);

alter table public.backlog_votes enable row level security;
drop policy if exists "backlog_votes: read"  on public.backlog_votes;
drop policy if exists "backlog_votes: write" on public.backlog_votes;
create policy "backlog_votes: read"  on public.backlog_votes for select to authenticated
  using ((select public.a1_has_min_role('editor')));
create policy "backlog_votes: write" on public.backlog_votes for all    to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

create or replace function public.backlog_sync_votes()
returns trigger language plpgsql as $$
declare
  target uuid := coalesce(new.item_id, old.item_id);
begin
  update public.backlog_items
    set vote_count = (select count(*) from public.backlog_votes where item_id = target)
    where id = target;
  return null;
end;
$$;

drop trigger if exists backlog_votes_count on public.backlog_votes;
create trigger backlog_votes_count
  after insert or delete on public.backlog_votes
  for each row execute function public.backlog_sync_votes();

-- In-app notifications: one row per recipient per event. The client filters to the
-- current user (user_id = auth.uid()) and shows an unread badge.
create table if not exists public.backlog_notifications (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,  -- recipient
  item_id    uuid        references public.backlog_items(id) on delete cascade,
  kind       text        not null default 'comment'
               check (kind in ('assigned','question','answer','status','comment','vote')),
  body       text,
  read       boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists backlog_notifications_user_idx on public.backlog_notifications (user_id, read);

alter table public.backlog_notifications enable row level security;
drop policy if exists "backlog_notifications: read"  on public.backlog_notifications;
drop policy if exists "backlog_notifications: write" on public.backlog_notifications;
create policy "backlog_notifications: read"  on public.backlog_notifications for select to authenticated
  using ((select public.a1_has_min_role('editor')));
create policy "backlog_notifications: write" on public.backlog_notifications for all    to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

-- ─── Data sources (datasets) ─────────────────────────────────────────────────
-- Reusable datasets (A1-94): a named table of `columns` + `rows`, scoped to projects
-- via `project_ids` (empty = global / every project, the image-library idiom), edited
-- in the A1 DataGrid. Shared workspace like backlog: any signed-in user reads/writes.
create table if not exists public.data_sources (
  id               uuid        primary key default gen_random_uuid(),
  name             text        not null default 'Untitled dataset',
  description      text,
  columns          jsonb       not null default '[]'::jsonb,  -- [{ key, name, type }]
  rows             jsonb       not null default '[]'::jsonb,  -- [{ <columnKey>: value }]
  project_ids      text[]      not null default '{}',         -- empty = available to every project
  created_by       uuid        references auth.users(id) on delete set null,
  created_by_email text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.data_sources enable row level security;
drop policy if exists "data_sources: read"  on public.data_sources;
drop policy if exists "data_sources: write" on public.data_sources;
create policy "data_sources: read"  on public.data_sources for select to authenticated using (true);
create policy "data_sources: write" on public.data_sources for all    to authenticated using (true) with check (true);

drop trigger if exists data_sources_updated_at on public.data_sources;
create trigger data_sources_updated_at
  before update on public.data_sources
  for each row execute function public.set_updated_at();

-- Optional: enable Supabase Realtime so boards/badges update live without the poll
-- fallback. Safe to skip — the client also polls. Ignore "already member" errors.
-- alter publication supabase_realtime add table public.backlog_items, public.backlog_comments, public.backlog_notifications;
-- alter publication supabase_realtime add table public.data_sources;
