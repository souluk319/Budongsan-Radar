import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  collectEvidenceForLink,
  persistEvidenceForLink,
} from "@/lib/evidence";
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

  const link = mapLinkRow(row);
  const collected = await collectEvidenceForLink({
    ...link,
    rawExcerpt: row.raw_excerpt,
  });

  if (collected.observations.length === 0) {
    return NextResponse.json(
      {
        message: "저장할 근거를 찾지 못했습니다.",
        warnings: collected.warnings,
      },
      { status: 424 },
    );
  }

  try {
    const saved = await persistEvidenceForLink(
      supabase,
      id,
      collected.observations,
    );

    revalidatePath("/");
    revalidatePath("/briefing");
    revalidatePath(`/links/${id}`);
    revalidatePath("/admin");

    return NextResponse.json({
      message: `근거 ${saved.savedCount}개 연결 완료. 총 ${saved.totalCount}개`,
      warnings: collected.warnings,
      savedCount: saved.savedCount,
      totalCount: saved.totalCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "근거 데이터 저장 실패",
        warnings: collected.warnings,
      },
      { status: 500 },
    );
  }
}
