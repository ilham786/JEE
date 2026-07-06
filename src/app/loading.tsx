export default function Loading() {
  return (
    <main className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-5" role="status" aria-live="polite">
        <div className="h-3 w-28 rounded-full bg-accent-purple/30" />
        <div className="space-y-3">
          <div className="h-9 rounded-lg bg-white/10" />
          <div className="h-3 rounded-full bg-white/8" />
          <div className="h-3 w-4/5 rounded-full bg-white/8" />
        </div>
        <span className="sr-only">Loading FocusForge workspace</span>
      </div>
    </main>
  );
}
