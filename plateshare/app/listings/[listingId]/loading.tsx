export default function ListingLoading() {
  return (
    <main
      aria-label="Loading listing details"
      className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8"
      role="status"
    >
      <span className="sr-only">Loading listing details in a moment…</span>
      <div className="h-56 animate-pulse rounded-[2rem] bg-slate-200" />
      <div className="mt-6 h-64 animate-pulse rounded-[2rem] bg-slate-200" />
    </main>
  );
}
