# Home UI Review And Codex Direction - 2026-06-15

## Context

Review target:

- Production URL: `https://zipradar.vercel.app`
- Mobile screenshot: `/tmp/zipradar-home-mobile.png`
- Desktop screenshot: `/tmp/zipradar-home-desktop.png`
- Current home component focus: `src/components/market-pulse-visual.tsx`

The production deployment is healthy. The issue is not broken routing or missing data. The issue is product focus and first-screen hierarchy.

## Verdict

Current UI score: 65/100.

The current home looks like a real product, but it still feels too much like a real-estate monitoring dashboard. `집집` should feel like a daily decision briefing: friendly, direct, useful, and easy to revisit.

The next loop must not add features. It should simplify the home and make the first screen answer one question:

> 오늘 나는 무엇을 먼저 봐야 하나?

## What Works

- The service feels more real than the early MVP.
- `오늘의 시장지도` and `뉴스가 어디를 흔드는지 먼저 봅니다` explain the market-briefing direction.
- `실제 수집 8건` and `공식 근거 32개` create a trust signal.
- Desktop has enough information density to feel like a serious product.
- The lighter warm palette is better than the older dark dashboard tone.

## Main Problems

### 1. Mobile first screen does not show the main user value quickly enough

On 390px mobile, the first screen is dominated by:

- large title
- `오늘의 판세`
- four region-flow cards

The user sees market widgets before seeing the one issue they should read. `오늘의 집픽` is not visible in the first mobile viewport.

This weakens the core promise of `집집`: picking what matters today.

### 2. Desktop has information, but weak reading order

Desktop shows top issues, map, today pick, audience impact, region cards, and pressure bars at once. It looks capable, but the eye does not know where to land first.

Current impression:

> 뭐가 많다.

Desired impression:

> 오늘은 이 이슈부터 보면 되겠네.

### 3. The abstract map visual is more decorative than useful

The grid, curves, region blocks, and bar charts make the page look analytical, but they do not yet explain real geography or real causal movement.

Until actual coordinate or region-level data is connected, the abstract market-map should be toned down or removed from the first viewport.

### 4. Numbers are visible, but not translated into decisions

Examples:

- `7 강한 신호`
- `20 전체 이슈`
- `높음 중요도`
- `공식 근거 32개`

These numbers imply analysis, but the user still needs a plain-language recommendation.

The home should elevate a judgment sentence first, then show evidence counts as support.

### 5. Brand tone is still too stiff

`집집` is short, friendly, and memorable. The current UI is cleaner than before, but still leans toward policy-risk dashboard language.

The product should feel like a calm editor, not a control room.

## Recommended Home Structure

### Mobile order

1. Header
2. Date and small trust line
3. Daily verdict sentence
4. Today pick lead card
5. Situation impact strip
6. Region flow summary
7. Issue list

Suggested mobile first screen:

```text
6월 15일 월요일 브리프
오늘은 대출과 전세 이슈부터 보세요

[오늘의 집픽]
홍국표 시의원 "대출 규제..."
왜 중요한가: ...
영향: 무주택자 / 전세 세입자

[무주택자 확인] [1주택자 관망] [세입자 주의] [투자자 주의]
```

### Desktop order

Use a clearer editorial layout:

- Left/main: daily verdict and today pick
- Center/bottom: issue list in reading order
- Right: situation impact and compact region flow

Avoid a three-column dashboard where every panel competes for attention.

## Specific UI Changes

### Replace `MarketPulseVisual` with smaller home sections

`MarketPulseVisual` currently owns too much of the home:

- hero
- top issue ranking
- abstract map
- region cards
- pressure bars
- today pick
- audience impact
- footer signal summary

Split it into focused sections:

- `DailyVerdictHero`
- `TodayPickLead`
- `SituationImpactStrip`
- `RegionFlowMini`
- `HomeIssueQueue`

Do not preserve `MarketPulseVisual` as a giant wrapper.

### Promote `오늘의 집픽`

`오늘의 집픽` should be the main object in the first viewport, especially on mobile.

Make it the first actionable card after the verdict sentence.

### Remove or demote `이슈 압력`

`이슈 압력` feels like an analyst tool. It is not wrong, but it should not be in the first screen.

Options:

- Move it below the issue list.
- Replace it with a short text summary.
- Remove it from MVP home until the metric has a clear product meaning.

### Reduce abstract visual noise

Tone down or remove:

- grid background
- large abstract curves
- repeated mini bar charts
- heavy black card borders

Keep the visual language warm, editorial, and scan-friendly.

### Convert numbers into copy

Instead of leading with numeric widgets, lead with judgment:

