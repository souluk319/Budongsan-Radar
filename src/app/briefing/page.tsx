import type { Metadata } from "next";
import { DailyBriefingList } from "@/components/daily-briefing-list";
import { SiteHeader } from "@/components/site-header";
import { getBriefingData } from "@/lib/radar-repository";

export const metadata: Metadata = {
  title: "집집 브리프",
  description: "오늘 볼 부동산 이슈만 짧게 모아보는 집집 데일리 브리프",
  alternates: {
    canonical: "/briefing",
  },
};

export default async function BriefingPage() {
  const { links } = await getBriefingData(10);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#f7f5ef]">
        <section className="mx-auto w-full max-w-5xl px-4 pb-5 pt-5 sm:px-6 sm:pb-7 sm:pt-8 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black text-[#d97706]">
              집집 브리프
            </p>
            <h1 className="mt-2 text-[1.85rem] font-black leading-tight text-[#14110f] sm:text-4xl [word-break:keep-all]">
              오늘 볼 부동산 이슈만 모았습니다
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#51483d]">
              꼭 볼 것부터 가볍게 넘길 것까지, 내 결정에 닿는 흐름만 짧게 봅니다.
            </p>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-5xl items-start gap-4 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:px-8">
          <DailyBriefingList links={links} showSummary />
          <aside className="hidden self-start rounded-md border border-[#eadfce] bg-white p-4 lg:grid">
            <p className="text-sm font-black text-[#14110f]">읽는 순서</p>
            <div className="mt-3 grid gap-3 text-sm font-semibold leading-6 text-[#51483d]">
              <p>1. 맨 위 이슈부터 오늘 분위기를 잡습니다.</p>
              <p>2. 제목 아래 한 줄만 읽어도 흐름이 보이게 정리했습니다.</p>
              <p>3. 더 필요하면 상세에서 근거와 체크포인트를 확인합니다.</p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
