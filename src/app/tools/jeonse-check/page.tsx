import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { jeonseSafetyChecklist, regionProfiles } from "@/lib/place-data";

export const metadata: Metadata = {
  title: "전세 안전 체크",
  description: "전세 계약 전 확인해야 할 보증, 확정일자, 선순위, 전세가율 체크포인트",
  alternates: {
    canonical: "/tools/jeonse-check",
  },
};

const phaseGroups = [
  {
    title: "계약 전",
    items: ["보증보험 가능성", "선순위 채권", "전세가율"],
  },
  {
    title: "계약일",
    items: ["확정일자와 전입", "보증보험 가능성"],
  },
  {
    title: "만기 전",
    items: ["입주 물량", "선순위 채권"],
  },
];

export default function JeonseCheckPage() {
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
              세입자 브리프
            </p>
            <h1 className="mt-2 text-[1.85rem] font-black leading-tight text-[#14110f] sm:text-4xl [word-break:keep-all]">
              전세 안전 체크
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#4f5a5d]">
              오늘 전세 이슈를 볼 때 같이 확인해야 할 보증, 확정일자,
              선순위, 전세가율 기준입니다.
            </p>
            <p className="mt-4 border-l-2 border-[#11140f] pl-3 text-sm font-semibold leading-6 text-[#667174]">
              법률 자문이나 보증을 대신하지 않습니다. 실제 계약 전에는 등기부,
              보증기관 조건, 공인중개사 설명을 별도로 확인하세요.
            </p>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-7 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
          <div className="grid min-w-0 gap-7">
            <section className="grid gap-3">
              <h2 className="text-lg font-black text-[#14110f]">
                먼저 볼 5가지
              </h2>
              <div className="divide-y divide-[#cbd6d8] border-y border-[#cbd6d8]">
                {jeonseSafetyChecklist.map((item) => (
                  <article
                    key={item.label}
                    className="grid gap-2 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]"
                  >
                    <p className="text-sm font-black text-[#14110f]">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold leading-6 text-[#11140f]">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-3">
              <h2 className="text-lg font-black text-[#14110f]">
                계약 흐름별로 보기
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {phaseGroups.map((group) => (
                  <article
                    key={group.title}
                    className="rounded-md border border-[#cbd6d8] bg-white p-4"
                  >
                    <p className="text-sm font-black text-[#14110f]">
                      {group.title}
                    </p>
                    <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-[#4f5a5d]">
                      {group.items.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-5">
            <section className="grid gap-3 rounded-md border border-[#cbd6d8] bg-white p-4">
              <h2 className="text-base font-black text-[#14110f]">
                지역별 전세 관점
              </h2>
              <div className="divide-y divide-[#dfe8ea]">
                {regionProfiles.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/regions/${profile.id}`}
                    className="block py-3 hover:bg-[#f8fbfb]"
                  >
                    <p className="text-sm font-black text-[#14110f]">
                      {profile.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#667174]">
                      {
                        profile.situations.find(
                          (situation) => situation.label === "전세 세입자",
                        )?.body
                      }
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <Link
              href="/?category=%EC%A0%84%EC%84%B8%2F%EC%9B%94%EC%84%B8"
              className="rounded-md bg-[#14110f] px-4 py-3 text-sm font-black text-white hover:bg-[#2a2d2f]"
            >
              전세·월세 이슈 보기
            </Link>
          </aside>
        </section>
      </main>
    </>
  );
}
