"use client";

import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { useMistakeStore, MistakeEntry } from "@/store/use-mistake-store";
import { useStudyStore } from "@/store/use-study-store";
import {
  BookOpen,
  Search,
  PlusCircle,
  Calendar,
  RefreshCw,
  AlertOctagon,
  CheckSquare,
  BarChart,
  Tag,
} from "lucide-react";

export default function MistakeJournalPage() {
  const { mistakes, addMistake, reviseMistake } = useMistakeStore();
  const { addXp } = useStudyStore();

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedErrorType, setSelectedErrorType] = useState("");
  
  // Add mistake form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formSubject, setFormSubject] = useState("Physics");
  const [formChapter, setFormChapter] = useState("Electrostatics");
  const [formErrorType, setFormErrorType] = useState("Calculation Error");
  const [formDesc, setFormDesc] = useState("");
  const [formExpl, setFormExpl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");

  const errorTypes = ["Calculation Error", "Conceptual Gap", "Silly Mistake", "Time Pressure"];

  const handleCreateMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc || !formExpl) {
      alert("Please fill in description and explanation fields.");
      return;
    }

    addMistake({
      subject: formSubject,
      chapter: formChapter,
      errorType: formErrorType,
      description: formDesc,
      explanation: formExpl,
      screenshotUrl: screenshotUrl || null,
    });

    // Reward XP for logging a mistake (+50 XP)
    addXp(50);

    // Reset
    setFormDesc("");
    setFormExpl("");
    setScreenshotUrl("");
    setShowAddForm(false);
    alert("Mistake logged successfully! +50 XP rewarded.");
  };

  const handleRevise = (id: string) => {
    reviseMistake(id);
    addXp(100); // Reward 100 XP for revision completion!
    alert("Mistake revision logged. Spaced repetition interval updated. +100 XP rewarded!");
  };

  // Filter mistakes
  const filteredMistakes = mistakes.filter((m) => {
    const matchesSearch =
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject ? m.subject === selectedSubject : true;
    const matchesError = selectedErrorType ? m.errorType === selectedErrorType : true;

    return matchesSearch && matchesSubject && matchesError;
  });

  // Calculate error type frequencies for analytics
  const getErrorTypeCounts = () => {
    const counts: Record<string, number> = {};
    errorTypes.forEach((t) => (counts[t] = 0));
    mistakes.forEach((m) => {
      if (counts[m.errorType] !== undefined) {
        counts[m.errorType]++;
      } else {
        counts[m.errorType] = 1;
      }
    });
    return counts;
  };

  const errorCounts = getErrorTypeCounts();
  const totalMistakes = mistakes.length;

  return (
    <WorkspaceLayout title="Mistake Journal">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left column: Analytics and filter panel */}
        <div className="space-y-6 lg:col-span-1">
          {/* Add Mistake Toggle */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-3 rounded-lg bg-accent-purple hover:bg-[#7c4ce6] text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-accent-purple/20"
          >
            <PlusCircle className="w-4 h-4" />
            LOG NEW MISTAKE
          </button>

          {/* Filters Card */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Search & Filter</h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search mistakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121620] border border-card-border rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-accent-purple"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-medium">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-[#121620] border border-card-border rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Maths">Maths</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-medium">Error Type</label>
              <select
                value={selectedErrorType}
                onChange={(e) => setSelectedErrorType(e.target.value)}
                className="w-full bg-[#121620] border border-card-border rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="">All Error Types</option>
                {errorTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mistake Analytics Card */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart className="w-4 h-4 text-accent-purple" /> Error Analytics
            </h3>

            <div className="space-y-3">
              {errorTypes.map((type) => {
                const count = errorCounts[type] || 0;
                const percentage = totalMistakes > 0 ? (count / totalMistakes) * 100 : 0;
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>{type}</span>
                      <span className="font-semibold text-white">{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-purple"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Log list or Add form */}
        <div className="lg:col-span-3 space-y-6">
          {showAddForm ? (
            /* Add Mistake Form */
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-card-border">
                <h2 className="text-base font-bold text-white">Log Incorrect Question</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateMistake} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Subject</label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Maths">Maths</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Chapter</label>
                    <input
                      type="text"
                      value={formChapter}
                      onChange={(e) => setFormChapter(e.target.value)}
                      placeholder="e.g. Electrostatics"
                      className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400">Error Classification</label>
                    <select
                      value={formErrorType}
                      onChange={(e) => setFormErrorType(e.target.value)}
                      className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      {errorTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400">Description of Mistake (What did you do?)</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="E.g. I did not evaluate the integration limits correctly for the magnetic flux. Thought it was symmetrical."
                    className="w-full bg-[#121620] border border-card-border rounded-lg p-3 text-xs text-white focus:outline-none focus:border-accent-purple"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400">Correct Concepts & Explanation (How to solve correctly?)</label>
                  <textarea
                    rows={3}
                    value={formExpl}
                    onChange={(e) => setFormExpl(e.target.value)}
                    placeholder="E.g. Due to boundary constraints, flux is only non-zero between -R and +R. Use Ampere's loop bounding inside the shell."
                    className="w-full bg-[#121620] border border-card-border rounded-lg p-3 text-xs text-white focus:outline-none focus:border-accent-purple"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400">Mock Screenshot URL / File Reference (Optional)</label>
                  <input
                    type="text"
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    placeholder="e.g. test_3_physics_q12.png"
                    className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-accent-purple hover:bg-[#7c4ce6] text-white font-semibold text-xs tracking-wider"
                >
                  SAVE & SCHEDULE SPACING CYCLE
                </button>
              </form>
            </div>
          ) : (
            /* Mistake Log List */
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-gray-400">
                  Showing {filteredMistakes.length} mistakes
                </h2>
              </div>

              {filteredMistakes.length === 0 ? (
                <div className="glass-panel p-12 rounded-xl text-center text-gray-400 text-xs">
                  No mistakes matches the filter conditions. Start logging to build your journal!
                </div>
              ) : (
                filteredMistakes.map((mistake) => {
                  const isDue = new Date(mistake.nextRevisionAt) <= new Date();
                  
                  return (
                    <div
                      key={mistake.id}
                      className={`glass-panel p-5 rounded-xl border border-card-border transition-all hover:border-card-hover-border relative ${
                        isDue ? "border-l-4 border-l-red-500" : ""
                      }`}
                    >
                      {/* Badge tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            mistake.subject === "Physics"
                              ? "bg-physics/10 text-physics border border-physics/20"
                              : mistake.subject === "Chemistry"
                              ? "bg-chemistry/10 text-chemistry border border-chemistry/20"
                              : "bg-maths/10 text-maths border border-maths/20"
                          }`}
                        >
                          {mistake.subject}
                        </span>

                        <span className="px-2 py-0.5 rounded bg-white/5 border border-card-border text-gray-300 text-[10px]">
                          {mistake.chapter}
                        </span>

                        <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3" />
                          {mistake.errorType}
                        </span>

                        <span className="text-[10px] text-gray-500 ml-auto">
                          Cycle: {mistake.timesRevised} revisions
                        </span>
                      </div>

                      {/* Detail Body */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1 font-semibold">Problem description:</p>
                          <p className="text-sm font-medium text-white">{mistake.description}</p>
                        </div>

                        <div className="p-3.5 bg-white/2 rounded-lg border border-card-border">
                          <p className="text-xs text-accent-purple mb-1 font-bold">Correction & Logic:</p>
                          <p className="text-xs text-gray-300 leading-normal">{mistake.explanation}</p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-card-border">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Next Revision: {isDue ? (
                              <span className="text-red-400 font-bold">DUE NOW</span>
                            ) : (
                              new Date(mistake.nextRevisionAt).toLocaleDateString()
                            )}
                          </span>
                        </div>

                        <button
                          onClick={() => handleRevise(mistake.id)}
                          className="px-3.5 py-1.5 bg-white/4 border border-card-border rounded-lg text-xs font-semibold text-white hover:bg-accent-purple/20 hover:border-accent-purple/40 hover:text-accent-purple transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          Mark Revised
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
