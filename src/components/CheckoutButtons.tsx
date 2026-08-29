"use client";

import { initializePaddle } from "@paddle/paddle-js";
import { useState } from "react";

export function CheckoutButtons({
  monthlyPriceId,
  yearlyPriceId,
  monthlyLabel,
  yearlyLabel,
  yearlySave,
}: {
  monthlyPriceId: string;
  yearlyPriceId: string;
  monthlyLabel: string;
  yearlyLabel: string;
  yearlySave: string;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  async function checkout(priceId: string) {
    setError("");
    if (!priceId) {
      setError("Checkout is not configured yet. Add Paddle price IDs to .env.local.");
      return;
    }
    setPending(priceId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (res.status === 401) {
        window.location.href = "/login?next=/pricing";
        return;
      }
      const data = (await res.json()) as { transactionId?: string; error?: string };
      if (!res.ok || !data.transactionId) {
        setError("Checkout could not start. Try again.");
        return;
      }
      const paddle = await initializePaddle({
        environment:
          process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
            ? "production"
            : "sandbox",
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
      });
      await paddle?.Checkout.open({ transactionId: data.transactionId });
    } catch {
      setError("Checkout could not start. Try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="btn-primary w-full"
        data-price-id={monthlyPriceId}
        disabled={pending !== null}
        onClick={() => checkout(monthlyPriceId)}
      >
        {pending === monthlyPriceId ? "Starting…" : `Get Pro · ${monthlyLabel}`}
      </button>
      <button
        type="button"
        className="btn-secondary w-full"
        data-price-id={yearlyPriceId}
        disabled={pending !== null}
        onClick={() => checkout(yearlyPriceId)}
      >
        {pending === yearlyPriceId ? "Starting…" : `Get Pro · ${yearlyLabel}`}
      </button>
      <p className="text-xs text-[var(--muted)]">{yearlySave}</p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
