-- A1-405 — administrator user management audit trail.
--
-- Account listing, invitations and role changes run through the server-only
-- Netlify function. Browser clients receive no direct table privileges.

create table if not exists public.a1_user_admin_audit (
  id              uuid        primary key default gen_random_uuid(),
  actor_user_id   uuid        references auth.users(id) on delete set null,
  actor_email     text,
  target_user_id  uuid        references auth.users(id) on delete set null,
  target_email    text,
  action          text        not null
                                check (action in ('user_invited', 'role_changed')),
  previous_role   text
                                check (previous_role is null or previous_role in ('user', 'editor', 'admin')),
  new_role        text        not null
                                check (new_role in ('user', 'editor', 'admin')),
  created_at      timestamptz not null default now()
);

create index if not exists a1_user_admin_audit_created_idx
  on public.a1_user_admin_audit (created_at desc);

alter table public.a1_user_admin_audit enable row level security;
revoke all on table public.a1_user_admin_audit from anon, authenticated;
grant select, insert on table public.a1_user_admin_audit to service_role;

comment on table public.a1_user_admin_audit is
  'Server-only audit history for A1 account invitations and role changes.';
