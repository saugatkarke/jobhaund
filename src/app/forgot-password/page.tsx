import { ForgotForm } from "@/components/AuthForm";
import { MarketingShell } from "@/components/MarketingShell";
import { GridBand } from "@/components/PageGrid";

export default function ForgotPasswordPage() {
  return (
    <MarketingShell>
      <GridBand as="section" className="border-b border-[var(--line)]">
        <div className="col-span-12 px-5 py-14 md:col-span-6 md:col-start-4 md:px-6 md:py-16">
          <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
          <div className="mt-8">
            <ForgotForm />
          </div>
        </div>
      </GridBand>
    </MarketingShell>
  );
}
