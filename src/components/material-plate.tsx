import Image from "next/image";
import { SchematicField } from "@/components/graphic";
import { getImageSlot } from "@/data/images";

/**
 * A material texture slot, in whatever state it is actually in.
 *
 * THIS IS WHAT "TREATMENT READY" MEANS. The layout, the ground, the overlay,
 * and the aspect are all decided and shipped now. Whether a licensed
 * photograph exists yet changes what is inside the plate and nothing else.
 * When files arrive, the only edit is in src/data/images.ts: flip the slot to
 * ready and fill in src, dimensions, and the licence. No page changes, no
 * layout changes, no scramble.
 *
 * Pending renders the raceway linework on the graphite ground. That is a
 * finished treatment rather than a placeholder: it is drawn for this site, it
 * carries the palette, and a visitor never sees a grey box or a broken image.
 *
 * Ready renders the photograph under the same graphite ground at low opacity,
 * which is why the manifest is insistent about tone. A bright, saturated, or
 * product lit image will punch through the overlay and fight the display type
 * sitting on top of it. The overlay is not there to rescue a bad photograph.
 *
 * Every plate is decorative. These are atmosphere behind headline type, they
 * assert nothing, and none of them carries information that is not in the text
 * in front of them, so they are hidden from assistive technology. A slot whose
 * manifest entry has real alt text is by definition not atmosphere and does not
 * belong in this component.
 */
export function MaterialPlate({
  id,
  className = "",
  /**
   * How strongly the photograph reads through the ground. Lower where display
   * type sits directly on it, higher where it is standing alone.
   */
  intensity = "quiet",
}: {
  id: string;
  className?: string;
  intensity?: "quiet" | "present";
}) {
  const slot = getImageSlot(id);

  /**
   * Quieter on phones and stronger on desktop. On a narrow viewport the text
   * column spans the full width, so there is nowhere for texture to sit that
   * is not behind type.
   */
  const opacity =
    intensity === "quiet"
      ? "opacity-[0.12] lg:opacity-[0.2]"
      : "opacity-25 lg:opacity-40";

  /**
   * Fades the plate out across the top left, which is where the label, the
   * headline, and the lead paragraph sit on every band that uses one.
   *
   * This exists because the first build ran the raceway linework edge to edge
   * and a conduit run went straight through the middle of the hero headline.
   * It was still legible, and it still looked like an accident. Texture behind
   * display type has to get out of the way of it rather than rely on being
   * faint enough to forgive.
   */
  const mask =
    "[mask-image:linear-gradient(115deg,transparent_0%,transparent_42%,black_92%)]";

  return (
    <div
      aria-hidden="true"
      className={`bg-graphite pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {slot.status === "ready" && slot.src ? (
        <Image
          src={slot.src}
          alt=""
          fill
          sizes="100vw"
          className={`object-cover ${opacity} ${mask}`}
          priority={false}
        />
      ) : (
        <SchematicField
          className={`text-copper h-full w-full ${opacity} ${mask}`}
        />
      )}
    </div>
  );
}
