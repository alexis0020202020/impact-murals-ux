import { seo } from "@/content/seo";
import { buildRoutes, type RouteEntry, type SitemapGroup } from "./routes";

/**
 * Sitemap generation, derived from the route registry and nothing else.
 *
 * The registry already decides what is canonical, indexable and generated, so
 * there is no second definition of "should this be listed" that could drift
 * away from the meta robots tag on the page itself.
 *
 * The set is split into a sitemap index plus one sitemap per group. That keeps
 * the editorial sections separate from the commercial pages, so a crawl report
 * says which part of the site is affected. An empty group produces no file and
 * is not referenced, because an empty sitemap is a reported error rather than
 * useful information.
 */

export const SITEMAP_GROUPS: SitemapGroup[] = ["core", "insights", "guides"];

export function sitemapPath(group: SitemapGroup): string {
  return `/sitemap-${group}.xml`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absolute(path: string): string {
  return escapeXml(`${seo.canonicalBase}${path === "/" ? "/" : path}`);
}

/** Indexable, canonical routes of one group, in a stable order. */
export async function groupEntries(group: SitemapGroup): Promise<RouteEntry[]> {
  const routes = await buildRoutes();
  return routes
    .filter((route) => route.inSitemap && route.group === group)
    .sort((a, b) => a.path.localeCompare(b.path));
}

/** Only the groups that actually have URLs in this build. */
export async function nonEmptyGroups(): Promise<SitemapGroup[]> {
  const present: SitemapGroup[] = [];
  for (const group of SITEMAP_GROUPS) {
    if ((await groupEntries(group)).length > 0) present.push(group);
  }
  return present;
}

export function renderUrlset(entries: RouteEntry[]): string {
  const urls = entries
    .map((entry) => {
      // Omitted rather than faked: see reliableLastmod in routes.ts.
      const lastmod = entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : "";
      return `  <url><loc>${absolute(entry.path)}</loc>${lastmod}</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderSitemapIndex(groups: SitemapGroup[]): string {
  const items = groups
    .map((group) => `  <sitemap><loc>${absolute(sitemapPath(group))}</loc></sitemap>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

export const XML_HEADERS = { "Content-Type": "application/xml; charset=utf-8" };
