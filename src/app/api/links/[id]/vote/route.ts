import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: RouteContext) {
  const { id } = await params;
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

  const { data: existing } = await supabase
    .from("link_votes")
    .select("link_id")
    .eq("user_id", user.user.id)
    .eq("link_id", id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("link_votes")
      .delete()
      .eq("user_id", user.user.id)
      .eq("link_id", id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ voted: false });
  }

  const { error } = await supabase.from("link_votes").insert({
    user_id: user.user.id,
    link_id: id,
    value: 1,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ voted: true });
}
