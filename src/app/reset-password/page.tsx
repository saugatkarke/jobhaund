import { ResetForm } from "@/components/AuthForm";
import { MarketingShell } from "@/components/MarketingShell";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <MarketingShell>
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <div className="mt-6">
            {token ? (
              <ResetForm token={token} />
            ) : (
              <p className="text-sm text-[var(--muted)]">
                This reset link is missing a token. Request a new one.
              </p>
            )}
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
