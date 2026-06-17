# Codex Prompt - 집집 홈 신호판 UI/카피 개선 - 2026-06-15

## Goal

집집 production 홈의 현재 `HomeQuestionFace`는 이전보다 시각 앵커가 생겼지만, UI와 텍스트가 아직 별로다.

현재 문제:

- `오늘 사람들이 묻는 것`, `질문을 먼저 고르고, 뉴스는 그 다음에 봅니다`가 서비스 핵심을 약하게 만든다.
- 질문 카드가 `나 집 살 수 있어?`, `보증금 괜찮아?`처럼 캐주얼하지만, 부동산 의사결정 서비스의 신뢰감은 부족하다.
- `오늘 켜짐`이 반복되어 의미 없는 장식처럼 보인다.
- 주황 progress bar가 거의 같은 형태로 반복되어 데이터 시각화가 아니라 꾸민 카드처럼 보인다.
- 상단 보드는 `DailySignalMap` 또는 시장 신호판이 아니라 질문 카드 모음처럼 보인다.
- 모바일에서 카드가 잘려 보일 수 있어 overflow/캐러셀 인상이 남는다.

목표는 홈 첫 화면을 **질문 카드 보드**가 아니라 **부동산 시장 신호판 + 오늘의 판단 브리프**로 바꾸는 것이다.

## Read First

작업 전에 반드시 읽어라.

1. `PROJECTS.md`의 `집집` 섹션
2. `docs/home-visual-briefing-plan-2026-06-15.md`
3. `docs/marketing-design-quality-gate.md`
4. 현재 구현:
   - `src/app/page.tsx`
   - `src/components/home-question-face.tsx`
   - `src/components/region-flow-section.tsx`
   - `src/lib/home-signals.ts`
   - `scripts/verify-mvp.mjs`

## Fixed Product Direction

흔들지 말 것.

집집은 텍스트 숙제장도 아니고 관제 대시보드도 아니다.

집집은 **오늘 부동산판을 한 장의 시각 브리프로 먼저 보여주고, 바로 내 상황별 판단으로 번역하는 서비스**다.

이번 작업은 기능 추가가 아니라 홈 첫 화면의 UI/카피 품질 개선이다.

## Recommended Component Direction

현재 `HomeQuestionFace`를 그대로 두고 문구만 바꾸지 말 것.

둘 중 하나를 선택한다.

### 추천

`HomeQuestionFace`를 `HomeSignalBoard` 또는 `DailySignalBoard`로 이름과 역할을 바꾼다.

이 컴포넌트는 사용자의 질문을 보여주는 곳이 아니라, 오늘의 부동산 신호를 한 화면에 요약하는 곳이다.

### 허용

파일명은 유지하되 내부 카피/구조/aria-label은 모두 `시장 신호판` 역할에 맞게 바꾼다.

## Required UI Changes

### 1. Board Title / Description

현재:

```text
오늘 사람들이 묻는 것
질문을 먼저 고르고, 뉴스는 그 다음에 봅니다.
집집 답
```

변경 후보:

```text
오늘의 부동산 신호판
뉴스와 근거를 지역·상황 신호로 바꿔 봅니다.
판세 요약
```

또는:

```text
오늘 먼저 볼 신호
대출·전세·청약 이슈를 내 상황 기준으로 정리했습니다.
오늘 판세
```

금지:

- `오늘 사람들이 묻는 것`
- `질문을 먼저 고르고`
- `집집 답`
- `오늘 켜짐`

### 2. Question Card Copy

현재 질문형 문구가 너무 장난스럽다.

아래처럼 `사용자 질문 + 판단 기준`이 동시에 보이게 바꿔라.

추천 문구:

```text
대출 조건
월상환액 버틸까

전세 안전
보증금 위험 없나

청약 기회
분양가·입지 맞나

우리동네
전세·거래 흔들리나

매수 타이밍
정책 확정 전 기다릴까
```

너무 딱딱하면 안 되지만, 현재처럼 `나 집 살 수 있어?` 수준으로 가볍게 보이면 안 된다.

### 3. Status Labels

`오늘 켜짐` 반복을 제거한다.

상태 라벨은 아래 중 하나를 사용한다.

- `주의`
- `확인`
- `관망`
- `기회`

`UserQuestionIntensity`만으로 라벨을 고정하지 말고, category/context에 따라 자연스럽게 보이게 하라.

예:

- 대출 조건: `확인`
- 전세 안전: `주의`
- 청약 기회: `관망` 또는 `기회`
- 우리동네: `확인`
- 매수 타이밍: `관망`

### 4. Visual Treatment

주황 progress bar가 같은 장식처럼 반복되는 문제를 고쳐라.

필수:

- 카드별 색/상태가 구분되어야 한다.
- progress bar는 모든 카드에서 같은 느낌이면 안 된다.
- 점수 bar를 유지한다면 라벨과 의미가 있어야 한다.
- 가능하면 board 안에 `지역 온도` 2개를 작게 넣어라: 서울 / 경기·인천.

추천 구조:

