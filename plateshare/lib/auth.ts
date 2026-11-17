import "server-only";

import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/prisma";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const secret = process.env.BETTER_AUTH_SECRET;

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET must be set.");
}

if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL must be set in production.");
}

export const auth = betterAuth({
  appName: "PlateShare",
  baseURL,
  secret,
  trustedOrigins: [baseURL],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    transaction: true,
  }),
  user: {
    modelName: "Member",
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
    },
  },
  plugins: [nextCookies()],
});
