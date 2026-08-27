import { SignupForm } from "@/components/AuthForm";
import { MarketingShell } from "@/components/MarketingShell";

export default function SignupPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Email and password. Job data stays in the Indeed and Seek extensions.
          </p>
          <div className="mt-6">
            <SignupForm />
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
