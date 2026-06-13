import { DailyBriefingList } from "@/components/daily-briefing-list";
import { SiteHeader } from "@/components/site-header";
import { getDailyPicks } from "@/lib/radar-data";

export default function BriefingPage() {
  const dailyPicks = getDailyPicks(10);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-zinc-500">
              Daily Briefing
            </p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-950">
              오늘의 부동산 이슈 10개
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
              레이더 점수 기준으로 정렬한 샘플 브리핑입니다. 각 항목은 실제
              뉴스가 아니라 MVP 구조 검증용 데모 콘텐츠입니다.
            </p>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-8 sm:px-6 lg:px-8">
          <DailyBriefingList links={dailyPicks} showSummary />
        </section>
      </main>
    </>
  );
}
