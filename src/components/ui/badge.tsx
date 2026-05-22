import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-gray-900/50 border-gray-600/30 text-gray-300",
  success: "bg-green-900/30 border-green-600/30 text-green-300",
  warning: "bg-yellow-900/30 border-yellow-600/30 text-yellow-300",
  danger: "bg-red-900/30 border-red-600/30 text-red-300",
  info: "bg-blue-900/30 border-blue-600/30 text-blue-300",
};

const sizeStyles = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

export function Badge({
  label,
  variant = "default",
  size = "md",
  icon,
  className,
}: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border font-medium transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </div>
  );
}

interface StreakDisplayProps {
  current: number;
  longest: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakDisplay({
  current,
  longest,
  size = "md",
  className,
}: StreakDisplayProps) {
  const sizeClasses = {
    sm: "w-16 h-16 text-sm",
    md: "w-24 h-24 text-base",
    lg: "w-32 h-32 text-lg",
  };

  return (
    <div className={`flex gap-4 ${className || ""}`}>
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`flex flex-col items-center justify-center rounded-xl border border-orange-600/30 bg-orange-900/20 ${sizeClasses[size]}`}
      >
        <Flame className="text-orange-400 mb-1" size={24} />
        <span className="font-bold text-orange-300">{current}</span>
        <span className="text-xs text-gray-400">Current</span>
      </motion.div>

      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-gray-600/20 bg-gray-900/30 ${sizeClasses[size]}`}
      >
        <Zap className="text-gray-400 mb-1" size={24} />
        <span className="font-bold text-gray-300">{longest}</span>
        <span className="text-xs text-gray-500">Best</span>
      </div>
    </div>
  );
}

export default Badge;
