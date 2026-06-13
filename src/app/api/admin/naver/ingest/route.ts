import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isCategory, isRegion } from "@/lib/radar-data";
import { searchNaverNews } from "@/lib/naver-news";
import { canonicalizeUrl, createStableId, sourceNameFromUrl } from "@/lib/slug";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = {
  query?: unknown;
  category?: unknown;
  regions?: unknown;
};

export async function POST(request: Request) {
  const authorized = await requireAdmin();

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

  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const query =
    typeof body.query === "string" && body.query.trim()
      ? body.query.trim()
      : "부동산 정책 대출 청약 전세";
  const category =
    typeof body.category === "string" && isCategory(body.category)
      ? body.category
      : "지역 이슈";
  const regions =
    Array.isArray(body.regions) && body.regions.some(isRegion)
      ? body.regions.filter(isRegion)
      : ["전국"];

  const search = await searchNaverNews(query, 10);
  const rows = search.items.map((item) => {
    const sourceUrl = canonicalizeUrl(item.originallink || item.link);

    return {
      id: createStableId(item.title, sourceUrl),
      title: item.title,
      source_url: sourceUrl,
      source_name: sourceNameFromUrl(sourceUrl),
      category,
      regions,
      submitted_at: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      status: "pending" as const,
      source_type: "admin" as const,
      raw_excerpt: item.description.slice(0, 1200),
      impact_line: "네이버 뉴스 검색으로 수집되어 관리자 검토 대기 중인 링크입니다.",
    };
  });

  if (rows.length === 0) {
    return NextResponse.json({
      imported: 0,
      total: search.total,
      message: "네이버 뉴스 검색 결과가 없습니다.",
    });
  }

  const { data, error } = await supabase
    .from("links")
    .upsert(rows, {
      onConflict: "source_url",
      ignoreDuplicates: true,
    })
    .select("id");

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/admin");

  return NextResponse.json({
    imported: data?.length ?? 0,
    total: search.total,
    message: `네이버 뉴스 후보 ${data?.length ?? 0}개를 검토 대기에 저장했습니다.`,
  });
}
