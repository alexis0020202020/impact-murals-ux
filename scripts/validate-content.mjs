#!/usr/bin/env node
/**
 * Content and indexation health check, run against the built site.
 *
 * Everything here is measured on the actual output in dist, not on the model
 * that produced it. That is the point: it can catch a disagreement between what
 * the code intended and what was written to disk.
 *
 * It checks, in order:
 *   - per page: canonical, description, exactly one h1, no fixture content
 *   - internal links that point nowhere
 *   - reachability: every page must be findable by following links from /
 *   - the sitemap index and its sub-sitemaps
 *   - agreement between meta robots, canonical and sitemap membership
 *   - lastmod format
 *
 * Read-only: it opens no connection and writes nothing.
 *
 * Usage: npm run content:check   (after npm run build)
 */

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import process from "node:process";

const DIST = "dist";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function toRoute(file) {
  const rel = relative(DIST, file).split(sep).join("/");
  const route = "/" + rel.replace(/index\.html$/, "").replace(/\.html$/, "").replace(/\/$/, "");
  return route || "/";
}

function normaliseHref(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean.startsWith("/")) return null;
  return clean.replace(/\/$/, "") || "/";
}

const ASSET = /\.(svg|png|jpe?g|webp|avif|gif|css|js|xml|txt|ico|json|woff2?|pdf)$/i;

const allFiles = await walk(DIST).catch(() => []);
const files = allFiles.filter((f) => f.endsWith(".html"));

if (!files.length) {
  console.error(`No HTML found in ${DIST}. Run "npm run build" first.`);
  process.exit(1);
}

const problems = [];
const warnings = [];

/*
  A stress build is a local measurement, never a deployable artefact. Its
  records are labelled, and the label is only tolerated when this very run was
  the one that asked for them.
*/
const isStressBuild = process.env.CONTENT_SOURCE === "stress";
let stressPages = 0;

/* ------------------------------------------------------------------ pages */

/** route -> { canonical, noindex, links } */
const pages = new Map();
const routes = new Set(files.map(toRoute));

for (const file of files) {
  const route = toRoute(file);
  const html = await readFile(file, "utf8");

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) problems.push(`${route}: no canonical URL.`);

  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!description?.trim()) problems.push(`${route}: empty meta description.`);

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) problems.push(`${route}: expected exactly one h1, found ${h1Count}.`);

  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
  const noindex = /noindex/i.test(robots);

  const links = new Set();
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = normaliseHref(match[1]);
    if (!href) continue;
    if (ASSET.test(href)) continue;
    links.add(href);
    if (!routes.has(href)) {
      problems.push(`${route}: internal link "${href}" does not match a generated route.`);
    }
  }

  if (html.includes("TEST FIXTURE") || html.includes("template-test")) {
    problems.push(`${route}: contains test fixture content in a build output.`);
  }
  /*
    Stress output is expected only in a build that deliberately asked for it.
    Anywhere else it is a shipping accident, so it fails the build.
  */
  if (html.includes("STRESS TEST") || html.includes("stress-article-")) {
    if (isStressBuild) {
      stressPages++;
    } else {
      problems.push(`${route}: contains stress test content in a build output.`);
    }
  }

  pages.set(route, { canonical, noindex, links });
}

/* ----------------------------------------------------------- reachability */

/*
  A page nobody links to is invisible whatever the sitemap says. This walks the
  real anchors in the real output, starting from the homepage, and reports
  anything it never arrives at.

  "/404" is exempt: Astro serves it automatically for any unmatched route, so
  by convention nothing ever links to it on purpose. That is not the same
  defect as a real page falling out of the link graph.
*/
const reached = new Set(["/", "/404"]);
const queue = ["/"];
while (queue.length) {
  const current = queue.shift();
  for (const href of pages.get(current)?.links ?? []) {
    if (!pages.has(href) || reached.has(href)) continue;
    reached.add(href);
    queue.push(href);
  }
}

for (const route of pages.keys()) {
  if (!reached.has(route)) {
    problems.push(`${route}: orphan. No path of links reaches it from the homepage.`);
  }
}

/* --------------------------------------------------------------- sitemaps */

