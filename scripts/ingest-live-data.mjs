import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const categories = [
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
];

const regions = ["전국", "서울", "경기/인천", "지방 광역시", "지방 중소도시"];

const liveQueries = [
  {
    query: "부동산 정책 주택 공급 대책 대출",
    category: "정책",
    regions: ["전국", "서울"],
  },
  {
    query: "부동산 대출 금리 DSR LTV 전세대출",
    category: "대출/금리",
    regions: ["전국"],
  },
  {
    query: "서울 아파트 청약 분양가 경쟁률",
    category: "청약",
    regions: ["서울"],
  },
  {
    query: "전세 보증금 반환 보증보험 역전세",
    category: "전세/월세",
    regions: ["전국", "경기/인천"],
  },
  {
    query: "아파트 실거래가 서울 수도권 부동산",
    category: "매매시장",
    regions: ["서울", "경기/인천"],
  },
  {
    query: "재건축 재개발 정비사업 분양 부동산",
    category: "재건축/재개발",
    regions: ["서울"],
  },
];

const summarySchema = z.object({
  summaryBullets: z.array(z.string()).min(3).max(3),
  whyItMatters: z.string().min(20),
  audienceImpact: z.object({
    homelessBuyer: z.string().min(10),
    oneHomeOwner: z.string().min(10),
    renter: z.string().min(10),
    investor: z.string().min(10),
  }),
  checkpoints: z.array(z.string()).min(3).max(5),
  groundingNotes: z.array(z.string()).min(2).max(5),
  uncertainties: z.array(z.string()).min(1).max(4),
  impactLine: z.string().min(10).max(120),
  score: z.number().int().min(1).max(100),
  confidence: z.number().min(0).max(1),
});

const sourceLabels = {
  naver: "뉴스 맥락",
  ecos: "한국은행 ECOS",
  data_go_kr: "공공데이터포털",
  law: "법제처",
};

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} env가 필요합니다.`);
  }

  return value;
}

function normalizeSupabaseUrl(input) {
  return input.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function createStableId(title, url = "") {
  const base = slugify(title) || "jipjip-live";
  const source = `${title}:${url}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }

  return `${base}-${hash.toString(36)}`.slice(0, 80);
}

function canonicalizeUrl(input) {
  const url = new URL(input);
  url.hash = "";

  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url.toString();
}

function sourceNameFromUrl(input) {
  try {
    return new URL(input).hostname.replace(/^www\./, "") || "뉴스";
  } catch {
    return "뉴스";
  }
}

