import type { Metadata } from "next";
import Link from "next/link";
import { AdminLinkActions } from "@/components/admin-link-actions";
import { DataSourceHealthPanel } from "@/components/data-source-health-panel";
import { NaverNewsIngestButton } from "@/components/naver-news-ingest-button";
import { RssIngestButton } from "@/components/rss-ingest-button";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { getSetupStatus } from "@/lib/env";
import { getAdminLinks, getRssSources } from "@/lib/radar-repository";

export const metadata: Metadata = {
  title: "운영 큐",
  description: "집집 운영자가 제보와 수집 링크를 검토하는 큐",
  alternates: {
    canonical: "/admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const setup = getSetupStatus();
  const auth = await getCurrentUser();
  const pending = auth.user?.isAdmin
    ? await getAdminLinks("pending")
    : {
        ok: false as const,
        links: [],
        message: "",
        evidenceCounts: {} as Record<string, number>,
      };
  const rssSources = auth.user?.isAdmin ? await getRssSources() : [];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#f7f5ef]">
        <section className="mx-auto w-full max-w-6xl px-4 pb-5 pt-5 sm:px-6 sm:pb-7 sm:pt-8 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black text-[#d97706]">운영자</p>
            <h1 className="mt-2 text-[1.85rem] font-black leading-tight text-[#14110f] sm:text-4xl [word-break:keep-all]">
              집집 운영 큐
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#51483d]">
              제보와 수집 후보에 공식 근거를 붙이고, 근거 기반 요약까지 확인한
              뒤 브리프에 올립니다.
            </p>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
          {!setup.hasSupabaseAdmin ? (
            <div className="max-w-xl rounded-md border border-[#f1d09a] bg-[#fff8ec] p-4 text-sm font-semibold leading-6 text-[#7a4a0f]">
              운영 큐 연결을 준비 중입니다. 권한이 있는 계정으로 로그인하면
              제보와 수집 링크를 확인할 수 있습니다.
            </div>
          ) : null}

          {!auth.user ? (
            <div className="max-w-xl rounded-md border border-[#eadfce] bg-white p-5">
              <h3 className="text-base font-black text-[#14110f]">
                운영자 로그인이 필요합니다
              </h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#6b6254]">
                운영 큐는 권한이 있는 계정으로만 볼 수 있습니다.
              </p>
              <Link
                href="/login?next=/admin"
                className="mt-3 inline-flex h-10 items-center rounded-md bg-[#14110f] px-4 text-sm font-black text-white hover:bg-[#342b23]"
              >
                로그인하러 가기
              </Link>
            </div>
          ) : null}

          {auth.user && !auth.user.isAdmin ? (
            <div className="max-w-xl rounded-md border border-[#f0c8c4] bg-[#fff4f2] p-4 text-sm font-semibold leading-6 text-[#9f2f25]">
              현재 계정은 운영 큐를 볼 수 없습니다. 권한이 필요하면 운영자에게
              요청해주세요.
            </div>
          ) : null}

          {auth.user?.isAdmin ? (
            <>
              <DataSourceHealthPanel />

              <section className="grid gap-3 rounded-md border border-[#eadfce] bg-white p-5">
                <div>
                  <h3 className="text-lg font-black text-[#14110f]">RSS 수집</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#6b6254]">
                    등록된 RSS {rssSources.length}개를 읽어 중복 URL을 제외하고
                    검토 대기 링크로 저장합니다.
                  </p>
                </div>
                <RssIngestButton />
              </section>

              <section className="grid gap-3 rounded-md border border-[#eadfce] bg-white p-5">
                <div>
                  <h3 className="text-lg font-black text-[#14110f]">
                    네이버 뉴스 후보
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#6b6254]">
                    뉴스 검색 API로 후보 링크만 가져와 검토 대기에 저장합니다.
                    기사 전문은 저장하지 않고, 발행 전 공식 근거를 따로
                    연결합니다.
                  </p>
                </div>
                <NaverNewsIngestButton />
              </section>

              <section className="grid gap-3">
                <div>
                  <h3 className="text-lg font-black text-[#14110f]">
                    검토 대기
                  </h3>
                  {!pending.ok ? (
                    <p className="mt-1 text-sm font-semibold text-[#9f2f25]">
                      {pending.message}
                    </p>
                  ) : null}
                </div>

                {pending.links.length > 0 ? (
                  <div className="divide-y divide-[#e3d8c8] border-y border-[#e3d8c8]">
                    {pending.links.map((link) => (
                      <article
                        key={link.id}
                        className="grid gap-4 py-4 lg:grid-cols-[1fr_auto] lg:px-2"
                      >
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            <span className="inline-flex h-6 items-center rounded-sm border border-[#eadfce] bg-[#fff8ec] px-2 text-xs font-bold text-[#9a4f00]">
                              {link.category}
                            </span>
                            <span className="inline-flex h-6 items-center rounded-sm border border-[#e5dac8] bg-white px-2 text-xs font-bold text-[#5e554b]">
                              {link.regions.join(", ")}
                            </span>
                            <span className="inline-flex h-6 items-center rounded-sm border border-[#eadfce] bg-[#fffaf2] px-2 text-xs font-bold text-[#7a7064]">
                              {link.source_type}
                            </span>
                          </div>
                          <h4 className="text-base font-black leading-snug text-[#14110f] [word-break:keep-all]">
                            {link.title}
                          </h4>
                          <a
                            href={link.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block break-all text-sm font-semibold leading-6 text-[#6b6254] underline-offset-4 hover:underline"
                          >
                            {link.source_url}
                          </a>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-[#7a7064]">
                            <span>
                              근거{" "}
                              {pending.evidenceCounts[link.id] ?? 0}
                              개
                            </span>
                            <span>
                              요약{" "}
                              {link.summary_bullets.length > 0
                                ? "준비됨"
                                : "대기"}
                            </span>
                            <span>발행 전 원문 확인 필요</span>
                          </div>
                        </div>
                        <AdminLinkActions
                          linkId={link.id}
                          evidenceCount={pending.evidenceCounts[link.id] ?? 0}
                        />
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-[#eadfce] bg-white p-5 text-sm font-semibold text-[#6b6254]">
                    지금은 검토 대기 링크가 없습니다.
                  </div>
                )}
              </section>
            </>
          ) : null}
        </section>
      </main>
    </>
  );
}
