import { offers } from "@/content/offers";
import { capabilities } from "@/content/capabilities";
import type { ContentRecord, ContentType } from "./content-source";
import { loadContentRecords } from "./content-source";
import { filterPublic } from "./publishing";
import { versionOf } from "./content-source/manifest";

/**
 * One derived map of every public route.
 *
 * Sitemaps, breadcrumbs, indexes and the orphan check all read from here, so
 * adding an article means editing the editorial source and nothing else.
 * Nothing in this project hardcodes a list of URLs.
 *
 * Async because the editorial source may be remote. The snapshot is cached for
 * the whole build, so this resolves once however many pages call it, and every
 * artefact of one build therefore describes the same instant.
 */

export type SitemapGroup = "core" | "insights" | "guides";

export interface RouteEntry {
  path: string;
  label: string;
  /** Parent path, used to build breadcrumbs without per-page configuration. */
  parent?: string;
  /**
   * Canonical, indexable, and generated in this build. This is the only
   * condition for appearing in a sitemap, so a sitemap cannot list a URL the
   * build did not produce or a page that asks not to be indexed.
   */
  inSitemap: boolean;
  group: SitemapGroup;
  /** Drives the meta robots tag. Same source as `inSitemap`, so they agree. */
  noIndex: boolean;
  /**
   * Last significant change to the published content, ISO date.
   *
   * Absent whenever there is no trustworthy answer, which is the honest state
   * for a page whose content is not tracked record by record. An absent value
   * means the sitemap omits `lastmod` rather than substituting the build time,
   * which would tell crawlers that every page changed on every rebuild.
   */
  lastmod?: string;
}

/** Specialised pages use their own segment so they never collide with offers. */
export const LANDING_SEGMENT = "guides";
export const INSIGHTS_SEGMENT = "insights";

/**
 * Entries per index page.
 *
 * Small enough that a page stays readable, large enough that the section does
 * not fragment into dozens of thin pages.
 */
export const PER_PAGE = 12;

const staticRoutes: Array<Omit<RouteEntry, "group" | "noIndex" | "inSitemap">> = [
  { path: "/", label: "Home" },
  { path: "/what-we-do", label: "What We Do", parent: "/" },
  { path: "/studio", label: "Studio", parent: "/" },
  { path: "/discuss-a-project", label: "Discuss a Project", parent: "/" }
];

/** `/insights`, then `/insights/page/2`. Page one keeps the bare URL. */
export function pagePath(base: string, page: number): string {
  return page <= 1 ? base : `${base}/page/${page}`;
}

export function pageCount(total: number, perPage: number = PER_PAGE): number {
  return Math.max(1, Math.ceil(total / perPage));
}

export function pageSlice<T>(items: T[], page: number, perPage: number = PER_PAGE): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

/**
 * The only trustworthy modification date.
 *
 * `contentChangedAt` is written by the confirmation step, and only when the
 * deployed version hash actually changed. A rebuild that changes nothing does
 * not move it, and neither does the confirmation write itself. Every other
 * candidate, including the Airtable "last modified" field, moves when a
 * technical cell is touched and would misreport a change, so none is used here.
 */
