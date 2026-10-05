import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import * as argon2 from "argon2";
import { prisma } from "../database/prisma-client";

const frontendUrl = new URL(process.env.FRONTEND_URL ?? "http://localhost:3000");
const trustedOrigins = new Set([frontendUrl.origin]);
if (frontendUrl.hostname === "localhost") {
  const loopbackUrl = new URL(frontendUrl);
  loopbackUrl.hostname = "127.0.0.1";
  trustedOrigins.add(loopbackUrl.origin);
}

export const auth = betterAuth({
  appName: "GMS",
  baseURL: process.env.AUTH_BASE_URL ?? "http://localhost:3101",
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET ?? "local-build-secret-change-before-deploy-00000000",
  trustedOrigins: [...trustedOrigins],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
    maxPasswordLength: 64,
    revokeSessionsOnPasswordReset: true,
    password: {
      hash: (password) => argon2.hash(password, { type: argon2.argon2id }),
      verify: ({ hash, password }) => argon2.verify(hash, password),
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "user", input: false },
    },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 30,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 60, max: 5 },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      secure: frontendUrl.protocol === "https:",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
  },
});
