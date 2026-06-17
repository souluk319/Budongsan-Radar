"use client";

import { useState } from "react";

type SourceStatus = "ok" | "configured" | "missing" | "error";

type SourceHealth = {
  id: string;
  label: string;
  status: SourceStatus;
  message: string;
  latencyMs?: number;
  checkedAt: string;
};

const statusLabel: Record<SourceStatus, string> = {
  ok: "연결됨",
  configured: "설정됨",
  missing: "미입력",
  error: "확인 필요",
};

const statusClassName: Record<SourceStatus, string> = {
  ok: "bg-[#ecfdf3] text-[#027a48] border-[#abefc6]",
  configured: "bg-[#eff8ff] text-[#175cd3] border-[#b2ddff]",
  missing: "bg-[#f8fafc] text-[#667085] border-[#e4e7ec]",
  error: "bg-[#fff4f2] text-[#b42318] border-[#fecdca]",
};

export function DataSourceHealthPanel() {
  const [pending, setPending] = useState(false);
  const [sources, setSources] = useState<SourceHealth[]>([]);
  const [message, setMessage] = useState("");

  async function check() {
    setPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/data/health", {
        method: "GET",
      });
      const payload = (await response.json()) as {
        message?: string;
        sources?: SourceHealth[];
      };

      if (!response.ok) {
        setMessage(payload.message ?? "데이터 연결 확인에 실패했습니다.");
        return;
      }

      setSources(payload.sources ?? []);
      setMessage("데이터 연결을 확인했습니다.");
    } catch {
      setMessage("데이터 연결 확인 요청에 실패했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="grid gap-4 rounded-md border border-[#cbd6d8] bg-white p-5">
      <div className="grid gap-1">
        <h3 className="text-lg font-black text-[#14110f]">데이터 연결 점검</h3>
        <p className="text-sm font-semibold leading-6 text-[#667174]">
          공공데이터, R-ONE, ECOS, 네이버, 법령 API가 실제로 응답하는지
          확인합니다. 값은 화면에 노출하지 않습니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={check}
          className="h-10 rounded-md bg-[#14110f] px-4 text-sm font-black text-white hover:bg-[#2a2d2f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "확인 중" : "연결 점검"}
        </button>
        {message ? (
          <p className="text-sm font-semibold text-[#667174]">{message}</p>
        ) : null}
      </div>

      {sources.length > 0 ? (
        <div className="divide-y divide-[#dfe8ea] border-y border-[#dfe8ea]">
          {sources.map((source) => (
            <div
              key={source.id}
              className="grid gap-2 py-3 sm:grid-cols-[160px_96px_1fr] sm:items-start"
            >
              <p className="text-sm font-black text-[#14110f]">{source.label}</p>
              <span
                className={`w-fit rounded-sm border px-2 py-1 text-xs font-black ${
                  statusClassName[source.status]
                }`}
              >
                {statusLabel[source.status]}
              </span>
              <p className="text-sm font-semibold leading-6 text-[#667174]">
                {source.message}
                {typeof source.latencyMs === "number" ? (
                  <span className="ml-2 text-xs text-[#667174]">
                    {source.latencyMs}ms
                  </span>
                ) : null}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
