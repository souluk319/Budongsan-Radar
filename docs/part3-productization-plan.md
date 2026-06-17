# 집집 Part3 - 제품화 고도화 계획

작성일: 2026-06-14

## 한 줄 결론

Part3의 목표는 집집을 `뉴스 큐레이션 + 근거 붙은 데모`에서 `매일 다시 들어올 이유가 있는 부동산 의사결정 브리핑 제품`으로 올리는 것이다.

핵심은 기능을 더 많이 붙이는 것이 아니다.

```text
오늘 결론
-> 내 상황 영향
-> 공식 근거
-> 지역/단지/전세 도구
-> 다음에 다시 볼 이유
```

이 흐름이 앱 전체에서 끊기지 않게 만드는 단계다.

## 현재 상황 모니터링

### 로컬 상태

- 로컬 URL: `http://127.0.0.1:3050/`
- 홈 UI는 2026-06-14에 브리핑형으로 리셋했다.
- 기존 `오늘의 시장지도`/추상 지도/겹친 카드/막대 대시보드 구조를 제거했다.
- 새 홈 상단은 `오늘의 판세 -> 내 상황별 영향 -> 오늘의 집픽 -> 지역 온도` 구조다.
- 검증:
  - `npm run lint` 통과
  - `npm run build` 통과
  - `npm run verify:mvp` 통과
- 스크린샷:
  - `/tmp/jipjip-fixed-mobile.png`
  - `/tmp/jipjip-fixed-desktop.png`

### 프로덕션 상태

- Production URL: `https://zipradar.vercel.app`
- `/`, `/admin`, `/tools/jeonse-check` HTTP 200 확인.
- 현재 production 홈은 아직 이전 `오늘의 시장지도` UI다.
- production 첫 화면에는 `실제 수집 8건`, `공식 근거 32개`, 실제 뉴스 제목이 노출된다.
- 즉, production 데이터는 살아 있지만 최신 로컬 UI 리셋은 아직 배포되지 않았다.

### 데이터 상태

Part2 기준으로 실제 데이터 전환은 진행됐다.

- 네이버 뉴스 검색 API 기반 실제 부동산 뉴스 후보 수집
- published 실제 링크 8개 확인
- data observations 10개 이상 확인
- 샘플 daily pick 해제
- 홈 첫 화면에 실제 뉴스 제목과 근거 수 노출

남은 문제:

- 일부 샘플 링크는 아직 전체 피드에 섞여 있다.
- OpenAI live 요약은 기본 비활성화다. `LIVE_USE_OPENAI=1`일 때만 시도한다.
- 법제처 API는 필수 파라미터 문제로 정상 근거 수집 전이다.
- REB/R-ONE은 키와 문서 접근은 확인됐지만 실제 endpoint 매핑이 남아 있다.
- 지역/단지/전세 체크 페이지는 상품 골격은 있으나 아직 실사용 도구 수준은 아니다.

## Part1/Part2에서 얻은 것

### Part1

- 집집 브랜드 결정
- 링크 큐레이션과 오늘의 집픽 구조
- Next.js + Supabase-ready MVP
- 홈/상세/브리핑/제보/admin 기본 화면

### Part2

- `EvidenceObservation` 기반 근거 레이어
- `regions`, `complexes`, `buildings`, `units` 풀 모델 골격
- 링크와 관측값 연결
- 지역/단지/전세 체크 공개 화면
- 실제 네이버 뉴스 수집
- 공식 근거 수 표시

Part2의 가장 큰 성과는 `뉴스 요약 앱`에서 `근거가 붙은 부동산 판단 보조 제품`으로 넘어갈 수 있는 골격을 만든 것이다.

## 핵심 진단

### 1. 집집은 뉴스앱이면 약하다

뉴스 제목을 모으는 앱은 차별화가 약하다.

집집의 강점은 다음 문장이어야 한다.

```text
뉴스를 읽어주는 게 아니라,
오늘 내 집 판단에서 무엇을 확인해야 하는지 알려준다.
```

### 2. 시각화는 필요하지만 장식이면 망한다

`visualization-data-api-plan.md`는 맞는 문제의식을 갖고 있다.

