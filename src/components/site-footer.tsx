import Link from "next/link";
import { Container } from "@/components/container";
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
 * Site footer.
 *
 * This component carries the franchise disclaimer, and it is global on purpose.
 * The rule is that every franchise related page carries it verbatim in the
 * footer region; the home page has a franchise call to action, so the set of
 * "franchise related pages" is not a subset anyone should have to maintain by
 * hand. Rendering it site wide makes the rule impossible to violate by adding
 * a page and forgetting.
 *
 * The disclaimer text is interpolated from FRANCHISE_DISCLAIMER and never
 * retyped here. If you find yourself editing the string in this file, stop:
 * it is the one piece of copy on the site that is legally load bearing.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      <Container wide>
        <div className="grid gap-10 border-b border-ink-700 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Wordmark as="plain" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-dark">
              {COMPANY.descriptor}
            </p>
          </div>

          <div>
            <h2 className="tracked-caps text-[0.65rem] text-bronze">Company</h2>
            <ul className="mt-4 space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="tap-44 inline-block py-1 text-sm text-paper transition-colors hover:text-bronze"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="tracked-caps text-[0.65rem] text-bronze">Brands</h2>
            <ul className="mt-4 space-y-1">
              {BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="tap-44 inline-block py-1 text-sm text-paper transition-colors hover:text-bronze"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="tracked-caps text-[0.65rem] text-bronze">Legal</h2>
            <ul className="mt-4 space-y-1">
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="tap-44 inline-block py-1 text-sm text-paper transition-colors hover:text-bronze"
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
                className="tap-44 mt-4 inline-block py-1 text-sm text-paper transition-colors hover:text-bronze"
              >
                {CONTACT_EMAIL}
              </a>
            ) : null}
          </div>
        </div>

        <div className="border-b border-ink-700 py-8">
          <h2 className="tracked-caps text-[0.65rem] text-bronze">
            Corporate structure
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {LEGAL_ENTITIES.map((entity) => (
              <li key={entity.name} className="text-sm leading-relaxed">
                <span className="text-paper">{entity.name}</span>{" "}
                <span className="text-muted-dark">
                  is a {entity.jurisdiction} limited liability company.{" "}
                  {entity.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/*
          FRANCHISE DISCLAIMER. Verbatim, unabbreviated, and present on every
          page of this property. Do not move it behind a disclosure, do not
          shrink it below this size, and do not reword it.
        */}
        <div className="py-8">
          <p className="max-w-4xl text-xs leading-relaxed text-muted-dark">
            {FRANCHISE_DISCLAIMER}
          </p>
        </div>

        <div className="border-t border-ink-700 py-6">
          <p className="text-xs text-muted-dark">
            Copyright {year} {COMPANY.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
