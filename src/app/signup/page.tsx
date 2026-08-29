import { SignupForm } from "@/components/AuthForm";
import { MarketingShell } from "@/components/MarketingShell";
import { GridBand } from "@/components/PageGrid";

export default function SignupPage() {
  return (
    <MarketingShell>
      <GridBand as="section" className="border-b border-[var(--line)]">
        <div className="col-span-12 px-5 py-14 md:col-span-6 md:col-start-4 md:px-6 md:py-16">
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Email and password. Job data stays in the Indeed and Seek extensions.
          </p>
          <div className="mt-8">
            <SignupForm />
          </div>
        </div>
      </GridBand>
    </MarketingShell>
  );
}
