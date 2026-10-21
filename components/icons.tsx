// 沿用舊站的線條圖示。

export function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Hero 背景上的圓與斜線，捲動時有視差效果（見 Motion.tsx） */
export function HeroLines() {
  return (
    <svg className="hero-lines" viewBox="0 0 640 640" aria-hidden="true">
      <circle cx="320" cy="320" r="310" fill="none" stroke="#fff" strokeWidth="1" opacity=".18" />
      <line x1="60" y1="640" x2="520" y2="0" stroke="#fff" strokeWidth="1" opacity=".14" />
    </svg>
  );
}
