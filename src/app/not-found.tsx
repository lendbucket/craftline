import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { Rule } from "@/components/section";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed, and Next does not set this for you.
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Deliberately does NOT render the title block. A title block is the signature
 * of a controlled document, and a 404 is the absence of one. Signing a page
 * that does not exist would make the device decorative, which is the one thing
 * it must never become.
 *
 * The footer still carries navigation, so someone landing here has a way out.
 */
export default function NotFound() {
  return (
    <section className="bg-graphite text-zinc">
      <Container>
        <div className="py-28 sm:py-36 lg:py-44">
          <div className="max-w-[22rem]">
            <Rule />
            <p className="label text-copper mt-4">Error 404</p>
          </div>
          <h1 className="display-1 mt-8 max-w-3xl text-balance">
            No sheet at this address.
          </h1>
          <p className="body-lg text-steel mt-8 max-w-xl">
            The address may be mistyped, or the page may have moved. Nothing has
            gone wrong on your end.
          </p>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Cta href="/">Return home</Cta>
            <Cta href="/contact" variant="outline">
              Contact Craftline
            </Cta>
          </div>
        </div>
      </Container>
    </section>
  );
}
