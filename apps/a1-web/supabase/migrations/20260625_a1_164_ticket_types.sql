-- A1-164: replace the Chore ticket type with Epic.
--
-- Existing chores become Features because Chore represented ordinary maintenance
-- work, while Epic is reserved for large outcomes delivered through multiple slices.

begin;

update public.backlog_items
set type = 'feature'
where type = 'chore';

alter table public.backlog_items
  drop constraint if exists backlog_items_type_check;

alter table public.backlog_items
  add constraint backlog_items_type_check
  check (type in ('feature', 'bug', 'epic'));

commit;
