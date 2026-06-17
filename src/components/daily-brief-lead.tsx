import type { HomeSignalModel } from "@/lib/home-signals";

type DailyBriefLeadProps = {
  model: HomeSignalModel;
  liveLinkCount: number;
};

function getDailyActionHeadline(model: HomeSignalModel) {
  const categories = new Set(
    [
      model.strongestLink?.category,
      ...model.signalTapeLinks.map((link) => link.category),
    ].filter(Boolean),
  );
  const hasLoanOrPolicy = categories.has("정책") || categories.has("대출/금리");

  if (hasLoanOrPolicy && categories.has("전세/월세")) {
    return "오늘은 대출·전세부터 보세요";
  }

  if (hasLoanOrPolicy && categories.has("청약")) {
    return "오늘은 대출·청약부터 보세요";
  }

  if (model.strongestLink?.category === "전세/월세") {
    return "오늘은 전세 이슈부터 보세요";
  }

  if (model.strongestLink?.category) {
    return `오늘은 ${model.strongestLink.category} 이슈부터 보세요`;
  }

  return "오늘 볼 이슈를 모으는 중입니다";
}

export function DailyBriefLead({ model, liveLinkCount }: DailyBriefLeadProps) {
  const headline = getDailyActionHeadline(model);
  const evidenceCount = model.strongestLink?.evidenceCount ?? 0;
  const sourceCountLabel =
    liveLinkCount > 0
      ? `실제 수집 ${liveLinkCount}건`
      : "실제 수집 준비 중";
  const evidenceLabel =
    evidenceCount > 0 ? `공식 근거 ${evidenceCount}개` : "근거 확인 중";

  return (
    <section className="grid gap-2.5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-black text-[#6b6254] sm:text-sm">
        <span className="text-[#d97706]">근거 있는 브리프</span>
        <span className="h-1 w-1 rounded-full bg-[#d97706]" aria-hidden />
        <span>{model.dateLabel} 브리프</span>
        <span className="h-1 w-1 rounded-full bg-[#d97706]" aria-hidden />
        <span>{sourceCountLabel}</span>
      </div>

      <div className="grid gap-2">
        <h1 className="max-w-3xl text-[1.72rem] font-black leading-[1.08] text-[#14110f] min-[390px]:text-[1.85rem] sm:text-5xl lg:text-[3.1rem] [word-break:keep-all]">
          {headline}
        </h1>
        <p className="max-w-2xl text-[0.92rem] font-bold leading-6 text-[#51483d] sm:text-lg sm:leading-8">
          {model.briefSummary}
        </p>
      </div>

      <div className="filter-scroll flex gap-2 overflow-x-auto">
        <span className="shrink-0 rounded-sm bg-white px-2.5 py-1 text-xs font-black text-[#5e554b]">
          {evidenceLabel}
        </span>
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
