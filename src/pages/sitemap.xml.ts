import type { APIRoute } from "astro";
import { nonEmptyGroups, renderSitemapIndex, XML_HEADERS } from "@/lib/sitemap";

/**
 * The sitemap index. This is the URL declared in robots.txt.
 *
 * It references one sitemap per group, and only the groups that produced URLs
 * in this build, so a crawler is never sent to an empty file. Everything is
 * derived from the route registry, which is itself derived from the editorial
 * source, so publishing an article adds it here with no edit to this file.
 */
export const GET: APIRoute = async () =>
  new Response(renderSitemapIndex(await nonEmptyGroups()), { headers: XML_HEADERS });
