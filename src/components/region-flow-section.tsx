import Link from "next/link";
import type { RegionFlow, RegionHeatTone } from "@/lib/home-signals";
import { getRegionHref } from "@/lib/place-data";

type RegionFlowSectionProps = {
  flows: RegionFlow[];
  limit?: number;
};

const toneClasses: Record<RegionHeatTone, { tile: string; dot: string; text: string }> = {
  hot: {
    tile:
      "border-2 border-[#ff6b3d] bg-[#fff7f2] shadow-[inset_0_0_0_1px_rgba(255,107,61,0.16),0_8px_22px_rgba(255,107,61,0.12)]",
    dot:
      "bg-[#ff4d2e] ring-4 ring-[#ffe0d2] shadow-[0_0_0_1px_rgba(17,20,15,0.05),0_0_18px_rgba(255,77,46,0.42)]",
    text: "rounded-full bg-[#fff0e8] px-2 py-0.5 text-[#9a2e12]",
  },
  watch: {
    tile: "border-[#afd2ff] bg-[#f8fbfb]",
    dot: "bg-[#3b82f6] ring-2 ring-[#d8e9ff]",
    text: "text-[#155ca8]",
  },
  mixed: {
    tile: "border-[#bce5ca] bg-[#f8fbfb]",
    dot: "bg-[#10b981] ring-2 ring-[#dff8e7]",
    text: "text-[#176b3a]",
  },
  cool: {
    tile: "border-[#cbd3d5] bg-[#f8fbfb]",
    dot: "bg-[#9ca3af] ring-2 ring-[#eef3f4]",
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
    <section className="grid gap-3 rounded-xl border border-[#cbd3d5] bg-white/70 p-3.5 shadow-[0_18px_44px_rgba(26,38,42,0.08)] backdrop-blur sm:p-4">
      <div>
        <p className="text-sm font-semibold text-[#14110f]">지역 온도</p>
        <p className="mt-1 text-xs font-normal leading-5 text-[#596366] sm:text-sm">
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
              className={`grid gap-2 rounded-lg border p-2.5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,20,15,0.08)] ${tone.tile}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-3 w-3 shrink-0 rounded-full ${tone.dot}`}
                    aria-hidden
                  />
                  <span className="truncate text-sm font-semibold text-[#14110f]">
                    {flow.region}
                  </span>
                </div>
                <span className={`text-xs font-semibold ${tone.text}`}>
                  {heatLabelText[flow.heatLabel]}
                </span>
              </div>
              <p className="line-clamp-2 text-xs font-normal leading-5 text-[#596366]">
                {flow.topic} · {flow.count}건 · {statusCopy[flow.status]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
