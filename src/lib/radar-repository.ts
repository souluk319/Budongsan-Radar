import "server-only";

import {
  getDailyPicks,
  getFilteredLinks,
  getLatestLinks,
  getLinkById,
  getRelatedLinks,
  getTrendingLinks,
  getSampleEvidenceForLink,
  isCategory,
  isRegion,
  radarLinks,
  type AudienceImpact,
  type Category,
  type EvidenceObservation,
  type RadarLink,
  type Region,
} from "@/lib/radar-data";
import { polishRadarLink, polishRadarLinks } from "@/lib/editorial-polish";
import { mapObservationRow } from "@/lib/evidence";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/database.types";

type LinkRow = Database["public"]["Tables"]["links"]["Row"];
type ObservationRow = Database["public"]["Tables"]["data_observations"]["Row"];
type LinkObservationJoinRow = {
  relevance?: number | null;
  data_observations?: ObservationRow | ObservationRow[] | null;
};

export type RadarDataMode = "supabase" | "seed";

export type RadarLinksResult = {
  mode: RadarDataMode;
  reason?: string;
  links: RadarLink[];
};

function withSampleEvidenceMetadata(link: RadarLink): RadarLink {
  const evidence = getSampleEvidenceForLink(link);

  return {
    ...link,
    evidenceCount: evidence.length,
    evidenceUpdatedAt: evidence[0]?.observedAt ?? null,
    groundingNotes: [
      "샘플 브리프에서는 근거 데이터 UI와 요약 구조를 확인할 수 있습니다.",
      "실제 운영 링크는 관리자 근거 수집을 거쳐 공식 API 관측값을 연결합니다.",
    ],
    uncertainties: [
      "샘플 수치는 실제 투자 판단이나 가격 예측에 사용할 수 없습니다.",
    ],
  };
}

function withSampleEvidenceMetadataList(links: RadarLink[]) {
  return links.map(withSampleEvidenceMetadata);
}

const fallbackImpact: AudienceImpact = {
  homelessBuyer: "요약 생성 전입니다. 원문과 지역/카테고리를 먼저 확인하세요.",
  oneHomeOwner: "요약 생성 전입니다. 보유 주택과 직접 연결되는 변수인지 확인하세요.",
  renter: "요약 생성 전입니다. 전세/월세 비용과 보증금 안전성을 함께 보세요.",
  investor: "요약 생성 전입니다. 투자 조언이 아니라 리스크 체크 관점으로만 보세요.",
};

const publicCopyReplacements: Array<[RegExp, string]> = [
  [/Budongsan Radar/g, "집집"],
  [/RADAR/g, "집집"],
  [/부동산 레이더/g, "집집"],
  [/레이더 점수/g, "중요도"],
  [/시장 온도계/g, "시장 흐름 신호"],
  [/시장 온도/g, "시장 흐름"],
  [/수요 온도계/g, "수요 신호"],
  [/신호 테이프/g, "오늘 볼 이슈"],
  [/Latest Links/g, "최근 이슈"],
  [/필터 결과/g, "선별 이슈"],
  [/DB 연결/g, "데이터 연결"],
  [/\bMVP\b/g, "초기 버전"],
];

function cleanPublicCopy(value: string) {
  return publicCopyReplacements.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    value,
  );
}

function cleanPublicCopyList(value: string[]) {
  return value.map(cleanPublicCopy);
}

