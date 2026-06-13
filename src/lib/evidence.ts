import "server-only";

import { getDataIngestionConfig } from "@/lib/env";
import type {
  Category,
  EvidenceObservation,
  EvidenceSource,
  RadarLink,
  Region,
} from "@/lib/radar-data";
import type { Database, Json } from "@/lib/supabase/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

type ObservationRow = Database["public"]["Tables"]["data_observations"]["Row"];
type ObservationInsert =
  Database["public"]["Tables"]["data_observations"]["Insert"];
type LinkObservationInsert =
  Database["public"]["Tables"]["link_observations"]["Insert"];

export type EvidenceCandidate = Omit<EvidenceObservation, "id"> & {
  payload?: Json;
  relevance?: number;
  regionId?: string | null;
  complexId?: string | null;
  buildingId?: string | null;
  unitId?: string | null;
};

export type EvidenceCollectionResult = {
  observations: EvidenceCandidate[];
  warnings: string[];
};

const TIMEOUT_MS = 9000;

const sourceLabels: Record<EvidenceSource, string> = {
  sample: "샘플 근거",
  naver: "뉴스 맥락",
  ecos: "한국은행 ECOS",
  data_go_kr: "공공데이터포털",
  reb: "한국부동산원 R-ONE",
  law: "법제처",
  admin: "운영자 확인",
};

const regionSamples: Record<Region, { label: string; lawd: string }> = {
  전국: { label: "서울 종로구 표본", lawd: "11110" },
  서울: { label: "서울 종로구 표본", lawd: "11110" },
  "경기/인천": { label: "경기 성남시 분당구 표본", lawd: "41135" },
  "지방 광역시": { label: "부산 중구 표본", lawd: "26110" },
  "지방 중소도시": { label: "충북 청주시 상당구 표본", lawd: "43111" },
};

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function yyyymm(date: Date) {
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

function timeoutSignal(ms = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

async function fetchText(url: string, init?: RequestInit) {
  const timeout = timeoutSignal();

  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: timeout.signal,
    });
    const text = await response.text();

    return { response, text };
  } finally {
    timeout.clear();
  }
}

function getPrimaryRegion(regions: Region[]) {
  return regions.find((region) => region !== "전국") ?? "전국";
}

function getXmlTag(body: string, tagName: string) {
  const match = body.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`));

  return match ? cleanText(match[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : "";
}

function getXmlItems(text: string) {
  return [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
}

function toNumber(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function createNewsContextObservation(
  link: Pick<RadarLink, "id" | "title" | "sourceName" | "sourceUrl" | "regions"> & {
    rawExcerpt?: string | null;
  },
): EvidenceCandidate | null {
  if (!link.rawExcerpt) {
    return null;
  }

  return {
    dedupeKey: `link:${link.id}:source-context`,
    source: "naver",
    kind: "news_context",
    title: `${link.sourceName} 원문 맥락`,
    summary: cleanText(link.rawExcerpt).slice(0, 240),
    sourceUrl: link.sourceUrl,
    observedAt: new Date().toISOString(),
    regionName: getPrimaryRegion(link.regions),
    entityLabel: "기사 후보",
    metricLabel: null,
    metricValue: null,
    metricUnit: null,
    isSample: false,
    confidence: 0.64,
    relevance: 55,
  };
}

async function collectEcosRateEvidence(
  link: Pick<RadarLink, "id" | "category" | "regions">,
): Promise<EvidenceCandidate | null> {
  const config = getDataIngestionConfig();

  if (!config.ecosApiKey) {
    throw new Error("ECOS_API_KEY가 없습니다.");
  }

  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - 18);

  const url = `https://ecos.bok.or.kr/api/StatisticSearch/${config.ecosApiKey}/json/kr/1/24/722Y001/M/${yyyymm(start)}/${yyyymm(now)}/0101000`;
  const { response, text } = await fetchText(url);

  if (!response.ok) {
    throw new Error(`ECOS 응답 실패 ${response.status}`);
  }

  const payload = JSON.parse(text) as {
    StatisticSearch?: {
      RESULT?: { CODE?: string; MESSAGE?: string };
      row?: Array<{
        TIME?: string;
        DATA_VALUE?: string;
        ITEM_NAME1?: string;
      }>;
    };
  };
  const result = payload.StatisticSearch?.RESULT;

  if (result?.CODE && result.CODE !== "INFO-000") {
    throw new Error(`ECOS ${result.CODE}: ${result.MESSAGE ?? "오류"}`);
  }

  const rows = payload.StatisticSearch?.row ?? [];
  const latest = rows
    .filter((row) => row.TIME && row.DATA_VALUE)
    .sort((a, b) => String(a.TIME).localeCompare(String(b.TIME)))
    .at(-1);

  if (!latest?.TIME || !latest.DATA_VALUE) {
    throw new Error("ECOS 기준금리 최신값을 찾지 못했습니다.");
  }

  const value = Number(latest.DATA_VALUE);
  const observedAt = `${latest.TIME.slice(0, 4)}-${latest.TIME.slice(4, 6)}-01T00:00:00+09:00`;

  return {
    dedupeKey: `ecos:base-rate:${latest.TIME}`,
    source: "ecos",
    kind: "interest_rate",
    title: latest.ITEM_NAME1 ?? "한국은행 기준금리",
    summary:
      link.category === "전세/월세"
        ? "기준금리는 전세 대출 이자와 월세 전환 판단에 영향을 주는 핵심 배경 지표입니다."
        : "기준금리는 매수 여력, 전세 대출 부담, 시장 심리에 동시에 영향을 주는 배경 지표입니다.",
    sourceUrl: "https://ecos.bok.or.kr/",
    observedAt,
    regionName: "전국",
    entityLabel: "금리 환경",
    metricLabel: "기준금리",
    metricValue: Number.isFinite(value) ? value : null,
    metricUnit: "%",
    isSample: false,
    confidence: 0.86,
    relevance: link.category === "대출/금리" ? 92 : 74,
    payload: {
      table: "722Y001",
      item: "0101000",
      time: latest.TIME,
    },
  };
}

