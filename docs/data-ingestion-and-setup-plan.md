# 집집 데이터 수집/연동 준비 문서

작성일: 2026-06-13
업데이트: 2026-06-14

## 한 줄 결론

집집은 언론사 기사 전문을 긁어오는 크롤러 서비스가 아니라, 링크/RSS/공공데이터를 모아 AI가 사용자 상황별 의미를 해석해주는 부동산 브리핑 서비스로 간다.

## 시각화/API 후속 문서

성욱 피드백 기준으로 와우포인트 방향을 수정했다. 집집의 핵심은 큰 헤드라인이 아니라 `시장지도`, `전세 안전 그림`, `단지 비교 스파크라인` 같은 시각화다.

- 읽기용 HTML: `docs/visualization-data-api-plan.html`
- 원문 Markdown: `docs/visualization-data-api-plan.md`

## 원칙

- 풀 웹크롤링은 하지 않는다.
- 언론사 기사 본문 전문 저장은 하지 않는다.
- RSS, 공개 API, URL 메타데이터, 관리자 큐레이션을 우선한다.
- 수집된 링크는 기본 `pending` 상태로 저장하고, 관리자 승인 후 publish한다.
- AI 요약은 원문을 대체하는 복제 콘텐츠가 아니라 집집의 자체 해석으로 만든다.
- 모든 상세 화면에는 원문 링크와 출처를 남긴다.
- 투자 조언처럼 보이는 확정 표현은 피한다.

## 현재 env 반영 상태

값은 출력하지 않고 존재 여부만 확인했다.

### 들어온 값

- `DATA_GO_KR_SERVICE_KEY`
- `REB_STATS_API_BASE_URL`
- `REB_STATS_API_DOC_URL`
- `REB_STATS_API_KEY`
- `ECOS_API_KEY`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `LAW_OPEN_API_OC`

### 현재 상태

2026-06-14 기준으로 집집 데이터 연동에 필요한 1차 API/env는 모두 `.env`에 들어왔다.

- Vercel `zipradar` production 환경변수 반영 완료
- `APP_URL=https://zipradar.vercel.app` 기준 production 배포 완료
- `/admin`에서 데이터 연결 점검 가능
- `/admin`에서 네이버 뉴스 검색 후보를 pending 링크로 수집 가능

### REB 변수명 정리

성욱이 `.env.example` 기준으로 실제 `.env`의 REB 변수명을 정식 이름으로 수정했다.

```bash
REB_STATS_API_BASE_URL=https://www.reb.or.kr/r-one/openapi/
REB_STATS_API_DOC_URL=
REB_STATS_API_KEY=
```

- `REB_STATS_API_BASE_URL`: R-ONE Open API 기본 주소
- `REB_STATS_API_DOC_URL`: 성욱이 받은 명세서 URL 또는 문서 위치
- `REB_STATS_API_KEY`: R-ONE 인증키
- 코드는 혹시 모를 이전 로컬 env 호환을 위해 `REB_URL`, `REB_API`도 alias로 읽지만, 앞으로는 정식 이름만 사용한다.

## 데이터 흐름

```text
RSS/API/제보 URL
  -> 중복 URL 정규화
  -> pending 링크 저장
  -> 관리자 검수
  -> OpenAI 요약/분류 생성
  -> published
  -> 홈/브리프/상세 노출
```

## 수집 대상

| 우선순위 | 대상 | 목적 | 방식 | 비고 |
|---|---|---|---|---|
| 1 | 국토부/금융위/정책브리핑 RSS | 정책/대출/공급 이슈 후보 수집 | RSS | 키 없이 시작 가능 |
| 1 | 관리자 URL 등록 | 품질 좋은 링크 직접 등록 | Supabase 저장 | 초반 품질 관리 핵심 |
| 1 | 사용자 제보 URL | 외부 발견 채널 확보 | 로그인 후 제출 | 기본 `pending` |
| 2 | 실거래가 API | 이슈 해석의 근거 보강 | 공공데이터 API | `DATA_GO_KR_SERVICE_KEY` 필요 |
| 2 | 청약홈 API | 청약/분양 이슈 근거 보강 | 공공데이터 API | `DATA_GO_KR_SERVICE_KEY` 필요 |
| 2 | 한국부동산원 R-ONE 통계 API | 시장 흐름/지역 흐름 보강 | R-ONE Open API | `REB_STATS_API_KEY` 필요 |
| 3 | 한국은행 ECOS | 금리/거시지표 보강 | ECOS API | `ECOS_API_KEY` 필요 |
| 3 | 네이버 뉴스 검색 API | 이슈 후보 발견 | 검색 API | 본문 저장 금지 |
| 3 | 법제처 법령 API | 법령/제도 변경 확인 | Open API | 정책 이슈 보강용 |

