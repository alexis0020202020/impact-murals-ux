import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import { runImport, toFields, validateImport, checkImportCollisions } from "../scripts/import-batch.mjs";
import { runConfirmation, planConfirmations } from "../scripts/confirm-deploy.mjs";
import { BASE_ID, TABLE_ID, parseSlugHistory } from "../scripts/lib/editorial-scope.mjs";
import { createAirtableClient } from "../scripts/lib/airtable-http.mjs";
import { onPreBuild, onSuccess } from "../netlify/plugins/editorial-confirm/index.js";
import { checkPreBuild, confirmationEnabled } from "../netlify/plugins/editorial-confirm/logic.mjs";
import { TRACKING_FIELDS } from "../scripts/lib/tracking-fields.mjs";

register("./ts-loader.mjs", pathToFileURL("./tests/"));
const { createAirtableSource } = await import("../src/lib/content-source/airtable.ts");
const { collectSlugRedirects } = await import("../src/lib/content-source/redirects.ts");
const { applyPause, assertSafeLiveTransitions } = await import("../src/lib/content-source/index.ts");
const { resolveSourceConfig } = await import("../src/lib/content-source/config.ts");
const { versionOf, buildManifest } = await import("../src/lib/content-source/manifest.ts");
const { reliableLastmod } = await import("../src/lib/routes.ts");

