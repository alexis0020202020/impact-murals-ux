import { createHash } from "node:crypto";
import type { ContentRecord } from "./types";
import { BASE_ID, TABLE_ID } from "../../../scripts/lib/editorial-scope.mjs";

/**
 * The deploy manifest.
 *
 * Approval and a past date say what was *intended*. They are not evidence that
 * anything is live. The manifest records exactly which records, at exactly
 * which versions, went into one build, so confirmation can later be written
 * against that snapshot rather than against whatever Airtable says at
 * confirmation time.
 *
 * That distinction matters: if an editor changes an article while the build is
 * running, re-reading Airtable afterwards would confirm a version that was
 * never deployed.
 */

export interface ManifestEntry {
  id: string;
  slug: string;
  type: string;
  /** Hash of the content that was actually rendered into this build. */
  version: string;
  sourceEditedAt: string;
}

export interface DeployManifest {
  schemaVersion: number;
  siteId: string;
  baseId: string;
  tableId: string;
  context: string;
  source: string;
  omittedIds: string[];
  /** Set by Netlify during the build. Empty locally. */
  deployId: string;
  commit: string;
  builtAt: string;
  entries: ManifestEntry[];
}

/**
 * Version hash.
 *
 * Covers every field that changes the rendered page. `updatedAt` is excluded
 * on purpose: an Airtable "last modified" timestamp moves when any cell is
 * touched, including the confirmation fields this system writes itself, which
 * would make every record look changed after every deploy.
 */
export function versionOf(record: ContentRecord): string {
  const material = JSON.stringify([
    record.id,
    record.type,
    record.slug,
    record.title,
    record.description,
    record.offer,
    record.topics,
    record.body,
    record.author,
    record.image?.src ?? "",
    record.image?.alt ?? "",
    record.image?.caption ?? "",
    record.intent ?? "",
    record.publishAt,
    // Indexation is part of what is rendered: flipping it changes the meta
    // robots tag and the sitemap, so it must count as a content change.
    record.noIndex === true
  ]);
  return createHash("sha256").update(material).digest("hex").slice(0, 16);
}

export function buildManifest(published: ContentRecord[], allRecords: ContentRecord[] = published): DeployManifest {
  const publishedIds = new Set(published.map((record) => record.id));
  return {
    schemaVersion: 2,
    siteId: process.env.SITE_ID ?? process.env.NETLIFY_SITE_ID ?? "",
    baseId: BASE_ID,
    tableId: TABLE_ID,
    context: process.env.CONTEXT ?? "local",
    source: process.env.CONTENT_SOURCE ?? (process.env.AIRTABLE_API_KEY ? "airtable" : "fixtures"),
    omittedIds: allRecords.filter((r) => !r.isTestFixture && !publishedIds.has(r.id)).map((r) => r.id),
    // Netlify sets these during a build. Absent locally, which is fine: a
    // local build is never a deployment and must never confirm anything.
    deployId: process.env.DEPLOY_ID ?? "",
    commit: process.env.COMMIT_REF ?? "",
    builtAt: new Date().toISOString(),
    entries: published.map((record) => ({
      id: record.id,
      slug: record.slug,
      type: record.type,
      version: versionOf(record),
      sourceEditedAt: record.sourceEditedAt ?? ""
    }))
  };
}
