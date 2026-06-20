-- A1 Web — Supabase schema (SHARED workspace)
-- Run in the Supabase dashboard: SQL Editor → New Query → paste & run. Idempotent.
--
-- Scope: everything is SHARED across all signed-in users — one workspace that any
-- authenticated user can read AND write. (Earlier this was per-user; this schema
-- migrates that data into the shared row.) RLS still requires a signed-in user;
-- it just no longer scopes rows to an owner.

-- ─── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
