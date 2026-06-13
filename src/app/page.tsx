import Link from "next/link";
import { DailyBriefingList } from "@/components/daily-briefing-list";
import { FilterBar } from "@/components/filter-bar";
import { LinkCard } from "@/components/link-card";
import { SiteHeader } from "@/components/site-header";
import {
  isCategory,
  isRegion,
} from "@/lib/radar-data";
import { getHomeData } from "@/lib/radar-repository";

type HomeProps = {
  searchParams?: Promise<{
    category?: string;
    region?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const selectedCategory = isCategory(params?.category)
    ? params.category
    : undefined;
  const selectedRegion = isRegion(params?.region) ? params.region : undefined;
  const {
    mode,
    reason,
    filteredLinks,
    dailyPicks,
    trendingLinks,
    totalDailyPicks,
  } = await getHomeData(selectedCategory, selectedRegion);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_21rem] lg:px-8">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-800">
                  {mode === "supabase" ? "DB 연결" : "Seed fallback"}
                </span>
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-600">
                  {mode === "supabase" ? "실제 저장 지원" : reason ?? "샘플 데이터"}
                </span>
              </div>
              <h2 className="max-w-3xl text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
                오늘 부동산판에서 봐야 할 이슈를 5분 안에 정리한다
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
                매물 플랫폼이 아니라 뉴스, 리포트, 정책, 커뮤니티 이슈를
                사용자 상황별로 해석하는 정보 보드입니다. Supabase가 설정되면
                실제 링크/저장/추천 흐름을 사용하고, 미설정 상태에서는 seed
                샘플로 제품 형태를 확인합니다.
              </p>
            </div>

            <aside className="grid content-start gap-3 border-t border-zinc-200 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <p className="font-mono text-xl font-bold text-zinc-950">
                    {filteredLinks.length}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">표시 이슈</p>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <p className="font-mono text-xl font-bold text-zinc-950">
                    {totalDailyPicks}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">오늘 픽</p>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <p className="font-mono text-xl font-bold text-zinc-950">
                    {mode === "supabase" ? "on" : "off"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">실제 저장</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-zinc-600">
                추천/저장/제출은 로그인과 Supabase env가 있을 때 실제 DB에
                기록됩니다.
              </p>
            </aside>
          </div>
        </section>

        <FilterBar
          selectedCategory={selectedCategory}
          selectedRegion={selectedRegion}
        />

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:px-8">
          <div className="grid min-w-0 gap-8">
            <section className="grid gap-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-500">
                    Today Briefing
                  </p>
                  <h2 className="text-2xl font-bold text-zinc-950">
                    오늘 먼저 볼 이슈
                  </h2>
                </div>
                <Link
                  href="/briefing"
                  className="h-9 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-900"
                >
                  전체 브리핑
                </Link>
              </div>
              <DailyBriefingList links={dailyPicks} />
            </section>

            <section className="grid gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-500">
                  Latest Links
                </p>
                <h2 className="text-2xl font-bold text-zinc-950">
                  필터 결과
                </h2>
              </div>
              {filteredLinks.length > 0 ? (
                <div className="grid gap-3">
                  {filteredLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-zinc-200 bg-white p-6">
                  <h3 className="text-base font-semibold text-zinc-950">
                    조건에 맞는 이슈가 없습니다
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    카테고리나 지역 필터를 줄이면 더 많은 이슈를 볼 수
                    있습니다.
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="grid content-start gap-4">
            <section className="grid gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-500">
                  Trending
                </p>
                <h2 className="text-xl font-bold text-zinc-950">
                  레이더 점수 상위
                </h2>
              </div>
              <div className="grid gap-3">
                {trendingLinks.map((link, index) => (
                  <LinkCard key={link.id} link={link} rank={index + 1} />
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </>
  );
}
