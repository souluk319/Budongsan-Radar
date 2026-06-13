import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-3xl flex-1 content-center gap-4 px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-zinc-500">404</p>
        <h2 className="text-3xl font-bold text-zinc-950">
          이슈를 찾을 수 없습니다
        </h2>
        <p className="text-base leading-7 text-zinc-600">
          샘플 데이터에 없는 링크 ID입니다. 현재 MVP는 seed data에 있는
          이슈만 상세 화면을 제공합니다.
        </p>
        <Link
          href="/"
          className="mt-2 h-10 w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          이슈 보드로 이동
        </Link>
      </main>
    </>
  );
}
