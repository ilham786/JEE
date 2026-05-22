"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudyStore } from "@/store/use-study-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Timer,
  BookOpen,
  History,
  GraduationCap,
  Globe,
  Bot,
  BarChart3,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { monkModeEnabled, xp, level, currentStreak } = useStudyStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Study Session", href: "/study", icon: Timer },
    { name: "Mistake Journal", href: "/mistakes", icon: BookOpen },
    { name: "Revision Plan", href: "/revisions", icon: History },
    { name: "JEE Tracker", href: "/jee", icon: GraduationCap },
    { name: "Distraction Logs", href: "/tracker", icon: TrendingDown },
    { name: "Web Blocker", href: "/blocker", icon: Globe },
    { name: "AI Coach", href: "/coach", icon: Bot },
    { name: "Full Analytics", href: "/analytics", icon: BarChart3 },
  ];

  // If Monk Mode is enabled, we hide everything except Study Timer and basic exits to reduce dopamine loops
  const filteredMenuItems = monkModeEnabled
    ? menuItems.filter((item) => ["Study Session", "Dashboard"].includes(item.name))
    : menuItems;

  return (
    <motion.div
      animate={{ width: isCollapsed ? "68px" : "240px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-screen border-r border-card-border bg-card-bg/60 backdrop-blur-md shrink-0"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-card-border">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold tracking-tight bg-gradient-to-r from-accent-purple to-physics bg-clip-text text-transparent flex items-center gap-2"
          >
            <Zap className="w-5 h-5 text-accent-purple fill-accent-purple/20" />
            FocusForge
          </motion.span>
        )}
        {isCollapsed && (
          <div className="mx-auto text-accent-purple">
            <Zap className="w-6 h-6 fill-accent-purple/20" />
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-5 flex items-center justify-center w-6 h-6 rounded-full border border-card-border bg-[#121620] text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Profile & Level Bar (Hidden in Monk Mode or simplified) */}
      <AnimatePresence>
        {!isCollapsed && !monkModeEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 border-b border-card-border bg-white/3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-purple to-physics flex items-center justify-center text-sm font-semibold text-white">
                AS
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">ILHAM FAROOQUE</p>
                <div className="flex items-center gap-1.5 text-xs text-physics">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/25" />
                  <span>{currentStreak} Day Streak</span>
                </div>
              </div>
            </div>
            
            {/* XP progress */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>LVL {level}</span>
                <span>{xp % 1000}/1000 XP</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-purple"
                  style={{ width: `${(xp % 1000) / 10}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? "text-white bg-white/8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/3"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-5 rounded-r bg-accent-purple"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-accent-purple" : "text-gray-400"}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Monk Mode Indicator Badge */}
      {!isCollapsed && monkModeEnabled && (
        <div className="m-4 p-3 rounded-lg border border-accent-purple/30 bg-accent-purple/5 text-center text-xs text-accent-purple font-medium flex items-center justify-center gap-1.5 pulse-glow-effect">
          <span className="w-2 h-2 rounded-full bg-accent-purple inline-block" />
          MONK MODE ENABLED
        </div>
      )}
    </motion.div>
  );
}
