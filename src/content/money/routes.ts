/**
 * The money pages as entries of the route registry (src/lib/routes.ts).
 *
 * The registry is the single decision about what is canonical, indexable and
 * in the sitemap, so the pages are added there rather than anywhere else. In
 * the "off" state this returns nothing, which is why a production build is
 * unchanged. In "preview" the pages are `noindex` and outside the sitemap; only
 * "live" makes them indexable and listed.
 *
 * Public Art is deliberately not added here: it already has a registry entry
 * (the offer routes) and stays indexable in every state.
 */
import type { RouteEntry } from "@/lib/routes";
import { global } from "@/content/global";
import { moneyMode, type MoneyMode } from "./launch";
import { moneyCanonical, moneyPages } from "./pages";

export function moneyRouteEntries(mode: MoneyMode = moneyMode()): RouteEntry[] {
  if (mode === "off") return [];
  const live = mode === "live";

  return moneyPages
    .filter((page) => !page.existing)
    .map((page) => ({
      path: page.path,
      label: page.label,
      parent: page.parent,
      group: "core" as const,
      noIndex: !live,
      inSitemap: live,
      canonicalUrl: moneyCanonical(page, global.domain)
    }));
}
