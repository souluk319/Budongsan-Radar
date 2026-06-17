import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#eef3f4]">
        <section className="mx-auto grid w-full max-w-3xl content-center gap-4 px-4 py-16 sm:min-h-[26rem] sm:px-6 lg:px-8">
          <p className="text-sm font-black text-[#11140f]">404</p>
          <h1 className="text-[2rem] font-black leading-tight text-[#14110f] sm:text-5xl">
            이슈를 찾을 수 없습니다
          </h1>
          <p className="max-w-2xl text-base font-semibold leading-7 text-[#4f5a5d]">
            아직 집집에 등록되지 않은 이슈입니다. 오늘 볼 만한 다른 이슈를
            먼저 확인해보세요.
          </p>
          <Link
            href="/"
            className="mt-2 h-10 w-fit rounded-md bg-[#14110f] px-4 py-2 text-sm font-black text-white hover:bg-[#2a2d2f]"
          >
            집집 브리프로 이동
          </Link>
        </section>
      </main>
    </>
  );
}
