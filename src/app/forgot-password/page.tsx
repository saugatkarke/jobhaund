import { ForgotForm } from "@/components/AuthForm";
import { MarketingShell } from "@/components/MarketingShell";

export default function ForgotPasswordPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <div className="mt-6">
            <ForgotForm />
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
