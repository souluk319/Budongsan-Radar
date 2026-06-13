export const categories = [
  "정책",
  "대출/금리",
  "청약",
  "전세/월세",
  "매매시장",
  "재건축/재개발",
  "경매",
  "상권",
  "지역 이슈",
  "프롭테크",
] as const;

export const regions = [
  "전국",
  "서울",
  "경기/인천",
  "지방 광역시",
  "지방 중소도시",
] as const;

export type Category = (typeof categories)[number];
export type Region = (typeof regions)[number];

export type AudienceImpact = {
  homelessBuyer: string;
  oneHomeOwner: string;
  renter: string;
  investor: string;
};

export type RadarLink = {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  submittedAt: string;
  category: Category;
  regions: Region[];
  summaryBullets: string[];
  whyItMatters: string;
  audienceImpact: AudienceImpact;
  checkpoints: string[];
  score: number;
  isDailyPick: boolean;
  impactLine: string;
  readingMinutes: number;
  isSample: true;
};

export const radarLinks: RadarLink[] = [
  {
    id: "policy-loan-rule-watch",
    title: "대출 규제 완화 기대감이 다시 커지는 구간",
    sourceName: "샘플 정책 브리핑",
    sourceUrl: "https://example.com/demo/policy-loan-rule-watch",
    submittedAt: "2026-06-13",
    category: "정책",
    regions: ["전국", "서울", "경기/인천"],
    summaryBullets: [
      "대출 규제 완화 가능성이 시장 기대를 자극하는 샘플 이슈입니다.",
      "매수 여력이 늘어날 수 있지만 금리와 DSR 조건은 여전히 변수입니다.",
      "실수요자는 승인 가능액보다 월 상환 부담을 먼저 봐야 합니다.",
    ],
    whyItMatters:
      "대출 규제는 매수 수요가 실제 거래로 이어지는 속도를 결정합니다. 기대만으로 가격이 먼저 움직일 수 있어 확인 전 과열 신호를 경계해야 합니다.",
    audienceImpact: {
      homelessBuyer: "대출 가능액보다 안정적인 상환 계획을 먼저 점검해야 합니다.",
      oneHomeOwner: "갈아타기 수요가 늘면 선매수 리스크와 기존 집 매도 기간을 같이 봐야 합니다.",
      renter: "전세에서 매수 전환을 고민하는 세입자에게 심리적 압박이 커질 수 있습니다.",
      investor: "레버리지 투자 수요가 살아날 수 있지만 정책 확정 전 베팅은 위험합니다.",
    },
    checkpoints: [
      "실제 발표 여부와 시행일",
      "DSR, LTV, 생애최초 조건 변화",
      "거래량이 먼저 반응하는 지역",
    ],
    score: 92,
    isDailyPick: true,
    impactLine: "매수 여력과 시장 심리에 동시에 영향을 주는 정책 변수",
    readingMinutes: 3,
    isSample: true,
  },
  {
    id: "rate-cut-signal-jeonse",
    title: "금리 인하 기대와 전세 대출 부담 완화 관측",
    sourceName: "샘플 금융 리포트",
    sourceUrl: "https://example.com/demo/rate-cut-signal-jeonse",
    submittedAt: "2026-06-13",
    category: "대출/금리",
    regions: ["전국"],
    summaryBullets: [
      "금리 인하 기대가 주거비 부담 완화 기대와 연결되는 샘플입니다.",
      "전세 대출 금리 하락은 전세 수요를 다시 자극할 수 있습니다.",
      "금리 방향과 실제 은행 대출 조건은 시차가 있을 수 있습니다.",
    ],
    whyItMatters:
      "금리는 매수와 전세 선택의 기준점입니다. 대출 이자가 낮아지면 전세 유지 수요와 매수 전환 수요가 동시에 변할 수 있습니다.",
    audienceImpact: {
      homelessBuyer: "매수 전환 타이밍을 볼 때 금리보다 총 보유 비용을 같이 계산해야 합니다.",
      oneHomeOwner: "갈아타기 대출 부담이 낮아질 수 있지만 매도 가격 변수는 따로 봐야 합니다.",
      renter: "갱신 또는 이사 시점에 은행별 전세 대출 조건 비교가 중요합니다.",
      investor: "월세 전환 수익률과 대출 비용 사이의 차이를 다시 계산해야 합니다.",
    },
    checkpoints: [
      "기준금리와 은행 대출 금리 반영 시차",
      "전세가율 변화",
      "월세 전환율과 보증금 흐름",
    ],
    score: 88,
    isDailyPick: true,
    impactLine: "전세 유지와 매수 전환 판단에 모두 연결되는 금리 이슈",
    readingMinutes: 4,
    isSample: true,
  },
  {
    id: "seoul-subscription-competition",
    title: "서울 청약 경쟁률 회복, 핵심 입지 쏠림 강화",
    sourceName: "샘플 청약 데이터",
    sourceUrl: "https://example.com/demo/seoul-subscription-competition",
    submittedAt: "2026-06-12",
    category: "청약",
    regions: ["서울"],
    summaryBullets: [
      "서울 주요 입지 청약 경쟁률이 높아지는 흐름을 가정한 샘플입니다.",
      "분양가 부담에도 입지 선호는 강하게 유지됩니다.",
      "비인기 입지와의 양극화가 커질 수 있습니다.",
    ],
    whyItMatters:
      "청약 경쟁률은 실수요자의 선호와 미래 공급 기대를 동시에 보여줍니다. 같은 서울 안에서도 입지별 온도 차가 크게 벌어질 수 있습니다.",
    audienceImpact: {
      homelessBuyer: "가점과 자금 계획이 모두 맞는 단지만 선별해야 합니다.",
      oneHomeOwner: "갈아타기 청약은 처분 조건과 자금 시점을 함께 점검해야 합니다.",
      renter: "청약 대기와 전세 연장 비용을 비교해야 합니다.",
      investor: "청약 경쟁률만 보고 주변 구축까지 확장 해석하는 것은 위험합니다.",
    },
    checkpoints: [
      "특별공급과 일반공급 경쟁률 차이",
      "분양가와 주변 시세 차이",
      "입주 예정 물량",
    ],
    score: 86,
    isDailyPick: true,
    impactLine: "핵심 입지 선호가 강해지는지 확인하는 수요 온도계",
    readingMinutes: 3,
    isSample: true,
  },
  {
    id: "gyeonggi-incheon-supply-risk",
    title: "경기/인천 입주 물량 집중 구간의 전세가 압력",
    sourceName: "샘플 수급 노트",
    sourceUrl: "https://example.com/demo/gyeonggi-incheon-supply-risk",
    submittedAt: "2026-06-12",
    category: "전세/월세",
    regions: ["경기/인천"],
    summaryBullets: [
      "입주 물량이 많은 지역에서 전세가 조정 압력이 생기는 샘플입니다.",
      "신축 입주장은 세입자에게 선택지가 늘어나는 구간입니다.",
      "기존 구축 집주인은 전세 조건 조정 압박을 받을 수 있습니다.",
    ],
    whyItMatters:
      "입주 물량은 전세 가격을 가장 직접적으로 흔드는 변수 중 하나입니다. 지역 평균보다 단지별 입주 시점과 전세 물량을 봐야 합니다.",
    audienceImpact: {
      homelessBuyer: "매수 전 거주비를 낮출 기회가 생길 수 있습니다.",
      oneHomeOwner: "보유 주택 전세 만기가 겹치면 보증금 반환 계획을 점검해야 합니다.",
      renter: "이사 협상력이 커지는 구간일 수 있습니다.",
      investor: "역전세 리스크와 보증금 반환 유동성을 먼저 봐야 합니다.",
    },
    checkpoints: [
      "3개월 내 입주 단지 수",
      "전세 매물 증가 속도",
      "보증보험 가입 가능 여부",
    ],
    score: 84,
    isDailyPick: true,
    impactLine: "전세 협상력과 역전세 리스크를 동시에 보여주는 수급 신호",
    readingMinutes: 4,
    isSample: true,
  },
  {
    id: "reconstruction-safety-rules",
    title: "재건축 안전진단 기준 조정 논의 재부상",
    sourceName: "샘플 정비사업 메모",
    sourceUrl: "https://example.com/demo/reconstruction-safety-rules",
    submittedAt: "2026-06-11",
    category: "재건축/재개발",
    regions: ["서울", "경기/인천"],
    summaryBullets: [
      "재건축 초기 진입 장벽 완화 논의를 다룬 샘플 이슈입니다.",
      "사업 속도 기대가 커지면 노후 단지 가격이 먼저 반응할 수 있습니다.",
      "실제 사업성은 용적률, 분담금, 조합 동의율에 달려 있습니다.",
    ],
    whyItMatters:
      "재건축 규제 변화는 기대감이 먼저 가격에 반영되는 경우가 많습니다. 정책 문구보다 사업 단계와 분담금 현실성을 분리해서 봐야 합니다.",
    audienceImpact: {
      homelessBuyer: "노후 단지 매수는 실거주 편의와 장기 사업 기간을 함께 봐야 합니다.",
      oneHomeOwner: "보유 단지의 사업 단계와 추가 분담금 추정이 중요합니다.",
      renter: "사업 진척 지역은 이주 수요로 전세가가 흔들릴 수 있습니다.",
      investor: "초기 단계 단지는 기대 수익보다 시간 리스크가 더 클 수 있습니다.",
    },
    checkpoints: [
      "안전진단 통과 가능성",
      "조합 설립 전후 단계",
      "추정 분담금과 사업 기간",
    ],
    score: 83,
    isDailyPick: true,
    impactLine: "노후 단지 기대감과 실제 사업성의 간극을 확인할 이슈",
    readingMinutes: 5,
    isSample: true,
  },
  {
    id: "auction-volume-watch",
    title: "경매 물건 증가 신호, 지역별 스트레스 차이 확대",
    sourceName: "샘플 경매 대시보드",
    sourceUrl: "https://example.com/demo/auction-volume-watch",
    submittedAt: "2026-06-11",
    category: "경매",
    regions: ["전국", "지방 중소도시"],
    summaryBullets: [
      "경매 물건 증가를 시장 스트레스 신호로 보는 샘플입니다.",
      "낙찰가율 하락은 매매 심리 둔화를 보여줄 수 있습니다.",
      "지역별로 원인이 다르므로 단순 평균 해석은 위험합니다.",
    ],
    whyItMatters:
      "경매 지표는 가격 하락 압력과 대출 부담을 후행적으로 보여줍니다. 특정 지역에서 물건 수와 낙찰가율이 같이 흔들리면 주의 신호입니다.",
    audienceImpact: {
      homelessBuyer: "급매와 경매 가격을 비교해 매수 기준선을 잡을 수 있습니다.",
      oneHomeOwner: "보유 지역의 유동성 저하 신호인지 확인해야 합니다.",
      renter: "거주 중인 집의 권리관계와 보증금 보호를 점검해야 합니다.",
      investor: "낙찰가율보다 권리분석과 자금 조달 안정성이 우선입니다.",
    },
    checkpoints: [
      "물건 수 증가율",
      "낙찰가율 추이",
      "임차인 보증금 선순위 여부",
    ],
    score: 79,
    isDailyPick: true,
    impactLine: "시장 스트레스가 특정 지역에 쌓이는지 보는 후행 지표",
    readingMinutes: 4,
    isSample: true,
  },
  {
    id: "local-metro-extension",
    title: "광역 교통망 연장 기대가 외곽 주거지에 주는 영향",
    sourceName: "샘플 지역 이슈",
    sourceUrl: "https://example.com/demo/local-metro-extension",
    submittedAt: "2026-06-10",
    category: "지역 이슈",
    regions: ["경기/인천", "지방 광역시"],
    summaryBullets: [
      "교통 호재 기대가 외곽 지역 가격에 미치는 영향을 다룬 샘플입니다.",
      "착공 전 기대감과 개통 후 실사용성은 다를 수 있습니다.",
      "역 위치, 배차, 환승 시간까지 확인해야 합니다.",
    ],
    whyItMatters:
      "교통망은 주거지 선택에서 강력한 변수지만 장기 계획과 실제 생활 편익 사이에는 큰 차이가 있습니다.",
    audienceImpact: {
      homelessBuyer: "출퇴근 시간 단축이 실제 생활에 맞는지 보수적으로 봐야 합니다.",
      oneHomeOwner: "보유 지역의 매도 타이밍 기대가 생길 수 있습니다.",
      renter: "개통 전 임대료 상승 기대가 반영될 수 있습니다.",
      investor: "호재 선반영 가격과 실제 수요 유입 속도를 구분해야 합니다.",
    },
    checkpoints: [
      "예비타당성, 착공, 개통 단계",
      "역세권 실제 도보 거리",
      "주변 공급 물량",
    ],
    score: 77,
    isDailyPick: true,
    impactLine: "교통 호재가 실거주 편익인지 기대감인지 구분해야 하는 이슈",
    readingMinutes: 3,
    isSample: true,
  },
  {
    id: "commercial-vacancy-signal",
    title: "상권 공실률 변화가 주거 선호에 던지는 힌트",
    sourceName: "샘플 상권 리포트",
    sourceUrl: "https://example.com/demo/commercial-vacancy-signal",
    submittedAt: "2026-06-10",
    category: "상권",
    regions: ["서울", "지방 광역시"],
    summaryBullets: [
      "상권 공실률과 주거 선호의 연결을 보는 샘플입니다.",
      "상권 회복은 생활 편의와 임대 수요에 영향을 줄 수 있습니다.",
      "단기 유행 업종보다 꾸준한 생활 상권을 봐야 합니다.",
    ],
    whyItMatters:
      "상권은 주거 만족도와 임대 수요를 함께 보여주는 생활 지표입니다. 공실률 하락이 실제 유동인구 증가인지 확인해야 합니다.",
    audienceImpact: {
      homelessBuyer: "실거주 편의와 소음, 혼잡도를 같이 평가해야 합니다.",
      oneHomeOwner: "생활 편의 개선이 매도 경쟁력에 도움을 줄 수 있습니다.",
      renter: "상권 회복 지역은 월세 부담이 높아질 수 있습니다.",
      investor: "상가 투자와 주거 투자를 섞어 해석하면 위험합니다.",
    },
    checkpoints: [
      "공실률 추이",
      "생활 업종 비중",
      "야간 유동인구와 소음 민원",
    ],
    score: 72,
    isDailyPick: false,
    impactLine: "생활 편의와 임대 수요의 질을 가늠하는 보조 신호",
    readingMinutes: 3,
    isSample: true,
  },
  {
    id: "proptech-ai-valuation",
    title: "AI 시세 추정 서비스 확산과 소비자 판단 리스크",
    sourceName: "샘플 프롭테크 노트",
    sourceUrl: "https://example.com/demo/proptech-ai-valuation",
    submittedAt: "2026-06-09",
    category: "프롭테크",
    regions: ["전국"],
    summaryBullets: [
      "AI 시세 추정 도구가 늘어나는 흐름을 다룬 샘플입니다.",
      "자동 시세는 참고값이지 매수 가격의 정답이 아닙니다.",
      "거래 희소 지역에서는 오차가 커질 수 있습니다.",
    ],
    whyItMatters:
      "시세 추정은 초보자에게 기준점을 주지만 데이터가 부족한 단지에서는 잘못된 확신을 만들 수 있습니다.",
    audienceImpact: {
      homelessBuyer: "자동 시세와 최근 실거래, 매물 호가를 같이 비교해야 합니다.",
      oneHomeOwner: "보유 주택 가격을 과신하지 않도록 범위로 봐야 합니다.",
      renter: "전세 보증금 안전성 판단에 보조 지표로만 써야 합니다.",
      investor: "모델 오차가 큰 지역에서는 현장 수요 확인이 필요합니다.",
    },
    checkpoints: [
      "최근 거래 건수",
      "추정가 범위와 신뢰도",
      "호가와 실거래 괴리",
    ],
    score: 68,
    isDailyPick: false,
    impactLine: "AI 도구를 참고값으로 쓸지 판단할 때 필요한 주의 신호",
    readingMinutes: 3,
    isSample: true,
  },
  {
    id: "regional-unsold-inventory",
    title: "지방 중소도시 미분양 재고의 방향성 점검",
    sourceName: "샘플 미분양 브리핑",
    sourceUrl: "https://example.com/demo/regional-unsold-inventory",
    submittedAt: "2026-06-09",
    category: "매매시장",
    regions: ["지방 중소도시"],
    summaryBullets: [
      "미분양 재고 흐름을 지방 시장 온도계로 보는 샘플입니다.",
      "준공 후 미분양 증가는 가격 압력으로 이어질 수 있습니다.",
      "지역 산업과 인구 흐름을 같이 봐야 합니다.",
    ],
    whyItMatters:
      "미분양은 공급 과잉과 수요 약화를 보여주는 핵심 지표입니다. 특히 준공 후 미분양은 시장 흡수력 저하를 더 강하게 보여줍니다.",
    audienceImpact: {
      homelessBuyer: "가격 협상 여지가 생길 수 있지만 자산가치 리스크도 봐야 합니다.",
      oneHomeOwner: "보유 지역의 매도 기간이 길어질 가능성을 점검해야 합니다.",
      renter: "신축 임대 조건이 좋아질 수 있습니다.",
      investor: "할인 분양만 보고 진입하면 장기 공실 위험을 놓칠 수 있습니다.",
    },
    checkpoints: [
      "미분양과 준공 후 미분양 구분",
      "지역 일자리와 인구 이동",
      "분양가 할인 여부",
    ],
    score: 81,
    isDailyPick: true,
    impactLine: "지방 시장의 공급 부담과 가격 협상 여지를 보여주는 지표",
    readingMinutes: 4,
    isSample: true,
  },
  {
    id: "monthly-rent-shift",
    title: "월세 선호 확대가 전세 세입자에게 주는 압박",
    sourceName: "샘플 임대차 관찰",
    sourceUrl: "https://example.com/demo/monthly-rent-shift",
    submittedAt: "2026-06-08",
    category: "전세/월세",
    regions: ["전국", "서울"],
    summaryBullets: [
      "임대인의 월세 선호가 강해지는 흐름을 다룬 샘플입니다.",
      "전세 매물이 줄면 세입자의 선택지가 제한될 수 있습니다.",
      "월세 전환율과 보증금 안전성을 같이 봐야 합니다.",
    ],
    whyItMatters:
      "전세와 월세의 균형은 세입자의 현금흐름을 직접 바꿉니다. 단순 월세 금액보다 보증금, 대출 이자, 관리비를 합산해야 합니다.",
    audienceImpact: {
      homelessBuyer: "주거비 상승이 매수 압박으로 이어질 수 있습니다.",
      oneHomeOwner: "임대 조건 조정 여지가 생길 수 있지만 공실 리스크도 봐야 합니다.",
      renter: "전세 유지 비용과 월세 전환 비용을 숫자로 비교해야 합니다.",
      investor: "월세 수익률이 좋아져도 세입자 수요 한계를 확인해야 합니다.",
    },
    checkpoints: [
      "전월세 전환율",
      "관리비 포함 실거주비",
      "전세 매물 수 변화",
    ],
    score: 78,
    isDailyPick: true,
    impactLine: "세입자의 월 현금흐름을 직접 바꾸는 임대차 구조 변화",
    readingMinutes: 3,
    isSample: true,
  },
  {
    id: "first-home-tax-benefit",
    title: "생애최초 취득세 혜택 재점검이 필요한 이유",
    sourceName: "샘플 세금 체크",
    sourceUrl: "https://example.com/demo/first-home-tax-benefit",
    submittedAt: "2026-06-08",
    category: "정책",
    regions: ["전국"],
    summaryBullets: [
      "생애최초 구매자의 세금 혜택 조건을 점검하는 샘플입니다.",
      "혜택 대상과 주택 가격 기준을 놓치면 자금 계획이 흔들릴 수 있습니다.",
      "대출, 취득세, 이사비를 한 번에 계산해야 합니다.",
    ],
    whyItMatters:
      "첫 집 구매자는 매매가만 보고 예산을 세우기 쉽습니다. 취득세와 부대 비용은 실제 필요 현금을 크게 바꿉니다.",
    audienceImpact: {
      homelessBuyer: "생애최초 조건 충족 여부와 현금 필요액을 먼저 확인해야 합니다.",
      oneHomeOwner: "직접 영향은 작지만 갈아타기 세금 구조와 비교할 수 있습니다.",
      renter: "매수 전환 시 숨은 초기 비용을 확인하는 기준이 됩니다.",
      investor: "실수요 혜택이라 투자 판단에는 직접 적용하기 어렵습니다.",
    },
    checkpoints: [
      "생애최초 요건",
      "주택 가격 기준",
      "취득세 외 부대 비용",
    ],
    score: 74,
    isDailyPick: false,
    impactLine: "첫 집 구매자의 실제 현금 필요액을 바꾸는 세금 체크포인트",
    readingMinutes: 3,
    isSample: true,
  },
];

