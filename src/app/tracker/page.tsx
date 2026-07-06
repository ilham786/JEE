"use client";

import { useEffect, useState } from "react";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { useStudyStore } from "@/store/use-study-store";
import {
  TrendingDown,
  Clock,
  Compass,
  AlertTriangle,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DistractionTrackerPage() {
  const { simulatedDistractions, blockedWebsites } = useStudyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock aggregated stats
  const totalWastedMinutes = simulatedDistractions.reduce((acc, curr) => acc + curr.durationMinutes, 8);
  const totalProductiveMinutes = 348; // ~5.8h
  const focusEfficiency = Math.round((totalProductiveMinutes / (totalProductiveMinutes + totalWastedMinutes)) * 100);

  // Distraction versus Productive daily data
  const compareData = [
    { day: "Fri", Productive: 270, Wasted: 30 },
    { day: "Sat", Productive: 360, Wasted: 45 },
    { day: "Sun", Productive: 210, Wasted: 15 },
    { day: "Mon", Productive: 432, Wasted: 25 },
    { day: "Tue", Productive: 348, Wasted: 20 },
    { day: "Wed", Productive: 480, Wasted: 10 },
    { day: "Thu", Productive: totalProductiveMinutes, Wasted: totalWastedMinutes },
  ];

  // Distraction domains split data
  const domainsSplit = [
    { name: "youtube.com", value: 45, color: "#ef4444" },
    { name: "instagram.com", value: 30, color: "#ec4899" },
    { name: "reddit.com", value: 15, color: "#f97316" },
    { name: "Others", value: 10, color: "#6b7280" },
  ];

  return (
    <WorkspaceLayout title="Distraction Logs">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Wasted time card */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Wasted Time</span>
            <span className="text-2xl font-black text-red-400">{totalWastedMinutes} min</span>
            <p className="text-[10px] text-gray-500">Logged during study zones today</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Productive time card */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Productive Time</span>
            <span className="text-2xl font-black text-green-400">{totalProductiveMinutes} min</span>
            <p className="text-[10px] text-gray-500">Deep study hours accumulated</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <Zap className="w-6 h-6 fill-green-500/10" />
          </div>
        </div>

        {/* Focus Efficiency card */}
        <div className="glass-panel p-5 rounded-xl border border-card-border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Focus Efficiency</span>
            <span className="text-2xl font-black text-white">{focusEfficiency}%</span>
            <p className="text-[10px] text-gray-500">Ratio of productive to wasted time</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productive vs Wasted Bar chart */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Efficiency Split</h2>
            <p className="text-xs text-gray-400">Comparing productive minutes vs. distraction minutes weekly</p>
          </div>

          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={compareData} margin={{ top: 10, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#11141d", borderColor: "rgba(255,255,255,0.06)", borderRadius: 8 }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Productive" fill="#10b981" radius={[4, 4, 0, 0]} name="Productive (Min)" />
                  <Bar dataKey="Wasted" fill="#ef4444" radius={[4, 4, 0, 0]} name="Wasted (Min)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 w-full rounded-2xl bg-[#11141d]" />
            )}
          </div>
        </div>

        {/* Top Distractions Donut */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Top Distractions</h2>
            <p className="text-xs text-gray-400">Sources of focus leakages</p>
          </div>

          <div className="h-44 flex items-center justify-center relative">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={domainsSplit}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                  {domainsSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-44 w-full rounded-2xl bg-[#11141d]" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Wasted Today</span>
              <span className="text-xl font-black text-white">{totalWastedMinutes}m</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {domainsSplit.map((d) => (
              <div key={d.name} className="flex justify-between items-center px-2 py-1 rounded bg-white/2 border border-card-border">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distraction Logs Timeline */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-1.5">
          <AlertTriangle className="w-5 h-5 text-orange-400" /> Distraction Incident Timeline
        </h2>

        <div className="space-y-3">
          {simulatedDistractions.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No distraction logs registered today. Excellent discipline!</p>
          ) : (
            simulatedDistractions.map((log) => (
              <div key={log.id} className="p-3.5 rounded-lg border border-card-border bg-[#11141d]/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Access Attempt: {log.domain}</p>
                    <p className="text-[10px] text-gray-500">Timestamp: {new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 font-bold border border-red-500/20 text-[10px]">
                    -{log.durationMinutes}m focus score penalty
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
