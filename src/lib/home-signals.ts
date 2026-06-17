import { type Category, type RadarLink, type Region } from "@/lib/radar-data";

export type SignalLabel = "강한 신호" | "지켜볼 신호" | "소음 가능성";
export type SignalTone = "strong" | "watch" | "noise";
export type RegionHeatTone = "hot" | "watch" | "mixed" | "cool";
export type AudienceStatus = "주의" | "관망" | "확인" | "기회";
export type UserQuestionKey =
  | "loan"
  | "rent"
  | "subscription"
  | "neighborhood"
  | "timing";
export type UserQuestionIntensity = "high" | "medium" | "low";

export type AudienceSegment = {
  label: "무주택자" | "1주택자" | "전세 세입자" | "투자자";
  status: AudienceStatus;
  body: string;
};

export type RegionFlow = {
  region: Exclude<Region, "전국">;
  count: number;
  topic: string;
  status: string;
  tone: SignalTone;
  heatTone: RegionHeatTone;
  heatLabel: "HOT" | "WATCH" | "MIXED" | "COOL";
  heatPercent: number;
  signalScore: number;
};

export type UserQuestionSignal = {
  key: UserQuestionKey;
  label: string;
  question: string;
  answer: string;
  action: string;
  href: string;
  score: number;
  intensity: UserQuestionIntensity;
  status: AudienceStatus;
};

export type HomeSignalModel = {
  dateLabel: string;
  moodLabel: "관망" | "반등 신호" | "과열 주의" | "냉각" | "혼조";
  dailyQuestionHeadline: string;
  briefHeadline: string;
  briefSummary: string;
  importanceLabel: "높음" | "보통" | "낮음";
  heroVerdict: string;
  heroSubVerdict: string;
  heroMemoryLine: string;
  heroScore: number;
  todayPickDisplayTitle: string;
  todayActionLine: string;
  primaryQuestion: UserQuestionSignal;
  userQuestions: UserQuestionSignal[];
  keywords: string[];
  strongestLink?: RadarLink;
  strongLinks: RadarLink[];
  watchLinks: RadarLink[];
  noiseLinks: RadarLink[];
  signalTapeLinks: RadarLink[];
  audienceSegments: AudienceSegment[];
  primaryAudience: AudienceSegment;
  regionFlows: RegionFlow[];
  strongSignalCount: number;
  watchSignalCount: number;
  totalIssues: number;
  visibleIssues: number;
  totalDailyPicks: number;
};

const regionFlowRegions: Array<Exclude<Region, "전국">> = [
  "서울",
  "경기/인천",
  "지방 광역시",
  "지방 중소도시",
];

const categoryAudienceMap: Record<Category, AudienceSegment["label"][]> = {
  정책: ["무주택자", "1주택자"],
  "대출/금리": ["무주택자", "전세 세입자"],
  청약: ["무주택자", "1주택자"],
  "전세/월세": ["전세 세입자", "1주택자"],
  매매시장: ["무주택자", "1주택자"],
  "재건축/재개발": ["1주택자", "투자자"],
  경매: ["투자자", "1주택자"],
  상권: ["투자자"],
  "지역 이슈": ["1주택자", "전세 세입자"],
  프롭테크: ["무주택자", "투자자"],
};

const questionDefinitions: Array<
  Omit<UserQuestionSignal, "score" | "intensity"> & {
    categories: Category[];
    fallbackScore: number;
  }
