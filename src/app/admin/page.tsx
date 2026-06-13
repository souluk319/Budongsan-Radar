import Link from "next/link";
import { AdminLinkActions } from "@/components/admin-link-actions";
import { RssIngestButton } from "@/components/rss-ingest-button";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { getSetupStatus } from "@/lib/env";
import { getAdminLinks, getRssSources } from "@/lib/radar-repository";

export default async function AdminPage() {
  const setup = getSetupStatus();
  const auth = await getCurrentUser();
  const pending = auth.user?.isAdmin
    ? await getAdminLinks("pending")
    : { ok: false as const, links: [], message: "" };
  const rssSources = auth.user?.isAdmin ? await getRssSources() : [];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-zinc-500">Admin</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-950">
              링크 승인 큐
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
              RSS/사용자 제출 링크를 pending으로 모으고, 요약 생성 후 published
              상태로 승인하는 운영 화면입니다.
            </p>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
          {!setup.hasSupabaseAdmin ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              관리자 기능에는 Supabase admin key가 필요합니다.
              `SUPABASE_SECRET_KEY` 또는 `SUPABASE_SERVICE_ROLE_KEY`를 설정하세요.
            </div>
          ) : null}

          {!auth.user ? (
            <div className="rounded-md border border-zinc-200 bg-white p-5">
              <h3 className="text-base font-bold text-zinc-950">
                로그인이 필요합니다
              </h3>
              <Link
                href="/login?next=/admin"
                className="mt-3 inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white"
              >
                로그인하러 가기
              </Link>
            </div>
          ) : null}

          {auth.user && !auth.user.isAdmin ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
              현재 계정은 admin이 아닙니다. `.env.local`의 `ADMIN_EMAILS`에 이
              이메일을 넣거나 Supabase `profiles.role`을 admin으로 바꾸세요.
            </div>
          ) : null}

          {auth.user?.isAdmin ? (
            <>
              <section className="grid gap-3 rounded-md border border-zinc-200 bg-white p-5">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">RSS 수집</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    등록된 RSS source {rssSources.length}개를 읽어 중복 URL을
                    제외하고 pending 링크로 저장합니다.
                  </p>
                </div>
                <RssIngestButton />
              </section>

              <section className="grid gap-3">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">
                    Pending 링크
                  </h3>
                  {!pending.ok ? (
                    <p className="mt-1 text-sm font-semibold text-rose-700">
                      {pending.message}
                    </p>
                  ) : null}
                </div>

                {pending.links.length > 0 ? (
                  <div className="grid gap-3">
                    {pending.links.map((link) => (
                      <article
                        key={link.id}
                        className="grid gap-4 rounded-md border border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto]"
                      >
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap gap-2 text-xs font-semibold text-zinc-500">
                            <span>{link.category}</span>
                            <span>{link.regions.join(", ")}</span>
                            <span>{link.source_type}</span>
                          </div>
                          <h4 className="text-base font-bold text-zinc-950">
                            {link.title}
                          </h4>
                          <a
                            href={link.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block break-all text-sm text-zinc-600 underline-offset-4 hover:underline"
                          >
                            {link.source_url}
                          </a>
                        </div>
                        <AdminLinkActions linkId={link.id} />
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
                    pending 링크가 없습니다.
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
