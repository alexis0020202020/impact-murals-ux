import type { ContentRecord } from "./types";
import { LANDING_SEGMENT } from "@/lib/routes";
import { isPublic } from "@/lib/publishing";

/**
 * Redirects for URLs a record has previously been live under.
 *
 * Three rules, each fixing a way the naive version broke:
 *
 * 1. Only emit a redirect once the destination is actually published. A rename
 *    scheduled for next month used to emit a 301 immediately, pointing at a page
 *    that did not exist yet.
 *
 * 2. Read the durable `slugHistory`, not just the last live slug. A single
 *    field cannot survive two renames: the first old URL lost its redirect as
 *    soon as the second rename happened, and it also vanished the moment the
 *    confirmation step updated the live slug to match the current one.
 *
 * 3. Never shadow a live page, and never emit a loop.
 */

export interface SlugRedirect {
  from: string;
  to: string;
  recordId: string;
}

export interface RedirectResult {
  redirects: SlugRedirect[];
  /** Old URLs deliberately left without a redirect, with the reason. */
  skipped: Array<{ from: string; recordId: string; reason: string }>;
}

function segment(type: string): string {
  return type === "guide" ? LANDING_SEGMENT : "insights";
}

export function collectSlugRedirects(
  records: ContentRecord[],
  now: Date = new Date(),
  isPreview = false
): RedirectResult {
  const redirects: SlugRedirect[] = [];
  const skipped: RedirectResult["skipped"] = [];

  // Paths that a live page occupies. A redirect must never shadow one.
  const livePaths = new Set(
    records
      .filter((record) => isPublic(record, now, isPreview))
      .map((record) => `/${segment(record.type)}/${record.slug}`)
  );

  const seenFrom = new Map<string, string>();

  for (const record of records) {
    const destination = `/${segment(record.type)}/${record.slug}`;
    const isLive = isPublic(record, now, isPreview);

    // Every slug the record has ever been live under, plus the last confirmed
    // one, deduplicated and excluding the current slug.
    const oldSlugs = new Set(
      [...(record.slugHistory ?? []), record.liveSlug ?? ""].filter(
        (slug) => slug && slug !== record.slug
      )
    );

    for (const oldSlug of oldSlugs) {
      const from = `/${segment(record.type)}/${oldSlug}`;

      if (!isLive) {
        // No snapshot is reconstructed here. Live future-dating is refused by the loader.
        skipped.push({
          from,
          recordId: record.id,
          reason: "destination not published; no redirect generated"
        });
        continue;
      }

      if (from === destination) continue;

      if (livePaths.has(from)) {
        // Rule 3. Another published record occupies this path.
        skipped.push({
          from,
          recordId: record.id,
          reason: "path is occupied by a live page; redirect would shadow it"
        });
        continue;
      }

      const existing = seenFrom.get(from);
      if (existing && existing !== destination) {
        skipped.push({
          from,
          recordId: record.id,
          reason: `conflicts with an existing redirect to ${existing}`
        });
        continue;
      }

      seenFrom.set(from, destination);
      redirects.push({ from, to: destination, recordId: record.id });
    }
  }

  return { redirects, skipped };
}

export function formatRedirectsFile(result: RedirectResult): string {
  const lines = [
    "# Generated at build time from the slug history in the editorial source.",
    "# Do not edit by hand: this file is rewritten on every build.",
    ""
  ];

  if (!result.redirects.length) {
    lines.push("# No slug changes with a published destination.");
  }

  for (const redirect of result.redirects) {
    lines.push(`# ${redirect.recordId}`);
    lines.push(`${redirect.from}  ${redirect.to}  301!`);
  }

  if (result.skipped.length) {
    lines.push("");
    lines.push("# Deliberately not redirected:");
    for (const item of result.skipped) {
      lines.push(`#   ${item.from}  (${item.recordId}): ${item.reason}`);
    }
  }

  return lines.join("\n") + "\n";
}
