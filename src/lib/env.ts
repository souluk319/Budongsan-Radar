import "server-only";

import { normalizeSupabaseUrl } from "@/lib/supabase/url";

export type SupabasePublicConfig = {
  url: string;
  key: string;
};

export type SupabaseAdminConfig = SupabasePublicConfig & {
  adminKey: string;
};

export type DataIngestionConfig = {
  dataGoKrServiceKey?: string;
  rebStatsApiBaseUrl: string;
  rebStatsApiDocUrl?: string;
  rebStatsApiKey?: string;
  ecosApiKey?: string;
  naverClientId?: string;
  naverClientSecret?: string;
  lawOpenApiOc?: string;
};

const REB_STATS_API_BASE_URL = "https://www.reb.or.kr/r-one/openapi/";

function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value && value.length > 0 ? value : undefined;
}

function ensureTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key =
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    return null;
  }

  return { url: normalizeSupabaseUrl(url), key };
}

export function getSupabaseAdminConfig(): SupabaseAdminConfig | null {
  const publicConfig = getSupabasePublicConfig();
  const adminKey =
    readEnv("SUPABASE_SECRET_KEY") ?? readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!publicConfig || !adminKey) {
    return null;
  }

  return { ...publicConfig, adminKey };
}

export function getOpenAIConfig() {
  return {
    apiKey: readEnv("OPENAI_API_KEY"),
    model: readEnv("OPENAI_SUMMARY_MODEL") ?? "gpt-5.5",
  };
}

export function getAppUrl() {
  const vercelUrl = readEnv("VERCEL_URL");

  return (
    readEnv("APP_URL") ??
    (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")
  );
}

export function getAdminEmails() {
  return new Set(
    (readEnv("ADMIN_EMAILS") ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function getRssIngestSecret() {
  return readEnv("RSS_INGEST_SECRET");
}

export function getDataIngestionConfig(): DataIngestionConfig {
  return {
    dataGoKrServiceKey: readEnv("DATA_GO_KR_SERVICE_KEY"),
    rebStatsApiBaseUrl: ensureTrailingSlash(
      readEnv("REB_STATS_API_BASE_URL") ?? REB_STATS_API_BASE_URL,
    ),
    rebStatsApiDocUrl: readEnv("REB_STATS_API_DOC_URL") ?? readEnv("REB_URL"),
    rebStatsApiKey: readEnv("REB_STATS_API_KEY") ?? readEnv("REB_API"),
    ecosApiKey: readEnv("ECOS_API_KEY"),
    naverClientId: readEnv("NAVER_CLIENT_ID"),
    naverClientSecret: readEnv("NAVER_CLIENT_SECRET"),
    lawOpenApiOc: readEnv("LAW_OPEN_API_OC"),
  };
}

export function getSetupStatus() {
  const supabasePublic = getSupabasePublicConfig();
  const supabaseAdmin = getSupabaseAdminConfig();
  const openai = getOpenAIConfig();
  const dataIngestion = getDataIngestionConfig();

  return {
    hasSupabasePublic: Boolean(supabasePublic),
    hasSupabaseAdmin: Boolean(supabaseAdmin),
    hasOpenAI: Boolean(openai.apiKey),
    hasAdminEmails: getAdminEmails().size > 0,
    hasRssSecret: Boolean(getRssIngestSecret()),
    hasDataGoKr: Boolean(dataIngestion.dataGoKrServiceKey),
    hasRebStats: Boolean(dataIngestion.rebStatsApiKey),
    hasEcos: Boolean(dataIngestion.ecosApiKey),
    hasNaverSearch: Boolean(
      dataIngestion.naverClientId && dataIngestion.naverClientSecret,
    ),
    hasLawOpenApi: Boolean(dataIngestion.lawOpenApiOc),
  };
}
