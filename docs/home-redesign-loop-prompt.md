# Codex Loop Prompt - 집집 Home Redesign

You are redesigning the 집집 MVP home experience.

## Context

집집 is a Korean real estate issue curation product.

Public brand decision:

- Brand name: `집집`
- Core feature language: `집픽`
- Internal project codename: `Budongsan Radar`
- Existing internal code identifiers may continue to use `radar` unless a separate rename task is requested.

The current MVP works functionally, but the first screen feels like an internal admin/data board. It is too plain, too SaaS-like, and does not create the feeling that a normal user would want to come back every day.

The product must feel less like "a developer wired up the features" and more like:

> 집집에서 오늘 부동산 이슈를 쉽게 집어준다.

## Goal

Redesign the home page so it becomes a compelling daily real estate briefing and issue-picking product.

This loop is primarily a product/design loop, not a backend loop.

Keep existing routes, data model, Supabase integration, auth, and API behavior intact unless a tiny UI-facing data helper is clearly needed.

Read this reference brief before editing:

- `docs/design-reference-brief.md`

Do not improvise the visual direction from scratch. Use the reference brief as the design rail.

## Core Product Direction

The first screen should communicate:

- Today's real estate market mood
- What changed today
- Who is affected
- Which regions are showing signals
- Which issues are strong signals vs weak noise

Do not position this as a generic news board.

Position it as:

> A daily briefing that picks the real estate issues worth knowing.

## Current Problem

The current visual style is usable but not magnetic.

Problems to fix:

- Too much neutral white/gray SaaS dashboard feeling
- Weak emotional hook
- Too little market tension
- Region/category filters feel mechanical
- "DB connected" style badges are too developer-facing
- The content looks organized, but not urgent or habit-forming
- The first screen does not immediately answer "why should I visit this every morning?"

## Recommended First View Structure

### 1. 집집 Brief Header

Replace the generic hero/dashboard heading with a compact but high-signal daily brief panel.

Required content:

- Product name: `집집`
- Short promise: `오늘 부동산 이슈, 쉽게 집어드립니다`
- Date or "오늘의 판세"
- Market mood label, for example:
  - 관망
  - 반등 신호
  - 과열 주의
  - 냉각
  - 혼조
- 3 keyword chips, for example:
  - 대출
  - 전세
  - 서울 청약

Do not use a huge landing-page hero.

This is a practical daily product, not a marketing site.

### 2. Audience Impact Strip

Add an immediately visible strip for user situations.

Segments:

- 무주택자
- 1주택자
- 전세 세입자
- 투자자

Each segment should show a short status:

- 주의
- 관망
- 확인
- 기회

Each should include a one-line interpretation.

Example:

```text
무주택자 - 확인
대출/청약 조건 변화가 매수 타이밍 판단에 영향
```

This is the product's sharpest differentiator. Make it visible near the top.

### 3. Main Signal Card

Show one dominant issue as today's strongest signal.

Fields:

- Signal strength
- Category
- Region
- Title
- Why it matters
- User impact summary
- CTA to detail page

Do not make all issues look equal.

The user should instantly know: "Start here."

Name this section `오늘의 집픽`.

### 4. Signal Feed

Rename the generic latest/trending list into something like:

- 강한 신호
- 지켜볼 신호
- 소음 가능성

Every link card should feel like a market signal, not a blog card.

Recommended card elements:

- Signal label
- Radar score
- Category
- Region
- Title
- One-line interpretation
- Affected audience labels

### 5. 지역 흐름

Replace plain region filters or supplement them with a region flow module.

Regions:

- 서울
- 경기/인천
- 지방 광역시
- 지방 중소도시

Each region should show:

- Signal count
- Main topic
- Temperature/status label

Example:

```text
서울
청약/재건축 신호 강함
```

## Visual Direction

This should feel like a calm but tense market monitor.

Use:

- Deep charcoal or dark navy accents
- Off-white or very light gray content surfaces
- Signal colors used sparingly:
  - Red: risk / warning
  - Amber: watch
  - Green: opportunity / stable
  - Blue: information / neutral
- Stronger information hierarchy
- Fewer generic boxes
- More issue-picking and daily briefing language
- Monospace only for numbers/scores

Avoid:

- Purple/blue gradient SaaS look
- Beige coffee newsletter look
- Huge marketing hero
- Decorative orb/blob backgrounds
- UI cards inside UI cards
- Developer-facing status such as `DB 연결`
- Any copy that sounds like an internal prototype unless it is clearly a sample badge

## Reference Direction

Use these pages as strategic references, not as visual copy targets:

- `https://news.hada.io/`
- `https://www.axios.com/`
- `https://www.bloomberg.com/markets`
- `https://xai.land/products/radar/`

Reference synthesis:

