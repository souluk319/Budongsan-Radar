import Link from "next/link";
import { getAffectedAudienceLabels, getSignalTone } from "@/lib/home-signals";
import type { RadarLink } from "@/lib/radar-data";

type IssueBriefListProps = {
  links: RadarLink[];
};

const labelByTone = {
  strong: "꼭 보기",
  watch: "지켜보기",
  noise: "가볍게 보기",
};

const labelClasses = {
  strong: "bg-[#fff2e4] text-[#9a4f00]",
  watch: "bg-[#eef6ff] text-[#155ca8]",
  noise: "bg-[#f2efe8] text-[#62594d]",
};

const importanceByTone = {
  strong: "중요도 높음",
  watch: "중요도 보통",
  noise: "가볍게 확인",
};

const rowAccentClasses = {
  strong: "border-l-[#d97706]",
  watch: "border-l-[#3b82f6]",
  noise: "border-l-[#c8b9a4]",
};

export function IssueBriefList({ links }: IssueBriefListProps) {
  if (links.length === 0) {
    return (
      <section className="grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#2b2520] pb-3">
          <div>
            <p className="text-sm font-black text-[#14110f]">오늘 볼 이슈</p>
            <h2 className="mt-1 text-2xl font-black leading-tight text-[#14110f]">
              아직 맞는 이슈가 없습니다
            </h2>
          </div>
        </div>

        <div className="rounded-md border border-[#eadfce] bg-white p-5">
          <p className="text-base font-black text-[#14110f]">
            조건을 조금 넓히면 오늘 브리프를 더 볼 수 있어요.
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#51483d]">
            지역이나 카테고리를 하나만 선택하거나, 전체 브리프에서 먼저
            흐름을 잡아보세요.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex h-9 items-center rounded-md bg-[#14110f] px-3.5 text-sm font-black text-white hover:bg-[#342b23]"
          >
            전체 보기
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#2b2520] pb-3">
        <div>
          <p className="text-sm font-black text-[#14110f]">오늘 볼 이슈</p>
          <h2 className="mt-1 text-2xl font-black leading-tight text-[#14110f]">
            꼭 볼 것부터 짧게 정리했어요
          </h2>
        </div>
        <span className="text-sm font-bold text-[#6b6254]">
          {links.length}개
        </span>
      </div>

      <div className="divide-y divide-[#e3d8c8] border-b border-[#2b2520]">
        {links.map((link) => {
          const tone = getSignalTone(link.score);
          const audienceLabels = getAffectedAudienceLabels(link);

          return (
            <article
              key={link.id}
              className={`grid gap-2 border-l-4 py-4 pl-3 transition hover:bg-white/55 sm:grid-cols-[minmax(0,1fr)_8.5rem] sm:gap-4 ${rowAccentClasses[tone]}`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-sm px-2 py-1 text-xs font-black ${labelClasses[tone]}`}
                  >
                    {labelByTone[tone]}
                  </span>
                  <span className="text-xs font-bold text-[#7a7064]">
                    {link.category} · {importanceByTone[tone]}
                  </span>
                </div>
                <Link
                  href={`/links/${link.id}`}
                  className="mt-2 block text-lg font-black leading-snug text-[#14110f] hover:underline"
                >
                  {link.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[#51483d]">
                  {link.impactLine}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {audienceLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-sm bg-white px-2 py-1 text-[0.72rem] font-bold text-[#6b6254]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold text-[#7a7064] sm:grid sm:content-start sm:justify-items-end sm:text-right">
                <span>{link.sourceName}</span>
                <span>{link.readingMinutes}분 읽기</span>
                {link.isSample ? (
                  <span aria-label="샘플 데이터" title="샘플 데이터">
                    샘플
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
