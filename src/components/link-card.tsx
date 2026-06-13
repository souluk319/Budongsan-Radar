import Link from "next/link";
import { formatKoreanDate, type RadarLink } from "@/lib/radar-data";
import { SampleBadge } from "@/components/sample-badge";
import { ScoreBadge } from "@/components/score-badge";
import { Tag } from "@/components/tag";

type LinkCardProps = {
  link: RadarLink;
  rank?: number;
};

export function LinkCard({ link, rank }: LinkCardProps) {
  return (
    <article className="border-b border-[#e3d8c8] py-4 transition hover:bg-white/55">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {typeof rank === "number" ? (
            <span className="font-mono text-xs font-black text-[#9a4f00]">
              #{rank}
            </span>
          ) : null}
          <Tag tone="category">{link.category}</Tag>
          <ScoreBadge score={link.score} compact />
          {link.regions.map((region) => (
            <Tag key={region} tone="region">
              {region}
            </Tag>
          ))}
          {link.isSample ? <SampleBadge /> : null}
        </div>

        <Link
          href={`/links/${link.id}`}
          className="group block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#14110f]"
        >
          <h2 className="text-base font-black leading-snug text-[#14110f] group-hover:underline sm:text-lg [word-break:keep-all]">
            {link.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[#51483d]">
            {link.impactLine}
          </p>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#7a7064]">
          <span>{link.sourceName}</span>
          <span>{formatKoreanDate(link.submittedAt)}</span>
          <span>{link.readingMinutes}분 읽기</span>
          {link.evidenceCount && link.evidenceCount > 0 ? (
            <span>공식 근거 {link.evidenceCount}개</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
