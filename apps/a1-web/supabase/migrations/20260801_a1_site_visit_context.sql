-- Add visitor-relevant Netlify context and browser-reported device metadata to
-- first-party visit sessions. Existing records remain valid with an empty
-- context object.

alter table public.a1_site_visit_audit
  add column if not exists visitor_context jsonb not null default '{}'::jsonb
  check (jsonb_typeof(visitor_context) = 'object');

drop function if exists public.a1_record_site_visit(uuid, inet, text, text, uuid, text, boolean);

create or replace function public.a1_record_site_visit(
  p_session_id uuid,
  p_ip_address inet,
  p_page text default null,
  p_path text default null,
  p_user_id uuid default null,
  p_user_email text default null,
  p_end boolean default false,
  p_visitor_context jsonb default '{}'::jsonb
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
  safe_visitor_context jsonb := case
    when jsonb_typeof(coalesce(p_visitor_context, '{}'::jsonb)) = 'object'
      then coalesce(p_visitor_context, '{}'::jsonb)
    else '{}'::jsonb
  end;
begin
  insert into public.a1_site_visit_audit as visit (
    session_id,
    user_id,
    user_email,
    ip_addresses,
    pages,
    visitor_context,
    ended_at
  )
  values (
    p_session_id,
    p_user_id,
    p_user_email,
    array[p_ip_address],
    case when page_entry is null then '[]'::jsonb else jsonb_build_array(page_entry) end,
    safe_visitor_context,
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
    visitor_context = visit.visitor_context || safe_visitor_context,
    last_seen_at = now(),
    ended_at = case when p_end then now() else null end;
end;
$$;

revoke all on function public.a1_record_site_visit(uuid, inet, text, text, uuid, text, boolean, jsonb) from public;
grant execute on function public.a1_record_site_visit(uuid, inet, text, text, uuid, text, boolean, jsonb) to service_role;

comment on column public.a1_site_visit_audit.visitor_context is
  'Whitelisted Netlify geolocation/request metadata and browser-reported user-agent/client-hint context.';

comment on table public.a1_site_visit_audit is
  'Server-only first-party A1 visit sessions with IP addresses, routes, approximate duration and visitor context.';
