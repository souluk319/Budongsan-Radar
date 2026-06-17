"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminLinkActionsProps = {
  linkId: string;
  evidenceCount?: number;
};

type AdminAction = "evidence" | "summary" | "publish" | "reject";

function endpointFor(linkId: string, action: AdminAction) {
  if (action === "evidence") {
    return `/api/admin/links/${linkId}/evidence`;
  }

  if (action === "summary") {
    return `/api/admin/links/${linkId}/summary`;
  }

  return `/api/admin/links/${linkId}`;
}

export function AdminLinkActions({
  linkId,
  evidenceCount = 0,
}: AdminLinkActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<AdminAction | null>(null);
  const [message, setMessage] = useState("");

  async function run(action: AdminAction) {
    setPending(action);
    setMessage("");

    const response = await fetch(endpointFor(linkId, action), {
      method: action === "publish" || action === "reject" ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body:
        action === "publish" || action === "reject"
          ? JSON.stringify({
              status: action === "publish" ? "published" : "rejected",
            })
          : undefined,
    });
    const payload = (await response.json()) as {
      message?: string;
      warnings?: string[];
    };

    if (!response.ok) {
      setMessage(payload.message ?? "처리에 실패했습니다.");
      setPending(null);
      return;
    }

    const warningSuffix =
      payload.warnings && payload.warnings.length > 0
        ? ` · 확인 필요 ${payload.warnings.length}건`
        : "";

    setMessage(`${payload.message ?? "처리 완료"}${warningSuffix}`);
    setPending(null);
    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2 text-xs font-black">
        <span
          className={
            evidenceCount > 0
              ? "rounded-sm border border-[#abefc6] bg-[#ecfdf3] px-2 py-1 text-[#027a48]"
              : "rounded-sm border border-[#fecdca] bg-[#fff4f2] px-2 py-1 text-[#b42318]"
          }
        >
          {evidenceCount > 0
            ? `근거 ${evidenceCount}개`
            : "공식 근거 없음"}
        </span>
        <span className="rounded-sm border border-[#cbd6d8] bg-white px-2 py-1 text-[#667174]">
          근거 → 요약 → 승인
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("evidence")}
          className="h-9 rounded-md border border-[#f1c27d] bg-[#f8fbfb] px-3 text-sm font-black text-[#11140f] hover:border-[#11140f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending === "evidence" ? "수집 중" : "근거 수집"}
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("summary")}
          className="h-9 rounded-md border border-[#cbd6d8] bg-white px-3 text-sm font-bold text-[#4f5a5d] hover:border-[#14110f] hover:text-[#14110f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          요약
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("publish")}
          className="h-9 rounded-md bg-[#14110f] px-3 text-sm font-black text-white hover:bg-[#2a2d2f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          승인
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("reject")}
          className="h-9 rounded-md border border-[#f0c8c4] bg-[#fff4f2] px-3 text-sm font-bold text-[#9f2f25] hover:border-[#d88b84] disabled:cursor-not-allowed disabled:opacity-60"
        >
          반려
        </button>
      </div>

      {message ? (
        <p className="text-xs font-semibold text-[#667174]">{message}</p>
      ) : null}
    </div>
  );
}
