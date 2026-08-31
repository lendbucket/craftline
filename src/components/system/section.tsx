import { Container } from "@/components/container";

/**
 * THE SECTION SHELL
 * =================
 *
 * One component replacing the `<section><Container><Band>` triple that every
 * page used to assemble by hand. That triple is how the site ended up with 34
 * of 34 content bands on an identical padding value: nothing was choosing a
 * density, because there was only one to choose.
 *
 * DENSITY IS A REQUIRED DECISION, NOT A DEFAULT TO ACCEPT.
 *
 *   loose    A page opening, or the single block on a page that earns room.
 *            Roughly one per page. More than two and none of them is loose.
 *   normal   Ordinary content. Still the majority, and that is correct.
 *   tight    Connective tissue: a routing note, a strip of facts, a short
 *            prompt, a closing line. A band that joins two things should not be
 *            as tall as one that explains a model.
 *
 * GROUND is still only white or mist. Phase 2A considered dark grounds and
 * declined them: on graphite, signal red measures 2.99:1, datum blue 2.80:1
 * and steel 2.95:1, so carrying the brand on dark needs lightened variants and
 * a lightened brand red stops matching the logo, the Open Graph card and the
 * Organization schema. See the header of globals.css.
 *
 * `edge` adds a heavy graphite rule above the section. That rule is the second
 * rhythm device this system has and the reason two grounds are now enough: a
 * change of subject can be marked by a line rather than by a change of colour.
 * Use it where a page genuinely turns a corner, not between every band.
 */
export function Section({
  children,
  ground = "white",
  density = "normal",
  edge = false,
  id,
  className = "",
}: {
  children: React.ReactNode;
  ground?: "white" | "mist";
  density?: "loose" | "normal" | "tight";
  /** Heavy graphite rule across the top of the section. */
  edge?: boolean;
  id?: string;
  className?: string;
}) {
  const grounds = { white: "bg-white", mist: "bg-mist" } as const;
  const densities = {
    loose: "band-loose",
    normal: "band",
    tight: "band-tight",
  } as const;

  return (
    <section
      id={id}
      /*
        scroll-mt clears the in-page anchors on the franchising page. Without
        it, jumping to #vocabulary lands the heading flush against the top of
        the viewport with no breathing room above it.
      */
      className={`${grounds[ground]} ${edge ? "border-graphite border-t-2" : ""} ${id ? "scroll-mt-6" : ""} ${className}`}
    >
      <Container>
        <div className={densities[density]}>{children}</div>
      </Container>
    </section>
  );
}