const indexPath = join(DIST, "sitemap.xml");
if (!existsSync(indexPath)) {
  problems.push("sitemap.xml is missing.");
} else {
  const indexXml = await readFile(indexPath, "utf8");

  if (!indexXml.includes("<sitemapindex")) {
    problems.push("sitemap.xml is not a sitemap index.");
  }

  const referenced = [...indexXml.matchAll(/<sitemap><loc>([^<]+)<\/loc><\/sitemap>/g)].map(
    (m) => m[1]
  );

  if (!referenced.length) problems.push("sitemap.xml references no sub-sitemap.");

  const origin = referenced[0] ? new URL(referenced[0]).origin : null;

  // robots.txt must still point at the index.
  const robotsPath = join(DIST, "robots.txt");
  if (existsSync(robotsPath)) {
    const robots = await readFile(robotsPath, "utf8");
    if (!/Sitemap:\s*\S+\/sitemap\.xml/.test(robots)) {
      problems.push("robots.txt does not reference /sitemap.xml.");
    }
  } else {
    problems.push("robots.txt is missing.");
  }

  // Sub-sitemaps present on disk but not referenced, and the reverse.
  const onDisk = allFiles
    .map((f) => relative(DIST, f).split(sep).join("/"))
    .filter((f) => /^sitemap-.*\.xml$/.test(f));

  const referencedNames = referenced.map((loc) => new URL(loc).pathname.replace(/^\//, ""));

  for (const name of onDisk) {
    if (!referencedNames.includes(name)) {
      problems.push(`${name} exists but is not referenced by the sitemap index.`);
    }
  }

  const inSitemaps = new Map();

  for (const name of referencedNames) {
    const file = join(DIST, name);
    if (!existsSync(file)) {
      problems.push(`Sitemap index references ${name}, which was not generated.`);
      continue;
    }

    const xml = await readFile(file, "utf8");
    const entries = [...xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)];

    if (!entries.length) {
      problems.push(`${name} is empty. An empty sitemap should not be referenced.`);
      continue;
    }

    for (const [, loc, lastmod] of entries) {
      const path = normaliseHref(new URL(loc).pathname);

      if (origin && new URL(loc).origin !== origin) {
        problems.push(`${name}: ${loc} is on a different origin from the sitemap index.`);
      }

      const page = pages.get(path);
      if (!page) {
        problems.push(`${name}: ${loc} has no page in this build.`);
        continue;
      }

      if (page.noindex) {
        problems.push(`${name}: ${loc} is listed but the page is marked noindex.`);
      }

      if (page.canonical && page.canonical.replace(/\/$/, "") !== loc.replace(/\/$/, "")) {
        problems.push(
          `${name}: ${loc} does not match the canonical on the page (${page.canonical}).`
        );
      }

      if (lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
        problems.push(`${name}: ${loc} has a malformed lastmod "${lastmod}".`);
      }

      if (inSitemaps.has(path)) {
        problems.push(`${path} appears in two sitemaps: ${inSitemaps.get(path)} and ${name}.`);
      }
      inSitemaps.set(path, name);
    }
  }

  // Every indexable page must be listed exactly once.
  for (const [route, page] of pages) {
    if (page.noindex) continue;
    if (!inSitemaps.has(route)) {
      problems.push(`${route}: indexable but absent from every sitemap.`);
    }
  }

  // And nothing noindex may be listed. Checked above per entry, restated here
  // as a count so the report says how coherent the two sides are.
  const noindexCount = [...pages.values()].filter((p) => p.noindex).length;
  console.log(
    `Sitemaps: ${referencedNames.length} group(s), ${inSitemaps.size} URL(s) listed, ` +
      `${noindexCount} page(s) marked noindex and excluded.`
  );
}

/* ------------------------------------------------------------ duplication */

const seen = new Map();
for (const file of files) {
  const route = toRoute(file);
  const slug = route.split("/").pop();
  if (!slug) continue;
  const key = route.split("/").slice(0, -1).join("/") + "|" + slug;
  if (seen.has(key)) problems.push(`Duplicate route generated: ${route}`);
  seen.set(key, route);
}

/* ---------------------------------------------------------------- report */

if (isStressBuild) {
  console.log(
    `STRESS BUILD: ${stressPages} page(s) carry synthetic content. ` +
      "This output is for measurement only and must never be deployed."
  );
}

console.log(`Checked ${files.length} pages, all reachable from the homepage: ${reached.size === pages.size}.\n`);

if (warnings.length) {
  console.log(`${warnings.length} warning(s):`);
  warnings.slice(0, 30).forEach((w) => console.log(`  - ${w}`));
  if (warnings.length > 30) console.log(`  ... and ${warnings.length - 30} more`);
  console.log("");
}

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  problems.slice(0, 40).forEach((p) => console.error(`  - ${p}`));
  if (problems.length > 40) console.error(`  ... and ${problems.length - 40} more`);
  process.exit(1);
}

console.log("No problems found.");
