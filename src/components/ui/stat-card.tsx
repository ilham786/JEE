import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  variant?: "primary" | "secondary" | "accent";
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  primary: "from-accent-purple/20 to-accent-purple/5 border-accent-purple/30",
  secondary: "from-physics/20 to-physics/5 border-physics/30",
  accent: "from-chemistry/20 to-chemistry/5 border-chemistry/30",
};

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  variant = "primary",
  onClick,
  className,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${variantStyles[variant]} ${className || ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        {icon && <div className="text-accent-purple">{icon}</div>}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <div className="text-3xl font-bold text-white mb-1">
            {value}
          </div>
          {unit && <span className="text-xs text-gray-500">{unit}</span>}
        </div>
        {trend && trendValue && (
          <div
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend === "up"
                ? "bg-green-500/20 text-green-400"
                : trend === "down"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;
