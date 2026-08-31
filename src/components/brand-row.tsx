import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLockup, hasBrandLockup } from "@/components/brand/brand-lockup";
import { BRANDS } from "@/config/company";

/**
 * The operating brands. One filled block each, running the full width.
 *
 * WHAT THIS IS NOW, AND WHY IT CHANGED TWICE. The original was a 307 by 316
 * pixel card in the left third of the content column with 685 pixels of empty
 * white beside it. The first rebuild made it full width and ruled, which fixed
 * the size and lost the treatment: the import fills this block with signal red
 * and reverses the type out of it, and that fill is the reason the brand reads
 * as the company's asset rather than as a directory entry.
 *
 * THE FILL IS SAFE FOR THE SAME REASON THE CLOSING BAND IS. One value goes on
 * red here: white, at 5.93, for the status pill, the category, the name and the
 * attribute pills. The trade and market pairs sit in a white panel beside the
 * fill rather than on it, which is where the import puts them and which keeps
 * the label type in graphite and steel where it belongs.
 *
 * NO SUMMARY INSIDE THE BLOCK, DELIBERATELY. The import carries a description
 * in this card. On this site BRANDS[].summary already renders as the paragraph
 * directly beneath the block on the home page, and it renders nowhere at all on
 * the brands index. Putting it in the card would duplicate it on one route and
 * add it to another, so the block carries the name and the attested attributes
 * and lets the existing paragraph do its job.
 *
 * THE REAL LOCKUP STAYS. The import carries a placeholder here; this carries
 * the delivered Wattsmith artwork, rendered as inline SVG so it can sit on a
 * white tile inside the red field without a rectangle of its own.
 *
 * THE IMPORT'S "WATTSMITH FIELD PHOTO" SLOT IS STILL DECLINED. No photography.
 * The right hand panel carries the brand's own facts, which is stronger than
 * the photograph would have been because a prospect reading it learns
 * something. The four pending stock slots stay pending and untouched.
 *
 * BUILT FOR MANY, RENDERING ONE. Driven by the BRANDS array, so a second brand
 * is a data edit. It will never be padded with invented brands to make the
 * company look larger: there is one operating brand today, the page shows one,
 * and a prospect who counts them learns something true.
 *
 * EVERY STRING TRACES TO src/config/company.ts. The name, category, city and
 * state are the four the retired card rendered. The pills are BRANDS[].
 * attributes verbatim, at lines 93 to 96, which the owner directed be surfaced
 * here alongside the import's pill device.
 */
export function BrandRow() {
  return (
    <ul className="space-y-10">
      {BRANDS.map((brand) => (
        <li key={brand.slug}>
          <div className="border-graphite grid border-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            {/* THE FILL. White and one tint, and nothing else. */}
            <div className="bg-signal-solid flex flex-col gap-7 p-7 sm:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-signal font-display inline-flex items-center bg-white px-3 py-1 text-sm font-extrabold tracking-[0.16em] uppercase">
                  Operating
                </span>
                <span className="font-display text-sm font-bold tracking-[0.16em] text-white uppercase">
                  {brand.category}
                </span>
              </div>

              {/*
                The delivered lockup on a white tile. It is approved on a light
                field only, so it gets one rather than being placed on the red.
                Decorative: the brand name is real text directly beneath it, so
                announcing the artwork would read the same name twice.
              */}
              {hasBrandLockup(brand.slug) ? (
                <span className="inline-flex self-start bg-white px-5 py-4">
                  <BrandLockup
                    slug={brand.slug}
                    decorative
                    className="h-12 w-auto max-w-[15rem]"
                  />
                </span>
              ) : null}

              <span className="d2 block text-white">{brand.name}</span>

              <ul className="flex flex-wrap gap-2.5">
                {brand.attributes.map((attribute) => (
                  <li
                    key={attribute}
                    className="font-display border-2 border-white/70 px-3.5 py-1.5 text-sm font-bold tracking-[0.1em] text-white uppercase"
                  >
                    {attribute}
                  </li>
                ))}
              </ul>
            </div>

            {/* THE FACTS. A white panel, so labels keep graphite and steel. */}
            <div className="border-graphite bg-line grid grid-cols-2 gap-px border-t-2 lg:border-t-0 lg:border-l-2">
              <div className="flex flex-col justify-center bg-white px-6 py-7">
                <span className="label-sm">Trade</span>
                <span className="d4 mt-2">{brand.category}</span>
              </div>
              <div className="flex flex-col justify-center bg-white px-6 py-7">
                <span className="label-sm">Market</span>
                <span className="d4 mt-2">
                  {brand.city}, {brand.state}
                </span>
              </div>
              <div className="col-span-2 bg-white px-6 py-7">
                <Link
                  href={`/brands/${brand.slug}`}
                  className="text-datum hover:text-datum-hover font-display inline-flex items-center gap-2 text-[1.0625rem] font-bold tracking-[0.07em] uppercase transition-colors"
                >
                  About {brand.name}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
