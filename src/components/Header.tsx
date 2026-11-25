"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, PRIMARY_CTA, SECONDARY_CTA } from "@/lib/site";
import { LinkButton } from "./Button";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Condense the header once the user scrolls past the hero edge (brief priority #4).
  // Subscribe to the scroll system; defer the initial read out of the effect body
  // so we never setState synchronously during render.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const compact = scrolled;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        compact
          ? "border-line bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80"
          : "border-transparent bg-cream"
      }`}
    >
      {/* max-w-7xl, wider than the page's max-w-6xl bands: with BOTH CTA
          buttons beside the full nav, a 6xl row is too narrow at ≥1280 and
          crushes the wordmark past its two-line lockup. */}
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8 ${
          compact ? "py-2" : "py-3.5"
        }`}
      >
        <Logo compact={compact} />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-underline whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-sage-600"
                    : "text-ink/80 hover:text-sage-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Breakpoint visibility must live on these wrappers, never on the
              buttons: LinkButton's base class sets inline-flex, and Tailwind
              v4 emits .inline-flex after .hidden, so a hidden put on the
              button itself is overridden and the pill renders at every
              width (the 2026-11-23 mobile header overlap). */}
          <div className="hidden sm:block">
            <LinkButton href={PRIMARY_CTA.href} className="whitespace-nowrap">
              {PRIMARY_CTA.label}
            </LinkButton>
          </div>
          {/* xl-only: at 640-1279 the second button crushes the wordmark's
              two-line lockup (and 1024-1279 cannot fit nav + logo + both
              buttons at all), so those bands keep the goods-only header
              and the pair lives in the menu and the page CTAs. */}
          <div className="hidden xl:block">
            <LinkButton
              href={SECONDARY_CTA.href}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {SECONDARY_CTA.label}
            </LinkButton>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-line bg-cream transition-[max-height] duration-300 lg:hidden ${
          // Open bound must exceed 7 nav links + BOTH CTA buttons, or the
          // bottom of the menu is clipped (max-h only caps the animation).
          menuOpen ? "max-h-[36rem]" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col px-5 py-3 sm:px-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="border-b border-line/60 py-3 text-base font-medium text-ink last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <LinkButton
            href={PRIMARY_CTA.href}
            size="lg"
            className="mt-4"
            onClick={closeMenu}
          >
            {PRIMARY_CTA.label}
          </LinkButton>
          <LinkButton
            href={SECONDARY_CTA.href}
            variant="secondary"
            size="lg"
            className="mb-2 mt-3"
            onClick={closeMenu}
          >
            {SECONDARY_CTA.label}
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
