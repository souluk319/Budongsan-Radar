"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "sign-in" | "sign-up";

type FormState = {
  message: string;
  tone: "idle" | "success" | "error";
};

type LoginFormProps = {
  nextPath: string;
};

function toFriendlyAuthMessage(message: string | undefined, fallback: string) {
  if (!message) {
    return fallback;
  }

  if (/supabase|env|환경변수/i.test(message)) {
    return "지금은 계정 기능을 준비 중입니다. 브리프는 바로 둘러볼 수 있습니다.";
  }

  if (/이메일 확인|메일 확인|email/i.test(message)) {
    return "가입 요청이 도착했습니다. 메일함을 확인한 뒤 다시 로그인해주세요.";
  }

  return message;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({
    message: "",
    tone: "idle",
  });

  async function submit(formData: FormData) {
    setPending(true);
    setState({ message: "", tone: "idle" });

    const response = await fetch(
      mode === "sign-in" ? "/api/auth/sign-in" : "/api/auth/sign-up",
      {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
        headers: { "content-type": "application/json" },
      },
    );
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setState({
        message: toFriendlyAuthMessage(
          payload.message,
          "로그인 처리에 실패했습니다. 이메일과 비밀번호를 다시 확인해주세요.",
        ),
        tone: "error",
      });
      setPending(false);
      return;
    }

    if (mode === "sign-up") {
      setState({
        message: toFriendlyAuthMessage(
          payload.message,
          "가입 요청이 도착했습니다. 메일함을 확인한 뒤 다시 로그인해주세요.",
        ),
        tone: "success",
      });
      setPending(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-5">
      <div>
        <p className="text-sm font-semibold text-[#11140f]">이메일로 로그인</p>
        <h3 className="mt-1 text-xl font-semibold leading-snug text-[#14110f]">
          집집 브리프를 내 계정에 이어둡니다
        </h3>
      </div>

      <div className="inline-grid grid-cols-2 rounded-full border border-[#cbd6d8] bg-[#f8fbfb] p-1">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`h-9 rounded-full px-3 text-sm font-semibold ${
            mode === "sign-in"
              ? "bg-white text-[#14110f]"
              : "text-[#667174]"
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={`h-9 rounded-full px-3 text-sm font-semibold ${
            mode === "sign-up"
              ? "bg-white text-[#14110f]"
              : "text-[#667174]"
          }`}
        >
          가입
        </button>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-[#14110f]" htmlFor="email">
          이메일
        </label>
        <input
          required
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-normal text-[#14110f] outline-none transition focus:border-[#14110f] focus:bg-white"
        />
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-semibold text-[#14110f]"
          htmlFor="password"
        >
          비밀번호
        </label>
        <input
          required
          id="password"
          name="password"
          type="password"
          minLength={6}
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          placeholder="6자 이상"
          className="h-11 rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] px-3 text-sm font-normal text-[#14110f] outline-none transition focus:border-[#14110f] focus:bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-full bg-[#11140f] px-5 text-sm font-semibold text-white transition hover:bg-[#2a2d2f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "처리 중" : mode === "sign-in" ? "브리프 이어보기" : "계정 만들기"}
      </button>

      {state.message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm font-semibold ${
            state.tone === "success"
              ? "border-[#b9dec7] bg-[#f0fbf3] text-[#176b3a]"
              : "border-[#f0c8c4] bg-[#fff4f2] text-[#9f2f25]"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
