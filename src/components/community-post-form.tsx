"use client";

import Link from "next/link";
import { useState } from "react";
import {
  communityPostTypeLabels,
  communityPostTypes,
} from "@/lib/community-shared";
import { categories, regions } from "@/lib/radar-data";

type CommunityPostFormProps = {
  canSubmit: boolean;
  isConfigured: boolean;
};

type SubmitState = {
  tone: "idle" | "success" | "error";
  message: string;
};

export function CommunityPostForm({
  canSubmit,
  isConfigured,
}: CommunityPostFormProps) {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<SubmitState>({
    tone: "idle",
    message: "",
  });

  if (!canSubmit) {
    return (
      <section className="grid gap-4 rounded-md border border-[#cbd6d8] bg-white/75 p-4 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur">
        <div>
          <p className="text-sm font-black text-[#14110f]">커뮤니티 글쓰기</p>
          <p className="mt-2 text-sm font-medium leading-6 text-[#596366]">
            질문, 지역 소식, 내 상황 상담은 로그인 후 올릴 수 있습니다. 처음에는
            집집이 확인한 글만 공개합니다.
          </p>
        </div>
        {isConfigured ? (
          <Link
            href="/login?next=/community"
            className="inline-flex h-10 w-fit items-center rounded-full bg-[#11140f] px-4 text-sm font-black text-white hover:bg-[#2a2d2f]"
          >
            로그인 후 글쓰기
          </Link>
        ) : (
          <p className="text-sm font-semibold text-[#7a8588]">
            계정 기능을 준비 중입니다.
          </p>
        )}
      </section>
    );
  }

  return (
    <form
      className="grid gap-4 rounded-md border border-[#cbd6d8] bg-white/75 p-4 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setState({ tone: "idle", message: "" });

        const formData = new FormData(event.currentTarget);
        const response = await fetch("/api/community/posts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: formData.get("title"),
            body: formData.get("body"),
            postType: formData.get("postType"),
            region: formData.get("region"),
            category: formData.get("category"),
            sourceUrl: formData.get("sourceUrl"),
          }),
        });
        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          setState({
            tone: "error",
            message:
              payload.message ??
              "글을 접수하지 못했습니다. 잠시 후 다시 시도해주세요.",
          });
          setPending(false);
          return;
        }

        event.currentTarget.reset();
        setState({
          tone: "success",
          message:
            payload.message ??
            "글이 접수됐습니다. 집집이 확인한 뒤 커뮤니티에 공개할게요.",
        });
        setPending(false);
      }}
    >
      <div>
        <p className="text-sm font-black text-[#14110f]">내 질문 올리기</p>
        <p className="mt-1 text-sm font-medium leading-6 text-[#596366]">
          자유게시판이 아니라 부동산 판단에 필요한 질문과 관찰만 받습니다.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black text-[#14110f]" htmlFor="title">
          제목
        </label>
        <input
          required
          id="title"
          name="title"
          minLength={5}
          maxLength={140}
          placeholder="예: 전세 갱신 전에 대출 조건부터 봐야 할까요?"
          className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-medium text-[#14110f] outline-none transition placeholder:text-[#8a9698] focus:border-[#14110f] focus:bg-white"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="grid gap-2">
          <label
            className="text-sm font-black text-[#14110f]"
            htmlFor="postType"
          >
            유형
          </label>
          <select
            id="postType"
            name="postType"
            className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-medium text-[#14110f] outline-none transition focus:border-[#14110f] focus:bg-white"
            defaultValue="question"
          >
            {communityPostTypes.map((type) => (
              <option key={type} value={type}>
                {communityPostTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-black text-[#14110f]" htmlFor="region">
            지역
          </label>
          <select
            id="region"
            name="region"
            className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-medium text-[#14110f] outline-none transition focus:border-[#14110f] focus:bg-white"
            defaultValue="전국"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label
            className="text-sm font-black text-[#14110f]"
            htmlFor="category"
          >
            분류
          </label>
          <select
            id="category"
            name="category"
            className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-medium text-[#14110f] outline-none transition focus:border-[#14110f] focus:bg-white"
            defaultValue="정책"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-black text-[#14110f]" htmlFor="body">
          내용
        </label>
        <textarea
          required
          id="body"
          name="body"
          minLength={10}
          maxLength={2000}
          rows={6}
          placeholder="상황, 지역, 궁금한 점을 적어주세요. 매수·매도 추천을 요구하는 글보다 판단 기준을 묻는 글이 좋습니다."
          className="resize-y rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 py-3 text-sm font-medium leading-6 text-[#14110f] outline-none transition placeholder:text-[#8a9698] focus:border-[#14110f] focus:bg-white"
        />
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-black text-[#14110f]"
          htmlFor="sourceUrl"
        >
          참고 링크
        </label>
        <input
          id="sourceUrl"
          name="sourceUrl"
          type="url"
          placeholder="있으면 기사, 공지, 통계 링크를 붙여주세요"
          className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-medium text-[#14110f] outline-none transition placeholder:text-[#8a9698] focus:border-[#14110f] focus:bg-white"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-full bg-[#11140f] px-5 text-sm font-black text-white transition hover:bg-[#2a2d2f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "접수 중" : "검토 요청하기"}
        </button>
        {state.message ? (
          <span
            className={`rounded-md border px-3 py-2 text-sm font-black ${
              state.tone === "success"
                ? "border-[#b9dec7] bg-[#f0fbf3] text-[#176b3a]"
                : "border-[#f0c8c4] bg-[#fff4f2] text-[#9f2f25]"
            }`}
          >
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
