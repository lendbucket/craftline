"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/container";
import { Wordmark } from "@/components/wordmark";
import { NAV } from "@/config/company";

/**
 * Site header. The only client component on the property, and it is a client
 * component solely because of the mobile disclosure. Everything else renders on
 * the server.
 *
 * There is no sticky behaviour and no scroll transform. A corporate site with
 * this few destinations does not need a header that follows you down the page,
 * and a static header is one less thing to get wrong on a phone in landscape.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // No body scroll lock here on purpose. The panel is an inline disclosure
  // that pushes the page down, not an overlay, so there is nothing behind it
  // to trap. Locking the body would only strand a user whose nav list grew
  // taller than the viewport.

  // Escape closes the panel, matching the behaviour of every other disclosure
  // a keyboard user has met.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="bg-graphite text-zinc">
      <Container wide>
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Wordmark />

          <nav aria-label="Primary" className="hidden md:block">
            {/*
              Tighter gap at md, opening up at lg. The nav is data driven, and
              at the md breakpoint the current five labels plus the wordmark sit
              close enough to the container edge that gap-8 risks a wrap. Adding
              a sixth destination means checking this again.
            */}
            <ul className="flex items-center gap-5 lg:gap-8">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`label-sm inline-flex min-h-11 items-center transition-colors ${
                      isActive(item.href)
                        ? "text-copper"
                        : "text-zinc hover:text-copper"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="text-zinc -mr-2 inline-flex h-11 w-11 items-center justify-center md:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="h-6 w-6" />
            ) : (
              <Menu aria-hidden="true" className="h-6 w-6" />
            )}
          </button>
        </div>
      </Container>

      {/*
        Rendered only when open rather than hidden with a class. The panel holds
        the same links as the desktop nav, and leaving a second copy in the DOM
        permanently means a screen reader user tabs through every destination
        twice.

        Each link closes the panel on click rather than the header watching
        `pathname` and closing in an effect. Same result, but it does not queue
        a second render pass after every navigation, and it keeps the state
        change attached to the interaction that caused it.
      */}
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-rule bg-graphite border-t md:hidden"
        >
          <Container wide>
            <ul className="flex flex-col py-2">
              {NAV.map((item) => (
                <li key={item.href} className="border-rule border-b last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`label-sm flex min-h-14 items-center ${
                      isActive(item.href) ? "text-copper" : "text-zinc"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
