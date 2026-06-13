import "server-only";

import {
  getDailyPicks,
  getFilteredLinks,
  getLatestLinks,
  getLinkById,
  getRelatedLinks,
  getTrendingLinks,
  isCategory,
  isRegion,
  radarLinks,
  type AudienceImpact,
  type Category,
  type RadarLink,
  type Region,
} from "@/lib/radar-data";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/database.types";

type LinkRow = Database["public"]["Tables"]["links"]["Row"];

export type RadarDataMode = "supabase" | "seed";

export type RadarLinksResult = {
  mode: RadarDataMode;
  reason?: string;
  links: RadarLink[];
};

const fallbackImpact: AudienceImpact = {
  homelessBuyer: "요약 생성 전입니다. 원문과 지역/카테고리를 먼저 확인하세요.",
  oneHomeOwner: "요약 생성 전입니다. 보유 주택과 직접 연결되는 변수인지 확인하세요.",
  renter: "요약 생성 전입니다. 전세/월세 비용과 보증금 안전성을 함께 보세요.",
  investor: "요약 생성 전입니다. 투자 조언이 아니라 리스크 체크 관점으로만 보세요.",
};

function toAudienceImpact(value: Json): AudienceImpact {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallbackImpact;
  }

  const source = value as Record<string, Json | undefined>;

  return {
    homelessBuyer:
      typeof source.homelessBuyer === "string"
        ? source.homelessBuyer
        : fallbackImpact.homelessBuyer,
    oneHomeOwner:
      typeof source.oneHomeOwner === "string"
        ? source.oneHomeOwner
        : fallbackImpact.oneHomeOwner,
    renter:
      typeof source.renter === "string" ? source.renter : fallbackImpact.renter,
    investor:
      typeof source.investor === "string"
        ? source.investor
        : fallbackImpact.investor,
  };
}

function toCategory(value: string): Category {
  return isCategory(value) ? value : "지역 이슈";
}

function toRegions(value: string[]): Region[] {
  const validRegions = value.filter(isRegion);

  return validRegions.length > 0 ? validRegions : ["전국"];
}

export function mapLinkRow(row: LinkRow): RadarLink {
  return {
    id: row.id,
    title: row.title,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    submittedAt: row.submitted_at.slice(0, 10),
    category: toCategory(row.category),
    regions: toRegions(row.regions),
    summaryBullets:
      row.summary_bullets.length > 0
        ? row.summary_bullets
        : ["관리자 검토 또는 AI 요약 생성 대기 중입니다."],
    whyItMatters:
      row.why_it_matters ||
      "아직 요약이 생성되지 않았습니다. 이 이슈가 중요한 이유는 관리자 검토 후 채워집니다.",
    audienceImpact: toAudienceImpact(row.audience_impact),
    checkpoints:
      row.checkpoints.length > 0
        ? row.checkpoints
        : ["원문 출처 확인", "지역/카테고리 영향 범위 확인", "확정 정보와 해석 분리"],
    score: row.score,
    isDailyPick: row.is_daily_pick,
    impactLine:
      row.impact_line ||
      "관리자 승인 또는 AI 요약 생성 후 영향 한 줄이 채워집니다.",
    readingMinutes: row.reading_minutes,
    isSample: row.is_sample,
  };
}

export async function getPublishedLinks(): Promise<RadarLinksResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      mode: "seed",
      reason: "Supabase env 미설정",
      links: getLatestLinks(),
    };
  }

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("status", "published")
    .order("submitted_at", { ascending: false })
    .limit(100);

  if (error) {
    return {
      mode: "seed",
      reason: `Supabase 조회 실패: ${error.message}`,
      links: getLatestLinks(),
    };
  }

  return {
    mode: "supabase",
    links: data.map(mapLinkRow),
  };
}

export async function getHomeData(category?: Category, region?: Region) {
  const result = await getPublishedLinks();

  if (result.mode === "seed") {
    return {
      mode: result.mode,
      reason: result.reason,
      filteredLinks: getFilteredLinks(category, region),
      dailyPicks: getDailyPicks(4),
      trendingLinks: getTrendingLinks(5),
      totalDailyPicks: getDailyPicks().length,
    };
  }

  const filteredLinks = result.links.filter((link) => {
    const categoryMatch = category ? link.category === category : true;
    const regionMatch = region ? link.regions.includes(region) : true;

    return categoryMatch && regionMatch;
  });

  const dailyPicks = result.links
    .filter((link) => link.isDailyPick)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return {
    mode: result.mode,
    reason: result.reason,
    filteredLinks,
    dailyPicks,
    trendingLinks: [...result.links].sort((a, b) => b.score - a.score).slice(0, 5),
    totalDailyPicks: result.links.filter((link) => link.isDailyPick).length,
  };
}

export async function getBriefingData(limit = 10) {
  const result = await getPublishedLinks();

  if (result.mode === "seed") {
    return {
      mode: result.mode,
      reason: result.reason,
      links: getDailyPicks(limit),
    };
  }

  return {
    mode: result.mode,
    reason: result.reason,
    links: result.links
      .filter((link) => link.isDailyPick)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit),
  };
}

export async function getRadarLinkDetail(id: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const link = getLinkById(id);

    return link
      ? {
          mode: "seed" as const,
          reason: "Supabase env 미설정",
          link,
          relatedLinks: getRelatedLinks(link),
        }
      : null;
  }

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("id", id)
    .or("status.eq.published,status.eq.pending")
    .maybeSingle();

  if (error || !data) {
    const seedLink = getLinkById(id);

    if (!seedLink) {
      return null;
    }

    return {
      mode: "seed" as const,
      reason: error ? `Supabase 조회 실패: ${error.message}` : "DB row 없음",
      link: seedLink,
      relatedLinks: getRelatedLinks(seedLink),
    };
  }

  const link = mapLinkRow(data);
  const allLinks = await getPublishedLinks();
  const relatedLinks =
    allLinks.mode === "supabase"
      ? allLinks.links
          .filter((item) => item.id !== link.id)
          .map((item) => {
            const regionOverlap = item.regions.filter((region) =>
              link.regions.includes(region),
            ).length;
            const categoryScore = item.category === link.category ? 2 : 0;

            return { link: item, relevance: categoryScore + regionOverlap };
          })
          .sort((a, b) => b.relevance - a.relevance || b.link.score - a.link.score)
          .slice(0, 3)
          .map((item) => item.link)
      : getRelatedLinks(link);

  return {
    mode: "supabase" as const,
    link,
    relatedLinks,
  };
}

export async function getAdminLinks(status: "pending" | "published" | "rejected" = "pending") {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: false as const,
      message: "Supabase admin env가 필요합니다.",
      links: [] as LinkRow[],
    };
  }

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return {
      ok: false as const,
      message: error.message,
      links: [] as LinkRow[],
    };
  }

  return { ok: true as const, links: data };
}

export async function getRssSources() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("rss_sources")
    .select("*")
    .order("created_at", { ascending: true });

  return data ?? [];
}

export { radarLinks };