const quiet = { log() {}, warn() {} };
const sleep = async () => {};
const env = { AIRTABLE_BASE_ID: BASE_ID, AIRTABLE_API_KEY: "fake-read", AIRTABLE_WRITE_API_KEY: "fake-write" };
const article = { id: "one", type: "insight", title: "Test", slug: "one", description: "Test description", body: "Test body", author: "Test author", offer: "public-art", topics: [], publishAt: "2025-01-01", status: "published" };
const row = (r = article, extra = {}) => ({ id: `rec${r.id}`, fields: { ...toFields(r), ...extra } });
const response = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function importHarness(initial = [], { loseCreate = false, partial = false, failCreate = false } = {}) {
  const rows = structuredClone(initial), calls = [];
  const fetchImpl = async (url, options = {}) => {
    const method = options.method ?? "GET";
    calls.push({ url: String(url), method, auth: options.headers?.Authorization });
    assert.ok(String(url).startsWith(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`));
    if (method === "GET") return response({ records: rows });
    assert.equal(options.headers.Authorization, "Bearer fake-write");
    const records = JSON.parse(options.body).records;
    if (method === "POST") {
      if (failCreate) return response({}, 503);
      const inserted = (partial ? records.slice(0, 1) : records).map((r, i) => ({ id: `rec${rows.length + i + 1}`, fields: r.fields }));
      rows.push(...inserted);
      return response({ records: inserted }, loseCreate ? 500 : 200);
    }
    for (const r of records) Object.assign(rows.find((x) => x.id === r.id).fields, r.fields);
    return response({ records });
  };
  const run = (records = [article], extra = {}) => runImport({ argv: ["batch.json", "--apply"], env, fetchImpl, readFileImpl: async () => JSON.stringify(records), sleep, log: quiet, ...extra });
  return { rows, calls, run };
}

test("import uses the WRITE token even when the READ token is configured", async () => {
  const h = importHarness(); await h.run();
  assert.equal(h.rows.length, 1);
  assert.ok(h.calls.every((c) => c.auth === "Bearer fake-write"));
});
test("write-only variable configuration is enough for import", async () => {
  const h = importHarness(); await h.run([article], { env: { AIRTABLE_BASE_ID: BASE_ID, AIRTABLE_WRITE_API_KEY: "fake-write" } });
  assert.equal(h.rows.length, 1);
});
test("apply with no write token fails before any request", async () => {
  const h = importHarness();
  await assert.rejects(h.run([article], { env: { AIRTABLE_BASE_ID: BASE_ID, AIRTABLE_API_KEY: "fake-read" } }), /WRITE/);
  assert.equal(h.calls.length, 0);
});
test("an unrelated base is rejected without contacting it", async () => {
  const h = importHarness();
  await assert.rejects(h.run([article], { env: { ...env, AIRTABLE_BASE_ID: "appOTHER000000000" } }), /Impact Murals/);
  assert.equal(h.calls.length, 0);
});
test("a committed POST with a lost response is never replayed", async () => {
  const h = importHarness([], { loseCreate: true });
  const result = await h.run();
  assert.equal(result.created, 1); assert.equal(h.rows.length, 1);
  assert.equal(h.calls.filter((c) => c.method === "POST").length, 1);
  await h.run(); assert.equal(h.rows.length, 1);
});
test("a partial creation fails, then the same batch resumes without duplicating", async () => {
  const h = importHarness([], { loseCreate: true, partial: true });
  const records = [article, { ...article, id: "two", slug: "two" }];
  await assert.rejects(h.run(records), /Partial import/);
  assert.equal(h.rows.length, 1);
  await h.run(records);
  assert.equal(h.rows.length, 2);
  assert.equal(new Set(h.rows.map((r) => r.fields["Content ID"])).size, 2);
});
test("an uncommitted failing POST is not silently retried", async () => {
  const h = importHarness([], { failCreate: true });
  await assert.rejects(h.run(), /Partial import/);
  assert.equal(h.calls.filter((c) => c.method === "POST").length, 1);
});
test("update collisions are checked against existing routes before PATCH", async () => {
  const h = importHarness([row(), row({ ...article, id: "two", slug: "taken" })]);
  await assert.rejects(h.run([{ ...article, slug: "taken" }], { argv: ["batch.json", "--apply", "--allow-updates"] }), /already owned/);
  assert.ok(h.calls.every((c) => c.method === "GET"));
});
test("historical URLs cannot be silently claimed by a new article", () => {
  assert.throws(() => checkImportCollisions([{ ...article, id: "two", slug: "old" }], [row(article, { "Slug history": "old" })], false), /owned/);
});
test("duplicate existing Content IDs are refused, not collapsed in a Map", async () => {
  const h = importHarness([row(), { ...row(), id: "recDuplicate" }]);
  await assert.rejects(h.run(), /Duplicate Content ID/);
  assert.ok(h.calls.every((c) => c.method === "GET"));
});
test("noindex is imported, false clears it, and omission preserves it", () => {
  assert.equal(toFields({ ...article, noIndex: true })["Exclude from search engines"], true);
  assert.equal(toFields({ ...article, noIndex: false })["Exclude from search engines"], false);
  assert.equal("Exclude from search engines" in toFields(article), false);
  assert.equal("Approved to publish" in toFields({ ...article, approved: true }), false);
});
test("invalid dates, wrong noindex type and malformed batches are refused", () => {
  assert.throws(() => validateImport([{ ...article, publishAt: "2026-02-30" }]), /date/);
  assert.throws(() => validateImport([{ ...article, noIndex: "false" }]), /boolean/);
  assert.throws(() => validateImport([null]), /object/);
});
test("dry run never sends a mutation", async () => {
  const h = importHarness(); await h.run([article], { argv: ["batch.json"] });
  assert.ok(h.calls.every((c) => c.method === "GET")); assert.equal(h.rows.length, 0);
});
test("PATCH transport does not retry on 500 or network loss", async () => {
  for (const network of [false, true]) {
    let count = 0;
    const request = createAirtableClient({ env, key: "fake-write", sleep, fetchImpl: async () => { count++; if (network) throw new Error("lost"); return response({}, 500); } });
    await assert.rejects(request("", { method: "PATCH" })); assert.equal(count, 1);
  }
});

test("real adapter parses text history and produces persistent redirects after confirmation", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => response({ records: [row(article, { "Slug history": "first, second\nfirst", "Live slug": "one", "Approved to publish": true, "Editorial changed at": "2026-01-02T00:00:00.000Z" })] });
  try {
    const records = await createAirtableSource({ apiKey: "fake-read", baseId: BASE_ID, tableName: "Contenus" }).fetchAll();
    assert.deepEqual(records[0].slugHistory, ["first", "second"]);
    assert.equal(records[0].sourceEditedAt, "2026-01-02T00:00:00.000Z");
    assert.deepEqual(collectSlugRedirects(records).redirects.map((r) => r.from), ["/insights/first", "/insights/second"]);
  } finally { globalThis.fetch = originalFetch; }
});
test("malformed redirect history is refused", () => {
  assert.throws(() => parseSlugHistory("old\n/* https://evil.invalid 301!"), /Invalid slug/);
});
test("adapter cannot read a different base or a filtered view", () => {
  assert.throws(() => createAirtableSource({ apiKey: "x", baseId: "other", tableName: "Contenus" }), /Impact Murals/);
  assert.throws(() => createAirtableSource({ apiKey: "x", baseId: BASE_ID, tableName: "Contenus", viewName: "Ready" }), /Filtered/);
});
test("pause also blocks deleted rows, unchecked approval and an empty snapshot", () => {
  assert.throws(() => applyPause([], true), /PUBLISHING_PAUSED/);
  assert.throws(() => applyPause([{ ...article, status: "draft", liveVersion: versionOf(article) }], true), /PUBLISHING_PAUSED/);
});
test("production pause cannot be bypassed by fixture mode", () => {
  const old = { source: process.env.CONTENT_SOURCE, pause: process.env.PUBLISHING_PAUSED };
  process.env.CONTENT_SOURCE = "fixtures"; process.env.PUBLISHING_PAUSED = "true";
  try { assert.throws(() => resolveSourceConfig(true), /PUBLISHING_PAUSED/); }
  finally { for (const [key, value] of [["CONTENT_SOURCE", old.source], ["PUBLISHING_PAUSED", old.pause]]) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } }
});
test("future re-dating of a confirmed page refuses the build", () => {
  assert.throws(() => assertSafeLiveTransitions([{ ...article, publishAt: "2099-01-01", liveVersion: "old" }]), /cannot be re-dated/);
  assert.doesNotThrow(() => assertSafeLiveTransitions([{ ...article, publishAt: "2099-01-01" }]));
});
test("changing the section of a live page requires an explicit migration", () => {
  assert.throws(() => assertSafeLiveTransitions([{ ...article, liveType: "guide", liveVersion: "old" }]), /migration/);
});
test("lastmod is omitted on a changed version, stable on an unchanged one", () => {
  const current = { ...article, liveVersion: versionOf(article), contentChangedAt: "2026-01-02T00:00:00Z" };
  assert.equal(reliableLastmod(current), "2026-01-02");
  assert.equal(reliableLastmod({ ...current, body: "new text" }), undefined);
  assert.equal(reliableLastmod({ ...current, noIndex: true }), undefined);
  assert.equal(reliableLastmod({ ...current, updatedAt: "2099-01-01" }), "2026-01-02");
});
test("tracking formula watches Intent but not confirmation fields", () => {
  const f = TRACKING_FIELDS.find((field) => field.name === "Editorial changed at").options.formula;
  assert.ok(f.includes("{Intent}")); assert.ok(!f.includes("{Live version hash}"));
});

const confirmEnv = { ...env, NETLIFY_AUTH_TOKEN: "fake-netlify", SITE_ID: "site-one", DEPLOY_ID: "deploy-one" };
function manifest(overrides = {}) {
  return { schemaVersion: 2, siteId: "site-one", deployId: "deploy-one", baseId: BASE_ID, tableId: TABLE_ID, context: "production", source: "airtable", commit: "abc", builtAt: "2026-08-01T10:00:00.000Z", entries: [{ id: "one", type: "insight", slug: "one", version: versionOf(article), sourceEditedAt: "2026-07-31T10:00:00.000Z" }], omittedIds: [], ...overrides };
}
function confirmHarness({ initial = [row()], m = manifest(), active = true, state = "ready", proofMatches = true, patchFailure = false } = {}) {
  const rows = structuredClone(initial), calls = [];
  const raw = JSON.stringify(m);
  let isActive = active;
  const fetchImpl = async (input, options = {}) => {
    const url = String(input), method = options.method ?? "GET";
    calls.push({ url, method, auth: options.headers?.Authorization });
    if (url.startsWith("https://api.netlify.com/")) {
      assert.equal(method, "GET");
      assert.equal(options.headers.Authorization, "Bearer fake-netlify");
      if (url.endsWith("/deploys/deploy-one")) return response({ id: "deploy-one", site_id: "site-one", state, context: "production", draft: false, deploy_ssl_url: "https://deploy-one--example.netlify.app/" });
      return response({ id: "site-one", published_deploy: { id: isActive ? "deploy-one" : "newer", state: "ready" } });
    }
    if (url.includes("/deploy-proof.json")) {
      assert.equal(options.headers?.Authorization, undefined);
      return response({ deployId: "deploy-one", manifestHash: proofMatches ? createHash("sha256").update(raw).digest("hex") : "wrong" });
    }
    assert.ok(url.startsWith(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`));
    assert.equal(options.headers.Authorization, "Bearer fake-write");
    if (method === "GET") {
      const filter = new URL(url).searchParams.get("filterByFormula");
      return response({ records: filter ? rows.filter((r) => filter.includes(`'${r.id}'`)) : rows });
    }
    if (patchFailure) return response({}, 500);
    const patch = JSON.parse(options.body).records;
    for (const r of patch) Object.assign(rows.find((x) => x.id === r.id).fields, r.fields);
    return response({ records: patch });
  };
  const run = (extra = {}) => runConfirmation({ apply: true, env: confirmEnv, fetchImpl, readFileImpl: async () => raw, sleep, log: quiet, ...extra });
  return { rows, calls, run, supersede: () => { isActive = false; } };
}

