type ScoreBadgeProps = {
  score: number;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const tone =
    score >= 85
      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
      : score >= 75
        ? "border-sky-300 bg-sky-50 text-sky-900"
        : "border-amber-300 bg-amber-50 text-amber-900";

  return (
    <span
      className={`inline-flex h-10 min-w-14 items-center justify-center rounded-md border px-2 font-mono text-sm font-semibold ${tone}`}
      aria-label={`레이더 점수 ${score}점`}
    >
      {score}
    </span>
  );
}
