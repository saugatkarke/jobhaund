import { LoginForm } from "@/components/AuthForm";
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
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Use your JobHaund account for the Indeed and Seek extensions.
          </p>
          <div className="mt-6">
            <LoginForm nextPath={nextPath} />
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
