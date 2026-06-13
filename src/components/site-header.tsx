import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/", label: "이슈 보드" },
  { href: "/briefing", label: "오늘의 브리핑" },
  { href: "/submit", label: "링크 제출" },
  { href: "/admin", label: "관리자" },
];

export async function SiteHeader() {
  const auth = await getCurrentUser();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link href="/" className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Budongsan Radar
          </p>
          <h1 className="text-xl font-bold text-zinc-950">부동산 레이더</h1>
        </Link>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-900 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
          {auth.user ? (
            <>
              <span className="inline-flex h-9 max-w-full items-center truncate rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800">
                {auth.user.isAdmin ? "admin" : "user"} · {auth.user.email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="h-9 rounded-md border border-zinc-300 bg-zinc-950 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
