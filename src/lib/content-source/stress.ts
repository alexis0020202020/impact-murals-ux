import type { ContentRecord } from "./types";
import type { OfferKey } from "@/content/offers";
import { versionOf } from "./manifest";

/**
 * Synthetic editorial volume, for testing the meshing at scale.
 *
 * Pagination, orphan detection, sitemap splitting and lastmod stability cannot
 * be judged on three fixtures. This generator produces a realistic number of
 * genuinely public records so a real build exercises the real templates.
 *
 * NOT a fallback and never reached by accident: it requires CONTENT_SOURCE to
 * be set to "stress" explicitly, which nothing in the deployment configuration
 * does. Every record it produces is labelled in its title and body, and
 * `validate-content.mjs` fails the build if that label reaches dist, so a
 * stress build can never be mistaken for a publishable one.
 */

const OFFERS: OfferKey[] = ["art-for-brands", "art-for-places", "public-art"];
const TOPIC_POOL = [
  "commissioning",
  "production",
  "murals",
  "coordination",
  "site-survey",
  "artist-selection",
  "materials",
  "permits"
];

function body(index: number, sections: number): string {
  const parts = [
    `Synthetic record ${index}. Generated to test pagination, internal meshing and`,
    "sitemap generation at volume. It makes no claim about the studio, names no",
    "client and reports no result.",
    ""
  ];
  for (let s = 1; s <= sections; s++) {
    parts.push(`## Section ${s}`, "");
    parts.push(
      "Neutral prose so the renderer has ordinary content to lay out. It carries no",
      "commercial meaning and exists only so the page has a realistic shape and a",
      "realistic length when the build is measured.",
      ""
    );
  }
  return parts.join("\n");
}

/**
 * Deterministic: the same count always produces the same records, byte for
 * byte. That is what makes it possible to build twice and prove that nothing
 * moved on an unchanged rebuild.
 */
export function stressRecords(count: number): ContentRecord[] {
  const records: ContentRecord[] = [];

  for (let i = 1; i <= count; i++) {
    const isGuide = i % 4 === 0;
    const offer = OFFERS[i % OFFERS.length];
    const topics = [TOPIC_POOL[i % TOPIC_POOL.length], TOPIC_POOL[(i * 3) % TOPIC_POOL.length]];
    const padded = String(i).padStart(3, "0");

    // A spread of dates in the past so ordering and pagination are meaningful.
    const day = new Date(Date.UTC(2025, 0, 1));
    day.setUTCDate(day.getUTCDate() + (i * 3) % 365);
    const publishAt = day.toISOString().slice(0, 10);

    // A quarter of the set is deliberately not publishable, so the build proves
    // that drafts, future dates and noindex are all handled at volume.
    const isDraft = i % 9 === 0;
    const isFuture = i % 17 === 0;
    const noIndex = i % 11 === 0;

    records.push({
      id: `stress-${padded}`,
      type: isGuide ? "guide" : "insight",
      slug: `${isGuide ? "stress-guide" : "stress-article"}-${padded}`,
      title: `STRESS TEST ${padded}: ${isGuide ? "specialised page" : "article"}`,
      description: `Synthetic record ${padded}, generated locally to test pagination, internal linking and sitemap output at volume.`,
      offer,
      topics: [...new Set(topics)],
      status: isDraft ? "draft" : "published",
      publishAt: isFuture ? "2099-01-01" : publishAt,
      author: "Stress generator",
      body: body(i, isGuide ? 2 : 3),
      intent: isGuide ? `Synthetic question ${padded}, used to test the guide template.` : undefined,
      noIndex,
      // Half the publishable set is treated as already deployed, so the pause
      // path and the lastmod path both have real data to work on.
      contentChangedAt: i % 2 === 0 || isDraft || isFuture ? undefined : `${publishAt}T09:00:00.000Z`
    });
    const record = records[records.length - 1];
    if (record.contentChangedAt) {
      record.liveVersion = versionOf(record);
      record.liveSlug = record.slug;
      record.liveType = record.type;
    }
  }

  return records;
}

/** Reads the requested volume. Zero disables the generator entirely. */
export function stressCountFromEnv(): number {
  const raw = Number(process.env.SEO_STRESS_COUNT ?? "0");
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
}
