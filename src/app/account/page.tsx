import { redirect } from "next/navigation";
import { AccountClient } from "@/components/AccountClient";
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
      <GridBand as="section" className="border-b border-[var(--line)]">
        <div className="col-span-12 px-5 py-14 md:col-span-6 md:col-start-4 md:px-6 md:py-16">
          <h1 className="text-2xl font-bold tracking-tight">Account</h1>
          <div className="mt-8">
            <AccountClient checkoutSuccess={checkout === "success"} />
          </div>
        </div>
      </GridBand>
    </MarketingShell>
  );
}
