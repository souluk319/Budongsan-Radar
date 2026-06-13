import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButtons } from "@/components/action-buttons";
import { EvidencePanel } from "@/components/evidence-panel";
import { ImpactPanel } from "@/components/impact-panel";
import { LinkCard } from "@/components/link-card";
import { ScoreBadge } from "@/components/score-badge";
import { SiteHeader } from "@/components/site-header";
import { Tag } from "@/components/tag";
import { getRegionProfileByName } from "@/lib/place-data";
import { formatKoreanDate } from "@/lib/radar-data";
import { getRadarLinkDetail, radarLinks } from "@/lib/radar-repository";

type LinkDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return radarLinks.map((link) => ({
    id: link.id,
  }));
}

export async function generateMetadata({
  params,
}: LinkDetailProps): Promise<Metadata> {
  const { id } = await params;
  const detail = await getRadarLinkDetail(id);

  if (!detail) {
    return {
      title: "이슈 없음",
    };
  }

  return {
    title: detail.link.title,
    description: detail.link.impactLine,
  };
}

export default async function LinkDetailPage({ params }: LinkDetailProps) {
  const { id } = await params;
  const detail = await getRadarLinkDetail(id);

  if (!detail) {
    notFound();
  }

  const { link, relatedLinks, mode, evidence } = detail;
  const regionLabel =
    link.regions.filter((region) => region !== "전국").join(", ") || "전국";
  const primaryRegionProfile = link.regions
    .map(getRegionProfileByName)
    .find(Boolean);
  const evidenceCount =
    evidence.length > 0 ? evidence.length : link.evidenceCount ?? 0;
  const evidenceUpdatedAt =
    link.evidenceUpdatedAt ?? evidence[0]?.observedAt ?? null;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#f7f5ef]">
        <article className="mx-auto w-full max-w-3xl px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8">
          <Link
            href="/"
            className="inline-flex text-sm font-black text-[#9a4f00] hover:underline"
          >
            브리프로 돌아가기
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-black">
            <span className="inline-flex h-6 items-center rounded-sm bg-[#14110f] px-2 text-xs font-black text-white">
              집집 해석
            </span>
            <Tag tone="category">{link.category}</Tag>
            <ScoreBadge score={link.score} compact />
          </div>

          <h1 className="mt-4 text-[1.75rem] font-black leading-tight text-[#14110f] min-[390px]:text-[1.9rem] sm:text-4xl [word-break:keep-all]">
            {link.title}
          </h1>
          <p className="mt-3 text-base font-semibold leading-7 text-[#51483d] sm:text-lg">
            {link.impactLine}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-[#7a7064]">
            <span>{link.sourceName}</span>
            <span>{formatKoreanDate(link.submittedAt)}</span>
            <span>{link.readingMinutes}분 읽기</span>
            <span>{regionLabel}</span>
            <span>
              공식 근거 {evidenceCount}
              개
            </span>
            {evidenceUpdatedAt ? (
              <span>
                {formatKoreanDate(evidenceUpdatedAt.slice(0, 10))} 확인
              </span>
            ) : null}
            {link.isSample ? <span>샘플 데이터</span> : null}
          </div>
        </article>

        <section className="mx-auto grid w-full max-w-3xl gap-8 px-4 pb-10 sm:px-6 lg:px-8">
          <p className="border-l-2 border-[#d7a35a] pl-3 text-sm font-semibold leading-6 text-[#6b6254]">
            {link.isSample
              ? "이 페이지는 샘플 데이터입니다. 실제 기사, 투자 조언, 매수/매도 추천이 아닙니다."
              : mode === "supabase"
              ? "이 요약은 참고 정보입니다. 투자 조언, 매수/매도 추천이 아닙니다."
              : "이 페이지는 샘플 데이터입니다. 실제 기사, 투자 조언, 매수/매도 추천이 아닙니다."}
          </p>

          <section className="grid gap-3">
            <h3 className="text-lg font-black text-[#14110f]">먼저 볼 3줄</h3>
            <ol className="divide-y divide-[#e3d8c8] border-y border-[#d8cdbc]">
              {link.summaryBullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="grid gap-2 py-3 text-sm font-semibold leading-6 text-[#2b2520] sm:grid-cols-[2rem_minmax(0,1fr)]"
                >
                  <span className="font-mono text-xs font-black text-[#b46300]">
                    {index + 1}
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-3">
            <h3 className="text-lg font-black text-[#14110f]">왜 중요한가</h3>
            <p className="border-l-2 border-[#d97706] pl-4 text-base font-semibold leading-7 text-[#2b2520]">
              {link.whyItMatters}
            </p>
          </section>

          <EvidencePanel
            evidence={evidence}
            groundingNotes={link.groundingNotes}
            uncertainties={link.uncertainties}
          />

          <section className="grid gap-3">
            <h3 className="text-lg font-black text-[#14110f]">영향 대상</h3>
            <ImpactPanel impact={link.audienceImpact} />
          </section>

          <section className="grid gap-3">
            <h3 className="text-lg font-black text-[#14110f]">체크포인트</h3>
            <ul className="divide-y divide-[#e3d8c8] border-y border-[#d8cdbc]">
              {link.checkpoints.map((checkpoint, index) => (
                <li
                  key={checkpoint}
                  className="grid gap-2 py-3 text-sm font-semibold leading-6 text-[#2b2520] sm:grid-cols-[2rem_minmax(0,1fr)]"
                >
                  <span className="font-mono text-xs font-black text-[#9a4f00]">
                    {index + 1}
                  </span>
                  <span>{checkpoint}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4 border-t border-[#e3d8c8] pt-7">
            <div>
              <h3 className="text-lg font-black text-[#14110f]">다음에 볼 것</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#6b6254]">
                원문을 확인하거나, 나중에 다시 볼 이슈로 저장하세요.
              </p>
            </div>

            <div className="grid gap-3 rounded-md border border-[#eadfce] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[#14110f]">원문</p>
                  <p className="mt-1 text-xs font-semibold text-[#7a7064]">
                    {link.isSample ? "샘플 URL입니다" : link.sourceName}
                  </p>
                </div>
                <a
                  href={link.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center rounded-md border border-[#e5dac8] bg-white px-3 text-sm font-bold text-[#5e554b] hover:border-[#14110f]"
                >
                  원문 열기
                </a>
              </div>
              <div className="border-t border-[#eee4d5] pt-3">
                <ActionButtons linkId={link.id} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <h3 className="text-lg font-black text-[#14110f]">관련 이슈</h3>
              <div className="flex flex-wrap gap-2">
                {primaryRegionProfile ? (
                  <Link
                    href={`/regions/${primaryRegionProfile.id}`}
                    className="h-9 rounded-md border border-[#e5dac8] bg-white px-3 py-2 text-sm font-bold text-[#5e554b] hover:border-[#14110f]"
                  >
                    지역 브리프
                  </Link>
                ) : null}
                <Link
                  href="/briefing"
                  className="h-9 rounded-md border border-[#e5dac8] bg-white px-3 py-2 text-sm font-bold text-[#5e554b] hover:border-[#14110f]"
                >
                  브리프 보기
                </Link>
              </div>
            </div>
            <div className="grid">
              {relatedLinks.map((relatedLink) => (
                <LinkCard key={relatedLink.id} link={relatedLink} />
              ))}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
