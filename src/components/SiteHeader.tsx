import Link from "next/link";
import { GridBand } from "./PageGrid";
import { IconStar } from "./icons";
import { Logo } from "./Logo";

function HeaderRating() {
  return (
    <span className="header-rating" aria-label="5 star rating">
      <IconStar gradient className="h-3.5 w-3.5 shrink-0" />
      <span className="header-rating-label">5 star rating</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <GridBand as="header" className="header-rule sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
      <Link
        href="/"
        className="col-span-4 flex h-14 items-center gap-2 px-3 text-sm font-medium md:col-span-3 md:px-4"
      >
        <Logo />
        <span>JobHaund</span>
      </Link>
      <nav className="hidden items-center justify-center gap-6 px-4 text-sm text-neutral-600 md:col-span-6 md:flex">
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
      <div className="col-span-8 flex h-14 items-center justify-end gap-2 px-3 text-sm md:col-span-3 md:gap-3 md:px-4">
        <HeaderRating />
        <Link href="/login" className="text-neutral-700 transition-colors duration-200 hover:text-black">
          Login
        </Link>
        <Link href="/signup" className="btn-primary whitespace-nowrap px-3 py-2 text-xs md:px-4 md:py-2.5 md:text-sm">
          Get started
        </Link>
      </div>
    </GridBand>
  );
}
