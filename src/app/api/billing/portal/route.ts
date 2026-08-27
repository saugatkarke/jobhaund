import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getPaddle } from "@/lib/paddle";
import { subscription, user } from "@/lib/schema";
import { getOptionalSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getOptionalSession(req.headers);
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const rows = await getDb().select().from(user).where(eq(user.id, session.user.id)).limit(1);
  const customerId = rows[0]?.paddleCustomerId;
  if (!customerId) {
    return NextResponse.json({ error: "NO_CUSTOMER" }, { status: 400 });
  }

  const subs = await getDb()
    .select()
    .from(subscription)
    .where(eq(subscription.userId, session.user.id))
    .limit(1);

  const portal = await getPaddle().customerPortalSessions.create(
    customerId,
    subs[0]?.paddleSubscriptionId ? [subs[0].paddleSubscriptionId] : [],
  );

  return NextResponse.json({ url: portal.urls.general.overview });
}
