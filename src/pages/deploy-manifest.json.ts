import type { APIRoute } from "astro";
import { loadContentRecords } from "@/lib/content-source";
import { buildManifest } from "@/lib/content-source/manifest";
import { filterPublic, isPreviewEnvironment } from "@/lib/publishing";

/**
 * Emits the manifest of what this build actually published.
 *
 * The confirmation step reads this file after a successful deploy, so what gets
 * written back to Airtable is the version that was really rendered, not a
 * fresher one read at confirmation time.
 *
 * It is not a page. The `slug-redirects` integration moves it out of the public
 * output, so it is never crawlable and never served.
 */
export const GET: APIRoute = async () => {
  const records = await loadContentRecords();
  const published = filterPublic(
    records,
    new Date(),
    isPreviewEnvironment
  ).filter((record) => !record.isTestFixture);

  return new Response(JSON.stringify(buildManifest(published, records), null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
};
