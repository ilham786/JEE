"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudyStore } from "@/store/use-study-store";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { toggleMonkMode, status, pauseSession, resumeSession } = useStudyStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in text inputs
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      // Check key bindings:
      // Alt + M: Toggle Monk Mode
      if (e.altKey && e.code === "KeyM") {
        e.preventDefault();
        toggleMonkMode();
      }

      // Alt + D: Navigate to Dashboard
      if (e.altKey && e.code === "KeyD") {
        e.preventDefault();
        router.push("/dashboard");
      }

      // Alt + S: Navigate to Study Space
      if (e.altKey && e.code === "KeyS") {
        e.preventDefault();
        router.push("/study");
      }

      // Alt + J: Navigate to Mistakes Journal
      if (e.altKey && e.code === "KeyJ") {
        e.preventDefault();
        router.push("/mistakes");
      }

      // Alt + R: Navigate to Revision Plan
      if (e.altKey && e.code === "KeyR") {
        e.preventDefault();
        router.push("/revisions");
      }

      // Alt + Space: Toggle Study Timer Pause/Resume
      if (e.altKey && e.code === "Space") {
        e.preventDefault();
        if (status === "focus") {
          pauseSession();
        } else if (status === "idle" && activeEl?.tagName !== "BUTTON") {
          // If in focus session, resume
          resumeSession();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, status, toggleMonkMode, pauseSession, resumeSession]);
}
