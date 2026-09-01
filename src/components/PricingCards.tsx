"use client";

import { useState, type KeyboardEvent } from "react";
import { IconCheckCircle } from "./icons";
import { startPaddleCheckout } from "@/lib/paddle-checkout";
import {
  MONTHLY_AMOUNT,
  YEARLY_AMOUNT,
  formatPrice,
  yearlyDiscountPercent,
} from "@/lib/pricing";

type Interval = "monthly" | "yearly";

const FREE_FEATURES = [
  "Listing metrics: date, salary, applicants",
  "Copy JD and save",
  "Local Kanban board",
  "CSV export",
  "Resume stays in the browser",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Hide / Unhide job cards",
  "ATS score results",
  "Indeed and Seek together",
  "Score a resume against the JD",
];

export function PricingCards({
  monthlyPriceId,
  yearlyPriceId,
  installHref,
}: {
  monthlyPriceId: string;
  yearlyPriceId: string;
  installHref: string;
}) {
  const [interval, setInterval] = useState<Interval>("monthly");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const yearlyOff = yearlyDiscountPercent();
  const proPrice =
    interval === "monthly"
      ? formatPrice(MONTHLY_AMOUNT)
      : formatPrice(YEARLY_AMOUNT);
  const proPeriod = interval === "monthly" ? "Monthly" : "Yearly";
  const priceId = interval === "monthly" ? monthlyPriceId : yearlyPriceId;

  function onToggleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    setInterval((current) => (current === "monthly" ? "yearly" : "monthly"));
  }

  async function subscribe() {
    setError("");
    setPending(true);
    try {
      const result = await startPaddleCheckout(priceId);
      if (result.status === "login") {
        window.location.href = "/login?next=/pricing";
        return;
      }
      if (result.status === "error") {
        setError(result.message);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="col-span-12 px-5 py-10 md:px-6 md:py-16">
      <div
        role="radiogroup"
        aria-label="Billing period"
        className="pricing-toggle"
        onKeyDown={onToggleKeyDown}
      >
        <button
          type="button"
          role="radio"
          aria-checked={interval === "monthly"}
          className="pricing-toggle-option"
          onClick={() => setInterval("monthly")}
        >
          Monthly
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={interval === "yearly"}
          className="pricing-toggle-option"
          onClick={() => setInterval("yearly")}
        >
          Yearly
          {yearlyOff > 0 ? (
            <span className="pricing-toggle-save">-{yearlyOff}%</span>
          ) : null}
        </button>
      </div>

      <div className="mx-auto mt-8 grid w-full items-stretch gap-5 md:w-[90%] md:grid-cols-12">
        <article className="pricing-card md:col-span-6">
          <div className="pricing-card-head pricing-card-head-free">
            <h2 className="text-[17px] font-medium tracking-tight">Free</h2>
            <p className="pricing-card-price tabular-nums">
              <span>$0</span>
              <span className="pricing-card-period">/forever</span>
            </p>
            <p className="pricing-card-tagline">
              Track Indeed and Seek without paying. Metrics, save, and a local
              board.
            </p>
            <a
              href={installHref}
              className="btn-secondary pricing-card-cta pricing-card-cta-secondary"
              {...(installHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              Install free
            </a>
          </div>
          <ul className="pricing-card-features">
            {FREE_FEATURES.map((feature) => (
              <li key={feature}>
                <IconCheckCircle className="pricing-card-check" />
                {feature}
              </li>
            ))}
          </ul>
        </article>

        <article className="pricing-card md:col-span-6">
          <div className="pricing-card-head pricing-card-head-pro">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[17px] font-medium tracking-tight">Pro</h2>
              <span className="pricing-card-badge">Popular</span>
            </div>
            <p className="pricing-card-price tabular-nums">
              <span>{proPrice}</span>
              <span className="pricing-card-period">/{proPeriod}</span>
            </p>
            <p className="pricing-card-tagline">
              Best for people who want to hide listings and score a resume
              against the JD.
            </p>
            <button
              type="button"
              className="pricing-card-cta"
              data-price-id={priceId}
              disabled={pending}
              onClick={subscribe}
            >
              {pending ? "Starting…" : "Subscribe"}
            </button>
          </div>
          <ul className="pricing-card-features">
            {PRO_FEATURES.map((feature) => (
              <li key={feature}>
                <IconCheckCircle className="pricing-card-check" />
                {feature}
              </li>
            ))}
          </ul>
        </article>
      </div>

      {error ? (
        <p className="mt-5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
