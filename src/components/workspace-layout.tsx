"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { SoundPlayer } from "./sound-player";
import { useStudyStore } from "@/store/use-study-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function WorkspaceLayout({ children, title }: WorkspaceLayoutProps) {
  const { monkModeEnabled, tick, status } = useStudyStore();

  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Register workspace-wide keyboard shortcuts
  useKeyboardShortcuts();

  // Run global study timer tick countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === "focus" || status === "break") {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, tick]);

  // Close mobile sidebar when route changes (navigation)
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [title]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#090a0f] text-foreground select-none">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-accent-purple/5 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-physics/5 blur-[150px] pointer-events-none z-0" />

      {/* ---- Mobile backdrop overlay ---- */}
      {mobileSidebarOpen && (
        <div
          className="mobile-backdrop md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ---- Sidebar ---- */}
      {/* On desktop: always visible, collapse/expand works as before */}
      {/* On mobile: off-canvas drawer, slides in from left */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 md:relative md:flex md:z-auto
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar onMobileClose={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Main workspace display panel */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10 min-w-0">
        <Header
          title={title}
          onMobileMenuToggle={() => setMobileSidebarOpen((prev) => !prev)}
        />

        <main className={`flex-1 overflow-y-auto relative ${monkModeEnabled ? "bg-black/90 p-3 md:p-4" : "p-3 md:p-6"}`}>
          {/* Global Ambient Audio Synthesis */}
          <SoundPlayer />

          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
export default WorkspaceLayout;
