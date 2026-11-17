"use server";

import { isAPIError } from "better-auth/api";
import { z } from "zod";

import { auth } from "@/lib/auth";

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters.").max(80),
  email: z.email("Enter a valid email address.").trim().max(254),
  password: z
    .string()
    .min(12, "Use at least 12 characters.")
    .max(128, "Use 128 characters or fewer."),
});

export type RegistrationState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
  };
  values?: {
    name: string;
    email: string;
  };
};

export async function registerMember(
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const parsed = registrationSchema.safeParse(values);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: "Review the highlighted fields.",
      fieldErrors: {
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
      values: { name: values.name, email: values.email },
    };
  }

  try {
    await auth.api.signUpEmail({
      body: parsed.data,
    });

    return {
      status: "success",
      message: "Your account is ready. Sign in to continue.",
    };
  } catch (error) {
    if (isAPIError(error)) {
      return {
        status: "error",
        message:
          "We couldn't create an account with those details. If you're already registered, sign in.",
        values: { name: parsed.data.name, email: parsed.data.email },
      };
    }

    console.error("Member registration failed.", error);
    return {
      status: "error",
      message: "Account creation is temporarily unavailable. Please try again.",
      values: { name: parsed.data.name, email: parsed.data.email },
    };
  }
}
