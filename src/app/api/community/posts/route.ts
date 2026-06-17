import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { isCommunityPostType } from "@/lib/community-shared";
import { isCategory, isRegion } from "@/lib/radar-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null))
  .pipe(z.string().url().nullable());

const communityPostSchema = z.object({
  title: z.string().trim().min(5).max(140),
  body: z.string().trim().min(10).max(2000),
  postType: z.string(),
  region: z.string(),
  category: z.string().optional().nullable(),
  sourceUrl: optionalUrl,
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

  const parsed = communityPostSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "제목, 내용, 유형, 지역을 확인하세요." },
      { status: 400 },
    );
  }

  const postType = isCommunityPostType(parsed.data.postType)
    ? parsed.data.postType
    : "question";
  const region = isRegion(parsed.data.region) ? parsed.data.region : "전국";
  const category =
    parsed.data.category && isCategory(parsed.data.category)
      ? parsed.data.category
      : null;

  const { error } = await supabase.from("community_posts").insert({
    title: parsed.data.title,
    body: parsed.data.body,
    post_type: postType,
    region,
    category,
    source_url: parsed.data.sourceUrl,
    status: "pending",
    created_by: user.user.id,
    author_email: user.user.email,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/community");

  return NextResponse.json({
    message: "글이 접수됐습니다. 집집이 확인한 뒤 커뮤니티에 공개할게요.",
  });
}