test("confirmation verifies Netlify and deployed proof, writes exact snapshot, then is idempotent", async () => {
  const h = confirmHarness({ initial: [row(article, { "Live slug": "previous", "Slug history": "first", "Editorial changed at": "2026-08-01T11:00:00.000Z" })] });
  assert.equal((await h.run()).confirmed, 1);
  const f = h.rows[0].fields;
  assert.equal(f["Live version hash"], versionOf(article));
  assert.equal(f["Live source edited at"], "2026-07-31T10:00:00.000Z");
  assert.equal(f["Slug history"], "first, previous");
  assert.equal((await h.run()).confirmed, 0);
  assert.equal(h.calls.filter((c) => c.method === "PATCH").length, 1);
});
test("self-reported ready state cannot replace Netlify verification", async () => {
  const h = confirmHarness();
  await assert.rejects(h.run({ env: { ...confirmEnv, NETLIFY_AUTH_TOKEN: undefined, DEPLOY_STATE: "ready" } }), /NETLIFY_AUTH_TOKEN/);
  assert.equal(h.calls.length, 0);
});
test("queued, failed or superseded deploys never write confirmation", async () => {
  for (const config of [{ state: "building" }, { state: "error" }, { active: false }]) {
    const h = confirmHarness(config); await assert.rejects(h.run(), /active/);
    assert.ok(h.calls.every((c) => c.method === "GET"));
  }
});
test("a manifest not matching the deployed proof is refused", async () => {
  const h = confirmHarness({ proofMatches: false }); await assert.rejects(h.run(), /proof/);
  assert.ok(!h.calls.some((c) => c.url.includes("api.airtable")));
});
test("old confirmation cannot overwrite newer tracking", async () => {
  const h = confirmHarness({ initial: [row(article, { "Last deploy confirmed": "2026-08-02T00:00:00Z", "Live version hash": "newer" })] });
  await assert.rejects(h.run(), /out-of-order/);
  assert.ok(h.calls.every((c) => c.method === "GET"));
});
test("confirmation refuses different site, base, context and source before requests", async () => {
  for (const changes of [{ siteId: "other" }, { baseId: "other" }, { context: "deploy-preview" }, { source: "stress" }, { deployId: "other" }]) {
    const h = confirmHarness({ m: manifest(changes) }); await assert.rejects(h.run()); assert.equal(h.calls.length, 0);
  }
});
test("confirmation of an intentionally omitted page clears live flags but retains URL history", async () => {
  const h = confirmHarness({ m: manifest({ entries: [], omittedIds: ["one"] }), initial: [row(article, { "Live version hash": "old", "Live slug": "one", "Slug history": "older", "Live type": "insight" })] });
  await h.run(); assert.equal(h.rows[0].fields["Live version hash"], ""); assert.equal(h.rows[0].fields["Slug history"], "older, one");
});
test("confirmation does not silently skip a missing published record", async () => {
  const h = confirmHarness({ initial: [] }); await assert.rejects(h.run(), /missing/);
});
test("ambiguous confirmation PATCH is not retried without freshness checks", async () => {
  const h = confirmHarness({ patchFailure: true }); await assert.rejects(h.run(), /HTTP 500/);
  assert.equal(h.calls.filter((c) => c.method === "PATCH").length, 1);
});
test("same timestamp with different confirmation contents is rejected", () => {
  assert.throws(() => planConfirmations(manifest(), [row(article, { "Last deploy confirmed": manifest().builtAt, "Live version hash": "different" })]), /Conflicting/);
});
test("dry-run confirmation is strictly local", async () => {
  const h = confirmHarness(); await h.run({ apply: false }); assert.equal(h.calls.length, 0);
});
test("manifest records the exact source timestamp and omitted inventory", () => {
  const published = { ...article, sourceEditedAt: "2026-01-01T00:00:00Z" };
  const m = buildManifest([published], [published, { ...article, id: "draft", status: "draft" }]);
  assert.equal(m.entries[0].sourceEditedAt, published.sourceEditedAt);
  assert.deepEqual(m.omittedIds, ["draft"]);
});
test("post-deploy wiring is disabled by default and never enabled for preview", () => {
  assert.equal(confirmationEnabled({}), false);
  assert.equal(confirmationEnabled({ NETLIFY: "true", CONTEXT: "deploy-preview", CONTENT_CONFIRMATION_ENABLED: "true" }), false);
  assert.equal(confirmationEnabled({ NETLIFY: "true", CONTEXT: "production", CONTENT_CONFIRMATION_ENABLED: "true" }), true);
});
test("production preflight blocks missing confirmation credentials and pause", () => {
  assert.throws(() => checkPreBuild({ NETLIFY: "true", CONTEXT: "production", CONTENT_CONFIRMATION_ENABLED: "true", CONTENT_SOURCE: "airtable", AIRTABLE_BASE_ID: BASE_ID }), /Missing/);
  assert.throws(() => checkPreBuild({ CONTEXT: "production", PUBLISHING_PAUSED: "true" }), /PAUSED/);
});
test("Netlify configuration includes the post-deploy plugin", async () => {
  const config = await readFile("netlify.toml", "utf8");
  assert.ok(config.includes('./netlify/plugins/editorial-confirm'));
  assert.equal(typeof onSuccess, "function");
});

