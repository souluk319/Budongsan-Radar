# 집집

부동산계의 GeekNews를 목표로 하는 부동산 이슈 큐레이션 커뮤니티 실험.

내부 프로젝트 코드명은 `Budongsan Radar`이고, 공개 브랜드명은 `집집`으로 결정했다.

## One-line

뉴스, 리포트, 데이터, 커뮤니티 글을 모아 AI가 "이 이슈가 누구에게 어떤 의미인지" 해석해주는 부동산 정보 허브.

## Why

부동산 정보는 많지만 흩어져 있다.

- 뉴스는 언론사별로 파편화되어 있다.
- 커뮤니티는 네이버 카페, 댓글, 블라인드, 앱 댓글에 흩어져 있다.
- 데이터는 KB, 한국부동산원, 아실, 호갱노노, 직방, 부동산114 등에 나뉘어 있다.
- 초보 실수요자는 "그래서 나한테 무슨 의미인지" 판단하기 어렵다.

집집은 매물 플랫폼이 아니라 부동산 의사결정을 위한 이슈 해석 레이어로 시작한다.

## Target

초기 타깃은 부동산 공부를 시작한 25-45세 실수요자와 초보 투자자다.

이 사용자는 다음 질문을 매일 한다.

- 오늘 부동산판에서 중요한 이슈는 뭔가?
- 이 정책/금리/청약 뉴스가 나에게 영향이 있나?
- 내 지역과 연결되는 이슈인가?
- 지금 봐야 하는 리스크는 무엇인가?

## MVP

초기 MVP는 매물 등록이나 거래 기능을 만들지 않는다.

핵심 기능:

1. 링크 제출
2. 카테고리/지역 태그
3. AI 3줄 요약
4. 영향 대상 분류
5. 추천/저장
6. 오늘의 부동산 이슈 10개

## Positioning

네이버부동산이 매물, 호갱노노가 단지/시세, 아실이 지역 데이터에 가깝다면 집집은 "오늘 부동산판에서 무엇을 봐야 하는지" 알려주는 뉴스룸 + 커뮤니티다.

## Project Status

- Status: Next.js + Supabase/OpenAI-ready MVP
- Public brand: `집집`
- Feature language: `집픽`
- Internal codename: `Budongsan Radar`
- Folder: `projects/experiments/budongsan-radar`
- Current app: Next.js TypeScript App Router with seed fallback, Supabase DB/Auth routes, RSS ingest route, and OpenAI summary route

## Run

```bash
npm install
npm run dev
npm run build
npm run verify:mvp
```

Local development defaults to `http://localhost:3000`.

## Env

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
OPENAI_SUMMARY_MODEL=gpt-5.5

APP_URL=http://localhost:3000
ADMIN_EMAILS=

RSS_INGEST_SECRET=
```

Use the new Supabase publishable/secret keys when available. Legacy anon/service role keys are still supported as fallbacks.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/20260613000000_initial.sql` in the Supabase SQL editor or via Supabase CLI.
3. Put env values into `.env.local`.
4. Add your login email to `ADMIN_EMAILS`.
5. Restart `npm run dev`.
6. Optional: run `npm run db:seed` to copy current sample links into Supabase as published sample rows.

## MVP Notes

- Without Supabase env, the app intentionally falls back to local seed data.
- With Supabase env, `/submit`, save, vote, auth, `/admin`, and RSS ingest write to the database.
- OpenAI summary generation requires `OPENAI_API_KEY` and is available through the admin queue.
- RSS ingest is allowlisted through the `rss_sources` table; arbitrary full-page scraping is not included.
- `npm run verify:mvp` runs lint, production build, and route-level smoke checks without requiring real env.