## 공식 소스 후보

### RSS

- 국토교통부 RSS: https://www.molit.go.kr/USR/p_etc_rsssvc/m_123/ers.jsp
- 대한민국 정책브리핑 RSS: https://www.korea.kr/etc/rss.do
- 금융위원회 RSS: https://www.fsc.go.kr/ut060101

### 공공데이터/API

- 국토교통부 아파트 매매 실거래가: https://www.data.go.kr/data/15126469/openapi.do
- 국토교통부 아파트 전월세 실거래가: https://www.data.go.kr/data/15126474/openapi.do
- 한국부동산원 청약홈 분양정보: https://www.data.go.kr/data/15098547/openapi.do
- 한국부동산원 청약 경쟁률/특별공급 신청현황: https://www.data.go.kr/data/15098905/openapi.do
- 한국부동산원 R-ONE Open API 소개: https://www.reb.or.kr/r-one/portal/openapi/openApiIntroPage.do
- 한국부동산원 R-ONE Open API 목록: https://www.reb.or.kr/r-one/portal/openapi/openApiListPage.do
- 한국부동산원 R-ONE Open API 개발가이드: https://www.reb.or.kr/r-one/portal/openapi/openApiDevPage.do
- 한국부동산원 부동산통계 조회 공공데이터포털 페이지: https://www.data.go.kr/data/15134761/openapi.do
- 한국은행 ECOS: https://ecos.bok.or.kr/api/
- 네이버 뉴스 검색 API: https://developers.naver.com/docs/serviceapi/search/news/news.md
- 법제처 국가법령정보 Open API: https://open.law.go.kr/LSO/openApi/guideList.do

참고: 한국부동산원 공공데이터 자료실 안내에 따르면 기존 공공데이터포털 부동산 통계 9종은 R-ONE에서 제공하는 API로 이전되는 흐름이므로, 집집의 부동산통계 adapter는 R-ONE Open API를 우선 기준으로 둔다.

## 내가 할 수 있는 것

### 바로 가능

- RSS allowlist 설계
- `rss_sources` seed 추가
- RSS ingest route 개선
- canonical URL 중복 제거
- URL 메타데이터 수집
- pending/admin 승인 흐름 정리
- OpenAI 요약 프롬프트/JSON schema 개선
- 공공데이터 API adapter 파일 구조 설계
- `.env.example` 샘플 키 목록 정리
- API 키가 들어왔을 때 연결 테스트 스크립트 작성
- 수집 실패/중복/승인 상태를 admin에서 보이게 개선

### 키가 있으면 가능

- 공공데이터포털 API 실제 호출 테스트
- 실거래가/청약/통계 데이터 정규화
- 한국부동산원 R-ONE 통계 API 호출 테스트
- 한국은행 ECOS 호출 테스트
- 네이버 뉴스 검색 호출 테스트
- OpenAI 실제 요약 생성 테스트
- Supabase에 실제 수집 데이터 저장
- 로컬/preview에서 end-to-end 검증

### 내가 하지 말아야 하는 것

- 성욱 계정으로 회원가입/본인인증 대신 진행
- 언론사 기사 전문 무단 크롤링
- API 약관을 확인하지 않고 본문 저장/재배포
- 비밀키를 문서/커밋/로그에 출력
- 자동 publish부터 붙이기

## 성욱이 직접 해야 하는 것

### 필수

1. 공공데이터포털 계정 준비
2. 아래 API 활용신청
   - 국토교통부 아파트 매매 실거래가
   - 국토교통부 아파트 전월세 실거래가
   - 한국부동산원 청약홈 분양정보
   - 한국부동산원 청약 경쟁률/특별공급 신청현황
   - 한국부동산원 부동산통계 조회
3. 발급받은 키를 `.env` 또는 `.env.local`에 추가

```bash
DATA_GO_KR_SERVICE_KEY=
```

현재 이 값은 `.env`에 들어온 것으로 확인했다.

### 권장

1. 한국부동산원 R-ONE API 키/명세서 확인

```bash
REB_STATS_API_BASE_URL=https://www.reb.or.kr/r-one/openapi/
REB_STATS_API_DOC_URL=
REB_STATS_API_KEY=
```

