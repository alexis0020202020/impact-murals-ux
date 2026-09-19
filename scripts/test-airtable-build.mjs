#!/usr/bin/env node
/** Real Astro build + real adapter + real confirmation code, fake services only. */
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { runConfirmation } from "./confirm-deploy.mjs";
import { BASE_ID, TABLE_ID } from "./lib/editorial-scope.mjs";
import { mockRows } from "../tests/mock-airtable-build.mjs";

if (process.env.NETLIFY === "true") throw new Error("Local integration test must not run on Netlify.");
const testEnv = {
  ...process.env, CONTENT_SOURCE: "airtable", AIRTABLE_BASE_ID: BASE_ID, AIRTABLE_TABLE_NAME: TABLE_ID,
  AIRTABLE_API_KEY: "local-test-only", AIRTABLE_WRITE_API_KEY: "local-write-only",
  NETLIFY_AUTH_TOKEN: "local-netlify-only", AIRTABLE_SCHEMA_API_KEY: "", AIRTABLE_VIEW_NAME: "",
  IM_SEO_MOCK_BUILD: "true", ASTRO_TELEMETRY_DISABLED: "1", PUBLISHING_PAUSED: "false",
  CONTENT_CONFIRMATION_ENABLED: "false", SITE_ID: "local-site", DEPLOY_ID: "local-deploy", CONTEXT: "production"
};
/*
  `--import` takes a module specifier, not an OS path: on Windows,
  `fileURLToPath(...)` here previously produced `C:\...`, which Node's loader
  then tried to parse as a URL and rejected (`ERR_UNSUPPORTED_ESM_URL_SCHEME`,
  protocol "c:"). A `file://` URL string works identically on every platform.
*/
for (const args of [
  ["--import", new URL("../tests/mock-airtable-build.mjs", import.meta.url).href, resolve("node_modules/astro/bin/astro.mjs"), "build"],
  ["scripts/validate-content.mjs"]
]) {
  const child = spawnSync(process.execPath, args, { env: testEnv, stdio: "inherit" });
  if (child.status !== 0) process.exit(child.status || 1);
}
assert.ok(existsSync("dist/insights/integration-article/index.html"));
assert.ok(existsSync("dist/guides/integration-guide/index.html"));
assert.equal(existsSync("dist/deploy-manifest.json"), false);
assert.equal(existsSync("dist/insights/integration-future/index.html"), false);
assert.equal(existsSync("dist/insights/integration-draft/index.html"), false);
const redirects = await readFile("dist/_redirects", "utf8");
for (const slug of ["earlier-article", "first-article", "previous-article"]) assert.ok(redirects.includes(`/insights/${slug}  /insights/integration-article  301!`));
assert.ok(!(await readFile("dist/sitemap-insights.xml", "utf8")).includes("integration-noindex"));
const proof = JSON.parse(await readFile("dist/deploy-proof.json", "utf8"));
const rows = structuredClone(mockRows);
let writes = 0;
const fetchImpl = async (input, options = {}) => {
  const url = new URL(input);
  const json = (value) => new Response(JSON.stringify(value), { headers: { "Content-Type": "application/json" } });
  if (url.hostname === "api.netlify.com") {
    if (url.pathname.endsWith("/deploys/local-deploy")) return json({ id: "local-deploy", site_id: "local-site", state: "ready", context: "production", draft: false, deploy_ssl_url: "https://local-deploy--example.netlify.app" });
    return json({ id: "local-site", published_deploy: { id: "local-deploy", state: "ready" } });
  }
  if (url.hostname === "local-deploy--example.netlify.app") return json(proof);
  assert.equal(url.origin + url.pathname, `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
  if (options.method === "PATCH") {
    writes++;
    for (const patch of JSON.parse(options.body).records) Object.assign(rows.find((r) => r.id === patch.id).fields, patch.fields);
    return json({ records: [] });
  }
  const filter = url.searchParams.get("filterByFormula");
  return json({ records: filter ? rows.filter((r) => filter.includes(`'${r.id}'`)) : rows });
};
await runConfirmation({ apply: true, env: testEnv, fetchImpl, sleep: async () => {} });
const firstWrites = writes;
await runConfirmation({ apply: true, env: testEnv, fetchImpl, sleep: async () => {} });
assert.equal(writes, firstWrites);
assert.ok(rows[0].fields["Live version hash"]);
assert.equal(rows[0].fields["Live source edited at"], mockRows[0].fields["Editorial changed at"]);
console.log("PASS: actual Airtable adapter -> actual Astro build -> redirects/sitemaps -> sealed manifest -> verified mock deployment -> idempotent confirmation. NO external request was sent.");
