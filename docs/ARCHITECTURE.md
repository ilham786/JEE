# FocusForge — Technical Architecture

This document outlines the software architecture, component relationships, data persistence models, routing setups, and build configuration engines powering the FocusForge web application.

---

## 1. Folder Structure & Code Organization

The codebase is organized as a modular Next.js application using TypeScript and Tailwind CSS v4.

```
FocusForge/
├── .agents/                 # AI Assistant skills & guidelines config
├── docs/                    # Architectural and developer guides
├── prisma/                  # SQLite schema definitions and seed data scripts
│   ├── dev.db               # Local SQLite database (Scaffolded, unused by UI)
│   ├── schema.prisma        # Prisma relational database models
│   └── seed.ts              # Data seeding logic for developer setups
├── public/                  # Static assets and browser icons
├── src/
│   ├── app/                 # Next.js App Router folders (Pages & CSS)
│   │   ├── analytics/       # Analytics dashboard route (/analytics)
│   │   ├── blocker/         # website blocker configuration page (/blocker)
│   │   ├── coach/           # Heuristic AI Coach interface (/coach)
│   │   ├── dashboard/       # Main workspace dashboard (/dashboard)
│   │   ├── jee/             # Chapter tracker & syllabus cards (/jee)
│   │   ├── mistakes/        # Mistake Journal log cards (/mistakes)
│   │   ├── revisions/       # Spaced repetition list review cards (/revisions)
│   │   ├── study/           # Focus timer & Monk Mode interface (/study)
│   │   ├── tracker/         # Distraction log listing (/tracker)
│   │   ├── globals.css      # Core Tailwind CSS imports, themes, glass helpers
│   │   ├── layout.tsx       # Root layout defining viewport, fonts, body tag
│   │   ├── loading.tsx      # Skeleton loader placeholders
│   │   └── page.tsx         # Standalone marketing landing page (/)
│   ├── components/          # React structural UI components
│   │   ├── ui/              # Reusable design system primitives
│   │   │   ├── card.tsx     # Card panels, headers, footers, empty states
│   │   │   └── controls.tsx # Custom buttons, progress bars, section labels
│   │   ├── header.tsx       # App Shell header (Streak, volume dropdown, Monk mode)
│   │   ├── sidebar.tsx      # App Shell sidebar (Navigation links, Level stats)
│   │   ├── sound-player.tsx # Headless Web Audio API ambient audio synthesizer
│   │   └── workspace-layout.tsx # Standard page shell layout wrapper
│   ├── hooks/               # Custom hooks
│   │   ├── use-is-client.ts # Hydration helper tracking DOM client-safe loads
│   │   └── use-keyboard-shortcuts.ts # Alt key routing and timer pause controls
│   ├── lib/                 # Core helper scripts & math algorithms
│   │   ├── coach-logic.ts   # Advisory heuristics parsing logs
│   │   ├── db.ts            # Singleton wrapper generating Prisma Client
│   │   └── spaced-rep.ts    # SuperMemo-2 spaced-repetition scheduler
│   ├── store/               # Zustand Global State Management
│   │   ├── use-mistake-store.ts # Managing mistake list, progress updates
│   │   └── use-study-store.ts   # Managing timers, volume, blocked items, XP
│   └── types/               # Type declarations
│       └── tauri.d.ts       # Tauri desktop packaging definitions
└── tsconfig.json            # TypeScript configuration
```

---

## 2. Component Hierarchy & Page Routing

FocusForge uses Next.js App Router for file-based routing.
*   **Static Rendering**: All pages are rendered client-side (`"use client"`) and build as static exports (`○`) due to the lack of dynamic API routes or server-side DB connections.
*   **Page Layout Wrapping**: Every path (except `/`) renders its core content inside `<WorkspaceLayout>`, aligning the Sidebar and Header.

```
Root Layout (src/app/layout.tsx)
  └── page.tsx ("/" Standalone Landing Page)
  
  OR
  
  └── Feature Page (e.g. src/app/study/page.tsx)
        └── WorkspaceLayout (src/components/workspace-layout.tsx)
              ├── Sidebar (src/components/sidebar.tsx)
              ├── Header (src/components/header.tsx)
              ├── SoundPlayer (src/components/sound-player.tsx)
              └── Feature Page Content (e.g. Timer panel, Monk mode grid)
```

---

## 3. State Management & Persisted Stores

The primary data layer consists of two **Zustand** stores configured with local storage persistence.