async function collectAptTradeEvidence(
  link: Pick<RadarLink, "id" | "category" | "regions">,
): Promise<EvidenceCandidate | null> {
  const config = getDataIngestionConfig();

  if (!config.dataGoKrServiceKey) {
    throw new Error("DATA_GO_KR_SERVICE_KEY가 없습니다.");
  }

  const region = getPrimaryRegion(link.regions);
  const sample = regionSamples[region];
  let lastMessage = "";

  for (const month of recentMonths()) {
    const url = new URL(
      "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev",
    );
    url.searchParams.set("serviceKey", config.dataGoKrServiceKey);
    url.searchParams.set("LAWD_CD", sample.lawd);
    url.searchParams.set("DEAL_YMD", month);
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("numOfRows", "5");

    const { response, text } = await fetchText(url.toString());

    if (!response.ok) {
      lastMessage = `공공데이터 응답 실패 ${response.status}`;
      continue;
    }

    const code =
      getXmlTag(text, "resultCode") || getXmlTag(text, "returnReasonCode");
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
    const observedAt = `${dealYear}-${String(Number(dealMonth)).padStart(2, "0")}-${String(Number(dealDay)).padStart(2, "0")}T00:00:00+09:00`;

    return {
      dedupeKey: `data-go-kr:apt-trade:${sample.lawd}:${month}:${aptName || "sample"}`,
      source: "data_go_kr",
      kind: link.category === "전세/월세" ? "rent" : "trade",
      title: `${sample.label} 아파트 실거래 표본`,
      summary: `${sample.label} ${month.slice(0, 4)}년 ${Number(month.slice(4, 6))}월 실거래 API에서 ${aptName || "아파트"} ${area ? `${area}㎡ ` : ""}${dealAmount ? `${dealAmount}만원 ` : ""}거래 표본을 확인했습니다.`,
      sourceUrl:
        "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev",
      observedAt,
      regionName: sample.label,
      entityLabel: aptName || "아파트 거래 표본",
      metricLabel: "거래금액",
      metricValue: amountNumber,
      metricUnit: amountNumber === null ? null : "만원",
      isSample: false,
      confidence: 0.78,
      relevance: link.category === "매매시장" ? 86 : 70,
      payload: {
        lawd: sample.lawd,
        dealYmd: month,
        aptName,
        area,
      },
    };
  }

  throw new Error(lastMessage || "공공데이터 실거래 표본을 찾지 못했습니다.");
}

