import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed, and Next does not set this for you.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-graphite text-zinc">
      <Container>
        <div className="py-28 sm:py-36">
          <p className="label-sm text-copper">Error 404</p>
          <h1 className="display-2 mt-5 text-zinc">
            That page does not exist.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-steel">
            The address may be mistyped, or the page may have moved.
          </p>
          <div className="mt-10">
            <Cta href="/">Return home</Cta>
          </div>
        </div>
      </Container>
    </section>
  );
}
