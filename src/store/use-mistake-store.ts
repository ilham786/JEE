import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MistakeEntry {
  id: string;
  subject: string; // "Physics" | "Chemistry" | "Maths"
  chapter: string;
  errorType: string; // "Calculation Error" | "Conceptual Gap" | "Silly Mistake" | "Time Pressure"
  description: string;
  explanation: string;
  timesRevised: number;
  createdAt: string;
  nextRevisionAt: string;
  screenshotUrl?: string | null;
}

export interface ChapterProgress {
  id: string;
  name: string;
  completion: number; // 0 to 100
  pyqsSolved: number;
  pyqsTotal: number;
  weakTopics: string[];
  revisionCycles: number;
}

interface MistakeState {
  mistakes: MistakeEntry[];
  syllabus: {
    Physics: ChapterProgress[];
    Chemistry: ChapterProgress[];
    Maths: ChapterProgress[];
  };
  
  // Actions
  addMistake: (mistake: Omit<MistakeEntry, "id" | "createdAt" | "nextRevisionAt" | "timesRevised">) => void;
  reviseMistake: (id: string) => void;
  addWeakTopic: (subject: "Physics" | "Chemistry" | "Maths", chapterId: string, topic: string) => void;
  removeWeakTopic: (subject: "Physics" | "Chemistry" | "Maths", chapterId: string, topic: string) => void;
  updateChapterSyllabus: (subject: "Physics" | "Chemistry" | "Maths", chapterId: string, updates: Partial<ChapterProgress>) => void;
}

