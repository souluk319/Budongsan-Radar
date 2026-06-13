import "server-only";

import { getDataIngestionConfig } from "@/lib/env";

export type DataSourceHealthStatus = "ok" | "configured" | "missing" | "error";

export type DataSourceHealthResult = {
  id: string;
  label: string;
  status: DataSourceHealthStatus;
  message: string;
  latencyMs?: number;
  checkedAt: string;
};

type CheckOptions = {
  id: string;
  label: string;
  missing: boolean;
  run: () => Promise<string>;
  configuredOnly?: boolean;
};

const TIMEOUT_MS = 8000;

function now() {
  return new Date().toISOString();
}

function missingResult(id: string, label: string): DataSourceHealthResult {
  return {
    id,
    label,
    status: "missing",
    message: "환경변수가 비어 있습니다.",
    checkedAt: now(),
  };
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

function cleanMessage(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 180);
}

async function runCheck({
  id,
  label,
  missing,
  run,
  configuredOnly,
}: CheckOptions): Promise<DataSourceHealthResult> {
  if (missing) {
    return missingResult(id, label);
  }

  const startedAt = Date.now();

  try {
    const message = await run();

    return {
      id,
      label,
      status: configuredOnly ? "configured" : "ok",
      message,
      latencyMs: Date.now() - startedAt,
      checkedAt: now(),
    };
  } catch (error) {
    return {
      id,
      label,
      status: "error",
      message: error instanceof Error ? error.message : "연결 확인 실패",
      latencyMs: Date.now() - startedAt,
      checkedAt: now(),
    };
  }
}

async function checkNaverNews() {
  const config = getDataIngestionConfig();
  const url = new URL("https://openapi.naver.com/v1/search/news.json");
  url.searchParams.set("query", "부동산");
  url.searchParams.set("display", "1");
  url.searchParams.set("sort", "date");

  const { response, text } = await fetchText(url.toString(), {
    headers: {
      "X-Naver-Client-Id": config.naverClientId ?? "",
      "X-Naver-Client-Secret": config.naverClientSecret ?? "",
    },
  });

  if (!response.ok) {
    throw new Error(`뉴스 검색 실패 ${response.status}: ${cleanMessage(text)}`);
  }

  const payload = JSON.parse(text) as { total?: number; items?: unknown[] };
  const count = payload.items?.length ?? 0;

  return `뉴스 검색 응답 확인. 후보 ${count}개 수신.`;
}

async function checkEcos() {
  const config = getDataIngestionConfig();
  const url = `https://ecos.bok.or.kr/api/StatisticTableList/${config.ecosApiKey}/json/kr/1/1/`;
  const { response, text } = await fetchText(url);

  if (!response.ok) {
    throw new Error(`ECOS 응답 실패 ${response.status}`);
  }

  const payload = JSON.parse(text) as {
    StatisticTableList?: { RESULT?: { CODE?: string; MESSAGE?: string } };
  };
  const result = payload.StatisticTableList?.RESULT;

  if (result?.CODE && result.CODE !== "INFO-000") {
    throw new Error(`ECOS ${result.CODE}: ${result.MESSAGE ?? "오류"}`);
  }

  return "통계표 목록 API 응답 확인.";
}

async function checkLawOpenApi() {
  const config = getDataIngestionConfig();
  const url = new URL("https://www.law.go.kr/DRF/lawSearch.do");
  url.searchParams.set("OC", config.lawOpenApiOc ?? "");
  url.searchParams.set("target", "law");
  url.searchParams.set("type", "JSON");
  url.searchParams.set("query", "주택");
  url.searchParams.set("display", "1");

  const { response, text } = await fetchText(url.toString());

  if (!response.ok) {
    throw new Error(`법제처 응답 실패 ${response.status}`);
  }

  const cleaned = cleanMessage(text);

  if (/ERROR|오류|인증|권한|필수/.test(cleaned)) {
    throw new Error(`법제처 응답 확인 필요: ${cleaned}`);
  }

  return "법령 검색 API 응답 확인.";
}

async function checkDataGoKr() {
  const config = getDataIngestionConfig();
  const url = new URL(
    "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev",
  );
  url.searchParams.set("serviceKey", config.dataGoKrServiceKey ?? "");
  url.searchParams.set("LAWD_CD", "11110");
  url.searchParams.set("DEAL_YMD", "202405");
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "1");

  const { response, text } = await fetchText(url.toString());

  if (!response.ok) {
    throw new Error(`공공데이터 응답 실패 ${response.status}`);
  }

  const message =
    text.match(/<resultMsg>(.*?)<\/resultMsg>/)?.[1] ??
    text.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/)?.[1] ??
    "";
  const code =
    text.match(/<resultCode>(.*?)<\/resultCode>/)?.[1] ??
    text.match(/<returnReasonCode>(.*?)<\/returnReasonCode>/)?.[1] ??
    "";

  if (code && code !== "00") {
    throw new Error(`공공데이터 ${code}: ${cleanMessage(message || text)}`);
  }

  return `아파트 매매 실거래가 API 응답 확인${message ? `: ${cleanMessage(message)}` : ""}.`;
}

async function checkRebStats() {
  const config = getDataIngestionConfig();
  const checks: string[] = [];

  const base = await fetchText(config.rebStatsApiBaseUrl, { method: "GET" });
  if (base.response.status >= 500) {
    throw new Error(`R-ONE 기본 주소 응답 실패 ${base.response.status}`);
  }
  checks.push("기본 주소 접근");

  if (config.rebStatsApiDocUrl) {
    const doc = await fetchText(config.rebStatsApiDocUrl, { method: "GET" });
    if (doc.response.status >= 500) {
      throw new Error(`R-ONE 명세서 응답 실패 ${doc.response.status}`);
    }
    checks.push("명세서 접근");
  }

  return `${checks.join(", ")} 확인. 실제 통계 endpoint는 adapter 단계에서 검증.`;
}

export async function checkAllDataSources(): Promise<DataSourceHealthResult[]> {
  const config = getDataIngestionConfig();

  return Promise.all([
    runCheck({
      id: "naver-news",
      label: "네이버 뉴스 검색",
      missing: !config.naverClientId || !config.naverClientSecret,
      run: checkNaverNews,
    }),
    runCheck({
      id: "ecos",
      label: "한국은행 ECOS",
      missing: !config.ecosApiKey,
      run: checkEcos,
    }),
    runCheck({
      id: "law-open-api",
      label: "법제처 법령 API",
      missing: !config.lawOpenApiOc,
      run: checkLawOpenApi,
    }),
    runCheck({
      id: "data-go-kr",
      label: "공공데이터 실거래가",
      missing: !config.dataGoKrServiceKey,
      run: checkDataGoKr,
    }),
    runCheck({
      id: "reb-stats",
      label: "한국부동산원 R-ONE",
      missing: !config.rebStatsApiKey,
      run: checkRebStats,
      configuredOnly: true,
    }),
  ]);
}
