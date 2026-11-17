import { connection } from "next/server";
import { Suspense } from "react";

import { requireMember } from "@/lib/authz";

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
      <Suspense fallback={<p role="status">Loading your account…</p>}>
        <AccountDetails />
      </Suspense>
    </main>
  );
}

async function AccountDetails() {
  await connection();
  const member = await requireMember();

  return (
    <section className="rounded-3xl border border-emerald-950/10 bg-white p-7 shadow-sm sm:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
        Member account
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Welcome, {member.name}
      </h1>
      <p className="mt-3 text-slate-600">
        You are signed in as <span className="font-medium">{member.email}</span>.
      </p>
      <p className="mt-6 rounded-2xl bg-[#f6f7f1] p-4 text-sm leading-6 text-slate-600">
        Your account session is checked on the server. Listing actions must
        apply the same server-side member and ownership checks.
      </p>
    </section>
  );
}
