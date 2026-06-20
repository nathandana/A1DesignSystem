-- A1 Web — Supabase schema
-- Run in the Supabase dashboard: SQL Editor → New Query → paste & run.
--
-- Cloud-synced Editor projects. One row per user holds the full project bundle
-- (the app's exportAllText() blob: every project + its pages + layout), so the
-- existing local-storage store stays the source of truth and we sync the blob.
-- RLS scopes every row to its owner.

create table if not exists public.user_projects (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  data       text        not null default '',
  updated_at timestamptz not null default now()
);

alter table public.user_projects enable row level security;

drop policy if exists "user_projects: read own"   on public.user_projects;
drop policy if exists "user_projects: insert own" on public.user_projects;
drop policy if exists "user_projects: update own" on public.user_projects;
drop policy if exists "user_projects: delete own" on public.user_projects;

create policy "user_projects: read own"   on public.user_projects for select using (auth.uid() = user_id);
create policy "user_projects: insert own" on public.user_projects for insert with check (auth.uid() = user_id);
create policy "user_projects: update own" on public.user_projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_projects: delete own" on public.user_projects for delete using (auth.uid() = user_id);

-- ─── updated_at trigger ──────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_projects_updated_at on public.user_projects;
create trigger user_projects_updated_at
  before update on public.user_projects
  for each row execute function public.set_updated_at();

-- ─── delete_user ─────────────────────────────────────────────────────────────
-- Called from the client via supabase.rpc('delete_user'). SECURITY DEFINER lets
-- it delete from auth.users; the on-delete cascade clears user_projects.

create or replace function public.delete_user()
returns void
language sql
security definer
set search_path = public
as $$
  delete from auth.users where id = auth.uid();
$$;

-- ─── Image library ───────────────────────────────────────────────────────────
-- Image bytes live in a Storage bucket ('images', one folder per user:
-- <user_id>/<image_id>); this table holds the per-image metadata the library
-- reads (name, dimensions, crop, category tags, project restriction). RLS scopes
-- both the rows and the storage objects to their owner. The bucket is public-read
-- (the paths are unguessable UUIDs) so a Figure's <img src> resolves to a plain
-- CDN URL synchronously — writes are still owner-only.

create table if not exists public.user_images (
  user_id     uuid     not null references auth.users(id) on delete cascade,
  id          text     not null,
  name        text     not null default 'Image',
  type        text     not null default 'image/png',
  size        integer  not null default 0,
  width       integer  not null default 0,
  height      integer  not null default 0,
  created_at  bigint   not null default 0,
  updated_at  bigint   not null default 0,
  crop        jsonb,
  project_ids text[]   not null default '{}',
  categories  text[]   not null default '{}',
  primary key (user_id, id)
);

alter table public.user_images enable row level security;

drop policy if exists "user_images: read own"   on public.user_images;
drop policy if exists "user_images: insert own" on public.user_images;
drop policy if exists "user_images: update own" on public.user_images;
drop policy if exists "user_images: delete own" on public.user_images;

create policy "user_images: read own"   on public.user_images for select using (auth.uid() = user_id);
create policy "user_images: insert own" on public.user_images for insert with check (auth.uid() = user_id);
create policy "user_images: update own" on public.user_images for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_images: delete own" on public.user_images for delete using (auth.uid() = user_id);

-- Storage bucket for the bytes. public-read; writes restricted to the owner's
-- own top-level folder (<user_id>/...).
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

drop policy if exists "images: public read"  on storage.objects;
drop policy if exists "images: insert own"   on storage.objects;
drop policy if exists "images: update own"   on storage.objects;
drop policy if exists "images: delete own"   on storage.objects;

create policy "images: public read" on storage.objects for select
  using (bucket_id = 'images');
create policy "images: insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "images: update own" on storage.objects for update to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "images: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);
