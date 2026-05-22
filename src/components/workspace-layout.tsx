"use client";

import { useEffect } from "react";
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#090a0f] text-foreground select-none">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-accent-purple/5 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-physics/5 blur-[150px] pointer-events-none z-0" />

      {/* Workspace Sidebar navigation */}
      <Sidebar />

      {/* Main workspace display panel */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Header title={title} />
        
        <main className={`flex-1 overflow-y-auto relative ${monkModeEnabled ? "bg-black/90 p-4" : "p-6"}`}>
          {/* Global Ambient Audio Synthesis */}
          <SoundPlayer />
          
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
export default WorkspaceLayout;