// Spaced Repetition interval mapping
// Cycle: 0 -> 1 day, 1 -> 3 days, 2 -> 7 days, 3 -> 15 days, 4 -> 30 days
const SPACING_INTERVALS = [1, 3, 7, 15, 30];

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set, get) => ({
      // Default Mistake log entries mirroring Seed database
      mistakes: [
        {
          id: "m-1",
          subject: "Physics",
          chapter: "Electrostatics",
          errorType: "Calculation Error",
          description: "Messed up integration limit while calculating electric field of a charged rod.",
          explanation: "Limits should be from -L/2 to +L/2, but I integrated from 0 to L. Remember that coordinate origin is at midpoint of rod.",
          timesRevised: 1,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          nextRevisionAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // due tomorrow
        },
        {
          id: "m-2",
          subject: "Chemistry",
          chapter: "Chemical Bonding",
          errorType: "Conceptual Gap",
          description: "Misidentified hybridization of XeF4 as sp3d instead of sp3d2.",
          explanation: "Xenon has 8 valence electrons. Four bonding pairs with Fluorine, plus 2 lone pairs. Total steric number = 6. Hence, hybridization is sp3d2 (square planar geometry).",
          timesRevised: 0,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          nextRevisionAt: new Date().toISOString(), // due today (overdue/pending)
        },
        {
          id: "m-3",
          subject: "Maths",
          chapter: "Integration",
          errorType: "Silly Mistake",
          description: "Forgot to add constant of integration in the indefinite integral section of Mock Test.",
          explanation: "Lost 4 marks on an easy question just because of neglecting '+ C'. Must double check all indefinite integrals during revision.",
          timesRevised: 2,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          nextRevisionAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],

      // Syllabus coverage progress for Class 11 & 12 competitive preparation
      syllabus: {
        Physics: [
          { id: "p1", name: "Electrostatics", completion: 80, pyqsSolved: 40, pyqsTotal: 60, weakTopics: ["Electric Dipole Integration", "Shell Theorem"], revisionCycles: 2 },
          { id: "p2", name: "Current Electricity", completion: 95, pyqsSolved: 55, pyqsTotal: 60, weakTopics: ["Potentiometer Calculations"], revisionCycles: 3 },
          { id: "p3", name: "Magnetism", completion: 40, pyqsSolved: 15, pyqsTotal: 50, weakTopics: ["Ampere's law applications"], revisionCycles: 1 },
          { id: "p4", name: "Optics", completion: 15, pyqsSolved: 5, pyqsTotal: 70, weakTopics: ["Wave optics diffraction limits"], revisionCycles: 0 },
        ],
        Chemistry: [
          { id: "c1", name: "Chemical Bonding", completion: 100, pyqsSolved: 80, pyqsTotal: 80, weakTopics: ["Molecular Orbital Theory overlap"], revisionCycles: 4 },
          { id: "c2", name: "Coordination Compounds", completion: 60, pyqsSolved: 30, pyqsTotal: 50, weakTopics: ["Crystal Field Splitting energies"], revisionCycles: 1 },
          { id: "c3", name: "Gaseous State", completion: 90, pyqsSolved: 40, pyqsTotal: 40, weakTopics: ["Real gas equation deviation factors"], revisionCycles: 3 },
          { id: "c4", name: "Organic Halides", completion: 30, pyqsSolved: 12, pyqsTotal: 60, weakTopics: ["Sn1 vs Sn2 solvent effects"], revisionCycles: 1 },
        ],
        Maths: [
          { id: "m1", name: "Integration", completion: 70, pyqsSolved: 60, pyqsTotal: 90, weakTopics: ["Definite integral properties", "Wallis formula"], revisionCycles: 2 },
          { id: "m2", name: "Matrices & Determinants", completion: 100, pyqsSolved: 60, pyqsTotal: 60, weakTopics: ["System of linear equations consistency"], revisionCycles: 4 },
          { id: "m3", name: "Trigonometry", completion: 90, pyqsSolved: 50, pyqsTotal: 50, weakTopics: ["Multiple angle formulae"], revisionCycles: 3 },
          { id: "m4", name: "Probability", completion: 20, pyqsSolved: 10, pyqsTotal: 70, weakTopics: ["Bayes theorem conditions"], revisionCycles: 1 },
        ],
      },

      // Add a logged mistake with auto spaced-repetition initiation
      addMistake: (mistake) => {
        const now = new Date();
        const nextRev = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1st revision in 1 day

        const entry: MistakeEntry = {
          id: `m-${Math.random().toString(36).substring(2, 9)}`,
          ...mistake,
          timesRevised: 0,
          createdAt: now.toISOString(),
          nextRevisionAt: nextRev.toISOString(),
        };

        set((state) => ({
          mistakes: [entry, ...state.mistakes],
        }));
      },

      // Revise a mistake (moves to next spaced interval)
      reviseMistake: (id) => {
        set((state) => {
          const updatedMistakes = state.mistakes.map((m) => {
            if (m.id !== id) return m;
            
            const nextCycle = Math.min(m.timesRevised + 1, SPACING_INTERVALS.length - 1);
            const daysToAdd = SPACING_INTERVALS[m.timesRevised] || 30;
            const newRevDate = new Date();
            newRevDate.setDate(newRevDate.getDate() + daysToAdd);

            return {
              ...m,
              timesRevised: m.timesRevised + 1,
              nextRevisionAt: newRevDate.toISOString(),
            };
          });

          return { mistakes: updatedMistakes };
        });
      },

      // Add a weak topic tag to the chapter
      addWeakTopic: (subject, chapterId, topic) => {
        set((state) => {
          const updatedChapters = state.syllabus[subject].map((chap) => {
            if (chap.id !== chapterId) return chap;
            if (chap.weakTopics.includes(topic)) return chap;
            return {
              ...chap,
              weakTopics: [...chap.weakTopics, topic],
            };
          });

          return {
            syllabus: {
              ...state.syllabus,
              [subject]: updatedChapters,
            },
          };
        });
      },

      // Remove a weak topic tag
      removeWeakTopic: (subject, chapterId, topic) => {
        set((state) => {
          const updatedChapters = state.syllabus[subject].map((chap) => {
            if (chap.id !== chapterId) return chap;
            return {
              ...chap,
              weakTopics: chap.weakTopics.filter((t) => t !== topic),
            };
          });

          return {
            syllabus: {
              ...state.syllabus,
              [subject]: updatedChapters,
            },
          };
        });
      },

      // Modify chapter completeness metrics
      updateChapterSyllabus: (subject, chapterId, updates) => {
        set((state) => {
          const updatedChapters = state.syllabus[subject].map((chap) => {
            if (chap.id !== chapterId) return chap;
            return {
              ...chap,
              ...updates,
            };
          });

          return {
            syllabus: {
              ...state.syllabus,
              [subject]: updatedChapters,
            },
          };
        });
      },
    }),
    {
      name: "focusforge-mistakes-storage",
    }
  )
);
