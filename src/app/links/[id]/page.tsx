import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButtons } from "@/components/action-buttons";
import { ImpactPanel } from "@/components/impact-panel";
import { LinkCard } from "@/components/link-card";
import { SampleBadge } from "@/components/sample-badge";
import { ScoreBadge } from "@/components/score-badge";
import { SiteHeader } from "@/components/site-header";
import { Tag } from "@/components/tag";
import {
  formatKoreanDate,
} from "@/lib/radar-data";
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
      title: "이슈 없음 | 부동산 레이더",
    };
  }

  return {
    title: `${detail.link.title} | 부동산 레이더`,
    description: detail.link.impactLine,
  };
}

export default async function LinkDetailPage({ params }: LinkDetailProps) {
  const { id } = await params;
  const detail = await getRadarLinkDetail(id);

  if (!detail) {
    notFound();
  }

  const { link, relatedLinks, mode, reason } = detail;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {link.isSample ? <SampleBadge /> : null}
                <Tag tone="category">{link.category}</Tag>
                {link.regions.map((region) => (
                  <Tag key={region} tone="region">
                    {region}
                  </Tag>
                ))}
              </div>
              <h2 className="text-3xl font-bold leading-tight text-zinc-950">
                {link.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                {link.impactLine}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                <span>{link.sourceName}</span>
                <span>{formatKoreanDate(link.submittedAt)}</span>
                <span>{link.readingMinutes}분 읽기</span>
              </div>
            </div>
            <div className="flex items-start lg:justify-end">
              <ScoreBadge score={link.score} />
            </div>
          </div>
        </article>

        <section className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
            {mode === "supabase"
              ? "이 요약은 참고 정보입니다. 투자 조언, 매수/매도 추천이 아닙니다."
              : `이 페이지는 seed fallback 데이터입니다. ${reason ?? "Supabase 설정 전 샘플입니다."} 실제 기사, 투자 조언, 매수/매도 추천이 아닙니다.`}
          </div>

          <section className="grid gap-3">
            <h3 className="text-xl font-bold text-zinc-950">원문</h3>
            <a
              href={link.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all rounded-md border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-800 underline-offset-4 hover:underline"
            >
              {link.isSample ? "샘플 원문 URL" : "원문 URL"}: {link.sourceUrl}
            </a>
          </section>

          <section className="grid gap-3">
            <h3 className="text-xl font-bold text-zinc-950">3줄 요약</h3>
            <ul className="grid gap-2 text-base leading-7 text-zinc-700">
              {link.summaryBullets.map((bullet) => (
                <li
                  key={bullet}
                  className="rounded-md border border-zinc-200 bg-white p-4"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-3">
            <h3 className="text-xl font-bold text-zinc-950">왜 중요한가</h3>
            <p className="rounded-md border border-zinc-200 bg-white p-4 text-base leading-7 text-zinc-700">
              {link.whyItMatters}
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-xl font-bold text-zinc-950">영향 대상</h3>
            <ImpactPanel impact={link.audienceImpact} />
          </section>

          <section className="grid gap-3">
            <h3 className="text-xl font-bold text-zinc-950">체크포인트</h3>
            <ul className="grid gap-2 text-base leading-7 text-zinc-700">
              {link.checkpoints.map((checkpoint) => (
                <li
                  key={checkpoint}
                  className="rounded-md border border-zinc-200 bg-white p-4"
                >
                  {checkpoint}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-3">
            <h3 className="text-xl font-bold text-zinc-950">추천/저장</h3>
            <div className="rounded-md border border-zinc-200 bg-white p-4">
              <ActionButtons linkId={link.id} />
            </div>
          </section>

          <section className="grid gap-4 border-t border-zinc-200 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-zinc-950">관련 이슈</h3>
              <Link
                href="/"
                className="h-9 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-900"
              >
                보드로 돌아가기
              </Link>
            </div>
            <div className="grid gap-3">
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
