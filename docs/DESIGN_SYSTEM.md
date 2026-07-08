# FocusForge — Design System

Dark-only, glassmorphic, subject-color-coded. Tokens live in `src/app/globals.css` under
Tailwind v4's `@theme` block (Tailwind v4 uses CSS-first config — **no `tailwind.config.js`**).

## Colors (`@theme` tokens → use as Tailwind classes, e.g. `text-physics`, `bg-accent-purple`)
| Token | Value | Use |
|-------|-------|-----|
| `--color-background` | `#090a0f` | App background (near-black) |
| `--color-foreground` | `#f3f4f6` | Default text |
| `--color-card-bg` | `rgba(13,15,22,0.7)` | Panel surface base |
| `--color-card-border` | `rgba(255,255,255,0.06)` | Panel borders |
| `--color-card-hover-border` | `rgba(255,255,255,0.15)` | Panel hover border |
| `--color-physics` | `#3b82f6` (blue) | **Physics** subject accent |
| `--color-chemistry` | `#10b981` (green) | **Chemistry** subject accent |
| `--color-maths` | `#f59e0b` (amber) | **Maths** subject accent |
| `--color-accent-purple` | `#8b5cf6` | Primary brand / CTAs / active nav |
| `--color-accent-red` | `#ef4444` | Danger / overdue |

**Subject color-coding is a core convention** — Physics=blue, Chemistry=green, Maths=amber.
Reuse these tokens; never introduce a parallel subject palette. Ad-hoc states use Tailwind
defaults (`green-*`, `orange-*`, `red-*`) — the brand purple hover shade `#7c4ce6` currently
appears as a hardcoded literal in several buttons (candidate for tokenising).

## Typography
- **Geist Sans** (body) and **Geist Mono** (timers / tabular numerals) loaded via
  `next/font` in `layout.tsx` (`--font-geist-sans`, `--font-geist-mono`); system-ui fallback.
- Scale in use: page titles `text-2xl font-bold`, card titles `text-base font-bold`,
  KPI numbers `text-2xl font-black`, timer `font-mono … tabular-nums`, meta `text-xs`,
  micro-labels `text-[10px]/[9px]` uppercase tracked. Body text `text-gray-400` for secondary.

## Spacing & layout
- Page content wrapper: `max-w-7xl mx-auto space-y-4 md:space-y-6` (in `WorkspaceLayout`).
- Main padding: `p-3 md:p-6` (tighter in Monk Mode).
- Panels: `p-4`–`p-6`. Card grids use `gap-4`/`gap-6`, responsive `grid-cols-1 sm:… lg:…`.
- **Radius**: panels/cards `rounded-xl`, inputs/small `rounded-lg`, pills `rounded-full`.
  Keep `rounded-xl` for glass panels.

## Glass & effect utilities (globals.css)
- `.glass-panel` — canonical frosted surface (bg + `backdrop-blur` + border + shadow).
  Pair with a `rounded-xl` utility.
- `.glass-panel-hover` — adds lift/border/shadow transition on hover.
- `.glass-input` — frosted input with purple focus ring.
- `.radial-glow` + `.glow-physics|chemistry|maths` — ambient blurred glows.
- `.pulse-glow-effect` — slow opacity pulse (e.g. Monk Mode badge).
- Mobile: `.mobile-backdrop`, `.mobile-scroll-x`, `.safe-area-bottom|top`.

## Component guidelines
- Prefer the shared primitives in `src/components/ui/` (`Card`, `Button`, `ProgressBar`,
  `EmptyState`, `SectionHeader`) — see `COMPONENT_MAP.md`. **Note:** feature pages currently
  hand-roll `.glass-panel` divs and raw `<button>`s instead of importing these, so match the
  surrounding file's pattern when editing, and prefer the shared primitive for new UI.
- Interactive elements get hover (`whileHover` scale/lift) and tap feedback via framer-motion.
- Active nav uses a purple left-bar via a shared `layoutId="active-indicator"`.
