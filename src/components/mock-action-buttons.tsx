"use client";

import { useState } from "react";

type MockActionButtonsProps = {
  compact?: boolean;
};

export function MockActionButtons({ compact = false }: MockActionButtonsProps) {
  const [recommended, setRecommended] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setRecommended((value) => !value)}
        className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-100"
      >
        {recommended ? "추천됨" : compact ? "추천" : "추천 데모"}
      </button>
      <button
        type="button"
        onClick={() => setSaved((value) => !value)}
        className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-100"
      >
        {saved ? "저장됨" : compact ? "저장" : "저장 데모"}
      </button>
      <span className="text-xs text-zinc-500">실제 저장 없음</span>
    </div>
  );
}
