"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  IconCheckCircle,
  IconDownload,
  IconEyeOff,
  IconScan,
  IconUser,
} from "./icons";
import { useSession } from "./SessionProvider";

type Entitlement = {
  authenticated: boolean;
  email: string | null;
  plan: "pro" | "free";
  status: string;
};

function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-5">
      <h3 className="text-sm font-medium text-[var(--muted)]">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function AccountWelcome() {
  const { name, email } = useSession();

  return (
    <div className="mt-6 flex items-center gap-3">
      <span className="inline-block origin-[70%_80%] animate-[wave_1.5s_ease-in-out]">
        👋
      </span>
      <p className="text-lg font-medium">
        Welcome back, {name || email || "…"}
      </p>
    </div>
  );
}

export function AccountPlanCard({
  checkoutSuccess,
}: {
  checkoutSuccess: boolean;
}) {
  const { ent, notice, manageBilling, portalError } =
    useEntitlement(checkoutSuccess);
  const isPro = ent?.plan === "pro";

  return (
    <div
      className={
        isPro
          ? "plan-card-pro rounded-xl p-6"
          : "mesh-hero rounded-xl border border-[var(--line)] p-5"
      }
    >
      <h3
        className={
          isPro
            ? "text-sm font-medium text-white/60"
            : "text-sm font-medium text-[var(--muted)]"
        }
      >
        Your plan
      </h3>
      <div className="mt-3">
        <div className="flex items-center gap-3">
          <span
            className={
              isPro
                ? "pill plan-card-pro-pill capitalize"
                : "pill capitalize"
            }
          >
            {ent?.plan || "free"}
          </span>
          {ent?.status && ent.status !== "none" ? (
            <span
              className={
                isPro
                  ? "text-sm text-white/50"
                  : "text-sm text-[var(--muted)]"
              }
            >
              {ent.status}
            </span>
          ) : null}
        </div>
        {notice ? (
          <p
            className={
              isPro
                ? "mt-3 text-sm text-white/60"
                : "mt-3 text-sm text-[var(--muted)]"
            }
          >
            {notice}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          {isPro ? (
            <button
              type="button"
              className="plan-card-pro-btn"
              onClick={manageBilling}
            >
              Manage billing
            </button>
          ) : (
            <Link href="/pricing" className="btn-primary">
              Upgrade to Pro
            </Link>
          )}
        </div>
        {portalError ? (
          <p className="mt-3 text-sm text-red-400">{portalError}</p>
        ) : null}
      </div>
    </div>
  );
}

function useEntitlement(checkoutSuccess: boolean) {
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

  return { ent, notice, portalError, manageBilling };
}

export function AccountClient({
  checkoutSuccess,
}: {
  checkoutSuccess: boolean;
}) {
  const { ent } = useEntitlement(checkoutSuccess);
  const { signOut } = useSession();
  const isPro = ent?.plan === "pro";

  return (
    <div className="space-y-8">
      {/* What you get */}
      <DashboardCard title={isPro ? "Pro features" : "Free features"}>
        <ul className="space-y-2.5">
          <li className="flex items-center gap-2.5 text-sm">
            <IconCheckCircle className="h-4 w-4 text-[var(--mint)]" />
            <span>Job metrics and tracking</span>
          </li>
          <li className="flex items-center gap-2.5 text-sm">
            <IconCheckCircle className="h-4 w-4 text-[var(--mint)]" />
            <span>Copy JD and Save to board</span>
          </li>
          <li className="flex items-center gap-2.5 text-sm">
            <IconCheckCircle className="h-4 w-4 text-[var(--mint)]" />
            <span>Local Kanban board</span>
          </li>
          {isPro ? (
            <>
              <li className="flex items-center gap-2.5 text-sm">
                <IconEyeOff className="h-4 w-4 text-[var(--mint)]" />
                <span>Hide / Unhide job cards</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <IconScan className="h-4 w-4 text-[var(--mint)]" />
                <span>ATS score results</span>
              </li>
            </>
          ) : null}
        </ul>
        {!isPro ? (
          <p className="mt-4 text-sm text-[var(--muted)]">
            Upgrade to unlock Hide jobs and ATS scores.
          </p>
        ) : null}
      </DashboardCard>

      {/* Extension connection */}
      <DashboardCard title="Chrome extension">
        <div className="flex items-start gap-3">
          <IconDownload className="mt-0.5 h-5 w-5 text-[var(--muted)]" />
          <div>
            <p className="text-sm">
              The Indeed and Seek extensions connect after you sign in from the
              extension popup.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Your account and Pro status sync automatically.
            </p>
          </div>
        </div>
      </DashboardCard>

      {/* Account actions */}
      <DashboardCard title="Account">
        <div className="flex items-center gap-3 text-sm">
          <IconUser className="h-4 w-4 text-[var(--muted)]" />
          <span>{ent?.email || "…"}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      </DashboardCard>
    </div>
  );
}
