import Link from "next/link";
import { AudienceImpactChips } from "@/components/audience-impact-chips";
import { DailyBriefLead } from "@/components/daily-brief-lead";
import { FilterBar } from "@/components/filter-bar";
import { IssueBriefList } from "@/components/issue-brief-list";
import { RegionFlowSection } from "@/components/region-flow-section";
import { SiteHeader } from "@/components/site-header";
import { TodayPickCard } from "@/components/today-pick-card";
import { createHomeSignalModel } from "@/lib/home-signals";
import { isCategory, isRegion } from "@/lib/radar-data";
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

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#f7f5ef]">
        <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-6 pt-4 sm:px-6 sm:gap-5 sm:pb-9 sm:pt-7 lg:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <DailyBriefLead model={homeModel} />
          </div>

          <div className="mx-auto grid w-full max-w-3xl gap-4 sm:gap-5">
            <TodayPickCard
              link={homeModel.strongestLink}
              importanceLabel={homeModel.importanceLabel}
              primaryAudience={homeModel.primaryAudience}
            />
            <AudienceImpactChips
              segments={homeModel.audienceSegments}
              initialSegmentLabel={homeModel.primaryAudience.label}
            />
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
            <RegionFlowSection flows={homeModel.regionFlows} />
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
