import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/briefing", label: "브리프" },
  { href: "/submit", label: "제보" },
];

export async function SiteHeader() {
  const auth = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-[#eadfce] bg-[#fffdf8]/95 backdrop-blur">
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-[3.25rem] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            aria-label="집집 홈"
            className="inline-flex min-w-0 items-center gap-2"
          >
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#14110f] text-[0.82rem] font-black text-[#fffdf8]"
              aria-hidden
            >
              집
            </span>
            <span className="block text-[1.35rem] font-black leading-none text-[#14110f]">
              집집
            </span>
          </Link>
          <nav className="hidden items-center gap-1.5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-8 items-center rounded-md px-3 text-sm font-bold text-[#5e554b] hover:bg-white hover:text-[#14110f]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/briefing"
            className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-black text-[#5e554b] hover:bg-white hover:text-[#14110f] md:hidden"
          >
            브리프
          </Link>
          <Link
            href="/submit"
            className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-black text-[#5e554b] hover:bg-white hover:text-[#14110f] md:hidden"
          >
            제보
          </Link>
          {auth.user ? (
            <span className="inline-flex h-8 max-w-[8rem] shrink-0 items-center truncate rounded-md border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-800 sm:max-w-[12rem]">
              {auth.user.isAdmin ? "운영자" : "사용자"} · {auth.user.email}
            </span>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-8 shrink-0 items-center rounded-md bg-[#14110f] px-3 text-sm font-bold text-white hover:bg-[#342b23]"
            >
              로그인
            </Link>
          )}
          {auth.user ? <SignOutButton /> : null}
        </div>
      </div>
    </header>
  );
}
