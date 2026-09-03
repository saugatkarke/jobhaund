import { ResetForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { MarketingShell } from "@/components/MarketingShell";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <MarketingShell>
      <AuthLayout
        eyebrow="Account"
        title="Reset password"
        description="Choose a new password for your JobHaund account."
      >
        {token ? (
          <ResetForm token={token} />
        ) : (
          <p className="text-sm text-[var(--muted)]">
            This reset link is missing a token. Request a new one.
          </p>
        )}
      </AuthLayout>
    </MarketingShell>
  );
}