export function reliableLastmod(record: ContentRecord): string | undefined {
  // The stored date belongs to the confirmed version, not a subsequent edit.
  if (!record.liveVersion || record.liveVersion !== versionOf(record)) return undefined;
  const value = record.contentChangedAt;
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

/** Newest first, with a deterministic tie-break so two builds agree. */
export function sortEditorial(records: ContentRecord[]): ContentRecord[] {
  return [...records].sort((a, b) => {
    const diff = new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime();
    return diff !== 0 ? diff : a.slug.localeCompare(b.slug);
  });
}

/** Everything of one type that this build publishes, ordered for display. */
export async function publishedOfType(type: ContentType): Promise<ContentRecord[]> {
  return sortEditorial(filterPublic(await loadContentRecords()).filter((r) => r.type === type));
}

export function sectionSegment(type: ContentType): string {
  return type === "guide" ? LANDING_SEGMENT : INSIGHTS_SEGMENT;
}

export function sectionLabel(type: ContentType): string {
  return type === "guide" ? "Guides" : "Insights";
}

let cachedRoutes: RouteEntry[] | null = null;

export async function buildRoutes(): Promise<RouteEntry[]> {
  if (cachedRoutes) return cachedRoutes;

  const core: RouteEntry[] = staticRoutes.map((route) => ({
    ...route,
    group: "core" as const,
    noIndex: false,
    inSitemap: true
  }));

  const offerRoutes: RouteEntry[] = offers.map((offer) => ({
    path: `/what-we-do/${offer.slug}`,
    label: offer.shortTitle,
    parent: "/what-we-do",
    group: "core" as const,
    noIndex: false,
    inSitemap: true
  }));

  /** The 20 "WHAT WE CAN CREATE" sales pages, one level under their parent offer. */
  const capabilityRoutes: RouteEntry[] = capabilities.map((capability) => ({
    path: `/what-we-do/${capability.offerKey}/${capability.slug}`,
    label: capability.shortTitle,
    parent: `/what-we-do/${capability.offerKey}`,
    group: "core" as const,
    noIndex: false,
    inSitemap: true
  }));

  const published = filterPublic(await loadContentRecords());
  const types: ContentType[] = ["insight", "guide"];

  const sections = types.map((type) => {
    const group: SitemapGroup = type === "guide" ? "guides" : "insights";
    const base = `/${sectionSegment(type)}`;
    const entries = sortEditorial(published.filter((r) => r.type === type));

    /*
      A test fixture is rendered in development so the template can be checked,
      but it is never a canonical indexable URL. Marking it noindex and keeping
      it out of the sitemap is the same decision expressed once.
    */
    const contentRoutes: RouteEntry[] = entries.map((entry) => {
      const noIndex = Boolean(entry.noIndex) || Boolean(entry.isTestFixture);
      return {
        path: `${base}/${entry.slug}`,
        label: entry.title,
        parent: base,
        group,
        noIndex,
        inSitemap: !noIndex,
        lastmod: reliableLastmod(entry)
      };
    });

    /*
      The index exists only when the section has something to list, and its
      paginated pages exist only when there is genuinely more than one page.
      Every page is a real URL carrying real links, so an entry that has fallen
      off the first page stays reachable by following links from the homepage.
    */
    const indexRoutes: RouteEntry[] =
      entries.length === 0
        ? []
        : Array.from({ length: pageCount(entries.length) }, (_unused, i) => {
            const page = i + 1;
            const slice = pageSlice(entries, page);
            const indexable = slice.some((entry) => !entry.noIndex && !entry.isTestFixture);
            const route: RouteEntry = {
              path: pagePath(base, page),
              label: page === 1 ? sectionLabel(type) : `${sectionLabel(type)}, page ${page}`,
              parent: page === 1 ? "/" : base,
              group,
              noIndex: !indexable,
              // Index membership/order is not versioned. Omit rather than invent lastmod.
              inSitemap: indexable
            };
            return route;
          });

    return [...indexRoutes, ...contentRoutes];
  });

  cachedRoutes = [...core, ...offerRoutes, ...capabilityRoutes, ...sections.flat()];
  return cachedRoutes;
}

/** Base path of a section index, or undefined when the section has no pages. */
export async function sectionIndexPath(type: ContentType): Promise<string | undefined> {
  const base = `/${sectionSegment(type)}`;
  const routes = await buildRoutes();
  return routes.some((route) => route.path === base) ? base : undefined;
}

export async function sitemapRoutes(): Promise<string[]> {
  return (await buildRoutes()).filter((route) => route.inSitemap).map((route) => route.path);
}

/**
 * The registry entry for a path.
 *
 * Templates read their own indexation state from here rather than recomputing
 * it, which is what keeps the meta robots tag and the sitemap from ever
 * disagreeing: there is one decision, made in one place.
 */
export async function routeFor(path: string): Promise<RouteEntry | undefined> {
  return (await buildRoutes()).find((route) => route.path === path);
}

/** Every generated path, used to detect internal links that point nowhere. */
export async function knownPaths(): Promise<Set<string>> {
  return new Set((await buildRoutes()).map((route) => route.path));
}

/** Walks parents to produce a breadcrumb trail for any known path. */
export async function breadcrumbsFor(path: string): Promise<RouteEntry[]> {
  const routes = await buildRoutes();
  const byPath = new Map(routes.map((r) => [r.path, r]));
  const trail: RouteEntry[] = [];

  let current = byPath.get(path);
  let guard = 0;
  while (current && guard++ < 10) {
    trail.unshift(current);
    current = current.parent ? byPath.get(current.parent) : undefined;
  }

  return trail;
}
