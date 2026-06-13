import type { HomeSignalModel } from "@/lib/home-signals";

type DailyBriefLeadProps = {
  model: HomeSignalModel;
};

export function DailyBriefLead({ model }: DailyBriefLeadProps) {
  const headlineLineBreaks: Record<string, string[]> = {
    "오늘은 대출·청약 이슈가 큽니다": [
      "오늘은 대출·청약 이슈가",
      "큽니다",
    ],
    "대출보다 상환액을 먼저 볼 때": [
      "대출보다 상환액을",
      "먼저 볼 때",
    ],
    "전세대출 기대감, 보증금 흐름도 같이 볼 때": [
      "전세대출 기대감,",
      "보증금 흐름도 같이 볼 때",
    ],
    "서울 청약은 다시 뜨겁지만, 입지는 더 갈립니다": [
      "서울 청약은 다시 뜨겁지만,",
      "입지는 더 갈립니다",
    ],
  };
  const headlineParts = headlineLineBreaks[model.briefHeadline];

  return (
    <section className="grid gap-2.5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#6b6254] sm:text-sm">
        <span>오늘 집값 뉴스 한 줄</span>
        <span className="h-1 w-1 rounded-full bg-[#d97706]" aria-hidden />
        <span>{model.dateLabel}</span>
      </div>

      <div className="grid gap-2">
        <h1 className="text-[1.75rem] font-black leading-tight text-[#14110f] min-[390px]:text-[1.9rem] sm:text-5xl">
          {headlineParts ? (
            <>
              {headlineParts.map((part, index) => (
                <span key={part} className="block">
                  {part}
                  {index < headlineParts.length - 1 ? " " : ""}
                </span>
              ))}
            </>
          ) : (
            model.briefHeadline
          )}
        </h1>
        <p className="max-w-2xl text-[0.95rem] font-semibold leading-6 text-[#51483d] sm:text-lg sm:leading-7">
          {model.briefSummary}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-sm bg-[#fff8ec] px-2 py-1 text-xs font-black text-[#9a4f00]">
          오늘 기억할 한 줄
        </span>
        <p className="min-w-0 text-[0.82rem] font-bold leading-5 text-[#2b2520] sm:text-sm sm:leading-6">
          {model.heroMemoryLine}
        </p>
      </div>

      <div className="filter-scroll flex gap-2 overflow-x-auto pt-1">
        {model.keywords.map((keyword) => (
          <span
            key={keyword}
            className="shrink-0 rounded-sm border border-[#e5dac8] bg-white px-2.5 py-1 text-xs font-bold text-[#5e554b]"
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
