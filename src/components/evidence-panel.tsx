import { getEvidenceSourceLabel } from "@/lib/evidence";
import type { EvidenceObservation } from "@/lib/radar-data";

type EvidencePanelProps = {
  evidence: EvidenceObservation[];
  groundingNotes?: string[];
  uncertainties?: string[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function metricText(observation: EvidenceObservation) {
  if (!observation.metricLabel) {
    return null;
  }

  if (typeof observation.metricValue !== "number") {
    return observation.metricLabel;
  }

  return `${observation.metricLabel} ${observation.metricValue.toLocaleString("ko-KR")}${observation.metricUnit ?? ""}`;
}

export function EvidencePanel({
  evidence,
  groundingNotes = [],
  uncertainties = [],
}: EvidencePanelProps) {
  return (
    <section className="grid gap-4">
      <div>
        <h3 className="text-lg font-semibold text-[#14110f]">근거 데이터</h3>
        <p className="mt-1 text-sm font-normal leading-6 text-[#667174]">
          집집 해석에 반영한 출처와 기준일입니다. 예측이나 매수·매도 추천이
          아니라 판단 재료로만 보세요.
        </p>
      </div>

      {evidence.length > 0 ? (
        <div className="divide-y divide-[#cbd6d8] border-y border-[#cbd6d8]">
          {evidence.map((observation) => {
            const metric = metricText(observation);

            return (
              <article key={observation.id} className="grid gap-2 py-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="text-[#11140f]">
                    {getEvidenceSourceLabel(observation.source)}
                  </span>
                  <span className="text-[#667174]">
                    {formatDate(observation.observedAt)} 기준
                  </span>
                  {observation.isSample ? (
                    <span className="text-[#667174]">샘플 근거</span>
                  ) : null}
                </div>
                <div className="grid gap-1 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-6 text-[#14110f] [word-break:keep-all]">
                      {observation.title}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-[#667174]">
                      {[observation.regionName, observation.entityLabel, metric]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <p className="text-sm font-normal leading-6 text-[#11140f]">
                    {observation.summary}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border-y border-[#cbd6d8] py-3 text-sm font-normal leading-6 text-[#667174]">
          아직 공식 근거가 연결되지 않았습니다. 원문과 체크포인트를 먼저
          확인하세요.
        </div>
      )}

      {groundingNotes.length > 0 || uncertainties.length > 0 ? (
        <div className="grid gap-4 border-t border-[#cbd6d8] pt-4 sm:grid-cols-2">
          {groundingNotes.length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-[#14110f]">확인된 것</p>
              <ul className="mt-2 grid gap-2 text-sm font-normal leading-6 text-[#11140f]">
                {groundingNotes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {uncertainties.length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-[#14110f]">아직 모르는 것</p>
              <ul className="mt-2 grid gap-2 text-sm font-normal leading-6 text-[#11140f]">
                {uncertainties.map((uncertainty) => (
                  <li key={uncertainty}>- {uncertainty}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
