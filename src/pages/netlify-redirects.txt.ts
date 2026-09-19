import type { APIRoute } from "astro";
import { loadContentRecords } from "@/lib/content-source";
import { collectSlugRedirects, formatRedirectsFile } from "@/lib/content-source/redirects";
import { isPreviewEnvironment } from "@/lib/publishing";
import { legacyOfferRedirects } from "@/content/offers";

/**
 * Generates the redirect rules through the normal Astro pipeline, so the logic
 * stays in TypeScript beside the content source.
 *
 * Astro excludes anything under src/pages starting with an underscore, which is
 * exactly the filename Netlify expects, so the `slug-redirects` integration
 * renames this output to `_redirects` and removes this intermediate file.
 */
export const GET: APIRoute = async () => {
  const result = collectSlugRedirects(
    await loadContentRecords(),
    new Date(),
    isPreviewEnvironment
  );
  // Manual Netlify Drop does not run the repository's build configuration.
  // Carry the existing offer redirects in the published output as well.
  const legacy = Object.entries(legacyOfferRedirects)
    .map(([oldSlug, offer]) => `/what-we-do/${oldSlug}  /what-we-do/${offer}  301!`)
    .join("\n");
  return new Response(`${formatRedirectsFile(result)}\n# Existing offer URLs\n${legacy}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
