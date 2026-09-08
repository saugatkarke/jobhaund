import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/MarketingShell";
import { GridBand } from "@/components/PageGrid";
import { Reveal } from "@/components/Reveal";
import { APP_NAME } from "@/lib/copy";
import {
  LEGAL_LAST_UPDATED,
  LEGAL_PAGES,
  sellerIdentity,
} from "@/lib/legal";

export function legalMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} · ${APP_NAME}`,
    description,
  };
}

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <MarketingShell>
      <GridBand as="article" className="border-b border-[var(--line)]">
        <div className="legal-page col-span-12 px-5 py-12 md:col-span-8 md:col-start-3 md:px-6 md:py-16">
          <h1 className="hero-enter hero-enter-2 text-3xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="hero-enter hero-enter-3 mt-2 text-sm text-[var(--muted)]">
            Last updated: {LEGAL_LAST_UPDATED}
          </p>
          <p className="hero-enter hero-enter-3 mt-1 text-sm text-[var(--muted)]">
            {sellerIdentity()}
          </p>
          <Reveal delay={80} className="legal-body mt-8">
            {children}
          </Reveal>
          <nav
            aria-label="Other legal pages"
            className="mt-12 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--line)] pt-6 text-sm"
          >
            {LEGAL_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="text-[var(--muted)] underline-offset-2 hover:text-black hover:underline"
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
      </GridBand>
    </MarketingShell>
  );
}
