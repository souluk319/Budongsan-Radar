import "server-only";

import { normalizeSupabaseUrl } from "@/lib/supabase/url";

export type SupabasePublicConfig = {
  url: string;
  key: string;
};

export type SupabaseAdminConfig = SupabasePublicConfig & {
  adminKey: string;
};

function readEnv(name: string) {
  const value = process.env[name]?.trim();

  return value && value.length > 0 ? value : undefined;
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

export function getSetupStatus() {
  const supabasePublic = getSupabasePublicConfig();
  const supabaseAdmin = getSupabaseAdminConfig();
  const openai = getOpenAIConfig();

  return {
    hasSupabasePublic: Boolean(supabasePublic),
    hasSupabaseAdmin: Boolean(supabaseAdmin),
    hasOpenAI: Boolean(openai.apiKey),
    hasAdminEmails: getAdminEmails().size > 0,
    hasRssSecret: Boolean(getRssIngestSecret()),
  };
}
