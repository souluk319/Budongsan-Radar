import type { HomeSignalModel } from "@/lib/home-signals";

type DailyBriefLeadProps = {
  model: HomeSignalModel;
  liveLinkCount: number;
};

export function DailyBriefLead({ model, liveLinkCount }: DailyBriefLeadProps) {
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
  const headline = model.heroVerdict || model.briefHeadline;
  const headlineParts = headlineLineBreaks[headline];

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2 text-xs font-black text-[#6b6254] sm:text-sm">
        <span className="text-[#d97706]">오늘의 판세</span>
        <span className="h-1 w-1 rounded-full bg-[#d97706]" aria-hidden />
        <span>{model.dateLabel}</span>
        <span className="h-1 w-1 rounded-full bg-[#d97706]" aria-hidden />
        <span>
          {liveLinkCount > 0
            ? `실제 수집 ${liveLinkCount}건`
            : "자료 수집 중"}
        </span>
      </div>

      <div className="grid gap-3">
        <h1 className="text-[2.15rem] font-black leading-[1.03] text-[#14110f] min-[390px]:text-[2.35rem] sm:text-6xl lg:text-[4rem] [word-break:keep-all]">
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
            headline
          )}
        </h1>
        <p className="max-w-xl text-[1rem] font-bold leading-7 text-[#51483d] sm:text-xl sm:leading-8">
          {model.heroSubVerdict}
        </p>
      </div>

      <div className="grid gap-1.5 border-l-4 border-[#d97706] bg-white/65 py-2 pl-3 pr-2">
        <span className="text-xs font-black text-[#9a4f00]">
          오늘 먼저 볼 것
        </span>
        <p className="min-w-0 text-sm font-black leading-6 text-[#2b2520] sm:text-base sm:leading-7">
          {model.heroMemoryLine}
        </p>
      </div>

      <div className="filter-scroll flex gap-2 overflow-x-auto">
        {model.keywords.map((keyword) => (
          <span
            key={keyword}
            className="shrink-0 rounded-sm border border-[#d6c6b2] bg-white px-2.5 py-1 text-xs font-black text-[#5e554b]"
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
