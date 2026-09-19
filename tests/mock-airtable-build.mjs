// Explicit local integration test only. Never connect to the real network.
import { BASE_ID, TABLE_ID } from "../scripts/lib/editorial-scope.mjs";
export const mockRows = [
  { id: "recArticle", fields: { "Content ID": "integration-article", Type: "insight", Slug: "integration-article", Title: "Integration article", "SEO description": "Local verification of an article with persistent redirects.", Offer: "public-art", Topics: ["murals"], "Body (Markdown)": "## Scope\n\nLocal integration test.\n\n## Production\n\nNo client claims.", Author: "Test runner", "Publish date": "2025-01-01", "Approved to publish": true, "Slug history": "earlier-article, first-article", "Live slug": "previous-article", "Editorial changed at": "2026-01-01T00:00:00.000Z" } },
  { id: "recGuide", fields: { "Content ID": "integration-guide", Type: "guide", Slug: "integration-guide", Title: "Integration guide", "SEO description": "Local verification of a specialised page.", Offer: "art-for-places", Topics: ["murals"], "Body (Markdown)": "## Brief\n\nLocal integration test.", Author: "Test runner", Intent: "Can a guide be built without manual layout?", "Publish date": "2025-01-01", "Approved to publish": true, "Editorial changed at": "2026-01-01T00:00:00.000Z" } },
  { id: "recNoindex", fields: { "Content ID": "integration-noindex", Type: "insight", Slug: "integration-noindex", Title: "Integration noindex", "SEO description": "Local verification of an excluded page.", Offer: "art-for-brands", Topics: ["murals"], "Body (Markdown)": "## Exclusion\n\nLocal integration test.", Author: "Test runner", "Publish date": "2025-01-01", "Approved to publish": true, "Exclude from search engines": true, "Editorial changed at": "2026-01-01T00:00:00.000Z" } },
  { id: "recDraft", fields: { "Content ID": "integration-draft", Type: "insight", Title: "Incomplete local draft" } },
  { id: "recFuture", fields: { "Content ID": "integration-future", Type: "insight", Title: "Future local draft", "Publish date": "2099-01-01", "Approved to publish": true } }
];

if (process.env.IM_SEO_MOCK_BUILD === "true") {
  if (process.env.NETLIFY === "true" || process.env.AIRTABLE_API_KEY !== "local-test-only") throw new Error("Refusing mock transport outside the explicit local test.");
  globalThis.fetch = async (input, options = {}) => {
    const url = new URL(input);
    if (url.origin !== "https://api.airtable.com" || url.pathname !== `/v0/${BASE_ID}/${TABLE_ID}` || (options.method && options.method !== "GET")) throw new Error("Integration test blocked an unexpected network request.");
    return new Response(JSON.stringify({ records: mockRows }), { headers: { "Content-Type": "application/json" } });
  };
}
