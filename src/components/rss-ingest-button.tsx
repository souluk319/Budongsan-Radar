"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RssIngestButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="grid gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setMessage("");
          const response = await fetch("/api/admin/rss/ingest", {
            method: "POST",
          });
          const payload = (await response.json()) as { message?: string };
          setMessage(payload.message ?? "RSS 수집 요청 완료");
          setPending(false);
          router.refresh();
        }}
        className="h-10 rounded-md bg-[#14110f] px-4 text-sm font-black text-white hover:bg-[#342b23] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "수집 중" : "RSS 수집 실행"}
      </button>
      {message ? (
        <p className="text-sm font-semibold text-[#6b6254]">{message}</p>
      ) : null}
    </div>
  );
}
