"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

const emailSchema = z.email("Enter a valid email address.");

export function SignInForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setEmailError("");
    setPasswordError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const parsedEmail = emailSchema.safeParse(email);
    let invalid = false;

    if (!parsedEmail.success) {
      setEmailError(parsedEmail.error.issues[0]?.message ?? "Enter a valid email.");
      invalid = true;
    }
    if (!password) {
      setPasswordError("Enter your password.");
      invalid = true;
    }
    if (invalid) {
      return;
    }

    setPending(true);
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        setMessage("Email or password is incorrect. Check your details and retry.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign in request failed.", error);
      setMessage("Sign in is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="form-input"
          id="email"
          name="email"
          required
          type="email"
          aria-describedby={emailError ? "email-error" : undefined}
          aria-invalid={Boolean(emailError)}
          onChange={() => setEmailError("")}
        />
        {emailError ? (
          <p className="field-error" id="email-error">
            {emailError}
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
          autoComplete="current-password"
          className="form-input"
          id="password"
          name="password"
          required
          type="password"
          aria-describedby={passwordError ? "password-error" : undefined}
          aria-invalid={Boolean(passwordError)}
          onChange={() => setPasswordError("")}
        />
        {passwordError ? (
          <p className="field-error" id="password-error">
            {passwordError}
          </p>
        ) : null}
      </div>

      {message ? (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800" role="alert">
          {message}
        </p>
      ) : null}

      <button
        className="w-full rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-600">
        New to PlateShare?{" "}
        <Link className="font-semibold text-emerald-800 underline" href="/sign-up">
          Create an account
        </Link>
      </p>
    </form>
  );
}
