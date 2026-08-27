import { CheckoutButtons } from "@/components/CheckoutButtons";
import { MarketingShell } from "@/components/MarketingShell";
import {
  MONTHLY_LABEL,
  YEARLY_LABEL,
  monthlyPriceId,
  yearlyPriceId,
  yearlySavingsLabel,
} from "@/lib/pricing";

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-[1200px] px-5 py-16">
        <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          Pricing
        </p>
        <h1 className="mt-2 text-center text-4xl font-bold">
          Free to track Indeed and Seek. Pro to hide and score.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--muted)]">
          One Pro subscription unlocks Hide / Unhide and ATS results on both
          platforms.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <p className="text-sm text-[var(--muted)]">Free</p>
            <p className="mt-2 text-3xl font-bold">$0</p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
              <li>Metrics chips</li>
              <li>Copy JD and Save</li>
              <li>Local Kanban and CSV</li>
              <li>Resume upload stays in the browser</li>
            </ul>
          </div>
          <div className="card p-8 ring-2 ring-[#20FC8F]">
            <p className="text-sm text-[var(--muted)]">Pro</p>
            <p className="mt-2 text-3xl font-bold">{MONTHLY_LABEL}</p>
            <p className="text-sm text-[var(--muted)]">or {YEARLY_LABEL}</p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
              <li>Everything in Free</li>
              <li>Hide / Unhide job cards</li>
              <li>ATS score results</li>
            </ul>
            <div className="mt-8">
              <CheckoutButtons
                monthlyPriceId={monthlyPriceId()}
                yearlyPriceId={yearlyPriceId()}
                monthlyLabel={MONTHLY_LABEL}
                yearlyLabel={YEARLY_LABEL}
                yearlySave={yearlySavingsLabel()}
              />
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
