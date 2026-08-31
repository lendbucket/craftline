import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLockup, hasBrandLockup } from "@/components/brand/brand-lockup";
import { BRANDS } from "@/config/company";

/**
 * The operating brands, one ruled block each, running the full width of the
 * container.
 *
 * WHAT THIS REPLACED, AND WHY. The previous version was a three column card
 * grid holding one card. The diagnosis measured it: 307 pixels wide, 316 tall,
 * sitting at the left edge of the content column with 685 pixels of empty white
 * beside it. The single most distinctive asset this company owns, the operating
 * brand's delivered lockup, was being presented at the width of a form field
 * next to two thirds of a page of nothing.
 *
 * A grid built for many and rendering one will always look like that. So the
 * block is now built for one and stacks for many: it runs the full width, the
 * lockup gets a panel of its own, and a second brand adds a second block
 * beneath rather than filling a column that was waiting for it.
 *
 * BUILT FOR MANY, RENDERING ONE, UNCHANGED. The list is still driven by the
 * BRANDS array, so a second brand is a data edit in src/config/company.ts. What
 * it will never do is pad the list with invented brands to make the company
 * look larger. There is one operating brand today, the page shows one, and a
 * franchise prospect who counts them learns something true.
 *
 * THE IMPORT PUTS A "WATTSMITH FIELD PHOTO" IN THE RIGHT HALF OF THIS BLOCK ON
 * TWO PAGES. No such photograph exists and under the standing rule none will.
 * The right half carries the brand's own facts instead, which is stronger than
 * the photograph would have been because a prospect reading it learns
 * something. The four pending stock slots in src/data/images.ts stay pending
 * and untouched.
 *
 * NO NEW STRINGS. The name, the trade category and the city and state are the
 * three facts the retired card already rendered, in the same order, from the
 * same config fields. The import also adds Licensed, Insured and Veteran owned
 * chips here; those strings are committed in BRANDS[].attributes but they are
 * published on the brand's own page and not on this one, so surfacing them on
 * two more routes is a content decision rather than a presentation one and it
 * is held for the owner.
 *
 * Every panel is white or mist because each lockup is approved on a light
 * field, and because the Craftline mark rule applies to the whole page.
 */
export function BrandRow() {
  return (
    <ul className="space-y-8">
      {BRANDS.map((brand) => (
        <li key={brand.slug}>
          <Link
            href={`/brands/${brand.slug}`}
            className="border-graphite hover:border-datum group grid border-2 transition-colors lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
          >
            {/*
              The lockup well. Mist rather than white so the panel reads as a
              held surface rather than as empty page, and generous enough that
              the mark is the largest object in the block, which on a page about
              brands is the correct hierarchy.

              The lockup is decorative here: the brand name is rendered as real
              text beside it, so announcing the artwork as well would make a
              screen reader read the same name twice.
            */}
            <span className="bg-mist border-graphite flex items-center justify-center border-b-2 px-10 py-14 sm:py-20 lg:border-r-2 lg:border-b-0">
              {hasBrandLockup(brand.slug) ? (
                <BrandLockup
                  slug={brand.slug}
                  decorative
                  className="max-h-24 w-full max-w-sm"
                />
              ) : (
                <span className="d2 text-center">{brand.name}</span>
              )}
            </span>

            <span className="flex flex-col justify-center gap-6 p-7 sm:p-10">
              <span className="block">
                <span className="d2 block">{brand.name}</span>
                <span className="label-sm mt-4 block">{brand.category}</span>
                <span className="d4 mt-2 block">
                  {brand.city}, {brand.state}
                </span>
              </span>

              <span className="text-datum group-hover:text-datum-hover font-display inline-flex items-center gap-2 text-[1.0625rem] font-bold tracking-[0.07em] uppercase">
                About {brand.name}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
