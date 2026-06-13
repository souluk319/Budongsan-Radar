import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase env가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const parsed = authSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: "이메일과 6자 이상 비밀번호를 입력하세요." },
      { status: 400 },
    );
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  return NextResponse.json({ message: "로그인 완료" });
}
