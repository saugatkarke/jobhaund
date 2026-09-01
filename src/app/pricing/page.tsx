import { MarketingShell } from "@/components/MarketingShell";
import { PricingCards } from "@/components/PricingCards";
import { GridBand } from "@/components/PageGrid";
import { monthlyPriceId, yearlyPriceId } from "@/lib/pricing";

const installHref = process.env.NEXT_PUBLIC_CWS_URL || "/#features";

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
        <PricingCards
          monthlyPriceId={monthlyPriceId()}
          yearlyPriceId={yearlyPriceId()}
          installHref={installHref}
        />
      </GridBand>
    </MarketingShell>
  );
}