test("preview response headers prohibit indexing without changing production headers", () => {
  const previous = process.env.CONTEXT;
  process.env.CONTEXT = "deploy-preview";
  const netlifyConfig = { headers: [{ for: "/*", values: { "X-Content-Type-Options": "nosniff" } }] };
  try {
    onPreBuild({ netlifyConfig });
    assert.equal(netlifyConfig.headers[0].values["X-Robots-Tag"], "noindex, nofollow");
    assert.equal(netlifyConfig.headers[0].values["X-Content-Type-Options"], "nosniff");
  } finally { if (previous === undefined) delete process.env.CONTEXT; else process.env.CONTEXT = previous; }
});

test("confirmation handles more than one write batch without rereading the whole table per batch", async () => {
  const articles = Array.from({ length: 23 }, (_, i) => ({ ...article, id: `item${i}`, slug: `item-${i}` }));
  const m = manifest({ entries: articles.map((a) => ({ id: a.id, slug: a.slug, type: a.type, version: versionOf(a), sourceEditedAt: "2026-07-31T00:00:00.000Z" })) });
  const h = confirmHarness({ m, initial: articles.map((a) => row(a)) });
  assert.equal((await h.run()).confirmed, 23);
  assert.equal(h.calls.filter((c) => c.method === "PATCH").length, 3);
  assert.equal(h.calls.filter((c) => c.url.includes("api.airtable") && c.method === "GET" && !c.url.includes("filterByFormula")).length, 1);
  assert.equal((await h.run()).confirmed, 0);
});

test("a deployment superseded between verification and confirmation is rejected", async () => {
  const h = confirmHarness();
  await h.run(); h.supersede();
  const before = h.calls.filter((c) => c.method === "PATCH").length;
  await assert.rejects(h.run(), /active/);
  assert.equal(h.calls.filter((c) => c.method === "PATCH").length, before);
});

test("manual-upload output includes legacy offer redirects and security headers", async () => {
  const { GET } = await import("../src/pages/netlify-redirects.txt.ts");
  const { legacyOfferRedirects } = await import("../src/content/offers.ts");
  const redirects = await (await GET()).text();
  for (const [oldSlug, offer] of Object.entries(legacyOfferRedirects)) {
    assert.ok(redirects.includes(`/what-we-do/${oldSlug}  /what-we-do/${offer}  301!`));
  }
  const headers = await readFile("public/_headers", "utf8");
  assert.ok(headers.includes("X-Content-Type-Options: nosniff"));
  assert.ok(headers.includes("/deploy-proof.json\n  X-Robots-Tag: noindex, nofollow"));
});
