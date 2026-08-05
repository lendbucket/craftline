import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";

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
 */
export default function NotFound() {
  return (
    <section className="bg-white">
      <Container>
        <div className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-xl">
            <p className="eyebrow">Error 404</p>
            <h1 className="h1 mt-3">This page does not exist.</h1>
            <p className="lead mt-5">
              The address may be mistyped, or the page may have moved. Nothing
              has gone wrong on your end.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Cta href="/">Return home</Cta>
              <Cta href="/contact" variant="secondary">
                Contact Craftline
              </Cta>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
