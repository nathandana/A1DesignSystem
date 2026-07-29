-- A1-405 — detailed user profiles, complete account and login history, and deletion audit.

alter table public.a1_user_admin_audit
  drop constraint if exists a1_user_admin_audit_action_check;

alter table public.a1_user_admin_audit
  drop constraint if exists a1_user_admin_audit_new_role_check;

alter table public.a1_user_admin_audit
  alter column new_role drop not null;

alter table public.a1_user_admin_audit
  add constraint a1_user_admin_audit_action_check
  check (action in ('user_invited', 'role_changed', 'user_deleted'));

alter table public.a1_user_admin_audit
  add constraint a1_user_admin_audit_new_role_check
  check (
    (action = 'user_deleted' and new_role is null)
    or
    (action <> 'user_deleted' and new_role in ('user', 'editor', 'admin'))
  );

create index if not exists a1_user_admin_audit_target_idx
  on public.a1_user_admin_audit (target_user_id, created_at desc);

create index if not exists a1_user_admin_audit_email_idx
  on public.a1_user_admin_audit (target_email, created_at desc);

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
