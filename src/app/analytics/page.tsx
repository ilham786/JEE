"use client";

import { useEffect, useState } from "react";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { useMistakeStore } from "@/store/use-mistake-store";
import {
  TrendingUp,
  BarChart,
  PieChart as PieIcon,
  Flame,
  Award,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  const { mistakes, syllabus } = useMistakeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Aggregate completion averages per subject
  const getSubjectAverages = () => {
    return Object.entries(syllabus).map(([subject, chapters]) => {
      const total = chapters.reduce((acc, curr) => acc + curr.completion, 0);
      const count = chapters.length;
      return {
        subject,
        completion: count > 0 ? Math.round(total / count) : 0,
        pyqCount: chapters.reduce((acc, curr) => acc + curr.pyqsSolved, 0),
      };
    });
  };

  const subjectAverages = getSubjectAverages();

  // 1. daily hours data
  const trendData = [
    { date: "May 16", Hours: 4.5, Efficiency: 85 },
    { date: "May 17", Hours: 6.0, Efficiency: 90 },
    { date: "May 18", Hours: 3.5, Efficiency: 88 },
    { date: "May 19", Hours: 7.2, Efficiency: 94 },
    { date: "May 20", Hours: 5.8, Efficiency: 92 },
    { date: "May 21", Hours: 8.0, Efficiency: 96 },
    { date: "May 22", Hours: 5.8, Efficiency: 92 },
  ];

  // 2. error distribution split
  const errorData = [
    { name: "Calculation Errors", value: mistakes.filter(m => m.errorType === "Calculation Error").length, color: "#3b82f6" },
    { name: "Conceptual Gaps", value: mistakes.filter(m => m.errorType === "Conceptual Gap").length, color: "#10b981" },
    { name: "Silly Mistakes", value: mistakes.filter(m => m.errorType === "Silly Mistake").length, color: "#f59e0b" },
    { name: "Time Pressure", value: mistakes.filter(m => m.errorType === "Time Pressure").length, color: "#ef4444" },
  ];

  // 3. subject averages comparative data
  const compareChartData = subjectAverages.map((avg) => ({
    name: avg.subject,
    "Completion %": avg.completion,
    "PYQs Solved": avg.pyqCount,
  }));

  // Identify strongest and weakest subjects based on average syllabus completion
  const sortedByCompletion = [...subjectAverages].sort((a, b) => b.completion - a.completion);
  const strongestSubject = sortedByCompletion[0]?.subject || "N/A";
  const weakestSubject = sortedByCompletion[sortedByCompletion.length - 1]?.subject || "N/A";

  return (
    <WorkspaceLayout title="Analytics & Trends">
      {/* Metric Indicators Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Consistency metric */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Consistency Score</span>
            <span className="text-2xl font-black text-white">94 / 100</span>
            <p className="text-[10px] text-gray-500">Exceptional study habits</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Strongest Subject */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Strongest Subject</span>
            <span className="text-2xl font-black text-green-400">{strongestSubject}</span>
            <p className="text-[10px] text-gray-500">Highest syllabus progress</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Weakest Subject */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Weakest Focus</span>
            <span className="text-2xl font-black text-orange-400">{weakestSubject}</span>
            <p className="text-[10px] text-gray-500">Requires review sprints</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Forecast syllabus completion */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Projected Completion</span>
            <span className="text-2xl font-black text-white">48 Days</span>
            <p className="text-[10px] text-gray-500">Before target schedule</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-physics/10 border border-physics/20 flex items-center justify-center text-physics shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area chart */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-accent-purple" /> Daily Study Trend
            </h2>
            <p className="text-xs text-gray-400">Total deep work hours logged over the past 7 days</p>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={3}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="hoursG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#11141d", borderColor: "rgba(255,255,255,0.06)", borderRadius: 8 }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="Hours" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#hoursG)" name="Study Hours" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 w-full rounded-2xl bg-[#11141d]" />
            )}
          </div>
        </div>

        {/* Subject progress bar charts */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <BarChart className="w-4 h-4 text-accent-purple" /> Subject Comparison
            </h2>
            <p className="text-xs text-gray-400">Average syllabus completion & PYQs solved</p>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={3}>
                <RechartsBarChart data={compareChartData}>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#11141d", borderColor: "rgba(255,255,255,0.06)", borderRadius: 8 }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Completion %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="PYQs Solved" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 w-full rounded-2xl bg-[#11141d]" />
            )}
          </div>
        </div>
      </div>

      {/* Errors breakdown pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie chart */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between space-y-4 lg:col-span-1">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-accent-purple" /> Error Classifications
            </h2>
            <p className="text-xs text-gray-400">Frequency breakdown of error types logged</p>
          </div>

          <div className="h-44 flex items-center justify-center relative">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={1}>
                <PieChart>
                  <Pie
                    data={errorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                  {errorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-44 w-full rounded-2xl bg-[#11141d]" />
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            {errorData.map((d) => (
              <div key={d.name} className="flex justify-between items-center px-2.5 py-1.5 rounded bg-white/2 border border-card-border">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold text-white">{d.value} logged</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed reports summary */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Syllabus Completion Projected Forecast</h2>
            <p className="text-xs text-gray-400">Heuristics-based diagnostic report</p>
          </div>

          <div className="space-y-3.5 text-xs leading-normal">
            <div className="p-3 bg-[#11141d]/50 border border-card-border rounded-lg">
              <span className="text-green-400 font-bold block mb-1">Strongest: {strongestSubject}</span>
              Physics & Maths chapters have the highest completion metrics. Electrostatics and Trigonometry are completely mapped with an average completion of 88% and high solved PYQ count. Keep using these subjects to balance your daily study streaks.
            </div>

            <div className="p-3 bg-[#11141d]/50 border border-card-border rounded-lg">
              <span className="text-orange-400 font-bold block mb-1">Weakest Focus: {weakestSubject}</span>
              Calculus and Chemistry organic halides have the lowest completeness scores. Focus on Organic Halides next; schedule a dedicated 90-minute Deep Work session to watch lectures on SN1 vs SN2 reaction mechanisms.
            </div>

            <p className="text-[10px] text-gray-500">
              FocusForge analyzes your study consistency weights daily. Ensure you keep logged details in sync for optimum forecasts.
            </p>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
