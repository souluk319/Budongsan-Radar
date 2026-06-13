"use client";

import { useState } from "react";
import { categories, regions } from "@/lib/radar-data";

type SubmitState = "idle" | "submitted";

export function SubmitLinkForm() {
  const [state, setState] = useState<SubmitState>("idle");

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setState("submitted");
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
        제출은 데모 동작입니다. 지금은 DB 저장, OpenAI 요약 생성, 관리자 승인
        플로우가 붙어 있지 않습니다.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          링크 제출 데모
        </button>
        {state === "submitted" ? (
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
            mock 제출 완료. 실제 저장은 아직 없습니다.
          </span>
        ) : null}
      </div>
    </form>
  );
}
