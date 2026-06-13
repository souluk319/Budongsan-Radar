# Budongsan Radar

부동산계의 GeekNews를 목표로 하는 부동산 이슈 큐레이션 커뮤니티 실험.

## One-line

뉴스, 리포트, 데이터, 커뮤니티 글을 모아 AI가 "이 이슈가 누구에게 어떤 의미인지" 해석해주는 부동산 정보 허브.

## Why

부동산 정보는 많지만 흩어져 있다.

- 뉴스는 언론사별로 파편화되어 있다.
- 커뮤니티는 네이버 카페, 댓글, 블라인드, 앱 댓글에 흩어져 있다.
- 데이터는 KB, 한국부동산원, 아실, 호갱노노, 직방, 부동산114 등에 나뉘어 있다.
- 초보 실수요자는 "그래서 나한테 무슨 의미인지" 판단하기 어렵다.

Budongsan Radar는 매물 플랫폼이 아니라 부동산 의사결정을 위한 이슈 해석 레이어로 시작한다.

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

네이버부동산이 매물, 호갱노노가 단지/시세, 아실이 지역 데이터에 가깝다면 Budongsan Radar는 "오늘 부동산판에서 무엇을 봐야 하는지" 알려주는 뉴스룸 + 커뮤니티다.

## Project Status

- Status: Next.js seed-data MVP
- Folder: `projects/experiments/budongsan-radar`
- Current app: Next.js TypeScript App Router, local seed data only

## Run

```bash
npm install
npm run dev
npm run build
npm run verify:mvp
```

Local development defaults to `http://localhost:3000`.

## MVP Notes

- DB, OpenAI API, auth, crawling, and real persistence are not connected yet.
- All current issue items are visible sample/demo content.
- Submit/recommend/save interactions are mock UI states only.
- `npm run verify:mvp` runs lint, production build, and route-level MVP smoke checks.
