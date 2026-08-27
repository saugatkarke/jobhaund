import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getAuth } from "./auth";
import { getDb } from "./db";
import { emptyEntitlement, resolveEntitlement } from "./entitlement";
import { verifyAccessJwt } from "./extension-auth";
import { subscription } from "./schema";

export async function entitlementPayload(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  let userId: string | null = null;
  let email: string | null = null;

  if (bearer) {
    const claims = await verifyAccessJwt(bearer);
    if (claims) {
      userId = claims.sub;
      email = claims.email;
    }
  } else if (process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET) {
    const session = await getAuth().api.getSession({ headers: req.headers });
    if (session?.user) {
      userId = session.user.id;
      email = session.user.email;
    }
  }

  if (!userId) {
    return { authenticated: false, email: null, ...emptyEntitlement() };
  }

  if (!process.env.DATABASE_URL) {
    return { authenticated: true, email, ...emptyEntitlement() };
  }

  const rows = await getDb()
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .orderBy(desc(subscription.updatedAt))
    .limit(1);
  const resolved = resolveEntitlement(
    rows[0]
      ? {
          plan: rows[0].plan,
          status: rows[0].status,
          currentPeriodEnd: rows[0].currentPeriodEnd,
        }
      : null,
  );
  return { authenticated: true, email, ...resolved };
}
