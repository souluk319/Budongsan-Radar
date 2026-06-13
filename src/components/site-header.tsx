import Link from "next/link";

const navItems = [
  { href: "/", label: "이슈 보드" },
  { href: "/briefing", label: "오늘의 브리핑" },
  { href: "/submit", label: "링크 제출" },
];

export function SiteHeader() {
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
        </nav>
      </div>
    </header>
  );
}
