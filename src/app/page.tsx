import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
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
          <div className="card hero-enter hero-enter-5 mx-auto mt-14 max-w-4xl overflow-hidden p-4 md:p-6">
            <ProductMock />
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
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Reveal delay={0}>
            <FeatureCard title="Metrics chips" body="Published date and interested counts on Indeed and Seek cards, cached locally." />
          </Reveal>
          <Reveal delay={100}>
            <FeatureCard title="Copy JD + Save" body="Copy the job description and save roles to a local Kanban in one click." />
          </Reveal>
          <Reveal delay={200}>
            <FeatureCard title="Local Kanban" body="Saved, Applied, Interviewing, Rejected — stored in your browser, not our servers." />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <Reveal>
            <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Pro
            </p>
            <h2 className="mt-2 text-center text-3xl font-bold">
              Hide noise. Score the fit.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal delay={0}>
              <FeatureCard title="Hide / Unhide" body="Clear cards you do not want. Free users see an upgrade prompt instead of hiding." />
            </Reveal>
            <Reveal delay={100}>
              <FeatureCard title="ATS results" body="Score a locally stored resume against the JD. The free preview stays blurred until Pro." />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-20">
        <Reveal>
          <h2 className="text-center text-3xl font-bold">How it works</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Reveal delay={0}>
            <FeatureCard title="1. Install free" body="Load the Indeed or Seek Chrome extension and keep tracking jobs locally." />
          </Reveal>
          <Reveal delay={100}>
            <FeatureCard title="2. Sign in here" body="Create an email account. The popup Sign in connects the extension later." />
          </Reveal>
          <Reveal delay={200}>
            <FeatureCard title="3. Checkout in Paddle" body="Monthly or yearly overlay checkout. We never store card numbers." />
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

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card card-lift h-full p-6">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}

function ProductMock() {
  return (
    <div className="grid gap-4 rounded-2xl bg-[#f4f6f8] p-4 text-left md:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-[var(--muted)]">Kanban</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {["Saved", "Applied", "Interview"].map((col) => (
            <div key={col} className="rounded-xl bg-[#f7f8fa] p-2">
              <p className="mb-2 font-medium">{col}</p>
              <div className="h-12 rounded-lg bg-[#20FC8F]/30" />
              <div className="mt-2 h-12 rounded-lg bg-white" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-[var(--muted)]">Indeed and Seek card chips</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-black px-3 py-1 text-xs text-[#20FC8F]">2d ago</span>
          <span className="rounded-full bg-[#FDB833]/20 px-3 py-1 text-xs">12 interested</span>
          <span className="rounded-full bg-black/5 px-3 py-1 text-xs">ATS locked</span>
        </div>
        <div className="gradient-drift mt-6 h-24 rounded-xl bg-gradient-to-br from-[#20FC8F]/40 to-[#FDB833]/40" />
      </div>
    </div>
  );
}
