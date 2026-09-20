import type { OfferKey } from "@/content/offers";
import { projectsForBuild } from "@/content/projects";
import { loadContentRecords } from "./content-source";
import { filterPublic } from "./publishing";
import { LANDING_SEGMENT } from "./routes";

/**
 * Internal linking, resolved from the content itself.
 *
 * Explicit Airtable graph edges always win. When some explicit targets are not
 * public yet, the remaining slots are backfilled with already-public siblings
 * from the same offer / shared topics. This preserves the locked architecture
 * without ever emitting links to future 404s during a staged rollout.
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
 * Related editorial links for a published page.
 *
 * 1. Use public Primary Parent / Related IDs first, in the Airtable order.
 * 2. If some explicit targets are still scheduled for the future, fill the
 *    remaining slots with already-public pages from the same pillar / topics.
 * 3. Never output an unpublished URL.
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
  const byId = new Map(published.map((record) => [record.id, record]));

  const explicitIds = [
    current.primaryParentId,
    ...(current.relatedIds ?? [])
  ].filter((id): id is string => Boolean(id));

  const selected: (typeof published)[number][] = [];
  const selectedIds = new Set<string>();

  for (const id of explicitIds) {
    if (selected.length >= limit) break;
    if (id === current.id || selectedIds.has(id)) continue;

    const record = byId.get(id);
    if (!record) continue;

    selected.push(record);
    selectedIds.add(id);
  }

  if (selected.length < limit) {
    const fallback = published
      .filter(
        (record) =>
          record.slug !== current.slug &&
          record.id !== current.id &&
          !selectedIds.has(record.id)
      )
      .map((record) => {
        const sharedTopics = record.topics.filter((t) => current.topics.includes(t)).length;
        const sameOffer = record.offer === current.offer ? 2 : 0;
        const reverseExplicit =
          record.primaryParentId === current.id ||
          (record.relatedIds ?? []).includes(current.id ?? "")
            ? 3
            : 0;

        return {
          record,
          score: reverseExplicit + sameOffer + sharedTopics
        };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.record.globalRank ?? Number.MAX_SAFE_INTEGER) -
          (b.record.globalRank ?? Number.MAX_SAFE_INTEGER);
      });

    for (const { record } of fallback) {
      if (selected.length >= limit) break;
      selected.push(record);
      selectedIds.add(record.id);
    }
  }

  return selected.map((record) => ({
    href: hrefFor(record),
    title: record.title,
    description: record.description,
    kind: record.type as "insight" | "guide"
  }));
}
