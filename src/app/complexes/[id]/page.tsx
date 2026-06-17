import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkCard } from "@/components/link-card";
import { SiteHeader } from "@/components/site-header";
import {
  complexProfiles,
  getComplexProfile,
  getRegionProfile,
} from "@/lib/place-data";
import { getPublishedLinks } from "@/lib/radar-repository";

type ComplexPageProps = {
  params: Promise<{ id: string }>;
};

const metricToneClass = {
  good: "border-[#abefc6] bg-[#ecfdf3] text-[#027a48]",
  watch: "border-[#b2ddff] bg-[#eff8ff] text-[#175cd3]",
  risk: "border-[#fedf89] bg-[#fffaeb] text-[#b54708]",
  neutral: "border-[#cbd6d8] bg-white text-[#4f5a5d]",
};

const checklistClass = {
  양호: "text-[#027a48]",
  "확인 필요": "text-[#11140f]",
  주의: "text-[#b42318]",
};

export function generateStaticParams() {
  return complexProfiles.map((profile) => ({ id: profile.id }));
}

export async function generateMetadata({
  params,
}: ComplexPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getComplexProfile(id);

  if (!profile) {
    return { title: "단지 브리프 없음" };
  }

  return {
    title: `${profile.name} 단지 브리프`,
    description: profile.summary,
    alternates: {
      canonical: `/complexes/${profile.id}`,
    },
  };
}

export default async function ComplexPage({ params }: ComplexPageProps) {
  const { id } = await params;
  const profile = getComplexProfile(id);

  if (!profile) {
    notFound();
  }

  const region = getRegionProfile(profile.regionId);
  const linksResult = await getPublishedLinks();
  const linkedIssues = linksResult.links.filter((link) =>
    profile.linkedIssueIds.includes(link.id),
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#eef3f4]">
        <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-7 pt-5 sm:px-6 sm:pb-9 sm:pt-8 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href={region ? `/regions/${region.id}` : "/"}
              className="text-sm font-black text-[#11140f] hover:underline"
            >
              {region ? `${region.name} 브리프로 돌아가기` : "브리프로 돌아가기"}
            </Link>
            <p className="mt-5 text-sm font-black text-[#11140f]">
              단지 브리프
            </p>
            <h1 className="mt-2 text-[1.85rem] font-black leading-tight text-[#14110f] sm:text-4xl [word-break:keep-all]">
              {profile.name} 단지 브리프
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#4f5a5d]">
              {profile.headline}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-[#667174]">
              <span>{profile.regionName}</span>
              <span>{profile.address}</span>
              <span>전세 안전 {profile.safetyLabel}</span>
              {profile.isSample ? <span>샘플 단지 브리프</span> : null}
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
                단지를 이렇게 봅니다
              </h2>
              <p className="border-l-2 border-[#11140f] pl-4 text-base font-semibold leading-7 text-[#11140f]">
                {profile.summary}
              </p>
            </section>

            <section className="grid gap-3">
              <h2 className="text-lg font-black text-[#14110f]">
                전세 안전 체크
              </h2>
              <div className="divide-y divide-[#cbd6d8] border-y border-[#cbd6d8]">
                {profile.jeonseChecklist.map((item) => (
                  <article
                    key={item.label}
                    className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]"
                  >
                    <div>
                      <p className="text-sm font-black text-[#14110f]">
                        {item.label}
                      </p>
                      <p
                        className={`mt-0.5 text-xs font-black ${
                          checklistClass[item.status]
                        }`}
                      >
                        {item.status}
                      </p>
                    </div>
                    <p className="text-sm font-semibold leading-6 text-[#11140f]">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-3">
              <h2 className="text-lg font-black text-[#14110f]">
                연결된 이슈
              </h2>
              {linkedIssues.length > 0 ? (
                <div className="grid">
                  {linkedIssues.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              ) : (
                <p className="border-y border-[#cbd6d8] py-3 text-sm font-semibold text-[#667174]">
                  아직 이 단지에 연결된 공개 이슈가 없습니다.
                </p>
              )}
            </section>
          </div>

          <aside className="grid content-start gap-5">
            <section className="grid gap-3 rounded-md border border-[#cbd6d8] bg-white p-4">
              <h2 className="text-base font-black text-[#14110f]">
                집집 단지 모델
              </h2>
              <p className="text-sm font-semibold leading-6 text-[#4f5a5d]">
                매물 대신 지역, 단지, 건물, 호실, 공공데이터 관측값을 연결해
                판단 맥락을 쌓는 구조입니다.
              </p>
              <div className="divide-y divide-[#dfe8ea] text-sm font-semibold text-[#667174]">
                {["지역", "단지", "건물", "호실", "근거 데이터"].map((item) => (
                  <p key={item} className="py-2">
                    {item}
                  </p>
                ))}
              </div>
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
