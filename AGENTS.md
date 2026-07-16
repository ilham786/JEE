<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FocusForge — AI Agent Guide & Workspace Navigation Hub

Welcome to FocusForge. This document acts as the core onboarding and working guide for AI coding assistants. Use it to navigate the codebase, understand the technical layout, gather contextual files in priority order, and align modifications with established project conventions.

---

## 🔒 1. Context Priority & Reference Index

Before initiating any codebase analysis, design updates, or logic changes, gather project context by reading the reference documents in the following order:

1.  **[docs/AI_CONTEXT.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/AI_CONTEXT.md)**: Standard coding patterns, files to protect, and active technical debt checklist.
2.  **[docs/PROJECT_OVERVIEW.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/PROJECT_OVERVIEW.md)**: Product goals, target student personas (IIT-JEE), and product design philosophy.
3.  **[docs/ARCHITECTURE.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/ARCHITECTURE.md)**: Systems architecture details, data flows, and state configurations.
4.  **[docs/COMPONENTS.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/COMPONENTS.md)**: Interface layout shells, prop signatures, and UI primitives catalog.
5.  **[docs/STYLING_GUIDE.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/STYLING_GUIDE.md)**: CSS architecture, Tailwind v4 theme variables, and visual tokens.
6.  **[docs/DEVELOPMENT_GUIDE.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/DEVELOPMENT_GUIDE.md)**: Route addition tutorials, component structures, store updates, and hydration guards.
7.  **[docs/CHANGELOG.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/CHANGELOG.md)**: History of updates, current version stats, and roadmap.

*Note: Legacy reference sheets [docs/COMPONENT_MAP.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/COMPONENT_MAP.md) and [docs/DESIGN_SYSTEM.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/DESIGN_SYSTEM.md) contain redirects pointing to the updated consolidated documents.*

---

## 🗺️ 2. Project Directory Navigation

Refer to this visual map to locate code modules quickly:

| Directory | Purpose | Core Files |
| :--- | :--- | :--- |
| **`src/app/`** | Next.js App Router Feature Pages | [globals.css](file:///c:/Users/Lenovo/Desktop/JEE/src/app/globals.css) (v4 Theme Config), [layout.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/app/layout.tsx) (Fonts/Meta), Page folders (`/dashboard`, `/study`, `/mistakes`, etc.) |
| **`src/components/`** | Structural App Shell Elements | [workspace-layout.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/components/workspace-layout.tsx) (App shell), [sidebar.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/components/sidebar.tsx), [header.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/components/header.tsx), [sound-player.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/components/sound-player.tsx) (Web Audio synth) |
| **`src/components/ui/`** | Reusable Design System Primitives | [card.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/components/ui/card.tsx) (Translucent panels), [controls.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/components/ui/controls.tsx) (Standard buttons, progress bars) |
| **`src/store/`** | Zustand Persisted State Layer | [use-study-store.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/store/use-study-store.ts) (Timer/Blocker stats), [use-mistake-store.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/store/use-mistake-store.ts) (Syllabus/Mistakes logs) |
| **`src/hooks/`** | Helper Event Controllers | [use-keyboard-shortcuts.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/hooks/use-keyboard-shortcuts.ts) (Alt navigation keys), [use-is-client.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/hooks/use-is-client.ts) (Hydration guard) |
| **`src/lib/`** | Analytical and Algorithmic Logic | [spaced-rep.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/lib/spaced-rep.ts) (SuperMemo spaced rep), [coach-logic.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/lib/coach-logic.ts) (Advisory heuristics) |
| **`prisma/`** | Relational Database Scaffolding | [schema.prisma](file:///c:/Users/Lenovo/Desktop/JEE/prisma/schema.prisma) (SQLite database maps, currently unwired from UI) |

---

## ⚙️ 3. Operational Guidelines for AI Coding Agents

When working on this repository, you **must** follow these engineering standards:

### Context Checking
*   Always inspect the priority context files in the `docs/` folder before suggesting additions.
*   Verify logic constraints: do not write direct database calls inside page routes—data transactions are governed exclusively by client-side Zustand store states today.

### Component Reusability & Minimal Change
*   Do not rewrite or duplicate visual panels. Check [docs/COMPONENTS.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/COMPONENTS.md) and reuse existing primitives from `src/components/ui/`.
*   Maintain targeted changes: keep edits scoped tightly to the assigned issue. Avoid sweeping refactoring loops unless explicitly directed.

### Styling & Theme Adherence
*   Never use hardcoded hex styles or introduce ad-hoc color palettes. Utilize Tailwind v4 colors (`text-physics`, `bg-accent-purple`) configured inside the `@theme` block in `globals.css`.
*   Maintain the dark, high-focus glassmorphic style. Ensure cards use the `.glass-panel` utilities and maintain Framer Motion hover presets.

### Safe Areas & Protected Files
*   **Do Not Modify**: Spaced repetition logic (`spaced-rep.ts`), synthetic audio synthesisers (`sound-player.tsx`), or database schema structure maps (`schema.prisma`) without explicit instructions.
*   **Safe to Modify**: Feature page layouts (`src/app/`), primitive visual elements (`src/components/ui/`), and CSS customization properties.

### Document Maintenance
*   Always maintain documentation synchronization. If you add routes, components, or store mutations, update the corresponding guides under `docs/` (`COMPONENTS.md`, `STYLING_GUIDE.md`, etc.) and append change descriptions to `docs/CHANGELOG.md`.
