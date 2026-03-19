"use client";

interface StarBurstProps {
  className?: string;
  rays?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export function StarBurst({
  className = "",
  rays = 12,
  innerRadius = 20,
  outerRadius = 60,
}: StarBurstProps) {
  const cx = 50;
  const cy = 50;
  const points: string[] = [];

  for (let i = 0; i < rays * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / rays - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  const pathD = `M ${points.join(" L ")} Z`;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="starBurstGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4E4BA" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="url(#starBurstGold)"
        opacity={0.25}
      />
    </svg>
  );
}