function yyyymm(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function recentMonths(limit = 8) {
  const cursor = new Date();
  cursor.setDate(1);
  cursor.setMonth(cursor.getMonth() - 1);

  return Array.from({ length: limit }, () => {
    const value = yyyymm(cursor);
    cursor.setMonth(cursor.getMonth() - 1);
    return value;
  });
}

function cleanText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function getXmlTag(body, tagName) {
  const match = body.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`));

  return match ? cleanText(match[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : "";
}

function getXmlItems(text) {
  return [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
}

function toNumber(value) {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchText(url, init) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
    const text = await response.text();

    return { response, text };
  } finally {
    clearTimeout(timeout);
  }
}

async function searchNaverNews(query, display = 5) {
  const url = new URL("https://openapi.naver.com/v1/search/news.json");
  url.searchParams.set("query", query);
  url.searchParams.set("display", String(display));
  url.searchParams.set("sort", "date");

  const response = await fetch(url.toString(), {
    headers: {
      "X-Naver-Client-Id": requiredEnv("NAVER_CLIENT_ID"),
      "X-Naver-Client-Secret": requiredEnv("NAVER_CLIENT_SECRET"),
    },
    cache: "no-store",
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`네이버 뉴스 검색 실패 ${response.status}: ${text.slice(0, 180)}`);
  }

  const payload = JSON.parse(text);

  return (payload.items ?? []).flatMap((item) => {
    const link = item.originallink || item.link;

    if (!item.title || !link) {
      return [];
    }

    return [
      {
        title: stripHtml(item.title),
        description: stripHtml(item.description ?? ""),
        link,
        originallink: item.originallink,
        pubDate: item.pubDate,
      },
    ];
  });
}

function fallbackSummary(candidate, observations, index) {
  const officialCount = observations.filter((item) => item.source !== "naver").length;
  const description =
    candidate.description || "네이버 뉴스 검색으로 확인한 부동산 관련 최신 이슈입니다.";

  return {
    summaryBullets: [
      description.slice(0, 110),
      `공식 지표 ${officialCount}개와 뉴스 맥락을 함께 붙여 확인했습니다.`,
      "아직 원문 전체 검토 전이므로 적용 대상과 시행일은 추가 확인이 필요합니다.",
    ],
    whyItMatters:
      "이 이슈는 매수 여력, 전세 부담, 지역별 거래 심리 중 하나 이상과 연결될 수 있습니다. 단일 기사 문장만으로 판단하지 않고 공식 지표와 함께 봐야 합니다.",
    audienceImpact: {
      homelessBuyer:
        "청약, 대출, 매수 후보를 볼 때 실제 현금 부담과 월 상환액을 같이 확인해야 합니다.",
      oneHomeOwner:
        "갈아타기나 보유 판단에는 기존 집 매도 기간과 새 대출 조건을 함께 봐야 합니다.",
      renter:
        "전세 유지, 이사, 매수 전환 판단에서 보증금 안전성과 대출 조건을 같이 확인해야 합니다.",
      investor:
        "수익률보다 먼저 정책 적용 대상, 거래 확산 여부, 공실·역전세 가능성을 확인해야 합니다.",
    },
    checkpoints: [
      "원문에서 확정 발표인지 관측 기사인지 구분",
      "적용 지역과 대상 확인",
      "공식 지표와 실제 거래 반응 비교",
    ],
    groundingNotes: observations.slice(0, 4).map((item) => item.summary),
    uncertainties: [
      "기사 전문과 후속 공식 발표 확인 전까지는 해석 범위를 제한해야 합니다.",
    ],
    impactLine: description.slice(0, 90),
    score: Math.max(72, 96 - index * 3),
    confidence: 0.64,
  };
}

function formatEvidenceForPrompt(observations) {
  if (observations.length === 0) {
    return "연결된 공식 근거 데이터 없음";
  }

  return observations
    .slice(0, 8)
    .map((item, index) => {
      const metric =
        item.metricLabel && typeof item.metricValue === "number"
          ? `${item.metricLabel} ${item.metricValue}${item.metricUnit ?? ""}`
          : item.metricLabel;

      return [
        `${index + 1}. ${sourceLabels[item.source] ?? item.source} / ${item.title}`,
        `기준일: ${item.observedAt.slice(0, 10)}`,
        item.regionName ? `범위: ${item.regionName}` : null,
        metric ? `값: ${metric}` : null,
        `요지: ${item.summary}`,
      ]
        .filter(Boolean)
        .join(" | ");
    })
    .join("\n");
}

async function generateSummary(openai, model, candidate, observations, index) {
  if (!openai) {
    return fallbackSummary(candidate, observations, index);
  }

  try {
    const response = await Promise.race([
      openai.responses.parse({
      model,
      input: [
        {
          role: "system",
          content:
            "너는 한국 부동산 이슈 큐레이션 편집자다. 투자 조언, 매수/매도 추천, 확정적 예측을 금지한다. 제공된 뉴스 발췌와 공식 근거만 사용하고, 불확실성은 분리한다. 일반 사용자가 매일 읽을 수 있게 짧고 선명하게 쓴다.",
        },
        {
          role: "user",
          content: [
            `제목: ${candidate.title}`,
            `출처: ${candidate.sourceName}`,
            `URL: ${candidate.sourceUrl}`,
            `카테고리: ${candidate.category}`,
            `지역: ${candidate.regions.join(", ")}`,
            `뉴스 발췌: ${candidate.description || "발췌 없음"}`,
            "연결된 근거:",
            formatEvidenceForPrompt(observations),
            "위 이슈를 집집 공개 홈에 올릴 브리프로 요약해라. 과장하지 말고, 근거/불확실성을 분리해라.",
          ].join("\n"),
        },
      ],
      text: {
        format: zodTextFormat(summarySchema, "jipjip_live_summary"),
      },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("OpenAI 요약 타임아웃")), 20000),
      ),
    ]);

    return response.output_parsed ?? fallbackSummary(candidate, observations, index);
  } catch (error) {
    console.warn(
      `OpenAI 요약 실패, fallback 사용: ${candidate.title} :: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return fallbackSummary(candidate, observations, index);
  }
}

