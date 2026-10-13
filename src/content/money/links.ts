/**
 * Which destinations a money page may link to, and how a link is treated while
 * its target is not safely available.
 *
 * A link is never invented. Four kinds exist:
 *
 *   - a money page or a core page: a real route, linked as written;
 *   - an editorial guide or insight (`/guides/...`, `/insights/...`): linked
 *     relatively when the current build generated it, otherwise to its address
 *     on the live site while the money pages are being reviewed, and left as
 *     plain text once they are live (a launch build must not carry a link that
 *     points nowhere);
 *   - a gated route: a page that is specified but not deployed. It is written
 *     as plain text until its flag is switched on.
 *
 * The resolution that needs the route registry is in src/lib/money-links.ts.
 * This module is plain TypeScript so the tests can read it.
 */

/**
 * Routes that are part of the commercial system but not deployed yet. The
 * Strategy Master recorded a 404 at /mural-artist-dubai/; every link to it
 * stays plain text until `deployed` is switched to true, and the sentence
 * around it still reads naturally without the link.
 */
export const gatedRoutes: Record<string, { label: string; deployed: boolean }> = {
  "/mural-artist-dubai/": { label: "Mural Artist", deployed: false }
};

export function gatedState(href: string): { gated: boolean; deployed: boolean } {
  const entry = gatedRoutes[href];
  return entry ? { gated: true, deployed: entry.deployed } : { gated: false, deployed: true };
}

export function isEditorial(href: string): boolean {
  return href.startsWith("/guides/") || href.startsWith("/insights/");
}

/** The registry spells paths without a trailing slash. */
export function registryPath(href: string): string {
  const path = href.split("#")[0].split("?")[0];
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}
