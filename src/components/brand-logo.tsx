type BrandLogoProps = {
  tone?: "dark" | "light" | "hero";
  tagline?: string;
  compact?: boolean;
  className?: string;
};

const toneStyles = {
  dark: {
    accent: "text-[#d6e85c]",
    word: "text-white",
    tag: "text-white/58",
  },
  hero: {
    accent: "text-[#d6e85c]",
    word: "text-white",
    tag: "text-white/68",
  },
  light: {
    accent: "text-[#07110f]",
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
    <span className={`inline-grid min-w-0 gap-1 ${className}`}>
      <span className="relative block h-7 w-[6.45rem] sm:h-8 sm:w-[7.35rem]">
        <span className="sr-only">집집</span>
        <svg
          viewBox="0 0 122 34"
          className="h-full w-full overflow-visible"
          role="img"
          focusable="false"
          aria-hidden="true"
        >
          <g
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="4.4"
          >
            <path
              d="M3 7h17L3 27h17"
              className={styles.accent}
              stroke="currentColor"
            />
            <path
              d="M28 7v20"
              className={styles.word}
              stroke="currentColor"
            />
            <path
              d="M38 7h20v20H38z M38 17h20"
              className={styles.word}
              stroke="currentColor"
            />
            <path
              d="M67 7h17L67 27h17"
              className={styles.accent}
              stroke="currentColor"
            />
            <path
              d="M92 7v20"
              className={styles.word}
              stroke="currentColor"
            />
            <path
              d="M102 7h20v20h-20z M102 17h20"
              className={styles.word}
              stroke="currentColor"
            />
          </g>
        </svg>
      </span>
      {!compact && tagline ? (
        <span
          className={`block whitespace-nowrap pl-0.5 text-[0.62rem] font-semibold leading-none tracking-[0.18em] ${styles.tag}`}
        >
          {tagline}
        </span>
      ) : null}
    </span>
  );
}
