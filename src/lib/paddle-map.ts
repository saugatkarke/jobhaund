import { isProPriceId } from "./pricing";

export type MappedSubscription = {
  userId: string;
  paddleCustomerId: string;
  paddleSubscriptionId: string;
  paddlePriceId: string;
  status: string;
  plan: "pro" | "free";
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  occurredAt: Date;
};

function firstPriceId(data: {
  items?: Array<{ price?: { id?: string } }>;
}): string {
  return data.items?.[0]?.price?.id || "";
}

export function shouldApplyEvent(
  priorOccurredAt: Date | null | undefined,
  eventOccurredAt: Date,
): boolean {
  const prior = priorOccurredAt ? new Date(priorOccurredAt).getTime() : 0;
  return eventOccurredAt.getTime() >= prior;
}

export function mapPaddleSubscription(event: {
  occurredAt: string;
  data: {
    id: string;
    status: string;
    customerId?: string;
    customData?: { userId?: string } | null;
    currentBillingPeriod?: { endsAt?: string } | null;
    items?: Array<{ price?: { id?: string } }>;
    scheduledChange?: { action?: string } | null;
  };
}): MappedSubscription | null {
  const priceId = firstPriceId(event.data);
  if (!isProPriceId(priceId)) return null;
  const userId = event.data.customData?.userId;
  if (!userId) return null;
  const ends = event.data.currentBillingPeriod?.endsAt;
  return {
    userId,
    paddleCustomerId: String(event.data.customerId || ""),
    paddleSubscriptionId: event.data.id,
    paddlePriceId: priceId,
    status: event.data.status,
    plan: "pro",
    currentPeriodEnd: ends ? new Date(ends) : null,
    cancelAtPeriodEnd: event.data.scheduledChange?.action === "cancel",
    occurredAt: new Date(event.occurredAt),
  };
}
