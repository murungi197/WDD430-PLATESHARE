"use client";

import Link from "next/link";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function AuthMenu() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <p className="text-sm text-slate-500" aria-live="polite">
        Checking sign-in…
      </p>
    );
  }

  if (error) {
    return (
      <nav aria-label="Account" className="flex items-center gap-3">
        <span
          className="sr-only text-sm text-rose-700 sm:not-sr-only"
          role="status"
        >
          Sign-in status unavailable
        </span>
        <Link
          className="text-sm font-semibold text-slate-700 hover:text-emerald-800"
          href="/sign-in"
        >
          Sign in
        </Link>
      </nav>
    );
  }

  if (!session) {
    return (
      <nav aria-label="Account" className="flex items-center gap-3">
        <Link
          className="text-sm font-semibold text-slate-700 hover:text-emerald-800"
          href="/sign-in"
        >
          Sign in
        </Link>
        <Link
          className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
          href="/sign-up"
        >
          Join PlateShare
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="Account" className="flex items-center gap-3">
      <span className="hidden text-sm font-medium text-slate-600 sm:inline">
        Hi, {session.user.name}
      </span>
      <Link
        className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
        href="/account"
      >
        Account
      </Link>
      <SignOutButton />
    </nav>
  );
}

function SignOutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    setPending(true);
    setError("");

    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError("Sign out failed. Please try again.");
      }
    } catch (reason) {
      console.error("Sign out request failed.", reason);
      setError("Sign out is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        className="rounded-full border border-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        onClick={signOut}
        type="button"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error ? (
        <span className="mt-1 text-xs text-rose-700" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
