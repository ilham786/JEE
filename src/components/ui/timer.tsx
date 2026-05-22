import { useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";

interface TimerProps {
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function Timer({
  size = "md",
  showControls = true,
  onComplete,
  className,
}: TimerProps) {
  const { timeLeft, status, pauseSession, resumeSession, cancelSession } = useStudyStore();

  const { minutes, seconds } = useMemo(() => {
    return {
      minutes: Math.floor(timeLeft / 60),
      seconds: timeLeft % 60,
    };
  }, [timeLeft]);

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const sizeClasses = {
    sm: "text-2xl h-20 w-20",
    md: "text-5xl h-32 w-32",
    lg: "text-7xl h-48 w-48",
  };

  const containerClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const buttonSizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const isActive = status !== "idle";
  const isFocusing = status === "focus";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div
        animate={{
          scale: isActive ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: isActive ? 1.5 : 0.2,
          repeat: isActive ? Infinity : 0,
        }}
        className={`flex items-center justify-center rounded-full border-2 font-mono font-bold tabular-nums
          ${
            isFocusing
              ? "border-accent-purple text-accent-purple bg-accent-purple/5"
              : "border-gray-600 text-gray-300 bg-gray-900/20"
          }
          transition-all duration-300 ${sizeClasses[size]}`}
      >
        {formattedTime}
      </motion.div>

      {showControls && (
        <div className={`flex items-center justify-center ${containerClasses[size]} mt-6`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={isActive ? pauseSession : resumeSession}
            className={`flex items-center justify-center rounded-lg border border-gray-600/50 bg-gray-900/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all ${buttonSizes[size]}`}
          >
            {isActive ? (
              <Pause className="fill-current" />
            ) : (
              <Play className="fill-current" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={cancelSession}
            className={`flex items-center justify-center rounded-lg border border-red-600/30 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-all ${buttonSizes[size]}`}
          >
            <RotateCcw />
          </motion.button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
        className="mt-4 text-xs font-semibold text-accent-purple uppercase tracking-wider"
      >
        {isFocusing ? "🔥 Focus Mode Active" : status === "break" ? "☕ Break Time" : "Ready to Focus"}
      </motion.div>
    </div>
  );
}

export default Timer;
