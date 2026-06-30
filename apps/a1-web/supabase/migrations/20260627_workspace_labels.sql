-- A1 Web — Workspace labels table
-- Run this in existing Supabase workspaces that already applied schema.sql.

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
create policy "workspace_labels: write" on public.workspace_labels for all    to authenticated using (true) with check (true);

drop trigger if exists workspace_labels_updated_at on public.workspace_labels;
create trigger workspace_labels_updated_at
  before update on public.workspace_labels
  for each row execute function public.set_updated_at();

-- Optional convenience: seed the new row from an older shared_state bundle that
-- still contains `labels`, without overwriting a row that already exists.
do $$
declare
  labels_data jsonb;
begin
  begin
    select data::jsonb -> 'labels'
      into labels_data
      from public.shared_state
      where id = 1 and data <> '' and left(ltrim(data), 1) = '{';
  exception when others then
    labels_data := null;
  end;

  if jsonb_typeof(labels_data) = 'object' then
    insert into public.workspace_labels (id, data)
    values (1, labels_data)
    on conflict (id) do nothing;
  end if;
end $$;

-- Optional: enable Supabase Realtime so label changes update live without the
-- polling fallback. Ignore "already member" errors.
-- alter publication supabase_realtime add table public.workspace_labels;
