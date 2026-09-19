#!/usr/bin/env node
/** Called by the Netlify onSuccess hook, NEVER by the build command. */
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { loadEnvFile } from "./lib/load-env.mjs";
import { BASE_ID, TABLE_ID, assertEditorialScope, parseSlugHistory } from "./lib/editorial-scope.mjs";
import { createAirtableClient, readAllRows } from "./lib/airtable-http.mjs";

export function validateManifest(manifest, env) {
  assertEditorialScope(env);
  const siteId = env.SITE_ID || env.NETLIFY_SITE_ID;
  if (manifest.schemaVersion !== 2 || manifest.baseId !== BASE_ID || manifest.tableId !== TABLE_ID) throw new Error("Manifest has the wrong schema or Airtable scope.");
  if (!siteId || manifest.siteId !== siteId || !manifest.deployId || manifest.deployId !== env.DEPLOY_ID) throw new Error("Manifest must match the configured site AND exact DEPLOY_ID.");
  if (manifest.context !== "production" || manifest.source !== "airtable") throw new Error("Only production Airtable manifests may be confirmed.");
  if (!/^[a-zA-Z0-9-]+$/.test(siteId) || !/^[a-zA-Z0-9-]+$/.test(manifest.deployId)) throw new Error("Invalid Netlify identity.");
  if (!Number.isFinite(Date.parse(manifest.builtAt)) || Date.parse(manifest.builtAt) > Date.now() + 300000) throw new Error("Invalid manifest timestamp.");
  if (!Array.isArray(manifest.entries) || !Array.isArray(manifest.omittedIds)) throw new Error("Invalid manifest inventory.");
  const ids = new Set(), routes = new Set();
  for (const entry of manifest.entries) {
    if (!entry || typeof entry.id !== "string" || !entry.id || !["insight", "guide"].includes(entry.type) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || !/^[a-f0-9]{16}$/.test(entry.version)) throw new Error("Invalid manifest entry.");
    if (ids.has(entry.id) || routes.has(`${entry.type}:${entry.slug}`)) throw new Error("Duplicate manifest identity or route.");
    if (entry.sourceEditedAt && !Number.isFinite(Date.parse(entry.sourceEditedAt))) throw new Error("Invalid editorial timestamp in manifest.");
    ids.add(entry.id); routes.add(`${entry.type}:${entry.slug}`);
  }
  for (const id of manifest.omittedIds) {
    if (typeof id !== "string" || !id || ids.has(id)) throw new Error("Invalid omitted inventory.");
    ids.add(id);
  }
}

/** Read-only Netlify API. A self-reported DEPLOY_STATE never constitutes proof. */
export async function verifyLiveDeploy(manifest, env, fetchImpl = fetch) {
  if (!env.NETLIFY_AUTH_TOKEN) throw new Error("NETLIFY_AUTH_TOKEN is required to verify the active production deployment.");
  const get = async (path) => {
    const response = await fetchImpl(`https://api.netlify.com/api/v1${path}`, {
      headers: { Authorization: `Bearer ${env.NETLIFY_AUTH_TOKEN}` },
      signal: AbortSignal.timeout(30000), redirect: "error"
    });
    if (!response.ok) throw new Error(`Netlify verification HTTP ${response.status}. No confirmation written.`);
    return response.json();
  };
  const deploy = await get(`/sites/${manifest.siteId}/deploys/${manifest.deployId}`);
  const site = await get(`/sites/${manifest.siteId}`);
  if (deploy.id !== manifest.deployId || deploy.site_id !== manifest.siteId || deploy.state !== "ready" || deploy.context !== "production" || deploy.draft === true || site.id !== manifest.siteId || site.published_deploy?.id !== manifest.deployId || site.published_deploy?.state !== "ready") throw new Error("This deploy is not the active, ready production deploy. Nothing confirmed.");
  return deploy;
}

export function planConfirmations(manifest, rows) {
  const existing = new Map();
  for (const row of rows) {
    const cid = row.fields["Content ID"];
    if (!cid) continue;
    if (existing.has(cid)) throw new Error(`Duplicate Content ID: ${cid}; confirmation refused.`);
    existing.set(cid, row);
  }
  const updates = [];
  const entries = [...manifest.entries, ...manifest.omittedIds.map((id) => ({ id, omitted: true }))];
  for (const entry of entries) {
    const row = existing.get(entry.id);
    if (!row) {
      if (!entry.omitted) throw new Error(`Published record ${entry.id} is missing in Airtable. No automatic reconstruction.`);
      continue;
    }
    const f = row.fields;
    const recordedAt = f["Last deploy confirmed"];
    if (recordedAt && (!Number.isFinite(Date.parse(recordedAt)) || Date.parse(recordedAt) > Date.parse(manifest.builtAt))) throw new Error(`Stale or out-of-order confirmation for ${entry.id}; refusing to roll back tracking.`);
    const history = parseSlugHistory(f["Slug history"]);
    const oldSlug = f["Live slug"] || "";
    if (oldSlug && (entry.omitted || oldSlug !== entry.slug) && !history.includes(oldSlug)) history.push(oldSlug);
    const target = entry.omitted ? {
      "Live version hash": "", "Live slug": "", "Live type": "", "Live source edited at": ""
    } : {
      "Live version hash": entry.version, "Live slug": entry.slug, "Live type": entry.type,
      "Live source edited at": entry.sourceEditedAt || ""
    };
    const changed = !entry.omitted && f["Live version hash"] !== entry.version;
    const fields = {
      ...target, "Slug history": history.join(", "), "Last deploy confirmed": manifest.builtAt,
      ...(changed ? { "Content changed at": manifest.builtAt } : {})
    };
    if (recordedAt === manifest.builtAt && Object.entries(target).some(([key, value]) => (f[key] || "") !== value)) throw new Error(`Conflicting confirmation at the same timestamp for ${entry.id}.`);
    if (Object.entries(fields).some(([key, value]) => (f[key] || "") !== value)) updates.push({ id: row.id, fields });
  }
  return updates;
}

