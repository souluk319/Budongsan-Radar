import { createClient } from "@supabase/supabase-js";
import { radarLinks } from "../src/lib/radar-data.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const rows = radarLinks.map((link) => ({
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
}));

const { error } = await supabase
  .from("links")
  .upsert(rows, { onConflict: "id" });

if (error) {
  console.error(error);
  process.exit(1);
}

console.log(`Seeded ${rows.length} Budongsan Radar sample links.`);
