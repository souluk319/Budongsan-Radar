"use client";

import { useState } from "react";
import { categories, regions } from "@/lib/radar-data";
import Link from "next/link";

type SubmitState = {
  message: string;
  tone: "idle" | "success" | "error";
};

type SubmitLinkFormProps = {
  canSubmit: boolean;
  isConfigured: boolean;
};

function toFriendlyMessage(message: string | undefined, fallback: string) {
  if (!message) {
    return fallback;
  }

  if (/supabase|env|환경변수/i.test(message)) {
    return "지금은 저장 기능을 준비 중입니다. 잠시 후 다시 시도해주세요.";
  }

  if (/pending|관리자 승인 대기/i.test(message)) {
    return "제보가 도착했습니다. 집집이 확인한 뒤 브리프에 반영할게요.";
  }

  return message;
}

export function SubmitLinkForm({ canSubmit, isConfigured }: SubmitLinkFormProps) {
  const [state, setState] = useState<SubmitState>({
    message: "",
    tone: "idle",
  });
  const [pending, setPending] = useState(false);

  if (!canSubmit) {
    return (
      <section className="grid gap-5">
        <div>
          <p className="text-sm font-semibold text-[#11140f]">링크 정보</p>
          <h3 className="mt-1 text-xl font-semibold leading-snug text-[#14110f]">
            좋은 링크 하나면 오늘 브리프가 더 좋아집니다
          </h3>
        </div>

        <div className="rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] p-4 text-sm font-normal leading-6 text-[#667174]">
          {isConfigured
            ? "제보는 로그인 후 보낼 수 있습니다. 보내주신 링크는 집집이 확인한 뒤 브리프 후보로 올립니다."
            : "계정 기능을 준비 중입니다. 지금은 브리프를 먼저 둘러볼 수 있습니다."}
          {isConfigured ? (
            <Link
              href="/login?next=/submit"
              className="mt-3 inline-flex h-9 items-center rounded-full bg-[#11140f] px-4 text-sm font-semibold text-white hover:bg-[#2a2d2f]"
            >
              로그인 후 제보하기
            </Link>
          ) : null}
        </div>

        <div className="grid gap-3 rounded-xl border border-[#cbd6d8] bg-white/70 p-4">
          <p className="text-sm font-semibold text-[#14110f]">제보에 필요한 것</p>
          <div className="divide-y divide-[#dfe8ea] text-sm font-normal leading-6 text-[#4f5a5d]">
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <span className="font-semibold text-[#11140f]">원문 URL</span>
              <span>출처를 확인할 수 있는 기사, 공지, 리포트 링크</span>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <span className="font-semibold text-[#11140f]">제목</span>
              <span>무슨 이슈인지 한눈에 보이는 짧은 제목</span>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <span className="font-semibold text-[#11140f]">분류</span>
              <span>정책, 전세, 청약, 지역처럼 영향을 볼 기준</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] p-4 text-sm font-normal leading-6 text-[#667174]">
          제보한 링크는 바로 공개되지 않습니다. 집집이 출처와 맥락을 확인한 뒤
          브리프에 반영합니다.
        </div>
      </section>
    );
  }

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
            message: toFriendlyMessage(
              payload.message,
              "제보를 보내지 못했습니다. 잠시 후 다시 시도해주세요.",
            ),
            tone: "error",
          });
          setPending(false);
          return;
        }

        event.currentTarget.reset();
        setState({
          message: toFriendlyMessage(
            payload.message,
            "제보가 도착했습니다. 집집이 확인한 뒤 브리프에 반영할게요.",
          ),
          tone: "success",
        });
        setPending(false);
      }}
    >
      <div>
        <p className="text-sm font-semibold text-[#11140f]">링크 정보</p>
        <h3 className="mt-1 text-xl font-semibold leading-snug text-[#14110f]">
          좋은 링크 하나면 오늘 브리프가 더 좋아집니다
        </h3>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-[#14110f]" htmlFor="url">
          원문 URL
        </label>
        <input
          required
          id="url"
          name="url"
          type="url"
          placeholder="https://news.example.com/article"
          className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-normal text-[#14110f] outline-none transition placeholder:text-[#8a9698] focus:border-[#14110f] focus:bg-white"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-[#14110f]" htmlFor="title">
          제목
        </label>
        <input
          required
          id="title"
          name="title"
          type="text"
          placeholder="예: 전세대출 금리 변화가 세입자에게 주는 영향"
          className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-normal text-[#14110f] outline-none transition placeholder:text-[#8a9698] focus:border-[#14110f] focus:bg-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-[#14110f]"
            htmlFor="category"
          >
            카테고리
          </label>
          <select
            id="category"
            name="category"
            className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-normal text-[#14110f] outline-none transition focus:border-[#14110f] focus:bg-white"
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
            className="text-sm font-semibold text-[#14110f]"
            htmlFor="region"
          >
            지역
          </label>
          <select
            id="region"
            name="region"
            className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-normal text-[#14110f] outline-none transition focus:border-[#14110f] focus:bg-white"
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

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-full bg-[#11140f] px-5 text-sm font-semibold text-white transition hover:bg-[#2a2d2f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "보내는 중" : "브리프에 제보하기"}
        </button>
        {state.message ? (
          <span
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
              state.tone === "success"
                ? "border-[#b9dec7] bg-[#f0fbf3] text-[#176b3a]"
                : "border-[#f0c8c4] bg-[#fff4f2] text-[#9f2f25]"
            }`}
          >
            {state.message}
          </span>
        ) : null}
      </div>

      <div className="rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] p-4 text-sm font-normal leading-6 text-[#667174]">
        제보한 링크는 바로 공개되지 않습니다. 집집이 출처와 맥락을 확인한 뒤
        브리프에 반영합니다.
      </div>
    </form>
  );
}
