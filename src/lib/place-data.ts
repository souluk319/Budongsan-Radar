import type { Region } from "@/lib/radar-data";

export type PlaceMetricTone = "good" | "watch" | "risk" | "neutral";

export type PlaceMetric = {
  label: string;
  value: string;
  caption: string;
  tone: PlaceMetricTone;
};

export type SituationNote = {
  label: "무주택자" | "1주택자" | "전세 세입자" | "투자자";
  status: "확인" | "관망" | "주의" | "기회";
  body: string;
};

export type RegionProfile = {
  id: string;
  name: Exclude<Region, "전국">;
  headline: string;
  summary: string;
  updatedAt: string;
  heatLabel: "뜨거움" | "관찰" | "혼조" | "차분함";
  evidenceLine: string;
  metrics: PlaceMetric[];
  situations: SituationNote[];
  watchItems: string[];
  relatedComplexIds: string[];
  isSample: boolean;
};

export type ComplexProfile = {
  id: string;
  name: string;
  regionId: string;
  regionName: Exclude<Region, "전국">;
  address: string;
  headline: string;
  summary: string;
  updatedAt: string;
  safetyLabel: "안정" | "확인" | "주의";
  metrics: PlaceMetric[];
  jeonseChecklist: Array<{
    label: string;
    status: "확인 필요" | "양호" | "주의";
    body: string;
  }>;
  linkedIssueIds: string[];
  isSample: boolean;
};

