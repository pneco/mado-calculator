-- IP-only visit log; execute in Supabase SQL Editor as project administrator.
-- No direct client access to the private schema. Never publish raw records to GitHub.
begin;
create schema if not exists snow_private;
revoke all on schema snow_private from public, anon, authenticated;
create table if not exists snow_private.visit_ips (
  ip_address inet not null,
  visited_at timestamptz not null default now(),
  minute_bucket timestamptz not null,
  primary key (ip_address, minute_bucket)
);
alter table snow_private.visit_ips enable row level security;
revoke all on table snow_private.visit_ips from public, anon, authenticated;
create index if not exists visit_ips_visited_at_idx on snow_private.visit_ips (visited_at);
create or replace function public.snow_record_visit()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  headers jsonb;
  raw_ip text;
  parsed_ip inet;
  ts timestamptz := pg_catalog.now();
begin
  headers := coalesce(nullif(pg_catalog.current_setting('request.headers', true), ''), '{}')::jsonb;
  if headers->>'origin' is distinct from 'https://pneco.github.io' then return; end if;
  -- Do not accept an IP from the request body or fall back to an untrusted header.
  raw_ip := pg_catalog.btrim(headers->>'cf-connecting-ip');
  if raw_ip is null or raw_ip = '' or pg_catalog.length(raw_ip) > 45 or raw_ip ~ '[/,]' then return; end if;
  begin
    parsed_ip := raw_ip::inet;
  exception when invalid_text_representation then
    return;
  end;
  insert into snow_private.visit_ips(ip_address, visited_at, minute_bucket)
    values (parsed_ip, ts, pg_catalog.date_trunc('minute', ts))
    on conflict (ip_address, minute_bucket) do nothing;
end;
$$;
revoke all on function public.snow_record_visit() from public, anon, authenticated;
grant execute on function public.snow_record_visit() to anon, authenticated;
commit;

-- Schedule retention before activating the client (requires pg_cron).
-- In the dashboard enable the Cron integration if not already enabled.
create extension if not exists pg_cron;
select cron.schedule('snow-visit-ip-retention', '15 18 * * *',
  $$delete from snow_private.visit_ips where visited_at < now() - interval '30 days'$$);
