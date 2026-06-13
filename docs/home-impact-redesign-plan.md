# 집집 Home Impact Redesign Plan

## One-line

집집 홈은 브랜드 소개 화면이 아니라, 사용자가 들어오자마자 "오늘 부동산판은 이렇구나"를 3초 안에 잡는 **판세 선언형 데일리 브리프**가 되어야 한다.

## Problem

현재 홈은 기능과 섹션은 맞지만, 첫 화면 임팩트가 약하다.

- `집집` 브랜드는 보이지만 오늘 무엇이 중요한지 바로 꽂히지 않는다.
- `오늘의 집픽`이 있어도 속보/시장 신호처럼 느껴지지 않는다.
- 숫자 `92`는 보이지만 왜 중요한 숫자인지 감정적으로 연결되지 않는다.
- 지역 흐름은 카드 목록처럼 보이고, 시장 온도판처럼 보이지 않는다.
- 사용자가 "내일도 다시 와야겠다"는 반복 이유가 약하다.

실패 기준:

- 첫 화면의 가장 큰 문장이 브랜드명이다.
- 뉴스 카드가 정리되어 있을 뿐, 결론이 먼저 보이지 않는다.
- 지역/상황/신호가 각각 따로 놀고 하나의 판세로 묶이지 않는다.

## Reference Rail

### GeekNews

가져올 것:

- 매일 들어와서 훑는 링크 피드 밀도
- 제목, 점수, 출처, 한 줄 맥락의 정보 위계

집집 적용:

- 하단 피드는 카드밭이 아니라 `Signal Tape`처럼 빠르게 훑게 만든다.
- 각 이슈는 뉴스가 아니라 "집어볼 신호"로 보이게 한다.

### Axios / Smart Brevity

가져올 것:

- 첫 줄 결론
- `왜 중요함` 중심 해석
- 짧게 읽어도 남는 문장 구조

집집 적용:

- 모든 주요 카드의 문법을 `무슨 일 -> 왜 중요 -> 내 상황 영향`으로 고정한다.
- 첫 화면에는 설명문보다 verdict 문장을 둔다.

### Bloomberg Markets

가져올 것:

- 큰 숫자와 상태의 정보 위계
- 시장 분위기를 먼저 보여주는 상단 구조

집집 적용:

- `오늘의 중요도`, `강한 신호 수`, `지역 온도`를 상단에서 바로 읽게 한다.
- 숫자 옆에는 반드시 의미 문장을 붙인다.

### XAI Land RADAR

가져올 것:

- 조기 신호/리스크 감지 관점
- 지역별 변화 감지

버릴 것:

- `RADAR`, `레이더`, 기관용 B2B 톤

집집 적용:

- `조기경보`가 아니라 `오늘의 판세`, `강한 신호`, `소음 가능성`으로 번역한다.

### Dia Morning Brief

가져올 것:

- 하루 시작점으로서의 Morning Brief 감각
- "오늘 무엇을 놓치면 안 되는가"를 먼저 보여주는 구조

집집 적용:

- 첫 화면의 주인공은 브랜드가 아니라 오늘 결론이다.
- 홈은 "앱 소개"가 아니라 "오늘 브리핑 도착" 느낌이어야 한다.

### Robinhood / Toss Securities

가져올 것:

- 큰 숫자, 강한 색, 즉시 읽히는 시장 상태
- 복잡한 금융 정보를 쉬운 상태 언어로 바꾸는 감각

집집 적용:

- `92`는 단독 숫자가 아니라 `강한 신호 92`로 붙인다.
- 색은 더 과감하게 쓰되, 무분별한 그라데이션은 피한다.

### Redfin Data Center / Zillow Heat Index / Realtor.com Hottest Markets

가져올 것:

- 부동산 시장을 `온도`, `수요`, `협상력`, `지역 랭킹`으로 읽게 하는 방식
- 데이터보다 사용자의 질문을 먼저 보여주는 구조

집집 적용:

- `지역 흐름`은 단순 리스트가 아니라 `지역 온도판`으로 바꾼다.
- `오늘 뜨는 지역`, `식는 지역`, `관망 지역`이 한눈에 보여야 한다.

## Product Promise

홈 첫 화면이 사용자에게 주어야 하는 감각:

```text
뉴스를 읽으러 온 게 아니라,
오늘 부동산판을 요약받으러 왔다.
```

반복 방문 이유:

- 매일 오늘 판세가 바뀐다.
- 내 상황별 영향이 바로 보인다.
- 지역 온도가 바뀌는지 확인하게 된다.
- 소음과 진짜 신호를 구분해준다.

## New First View Concept

### 화면 이름

`오늘의 판세`

### 첫 화면 핵심 문장

브랜드명보다 아래 문장이 더 커야 한다.

```text
오늘은 대출과 청약이 시장을 밀고 있습니다
```

보조 문장:

```text
매수심리 반등 신호 · 전세 세입자는 관망 · 서울/경기 쏠림
```

대체 문장 세트:

