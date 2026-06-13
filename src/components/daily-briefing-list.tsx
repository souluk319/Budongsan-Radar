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
    <ol className="grid gap-3">
      {links.map((link, index) => (
        <li
          key={link.id}
          className="grid gap-3 rounded-md border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[2rem_1fr_auto]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 font-mono text-xs font-semibold text-white">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <SampleBadge />
              <Tag tone="category">{link.category}</Tag>
              <span className="text-xs text-zinc-500">
                {formatKoreanDate(link.submittedAt)}
              </span>
            </div>
            <Link
              href={`/links/${link.id}`}
              className="text-base font-semibold leading-snug text-zinc-950 hover:underline"
            >
              {link.title}
            </Link>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {link.impactLine}
            </p>
            {showSummary ? (
              <ul className="mt-3 grid gap-1 text-sm leading-6 text-zinc-700">
                {link.summaryBullets.slice(0, 2).map((bullet) => (
                  <li key={bullet}>- {bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="flex items-start sm:justify-end">
            <ScoreBadge score={link.score} />
          </div>
        </li>
      ))}
    </ol>
  );
}
