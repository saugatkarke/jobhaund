import { LoginForm } from "@/components/AuthForm";
import { AuthLayout } from "@/components/AuthLayout";
import { MarketingShell } from "@/components/MarketingShell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = next && next.startsWith("/") ? next : "/account";
  return (
    <MarketingShell>
      <AuthLayout
        eyebrow="Account"
        title="Sign in"
        description="Use your JobHaund account for the Indeed and Seek extensions."
        notes={[
          "One account covers both Indeed and Seek.",
          "Job data stays in the browser, not on this site.",
          "If this is your first login, verify your email from your inbox first.",
          "Sign in from the extension popup after you create an account here.",
        ]}
      >
        <LoginForm nextPath={nextPath} />
      </AuthLayout>
    </MarketingShell>
  );
}