```text
전세 압력이 다시 커지고 있습니다
입주 물량과 월세 전환이 세입자 판단을 흔드는 중
```

```text
서울 청약 쏠림이 다시 강해졌습니다
핵심 입지는 뜨겁고 외곽은 관망이 늘어나는 흐름
```

```text
정책 기대감은 강하지만 아직 확인이 필요합니다
대출 완화 기대가 매수 심리를 자극하는 구간
```

## First View Layout

### Desktop

```text
┌───────────────────────────────────────────────────────────────┐
│ Header: 집집 / 브리프 / 제보 / 로그인                         │
├───────────────────────────────────────────────────────────────┤
│ 오늘의 판세                                                   │
│                                                               │
│ 오늘은 대출과 청약이 시장을 밀고 있습니다       [중요도 92]    │
│ 매수심리 반등 신호 · 전세 세입자는 관망         [강한 신호 3]  │
│                                                               │
│ [무주택자 확인] [1주택자 관망] [전세 세입자 주의] [투자자 주의] │
│                                                               │
│ ┌ 오늘의 집픽 ───────────────────────┐ ┌ 지역 온도판 ──────┐ │
│ │ 강한 신호                           │ │ 서울 HOT          │ │
│ │ 대출 규제 완화 기대감이...          │ │ 경기/인천 WATCH   │ │
│ │ 왜 중요함 / 내 상황 영향            │ │ 지방 COOL         │ │
│ └────────────────────────────────────┘ └───────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### Mobile 390px

```text
집집
[집집 브리프] [오늘의 브리핑] [이슈 제보] [로그인]

오늘의 판세 · 반등 신호

오늘은 대출과 청약이
시장을 밀고 있습니다

92 강한 신호
대출 규제 기대가 매수 심리를 자극 중

[무주택자 확인] [1주택자 관망]
[전세 세입자 주의] [투자자 주의]

오늘의 집픽
대출 규제 완화 기대감이 다시 커지는 구간
왜 중요함: 기대만으로 가격이 먼저 움직일 수 있음

지역 온도
서울 HOT | 경기/인천 WATCH | 지방 COOL
```

모바일 첫 화면 기준:

- `오늘의 집픽` 제목 일부까지 첫 viewport 안에 보여야 한다.
- `지역 온도`는 첫 viewport 아래쪽 또는 바로 다음 스크롤에 보여야 한다.
- 상황별 영향 4개는 큰 카드가 아니라 칩/세그먼트 형태로 압축한다.

## Visual Direction

### Mood

차분하지만 긴장감 있는 시장 브리프.

키워드:

- sharp
- daily
- signal
- heat
- personal impact
- editorial

### Palette

기본:

- Ink: `#0b1118`
- Paper: `#f6f3ea`
- Surface: `#fffdf7`
- Line: `#d8d0bd`

Signal:

- Strong: `#ef4444`
- Watch: `#f59e0b`
- Stable: `#10b981`
- Info: `#0ea5e9`

사용 규칙:

- 배경 전체를 회색/흰색 카드밭으로 만들지 않는다.
- 첫 화면은 dark ink + paper contrast를 강하게 쓴다.
- 신호색은 상태 라벨, 막대, 작은 강조에만 쓴다.
- 보라/파랑 SaaS 그라데이션 금지.

### Typography

- 가장 큰 글자: 오늘 판세 결론
- 두 번째: 오늘의 집픽 제목
- 숫자: monospace
- 보조 설명: 짧은 문장, 1~2줄 제한

금지:

- 브랜드명 `집집`을 hero-scale로 키우기
- 설명문을 3줄 이상 길게 두기
- 모든 카드 제목을 비슷한 크기로 만들기

## Component Plan

### 1. MarketVerdictHero

홈 첫 화면의 핵심 컴포넌트.

Props:

- `dateLabel`
- `moodLabel`
- `verdict`
- `subVerdict`
- `importanceScore`
- `strongSignalCount`
- `watchSignalCount`
- `keywords`

UI:

- 큰 verdict 문장
- 옆 또는 아래에 `92 강한 신호`
- 키워드 3개
- 간단한 "오늘 기억할 것" 문장

### 2. AudienceSituationTabs

기존 `AudienceImpactStrip`을 더 임팩트 있게 바꾼다.

Segments:

- 무주택자
- 1주택자
- 전세 세입자
- 투자자

UI:

- PC: 4개 세그먼트 버튼 + 선택된 설명 한 줄
- Mobile: 2열 칩 + 선택 설명

초기 선택:

- 가장 위험/확인 필요 상태인 segment

주의:

- 카드 4개를 크게 늘어놓지 않는다.
- 각 segment는 `상황 + 상태`를 한눈에 보여준다.

### 3. TodayPickSignal

기존 `MainSignalCard`를 강화한다.

UI:

- `오늘의 집픽` 라벨
- `강한 신호` 라벨
- 큰 제목
- verdict 한 줄
- `왜 중요함` 1~2줄
- `내 상황 영향` 1줄
- CTA

주의:

