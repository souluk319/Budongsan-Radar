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
  strong: "text-[#11140f]",
  watch: "text-[#155ca8]",
  noise: "text-[#667174]",
};

const importanceByTone = {
  strong: "중요도 높음",
  watch: "중요도 보통",
  noise: "가볍게 확인",
};

const toneDotClasses = {
  strong: "bg-[#d6e85c]",
  watch: "bg-[#8bb9ee]",
  noise: "bg-[#aab5b9]",
};

export function IssueBriefList({ links }: IssueBriefListProps) {
  if (links.length === 0) {
    return (
      <section className="grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#11140f] pb-3">
          <div>
            <p className="text-sm font-semibold text-[#14110f]">오늘 볼 이슈</p>
            <h2 className="mt-1 text-2xl font-extrabold leading-tight text-[#14110f]">
              아직 맞는 이슈가 없습니다
            </h2>
          </div>
        </div>

        <div className="rounded-xl border border-[#cbd3d5] bg-white/70 p-5 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur">
          <p className="text-base font-semibold text-[#14110f]">
            조건을 조금 넓히면 오늘 브리프를 더 볼 수 있어요.
          </p>
          <p className="mt-2 text-sm font-normal leading-6 text-[#4d575a]">
            지역이나 카테고리를 하나만 선택하거나, 전체 브리프에서 먼저
            흐름을 잡아보세요.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex h-9 items-center rounded-full bg-[#11140f] px-4 text-sm font-semibold text-white hover:bg-[#2a2d2f]"
          >
            전체 보기
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#11140f] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667174]">
            Signal tape
          </p>
          <h2 className="mt-1 text-[1.7rem] font-semibold leading-tight text-[#14110f] sm:text-3xl">
            오늘 볼 이슈
          </h2>
          <p className="mt-1 text-sm font-normal text-[#667174]">
            꼭 볼 것부터 짧게 정리했어요
          </p>
        </div>
        <span className="rounded-full border border-[#11140f]/12 px-3 py-1 text-sm font-medium text-[#11140f]">
          {links.length}개
        </span>
      </div>

      <div className="divide-y divide-[#dce5e7] border-b border-[#11140f]/18">
        {links.map((link) => {
          const tone = getSignalTone(link.score);
          const audienceLabels = getAffectedAudienceLabels(link);

          return (
            <article
              key={link.id}
              className="grid gap-2 py-4 transition hover:bg-[#f8fbfb] sm:grid-cols-[minmax(0,1fr)_8.5rem] sm:gap-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${toneDotClasses[tone]}`}
                    aria-hidden
                  />
                  <span
                    className={`text-xs font-semibold ${labelClasses[tone]}`}
                  >
                    {labelByTone[tone]}
                  </span>
                  <span className="text-xs font-normal text-[#667174]">
                    {link.category} · {importanceByTone[tone]}
                  </span>
                </div>
                <Link
                  href={`/links/${link.id}`}
                  className="mt-2 block text-lg font-semibold leading-snug text-[#14110f] hover:text-[#3b4447]"
                >
                  {link.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm font-normal leading-6 text-[#667174]">
                  {link.impactLine}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {audienceLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-[#11140f]/8 px-2 py-1 text-[0.72rem] font-medium text-[#667174]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium text-[#667174] sm:grid sm:content-start sm:justify-items-end sm:text-right">
                <span className="rounded-full bg-[#f8fbfb] px-2.5 py-1 font-semibold text-[#11140f]">
                  신호 {link.score}
                </span>
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
