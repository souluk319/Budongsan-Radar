# Build Spec - Budongsan Radar MVP

## Goal

Next.js 기반의 부동산 이슈 큐레이션 MVP를 만든다.

초기 목표는 "매일 볼 만한 부동산 링크와 AI 요약을 보여주는 제품 뼈대"다.

## Recommended Stack

- Framework: Next.js
- Language: TypeScript
- Styling: CSS Modules or Tailwind CSS
- Data: local seed data first, then Supabase/PostgreSQL
- AI: OpenAI API for summary generation, later integration
- Deploy target: Vercel

MVP 첫 루프에서는 DB와 API 키 없이 seed data 기반 정적/서버 렌더 화면부터 만든다.

## Pages

### Home

Path: `/`

Content:

- Header with product name
- Today briefing section
- Trending links
- Latest links
- Category filter
- Region filter

Primary user action:

- Open a link detail page

### Link Detail

Path: `/links/[id]`

Content:

- Title
- Original source URL
- Published date or submitted date
- Category tags
- Region tags
- AI summary
- Impact by audience
- Checkpoints
- Upvote/save button UI
- Related links

### Submit Link

Path: `/submit`

MVP behavior:

- URL input
- Title input
- Category select
- Region select
- Mock submit state

Actual persistence can be deferred unless the implementation loop chooses a local JSON write or DB.

### Daily Briefing

Path: `/briefing`

Content:

- Top 10 issues of the day
- Grouped by category
- Short impact line per issue

## Data Model

For seed data:

```ts
type AudienceImpact = {
  homelessBuyer: string;
  oneHomeOwner: string;
  renter: string;
  investor: string;
};

type RadarLink = {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  submittedAt: string;
  category: string;
  regions: string[];
  summaryBullets: string[];
  whyItMatters: string;
  audienceImpact: AudienceImpact;
  checkpoints: string[];
  score: number;
  isDailyPick: boolean;
};
```

## Initial Seed Categories

- 정책
- 대출/금리
- 청약
- 전세/월세
- 매매시장
- 재건축/재개발
- 경매
- 상권
- 지역 이슈
- 프롭테크

## Initial Seed Links

Use realistic sample data, but do not pretend it is live news.

All sample items must be visibly marked as sample/demo content unless real current source URLs are added and verified.

## UX Direction

This is not a marketing landing page.

The first screen should feel like a practical dashboard/news board:

- Dense but readable
- Fast scanning
- Clear category and region labels
- Avoid oversized hero sections
- Avoid decorative gradient-heavy landing layout
- Prioritize information hierarchy

## Component Ideas

- `LinkCard`
- `CategoryTabs`
- `RegionFilter`
- `DailyBriefingList`
- `ImpactPanel`
- `SubmitLinkForm`
- `ScoreBadge`

## Acceptance Criteria

Implementation loop is successful when:

1. App runs locally.
2. Home page displays seed links.
3. Daily briefing page displays top picks.
4. Link detail page displays AI-style summary structure from seed data.
5. Submit page has a usable form UI with mock submission state.
6. Desktop and 390px mobile widths do not have broken layout or overlapping text.
7. Build succeeds.

## Commands

Expected commands after scaffold:

```bash
npm install
npm run dev
npm run build
```

## Future Enhancements

- Supabase auth and DB
- Admin link submission
- OpenAI summary generation API route
- RSS/import pipeline
- User accounts
- Comments
- Saved links
- Email/Kakao/Telegram daily briefing
- Region-specific briefing

