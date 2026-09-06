import { ForgotForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { MarketingShell } from "@/components/MarketingShell";
import { APP_NAME } from "@/lib/copy";

export default function ForgotPasswordPage() {
  return (
    <MarketingShell>
      <AuthLayout
        eyebrow="Account"
        title="Forgot password"
        description={`Enter the email on your ${APP_NAME} account and we will send a reset link.`}
      >
        <ForgotForm />
      </AuthLayout>
    </MarketingShell>
  );
}
