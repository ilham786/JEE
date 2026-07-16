# FocusForge — Developer Rules & Commands (CLAUDE.md)

Refer to this card for quick operational commands, build processes, and coding style rules. For complete context indices and directory structures, see [AGENTS.md](file:///c:/Users/Lenovo/Desktop/JEE/AGENTS.md).

---

## ⚡ 1. Build & Database Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **Start Dev Server** | `npm run dev` | Runs hot-reloading server on port 3000 |
| **Verify Lint Rules** | `npm run lint` | Runs ESLint check for style violations |
| **Production Build** | `npm run build` | Compiles app statically (TS compilation + router check) |
| **Serve Production** | `npm run start` | Serves compiled directory locally |
| **Database Sync** | `npm run db:push` | Updates SQLite schema using Prisma schemas |
| **Database Seed** | `npm run db:seed` | Inserts mock data objects |
| **Database Reset** | `npm run db:reset`| Resets SQLite db file and runs seeds |

---

## 📜 2. Quick Code Guidelines

*   **App Shell Layout**: Every route inside `src/app/` (except landing `/`) must use `"use client"` and wrap its contents inside the `<WorkspaceLayout title="Page Name">` shell:
    ```tsx
    import { WorkspaceLayout } from "@/components/workspace-layout";
    
    export default function FeaturePage() {
      return (
        <WorkspaceLayout title="Feature Module">
          {/* page content */}
        </WorkspaceLayout>
      );
    }
    ```
*   **State Management**: Retrieve properties using selective destructurings from Zustand stores (`useStudyStore` and `useMistakeStore`):
    ```typescript
    const monkModeEnabled = useStudyStore((state) => state.monkModeEnabled);
    ```
*   **Hydration Checks**: Guard client-only states or layout components (Recharts) against Next.js pre-rendering mismatches by using the `useIsClient()` hook.
*   **Theme Integration**: Utilize Tailwind CSS v4 variables (`text-physics`, `bg-accent-purple`) rather than hardcoded hex values to maintain visual parity with the design system tokens.
