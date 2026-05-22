import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "dark" | "accent";
  onClick?: () => void;
  hover?: boolean;
}

const variantStyles = {
  glass: "bg-gradient-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-md",
  dark: "bg-gray-900/30 border border-gray-800/50",
  accent: "bg-gradient-to-br from-accent-purple/10 to-physics/10 border border-accent-purple/20",
};

export function Card({
  children,
  className,
  variant = "glass",
  onClick,
  hover = true,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`rounded-xl p-4 transition-all ${variantStyles[variant]} ${
        onClick || hover ? "cursor-pointer" : ""
      } ${className || ""}`}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className || ""}`}>
      <div className="flex items-start gap-3 flex-1">
        {icon && <div className="text-accent-purple mt-1">{icon}</div>}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={`space-y-3 ${className || ""}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={`flex items-center gap-2 pt-4 border-t border-gray-800/50 mt-4 ${className || ""}`}>
      {children}
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className || ""}`}
    >
      {icon && <div className="text-gray-600 mb-4 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-400 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-xs">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

export default { Card, CardHeader, CardBody, CardFooter, EmptyState };
