import { SignupForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { MarketingShell } from "@/components/MarketingShell";

export default function SignupPage() {
  return (
    <MarketingShell>
      <AuthLayout
        eyebrow="Account"
        title="Create account"
        description="Email and password. Job data stays in the Indeed and Seek extensions."
        notes={[
          "Track jobs locally with Metrics, Copy JD, Save, and Kanban.",
          "Connect the Indeed or Seek extension after you sign in.",
          "Upgrade to Pro here when you want Hide jobs and ATS scores.",
        ]}
      >
        <SignupForm />
      </AuthLayout>
    </MarketingShell>
  );
}
