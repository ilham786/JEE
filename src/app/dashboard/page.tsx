"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { useStudyStore } from "@/store/use-study-store";
import { useMistakeStore } from "@/store/use-mistake-store";
import {
  Timer,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Sparkles,
  Play,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const { xp, level, currentStreak, status, activeSession, blockedWebsites } = useStudyStore();
  const { mistakes, syllabus } = useMistakeStore();

  // Mock study stats
  const todayStudyHours = 5.8;
  const targetStudyHours = 8.0;
  const focusScore = 92;
  const totalFocusSessions = 42;

  // Study trend data (past 7 days)
  const studyData = [
    { day: "Fri", Hours: 4.5, Focus: 85 },
    { day: "Sat", Hours: 6.0, Focus: 90 },
    { day: "Sun", Hours: 3.5, Focus: 88 },
    { day: "Mon", Hours: 7.2, Focus: 94 },
    { day: "Tue", Hours: 5.8, Focus: 92 },
    { day: "Wed", Hours: 8.0, Focus: 96 },
    { day: "Thu", Hours: todayStudyHours, Focus: focusScore },
  ];

  // Subject split data
  const subjectData = [
    { name: "Physics", value: 35, color: "#3b82f6" },
    { name: "Chemistry", value: 25, color: "#10b981" },
    { name: "Maths", value: 40, color: "#f59e0b" },
  ];

  // Simulated 30-day heatmap grid data
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const hours = i === 29 ? todayStudyHours : Math.random() * 9;
    return {
      day: i + 1,
      hours: hours,
      intensity: hours > 8 ? 4 : hours > 6 ? 3 : hours > 3 ? 2 : hours > 1 ? 1 : 0,
    };
  });

  // Calculate syllabus completion percentage
  const calcTotalCompletion = () => {
    let total = 0;
    let count = 0;
    Object.values(syllabus).forEach((subjects) => {
      subjects.forEach((chap) => {
        total += chap.completion;
        count++;
      });
    });
    return Math.round(total / count);
  };

  const totalSyllabusComplete = calcTotalCompletion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WorkspaceLayout title="Productivity Dashboard">
      {/* Top Banner / Session Alert */}
      {status === "focus" && activeSession && (
        <div className="p-4 rounded-xl border border-accent-purple/30 bg-accent-purple/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-ping" />
            <div>
              <p className="text-sm font-semibold text-white">Active Session: {activeSession.subject} ({activeSession.chapter})</p>
              <p className="text-xs text-gray-400">Deep Work in progress. Stay in the zone.</p>
            </div>
          </div>
          <Link href="/study">
            <button className="px-3.5 py-1.5 rounded-lg bg-accent-purple hover:bg-[#7c4ce6] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <Timer className="w-3.5 h-3.5" />
              Open Timer
            </button>
          </Link>
        </div>
      )}

      {/* Core KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Today's Study</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{todayStudyHours}h</span>
              <span className="text-xs text-gray-400">/ {targetStudyHours}h target</span>
            </div>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-physics"
                style={{ width: `${(todayStudyHours / targetStudyHours) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-physics/10 border border-physics/20 flex items-center justify-center text-physics shrink-0">
            <Timer className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Focus Score</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{focusScore}%</span>
              <span className="text-xs text-green-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +2% vs yesterday
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Based on distraction logs</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-chemistry/10 border border-chemistry/20 flex items-center justify-center text-chemistry shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Daily Streak</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{currentStreak} Days</span>
              <span className="text-xs text-orange-500">Record: 21d</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Keep studying to grow the fire</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-6 h-6 fill-orange-500/10" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">XP Level</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">Level {level}</span>
              <span className="text-xs text-gray-400">{xp} XP total</span>
            </div>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-accent-purple"
                style={{ width: `${(xp % 1000) / 10}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Analytical trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line/Area Chart */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Study Sessions Trend</h2>
              <p className="text-xs text-gray-400">Total deep work hours logged over the past week</p>
            </div>
            <span className="text-xs bg-white/5 border border-card-border px-2.5 py-1 rounded-lg text-gray-300">
              Weekly view
            </span>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={3}>
                <AreaChart data={studyData}>
                  <defs>
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#11141d", borderColor: "rgba(255,255,255,0.06)", borderRadius: 8 }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="Hours" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#hoursGrad)" name="Hours" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 w-full rounded-2xl bg-[#11141d]" />
            )}
          </div>
        </div>

        {/* Donut Chart: Subject Break down */}
        <div className="glass-panel p-6 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Subject Breakdown</h2>
            <p className="text-xs text-gray-400">Relative allocation of study time</p>
          </div>

          <div className="h-44 flex items-center justify-center relative">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={1}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 w-full rounded-2xl bg-[#11141d]" />
            )}
            <div className="absolute text-center">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">Today</span>
              <span className="text-2xl font-black text-white">{todayStudyHours}h</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {subjectData.map((sub) => (
              <div key={sub.name} className="p-2 rounded bg-white/2 border border-card-border">
                <span className="block font-bold text-white">{sub.value}%</span>
                <span className="text-[10px] text-gray-400" style={{ color: sub.color }}>
                  {sub.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap & Syllabi & Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Obsidian-Style Study Heatmap */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Consistency Grid</h2>
            <p className="text-xs text-gray-400">Daily study density mapping for the past 30 days</p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="grid grid-cols-10 gap-2 shrink-0">
              {heatmapDays.map((day) => (
                <div
                  key={day.day}
                  className={`w-6 h-6 rounded-md transition-colors relative group border border-black/10 ${
                    day.intensity === 4
                      ? "bg-accent-purple"
                      : day.intensity === 3
                      ? "bg-accent-purple/75"
                      : day.intensity === 2
                      ? "bg-accent-purple/50"
                      : day.intensity === 1
                      ? "bg-accent-purple/20"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {/* Tooltip */}
                  <span className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 bg-[#11141d] border border-card-border text-[9px] px-1.5 py-0.5 rounded text-white whitespace-nowrap">
                    Day {day.day}: {day.hours.toFixed(1)}h
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex-1 min-w-[200px] border-l border-card-border pl-6 py-2 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Monthly Target Completed</span>
                <span className="text-white font-bold">78%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent-purple" style={{ width: "78%" }} />
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Looking solid! You have maintained an average of 6.2 hours per day this month. The projected syllabus completion is ahead by 4 days.
              </p>
            </div>
          </div>
        </div>

        {/* Gamification & Syllabus Card */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Award className="w-5 h-5 text-accent-purple" /> Active Challenge
          </h2>

          <div className="p-3.5 rounded-lg border border-accent-purple/20 bg-accent-purple/5 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-white">Monk Warrior Challenge</span>
              <span className="text-accent-purple font-semibold">+400 XP</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              Complete two 90-minute Deep Work sessions without trigger log violations today.
            </p>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Progress: 1 / 2 sessions</span>
              <span>12h remaining</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent-purple" style={{ width: "50%" }} />
            </div>
          </div>

          <div className="pt-2 space-y-2 border-t border-card-border">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-physics" /> Total Syllabus</span>
              <span className="text-white font-bold">{totalSyllabusComplete}%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4 text-red-400" /> Overdue Mistakes</span>
              <span className="text-red-400 font-bold">{mistakes.filter(m => new Date(m.nextRevisionAt) <= new Date()).length} due</span>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
