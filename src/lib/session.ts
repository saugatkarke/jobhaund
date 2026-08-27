import { getAuth } from "./auth";

export async function getOptionalSession(headers: Headers) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
    return null;
  }
  try {
    return await getAuth().api.getSession({ headers });
  } catch {
    return null;
  }
}
