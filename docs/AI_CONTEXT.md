# FocusForge — AI Agent Context

This context guide is designed specifically for AI coding assistants (LLMs) working on the FocusForge repository. Review this file before proposing or executing code changes to ensure compatibility with Next.js, state management strategies, and styling constraints.

---

## 1. ⚠️ Critical Warnings

### "This is NOT the Next.js you know"
*   **Version**: Next.js 16.2.6, React 19.2.4.
*   **App Router & Routing**: Do not use standard router APIs from memory without verifying compatibility. Refer to Next.js documentation inside `node_modules/next/dist/docs/` when encountering routing warnings.
*   **Tailwind CSS v4**: This project uses Tailwind CSS v4 (`@tailwindcss/postcss`). There is **no tailwind.config.js**. All configuration, customizations, custom theme variables, and glassmorphic presets are defined directly inside `src/app/globals.css` using the `@theme` directive.

---

## 2. Technologies & Libraries

*   **Core**: Next.js 16 (App Router), React 19, TypeScript (Strict).
*   **State Layer**: Zustand (`zustand/middleware/persist` persisting stores to `localStorage`).
*   **Database (Inactive scaffolding)**: Prisma client mapping SQLite database `prisma/dev.db`.
*   **Visualizations**: Recharts.
*   **Animations**: Framer Motion.
*   **Icons**: Lucide React.
*   **Confetti**: canvas-confetti.
*   **Audio Synthesis**: Browser Web Audio API (Synthesizing sounds in real-time).

---

## 3. Important Coding & Styling Patterns

*   **Client Components**: Almost all feature directories under `src/app/` are Client Components marked with `"use client"`.
*   **Standard Page Structure**: Wrap all feature components in `<WorkspaceLayout title="Page Name">` to inherit the global timer, sidebars, header values, and keyboard shortcuts.
*   **Subject Accent Palette**: Maintain strict color association tags for academic subjects:
    *   **Physics** = `--color-physics` (blue / `#3b82f6`)
    *   **Chemistry** = `--color-chemistry` (green / `#10b981`)
    *   **Maths** = `--color-maths` (amber / `#f59e0b`)
*   **UI Primitives**: Prefer importing shared primitives from `src/components/ui/` (`Card`, `Button`, `ProgressBar`, `EmptyState`, `SectionHeader`) rather than hand-rolling raw divs or button tags.
*   **Interactive motion animations**: Wrap clickable list items or buttons in Framer Motion wrappers. Use standard presets: `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}`.

---

## 4. Coding Conventions

*   **Directory Naming**: `kebab-case` (e.g. `src/app/study-workspace/`).
*   **File Naming**: `kebab-case` (e.g. `use-study-store.ts`, `sound-player.tsx`).
*   **Component Naming**: `PascalCase` (e.g. `WorkspaceLayout`, `Sidebar`).
*   **State Mutation Rules**: State modifications must be performed exclusively by calling Zustand store actions. Never mutate store objects directly outside store methods.

---

## 5. File Constraints & Safety Zones

### 🛡️ Files that should rarely or never be modified:
*   [src/lib/spaced-rep.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/lib/spaced-rep.ts): Contains mathematical SuperMemo-2 calculations driving study review intervals.
*   [src/components/sound-player.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/components/sound-player.tsx): Custom Web Audio API synthesizer. Random math loops are intentional to create static white noise and rain gusts.
*   [prisma/schema.prisma](file:///c:/Users/Lenovo/Desktop/JEE/prisma/schema.prisma): Do not modify relational schemas unless tasked with database wiring.

### 🟢 Safe Zones for Changes:
*   **UI dashboard views** under `src/app/` (`/dashboard`, `/study`, `/mistakes`, `/revisions`, `/jee`, `/analytics`).
*   **Shared Primitives** in `src/components/ui/` (`card.tsx`, `controls.tsx`).
*   **Styling Customizations** added to the `@theme` block in `src/app/globals.css`.

---

## 6. Technical Debt & Pending Improvements

*   **Feature Page Duplication**: Several feature routes (e.g. `/study`, `/mistakes`) currently hand-roll local `.glass-panel` divs and raw `<button>` elements instead of importing reusable primitives.
*   **Database Disconnection**: A Prisma client and SQLite database configuration exist, but the UI depends entirely on Zustand/localStorage for data persistence.
*   **Accessibility Constraints**:
    *   Viewport settings in `layout.tsx` prevent user scaling (`userScalable: false`), which violates WCAG guidelines.
    *   No standard focus outlines (`:focus-visible`) are configured in the global CSS template.
    *   No dynamic keyboard shortcut indicators or visual screen-reader attributes are present on icon buttons.
*   **Mock Data**: Heatmaps, focus score averages, and simulated website logs use inline constants and random math generators. These should eventually be derived from actual study history in Zustand storage.

---

## 7. Common Workflows

*   `npm run dev` launches the hot-reloading development server on port `3000`.
*   `npm run build` triggers compilation. **Always run builds before committing changes** to verify that TypeScript static analysis passes.
*   `npm run lint` executes ESLint style rules.
*   `npm run db:push` / `npm run db:seed` synchronizes and updates the unused SQLite scaffolding.
