# FocusForge Developer Guide

This document details the standards and procedures for extending the FocusForge codebase, including creating routes, writing components, managing state, handling errors, and optimizing performance.

---

## 1. Adding a New Route / Page

FocusForge uses Next.js App Router. To add a new page:

1.  **Create a folder** inside `src/app/` matching your desired path (e.g. `src/app/milestones/`).
2.  **Add a `page.tsx` file** inside that folder.
3.  **Structure the page** as a client component wrapping its content in the standard `WorkspaceLayout` shell:

```tsx
"use client";

import { WorkspaceLayout } from "@/components/workspace-layout";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/controls";

export default function MilestonesPage() {
  return (
    <WorkspaceLayout title="Milestones">
      {/* 1. Header Section */}
      <SectionHeader 
        title="Exam Milestones" 
        subtitle="Track your target milestones and PYQ sprints."
      />
      
      {/* 2. Page Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card animateHover>
          <CardHeader title="Mock Test Sprints" icon={null} />
          <CardBody>
            <p className="text-sm text-gray-400">
              Content details here...
            </p>
          </CardBody>
        </Card>
      </div>
    </WorkspaceLayout>
  );
}
```

4.  **Register the Navigation Link** inside [src/components/sidebar.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/components/sidebar.tsx) in the navigation item array so users can access it from the dashboard shell.

---

## 2. Creating & Organizing Components

Follow these rules when adding or modifying React components:

*   **Location**:
    *   If a component is reused across multiple feature routes (e.g. progress bars, modal shells), place it in `src/components/ui/`.
    *   If a component is unique to a single feature (e.g. a specialized timer visualization for `/study`), place it directly inside that route's subdirectory or a local `components` subfolder.
*   **File Naming**:
    *   Directories: `kebab-case` (e.g. `src/app/study-workspace/`).
    *   Files: `kebab-case` (e.g. `sound-player.tsx`, `use-study-store.ts`).
    *   Components inside files: `PascalCase` (e.g. `WorkspaceLayout`).
*   **Best Practices**:
    *   Always add TypeScript typing interfaces for props.
    *   Utilize Lucide icons for graphic indicators.
    *   Implement standard Tailwind v4 theme variables (`text-physics`, `bg-accent-purple`) instead of hardcoded hex values.

---

## 3. Extending App State & Zustand Stores

State in FocusForge is fully client-side and persisted in `localStorage` via Zustand middleware.

*   `useStudyStore` ([src/store/use-study-store.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/store/use-study-store.ts)): Timer parameters, blocker domain configurations, ambient sounds, volume levels, Monk Mode status, and overall user XP/Level metrics.
*   `useMistakeStore` ([src/store/use-mistake-store.ts](file:///c:/Users/Lenovo/Desktop/JEE/src/store/use-mistake-store.ts)): Mistake logs, spaced-repetition schedules, chapter completion metrics, weak topic flags, and syllabus trackers.

### Adding state or actions:
1.  Add the new property or function signature to the typescript interface (e.g. `StudyState` or `MistakeState`).
2.  Add the property default value in the initializer.
3.  Add the updater action. **Always update state immutably**:
    ```typescript
    // Correct Store Mutation
    set((state) => ({
      blockedWebsites: [...state.blockedWebsites, newDomain]
    }));
    ```
4.  **Store Persistence Notice**: Both stores persist to local storage. Any change to the state structure will automatically update the browser's local state, but if you introduce breaking structure changes, you may need to clear local storage (`localStorage.clear()`) during testing.

---

## 4. Hydration & Client-Only Value Safeguarding

Because Next.js pre-renders client components statically on the server (SSG), referencing browser-only APIs (like `localStorage` or `window`) during initial evaluation will trigger React hydration mismatches.

### Hydration Guard Pattern:
Always protect state properties loaded from Zustand stores inside cards/charts by wrapping them in a hydration mount check, or using our `useIsClient` hook:

```tsx
import { useIsClient } from "@/hooks/use-is-client";

export function ClientOnlyComponent() {
  const isClient = useIsClient();

  if (!isClient) {
    // Return a skeleton loader or layout placeholder matching layout dimensions
    return <div className="h-40 glass-panel animate-pulse rounded-xl" />;
  }

  return (
    <div className="h-40 glass-panel rounded-xl">
      {/* Client-safe contents from Zustand stores */}
    </div>
  );
}
```

---

## 5. Error Handling & Recovery Boundaries

*   **Global Error Boundaries**: The workspace layout uses Next.js error page routing boundaries. Any render-level crash in sub-pages will trigger [global-error.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/app/global-error.tsx) or local `error.tsx` templates, allowing users to recover by resetting client states.
*   **User Input Sanitization**: When building forms (such as logging a new mistake or adding blocker domains), always trim user values and block empty submissions to prevent database or state contamination.

---

## 6. Performance Recommendations

*   **Zustand Selector Filtering**: To prevent components from re-rendering when unrelated store variables change, always use selective destructuring or store selectors:
    ```typescript
    // Good selector mapping
    const monkModeEnabled = useStudyStore((state) => state.monkModeEnabled);
    ```
*   **Lazy Load Libraries**: Dashboards and analytics charts depend on Recharts. Recharts has a heavy bundle weight. Keep charts mounted strictly when `isClient === true`.
*   **Audio Node Recycling**: When coding synthesizers inside `sound-player.tsx`, ensure all created Web Audio nodes (Oscillators, Gain nodes, BiquadFilters) are properly disconnected and garbage collected when the player pauses or the component unmounts.
