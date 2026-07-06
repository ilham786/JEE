"use client";

import Link from "next/link";
import { Zap, Shield, BookOpen, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090a0f] text-foreground relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-physics/10 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between px-6 h-20 relative z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-accent-purple fill-accent-purple/20" />
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-accent-purple to-physics bg-clip-text text-transparent">
            FocusForge
          </span>
        </div>
        <Link href="/dashboard">
          <button className="px-4 py-2 text-xs font-semibold rounded-lg border border-accent-purple/30 bg-accent-purple/10 hover:bg-accent-purple/20 text-white transition-all cursor-pointer">
            Enter App
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 text-center py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-card-border bg-white/2 text-xs font-medium text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-ping" />
            Empowering serious IIT-JEE & competitive aspirants
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            The Study Operating System <br />
            For Competitive Exams.
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-400 leading-relaxed">
            Stop raw willpower battles. FocusForge hardwires discipline into your workflow. Track sessions, log mistakes, plan spaced repetitions, block distractions, and unlock IIT-JEE goals.
          </p>

          <p className="text-sm text-accent-purple font-medium tracking-wide">
            Developed by <Link href="https://github.com/ilham786" className="underline decoration-accent-purple/30 hover:text-white">ILHAM FAROOQUE</Link>
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-accent-purple hover:bg-[#7c4ce6] text-white font-semibold rounded-lg shadow-lg shadow-accent-purple/25 transition-all text-sm w-48 cursor-pointer">
                Launch Workspace
              </button>
            </Link>
            <Link href="/study">
              <button className="px-8 py-4 border border-card-border bg-white/3 hover:bg-white/6 text-white font-semibold rounded-lg transition-all text-sm w-48 cursor-pointer">
                Start Focus Session
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          <div className="p-6 rounded-xl border border-card-border bg-card-bg/40 backdrop-blur text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Monk Mode blocker</h3>
            <p className="text-sm text-gray-400">
              Isolate distracting websites and applications completely. Emergency cooldowns prevent easy escape routes when study fatigue hits.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-card-border bg-card-bg/40 backdrop-blur text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-physics/10 border border-physics/20 flex items-center justify-center text-physics">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Spaced Repetition Journal</h3>
            <p className="text-sm text-gray-400">
              Log errors. Let the SuperMemo spaced repetition logic automatically queue mistakes for revision at 1, 3, 7, 15, and 30-day intervals.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-card-border bg-card-bg/40 backdrop-blur text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-chemistry/10 border border-chemistry/20 flex items-center justify-center text-chemistry">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">AI study coach</h3>
            <p className="text-sm text-gray-400">
              Heuristic advisory detects burnout patterns in your study sessions, highlights weak syllabus topics, and projects target milestones.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-card-border/50 flex items-center justify-center px-6 relative z-10">
        <p className="text-xs text-gray-500">
          FocusForge &copy; 2026. Built for serious aspirants. Developed by <Link href="https://github.com/ilham786" className="underline hover:text-white">ILHAM FAROOQUE</Link>.
        </p>
      </footer>
    </div>
  );
}
