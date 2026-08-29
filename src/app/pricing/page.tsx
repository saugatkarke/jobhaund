import { CheckoutButtons } from "@/components/CheckoutButtons";
import { MarketingShell } from "@/components/MarketingShell";
import { GridBand } from "@/components/PageGrid";
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
      <GridBand as="section" className="border-b border-[var(--line)]">
        <div className="col-span-12 px-5 py-12 md:col-span-8 md:px-6 md:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            Pricing
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Free to track Indeed and Seek. Pro to hide and score.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-[var(--muted)]">
            One Pro subscription unlocks Hide / Unhide and ATS results on both
            platforms.
          </p>
        </div>
      </GridBand>
      <GridBand as="section" className="border-b border-[var(--line)]">
        <div className="col-span-12 px-5 py-10 md:col-span-6 md:px-6 md:py-12">
          <p className="text-sm text-[var(--muted)]">Free</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">$0</p>
          <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
            <li>Metrics chips</li>
            <li>Copy JD and Save</li>
            <li>Local Kanban and CSV</li>
            <li>Resume upload stays in the browser</li>
          </ul>
        </div>
        <div className="col-span-12 border-t border-[var(--line)] px-5 py-10 md:col-span-6 md:border-l md:border-t-0 md:px-6 md:py-12">
          <p className="text-sm text-[var(--muted)]">Pro</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{MONTHLY_LABEL}</p>
          <p className="text-sm text-[var(--muted)]">or {YEARLY_LABEL}</p>
          <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
            <li>Everything in Free</li>
            <li>Hide / Unhide job cards</li>
            <li>ATS score results</li>
          </ul>
          <div className="mt-8 max-w-sm">
            <CheckoutButtons
              monthlyPriceId={monthlyPriceId()}
              yearlyPriceId={yearlyPriceId()}
              monthlyLabel={MONTHLY_LABEL}
              yearlyLabel={YEARLY_LABEL}
              yearlySave={yearlySavingsLabel()}
            />
          </div>
        </div>
      </GridBand>
    </MarketingShell>
  );
}
