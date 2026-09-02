import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FeatureBento } from "@/components/FeatureBento";
import {
  IconDownload,
  IconExternal,
  IconShield,
  IconUser,
} from "@/components/icons";
import { MarketingShell } from "@/components/MarketingShell";
import { MeshHero } from "@/components/MeshHero";
import { GridBand } from "@/components/PageGrid";
import { Reveal } from "@/components/Reveal";
import { SupportedMarkets } from "@/components/SupportedMarkets";

const cwsUrl = process.env.NEXT_PUBLIC_CWS_URL || "/#features";
const SEEK_CWS_URL =
  "https://chromewebstore.google.com/detail/mpglbfbnhhnbbilpnihnjhcencoijiep";
const INDEED_CWS_URL =
  "https://chromewebstore.google.com/detail/lhkokphioeoagcpblnlidbehgpcbpgho";

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
              One Pro plan covers both Indeed and Seek. Metrics, Copy JD, Save,
              and a local Kanban stay free. Pay here with Paddle when you want
              Hide / Unhide and ATS score results.
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

      <GridBand
        as="section"
        id="features"
        className="border-b border-[var(--line)]"
      >
        <Reveal className="col-span-12 px-5 pt-10 md:px-6 md:pt-12">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            Features
          </p>
          <h2 className="mt-2 max-w-lg text-3xl font-bold tracking-tight">
            See the listing. Track the search.
          </h2>
        </Reveal>
        <Reveal
          delay={80}
          className="col-span-12 px-5 pb-12 pt-8 md:px-6 md:pb-16"
        >
          <FeatureBento />
        </Reveal>
      </GridBand>

      <GridBand as="section" className="border-b border-[var(--line)]">
        <div className="trust-band col-span-12 flex justify-center px-5 py-5 md:px-6">
          <SupportedMarkets />
        </div>
      </GridBand>

      <GridBand as="section" className="border-b border-[var(--line)]">
        <Reveal className="col-span-12 px-5 py-10 md:px-6 md:py-12">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
        </Reveal>
        <Reveal
          delay={0}
          className="col-span-12 border-t border-[var(--line)] md:col-span-4"
        >
          <FeatureItem
            icon={<IconDownload className="h-5 w-5" />}
            title="1. Install free"
            body="Load the Indeed or Seek Chrome extension and keep tracking jobs locally."
            actions={
              <>
                <StoreLink href={SEEK_CWS_URL} label="Seek" />
                <StoreLink href={INDEED_CWS_URL} label="Indeed" />
              </>
            }
          />
        </Reveal>
        <Reveal
          delay={80}
          className="col-span-12 border-t border-[var(--line)] md:col-span-4 md:border-l"
        >
          <FeatureItem
            icon={<IconUser className="h-5 w-5" />}
            title="2. Sign in here"
            body="Create an email account. The popup Sign in connects the extension later."
            actions={
              <Link href="/signup" className="btn-secondary">
                Sign Up
              </Link>
            }
          />
        </Reveal>
        <Reveal
          delay={160}
          className="col-span-12 border-t border-[var(--line)] md:col-span-4 md:border-l"
        >
          <FeatureItem
            icon={<IconShield className="h-5 w-5" />}
            title="3. Choose your Plan"
            body="Monthly or yearly overlay checkout. We never store card numbers."
            actions={
              <Link href="/pricing" className="btn-primary">
                Get Pro
              </Link>
            }
          />
        </Reveal>
      </GridBand>

      <GridBand as="section" className="border-b border-[var(--line)]">
        <Reveal className="col-span-12 px-5 py-10 md:col-span-4 md:px-6 md:py-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to know before you start
          </h2>
        </Reveal>
        <Reveal
          delay={80}
          className="col-span-12 border-t border-[var(--line)] md:col-span-8 md:border-l md:border-t-0"
        >
          <FaqAccordion />
        </Reveal>
      </GridBand>

      <GridBand
        as="section"
        className="mesh-cta border-b border-[var(--line)] text-white"
      >
        <div className="col-span-12 px-5 py-14 md:col-span-8 md:px-6 md:py-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Apply for your dream job with clarity
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="btn-primary"
            >
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
  actions,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  actions?: ReactNode;
}) {
  return (
    <div className="h-full px-5 py-10 md:px-6">
      <div className="flex items-center gap-2.5">
        <span className="flex shrink-0 text-[#20FC8F]">{icon}</span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
      {actions ? (
        <div className="mt-5 flex flex-wrap gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary gap-1.5 px-3 py-2 text-xs"
    >
      {label}
      <IconExternal className="h-3.5 w-3.5" />
    </a>
  );
}
