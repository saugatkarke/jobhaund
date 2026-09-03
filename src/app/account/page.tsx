import { redirect } from "next/navigation";
import {
  AccountClient,
  AccountPlanCard,
  AccountWelcome,
} from "@/components/AccountClient";
import { MarketingShell } from "@/components/MarketingShell";
import { GridBand } from "@/components/PageGrid";
import { getOptionalSession } from "@/lib/session";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  if (process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET) {
    const session = await getOptionalSession(await headers());
    if (!session?.user) redirect("/login?next=/account");
  }

  return (
    <MarketingShell>
      <GridBand
        as="section"
        className="border-b border-[var(--line)] md:h-full"
      >
        <div className="col-span-12 flex flex-col justify-center px-5 py-14 md:col-span-6 md:px-8 md:py-16">
          <AccountWelcome />
          <h1 className="hero-enter hero-enter-2 mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-gradient-mint-gold">Your dashboard</span>
          </h1>
          <p className="hero-enter hero-enter-3 mt-4 max-w-md text-[var(--muted)]">
            Manage your plan, billing, and extension connection.
          </p>
          <div className="hero-enter hero-enter-4 mt-8">
            <AccountPlanCard checkoutSuccess={checkout === "success"} />
          </div>
        </div>
        <div className="hero-enter hero-enter-5 col-span-12 flex flex-col justify-center border-t border-[var(--line)] bg-white px-5 py-14 md:col-span-6 md:border-l md:border-t-0 md:px-8 md:py-16">
          <AccountClient checkoutSuccess={checkout === "success"} />
        </div>
      </GridBand>
    </MarketingShell>
  );
}
