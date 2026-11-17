export default function Loading() {
  return (
    <main
      aria-label="Loading PlateShare"
      className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-8"
      role="status"
    >
      <span className="sr-only">Loading available food…</span>
      <div className="h-64 animate-pulse rounded-[2rem] bg-slate-200" />
      <div className="mt-10 h-24 animate-pulse rounded-2xl bg-slate-200" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            className="h-56 animate-pulse rounded-3xl bg-slate-200"
            key={item}
          />
        ))}
      </div>
    </main>
  );
}