export const regionProfiles: RegionProfile[] = [
  {
    id: "seoul",
    name: "서울",
    headline: "대출·청약 이슈가 핵심 입지 쏠림을 다시 건드립니다",
    summary:
      "서울은 전체 평균보다 입지별 차이가 먼저 벌어지는 시장입니다. 오늘은 대출 기대와 청약 경쟁률을 같이 보고, 실제 거래 확산보다 월 상환액과 분양가 부담을 먼저 확인해야 합니다.",
    updatedAt: "2026-06-14T09:00:00+09:00",
    heatLabel: "뜨거움",
    evidenceLine: "공식 근거 3개 · ECOS/공공데이터/집집 샘플 관측",
    metrics: [
      {
        label: "오늘 중요도",
        value: "높음",
        caption: "정책·청약 이슈가 동시에 노출",
        tone: "risk",
      },
      {
        label: "실수요 체크",
        value: "상환액",
        caption: "대출 가능액보다 월 부담 우선",
        tone: "watch",
      },
      {
        label: "지역 온도",
        value: "쏠림",
        caption: "핵심 입지 위주로 반응",
        tone: "neutral",
      },
    ],
    situations: [
      {
        label: "무주택자",
        status: "확인",
        body: "청약과 매수 모두 현금 필요액과 월 상환액을 먼저 맞춰야 합니다.",
      },
      {
        label: "1주택자",
        status: "관망",
        body: "갈아타기는 기존 집 매도 기간과 잔금 일정을 같이 봐야 합니다.",
      },
      {
        label: "전세 세입자",
        status: "주의",
        body: "전세 유지와 매수 전환을 비교할 때 보증금 안전성을 빼면 안 됩니다.",
      },
      {
        label: "투자자",
        status: "주의",
        body: "핵심 입지 뉴스가 주변 구축까지 번지는지 공식 거래로 확인해야 합니다.",
      },
    ],
    watchItems: [
      "DSR/LTV 적용 대상과 시행일",
      "서울 주요 청약 경쟁률과 분양가 부담",
      "전세가율과 전세대출 금리 반영 시차",
    ],
    relatedComplexIds: ["seoul-sample-core"],
    isSample: true,
  },
  {
    id: "gyeonggi-incheon",
    name: "경기/인천",
    headline: "입주 물량이 많은 곳은 전세 협상력이 세입자 쪽으로 이동합니다",
    summary:
      "경기·인천은 신축 입주장과 광역 교통 이슈가 같이 움직입니다. 지역 평균보다 입주 시점, 전세 매물 증가 속도, 보증금 반환 가능성을 나눠서 봐야 합니다.",
    updatedAt: "2026-06-14T09:00:00+09:00",
    heatLabel: "관찰",
    evidenceLine: "공식 근거 3개 · 공공데이터 실거래/ECOS/집집 샘플 관측",
    metrics: [
      {
        label: "오늘 중요도",
        value: "보통",
        caption: "전세·교통 이슈 중심",
        tone: "watch",
      },
      {
        label: "세입자 체크",
        value: "협상",
        caption: "입주장 주변 조건 비교",
        tone: "good",
      },
      {
        label: "집주인 체크",
        value: "반환",
        caption: "보증금 반환 일정 확인",
        tone: "risk",
      },
    ],
    situations: [
      {
        label: "무주택자",
        status: "기회",
        body: "거주비를 낮출 수 있는 입주장 후보를 넓혀볼 수 있습니다.",
      },
      {
        label: "1주택자",
        status: "주의",
        body: "전세 만기가 겹치면 새 임차인 모집 기간과 반환 자금을 먼저 봐야 합니다.",
      },
      {
        label: "전세 세입자",
        status: "확인",
        body: "보증금, 옵션, 관리비를 같은 월 부담 기준으로 비교하세요.",
      },
      {
        label: "투자자",
        status: "주의",
        body: "역전세 리스크는 수익률보다 먼저 볼 현금흐름 문제입니다.",
      },
    ],
    watchItems: [
      "3개월 내 입주 단지와 전세 매물 증가 속도",
      "보증보험 가입 가능 여부",
      "교통 호재가 실제 출퇴근 시간을 줄이는지",
    ],
    relatedComplexIds: ["gyeonggi-sample-movein"],
    isSample: true,
  },
  {
    id: "regional-metro",
    name: "지방 광역시",
    headline: "상권과 공급 신호가 같이 움직이는 생활권만 골라 봐야 합니다",
    summary:
      "지방 광역시는 같은 도시 안에서도 상권 회복, 신축 공급, 미분양 흐름이 크게 갈립니다. 오늘은 가격보다 생활권 유지력과 임대 수요를 먼저 확인하는 편이 안전합니다.",
    updatedAt: "2026-06-14T09:00:00+09:00",
    heatLabel: "혼조",
    evidenceLine: "공식 근거 2개 · 공공데이터/집집 샘플 관측",
    metrics: [
      {
        label: "오늘 중요도",
        value: "보통",
        caption: "상권·공급 신호 혼재",
        tone: "neutral",
      },
      {
        label: "생활권 체크",
        value: "공실",
        caption: "생활 업종 유지 여부",
        tone: "watch",
      },
      {
        label: "가격 체크",
        value: "소진",
        caption: "미분양 소진 속도 확인",
        tone: "risk",
      },
    ],
    situations: [
      {
        label: "무주택자",
        status: "관망",
        body: "할인보다 실거주 만족도와 장기 수요를 같이 봐야 합니다.",
      },
      {
        label: "1주택자",
        status: "확인",
        body: "생활권 경쟁력이 유지되는지 매도 설명력을 점검하세요.",
      },
      {
        label: "전세 세입자",
        status: "관망",
        body: "신축 임대 조건과 관리비 포함 실거주비를 비교하세요.",
      },
      {
        label: "투자자",
        status: "주의",
        body: "수익률보다 공실 기간과 회수 가능성을 먼저 계산해야 합니다.",
      },
    ],
    watchItems: [
      "생활 업종 공실 변화",
      "준공 후 미분양 여부",
      "신축 임대 조건과 관리비",
    ],
    relatedComplexIds: ["metro-sample-life"],
    isSample: true,
  },
  {
    id: "regional-small-city",
    name: "지방 중소도시",
    headline: "미분양과 경매 신호는 가격보다 시장 체력을 먼저 보여줍니다",
    summary:
      "지방 중소도시는 한두 개 지표로 판단하기 어렵습니다. 미분양 소진, 경매 물건 수, 지역 일자리 흐름이 같이 나빠지는지 확인해야 합니다.",
    updatedAt: "2026-06-14T09:00:00+09:00",
    heatLabel: "차분함",
    evidenceLine: "공식 근거 2개 · 공공데이터/집집 샘플 관측",
    metrics: [
      {
        label: "오늘 중요도",
        value: "낮음",
        caption: "후행 지표 중심",
        tone: "neutral",
      },
      {
        label: "리스크 체크",
        value: "미분양",
        caption: "준공 후 잔여 여부",
        tone: "risk",
      },
      {
        label: "유동성 체크",
        value: "경매",
        caption: "물건 수와 유찰 흐름",
        tone: "watch",
      },
    ],
    situations: [
      {
        label: "무주택자",
        status: "관망",
        body: "가격 협상 여지가 있어도 장기 매도 가능성을 같이 봐야 합니다.",
      },
      {
        label: "1주택자",
        status: "주의",
        body: "보유 지역의 매도 기간과 호가 조정 압력을 확인하세요.",
      },
      {
        label: "전세 세입자",
        status: "확인",
        body: "거주 중인 집의 권리관계와 보증금 보호 순서를 다시 보세요.",
      },
      {
        label: "투자자",
        status: "주의",
        body: "싸 보이는 가격보다 회수 가능성과 공실 기간이 먼저입니다.",
      },
    ],
    watchItems: [
      "준공 후 미분양 소진 속도",
      "경매 물건 수와 낙찰가율",
      "일자리와 인구 이동",
    ],
    relatedComplexIds: [],
    isSample: true,
  },
];

