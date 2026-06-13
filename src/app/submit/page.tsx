import { SiteHeader } from "@/components/site-header";
import { SubmitLinkForm } from "@/components/submit-link-form";

export default function SubmitPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-zinc-500">Submit Link</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-950">
              부동산 이슈 링크 제출
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
              MVP에서는 입력 폼과 제출 상태만 검증합니다. 실제 저장, 관리자
              승인, AI 요약 생성은 다음 루프에서 붙입니다.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <SubmitLinkForm />
          </div>
        </section>
      </main>
    </>
  );
}
