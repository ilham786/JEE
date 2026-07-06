"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090a0f] text-white">
        <main className="min-h-screen flex items-center justify-center px-6">
          <section className="max-w-lg text-center space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-purple">
              FocusForge recovery
            </p>
            <h1 className="text-3xl font-black tracking-tight">
              The workspace hit an unexpected error.
            </h1>
            <p className="text-sm leading-6 text-gray-400">
              Your local study data should still be intact. Retry the route to rebuild the interface state.
            </p>
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7c4ce6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Workspace
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
