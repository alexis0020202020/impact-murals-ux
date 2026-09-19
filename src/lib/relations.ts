import type { OfferKey } from "@/content/offers";
import { projectsForBuild } from "@/content/projects";
import { loadContentRecords } from "./content-source";
import { filterPublic } from "./publishing";
import { LANDING_SEGMENT } from "./routes";

/**
 * Internal linking, resolved from the content itself.
 *
 * Every record declares one `offer` and a list of `topics`. Relations are
 * computed from those two fields, so publishing an article automatically links
 * it to its offer, to sibling articles and to related specialised pages. No
 * page maintains a manual list of links.
 *
 * Deliberately not "everything links to everything": a relation needs a shared
 * offer or a shared topic to exist at all, and the strongest few win.
 */

export interface RelatedLink {
  href: string;
  title: string;
  description: string;
  kind: "insight" | "guide" | "project";
}

function hrefFor(record: { type: string; slug: string }): string {
  return record.type === "guide"
    ? `/${LANDING_SEGMENT}/${record.slug}`
    : `/insights/${record.slug}`;
}

/** Everything published under a given pillar, for offer pages. */
export async function contentForOffer(offer: OfferKey, limit = 6): Promise<RelatedLink[]> {
  const published = filterPublic(await loadContentRecords());
  return published
    .filter((record) => record.offer === offer)
    // Guides before articles: a specialised page is the stronger next step.
    .sort((a, b) => (a.type === b.type ? 0 : a.type === "guide" ? -1 : 1))
    .slice(0, limit)
    .map((record) => ({
      href: hrefFor(record),
      title: record.title,
      description: record.description,
      kind: record.type as "insight" | "guide"
    }));
}

/** Projects filed under a pillar, so offer pages show proof without a manual list. */
export function projectsForOffer(offer: OfferKey): RelatedLink[] {
  return projectsForBuild(import.meta.env?.DEV ?? false)
    .filter((project) => project.offer === offer)
    .map((project) => ({
      href: `/work/${project.slug}`,
      title: project.title,
      description: project.statement,
      kind: "project" as const
    }));
}

/**
 * Siblings for an editorial page: same offer first, then shared topics.
 * Excludes the current entry and never invents a relation that does not exist.
 */
export async function relatedEditorial(
  current: {
    id?: string;
    slug: string;
    offer: OfferKey;
    topics: string[];
    primaryParentId?: string;
    relatedIds?: string[];
  },
  limit = 6
): Promise<RelatedLink[]> {
  const published = filterPublic(await loadContentRecords());

  /*
   * The locked SEO graph wins when explicit relations exist.
   *
   * A target can be stored months before it is published. We keep that edge in
   * Airtable, but only render it when the target is actually public. This keeps
   * future URLs out of the live HTML without losing the architecture.
   */
  const explicitIds = [
    current.primaryParentId,
    ...(current.relatedIds ?? [])
  ].filter((id): id is string => Boolean(id));

  if (explicitIds.length > 0) {
    const byId = new Map(published.map((record) => [record.id, record]));
    const seen = new Set<string>();
    const explicit = explicitIds
      .filter((id) => id !== current.id && !seen.has(id) && seen.add(id))
      .map((id) => byId.get(id))
      .filter((record): record is NonNullable<typeof record> => Boolean(record))
      .slice(0, limit);

    return explicit.map((record) => ({
      href: hrefFor(record),
      title: record.title,
      description: record.description,
      kind: record.type as "insight" | "guide"
    }));
  }

  // Backward-compatible fallback for older records that do not yet carry graph edges.
  return published
    .filter((record) => record.slug !== current.slug)
    .map((record) => {
      const sharedTopics = record.topics.filter((t) => current.topics.includes(t)).length;
      const sameOffer = record.offer === current.offer ? 2 : 0;
      return { record, score: sameOffer + sharedTopics };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ record }) => ({
      href: hrefFor(record),
      title: record.title,
      description: record.description,
      kind: record.type as "insight" | "guide"
    }));
}