export const complexProfiles: ComplexProfile[] = [
  {
    id: "seoul-sample-core",
    name: "서울 핵심입지 표본 단지",
    regionId: "seoul",
    regionName: "서울",
    address: "서울 생활권 표본",
    headline: "청약·대출 기대가 먼저 반응하는 단지군입니다",
    summary:
      "실제 매물이 아니라 단지 브리프 UI를 검증하기 위한 표본입니다. 나중에는 단지 식별자, 실거래, 관리비, 입주연차, 학군/교통 데이터를 연결합니다.",
    updatedAt: "2026-06-14T09:00:00+09:00",
    safetyLabel: "확인",
    metrics: [
      {
        label: "실거래 확인",
        value: "필요",
        caption: "최근 거래 건수와 층·면적 분리",
        tone: "watch",
      },
      {
        label: "전세 안전",
        value: "확인",
        caption: "전세가율과 선순위 조건",
        tone: "risk",
      },
      {
        label: "생활권",
        value: "강함",
        caption: "교통·학군·상권 수요",
        tone: "good",
      },
    ],
    jeonseChecklist: [
      {
        label: "보증보험",
        status: "확인 필요",
        body: "보증금과 선순위 채권 조건을 확인해야 합니다.",
      },
      {
        label: "확정일자",
        status: "확인 필요",
        body: "계약 후 신고와 확정일자 처리 여부가 핵심입니다.",
      },
      {
        label: "전세가율",
        status: "주의",
        body: "가격 기대가 높은 단지는 보증금이 매매가에 가까워지는지 봐야 합니다.",
      },
    ],
    linkedIssueIds: ["policy-loan-rule-watch", "seoul-subscription-competition"],
    isSample: true,
  },
  {
    id: "gyeonggi-sample-movein",
    name: "경기 입주장 표본 단지",
    regionId: "gyeonggi-incheon",
    regionName: "경기/인천",
    address: "경기/인천 입주장 표본",
    headline: "입주 물량이 전세 조건 협상을 만드는 구간입니다",
    summary:
      "입주장이 있는 단지는 가격보다 전세 물량, 옵션, 관리비, 보증금 반환 가능성을 같이 봐야 합니다.",
    updatedAt: "2026-06-14T09:00:00+09:00",
    safetyLabel: "주의",
    metrics: [
      {
        label: "입주 물량",
        value: "많음",
        caption: "세입자 선택지 증가",
        tone: "good",
      },
      {
        label: "반환 리스크",
        value: "확인",
        caption: "기존 집주인 현금흐름",
        tone: "risk",
      },
      {
        label: "대출 조건",
        value: "비교",
        caption: "은행별 금리와 한도",
        tone: "watch",
      },
    ],
    jeonseChecklist: [
      {
        label: "입주장 전세 물량",
        status: "양호",
        body: "비교 대상이 많을수록 조건 협상 여지가 생깁니다.",
      },
      {
        label: "등기·선순위",
        status: "확인 필요",
        body: "신축·준신축은 등기와 대출 설정 여부를 계약 전 확인해야 합니다.",
      },
      {
        label: "관리비",
        status: "확인 필요",
        body: "보증금만 낮아져도 관리비 포함 월 부담은 커질 수 있습니다.",
      },
    ],
    linkedIssueIds: ["gyeonggi-incheon-supply-risk", "monthly-rent-shift"],
    isSample: true,
  },
  {
    id: "metro-sample-life",
    name: "광역시 생활권 표본 단지",
    regionId: "regional-metro",
    regionName: "지방 광역시",
    address: "지방 광역시 생활권 표본",
    headline: "상권 유지력과 공급 부담을 같이 보는 단지군입니다",
    summary:
      "지방 광역시는 실거주 만족도와 공실·공급 흐름이 같이 움직입니다. 단지 브리프는 가격보다 생활권 유지력을 먼저 보여줘야 합니다.",
    updatedAt: "2026-06-14T09:00:00+09:00",
    safetyLabel: "확인",
    metrics: [
      {
        label: "생활 업종",
        value: "확인",
        caption: "상권 유지력",
        tone: "watch",
      },
      {
        label: "공급 부담",
        value: "혼조",
        caption: "미분양 소진 속도",
        tone: "risk",
      },
      {
        label: "임대 수요",
        value: "관찰",
        caption: "월세 전환 흐름",
        tone: "neutral",
      },
    ],
    jeonseChecklist: [
      {
        label: "전월세전환율",
        status: "확인 필요",
        body: "전세와 월세를 같은 월 부담 기준으로 비교해야 합니다.",
      },
      {
        label: "공실 리스크",
        status: "확인 필요",
        body: "생활권 수요가 약하면 임대 조건이 빨리 흔들릴 수 있습니다.",
      },
      {
        label: "관리비",
        status: "확인 필요",
        body: "실거주 비용은 월세와 관리비를 합쳐 봐야 합니다.",
      },
    ],
    linkedIssueIds: ["commercial-vacancy-signal", "regional-unsold-inventory"],
    isSample: true,
  },
];

