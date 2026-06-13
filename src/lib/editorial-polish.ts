import type { AudienceImpact, RadarLink } from "@/lib/radar-data";

type RadarLinkEditorialOverride = Partial<Omit<RadarLink, "audienceImpact">> & {
  audienceImpact?: Partial<AudienceImpact>;
};

const sampleSourceName = "집집 편집부";

const editorialOverrides: Record<string, RadarLinkEditorialOverride> = {
  "policy-loan-rule-watch": {
    title: "대출 완화 기대, 월상환액 먼저",
    sourceName: sampleSourceName,
    summaryBullets: [
      "규제 완화 기대만으로 매수 문의가 먼저 살아날 수 있습니다.",
      "다만 DSR, 금리, 시행일이 확정되기 전에는 실제 대출 가능액이 달라질 수 있습니다.",
      "오늘은 '얼마까지 되나'보다 '매달 얼마를 버티나'를 먼저 봐야 합니다.",
    ],
    whyItMatters:
      "대출 규제는 매수 심리를 가장 빨리 움직입니다. 하지만 기대감이 거래보다 먼저 뛰는 구간에서는 한도보다 월 상환액, 정책 시행일, 내 소득 안정성을 먼저 확인해야 합니다.",
    audienceImpact: {
      homelessBuyer: "한도가 늘어나는지보다 매달 버틸 수 있는 상환액을 먼저 계산하세요.",
      oneHomeOwner: "갈아타기는 선매수보다 기존 집 매도 기간과 잔금 일정을 먼저 봐야 합니다.",
      renter: "전세에서 매수로 옮길지 고민한다면 대출 가능액보다 현금 여유를 확인하세요.",
      investor: "정책 확정 전 레버리지 베팅은 수익보다 변동성 노출이 먼저 커질 수 있습니다.",
    },
    checkpoints: [
      "정책 발표 여부와 실제 시행일",
      "DSR, LTV, 생애최초 조건 변화",
      "내 월 상환액과 비상 현금 여유",
    ],
    impactLine: "한도가 늘어도 월상환액이 감당되는지 먼저입니다.",
  },
  "rate-cut-signal-jeonse": {
    title: "전세대출 금리 기대, 세입자에게 바로 좋은 뉴스는 아닙니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "금리 인하 기대는 전세대출 부담을 낮출 수 있습니다.",
      "동시에 전세 수요가 되살면 좋은 매물의 보증금은 다시 버틸 수 있습니다.",
      "은행 금리 반영에는 시차가 있어 실제 조건 확인이 먼저입니다.",
    ],
    whyItMatters:
      "금리는 전세 유지와 매수 전환을 동시에 흔듭니다. 이자가 조금 낮아져도 전세 수요가 몰리면 보증금 협상력은 줄 수 있어, 세입자는 금리와 매물 수를 같이 봐야 합니다.",
    audienceImpact: {
      homelessBuyer: "매수 전환을 고민한다면 금리보다 총 주거비와 현금 여유를 같이 계산하세요.",
      renter: "대출 금리만 보지 말고 같은 지역 전세 매물 수와 보증금 흐름을 같이 확인하세요.",
      investor: "월세 수익률 계산은 대출 비용과 공실 가능성을 함께 넣어야 합니다.",
    },
    impactLine: "이자가 내려도 전세 수요가 몰리면 보증금은 쉽게 내려오지 않습니다.",
  },
  "seoul-subscription-competition": {
    title: "서울 청약 회복, 좋은 입지만 더 뜨거워졌습니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "서울 핵심 입지 청약 경쟁률이 다시 강해지는 흐름입니다.",
      "분양가 부담이 있어도 입지 선호는 쉽게 꺾이지 않습니다.",
      "비인기 입지까지 같이 좋아졌다고 확대 해석하면 위험합니다.",
    ],
    whyItMatters:
      "청약 경쟁률은 실수요가 어디에 몰리는지 보여주는 빠른 신호입니다. 전체 시장 반등보다 '어떤 입지만 살아나는지'를 구분해야 내 청약 전략이 흐려지지 않습니다.",
    audienceImpact: {
      homelessBuyer: "가점, 현금, 입주 시점이 모두 맞는 단지만 좁혀서 보세요.",
      oneHomeOwner: "갈아타기 청약은 처분 조건과 잔금 일정이 핵심 리스크입니다.",
      investor: "핵심 입지 경쟁률을 주변 구축 상승으로 바로 연결하면 과한 해석일 수 있습니다.",
    },
    impactLine: "청약 온도는 올라왔지만, 회복은 입지별로 갈립니다.",
  },
  "gyeonggi-incheon-supply-risk": {
    title: "경기·인천 입주장, 세입자에게 협상 시간이 옵니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "입주 물량이 몰린 지역은 전세 선택지가 늘어날 수 있습니다.",
      "신축 입주장은 세입자에게 가격과 조건을 비교할 시간을 줍니다.",
      "집주인은 만기와 보증금 반환 일정을 먼저 점검해야 합니다.",
    ],
    whyItMatters:
      "입주 물량은 전세 가격을 직접 흔듭니다. 평균 전세가보다 실제 입주 단지, 만기 물량, 전세 매물 증가 속도가 세입자와 집주인의 협상력을 가릅니다.",
    audienceImpact: {
      oneHomeOwner: "전세 만기가 겹치면 보증금 반환 자금과 새 임차인 모집 기간을 먼저 보세요.",
      renter: "이사 가능 지역을 넓히면 보증금과 옵션을 더 유리하게 비교할 수 있습니다.",
      investor: "역전세 리스크는 수익률보다 먼저 확인해야 할 현금흐름 문제입니다.",
    },
    impactLine: "입주 물량이 많은 곳은 전세 협상력이 세입자 쪽으로 잠시 이동합니다.",
  },
  "reconstruction-safety-rules": {
    title: "재건축 규제 완화론, 가격보다 분담금을 먼저 보세요",
    sourceName: sampleSourceName,
    summaryBullets: [
      "규제 완화 기대가 노후 단지 가격을 먼저 움직일 수 있습니다.",
      "하지만 사업 속도는 조합, 용적률, 분담금에 따라 크게 갈립니다.",
      "초기 단계 단지는 기대감과 실제 사업성을 분리해서 봐야 합니다.",
    ],
    whyItMatters:
      "재건축은 뉴스보다 시간이 더 큰 변수입니다. 규제가 완화돼도 분담금과 주민 동의가 맞지 않으면 가격 기대가 오래 버티기 어렵습니다.",
    audienceImpact: {
      oneHomeOwner: "보유 단지의 사업 단계와 추정 분담금을 숫자로 확인하세요.",
      renter: "이주 수요가 생길 지역은 전세가가 먼저 흔들릴 수 있습니다.",
      investor: "초기 재건축은 기대수익보다 시간 리스크가 더 크게 작동할 수 있습니다.",
    },
    impactLine: "규제 뉴스보다 내 단지의 사업성과 분담금이 더 중요합니다.",
  },
  "auction-volume-watch": {
    title: "경매 물건 증가, 싼 매물보다 지역 스트레스 신호입니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "경매 물건이 늘어나는 곳은 가격보다 먼저 유동성 약화를 의심해야 합니다.",
      "낙찰가율이 같이 내려가면 매수자가 보는 적정 가격이 낮아지고 있다는 뜻입니다.",
      "지역 평균보다 물건이 몰리는 동네와 권리관계를 따로 봐야 합니다.",
    ],
    whyItMatters:
      "경매는 시장이 힘들어진 뒤에 나타나는 후행 신호입니다. 하지만 물건 수와 유찰 흐름이 같이 움직이면 그 지역의 매도 압력과 대출 부담이 쌓이고 있다는 힌트가 됩니다.",
    audienceImpact: {
      homelessBuyer: "급매와 경매 가격을 비교해 내 매수 기준선을 낮춰 잡을 수 있습니다.",
      oneHomeOwner: "보유 지역에서 유찰이 늘면 매도 기간이 길어질 가능성을 봐야 합니다.",
      renter: "거주 중인 집의 등기와 보증금 보호 순위를 한 번 더 확인하세요.",
      investor: "싸 보이는 가격보다 권리관계와 잔금 조달 안정성이 먼저입니다.",
    },
    checkpoints: [
      "최근 3개월 물건 수와 유찰 횟수",
      "낙찰가율이 같이 내려가는지",
      "선순위 권리와 임차인 보증금",
    ],
    impactLine: "낙찰가보다 물건 수와 유찰 흐름이 지역 체력을 보여줍니다.",
  },
  "local-metro-extension": {
    title: "교통 호재 뉴스, 개통보다 '내 동선'이 먼저입니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "노선 연장 기대는 외곽 주거지 가격을 먼저 움직일 수 있습니다.",
      "하지만 착공 전 호재와 개통 후 생활 편익은 다른 문제입니다.",
      "역까지 실제 거리, 배차, 환승 시간을 확인해야 과한 기대를 피할 수 있습니다.",
    ],
    whyItMatters:
      "교통 호재는 부동산에서 가장 강한 기대 재료 중 하나입니다. 다만 뉴스가 가격에 먼저 반영된 뒤 실제 출퇴근 편익이 따라오지 않으면 실거주 만족도와 재매도 경쟁력이 엇갈릴 수 있습니다.",
    audienceImpact: {
      homelessBuyer: "출퇴근 시간이 실제로 줄어드는지 지도 앱 기준으로 먼저 계산하세요.",
      oneHomeOwner: "호재 발표 직후 가격 기대가 생길 수 있지만 매도 타이밍은 단계별로 봐야 합니다.",
      renter: "개통 기대 지역은 임대료가 먼저 움직일 수 있어 이사 시점을 비교하세요.",
      investor: "호재가 이미 가격에 얼마나 반영됐는지 주변 실거래와 같이 봐야 합니다.",
    },
    checkpoints: [
      "예타, 착공, 개통 중 현재 단계",
      "집에서 역까지 실제 도보 시간",
      "개통 전후 주변 공급 물량",
    ],
    impactLine: "노선 발표보다 실제 역 거리와 환승 시간이 생활 가치를 가릅니다.",
  },
  "commercial-vacancy-signal": {
    title: "상권 공실률이 줄면 집값보다 생활권이 먼저 바뀝니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "공실이 줄어드는 상권은 생활 편의와 유동 인구가 회복되는 신호일 수 있습니다.",
      "주거지에는 집값보다 먼저 임대 수요와 동네 체감 분위기로 나타납니다.",
      "단기 유행 업종보다 병원, 학원, 식음, 생활 서비스가 버티는지 봐야 합니다.",
    ],
    whyItMatters:
      "상권은 숫자보다 생활감이 먼저 느껴지는 지표입니다. 공실률 하락이 실제 소비와 방문으로 이어지면 주변 주거 선호와 임대 안정성에도 영향을 줍니다.",
    audienceImpact: {
      homelessBuyer: "살기 편해지는 신호인지, 소음과 혼잡이 늘어나는 신호인지 같이 보세요.",
      oneHomeOwner: "생활권 경쟁력이 좋아지면 매도 설명력이 생길 수 있습니다.",
      renter: "상권 회복 지역은 월세와 관리비 부담이 올라갈 수 있습니다.",
      investor: "상가 회복을 주거 가격 상승으로 바로 연결하지 말고 임차 수요를 따로 확인하세요.",
    },
    checkpoints: [
      "생활 업종 비중",
      "야간 유동인구와 소음 민원",
      "공실 감소가 일시 이벤트인지",
    ],
    impactLine: "상권 회복은 가격보다 거주 만족도와 임대 수요에 먼저 나타납니다.",
  },
  "proptech-ai-valuation": {
    title: "AI 시세는 기준점일 뿐, 가격표가 아닙니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "AI 시세는 대략적인 범위를 잡는 데는 도움이 됩니다.",
      "거래가 적은 단지나 특수 매물은 오차가 커질 수 있습니다.",
      "자동 시세보다 최근 실거래, 호가, 층·향·수리 상태를 같이 봐야 합니다.",
    ],
    whyItMatters:
      "자동 시세는 초보자에게 기준점을 주지만 확신을 과하게 만들기도 합니다. 특히 거래가 드문 단지는 모델이 과거 가격이나 주변 평균에 끌려가 실제 협상 가격과 벌어질 수 있습니다.",
    audienceImpact: {
      homelessBuyer: "자동 시세를 매수 상한선으로 쓰지 말고 최근 실거래 범위와 비교하세요.",
      oneHomeOwner: "내 집 가격을 단일 숫자보다 가능한 매도 범위로 봐야 합니다.",
      renter: "전세 보증금이 시세 대비 과한지 확인할 때 보조 지표로만 쓰세요.",
      investor: "모델 숫자보다 거래량과 임대 수요를 먼저 확인하세요.",
    },
    checkpoints: [
      "최근 6개월 실거래 건수",
      "호가와 실거래가의 차이",
      "같은 단지 안 층·향·수리 상태",
    ],
    impactLine: "거래가 적은 단지는 자동 시세보다 최근 실거래와 호가 괴리가 더 중요합니다.",
  },
  "regional-unsold-inventory": {
    title: "지방 미분양, 할인보다 오래 팔리는지를 봐야 합니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "미분양이 줄지 않는 지역은 수요가 가격을 따라오지 못하고 있다는 신호입니다.",
      "준공 후 미분양은 단순 공급 부담보다 더 강한 경고로 봐야 합니다.",
      "할인 분양보다 팔리는 속도와 지역 일자리 흐름을 같이 확인해야 합니다.",
    ],
    whyItMatters:
      "미분양은 지역 시장의 흡수력을 보여줍니다. 특히 준공 후에도 물량이 남으면 가격 할인, 임대 전환, 주변 구축 가격 압박으로 이어질 수 있습니다.",
    audienceImpact: {
      homelessBuyer: "가격 협상 여지는 커질 수 있지만 장기 자산가치 리스크도 같이 봐야 합니다.",
      oneHomeOwner: "보유 지역의 매도 기간과 호가 조정 압력이 커질 수 있습니다.",
      renter: "신축 임대 조건이 좋아질 수 있어 선택지를 넓혀볼 만합니다.",
      investor: "할인율보다 공실 기간과 회수 가능성을 먼저 계산하세요.",
    },
    checkpoints: [
      "미분양과 준공 후 미분양 구분",
      "최근 3개월 소진 속도",
      "지역 일자리와 인구 이동",
    ],
    impactLine: "준공 후 미분양은 가격보다 시장 흡수력이 약해졌다는 신호입니다.",
  },
  "monthly-rent-shift": {
    title: "월세 전환 압박, 세입자는 월 현금흐름부터 봐야 합니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "임대인이 전세보다 월세를 선호하면 세입자의 선택지가 줄 수 있습니다.",
      "보증금이 낮아져도 월세와 관리비가 늘면 실제 부담은 커질 수 있습니다.",
      "전세대출 이자와 월세를 같은 월 단위로 비교해야 합니다.",
    ],
    whyItMatters:
      "전세에서 월세로 무게가 옮겨가면 세입자의 월 현금흐름이 바로 바뀝니다. 겉으로 보이는 보증금보다 대출이자, 월세, 관리비를 합친 실제 부담이 핵심입니다.",
    audienceImpact: {
      homelessBuyer: "주거비 상승이 매수 압박으로 이어져도 무리한 매수는 피해야 합니다.",
      oneHomeOwner: "임대 조건을 바꿀 여지가 생기지만 공실 가능성도 같이 봐야 합니다.",
      renter: "전세 유지 비용과 월세 전환 비용을 같은 기준으로 비교하세요.",
      investor: "월세 수익률이 좋아 보여도 세입자 부담 한계를 확인해야 합니다.",
    },
    checkpoints: [
      "전세대출 이자와 월세의 월 부담 비교",
      "관리비 포함 실거주비",
      "같은 지역 전세 매물 수",
    ],
    impactLine: "보증금, 대출이자, 관리비를 합친 실제 월 부담이 핵심입니다.",
  },
  "first-home-tax-benefit": {
    title: "생애최초 혜택, 집값보다 현금 필요액을 바꿉니다",
    sourceName: sampleSourceName,
    summaryBullets: [
      "생애최초 혜택은 집값을 낮추기보다 초기 현금 부담을 줄이는 변수입니다.",
      "대상 조건과 주택 가격 기준을 놓치면 잔금 계획이 흔들릴 수 있습니다.",
      "취득세, 중개보수, 이사비, 수리비까지 한 번에 잡아야 합니다.",
    ],
    whyItMatters:
      "첫 집을 살 때는 매매가만 보고 예산을 잡기 쉽습니다. 실제로는 세금과 부대비용이 잔금일 현금 부족을 만들 수 있어, 혜택 적용 여부가 구매 가능성을 바꿉니다.",
    audienceImpact: {
      homelessBuyer: "혜택 조건과 잔금일 필요 현금을 먼저 표로 정리하세요.",
      oneHomeOwner: "직접 혜택은 작지만 갈아타기 세금 구조와 비교해볼 수 있습니다.",
      renter: "매수 전환을 고민한다면 월세 절감보다 초기 현금 부족 여부가 먼저입니다.",
      investor: "실수요 혜택이라 투자 판단에는 거의 직접 적용되지 않습니다.",
    },
    checkpoints: [
      "생애최초 요건과 소득 기준",
      "주택 가격 기준",
      "취득세 외 잔금일 부대비용",
    ],
    impactLine: "취득세와 부대비용은 첫 집 구매자의 실제 필요 현금을 크게 바꿉니다.",
  },
};

export function polishRadarLink(link: RadarLink): RadarLink {
  const override = editorialOverrides[link.id];

  if (!override) {
    return link;
  }

  return {
    ...link,
    ...override,
    audienceImpact: {
      ...link.audienceImpact,
      ...override.audienceImpact,
    },
  };
}

export function polishRadarLinks(links: RadarLink[]) {
  return links.map(polishRadarLink);
}
