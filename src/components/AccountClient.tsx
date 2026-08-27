"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Entitlement = {
  authenticated: boolean;
  email: string | null;
  plan: "pro" | "free";
  status: string;
};

export function AccountClient({
  checkoutSuccess,
}: {
  checkoutSuccess: boolean;
}) {
  const [ent, setEnt] = useState<Entitlement | null>(null);
  const [notice, setNotice] = useState(
    checkoutSuccess ? "Payment received — Pro unlocks in a moment." : "",
  );
  const [portalError, setPortalError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load(attempt = 0) {
      const res = await fetch("/api/me/entitlement");
      const data = (await res.json()) as Entitlement;
      if (cancelled) return;
      setEnt(data);
      if (checkoutSuccess && data.plan !== "pro" && attempt < 6) {
        window.setTimeout(() => load(attempt + 1), 1500);
      } else if (checkoutSuccess && data.plan === "pro") {
        setNotice("");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [checkoutSuccess]);

  async function manageBilling() {
    setPortalError("");
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      setPortalError("No billing customer yet. Upgrade first.");
      return;
    }
    window.location.href = data.url;
  }

  async function signOut() {
    await authClient.signOut({ fetchOptions: { onSuccess: () => {
      window.location.href = "/";
    } } });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[var(--muted)]">Signed in as</p>
        <p className="text-lg font-medium">{ent?.email || "…"}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="pill capitalize">{ent?.plan || "free"}</span>
        {ent?.status && ent.status !== "none" ? (
          <span className="text-sm text-[var(--muted)]">{ent.status}</span>
        ) : null}
      </div>
      {notice ? <p className="text-sm text-[var(--muted)]">{notice}</p> : null}
      <p className="text-sm text-[var(--muted)]">
        The Indeed and Seek extensions connect after you Sign in from the popup.
      </p>
      <div className="flex flex-wrap gap-3">
        {ent?.plan === "pro" ? (
          <button type="button" className="btn-primary" onClick={manageBilling}>
            Manage billing
          </button>
        ) : (
          <Link href="/pricing" className="btn-primary">
            Upgrade
          </Link>
        )}
        <button type="button" className="btn-secondary" onClick={signOut}>
          Sign out
        </button>
      </div>
      {portalError ? <p className="text-sm text-red-600">{portalError}</p> : null}
    </div>
  );
}
