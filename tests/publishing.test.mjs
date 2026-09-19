import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

/**
 * Tests run against the REAL modules.
 *
 * An earlier version copied the publishing rule into the test file, so the
 * tests would have stayed green if the implementation drifted. They now import
 * the production source through a small TypeScript loader.
 */
register("./ts-loader.mjs", pathToFileURL("./tests/"));

const { isPublic, filterPublic, pendingScheduled } = await import(
  "../src/lib/publishing.ts"
);
const { collectSlugRedirects } = await import("../src/lib/content-source/redirects.ts");
const { validateRecord, validateForPublication, validateBatch } = await import(
  "../src/lib/content-source/validate.ts"
);
const { toJsonLd } = await import("../src/lib/json-ld.ts");
const { versionOf } = await import("../src/lib/content-source/manifest.ts");

const NOW = new Date("2026-06-15T12:00:00Z");
const base = {
  id: "x",
  slug: "x",
  title: "T",
  description: "D",
  offer: "public-art",
  type: "insight",
  body: "B",
  author: "A",
  topics: []
};

// --- publishing rule ---

test("a draft is never public, in either environment", () => {
  const draft = { ...base, status: "draft", publishAt: "2020-01-01" };
  assert.equal(isPublic(draft, NOW, false), false);
  assert.equal(isPublic(draft, NOW, true), false);
});

test("an approved but undated record is not public", () => {
  assert.equal(isPublic({ ...base, status: "approved", publishAt: "" }, NOW, false), false);
});

test("a published record dated in the past is public", () => {
  assert.equal(isPublic({ ...base, status: "published", publishAt: "2026-01-01" }, NOW, false), true);
});

test("a published record dated in the future is not public yet", () => {
  assert.equal(isPublic({ ...base, status: "published", publishAt: "2026-12-01" }, NOW, false), false);
});

test("a scheduled record becomes public once its date passes", () => {
  const scheduled = { ...base, status: "published", publishAt: "2026-12-01" };
  assert.equal(isPublic(scheduled, new Date("2026-12-02T00:00:00Z"), false), true);
});

test("a test fixture is visible in preview and never in production", () => {
  const fixture = { ...base, status: "draft", publishAt: "2099-01-01", isTestFixture: true };
  assert.equal(isPublic(fixture, NOW, true), true);
  assert.equal(isPublic(fixture, NOW, false), false);
});

test("pendingScheduled lists approved records still waiting for their date", () => {
  const records = [
    { ...base, id: "a", status: "published", publishAt: "2026-12-01" },
    { ...base, id: "b", status: "published", publishAt: "2026-01-01" }
  ];
  assert.deepEqual(pendingScheduled(records, NOW).map((r) => r.id), ["a"]);
});

// --- draft blocking regression ---

test("an incomplete draft produces warnings, not structural errors", () => {
  const draft = { id: "d1", type: "insight", title: "Only a title" };
  const issues = validateRecord(draft);
  assert.equal(issues.some((i) => i.severity === "error"), false);
  assert.ok(issues.some((i) => i.severity === "warning"));
});

test("an incomplete record approved for publication is an error", () => {
  const going = { id: "d1", type: "insight", title: "Only a title" };
  const issues = validateForPublication(going);
  assert.ok(issues.some((i) => i.severity === "error"));
});

test("one incomplete draft does not block a valid published article", () => {
  const records = [
    { ...base, id: "good", slug: "good", status: "published", publishAt: "2026-01-01" },
    { id: "bad", type: "insight", title: "", slug: "", description: "", body: "", author: "", topics: [], offer: "public-art", status: "draft", publishAt: "" }
  ];
  const structural = validateBatch(records);
  assert.equal(structural.some((i) => i.severity === "error"), false);
  assert.deepEqual(filterPublic(records, NOW, false).map((r) => r.id), ["good"]);
});

// --- JSON-LD injection ---

test("a script-closing sequence in metadata cannot break out of the block", () => {
  const hostile = { headline: 'x</script><script>alert(1)</script>' };
  const out = toJsonLd(hostile);
  assert.equal(out.includes("</script"), false);
  assert.equal(out.includes("<"), false);
  // The escaped form: six literal characters in the serialised output.
  assert.ok(out.includes(String.raw`\u003c`));
  // Still valid JSON with the original text intact.
  assert.equal(JSON.parse(out).headline, hostile.headline);
});

// --- redirects ---

const withHistory = (over) => ({
  ...base,
  type: "insight",
  status: "published",
  publishAt: "2026-01-01",
  ...over
});

test("no redirect is emitted while the destination is unpublished", () => {
  const records = [
    withHistory({ id: "r1", slug: "new-name", liveSlug: "old-name", publishAt: "2026-12-01" })
  ];
  const { redirects, skipped } = collectSlugRedirects(records, NOW, false);
  assert.equal(redirects.length, 0);
  assert.equal(skipped.length, 1);
});

test("a redirect is emitted once the destination is published", () => {
  const records = [withHistory({ id: "r1", slug: "new-name", liveSlug: "old-name" })];
  const { redirects } = collectSlugRedirects(records, NOW, false);
  assert.deepEqual(redirects.map((r) => [r.from, r.to]), [
    ["/insights/old-name", "/insights/new-name"]
  ]);
});

