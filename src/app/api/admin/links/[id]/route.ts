import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateSchema = z.object({
  status: z.enum(["pending", "published", "rejected"]),
});

export async function PATCH(request: Request, { params }: RouteContext) {
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

  const parsed = updateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: "잘못된 상태값입니다." }, { status: 400 });
  }

  const { error } = await supabase
    .from("links")
    .update({
      status: parsed.data.status,
      published_at:
        parsed.data.status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/briefing");
  revalidatePath(`/links/${id}`);
  revalidatePath("/admin");

  return NextResponse.json({
    message:
      parsed.data.status === "published"
        ? "승인 완료"
        : parsed.data.status === "rejected"
          ? "반려 완료"
          : "pending으로 변경 완료",
  });
}
