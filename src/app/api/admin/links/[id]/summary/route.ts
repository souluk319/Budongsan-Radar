import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { generateRadarSummary } from "@/lib/summary";
import { mapLinkRow } from "@/lib/radar-repository";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json(
      { message: admin.message },
      { status: admin.status },
    );
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase admin env가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const { data: row, error } = await supabase
    .from("links")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json(
      { message: error?.message ?? "링크를 찾을 수 없습니다." },
      { status: error ? 500 : 404 },
    );
  }

  try {
    const link = mapLinkRow(row);
    const { model, summary } = await generateRadarSummary({
      ...link,
      rawExcerpt: row.raw_excerpt,
    });

    const { error: summaryError } = await supabase.from("summaries").insert({
      link_id: id,
      model,
      summary_bullets: summary.summaryBullets,
      why_it_matters: summary.whyItMatters,
      audience_impact: summary.audienceImpact,
      checkpoints: summary.checkpoints,
      confidence: summary.confidence,
    });

    if (summaryError) {
      return NextResponse.json(
        { message: summaryError.message },
        { status: 500 },
      );
    }

    const { error: linkError } = await supabase
      .from("links")
      .update({
        summary_bullets: summary.summaryBullets,
        why_it_matters: summary.whyItMatters,
        audience_impact: summary.audienceImpact,
        checkpoints: summary.checkpoints,
        impact_line: summary.impactLine,
        score: summary.score,
      })
      .eq("id", id);

    if (linkError) {
      return NextResponse.json(
        { message: linkError.message },
        { status: 500 },
      );
    }

    revalidatePath("/");
    revalidatePath("/briefing");
    revalidatePath(`/links/${id}`);
    revalidatePath("/admin");

    return NextResponse.json({ message: "OpenAI 요약 생성 완료" });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "요약 생성 실패" },
      { status: 500 },
    );
  }
}
