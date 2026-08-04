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
 * Site footer. Standard corporate: navigation columns, corporate structure,
 * legal text, copyright.
 *
 * THE DISCLAIMER LIVES HERE AGAIN, AND THAT IS LOAD BEARING. It used to render
 * in the NOTES field of the TitleBlock, which every page placed above this
 * footer. The title block is retired with the rest of the drawing set system,
 * so the disclaimer comes back to the footer, which is where a franchisor site
 * conventionally puts it and where an attorney will look for it.
 *
 * The rule is unchanged: FRANCHISE_DISCLAIMER renders verbatim on every page of
 * this property. It is impossible to violate by adding a page, because the
 * footer is part of the layout shell rather than something an author remembers
 * to include.
 *
 * If you find yourself typing the disclaimer text into a component, stop. It is
 * the one piece of copy on this site that is legally load bearing and it exists
 * in exactly one place, in src/config/company.ts.
 *
 * White ground, because the mark sits here and the mark is only approved on
 * white.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-line border-t bg-white">
      <Container wide>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Wordmark as="plain" />
            <p className="text-steel mt-4 max-w-xs text-[0.9375rem] leading-relaxed">
              {COMPANY.descriptor}
            </p>
          </div>

          <div>
            <h2 className="text-graphite text-[0.9375rem] font-semibold">
              Company
            </h2>
            <ul className="mt-4 space-y-1">
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
            <h2 className="text-graphite text-[0.9375rem] font-semibold">
              Brands
            </h2>
            <ul className="mt-4 space-y-1">
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
            <h2 className="text-graphite text-[0.9375rem] font-semibold">
              Legal
            </h2>
            <ul className="mt-4 space-y-1">
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
    </footer>
  );
}