function toAudienceImpact(value: Json): AudienceImpact {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallbackImpact;
  }

  const source = value as Record<string, Json | undefined>;

  return {
    homelessBuyer:
      typeof source.homelessBuyer === "string"
        ? cleanPublicCopy(source.homelessBuyer)
        : fallbackImpact.homelessBuyer,
    oneHomeOwner:
      typeof source.oneHomeOwner === "string"
        ? cleanPublicCopy(source.oneHomeOwner)
        : fallbackImpact.oneHomeOwner,
    renter:
      typeof source.renter === "string"
        ? cleanPublicCopy(source.renter)
        : fallbackImpact.renter,
    investor:
      typeof source.investor === "string"
        ? cleanPublicCopy(source.investor)
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
  return polishRadarLink({
    id: row.id,
    title: cleanPublicCopy(row.title),
    sourceName: cleanPublicCopy(row.source_name),
    sourceUrl: row.source_url,
    submittedAt: row.submitted_at.slice(0, 10),
    category: toCategory(row.category),
    regions: toRegions(row.regions),
    summaryBullets:
      row.summary_bullets.length > 0
        ? cleanPublicCopyList(row.summary_bullets)
        : ["관리자 검토 또는 AI 요약 생성 대기 중입니다."],
    whyItMatters:
      cleanPublicCopy(row.why_it_matters || "") ||
      "아직 요약이 생성되지 않았습니다. 이 이슈가 중요한 이유는 관리자 검토 후 채워집니다.",
    audienceImpact: toAudienceImpact(row.audience_impact),
    checkpoints:
      row.checkpoints.length > 0
        ? cleanPublicCopyList(row.checkpoints)
        : ["원문 출처 확인", "지역/카테고리 영향 범위 확인", "확정 정보와 해석 분리"],
    score: row.score,
    isDailyPick: row.is_daily_pick,
    impactLine:
      cleanPublicCopy(row.impact_line || "") ||
      "관리자 승인 또는 AI 요약 생성 후 영향 한 줄이 채워집니다.",
    readingMinutes: row.reading_minutes,
    isSample: row.is_sample,
    evidenceCount: row.evidence_count ?? 0,
    evidenceUpdatedAt: row.evidence_updated_at,
    groundingNotes: cleanPublicCopyList(row.grounding_notes ?? []),
    uncertainties: cleanPublicCopyList(row.uncertainties ?? []),
  });
}

export async function getEvidenceForLink(
  linkId: string,
): Promise<EvidenceObservation[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("link_observations")
    .select("relevance,data_observations(*)")
    .eq("link_id", linkId)
    .order("relevance", { ascending: false });

  if (error) {
    return [];
  }

  return ((data ?? []) as LinkObservationJoinRow[])
    .flatMap((row) => {
      const observation = Array.isArray(row.data_observations)
        ? row.data_observations[0]
        : row.data_observations;

      return observation ? [mapObservationRow(observation)] : [];
    })
    .sort((a, b) => b.confidence - a.confidence);
}

export async function getPublishedLinks(): Promise<RadarLinksResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      mode: "seed",
      reason: "Supabase env 미설정",
      links: withSampleEvidenceMetadataList(polishRadarLinks(getLatestLinks())),
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
      links: withSampleEvidenceMetadataList(polishRadarLinks(getLatestLinks())),
    };
  }

  const links = data.map(mapLinkRow);
  const realLinks = links.filter((link) => !link.isSample);

  return {
    mode: "supabase",
    links: realLinks.length >= 8 ? realLinks : links,
  };
}

export async function getHomeData(category?: Category, region?: Region) {
  const result = await getPublishedLinks();

  if (result.mode === "seed") {
    return {
      mode: result.mode,
      reason: result.reason,
      allLinks: withSampleEvidenceMetadataList(polishRadarLinks(getLatestLinks())),
      filteredLinks: withSampleEvidenceMetadataList(
        polishRadarLinks(getFilteredLinks(category, region)),
      ),
      dailyPicks: withSampleEvidenceMetadataList(polishRadarLinks(getDailyPicks(4))),
      trendingLinks: withSampleEvidenceMetadataList(
        polishRadarLinks(getTrendingLinks(5)),
      ),
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
    allLinks: result.links,
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
      links: withSampleEvidenceMetadataList(polishRadarLinks(getDailyPicks(limit))),
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
    const polishedLink = link
      ? withSampleEvidenceMetadata(polishRadarLink(link))
      : undefined;

    return polishedLink
      ? {
          mode: "seed" as const,
          reason: "Supabase env 미설정",
          link: polishedLink,
          evidence: getSampleEvidenceForLink(polishedLink),
          relatedLinks: polishRadarLinks(getRelatedLinks(polishedLink)),
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
    const polishedSeedLink = seedLink
      ? withSampleEvidenceMetadata(polishRadarLink(seedLink))
      : undefined;

    if (!polishedSeedLink) {
      return null;
    }

    return {
      mode: "seed" as const,
      reason: error ? `Supabase 조회 실패: ${error.message}` : "DB row 없음",
      link: polishedSeedLink,
      evidence: getSampleEvidenceForLink(polishedSeedLink),
      relatedLinks: polishRadarLinks(getRelatedLinks(polishedSeedLink)),
    };
  }

  const link = mapLinkRow(data);
  const evidence = await getEvidenceForLink(link.id);
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
    evidence,
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
      evidenceCounts: {} as Record<string, number>,
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
      evidenceCounts: {} as Record<string, number>,
    };
  }

  return {
    ok: true as const,
    links: data,
    evidenceCounts: Object.fromEntries(
      data.map((link) => [link.id, link.evidence_count ?? 0]),
    ),
  };
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
