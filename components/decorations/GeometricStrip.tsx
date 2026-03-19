"use client";

interface GeometricStripProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function GeometricStrip({
  className = "",
  orientation = "horizontal",
}: GeometricStripProps) {
  const vb = orientation === "horizontal" ? "0 0 200 20" : "0 0 20 200";
  return (
    <svg
      viewBox={vb}
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="stripGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      {orientation === "horizontal" ? (
        <>
          {[0, 25, 50, 75, 100, 125, 150, 175].map((x, i) => (
            <polygon
              key={i}
              points={`${x},10 ${x + 8},2 ${x + 16},10 ${x + 8},18`}
              fill="url(#stripGradient)"
              opacity={0.8 - i * 0.05}
            />
          ))}
        </>
      ) : (
        <>
          {[0, 25, 50, 75, 100, 125, 150, 175].map((y, i) => (
            <polygon
              key={i}
              points={`10,${y} 2,${y + 8} 10,${y + 16} 18,${y + 8}`}
              fill="url(#stripGradient)"
              opacity={0.8 - i * 0.05}
            />
          ))}
        </>
      )}
    </svg>
  );
}
