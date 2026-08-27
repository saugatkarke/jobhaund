import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getPaddle } from "@/lib/paddle";
import { isProPriceId } from "@/lib/pricing";
import { user } from "@/lib/schema";
import { getOptionalSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getOptionalSession(req.headers);
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }
  const body = (await req.json()) as { priceId?: string };
  const priceId = String(body.priceId || "");
  if (!isProPriceId(priceId)) {
    return NextResponse.json({ error: "INVALID_PRICE" }, { status: 400 });
  }

  const rows = await getDb().select().from(user).where(eq(user.id, session.user.id)).limit(1);
  let customerId = rows[0]?.paddleCustomerId || "";
  const paddle = getPaddle();
  if (!customerId) {
    const customer = await paddle.customers.create({
      email: session.user.email,
      customData: { userId: session.user.id },
    });
    customerId = customer.id;
    await getDb()
      .update(user)
      .set({ paddleCustomerId: customerId })
      .where(eq(user.id, session.user.id));
  }

  const transaction = await paddle.transactions.create({
    customerId,
    items: [{ priceId, quantity: 1 }],
    customData: { userId: session.user.id },
  });

  return NextResponse.json({ transactionId: transaction.id });
}
