import Link from "next/link";

import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 py-12 md:grid-cols-[1fr_0.85fr] md:px-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-800">
          Welcome back
        </p>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-emerald-950 sm:text-5xl">
          Find your next good meal.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Sign in to manage your PlateShare account and continue coordinating
          with your community.
        </p>
        <Link
          className="mt-6 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
          href="/"
        >
          Explore available food
        </Link>
      </section>

      <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-[0_20px_70px_-45px_rgba(20,83,45,0.35)] sm:p-9">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Sign in
        </h2>
        <p className="mb-7 mt-2 text-sm leading-6 text-slate-600">
          Use the email and password for your member account.
        </p>
        <SignInForm />
      </section>
    </main>
  );
}
