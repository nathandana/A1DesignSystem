-- Add the Paused workflow status to existing backlog workspaces.

alter table public.backlog_items drop constraint if exists backlog_items_status_check;

alter table public.backlog_items add constraint backlog_items_status_check
  check (status in ('new','triaged','accepted','in_progress','paused','done','released','wont_fix','duplicate','cancelled'));
