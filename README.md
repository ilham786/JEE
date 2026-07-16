# FocusForge

FocusForge is a polished dark-mode study workspace and planner designed specifically for IIT-JEE and competitive exam aspirants. By consolidating study timers, mistake logs, revision planning, distraction blocking, progress tracking, and heuristic coaching under a unified, high-focus interface, FocusForge replaces scattered study tools with a centralized "study operating system."

---

## 1. Project Overview & Purpose

Preparing for high-stakes competitive examinations like IIT-JEE requires exceptional discipline, consistent revision, and rigorous analysis of mistakes. FocusForge hardwires these behaviors into the student’s daily routine. It helps aspirants:
*   Maintain focus discipline with Pomodoro, Deep Work, and Custom timers.
*   Systematically catalog and reschedule mistakes using standard spaced repetition cycles.
*   Consolidate syllabus checklists across Physics, Chemistry, and Mathematics.
*   Block digital distractions through simulated blacklist and exam modes.
*   Review progress trends, syllabus coverage ratios, and error type breakdowns.
*   Consult an adaptive heuristic AI study coach to identify weaknesses and prevent burnout.

Developed by **ILHAM FAROOQUE** (https://github.com/ilham786). Package name: `focusforge`.

---

## 2. Key Features

*   **Landing Page**: A high-fidelity, standalone marketing landing page introducing project modules, call-to-actions, and developer credits.
*   **Study Sessions**: Interactive study timer with customizable countdowns, active tick transitions (focus → break → idle), automated XP awards, Monk Mode, and synthesized ambient background audio loops (rainfall, white noise, lofi hums) generated locally using the browser's Web Audio API.
*   **Mistake Journal**: A structured log for tracking conceptual gaps, silliness, calculation, or time-pressure mistakes. Supports chapter filters, subject splits, and full-text search.
*   **Revision Planner**: An automated review scheduler. Based on SuperMemo-2 algorithms, it schedules mistakes for review at `[1, 3, 7, 15, 30]` days, highlighting due items on a calendar.
*   **JEE Prep Hub**: Syllabus visualizer mapping completeness percentages, solved PYQ counts, weak topics, and key formula reference blocks per subject.
*   **Distraction Blocker**: Custom blocker interface managing website blacklists, whitelist restrictions, schedule slots, and exam locks.
*   **Analytics Dashboard**: Visual charts plotting daily study trends, subject progress coverage, and mistake distribution metrics.
*   **AI Coach**: Adaptive chat assistant parsing user log histories to suggest study paths and recover from exhaustion.

---

## 3. Tech Stack

*   **Next.js 16.2.6 (App Router)**: Core React framework for routing and layout.
*   **React 19.2.4**: UI render layer.
*   **TypeScript 5**: Structural code safety and interfaces.
*   **Tailwind CSS v4**: CSS-first styles, customizing themes through `@theme` variables inside [globals.css](file:///c:/Users/Lenovo/Desktop/JEE/src/app/globals.css).
*   **Zustand**: Client-side state management persisted to browser local storage.
*   **Prisma ORM & SQLite**: Relational database structure set up for local setup (currently scaffolded but unwired from UI).
*   **Framer Motion**: UI card entrance fades and interactive micro-animations.
*   **Recharts**: Charting engine rendering analytics dashboards.
*   **canvas-confetti**: Celebration triggers when completing focus blocks.

---

## 4. Project Architecture & Folder Structure

```
FocusForge/
├── .agents/                 # AI Assistant skills & guidelines config
├── docs/                    # Architectural and developer guides
│   ├── AI_CONTEXT.md        # Dedicated guidelines for AI coding assistants
│   ├── ARCHITECTURE.md      # Systems logic and state persistence guides
│   ├── COMPONENTS.md        # Layout structure and primitive components reference
│   ├── DEVELOPMENT_GUIDE.md # Guides for extending routes, pages, and components
│   ├── PROJECT_OVERVIEW.md  # Core project objectives and philosophy overview
│   └── STYLING_GUIDE.md     # Visual guidelines and Tailwind v4 theme setups
├── prisma/                  # Relational database models and seed scripts
│   ├── dev.db               # SQLite database file (scaffolded, unwired from UI)
│   └── schema.prisma        # Prisma relational database structures
├── public/                  # Static assets and browser icons
├── src/
│   ├── app/                 # Next.js App Router routes & main stylesheets
│   │   ├── globals.css      # Core Tailwind CSS inputs and v4 theme tokens
│   │   ├── layout.tsx       # Standard page layout setup
│   │   └── page.tsx         # Standsalone landing page
│   ├── components/          # React structural UI components
│   │   ├── ui/              # Reusable design system cards & buttons
│   │   └── workspace-layout.tsx # Standard layout wrapper
│   ├── hooks/               # Custom hooks for keyboard inputs & mounts
│   ├── lib/                 # Auxiliary mathematical and heuristic scripts
│   └── store/               # Zustand persisted storage definitions
└── package.json             # Core dependency settings and script commands
```

For a detailed breakdown of state architecture and data flow pipelines, refer to [ARCHITECTURE.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/ARCHITECTURE.md).

---

## 5. Installation & Setup

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn package managers

### Steps
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Generate Prisma client**:
    ```bash
    npm run prisma:generate
    ```
3.  **Initialize the local SQLite database**:
    ```bash
    npm run db:push
    ```
4.  **Seed the local database** (adds initial demo models):
    ```bash
    npm run db:seed
    ```
5.  **Start the development server**:
    ```bash
    npm run dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 6. Build & Operations Commands

```bash
npm run dev              # Starts development environment with hot-reloading
npm run build            # Compiles client code for production release
npm run start            # Serves compiled output on local port 3000
npm run lint             # Runs ESLint analysis for code quality
npm run db:reset         # Resets local SQLite database and runs seeds
```

---

## 7. Environment Variables

Relational databases configuration variables are located in `.env` (derived from `.env.example`):
*   `DATABASE_URL`: Location URL of the target database (defaults to the SQLite dev file `"file:./dev.db"`).

> [!WARNING]
> Never commit actual secret keys or connection credentials to public version controls. Keep `.env` included in `.gitignore`.

---

## 8. Deployment Instructions

### Vercel / Netlify
FocusForge can be deployed directly to Vercel or similar host providers:
1.  Connect the target repository.
2.  Specify the framework preset as **Next.js**.
3.  Set the build command as `npm run build` and output directory as default.

### Static Export Hosting
Because all components are client-rendered, you can configure Next.js to export static files (`output: 'export'` inside `next.config.ts`) and host the output `out/` folder on static hosts like GitHub Pages or S3 buckets.

---

## 9. Performance & Responsive Design

### Performance
*   **Lazy Chart Rendering**: Heavy charting packages (Recharts) are protected by client mount hooks (`useIsClient`) to prevent SSR delays and optimize first-paint load times.
*   **Audio Synthesis**: The synthesizers in `sound-player.tsx` discard audio nodes immediately upon pauses or unmounts, preventing memory leaks in browser contexts.

### Responsive Design
*   **Fluid Grids**: Flexbox containers and grids adapt fluidly from mobile touch viewports (`grid-cols-1`) to widescreen monitors (`lg:grid-cols-4`).
*   **Monk Mode Layouts**: In Monk Mode, the top navigation adjusts and secondary dashboards collapse to allow the student to concentrate.

---

## 10. Coding Conventions

*   **Page Structures**: Every feature page inside `src/app/` must be a client component using `"use client"` and wrapped in the `WorkspaceLayout` component.
*   **Theme Integration**: Utilize Tailwind v4 variables (`text-physics`, `bg-accent-purple`) rather than hardcoded hex values to maintain styling parity.
*   **Zustand Mutations**: Mutate store parameters exclusively through actions specified in store controllers. Always maintain state immutability.
*   **Hydration Guards**: Wrap all client-only calculations or UI components reading localStorage data with the `useIsClient` hook.

---

## 11. Roadmap & Limitations

### Roadmap
*   **Database Integration**: Wire SQLite/Prisma to the UI to replace browser localStorage persistences.
*   **Authentication**: Support multiple student logins and sync progress to the cloud.
*   **Mobile App Packaging**: Bundle FocusForge as a desktop/mobile shell using Tauri.

### Known Limitations
*   **No Active Cloud DB**: The UI runs entirely client-side, using `localStorage`. Database seeds are only saved to SQLite for backend scaffolding.
*   **Simulated Blocker**: Distraction blocking and blocker domain interceptions are simulated in the client UI.
*   **Single User Profile**: The app does not support multi-student account toggles.

---

## 12. License & Attribution

### License
This project is licensed under the MIT License - see the [LICENSE](file:///c:/Users/Lenovo/Desktop/JEE/LICENSE) file for details.

### Developer Credits
Developed by **ILHAM FAROOQUE** — [GitHub Profile](https://github.com/ilham786)
