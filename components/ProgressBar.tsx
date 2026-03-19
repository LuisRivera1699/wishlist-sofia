"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  totalCost: number;
  totalRaised: number;
  className?: string;
}

export function ProgressBar({
  totalCost,
  totalRaised,
  className = "",
}: ProgressBarProps) {
  const percentage = totalCost > 0 ? Math.min(100, (totalRaised / totalCost) * 100) : 0;

  return (
    <div className={className}>
      <div className="flex justify-between text-sm font-body text-disco-silver mb-1">
        <span>
          S/ {totalRaised.toLocaleString("es-PE")} de S/{" "}
          {totalCost.toLocaleString("es-PE")}
        </span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-disco-silverDark rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-disco-gold to-disco-goldLight rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
