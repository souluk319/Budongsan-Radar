"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NaverNewsIngestButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState("부동산 정책 대출 청약 전세");
  const [message, setMessage] = useState("");

  async function ingest() {
    setPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/naver/ingest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const payload = (await response.json()) as { message?: string };

      setMessage(payload.message ?? "네이버 뉴스 후보 수집 요청 완료");

      if (response.ok) {
        router.refresh();
      }
    } catch {
      setMessage("네이버 뉴스 후보 수집 요청에 실패했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-3">
      <label className="grid gap-1 text-sm font-black text-[#14110f]">
        검색어
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-10 rounded-md border border-[#d9cdbc] bg-white px-3 text-sm font-semibold text-[#14110f] outline-none focus:border-[#14110f]"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={pending || query.trim().length === 0}
          onClick={ingest}
          className="h-10 rounded-md bg-[#14110f] px-4 text-sm font-black text-white hover:bg-[#342b23] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "수집 중" : "네이버 후보 수집"}
        </button>
        {message ? (
          <p className="text-sm font-semibold text-[#6b6254]">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