- `오늘은 대출과 전세 이슈부터 보세요`
- `서울은 전세 이슈, 경기/인천은 매수심리 흐름이 강합니다`
- `무주택자는 월상환액과 청약 조건을 먼저 확인하세요`

Keep counts smaller:

- `실제 수집 8건`
- `근거 32개 분석`

### Make region flow text-first

Region cards should read like summaries, not chart tiles.

Example:

```text
서울
전세와 대출 이슈 집중
13건
```

The mini bars are optional and should not dominate the card.

## Copy Direction

Use phrases like:

- `오늘 먼저 볼 것`
- `오늘의 집픽`
- `내 상황별 영향`
- `지역 흐름`
- `근거 있는 브리프`
- `실제 수집`

Avoid or demote:

- `시장지도`
- `이슈 압력`
- `강한 신호`
- `전체 이슈`
- abstract score-like dashboard language

Do not expose developer-facing copy:

- `MVP`
- `Supabase`
- `DB`
- `환경변수`
- `Budongsan Radar`
- `부동산 레이더`
- `RADAR`

## Data And Trust Rules

- Do not mix sample links into the public main issue list unless the sample label is unavoidable and clearly separated.
- If sample data must remain, move it below real links or to an admin/dev-only view.
- Keep actual source names visible.
- Keep evidence counts visible, but use them as support, not the main message.
- Do not claim the service is giving financial or investment advice.

## Verification Requirements

After implementation, verify:

1. `npm run lint`
2. `npm run build`
3. `npm run verify:mvp`
4. Production or local browser check at 390px and 1280px
5. No horizontal overflow
6. No console errors/warnings
7. Mobile first viewport shows:
   - date or daily brief label
   - daily verdict sentence
   - `오늘의 집픽` title or top issue title
   - at least part of `내 상황별 영향`
8. Public home does not show:
   - `MVP`
   - `Supabase`
   - `환경변수`
   - `Budongsan Radar`
   - `부동산 레이더`
   - `RADAR`

Update `scripts/verify-mvp.mjs` so it checks the new briefing-home contract, not the old market-map contract. It should no longer require `오늘의 시장지도` or `이슈 압력` if those sections are removed or demoted.

## Codex Implementation Direction

Use this prompt for the next Codex loop.

```text
You are working on the 집집 project at:
/Users/kugnus/.openclaw/workspace/projects/experiments/budongsan-radar

Read first:
- docs/home-ui-review-and-codex-direction-2026-06-15.md
- docs/visual-review-2026-06-13.md
- docs/marketing-design-quality-gate.md

Task:
Redesign the public home first screen from a dashboard-style market map into a mobile-first daily decision briefing.

Goal:
Users should understand within 5 seconds what real-estate issue they should read first today and why it matters to their situation.

Must do:
1. Replace or break apart src/components/market-pulse-visual.tsx.
2. Make the mobile first viewport prioritize:
   - daily brief/date label
   - plain-language daily verdict
   - 오늘의 집픽 or top issue lead card
   - 내 상황별 영향 preview
3. Demote or remove abstract map visuals, heavy grid backgrounds, repeated mini bars, and `이슈 압력` from the first viewport.
4. Convert numeric dashboard widgets into plain Korean judgment copy.
5. Keep the warm `집집` brand tone. The UI should feel like a daily editorial briefing, not a financial control room.
6. Keep existing data fetching, routes, Supabase integration, auth, and admin behavior intact.
7. Do not add new major features.
8. Do not reintroduce public-facing copy such as `Budongsan Radar`, `부동산 레이더`, `RADAR`, `MVP`, `DB`, `Supabase`, or `환경변수`.
9. Update scripts/verify-mvp.mjs so the home contract matches the new design. Do not keep checks that force the old `오늘의 시장지도` / `이슈 압력` hero.
10. Verify with lint, build, verify:mvp, and browser checks at 390px and 1280px.

Suggested component split:
- DailyVerdictHero
- TodayPickLead
- SituationImpactStrip
- RegionFlowMini
- HomeIssueQueue

Acceptance criteria:
- 390px mobile first viewport is readable and not cramped.
- `오늘의 집픽` or the top issue lead is visible in the first mobile viewport.
- At least part of `내 상황별 영향` appears early enough that users understand the product is personalized by situation.
- Desktop has a clear reading order instead of three competing dashboard columns.
- The page feels like `집집`: friendly, sharp, daily, and trustworthy.
- No horizontal overflow.
- No console errors or warnings.
```

## Recommended Next Action

Run this as a UI-only loop before adding any new data adapters, maps, or product features.

The highest-leverage change is not more data. It is making the first screen say:

> 오늘은 이걸 먼저 보세요.
