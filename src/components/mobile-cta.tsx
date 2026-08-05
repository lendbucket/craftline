"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The persistent mobile action bar.
 *
 * A phone reader is one thumb and a small window away from every conversion
 * path on this site, and the in-flow calls to action are only reachable by
 * scrolling to them. This is the standing one.
 *
 * WHY A FOOTER BAR RATHER THAN A STICKY HEADER. A sticky header on a phone eats
 * the top of a reading column permanently and fights the browser chrome that
 * hides and shows on scroll. A bottom bar sits where a thumb already is, is the
 * convention every application uses for a primary action, and leaves the
 * reading area alone.
 *
 * IT IS NOT SHOWN EVERYWHERE, AND THE EXCEPTIONS MATTER. On the contact page a
 * floating button pointing at a form the reader is already looking at is noise,
 * and on the legal pages a conversion prompt over a disclosure document is in
 * poor taste. See HIDDEN_ON.
 *
 * It IS shown on the franchising page, which is the one judgement call here.
 * That page carries the inquiry form at its foot, but it is by far the longest
 * on the site, and the CTA audit measured a reader at the top sitting eight
 * viewports from any way to act. On that page the bar scrolls to the form
 * rather than navigating, which is why the href is an anchor.
 *
 * HONEST BY CONSTRUCTION. It says what it opens and nothing else. No countdown,
 * no scarcity, no "limited", no badge, no dismissal that reappears. The site is
 * information and inquiry only and the standing button has to read that way.
 */

/**
 * Routes where the standing bar is suppressed.
 *
 * Prefix matched. The inquiry pages already put the form in front of the
 * reader, and the legal pages are documents rather than sales surfaces.
 */
const HIDDEN_ON = ["/contact", "/privacy", "/terms"];

export function MobileCta() {
  const pathname = usePathname();

  if (HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return null;
  }

  return (
    <div
      data-persistent-cta=""
      /*
        aria-hidden is deliberately NOT set. This is a real, reachable control
        and a screen reader user on a phone should find it in the tab order like
        anyone else. The label below names the destination rather than saying
        "learn more", so hearing it out of context still tells you where it goes.
      */
      className="border-line pb-safe-3 fixed inset-x-0 bottom-0 z-40 border-t bg-white px-4 pt-3 md:hidden"
    >
      <Link
        href="/franchising#inquiry"
        className="bg-signal-solid hover:bg-signal-solid-hover flex min-h-13 items-center justify-center rounded py-3.5 text-base font-semibold text-white transition-colors"
      >
        Franchise inquiry
      </Link>
    </div>
  );
}

/**
 * Spacer that reserves the bar's height at the end of the document.
 *
 * Without it the bar covers the last of the footer, which on the legal pages is
 * the copyright line and on every other page is a navigation column. A fixed
 * element has to pay for its own space somewhere.
 */
export function MobileCtaSpacer() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return null;
  }
  return <div aria-hidden="true" className="pb-safe h-20 md:hidden" />;
}
