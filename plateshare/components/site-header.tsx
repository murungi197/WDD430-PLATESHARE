import Link from "next/link";

import { AuthMenu } from "@/components/auth-menu";

export function SiteHeader() {
  return (
    <header className="border-b border-emerald-950/10 bg-[#fffdf8]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          aria-label="PlateShare home"
          className="flex items-center gap-3"
          href="/"
        >
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full bg-emerald-800 text-lg font-bold text-white"
          >
            PS
          </span>
          <span>
            <span className="block text-lg font-bold leading-tight tracking-tight text-emerald-950">
              PLATESHARE
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Good food, shared locally
            </span>
          </span>
        </Link>
        <AuthMenu />
      </div>
    </header>
  );
}
