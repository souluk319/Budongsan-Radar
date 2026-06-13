"use client";

import { useState } from "react";

type ActionButtonsProps = {
  linkId: string;
  compact?: boolean;
};

type Notice = {
  message: string;
  tone: "success" | "error";
};

export function ActionButtons({ linkId, compact = false }: ActionButtonsProps) {
  const [recommended, setRecommended] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState<"save" | "vote" | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  async function mutate(kind: "save" | "vote") {
    setPending(kind);
    setNotice(null);

    const response = await fetch(`/api/links/${linkId}/${kind}`, {
      method: "POST",
    });
    const payload = (await response.json()) as {
      saved?: boolean;
      voted?: boolean;
      message?: string;
    };

    if (!response.ok) {
      setNotice({
        message: payload.message ?? "처리에 실패했습니다.",
        tone: "error",
      });
      setPending(null);
      return;
    }

    if (kind === "save") {
      setSaved(Boolean(payload.saved));
    } else {
      setRecommended(Boolean(payload.voted));
    }

    setNotice({
      message:
        kind === "save"
          ? payload.saved
            ? "저장했습니다."
            : "저장을 해제했습니다."
          : payload.voted
            ? "추천했습니다."
            : "추천을 해제했습니다.",
      tone: "success",
    });
    setPending(null);
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending === "vote"}
          onClick={() => mutate("vote")}
          className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {recommended ? "추천됨" : compact ? "추천" : "추천"}
        </button>
        <button
          type="button"
          disabled={pending === "save"}
          onClick={() => mutate("save")}
          className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saved ? "저장됨" : compact ? "저장" : "저장"}
        </button>
        <span className="text-xs text-zinc-500">로그인 시 실제 저장</span>
      </div>
      {notice ? (
        <p
          className={`text-xs font-semibold ${
            notice.tone === "success" ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {notice.message}
        </p>
      ) : null}
    </div>
  );
}
