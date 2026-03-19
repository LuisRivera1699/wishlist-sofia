"use client";

interface SparklesProps {
  className?: string;
  count?: number;
}

export function Sparkles({ className = "", count = 6 }: SparklesProps) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    cx: 10 + (i * 80) / count,
    cy: 10 + ((i * 37) % 30),
    size: 4 + (i % 3),
    opacity: 0.6 + (i % 4) * 0.1,
  }));

  return (
    <svg
      viewBox="0 0 100 50"
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="sparkleGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4E4BA" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="sparkleSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </linearGradient>
      </defs>
      {sparkles.map((s, i) => (
        <g key={i}>
          <path
            d={`M${s.cx} ${s.cy - s.size} L${s.cx + s.size * 0.3} ${s.cy} L${s.cx} ${s.cy + s.size} L${s.cx - s.size * 0.3} ${s.cy} Z`}
            fill={i % 2 === 0 ? "url(#sparkleGold)" : "url(#sparkleSilver)"}
            opacity={s.opacity}
          />
          <path
            d={`M${s.cx - s.size} ${s.cy} L${s.cx + s.size * 0.3} ${s.cy} L${s.cx + s.size} ${s.cy} L${s.cx} ${s.cy - s.size * 0.3} Z`}
            fill={i % 2 === 1 ? "url(#sparkleGold)" : "url(#sparkleSilver)"}
            opacity={s.opacity * 0.8}
          />
        </g>
      ))}
    </svg>
  );
}
