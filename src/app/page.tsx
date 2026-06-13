import Link from "next/link";
import { AudienceImpactChips } from "@/components/audience-impact-chips";
import { DailyBriefLead } from "@/components/daily-brief-lead";
import { FilterBar } from "@/components/filter-bar";
import { IssueBriefList } from "@/components/issue-brief-list";
import { SiteHeader } from "@/components/site-header";
import { TodayPickCard } from "@/components/today-pick-card";
import { createHomeSignalModel } from "@/lib/home-signals";
import { isCategory, isRegion } from "@/lib/radar-data";
import { getRegionHref } from "@/lib/place-data";
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
    allLinks,
    filteredLinks,
    dailyPicks,
    totalDailyPicks,
  } = await getHomeData(selectedCategory, selectedRegion);
  const hasActiveFilter = Boolean(selectedCategory || selectedRegion);
  const homeModel = createHomeSignalModel({
    allLinks,
    filteredLinks,
    dailyPicks,
    totalDailyPicks,
    hasActiveFilter,
  });
  const liveLinkCount = allLinks.filter((link) => !link.isSample).length;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#f7f5ef]">
        <section className="mx-auto w-full max-w-6xl px-4 pb-7 pt-4 sm:px-6 sm:pb-10 sm:pt-7 lg:px-8">
          <div className="overflow-hidden rounded-lg border border-[#d8c7af] bg-[#fffaf2] shadow-[0_18px_50px_rgba(34,27,19,0.09)]">
            <div className="grid lg:grid-cols-[minmax(0,1.16fr)_minmax(20rem,0.84fr)]">
              <div className="grid min-h-[22rem] content-between gap-6 p-4 sm:p-6 lg:p-7">
                <DailyBriefLead model={homeModel} liveLinkCount={liveLinkCount} />

                <div className="grid gap-3 border-t border-[#e5d4bd] pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-sm bg-[#d97706] px-2.5 py-1 text-xs font-black text-white">
                      강한 신호 {homeModel.strongSignalCount}개
                    </span>
                    <span className="rounded-sm border border-[#d6c6b2] bg-white px-2.5 py-1 text-xs font-black text-[#2b2520]">
                      오늘 중요도 {homeModel.importanceLabel}
                    </span>
                    <span className="rounded-sm border border-[#d6c6b2] bg-white px-2.5 py-1 text-xs font-black text-[#2b2520]">
                      {homeModel.primaryAudience.label} {homeModel.primaryAudience.status}
                    </span>
                    <span className="rounded-sm border border-[#d6c6b2] bg-white px-2.5 py-1 text-xs font-black text-[#2b2520]">
                      실제 수집 {liveLinkCount}건
                    </span>
                  </div>

                  <p className="text-xs font-black text-[#8a4b05]">
                    지역 흐름
                  </p>
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {homeModel.regionFlows.map((flow) => (
                      <Link
                        key={flow.region}
                        href={getRegionHref(flow.region)}
                        className="border-t border-[#d8c7af] pt-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-black text-[#14110f]">
                            {flow.region}
                          </span>
                          <span className="text-[0.68rem] font-black text-[#9a4f00]">
                            {flow.heatLabel === "HOT"
                              ? "뜨거움"
                              : flow.heatLabel === "WATCH"
                                ? "관찰"
                                : flow.heatLabel === "MIXED"
                                  ? "혼조"
                                  : "차분함"}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs font-bold text-[#6b6254]">
                          {flow.topic} · {flow.count}건
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e2d1ba] bg-[#f1e6d5] p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
                <TodayPickCard
                  link={homeModel.strongestLink}
                  importanceLabel={homeModel.importanceLabel}
                  primaryAudience={homeModel.primaryAudience}
                />
              </div>
            </div>

            <div className="border-t border-[#e2d1ba] bg-white/55 p-4 sm:p-5">
              <AudienceImpactChips
                segments={homeModel.audienceSegments}
                initialSegmentLabel={homeModel.primaryAudience.label}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-7 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
          <div className="grid min-w-0 gap-6">
            {hasActiveFilter ? (
              <div className="rounded-md border border-[#eadfce] bg-white px-4 py-3 text-sm leading-6 text-[#51483d]">
                <span className="font-black text-[#14110f]">관심 기준:</span>{" "}
                {selectedCategory ?? "전체 카테고리"} ·{" "}
                {selectedRegion ?? "전체 지역"}에서{" "}
                <span className="font-mono font-black text-[#14110f]">
                  {homeModel.visibleIssues}
                </span>
                개 이슈를 보고 있습니다.
                {homeModel.visibleIssues === 0 ? (
                  <span className="ml-1 font-semibold">
                    아직 맞는 브리프가 없어 조건을 조금 넓혀보세요.
                  </span>
                ) : null}
              </div>
            ) : null}

            <IssueBriefList links={homeModel.signalTapeLinks} />
          </div>

          <aside className="grid content-start gap-5 lg:pt-[4.7rem]">
            <section className="grid gap-3 rounded-md border border-[#eadfce] bg-white p-4">
              <div>
                <p className="text-sm font-black text-[#14110f]">
                  세입자가 오늘 볼 것
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#6b6254]">
                  전세 이슈는 보증, 확정일자, 선순위, 전세가율을 같이 봐야
                  합니다.
                </p>
              </div>
              <Link
                href="/tools/jeonse-check"
                className="inline-flex h-9 w-fit items-center rounded-md bg-[#14110f] px-3.5 text-sm font-black text-white hover:bg-[#342b23]"
              >
                전세 안전 체크
              </Link>
            </section>
            <FilterBar
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
            />
          </aside>
        </section>
      </main>
    </>
  );
}