- 오늘의 집픽은 화면 중간 아래로 밀리지 않는다.
- 제목보다 먼저 신호 라벨과 verdict가 보여야 한다.

### 4. RegionHeatBoard

기존 `RegionFlow`를 온도판으로 바꾼다.

Regions:

- 서울
- 경기/인천
- 지방 광역시
- 지방 중소도시

UI:

- 상태: HOT / WATCH / MIXED / COOL
- 이슈 수
- 핵심 토픽
- 열감 막대

예:

```text
서울 HOT
정책/청약 신호 집중
5개 신호 █████
```

### 5. SignalTape

기존 3열 피드를 바꾼다.

PC:

- 하단 full-width tape
- 각 행: score, signal label, title, affected audience, source

Mobile:

- 한 줄 이슈 리스트
- 제목 2줄 제한
- 메타 정보는 작게

주의:

- 카드 테두리 반복보다 뉴스 ticker/market tape 느낌
- 제목보다 `신호 상태 + 한 줄 해석`이 먼저 보여야 한다.

## Copy System

### Hero Verdict Examples

```text
오늘은 대출과 청약이 시장을 밀고 있습니다
```

```text
전세 압력이 다시 커지고 있습니다
```

```text
서울 핵심 입지 쏠림이 강해졌습니다
```

```text
정책 기대감은 커졌지만 확인이 필요합니다
```

### Signal Labels

- 강한 신호
- 지켜볼 신호
- 소음 가능성
- 과열 주의
- 관망

### Situation Copy

무주택자:

```text
대출 가능액보다 상환 계획을 먼저 확인할 때
```

1주택자:

```text
갈아타기는 선매수 리스크를 같이 볼 때
```

전세 세입자:

```text
전세/월세 전환 압력을 확인할 때
```

투자자:

```text
정책 기대만으로 베팅하기엔 위험한 구간
```

## Interaction

### No Login User

- 홈은 전부 공개.
- 저장/추천은 데모가 아니라 로그인 유도 또는 비활성 상태로 명확히 표시.

### Situation Selection

1차 구현에서는 클라이언트 상태로 충분하다.

- 기본 selected segment: 가장 높은 위험/주의 segment
- segment 클릭 시:
  - hero subcopy 일부 변경
  - TodayPick의 `내 상황 영향` 문장 변경

실제 personalization은 다음 루프.

### Region Heat

지역 카드 클릭 시 query filter 이동:

```text
/?region=서울
```

## Implementation Steps

1. `src/lib/home-signals.ts`에 verdict view model 추가
   - `heroVerdict`
   - `heroSubVerdict`
   - `strongSignalCount`
   - `watchSignalCount`
   - `regionHeat`
2. 새 홈 컴포넌트 추가
   - `MarketVerdictHero`
   - `AudienceSituationTabs`
   - `TodayPickSignal`
   - `RegionHeatBoard`
   - `SignalTape`
3. 기존 홈 컴포넌트 교체
   - `HomeBriefPanel` -> `MarketVerdictHero`
   - `AudienceImpactStrip` -> `AudienceSituationTabs`
   - `MainSignalCard` -> `TodayPickSignal`
   - `RegionFlow` -> `RegionHeatBoard`
   - `SignalFeed` -> `SignalTape`
4. 기존 route/API/Auth/Supabase는 유지
5. `verify:mvp` 문구 기준 업데이트

## Acceptance Criteria

### Visual

- 390px 모바일 첫 viewport 안에 `오늘 판세 결론`, `92 강한 신호`, `내 상황별 영향`, `오늘의 집픽`이 보여야 한다.
- PC 첫 viewport 안에 `오늘 판세 결론`, `오늘의 집픽`, `지역 온도판`이 같이 보여야 한다.
- 회색/흰색 카드 반복 느낌이 없어야 한다.
- 브랜드명보다 판세 결론이 더 크게 보여야 한다.

### Copy

공개 홈 금지 문구:

- `부동산 레이더`
- `Budongsan Radar`
- `RADAR`
- `레이더 점수`
- `DB 연결`
- `MVP`
- `Latest Links`
- `필터 결과`

필수 문구:

- `오늘의 판세`
- `오늘의 집픽`
- `강한 신호`
- `내 상황별 영향`
- `지역 온도`

### Technical

- `npm run lint`
- `npm run build`
- `npm run verify:mvp`
- Browser 1280px / 390px / 360px no horizontal overflow
- console error/warn 없음

## Non-goals

- DB schema 변경 없음
- OpenAI/RSS/Auth 기능 변경 없음
- 새 seed data 대량 확장 없음
- production 배포 없음
- 예측 정확도나 투자 추천처럼 보이는 문구 없음

## Final Design Principle

집집 홈은 "예쁜 부동산 뉴스 모음"이 아니다.

사용자가 다시 들어오게 만드는 핵심은 아래 질문에 매일 답하는 것이다.

```text
오늘 부동산판에서 내가 놓치면 안 되는 신호가 뭐지?
```

따라서 다음 구현의 첫 화면은 브랜드 소개가 아니라 **오늘 판세의 강한 선언**이어야 한다.
