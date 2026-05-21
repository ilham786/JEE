import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionMode = "Pomodoro" | "DeepWork" | "Custom";
export type SessionStatus = "idle" | "focus" | "break";
export type AmbientSound = "rain" | "lofi" | "white-noise" | "none";

interface StudySessionInfo {
  id: string;
  subject: string;
  chapter: string;
  taskType: string; // "Lecture" | "PYQ" | "Revision" | "Test"
  mode: SessionMode;
  startTime: string;
}

interface StudyState {
  // User Profile & Gamification
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  
  // Timer State
  status: SessionStatus;
  mode: SessionMode;
  durationMinutes: number;
  timeLeft: number; // in seconds
  activeSession: StudySessionInfo | null;
  
  // Distraction Tracker Simulation
  monkModeEnabled: boolean;
  blockedWebsites: string[];
  whitelistOnly: boolean;
  examModeEnabled: boolean;
  distractionLogsCount: number;
  simulatedDistractions: Array<{
    id: string;
    domain: string;
    durationMinutes: number;
    timestamp: string;
  }>;

  // Sound Config
  ambientSound: AmbientSound;
  volume: number;

  // Actions
  addXp: (amount: number) => { leveledUp: boolean; newLevel: number };
  startSession: (subject: string, chapter: string, taskType: string, mode: SessionMode, customMinutes?: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  tick: () => void;
  completeSession: (notes: string, focusScore: number) => void;
  cancelSession: () => void;
  toggleMonkMode: () => void;
  setAmbientSound: (sound: AmbientSound) => void;
  setVolume: (vol: number) => void;
  addBlockedWebsite: (domain: string) => void;
  removeBlockedWebsite: (domain: string) => void;
  toggleWebsiteBlock: (domain: string) => void;
  setWhitelistOnly: (val: boolean) => void;
  setExamModeEnabled: (val: boolean) => void;
  logSimulatedDistraction: (domain: string, minutes: number) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      // Gamification Initial State (matches DB seed default)
      xp: 3450,
      level: 4,
      currentStreak: 12,
      longestStreak: 21,

      // Timer Initial State
      status: "idle",
      mode: "Pomodoro",
      durationMinutes: 50,
      timeLeft: 50 * 60,
      activeSession: null,

      // Distractions Blocker Initial State
      monkModeEnabled: false,
      blockedWebsites: ["youtube.com", "instagram.com", "reddit.com", "facebook.com", "twitter.com", "discord.com"],
      whitelistOnly: false,
      examModeEnabled: false,
      distractionLogsCount: 2,
      simulatedDistractions: [
        { id: "1", domain: "youtube.com", durationMinutes: 5, timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: "2", domain: "instagram.com", durationMinutes: 3, timestamp: new Date(Date.now() - 7200000).toISOString() },
      ],

      // Sound Settings
      ambientSound: "rain",
      volume: 0.4,

      // XP Reward Action
      addXp: (amount) => {
        const currentXp = get().xp;
        const currentLevel = get().level;
        const newXp = currentXp + amount;
        
        // Let's assume 1000 XP per level
        const newLevel = Math.floor(newXp / 1000) + 1;
        const leveledUp = newLevel > currentLevel;

        set({ xp: newXp, level: newLevel });
        return { leveledUp, newLevel };
      },

      // Timer Control Actions
      startSession: (subject, chapter, taskType, mode, customMinutes) => {
        let duration = 50;
        if (mode === "DeepWork") duration = 90;
        if (mode === "Custom" && customMinutes) duration = customMinutes;

        const newSession: StudySessionInfo = {
          id: Math.random().toString(36).substring(2, 9),
          subject,
          chapter,
          taskType,
          mode,
          startTime: new Date().toISOString(),
        };

        set({
          status: "focus",
          mode,
          durationMinutes: duration,
          timeLeft: duration * 60,
          activeSession: newSession,
        });
      },

      pauseSession: () => {
        // Just change status if needed, but for simplicity, we continue countdown or hold
        set({ status: "idle" }); // pausing sets it to idle mode
      },

      resumeSession: () => {
        set({ status: "focus" });
      },

      tick: () => {
        const currentSeconds = get().timeLeft;
        const currentStatus = get().status;

        if (currentStatus === "focus" && currentSeconds > 0) {
          set({ timeLeft: currentSeconds - 1 });
        } else if (currentStatus === "focus" && currentSeconds === 0) {
          // Timer finished! Transition to break automatically
          const nextMode = get().mode;
          let breakDuration = 10;
          if (nextMode === "DeepWork") breakDuration = 20;

          set({
            status: "break",
            timeLeft: breakDuration * 60,
            durationMinutes: breakDuration,
          });

          // Reward 200 XP for completion
          get().addXp(200);
        } else if (currentStatus === "break" && currentSeconds > 0) {
          set({ timeLeft: currentSeconds - 1 });
        } else if (currentStatus === "break" && currentSeconds === 0) {
          // Break finished
          set({
            status: "idle",
            timeLeft: 0,
            activeSession: null,
          });
        }
      },

      completeSession: (notes, focusScore) => {
        // Add completion XP based on focus score
        const earnedXp = Math.floor(100 * (focusScore / 100)) + 100; // 100 to 200 XP
        get().addXp(earnedXp);

        // Also increase streak if active session date is different from last active (simulated)
        set((state) => ({
          status: "idle",
          timeLeft: 0,
          activeSession: null,
          currentStreak: state.currentStreak + 1,
          longestStreak: Math.max(state.longestStreak, state.currentStreak + 1),
        }));
      },

      cancelSession: () => {
        set({
          status: "idle",
          timeLeft: 0,
          activeSession: null,
        });
      },

      // Monk Mode
      toggleMonkMode: () => {
        set((state) => ({ monkModeEnabled: !state.monkModeEnabled }));
      },

      // Blocked Websites Configuration
      addBlockedWebsite: (domain) => {
        if (!get().blockedWebsites.includes(domain)) {
          set((state) => ({
            blockedWebsites: [...state.blockedWebsites, domain],
          }));
        }
      },

      removeBlockedWebsite: (domain) => {
        set((state) => ({
          blockedWebsites: state.blockedWebsites.filter((d) => d !== domain),
        }));
      },

      toggleWebsiteBlock: (domain) => {
        if (get().blockedWebsites.includes(domain)) {
          get().removeBlockedWebsite(domain);
        } else {
          get().addBlockedWebsite(domain);
        }
      },

      setWhitelistOnly: (val) => set({ whitelistOnly: val }),
      setExamModeEnabled: (val) => set({ examModeEnabled: val }),

      // Distraction Logging
      logSimulatedDistraction: (domain, minutes) => {
        const distraction = {
          id: Math.random().toString(36).substring(2, 9),
          domain,
          durationMinutes: minutes,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          simulatedDistractions: [distraction, ...state.simulatedDistractions],
          distractionLogsCount: state.distractionLogsCount + 1,
        }));
      },

      // Sound Setting Actions
      setAmbientSound: (sound) => set({ ambientSound: sound }),
      setVolume: (vol) => set({ volume: vol }),
    }),
    {
      name: "focusforge-study-storage",
    }
  )
);
