import type { ContentRecord, ContentSource, ContentType } from "./types";
import type { PublishStatus } from "@/lib/publishing";
import type { OfferKey } from "@/content/offers";
import { assertEditorialScope, parseSlugHistory, TABLE_ID } from "../../../scripts/lib/editorial-scope.mjs";

/**
 * Airtable adapter. BUILD TIME ONLY.
 *
 * This module must never be imported from a client `<script>`. It reads
 * `process.env`, which does not exist in the browser, and it carries an API
 * key. Everything it produces is baked into static HTML at build time, so no
 * visitor ever talks to Airtable and no key reaches a bundle.
 *
 * SCOPE: it reads exactly one base, named by AIRTABLE_BASE_ID, and one table.
 * It never enumerates bases, never writes, and has no knowledge of any other
 * base in the account.
 */

/** Field names in the Airtable "Contenus" table. See docs/AIRTABLE-SCHEMA.md. */
const FIELD = {
  id: "Content ID",
  type: "Type",
  title: "Title",
  slug: "Slug",
  description: "SEO description",
  offer: "Offer",
  topics: "Topics",
  body: "Body (Markdown)",
  author: "Author",
  imageUrl: "Image URL",
  imageAlt: "Image alt text",
  imageCaption: "Image caption",
  publishAt: "Publish date",
  approved: "Approved to publish",
  liveVersion: "Live version hash",
  liveSlug: "Live slug",
  updatedAt: "Last edited",
  sourceEditedAt: "Editorial changed at",
  liveType: "Live type",
  slugHistory: "Slug history",
  contentChangedAt: "Content changed at",
  noIndex: "Exclude from search engines",
  intent: "Intent",
  seoTitle: "SEO Title",
  globalRank: "Global Rank",
  launchQueueIndex: "Launch Queue Index",
  commercialHubCode: "Commercial Hub Code",
  primaryParentId: "Primary Parent ID",
  relatedIds: "Related IDs",
  pageRole: "Page Role",
  publishDayIndex: "Publish Day Index",
  finalUrl: "Final URL"
} as const;

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
  viewName?: string;
}

export function readAirtableConfigFromEnv(): AirtableConfig | null {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) return null;
  assertEditorialScope(process.env);
  if (process.env.AIRTABLE_VIEW_NAME) throw new Error("AIRTABLE_VIEW_NAME is not allowed: read the whole table so a filtered view cannot remove published pages.");
  return {
    apiKey,
    baseId,
    tableName: TABLE_ID
  };
}

interface AirtableRow {
  id: string;
  fields: Record<string, unknown>;
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const list = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];

const relationList = (v: unknown): string[] => {
  if (Array.isArray(v)) return list(v);
  if (typeof v !== "string") return [];
  return v
    .split(/[|,\n]+/)
    .map((x) => x.trim())
    .filter(Boolean);
};

const optionalNumber = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v !== "string" || !v.trim()) return undefined;
  const parsed = Number(v);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Airtable stores an approval checkbox and a date. The publishing rule in
 * `publishing.ts` only understands `status`, so approval is translated here.
 * The editor never types a status string.
 */
function deriveStatus(fields: Record<string, unknown>): PublishStatus {
  const approved = fields[FIELD.approved] === true;
  if (!approved) return "draft";
  return str(fields[FIELD.publishAt]) ? "published" : "approved";
}

function toRecord(row: AirtableRow): ContentRecord {
  const f = row.fields;
  const imageSrc = str(f[FIELD.imageUrl]);

  return {
    // The stable id is the editor-visible Content ID, never the Airtable row id,
    // so a record can be rebuilt or re-imported without changing its identity.
    id: str(f[FIELD.id]) || row.id,
    type: (str(f[FIELD.type]) || "insight") as ContentType,
    slug: str(f[FIELD.slug]),
    title: str(f[FIELD.title]),
    description: str(f[FIELD.description]),
    offer: str(f[FIELD.offer]) as OfferKey,
    topics: list(f[FIELD.topics]),
    body: str(f[FIELD.body]),
    author: str(f[FIELD.author]),
    image: imageSrc
      ? {
          src: imageSrc,
          alt: str(f[FIELD.imageAlt]),
          caption: str(f[FIELD.imageCaption]) || undefined
        }
      : undefined,
    status: deriveStatus(f),
    publishAt: str(f[FIELD.publishAt]),
    updatedAt: str(f[FIELD.updatedAt]) || undefined,
    sourceEditedAt: str(f[FIELD.sourceEditedAt]) || undefined,
    liveType: str(f[FIELD.liveType]) || undefined,
    liveVersion: str(f[FIELD.liveVersion]) || undefined,
    liveSlug: str(f[FIELD.liveSlug]) || undefined,
    slugHistory: parseSlugHistory(f[FIELD.slugHistory]),
    contentChangedAt: str(f[FIELD.contentChangedAt]) || undefined,
    noIndex: f[FIELD.noIndex] === true,
    seoTitle: str(f[FIELD.seoTitle]) || undefined,
    globalRank: optionalNumber(f[FIELD.globalRank]),
    launchQueueIndex: optionalNumber(f[FIELD.launchQueueIndex]),
    commercialHubCode: str(f[FIELD.commercialHubCode]) || undefined,
    primaryParentId: str(f[FIELD.primaryParentId]) || undefined,
    relatedIds: relationList(f[FIELD.relatedIds]),
    pageRole: str(f[FIELD.pageRole]) || undefined,
    publishDayIndex: optionalNumber(f[FIELD.publishDayIndex]),
    finalUrl: str(f[FIELD.finalUrl]) || undefined,
    intent: str(f[FIELD.intent]) || undefined
  };
}

/** Retries only what is worth retrying, with a ceiling. */
async function fetchWithRetry(url: string, apiKey: string, attempt = 0): Promise<Response> {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });

  // 429 is Airtable's rate limit (5 requests/second/base). 5xx is transient.
  const retryable = response.status === 429 || response.status >= 500;
  if (retryable && attempt < 4) {
    const waitMs = Math.min(1000 * 2 ** attempt, 8000);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return fetchWithRetry(url, apiKey, attempt + 1);
  }

  if (!response.ok) {
    // Never include the key or the raw body, which can echo field data.
    throw new Error(`Airtable responded with HTTP ${response.status}.`);
  }

  return response;
}

export function createAirtableSource(config: AirtableConfig): ContentSource {
  assertEditorialScope({ AIRTABLE_BASE_ID: config.baseId, AIRTABLE_TABLE_NAME: config.tableName });
  if (config.viewName) throw new Error("Filtered Airtable sources are not allowed.");
  return {
    name: "airtable",
    async fetchAll(): Promise<ContentRecord[]> {
      const records: ContentRecord[] = [];
      let offset: string | undefined;
      let pages = 0;

      do {
        const url = new URL(
          `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`
        );
        url.searchParams.set("pageSize", "100");
        if (config.viewName) url.searchParams.set("view", config.viewName);
        if (offset) url.searchParams.set("offset", offset);

        const response = await fetchWithRetry(url.toString(), config.apiKey);
        const page = (await response.json()) as { records: AirtableRow[]; offset?: string };

        records.push(...page.records.map(toRecord));
        offset = page.offset;

        // Airtable allows 5 req/s per base. One page per ~250ms stays well under.
        if (offset) await new Promise((resolve) => setTimeout(resolve, 250));

        if (++pages > 100) throw new Error("Airtable pagination exceeded 100 pages; aborting.");
      } while (offset);

      return records;
    }
  };
}
