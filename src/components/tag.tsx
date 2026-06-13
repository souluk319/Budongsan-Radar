type TagProps = {
  children: React.ReactNode;
  tone?: "category" | "region" | "plain";
};

export function Tag({ children, tone = "plain" }: TagProps) {
  const toneClass = {
    category: "border-slate-300 bg-slate-100 text-slate-800",
    region: "border-teal-200 bg-teal-50 text-teal-800",
    plain: "border-zinc-200 bg-white text-zinc-700",
  }[tone];

  return (
    <span
      className={`inline-flex h-7 items-center whitespace-nowrap rounded-md border px-2 text-xs font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}
