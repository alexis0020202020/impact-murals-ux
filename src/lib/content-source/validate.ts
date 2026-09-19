import type { ContentRecord, ValidationIssue } from "./types";
import { offers } from "@/content/offers";

/**
 * Validation shared by the importer and the build.
 *
 * The importer runs it before writing anything. The build runs it before
 * generating routes. Same rules in both places, so a record cannot pass one
 * gate and fail the other.
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_TYPES = new Set(["insight", "guide"]);
const VALID_STATUSES = new Set(["draft", "approved", "published"]);
const OFFER_KEYS = new Set(offers.map((o) => o.key));

/** Fields without which a record cannot be rendered honestly. */
const REQUIRED = ["id", "slug", "title", "description", "offer", "type", "body", "author"] as const;

/** Identity fields. A record missing these cannot be tracked at all. */
const REQUIRED_ALWAYS = ["id", "type"] as const;

/**
 * Completeness, required only of a record that is about to go live.
 *
 * An unfinished draft sitting in the base must not block the schedule of
 * unrelated finished articles, so these are not enforced on drafts. They are
 * reported as warnings there instead, so the gaps stay visible.
 */
export function validateForPublication(record: Partial<ContentRecord>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const rid = record.id ?? "(no id)";

  for (const field of REQUIRED) {
    const value = record[field];
    if (typeof value !== "string" || !value.trim()) {
      issues.push({
        severity: "error",
        recordId: rid,
        field,
        message: `Approved for publication but "${field}" is missing.`
      });
    }
  }

  if (record.image?.src && !record.image.alt?.trim()) {
    issues.push({
      severity: "error",
      recordId: rid,
      field: "image",
      message: "Approved for publication with an image but no alt text."
    });
  }

  return issues;
}

/**
 * Structural checks, applied to every record whatever its status, because a
 * duplicate id or a malformed slug is a problem regardless of publication.
 */
export function validateRecord(record: Partial<ContentRecord>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const rid = record.id ?? "(no id)";
  const add = (severity: ValidationIssue["severity"], message: string, field?: string) =>
    issues.push({ severity, recordId: rid, field, message });

  for (const field of REQUIRED_ALWAYS) {
    const value = record[field];
    if (typeof value !== "string" || !value.trim()) {
      add("error", `Missing required field "${field}".`, field);
    }
  }

  // Incompleteness on a draft is visible but never blocking.
  for (const field of REQUIRED) {
    if (REQUIRED_ALWAYS.includes(field as never)) continue;
    const value = record[field];
    if (typeof value !== "string" || !value.trim()) {
      add("warning", `Field "${field}" is empty. Required before this can be published.`, field);
    }
  }

  if (record.slug && !SLUG_PATTERN.test(record.slug)) {
    add("error", `Slug "${record.slug}" must be lowercase words separated by single hyphens.`, "slug");
  }

  if (record.type && !VALID_TYPES.has(record.type)) {
    add("error", `Unknown type "${record.type}". Use "insight" or "guide".`, "type");
  }

  if (record.status && !VALID_STATUSES.has(record.status)) {
    add("error", `Unknown status "${record.status}".`, "status");
  }

  if (record.offer && !OFFER_KEYS.has(record.offer)) {
    add(
      "error",
      `Offer "${record.offer}" is not one of the three pillars (${[...OFFER_KEYS].join(", ")}).`,
      "offer"
    );
  }

  if (record.publishAt) {
    if (Number.isNaN(new Date(record.publishAt).getTime())) {
      add("error", `publishAt "${record.publishAt}" is not a valid date.`, "publishAt");
    }
  } else if (record.status === "published") {
    add("error", "A published record needs a publishAt date.", "publishAt");
  }

  // Alt text is never invented. Blocking happens at publication, not on a draft.
  if (record.image?.src && !record.image.alt?.trim()) {
    add("warning", "Image has no alt text. Alt text must be supplied before publication.", "image");
  }

  if (record.image?.src?.includes("airtableusercontent.com")) {
    add(
      "error",
      "Image points at an Airtable attachment URL. Those expire. Use a durable URL or a /public path.",
      "image"
    );
  }

  if (record.type === "guide" && !record.intent?.trim()) {
    add("warning", "A guide without an `intent` has no distinct question to answer.", "intent");
  }

  if (!record.topics?.length) {
    add("warning", "No topics. Related content will fall back to the offer alone.", "topics");
  }

  return issues;
}

/** Cross-record checks that only make sense on the whole set. */
export function validateBatch(records: ContentRecord[]): ValidationIssue[] {
  const issues: ValidationIssue[] = records.flatMap(validateRecord);

  // Slug collisions inside a type would produce two pages at one URL.
  const seenSlugs = new Map<string, string>();
  for (const record of records) {
    if (!record.slug || !record.type) continue;
    const key = `${record.type}:${record.slug}`;
    const owner = seenSlugs.get(key);
    if (owner && owner !== record.id) {
      issues.push({
        severity: "error",
        recordId: record.id,
        field: "slug",
        message: `Slug "${record.slug}" is already used by record ${owner} of the same type.`
      });
    } else {
      seenSlugs.set(key, record.id);
    }
  }

  // Duplicate stable ids would make upserts ambiguous.
  const seenIds = new Set<string>();
  for (const record of records) {
    if (seenIds.has(record.id)) {
      issues.push({
        severity: "error",
        recordId: record.id,
        message: "Duplicate stable id in the batch."
      });
    }
    seenIds.add(record.id);
  }

  // A slug change after a confirmed deploy breaks the old URL unless redirected.
  for (const record of records) {
    if (record.liveSlug && record.liveSlug !== record.slug) {
      issues.push({
        severity: "warning",
        recordId: record.id,
        field: "slug",
        message: `Slug changed from "${record.liveSlug}" (live) to "${record.slug}". A 301 is generated automatically once the new slug is published.`
      });
    }
  }

  // An old URL cannot redirect to a slug that another record now owns.
  const currentSlugs = new Map(records.map((r) => [`${r.type}:${r.slug}`, r.id]));
  for (const record of records) {
    for (const old of record.slugHistory ?? []) {
      if (old === record.slug) continue;
      const owner = currentSlugs.get(`${record.type}:${old}`);
      if (owner && owner !== record.id) {
        issues.push({
          severity: "error",
          recordId: record.id,
          field: "slugHistory",
          message: `Old slug "${old}" is now used by record ${owner}. A redirect would shadow a live page.`
        });
      }
    }
  }

  return issues;
}

/** Internal links that point nowhere. Markdown bodies are scanned as text. */
export function findBrokenInternalLinks(
  records: ContentRecord[],
  knownPaths: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const linkPattern = /\]\((\/[^)\s]*)\)/g;

  for (const record of records) {
    if (!record.body) continue;
    for (const match of record.body.matchAll(linkPattern)) {
      const href = match[1].split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
      if (!knownPaths.has(href)) {
        issues.push({
          severity: "warning",
          recordId: record.id,
          field: "body",
          message: `Internal link "${href}" does not match any generated route.`
        });
      }
    }
  }

  return issues;
}

export function hasErrors(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === "error");
}

export function formatIssues(issues: ValidationIssue[]): string {
  if (!issues.length) return "No issues.";
  return issues
    .map((i) => `  [${i.severity}] ${i.recordId}${i.field ? ` (${i.field})` : ""}: ${i.message}`)
    .join("\n");
}
