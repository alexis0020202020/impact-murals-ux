import type { APIRoute } from "astro";
import type { SitemapGroup } from "@/lib/routes";
import { groupEntries, nonEmptyGroups, renderUrlset, XML_HEADERS } from "@/lib/sitemap";

/**
 * One sitemap per group: core, insights, guides.
 *
 * getStaticPaths returns only the groups that have URLs, so an empty group
 * produces no file at all rather than an empty sitemap that a crawler would
 * report as an error. The sitemap index references exactly the same set.
 */
export async function getStaticPaths() {
  const groups = await nonEmptyGroups();
  return groups.map((group) => ({ params: { group } }));
}

export const GET: APIRoute = async ({ params }) => {
  const entries = await groupEntries(params.group as SitemapGroup);
  return new Response(renderUrlset(entries), { headers: XML_HEADERS });
};
