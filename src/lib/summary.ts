import "server-only";

import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { getOpenAIConfig } from "@/lib/env";
import { formatEvidenceForPrompt } from "@/lib/evidence";
import { getOpenAIClient } from "@/lib/openai";
import type { EvidenceObservation, RadarLink } from "@/lib/radar-data";

export const radarSummarySchema = z.object({
  summaryBullets: z.array(z.string()).min(3).max(3),
  whyItMatters: z.string().min(20),
  audienceImpact: z.object({
    homelessBuyer: z.string().min(10),
    oneHomeOwner: z.string().min(10),
    renter: z.string().min(10),
    investor: z.string().min(10),
  }),
  checkpoints: z.array(z.string()).min(3).max(5),
  groundingNotes: z.array(z.string()).min(2).max(5),
  uncertainties: z.array(z.string()).min(1).max(4),
  impactLine: z.string().min(10).max(120),
  score: z.number().int().min(1).max(100),
  confidence: z.number().min(0).max(1),
});

export type RadarSummary = z.infer<typeof radarSummarySchema>;

export async function generateRadarSummary(link: Pick<RadarLink, "title" | "sourceName" | "sourceUrl" | "category" | "regions" | "impactLine"> & {
  rawExcerpt?: string | null;
  evidence?: EvidenceObservation[];
}) {
  const client = getOpenAIClient();
  const config = getOpenAIConfig();

  if (!client) {
    throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
  }

  const response = await client.responses.parse({
    model: config.model,
    input: [
      {
        role: "system",
        content:
          "너는 한국 부동산 이슈 큐레이션 편집자다. 투자 조언, 매수/매도 추천, 확정적 예측을 금지한다. 반드시 제공된 근거와 원문 발췌를 분리해서 보고, 공식 근거가 약한 부분은 불확실성으로 표시한다. 실수요자 관점으로 짧고 명확하게 쓴다.",
      },
      {
        role: "user",
        content: [
          `제목: ${link.title}`,
          `출처: ${link.sourceName}`,
          `URL: ${link.sourceUrl}`,
          `카테고리: ${link.category}`,
          `지역: ${link.regions.join(", ")}`,
          `기존 한 줄: ${link.impactLine}`,
          `원문 발췌: ${link.rawExcerpt || "제공된 발췌 없음"}`,
          "연결된 근거 데이터:",
          formatEvidenceForPrompt(link.evidence ?? []),
          "위 이슈를 한국어로 요약해라. 모든 문장은 참고 정보임을 전제로 작성하고, 행동을 지시하지 말고 체크포인트 중심으로 정리해라. groundingNotes에는 근거로 확인한 내용만, uncertainties에는 아직 확인되지 않았거나 해석이 필요한 내용을 써라.",
        ].join("\n"),
      },
    ],
    text: {
      format: zodTextFormat(radarSummarySchema, "radar_summary"),
    },
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI structured output 파싱에 실패했습니다.");
  }

  return {
    model: config.model,
    summary: response.output_parsed,
  };
}