다만 최근 UI 실패에서 확인했듯이, 실제 판단 기능이 없는 지도 흉내/막대/겹친 카드는 오히려 제품을 허접하게 만든다.

Part3 원칙:

- 시각화는 실제 데이터와 판단 질문이 있을 때만 크게 쓴다.
- 홈 첫 화면은 브리핑으로 읽혀야 한다.
- 지도/차트는 `내 동네`, `전세 안전`, `단지 비교`처럼 사용자가 바로 써먹는 도구에서 주인공이 된다.

### 3. 현재 가장 큰 제품 공백은 재방문 루틴이다

사용자가 한 번 보고 끝나면 집집은 뉴스 모음에 머문다.

Part3는 아래 반복 루틴을 만들어야 한다.

- 매일 오전 브리프
- 어제 대비 변화
- 내 상황별 체크
- 관심 지역/단지 follow
- 저장한 이슈 후속 변화

### 4. 신뢰는 근거 수가 아니라 근거 체인에서 나온다

`공식 근거 3개`는 좋은 시작이지만, 사용자는 결국 물어본다.

- 어떤 근거인가?
- 언제 기준인가?
- 이 뉴스와 왜 연결되는가?
- 확실한 것과 불확실한 것은 무엇인가?

Part3는 `근거 개수`를 넘어 `근거 체인`을 보여줘야 한다.

## Part3 제품 원칙

1. 홈은 브리핑이다.
2. 상세는 근거 있는 판단 노트다.
3. 지역/단지 페이지는 오래 남는 데이터 페이지다.
4. 전세 체크는 재방문 도구다.
5. Admin은 콘텐츠 운영실이다.
6. AI는 요약기가 아니라 근거 정리자다.
7. 시각화는 장식이 아니라 판단 도구다.
8. 투자 조언처럼 보이는 확정 표현은 금지한다.
9. 개인정보 수집은 최대한 늦춘다.
10. 매물/중개/계약으로 서두르지 않는다.

## Part3 핵심 축

### A. 홈: Daily Decision Brief

홈은 브랜드 소개가 아니라 오늘의 판단 시작점이다.

필수 구조:

```text
오늘 기억할 한 줄
내 상황별 영향
오늘의 집픽
지역 온도
오늘 볼 이슈
```

Part3 작업:

- 로컬 브리핑형 홈을 production에 반영
- `오늘 기억할 한 줄`을 매일 갱신 가능한 데이터 구조로 분리
- 첫 viewport에서 샘플/개발/내부 용어 제거 유지
- `오늘의 집픽`은 항상 실제 published + non-sample 우선
- 전체 이슈 피드에 샘플이 섞이면 `샘플` 표기를 작게 유지하되 첫 화면 주인공으로 두지 않기

성공 기준:

- 390px 모바일 첫 화면에서 오늘 결론, 상황별 영향, 오늘의 집픽이 보인다.
- 5초 안에 "오늘 내 상황에서 뭘 봐야 하는지"가 잡힌다.
- 프로덕션과 로컬 UI 방향이 다르지 않다.

### B. Evidence Chain

Part2의 `EvidenceObservation`을 사용자에게 이해되는 근거 체인으로 만든다.

필수 구조:

```text
뉴스/이슈
-> 연결된 관측값
-> 확인된 것
-> 아직 모르는 것
-> 사용자별 체크포인트
```

Part3 작업:

- observation마다 `confidence`, `basisDate`, `sourceType`, `sourceName`, `sourceUrl`, `freshness` 개념을 명확히 한다.
- 상세 페이지의 근거 섹션을 `근거 카드 나열`이 아니라 `왜 이 근거가 연결됐는지` 중심으로 바꾼다.
- AI 요약은 `source_observation_ids`를 반드시 참조하게 한다.
- 근거 없는 AI 문장은 `추정` 또는 `해석`으로 분리한다.

성공 기준:

- 사용자가 상세 페이지에서 "이 판단이 어디서 왔는지" 추적할 수 있다.
- 근거가 부족한 이슈는 부족하다고 보인다.

### C. Data Adapter Productionization

Part2 adapter는 가능성 확인 단계였다.

