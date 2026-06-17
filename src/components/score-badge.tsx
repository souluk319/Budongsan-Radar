type ScoreBadgeProps = {
  score: number;
  compact?: boolean;
};

export function ScoreBadge({ score, compact = false }: ScoreBadgeProps) {
  const label = score >= 86 ? "높음" : score >= 75 ? "보통" : "낮음";
  const tone =
    score >= 86
      ? "border-[#d6e85c] bg-[#f7ffd8] text-[#11140f]"
      : score >= 75
        ? "border-[#b8c8cc] bg-[#f8fbfb] text-[#263235]"
        : "border-[#cbd6d8] bg-white/75 text-[#4f5a5d]";

  return (
    <span
      className={`inline-flex h-7 items-center justify-center rounded-full border px-2.5 text-xs font-semibold ${tone}`}
      aria-label={`중요도 ${score}점`}
      title={`내부 중요도 ${score}점`}
    >
      {compact ? label : `중요도 ${label}`}
    </span>
  );
}
