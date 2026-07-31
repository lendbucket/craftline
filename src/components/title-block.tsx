import { Container } from "@/components/container";
import {
  COMPANY,
  FRANCHISE_DISCLAIMER,
  LEGAL_ENTITIES,
} from "@/config/company";

/**
 * THE TITLE BLOCK. The signature element of this site.
 * =====================================================
 *
 * Every construction drawing ends in a title block: a bordered grid of field
 * and value pairs carrying the sheet name, the revision, who issued it, and
 * the notes that govern how the drawing may be used. It is the most
 * recognisable artifact in technical drawing and almost nothing on the web
 * borrows it.
 *
 * WHY THIS IS THE SIGNATURE, AND NOT DECORATION
 * ---------------------------------------------
 * FRANCHISE_DISCLAIMER has to render verbatim on every page of this property.
 * Before this redesign it was small grey type at the foot of the footer, which
 * is exactly where legally required text goes to be ignored. Here it is the
 * NOTES field of a controlled document, which is precisely what it is. The
 * constraint stops being something the design works around and becomes the
 * thing the design is built on.
 *
 * Every field carries real data. There is no field here for the look of it: if
 * a value were invented to fill a cell, this would be costume rather than a
 * document, and the whole device would collapse.
 *
 * THE DISCIPLINE
 * --------------
 * This and the section register are the ONLY literal drawing-set devices on
 * the site. No paper textures, no torn edges, no shadows imitating a physical
 * sheet, no sheet borders with corner ticks. Everything else is ordinary
 * typographic layout on material grounds. The moment a second literal device
 * appears, this reads as a theme instead of a system.
 *
 * Do not reword the disclaimer, do not summarise it, and do not split it
 * across elements.
 */

type Props = {
  /**
   * The page this block closes. Rendered in the SHEET field, so it should be
   * the page's own name rather than a description.
   */
  sheet: string;
  /**
   * What the page is issued for. Defaults to the information-only statement,
   * which is true of every page on this site while the FDD is unissued. Legal
   * pages override it with their own status.
   */
  issuedFor?: string;
  /**
   * Revision date. Only the legal pages have a real one, so it is optional
   * rather than defaulted to a build timestamp: a REV that moves on every
   * deploy tells a reader the document changed when it did not, which is the
   * one thing a revision field must never do.
   */
  revision?: string;
};

/** One field in the block. Label above, value below, ruled off. */
function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-rule border-t px-5 py-4 ${className}`}>
      <p className="label-sm text-copper">{label}</p>
      <div className="value text-steel mt-2">{children}</div>
    </div>
  );
}

export function TitleBlock({
  sheet,
  issuedFor = "Information. Not an offer.",
  revision,
}: Props) {
  return (
    <section className="bg-graphite text-zinc">
      <Container wide>
        <div className="py-14 sm:py-16">
          {/*
            The block is a real grid rather than a decorative border: the top
            row holds the short identifying fields side by side the way a title
            block does, and the long fields run full width beneath it.
          */}
          <div className="border-rule border">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Sheet" className="border-t-0">
                {sheet}
              </Field>
              <Field label="Issued for" className="sm:border-t-0">
                {issuedFor}
              </Field>
              {/*
                REV renders only when the page has a genuine revision date.
                An empty or invented revision is worse than an absent one.
              */}
              {revision ? (
                <Field label="Rev" className="lg:border-t-0">
                  {revision}
                </Field>
              ) : null}
              <Field
                label="Origin"
                className={revision ? "" : "lg:border-t-0"}
              >
                {COMPANY.domain}
              </Field>
            </div>

            <Field label="Entity">
              <ul>
                {LEGAL_ENTITIES.map((entity) => (
                  <li key={entity.name}>
                    {entity.name} · {entity.jurisdiction}
                  </li>
                ))}
              </ul>
            </Field>

            {/*
              NOTES. The franchise disclaimer, verbatim, interpolated from
              config and never retyped here. This is the field the whole
              device exists to give a home to.
            */}
            <Field label="Notes">
              <p className="max-w-4xl leading-relaxed">
                {FRANCHISE_DISCLAIMER}
              </p>
            </Field>
          </div>
        </div>
      </Container>
    </section>
  );
}
