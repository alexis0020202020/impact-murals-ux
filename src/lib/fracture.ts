import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof document !== "undefined") document.documentElement.dataset.buildStamp = "1788367043";
gsap.registerPlugin(ScrollTrigger);

/**
 * Per-shard rest offsets before settling, keyed by the same shard classes
 * FractureReveal.astro renders. Directions echo the logo's own fragments:
 * pieces pull apart along the seam, then return to exact alignment.
 */
const OFFSETS: Record<string, { x: number; y: number; rotate: number }> = {
  "fracture-shard-a1": { x: -18, y: -22, rotate: -3.5 },
  "fracture-shard-a2": { x: 16, y: 20, rotate: 3 },
  "fracture-shard-b1": { x: -20, y: 14, rotate: -4 },
  "fracture-shard-b2": { x: 0, y: -18, rotate: 2.5 },
  "fracture-shard-b3": { x: 20, y: 12, rotate: -2.5 }
};

function shardOffset(el: HTMLElement) {
  for (const cls of el.classList) {
    if (OFFSETS[cls]) return OFFSETS[cls];
  }
  return { x: 0, y: 0, rotate: 0 };
}

/**
 * Signals that a panel's shards have reached their resting, assembled
 * position. `media-autoplay.ts` listens for this on panels that carry a
 * single crossfade video (see `armFractureHandoff`) so the video is never
 * revealed before the fracture animation itself has visually completed. The
 * `data-fracture-settled` attribute covers the case where a video becomes
 * ready to reveal after the panel already settled (a late IntersectionObserver
 * callback on a slow connection), so that listener can check synchronously
 * instead of only via the event.
 */
function markSettled(panel: HTMLElement) {
  panel.dataset.fractureSettled = "true";
  panel.dispatchEvent(new CustomEvent("fracturesettled"));
}

export interface FractureRevealOptions {
  /** Play immediately (hero-adjacent content) instead of on scroll-into-view. */
  immediate?: boolean;
  /** Extra delay before playing, seconds. */
  delay?: number;
  scrollStart?: string;
}

export function initFractureReveal(root: ParentNode, options: FractureRevealOptions = {}) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-fracture-panel]"));

  panels.forEach((panel) => {
    const shards = Array.from(panel.querySelectorAll<HTMLElement>("[data-fracture-shard]"));
    if (shards.length === 0) return;

    if (reduceMotion) {
      gsap.set(shards, { x: 0, y: 0, rotate: 0 });
      markSettled(panel);
      return;
    }

    gsap.set(shards, {
      x: (_i, el) => shardOffset(el as HTMLElement).x,
      y: (_i, el) => shardOffset(el as HTMLElement).y,
      rotate: (_i, el) => shardOffset(el as HTMLElement).rotate,
      transformOrigin: "50% 50%"
    });

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      gsap.to(shards, {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.85,
        stagger: 0.07,
        ease: "power3.out",
        onComplete: () => markSettled(panel)
      });
    };

    if (options.immediate) {
      gsap.delayedCall(options.delay ?? 0, play);
      return;
    }

    ScrollTrigger.create({
      trigger: panel,
      start: options.scrollStart ?? "top 85%",
      once: true,
      onEnter: play
    });

    /*
      Failsafe, not a second trigger: `ScrollTrigger`'s own "top 85%" start
      position is computed once at creation and only recalculated on resize
      or an explicit `.refresh()`. A late layout shift after that first
      calculation — most commonly a web font swapping in after its initial
      fallback render — can leave the computed pixel position stale, so
      `onEnter` either fires against the wrong point or not at all while the
      panel is visibly on screen; the shards would then sit indefinitely at
      their offset, unsettled starting position; a set of overlapping
      partial copies of the same placeholder graphic, rather than the single
      settled image. An `IntersectionObserver` cross-check removes the
      dependency on that one calculated pixel value: once the panel is
      genuinely visible per the browser's own intersection math (not GSAP's),
      `play()` runs if it still hasn't (the `played` guard above makes this
      safe to call alongside a normal `onEnter`, whichever fires first).
    */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            play();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(panel);
  });

  // A web font finishing its swap after ScrollTrigger's first calculation is
  // exactly the kind of late layout shift the failsafe above exists for;
  // refreshing once fonts are ready keeps every other ScrollTrigger-driven
  // reveal on the page (headings, media drift) correctly positioned too,
  // not just the panels this function owns.
  document.fonts?.ready?.then(() => ScrollTrigger.refresh()).catch(() => {});
}

/**
 * Subtle re-fracture on hover/focus for interactive preview panels: shards
 * nudge apart by a fraction of their settle offset, then return. Used by the
 * offer-choice interface, not the one-time entrance reveal above.
 */
export function armFractureHover(panel: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const shards = Array.from(panel.querySelectorAll<HTMLElement>("[data-fracture-shard]"));
  if (shards.length === 0) return;

  // Both tweens explicitly control x/y/rotate together: `overwrite: true`
  // kills any in-flight tween on these shards outright (including the
  // one-time entrance reveal's own rotate, if hover interrupts it mid-flight)
  // so a property that isn't restated here would freeze wherever it was
  // interrupted instead of returning to rest. Confirmed by direct testing
  // (rapid hover before the entrance settled left `rotate` stuck).
  const nudge = () =>
    gsap.to(shards, {
      x: (_i, el) => shardOffset(el as HTMLElement).x * 0.16,
      y: (_i, el) => shardOffset(el as HTMLElement).y * 0.16,
      rotate: 0,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true
    });

  const settle = () =>
    gsap.to(shards, { x: 0, y: 0, rotate: 0, duration: 0.45, ease: "power2.out", overwrite: true });

  panel.addEventListener("pointerenter", nudge);
  panel.addEventListener("pointerleave", settle);
  panel.addEventListener("focusin", nudge);
  panel.addEventListener("focusout", settle);
}
