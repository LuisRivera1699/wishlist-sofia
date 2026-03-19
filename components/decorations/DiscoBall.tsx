"use client";

interface DiscoBallProps {
  className?: string;
  size?: number;
}

export function DiscoBall({ className = "", size = 80 }: DiscoBallProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      width={size}
      height={size * 1.2}
      aria-hidden
    >
      {/* Base sphere with facet grid */}
      <defs>
        <linearGradient id="discoBallGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4E4BA" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="discoBallSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#A8A8A8" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="55" rx="45" ry="45" fill="url(#discoBallGold)" />
      {/* Facet pattern - simplified squares */}
      {[20, 35, 50, 65, 80].map((y, i) =>
        [25, 40, 50, 60, 75].map((x, j) => (
          <rect
            key={`${i}-${j}`}
            x={x - 4}
            y={y - 4}
            width={8}
            height={8}
            fill={(i + j) % 2 === 0 ? "url(#discoBallSilver)" : "url(#discoBallGold)"}
            opacity={0.6 - (i * 0.08 + j * 0.02)}
          />
        ))
      )}
      {/* Mount */}
      <rect x="47" y="95" width="6" height="20" fill="#D4AF37" rx="2" />
      <ellipse cx="50" cy="95" rx="8" ry="4" fill="#D4AF37" />
    </svg>
  );
}
