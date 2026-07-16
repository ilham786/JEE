<p align="center">
  <img src="https://img.icons8.com/nolan/128/brain.png" alt="FocusForge Logo" width="80" />
</p>

<h1 align="center">FocusForge</h1>

<p align="center">
  <strong>A polished, dark-mode study workspace and planner designed specifically for IIT-JEE and competitive exam aspirants.</strong>
</p>

<p align="center">
  FocusForge consolidates study timers, mistake logs, revision planning, distraction blocking, progress tracking, and heuristic coaching under a unified, high-focus interface—replacing scattered study tools with a centralized "study operating system."
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg?style=for-the-badge&color=8b5cf6" alt="Version" />
  <img src="https://img.shields.io/badge/license-proprietary-red.svg?style=for-the-badge&color=ef4444" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React" />
</p>

---

## 📖 Table of Contents
*   [1. Project Overview & Purpose](#1-project-overview--purpose)
*   [2. Key Features](#2-key-features)
*   [3. Tech Stack](#3-tech-stack)
*   [4. Project Architecture & Folder Structure](#4-project-architecture--folder-structure)
*   [5. Installation & Setup](#5-installation--setup)
*   [6. Build & Operations Commands](#6-build--operations-commands)
*   [7. Environment Variables](#7-environment-variables)
*   [8. Deployment Instructions](#8-deployment-instructions)
*   [9. Performance & Responsive Design](#9-performance--responsive-design)
*   [10. Coding Conventions](#10-coding-conventions)
*   [11. Roadmap & Limitations](#11-roadmap--limitations)
*   [12. License & Attribution](#12-license--attribution)

---

## 1. Project Overview & Purpose

Preparing for high-stakes competitive examinations like IIT-JEE requires exceptional discipline, consistent revision, and rigorous analysis of mistakes. FocusForge hardwires these behaviors into the student’s daily routine. It helps aspirants:

*   **Timer Control**: Maintain focus discipline with Pomodoro, Deep Work, and Custom timers.
*   **Journal Logs**: Systematically catalog and reschedule mistakes using standard spaced repetition cycles.
*   **Syllabus Integration**: Consolidate syllabus checklists across Physics, Chemistry, and Mathematics.
*   **Distraction Shield**: Block digital distractions through simulated blacklist and exam modes.
*   **Visual Dashboards**: Review progress trends, syllabus coverage ratios, and error type breakdowns.
*   **Adaptive Heuristics**: Consult an adaptive heuristic AI study coach to identify weaknesses and prevent burnout.

Developed by **ILHAM FAROOQUE** ([GitHub Profile](https://github.com/ilham786)). Package name: `focusforge`.

---

## 🚀 2. Key Features

| Module | Feature Type | Description |
| :--- | :--- | :--- |
| **Landing Page** | 🎨 Hero Hub | A high-fidelity, standalone marketing landing page introducing project modules, call-to-actions, and developer credits. |
| **Study Sessions** | ⏱️ Focused Timers | Interactive study timer with customizable countdowns, active tick transitions (focus &rarr; break &rarr; idle), automated XP awards, Monk Mode, and synthesized ambient background audio loops (rainfall, white noise, lofi hums) generated locally using the browser's Web Audio API. |
| **Mistake Journal** | 📓 Spaced Logging | A structured log for tracking conceptual gaps, silliness, calculation, or time-pressure mistakes. Supports chapter filters, subject splits, and full-text search. |
| **Revision Planner** | 📅 Smarter Reviews | An automated review scheduler. Based on SuperMemo-2 algorithms, it schedules mistakes for review at `[1, 3, 7, 15, 30]` days, highlighting due items on a calendar. |
| **JEE Prep Hub** | 🎯 Syllabus Progress | Syllabus visualizer mapping completeness percentages, solved PYQ counts, weak topics, and key formula reference blocks per subject. |
| **Distraction Blocker** | 🔒 Blocker Registry | Custom blocker interface managing website blacklists, whitelist restrictions, schedule slots, and exam locks. |
| **Analytics Dashboard**| 📊 Data Charts | Visual charts plotting daily study trends, subject progress coverage, and mistake distribution metrics. |
| **AI Coach** | 🤖 Advisory | Adaptive chat assistant parsing user log histories to suggest study paths and recover from exhaustion. |

---

## 🛠 3. Tech Stack

| Dependency | Target Version | Project Role |
| :--- | :--- | :--- |
| **Next.js** | `16.2.6` (App Router) | Core React framework for routing and layouts. |
| **React** | `19.2.4` | UI rendering library. |
| **TypeScript** | `5` | Strong type analysis and interface safety. |
| **Tailwind CSS** | `v4` | CSS-first styling, using custom `@theme` variables inside [globals.css](file:///c:/Users/Lenovo/Desktop/JEE/src/app/globals.css). |
| **Zustand** | `^5.0.13` | Client-side state management persisted to browser local storage. |
| **Prisma ORM** | `^6.19.3` | Relational database client scaffolding. |
| **SQLite** | Local dev | Development database configured (currently unwired from UI). |
| **Framer Motion** | `^12.40.0` | UI card entrance fades and interactive micro-animations. |
| **Recharts** | `^3.8.1` | Charting engine rendering analytics dashboards. |
| **canvas-confetti** | `^1.9.4` | Completion celebration effects. |

---

## 📂 4. Project Architecture & Folder Structure

FocusForge's directories are structured to isolate configurations, documentation folders, database models, layout components, and Zustand store parameters:

<details>
<summary>📁 Click to expand / collapse full directory tree structure</summary>

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
</details>

For a detailed breakdown of state architecture and data flow pipelines, refer to [ARCHITECTURE.md](file:///c:/Users/Lenovo/Desktop/JEE/docs/ARCHITECTURE.md).

---

## 📦 5. Installation & Setup

### Prerequisites
*   **Node.js** (v18 or higher recommended)
*   **npm** or **yarn** package managers

### Setup Steps
Follow these instructions to run the workspace locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Generate Prisma client**:
   ```bash
   npm run prisma:generate
   ```
3. **Initialize the local SQLite database**:
   ```bash
   npm run db:push
   ```
4. **Seed the local database** (adds initial demo models):
   ```bash
   npm run db:seed
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## ⚡ 6. Build & Operations Commands

Manage builds, formatting, and operations with these terminal commands:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts development environment with hot-reloading |
| `npm run build` | Compiles client code for production release |
| `npm run start` | Serves compiled output on local port 3000 |
| `npm run lint` | Runs ESLint analysis for code quality |
| `npm run db:reset` | Resets local SQLite database and runs seeds |

---

## 🔑 7. Environment Variables

Relational databases configuration variables are located in `.env` (derived from `.env.example`):
*   `DATABASE_URL`: Location URL of the target database (defaults to the SQLite dev file `"file:./dev.db"`).

> [!WARNING]
> **Security Notice**: Never commit actual secret keys or connection credentials to public version controls. Keep `.env` included in `.gitignore`.

---

## 🌐 8. Deployment Instructions

### Vercel / Netlify
FocusForge can be deployed directly to Vercel or similar host providers:
1.  Connect the target repository.
2.  Specify the framework preset as **Next.js**.
3.  Set the build command as `npm run build` and output directory as default.

### Static Export Hosting
Because all components are client-rendered, you can configure Next.js to export static files (`output: 'export'` inside `next.config.ts`) and host the output `out/` folder on static hosts like GitHub Pages or S3 buckets.

---

## ⚡ 9. Performance & Responsive Design

### Performance
*   **Lazy Chart Rendering**: Heavy charting packages (Recharts) are protected by client mount hooks (`useIsClient`) to prevent SSR delays and optimize first-paint load times.
*   **Audio Synthesis**: The synthesizers in `sound-player.tsx` discard audio nodes immediately upon pauses or unmounts, preventing memory leaks in browser contexts.

### Responsive Design
*   **Fluid Grids**: Flexbox containers and grids adapt fluidly from mobile touch viewports (`grid-cols-1`) to widescreen monitors (`lg:grid-cols-4`).
*   **Monk Mode Layouts**: In Monk Mode, the top navigation adjusts and secondary dashboards collapse to allow the student to concentrate.

---

## 📖 10. Coding Conventions

*   **Page Structures**: Every feature page inside `src/app/` must be a client component using `"use client"` and wrapped in the `WorkspaceLayout` component.
*   **Theme Integration**: Utilize Tailwind v4 variables (`text-physics`, `bg-accent-purple`) rather than hardcoded hex values to maintain styling parity.
*   **Zustand Mutations**: Mutate store parameters exclusively through actions specified in store controllers. Always maintain state immutability.
*   **Hydration Guards**: Wrap all client-only calculations or UI components reading localStorage data with the `useIsClient` hook.

---

## 🗺️ 11. Roadmap & Limitations

### Roadmap
*   **Database Integration**: Wire SQLite/Prisma to the UI to replace browser localStorage persistences.
*   **Authentication**: Support multiple student logins and sync progress to the cloud.
*   **Mobile App Packaging**: Bundle FocusForge as a desktop/mobile shell using Tauri.

### Known Limitations
*   **No Active Cloud DB**: The UI runs entirely client-side, using `localStorage`. Database seeds are only saved to SQLite for backend scaffolding.
*   **Simulated Blocker**: Distraction blocking and blocker domain interceptions are simulated in the client UI.
*   **Single User Profile**: The app does not support multi-student account toggles.

---

## 📜 12. License & Attribution

### License

> [!IMPORTANT]
> **PROPRIETARY AND CONFIDENTIAL.** This repository is proprietary software and is **NOT open source**. All intellectual property rights are reserved exclusively by the copyright holder, **ILHAM FAROOQUE**. Publication of this repository on GitHub does not grant any license or permission to use, copy, modify, distribute, clone, fork, or create derivative works. Any unauthorized use, reproduction, model training, or commercial exploitation is strictly prohibited. For inquiries or permission requests, contact [ilhamfarooque786@gmail.com](mailto:ilhamfarooque786@gmail.com). See the full [LICENSE](file:///c:/Users/Lenovo/Desktop/JEE/LICENSE) file for more information.

### Developer Credits
Developed with 💜 by **ILHAM FAROOQUE** — [GitHub Profile](https://github.com/ilham786)
