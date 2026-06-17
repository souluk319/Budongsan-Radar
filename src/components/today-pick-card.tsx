import Link from "next/link";
import type { AudienceSegment, HomeSignalModel } from "@/lib/home-signals";
import type { RadarLink } from "@/lib/radar-data";

type TodayPickCardProps = {
  link?: RadarLink;
  importanceLabel: HomeSignalModel["importanceLabel"];
  primaryAudience?: AudienceSegment;
  displayTitle?: string;
  todayActionLine?: string;
};

export function TodayPickCard({
  link,
  importanceLabel,
  primaryAudience,
  displayTitle,
  todayActionLine,
}: TodayPickCardProps) {
  if (!link) {
    return (
      <section className="rounded-md border border-[#eadfce] bg-white p-4 shadow-[0_12px_30px_rgba(34,27,19,0.05)]">
        <p className="text-sm font-black text-[#d97706]">오늘의 집픽</p>
        <p className="mt-2 text-xl font-black leading-tight text-[#14110f]">
          이 조건에 맞는 집픽은 아직 없습니다
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#51483d]">
          조건을 조금 넓히면 오늘 중요한 흐름부터 다시 보여드릴게요.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex h-9 items-center rounded-md bg-[#14110f] px-3.5 text-sm font-black text-white hover:bg-[#342b23]"
        >
          전체 브리프 보기
        </Link>
      </section>
    );
  }

  const regionLabel =
    link.regions.filter((region) => region !== "전국").join(", ") || "전국";

  return (
    <section className="grid h-full content-between gap-3 rounded-md border border-[#d7c3a9] bg-[#fffaf2] p-3.5 shadow-[0_14px_35px_rgba(34,27,19,0.08)] sm:gap-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="rounded-sm bg-[#14110f] px-2.5 py-1 text-xs font-black text-white">
          오늘의 집픽
        </p>
        <p className="text-xs font-black text-[#8a4b05]">
          중요도 {importanceLabel}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-bold text-[#6b6254]">
          {link.category} · {regionLabel}
        </p>
        <Link
          href={`/links/${link.id}`}
          className="text-[1.24rem] font-black leading-[1.12] text-[#14110f] hover:underline min-[390px]:text-[1.36rem] sm:text-3xl [word-break:keep-all]"
        >
          {displayTitle ?? link.title}
        </Link>
        <p className="line-clamp-2 text-sm font-bold leading-6 text-[#51483d] sm:text-base sm:leading-7">
          {link.impactLine}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-[#dcc9ae] pt-3">
        <div className="rounded-sm bg-white/65 p-2.5">
          <p className="text-xs font-black text-[#8a4b05]">왜 지금</p>
          <p className="mt-1 line-clamp-3 text-xs font-bold leading-5 text-[#2b2520] sm:text-sm sm:leading-6">
            {link.whyItMatters}
          </p>
        </div>
        <div className="rounded-sm bg-white/65 p-2.5">
          <p className="text-xs font-black text-[#8a4b05]">오늘 할 일</p>
          <p className="mt-1 line-clamp-3 text-xs font-bold leading-5 text-[#2b2520] sm:text-sm sm:leading-6">
            {todayActionLine ?? primaryAudience?.body ?? link.audienceImpact.homelessBuyer}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#dcc9ae] pt-3 sm:border-t-0 sm:pt-0">
        <div className="flex min-w-0 flex-wrap gap-2 text-xs font-bold text-[#7a7064]">
          <span>{link.sourceName}</span>
          <span>{link.readingMinutes}분</span>
          {link.evidenceCount && link.evidenceCount > 0 ? (
            <span>공식 근거 {link.evidenceCount}개</span>
          ) : null}
          {link.isSample ? (
            <span
              aria-label="샘플 데이터"
              title="샘플 데이터"
              className="hidden min-[390px]:inline"
            >
              샘플
            </span>
          ) : null}
        </div>
        <Link
          href={`/links/${link.id}`}
          className="inline-flex h-8 shrink-0 items-center rounded-md bg-[#14110f] px-3 text-xs font-black text-white hover:bg-[#342b23] sm:h-10 sm:px-4 sm:text-sm"
        >
          3분 브리프
        </Link>
      </div>
    </section>
  );
}
