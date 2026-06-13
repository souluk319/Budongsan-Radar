"use client";

import { useState } from "react";
import type { AudienceSegment, AudienceStatus } from "@/lib/home-signals";

type AudienceImpactChipsProps = {
  segments: AudienceSegment[];
  initialSegmentLabel?: AudienceSegment["label"];
};

const statusClasses: Record<AudienceStatus, string> = {
  주의: "border-[#f4b98b] bg-[#fff4ea] text-[#a14300]",
  확인: "border-[#b7d7ff] bg-[#eef6ff] text-[#155ca8]",
  기회: "border-[#b7e3c7] bg-[#effaf2] text-[#176b3a]",
  관망: "border-[#e5dac8] bg-white text-[#5e554b]",
};

export function AudienceImpactChips({
  segments,
  initialSegmentLabel,
}: AudienceImpactChipsProps) {
  const [selectedLabel, setSelectedLabel] = useState(
    initialSegmentLabel ?? segments[0]?.label,
  );
  const selectedSegment =
    segments.find((segment) => segment.label === selectedLabel) ?? segments[0];

  return (
    <section className="grid gap-2.5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#14110f]">내 상황별 영향</p>
          <p className="mt-0.5 text-xs font-semibold text-[#6b6254] sm:text-sm">
            내 입장에서는 뭘 확인해야 하는지 먼저 봅니다.
          </p>
        </div>
      </div>

      <div className="filter-scroll flex gap-2 overflow-x-auto pb-1">
        {segments.map((segment) => {
          const isSelected = segment.label === selectedSegment?.label;

          return (
            <button
              key={segment.label}
              type="button"
              onClick={() => setSelectedLabel(segment.label)}
              className={`min-w-[7.6rem] shrink-0 rounded-md border px-3 py-2.5 text-left transition sm:min-w-[8.25rem] sm:py-3 ${
                isSelected
                  ? "border-[#d97706] bg-[#fff8ec] text-[#14110f] shadow-[0_8px_22px_rgba(154,79,0,0.09)]"
                  : `${statusClasses[segment.status]} hover:border-[#14110f]`
              }`}
            >
              <span className="block text-sm font-black leading-tight">
                {segment.label}
              </span>
              <span
                className={`mt-2 inline-flex rounded-sm px-2 py-0.5 text-xs font-black ${
                  isSelected
                    ? "bg-[#d97706] text-white"
                    : "bg-white/65 text-inherit"
                }`}
              >
                {segment.status}
              </span>
            </button>
          );
        })}
      </div>

      {selectedSegment ? (
        <div className="rounded-md border border-[#eadfce] bg-white px-3.5 py-2.5 sm:px-4 sm:py-3">
          <p className="text-xs font-black text-[#8a7d6d]">내 기준 한 줄</p>
          <p className="mt-1 line-clamp-2 text-sm font-bold leading-6 text-[#2b2520]">
            {selectedSegment.body}
          </p>
        </div>
      ) : null}
    </section>
  );
}
