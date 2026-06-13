# Visual Review - 2026-06-13

Review target:

- Local URL: `http://127.0.0.1:3050/`
- Desktop screenshot: `/tmp/jipjip-desktop.png`
- Mobile screenshot: `/tmp/jipjip-mobile.png`

## Verdict

The product structure improved, but the UI is not ready for public users.

- Product structure: 70/100
- Desktop UI: 50/100
- Mobile UI: 35/100

The page now feels more like a product than the first MVP, but it still looks too heavy, too dashboard-like, and too far from the friendly `집집` brand.

## What Works

- `집집` appears as the brand.
- `오늘의 집픽` is a good core section.
- `내 상황별 영향` is correctly elevated near the top.
- Audience segments are clear: 무주택자, 1주택자, 전세 세입자, 투자자.
- `지역 온도판` is a better product phrase than a plain region filter.
- The old developer-facing language such as `DB 연결` is not visible in the public first view.

## Main Problems

### 1. The UI Is Too Heavy

The dark finance-terminal tone makes the page feel more like a risk dashboard than a consumer daily briefing.

`집집` sounds short, friendly, and memorable. The current UI feels like it is wearing a black investment-bank suit.

### 2. The Hero Type Is Too Large

The headline has impact, but it dominates the page too much.

Current impression:

```text
오늘은 대출과 청약이 시장을 밀고 있습니다
```

It is clear, but it consumes too much vertical and visual space, especially on mobile.

### 3. Mobile Is Not Good Enough

On the 390px mobile screenshot:

- The top screen feels crowded.
- The headline takes too much space.
- `오늘의 집픽` begins below the fold and appears cut off.
- The main issue card title is too large for the available width.
- The user cannot quickly scan the whole first-view story.

Mobile must be treated as the primary surface.

### 4. Too Many Heavy Boxes

The page still relies on repeated bordered cards and status blocks.

It has better hierarchy than the first MVP, but the visual rhythm is still:

```text
box
box
box
box
```

This makes the product feel engineered, not edited.

### 5. Brand Tone Mismatch

`집집` should feel easy, friendly, sharp, daily, and memorable.

The current screen feels serious, dark, dense, financial, and slightly intimidating.

This mismatch weakens the brand.

### 6. Development Artifact Visible

A small `N` icon appears in the bottom-left of the screenshot. This appears to be a local/dev indicator. It is acceptable during development but must not appear in any public screenshot or deploy review.

## Required Next Loop

Do not add features in the next loop.

The next loop must be a UI simplification and tone correction loop.

## Design Direction

Move from:

```text
dark financial monitoring dashboard
```

to:

```text
friendly daily real-estate briefing that still has sharp signal language
```

## Specific Changes To Request

1. Reduce dark surface dominance.
2. Reduce first-view density by at least 30%.
3. Make mobile the primary surface.
4. Rework the top headline so it feels like a briefing title, not a billboard.
5. Make `오늘의 집픽` the hero card.
6. Lighten audience impact cards.
7. Tone down scores and bars.
8. Keep `집집`, `오늘의 집픽`, `오늘 기억할 한 줄`, `내 상황별 영향`, `지역 온도판`.
9. Reconsider `신호 테이프` and `시장 온도 92`.
10. Remove local/dev visual indicators before public review.

## Acceptance Criteria For Next UI Loop

1. The page feels like `집집`, not a finance dashboard.
2. Desktop first view has clear hierarchy without giant typography swallowing the layout.
3. 390px mobile first view is readable and not cramped.
4. `오늘의 집픽` appears as the main object, not a secondary block.
5. User can understand the product in 5 seconds.
6. The screen feels worth revisiting daily.
7. No development artifacts appear in screenshots.
