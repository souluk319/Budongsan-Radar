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
    <ol className="divide-y divide-[#e3d8c8] border-y border-[#e3d8c8]">
      {links.map((link, index) => (
        <li
          key={link.id}
          className="grid gap-3 py-4 transition hover:bg-white/45 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-4 sm:px-2"
        >
          <div className="font-mono text-sm font-black leading-6 text-[#b46300]">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Tag tone="category">{link.category}</Tag>
              <ScoreBadge score={link.score} compact />
              <span className="text-xs font-semibold text-[#7a7064]">
                {formatKoreanDate(link.submittedAt)}
              </span>
              {link.isSample ? <SampleBadge /> : null}
            </div>
            <Link
              href={`/links/${link.id}`}
              className="block rounded-sm text-lg font-black leading-snug text-[#14110f] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#14110f] [word-break:keep-all]"
            >
              {link.title}
            </Link>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#51483d]">
              {link.impactLine}
            </p>
            {showSummary ? (
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-[#6b6254]">
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
