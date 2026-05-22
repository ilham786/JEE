"use client";

import { useState } from "react";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { useMistakeStore, ChapterProgress } from "@/store/use-mistake-store";
import { useStudyStore } from "@/store/use-study-store";
import {
  GraduationCap,
  Plus,
  Trash2,
  BookOpen,
  Bookmark,
  CheckCircle,
} from "lucide-react";

export default function JeeProductivityPage() {
  const { syllabus, addWeakTopic, removeWeakTopic, updateChapterSyllabus } = useMistakeStore();
  const { addXp } = useStudyStore();

  const [activeTab, setActiveTab] = useState<"Physics" | "Chemistry" | "Maths">("Physics");
  
  // Interactive editing states
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editPercent, setEditPercent] = useState(0);
  const [editSolved, setEditSolved] = useState(0);
  
  // Formula sheet mock states
  const [activeFormulaSub, setActiveFormulaSub] = useState<"Physics" | "Chemistry" | "Maths">("Physics");
  const formulaSheets = {
    Physics: [
      { id: "fp1", name: "Electrostatics Forces & Potentials", formula: "F = k*q1*q2/r^2; E = -dV/dr; V = k*q/r; Electric dipole torque: τ = p × E; Dipole Potential: V = k*p*cosθ/r^2" },
      { id: "fp2", name: "Current Electricity Laws", formula: "V = IR; R = ρL/A; Kirchhoff's Loop Law: ΣV = 0; Potentiometer gradient: x = V/L; Drift Velocity: Vd = eEτ/m" },
    ],
    Chemistry: [
      { id: "fc1", name: "Chemical Bonding stereochemistries", formula: "Steric Number = 1/2 * [Valence e- of central atom + Monovalent atoms - cation + anion]; XeF4 SN = 6 (sp3d2); Bond Order = 1/2 * (Nb - Na)" },
      { id: "fc2", name: "Ideal & Real Gas states", formula: "PV = nRT; Van der Waals: (P + an^2/V^2)(V - nb) = nRT; Critical Temperature: Tc = 8a/27Rb; Critical Volume: Vc = 3b" },
    ],
    Maths: [
      { id: "fm1", name: "Definite Integral limits & tricks", formula: "King's property: ∫[a,b] f(x)dx = ∫[a,b] f(a+b-x)dx; Queen's property: ∫[0,2a] f(x)dx = 2*∫[0,a] f(x)dx if f(2a-x)=f(x); Wallis formula for sin^n(x)" },
      { id: "fm2", name: "Trigonometric Compound ratios", formula: "sin(A+B) = sinAcosB + cosAsinB; cos(A+B) = cosAcosB - sinAsinB; tan(A+B) = (tanA+tanB)/(1-tanAtanB); sin2A = 2sinAcosA" },
    ],
  };

  const [newWeakTopic, setNewWeakTopic] = useState("");

  const handleSaveProgress = (chapterId: string) => {
    updateChapterSyllabus(activeTab, chapterId, {
      completion: Math.max(0, Math.min(100, editPercent)),
      pyqsSolved: editSolved,
    });
    addXp(40); // Reward 40 XP for planning syllabus completion updates!
    setEditingChapterId(null);
    alert("Chapter syllabus metrics updated. +40 XP rewarded!");
  };

  const handleAddTopic = (chapterId: string) => {
    if (!newWeakTopic.trim()) return;
    addWeakTopic(activeTab, chapterId, newWeakTopic.trim());
    setNewWeakTopic("");
  };

  const getSubjectColor = (sub: string) => {
    if (sub === "Physics") return "text-physics border-physics bg-physics/5";
    if (sub === "Chemistry") return "text-chemistry border-chemistry bg-chemistry/5";
    return "text-maths border-maths bg-maths/5";
  };

  const getProgressBarColor = (sub: string) => {
    if (sub === "Physics") return "bg-physics";
    if (sub === "Chemistry") return "bg-chemistry";
    return "bg-maths";
  };

  const activeChapters = syllabus[activeTab] || [];

  return (
    <WorkspaceLayout title="JEE Preparation Hub">
      
      {/* Subject Selector Tabs */}
      <div className="flex border-b border-card-border">
        {(["Physics", "Chemistry", "Maths"] as const).map((subject) => (
          <button
            key={subject}
            onClick={() => {
              setActiveTab(subject);
              setEditingChapterId(null);
            }}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all relative border-b-2 ${
              activeTab === subject
                ? "text-white border-accent-purple bg-accent-purple/5"
                : "text-gray-400 hover:text-white border-transparent hover:bg-white/2"
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chapters list (LHS) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent-purple" /> {activeTab} Syllabus Tracker
          </h2>

          <div className="space-y-4">
            {activeChapters.map((chap) => {
              const isEditing = editingChapterId === chap.id;

              return (
                <div
                  key={chap.id}
                  className="glass-panel p-5 rounded-xl border border-card-border hover:border-card-hover-border transition-all space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-extrabold text-white">{chap.name}</h3>
                      <div className="flex gap-4 text-[10px] text-gray-500 mt-1">
                        <span>Revision Cycles: {chap.revisionCycles}</span>
                        <span>PYQs: {chap.pyqsSolved} / {chap.pyqsTotal} solved</span>
                      </div>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setEditingChapterId(chap.id);
                          setEditPercent(chap.completion);
                          setEditSolved(chap.pyqsSolved);
                        }}
                        className="px-2.5 py-1 rounded bg-white/4 border border-card-border text-[10px] font-semibold text-gray-300 hover:text-white hover:bg-white/8 cursor-pointer"
                      >
                        Adjust Metrics
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveProgress(chap.id)}
                          className="px-2.5 py-1 rounded bg-accent-purple hover:bg-[#7c4ce6] text-white text-[10px] font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingChapterId(null)}
                          className="px-2.5 py-1 rounded bg-white/4 border border-card-border text-[10px] font-semibold text-gray-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Completeness bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Completion Progress</span>
                      <span className="font-bold text-white">{chap.completion}%</span>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editPercent}
                          onChange={(e) => setEditPercent(parseInt(e.target.value) || 0)}
                          className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-purple"
                        />
                        <span className="text-[10px] font-bold text-white w-8 text-right">{editPercent}%</span>
                      </div>
                    ) : (
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressBarColor(activeTab)}`}
                          style={{ width: `${chap.completion}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Solved PYQ count editing */}
                  {isEditing && (
                    <div className="flex items-center gap-4 text-xs">
                      <label className="text-gray-400">PYQs Solved:</label>
                      <input
                        type="number"
                        min="0"
                        max={chap.pyqsTotal}
                        value={editSolved}
                        onChange={(e) => setEditSolved(parseInt(e.target.value) || 0)}
                        className="w-20 bg-[#121620] border border-card-border rounded px-2 py-1 text-white focus:outline-none"
                      />
                      <span className="text-gray-500">/ {chap.pyqsTotal} Total</span>
                    </div>
                  )}

                  {/* Weak topics tagging details */}
                  <div className="space-y-2 pt-2 border-t border-card-border">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Weak Topics Tagged</span>
                    
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {chap.weakTopics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] flex items-center gap-1.5"
                        >
                          {topic}
                          <button
                            onClick={() => removeWeakTopic(activeTab, chap.id, topic)}
                            className="text-red-400 hover:text-red-500 font-bold text-[9px] shrink-0"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {/* Add topic input */}
                      <div className="flex items-center gap-1.5 ml-2">
                        <input
                          type="text"
                          placeholder="Tag weak concept..."
                          value={newWeakTopic}
                          onChange={(e) => setNewWeakTopic(e.target.value)}
                          className="bg-transparent border-b border-card-border text-[10px] text-white focus:outline-none focus:border-accent-purple px-1 py-0.5"
                        />
                        <button
                          onClick={() => handleAddTopic(chap.id)}
                          className="p-1 rounded bg-white/5 border border-card-border text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formula sheet panels (RHS) */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-accent-purple" /> Formula Sheets
            </h3>
            <p className="text-xs text-gray-400 leading-normal">
              Quick review card for key formulae. Read these formula logs to prime your brain before commencing deep work tasks.
            </p>

            <div className="flex border-b border-card-border text-xs">
              {(["Physics", "Chemistry", "Maths"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveFormulaSub(sub)}
                  className={`flex-1 py-2 text-center font-bold tracking-wide transition-colors ${
                    activeFormulaSub === sub
                      ? "text-white bg-white/5 border-b-2 border-b-accent-purple"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {sub.slice(0, 4)}
                </button>
              ))}
            </div>

            <div className="space-y-3.5 pt-2">
              {formulaSheets[activeFormulaSub].map((f) => (
                <div key={f.id} className="p-3 bg-[#11141d] rounded-lg border border-card-border space-y-1.5">
                  <span className="text-[11px] font-bold text-white block">{f.name}</span>
                  <p className="text-[10px] text-gray-400 font-mono leading-normal bg-black/30 p-2 rounded">
                    {f.formula}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
