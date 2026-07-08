# FocusForge — AI Agent Context

Read this first. It captures conventions and constraints that aren't obvious from the code.

## ⚠️ Critical: this Next.js differs from your training data
`AGENTS.md` (repo root) states: **"This is NOT the Next.js you know"** — this version has
breaking API/convention changes. **Before writing any Next.js code, read the relevant guide in
`node_modules/next/dist/docs/`** and heed deprecation notices. Do not assume router/config APIs
from memory. Current version: **Next.js 16.2.6, React 19, App Router**.

## Tech stack
Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS **v4** (CSS-first,
`@theme` in `globals.css`, **no `tailwind.config.js`**) · Zustand + `persist` (localStorage) ·
Recharts · framer-motion · lucide-react · canvas-confetti · Prisma/SQLite (scaffolded, unused) ·
Web Audio API (ambient sound). Path alias `@/*` → `src/*`.

## Coding conventions
- Feature pages are `"use client"` and render inside `<WorkspaceLayout title="…">`. `/` is the exception.
- Styling is **Tailwind utilities + the design tokens/utilities in `globals.css`**. Use token
  classes (`bg-accent-purple`, `text-physics`, `border-card-border`), not raw hexes.
- Subject color-coding is canonical: Physics=blue, Chemistry=green, Maths=amber (see DESIGN_SYSTEM.md).
- Panels: `.glass-panel` + `rounded-xl`. Interactions use framer-motion `whileHover`/`whileTap`.
- Icons from `lucide-react`. Filenames are kebab-case; components PascalCase; hooks `use-*`.
- State mutations go through Zustand store actions only — never mutate store objects directly.

## Design principles
Dark, focused, "premium tool" feel. Reduce dopamine loops (Monk Mode hides nav + widgets).
Gamify progress (XP/level/streak) without clutter. Consistent spacing, `max-w-7xl` content column.

## Reusable patterns (prefer over reinventing)
- Shared primitives in `src/components/ui/` (`Card`, `Button`, `ProgressBar`, `EmptyState`,
  `SectionHeader`). ⚠ Pages currently hand-roll these with `.glass-panel` divs + raw `<button>`s
  — **the primitives are imported by zero pages today**. For new UI prefer the primitive; when
  editing an existing page, match its local pattern unless you're deliberately consolidating.
- Spaced repetition: reuse `src/lib/spaced-rep.ts` (don't re-derive intervals).
- Hydration-safe client-only values: gate on a `mounted` flag or `useIsClient()` — render
  placeholders on the server pass (see how dashboard charts guard Recharts).

## Known constraints
- **No backend wired up.** Data = Zustand + localStorage, seeded with demo values. Prisma
  schema/`db.ts` exist but nothing in the UI queries them. Don't assume DB reads/writes work.
- **Mock data**: dashboard/analytics use inline constants and `Math.random()` for some charts,
  heatmaps, and the distraction simulator. `Math.random()` in `sound-player.tsx` is intentional
  audio noise synthesis — leave it.
- **Single implicit user** ("ILHAM FAROOQUE", avatar "AS"); no auth.
- `pauseSession()` sets `status` to `"idle"` (there is no dedicated `paused` state) — intentional.
- Landing `/` renders its own background, outside `WorkspaceLayout`.

## Performance guidelines
- Keep feature pages client components but lazy-guard heavy client libs (Recharts) behind a mount flag.
- Reuse store selectors; avoid duplicating derived calculations across components.
- No premature optimization — the app is small; measure before refactoring.

## Accessibility standards (current state + gaps)
- Present: `lang="en"`, `color-scheme: dark`, `aria-label` on icon buttons, semantic headings,
  keyboard shortcuts, mobile 44px-ish touch targets via touch utilities.
- **Gaps / opportunities:** `layout.tsx` viewport sets `maximumScale:1, userScalable:false`
  (blocks pinch-zoom — a WCAG concern); `globals.css` has **no** `:focus-visible` outline rules
  or `prefers-reduced-motion` handling; some interactive `<div>`s/nav items lack full ARIA and
  keyboard semantics. Improve these when touching the relevant files.

## Common commands
```
npm run dev            # dev server (hot reload)
npm run build          # production build (the gate — must pass)
npm run start          # serve production build on :3000
npm run lint           # eslint
npm run db:push        # prisma schema → sqlite (backend work only)
npm run db:seed        # tsx prisma/seed.ts
npm run prisma:generate
```
Helper: `Start-Localhost-3000.cmd` / `start-localhost-3000.ps1` launch the app on :3000.

## Areas intentionally left unchanged (don't "fix" without reason)
- Zustand stores' business logic (XP math, streak/timer transitions, spaced intervals).
- `lib/coach-logic.ts`, `lib/spaced-rep.ts` algorithms.
- `sound-player.tsx` Web-Audio synthesis (its randomness is correct).
- Prisma schema, seed, env config, routing behavior, feature workflows.

## Future improvement opportunities
1. **Wire Prisma/SQLite to the UI** (replace localStorage demo data with real persistence + a user).
2. **Adopt `src/components/ui/` primitives across pages** to remove duplicated `.glass-panel`/button markup.
3. **Tokenise** the hardcoded `#7c4ce6` purple-hover shade; standardise radii.
4. **Accessibility**: re-enable zoom, add `:focus-visible` + `prefers-reduced-motion`, complete ARIA.
5. Replace `Math.random()`/mock dashboard data with values derived from store history.
6. Extract repeated KPI-stat and modal blocks into shared components.
