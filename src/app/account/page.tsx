import { redirect } from "next/navigation";
import { AccountClient } from "@/components/AccountClient";
import { MarketingShell } from "@/components/MarketingShell";
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
      <div className="mx-auto max-w-lg px-5 py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Account</h1>
          <div className="mt-6">
            <AccountClient checkoutSuccess={checkout === "success"} />
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
