import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ImageMetadata } from "astro";
import { slotStem as automotiveStem } from "@/content/automotive";
import { studio } from "@/content/studio";
import { mediaSlots, ratioValue, slotStem, type MediaSlot, type MoneySlotId } from "@/content/money/media";
import { moneyMode } from "@/content/money/launch";

/**
 * Media lookup for the money pages (see src/content/money/media.ts for the
 * order of resolution and the rule for adding a file).
 *
 * Stills are optimised at build time by astro:assets in the component. A clip
 * is a muted loop laid over its own still, attached by the same script that
 * plays the Automotive clips.
 */

const ownStills = import.meta.glob<{ default: ImageMetadata }>("/src/assets/money/*.{jpg,jpeg,png,webp,avif}", {
  eager: true
});
const automotiveStills = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/automotive/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

/** The clip that already lives elsewhere on the site: reused by address, never copied. */
const sharedClips: Record<string, string> = { "studio-at-work": studio.media.video };

export type SlotState = "own" | "alias" | "placeholder";

export interface ResolvedSlot {
  id: MoneySlotId;
  def: MediaSlot;
  state: SlotState;
  /** The still, or the poster of a clip. Absent for a placeholder. */
  image?: ImageMetadata;
  video?: { src: string };
  /** Width divided by height: the picture's own, or the slot's layout proportion. */
  ratio: number;
}

function findStill(table: Record<string, { default: ImageMetadata }>, stem: string): ImageMetadata | undefined {
  for (const [path, module] of Object.entries(table)) {
    const name = path.split("/").pop()?.replace(/\.[^.]+$/, "").toLowerCase();
    if (name === stem) return module.default;
  }
  return undefined;
}

function publicFile(relative: string): boolean {
  // process.cwd(), not import.meta.url: a built chunk relocates under dist/.
  return existsSync(join(process.cwd(), "public", relative));
}

export function resolveSlot(id: MoneySlotId): ResolvedSlot {
  const def: MediaSlot = mediaSlots[id];
  const stem = slotStem(id);

  const own = findStill(ownStills, stem);
  if (own) {
    const borrowed = def.clipAlias ? automotiveStem(def.clipAlias) : undefined;
    const clip = publicFile(`videos/money/${stem}.mp4`)
      ? { src: `/videos/money/${stem}.mp4` }
      : borrowed && publicFile(`videos/automotive/${borrowed}.mp4`)
        ? { src: `/videos/automotive/${borrowed}.mp4` }
        : undefined;
    return { id, def, state: "own", image: own, video: clip, ratio: Number((own.width / own.height).toFixed(4)) };
  }

  if (def.alias) {
    const aliasStem = automotiveStem(def.alias);
    const image = findStill(automotiveStills, aliasStem);
    if (image) {
      const shared = sharedClips[aliasStem];
      const clip = def.stillOnly
        ? undefined
        : shared
          ? { src: shared }
          : publicFile(`videos/automotive/${aliasStem}.mp4`)
            ? { src: `/videos/automotive/${aliasStem}.mp4` }
            : undefined;
      return { id, def, state: "alias", image, video: clip, ratio: Number((image.width / image.height).toFixed(4)) };
    }
  }

  // A launch build refuses a hole: every slot must be a real picture before the pages go live.
  if (moneyMode() === "live") {
    throw new Error(
      `Money pages: ${id} has no image. Add src/assets/money/${stem}.jpg (see src/content/money/media.ts). Brief: ${def.brief}.`
    );
  }

  return { id, def, state: "placeholder", ratio: ratioValue(def.ratio) };
}

/** Widths a browser may choose from: the usual steps below the master, then the master itself. */
export const imageSteps = [360, 540, 720, 1080, 1440, 1800] as const;

export function imageWidths(image: ImageMetadata): number[] {
  return [...imageSteps.filter((width) => width < image.width), image.width];
}
