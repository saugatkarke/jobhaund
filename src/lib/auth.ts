import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { getDb } from "./db";
import { sendAuthEmail } from "./mail";
import * as schema from "./schema";

export type Auth = ReturnType<typeof createAuth>;

function createAuth() {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendAuthEmail({
          to: user.email,
          subject: "Reset your JobHaund password",
          text: `Reset your password: ${url}`,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendAuthEmail({
          to: user.email,
          subject: "Verify your JobHaund email",
          text: `Verify your email: ${url}`,
        });
      },
    },
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendAuthEmail({
            to: email,
            subject: "Sign in to JobHaund",
            text: `Sign in: ${url}`,
          });
        },
      }),
      nextCookies(),
    ],
  });
}

let cached: Auth | null = null;

export function getAuth(): Auth {
  if (!cached) cached = createAuth();
  return cached;
}
