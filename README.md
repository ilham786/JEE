# FocusForge

FocusForge is a polished dark-mode study workspace designed for IIT-JEE and competitive exam aspirants. It solves the core problem of scattered exam preparation by consolidating study sessions, mistake review, revision planning, distraction blocking, and analytics in one high-focus web application.

## Project Role & Purpose

FocusForge is built to help serious learners maintain discipline and momentum while preparing for high-stakes exams. It acts as a study operating system that:

- tracks focused study sessions with built-in timers,
- logs and schedules mistake revisions using spaced repetition,
- creates a distraction-free study environment with blocker and exam modes,
- provides insightful analytics for performance, syllabus coverage, and mistakes,
- offers AI-style coaching guidance to prioritize weak topics and recovery cycles.

This web app is the student’s central command center for planning, practicing, and reviewing JEE preparation with a clear, gamified workflow.

## Technologies Used

- Next.js 16.2.6 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS v4
- Framer Motion
- Zustand state management
- Recharts data visualization
- Prisma ORM
- SQLite development database (Prisma config)
- Lucide React icons
- canvas-confetti for session completion effects
- ESLint for code quality
- `tsx` for local script execution

## Detailed Features

### Landing Page
- Glassmorphic dark hero section with study-focused messaging.
- Clear call-to-action buttons to enter the workspace or start a focus session.
- Developer branding and credit on the home page.
- Footer credit linking to the developer’s GitHub.

### Study Sessions
- Configurable study timer with Pomodoro, Deep Work, and Custom modes.
- Active session display with real-time countdown and pause/resume controls.
- Confetti celebration on session completion.
- Distraction logging for domains and productivity tracking.

### Mistake Journal
- Add mistakes with subject, chapter, error type, description, and explanation.
- Search, filter, and refine mistake entries.
- Spaced repetition scheduling for revision planning.
- Reward mechanics for logging and revision actions.

### Revision Planning
- Smart revision queue showing due and upcoming spaced-repeat items.
- Calendar view for the next seven days.
- Visual indicators for overdue and scheduled revisions.
- Custom revision intervals to help lock concepts into long-term memory.

### JEE Preparation Hub
- Syllabus progress tracker for Physics, Chemistry, and Maths.
- Chapter-level completion metrics and PYQ counts.
- Editable progress metrics with XP rewards for planning.
- Weak topic tagging and formula sheet reference content.

### Distraction Blocking
- Blocked websites registry with add/remove controls.
- Whitelist-only and exam enforcement modes.
- Schedule-based blocker slots for focused study windows.
- Simulated blocker shield for browser-based study protection.

### Analytics Dashboard
- Daily study trend charts and focus efficiency visuals.
- Subject completion comparisons and error type breakdowns.
- Strongest and weakest subject analysis.
- Projection insights for productivity and exam readiness.

### AI Coaching
- Adaptive chat-style coaching assistant.
- Burnout assessment, syllabus projection, and weak-topic advice.
- Context-aware responses generated from current study logs.

### Data Persistence & Backend
- Local persistence via Zustand storage.
- Prisma schema-ready backend models for users, sessions, mistakes, revisions, analytics, blocked websites, goals, and achievements.
- API-ready architecture for sessions, analytics, coach guidance, mistakes, and blocker state.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npm run prisma:generate
```

3. Initialize the local database:

```bash
npm run db:push
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Recreation Prompt

Create a modern study productivity web application named **FocusForge** with the following capabilities:

- Use Next.js App Router and TypeScript.
- Build a polished dark glassmorphic UI with Tailwind CSS and Framer Motion animations.
- Include a hero landing page for IIT-JEE and competitive exam aspirants, with clear call-to-action buttons and developer credit.
- Implement a study workspace with timer modes, session controls, deep work focus, and distraction logging.
- Provide a mistake journal for logging errors, explanations, filter/search, and spaced repetition review scheduling.
- Add a revision planner showing due items, upcoming calendar slots, and revision streaks.
- Build a JEE prep dashboard for syllabus progress, chapter metrics, weak topic management, and formula reference cards.
- Include a distraction blocker interface with blocked websites, whitelist mode, exam lock mode, and schedule slots.
- Add an analytics section with Recharts visualizations for trends, subject comparisons, and error distributions.
- Add an AI coaching chat assistant that generates heuristic guidance from study logs and mistakes.
- Use Zustand for client state management and local persistence.
- Use Prisma for data modeling and backend-ready schema support.
- Add professional README documentation and developer credit.

## Developer Credit

Developed by **ILHAM FAROOQUE** — https://github.com/ilham786
