import Link from "next/link";
import { Container } from "@/components/container";
import { SplitRule } from "@/components/system/rule";
import { Wordmark } from "@/components/wordmark";
import {
  BRANDS,
  COMPANY,
  CONTACT_EMAIL,
  FRANCHISE_DISCLAIMER,
  LEGAL_ENTITIES,
  LEGAL_NAV,
  NAV,
} from "@/config/company";

/**
 * Site footer. Standard corporate: navigation columns, corporate structure,
 * legal text, copyright.
 *
 * THE DISCLAIMER LIVES HERE, AND THAT IS LOAD BEARING. FRANCHISE_DISCLAIMER
 * renders verbatim on every page of this property. It is impossible to violate
 * by adding a page, because the footer is part of the layout shell rather than
 * something an author remembers to include.
 *
 * If you find yourself typing the disclaimer text into a component, stop. It is
 * the one piece of copy on this site that is legally load bearing and it exists
 * in exactly one place, in src/config/company.ts.
 *
 * PHASE 2A: the split rule closes the document the same way it opens it, the
 * column headings take the display face, and the whole block is bounded by a
 * heavy graphite rule instead of a hairline. The legal text is unchanged in
 * treatment and deliberately so: plain small grey type, not a bordered callout,
 * because a box around a disclaimer makes it look like marketing emphasis
 * rather than the standing legal statement it is.
 *
 * THE IMPORT'S FOOTER POINTS PRIVACY AND TERMS AT href="#". Both routes exist
 * and both are in the sitemap. See BACKLOG.md, where that is recorded as a
 * rejected import behaviour so it does not get reintroduced by someone reading
 * the export rather than this file.
 *
 * White ground, because the mark sits here and the mark is only approved on
 * white.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-graphite border-t-2 bg-white">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Wordmark as="plain" className="h-11 w-auto" />
            <p className="text-steel mt-5 max-w-xs text-[0.9375rem] leading-relaxed">
              {COMPANY.descriptor}
            </p>
          </div>

          <div>
            <h2 className="font-display text-signal text-lg font-bold tracking-[0.14em] uppercase">
              Company
            </h2>
            <ul className="mt-5 space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-steel hover:text-datum tap-44 inline-block py-1 text-[0.9375rem] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-datum text-lg font-bold tracking-[0.14em] uppercase">
              Brands
            </h2>
            <ul className="mt-5 space-y-1">
              {BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="text-steel hover:text-datum tap-44 inline-block py-1 text-[0.9375rem] transition-colors"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-graphite text-lg font-bold tracking-[0.14em] uppercase">
              Legal
            </h2>
            <ul className="mt-5 space-y-1">
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-steel hover:text-datum tap-44 inline-block py-1 text-[0.9375rem] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/*
              Rendered only when a mailbox actually exists. No craftlinebrands
              address is live yet, so the site shows nothing here rather than an
              invented one. See NEXT_PUBLIC_CONTACT_EMAIL in .env.example.
            */}
            {CONTACT_EMAIL ? (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-steel hover:text-datum tap-44 mt-4 inline-block py-1 text-[0.9375rem] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            ) : null}
          </div>
        </div>

        {/*
          The legal block. Plain small grey text, which is what this is on every
          franchisor site, and deliberately not a bordered callout: a box around
          the disclaimer makes it look like marketing emphasis rather than the
          standing legal statement it is.
        */}
        <div className="border-line space-y-4 border-t py-8">
          <p className="text-steel max-w-4xl text-[0.8125rem] leading-relaxed">
            {FRANCHISE_DISCLAIMER}
          </p>
          <p className="text-steel max-w-4xl text-[0.8125rem] leading-relaxed">
            {COMPANY.name} operates through{" "}
            {LEGAL_ENTITIES.map((entity, index) => (
              <span key={entity.name}>
                {index > 0 ? " and " : ""}
                {entity.name}, a {entity.jurisdiction} limited liability company
              </span>
            ))}
            .
          </p>
          <p className="text-steel text-[0.8125rem]">
            Copyright {year} {COMPANY.name}. All rights reserved.
          </p>
        </div>
      </Container>
      {/* The document closes on the same mark it opened with. */}
      <SplitRule />
    </footer>
  );
}
