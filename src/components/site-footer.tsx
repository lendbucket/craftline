import Link from "next/link";
import { Container } from "@/components/container";
import { Rule } from "@/components/section";
import { Wordmark } from "@/components/wordmark";
import {
  BRANDS,
  COMPANY,
  CONTACT_EMAIL,
  LEGAL_NAV,
  NAV,
} from "@/config/company";

/**
 * Site footer.
 *
 * THE DISCLAIMER MOVED, AND THAT IS THE POINT. It used to live here as small
 * grey type at the foot of the page. It now renders in the NOTES field of the
 * TitleBlock, which every page places directly above this footer. The rule
 * that every page carries FRANCHISE_DISCLAIMER verbatim is unchanged and still
 * impossible to violate by adding a page, because the title block is part of
 * the page shell rather than something an author remembers to include.
 *
 * If you are adding a page: render TitleBlock at the end of it. If you find
 * yourself typing the disclaimer text into a component, stop. It is the one
 * piece of copy on this site that is legally load bearing and it exists in
 * exactly one place.
 *
 * The corporate structure also moved into the title block's ENTITY field,
 * where it belongs, so this footer is now navigation and nothing else.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-graphite text-zinc">
      <Container wide>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Wordmark as="plain" />
            <p className="text-steel mt-5 max-w-xs text-[0.9375rem] leading-relaxed">
              {COMPANY.descriptor}
            </p>
          </div>

          <div>
            <Rule className="max-w-[8rem]" />
            <h2 className="label text-datum mt-4">Company</h2>
            <ul className="mt-5 space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-zinc hover:text-datum tap-44 inline-block py-1 text-[0.9375rem] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Rule className="max-w-[8rem]" />
            <h2 className="label text-datum mt-4">Brands</h2>
            <ul className="mt-5 space-y-1">
              {BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="text-zinc hover:text-datum tap-44 inline-block py-1 text-[0.9375rem] transition-colors"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Rule className="max-w-[8rem]" />
            <h2 className="label text-datum mt-4">Legal</h2>
            <ul className="mt-5 space-y-1">
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-zinc hover:text-datum tap-44 inline-block py-1 text-[0.9375rem] transition-colors"
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
                className="text-zinc hover:text-datum tap-44 mt-5 inline-block py-1 text-[0.9375rem] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            ) : null}
          </div>
        </div>

        <div className="border-rule border-t py-7">
          <p className="value text-steel">
            Copyright {year} {COMPANY.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
