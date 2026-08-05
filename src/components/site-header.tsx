"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/container";
import { Wordmark } from "@/components/wordmark";
import { NAV } from "@/config/company";

/**
 * Site header. A standard corporate top nav: white ground, the lockup at the
 * left, destinations at the right, one primary action.
 *
 * WHITE IS REQUIRED, NOT PREFERRED. The Craftline mark is only approved on
 * white and the delivered artwork has no alpha, so the header that carries it
 * is white. Do not add a tint, a dark variant, or a scrolled state that changes
 * the ground.
 *
 * The only client component on the property, and only because of the mobile
 * sheet. Everything else renders on the server.
 *
 * There is no sticky behaviour on the bar itself. A site with five destinations
 * does not need a header that follows you down the page, and a static header is
 * one less thing to get wrong on a phone in landscape. The persistent action on
 * mobile is handled separately, by MobileCta, which is a footer bar rather than
 * a floating header.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Escape closes the sheet, matching every other overlay a keyboard user has
  // met.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /*
    The sheet is a full height overlay rather than an inline disclosure, so the
    page behind it must not scroll. Without this the body scrolls under the
    panel while the panel itself sits still, which is the single most obvious
    tell that a menu is a web page rather than an application.

    Restoring the previous value rather than clearing it means this cannot
    clobber an overflow set by anything else.
  */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="border-line border-b bg-white">
      <Container wide>
        <div className="flex h-20 items-center justify-between sm:h-24">
          <Wordmark />

          <div className="flex items-center gap-6">
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-6 lg:gap-8">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center text-[0.9375rem] font-semibold transition-colors ${
                        isActive(item.href)
                          ? "text-datum"
                          : "text-graphite hover:text-datum"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/*
              The persistent header action, and it names the thing it does.
              "Franchise inquiry" rather than "Get started": the reader knows
              what they are about to open, which is both more honest and, on a
              page that is information and inquiry only, the more accurate label.
            */}
            <Link
              href="/franchising#inquiry"
              className="bg-signal-solid hover:bg-signal-solid-hover hidden min-h-11 items-center justify-center rounded px-5 text-[0.9375rem] font-semibold text-white transition-colors md:inline-flex"
            >
              Franchise inquiry
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              className="text-graphite -mr-2 inline-flex h-12 w-12 items-center justify-center md:hidden"
            >
              <Menu aria-hidden="true" className="h-7 w-7" />
            </button>
          </div>
        </div>
      </Container>

      {/*
        THE MOBILE SHEET.

        A full height panel rather than an inline disclosure that pushes the
        page down. The difference is what separates a menu that feels like an
        application from one that feels like a web page: it covers, it owns the
        scroll, it opens from the top, and it has a head and a foot.

        Rendered only when open rather than hidden with a class. Leaving a
        second copy of every destination in the DOM permanently means a screen
        reader user tabs through the whole nav twice on every page.

        role="dialog" with aria-modal so assistive technology treats the rest of
        the page as inert while it is up.
      */}
      {open ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-white md:hidden"
        >
          {/*
            HEAD. The icon rather than the full lockup, because the lockup is
            already in the bar this sheet opened from and repeating it at two
            sizes in one view is the kind of thing a reader notices. The icon
            is the mark at the scale this slot conventionally carries.
          */}
          <div className="border-line pt-safe flex shrink-0 items-center justify-between border-b px-5">
            <div className="flex h-20 items-center gap-3">
              <Image
                src="/brand/craftline-icon.png"
                width={1936}
                height={1638}
                alt=""
                className="h-9 w-auto"
              />
              <span className="text-graphite text-lg font-semibold">Menu</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-graphite -mr-2 inline-flex h-12 w-12 items-center justify-center"
            >
              <X aria-hidden="true" className="h-7 w-7" />
            </button>
          </div>

          {/* BODY. Large tap targets, one per row, ruled like a settings list. */}
          <nav aria-label="Primary" className="sheet-scroll flex-1 px-5">
            <ul className="flex flex-col py-2">
              {NAV.map((item) => (
                <li key={item.href} className="border-line border-b last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex min-h-16 items-center text-lg font-semibold ${
                      isActive(item.href) ? "text-datum" : "text-graphite"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* FOOT. The primary action, pinned, clear of the home indicator. */}
          <div className="border-line pb-safe-3 shrink-0 border-t px-5 pt-4">
            <Link
              href="/franchising#inquiry"
              onClick={() => setOpen(false)}
              className="bg-signal-solid hover:bg-signal-solid-hover flex min-h-14 items-center justify-center rounded text-base font-semibold text-white transition-colors"
            >
              Franchise inquiry
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
