import Image from "next/image";
import { getImageSlot } from "@/data/images";

/**
 * A photograph from the manifest, rendered as an ordinary image.
 *
 * The retired system used photography as dark texture at low opacity behind a
 * graphite band. There are no dark bands any more, so imagery is what it is on
 * every corporate site: a picture in the layout, at full opacity, sized and
 * cropped by the container.
 *
 * IT READS FROM THE MANIFEST, WHICH IS THE POINT. src, dimensions and alt text
 * all come from src/data/images.ts, so an image cannot appear on a page without
 * a licence record existing for it, and the placeholder audit can verify that
 * every rendered path resolves. Passing a bare path here would defeat both.
 *
 * A slot still pending renders nothing rather than a grey box or a broken
 * image. A missing photograph is honest; a fake one is not.
 */
export function SectionImage({
  slot,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  slot: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const image = getImageSlot(slot);
  if (image.status !== "ready" || !image.src) return null;

  return (
    <Image
      src={image.src}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      alt={image.alt ?? ""}
      priority={priority}
      sizes={sizes}
      className={`border-line rounded-lg border object-cover ${className}`}
    />
  );
}
