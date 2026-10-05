import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll behaviour for /automotive. Layout and media carry the page; motion is
 * secondary and small, and the page is complete without it:
 *
 *   - `[data-auto-reveal]`: a short fade and rise as an element enters, once.
 *   - `[data-auto-scale]`: the picture (and the clip over it) inside a frame
 *     settles from a slight enlargement, once. The frame clips it, so nothing
 *     moves on the page.
 *
 * Nothing here gates content: every element is fully visible without this
 * script, and under reduced motion it exits before animating anything. The
 * hero's own entrance is CSS keyframes (`.auto-open`). No scroll hijacking, no
 * snapping, no pinned or sticky elements, no parallax.
 */
export function initAutomotiveMotion(root: ParentNode = document) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const mobile = window.matchMedia("(max-width: 767px)").matches;

  root.querySelectorAll<HTMLElement>("[data-auto-reveal]").forEach((element) => {
    gsap.from(element, {
      opacity: 0,
      y: mobile ? 16 : 28,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 90%", once: true }
    });
  });

  root.querySelectorAll<HTMLElement>("[data-auto-scale]").forEach((element) => {
    // A clip and its poster settle together, so the loop never slides against its own still.
    const media = element.querySelectorAll<HTMLElement>("img, video");
    if (!media.length) return;

    gsap.fromTo(
      media,
      { scale: 1.07, transformOrigin: "50% 50%" },
      {
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true }
      }
    );
  });
}
