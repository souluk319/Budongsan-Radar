type ScoreBadgeProps = {
  score: number;
  compact?: boolean;
};

export function ScoreBadge({ score, compact = false }: ScoreBadgeProps) {
  const label = score >= 86 ? "높음" : score >= 75 ? "보통" : "낮음";
  const tone =
    score >= 86
      ? "border-[#f4b98b] bg-[#fff4ea] text-[#9a4f00]"
      : score >= 75
        ? "border-[#b7d7ff] bg-[#eef6ff] text-[#155ca8]"
        : "border-[#e5dac8] bg-white text-[#5e554b]";

  return (
    <span
      className={`inline-flex h-7 items-center justify-center rounded-sm border px-2 text-xs font-black ${tone}`}
      aria-label={`중요도 ${score}점`}
      title={`내부 중요도 ${score}점`}
    >
      {compact ? label : `중요도 ${label}`}
    </span>
  );
}
