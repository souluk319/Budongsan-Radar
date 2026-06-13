import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { requireAdmin } from "@/lib/auth";
import { getRssIngestSecret } from "@/lib/env";
import { isCategory, isRegion } from "@/lib/radar-data";
import { canonicalizeUrl, createStableId, sourceNameFromUrl } from "@/lib/slug";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const parser = new Parser();

async function isAuthorized(request: Request) {
  const secret = getRssIngestSecret();
  const providedSecret =
    request.headers.get("x-ingest-secret") ??
    new URL(request.url).searchParams.get("secret");

  if (secret && providedSecret === secret) {
    return { ok: true as const };
  }

  return requireAdmin();
}

export async function POST(request: Request) {
  const authorized = await isAuthorized(request);

  if (!authorized.ok) {
    return NextResponse.json(
      { message: authorized.message },
      { status: authorized.status },
    );
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase admin env가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const { data: sources, error } = await supabase
    .from("rss_sources")
    .select("*")
    .eq("enabled", true);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!sources || sources.length === 0) {
    return NextResponse.json({
      message: "활성 RSS source가 없습니다.",
      imported: 0,
    });
  }

  let imported = 0;
  const failures: string[] = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const category = isCategory(source.category) ? source.category : "지역 이슈";
      const validRegions = source.default_regions.filter(isRegion);
      const defaultRegions = validRegions.length > 0 ? validRegions : ["전국"];
      const rows = feed.items
        .slice(0, 20)
        .map((item) => {
          const link = item.link;
          const title = item.title?.trim();

          if (!link || !title) {
            return null;
          }

          const sourceUrl = canonicalizeUrl(link);

          return {
            id: createStableId(title, sourceUrl),
            title,
            source_url: sourceUrl,
            source_name: source.name || sourceNameFromUrl(sourceUrl),
            category,
            regions: defaultRegions,
            submitted_at: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
            status: "pending" as const,
            source_type: "rss" as const,
            raw_excerpt:
              item.contentSnippet?.slice(0, 1200) ??
              item.content?.replace(/<[^>]+>/g, " ").slice(0, 1200) ??
              null,
            impact_line: "RSS로 수집되어 관리자 검토 대기 중인 링크입니다.",
          };
        })
        .filter((row): row is NonNullable<typeof row> => Boolean(row));

      if (rows.length > 0) {
        const { data, error: upsertError } = await supabase
          .from("links")
          .upsert(rows, {
            onConflict: "source_url",
            ignoreDuplicates: true,
          })
          .select("id");

        if (upsertError) {
          failures.push(`${source.name}: ${upsertError.message}`);
        } else {
          imported += data?.length ?? 0;
        }
      }

      await supabase
        .from("rss_sources")
        .update({ last_fetched_at: new Date().toISOString() })
        .eq("id", source.id);
    } catch (error) {
      failures.push(
        `${source.name}: ${error instanceof Error ? error.message : "수집 실패"}`,
      );
    }
  }

  revalidatePath("/admin");

  return NextResponse.json({
    imported,
    failures,
    message:
      failures.length > 0
        ? `RSS 수집 완료: ${imported}개 저장, ${failures.length}개 실패`
        : `RSS 수집 완료: ${imported}개 저장`,
  });
}
