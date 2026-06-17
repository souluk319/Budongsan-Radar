import Link from "next/link";
import { formatKoreanDate, type RadarLink } from "@/lib/radar-data";
import { SampleBadge } from "@/components/sample-badge";
import { ScoreBadge } from "@/components/score-badge";
import { Tag } from "@/components/tag";

type DailyBriefingListProps = {
  links: RadarLink[];
  showSummary?: boolean;
};

export function DailyBriefingList({
  links,
  showSummary = false,
}: DailyBriefingListProps) {
  return (
    <ol className="divide-y divide-[#cbd6d8] border-y border-[#cbd6d8]">
      {links.map((link, index) => (
        <li
          key={link.id}
          className="grid gap-3 py-4 transition hover:bg-white/50 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-4 sm:px-2"
        >
          <div className="font-mono text-sm font-semibold leading-6 text-[#506064]">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Tag tone="category">{link.category}</Tag>
              <ScoreBadge score={link.score} compact />
              <span className="text-xs font-semibold text-[#667174]">
                {formatKoreanDate(link.submittedAt)}
              </span>
              {link.isSample ? <SampleBadge /> : null}
            </div>
            <Link
              href={`/links/${link.id}`}
              className="block rounded-sm text-lg font-semibold leading-snug text-[#14110f] outline-none hover:text-[#000000] focus-visible:ring-2 focus-visible:ring-[#14110f] [word-break:keep-all]"
            >
              {link.title}
            </Link>
            <p className="mt-1 text-sm font-normal leading-6 text-[#4f5a5d]">
              {link.impactLine}
            </p>
            {showSummary ? (
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-[#667174]">
                {link.summaryBullets.slice(0, 2).map((bullet) => (
                  <li key={bullet}>- {bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
