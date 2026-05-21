"use client";

import React, { useEffect } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { useMistakeStore } from "@/store/use-mistake-store";

/**
 * Providers Component
 * Wraps the application with all necessary context providers
 * and initializes global state
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize stores to ensure they're hydrated on first render
  const studyStore = useStudyStore();
  const mistakeStore = useMistakeStore();

  useEffect(() => {
    // Hydrate stores from localStorage on mount
    // The persist middleware in Zustand handles this automatically
    
    // You can add additional initialization logic here
    // For example, checking for existing sessions, setting up timers, etc.
  }, [studyStore, mistakeStore]);

  return <>{children}</>;
}

export default Providers;
