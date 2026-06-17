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
      <main className="flex-1 bg-[#eef3f4]">
        <article className="border-b border-[#cbd6d8] bg-[#e9f0f2]">
          <div className="mx-auto w-full max-w-4xl px-4 pb-8 pt-5 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-[#506064] hover:text-[#11140f]"
            >
              브리프로 돌아가기
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex h-7 items-center rounded-full bg-[#11140f] px-3 text-xs font-semibold text-white">
                집집 해석
              </span>
              <Tag tone="category">{link.category}</Tag>
              <ScoreBadge score={link.score} compact />
            </div>

            <h1 className="mt-4 max-w-3xl text-[1.85rem] font-extrabold leading-tight text-[#14110f] min-[390px]:text-[2.05rem] sm:text-5xl [word-break:keep-all]">
              {link.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base font-normal leading-7 text-[#4f5a5d] sm:text-lg">
              {link.impactLine}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-[#667174]">
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
          </div>
        </article>

        <section className="mx-auto grid w-full max-w-4xl gap-8 px-4 pb-12 pt-7 sm:px-6 sm:pt-9 lg:px-8">
          <p className="rounded-xl border border-[#cbd6d8] bg-white/65 px-4 py-3 text-sm font-normal leading-6 text-[#667174]">
            {link.isSample
              ? "이 페이지는 샘플 데이터입니다. 실제 기사, 투자 조언, 매수/매도 추천이 아닙니다."
              : mode === "supabase"
              ? "이 요약은 참고 정보입니다. 투자 조언, 매수/매도 추천이 아닙니다."
              : "이 페이지는 샘플 데이터입니다. 실제 기사, 투자 조언, 매수/매도 추천이 아닙니다."}
          </p>

          <section className="grid gap-3">
            <h3 className="text-lg font-semibold text-[#14110f]">먼저 볼 3줄</h3>
            <ol className="divide-y divide-[#cbd6d8] border-y border-[#cbd6d8]">
              {link.summaryBullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="grid gap-2 py-3 text-sm font-normal leading-6 text-[#11140f] sm:grid-cols-[2rem_minmax(0,1fr)]"
                >
                  <span className="font-mono text-xs font-semibold text-[#506064]">
                    {index + 1}
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-3">
            <h3 className="text-lg font-semibold text-[#14110f]">왜 중요한가</h3>
            <p className="rounded-xl border border-[#cbd6d8] bg-white/65 px-4 py-4 text-base font-normal leading-7 text-[#11140f]">
              {link.whyItMatters}
            </p>
          </section>

          <EvidencePanel
            evidence={evidence}
            groundingNotes={link.groundingNotes}
            uncertainties={link.uncertainties}
          />

          <section className="grid gap-3">
            <h3 className="text-lg font-semibold text-[#14110f]">영향 대상</h3>
            <ImpactPanel impact={link.audienceImpact} />
          </section>

          <section className="grid gap-3">
            <h3 className="text-lg font-semibold text-[#14110f]">체크포인트</h3>
            <ul className="divide-y divide-[#cbd6d8] border-y border-[#cbd6d8]">
              {link.checkpoints.map((checkpoint, index) => (
                <li
                  key={checkpoint}
                  className="grid gap-2 py-3 text-sm font-normal leading-6 text-[#11140f] sm:grid-cols-[2rem_minmax(0,1fr)]"
                >
                  <span className="font-mono text-xs font-semibold text-[#11140f]">
                    {index + 1}
                  </span>
                  <span>{checkpoint}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4 border-t border-[#cbd6d8] pt-7">
            <div>
              <h3 className="text-lg font-semibold text-[#14110f]">다음에 볼 것</h3>
              <p className="mt-1 text-sm font-normal leading-6 text-[#667174]">
                원문을 확인하거나, 나중에 다시 볼 이슈로 저장하세요.
              </p>
            </div>

            <div className="grid gap-3 rounded-xl border border-[#cbd6d8] bg-white/70 p-4 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#14110f]">원문</p>
                  <p className="mt-1 text-xs font-medium text-[#667174]">
                    {link.isSample ? "샘플 URL입니다" : link.sourceName}
                  </p>
                </div>
                <a
                  href={link.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center rounded-full border border-[#cbd6d8] bg-white px-3 text-sm font-semibold text-[#4f5a5d] hover:border-[#14110f]"
                >
                  원문 열기
                </a>
              </div>
              <div className="border-t border-[#dfe8ea] pt-3">
                <ActionButtons linkId={link.id} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <h3 className="text-lg font-semibold text-[#14110f]">관련 이슈</h3>
              <div className="flex flex-wrap gap-2">
                {primaryRegionProfile ? (
                  <Link
                    href={`/regions/${primaryRegionProfile.id}`}
                    className="h-9 rounded-full border border-[#cbd6d8] bg-white px-3 py-2 text-sm font-semibold text-[#4f5a5d] hover:border-[#14110f]"
                  >
                    지역 브리프
                  </Link>
                ) : null}
                <Link
                  href="/briefing"
                  className="h-9 rounded-full border border-[#cbd6d8] bg-white px-3 py-2 text-sm font-semibold text-[#4f5a5d] hover:border-[#14110f]"
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
