import { MarketingShell } from "@/components/MarketingShell";
import { GridBand } from "@/components/PageGrid";
import { Reveal } from "@/components/Reveal";

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <GridBand as="article" className="border-b border-[var(--line)]">
        <div className="col-span-12 px-5 py-12 md:col-span-8 md:col-start-3 md:px-6 md:py-16">
          <h1 className="hero-enter hero-enter-2 text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="hero-enter hero-enter-3 mt-2 text-sm text-[var(--muted)]">Last updated: 26 August 2026</p>
          <Reveal delay={80} className="mt-8 space-y-4 text-[var(--muted)]">
            <p>
              JobHaund is not affiliated with Indeed or Seek. This
              website collects an email address and account data so we can provide
              Pro for the Indeed and Seek extensions.
            </p>
            <p>
              Payments are processed by Paddle, the merchant of record. We do not
              store card numbers.
            </p>
            <p>
              Job descriptions, tracked jobs, resumes, and ATS API keys stay in
              the browser extension. The extension sends a session token only to
              this site to read Pro vs free.
            </p>
          </Reveal>
        </div>
      </GridBand>
    </MarketingShell>
  );
}