Part3에서는 신뢰 가능한 운영 단위로 만든다.

우선순위:

1. REB/R-ONE 지역 통계 adapter
2. 법제처 정책/법령 adapter
3. 국토부 실거래/전월세 adapter 확장
4. 청약Home 분양/경쟁률 adapter
5. 건축물대장/공동주택/관리비 adapter 준비

필수 운영 구조:

- `adapter_runs`
- `ingestion_runs`
- `source_health_checks`
- 실패 사유 저장
- 마지막 성공 시각
- 마지막 실패 시각
- raw payload 저장 금지 또는 제한 저장
- 키/비밀값 로그 금지

성공 기준:

- admin에서 각 adapter의 성공/실패/마지막 실행 시각을 볼 수 있다.
- 실패한 API가 조용히 무시되지 않는다.
- 수집 결과가 `EvidenceObservation`으로 표준화된다.

### D. User Situation Layer

집집의 차별점은 사용자 상황별 해석이다.

현재는 무주택자/1주택자/전세 세입자/투자자 영향이 카드로 보인다.

Part3에서는 이걸 사용자의 기본 필터로 승격한다.

단, 개인정보를 깊게 받지는 않는다.

초기 설정:

- 관심 상황: 무주택자 / 1주택자 / 전세 세입자 / 투자자
- 관심 지역: 전국 / 서울 / 경기·인천 / 지방 광역시 / 지방 중소도시
- 관심 카테고리: 정책 / 대출·금리 / 청약 / 전세·월세 / 매매시장

가능한 저장 방식:

- 로그인 전: localStorage
- 로그인 후: `profiles` 또는 `user_preferences`

성공 기준:

- 홈 첫 화면의 상황별 영향이 사용자의 기본 상황을 우선 보여준다.
- 저장한 관심 지역/상황으로 브리프가 정렬된다.

### E. Region And Complex Pages

지역/단지 페이지는 SEO와 재방문 루틴의 핵심이다.

Part3 목표:

- 지역 페이지를 뉴스 목록이 아니라 지역 브리프로 만든다.
- 단지 페이지를 실거래/전세/관리비/연식/세대수 비교 감각으로 만든다.

지역 페이지 필수 섹션:

```text
지역 오늘 한 줄
최근 이슈
거래/전세/청약/정책 신호
연결된 단지
관련 근거
```

단지 페이지 필수 섹션:

```text
단지 오늘 한 줄
최근 실거래/전세 흐름
관리비/연식/세대수 기본 정보
주변 지역 이슈
확인해야 할 리스크
```

성공 기준:

- `/regions/[id]`와 `/complexes/[id]`가 샘플 페이지가 아니라 실제 데이터 페이지처럼 보인다.
- 홈 이슈에서 자연스럽게 지역/단지 페이지로 이동할 이유가 있다.

### F. Jeonse Safety Tool

전세 안전 체크는 집집의 첫 도구형 제품이 될 수 있다.

Part3 목표:

- 단순 설명 페이지에서 입력형 체크 도구로 전환한다.
- 처음부터 개인정보를 깊게 받지 않는다.
- 주소/단지명/보증금/월세/계약 유형 정도의 최소 입력으로 시작한다.

MVP 입력:

- 지역 또는 단지명
- 보증금
- 월세
- 계약 유형
- 입주 예정 시점

출력:

- 전세가율 참고
- 최근 전월세/매매 표본
- 보증금 안전 체크포인트
- 확인해야 할 서류
- 불확실성

금지:

- 안전 보장
- 보증보험 가입 가능 확정
- 법률 자문처럼 보이는 문구

성공 기준:

- 사용자가 결과를 보고 "내가 중개사/집주인에게 무엇을 물어봐야 하는지" 알 수 있다.

### G. Admin As Editorial Ops

Admin은 단순 관리자 페이지가 아니라 집집 편집실이어야 한다.

필수 흐름:

```text
후보 수집
-> 중복/품질 확인
-> 근거 수집
-> AI 요약
-> 편집자 검수
-> 발행
-> 홈 반영
```

Part3 작업:

