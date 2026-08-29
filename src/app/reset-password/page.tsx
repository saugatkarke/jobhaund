import { ResetForm } from "@/components/AuthForm";
import { MarketingShell } from "@/components/MarketingShell";
import { GridBand } from "@/components/PageGrid";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <MarketingShell>
      <GridBand as="section" className="border-b border-[var(--line)]">
        <div className="col-span-12 px-5 py-14 md:col-span-6 md:col-start-4 md:px-6 md:py-16">
          <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
          <div className="mt-8">
            {token ? (
              <ResetForm token={token} />
            ) : (
              <p className="text-sm text-[var(--muted)]">
                This reset link is missing a token. Request a new one.
              </p>
            )}
          </div>
        </div>
      </GridBand>
    </MarketingShell>
  );
}
