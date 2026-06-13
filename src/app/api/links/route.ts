import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { categories, isCategory, isRegion, regions } from "@/lib/radar-data";
import { canonicalizeUrl, createStableId, sourceNameFromUrl } from "@/lib/slug";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const submitLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(3).max(180),
  category: z.string(),
  regions: z.array(z.string()).min(1).max(5),
});

export async function POST(request: Request) {
  const user = await requireUser();

  if (!user.ok) {
    return NextResponse.json({ message: user.message }, { status: user.status });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase env가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const parsed = submitLinkSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "URL, 제목, 카테고리, 지역을 확인하세요." },
      { status: 400 },
    );
  }

  const category = isCategory(parsed.data.category)
    ? parsed.data.category
    : categories[0];
  const submittedRegions = parsed.data.regions.filter(isRegion);
  const validRegions = submittedRegions.length > 0 ? submittedRegions : [regions[0]];
  const sourceUrl = canonicalizeUrl(parsed.data.url);

  const { error } = await supabase.from("links").insert({
    id: createStableId(parsed.data.title, sourceUrl),
    title: parsed.data.title,
    source_url: sourceUrl,
    source_name: sourceNameFromUrl(sourceUrl),
    category,
    regions: validRegions,
    created_by: user.user.id,
    status: "pending",
    source_type: "user",
    impact_line: "사용자 제출 후 관리자 검토 대기 중인 링크입니다.",
    raw_excerpt: null,
  });

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({
    message: "제출 완료. 관리자 승인 대기 상태로 저장됐습니다.",
  });
}
