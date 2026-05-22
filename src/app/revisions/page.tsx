"use client";

import { WorkspaceLayout } from "@/components/workspace-layout";
import { useMistakeStore } from "@/store/use-mistake-store";
import { useStudyStore } from "@/store/use-study-store";
import {
  CalendarRange,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  BookOpen,
} from "lucide-react";

export default function RevisionPlanPage() {
  const { mistakes, reviseMistake } = useMistakeStore();
  const { addXp } = useStudyStore();

  const now = new Date();
  
  // Revisions due today or overdue
  const dueRevisions = mistakes.filter((m) => new Date(m.nextRevisionAt) <= now);
  
  // Revisions coming up (scheduled in the future)
  const upcomingRevisions = mistakes.filter((m) => new Date(m.nextRevisionAt) > now);

  const handleRevise = (id: string) => {
    reviseMistake(id);
    addXp(100);
    alert("Mistake revision completed successfully! +100 XP.");
  };

  // Generate date markers for the next 7 days for the calendar widget
  const getNext7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() + i);
      
      // Count revisions due on this specific day
      const count = mistakes.filter((m) => {
        const revDate = new Date(m.nextRevisionAt);
        return (
          revDate.getFullYear() === d.getFullYear() &&
          revDate.getMonth() === d.getMonth() &&
          revDate.getDate() === d.getDate()
        );
      }).length;

      return {
        date: d,
        count: count,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: d.getDate(),
      };
    });
  };

  const next7Days = getNext7Days();

  return (
    <WorkspaceLayout title="Smart Revision Plan">
      {/* Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total due card */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Due Revisions</span>
            <span className="text-3xl font-black text-white">{dueRevisions.length}</span>
            <p className="text-[10px] text-gray-500">Need attention today</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Upcoming card */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Scheduled Ahead</span>
            <span className="text-3xl font-black text-white">{upcomingRevisions.length}</span>
            <p className="text-[10px] text-gray-500">In spaced cycles</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-physics/10 border border-physics/20 flex items-center justify-center text-physics">
            <CalendarRange className="w-6 h-6" />
          </div>
        </div>

        {/* Streaks card */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Revision Streak</span>
            <span className="text-3xl font-black text-white">5 Days</span>
            <p className="text-[10px] text-gray-500">Consecutive revisions completed</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
            <Flame className="w-6 h-6 fill-orange-500/10" />
          </div>
        </div>
      </div>

      {/* Main Grid: Due list and Calendar agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Due items section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-400" /> Due Today
          </h2>

          <div className="space-y-4">
            {dueRevisions.length === 0 ? (
              <div className="glass-panel p-12 rounded-xl text-center text-xs text-gray-400">
                Excellent! All revisions are completed. No items are due for today.
              </div>
            ) : (
              dueRevisions.map((m) => (
                <div
                  key={m.id}
                  className="glass-panel p-5 rounded-xl border border-card-border hover:border-card-hover-border transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-accent-purple/20 border border-accent-purple/30 text-accent-purple uppercase">
                        {m.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-card-border text-gray-300">
                        {m.chapter}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      Revision cycle: Stage {m.timesRevised}
                    </span>
                  </div>

                  <p className="text-xs text-white font-medium mb-3">
                    {m.description}
                  </p>

                  <div className="p-3 bg-white/2 rounded-lg border border-card-border text-xs text-gray-400 mb-4">
                    <span className="text-[10px] font-bold text-accent-purple block mb-1">Method:</span>
                    {m.explanation}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-card-border">
                    <span className="text-[10px] text-red-400 font-bold">
                      OVERDUE FOR REVISION
                    </span>
                    <button
                      onClick={() => handleRevise(m.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-accent-purple hover:bg-[#7c4ce6] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Revise Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar and scheduling guidelines */}
        <div className="space-y-6">
          {/* 7-day schedule summary */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-purple" /> Upcoming Calendar
            </h3>
            
            <div className="grid grid-cols-7 gap-2.5 text-center">
              {next7Days.map((day, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    day.count > 0
                      ? "bg-accent-purple/10 border-accent-purple text-white font-bold"
                      : "bg-white/2 border-card-border text-gray-400"
                  }`}
                >
                  <span className="text-[9px] block uppercase text-gray-500">{day.dayName}</span>
                  <span className="text-sm font-black block mt-0.5">{day.dayNum}</span>
                  {day.count > 0 && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-purple mt-1" />
                  )}
                </div>
              ))}
            </div>

            <p className="text-[10px] text-gray-500 leading-relaxed pt-2 border-t border-card-border">
              Revisions are spaced automatically. The system distributes them to prevent cognitive fatigue. Try to review on the exact day.
            </p>
          </div>

          {/* Logic Details */}
          <div className="glass-panel p-5 rounded-xl space-y-3.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-400" /> Spacing Intervals
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              FocusForge models memory retention using five customized review stages:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-card-border/50 pb-1.5">
                <span className="text-gray-400">Stage 1 (Next Day)</span>
                <span className="text-white font-bold">1 Day</span>
              </div>
              <div className="flex items-center justify-between border-b border-card-border/50 pb-1.5">
                <span className="text-gray-400">Stage 2 (Consolidation)</span>
                <span className="text-white font-bold">3 Days</span>
              </div>
              <div className="flex items-center justify-between border-b border-card-border/50 pb-1.5">
                <span className="text-gray-400">Stage 3 (Core memory)</span>
                <span className="text-white font-bold">7 Days</span>
              </div>
              <div className="flex items-center justify-between border-b border-card-border/50 pb-1.5">
                <span className="text-gray-400">Stage 4 (Deep recall)</span>
                <span className="text-white font-bold">15 Days</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-gray-400">Stage 5 (Long-term lock)</span>
                <span className="text-white font-bold">30 Days</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