async function collectLawEvidence(
  link: Pick<RadarLink, "id" | "category">,
): Promise<EvidenceCandidate | null> {
  const config = getDataIngestionConfig();

  if (!config.lawOpenApiOc) {
    throw new Error("LAW_OPEN_API_OC가 없습니다.");
  }

  const query =
    link.category === "전세/월세" ? "주택임대차보호법" : "부동산 거래";
  const url = new URL("https://www.law.go.kr/DRF/lawSearch.do");
  url.searchParams.set("OC", config.lawOpenApiOc);
  url.searchParams.set("target", "law");
  url.searchParams.set("type", "JSON");
  url.searchParams.set("query", query);
  url.searchParams.set("display", "3");

  const { response, text } = await fetchText(url.toString());

  if (!response.ok) {
    throw new Error(`법제처 응답 실패 ${response.status}`);
  }

  const payload = JSON.parse(text) as {
    result?: string;
    msg?: string;
    LawSearch?: {
      law?: unknown;
      totalCnt?: string | number;
    };
  };

  if (payload.result || payload.msg) {
    throw new Error(`법제처 응답 확인 필요: ${payload.result ?? payload.msg}`);
  }

  const rawLaws = payload.LawSearch?.law;
  const laws = Array.isArray(rawLaws)
    ? rawLaws
    : rawLaws
      ? [rawLaws]
      : [];
  const law = laws[0] as Record<string, string | number | undefined> | undefined;
  const name = law?.법령명한글 ?? law?.법령명 ?? query;
  const lawId = law?.법령ID;

  return {
    dedupeKey: `law:${query}:${lawId ?? "search"}`,
    source: "law",
    kind: link.category === "전세/월세" ? "law" : "policy",
    title: String(name),
    summary:
      link.category === "전세/월세"
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
    payload: {
      query,
      lawId: lawId ? String(lawId) : null,
    },
  };
}

function shouldCollectEcos(category: Category) {
  return ["대출/금리", "정책", "전세/월세", "매매시장"].includes(category);
}

function shouldCollectTrade(category: Category) {
  return [
    "정책",
    "대출/금리",
    "전세/월세",
    "매매시장",
    "지역 이슈",
    "재건축/재개발",
  ].includes(category);
}

function shouldCollectLaw(category: Category) {
  return ["정책", "전세/월세", "청약", "재건축/재개발"].includes(category);
}

async function collectOne(
  warnings: string[],
  label: string,
  run: () => Promise<EvidenceCandidate | null>,
) {
  try {
    const result = await run();
    return result ? [result] : [];
  } catch (error) {
    warnings.push(
      `${label}: ${error instanceof Error ? error.message : "수집 실패"}`,
    );
    return [];
  }
}

export async function collectEvidenceForLink(
  link: Pick<
    RadarLink,
    "id" | "title" | "sourceName" | "sourceUrl" | "category" | "regions" | "isSample"
  > & {
    rawExcerpt?: string | null;
  },
): Promise<EvidenceCollectionResult> {
  const warnings: string[] = [];
  const observations: EvidenceCandidate[] = [];
  const context = createNewsContextObservation(link);

  if (context) {
    observations.push(context);
  }

  if (shouldCollectEcos(link.category)) {
    observations.push(
      ...(await collectOne(warnings, "ECOS", () => collectEcosRateEvidence(link))),
    );
  }

  if (shouldCollectTrade(link.category)) {
    observations.push(
      ...(await collectOne(warnings, "공공데이터 실거래가", () =>
        collectAptTradeEvidence(link),
      )),
    );
  }

  if (shouldCollectLaw(link.category)) {
    observations.push(
      ...(await collectOne(warnings, "법제처", () => collectLawEvidence(link))),
    );
  }

  const config = getDataIngestionConfig();

  if (config.rebStatsApiKey && ["전세/월세", "매매시장"].includes(link.category)) {
    warnings.push(
      "한국부동산원 R-ONE: 키는 설정되어 있으나 통계 endpoint 매핑은 다음 루프에서 확정합니다.",
    );
  }

  return { observations, warnings };
}

