import { createClient } from "@supabase/supabase-js";
import {
  getSampleEvidenceForLink,
  radarLinks,
} from "../src/lib/radar-data.ts";
import {
  complexProfiles,
  regionProfiles,
} from "../src/lib/place-data.ts";
import { normalizeSupabaseUrl } from "../src/lib/supabase/url.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const supabase = createClient(normalizeSupabaseUrl(url), key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const sampleEvidenceByLinkId = new Map(
  radarLinks.map((link) => [link.id, getSampleEvidenceForLink(link)]),
);

const rows = radarLinks.map((link) => {
  const evidence = sampleEvidenceByLinkId.get(link.id) ?? [];

  return {
    id: link.id,
    title: link.title,
    source_name: link.sourceName,
    source_url: link.sourceUrl,
    submitted_at: `${link.submittedAt}T00:00:00+09:00`,
    published_at: `${link.submittedAt}T00:00:00+09:00`,
    category: link.category,
    regions: link.regions,
    summary_bullets: link.summaryBullets,
    why_it_matters: link.whyItMatters,
    audience_impact: link.audienceImpact,
    checkpoints: link.checkpoints,
    score: link.score,
    is_daily_pick: link.isDailyPick,
    impact_line: link.impactLine,
    reading_minutes: link.readingMinutes,
    is_sample: true,
    status: "published",
    source_type: "sample",
    evidence_count: evidence.length,
    evidence_updated_at: evidence[0]?.observedAt ?? null,
    grounding_notes: [
      "샘플 브리프에서는 근거 데이터 UI와 요약 구조를 확인할 수 있습니다.",
      "실제 운영 링크는 관리자 근거 수집을 거쳐 공식 API 관측값을 연결합니다.",
    ],
    uncertainties: [
      "샘플 수치는 실제 투자 판단이나 가격 예측에 사용할 수 없습니다.",
    ],
  };
});

const { error } = await supabase
  .from("links")
  .upsert(rows, { onConflict: "id" });

if (error) {
  console.error(error);
  process.exit(1);
}

const { error: regionError } = await supabase.from("regions").upsert(
  regionProfiles.map((region) => ({
    id: region.id,
    name: region.name,
    level:
      region.name === "서울"
        ? "metro"
        : region.name === "경기/인천"
          ? "province"
          : "city",
    aliases: [region.name, region.heatLabel],
    external_refs: {
      source: "jipjip_sample",
      headline: region.headline,
      summary: region.summary,
      updatedAt: region.updatedAt,
      evidenceLine: region.evidenceLine,
    },
  })),
  { onConflict: "id" },
);

if (regionError) {
  console.error(regionError);
  process.exit(1);
}

const { error: complexError } = await supabase.from("complexes").upsert(
  complexProfiles.map((complex) => ({
    id: complex.id,
    name: complex.name,
    region_id: complex.regionId,
    address: complex.address,
    external_refs: {
      source: "jipjip_sample",
      headline: complex.headline,
      summary: complex.summary,
      updatedAt: complex.updatedAt,
      safetyLabel: complex.safetyLabel,
    },
  })),
  { onConflict: "id" },
);

if (complexError) {
  console.error(complexError);
  process.exit(1);
}

const { error: buildingError } = await supabase.from("buildings").upsert(
  complexProfiles.map((complex) => ({
    id: `${complex.id}-representative-building`,
    complex_id: complex.id,
    region_id: complex.regionId,
    name: `${complex.name} 대표동`,
    address: complex.address,
    external_refs: {
      source: "jipjip_sample",
      note: "Part2 building-level expansion slot",
    },
  })),
  { onConflict: "id" },
);

if (buildingError) {
  console.error(buildingError);
  process.exit(1);
}

const { error: unitError } = await supabase.from("units").upsert(
  complexProfiles.map((complex) => ({
    id: `${complex.id}-84a-sample-unit`,
    building_id: `${complex.id}-representative-building`,
    label: "84A 표본",
    area_m2: 84,
    floor: "중층",
    external_refs: {
      source: "jipjip_sample",
      note: "Part2 unit-level expansion slot",
    },
  })),
  { onConflict: "id" },
);

if (unitError) {
  console.error(unitError);
  process.exit(1);
}

const evidenceEntries = radarLinks.flatMap((link) =>
  (sampleEvidenceByLinkId.get(link.id) ?? []).map((observation) => ({
    linkId: link.id,
    observation,
  })),
);

if (evidenceEntries.length > 0) {
  const { data: evidenceRows, error: evidenceError } = await supabase
    .from("data_observations")
    .upsert(
      evidenceEntries.map(({ observation }) => ({
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
        payload: {},
        is_sample: true,
        confidence: observation.confidence,
      })),
      { onConflict: "dedupe_key" },
    )
    .select("id,dedupe_key");

  if (evidenceError) {
    console.error(evidenceError);
    process.exit(1);
  }

  const evidenceIdByKey = new Map(
    (evidenceRows ?? []).map((row) => [row.dedupe_key, row.id]),
  );
  const { error: joinError } = await supabase
    .from("link_observations")
    .upsert(
      evidenceEntries
        .map(({ linkId, observation }) => ({
          link_id: linkId,
          observation_id: evidenceIdByKey.get(observation.dedupeKey),
          relevance: 60,
        }))
        .filter((row) => row.observation_id),
      { onConflict: "link_id,observation_id" },
    );

  if (joinError) {
    console.error(joinError);
    process.exit(1);
  }
}

console.log(
  `Seeded ${rows.length} Jipjip links, ${regionProfiles.length} regions, ${complexProfiles.length} complexes, ${complexProfiles.length} units, and ${evidenceEntries.length} evidence rows.`,
);
