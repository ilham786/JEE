# FocusForge Changelog

All notable changes to the **FocusForge** project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.1.0] - 2026-07-16

This is the initial release of FocusForge, setting up a fully functional dark-themed mock workspace designed for IIT-JEE and competitive exam aspirants.

### Added

#### Core Layout & Workspace
*   **Workspace Shell**: Created standard workspace navigation shell (`WorkspaceLayout`) displaying sidebars, page headers, user statistics, active XP meters, and streaks.
*   **Keyboard Navigation**: Added helper hooks (`useKeyboardShortcuts`) supporting rapid jumping (Alt+D/S/J/R/M) across workspace routes.

#### Focus & Timer Modes
*   **Pomodoro Timer**: Setup 50-minute Pomodoro, 90-minute Deep Work, and Custom time sliders.
*   **Monk Mode**: Fullscreen distraction blocker that filters sidebar routes down to dashboard and study workspace only.
*   **Ambient Sound Engine**: Integrated Web Audio API sound player generating real-time rain, white-noise, and lofi oscillator hums locally.

#### Mistake Journal & Revision Planner
*   **Mistake Log**: Built data-entry screens for adding conceptual, silliness, calculation, or time-pressure errors.
*   **Spaced Repetition scheduling**: Implemented SuperMemo-2 mathematical intervals (`[1, 3, 7, 15, 30]` days).
*   **Revision Planner**: Dynamic 7-day queue checking upcoming review dates and highlighting overdue tasks.

#### Distraction Blocking & Analytics
*   **Blocker Registry**: Simulated interface managing website blacklists, whitelist restrictions, and exam locks.
*   **Analytics Charts**: Added daily trend bars, subject composition rings, and focus metric projections using Recharts.

#### Heuristic AI Coach
*   **AI Coach Advisor**: Adaptive chat-box responding to log files with burnout checks, projection metrics, and chapter advice.

#### Database Scaffolding
*   **Prisma SQLite Configuration**: Initialized SQLite structure (`schema.prisma`) for future relational backend wiring.

---

## [Planned Releases]

### [0.2.0]
*   **Relational DB Wiring**: Replace Zustand persisted localStorage storage with active server-side Prisma and SQLite queries.
*   **Authentication & User Profiles**: Support multiple student logins, custom avatars, and goal tracking tables.
*   **Interactive Formula Cards**: Add reference cards to search syllabus topics.
*   **Accessibility Auditing**: Rectify WCAG 2.2 AA guidelines (prefers-reduced-motion transitions, keyboard focus outlines, scalable page dimensions).
