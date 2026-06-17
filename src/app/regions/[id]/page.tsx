import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkCard } from "@/components/link-card";
import { SiteHeader } from "@/components/site-header";
import {
  getComplexesForRegion,
  getRegionProfile,
  regionProfiles,
} from "@/lib/place-data";
import { getPublishedLinks } from "@/lib/radar-repository";

type RegionPageProps = {
  params: Promise<{ id: string }>;
};

const metricToneClass = {
  good: "border-[#abefc6] bg-[#ecfdf3] text-[#027a48]",
  watch: "border-[#b2ddff] bg-[#eff8ff] text-[#175cd3]",
  risk: "border-[#fedf89] bg-[#fffaeb] text-[#b54708]",
  neutral: "border-[#cbd6d8] bg-white text-[#4f5a5d]",
};

export function generateStaticParams() {
  return regionProfiles.map((profile) => ({ id: profile.id }));
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getRegionProfile(id);

  if (!profile) {
    return { title: "지역 브리프 없음" };
  }

  return {
    title: `${profile.name} 집값 뉴스 브리프`,
    description: profile.summary,
    alternates: {
      canonical: `/regions/${profile.id}`,
    },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { id } = await params;
  const profile = getRegionProfile(id);

  if (!profile) {
    notFound();
  }

  const linksResult = await getPublishedLinks();
  const regionLinks = linksResult.links
    .filter((link) => link.regions.includes(profile.name))
    .slice(0, 5);
  const relatedComplexes = getComplexesForRegion(profile.id);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#eef3f4]">
        <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-7 pt-5 sm:px-6 sm:pb-9 sm:pt-8 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="text-sm font-black text-[#11140f] hover:underline"
            >
              브리프로 돌아가기
            </Link>
            <p className="mt-5 text-sm font-black text-[#11140f]">
              지역 브리프
            </p>
            <h1 className="mt-2 text-[1.85rem] font-black leading-tight text-[#14110f] sm:text-4xl [word-break:keep-all]">
              {profile.name} 집값 뉴스 브리프
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#4f5a5d]">
              {profile.headline}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-[#667174]">
              <span>{profile.heatLabel}</span>
              <span>{profile.evidenceLine}</span>
              {profile.isSample ? <span>샘플 지역 브리프</span> : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {profile.metrics.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-md border p-4 ${metricToneClass[metric.tone]}`}
              >
                <p className="text-xs font-black">{metric.label}</p>
                <p className="mt-2 text-xl font-black text-[#14110f]">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#4f5a5d]">
                  {metric.caption}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-7 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
          <div className="grid min-w-0 gap-7">
            <section className="grid gap-3">
              <h2 className="text-lg font-black text-[#14110f]">
                오늘 이 지역을 이렇게 봅니다
              </h2>
              <p className="border-l-2 border-[#11140f] pl-4 text-base font-semibold leading-7 text-[#11140f]">
                {profile.summary}
              </p>
            </section>

            <section className="grid gap-3">
              <h2 className="text-lg font-black text-[#14110f]">
                내 상황별 영향
              </h2>
              <div className="divide-y divide-[#cbd6d8] border-y border-[#cbd6d8]">
                {profile.situations.map((situation) => (
                  <article
                    key={situation.label}
                    className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]"
                  >
                    <div>
                      <p className="text-sm font-black text-[#14110f]">
                        {situation.label}
                      </p>
                      <p className="mt-0.5 text-xs font-black text-[#11140f]">
                        {situation.status}
                      </p>
                    </div>
                    <p className="text-sm font-semibold leading-6 text-[#11140f]">
                      {situation.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-3">
              <h2 className="text-lg font-black text-[#14110f]">
                이 지역 이슈
              </h2>
              {regionLinks.length > 0 ? (
                <div className="grid">
                  {regionLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              ) : (
                <p className="border-y border-[#cbd6d8] py-3 text-sm font-semibold text-[#667174]">
                  아직 연결된 이슈가 없습니다. 전체 브리프에서 먼저 확인하세요.
                </p>
              )}
            </section>
          </div>

          <aside className="grid content-start gap-5">
            <section className="grid gap-3 rounded-md border border-[#cbd6d8] bg-white p-4">
              <h2 className="text-base font-black text-[#14110f]">
                오늘 볼 체크포인트
              </h2>
              <ul className="grid gap-2 text-sm font-semibold leading-6 text-[#4f5a5d]">
                {profile.watchItems.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </section>

            <section className="grid gap-3 rounded-md border border-[#cbd6d8] bg-white p-4">
              <h2 className="text-base font-black text-[#14110f]">단지 맥락</h2>
              {relatedComplexes.length > 0 ? (
                <div className="divide-y divide-[#dfe8ea]">
                  {relatedComplexes.map((complex) => (
                    <Link
                      key={complex.id}
                      href={`/complexes/${complex.id}`}
                      className="block py-3 hover:bg-[#f8fbfb]"
                    >
                      <p className="text-sm font-black leading-6 text-[#14110f]">
                        {complex.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-[#667174]">
                        {complex.headline}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-semibold leading-6 text-[#667174]">
                  단지 맥락은 다음 업데이트에서 붙입니다.
                </p>
              )}
            </section>

            <Link
              href="/tools/jeonse-check"
              className="rounded-md bg-[#14110f] px-4 py-3 text-sm font-black text-white hover:bg-[#2a2d2f]"
            >
              전세 안전 체크 보기
            </Link>
          </aside>
        </section>
      </main>
    </>
  );
}
