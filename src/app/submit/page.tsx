import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SubmitLinkForm } from "@/components/submit-link-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "이슈 제보",
  description: "집집이 같이 볼 부동산 기사, 공지, 리포트 링크를 받습니다",
  alternates: {
    canonical: "/submit",
  },
};

export default async function SubmitPage() {
  const auth = await getCurrentUser();
  const canSubmit = Boolean(auth.user);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#eef3f4]">
        <section className="border-b border-[#cbd6d8] bg-[#e9f0f2]">
          <div className="mx-auto w-full max-w-5xl px-4 pb-7 pt-6 sm:px-6 sm:pb-9 sm:pt-10 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#11140f]">이슈 제보</p>
            <h1 className="mt-2 text-[1.85rem] font-extrabold leading-tight text-[#14110f] sm:text-4xl [word-break:keep-all]">
              같이 볼 부동산 링크를 보내주세요
            </h1>
            <p className="mt-3 max-w-2xl text-base font-normal leading-7 text-[#4f5a5d]">
              정책, 전세, 청약, 지역 이슈처럼 누군가의 결정에 닿는 링크를
              받습니다. 집집이 확인하고 짧은 브리프로 정리합니다.
            </p>
          </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-5xl items-start gap-5 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
          <div className="rounded-xl border border-[#cbd6d8] bg-white/75 p-4 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur sm:p-5">
            <SubmitLinkForm
              canSubmit={canSubmit}
              isConfigured={auth.isConfigured}
            />
          </div>

          <aside className="self-start rounded-xl border border-[#cbd6d8] bg-white/70 p-4 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold text-[#14110f]">제보 기준</p>
            <div className="mt-3 divide-y divide-[#dfe8ea] text-sm font-normal leading-6 text-[#4f5a5d]">
              <p className="py-2">내 집 마련, 전세, 갈아타기 판단에 닿는 이슈</p>
              <p className="py-2">출처가 확인되는 기사, 공지, 리포트, 데이터</p>
              <p className="py-2">홍보성 매물, 단순 광고, 출처 불명 글은 제외</p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
