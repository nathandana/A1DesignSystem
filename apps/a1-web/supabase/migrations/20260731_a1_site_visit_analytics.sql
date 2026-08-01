-- Basic first-party visit analytics for the administrator page.
--
-- The public browser can submit a generated visit ID and the current A1 route
-- only through the Netlify Function. Netlify supplies the IP address; browser
-- roles cannot read or write this table directly.

create table if not exists public.a1_site_visit_audit (
  session_id   uuid        primary key,
  user_id      uuid        references auth.users(id) on delete set null,
  user_email   text,
  ip_addresses inet[]      not null,
  pages        jsonb       not null default '[]'::jsonb
                            check (jsonb_typeof(pages) = 'array'),
  started_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  ended_at     timestamptz
);

create index if not exists a1_site_visit_audit_started_idx
  on public.a1_site_visit_audit (started_at desc);

create index if not exists a1_site_visit_audit_user_idx
  on public.a1_site_visit_audit (user_id, started_at desc);

alter table public.a1_site_visit_audit enable row level security;
revoke all on table public.a1_site_visit_audit from anon, authenticated;
grant select, insert, update on table public.a1_site_visit_audit to service_role;

create or replace function public.a1_record_site_visit(
  p_session_id uuid,
  p_ip_address inet,
  p_page text default null,
  p_path text default null,
  p_user_id uuid default null,
  p_user_email text default null,
  p_end boolean default false
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  page_entry jsonb := case
    when p_page is null then null
    else jsonb_build_object(
      'page', p_page,
      'path', p_path,
      'viewed_at', now()
    )
  end;
begin
  insert into public.a1_site_visit_audit as visit (
    session_id,
    user_id,
    user_email,
    ip_addresses,
    pages,
    ended_at
  )
  values (
    p_session_id,
    p_user_id,
    p_user_email,
    array[p_ip_address],
    case when page_entry is null then '[]'::jsonb else jsonb_build_array(page_entry) end,
    case when p_end then now() else null end
  )
  on conflict (session_id) do update
  set
    user_id = coalesce(excluded.user_id, visit.user_id),
    user_email = coalesce(excluded.user_email, visit.user_email),
    ip_addresses = case
      when p_ip_address = any(visit.ip_addresses)
        then visit.ip_addresses
      else array_append(visit.ip_addresses, p_ip_address)
    end,
    pages = case
      when page_entry is null then visit.pages
      else visit.pages || jsonb_build_array(page_entry)
    end,
    last_seen_at = now(),
    ended_at = case when p_end then now() else null end;
end;
$$;

revoke all on function public.a1_record_site_visit(uuid, inet, text, text, uuid, text, boolean) from public;
grant execute on function public.a1_record_site_visit(uuid, inet, text, text, uuid, text, boolean) to service_role;

comment on table public.a1_site_visit_audit is
  'Server-only first-party A1 visit sessions with IP addresses, routes and approximate duration.';
