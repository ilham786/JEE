import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center px-6">
      <section className="max-w-lg text-center space-y-5">
        <SearchX className="mx-auto h-10 w-10 text-accent-purple" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-purple">
          Route not found
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          This study panel does not exist.
        </h1>
        <p className="text-sm leading-6 text-gray-400">
          Head back to the dashboard and continue from a known workspace route.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7c4ce6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
        >
          <Home className="h-4 w-4" />
          Open Dashboard
        </Link>
      </section>
    </main>
  );
}
