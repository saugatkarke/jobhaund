import { Environment, Paddle } from "@paddle/paddle-node-sdk";

let cached: Paddle | null = null;

export function getPaddle(): Paddle {
  if (cached) return cached;
  const key = process.env.PADDLE_API_KEY;
  if (!key) throw new Error("PADDLE_API_KEY is not set");
  const env =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
      ? Environment.production
      : Environment.sandbox;
  cached = new Paddle(key, { environment: env });
  return cached;
}