export async function runConfirmation({ apply = false, env = process.env, manifestPath = ".deploy/manifest.json", fetchImpl = fetch, readFileImpl = readFile, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), log = console } = {}) {
  const raw = await readFileImpl(manifestPath, "utf8");
  const manifest = JSON.parse(raw);
  if (!apply) { log.log(`DRY RUN: ${manifest.entries?.length ?? 0} manifest entries. No requests or writes.`); return { confirmed: 0, dryRun: true }; }
  validateManifest(manifest, env);
  if (!env.AIRTABLE_WRITE_API_KEY) throw new Error("AIRTABLE_WRITE_API_KEY is required; the read token is never used for writes.");
  const deploy = await verifyLiveDeploy(manifest, env, fetchImpl);
  const origin = new URL(deploy.deploy_ssl_url);
  if (origin.protocol !== "https:" || !origin.hostname.endsWith(".netlify.app") || !origin.hostname.startsWith(`${manifest.deployId}--`)) throw new Error("Missing immutable Netlify deployment URL.");
  const proofResponse = await fetchImpl(new URL("/deploy-proof.json", origin), { signal: AbortSignal.timeout(30000), redirect: "error" });
  if (!proofResponse.ok) throw new Error("Cannot read deployment proof. Nothing confirmed.");
  const proof = await proofResponse.json();
  if (proof.deployId !== manifest.deployId || proof.manifestHash !== createHash("sha256").update(raw).digest("hex")) throw new Error("Manifest does not match the deployed proof. Nothing confirmed.");

  const request = createAirtableClient({ env, key: env.AIRTABLE_WRITE_API_KEY, fetchImpl, sleep });
  const readRows = () => readAllRows(request, ["Content ID", "Live version hash", "Live slug", "Live type", "Slug history", "Last deploy confirmed", "Content changed at", "Live source edited at"]);
  const initialRows = await readRows();
  const pending = planConfirmations(manifest, initialRows);
  const contentIdByRow = new Map(initialRows.map((r) => [r.id, r.fields["Content ID"]]));
  let confirmed = 0;
  for (let i = 0; i < pending.length; i += 10) {
    const planned = pending.slice(i, i + 10);
    const ids = new Set(planned.map((r) => contentIdByRow.get(r.id)));
    const subset = { ...manifest, entries: manifest.entries.filter((r) => ids.has(r.id)), omittedIds: manifest.omittedIds.filter((id) => ids.has(id)) };
    const readGroup = async () => {
      if (planned.some((r) => !/^[a-zA-Z0-9]+$/.test(r.id))) throw new Error("Invalid Airtable record identity.");
      const query = new URLSearchParams({ filterByFormula: `OR(${planned.map((r) => `RECORD_ID()='${r.id}'`).join(",")})` });
      const page = await request(`?${query}`);
      if (!Array.isArray(page.records) || page.offset) throw new Error("Unexpected confirmation group response.");
      return page.records;
    };
    // Recheck both systems before each mutation; never retry a PATCH behind these guards.
    await verifyLiveDeploy(manifest, env, fetchImpl);
    const group = planConfirmations(subset, await readGroup());
    if (!group.length) continue;
    await request("", { method: "PATCH", body: JSON.stringify({ records: group }) });
    confirmed += group.length;
    await verifyLiveDeploy(manifest, env, fetchImpl);
    await sleep(250);
    const next = planConfirmations(subset, await readGroup());
    if (next.some((r) => group.some((g) => g.id === r.id))) throw new Error("Confirmation did not persist or a concurrent writer changed it. Reconcile the active deploy before retrying.");
  }
  log.log(`Confirmed ${confirmed} record(s) against the verified active deployment.`);
  return { confirmed, dryRun: false };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  loadEnvFile();
  if (process.argv.includes("--allow-unverified-deploy")) { console.error("Unverified confirmation is no longer supported."); process.exitCode = 1; }
  else runConfirmation({ apply: process.argv.includes("--apply") }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
