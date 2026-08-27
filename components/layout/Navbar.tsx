"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation, siteConfig } from "@/config/site";

const Wordmark = () => (
  <span className="wordmark" aria-hidden="true">
    <span className="wordmark-name">Amazing Grace</span>
    <span className="wordmark-rule">Antiques</span>
  </span>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-(--border) bg-(--cream)/96 backdrop-blur-md">
      <div className="border-b border-(--border) bg-(--olive) text-(--cream)">
        <div className="mx-auto flex min-h-8 max-w-(--container-width) items-center justify-between gap-4 px-5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] sm:px-8 lg:px-10">
          <p>{siteConfig.announcement.message}</p>
          <Link href={siteConfig.announcement.href} className="hidden text-(--gold-light) transition hover:text-white sm:block">
            {siteConfig.announcement.actionLabel}
          </Link>
        </div>
      </div>

      <nav
        className="mx-auto flex h-[82px] max-w-(--container-width) items-center justify-between px-5 sm:h-[92px] sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >
        <Link href="/" aria-label="Amazing Grace Antiques home" className="shrink-0 text-(--olive)">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-5 xl:flex 2xl:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-link py-3 text-[0.72rem] font-bold uppercase tracking-[0.09em] text-(--ink) transition-colors hover:text-(--burgundy)"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <a
            href={siteConfig.contact.phoneHref}
            className="hidden border border-(--border-dark) px-4 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-(--olive) sm:block"
          >
            Call the shop
          </a>
          <button
            type="button"
            className="flex size-11 items-center justify-center border border-(--border-dark) text-(--olive) transition hover:bg-(--olive) hover:text-(--cream)"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="grid gap-1.5" aria-hidden="true">
              <span className={`block h-px w-5 bg-current transition-transform ${isMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-current transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-5 bg-current transition-transform ${isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div id="mobile-navigation-menu" className="fixed inset-x-0 top-[114px] h-[calc(100dvh-114px)] border-t border-(--border) bg-(--cream) p-5 sm:top-[124px] sm:h-[calc(100dvh-124px)] xl:hidden">
          <div className="mx-auto grid max-w-(--container-width)">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-(--border) px-2 py-4 font-heading text-2xl text-(--olive)"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-8 grid gap-2 text-sm text-(--muted)">
              <a href={siteConfig.contact.phoneHref} className="font-bold text-(--ink)">{siteConfig.contact.phone}</a>
              <a href={siteConfig.contact.emailHref}>{siteConfig.contact.email}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