async function collectEcosEvidence(category) {
  if (!process.env.ECOS_API_KEY) {
    return null;
  }

  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - 18);

  const url = `https://ecos.bok.or.kr/api/StatisticSearch/${process.env.ECOS_API_KEY}/json/kr/1/24/722Y001/M/${yyyymm(start)}/${yyyymm(now)}/0101000`;
  const { response, text } = await fetchText(url);

  if (!response.ok) {
    throw new Error(`ECOS 응답 실패 ${response.status}`);
  }

  const payload = JSON.parse(text);
  const rows = payload.StatisticSearch?.row ?? [];
  const latest = rows
    .filter((row) => row.TIME && row.DATA_VALUE)
    .sort((a, b) => String(a.TIME).localeCompare(String(b.TIME)))
    .at(-1);

  if (!latest?.TIME || !latest.DATA_VALUE) {
    throw new Error("ECOS 기준금리 최신값 없음");
  }

  return {
    dedupeKey: `ecos:base-rate:${latest.TIME}`,
    source: "ecos",
    kind: "interest_rate",
    title: latest.ITEM_NAME1 ?? "한국은행 기준금리",
    summary:
      category === "전세/월세"
        ? "기준금리는 전세 대출 이자와 월세 전환 판단에 영향을 주는 배경 지표입니다."
        : "기준금리는 매수 여력, 전세 대출 부담, 시장 심리에 동시에 영향을 주는 배경 지표입니다.",
    sourceUrl: "https://ecos.bok.or.kr/",
    observedAt: `${latest.TIME.slice(0, 4)}-${latest.TIME.slice(4, 6)}-01T00:00:00+09:00`,
    regionName: "전국",
    entityLabel: "금리 환경",
    metricLabel: "기준금리",
    metricValue: Number(latest.DATA_VALUE),
    metricUnit: "%",
    isSample: false,
    confidence: 0.86,
    relevance: category === "대출/금리" ? 92 : 74,
    payload: { table: "722Y001", item: "0101000", time: latest.TIME },
  };
}

const regionSamples = {
  전국: { label: "서울 종로구 표본", lawd: "11110" },
  서울: { label: "서울 종로구 표본", lawd: "11110" },
  "경기/인천": { label: "경기 성남시 분당구 표본", lawd: "41135" },
  "지방 광역시": { label: "부산 중구 표본", lawd: "26110" },
  "지방 중소도시": { label: "충북 청주시 상당구 표본", lawd: "43111" },
};

