import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/briefing", label: "브리프" },
  { href: "/community", label: "커뮤니티" },
  { href: "/submit", label: "제보" },
];

export async function SiteHeader() {
  const auth = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/95 text-white backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            aria-label="집집 홈"
            className="inline-flex min-w-0 items-center"
          >
            <BrandLogo compact tone="dark" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/briefing"
            className="inline-flex h-9 items-center rounded-full px-2.5 text-xs font-medium text-white/82 hover:bg-white/10 md:hidden"
          >
            브리프
          </Link>
          <Link
            href="/community"
            className="inline-flex h-9 items-center rounded-full px-2.5 text-xs font-medium text-white/82 hover:bg-white/10 md:hidden"
          >
            커뮤니티
          </Link>
          <Link
            href="/submit"
            className="inline-flex h-9 items-center rounded-full px-2.5 text-xs font-medium text-white/82 hover:bg-white/10 md:hidden"
          >
            제보
          </Link>
          {auth.user ? (
            <span className="inline-flex h-9 max-w-[8rem] shrink-0 items-center truncate rounded-full border border-white/20 bg-white/10 px-3 text-xs font-medium text-white sm:max-w-[12rem]">
              {auth.user.isAdmin ? "운영자" : "사용자"} · {auth.user.email}
            </span>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 shrink-0 items-center rounded-full border border-[#d6e85c] bg-transparent px-4 text-sm font-medium text-white hover:bg-[#d6e85c] hover:text-[#050505]"
            >
              로그인
            </Link>
          )}
          <Link
            href="/briefing"
            className="hidden h-10 shrink-0 items-center rounded-full bg-[#d6e85c] px-5 text-sm font-semibold text-[#050505] hover:bg-[#e1f174] sm:inline-flex"
          >
            시작하기
          </Link>
          {auth.user ? <SignOutButton /> : null}
        </div>
      </div>
    </header>
  );
}
