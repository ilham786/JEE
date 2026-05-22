"use client";

import type { ReactNode } from "react";

/**
 * Providers Component
 * Wraps the application with all necessary context providers
 * and initializes global state
 */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default Providers;
