# FocusForge — Project Overview

FocusForge is a comprehensive, gamified study workspace and workflow manager designed specifically for IIT-JEE and competitive-exam aspirants. By consolidating study timers, revision planners, mistake logs, distraction blocking, progress tracking, and heuristic coaching under a unified, high-focus interface, FocusForge aims to replace scattered study tools with a centralized "study operating system."

Developed by **ILHAM FAROOQUE** (https://github.com/ilham786). Package name: `focusforge`.

---

## 1. Primary Goals

The application is engineered to address the critical friction points of preparation for competitive exams:

*   **Discipline Enforcement over Willpower**: Willpower is finite. FocusForge automates focus cycles, enforces boundaries, and prompts structural reviews to reduce decision fatigue.
*   **Active Recall & Spaced Repetition**: Standard study routines fail to systematically revisit errors. FocusForge integrates error logging directly with spaced-repetition schedules (via SuperMemo-2 calculations) to force memory reinforcement.
*   **Information Consolidation**: Scattered syllabus documents, Excel trackers, paper timers, and physical diaries are replaced with a single glassmorphic dashboard tracking syllabus, streak metrics, and analytics.
*   **Focus Isolation**: Blocker simulators and "Monk Mode" interfaces isolate students from browser distractions, providing visual enforcement of study commitments.

---

## 2. Target Users

The primary user group consists of **IIT-JEE (Advanced/Mains) and competitive engineering/medical exam aspirants** preparing for high-stakes tests:
*   **Requirements**: Strict division of syllabus across core subjects (Physics, Chemistry, Mathematics), high volume of Past Year Questions (PYQs), repeated mock testing, and tracking of specific conceptual and silly errors.
*   **Needs**: Streak and level mechanics to gamify routine practice, clean visual analytics on focus efficiency, and immediate revision cues to lock in weak concepts.

---

## 3. Core Functionality

FocusForge contains ten primary application routes, divided into specific modules:

| Route | Feature Area | Description |
|---|---|---|
| `/` | **Landing Page** | High-fidelity entrance page presenting FocusForge features, call-to-actions, and developer attributions. |
| `/dashboard` | **Central Hub** | Main workspace console displaying XP metrics, active level bars, consecutive study streaks, syllabus progress summaries, and a weekly productivity heatmap. |
| `/study` | **Study Workspace** | Timer module supporting Pomodoro (50m), Deep Work (90m), and Custom duration configurations. Includes active ticker displays, completing alerts, Monk Mode, and background audio loops. |
| `/mistakes` | **Mistake Journal** | Diary mapping logged conceptual gaps, silliness, calculation errors, or time pressure mistakes. Supports chapter tagging and full-text searches. |
| `/revisions` | **Revision Scheduler** | Spaced-repetition planner showing due items, upcoming revision requirements, and calendars. |
| `/jee` | **Syllabus Tracker** | Chapter completion percentages, PYQ trackers, and formula sheets reference content for Physics, Chemistry, and Mathematics. |
| `/tracker` | **Distraction Logs** | Real-time tracking charts showing simulated distraction domains visited during focus sessions. |
| `/blocker` | **Domain Blocker** | Simulator to customize domain blocklists, restrict whitelist-only lists, or lock the system in exam enforcement modes. |
| `/coach` | **Heuristic AI Coach** | Adaptive counselor that parses student logs to diagnose burnouts, project exam readiness, and suggest focus directions. |
| `/analytics` | **Analytics Console** | Comprehensive dashboards plotting study hours, subject splits, focus ratios, and error type distributions. |

---

## 4. Design Philosophy

FocusForge adheres to three visual and operational principles:

1.  **Immersive Dark Aesthetic**: Utilizes a deep background (`#090a0f`) decorated with subtle radial gradients to simulate a physical dark room. This reduces eye strain during long-duration study sessions.
2.  **Glassmorphism Surfaces**: Employs frosted glass panels (border highlights, background blur, high shadows) to give the application a premium, modern SaaS console feel.
3.  **Low-Friction Gamification**: Rewards students with XP (1000 XP per level) for completing timers, logging mistakes, or executing revisions. Streaks visualizer builds a sense of momentum without introducing overwhelming dopamine loops.
4.  **No-Distraction Architecture**: Offers a distinct "Monk Mode" which minimizes sidebar links, collapses panels, and enforces fullscreens to isolate the student's field of view.