async function collectTradeEvidence(category, candidateRegions) {
  if (!process.env.DATA_GO_KR_SERVICE_KEY) {
    return null;
  }

  const region = candidateRegions.find((item) => item !== "전국") ?? "전국";
  const sample = regionSamples[region] ?? regionSamples["전국"];
  let lastMessage = "";

  for (const month of recentMonths()) {
    const url = new URL(
      "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev",
    );
    url.searchParams.set("serviceKey", process.env.DATA_GO_KR_SERVICE_KEY);
    url.searchParams.set("LAWD_CD", sample.lawd);
    url.searchParams.set("DEAL_YMD", month);
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("numOfRows", "5");

    const { response, text } = await fetchText(url.toString());

    if (!response.ok) {
      lastMessage = `공공데이터 응답 실패 ${response.status}`;
      continue;
    }

    const code = getXmlTag(text, "resultCode") || getXmlTag(text, "returnReasonCode");
    const message = getXmlTag(text, "resultMsg") || getXmlTag(text, "returnAuthMsg");

    if (code && code !== "00" && code !== "000") {
      lastMessage = `공공데이터 ${code}: ${message || "오류"}`;
      continue;
    }

    const item = getXmlItems(text)[0];

    if (!item) {
      lastMessage = `${month} ${sample.label} 거래 표본 없음`;
      continue;
    }

    const aptName = getXmlTag(item, "aptNm") || getXmlTag(item, "aptName");
    const dealAmount = getXmlTag(item, "dealAmount");
    const area = getXmlTag(item, "excluUseAr");
    const dealYear = getXmlTag(item, "dealYear") || month.slice(0, 4);
    const dealMonth = getXmlTag(item, "dealMonth") || String(Number(month.slice(4, 6)));
    const dealDay = getXmlTag(item, "dealDay") || "1";
    const amountNumber = toNumber(dealAmount);

    return {
      dedupeKey: `data-go-kr:apt-trade:${sample.lawd}:${month}:${aptName || "sample"}`,
      source: "data_go_kr",
      kind: category === "전세/월세" ? "rent" : "trade",
      title: `${sample.label} 아파트 실거래 표본`,
      summary: `${sample.label} ${month.slice(0, 4)}년 ${Number(month.slice(4, 6))}월 실거래 API에서 ${aptName || "아파트"} ${area ? `${area}㎡ ` : ""}${dealAmount ? `${dealAmount}만원 ` : ""}거래 표본을 확인했습니다.`,
      sourceUrl:
        "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev",
      observedAt: `${dealYear}-${String(Number(dealMonth)).padStart(2, "0")}-${String(Number(dealDay)).padStart(2, "0")}T00:00:00+09:00`,
      regionName: sample.label,
      entityLabel: aptName || "아파트 거래 표본",
      metricLabel: "거래금액",
      metricValue: amountNumber,
      metricUnit: amountNumber === null ? null : "만원",
      isSample: false,
      confidence: 0.78,
      relevance: category === "매매시장" ? 86 : 70,
      payload: { lawd: sample.lawd, dealYmd: month, aptName, area },
    };
  }

  throw new Error(lastMessage || "공공데이터 실거래 표본 없음");
}

async function collectLawEvidence(category) {
  if (!process.env.LAW_OPEN_API_OC) {
    return null;
  }

  const query = category === "전세/월세" ? "주택임대차보호법" : "부동산 거래";
  const url = new URL("https://www.law.go.kr/DRF/lawSearch.do");
  url.searchParams.set("OC", process.env.LAW_OPEN_API_OC);
  url.searchParams.set("target", "law");
  url.searchParams.set("type", "JSON");
  url.searchParams.set("query", query);
  url.searchParams.set("display", "3");

  const { response, text } = await fetchText(url.toString());

  if (!response.ok) {
    throw new Error(`법제처 응답 실패 ${response.status}`);
  }

  const payload = JSON.parse(text);

  if (payload.result || payload.msg) {
    throw new Error(`법제처 응답 확인 필요: ${payload.result ?? payload.msg}`);
  }

  const rawLaws = payload.LawSearch?.law;
  const laws = Array.isArray(rawLaws) ? rawLaws : rawLaws ? [rawLaws] : [];
  const law = laws[0];
  const name = law?.법령명한글 ?? law?.법령명 ?? query;
  const lawId = law?.법령ID;

  return {
    dedupeKey: `law:${query}:${lawId ?? "search"}`,
    source: "law",
    kind: category === "전세/월세" ? "law" : "policy",
    title: String(name),
    summary:
      category === "전세/월세"
        ? "임대차 이슈는 보증, 확정일자, 대항력처럼 제도 조건을 원문 기준으로 확인해야 합니다."
        : "정책 이슈는 기사 해석보다 적용 대상, 시행일, 예외 조건을 법령·제도 원문으로 확인해야 합니다.",
    sourceUrl: "https://www.law.go.kr/",
    observedAt: new Date().toISOString(),
    regionName: "전국",
    entityLabel: "제도 원문",
    metricLabel: null,
    metricValue: null,
    metricUnit: null,
    isSample: false,
    confidence: 0.74,
    relevance: 76,
    payload: { query, lawId: lawId ? String(lawId) : null },
  };
}

