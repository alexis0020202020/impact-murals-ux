import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

/**
 * Internal meshing and sitemap tests.
 *
 * Same principle as the publishing tests: everything imported here is the real
 * production module, so these cannot stay green if the implementation changes
 * behaviour. The end-to-end proof, on a hundred generated records, is a real
 * build plus scripts/validate-content.mjs; these cover the rules underneath it.
 */
register("./ts-loader.mjs", pathToFileURL("./tests/"));

const {
  PER_PAGE,
  pagePath,
  pageCount,
  pageSlice,
  reliableLastmod,
  sortEditorial,
  buildRoutes,
  sitemapRoutes,
  breadcrumbsFor
} = await import("../src/lib/routes.ts");

const { renderUrlset, renderSitemapIndex, sitemapPath, nonEmptyGroups, groupEntries } =
  await import("../src/lib/sitemap.ts");

const { stressRecords } = await import("../src/lib/content-source/stress.ts");
const { versionOf } = await import("../src/lib/content-source/manifest.ts");
const { projects, projectsForBuild, isPlaceholderProject } = await import("../src/content/projects.ts");
const { projectsForOffer } = await import("../src/lib/relations.ts");

test("placeholder projects remain available in development but not production", () => {
  assert.ok(projects.some(isPlaceholderProject));
  assert.deepEqual(projectsForBuild(true), projects);
  assert.deepEqual(projectsForBuild(false), projects.filter((project) => !isPlaceholderProject(project)));
});

test("production route registry and relations exclude placeholder project URLs", async () => {
  const routes = await buildRoutes();
  for (const project of projects.filter(isPlaceholderProject)) {
    assert.ok(!routes.some((route) => route.path === `/work/${project.slug}`));
    assert.ok(!projectsForOffer(project.offer).some((link) => link.href === `/work/${project.slug}`));
  }
});

// --- pagination ---

test("page one keeps the bare URL, later pages are addressable", () => {
  assert.equal(pagePath("/insights", 1), "/insights");
  assert.equal(pagePath("/insights", 2), "/insights/page/2");
  assert.equal(pagePath("/guides", 7), "/guides/page/7");
});

test("a section with no entries still counts as one page, never zero", () => {
  assert.equal(pageCount(0), 1);
  assert.equal(pageCount(1), 1);
});

test("pagination covers every entry exactly once", () => {
  const items = Array.from({ length: 100 }, (_unused, i) => i);
  const pages = pageCount(items.length);
  const seen = [];
  for (let page = 1; page <= pages; page++) seen.push(...pageSlice(items, page));

  assert.equal(pages, Math.ceil(100 / PER_PAGE));
  assert.deepEqual(seen, items);
});

test("the last page is not empty", () => {
  const items = Array.from({ length: 25 }, (_unused, i) => i);
  assert.ok(pageSlice(items, pageCount(items.length)).length > 0);
});

// --- ordering ---

test("ordering is deterministic when two entries share a date", () => {
  const a = { publishAt: "2026-01-01", slug: "b" };
  const b = { publishAt: "2026-01-01", slug: "a" };
  assert.deepEqual(
    sortEditorial([a, b]).map((r) => r.slug),
    sortEditorial([b, a]).map((r) => r.slug)
  );
});

// --- lastmod ---

test("lastmod is omitted when no confirmed change date exists", () => {
  assert.equal(reliableLastmod({ publishAt: "2026-01-01" }), undefined);
});

test("lastmod ignores an unparseable date rather than emitting it", () => {
  assert.equal(reliableLastmod({ contentChangedAt: "not a date" }), undefined);
});

test("lastmod comes from the confirmed change date, as a plain day", () => {
  const record = { ...stressRecords(1)[0], contentChangedAt: "2026-03-04T18:22:11.000Z" };
  record.liveVersion = versionOf(record);
  assert.equal(reliableLastmod(record), "2026-03-04");
});

test("an unchanged rebuild cannot move lastmod", () => {
  // The value is a stored field, not a function of the current time, so two
  // reads separated by any amount of build activity give the same answer.
  const record = stressRecords(1)[0];
  assert.ok(reliableLastmod(record));
  assert.equal(reliableLastmod(record), reliableLastmod(record));
});

test("a sitemap entry with no reliable date carries no lastmod element", () => {
  const xml = renderUrlset([{ path: "/insights/x", inSitemap: true, group: "insights" }]);
  assert.ok(!xml.includes("<lastmod>"));
  assert.ok(xml.includes("/insights/x"));
});

// --- sitemap index ---

test("the sitemap index references one file per group, and only those", () => {
  const xml = renderSitemapIndex(["core", "insights"]);
  assert.ok(xml.includes("<sitemapindex"));
  assert.ok(xml.includes(sitemapPath("core")));
  assert.ok(xml.includes(sitemapPath("insights")));
  assert.ok(!xml.includes(sitemapPath("guides")));
});

test("sitemap URLs are XML escaped", () => {
  const xml = renderUrlset([{ path: "/insights/a&b", inSitemap: true, group: "insights" }]);
  assert.ok(xml.includes("a&amp;b"));
  assert.ok(!/a&b/.test(xml));
});

// --- the registry, against the fixture source ---

test("test fixtures are rendered in preview but never indexable", async () => {
  const routes = await buildRoutes();
  const fixtures = routes.filter((route) => route.path.includes("template-test"));

  assert.ok(fixtures.length > 0, "the fixture source should produce routes in preview");
  for (const route of fixtures) {
    assert.equal(route.noIndex, true);
    assert.equal(route.inSitemap, false);
  }
});

test("nothing marked noindex reaches a sitemap", async () => {
  const routes = await buildRoutes();
  const listed = new Set(await sitemapRoutes());
  for (const route of routes) {
    if (route.noIndex) assert.ok(!listed.has(route.path), `${route.path} is listed but noindex`);
  }
});

test("every group named in the index has at least one URL", async () => {
  for (const group of await nonEmptyGroups()) {
    assert.ok((await groupEntries(group)).length > 0);
  }
});

test("an editorial page has a breadcrumb trail back to the homepage", async () => {
  const routes = await buildRoutes();
  const entry = routes.find((route) => route.path.startsWith("/guides/"));
  assert.ok(entry, "the fixture source should produce a guide");

  const trail = await breadcrumbsFor(entry.path);
  assert.equal(trail[0].path, "/");
  assert.equal(trail[trail.length - 1].path, entry.path);
});

// --- the generator used for the volume test ---

test("the stress generator is deterministic", () => {
  assert.deepEqual(stressRecords(20), stressRecords(20));
});

test("the stress generator produces both types and some excluded records", () => {
  const records = stressRecords(100);
  assert.equal(records.length, 100);
  assert.ok(records.some((r) => r.type === "guide"));
  assert.ok(records.some((r) => r.type === "insight"));
  assert.ok(records.some((r) => r.status === "draft"));
  assert.ok(records.some((r) => r.noIndex));
});
