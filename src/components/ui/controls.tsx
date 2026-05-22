import type { ReactNode, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: "primary" | "success" | "warning" | "danger";
  className?: string;
}

const variantColors = {
  primary: "bg-gradient-to-r from-accent-purple to-physics",
  success: "bg-gradient-to-r from-green-500 to-emerald-600",
  warning: "bg-gradient-to-r from-yellow-500 to-orange-600",
  danger: "bg-gradient-to-r from-red-500 to-rose-600",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = "primary",
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-semibold text-gray-400">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-gray-800/50 border border-gray-700/30 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${variantColors[variant]}`}
        />
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-6 ${className || ""}`}>
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variantButtonStyles = {
  primary: "bg-gradient-to-r from-accent-purple to-physics hover:from-accent-purple/90 hover:to-physics/90 text-white border-0",
  secondary: "bg-gray-900/50 hover:bg-gray-900 border border-gray-700 text-gray-300 hover:text-white",
  danger: "bg-red-900/30 hover:bg-red-900/50 border border-red-700/30 text-red-400 hover:text-red-300",
  ghost: "bg-transparent hover:bg-gray-900/30 border border-gray-600/30 text-gray-300 hover:text-white",
};

const sizeButtonStyles = {
  sm: "text-xs px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2 rounded-lg",
  lg: "text-base px-6 py-3 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`font-semibold transition-all ${variantButtonStyles[variant]} ${sizeButtonStyles[size]} disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      {...(props as any)}
    >
      {loading ? "Loading..." : children}
    </motion.button>
  );
}

export default { ProgressBar, SectionHeader, Button };
