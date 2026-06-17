import Link from "next/link";
import Image from "next/image";
import type { HomeSignalModel } from "@/lib/home-signals";

type HomeSignalBoardProps = {
  model: HomeSignalModel;
  liveLinkCount: number;
};

function NightCityVisual() {
  return (
    <div
      aria-label="도시 야경과 아파트 스카이라인"
      className="relative mx-auto h-[23rem] w-full max-w-[35rem] overflow-hidden sm:h-[35rem] lg:h-[44rem] lg:max-w-none"
    >
      <div className="absolute inset-x-[8%] bottom-4 h-24 rounded-[50%] bg-[#081315]/20 blur-2xl" />
      <Image
        src="/hero-night-city.svg"
        alt="아파트가 있는 도시 야경"
        fill
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 42rem, 50vw"
        className="object-contain object-bottom drop-shadow-[0_34px_70px_rgba(8,19,21,0.22)]"
      />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#eef3f4] via-[#eef3f4]/84 to-transparent" />
    </div>
  );
}

export function HomeSignalBoard({
  model,
  liveLinkCount,
}: HomeSignalBoardProps) {
  const pick = model.strongestLink;
  const pickHref = pick ? `/links/${pick.id}` : "/briefing";
  const sourceCountLabel =
    liveLinkCount > 0 ? `실제 수집 ${liveLinkCount}건` : "실제 수집 준비 중";
  const evidenceCount = pick?.evidenceCount ?? 0;
  const evidenceLabel = evidenceCount > 0 ? `근거 ${evidenceCount}개` : "근거 확인 중";

  return (
    <section className="overflow-hidden border-b border-[#11140f]/10 bg-[#e9f0f2] bg-[linear-gradient(180deg,#e8eff1_0%,#eef3f4_100%)]">
      <div className="mx-auto grid w-full max-w-7xl gap-7 px-4 py-9 sm:gap-8 sm:px-6 sm:py-16 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-16">
        <div className="grid min-w-0 gap-5 sm:gap-7">
          <p className="text-sm font-medium text-[#11140f] sm:text-base">
            집집 부동산 브리프
          </p>

          <div className="grid gap-5">
            <h1 className="max-w-[39rem] text-[3.05rem] font-extrabold leading-[0.98] text-[#11140f] min-[390px]:text-[3.28rem] sm:text-[5rem] sm:leading-[0.96] lg:text-[5.55rem] [word-break:keep-all]">
              집값을
              <br />
              먼저 읽다.
            </h1>
            <p className="hidden max-w-xl text-base font-normal leading-7 text-[#11140f] sm:block sm:text-[1.42rem] sm:leading-9 [word-break:keep-all]">
              흩어진 뉴스와 시장 데이터를 모아 오늘의 부동산 신호를 한눈에 보여줍니다.
            </p>
          </div>

          <p className="max-w-xl text-base font-normal leading-7 text-[#11140f] sm:hidden [word-break:keep-all]">
            흩어진 뉴스와 시장 데이터를 모아 오늘의 부동산 신호를 한눈에 보여줍니다.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href={pickHref}
              className="inline-flex h-11 items-center rounded-full bg-[#11140f] px-7 text-sm font-medium text-white transition hover:bg-[#2a2d2f] max-[639px]:w-full max-[639px]:justify-center sm:h-12 sm:text-base"
            >
              시작하기
            </Link>
            <Link
              href="/tools/jeonse-check"
              className="hidden h-11 items-center rounded-full border border-[#11140f] bg-transparent px-5 text-sm font-medium text-[#11140f] transition hover:bg-white/45 sm:inline-flex sm:h-12 sm:text-base"
            >
              전세 안전 체크
            </Link>
          </div>

          <div className="sm:hidden">
            <NightCityVisual />
          </div>

          <div className="grid max-w-xl gap-3 border-t border-[#11140f]/12 pt-4">
            <p className="text-xs font-normal text-[#5f6a6e] sm:text-sm">
              {sourceCountLabel} · {evidenceLabel} · 투자 조언 아님
            </p>
            <span className="sr-only">
              내 상황별 영향 · 무주택자 확인 · 세입자 주의 · 투자자 공실 리스크 · 주의 · 확인
            </span>
          </div>
        </div>

        <div className="hidden sm:block">
          <NightCityVisual />
        </div>
      </div>
    </section>
  );
}
