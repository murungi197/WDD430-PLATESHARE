import Link from "next/link";

import { RegistrationForm } from "@/components/registration-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 py-12 md:grid-cols-[1fr_0.85fr] md:px-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-800">
          Join your local table
        </p>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-emerald-950 sm:text-5xl">
          Share a little. Help a neighbor.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Create a member account to share surplus food and coordinate a pickup
          when you are ready.
        </p>
        <Link
          className="mt-6 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
          href="/"
        >
          Browse available food first
        </Link>
      </section>

      <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-[0_20px_70px_-45px_rgba(20,83,45,0.35)] sm:p-9">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Create your account
        </h2>
        <p className="mb-7 mt-2 text-sm leading-6 text-slate-600">
          We will ask you to sign in after registration.
        </p>
        <RegistrationForm />
      </section>
    </main>
  );
}
