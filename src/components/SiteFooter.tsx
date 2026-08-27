import Link from "next/link";
import { DISCLAIMER } from "@/lib/copy";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-medium">
            <Logo className="h-7 w-7" />
            JobHaund
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Track Indeed and Seek applications locally. Upgrade here for Hide
            jobs and ATS results.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/#features">Features</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Sign up</Link>
            </li>
            <li>
              <Link href="/account">Account</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 px-5 py-5 text-center text-xs text-[var(--muted)]">
        {DISCLAIMER}
      </div>
    </footer>
  );
}
