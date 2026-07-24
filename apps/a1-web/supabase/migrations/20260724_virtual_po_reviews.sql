-- A1-341: persist virtual Product Owner review stamps in shared backlogs.
-- Safe to run against workspaces created before the reviews field was added.
alter table public.backlog_items
  add column if not exists reviews jsonb not null default '{}'::jsonb;
