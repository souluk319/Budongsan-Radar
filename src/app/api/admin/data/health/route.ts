import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { checkAllDataSources } from "@/lib/data-source-health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const authorized = await requireAdmin();

  if (!authorized.ok) {
    return NextResponse.json(
      { message: authorized.message },
      { status: authorized.status },
    );
  }

  const sources = await checkAllDataSources();

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    sources,
  });
}
