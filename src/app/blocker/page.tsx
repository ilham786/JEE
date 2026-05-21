"use client";

import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { useStudyStore } from "@/store/use-study-store";
import {
  Globe,
  Plus,
  Trash2,
  Lock,
  Unlock,
  ShieldAlert,
  Clock,
} from "lucide-react";

export default function BlockerSettingsPage() {
  const {
    blockedWebsites,
    addBlockedWebsite,
    removeBlockedWebsite,
    whitelistOnly,
    setWhitelistOnly,
    examModeEnabled,
    setExamModeEnabled,
  } = useStudyStore();

  const [newDomain, setNewDomain] = useState("");
  const [scheduleSlots, setScheduleSlots] = useState([
    { id: "s1", start: "09:00", end: "14:00", days: "Mon-Sat", active: true },
    { id: "s2", start: "16:00", end: "21:00", days: "All Days", active: true },
  ]);

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    
    // Simple validation
    let domain = newDomain.trim().toLowerCase();
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, ""); // strip prefix
    
    addBlockedWebsite(domain);
    setNewDomain("");
    alert(`${domain} added to blacklist shield.`);
  };

  const handleRemove = (domain: string) => {
    removeBlockedWebsite(domain);
    alert(`${domain} removed from blacklist shield.`);
  };

  const toggleSchedule = (id: string) => {
    setScheduleSlots(
      scheduleSlots.map((s) => {
        if (s.id !== id) return s;
        return { ...s, active: !s.active };
      })
    );
  };

  return (
    <WorkspaceLayout title="Blocker Settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Shields & Toggles */}
        <div className="space-y-6">
          
          {/* Main Shield Controls */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-accent-purple" /> Blocker Shield Status
            </h3>
            
            <p className="text-xs text-gray-400 leading-normal">
              Toggle deep integration block structures. Simulated in browser, native execution targets available on Tauri build compile.
            </p>

            <div className="space-y-4 pt-2">
              {/* Whitelist mode */}
              <div className="flex items-start justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-white block">Whitelist-Only Mode</span>
                  <span className="text-[10px] text-gray-500 block leading-normal">
                    Restrict all web navigation except domains listed on the Allowed List.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={whitelistOnly}
                  onChange={(e) => setWhitelistOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-accent-purple bg-[#121620] border-card-border"
                />
              </div>

              {/* Exam mode */}
              <div className="flex items-start justify-between border-t border-card-border pt-3">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Exam Mode (Monk Lockdown)
                  </span>
                  <span className="text-[10px] text-gray-500 block leading-normal">
                    Locks focus timers completely. Emergency exit triggers a 5-minute cooling block. Forces strict Whitelist.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={examModeEnabled}
                  onChange={(e) => setExamModeEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-red-500 bg-[#121620] border-card-border"
                />
              </div>
            </div>
          </div>

          {/* Schedule Configurations */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent-purple" /> Blocker Schedules
            </h3>

            <div className="space-y-3">
              {scheduleSlots.map((s) => (
                <div
                  key={s.id}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-opacity ${
                    s.active ? "bg-white/2 border-card-border" : "bg-black/20 border-card-border/30 opacity-50"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white">
                      {s.start} - {s.end}
                    </span>
                    <span className="text-[10px] text-gray-400 block">{s.days}</span>
                  </div>

                  <button
                    onClick={() => toggleSchedule(s.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                      s.active
                        ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                        : "bg-white/5 text-gray-400 border border-card-border"
                    }`}
                  >
                    {s.active ? "Active" : "Disabled"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Blocked Websites Registry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent-purple" /> Blocked Domains Registry
            </h2>

            <form onSubmit={handleAddWebsite} className="flex gap-2">
              <input
                type="text"
                placeholder="E.g. instagram.com, facebook.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1 bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-purple"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-accent-purple hover:bg-[#7c4ce6] text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Shield Domain
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Blocked Sites ({blockedWebsites.length})</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {blockedWebsites.map((site) => (
                  <div
                    key={site}
                    className="p-3 bg-white/2 border border-card-border rounded-lg flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-300 font-mono">{site}</span>
                    <button
                      onClick={() => handleRemove(site)}
                      className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                      title={`Remove shield for ${site}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Whitelisted Allowed List */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Unlock className="w-5 h-5 text-green-400" /> Whitelisted Study Domains
            </h2>
            <p className="text-xs text-gray-400">
              Approved study links that bypass the blocker shields under Whitelist-Only and Exam Modes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {["khanacademy.org", "physicswallah.live", "unacademy.com", "nta.ac.in", "jeemain.nta.ac.in"].map((site) => (
                <div key={site} className="p-3 bg-white/2 border border-card-border rounded-lg text-green-400 font-mono flex items-center justify-between">
                  <span>{site}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 uppercase tracking-wider">
                    Core Study
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
