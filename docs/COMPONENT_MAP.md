# FocusForge — Component Map

## Layout / chrome (`src/components/`)
| Component | File | Responsibility | Relationships |
|-----------|------|----------------|---------------|
| `WorkspaceLayout` | `workspace-layout.tsx` | App shell for every feature page: renders `Sidebar` + `Header` + `SoundPlayer` + `<main>`. Owns mobile drawer state, runs the global 1s timer `tick`, closes drawer on route change. Takes `title`. | Wraps all pages except `/`. Reads `useStudyStore`. |
| `Sidebar` | `sidebar.tsx` | Collapsible desktop nav / off-canvas mobile drawer. Brand, profile+XP bar, nav list, Monk Mode badge. Filters nav down to Dashboard+Study in Monk Mode. | Uses `usePathname`, `useStudyStore`. `onMobileClose` prop. |
| `Header` | `header.tsx` | Top bar: page title, ambient-sound menu + volume, Monk Mode toggle, streak/level chips, mobile hamburger. | Reads/writes `useStudyStore`. `onMobileMenuToggle` prop. |
| `SoundPlayer` | `sound-player.tsx` | Headless. Synthesises ambient audio (rain / white-noise / lofi drone) via **Web Audio API** — no audio files. | Reads `ambientSound`, `volume` from `useStudyStore`. |

## Reusable UI primitives (`src/components/ui/`)
> These are the intended design-system primitives. **They are currently imported by zero
> feature pages** (pages hand-roll equivalents). Prefer them for new/edited UI to cut duplication.

**`card.tsx`**
- `Card` — glass/dark/accent surface, `rounded-xl p-4`, framer-motion hover/tap, optional `onClick`.
- `CardHeader` — title + subtitle + icon + action row.
- `CardBody` — `space-y-3` wrapper.
- `CardFooter` — top-bordered footer row.
- `EmptyState` — centered icon + title + description + action (use for "no data" views).

**`controls.tsx`**
- `Button` — `variant`: primary (purple→blue gradient) | secondary | danger | ghost; `size`: sm/md/lg; `loading`.
- `ProgressBar` — animated fill, `variant`: primary/success/warning/danger, optional label/%.
- `SectionHeader` — large `h2` page/section title + subtitle + action.

## Hooks (`src/hooks/`)
- `useKeyboardShortcuts` — global keys: **Alt+M** Monk Mode; **Alt+D/S/J/R** navigate
  Dashboard/Study/Journal/Revisions; **Alt+Space** pause/resume. Ignores text inputs. Registered by `WorkspaceLayout`.
- `useIsClient` — `useSyncExternalStore` hydration guard (false on server, true on client).

## Logic / lib (`src/lib/`)
- `spaced-rep.ts` — SuperMemo-2 + standard intervals `[1,3,7,15,30,60]` days; `calculateNextReviewDate`,
  `isOverdue`, `getOverdueItems`, `getUpcomingItems`.
- `coach-logic.ts` — heuristic advisory engine powering `/coach` (burnout/weak-topic detection, message picker).
- `db.ts` — Prisma client singleton (scaffolding; not used by current UI).

## State (`src/store/`) — see ARCHITECTURE.md
- `use-study-store.ts` — timer, gamification, blocker/Monk, ambient sound, distraction sim.
- `use-mistake-store.ts` — mistakes + per-subject syllabus/chapter progress.

## Route error/loading UI (`src/app/`)
- `loading.tsx` (skeleton), `not-found.tsx` (404), `global-error.tsx` (recovery boundary),
  `robots.ts`, `sitemap.ts`.
