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
7. 커뮤니티 질문/지역 소식/내 상황 상담 글쓰기

## Positioning

네이버부동산이 매물, 호갱노노가 단지/시세, 아실이 지역 데이터에 가깝다면 집집은 "오늘 부동산판에서 무엇을 봐야 하는지" 알려주는 뉴스룸 + 커뮤니티다.

## Project Status

- Status: Next.js + Supabase live-data MVP
- Public brand: `집집`
- Feature language: `집픽`
- Internal codename: `Budongsan Radar`
- Folder: `projects/experiments/budongsan-radar`
- Current app: Next.js TypeScript App Router with Supabase DB/Auth, live data ingest, seed fallback, admin routes, and OpenAI-ready summary routes

## Live Data Status

2026-06-17 기준으로 공개 홈/브리프/상세 화면에 실제로 반영되는 데이터 흐름은 아래와 같다.

- Supabase `links`: `status = published` 링크를 홈, 브리프, 상세 화면에서 읽는다.
- Live-first display: published 실수집 링크가 8개 이상이면 공개 피드에서는 샘플 링크를 섞지 않고 `is_sample = false` 링크를 우선 사용한다.
- Naver Search API: `npm run data:live`가 네이버 뉴스 검색 API로 최신 부동산 기사 후보를 수집해 `links`에 저장한다.
- DATA.go.kr RTMS API: 국토교통부 아파트 실거래가 API 표본을 `data_observations`에 저장하고 관련 링크 근거로 연결한다.
- Bank of Korea ECOS API: 기준금리 관측값을 `data_observations`에 저장하고 관련 링크 근거로 연결한다.
- Supabase `summaries`: live ingest가 각 링크의 3줄 요약, 영향 대상, 체크포인트를 저장한다.
- Supabase `data_observations` / `link_observations`: 뉴스 맥락, 실거래 표본, ECOS 관측값을 링크별 근거로 연결한다.
- Supabase `community_posts`: 로그인 사용자가 질문, 지역 소식, 뉴스 제보, 내 상황 상담 글을 올리면 `pending`으로 저장한다.

현재 DB 확인값:

- Published live links: 20
- Published sample links: 12
- Daily live picks: 8
- Summaries: 26
- Live observations: 23
- Live observation sources: `naver` 20, `data_go_kr` 2, `ecos` 1

아직 화면에 안정적으로 반영되지 않는 것:

- RSS: route는 있지만 `rss_sources`가 0개라 현재 공개 화면의 실제 원천은 아니다.
- Community posts: 테이블과 작성 흐름은 연결됐지만, 현재 공개된 커뮤니티 글은 없다. 초기 운영은 승인 후 공개 방식이다.
- REB/R-ONE: env와 문서 기준은 준비됐지만 실제 통계 endpoint/stat id 매핑이 아직 없어 지역 통계로 반영되지 않는다.
- Law Open API: `LAW_OPEN_API_OC`는 들어왔지만 현재 호출은 `필수입력요소 검증에 실패하였습니다` 응답을 반환해 정상 근거로 저장하지 않고 warning으로만 남긴다.
- OpenAI live summaries: `OPENAI_API_KEY`는 준비되어 있고 admin summary route도 있지만, `npm run data:live`는 `LIVE_USE_OPENAI=1`일 때만 OpenAI structured summary를 사용한다. 기본값은 fallback editorial template이다.

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
- With Supabase env, `/submit`, save, vote, auth, `/admin`, live ingest, RSS ingest, and Naver ingest write to the database.
- OpenAI summary generation requires `OPENAI_API_KEY` and is available through the admin queue.
- RSS ingest is allowlisted through the `rss_sources` table; arbitrary full-page scraping is not included.
- `npm run verify:mvp` runs lint, production build, and route-level smoke checks without requiring real env.

## More Data/Auth Needed

다음 단계에서 제품 품질을 올리려면 새 비밀키보다 원천별 "정확한 사용 승인/endpoint 매핑"이 더 중요하다.

1. REB/R-ONE 통계 endpoint 매핑
   - 필요한 값: `REB_REGION_PRICE_INDEX_STAT_ID`, `REB_JEONSE_PRICE_INDEX_STAT_ID`, `REB_TRADE_VOLUME_STAT_ID`, `REB_BUYING_SENTIMENT_STAT_ID`, `REB_REGION_CODE_SET`
   - 목적: 지역별 가격지수, 전세지수, 거래량, 매수심리를 홈의 지역 흐름/시각화에 연결

2. Law Open API 파라미터 확정
   - 필요한 것: `LAW_OPEN_API_OC` 외에 현재 쓰는 검색 endpoint의 필수 파라미터 확인
   - 목적: 정책/법령 이슈에 시행일, 법령명, 조문 근거 연결

3. 공공데이터포털 활용신청 범위 확인
   - 이미 필요한 키는 `DATA_GO_KR_SERVICE_KEY`에 들어왔지만, API별 활용신청이 열려 있어야 한다.
   - 우선순위: 아파트 실거래, 아파트 전월세, 오피스텔 매매/전월세, 연립다세대, 단독다가구

4. RSS allowlist 등록
   - 필요한 것: `rss_sources` seed 또는 admin 등록
   - 후보: 국토교통부, 금융위원회, 정책브리핑, 한국부동산원 공지, HUG/HF 보도자료

5. Vercel 환경변수 확인
   - Preview/Production 모두 Supabase, Naver, DATA.go.kr, ECOS, Law, OpenAI 값을 넣어야 배포 환경에서도 로컬과 같은 데이터 흐름이 동작한다.
