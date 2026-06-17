import type { Metadata } from "next";
import Link from "next/link";
import { CommunityPostForm } from "@/components/community-post-form";
import { SiteHeader } from "@/components/site-header";
import { getCommunityPosts } from "@/lib/community";
import { communityPostTypeLabels } from "@/lib/community-shared";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "질문, 지역 소식, 내 상황 상담을 나누는 집집 커뮤니티",
  alternates: {
    canonical: "/community",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}

export default async function CommunityPage() {
  const auth = await getCurrentUser();
  const { posts, mode } = await getCommunityPosts(20);
  const canSubmit = Boolean(auth.user);
  const typeCounts = posts.reduce<Record<string, number>>((acc, post) => {
    acc[post.postType] = (acc[post.postType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#eef3f4]">
        <section className="border-b border-[#cbd6d8] bg-[#e9f0f2]">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-7 pt-6 sm:px-6 sm:pb-10 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-black text-[#11140f]">커뮤니티</p>
              <h1 className="mt-2 text-[2.15rem] font-extrabold leading-tight text-[#14110f] sm:text-5xl [word-break:keep-all]">
                사람들은 지금 이런 걸 묻고 있어요
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[#4f5a5d]">
                집집 커뮤니티는 잡담판이 아니라 부동산 판단에 필요한 질문,
                지역 관찰, 뉴스 제보를 모으는 곳입니다. 처음에는 확인된 글만
                공개합니다.
              </p>
            </div>

            <div className="grid content-end gap-2 rounded-md border border-[#cbd6d8] bg-white/65 p-4 text-sm font-semibold leading-6 text-[#4f5a5d]">
              <p className="font-black text-[#14110f]">초기 운영 원칙</p>
              <p>질문은 환영, 매수·매도 선동은 제외</p>
              <p>지역 소식은 출처와 맥락을 함께 확인</p>
              <p>첫 버전은 승인 후 공개</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl items-start gap-6 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-8">
          <div className="grid min-w-0 gap-5">
            <div className="grid gap-3 border-y border-[#cbd6d8] py-4 sm:grid-cols-4">
              {Object.entries(communityPostTypeLabels).map(([type, label]) => (
                <div key={type} className="grid gap-1">
                  <p className="text-xs font-black uppercase text-[#6a7578]">
                    {label}
                  </p>
                  <p className="text-2xl font-black text-[#11140f]">
                    {typeCounts[type] ?? 0}
                  </p>
                </div>
              ))}
            </div>

            <section className="grid gap-0 rounded-md border border-[#cbd6d8] bg-white/75 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfe8ea] px-4 py-4">
                <div>
                  <p className="text-sm font-black text-[#14110f]">
                    커뮤니티 글
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#667174]">
                    승인된 질문과 지역 소식만 먼저 보여줍니다.
                  </p>
                </div>
                <span className="rounded-full border border-[#11140f]/12 px-3 py-1 text-xs font-black text-[#11140f]">
                  {mode === "supabase" ? "운영 중" : "준비 중"}
                </span>
              </div>

              {posts.length > 0 ? (
                <div className="divide-y divide-[#dfe8ea]">
                  {posts.map((post) => (
                    <article key={post.id} className="grid gap-3 px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-black text-[#667174]">
                        <span className="rounded-full bg-[#d6e85c] px-2.5 py-1 text-[#11140f]">
                          {communityPostTypeLabels[post.postType]}
                        </span>
                        <span>{post.region}</span>
                        {post.category ? <span>{post.category}</span> : null}
                        <span>{formatDate(post.createdAt)}</span>
                        <span>{post.authorLabel}</span>
                      </div>
                      <div className="grid gap-2">
                        <h2 className="text-lg font-black leading-snug text-[#14110f] sm:text-xl [word-break:keep-all]">
                          {post.title}
                        </h2>
                        <p className="line-clamp-3 text-sm font-medium leading-6 text-[#4f5a5d]">
                          {post.body}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-black text-[#667174]">
                        <span>추천 {post.voteCount}</span>
                        <span>댓글 {post.commentCount}</span>
                        {post.sourceUrl ? (
                          <Link
                            href={post.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#11140f] underline decoration-[#d6e85c] decoration-2 underline-offset-4"
                          >
                            참고 링크
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 px-4 py-8 text-sm font-medium leading-6 text-[#596366]">
                  <p className="text-lg font-black text-[#14110f]">
                    아직 공개된 커뮤니티 글이 없습니다
                  </p>
                  <p>
                    첫 글은 바로 공개되지 않고 검토 대기 상태로 저장됩니다.
                    질문, 지역 소식, 내 상황 상담부터 작게 시작합니다.
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="grid content-start gap-5">
            <CommunityPostForm
              canSubmit={canSubmit}
              isConfigured={auth.isConfigured}
            />
            <section className="grid gap-3 rounded-md border border-[#cbd6d8] bg-[#f8fbfb] p-4">
              <p className="text-sm font-black text-[#14110f]">무엇을 올리면 좋나</p>
              <div className="divide-y divide-[#dfe8ea] text-sm font-medium leading-6 text-[#4f5a5d]">
                <p className="py-2">내 상황에 맞는 판단 기준 질문</p>
                <p className="py-2">지역에서 체감한 전세·청약·거래 분위기</p>
                <p className="py-2">같이 봐야 할 기사, 공지, 통계 링크</p>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </>
  );
}
