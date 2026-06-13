"use client";

import { useState } from "react";
import { categories, regions } from "@/lib/radar-data";

type SubmitState = {
  message: string;
  tone: "idle" | "success" | "error";
};

export function SubmitLinkForm() {
  const [state, setState] = useState<SubmitState>({
    message: "",
    tone: "idle",
  });
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setState({ message: "", tone: "idle" });

        const formData = new FormData(event.currentTarget);
        const response = await fetch("/api/links", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            url: formData.get("url"),
            title: formData.get("title"),
            category: formData.get("category"),
            regions: [formData.get("region")],
          }),
        });
        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          setState({
            message: payload.message ?? "제출에 실패했습니다.",
            tone: "error",
          });
          setPending(false);
          return;
        }

        event.currentTarget.reset();
        setState({
          message:
            payload.message ??
            "제출 완료. 관리자 승인 대기 상태로 저장됐습니다.",
          tone: "success",
        });
        setPending(false);
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-zinc-900" htmlFor="url">
          원문 URL
        </label>
        <input
          required
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com/article"
          className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-zinc-900" htmlFor="title">
          제목
        </label>
        <input
          required
          id="title"
          name="title"
          type="text"
          placeholder="예: 대출 규제 변화가 서울 매수 심리에 주는 영향"
          className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-zinc-900"
            htmlFor="category"
          >
            카테고리
          </label>
          <select
            id="category"
            name="category"
            className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900"
            defaultValue="정책"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-zinc-900"
            htmlFor="region"
          >
            지역
          </label>
          <select
            id="region"
            name="region"
            className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900"
            defaultValue="전국"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
        제출은 Supabase가 설정되고 로그인된 사용자에게만 실제 저장됩니다.
        저장된 링크는 관리자 승인 전까지 pending 상태입니다.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "저장 중" : "링크 제출"}
        </button>
        {state.message ? (
          <span
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
              state.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
