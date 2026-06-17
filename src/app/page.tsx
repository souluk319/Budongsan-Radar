import Link from "next/link";
import { FilterBar } from "@/components/filter-bar";
import { HomeSignalBoard } from "@/components/home-signal-board";
import { IssueBriefList } from "@/components/issue-brief-list";
import { RegionFlowSection } from "@/components/region-flow-section";
import { SiteHeader } from "@/components/site-header";
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
  const liveLinkCount = allLinks.filter((link) => !link.isSample).length;
  const pick = homeModel.strongestLink;
  const pickHref = pick ? `/links/${pick.id}` : "/briefing";
  const proofSignals = [
    ["실제 수집", liveLinkCount > 0 ? `${liveLinkCount}건` : "준비 중"],
    ["근거", `${pick?.evidenceCount ?? 0}개`],
    ["강한 신호", `${homeModel.strongSignalCount}개`],
    ["지역 흐름", `${homeModel.regionFlows.length}권역`],
  ];
  const engineRows = [
    ["뉴스 수집", "네이버 뉴스와 RSS 후보를 모읍니다.", "LIVE"],
    ["근거 연결", "ECOS, 실거래, 법령 근거를 붙입니다.", "CHECK"],
    ["판단 번역", "무주택자·세입자·투자자 관점으로 나눕니다.", "BRIEF"],
  ];
  const jeonseRows = [
    ["보증보험", "가입 가능성과 예외 조건을 먼저 봅니다.", "확인"],
    ["선순위", "대출·압류·근저당 위치를 같이 봅니다.", "주의"],
    ["전세가율", "최근 매매가 대비 보증금 위치를 봅니다.", "관찰"],
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <HomeSignalBoard model={homeModel} liveLinkCount={liveLinkCount} />

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
          <div className="grid min-w-0 gap-6">
            {hasActiveFilter ? (
              <div className="rounded-md border border-[#cbd3d5] bg-[#f8fbfb] px-4 py-3 text-sm leading-6 text-[#4d575a]">
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

          <aside className="grid content-start gap-5">
            <RegionFlowSection flows={homeModel.regionFlows} />
            <section className="grid gap-3 rounded-md border border-[#cbd3d5] bg-white p-4">
              <div>
                <p className="text-sm font-black text-[#14110f]">
                  세입자가 오늘 볼 것
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#596366]">
                  전세 이슈는 보증, 확정일자, 선순위, 전세가율을 같이 봐야
                  합니다.
                </p>
              </div>
              <Link
                href="/tools/jeonse-check"
                className="inline-flex h-9 w-fit items-center rounded-full bg-[#11140f] px-4 text-sm font-black text-white hover:bg-[#2a2d2f]"
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

        <section className="border-b border-[#cbd3d5] bg-[#f8fbfb]">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
            <div className="grid gap-5">
              <p className="text-sm font-black uppercase text-[#506064]">
                Data to decision
              </p>
              <h2 className="max-w-2xl text-[2.35rem] font-black leading-[1.02] text-[#11140f] sm:text-6xl [word-break:keep-all]">
                뉴스가 아니라, 오늘 판단할 한 장면.
              </h2>
              <p className="max-w-xl text-lg font-medium leading-8 text-[#30383a] sm:text-xl">
                집집은 부동산 뉴스를 실거래, 금리, 제도 근거와 묶어 오늘 먼저 볼
                이슈와 내 상황별 체크포인트로 바꿉니다.
              </p>
              <div className="grid grid-cols-2 border-y border-[#cbd3d5] sm:grid-cols-4">
                {proofSignals.map(([label, value]) => (
                  <div
                    key={label}
                    className="border-[#cbd3d5] py-4 pr-4 odd:border-r sm:border-r sm:last:border-r-0"
                  >
                    <p className="text-xs font-black uppercase text-[#5b6669]">
                      {label}
                    </p>
                    <p className="mt-1 text-2xl font-black text-[#11140f]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[25rem] overflow-hidden rounded-[1.6rem] border border-[#cbd3d5] bg-[#07110d] p-4 text-white shadow-[0_34px_90px_rgba(11,17,13,0.24)]">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#d7ff49]/12 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-[#b7cbd0]/18 blur-3xl" />
              <div className="relative grid gap-4">
                <div className="flex items-center justify-between gap-3 border-b border-white/12 pb-4">
                  <div>
                    <p className="text-xs font-black uppercase text-[#d7ff49]">
                      Signal engine
                    </p>
                    <p className="mt-1 text-2xl font-black leading-tight">
                      오늘의 집픽
                    </p>
                  </div>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-black text-white/80">
                    LIVE
                  </span>
                </div>

                <div className="rounded-xl bg-white p-4 text-[#11140f]">
                  <p className="text-xs font-black text-[#5b6669]">
                    먼저 볼 이슈
                  </p>
                  <p className="mt-2 text-2xl font-black leading-tight [word-break:keep-all]">
                    {homeModel.todayPickDisplayTitle}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-[#4d575a]">
                    {pick?.impactLine ?? homeModel.briefSummary}
                  </p>
                  <Link
                    href={pickHref}
                    className="mt-4 inline-flex h-10 items-center rounded-full bg-[#11140f] px-5 text-sm font-black text-white hover:bg-[#2a2d2f]"
                  >
                    3분 브리프 보기
                  </Link>
                </div>

                <div className="divide-y divide-white/10 border-y border-white/10">
                  {engineRows.map(([title, body, state]) => (
                    <div
                      key={title}
                      className="grid grid-cols-[1fr_auto] gap-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-black text-white">{title}</p>
                        <p className="mt-1 text-sm font-medium leading-6 text-white/62">
                          {body}
                        </p>
                      </div>
                      <span className="pt-1 text-xs font-black text-[#d7ff49]">
                        {state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#14110f] text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
            <div className="grid gap-5">
              <p className="text-sm font-black uppercase text-[#d7ff49]">
                Jeonse safety
              </p>
              <h2 className="max-w-2xl text-[2.55rem] font-black leading-[0.98] sm:text-6xl [word-break:keep-all]">
                전세 보증금도 한눈에.
              </h2>
              <p className="max-w-xl text-lg font-medium leading-8 text-[#efe5d8] sm:text-xl">
                보증보험, 선순위, 전세가율처럼 흩어진 체크포인트를 세입자가
                오늘 볼 순서로 정리합니다.
              </p>
              <Link
                href="/tools/jeonse-check"
                className="inline-flex h-12 w-fit items-center rounded-full bg-white px-6 text-base font-semibold text-[#11140f] hover:bg-[#e7eff1]"
              >
                전세 안전 체크
              </Link>
            </div>

            <div className="rounded-[1.6rem] border border-white/15 bg-white p-4 text-[#11140f] shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
              <div className="rounded-[1.1rem] bg-[#eef3f4] p-5">
                <p className="text-sm font-semibold text-[#566165]">
                  세입자가 오늘 볼 것
                </p>
                <p className="mt-2 text-3xl font-black leading-tight">
                  보증금 위치를 먼저 확인하세요.
                </p>
                <div className="mt-7 divide-y divide-[#cbd3d5] border-y border-[#cbd3d5]">
                  {jeonseRows.map(([label, body, state]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[1fr_auto] items-start gap-4 py-4"
                    >
                      <div>
                        <p className="text-base font-black text-[#11140f]">
                          {label}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-[#566165]">
                          {body}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#11140f]">
                        {state}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[#11140f]">
                  지역 흐름과 계약 조건을 같이 봐야 합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
