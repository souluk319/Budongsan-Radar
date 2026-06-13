import Link from "next/link";
import type {
  AudienceSegment,
  HomeSignalModel,
  RegionFlow,
  RegionHeatTone,
  SignalTone,
} from "@/lib/home-signals";
import { getRegionHref } from "@/lib/place-data";
import type { RadarLink } from "@/lib/radar-data";

type MarketPulseVisualProps = {
  model: HomeSignalModel;
  liveLinkCount: number;
};

const heatCopy: Record<RegionFlow["heatLabel"], string> = {
  HOT: "뜨거움",
  WATCH: "관찰",
  MIXED: "혼조",
  COOL: "차분",
};

const heatStyles: Record<RegionHeatTone, string> = {
  hot: "border-[#f26b2f]/45 bg-[#fff0e7] text-[#7a2c0f] shadow-[0_18px_42px_rgba(242,107,47,0.18)]",
  watch:
    "border-[#3b82f6]/35 bg-[#eef6ff] text-[#153f7a] shadow-[0_18px_42px_rgba(59,130,246,0.14)]",
  mixed:
    "border-[#d7b25a]/45 bg-[#fff8db] text-[#62450c] shadow-[0_18px_42px_rgba(215,178,90,0.14)]",
  cool: "border-[#b8c2cf]/45 bg-[#f2f5f8] text-[#34404d] shadow-[0_18px_42px_rgba(52,64,77,0.09)]",
};

const signalMeta: Record<
  SignalTone,
  { label: string; className: string; count: (model: HomeSignalModel) => number }
