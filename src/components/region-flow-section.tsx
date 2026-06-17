import Link from "next/link";
import type { RegionFlow, RegionHeatTone } from "@/lib/home-signals";
import { getRegionHref } from "@/lib/place-data";

type RegionFlowSectionProps = {
  flows: RegionFlow[];
  limit?: number;
};

const toneClasses: Record<RegionHeatTone, { tile: string; dot: string; text: string }> = {
  hot: {
    tile: "border-[#d7ff49]/45 bg-[#f8fbfb]",
    dot: "bg-[#d7ff49]",
    text: "text-[#11140f]",
  },
  watch: {
    tile: "border-[#afd2ff] bg-[#f8fbfb]",
    dot: "bg-[#3b82f6]",
    text: "text-[#155ca8]",
  },
  mixed: {
    tile: "border-[#bce5ca] bg-[#f8fbfb]",
    dot: "bg-[#10b981]",
    text: "text-[#176b3a]",
  },
  cool: {
    tile: "border-[#cbd3d5] bg-[#f8fbfb]",
    dot: "bg-[#9ca3af]",
    text: "text-[#596366]",
  },
};

const heatLabelText: Record<RegionFlow["heatLabel"], string> = {
  HOT: "뜨거움",
  WATCH: "관찰",
  MIXED: "혼조",
  COOL: "차분함",
};

const statusCopy: Record<RegionFlow["status"], string> = {
  "신호 강함": "먼저 확인할 흐름",
  "지켜볼 흐름": "조금 더 지켜볼 흐름",
  조용함: "가볍게 확인할 흐름",
};

export function RegionFlowSection({ flows, limit }: RegionFlowSectionProps) {
  const visibleFlows = typeof limit === "number" ? flows.slice(0, limit) : flows;

  return (
    <section className="grid gap-3 rounded-md border border-[#cbd3d5] bg-white p-3.5 sm:p-4">
      <div>
        <p className="text-sm font-black text-[#14110f]">지역 온도</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-[#596366] sm:text-sm">
          지역 흐름을 온도로 가볍게 봅니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        {visibleFlows.map((flow) => {
          const tone = toneClasses[flow.heatTone];

          return (
            <Link
              key={flow.region}
              href={getRegionHref(flow.region)}
              className={`grid gap-2 rounded-md border p-2.5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,20,15,0.08)] ${tone.tile}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`}
                    aria-hidden
                  />
                  <span className="truncate text-sm font-black text-[#14110f]">
                    {flow.region}
                  </span>
                </div>
                <span className={`text-xs font-black ${tone.text}`}>
                  {heatLabelText[flow.heatLabel]}
                </span>
              </div>
              <p className="line-clamp-2 text-xs font-semibold leading-5 text-[#596366]">
                {flow.topic} · {flow.count}건 · {statusCopy[flow.status]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
