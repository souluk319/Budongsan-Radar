import Link from "next/link";
import Image from "next/image";
import type { HomeSignalModel } from "@/lib/home-signals";

type HomeSignalBoardProps = {
  model: HomeSignalModel;
  liveLinkCount: number;
};

const heroPhotos = [
  {
    src: "/hero-night-city.png",
    alt: "아파트와 도심 야경",
  },
  {
    src: "/hero-urban-park.png",
    alt: "도심 속 공원과 아파트 야경",
  },
  {
    src: "/hero-city-forest.png",
    alt: "화창한 도시 숲과 아파트",
  },
  {
    src: "/hero-riverside-life.png",
    alt: "강변 산책로와 주거지",
  },
  {
    src: "/hero-community-courtyard.png",
    alt: "아파트 커뮤니티 정원",
  },
  {
    src: "/hero-balcony-view.png",
    alt: "도시 전망이 보이는 발코니",
  },
];

function HeroPhotoBackdrop() {
  return (
    <div
      aria-label="도시 야경과 도심 속 공원 사진"
      className="absolute inset-0 overflow-hidden bg-[#07110f]"
    >
      {heroPhotos.map((photo, index) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 42rem, 50vw"
          style={{ animationDelay: `${index * 5}s` }}
          className={`hero-rotator-slide object-cover object-center ${
            index === 0 ? "hero-rotator-slide-primary" : "hero-rotator-slide-secondary"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.74)_0%,rgba(5,5,5,0.48)_38%,rgba(5,5,5,0.08)_74%,rgba(5,5,5,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.42)_0%,rgba(5,5,5,0)_34%,rgba(5,5,5,0.58)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#eef3f4] via-[#eef3f4]/42 to-transparent" />
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
    <section className="relative isolate min-h-[calc(100svh-3.5rem)] overflow-hidden border-b border-[#11140f]/10 bg-[#07110f] text-white sm:min-h-[calc(100svh-4rem)]">
      <HeroPhotoBackdrop />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-7xl flex-col justify-end px-4 pb-8 pt-24 sm:min-h-[calc(100svh-4rem)] sm:px-6 sm:pb-12 sm:pt-28 lg:px-8 lg:pb-16">
        <div className="grid max-w-[48rem] gap-5 sm:gap-7">
          <p className="text-sm font-medium text-white/82 sm:text-base">
            집집 부동산 브리프
          </p>

          <div className="grid gap-5">
            <h1 className="max-w-[46rem] text-[3.28rem] font-extrabold leading-[0.96] text-white min-[390px]:text-[3.62rem] sm:text-[5.8rem] sm:leading-[0.9] lg:text-[7.1rem] [word-break:keep-all]">
              집값을
              <br />
              먼저 읽다.
            </h1>
            <p className="hidden max-w-2xl text-base font-normal leading-7 text-white/86 sm:block sm:text-[1.42rem] sm:leading-9 [word-break:keep-all]">
              흩어진 뉴스와 시장 데이터를 모아 오늘의 부동산 신호를 한눈에 보여줍니다.
            </p>
          </div>

          <p className="max-w-xl text-base font-normal leading-7 text-white/86 sm:hidden [word-break:keep-all]">
            흩어진 뉴스와 시장 데이터를 모아 오늘의 부동산 신호를 한눈에 보여줍니다.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href={pickHref}
              className="inline-flex h-11 items-center rounded-full bg-[#d6e85c] px-7 text-sm font-semibold text-[#050505] transition hover:bg-[#e1f174] max-[639px]:w-full max-[639px]:justify-center sm:h-12 sm:text-base"
            >
              시작하기
            </Link>
            <Link
              href="/tools/jeonse-check"
              className="hidden h-11 items-center rounded-full border border-white/38 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20 sm:inline-flex sm:h-12 sm:text-base"
            >
              전세 안전 체크
            </Link>
          </div>
        </div>

        <div className="mt-9 grid max-w-[48rem] gap-3 border-t border-white/22 pt-4 sm:mt-12 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs font-normal text-white/72 sm:text-sm">
            {sourceCountLabel} · {evidenceLabel} · 투자 조언 아님
          </p>
          <div className="flex w-fit items-center gap-3 rounded-full border border-white/22 bg-[#07110f]/44 px-4 py-3 text-white shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <span className="text-xs font-medium text-white/78">
              오늘의 동네 흐름
            </span>
            <span className="h-2 w-2 rounded-full bg-[#d6e85c] shadow-[0_0_18px_rgba(214,232,92,0.85)]" />
          </div>
          <span className="sr-only">
            내 상황별 영향 · 무주택자 확인 · 세입자 주의 · 투자자 공실 리스크 · 주의 · 확인
          </span>
        </div>
      </div>
    </section>
  );
}
