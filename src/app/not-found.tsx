import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Cta, CtaRow } from "@/components/cta";
import { Eyebrow } from "@/components/system/rule";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed, and Next does not set this for you.
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Short, plain, and useful. The header and footer still carry navigation, so
 * someone landing here has a way out without this page inventing one.
 *
 * It takes the page opening the whole site uses: split bar, category, display
 * title, one paragraph, two controls. The import leaves this template
 * undesigned along with four others, and the derivation here is the simplest of
 * the five, because a 404 is a page header and nothing else.
 */
export default function NotFound() {
  return (
    <section className="bg-white">
      <Container>
        <div className="band-loose">
          <div className="max-w-2xl">
            <Eyebrow>Error 404</Eyebrow>
            <h1 className="d1 mt-6">This page does not exist.</h1>
            <p className="lead mt-7">
              The address may be mistyped, or the page may have moved. Nothing
              has gone wrong on your end.
            </p>
            <CtaRow className="mt-10">
              <Cta href="/">Return home</Cta>
              <Cta href="/contact" variant="secondary">
                Contact Craftline
              </Cta>
            </CtaRow>
          </div>
        </div>
      </Container>
    </section>
  );
}
