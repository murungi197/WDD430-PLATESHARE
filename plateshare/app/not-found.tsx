import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
        Listing unavailable
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        This food is no longer available.
      </h1>
      <p className="mt-3 max-w-lg text-slate-600">
        It may have been claimed, removed, or passed its pickup window.
      </p>
      <Link
        className="mt-6 rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
        href="/"
      >
        Back to available food
      </Link>
    </main>
  );
}
