import type { OfferKey } from "@/content/offers";
import { getOfferByKey } from "@/content/offers";
import { commercialHubFor } from "@/content/commercial-hubs";
import { projectsForBuild } from "@/content/projects";
import type { ContentRecord } from "./content-source/types";
import { loadContentRecords } from "./content-source";
import { filterPublic } from "./publishing";
import { LANDING_SEGMENT } from "./routes";

/**
 * Internal linking is resolved from the locked SEO graph stored on each record.
 *
 * The staged rollout must never create 404 links, so explicit graph targets are
 * rendered only once public. Missing future targets are temporarily replaced by
 * public siblings, while the parent falls back to the commercial hub / pillar
 * so every live page remains connected to the site architecture from day one.
 */

export interface RelatedLink {
  href: string;
  title: string;
  description: string;
  kind: "insight" | "guide" | "project";
}

export interface EditorialGraphLink {
  href: string;
  title: string;
  description: string;
  kind: "insight" | "guide" | "service";
  relation: "parent" | "child" | "related";
}

export interface EditorialGraph {
  parent?: EditorialGraphLink;
  children: EditorialGraphLink[];
  related: EditorialGraphLink[];
  inline: EditorialGraphLink[];
}

type EditorialGraphRecord = Pick<
  ContentRecord,
  | "id"
  | "slug"
  | "offer"
  | "topics"
  | "primaryParentId"
  | "relatedIds"
  | "commercialHubCode"
>;

function hrefFor(record: { type: string; slug: string }): string {
  return record.type === "guide"
    ? `/${LANDING_SEGMENT}/${record.slug}`
    : `/insights/${record.slug}`;
}

function graphLink(
  record: ContentRecord,
  relation: EditorialGraphLink["relation"]
): EditorialGraphLink {
  return {
    href: hrefFor(record),
    title: record.title,
    description: record.description,
    kind: record.type,
    relation
  };
}

function stableRank(record: ContentRecord): number {
  return record.globalRank ?? Number.MAX_SAFE_INTEGER;
}

function uniqueLinks(links: EditorialGraphLink[], limit: number): EditorialGraphLink[] {
  const seen = new Set<string>();
  const out: EditorialGraphLink[] = [];
  for (const link of links) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    out.push(link);
    if (out.length >= limit) break;
  }
  return out;
}

/** Everything published under a given pillar, for offer pages. */
export async function contentForOffer(offer: OfferKey, limit = 6): Promise<RelatedLink[]> {
  const published = filterPublic(await loadContentRecords());
  return published
    .filter((record) => record.offer === offer)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "guide" ? -1 : 1;
      return stableRank(a) - stableRank(b);
    })
    .slice(0, limit)
    .map((record) => ({
      href: hrefFor(record),
      title: record.title,
      description: record.description,
      kind: record.type
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
 * Resolve the complete public graph around one editorial page.
 *
 * - Parent: explicit public parent first; otherwise the commercial hub, then
 *   the pillar page. This guarantees an "up" edge for every published page.
 * - Children: reverse Primary Parent ID edges among already-public records.
 * - Related: explicit Related IDs first; missing future targets are backfilled
 *   with public pages from the same offer / shared topics.
 * - Inline: a compact parent/child/related subset injected into the article
 *   reading flow, so the graph is present inside the main editorial HTML and
 *   not only in a detached footer block.
 */
export async function editorialGraph(
  current: EditorialGraphRecord,
  relatedLimit = 6,
  childLimit = 4
): Promise<EditorialGraph> {
  const published = filterPublic(await loadContentRecords());
  const byId = new Map(published.map((record) => [record.id, record]));

  let parent: EditorialGraphLink | undefined;
  if (current.primaryParentId && current.primaryParentId !== current.id) {
    const parentRecord = byId.get(current.primaryParentId);
    if (parentRecord) parent = graphLink(parentRecord, "parent");
  }

  if (!parent) {
    const hub = commercialHubFor(current.commercialHubCode);
    if (hub) {
      parent = {
        href: hub.href,
        title: hub.title,
        description: "Commercial hub for this topic.",
        kind: "service",
        relation: "parent"
      };
    } else {
      const offer = getOfferByKey(current.offer);
      if (offer) {
        parent = {
          href: `/what-we-do/${offer.slug}`,
          title: offer.title,
          description: offer.summary,
          kind: "service",
          relation: "parent"
        };
      }
    }
  }

  const children = published
    .filter(
      (record) =>
        record.id !== current.id &&
        record.primaryParentId === current.id
    )
    .sort((a, b) => stableRank(a) - stableRank(b))
    .slice(0, childLimit)
    .map((record) => graphLink(record, "child"));

  const explicitRelatedIds = (current.relatedIds ?? []).filter(
    (id) => id && id !== current.id && id !== current.primaryParentId
  );
  const selected: ContentRecord[] = [];
  const selectedIds = new Set<string>([
    current.id ?? "",
    current.primaryParentId ?? "",
    ...children.map((link) => {
      const record = published.find((candidate) => hrefFor(candidate) === link.href);
      return record?.id ?? "";
    })
  ]);

  for (const id of explicitRelatedIds) {
    if (selected.length >= relatedLimit) break;
    if (selectedIds.has(id)) continue;
    const record = byId.get(id);
    if (!record) continue;
    selected.push(record);
    selectedIds.add(id);
  }

  if (selected.length < relatedLimit) {
    const fallback = published
      .filter(
        (record) =>
          record.id !== current.id &&
          record.slug !== current.slug &&
          !selectedIds.has(record.id)
      )
      .map((record) => {
        const sharedTopics = record.topics.filter((topic) =>
          current.topics.includes(topic)
        ).length;
        const sameOffer = record.offer === current.offer ? 2 : 0;
        const reverseExplicit =
          record.primaryParentId === current.id ||
          (record.relatedIds ?? []).includes(current.id ?? "")
            ? 3
            : 0;
        return { record, score: reverseExplicit + sameOffer + sharedTopics };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return stableRank(a.record) - stableRank(b.record);
      });

    for (const { record } of fallback) {
      if (selected.length >= relatedLimit) break;
      selected.push(record);
      selectedIds.add(record.id);
    }
  }

  const related = selected.map((record) => graphLink(record, "related"));
  const inline = uniqueLinks(
    [
      ...(parent ? [parent] : []),
      ...children.slice(0, 2),
      ...related
    ],
    4
  );

  return { parent, children, related, inline };
}

/** Backward-compatible helper for older callers. */
export async function relatedEditorial(
  current: EditorialGraphRecord,
  limit = 6
): Promise<RelatedLink[]> {
  const graph = await editorialGraph(current, limit);
  return graph.related.map(({ href, title, description, kind }) => ({
    href,
    title,
    description,
    kind: kind === "service" ? "guide" : kind
  }));
}
