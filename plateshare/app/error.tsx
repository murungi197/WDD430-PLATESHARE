"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-rose-700">
        Something went wrong
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        We couldn&apos;t load this page.
      </h1>
      <p className="mt-3 max-w-lg text-slate-600">
        Please try again. If the problem continues, come back in a little while.
      </p>
      <button
        className="mt-6 rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
        onClick={() => reset()}
        type="button"
      >
        Try again
      </button>
      <span className="sr-only">{error.digest ? `Error ${error.digest}` : ""}</span>
    </main>
  );
}