```text
[오늘의 부동산 신호판]

대출/정책     확인     월상환액 버틸까
전세 안전     주의     보증금 위험 없나

[판세 요약: dark band]
한도보다 월상환액과 시행일을 먼저 봅니다.

서울      뜨거움   정책 중심
경기/인천 뜨거움   전세/입주 중심
```

기존 5개 질문 카드 전체를 첫 화면에 억지로 넣는 것보다, 핵심 2개 + 판세 요약 + 지역 2개가 더 낫다.

### 5. Today Pick

현재 `오늘의 집픽`은 좋아졌지만 여전히 기사 카드 느낌이 남는다.

개선:

- `오늘 할 일`을 더 눈에 띄게 유지한다.
- `왜 지금`과 `오늘 할 일`은 desktop/mobile 모두 보이게 하되, 모바일에서는 한 줄씩 짧게.
- 원문 제목 대신 `todayPickDisplayTitle`을 계속 사용한다.
- 긴 뉴스 원문 제목이 홈 첫 화면의 주인공이 되면 실패다.

### 6. Audience Impact

`내 상황별 영향` 2x2 구조는 유지한다.

개선:

- 각 칩에 `월상환액`, `갈아타기`, `보증금`, `리스크`만 두지 말고 상태와 짧은 행동을 같이 보여라.
- 예:
  - 무주택자 / 확인 / 월상환액 먼저
  - 1주택자 / 관망 / 갈아타기 조건
  - 전세 세입자 / 주의 / 보증금 점검
  - 투자자 / 주의 / 공실 리스크

### 7. Mobile Requirements

390px viewport 기준:

- 가로 overflow 없어야 한다.
- 카드가 오른쪽에서 잘려 보여도 안 된다.
- 첫 화면에 아래가 보여야 한다:
  - `집집`
  - 날짜/실제 수집/근거
  - 오늘 결론 H1
  - `오늘의 부동산 신호판` 또는 동급 board title
  - dark band 판세 요약
  - `오늘의 집픽` 시작부
- H1은 2줄 이하가 좋다.

### 8. Desktop Requirements

1280px 기준:

- 왼쪽은 board와 issue list, 오른쪽은 오늘의 집픽/상황별 영향/지역 온도 사이드 패널.
- 시선이 `H1 -> Board -> Today Pick`으로 흘러야 한다.
- 모든 카드가 같은 테두리/같은 주황 막대 반복으로 보이면 실패다.

## Copy Quality Bar

좋은 카피:

- 오늘 먼저 볼 신호
- 오늘의 부동산 신호판
- 판세 요약
- 왜 지금
- 오늘 할 일
- 월상환액 먼저
- 보증금 점검
- 정책 확정 전 관망
- 지역 온도

별로인 카피:

- 오늘 사람들이 묻는 것
- 질문을 먼저 고르고
- 집집 답
- 오늘 켜짐
- 나 집 살 수 있어?
- 보증금 괜찮아?
- 넣어볼 만해?
- 기다려도 돼?

## Files Likely To Change

- `src/components/home-question-face.tsx`
- `src/lib/home-signals.ts`
- `src/app/page.tsx`
- `src/components/region-flow-section.tsx`
- `scripts/verify-mvp.mjs`

Optional:

- rename `home-question-face.tsx` to `home-signal-board.tsx`

If renaming, update imports cleanly.

## Verification

Run:

```bash
npm run lint
npm run build
npm run verify:mvp
```

Then visually verify with Chrome screenshots:

- 390px mobile
- 1280px desktop

Check:

- no horizontal overflow
- no console warning/error
- first screen does not look like homework
- first screen does not look like a financial control room
- board looks like a real product surface, not a temporary card grid

## Update verify script

`scripts/verify-mvp.mjs` should require the new contract.

Require:

- `오늘의 부동산 신호판` or chosen final board title
- `판세 요약` or chosen equivalent
- `오늘의 집픽`
- `오늘 할 일`
- `내 상황별 영향`
- `지역 온도`

Forbid:

- `오늘 사람들이 묻는 것`
- `질문을 먼저 고르고`
- `집집 답`
- `오늘 켜짐`
- `Daily Signal Map`
- `이슈 압력`
- `MVP`
- `Supabase`
- `환경변수`

## Definition Of Done

작업 완료는 코드가 돌아가는 것이 아니라, production 후보 화면이 아래 평가를 통과하는 것이다.

1. 처음 5초 안에 “오늘 어떤 부동산 신호를 봐야 하는지”가 보인다.
2. 텍스트만 읽는 숙제장 느낌이 없다.
3. 같은 모양 카드와 막대가 반복되는 장식 UI가 아니다.
4. 카피가 너무 장난스럽거나 임시 문구처럼 보이지 않는다.
5. 모바일 390px에서 잘림/overflow가 없다.
6. `오늘의 집픽`과 `오늘 할 일`이 첫 화면 흐름 안에서 자연스럽다.
7. 집집이 뉴스 링크 모음이 아니라 `부동산 의사결정 브리핑`처럼 보인다.