export function getDailyPicks(limit = 10) {
  return radarLinks
    .filter((link) => link.isDailyPick)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getTrendingLinks(limit = 5) {
  return [...radarLinks].sort((a, b) => b.score - a.score).slice(0, limit);
}

export function getLatestLinks(limit?: number) {
  const sorted = [...radarLinks].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  );

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function getLinkById(id: string) {
  return radarLinks.find((link) => link.id === id);
}

export function getRelatedLinks(current: RadarLink, limit = 3) {
  return radarLinks
    .filter((link) => link.id !== current.id)
    .map((link) => {
      const regionOverlap = link.regions.filter((region) =>
        current.regions.includes(region),
      ).length;
      const categoryScore = link.category === current.category ? 2 : 0;

      return {
        link,
        relevance: categoryScore + regionOverlap,
      };
    })
    .sort((a, b) => b.relevance - a.relevance || b.link.score - a.link.score)
    .slice(0, limit)
    .map((item) => item.link);
}

export function isCategory(value: string | undefined): value is Category {
  return categories.some((category) => category === value);
}

export function isRegion(value: string | undefined): value is Region {
  return regions.some((region) => region === value);
}

export function getFilteredLinks(category?: Category, region?: Region) {
  return getLatestLinks().filter((link) => {
    const categoryMatch = category ? link.category === category : true;
    const regionMatch = region ? link.regions.includes(region) : true;

    return categoryMatch && regionMatch;
  });
}

export function formatKoreanDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00+09:00`));
}
