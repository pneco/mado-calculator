# 방문 IP 로그 운영 절차

기존 채팅과 무관한 별도 기능. DB 마이그레이션과 권한 검사 후 브라우저 수집을 활성화했다. 실제 외부 접속의 IP 헤더 전달 여부는 추가 확인이 필요하다.

1. 기존 Supabase 프로젝트의 SQL Editor에서 supabase/snow-visit.sql 실행.
2. Cron 작업이 활성화되었는지 확인. 30일 경과 기록 삭제.
3. 실제 GitHub Pages 브라우저 요청에서 cf-connecting-ip가 신뢰 가능한 게이트웨이 헤더로 전달되고 변조 요청이 거부되는지 검증. 확인 불가 시 수집을 켜지 않는다.
4. anon/authenticated 역할로 snow_private 스키마 및 테이블 조회/쓰기 권한이 없는지 검증. RPC는 void 응답만 반환한다.
5. 홈페이지 및 가이드에 방문 IP 수집 목적, 보관 기간, 운영자 문의 방법을 안내한 뒤 snow-visit.js ENABLED=true로 변경하고 서비스워커 캐시를 갱신한다.
6. 관리자 SQL Editor에서만 아래 조회를 실행한다.

```sql
select ip_address, visited_at at time zone 'Asia/Seoul' as visited_at_kst
from snow_private.visit_ips
order by visited_at desc;
```

같은 IP의 1분 이내 방문은 중복 제거한다. IP는 실제 사람의 신원을 보장하지 않는다. Origin 확인은 브라우저 출처 제한이며 인증이나 완전한 봇 방어가 아니다. 필요시 별도 서버측 호출량 제한을 적용한다. 공개 GitHub에 원본 로그나 관리자 키를 저장하지 않는다.
