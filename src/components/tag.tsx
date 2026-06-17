type TagProps = {
  children: React.ReactNode;
  tone?: "category" | "region" | "plain";
};

export function Tag({ children, tone = "plain" }: TagProps) {
  const toneClass = {
    category: "border-[#cbd6d8] bg-[#f8fbfb] text-[#11140f]",
    region: "border-[#cbd6d8] bg-white/75 text-[#4f5a5d]",
    plain: "border-[#cbd6d8] bg-white/75 text-[#4f5a5d]",
  }[tone];

  return (
    <span
      className={`inline-flex h-6 items-center whitespace-nowrap rounded-full border px-2.5 text-xs font-semibold ${toneClass}`}
    >
      {children}
    </span>
  );
}
