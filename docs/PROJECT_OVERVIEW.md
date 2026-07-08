# FocusForge — Project Overview

## Purpose
FocusForge is a **study operating system for JEE / competitive-exam aspirants**. It turns
discipline into a workflow: timed focus sessions, a spaced-repetition mistake journal,
syllabus tracking, distraction blocking, and a heuristic "AI coach" — wrapped in a dark,
glassmorphic, gamified (XP / levels / streaks) interface.

Author: ILHAM FAROOQUE (https://github.com/ilham786). Package name: `focusforge`.

## Architecture summary
- **Next.js 16.2.6, App Router**, React 19, TypeScript (strict), Tailwind CSS v4.
- **100% client-rendered** feature pages (`"use client"`); every route prerenders as static.
- **State = two Zustand stores persisted to `localStorage`** — this is the live data layer.
- **Prisma + SQLite schema exists but is NOT wired to the UI.** `prisma/schema.prisma` and
  `src/lib/db.ts` define a full relational model (User, StudySession, Mistake, Revision,
  DailyAnalytics, …) for a future backend. Today the UI reads/writes only the Zustand stores,
  which are seeded with hardcoded demo data. Treat the DB as scaffolding, not a source of truth.
- **Charts** via Recharts, **animation** via framer-motion, **icons** via lucide-react,
  **celebration** via canvas-confetti, **ambient audio** via the Web Audio API (synthesised,
  no audio files).
- `src/types/tauri.d.ts` hints at future Tauri desktop packaging (not active).

## Core features (one route each, all under `WorkspaceLayout`)
| Route | Feature |
|-------|---------|
| `/` | Marketing landing page (standalone, no workspace chrome) |
| `/dashboard` | KPIs, study-trend charts, subject split, consistency heatmap, gamification |
| `/study` | Focus timer (Pomodoro 50m / Deep Work 90m / Custom), Monk Mode fullscreen, session review → XP + confetti |
| `/mistakes` | Mistake journal; new mistakes auto-scheduled for spaced revision |
| `/revisions` | Spaced-repetition revision queue (due / upcoming) |
| `/jee` | Syllabus/chapter progress tracker per subject |
| `/tracker` | Distraction logs |
| `/blocker` | Web blocker configuration (simulated) |
| `/coach` | Heuristic advisory ("AI coach") — `src/lib/coach-logic.ts` |
| `/analytics` | Full analytics dashboards |

## Gamification model
- 1000 XP per level. Session completion awards ~100–200 XP (scaled by focus score);
  timer auto-completion awards 200 XP. Streaks increment on `completeSession`.
- Stores seed at XP 3450 / Level 4 / streak 12 (demo).

See `ARCHITECTURE.md` for data flow, `DESIGN_SYSTEM.md` for the visual language,
`COMPONENT_MAP.md` for components, and `AI_CONTEXT.md` before writing code.
