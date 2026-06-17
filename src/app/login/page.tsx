import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";
import { getSetupStatus } from "@/lib/env";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

function safeNextPath(value: string | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const setup = getSetupStatus();
  const params = await searchParams;
  const nextPath = safeNextPath(params?.next);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#eef3f4]">
        <section className="border-b border-[#cbd6d8] bg-[#e9f0f2]">
          <div className="mx-auto w-full max-w-5xl px-4 pb-7 pt-6 sm:px-6 sm:pb-9 sm:pt-10 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#11140f]">계정</p>
            <h1 className="mt-2 text-[1.85rem] font-extrabold leading-tight text-[#14110f] sm:text-4xl [word-break:keep-all]">
              저장한 브리프를 이어서 봅니다
            </h1>
            <p className="mt-3 max-w-2xl text-base font-normal leading-7 text-[#4f5a5d]">
              중요한 이슈를 저장하고, 제보한 링크의 검토 흐름을 이어 봅니다.
            </p>
          </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-5xl items-start gap-5 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
          <div className="grid gap-4">
            {!setup.hasSupabasePublic ? (
              <div className="rounded-xl border border-[#cbd6d8] bg-[#f8fbfb] p-4 text-sm font-normal leading-6 text-[#4f5a5d]">
                계정 기능을 준비 중입니다. 지금은 브리프를 먼저 둘러볼 수
                있습니다.
              </div>
            ) : null}

            <div className="rounded-xl border border-[#cbd6d8] bg-white/75 p-4 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur sm:p-5">
              <LoginForm nextPath={nextPath} />
            </div>
          </div>

          <aside className="self-start rounded-xl border border-[#cbd6d8] bg-white/70 p-4 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold text-[#14110f]">로그인하면</p>
            <div className="mt-3 divide-y divide-[#dfe8ea] text-sm font-normal leading-6 text-[#4f5a5d]">
              <p className="py-2">중요한 이슈를 저장해 다시 볼 수 있습니다.</p>
              <p className="py-2">제보한 링크의 검토 흐름을 이어갈 수 있습니다.</p>
              <p className="py-2">내 관심 이슈를 놓치지 않고 이어서 봅니다.</p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