> = [
  {
    key: "loan",
    label: "대출 조건",
    question: "월상환액 버틸까",
    answer: "한도보다 월상환액과 시행일을 먼저 봅니다.",
    action: "월상환액 먼저",
    href: "/?category=%EB%8C%80%EC%B6%9C%2F%EA%B8%88%EB%A6%AC",
    status: "확인",
    categories: ["정책", "대출/금리"],
    fallbackScore: 58,
  },
  {
    key: "rent",
    label: "전세 안전",
    question: "보증금 위험 없나",
    answer: "보증보험, 선순위, 전세가율을 같이 확인합니다.",
    action: "보증금 점검",
    href: "/?category=%EC%A0%84%EC%84%B8%2F%EC%9B%94%EC%84%B8",
    status: "주의",
    categories: ["전세/월세", "대출/금리"],
    fallbackScore: 54,
  },
  {
    key: "subscription",
    label: "청약 기회",
    question: "분양가·입지 맞나",
    answer: "경쟁률보다 분양가, 입지, 입주 물량을 봅니다.",
    action: "분양가 확인",
    href: "/?category=%EC%B2%AD%EC%95%BD",
    status: "관망",
    categories: ["청약", "정책"],
    fallbackScore: 48,
  },
  {
    key: "neighborhood",
    label: "우리동네",
    question: "전세·거래 흔들리나",
    answer: "지역 기사보다 거래, 전세, 공급 흐름을 같이 봅니다.",
    action: "지역 흐름 보기",
    href: "/regions/seoul",
    status: "확인",
    categories: ["지역 이슈", "매매시장", "재건축/재개발"],
    fallbackScore: 46,
  },
  {
    key: "timing",
    label: "매수 타이밍",
    question: "정책 확정 전 관망할까",
    answer: "가격보다 거래량과 정책 확정 여부를 먼저 봅니다.",
    action: "정책 확정 전 관망",
    href: "/?category=%EB%A7%A4%EB%A7%A4%EC%8B%9C%EC%9E%A5",
    status: "관망",
    categories: ["매매시장", "경매", "재건축/재개발", "정책"],
    fallbackScore: 44,
  },
];

type HomeLeadCopy = Pick<
  HomeSignalModel,
  "briefHeadline" | "briefSummary" | "heroMemoryLine"
>;

const homeLeadCopyById: Record<string, HomeLeadCopy> = {
  "policy-loan-rule-watch": {
    briefHeadline: "대출보다 상환액을 먼저 볼 때",
    briefSummary:
      "한도가 늘어도 매달 버틸 수 없다면 좋은 뉴스가 아닙니다.",
    heroMemoryLine:
      "오늘은 대출 가능액보다 월 상환액을 먼저 확인하세요.",
  },
  "rate-cut-signal-jeonse": {
    briefHeadline: "전세대출 기대감, 보증금 흐름도 같이 볼 때",
    briefSummary:
      "이자가 내려도 좋은 전세 매물이 부족하면 세입자 협상력은 크게 늘지 않습니다.",
    heroMemoryLine:
      "금리보다 내 지역 전세 매물 수를 같이 확인하세요.",
  },
  "seoul-subscription-competition": {
    briefHeadline: "서울 청약은 다시 뜨겁지만, 입지는 더 갈립니다",
    briefSummary:
      "경쟁률 회복을 전체 반등으로 읽기보다 어느 입지에 수요가 몰리는지 봐야 합니다.",
    heroMemoryLine:
      "청약 온도는 올라왔지만 회복은 입지별로 다릅니다.",
  },
};

function getHomeLeadCopy(strongestLink: RadarLink | undefined) {
  return strongestLink ? homeLeadCopyById[strongestLink.id] : undefined;
}

export function getSignalLabel(score: number): SignalLabel {
  if (score >= 86) {
    return "강한 신호";
  }

  if (score >= 75) {
    return "지켜볼 신호";
  }

  return "소음 가능성";
}

export function getSignalTone(score: number): SignalTone {
  if (score >= 86) {
    return "strong";
  }

  if (score >= 75) {
    return "watch";
  }

  return "noise";
}

export function getAffectedAudienceLabels(link: RadarLink) {
  return [...new Set(categoryAudienceMap[link.category])].slice(0, 3);
}

function getDateLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
}

