import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof document !== "undefined") document.documentElement.dataset.buildStamp = "1788367043";
gsap.registerPlugin(ScrollTrigger);

/**
 * Mobile-only editorial entrance for sections that otherwise have no scroll
 * reveal (PointOfView, HowWeJoin, StudioMoment, the final CTA blocks): a
 * measured fade/rise for a group's heading, body copy and action, arriving
 * as one staggered gesture rather than sitting static or popping abruptly.
 *
 * Desktop is untouched — these sections have no entrance motion above the
 * mobile breakpoint, and this only ever runs below it. Reuses the same
 * GSAP/ScrollTrigger already driving every other reveal on the site instead
 * of introducing a second motion system.
 */
export function initEditorialReveal(root: ParentNode) {
  if (!window.matchMedia("(max-width: 767px)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-group]"));

  groups.forEach((group, groupIndex) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (items.length === 0) return;

    // A little per-group variation so every section doesn't arrive with the
    // exact same fade-up — alternating rise distance and a touch of x drift,
    // closer to the mark's own fragments settling than one repeated tween.
    const rise = 16 + (groupIndex % 3) * 5;
    const drift = groupIndex % 2 === 0 ? 0 : 5;

    gsap.set(items, { opacity: 0, y: rise, x: drift });

    ScrollTrigger.create({
      trigger: group,
      start: "top 87%",
      once: true,
      onEnter: () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out"
        })
    });
  });
}