function toObservationInsert(row: EvidenceCandidate): ObservationInsert {
  return {
    dedupe_key: row.dedupeKey,
    source: row.source,
    kind: row.kind,
    title: row.title,
    summary: row.summary,
    source_url: row.sourceUrl ?? null,
    observed_at: row.observedAt,
    region_id: row.regionId ?? null,
    complex_id: row.complexId ?? null,
    building_id: row.buildingId ?? null,
    unit_id: row.unitId ?? null,
    region_name: row.regionName ?? null,
    entity_label: row.entityLabel ?? null,
    metric_label: row.metricLabel ?? null,
    metric_value: row.metricValue ?? null,
    metric_unit: row.metricUnit ?? null,
    payload: row.payload ?? {},
    is_sample: row.isSample,
    confidence: row.confidence,
  };
}

export function mapObservationRow(row: ObservationRow): EvidenceObservation {
  return {
    id: row.id,
    dedupeKey: row.dedupe_key,
    source: row.source,
    kind: row.kind,
    title: row.title,
    summary: row.summary,
    sourceUrl: row.source_url,
    observedAt: row.observed_at,
    regionName: row.region_name,
    entityLabel: row.entity_label,
    metricLabel: row.metric_label,
    metricValue: row.metric_value,
    metricUnit: row.metric_unit,
    isSample: row.is_sample,
    confidence: row.confidence,
  };
}

export async function persistEvidenceForLink(
  supabase: SupabaseClient<Database>,
  linkId: string,
  observations: EvidenceCandidate[],
) {
  if (observations.length === 0) {
    return { savedCount: 0, totalCount: 0, observationIds: [] as string[] };
  }

  const { data, error } = await supabase
    .from("data_observations")
    .upsert(observations.map(toObservationInsert), { onConflict: "dedupe_key" })
    .select("id,dedupe_key");

  if (error) {
    throw new Error(error.message);
  }

  const savedRows = data ?? [];
  const candidateByKey = new Map(
    observations.map((observation) => [observation.dedupeKey, observation]),
  );
  const joins: LinkObservationInsert[] = savedRows.map((row) => ({
    link_id: linkId,
    observation_id: row.id,
    relevance: candidateByKey.get(row.dedupe_key)?.relevance ?? 60,
  }));

  if (joins.length > 0) {
    const { error: joinError } = await supabase
      .from("link_observations")
      .upsert(joins, { onConflict: "link_id,observation_id" });

    if (joinError) {
      throw new Error(joinError.message);
    }
  }

  const { count, error: countError } = await supabase
    .from("link_observations")
    .select("*", { count: "exact", head: true })
    .eq("link_id", linkId);

  if (countError) {
    throw new Error(countError.message);
  }

  const totalCount = count ?? joins.length;

  const { error: linkError } = await supabase
    .from("links")
    .update({
      evidence_count: totalCount,
      evidence_updated_at: new Date().toISOString(),
    })
    .eq("id", linkId);

  if (linkError) {
    throw new Error(linkError.message);
  }

  return {
    savedCount: joins.length,
    totalCount,
    observationIds: savedRows.map((row) => row.id),
  };
}

export function formatEvidenceForPrompt(observations: EvidenceObservation[]) {
  if (observations.length === 0) {
    return "연결된 공식 근거 데이터 없음";
  }

  return observations
    .slice(0, 8)
    .map((observation, index) => {
      const metric =
        observation.metricLabel && typeof observation.metricValue === "number"
          ? `${observation.metricLabel} ${observation.metricValue}${observation.metricUnit ?? ""}`
          : observation.metricLabel;

      return [
        `${index + 1}. ${sourceLabels[observation.source]} / ${observation.title}`,
        `기준일: ${observation.observedAt.slice(0, 10)}`,
        observation.regionName ? `범위: ${observation.regionName}` : null,
        metric ? `값: ${metric}` : null,
        `요지: ${observation.summary}`,
      ]
        .filter(Boolean)
        .join(" | ");
    })
    .join("\n");
}

export function getEvidenceSourceLabel(source: EvidenceSource) {
  return sourceLabels[source];
}
