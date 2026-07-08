# FocusForge — Architecture

## Folder structure
```
src/
  app/                     # Next.js App Router
    layout.tsx             # Root layout: fonts, metadata, viewport, <body>
    page.tsx               # "/" marketing landing (standalone, no WorkspaceLayout)
    globals.css            # Tailwind v4 @theme tokens + utility classes
    loading.tsx / not-found.tsx / global-error.tsx
    robots.ts / sitemap.ts
    dashboard/ study/ mistakes/ revisions/ jee/
    tracker/ blocker/ coach/ analytics/   # one page.tsx each (all "use client")
  components/
    workspace-layout.tsx   # app shell (sidebar + header + main)
    sidebar.tsx  header.tsx  sound-player.tsx
    ui/                    # card.tsx, controls.tsx (shared primitives)
  hooks/                   # use-keyboard-shortcuts, use-is-client
  lib/                     # spaced-rep, coach-logic, db (Prisma singleton)
  store/                   # use-study-store, use-mistake-store (Zustand)
  types/                   # tauri.d.ts
prisma/                    # schema.prisma (+ seed.ts) — SQLite, NOT wired to UI
docs/                      # this documentation
```

## Routing
- **App Router**, file-based. Every feature route is a client component rendering
  `<WorkspaceLayout title="…">{content}</WorkspaceLayout>`. `/` is the only route outside the shell.
- All routes prerender as **static** (`○`) — no server data fetching, no API routes, no middleware.
- Navigation via `next/link` and `useRouter().push` (keyboard shortcuts). `usePathname` drives active nav state.

## State management (the real data layer)
Two **Zustand** stores, each wrapped in `persist` → `localStorage`:
- **`useStudyStore`** (`focusforge-study-storage`): xp/level/streaks; timer (`status`:
  idle|focus|break, `mode`, `durationMinutes`, `timeLeft`, `activeSession`); Monk Mode;
  blocked websites + distraction simulation; ambient sound + volume. Actions include
  `startSession`, `pauseSession` (⚠ sets status to `"idle"`, no distinct paused state),
  `resumeSession`, `tick`, `completeSession`, `cancelSession`, `addXp`, `toggleMonkMode`, etc.
- **`useMistakeStore`** (`focusforge-mistakes-storage`): `mistakes[]` and `syllabus`
  (Physics/Chemistry/Maths → `ChapterProgress[]`). Actions: `addMistake` (auto-schedules first
  revision +1 day), `reviseMistake` (advances spaced interval `[1,3,7,15,30]`), weak-topic and
  chapter updates.

Both stores are **seeded with hardcoded demo data** (sample mistakes, syllabus, XP 3450/Lvl 4).
Some dashboards additionally use inline mock/`Math.random` data for charts/heatmaps.

## Data flow
```
User action (page/header/sidebar)
   → Zustand store action (set/get)   → persisted to localStorage
   → subscribed components re-render (KPIs, timer, charts)
WorkspaceLayout runs setInterval(tick, 1000) while status ∈ {focus, break}
   → tick decrements timeLeft, auto-transitions focus→break→idle, awards XP
Session completion → addXp + streak bump → canvas-confetti
```

## Persistence & backend
- **Now:** browser `localStorage` only (survives reload, per-device, single implicit user).
- **Scaffolded (unused):** `prisma/schema.prisma` (SQLite `dev.db`) with a full relational model
  and `lib/db.ts` singleton. Scripts exist (`db:push`, `db:seed`, `db:reset`, `prisma:generate`)
  but no UI code queries Prisma yet. Wiring this up is a future task, not current behavior.

## Build/runtime notes
- Tailwind v4 via `@tailwindcss/postcss` (see `postcss.config.mjs`); tokens in `globals.css`,
  **no `tailwind.config.js`**. Path alias `@/*` → `src/*` (`tsconfig.json`).
- `next.config.ts` is effectively empty (defaults).