```
                     ┌──────────────────┐
                     │   Zustand Store  │
                     └────────┬─────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
     [useStudyStore]               [useMistakeStore]
  (focusforge-study-storage)    (focusforge-mistakes-storage)
  • xp, level, streaks          • mistakes[]
  • timer (timeLeft, status)    • syllabus progress
  • blocker settings, logs      • weak chapter topics
  • volume & sound type
```

### 1. `useStudyStore` (`focusforge-study-storage`)
*   **State fields**:
    *   `xp` (number, default: `3450`), `level` (number, default: `4`), `currentStreak` (number, default: `12`), `longestStreak` (number, default: `21`).
    *   `status` (`"idle" | "focus" | "break"`), `mode` (`"Pomodoro" | "DeepWork" | "Custom"`).
    *   `timeLeft` (seconds remaining in active block), `durationMinutes` (initial set time).
    *   `activeSession` (details of running timer).
    *   `monkModeEnabled` (hides navigation items to prevent distractions).
    *   `blockedWebsites` (blacklist domain checklist), `whitelistOnly` (restrictive mode), `examModeEnabled` (exam lock).
    *   `simulatedDistractions` (logs of visited blacklisted sites).
    *   `ambientSound` (`"rain" | "lofi" | "white-noise" | "none"`), `volume` (float: 0.0 - 1.0).
*   **Core Actions**:
    *   `startSession()`, `pauseSession()` (Transition status to `"idle"`, leaving timer intact), `resumeSession()`, `tick()` (called on 1s interval), `completeSession()`, `cancelSession()`.
    *   `addXp()`, `toggleMonkMode()`, `setVolume()`, `addBlockedWebsite()`, `toggleWebsiteBlock()`.

### 2. `useMistakeStore` (`focusforge-mistakes-storage`)
*   **State fields**:
    *   `mistakes` (array of `MistakeEntry` items: id, subject, chapter, error type, descriptions, timesRevised, nextRevisionAt date).
    *   `syllabus` (Physics, Chemistry, Maths chapter list tracking completeness percentages, solved PYQs, weak topic tags).
*   **Core Actions**:
    *   `addMistake()` (computes initial revision review for current date + 1 day).
    *   `reviseMistake()` (steps mistake revision frequency along SPACING_INTERVALS: `[1, 3, 7, 15, 30]` days).
    *   `addWeakTopic()`, `removeWeakTopic()`, `updateChapterSyllabus()`.

---

## 4. Scaffolded Database Layer (Prisma & SQLite)

The workspace includes a complete relational database structure ready for deployment, but it is currently **unwired** from the UI.
*   **Configuration**: [prisma/schema.prisma](file:///c:/Users/Lenovo/Desktop/JEE/prisma/schema.prisma) mapping User, StudySession, Task, Mistake, Revision, BlockedWebsite, Goals, and DailyAnalytics.
*   **Client Generation**: [src/lib/db.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/lib/db.ts) initializes the client singleton.
*   **Database Engine**: SQLite writing locally to `prisma/dev.db`.
*   *Current UI State*: The user interface interfaces exclusively with the Zustand store. The SQLite database is not queried or modified by Next.js routers today.

---

## 5. Core Data & Execution Flows

### Study Session Tick Flow
1.  `<WorkspaceLayout>` registers a 1-second `setInterval` when `status` is `"focus"` or `"break"`.
2.  Each tick calls `tick()` inside `useStudyStore`.
3.  If timer hits `0`:
    *   If status was `"focus"`: Transition status to `"break"`, configure new timer durations (10m for Pomodoro, 20m for DeepWork), and award 200 completion XP.
    *   If status was `"break"`: Transition status to `"idle"`, clear active session data.
4.  Completing a session manually calls `completeSession()`, which calculates focus scores and awards 100 - 200 XP based on performance.

### Spaced Repetition Timeline Flow
1.  User logs mistake in `/mistakes`.
2.  `addMistake()` schedules initial review date for tomorrow (`Date.now() + 1 day`).
3.  Mistake appears on `/revisions` scheduler page when `nextRevisionAt` date overlaps the active calendar schedule window.
4.  User reviews mistakes and clicks "Revised".
5.  `reviseMistake()` reads `timesRevised` counter, looks up the corresponding delay interval in `SPACING_INTERVALS` (defaulting to 30 days if index is exceeded), increments the revision count, and sets the next calendar target date.
