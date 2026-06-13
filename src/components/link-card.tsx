import Link from "next/link";
import { formatKoreanDate, type RadarLink } from "@/lib/radar-data";
import { ActionButtons } from "@/components/action-buttons";
import { SampleBadge } from "@/components/sample-badge";
import { ScoreBadge } from "@/components/score-badge";
import { Tag } from "@/components/tag";

type LinkCardProps = {
  link: RadarLink;
  rank?: number;
};

export function LinkCard({ link, rank }: LinkCardProps) {
  return (
    <article className="grid gap-4 rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-400 sm:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {typeof rank === "number" ? (
            <span className="inline-flex h-7 min-w-8 items-center justify-center rounded-md bg-zinc-900 px-2 font-mono text-xs font-semibold text-white">
              #{rank}
            </span>
          ) : null}
          {link.isSample ? <SampleBadge /> : null}
          <Tag tone="category">{link.category}</Tag>
          {link.regions.map((region) => (
            <Tag key={region} tone="region">
              {region}
            </Tag>
          ))}
        </div>

        <Link
          href={`/links/${link.id}`}
          className="group block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        >
          <h2 className="text-lg font-semibold leading-snug text-zinc-950 group-hover:underline">
            {link.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
            {link.impactLine}
          </p>
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500">
          <span>{link.sourceName}</span>
          <span>{formatKoreanDate(link.submittedAt)}</span>
          <span>{link.readingMinutes}분 읽기</span>
        </div>

        <div className="mt-4">
          <ActionButtons linkId={link.id} compact />
        </div>
      </div>

      <div className="flex items-start sm:justify-end">
        <ScoreBadge score={link.score} />
      </div>
    </article>
  );
}
