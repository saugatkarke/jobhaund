import Link from "next/link";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Logo />
          <span>JobHaund</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-neutral-600 md:flex">
          <Link href="/#features" className="transition-colors duration-200 hover:text-black">
            Features
          </Link>
          <Link href="/pricing" className="transition-colors duration-200 hover:text-black">
            Pricing
          </Link>
          <Link href="/privacy" className="transition-colors duration-200 hover:text-black">
            Privacy
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-neutral-700 transition-colors duration-200 hover:text-black">
            Login
          </Link>
          <Link href="/signup" className="btn-primary">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
