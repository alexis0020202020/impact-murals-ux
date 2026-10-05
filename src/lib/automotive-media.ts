import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import { slotStem, type AutomotiveSlot } from "@/content/automotive";
import { studio } from "@/content/studio";

/**
 * Media lookup for /automotive.
 *
 * Each slot (see `automotiveSlots`) is backed by real files:
 *
 *   still   src/assets/automotive/<stem>.<jpg|jpeg|png|webp|avif>
 *           optimised at build time by astro:assets (responsive WebP with real
 *           dimensions), so a master of 1500 to 2000 px is all that is needed.
 *   video   public/videos/automotive/<stem>.mp4   (optional, muted loop)
 *
 * A slot with a video still needs its still: it is the poster (the picture shown
 * until the clip is near the viewport, and for good when motion is reduced), and
 * it gives the frame its aspect ratio so nothing shifts when the clip arrives.
 * `<stem>` is the slot in lower case with hyphens: BMW_BINANCE_MAIN is
 * bmw-binance-main. A slot with no still throws, so the build fails loudly
 * instead of shipping a hole.
 */

/**
 * Clips that already live elsewhere on the site are reused by address, never
 * copied: one file, one place. STUDIO_AT_WORK is the clip of the homepage's
 * "ARTIST-LED. PROJECT-DRIVEN." section, read from the same content module that
 * section reads (`studio.media.video`), so the two can never drift apart. Only
 * its poster (the still of the slot) is a file of this page.
 */
const sharedClips: Partial<Record<AutomotiveSlot, string>> = {
  STUDIO_AT_WORK: studio.media.video
};

const stills = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/automotive/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

export interface ResolvedMedia {
  slot: AutomotiveSlot;
  /** The still, or the poster of a clip. */
  image: ImageMetadata;
  /** A muted loop for this slot, present when `public/videos/automotive/<stem>.mp4` exists. */
  video?: { src: string };
}

function findStill(stem: string): ImageMetadata | undefined {
  for (const [path, module] of Object.entries(stills)) {
    const name = path.split("/").pop()?.replace(/\.[^.]+$/, "").toLowerCase();
    if (name === stem) return module.default;
  }
  return undefined;
}

function publicFile(relative: string): boolean {
  // process.cwd(), not import.meta.url: a built chunk relocates under dist/.
  return existsSync(join(process.cwd(), "public", relative));
}

export async function resolveMedia(slot: AutomotiveSlot): Promise<ResolvedMedia> {
  const stem = slotStem(slot);

  const image = findStill(stem);
  if (!image) {
    throw new Error(`/automotive: ${slot} has no image. Add src/assets/automotive/${stem}.jpg (see docs/AUTOMOTIVE-MEDIA.md).`);
  }

  const shared = sharedClips[slot];
  const own = publicFile(`videos/automotive/${stem}.mp4`) ? { src: `/videos/automotive/${stem}.mp4` } : undefined;
  const video = shared ? { src: shared } : own;

  return { slot, image, video };
}

/** Widths a browser may choose from: the usual steps below the master, then the master itself. */
export const imageSteps = [360, 540, 720, 1080, 1440, 1800] as const;

export function imageWidths(image: ImageMetadata): number[] {
  return [...imageSteps.filter((width) => width < image.width), image.width];
}

/**
 * A `src` and a `srcset` of WebP files for one picture, for the opening
 * `<picture>` where two crops are chosen by media query (art direction), which
 * the plain `<Image widths>` cannot express.
 */
export async function responsiveSet(image: ImageMetadata, widths: number[] = imageWidths(image)) {
  const files = await Promise.all(widths.map((width) => getImage({ src: image, width, format: "webp" })));
  return {
    src: files[files.length - 1].src,
    srcset: files.map((file, index) => `${file.src} ${widths[index]}w`).join(", ")
  };
}
