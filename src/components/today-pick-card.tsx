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
      <section className="rounded-xl border border-[#cbd6d8] bg-white/70 p-4 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur">
        <p className="text-sm font-semibold text-[#11140f]">오늘의 집픽</p>
        <p className="mt-2 text-xl font-semibold leading-tight text-[#14110f]">
          이 조건에 맞는 집픽은 아직 없습니다
        </p>
        <p className="mt-2 text-sm font-normal leading-6 text-[#4f5a5d]">
          조건을 조금 넓히면 오늘 중요한 흐름부터 다시 보여드릴게요.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex h-9 items-center rounded-full bg-[#11140f] px-4 text-sm font-semibold text-white hover:bg-[#2a2d2f]"
        >
          전체 브리프 보기
        </Link>
      </section>
    );
  }

  const regionLabel =
    link.regions.filter((region) => region !== "전국").join(", ") || "전국";

  return (
    <section className="grid h-full content-between gap-3 rounded-xl border border-[#cbd6d8] bg-white/70 p-3.5 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur sm:gap-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="rounded-full bg-[#11140f] px-2.5 py-1 text-xs font-semibold text-white">
          오늘의 집픽
        </p>
        <p className="text-xs font-semibold text-[#506064]">
          중요도 {importanceLabel}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium text-[#667174]">
          {link.category} · {regionLabel}
        </p>
        <Link
          href={`/links/${link.id}`}
          className="text-[1.24rem] font-semibold leading-[1.12] text-[#14110f] hover:text-[#000000] min-[390px]:text-[1.36rem] sm:text-3xl [word-break:keep-all]"
        >
          {displayTitle ?? link.title}
        </Link>
        <p className="line-clamp-2 text-sm font-normal leading-6 text-[#4f5a5d] sm:text-base sm:leading-7">
          {link.impactLine}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-[#cbd6d8] pt-3">
        <div className="rounded-lg bg-[#f8fbfb] p-2.5">
          <p className="text-xs font-semibold text-[#506064]">왜 지금</p>
          <p className="mt-1 line-clamp-3 text-xs font-normal leading-5 text-[#11140f] sm:text-sm sm:leading-6">
            {link.whyItMatters}
          </p>
        </div>
        <div className="rounded-lg bg-[#f8fbfb] p-2.5">
          <p className="text-xs font-semibold text-[#506064]">오늘 할 일</p>
          <p className="mt-1 line-clamp-3 text-xs font-normal leading-5 text-[#11140f] sm:text-sm sm:leading-6">
            {todayActionLine ?? primaryAudience?.body ?? link.audienceImpact.homelessBuyer}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#cbd6d8] pt-3 sm:border-t-0 sm:pt-0">
        <div className="flex min-w-0 flex-wrap gap-2 text-xs font-medium text-[#667174]">
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
          className="inline-flex h-8 shrink-0 items-center rounded-full bg-[#11140f] px-3 text-xs font-semibold text-white hover:bg-[#2a2d2f] sm:h-10 sm:px-4 sm:text-sm"
        >
          3분 브리프
        </Link>
      </div>
    </section>
  );
}