- 링크 상태를 `candidate`, `needs_evidence`, `needs_summary`, `needs_review`, `published`, `rejected`로 명확히 한다.
- admin 목록에서 병목이 어디인지 보이게 한다.
- 자동 발행보다 편집자 승인 우선.
- 발행 후 홈에 반영됐는지 확인 가능하게 한다.

성공 기준:

- 운영자가 오늘 몇 건을 수집했고, 몇 건이 발행 가능하며, 무엇이 막혔는지 1분 안에 본다.

## 필요한 데이터/DB 확장 후보

Part3에서 바로 전부 만들 필요는 없다.

하지만 다음 확장을 염두에 둔다.

```text
briefing_runs
adapter_runs
source_health_checks
user_preferences
watchlists
region_aliases
place_aliases
observation_confidence
observation_freshness
editorial_tasks
```

우선순위는 아래다.

1. `adapter_runs`, `source_health_checks`
2. `briefing_runs`
3. `user_preferences`
4. `watchlists`
5. alias/정규화 테이블

## AI 사용 원칙

AI는 기사 요약기가 아니다.

AI는 아래를 구조화해야 한다.

```text
이 이슈의 핵심
근거 관측값
확인된 것
불확실한 것
사용자별 영향
체크포인트
금지 표현 검수
```

AI 출력은 반드시 JSON schema로 받는다.

필수 필드:

- `summaryBullets`
- `whyItMatters`
- `confirmedFacts`
- `uncertainties`
- `audienceImpact`
- `checkpoints`
- `sourceObservationIds`
- `riskFlags`
- `forbiddenCopyWarnings`

성공 기준:

- AI가 근거 없는 확정 표현을 만들면 admin에서 경고로 보인다.
- `sourceObservationIds`가 비어 있으면 `근거 부족` 상태가 된다.

## 디자인/UX 방향

### 유지할 것

- 친근한 `집집` 브랜드
- 매일 보는 브리핑 느낌
- 모바일 우선
- 첫 화면 안에 오늘 결론/상황별 영향/집픽 노출
- 신뢰 근거를 작게 but 확실하게 보여주기

### 버릴 것

- 추상 지도 흉내
- 금융 터미널 감성
- 무거운 카드밭
- 큰 숫자 장식
- 반복되는 테두리 박스
- 샘플/개발/내부 용어
- 매물 플랫폼처럼 보이는 UI

### 시각화 사용 기준

시각화는 아래 질문에 답할 때만 크게 쓴다.

- 내 동네가 지금 뜨거운가?
- 내 보증금이 위험 구간에 가까운가?
- 이 단지가 비싼 이유가 뭔가?
- 청약 쏠림이 어느 지역에 생겼나?

답하지 못하는 시각화는 장식이므로 제거한다.

## Part3 실행 순서

### Phase 0. Stabilize Current Product

목표: 현재 망가진 UI/검증/배포 차이를 정리한다.

작업:

1. 로컬 브리핑형 홈을 production에 배포
2. production smoke 확인
3. `verify:mvp`가 새 UI 방향을 계속 보장하도록 유지
4. 기존 `시장지도` 대시보드 방향으로 회귀하지 않도록 문서화
5. 첫 화면 샘플 노출, 개발 문구, 내부 용어 재점검

완료 기준:

- production 홈이 로컬 리셋 UI와 일치한다.
- 390px production no-overflow 확인.
- 첫 화면에 `오늘의 판세`, `내 상황별 영향`, `오늘의 집픽`이 보인다.

### Phase 1. Evidence Reliability

목표: 근거 수가 장식이 아니라 신뢰 체인이 되게 한다.

작업:

1. `adapter_runs`와 `source_health_checks` 설계
2. REB/R-ONE endpoint 매핑
3. 법제처 API 정상 파라미터 확정
4. observation freshness/confidence 표시
5. 상세 페이지 근거 섹션 재구성

완료 기준:

- admin에서 데이터 source별 상태를 볼 수 있다.
- 상세에서 근거의 기준일/출처/확실성/불확실성이 보인다.

### Phase 2. Daily Briefing Routine

목표: 매일 다시 들어올 이유를 만든다.

작업:

