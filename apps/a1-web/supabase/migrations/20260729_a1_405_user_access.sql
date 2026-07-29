-- A1-405: role-based access control.
--
-- Assign hosted roles in auth.users.raw_app_meta_data as one of:
-- user (default), editor, admin. Never authorize from user_metadata because
-- account holders can edit it themselves.

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

drop policy if exists "workspace_labels: write" on public.workspace_labels;
create policy "workspace_labels: write"
  on public.workspace_labels
  for all
  to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

drop policy if exists "backlog_items: read" on public.backlog_items;
drop policy if exists "backlog_items: write" on public.backlog_items;
create policy "backlog_items: read"
  on public.backlog_items
  for select
  to authenticated
  using ((select public.a1_has_min_role('editor')));
create policy "backlog_items: write"
  on public.backlog_items
  for all
  to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

drop policy if exists "backlog_comments: read" on public.backlog_comments;
drop policy if exists "backlog_comments: write" on public.backlog_comments;
create policy "backlog_comments: read"
  on public.backlog_comments
  for select
  to authenticated
  using ((select public.a1_has_min_role('editor')));
create policy "backlog_comments: write"
  on public.backlog_comments
  for all
  to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

drop policy if exists "backlog_votes: read" on public.backlog_votes;
drop policy if exists "backlog_votes: write" on public.backlog_votes;
create policy "backlog_votes: read"
  on public.backlog_votes
  for select
  to authenticated
  using ((select public.a1_has_min_role('editor')));
create policy "backlog_votes: write"
  on public.backlog_votes
  for all
  to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

drop policy if exists "backlog_notifications: read" on public.backlog_notifications;
drop policy if exists "backlog_notifications: write" on public.backlog_notifications;
create policy "backlog_notifications: read"
  on public.backlog_notifications
  for select
  to authenticated
  using ((select public.a1_has_min_role('editor')));
create policy "backlog_notifications: write"
  on public.backlog_notifications
  for all
  to authenticated
  using ((select public.a1_has_min_role('editor')))
  with check ((select public.a1_has_min_role('editor')));