async function collectEvidence(candidate) {
  const warnings = [];
  const observations = [
    {
      dedupeKey: `link:${candidate.id}:source-context`,
      source: "naver",
      kind: "news_context",
      title: `${candidate.sourceName} 뉴스 맥락`,
      summary: cleanText(candidate.description || candidate.title).slice(0, 240),
      sourceUrl: candidate.sourceUrl,
      observedAt: candidate.submittedAt,
      regionName: candidate.regions.find((item) => item !== "전국") ?? "전국",
      entityLabel: "실제 뉴스 후보",
      metricLabel: null,
      metricValue: null,
      metricUnit: null,
      isSample: false,
      confidence: 0.66,
      relevance: 64,
      payload: { query: candidate.query },
    },
  ];

  for (const [label, run] of [
    ["ECOS", () => collectEcosEvidence(candidate.category)],
    ["공공데이터 실거래가", () =>
      collectTradeEvidence(candidate.category, candidate.regions)],
    ["법제처", () => collectLawEvidence(candidate.category)],
  ]) {
    try {
      const observation = await run();
      if (observation) {
        observations.push(observation);
      }
    } catch (error) {
      warnings.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return { observations, warnings };
}

function toObservationInsert(observation) {
  return {
    dedupe_key: observation.dedupeKey,
    source: observation.source,
    kind: observation.kind,
    title: observation.title,
    summary: observation.summary,
    source_url: observation.sourceUrl ?? null,
    observed_at: observation.observedAt,
    region_name: observation.regionName ?? null,
    entity_label: observation.entityLabel ?? null,
    metric_label: observation.metricLabel ?? null,
    metric_value: observation.metricValue ?? null,
    metric_unit: observation.metricUnit ?? null,
    payload: observation.payload ?? {},
    is_sample: observation.isSample,
    confidence: observation.confidence,
  };
}

async function persistEvidence(supabase, linkId, observations) {
  if (observations.length === 0) {
    return 0;
  }

  const { data, error } = await supabase
    .from("data_observations")
    .upsert(observations.map(toObservationInsert), { onConflict: "dedupe_key" })
    .select("id,dedupe_key");

  if (error) {
    throw new Error(error.message);
  }

  const byKey = new Map(observations.map((item) => [item.dedupeKey, item]));
  const joins = (data ?? []).map((row) => ({
    link_id: linkId,
    observation_id: row.id,
    relevance: byKey.get(row.dedupe_key)?.relevance ?? 60,
  }));

  if (joins.length > 0) {
    const { error: joinError } = await supabase
      .from("link_observations")
      .upsert(joins, { onConflict: "link_id,observation_id" });

    if (joinError) {
      throw new Error(joinError.message);
    }
  }

  return joins.length;
}

function normalizeCategory(value) {
  return categories.includes(value) ? value : "지역 이슈";
}

function normalizeRegions(value) {
  const normalized = value.filter((item) => regions.includes(item));

  return normalized.length > 0 ? normalized : ["전국"];
}

async function main() {
  const supabaseUrl = normalizeSupabaseUrl(requiredEnv("NEXT_PUBLIC_SUPABASE_URL"));
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY 또는 SUPABASE_SECRET_KEY가 필요합니다.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const openai = process.env.LIVE_USE_OPENAI === "1" && process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;
  const model = process.env.OPENAI_SUMMARY_MODEL || "gpt-5.5";
  const liveLimit = Math.min(
    Math.max(Number.parseInt(process.env.LIVE_LIMIT ?? "6", 10) || 6, 1),
    12,
  );
  const candidatesByUrl = new Map();
  const warnings = [];

  for (const spec of liveQueries) {
    const items = await searchNaverNews(spec.query, 4);

    for (const item of items) {
      const sourceUrl = canonicalizeUrl(item.originallink || item.link);

      if (candidatesByUrl.has(sourceUrl)) {
        continue;
      }

      candidatesByUrl.set(sourceUrl, {
        id: createStableId(item.title, sourceUrl),
        title: item.title,
        description: item.description,
        sourceUrl,
        sourceName: sourceNameFromUrl(sourceUrl),
        submittedAt: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString(),
        category: normalizeCategory(spec.category),
        regions: normalizeRegions(spec.regions),
        query: spec.query,
      });
    }
  }

  const candidates = [...candidatesByUrl.values()]
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))
    .slice(0, liveLimit);

  if (candidates.length === 0) {
    throw new Error("네이버 뉴스 실제 후보를 찾지 못했습니다.");
  }

  await supabase
    .from("links")
    .update({ is_daily_pick: false })
    .eq("is_sample", true);

  const imported = [];

  for (const [index, candidate] of candidates.entries()) {
    const collected = await collectEvidence(candidate);
    warnings.push(...collected.warnings.map((warning) => `${candidate.title}: ${warning}`));
    const summary = await generateSummary(openai, model, candidate, collected.observations, index);
    const isDailyPick = index < 4;
    const score = Math.max(summary.score, isDailyPick ? 88 - index : 70);

    const row = {
      id: candidate.id,
      title: candidate.title,
      source_name: candidate.sourceName,
      source_url: candidate.sourceUrl,
      submitted_at: candidate.submittedAt,
      published_at: new Date().toISOString(),
      category: candidate.category,
      regions: candidate.regions,
      summary_bullets: summary.summaryBullets,
      why_it_matters: summary.whyItMatters,
      audience_impact: summary.audienceImpact,
      checkpoints: summary.checkpoints,
      score,
      is_daily_pick: isDailyPick,
      impact_line: summary.impactLine,
      reading_minutes: 3,
      is_sample: false,
      status: "published",
      source_type: "admin",
      raw_excerpt: candidate.description,
      evidence_count: collected.observations.length,
      evidence_updated_at: new Date().toISOString(),
      grounding_notes: summary.groundingNotes,
      uncertainties: summary.uncertainties,
    };

    const { error } = await supabase
      .from("links")
      .upsert(row, { onConflict: "source_url" });

    if (error) {
      throw new Error(`links upsert 실패: ${error.message}`);
    }

    const savedEvidence = await persistEvidence(
      supabase,
      candidate.id,
      collected.observations,
    );

    await supabase.from("summaries").insert({
      link_id: candidate.id,
      model: openai ? model : "fallback-editorial-template",
      summary_bullets: summary.summaryBullets,
      why_it_matters: summary.whyItMatters,
      audience_impact: summary.audienceImpact,
      checkpoints: summary.checkpoints,
      confidence: summary.confidence,
      grounding_notes: summary.groundingNotes,
      uncertainties: summary.uncertainties,
      source_observation_ids: [],
    });

    imported.push({
      id: candidate.id,
      title: candidate.title,
      sourceName: candidate.sourceName,
      sourceUrl: candidate.sourceUrl,
      category: candidate.category,
      regions: candidate.regions,
      evidence: savedEvidence,
      score,
      dailyPick: isDailyPick,
    });
  }

  const { count: publishedReal } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .eq("is_sample", false);

  const { count: publishedSampleDaily } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .eq("is_sample", true)
    .eq("is_daily_pick", true);

  console.log(
    JSON.stringify(
      {
        imported: imported.length,
        publishedReal,
        publishedSampleDaily,
        warnings,
        links: imported,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