현재 이 값들은 `.env`에 정식 변수명으로 들어온 것으로 확인했다.

2. 한국은행 ECOS 회원가입/API 키 발급

```bash
ECOS_API_KEY=
```

3. 네이버 개발자센터 애플리케이션 등록

```bash
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

### 선택

- 법제처 국가법령정보 Open API 신청
- 초반에 믿고 볼 언론/리포트/RSS 출처 10개 선정
- 관리자 계정으로 쓸 이메일 확정

```bash
ADMIN_EMAILS=
```

## 필요한 env 정리

### 이미 필요한 값

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_SUMMARY_MODEL=
APP_URL=
ADMIN_EMAILS=
RSS_INGEST_SECRET=
```

### 데이터 연동 추가 후보

```bash
DATA_GO_KR_SERVICE_KEY=
REB_STATS_API_BASE_URL=https://www.reb.or.kr/r-one/openapi/
REB_STATS_API_DOC_URL=
REB_STATS_API_KEY=
ECOS_API_KEY=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
LAW_OPEN_API_OC=
```

`LAW_OPEN_API_OC`는 법제처 Open API의 사용자 식별값/키를 저장하는 후보 이름이다. 실제 발급 방식 확인 후 이름은 조정할 수 있다.

## 구현 순서

### Phase 1: RSS + 관리자 큐레이션

목표: 키 없이도 실제 이슈 후보가 쌓이는 구조 만들기.

- RSS source allowlist 추가
- `/api/admin/rss/ingest`가 allowlist만 수집
- canonical URL 중복 방지
- pending 링크로 저장
- admin에서 승인/거절
- 승인된 링크에만 요약 생성

성공 기준:

- RSS ingest 후 pending 링크가 생긴다.
- 같은 RSS를 두 번 돌려도 중복 저장되지 않는다.
- 비admin은 ingest/승인 불가.

### Phase 2: 공공데이터 근거 보강

목표: 집집 요약이 그냥 뉴스 요약이 아니라 데이터 근거가 있는 브리핑이 되게 한다.

- 실거래가 adapter
- 전월세 adapter
- 청약/경쟁률 adapter
- R-ONE 부동산통계 adapter
- 링크 카테고리/지역 기준으로 관련 데이터 일부 첨부

성공 기준:

- 정책/청약/전세/매매 이슈 상세에서 관련 공공데이터 근거를 볼 수 있다.
- AI 요약 프롬프트에 근거 데이터가 들어간다.
- 근거와 추정이 분리되어 저장된다.

### Phase 3: 검색 API/법령/거시지표 보강

목표: 이슈 발견 범위와 해석 품질을 넓힌다.

- 네이버 뉴스 검색 후보 수집 route 추가: `POST /api/admin/naver/ingest`
- 데이터 소스 연결 점검 route 추가: `GET /api/admin/data/health`
- 네이버 뉴스 검색은 기사 전문을 저장하지 않고 제목/원문 링크/짧은 설명만 pending 링크로 저장한다
- ECOS/법령/공공데이터는 먼저 health check로 실제 응답을 확인하고, 다음 단계에서 요약 근거 데이터로 연결한다

- 네이버 뉴스 검색은 후보 발견용으로만 사용
- ECOS로 금리/거시지표 첨부
- 법제처 API로 법령/시행일 확인

성공 기준:

- 검색 API 결과는 원문 링크 후보로만 저장된다.
- 본문 전문 저장 없이 제목/링크/출처/요약 메타만 저장된다.
- 정책 이슈는 관련 법령/시행일 근거를 함께 보여줄 수 있다.

## 당장 다음 액션

추천 순서:

1. 나는 `DATA_GO_KR_SERVICE_KEY`, `REB_STATS_API_KEY` 기준으로 연결 테스트 구조를 만든다.
2. 성욱은 `ECOS_API_KEY`, `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`, `LAW_OPEN_API_OC`를 받으러 간다.
3. 나는 RSS allowlist + pending/admin 수집 흐름을 먼저 단단하게 만든다.
4. 키가 더 들어오면 실거래/청약/R-ONE 통계/ECOS/네이버 검색 adapter를 순서대로 붙인다.
5. 데이터 근거가 붙은 OpenAI 요약으로 넘어간다.

## 판단 기준

초반 집집의 품질은 데이터 양보다 큐레이션 품질이 더 중요하다.

따라서 "많이 긁기"가 아니라 "좋은 후보를 모으고, 승인하고, 짧게 해석하는 운영 흐름"을 먼저 만든다.
