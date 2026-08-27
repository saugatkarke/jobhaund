import type { ReactNode } from "react";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroProduct } from "@/components/HeroProduct";
import {
  IconCopy,
  IconDownload,
  IconEyeOff,
  IconKanban,
  IconMetrics,
  IconScan,
  IconShield,
  IconUser,
} from "@/components/icons";
import { MarketingShell } from "@/components/MarketingShell";
import { Reveal } from "@/components/Reveal";
import { TRUST_LINE } from "@/lib/copy";

const cwsUrl = process.env.NEXT_PUBLIC_CWS_URL || "/#features";

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="mesh-hero">
        <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-16 text-center">
          <p className="pill hero-enter hero-enter-1">Pro: Hide jobs + ATS results</p>
          <h1 className="hero-enter hero-enter-2 mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
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
              Install free
            </a>
          </div>
          <div className="hero-enter hero-enter-5 mx-auto mt-14 max-w-[1200px]">
            <HeroProduct />
          </div>
        </div>
      </section>

      <p className="px-5 py-10 text-center text-sm text-[var(--muted)]">
        {TRUST_LINE}
      </p>

      <section id="features" className="mx-auto max-w-[1200px] px-5 pb-20">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            Free
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold">
            See work the way you already search
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[var(--line)]">
          <Reveal delay={0}>
            <FeatureItem
              icon={<IconMetrics className="h-5 w-5" />}
              title="Metrics chips"
              body="Published date and interested counts on Indeed and Seek cards, cached locally."
            />
          </Reveal>
          <Reveal delay={100}>
            <FeatureItem
              icon={<IconCopy className="h-5 w-5" />}
              title="Copy JD + Save"
              body="Copy the job description and save roles to a local Kanban in one click."
            />
          </Reveal>
          <Reveal delay={200}>
            <FeatureItem
              icon={<IconKanban className="h-5 w-5" />}
              title="Local Kanban"
              body="Saved, Applied, Interviewing, Rejected — stored in your browser, not our servers."
            />
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <Reveal>
            <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Pro
            </p>
            <h2 className="mt-2 text-center text-3xl font-bold">
              Hide noise. Score the fit.
            </h2>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-3xl gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-[var(--line)]">
            <Reveal delay={0}>
              <FeatureItem
                icon={<IconEyeOff className="h-5 w-5" />}
                title="Hide / Unhide"
                body="Clear cards you do not want. Free users see an upgrade prompt instead of hiding."
              />
            </Reveal>
            <Reveal delay={100}>
              <FeatureItem
                icon={<IconScan className="h-5 w-5" />}
                title="ATS results"
                body="Score a locally stored resume against the JD. The free preview stays blurred until Pro."
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-20">
        <Reveal>
          <h2 className="text-center text-3xl font-bold">How it works</h2>
        </Reveal>
        <div className="relative mt-12 grid gap-10 md:grid-cols-3">
          <div
            className="pointer-events-none absolute left-[16%] right-[16%] top-6 hidden h-px bg-[var(--line)] md:block"
            aria-hidden="true"
          />
          <Reveal delay={0}>
            <FeatureItem
              align="center"
              icon={<IconDownload className="h-5 w-5" />}
              title="1. Install free"
              body="Load the Indeed or Seek Chrome extension and keep tracking jobs locally."
            />
          </Reveal>
          <Reveal delay={100}>
            <FeatureItem
              align="center"
              icon={<IconUser className="h-5 w-5" />}
              title="2. Sign in here"
              body="Create an email account. The popup Sign in connects the extension later."
            />
          </Reveal>
          <Reveal delay={200}>
            <FeatureItem
              align="center"
              icon={<IconShield className="h-5 w-5" />}
              title="3. Checkout in Paddle"
              body="Monthly or yearly overlay checkout. We never store card numbers."
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <Reveal>
            <h2 className="text-center text-3xl font-bold">
              Everything you need to know before you start
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10">
              <FaqAccordion />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16">
        <Reveal>
          <div className="mesh-cta mx-auto max-w-[1200px] rounded-[28px] px-6 py-16 text-center text-white">
            <h2 className="text-3xl font-bold md:text-4xl">
              Start hiding jobs and scoring ATS on Indeed and Seek
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/pricing" className="btn-primary bg-white text-black hover:bg-neutral-100">
                Get Pro
              </Link>
              <Link href="/signup" className="btn-secondary border-white/30 bg-transparent text-white hover:bg-white/10">
                Create account
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </MarketingShell>
  );
}

function FeatureItem({
  icon,
  title,
  body,
  align = "start",
}: {
  icon: ReactNode;
  title: string;
  body: string;
  align?: "start" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={`h-full px-1 md:px-8 ${centered ? "text-center" : ""}`}>
      <div
        className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-[#20FC8F] ${centered ? "mx-auto" : ""}`}
      >
        {icon}
      </div>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
    </div>
  );
}

