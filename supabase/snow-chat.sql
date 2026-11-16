-- 눈송이 공개 실시간 채팅 / Supabase SQL Editor에서 1회 실행
-- GitHub 로그인 불필요. 모든 채팅은 공개됩니다.
create table if not exists public.snow_chat_messages (
  id bigint generated always as identity primary key,
  nickname text not null check (char_length(btrim(nickname)) between 1 and 20),
  content text not null check (char_length(btrim(content)) between 1 and 300),
  created_at timestamptz not null default now()
);
alter table public.snow_chat_messages enable row level security;

revoke all on table public.snow_chat_messages from anon, authenticated;
grant select, insert (nickname, content) on table public.snow_chat_messages to anon, authenticated;

drop policy if exists "snow_chat_read" on public.snow_chat_messages;
create policy "snow_chat_read" on public.snow_chat_messages
for select to anon, authenticated using (true);

drop policy if exists "snow_chat_insert" on public.snow_chat_messages;
create policy "snow_chat_insert" on public.snow_chat_messages
for insert to anon, authenticated
with check (
  char_length(btrim(nickname)) between 1 and 20
  and char_length(btrim(content)) between 1 and 300
);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'snow_chat_messages'
  ) then
    alter publication supabase_realtime add table public.snow_chat_messages;
  end if;
end $$;
-- 참고: 로그인 없는 공개 쓰기는 스팸/사칭 위험이 있습니다.
-- 운영 시 인증, 서버측 속도 제한, 신고/차단 기능 추가를 권장합니다.
