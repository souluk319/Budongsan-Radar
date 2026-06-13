"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminLinkActionsProps = {
  linkId: string;
};

export function AdminLinkActions({ linkId }: AdminLinkActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function run(action: "publish" | "reject" | "summary") {
    setPending(action);
    setMessage("");

    const response = await fetch(
      action === "summary"
        ? `/api/admin/links/${linkId}/summary`
        : `/api/admin/links/${linkId}`,
      {
        method: action === "summary" ? "POST" : "PATCH",
        headers: { "content-type": "application/json" },
        body:
          action === "summary"
            ? undefined
            : JSON.stringify({
                status: action === "publish" ? "published" : "rejected",
              }),
      },
    );
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(payload.message ?? "처리에 실패했습니다.");
      setPending(null);
      return;
    }

    setMessage(payload.message ?? "처리 완료");
    setPending(null);
    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("summary")}
          className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-800 hover:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          요약 생성
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("publish")}
          className="h-9 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          승인
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("reject")}
          className="h-9 rounded-md border border-rose-200 bg-rose-50 px-3 text-sm font-semibold text-rose-800 hover:border-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          반려
        </button>
      </div>
      {message ? <p className="text-xs font-semibold text-zinc-600">{message}</p> : null}
    </div>
  );
}
