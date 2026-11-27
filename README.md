# 몰리당의 공부방

눈송이 길드를 위한 마비노기 모바일 성장 가이드, 직업별 세팅 연구소 및 마도 저항 계산기. 카카오톡 오픈채팅과 기존 Supabase 눈송이 채팅을 지원합니다.

마비노기 모바일 전투력/마도 저항·잔영/해연 감정 단계별 장비 세팅 계산기.

- iOS, Android, PC 브라우저에서 작동
- 입력값은 각 브라우저의 로컬 저장소에 자동 저장
- JSON 백업 및 복원
- 최초 온라인 접속 후 Service Worker 캐시로 오프라인 재사용 지원 (브라우저 캐시 보존 시)

## 배포

GitHub 저장소의 Settings → Pages에서 **Deploy from a branch**, **main**, **/(root)** 를 선택하고 저장합니다.

접속 주소: https://pneco.github.io/mado-calculator/

## 참고

지옥 단계 입장 요구치, 마도 압력, 잔영·해연 수치는 참고용 데이터입니다. 공식 최신 수치와 반드시 대조하세요. 마도 피해 증폭은 비공식 근사식입니다. 장비 변경에 따른 전투력 증감은 계산하지 않습니다.


## 룬 도감 데이터 관리

직업별 세팅 연구소: `builds.html`

룬 데이터: `runes.json` (JSON 파일만 수정하면 웹사이트에서 새 데이터를 불러옵니다.)

현재는 일부 공개 커뮤니티 자료를 기반으로 정리한 **초기 참고 데이터**입니다. 모든 룬을 포함하거나 수치가 독립적으로 검증된 완성형 DB는 아닙니다. `reviewStatus` 값이 `needs_in_game_verification`이면 실제 게임에서 옵션을 대조해야 합니다. `missing_effect_data`이면 효과 정보가 아직 없습니다.

```json
{
  "id": "example-unique-id",
  "name": "룬 이름",
  "slot": "weapon",
  "rarity": "전설",
  "stars": 6,
  "effects": [
    {"stat": "attack_pct", "value": 5, "mode": "always"}
  ],
  "enhancementBonuses": [
    {"level": 10, "stat": "attack_pct", "value": 3}
  ],
  "source": "https://원문-자료-주소",
  "verified": true,
  "reviewStatus": "needs_in_game_verification"
}
```

- `slot`: `weapon`, `armor`, `emblem`, `accessory`
- `stars`: 룬 ★등급. 동일 룬의 ★등급별 효과가 다르면 각 등급을 별도 레코드로 추가합니다.
- `effects`: `mode: "always"`이면 상시 옵션 합산에 사용합니다. `conditional`, `stack`, `per_transcend_level` 등은 별도 안내만 하고 상시 합계에 넣지 않습니다.
- `enhancementBonuses`: 조건에 맞는 강화 단계부터 추가 계산되는 효과입니다.
- `verified`: 계산에 포함할 효과값이 입력되어 있는지 뜻하는 현재 임시 플래그입니다. **실제 공식 검증 완료를 보장하지 않습니다.** 숫자를 확인하지 못한 룬에는 `false`를 유지하세요.
- 수치 검증이 끝난 룬은 `reviewStatus`에 `verified_in_game` 등을 기입해 출처와 함께 관리할 수 있습니다.

### 유의사항

공격력 증가율, 피해량 증가율, 스킬 피해량 증가율은 서로 다른 지표입니다. 계산기가 상시 값의 일부를 별도 합계로 보여주더라도 게임 내 실제 피해량이나 DPS를 보장하지 않습니다. 룬의 발동 조건, 중첩, 강화/초월 효과를 게임 내 정보와 반드시 대조하세요.

GitHub Pages의 브라우저 캐시가 남았다면 새로고침하거나 버전 쿼리가 붙은 링크로 재접속하세요.
