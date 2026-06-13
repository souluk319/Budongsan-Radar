import Link from "next/link";
import type { RegionFlow, RegionHeatTone } from "@/lib/home-signals";
import { getRegionHref } from "@/lib/place-data";

type RegionFlowSectionProps = {
  flows: RegionFlow[];
};

const toneClasses: Record<RegionHeatTone, { dot: string; text: string }> = {
  hot: { dot: "bg-[#d97706]", text: "text-[#9a4f00]" },
  watch: { dot: "bg-[#3b82f6]", text: "text-[#155ca8]" },
  mixed: { dot: "bg-[#10b981]", text: "text-[#176b3a]" },
  cool: { dot: "bg-[#9ca3af]", text: "text-[#62594d]" },
};

const heatLabelText: Record<RegionFlow["heatLabel"], string> = {
  HOT: "뜨거움",
  WATCH: "관찰",
  MIXED: "혼조",
  COOL: "차분함",
};

export function RegionFlowSection({ flows }: RegionFlowSectionProps) {
  return (
    <section className="grid gap-3 rounded-md border border-[#eadfce] bg-white p-4">
      <div>
        <p className="text-sm font-black text-[#14110f]">지역 흐름</p>
        <p className="mt-1 text-sm font-semibold text-[#6b6254]">
          지역별로 어디가 먼저 움직이는지 가볍게 봅니다.
        </p>
      </div>

      <div className="divide-y divide-[#eee4d5]">
        {flows.map((flow) => {
          const tone = toneClasses[flow.heatTone];

          return (
            <Link
              key={flow.region}
              href={getRegionHref(flow.region)}
              className="grid gap-1 py-3 hover:bg-[#fffaf2]"
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
              <p className="truncate pl-4 text-xs font-semibold text-[#7a7064]">
                {flow.topic} · {flow.count}건 · {flow.status}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