> = {
  strong: {
    label: "꼭 보기",
    className: "bg-[#f26b2f]",
    count: (model) => model.strongSignalCount,
  },
  watch: {
    label: "지켜보기",
    className: "bg-[#3b82f6]",
    count: (model) => model.watchSignalCount,
  },
  noise: {
    label: "가볍게 보기",
    className: "bg-[#b8a992]",
    count: (model) => model.noiseLinks.length,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCategoryPressure(model: HomeSignalModel) {
  const categoryCounts = new Map<string, { count: number; topScore: number }>();

  for (const link of model.signalTapeLinks) {
    const current = categoryCounts.get(link.category) ?? {
      count: 0,
      topScore: 0,
    };

    categoryCounts.set(link.category, {
      count: current.count + 1,
      topScore: Math.max(current.topScore, link.score),
    });
  }

  return [...categoryCounts.entries()]
    .map(([category, value]) => ({
      category,
      count: value.count,
      topScore: value.topScore,
      width: clamp(value.count * 18 + value.topScore * 0.55, 18, 100),
    }))
    .sort((a, b) => b.width - a.width)
    .slice(0, 4);
}

function getFlowBars(flow: RegionFlow) {
  const base = Math.max(flow.signalScore, flow.heatPercent);

  return [0.34, 0.52, 0.76, 0.62, 0.92, 0.71].map((ratio, index) => ({
    key: `${flow.region}-${index}`,
    height: clamp(base * ratio, 16, 88),
  }));
}

function getEvidenceTotal(model: HomeSignalModel) {
  return model.signalTapeLinks.reduce(
    (sum, link) => sum + (link.evidenceCount ?? 0),
    0,
  );
}

function getTopIssueRows(model: HomeSignalModel) {
  return model.signalTapeLinks.slice(0, 5).map((link, index) => ({
    link,
    rank: index + 1,
    width: clamp(link.score, 28, 96),
  }));
}

function getAudienceTone(segment: AudienceSegment) {
  if (segment.status === "주의") {
    return "bg-[#fff0e7] text-[#8a3515] border-[#f5c2a7]";
  }

  if (segment.status === "확인") {
    return "bg-[#eef6ff] text-[#155ca8] border-[#b8d8ff]";
  }

  if (segment.status === "기회") {
    return "bg-[#effaf2] text-[#176b3a] border-[#b7e3c7]";
  }

  return "bg-white text-[#5e554b] border-[#e5dac8]";
}

function CompactPick({
  link,
  primaryAudience,
}: {
  link?: RadarLink;
  primaryAudience: AudienceSegment;
}) {
  if (!link) {
    return (
      <div className="rounded-2xl border border-[#241b13] bg-white p-4 shadow-[0_18px_42px_rgba(34,27,19,0.12)]">
        <p className="text-xs font-black text-[#f26b2f]">오늘의 집픽</p>
        <p className="mt-2 text-lg font-black text-[#14110f]">
          아직 강한 집픽이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#241b13] bg-white p-4 shadow-[0_18px_42px_rgba(34,27,19,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="rounded-full bg-[#14110f] px-3 py-1 text-xs font-black text-white">
          오늘의 집픽
        </p>
        <p className="text-xs font-black text-[#f26b2f]">
          공식 근거 {link.evidenceCount ?? 0}개
        </p>
      </div>
      <Link
        href={`/links/${link.id}`}
        className="mt-3 block text-xl font-black leading-tight text-[#14110f] hover:underline [word-break:keep-all]"
      >
        {link.title}
      </Link>
      <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#51483d]">
        {link.impactLine}
      </p>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-[#eadfce] pt-3">
        <p className="min-w-0 text-xs font-black text-[#6b6254]">
          {primaryAudience.label} · {primaryAudience.status}
        </p>
        <Link
          href={`/links/${link.id}`}
          className="inline-flex h-9 items-center rounded-full bg-[#f26b2f] px-3.5 text-sm font-black text-white hover:bg-[#d6531c]"
        >
          보기
        </Link>
      </div>
    </div>
  );
}

export function MarketPulseVisual({
  model,
  liveLinkCount,
}: MarketPulseVisualProps) {
  const categoryPressure = getCategoryPressure(model);
  const topRows = getTopIssueRows(model);
  const evidenceTotal = getEvidenceTotal(model);

  return (
    <section
      aria-label="오늘의 시장지도"
      className="overflow-hidden rounded-[1.35rem] border border-[#241b13] bg-[#fffaf2] shadow-[0_22px_60px_rgba(34,27,19,0.12)]"
    >
      <header className="grid gap-4 border-b border-[#241b13] bg-white px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="text-xs font-black text-[#f26b2f]">오늘의 시장지도</p>
          <h1 className="mt-1 text-3xl font-black leading-tight text-[#14110f] sm:text-5xl [word-break:keep-all]">
            뉴스가 어디를 흔드는지 먼저 봅니다
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <span className="text-xs font-black text-[#6b6254]">
            {model.dateLabel}
          </span>
          <span className="rounded-full bg-[#14110f] px-3 py-1 text-xs font-black text-white">
            실제 수집 {liveLinkCount}건
          </span>
          <span className="rounded-full bg-[#fff0e7] px-3 py-1 text-xs font-black text-[#8a3515]">
            공식 근거 {evidenceTotal}개
          </span>
        </div>
      </header>

      <div className="grid min-h-[36rem] gap-4 bg-[#f4ecdf] p-3 sm:p-4 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_19rem]">
        <aside className="order-2 grid content-start gap-3 rounded-2xl border border-[#d8c7af] bg-white/92 p-3 lg:order-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black text-[#14110f]">
              지금 뜨는 이슈
            </p>
            <span className="text-xs font-black text-[#f26b2f]">
              TOP {topRows.length}
            </span>
          </div>
          <div className="grid gap-2">
            {topRows.map((row) => (
              <Link
                key={row.link.id}
                href={`/links/${row.link.id}`}
                className="group grid gap-2 rounded-xl border border-[#eadfce] bg-[#fffdf8] p-3 transition hover:border-[#14110f] hover:bg-white"
              >
                <div className="flex items-start gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#14110f] text-xs font-black text-white">
                    {row.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-black leading-5 text-[#14110f] group-hover:underline">
                      {row.link.title}
                    </p>
                    <p className="mt-1 text-[0.7rem] font-bold text-[#7a7064]">
                      {row.link.category} · 근거 {row.link.evidenceCount ?? 0}개
                    </p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[#eadfce]">
                  <div
                    className="h-full rounded-full bg-[#f26b2f]"
                    style={{ width: `${row.width}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </aside>

        <div className="relative order-1 min-h-[33rem] overflow-hidden rounded-2xl border border-[#241b13] bg-[#f8f2e8] lg:order-2">
          <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(#e2d8ca_1px,transparent_1px),linear-gradient(90deg,#e2d8ca_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="absolute left-[-8%] top-[28%] h-28 w-[120%] rotate-[-10deg] bg-[#e3d7c8]" />
          <div className="absolute left-[-12%] top-[58%] h-24 w-[130%] rotate-[12deg] bg-[#ded0bf]" />
          <div className="absolute bottom-[-18%] right-[-12%] h-72 w-72 rounded-full border-[34px] border-[#cddae7]/80" />
          <div className="absolute right-[8%] top-[10%] h-52 w-28 rotate-[18deg] rounded-full bg-[#d8e6ef]" />

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
            viewBox="0 0 820 520"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pulse-orange" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#f26b2f" stopOpacity="0.8" />
                <stop offset="1" stopColor="#f8c15d" stopOpacity="0.28" />
              </linearGradient>
              <linearGradient id="pulse-blue" x1="1" x2="0" y1="0" y2="1">
                <stop stopColor="#3b82f6" stopOpacity="0.62" />
                <stop offset="1" stopColor="#6ec6ff" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path
              d="M142 176 C278 118 376 154 520 96"
              fill="none"
              stroke="url(#pulse-orange)"
              strokeLinecap="round"
              strokeWidth="18"
            />
            <path
              d="M550 128 C480 214 486 312 592 380"
              fill="none"
              stroke="url(#pulse-orange)"
              strokeLinecap="round"
              strokeWidth="14"
            />
            <path
              d="M178 386 C304 328 392 324 520 398"
              fill="none"
              stroke="url(#pulse-blue)"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <path
              d="M200 194 C318 260 348 322 258 408"
              fill="none"
              stroke="#16110d"
              strokeDasharray="3 12"
              strokeLinecap="round"
              strokeOpacity="0.22"
              strokeWidth="5"
            />
          </svg>

          <div className="absolute left-3 right-3 top-3 z-10 rounded-2xl border border-[#241b13] bg-white/92 p-3 shadow-[0_16px_38px_rgba(34,27,19,0.12)] backdrop-blur sm:left-4 sm:right-auto sm:w-[17rem]">
            <p className="text-xs font-black text-[#f26b2f]">오늘의 판세</p>
            <p className="mt-1 text-2xl font-black leading-none text-[#14110f]">
              {model.moodLabel}
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#51483d]">
              {model.heroSubVerdict}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#eadfce] pt-3 text-center">
              <div>
                <span className="block text-lg font-black text-[#14110f]">
                  {model.strongSignalCount}
                </span>
                <span className="text-[0.68rem] font-bold text-[#7a7064]">
                  강한 신호
                </span>
              </div>
              <div>
                <span className="block text-lg font-black text-[#14110f]">
                  {model.totalIssues}
                </span>
                <span className="text-[0.68rem] font-bold text-[#7a7064]">
                  전체 이슈
                </span>
              </div>
              <div>
                <span className="block text-lg font-black text-[#14110f]">
                  {model.importanceLabel}
                </span>
                <span className="text-[0.68rem] font-bold text-[#7a7064]">
                  중요도
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 p-3 pt-[13.5rem] sm:p-4 sm:pt-[14rem]">
            <p className="col-span-2 text-xs font-black text-[#6b6254]">
              지역 흐름
            </p>
            {model.regionFlows.map((flow) => (
              <Link
                key={flow.region}
                href={getRegionHref(flow.region)}
                className={`min-w-0 rounded-2xl border p-3 transition hover:-translate-y-0.5 hover:border-[#14110f] sm:p-4 ${heatStyles[flow.heatTone]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-[0.68rem] font-black">
                      {heatCopy[flow.heatLabel]}
                    </span>
                    <strong className="mt-1 block text-base font-black leading-tight text-[#14110f] min-[390px]:text-lg">
                      {flow.region}
                    </strong>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-white/75 px-2 py-1 text-xs font-black">
                    {flow.count}건
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-[#4d4338]">
                  {flow.topic} · {flow.status}
                </p>
                <div className="mt-3 flex h-12 items-end gap-1.5">
                  {getFlowBars(flow).map((bar) => (
                    <span
                      key={bar.key}
                      className="w-full rounded-t-sm bg-[#14110f]/75"
                      style={{ height: `${bar.height}%` }}
                    />
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="relative z-20 mx-3 mb-3 rounded-2xl border border-[#241b13] bg-white/94 p-3 shadow-[0_18px_42px_rgba(34,27,19,0.14)] backdrop-blur sm:mx-4 sm:mb-4">
            <p className="text-xs font-black text-[#f26b2f]">이슈 압력</p>
            <div className="mt-2 grid gap-2">
              {categoryPressure.length > 0 ? (
                categoryPressure.map((item) => (
                  <div key={item.category} className="grid gap-1">
                    <div className="flex items-center justify-between gap-2 text-[0.72rem] font-black text-[#5e554b]">
                      <span>{item.category}</span>
                      <span>{item.count}건</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#eadfce]">
                      <div
                        className="h-full rounded-full bg-[#f26b2f]"
                        style={{ width: `${item.width}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-[#6b6254]">
                  이슈 압력을 계산할 데이터를 모으는 중입니다.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="order-3 grid content-start gap-3 xl:order-3">
          <CompactPick
            link={model.strongestLink}
            primaryAudience={model.primaryAudience}
          />
          <section className="grid gap-2">
            <div>
              <p className="text-sm font-black text-[#14110f]">
                내 상황별 영향
              </p>
              <p className="mt-0.5 text-xs font-bold text-[#6b6254]">
                내 입장에서 바로 볼 것
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
              {model.audienceSegments.map((segment) => (
                <div
                  key={segment.label}
                  className={`rounded-2xl border p-3 ${getAudienceTone(segment)}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-black">
                      {segment.label}
                    </strong>
                    <span className="text-xs font-black">
                      {segment.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs font-bold leading-5">
                    {segment.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <footer className="grid grid-cols-3 divide-x divide-[#e2d1ba] border-t border-[#241b13] bg-white">
        {(["strong", "watch", "noise"] as SignalTone[]).map((tone) => {
          const meta = signalMeta[tone];
          const count = meta.count(model);
          const maxCount = Math.max(model.totalIssues, 1);

          return (
            <div key={tone} className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-[#5e554b]">
                  {meta.label}
                </span>
                <span className="text-sm font-black text-[#14110f]">
                  {count}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-[#eadfce]">
                <div
                  className={`h-full rounded-full ${meta.className}`}
                  style={{ width: `${clamp((count / maxCount) * 100, 8, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </footer>
    </section>
  );
}