1. `briefing_runs` 모델 설계
2. 매일 브리프 생성 시각 저장
3. 어제 대비 변화 문장 생성
4. 오늘의 집픽 선정 기준 고정
5. 관심 상황/지역을 홈 정렬에 반영

완료 기준:

- 사용자가 오늘 브리프와 어제 대비 변화를 구분할 수 있다.
- 오늘의 집픽 선정 이유가 보인다.

### Phase 3. Region/Complex/Jeonse Tools

목표: 뉴스 브리핑에서 오래 남는 부동산 도구로 확장한다.

작업:

1. 지역 페이지 DB 조회 기반 전환
2. 단지 페이지 DB 조회 기반 전환
3. 전세 안전 체크 입력형 MVP
4. 실거래/전월세 표본 연결
5. 지역/단지 watchlist 초안

완료 기준:

- 지역/단지 페이지가 실제 데이터 중심으로 보인다.
- 전세 체크 결과가 "무엇을 확인해야 하는지"로 이어진다.

### Phase 4. Personalization Without Privacy Debt

목표: 개인정보 부담 없이 개인화 시작.

작업:

1. localStorage 기반 관심 상황/지역 저장
2. 로그인 사용자는 DB 저장
3. 홈 우선순위에 반영
4. 저장한 이슈 후속 업데이트 UI
5. 알림/이메일은 아직 보류

완료 기준:

- 사용자가 자기 상황 기준으로 홈을 본다고 느낀다.
- 민감한 개인정보를 요구하지 않는다.

## Codex Loop Prompt For Part3

다음 구현 루프에 사용할 압축 프롬프트:

```text
Read all docs, especially docs/part2-evidence-briefing-plan.md and docs/part3-productization-plan.md.

Do not build a new landing page.
Do not return to the old market-map/dashboard hero.

Goal:
Stabilize 집집 as a daily real-estate decision briefing product.

First loop scope:
1. Deploy-ready home consistency: keep the briefing-style home, not the abstract market map.
2. Update tests so the new product direction is protected.
3. Add admin/source health or adapter run scaffolding only if it is small and directly supports evidence reliability.
4. Do not add listings, brokerage, payments, comments, or heavy community features.

Quality bar:
- 390px mobile first.
- First viewport must show today verdict, audience impact, and today's pick.
- Public copy must not include MVP, DB, Supabase, Radar, sample-first language, or investment advice.
- Evidence copy must distinguish confirmed facts, interpretation, and uncertainty.

Verify:
- npm run lint
- npm run build
- npm run verify:mvp
- 390px screenshot review
```

## Part3 금지 방향

- 매물 등록
- 지도 기반 매물 탐색
- 직거래/전자계약/결제
- 실명 인증
- 댓글/커뮤니티 확장부터 하기
- 소셜 피드화
- 공식 근거 없는 AI 예측
- 샘플 데이터로 실서비스처럼 포장
- UI를 다시 추상 대시보드로 되돌리기

## Part3 완료 기준

Part3는 아래가 충족되면 성공이다.

1. Production 홈이 브리핑형으로 안정화된다.
2. 실제 데이터 기반 daily briefing이 매일 갱신 가능한 구조를 갖는다.
3. 근거 체인이 상세 페이지와 admin에서 추적 가능하다.
4. REB/법제처/실거래/전월세 중 최소 2개 adapter가 정상 운영 상태로 올라간다.
5. 전세 안전 체크가 입력형 도구로 바뀐다.
6. 지역 페이지 또는 단지 페이지 중 하나가 실제 데이터 페이지처럼 작동한다.
7. 사용자가 "내일 다시 볼 이유"를 화면에서 발견한다.

## 지금 바로 다음 액션

추천 순서:

1. 로컬 브리핑형 홈을 production 배포한다.
2. production 390px 스크린샷을 다시 확인한다.
3. REB/R-ONE endpoint 매핑을 확정한다.
4. 법제처 API 파라미터를 수정해 정책 근거 수집을 정상화한다.
5. `adapter_runs`/`source_health_checks`부터 최소 migration으로 추가한다.
6. 전세 안전 체크 입력형 MVP를 설계한다.

