type BrandLogoProps = {
  tone?: "dark" | "light" | "hero";
  tagline?: string;
  compact?: boolean;
  className?: string;
};

const toneStyles = {
  dark: {
    mark: "text-[#d6e85c]",
    word: "text-white",
    tag: "text-white/58",
  },
  hero: {
    mark: "text-[#d6e85c]",
    word: "text-white",
    tag: "text-white/68",
  },
  light: {
    mark: "text-[#07110f]",
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
    <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
      <span
        className={`grid size-8 shrink-0 place-items-center ${styles.mark}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 36 36"
          className="size-8"
          role="img"
          focusable="false"
        >
          <path
            d="M7.8 10.5h8.4l-8.4 15h8.4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="4"
          />
          <path
            d="M19.8 10.5h8.4l-8.4 15h8.4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="4"
          />
        </svg>
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span
          className={`block whitespace-nowrap text-[1.32rem] font-black leading-none tracking-[0.02em] ${styles.word}`}
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
