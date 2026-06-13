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
      <main className="flex-1">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-zinc-500">Auth</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-950">
              로그인
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Supabase Auth 기반 이메일/비밀번호 로그인입니다.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {!setup.hasSupabasePublic ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Supabase public env가 없어 로그인은 아직 동작하지 않습니다.
              `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`과 publishable/anon key를
              넣으면 활성화됩니다.
            </div>
          ) : null}

          <div className="mt-4 rounded-md border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <LoginForm nextPath={nextPath} />
          </div>
        </section>
      </main>
    </>
  );
}
