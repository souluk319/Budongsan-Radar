type TagProps = {
  children: React.ReactNode;
  tone?: "category" | "region" | "plain";
};

export function Tag({ children, tone = "plain" }: TagProps) {
  const toneClass = {
    category: "border-[#eadfce] bg-[#fff8ec] text-[#9a4f00]",
    region: "border-[#e5dac8] bg-white text-[#5e554b]",
    plain: "border-[#eadfce] bg-white text-[#5e554b]",
  }[tone];

  return (
    <span
      className={`inline-flex h-6 items-center whitespace-nowrap rounded-sm border px-2 text-xs font-bold ${toneClass}`}
    >
      {children}
    </span>
  );
}