function sortBySignal(links: RadarLink[]) {
  return [...links].sort((a, b) => b.score - a.score);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function deriveMoodLabel(links: RadarLink[]): HomeSignalModel["moodLabel"] {
  const sortedLinks = sortBySignal(links);
  const topScore = sortedLinks[0]?.score ?? 0;
  const strongCount = links.filter((link) => link.score >= 86).length;

  if (topScore >= 90) {
    return "반등 신호";
  }

  if (strongCount >= 4) {
    return "과열 주의";
  }

  if (topScore < 70) {
    return "냉각";
  }

  return "혼조";
}

function deriveKeywords(strongestLink: RadarLink | undefined, links: RadarLink[]) {
  const candidates = [
    strongestLink?.category,
    strongestLink?.regions.find((region) => region !== "전국"),
    ...links.flatMap((link) => [link.category, ...link.regions]),
  ].filter(
    (item): item is Category | Exclude<Region, "전국"> =>
      Boolean(item && item !== "전국"),
  );

  return [...new Set(candidates)].slice(0, 3);
}

function deriveAudienceSegments(link: RadarLink | undefined): AudienceSegment[] {
  if (!link) {
    return [
      { label: "무주택자", status: "관망", body: "오늘 볼 만한 이슈를 수집 중입니다." },
      { label: "1주택자", status: "관망", body: "보유 주택과 연결되는 변수를 확인하세요." },
      { label: "전세 세입자", status: "관망", body: "전세 비용과 보증금 안전성을 같이 보세요." },
      { label: "투자자", status: "관망", body: "투자 판단보다 리스크 체크를 먼저 두세요." },
    ];
  }

  const renterStatus: AudienceStatus =
    link.category === "전세/월세" || link.category === "대출/금리" ? "주의" : "관망";
  const investorStatus: AudienceStatus = link.score >= 86 ? "주의" : "관망";

  return [
    {
      label: "무주택자",
      status: link.score >= 75 ? "확인" : "관망",
      body: link.audienceImpact.homelessBuyer,
    },
    {
      label: "1주택자",
      status: link.category === "매매시장" ? "확인" : "관망",
      body: link.audienceImpact.oneHomeOwner,
    },
    {
      label: "전세 세입자",
      status: renterStatus,
      body: link.audienceImpact.renter,
    },
    {
      label: "투자자",
      status: investorStatus,
      body: link.audienceImpact.investor,
    },
  ];
}

function selectPrimaryAudience(segments: AudienceSegment[]) {
  const statusRank: Record<AudienceStatus, number> = {
    주의: 4,
    확인: 3,
    기회: 2,
    관망: 1,
  };

  return [...segments].sort((a, b) => statusRank[b.status] - statusRank[a.status])[0];
}

function deriveHeroVerdict(strongestLink: RadarLink | undefined, links: RadarLink[]) {
  if (!strongestLink) {
    return "오늘 볼 만한 부동산 이슈를 모으는 중입니다";
  }

  const categories = new Set(links.map((link) => link.category));
  const hasLoanOrPolicy =
    categories.has("정책") || categories.has("대출/금리");
  const hasSubscription = categories.has("청약");

  if (hasLoanOrPolicy && hasSubscription) {
    return "오늘은 대출과 청약이 시장을 밀고 있습니다";
  }

  if (strongestLink.category === "전세/월세") {
    return "오늘은 전세 압력이 시장을 흔들고 있습니다";
  }

  if (strongestLink.category === "재건축/재개발") {
    return "오늘은 정비사업 기대감이 가격을 건드립니다";
  }

  if (strongestLink.category === "경매") {
    return "오늘은 경매 지표가 시장 스트레스를 보여줍니다";
  }

  return `오늘은 ${strongestLink.category} 이슈가 판세를 움직입니다`;
}

function deriveBriefHeadline(strongestLink: RadarLink | undefined, links: RadarLink[]) {
  if (!strongestLink) {
    return "오늘은 볼 만한 이슈를 모으는 중입니다";
  }

  const leadCopy = getHomeLeadCopy(strongestLink);

  if (leadCopy) {
    return leadCopy.briefHeadline;
  }

  const categories = new Set(links.map((link) => link.category));
  const hasLoanOrPolicy =
    categories.has("정책") || categories.has("대출/금리");
  const hasSubscription = categories.has("청약");

  if (hasLoanOrPolicy && hasSubscription) {
    return "오늘은 대출·청약 이슈가 큽니다";
  }

  if (strongestLink.category === "전세/월세") {
    return "오늘은 전세 이슈를 먼저 봐야 합니다";
  }

  if (strongestLink.category === "재건축/재개발") {
    return "오늘은 정비사업 흐름이 중요합니다";
  }

  if (strongestLink.category === "경매") {
    return "오늘은 경매 지표를 가볍게 확인하세요";
  }

  return `오늘은 ${strongestLink.category} 이슈가 중요합니다`;
}

function deriveDailyQuestionHeadline(strongestLink: RadarLink | undefined, links: RadarLink[]) {
  if (!strongestLink) {
    return "오늘 볼 이슈를 모으는 중입니다";
  }

  const categories = new Set(
    [strongestLink.category, ...links.map((link) => link.category)].filter(Boolean),
  );
  const hasLoanOrPolicy =
    categories.has("정책") || categories.has("대출/금리");

  if (hasLoanOrPolicy && categories.has("전세/월세")) {
    return "오늘은 대출·전세부터 보세요";
  }

  if (hasLoanOrPolicy && categories.has("청약")) {
    return "오늘은 대출·청약부터 보세요";
  }

  if (strongestLink.category === "전세/월세") {
    return "오늘은 전세 안전부터 보세요";
  }

  if (strongestLink.category === "청약") {
    return "오늘은 청약 조건부터 보세요";
  }

  return `오늘은 ${strongestLink.category} 이슈부터 보세요`;
}

function deriveBriefSummary(strongestLink: RadarLink | undefined, links: RadarLink[]) {
  if (!strongestLink) {
    return "새 이슈가 쌓이면 내 상황별로 쉽게 풀어드릴게요.";
  }

  const leadCopy = getHomeLeadCopy(strongestLink);

  if (leadCopy) {
    return leadCopy.briefSummary;
  }

  const categories = new Set(links.map((link) => link.category));
  const hasLoanOrPolicy =
    categories.has("정책") || categories.has("대출/금리");
  const hasSubscription = categories.has("청약");

  if (hasLoanOrPolicy && hasSubscription) {
    return "매수심리는 살아나지만, 정책 확정 전 베팅은 위험합니다.";
  }

  return strongestLink.impactLine;
}

function deriveImportanceLabel(score: number): HomeSignalModel["importanceLabel"] {
  if (score >= 86) {
    return "높음";
  }

  if (score >= 75) {
    return "보통";
  }

  return "낮음";
}

function deriveRegionShortline(strongestLink: RadarLink | undefined) {
  if (!strongestLink) {
    return "지역 신호 수집 중";
  }

  const hasSeoul = strongestLink.regions.includes("서울");
  const hasMetro = strongestLink.regions.includes("경기/인천");

  if (hasSeoul && hasMetro) {
    return "서울/경기 쏠림";
  }

  if (hasSeoul) {
    return "서울 쏠림";
  }

  if (hasMetro) {
    return "경기/인천 관찰";
  }

  return strongestLink.regions.find((region) => region !== "전국") ?? "전국 변수";
}

function deriveMarketShortline(strongestLink: RadarLink | undefined, moodLabel: HomeSignalModel["moodLabel"]) {
  if (!strongestLink) {
    return "관망";
  }

  if (strongestLink.score >= 90) {
    return "매수심리 반등 신호";
  }

  if (moodLabel === "과열 주의") {
    return "기대감 과열 주의";
  }

  if (moodLabel === "냉각") {
    return "거래심리 냉각";
  }

  return "흐름 확인";
}

function deriveHeroSubVerdict({
  strongestLink,
  moodLabel,
  audienceSegments,
}: {
  strongestLink: RadarLink | undefined;
  moodLabel: HomeSignalModel["moodLabel"];
  audienceSegments: AudienceSegment[];
}) {
  const renter = audienceSegments.find((segment) => segment.label === "전세 세입자");
  const renterLine = `전세 세입자는 ${renter?.status ?? "관망"}`;

  return [
    deriveMarketShortline(strongestLink, moodLabel),
    renterLine,
    deriveRegionShortline(strongestLink),
  ].join(" · ");
}

function deriveHeroMemoryLine(strongestLink: RadarLink | undefined) {
  if (!strongestLink) {
    return "아직 오늘의 집픽을 고르는 중입니다.";
  }

  const leadCopy = getHomeLeadCopy(strongestLink);

  if (leadCopy) {
    return leadCopy.heroMemoryLine;
  }

  if (strongestLink.category === "정책" || strongestLink.category === "대출/금리") {
    return "대출 규제 기대가 매수 심리를 자극 중입니다.";
  }

  if (strongestLink.category === "청약") {
    return "청약 경쟁률은 실수요 쏠림을 가장 빨리 드러냅니다.";
  }

  if (strongestLink.category === "전세/월세") {
    return "전세 물량과 대출 조건은 이사 판단을 바로 흔듭니다.";
  }

  return strongestLink.impactLine;
}

function deriveTodayPickDisplayTitle(link: RadarLink | undefined) {
  if (!link) {
    return "오늘 먼저 볼 이슈를 고르는 중입니다";
  }

  if (link.category === "정책") {
    return "정책 변수, 매수심리를 흔듭니다";
  }

  if (link.category === "대출/금리") {
    return "대출 조건, 상환 부담부터 보세요";
  }

  if (link.category === "전세/월세") {
    return "전세 흐름, 보증금 안전부터 보세요";
  }

  if (link.category === "청약") {
    return "청약 열기, 입지별로 갈립니다";
  }

  if (link.category === "재건축/재개발") {
    return "정비사업 기대감, 지역별로 나눠 보세요";
  }

  if (link.category === "경매") {
    return "경매 지표, 시장 스트레스부터 보세요";
  }

  return `${link.category} 이슈, 내 상황부터 확인하세요`;
}

function deriveTodayActionLine(link: RadarLink | undefined, primaryAudience: AudienceSegment | undefined) {
  if (!link) {
    return "관심 지역과 내 상황을 먼저 맞춰보세요.";
  }

  if (link.category === "정책" || link.category === "대출/금리") {
    return "적용 대상, 시행일, 월 상환액을 먼저 확인하세요.";
  }

  if (link.category === "전세/월세") {
    return "보증보험, 선순위, 전세가율을 먼저 확인하세요.";
  }

  if (link.category === "청약") {
    return "가점, 분양가, 입주 물량을 같이 보세요.";
  }

  if (link.category === "매매시장") {
    return "거래량과 호가가 같이 움직이는지 확인하세요.";
  }

  if (link.category === "재건축/재개발") {
    return "사업 단계와 추가 분담금 가능성을 먼저 보세요.";
  }

  if (primaryAudience?.status === "주의") {
    return `${primaryAudience.label}는 리스크 조건부터 확인하세요.`;
  }

  return "제목보다 내 조건에 연결되는 변수부터 보세요.";
}

function getRegionHeatTone(region: Exclude<Region, "전국">, count: number, topScore: number): RegionHeatTone {
  if (region === "서울" && topScore >= 86) {
    return "hot";
  }

  if (topScore >= 88 && count >= 5) {
    return "hot";
  }

  if (topScore >= 82 || count >= 4) {
    return "watch";
  }

  if (count > 0) {
    return "mixed";
  }

  return "cool";
}

function getRegionHeatLabel(tone: RegionHeatTone): RegionFlow["heatLabel"] {
  if (tone === "hot") {
    return "HOT";
  }

  if (tone === "watch") {
    return "WATCH";
  }

  if (tone === "mixed") {
    return "MIXED";
  }

  return "COOL";
}

function deriveRegionFlows(links: RadarLink[]): RegionFlow[] {
  return regionFlowRegions.map((region) => {
    const regionLinks = sortBySignal(
      links.filter((link) => link.regions.includes(region)),
    );
    const topLink = regionLinks[0];
    const tone = getSignalTone(topLink?.score ?? 0);
    const signalScore = topLink?.score ?? 0;
    const heatTone = getRegionHeatTone(region, regionLinks.length, signalScore);

    return {
      region,
      count: regionLinks.length,
      topic: topLink ? `${topLink.category} 중심` : "수집 대기",
      status:
        tone === "strong"
          ? "신호 강함"
          : tone === "watch"
            ? "지켜볼 흐름"
            : "조용함",
      tone,
      heatTone,
      heatLabel: getRegionHeatLabel(heatTone),
      heatPercent: clamp(regionLinks.length * 10 + signalScore * 0.48, 12, 96),
      signalScore,
    };
  });
}

function getQuestionIntensity(score: number): UserQuestionIntensity {
  if (score >= 78) {
    return "high";
  }

  if (score >= 58) {
    return "medium";
  }

  return "low";
}

function deriveUserQuestions(
  links: RadarLink[],
  strongestLink: RadarLink | undefined,
): UserQuestionSignal[] {
  return questionDefinitions
    .map((definition) => {
      const matchingLinks = links.filter((link) =>
        definition.categories.includes(link.category),
      );
      const topScore = matchingLinks.reduce(
        (score, link) => Math.max(score, link.score),
        definition.fallbackScore,
      );
      const strongestBoost = strongestLink
        ? definition.categories.includes(strongestLink.category)
          ? 12
          : 0
        : 0;
      const countBoost = Math.min(matchingLinks.length * 4, 14);
      const score = clamp(topScore + strongestBoost + countBoost, 24, 98);

      return {
        key: definition.key,
        label: definition.label,
        question: definition.question,
        answer: definition.answer,
        action: definition.action,
        href: definition.href,
        score,
        intensity: getQuestionIntensity(score),
        status:
          definition.status === "관망" && score >= 86
            ? "확인"
            : definition.status,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function createHomeSignalModel({
  allLinks,
  filteredLinks,
  dailyPicks,
  totalDailyPicks,
  hasActiveFilter = false,
}: {
  allLinks: RadarLink[];
  filteredLinks: RadarLink[];
  dailyPicks: RadarLink[];
  totalDailyPicks: number;
  hasActiveFilter?: boolean;
}): HomeSignalModel {
  const visibleLinks = hasActiveFilter ? filteredLinks : allLinks;
  const sortedVisibleLinks = sortBySignal(visibleLinks);
  const strongestLink = hasActiveFilter
    ? sortedVisibleLinks[0]
    : sortBySignal([...dailyPicks, ...sortedVisibleLinks])[0];
  const moodLabel = deriveMoodLabel(allLinks);
  const audienceSegments = deriveAudienceSegments(strongestLink);
  const primaryAudience = selectPrimaryAudience(audienceSegments);
  const userQuestions = deriveUserQuestions(allLinks, strongestLink);
  const strongLinks = sortedVisibleLinks.filter((link) => link.score >= 86);
  const watchLinks = sortedVisibleLinks.filter(
    (link) => link.score >= 75 && link.score < 86,
  );
  const noiseLinks = sortedVisibleLinks.filter((link) => link.score < 75);

  return {
    dateLabel: getDateLabel(),
    moodLabel,
    dailyQuestionHeadline: deriveDailyQuestionHeadline(strongestLink, allLinks),
    briefHeadline: deriveBriefHeadline(strongestLink, allLinks),
    briefSummary: deriveBriefSummary(strongestLink, allLinks),
    importanceLabel: deriveImportanceLabel(strongestLink?.score ?? 0),
    heroVerdict: deriveHeroVerdict(strongestLink, allLinks),
    heroSubVerdict: deriveHeroSubVerdict({
      strongestLink,
      moodLabel,
      audienceSegments,
    }),
    heroMemoryLine: deriveHeroMemoryLine(strongestLink),
    heroScore: strongestLink?.score ?? 0,
    todayPickDisplayTitle: deriveTodayPickDisplayTitle(strongestLink),
    todayActionLine: deriveTodayActionLine(strongestLink, primaryAudience),
    primaryQuestion: userQuestions[0],
    userQuestions,
    keywords: deriveKeywords(strongestLink, sortedVisibleLinks),
    strongestLink,
    strongLinks,
    watchLinks,
    noiseLinks,
    signalTapeLinks: sortedVisibleLinks.slice(0, 12),
    audienceSegments,
    primaryAudience,
    regionFlows: deriveRegionFlows(allLinks),
    strongSignalCount: strongLinks.length,
    watchSignalCount: watchLinks.length,
    totalIssues: allLinks.length,
    visibleIssues: filteredLinks.length,
    totalDailyPicks,
  };
}