- GeekNews gives the link/feed density.
- Axios gives the short briefing grammar.
- Bloomberg Markets gives market information hierarchy.
- XAI Land RADAR gives the issue/risk signal perspective.

Useful ideas from XAI Land RADAR:

- It frames the product as an early warning system, not a generic dashboard.
- It gives a named score/index near the top.
- It uses risk language such as warning, stress, reverse-jeonse risk, scenario analysis, and market surveillance.
- It separates market-level risk from portfolio/product-level risk.
- It uses a clear institutional intelligence tone.

Translate these ideas for 집집's consumer/prosumer audience.

Do:

- Borrow the concept of "early warning" and "market signal."
- Use a top-level market score or mood label.
- Use risk/signal language around real estate decisions.
- Make the first screen feel like it quickly picks meaningful market changes.

Do not:

- Copy the XAI Land page layout directly.
- Make 집집 feel like an institutional B2B sales page.
- Overuse policy/finance jargon that normal users will not understand.
- Claim real predictive accuracy without verified data.

Suggested consumer-facing translation:

- `주택시장 조기경보 시스템` -> `오늘의 부동산 브리프`
- `HFSI 종합지수` -> `오늘의 중요도`
- `주의` -> `주의 / 관망 / 반등 신호 / 과열`
- `시나리오 분석` -> `내 상황별 영향`
- `시장 전체의 이상 신호` -> `뉴스 속 진짜 신호`

## Copy Direction

Use direct Korean product copy.

Good:

- `집집`
- `오늘의 집픽`
- `집집 브리프`
- `오늘의 판세`
- `강한 신호`
- `지켜볼 신호`
- `소음 가능성`
- `내 상황별 영향`
- `오늘 먼저 볼 이슈`
- `지역 흐름`

Bad:

- `부동산 레이더`
- `Budongsan Radar`
- `Radar`
- `Latest Links`
- `DB 연결`
- `실제 저장 지원`
- `필터 결과`
- `MVP`

Developer/MVP copy may remain in README or admin screens, but not in the public home hero.

## Scope

### In Scope

- Home page redesign
- Supporting home components
- Home-specific data grouping helpers
- CSS/Tailwind class changes
- Copy improvements
- Mobile layout improvement
- Hide `관리자` nav from normal public navigation if possible without breaking admin direct access
- Replace developer-facing public badges with user-facing labels

### Out of Scope

- Rebuilding database schema
- Changing Supabase auth
- New payment or account system
- Large API rewrite
- Real-time crawling
- OpenAI prompt engineering changes
- Full brand system

## Implementation Notes

Before editing, inspect:

- `src/app/page.tsx`
- `src/components/link-card.tsx`
- `src/components/filter-bar.tsx`
- `src/components/daily-briefing-list.tsx`
- `src/components/site-header.tsx`
- `src/lib/radar-data.ts`
- `src/lib/radar-repository.ts`
- `src/app/globals.css`

Keep the code simple.

If new components help readability, create them under `src/components/`.

Suggested new components:

- `market-radar-panel.tsx`
- `audience-impact-strip.tsx`
- `main-signal-card.tsx`
- `region-radar.tsx`
- `signal-feed.tsx`

Use existing data where possible. If the seed data lacks explicit signal labels, derive them from `score`.

Example:

- `score >= 86`: 강한 신호
- `score >= 75`: 지켜볼 신호
- else: 소음 가능성

## Acceptance Criteria

The redesign is successful when:

1. The home page no longer feels like an internal admin dashboard.
2. The first viewport clearly answers what the product does.
3. The user can identify today's strongest issue within 5 seconds.
4. Audience-specific impact is visible above the fold on desktop and early on mobile.
5. Region information feels like a radar, not a plain filter list.
6. Public home copy does not expose developer-facing terms like `DB 연결`.
7. Admin remains reachable at `/admin`, but does not need to be prominent in public nav.
8. Desktop layout is dense but not cluttered.
9. 390px mobile layout has no horizontal overflow and no text overlap.
10. Existing routes still work:
    - `/`
    - `/briefing`
    - `/submit`
    - `/links/policy-loan-rule-watch`
    - `/admin`

## Verification

Run:

```bash
npm run lint
npm run build
npm run verify:mvp
```

If browser tooling is available, verify:

- Desktop home screenshot
- 390px mobile home screenshot
- No horizontal overflow
- No console errors
- Main CTA/detail route works

If browser tooling is not available, report that only build/route-level verification was performed.

## Completion Report

At the end, report:

- What changed visually
- What public copy changed
- Which components/files changed
- What stayed intentionally unchanged
- Verification result
- Remaining design risks

## Design Judgment

Be opinionated.

If the existing layout is too plain, replace it. Do not merely adjust spacing and colors.

The page should make a user think:

> I should check this before reading random real estate news today.
