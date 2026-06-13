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
        message: payload.message ?? "인증 처리에 실패했습니다.",
        tone: "error",
      });
      setPending(false);
      return;
    }

    if (mode === "sign-up") {
      setState({
        message:
          payload.message ??
          "가입 요청이 처리됐습니다. 이메일 확인 설정이 켜져 있으면 메일을 확인하세요.",
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
      <div className="inline-grid grid-cols-2 rounded-md border border-zinc-300 bg-zinc-100 p-1">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`h-9 rounded px-3 text-sm font-semibold ${
            mode === "sign-in" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600"
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={`h-9 rounded px-3 text-sm font-semibold ${
            mode === "sign-up" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600"
          }`}
        >
          가입
        </button>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-zinc-900" htmlFor="email">
          이메일
        </label>
        <input
          required
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900"
        />
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-semibold text-zinc-900"
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
          className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "처리 중" : mode === "sign-in" ? "로그인" : "계정 만들기"}
      </button>

      {state.message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm font-semibold ${
            state.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
