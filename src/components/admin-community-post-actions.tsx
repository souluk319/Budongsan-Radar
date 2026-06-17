"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminCommunityPostActionsProps = {
  postId: string;
};

type AdminCommunityAction = "publish" | "reject";

export function AdminCommunityPostActions({
  postId,
}: AdminCommunityPostActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<AdminCommunityAction | null>(null);
  const [message, setMessage] = useState("");

  async function run(action: AdminCommunityAction) {
    setPending(action);
    setMessage("");

    const response = await fetch(`/api/admin/community/${postId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        status: action === "publish" ? "published" : "rejected",
      }),
    });
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
          onClick={() => run("publish")}
          className="h-9 rounded-md bg-[#14110f] px-3 text-sm font-black text-white hover:bg-[#2a2d2f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending === "publish" ? "승인 중" : "승인"}
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
