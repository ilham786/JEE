"use client";

import { useState, useEffect } from "react";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { useStudyStore, SessionMode } from "@/store/use-study-store";
import { useMistakeStore } from "@/store/use-mistake-store";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Eye,
  EyeOff,
  Flame,
  Volume2,
  AlertTriangle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function StudySessionPage() {
  const {
    status,
    mode,
    timeLeft,
    durationMinutes,
    activeSession,
    monkModeEnabled,
    blockedWebsites,
    toggleMonkMode,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    logSimulatedDistraction,
  } = useStudyStore();

  const { syllabus } = useMistakeStore();

  // Session configuration form states
  const [selectedSubject, setSelectedSubject] = useState<"Physics" | "Chemistry" | "Maths">("Physics");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedType, setSelectedType] = useState("PYQ");
  const [selectedMode, setSelectedMode] = useState<SessionMode>("Pomodoro");
  const [customTime, setCustomTime] = useState(45);

  const [notes, setNotes] = useState("");
  const [distractionTriggerDomain, setDistractionTriggerDomain] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [sessionFocusRating, setSessionFocusRating] = useState(90);

  // Set default chapter based on subject
  useEffect(() => {
    if (syllabus[selectedSubject] && syllabus[selectedSubject].length > 0) {
      setSelectedChapter(syllabus[selectedSubject][0].name);
    }
  }, [selectedSubject, syllabus]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Run countdown percentage calculation
  const totalSeconds = durationMinutes * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  const handleStart = () => {
    startSession(selectedSubject, selectedChapter, selectedType, selectedMode, customTime);
  };

  const handleCompleteEarly = () => {
    setShowReviewModal(true);
  };

  const submitSessionReview = () => {
    completeSession(notes, sessionFocusRating);
    setShowReviewModal(false);
    setNotes("");
    
    // Fire level-up / complete celebration
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"],
    });
  };

  const handleSimulateDistraction = () => {
    if (distractionTriggerDomain) {
      logSimulatedDistraction(distractionTriggerDomain, Math.floor(Math.random() * 5) + 2);
      alert(`[Distraction Logged] Accessing ${distractionTriggerDomain} was registered as a distraction. Focus Score degraded!`);
      setDistractionTriggerDomain("");
    }
  };

  const triggerTimerState = () => {
    if (status === "focus") {
      pauseSession();
    } else {
      resumeSession();
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to toggle pause
      if (e.code === "Space" && status === "focus" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        triggerTimerState();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status]);

  // Monk Mode component content
  if (monkModeEnabled && status === "focus") {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4 md:p-6 select-none transition-all">
        {/* Ambient indicator */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-3 text-xs text-zinc-500 font-semibold tracking-wider uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse" />
          Monk Session: {activeSession?.subject} - {activeSession?.chapter}
        </div>

        {/* Digital focus display */}
        <div className="flex flex-col items-center space-y-8 text-center max-w-md w-full">
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-black text-white font-mono tracking-tighter tabular-nums select-all">
            {formatTime(timeLeft)}
          </h2>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-400 tracking-wide">
              Focusing on: <span className="text-white">{activeSession?.taskType}</span>
            </p>
            <p className="text-xs text-zinc-600">Press Spacebar to Pause</p>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4 pt-8">
            <button
              onClick={triggerTimerState}
              className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors"
            >
              {status === "focus" ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
            </button>
            <button
              onClick={handleCompleteEarly}
              className="px-6 h-14 rounded-full bg-accent-purple hover:bg-[#7c4ce6] text-white text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Zone
            </button>
          </div>
        </div>

        {/* Exit panel */}
        <div className="absolute bottom-4 md:bottom-8 flex flex-col items-center gap-3">
          <button
            onClick={toggleMonkMode}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-red-400 transition-colors bg-zinc-950 border border-zinc-900 px-4 py-2.5 rounded-full"
          >
            <EyeOff className="w-4 h-4" />
            Disable Monk Interface
          </button>
          <p className="text-[10px] text-zinc-700">All dashboard panels and social stats are currently hidden.</p>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceLayout title="Focus Space">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Countdown Timer display */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[450px]">
          {status === "idle" ? (
            // Form to start session
            <div className="max-w-md w-full space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Start New Focus Zone</h2>
                <p className="text-xs text-gray-400">Choose subject and length parameters to begin.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Subject selector */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-medium">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as "Physics" | "Chemistry" | "Maths")}
                    className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-purple"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Maths</option>
                  </select>
                </div>

                {/* Chapter selector */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-medium">Chapter</label>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-purple"
                  >
                    {syllabus[selectedSubject]?.map((chap) => (
                      <option key={chap.id} value={chap.name}>
                        {chap.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Type selector */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-medium">Task Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-purple"
                  >
                    <option value="Lecture">Video Lecture</option>
                    <option value="PYQ">PYQ Solving</option>
                    <option value="Revision">Formula Revision</option>
                    <option value="Test">Mock Test</option>
                  </select>
                </div>

                {/* Mode selector */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-medium">Focus Mode</label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value as SessionMode)}
                    className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-purple"
                  >
                    <option value="Pomodoro">Pomodoro (50m)</option>
                    <option value="DeepWork">Deep Work (90m)</option>
                    <option value="Custom">Custom Timer</option>
                  </select>
                </div>
              </div>

              {selectedMode === "Custom" && (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs text-gray-400 font-medium">Duration (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={customTime}
                    onChange={(e) => setCustomTime(parseInt(e.target.value) || 45)}
                    className="w-full bg-[#121620] border border-card-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-purple"
                  />
                </div>
              )}

              <button
                onClick={handleStart}
                className="w-full py-3 rounded-lg bg-accent-purple hover:bg-[#7c4ce6] text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-accent-purple/20"
              >
                <Play className="w-4 h-4 fill-white" />
                INITIATE FOCUS ZONE
              </button>
            </div>
          ) : (
            // Active timer UI
            <div className="flex flex-col items-center space-y-6 max-w-sm w-full">
              {/* Circular progress container */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                  <circle
                    cx="112"
                    cy="112"
                    r="96"
                    className="stroke-white/5"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="96"
                    className={`${status === "break" ? "stroke-chemistry" : "stroke-accent-purple"} transition-all duration-1000`}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 96}
                    strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="text-center z-10 space-y-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tabular-nums">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase block">
                    {status === "break" ? "Break Time" : "Focus Zone"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-center">
                <h3 className="text-sm font-semibold text-white">
                  {activeSession?.subject} - {activeSession?.chapter}
                </h3>
                <p className="text-xs text-gray-400">
                  Tasking: {activeSession?.taskType} ({mode} mode)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={triggerTimerState}
                  className="w-11 h-11 rounded-full border border-card-border bg-white/2 hover:bg-white/6 text-white flex items-center justify-center transition-colors"
                  title={status === "focus" ? "Pause Zone (Spacebar)" : "Resume Zone"}
                >
                  {status === "focus" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={handleCompleteEarly}
                  className="px-4 py-2 bg-accent-purple hover:bg-[#7c4ce6] text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Early
                </button>

                <button
                  onClick={cancelSession}
                  className="w-11 h-11 rounded-full border border-card-border bg-white/2 hover:bg-white/6 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors"
                  title="Abandon Session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Blocker details & Monk Mode Controls */}
        <div className="space-y-6">
          {/* Monk Mode Controller Card */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-accent-purple" /> Monk Interface
            </h3>
            <p className="text-xs text-gray-400 leading-normal">
              Disable all widgets, notifications, and menus. Leaves only the black screen focus timer to avoid visual distractions.
            </p>
            <button
              onClick={toggleMonkMode}
              className={`w-full py-2.5 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                monkModeEnabled
                  ? "bg-accent-purple/20 border-accent-purple text-accent-purple"
                  : "bg-white/2 border-card-border text-gray-300 hover:bg-white/4"
              }`}
            >
              {monkModeEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {monkModeEnabled ? "Interface Lock Enabled" : "Initiate Interface Lock"}
            </button>
          </div>

          {/* Web Blocker simulation */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-orange-400" /> Blocker Shield
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                Active
              </span>
            </div>
            
            <p className="text-xs text-gray-400 leading-normal">
              Web blocker simulation logs access attempts to social sites during focus sessions to degrade focus scores.
            </p>

            <div className="p-3 bg-white/2 border border-card-border rounded-lg text-xs space-y-2">
              <div className="flex justify-between text-gray-400 text-[10px]">
                <span>Currently Blocked Domains</span>
                <span>{blockedWebsites.length} total</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {blockedWebsites.slice(0, 3).map((site) => (
                  <span key={site} className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-[9px]">
                    {site}
                  </span>
                ))}
                {blockedWebsites.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-white/5 border border-card-border text-gray-400 rounded text-[9px]">
                    +{blockedWebsites.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Simulated Distraction trigger */}
            {status === "focus" && (
              <div className="space-y-2 pt-2 border-t border-card-border">
                <label className="text-[10px] text-gray-400 block font-medium">Test Blocker Shield (Simulate Distraction)</label>
                <div className="flex gap-2">
                  <select
                    value={distractionTriggerDomain}
                    onChange={(e) => setDistractionTriggerDomain(e.target.value)}
                    className="flex-1 bg-[#121620] border border-card-border rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="">Select website...</option>
                    {blockedWebsites.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSimulateDistraction}
                    disabled={!distractionTriggerDomain}
                    className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                  >
                    Trigger
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Review Modal */}
      {showReviewModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
            <div className="glass-panel p-6 rounded-xl max-w-md w-full space-y-4">
              <h3 className="text-base font-bold text-white">Log Study Session</h3>
              <p className="text-xs text-gray-400">Describe the output of this study zone for your mistake journal and coach logs.</p>
              
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 block">Focus Quality (0-100%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={sessionFocusRating}
                    onChange={(e) => setSessionFocusRating(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-purple"
                  />
                  <span className="text-xs font-bold text-white w-8 shrink-0 text-right">{sessionFocusRating}%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 block">Session Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. Completed electrostatics force calculation questions. Concept of spherical shells is crystal clear now."
                  rows={3}
                  className="w-full bg-[#121620] border border-card-border rounded-lg p-3 text-xs text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-card-border bg-white/2 text-gray-400 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitSessionReview}
                  className="px-4 py-2 bg-accent-purple hover:bg-[#7c4ce6] text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Submit & Log XP
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </WorkspaceLayout>
  );
}