export const jeonseSafetyChecklist = [
  {
    label: "보증보험 가능성",
    body: "HUG/HF/SGI 보증 가능 조건과 보증금 한도를 계약 전에 확인합니다.",
  },
  {
    label: "확정일자와 전입",
    body: "계약 후 신고, 확정일자, 전입신고가 실제 보호 순서에 영향을 줍니다.",
  },
  {
    label: "선순위 채권",
    body: "등기부상 근저당, 압류, 기존 임차인의 보증금 순서를 확인합니다.",
  },
  {
    label: "전세가율",
    body: "보증금이 매매가에 가까울수록 가격 하락 시 회수 리스크가 커집니다.",
  },
  {
    label: "입주 물량",
    body: "주변 입주 물량이 많으면 새 임차인 모집과 보증금 반환 시간이 달라질 수 있습니다.",
  },
] as const;

const regionByName = new Map(regionProfiles.map((profile) => [profile.name, profile]));
const regionById = new Map(regionProfiles.map((profile) => [profile.id, profile]));
const complexById = new Map(complexProfiles.map((profile) => [profile.id, profile]));

export function getRegionProfile(id: string) {
  return regionById.get(id);
}

export function getComplexProfile(id: string) {
  return complexById.get(id);
}

export function getRegionProfileByName(region: Region) {
  return region === "전국" ? undefined : regionByName.get(region);
}

export function getRegionHref(region: Region) {
  const profile = getRegionProfileByName(region);

  return profile ? `/regions/${profile.id}` : "/";
}

export function getComplexesForRegion(regionId: string) {
  return complexProfiles.filter((complex) => complex.regionId === regionId);
}