test("two successive renames keep both old URLs redirecting", () => {
  const records = [
    withHistory({ id: "r1", slug: "third", liveSlug: "second", slugHistory: ["first", "second"] })
  ];
  const { redirects } = collectSlugRedirects(records, NOW, false);
  const froms = redirects.map((r) => r.from).sort();
  assert.deepEqual(froms, ["/insights/first", "/insights/second"]);
});

test("confirmation does not lose the history", () => {
  // After confirmation liveSlug equals slug; history must still redirect.
  const records = [
    withHistory({ id: "r1", slug: "third", liveSlug: "third", slugHistory: ["first", "second"] })
  ];
  const { redirects } = collectSlugRedirects(records, NOW, false);
  assert.equal(redirects.length, 2);
});

test("a redirect never shadows a live page", () => {
  const records = [
    withHistory({ id: "r1", slug: "new", slugHistory: ["taken"] }),
    withHistory({ id: "r2", slug: "taken" })
  ];
  const { redirects, skipped } = collectSlugRedirects(records, NOW, false);
  assert.equal(redirects.length, 0);
  assert.match(skipped[0].reason, /occupied/);
});

// --- manifest ---

test("the version hash changes with content and ignores updatedAt", () => {
  const a = { ...base, body: "one" };
  const b = { ...base, body: "two" };
  assert.notEqual(versionOf(a), versionOf(b));
  assert.equal(versionOf({ ...a, updatedAt: "2026-01-01" }), versionOf({ ...a, updatedAt: "2027-01-01" }));
});

// --- pause ---

const { applyPause } = await import("../src/lib/content-source/index.ts");
const { resolveSourceConfig } = await import("../src/lib/content-source/config.ts");

/** A record whose recorded live version matches what it currently renders. */
function settled(fields) {
  const record = { ...base, status: "published", publishAt: "2026-01-01", ...fields };
  return { ...record, liveVersion: versionOf(record), liveSlug: record.slug };
}

test("pause blocks the entire rebuild, including never-confirmed content", () => {
  const records = [
    { ...base, id: "new", slug: "new", status: "published", publishAt: "2026-01-01" },
    settled({ id: "live", slug: "live" })
  ];
  assert.throws(() => applyPause(records, true), /PUBLISHING_PAUSED/);
});

test("pause keeps the existing deploy online by refusing even an unchanged rebuild", () => {
  const records = [settled({ id: "live", slug: "live" })];
  assert.throws(() => applyPause(records, true), /PUBLISHING_PAUSED/);
});

test("pause refuses the build rather than publishing an edit made while paused", () => {
  const record = settled({ id: "live", slug: "live" });
  const edited = { ...record, body: "rewritten while publishing was paused" };

  // Dropping it would take a live page offline; keeping it would publish the
  // edit. Neither honours the pause, so the build has to stop.
  assert.throws(() => applyPause([edited], true), /PUBLISHING_PAUSED/);
});

test("pause refuses a slug change made while paused", () => {
  const record = settled({ id: "live", slug: "live" });
  const renamed = { ...record, slug: "renamed" };
  assert.throws(() => applyPause([renamed], true), /PUBLISHING_PAUSED/);
});

test("without pause every record passes through, edited or not", () => {
  const record = settled({ id: "live", slug: "live" });
  const records = [
    { ...base, id: "new", slug: "new", status: "published", publishAt: "2026-01-01" },
    { ...record, body: "edited" }
  ];
  assert.equal(applyPause(records, false).length, 2);
});

// --- configuration modes ---

function withEnv(vars, fn) {
  const saved = {};
  for (const [k, v] of Object.entries(vars)) {
    saved[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

test("a production build with no Airtable configuration is refused", () => {
  withEnv(
    { AIRTABLE_API_KEY: undefined, AIRTABLE_BASE_ID: undefined, CONTENT_SOURCE: undefined },
    () => assert.throws(() => resolveSourceConfig(true), /no Airtable configuration/)
  );
});

test("partial Airtable configuration is refused in any environment", () => {
  withEnv({ AIRTABLE_API_KEY: "x", AIRTABLE_BASE_ID: undefined, CONTENT_SOURCE: undefined }, () =>
    assert.throws(() => resolveSourceConfig(false), /partially configured/)
  );
});

test("fixtures can be selected deliberately in production", () => {
  withEnv(
    { CONTENT_SOURCE: "fixtures", AIRTABLE_API_KEY: undefined, AIRTABLE_BASE_ID: undefined },
    () => assert.equal(resolveSourceConfig(true).mode, "fixtures")
  );
});

test("development without configuration falls back to fixtures", () => {
  withEnv(
    { AIRTABLE_API_KEY: undefined, AIRTABLE_BASE_ID: undefined, CONTENT_SOURCE: undefined },
    () => assert.equal(resolveSourceConfig(false).mode, "fixtures")
  );
});

test("PUBLISHING_PAUSED is read by the build, not only by the cron", () => {
  withEnv({ PUBLISHING_PAUSED: "true", CONTENT_SOURCE: "fixtures" }, () =>
    assert.equal(resolveSourceConfig(false).paused, true)
  );
});
