import Link from "next/link";
import { BrandLockup, hasBrandLockup } from "@/components/brand/brand-lockup";
import { BRANDS } from "@/config/company";

/**
 * The brand row on the home page: one white card per operating brand, each
 * carrying that brand's delivered lockup and linking to its page.
 *
 * BUILT FOR MANY, RENDERING ONE. The grid is driven by the BRANDS array, so a
 * second brand is a data edit in src/config/company.ts and nothing here
 * changes. What it will never do is pad the row with invented brands to make
 * the company look larger. There is one operating brand today, the row shows
 * one, and a franchise prospect who counts the cards learns something true.
 *
 * That is also why this is a static grid rather than a carousel. A carousel
 * implies there is more to see off screen; with one brand it would either sit
 * motionless and look broken or rotate a single slide and look padded. When
 * the array grows past what a row can hold, revisit it then.
 *
 * Every card is white because each lockup is approved on a light field, and
 * because the Craftline mark rule applies to the whole page.
 */
export function BrandRow() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {BRANDS.map((brand) => (
        <li key={brand.slug}>
          <Link
            href={`/brands/${brand.slug}`}
            className="border-line hover:border-datum flex h-full flex-col rounded-lg border bg-white transition-colors"
          >
            {/*
              Fixed height on the lockup well so cards stay aligned when a
              second brand arrives with artwork of a different aspect ratio.
              The lockup is decorative here: the brand name is rendered as real
              text directly beneath it, so announcing the artwork as well would
              make a screen reader read the same name twice.
            */}
            <span className="border-line flex h-32 items-center justify-center border-b px-8">
              {hasBrandLockup(brand.slug) ? (
                <BrandLockup
                  slug={brand.slug}
                  decorative
                  className="max-h-16 w-full max-w-[13rem]"
                />
              ) : (
                <span className="text-graphite text-lg font-semibold">
                  {brand.name}
                </span>
              )}
            </span>

            <span className="flex flex-1 flex-col p-6">
              <span className="text-graphite text-lg font-semibold">
                {brand.name}
              </span>
              <span className="text-steel mt-1 text-[0.9375rem]">
                {brand.category}
              </span>
              <span className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                {brand.city}, {brand.state}
              </span>
              <span className="text-datum mt-5 text-[0.9375rem] font-semibold">
                About {brand.name}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
