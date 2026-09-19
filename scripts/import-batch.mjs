#!/usr/bin/env node
/** Impact Murals only. Dry run by default; never approves or deletes content. */
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadEnvFile } from "./lib/load-env.mjs";
import { assertEditorialScope, parseSlugHistory } from "./lib/editorial-scope.mjs";
import { createAirtableClient, readAllRows } from "./lib/airtable-http.mjs";

const FIELD = {
  id: "Content ID", type: "Type", title: "Title", slug: "Slug",
  description: "SEO description", offer: "Offer", topics: "Topics",
  body: "Body (Markdown)", author: "Author", publishAt: "Publish date",
  intent: "Intent", noIndex: "Exclude from search engines"
};
const REQUIRED = ["id", "type", "title", "slug", "description", "offer", "body", "author"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateImport(records) {
  if (!Array.isArray(records)) throw new Error("Expected a JSON array or an object with a records array.");
  const issues = [], ids = new Set(), routes = new Set();
  records.forEach((r, i) => {
    if (!r || typeof r !== "object" || Array.isArray(r)) { issues.push(`Record ${i + 1}: expected an object.`); return; }
    const add = (m) => issues.push(`${r.id || `Record ${i + 1}`}: ${m}`);
    for (const name of REQUIRED) if (typeof r[name] !== "string" || !r[name].trim()) add(`missing ${name}.`);
    if (typeof r.id === "string" && r.id !== r.id.trim()) add("Content ID must not have surrounding whitespace.");
    if (!SLUG.test(r.slug ?? "")) add("invalid slug.");
    if (!["insight", "guide"].includes(r.type)) add("unknown type.");
    if (!["art-for-brands", "art-for-places", "public-art"].includes(r.offer)) add("unknown offer.");
    if (r.publishAt && (!/^\d{4}-\d{2}-\d{2}$/.test(r.publishAt) || Number.isNaN(Date.parse(r.publishAt)) || new Date(r.publishAt).toISOString().slice(0, 10) !== r.publishAt)) add("publishAt must be a valid YYYY-MM-DD date.");
    if (r.topics !== undefined && (!Array.isArray(r.topics) || r.topics.some((x) => typeof x !== "string" || !x.trim()))) add("topics must be an array of names.");
    if (r.noIndex !== undefined && typeof r.noIndex !== "boolean") add("noIndex must be a boolean.");
    if (r.type === "guide" && (typeof r.intent !== "string" || !r.intent.trim())) add("guide requires intent.");
    if (r.image !== undefined && (!r.image || typeof r.image !== "object" || typeof r.image.src !== "string" || typeof r.image.alt !== "string" || !r.image.alt.trim())) add("image requires src and alt text.");
    if (typeof r.image?.src === "string" && r.image.src.includes("airtableusercontent.com")) add("use a durable image URL.");
    if (ids.has(r.id)) add("duplicate Content ID in batch.");
    if (routes.has(`${r.type}:${r.slug}`)) add("duplicate route in batch.");
    ids.add(r.id); routes.add(`${r.type}:${r.slug}`);
  });
  if (issues.length) throw new Error(`${issues.length} validation error(s). Nothing written.\n${issues.join("\n")}`);
}

export function toFields(record) {
  const fields = {};
  for (const [key, field] of Object.entries(FIELD)) if (record[key] !== undefined) fields[field] = record[key];
  if (record.image) {
    fields["Image URL"] = record.image.src;
    fields["Image alt text"] = record.image.alt;
    fields["Image caption"] = record.image.caption ?? "";
  }
  // Missing optional fields are preserved. Explicit noIndex:false clears the flag.
  // Approval, history and all confirmation fields are deliberately excluded.
  return fields;
}

export function indexExisting(rows) {
  const byId = new Map(), owners = new Map();
  for (const row of rows) {
    const f = row.fields, cid = f["Content ID"], owner = cid || row.id;
    if (cid) {
      if (byId.has(cid)) throw new Error(`Duplicate Content ID already in Airtable: ${cid}. Nothing written.`);
      byId.set(cid, row);
    }
    for (const slug of [f.Slug, f["Live slug"], ...parseSlugHistory(f["Slug history"])].filter(Boolean)) {
      if (!f.Type) continue;
      const key = `${f.Type}:${slug}`;
      if (owners.has(key) && owners.get(key) !== owner) throw new Error(`Route collision already in Airtable: ${key}. Nothing written.`);
      owners.set(key, owner);
    }
  }
  return { byId, owners };
}

export function checkImportCollisions(records, rows, allowUpdates) {
  const state = indexExisting(rows);
  for (const r of records) {
    const previous = state.byId.get(r.id);
    if (previous && !allowUpdates) continue;
    if (previous?.fields.Type && previous.fields.Type !== r.type) throw new Error(`${r.id}: changing content type requires a separate URL migration.`);
    const owner = state.owners.get(`${r.type}:${r.slug}`);
    if (owner && owner !== r.id) throw new Error(`${r.id}: route already owned by ${owner}. Nothing written.`);
  }
  return state;
}

export async function runImport({ argv = process.argv.slice(2), env = process.env, fetchImpl = fetch, readFileImpl = readFile, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), log = console } = {}) {
  const file = argv.find((x) => !x.startsWith("--"));
  if (!file) throw new Error("Usage: npm run content:import -- file.json [--apply] [--allow-updates]");
  const apply = argv.includes("--apply"), allowUpdates = argv.includes("--allow-updates");
  const raw = JSON.parse(await readFileImpl(file, "utf8"));
  const records = Array.isArray(raw) ? raw : raw?.records;
  validateImport(records);
  const key = apply ? env.AIRTABLE_WRITE_API_KEY : (env.AIRTABLE_API_KEY || env.AIRTABLE_WRITE_API_KEY);
  if (!key || !env.AIRTABLE_BASE_ID) {
    if (apply) throw new Error("--apply requires AIRTABLE_WRITE_API_KEY and AIRTABLE_BASE_ID. Nothing imported.");
    log.log(`Validated ${records.length} record(s) locally. DRY RUN; no Airtable comparison.`);
    return { created: 0, updated: 0, dryRun: true };
  }
  assertEditorialScope(env);
  const request = createAirtableClient({ env, key, fetchImpl, sleep });
  const fields = ["Content ID", "Type", "Slug", "Live slug", "Slug history"];
  const readExisting = () => readAllRows(request, fields);
  const { byId } = checkImportCollisions(records, await readExisting(), allowUpdates);
  const create = records.filter((r) => !byId.has(r.id));
  const update = allowUpdates ? records.filter((r) => byId.has(r.id)) : [];
  log.log(`To create: ${create.length}; to update: ${update.length}.`);
  if (!apply) { log.log("DRY RUN. Nothing written."); return { created: 0, updated: 0, dryRun: true }; }
  let created = 0;
  for (let i = 0; i < create.length; i += 10) {
    const group = create.slice(i, i + 10);
    try {
      const response = await request("", { method: "POST", body: JSON.stringify({ records: group.map((r) => ({ fields: toFields(r) })), typecast: true }) });
      if (response.records?.length !== group.length) throw new Error("Incomplete create response.");
    } catch {
      // Never replay the POST. The server may have committed it and lost the response.
      const after = indexExisting(await readExisting());
      const missing = group.filter((r) => !after.byId.has(r.id));
      if (missing.length) throw new Error(`Partial import. Re-run to resume safely; missing: ${missing.map((r) => r.id).join(", ")}.`);
      for (const r of group) {
        const landed = after.byId.get(r.id).fields;
        if (landed.Type !== r.type || landed.Slug !== r.slug) throw new Error(`Ambiguous creation for ${r.id}; inspect before continuing.`);
      }
      log.warn("Lost create response reconciled by reading Airtable; no POST replayed.");
    }
    created += group.length;
    await sleep(250);
  }
  for (let i = 0; i < update.length; i += 10) {
    const group = update.slice(i, i + 10);
    await request("", { method: "PATCH", body: JSON.stringify({ records: group.map((r) => ({ id: byId.get(r.id).id, fields: toFields(r) })), typecast: true }) });
    await sleep(250);
  }
  log.log(`Created ${created}. Updated ${update.length}. Approval unchanged; nothing deleted.`);
  return { created, updated: update.length, dryRun: false };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  loadEnvFile();
  runImport().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
