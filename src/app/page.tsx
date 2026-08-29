import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FeatureBento } from "@/components/FeatureBento";
import { IconDownload, IconShield, IconUser } from "@/components/icons";
import { MarketingShell } from "@/components/MarketingShell";
import { MeshHero } from "@/components/MeshHero";
import { GridBand } from "@/components/PageGrid";
import { Reveal } from "@/components/Reveal";
import { TRUST_LINE } from "@/lib/copy";

const cwsUrl = process.env.NEXT_PUBLIC_CWS_URL || "/#features";

export default function HomePage() {
  return (
    <MarketingShell>
      <GridBand as="section" className="border-b border-[var(--line)]">
        <MeshHero>
          <div className="mx-auto max-w-3xl px-5 pb-16 pt-16 text-center md:px-6 md:pb-20">
            <h1 className="hero-enter hero-enter-2 text-4xl font-bold tracking-tight md:text-6xl">
              Track Indeed and Seek jobs locally. Unlock Hide and ATS with Pro.
            </h1>
            <p className="hero-enter hero-enter-3 mx-auto mt-5 max-w-xl text-[var(--muted)]">
              One Pro plan covers both Indeed and Seek. Metrics, Copy JD, Save, and
              a local Kanban stay free. Pay here with Paddle when you want Hide /
              Unhide and ATS score results.
            </p>
            <div className="hero-enter hero-enter-4 mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/pricing" className="btn-primary">
                Get Pro
              </Link>
              <a href={cwsUrl} className="btn-secondary">
                <Image
                  src="/chrome_logo.webp"
                  alt=""
                  width={16}
                  height={16}
                  className="mr-2"
                />
                Install free
              </a>
            </div>
          </div>
        </MeshHero>
      </GridBand>

      <GridBand as="section" id="features" className="border-b border-[var(--line)]">
        <Reveal className="col-span-12 px-5 pt-10 md:px-6 md:pt-12">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            Features
          </p>
          <h2 className="mt-2 max-w-lg text-3xl font-bold tracking-tight">
            See the listing. Track the search.
          </h2>
        </Reveal>
        <Reveal delay={80} className="col-span-12 px-5 pb-12 pt-8 md:px-6 md:pb-16">
          <FeatureBento />
        </Reveal>
      </GridBand>

      <GridBand as="section" className="border-b border-[var(--line)]">
        <p className="col-span-12 px-5 py-6 text-center text-sm text-[var(--muted)] md:px-6">
          {TRUST_LINE}
        </p>
      </GridBand>

      <GridBand as="section" className="border-b border-[var(--line)]">
        <Reveal className="col-span-12 px-5 py-10 md:px-6 md:py-12">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
        </Reveal>
        <Reveal delay={0} className="col-span-12 border-t border-[var(--line)] md:col-span-4">
          <FeatureItem
            icon={<IconDownload className="h-5 w-5" />}
            title="1. Install free"
            body="Load the Indeed or Seek Chrome extension and keep tracking jobs locally."
          />
        </Reveal>
        <Reveal delay={80} className="col-span-12 border-t border-[var(--line)] md:col-span-4 md:border-l">
          <FeatureItem
            icon={<IconUser className="h-5 w-5" />}
            title="2. Sign in here"
            body="Create an email account. The popup Sign in connects the extension later."
          />
        </Reveal>
        <Reveal delay={160} className="col-span-12 border-t border-[var(--line)] md:col-span-4 md:border-l">
          <FeatureItem
            icon={<IconShield className="h-5 w-5" />}
            title="3. Checkout in Paddle"
            body="Monthly or yearly overlay checkout. We never store card numbers."
          />
        </Reveal>
      </GridBand>

      <GridBand as="section" className="border-b border-[var(--line)]">
        <Reveal className="col-span-12 px-5 py-10 md:col-span-4 md:px-6 md:py-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to know before you start
          </h2>
        </Reveal>
        <Reveal delay={80} className="col-span-12 border-t border-[var(--line)] md:col-span-8 md:border-l md:border-t-0">
          <FaqAccordion />
        </Reveal>
      </GridBand>

      <GridBand as="section" className="mesh-cta border-b border-[var(--line)] text-white">
        <div className="col-span-12 px-5 py-14 md:col-span-8 md:px-6 md:py-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Start hiding jobs and scoring ATS on Indeed and Seek
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pricing" className="btn-primary bg-white text-black hover:bg-neutral-100">
              Get Pro
            </Link>
            <Link
              href="/signup"
              className="btn-secondary border-white/25 bg-transparent text-white hover:bg-white/10"
            >
              Create account
            </Link>
          </div>
        </div>
      </GridBand>
    </MarketingShell>
  );
}

function FeatureItem({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="h-full px-5 py-10 md:px-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-black text-[#20FC8F]">
        {icon}
      </div>
      <h3 className="mt-5 font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
    </div>
  );
}
