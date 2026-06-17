type BrandLogoProps = {
  tone?: "dark" | "light" | "hero";
  tagline?: string;
  compact?: boolean;
  className?: string;
};

const toneStyles = {
  dark: {
    mark: "bg-[#d6e85c] text-[#07110f] shadow-[0_10px_28px_rgba(214,232,92,0.16)]",
    word: "text-white",
    tag: "text-white/58",
  },
  hero: {
    mark: "bg-[#d6e85c] text-[#07110f] shadow-[0_16px_40px_rgba(0,0,0,0.24)]",
    word: "text-white",
    tag: "text-white/68",
  },
  light: {
    mark: "bg-[#07110f] text-[#d6e85c] shadow-[0_10px_24px_rgba(7,17,15,0.12)]",
    word: "text-[#07110f]",
    tag: "text-[#07110f]/58",
  },
};

export function BrandLogo({
  tone = "dark",
  tagline,
  compact = false,
  className = "",
}: BrandLogoProps) {
  const styles = toneStyles[tone];

  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-[0.78rem] ${styles.mark}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 40"
          className="size-7"
          role="img"
          focusable="false"
        >
          <path
            d="M8.8 20.7 16.4 13l7.6 7.7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.1"
          />
          <path
            d="M16 20.7 23.6 13l7.6 7.7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.1"
            opacity="0.72"
          />
          <path
            d="M12.4 20.4v8.2h15.2v-8.2"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.1"
          />
          <path
            d="M18.2 28.6v-5h3.6v5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.6"
          />
        </svg>
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span
          className={`block whitespace-nowrap text-[1.28rem] font-black leading-none tracking-[0.01em] ${styles.word}`}
        >
          집집
        </span>
        {!compact && tagline ? (
          <span
            className={`block whitespace-nowrap text-[0.62rem] font-semibold leading-none tracking-[0.18em] ${styles.tag}`}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
