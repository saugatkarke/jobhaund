import Link from "next/link";
import { GridBand } from "./PageGrid";
import { IconStar } from "./icons";
import { Logo } from "./Logo";

function HeaderRating() {
  return (
    <span className="header-rating" aria-label="5 star rating">
      <span className="header-rating-stars" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="header-rating-star-cell">
            <IconStar
              gradient
              gradientId={`header-star-gradient-${index}`}
              className={
                index === 0
                  ? "header-rating-star header-rating-star--lead"
                  : "header-rating-star"
              }
            />
          </span>
        ))}
      </span>
      <span className="header-rating-label">
        <span className="header-rating-count">5</span>
        <span className="header-rating-copy">star rating</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <GridBand
      as="header"
      className="header-rule sticky top-0 z-20 bg-white/95 backdrop-blur-sm"
    >
      <Link
        href="/"
        className="col-span-4 flex h-14 items-center gap-2 px-3 text-sm font-medium md:col-span-3 md:px-4"
      >
        <Logo />
        <span>JobHaund</span>
      </Link>
      <nav className="hidden items-center justify-center gap-6 px-4 text-sm text-neutral-600 md:col-span-6 md:flex">
        <Link
          href="/#features"
          className="transition-colors duration-200 hover:text-black"
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="transition-colors duration-200 hover:text-black"
        >
          Pricing
        </Link>
        <Link
          href="/privacy"
          className="transition-colors duration-200 hover:text-black"
        >
          Privacy
        </Link>
      </nav>
      <div className="col-span-8 flex h-14 items-center justify-end gap-2 px-3 text-sm md:col-span-3 md:gap-3 md:px-4">
        <HeaderRating />
        <Link
          href="/login"
          className="text-neutral-700 transition-colors duration-200 hover:text-black"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="btn-primary whitespace-nowrap px-3 py-2 text-xs md:px-4 md:py-2.5 md:text-sm"
        >
          Get started
        </Link>
      </div>
    </GridBand>
  );
}
