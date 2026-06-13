"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch("/api/auth/sign-out", { method: "POST" });
        router.refresh();
        setPending(false);
      }}
      className="h-8 rounded-md border border-[#d9cdbc] bg-white px-2.5 text-xs font-bold text-[#5e554b] transition hover:border-[#14110f] hover:text-[#14110f] disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:px-3 sm:text-sm"
    >
      로그아웃
    </button>
  );
}
