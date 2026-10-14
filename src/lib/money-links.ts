import { global } from "@/content/global";
import { gatedState, isEditorial, isRedirected, registryPath } from "@/content/money/links";
import { moneyMode } from "@/content/money/launch";
import { knownPaths } from "./routes";

export interface ResolvedLink {
  /** Null when the target must be drawn as plain text. */
  href: string | null;
  /** True when the address leaves this build (the live site), used while the pages are in preview. */
  external: boolean;
  gated: boolean;
}

/**
 * Decide how one link renders in the current build (see src/content/money/links.ts
 * for the rules). Core pages and money pages are linked as written: the tests
 * check that every one of them is a route of the registry.
 */
export async function resolveLink(href: string): Promise<ResolvedLink> {
  const { gated, deployed } = gatedState(href);
  if (gated && !deployed) return { href: null, external: false, gated: true };
  // A page that now redirects is never linked: the sentence reads on without the link.
  if (isRedirected(href)) return { href: null, external: false, gated: false };

  if (!isEditorial(href)) return { href, external: false, gated };

  const known = await knownPaths();
  if (known.has(registryPath(href))) return { href, external: false, gated: false };

  // The guide exists on the live site, but not in this build (a local or preview build has no real editorial content).
  if (moneyMode() !== "live") return { href: `${global.domain}${href}`, external: true, gated: false };

  return { href: null, external: false, gated: false };
}
