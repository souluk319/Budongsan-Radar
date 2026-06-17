import Link from "next/link";
import type { HomeSignalModel } from "@/lib/home-signals";

type HomeSignalBoardProps = {
  model: HomeSignalModel;
  liveLinkCount: number;
};

function MetallicSignalSculpture() {
  const bars = [
    { height: 142, left: "7%", bottom: 0, width: "10%" },
    { height: 86, left: "16%", bottom: 0, width: "8%" },
    { height: 238, left: "27%", bottom: 0, width: "12%" },
    { height: 166, left: "37%", bottom: 0, width: "9%" },
    { height: 318, left: "49%", bottom: 0, width: "13%" },
    { height: 154, left: "60%", bottom: 0, width: "9%" },
    { height: 276, left: "70%", bottom: 0, width: "12%" },
    { height: 198, left: "82%", bottom: 0, width: "11%" },
  ];

  return (
    <div
      aria-label="Home Signal Board"
      className="relative mx-auto h-[22rem] w-full max-w-[36rem] overflow-hidden sm:h-[35rem] lg:h-[44rem] lg:max-w-none"
    >
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#eef3f4] via-[#eef3f4]/84 to-transparent" />
      <div className="absolute inset-x-[8%] bottom-3 h-20 rounded-[50%] bg-[#1d292c]/18 blur-2xl" />
      <div className="absolute bottom-0 right-0 h-[20rem] w-[90%] sm:h-[34rem] lg:h-[40rem]" aria-hidden>
        {bars.map((bar, index) => (
          <div
            key={`${bar.left}-${bar.height}`}
            className="absolute"
            style={{
              bottom: bar.bottom,
              height: bar.height,
              left: bar.left,
              width: bar.width,
              zIndex: index,
            }}
          >
            <div className="relative h-full w-full">
              <div
                className={[
                  "absolute inset-0 rounded-[5px] border border-white/55",
                  "bg-[linear-gradient(105deg,#fbfdfd_0%,#dce4e3_24%,#8b9896_42%,#f8fbfb_58%,#b9c4c3_76%,#4b5658_100%)]",
                  "shadow-[0_32px_80px_rgba(20,28,30,0.16)]",
                ].join(" ")}
              />
              <div className="absolute -top-5 left-0 h-5 w-full skew-x-[34deg] border border-white/60 bg-[linear-gradient(135deg,#ffffff,#e9eff0_55%,#8a9698)]" />
              <div className="absolute -right-4 -top-2 h-full w-4 skew-y-[28deg] border border-white/45 bg-[linear-gradient(90deg,#738083,#f9fbfb_58%,#9aa5a7)]" />
              <div className="absolute inset-x-[20%] top-6 h-[70%] bg-white/26 blur-md" />
              <div
                className="absolute inset-y-0 left-[18%] w-px bg-white/75"
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Home Signal Board</span>
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
            <MetallicSignalSculpture />
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
          <MetallicSignalSculpture />
        </div>
      </div>
    </section>
  );
}
