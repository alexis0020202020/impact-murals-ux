import type { Publishable } from "@/lib/publishing";

/**
 * The normalised editorial record.
 *
 * This is the single shape every template reads, whatever the source. Airtable
 * is one adapter; local fixtures are another. Adding a third source later means
 * writing one more adapter, not touching a template.
 *
 * `Publishable` is reused unchanged, so the existing publishing rule in
 * `src/lib/publishing.ts` applies to Airtable records exactly as it does to
 * fixtures. There is no second publishing system.
 */

export type ContentType = "insight" | "guide";

export interface ContentImage {
  /**
   * A durable URL or a site-relative path.
   *
   * Airtable attachment URLs expire, so the importer must not store them here.
   * See `docs/SEO-IMPORT-FORMAT.md`: images are referenced by a stable URL or
   * committed to /public and referenced by path.
   */
  src: string;
  alt: string;
  caption?: string;
}

export interface ContentRecord extends Publishable {
  type: ContentType;
  /** Markdown. Rendered and sanitised at build time, never in the browser. */
  body: string;
  author: string;
  topics: string[];
  image?: ContentImage;
  /** Set when the record was edited after its last confirmed deployment. */
  updatedAt?: string;
  /** Snapshot of the formula watching fields that can change the published output. */
  sourceEditedAt?: string;
  /** Last confirmed section; changing type needs an explicit URL migration. */
  liveType?: string;
  /**
   * Version actually confirmed live by a successful production deploy.
   * Empty means "never deployed", whatever the approval checkbox says.
   * Written only by the confirmation step, never by an import.
   */
  liveVersion?: string;
  /**
   * The slug this record was last confirmed live under.
   * Empty until a deploy has been confirmed.
   */
  liveSlug?: string;
  /**
   * Every slug this record has ever been live under, oldest first.
   *
   * A single `liveSlug` cannot survive two successive renames: the first old
   * URL would lose its redirect as soon as the second rename happened. The
   * history is durable and append-only, so every old URL keeps a destination.
   */
  slugHistory?: string[];
  /**
   * Per-content indexation control.
   *
   * True means: render the page, keep it linked, but tell search engines not
   * to index it. The same flag drives the meta robots tag and the sitemap, so
   * the two can never disagree. Set in Airtable, never guessed.
   */
  noIndex?: boolean;
  /**
   * When the published content itself last changed, as an ISO timestamp.
   *
   * Written by the confirmation step, and only when the version hash of the
   * deployed content actually differs from the one already recorded. A rebuild
   * that changes nothing does not move it, and neither does the confirmation
   * write itself, because this field is excluded from the hash it is compared
   * against. Absent means "no reliable date", and the sitemap then omits
   * lastmod rather than inventing one.
   */
  contentChangedAt?: string;
  /**
   * Optional dedicated SEO title. H1 remains `title`.
   * Keeping these separate lets search metadata be tuned without changing public copy.
   */
  seoTitle?: string;
  /** Strategic rank in the locked 2,413-node master. */
  globalRank?: number;
  /** Operational order among Airtable article nodes. */
  launchQueueIndex?: number;
  /** One of the 20 WHAT WE CAN CREATE sales-page hubs. */
  commercialHubCode?: string;
  /** Explicit primary parent in the SEO graph. */
  primaryParentId?: string;
  /** Controlled lateral graph edges. Only public targets are rendered. */
  relatedIds?: string[];
  /** Internal architecture role. Never rendered as public copy. */
  pageRole?: string;
  /** Relative 30-per-day launch group. Not a calendar date. */
  publishDayIndex?: number;
  /** QA/reference URL. Routing remains derived from type + slug. */
  finalUrl?: string;
  /**
   * Internal intent classification or, where deliberately authored, a reader question.
   * Templates do not expose this automatically.
   */
  intent?: string;
}

/** What a source adapter must provide. */
export interface ContentSource {
  name: string;
  /** Throws on transport failure. The caller decides how to handle that. */
  fetchAll(): Promise<ContentRecord[]>;
}

/** Problems found while validating a batch. Never thrown silently. */
export interface ValidationIssue {
  severity: "error" | "warning";
  recordId: string;
  field?: string;
  message: string;
}
