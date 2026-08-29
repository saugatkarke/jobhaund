import { LoginForm } from "@/components/AuthForm";
import { MarketingShell } from "@/components/MarketingShell";
import { GridBand } from "@/components/PageGrid";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = next && next.startsWith("/") ? next : "/account";
  return (
    <MarketingShell>
      <GridBand as="section" className="border-b border-[var(--line)]">
        <div className="col-span-12 px-5 py-14 md:col-span-6 md:col-start-4 md:px-6 md:py-16">
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Use your JobHaund account for the Indeed and Seek extensions.
          </p>
          <div className="mt-8">
            <LoginForm nextPath={nextPath} />
          </div>
        </div>
      </GridBand>
    </MarketingShell>
  );
}
