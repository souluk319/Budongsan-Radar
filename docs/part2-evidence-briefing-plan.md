# 집집 Part2 - 근거 브리핑과 풀 모델 골격

작성일: 2026-06-14

## 한 줄 정의

Part2는 집집을 단순 뉴스 큐레이션에서 공식 근거가 붙은 부동산 의사결정 브리핑으로 올리는 단계다.

## 사용자에게 보여야 하는 변화

- 뉴스 제목만 모아둔 서비스가 아니라, 각 이슈마다 `근거 데이터`, `확인된 것`, `아직 모르는 것`이 붙는다.
- 홈과 리스트에서는 `공식 근거 n개` 같은 작은 신뢰 신호를 보여준다.
- 상세 페이지는 `요약 -> 왜 중요한가 -> 근거 데이터 -> 영향 대상 -> 체크포인트 -> 원문` 순서로 읽힌다.
- 관리자 화면은 `후보 수집 -> 근거 수집 -> AI 요약 -> 승인` 파이프라인으로 보인다.

## 풀 모델 골격

새 DB migration은 아래 엔터티를 추가한다.

- `regions`: 전국, 시도, 시군구, 동 단위 지역
- `complexes`: 아파트/주거 단지
- `buildings`: 건물 단위
- `units`: 호실/면적 단위 확장 슬롯
- `data_observations`: 공공데이터, 통계, 법령, 뉴스 맥락에서 뽑은 표준 관측값
- `link_observations`: 특정 뉴스/브리프와 관측값의 연결

기존 `links`, `summaries`에는 아래 상태를 추가한다.

- `evidence_count`
- `evidence_updated_at`
- `grounding_notes`
- `uncertainties`
- `source_observation_ids`

## 데이터 수집 원칙

- 원천 API 응답을 UI로 바로 흘리지 않는다.
- 모든 원천은 `EvidenceObservation` 표준 모델로 변환한다.
- 실제 값이 확인된 근거와 단순 연결 상태를 섞지 않는다.
- 실패한 API는 숨기지 않고 admin 경고로 반환한다.
- 비밀키가 포함된 URL이나 raw payload는 저장하지 않는다.

## Part2 1차 adapter

- ECOS: 기준금리 관측값
- 공공데이터포털: 아파트 실거래 표본 관측값
- 네이버 뉴스: 후보 링크의 기사 맥락
- 법제처: 법령 검색 adapter. 현재 로컬 응답은 `필수 입력값 없음`으로 확인되어 실패를 admin 경고로 노출한다.
- REB/R-ONE: 키와 문서 접근은 확인됐지만 실제 통계 endpoint 매핑은 다음 루프에서 확정한다.

## 구현 반영 상태

- Supabase migration 적용 완료: `regions`, `complexes`, `buildings`, `units`, `data_observations`, `link_observations`
- seed 적재 완료: links 12개, regions 4개, complexes 3개, buildings 3개, units 3개, evidence observations 28개
- 상세 페이지 `/links/[id]`에 `근거 데이터`, `확인된 것`, `아직 모르는 것`, `지역 브리프` 연결 추가
- 신규 공개 화면 추가:
  - `/regions/[id]`: 지역별 집값 뉴스 브리프
  - `/complexes/[id]`: 단지 브리프
  - `/tools/jeonse-check`: 전세 안전 체크
- 홈에서 전세 안전 체크와 지역 브리프 흐름으로 진입 가능
- production 배포 완료: `https://zipradar.vercel.app`
- 검증 완료: `npm run lint`, `npm run build`, `npm run verify:mvp`, 390px production 모바일 no-overflow

## 공개 화면 기준

- 공개 첫 화면에는 `MVP`, `DB 연결`, `Supabase`, `Budongsan Radar`, `RADAR`, `레이더 점수`를 노출하지 않는다.
- `오른다`, `내린다`, `사라`, `팔아라`, `AI가 예측`, `안전 보장`, `공식 인증`처럼 투자 조언/보증/중개 오인 문구를 쓰지 않는다.
- `샘플 데이터`는 정직하게 표시하되 첫 화면을 데모처럼 만들지 않도록 작은 메타로만 둔다.

## 관리자 기준

발행 전 운영자는 최소한 아래 상태를 볼 수 있어야 한다.

- 원문 후보
- 공식 근거 개수
- 요약 준비 여부
- 근거 수집 경고
- 승인/반려 액션

## 다음 루프

1. admin에서 실제 운영자 계정으로 `데이터 연결 점검 -> 네이버 후보 수집 -> 근거 수집 -> 요약 -> 승인`을 끝까지 실행
2. REB endpoint 명세를 기준으로 실제 지역 통계 adapter를 연결
3. 법제처 API 필수 파라미터를 맞춰 정책/법령 관측값을 정상 수집
4. 전세 안전 체크를 입력형 도구로 확장하고, 보증보험/등기/실거래/전세가율 관측값을 연결
5. 지역/단지 페이지를 DB 조회 기반으로 전환하고 관리자에서 지역/단지 매핑을 수정할 수 있게 만든다
