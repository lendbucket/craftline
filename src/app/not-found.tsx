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
    <section className="bg-ink text-paper">
      <Container>
        <div className="py-28 sm:py-36">
          <p className="tracked-caps text-[0.65rem] text-bronze">Error 404</p>
          <h1 className="display-lg mt-5 text-paper">
            That page does not exist.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-dark">
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
