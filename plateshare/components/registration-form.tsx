"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  registerMember,
  type RegistrationState,
} from "@/lib/actions/auth";

const initialState: RegistrationState = { status: "idle" };

export function RegistrationForm() {
  const [state, formAction, pending] = useActionState(
    registerMember,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-950" role="status">
          {state.message}
        </p>
        <Link
          className="mt-4 inline-flex rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
          href="/sign-in"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="name">
          Name
        </label>
        <input
          autoComplete="name"
          className="form-input"
          defaultValue={state.values?.name}
          id="name"
          maxLength={80}
          minLength={2}
          name="name"
          required
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          aria-invalid={Boolean(state.fieldErrors?.name)}
        />
        {state.fieldErrors?.name ? (
          <p className="field-error" id="name-error">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="form-input"
          defaultValue={state.values?.email}
          id="email"
          maxLength={254}
          name="email"
          required
          type="email"
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email ? (
          <p className="field-error" id="email-error">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-1.5 block text-sm font-semibold"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="new-password"
          className="form-input"
          id="password"
          maxLength={128}
          minLength={12}
          name="password"
          required
          type="password"
          aria-describedby={
            state.fieldErrors?.password ? "password-hint password-error" : "password-hint"
          }
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        <p className="mt-1.5 text-xs text-slate-500" id="password-hint">
          Use 12–128 characters.
        </p>
        {state.fieldErrors?.password ? (
          <p className="field-error" id="password-error">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800" role="alert">
          {state.message}
        </p>
      ) : null}

      <button
        className="w-full rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Creating your account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already a member?{" "}
        <Link className="font-semibold text-emerald-800 underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </form>
  );
}
