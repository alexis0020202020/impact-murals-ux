#!/usr/bin/env node
/**
 * Prepares the "Impact Murals SEO" base so the build can read it.
 *
 * SCOPE, ENFORCED IN CODE
 * -----------------------
 * This script touches exactly one base and one table, both pinned below. It
 * never calls the "list bases" endpoint, so it cannot see, name or reach any
 * other base in the account. If AIRTABLE_BASE_ID disagrees with the pinned id,
 * it stops before making any request at all.
 *
 * It never deletes a field, never renames one, and never edits an existing
 * record. Everything it does is additive and idempotent: run it twice and the
 * second run reports that there is nothing to do.
 *
 * MODES
 *   node scripts/setup-airtable.mjs              read the schema and report
 *   node scripts/setup-airtable.mjs --apply      create the missing fields
 *   node scripts/setup-airtable.mjs --seed       add the test records
 *   node scripts/setup-airtable.mjs --verify     read back and check the data
 *
 * TOKENS
 *   AIRTABLE_SCHEMA_API_KEY   needed for --apply. Scopes: schema.bases:read,
 *                             schema.bases:write. Access: this base only.
 *   AIRTABLE_WRITE_API_KEY    needed for --seed. Scopes: data.records:read,
 *                             data.records:write. Access: this base only.
 *   AIRTABLE_API_KEY          the build token. Read-only, never used here.
 *
 * Reading the schema works with any of the three, provided it carries
 * schema.bases:read.
 */

import process from "node:process";
import { loadEnvFile } from "./lib/load-env.mjs";
import { TRACKING_FIELDS } from "./lib/tracking-fields.mjs";

loadEnvFile();

/* ------------------------------------------------------------ the target */

const BASE_ID = "appwkQjq00zjOBZjt";
const TABLE_ID = "tblEaF9ks8yJjDqoM";
const TABLE_NAME = "Contenus";

const configuredBase = process.env.AIRTABLE_BASE_ID;
if (configuredBase && configuredBase !== BASE_ID) {
  console.error(
    `AIRTABLE_BASE_ID is ${configuredBase}, but this script is pinned to ${BASE_ID}.\n` +
      "Refusing to run against a different base."
  );
  process.exit(1);
}

const apply = process.argv.includes("--apply");
const seed = process.argv.includes("--seed");
const verify = process.argv.includes("--verify");

/* ------------------------------------------------------------ the schema */

/*
  Exactly the fields src/lib/content-source/airtable.ts reads. The names are
  the contract between the base and the build: change one here and the adapter
  stops seeing that column.
*/
const FIELDS = [
  {
    name: "Content ID",
    type: "singleLineText",
    why: "Stable identifier. Drives de-duplication on import and matching on confirmation."
  },
  {
    name: "Type",
    type: "singleSelect",
    options: { choices: [{ name: "insight" }, { name: "guide" }] },
    why: "Article or specialised page. Decides the template and the URL segment."
  },
  { name: "Title", type: "singleLineText", why: "The h1 and the title tag." },
  { name: "Slug", type: "singleLineText", why: "The URL. Lowercase words separated by hyphens." },
  { name: "SEO description", type: "multilineText", why: "Meta description and index summary." },
  {
    name: "Offer",
    type: "singleSelect",
    options: {
      choices: [{ name: "art-for-brands" }, { name: "art-for-places" }, { name: "public-art" }]
    },
    why: "The pillar this content routes enquiries into. Drives the automatic offer link."
  },
  {
    name: "Topics",
    type: "multipleSelects",
    options: {
      choices: [
        { name: "commissioning" },
        { name: "production" },
        { name: "murals" },
        { name: "coordination" },
        { name: "artist-selection" },
        { name: "materials" },
        { name: "permits" },
        { name: "site-survey" }
      ]
    },
    why: "Drives the automatic related-content links. Add choices freely."
  },
  { name: "Body (Markdown)", type: "multilineText", why: "The whole body, in Markdown." },
  { name: "Author", type: "singleLineText", why: "A verifiable person. Never invented." },
  {
    name: "Image URL",
    type: "url",
    why: "A durable URL or a /assets path. Never an Airtable attachment: those expire."
  },
  { name: "Image alt text", type: "singleLineText", why: "Required whenever an image is set." },
  { name: "Image caption", type: "singleLineText", why: "Optional." },
  {
    name: "Publish date",
    type: "date",
    options: { dateFormat: { name: "iso" } },
    why: "Intended publication date. A past date alone publishes nothing."
  },
  {
    name: "Approved to publish",
    type: "checkbox",
    options: { icon: "check", color: "greenBright" },
    why: "The authorisation. Unchecked, nothing goes out whatever the date says."
  },
  {
    name: "Exclude from search engines",
    type: "checkbox",
    options: { icon: "check", color: "redBright" },
    why: "Publishes the page but marks it noindex and keeps it out of the sitemap."
  },
  {
    name: "Live version hash",
    type: "singleLineText",
    why: "TECHNICAL. Written by content:confirm after a successful deploy."
  },
  {
    name: "Live slug",
    type: "singleLineText",
    why: "TECHNICAL. The slug actually online. Drives redirects after a rename."
  },
  {
    name: "Slug history",
    type: "multilineText",
    why: "TECHNICAL. Every slug ever live, comma separated. Keeps old URLs redirecting."
  },
  {
    name: "Last deploy confirmed",
    type: "singleLineText",
    why: "TECHNICAL. Timestamp of the build that was confirmed."
  },
  {
    name: "Content changed at",
    type: "singleLineText",
    why: "TECHNICAL. Moves only when the deployed content really changed. Feeds sitemap lastmod."
  },
  {
    name: "Last edited",
    type: "lastModifiedTime",
    options: {
      /*
        Watches the editorial fields only, never the five technical ones.

        If it watched everything, the confirmation step would bump it every
        time it wrote a version hash back, and "edited since the last deploy"
        would be true for every record forever. Scoped like this, it means what
        it says. The API cannot express the exclusion by name, so a field
        created here watches all fields and must be narrowed once in the
        interface: open the field, Fields, Specific fields, then turn off
        Live version hash, Live slug, Slug history, Last deploy confirmed and
        Content changed at.
      */
      referencedFieldIds: null,
      result: { type: "dateTime", options: { dateFormat: { name: "iso" }, timeZone: "utc" } }
    },
    why: "Automatic, editorial fields only. Spots edits made since the last confirmed deploy."
  },
  {
    name: "Intent",
    type: "multilineText",
    why: "Guides only. The single question the page answers."
  }
];

FIELDS.push(...TRACKING_FIELDS.map((field) => ({ ...field, why: field.description })));
const TECHNICAL = FIELDS.filter((f) => f.why.startsWith("TECHNICAL")).map((f) => f.name);

/*
  Views. The metadata API exposes table and field creation, not view creation,
  so these are described rather than built. Each one is a filter you paste in.
*/
const VIEWS = [
  {
    name: "1. Brouillons",
    filter: "Approved to publish is unchecked",
    why: "Everything still being written. Nothing here can reach the site."
  },
  {
    name: "2. Prets et programmes",
    filter: "Approved to publish is checked AND Live version hash is empty",
    why:
      "Authorised but not online yet. Covers both a future date and a past date " +
      "whose deploy has not run, which a date filter alone would miss."
  },
  {
    name: "3. Reellement publies",
    filter: 'Live version hash is not empty AND Approved to publish is checked AND Modifiee depuis le deploiement is empty',
    why:
      "A confirmed version with no subsequent tracked edit. Not an HTTP uptime check."
  },
  /*
    The last two need a formula field first.

    Airtable view filters compare a field to a value, never one field to
    another, so "edited since the last deploy" cannot be expressed as a filter.
    Create the formula field, then filter the view on it being non-empty.
  */
  {
    name: "4. Modifications en attente",
    needsFormulaField: "Modifiee depuis le deploiement",
    formula:
      TRACKING_FIELDS.find((f) => f.name === "Modifiee depuis le deploiement").options.formula,
    filter: "Modifiee depuis le deploiement is not empty",
    why: "Online, but edited since. The change is not live until the next deploy."
  },
  {
    name: "5. Erreurs",
    needsFormulaField: "Erreurs",
    formula:
      TRACKING_FIELDS.find((f) => f.name === "Erreurs").options.formula,
    filter: "Erreurs is not empty",
    why: "Common editorial errors. The build validator remains authoritative."
  }
];

/*
  Test records. All of them deliberately unapproved, so running --seed cannot
  publish anything. The incomplete one is the point of the exercise: it proves
  a half-written draft does not block the finished records around it.
*/
const SEED_RECORDS = [
  {
    "Content ID": "test-0001",
    Type: "insight",
    Title: "TEST RECORD: complete article, not approved",
    Slug: "test-record-complete-article",
    "SEO description":
      "Test record used to check reading, importing and updating. Not approved, so it cannot be published.",
    Offer: "public-art",
    Topics: ["production"],
    "Body (Markdown)":
      "## Test record\n\nThis record exists to verify the connection between Airtable and the build. It makes no claim about the studio.",
    Author: "Studio (test record)"
  },
  {
    "Content ID": "test-0002",
    Type: "guide",
    Title: "TEST RECORD: complete guide, not approved",
    Slug: "test-record-complete-guide",
    "SEO description": "Test record for the specialised page template. Not approved.",
    Offer: "art-for-places",
    Topics: ["commissioning"],
    "Body (Markdown)": "## Test record\n\nSpecialised page test record.",
    Author: "Studio (test record)",
    Intent: "Verify that the guide template reads correctly from Airtable."
  },
  {
    // Deliberately almost empty. Structural identity only.
    "Content ID": "test-0003",
    Type: "insight",
    Title: "TEST RECORD: incomplete draft"
  },
  {
    "Content ID": "test-0004",
    Type: "insight",
    Title: "TEST RECORD: excluded from search engines",
    Slug: "test-record-noindex",
    "SEO description": "Test record for the per-content indexation control. Not approved.",
    Offer: "art-for-brands",
    Topics: ["production"],
    "Body (Markdown)": "## Test record\n\nUsed to check that the noindex flag reaches the page and the sitemap.",
    Author: "Studio (test record)",
    "Exclude from search engines": true
  }
];

/* ------------------------------------------------------------- transport */

function tokenFor(purpose) {
  const schemaKey = process.env.AIRTABLE_SCHEMA_API_KEY;
  const writeKey = process.env.AIRTABLE_WRITE_API_KEY;
  const readKey = process.env.AIRTABLE_API_KEY;

  if (purpose === "schema-write") return schemaKey;
  if (purpose === "data-write") return writeKey;
  return schemaKey ?? writeKey ?? readKey;
}

async function airtable(url, token, options = {}) {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if ((!options.method || options.method === "GET") && (response.status === 429 || response.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** attempt, 8000)));
      continue;
    }

    if (!response.ok) {
      // The body can echo field data, and the header carries the token.
      // Neither is printed.
      throw new Error(`Airtable responded with HTTP ${response.status} for ${new URL(url).pathname}`);
    }

    return response.json();
  }
}

function explainAccess() {
  console.log(`
HOW TO SET THIS UP, without sending anything through a chat.

1. Airtable, Builder hub, Personal access tokens, Create new token.

   Token A, for the build. Name it "impact-murals-build".
     Scopes: data.records:read
     Access:  Add a base -> Impact Murals SEO. Nothing else.

   Token B, for confirmation and imports. Name it "impact-murals-write".
     Scopes: data.records:read, data.records:write
     Access:  Impact Murals SEO only.

   Token C, for this script only, and only once. "impact-murals-schema".
     Scopes: schema.bases:read, schema.bases:write
     Access:  Impact Murals SEO only.
     Delete it once the fields exist.

   Never grant a token access to all current and future bases. That is the
   connection that would reach Artective and everything else in the account.

2. Create a file named .env at the root of this project. It is gitignored.

     AIRTABLE_BASE_ID=${BASE_ID}
     AIRTABLE_TABLE_NAME=${TABLE_NAME}
     AIRTABLE_API_KEY=<token A>
     AIRTABLE_WRITE_API_KEY=<token B>
     AIRTABLE_SCHEMA_API_KEY=<token C>

3. node scripts/setup-airtable.mjs              see what is missing
   node scripts/setup-airtable.mjs --apply      create the missing fields
   node scripts/setup-airtable.mjs --seed       add the four test records
   node scripts/setup-airtable.mjs --verify     read the base back

4. Create the five views by hand, using the filters printed above.

5. CONTENT_SOURCE=airtable npm run build
   Nothing publishes: the test records are not approved.
`);
}

/* ----------------------------------------------------------------- main */

const readToken = tokenFor("read");
if (!readToken) {
  console.log("No Airtable token is configured, so nothing was contacted.\n");
  console.log(`Base:  ${BASE_ID}`);
  console.log(`Table: ${TABLE_NAME} (${TABLE_ID})\n`);
  console.log(`Fields the build expects: ${FIELDS.length}`);
  FIELDS.forEach((f) => console.log(`  ${f.name.padEnd(30)} ${f.type.padEnd(18)} ${f.why}`));
  console.log("\nViews to create by hand:");
  VIEWS.forEach((v) => console.log(`\n  ${v.name}\n    filter: ${v.filter}\n    why:    ${v.why}`));
  explainAccess();
  process.exit(1);
}

// Reads the schema of ONE base. There is no call that enumerates bases.
const schemaUrl = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`;
let schema;
try {
  schema = await airtable(schemaUrl, readToken);
} catch (error) {
  console.error(`Could not read the schema: ${error.message}`);
  console.error("The token probably lacks schema.bases:read, or does not include this base.");
  process.exit(1);
}

const table = schema.tables.find((t) => t.id === TABLE_ID);
if (!table) {
  console.error(`Table ${TABLE_ID} was not found in base ${BASE_ID}. Nothing was changed.`);
  process.exit(1);
}

const existingNames = new Set(table.fields.map((f) => f.name));
const missing = FIELDS.filter((f) => !existingNames.has(f.name));
const unknown = table.fields.filter((f) => !FIELDS.some((known) => known.name === f.name));

console.log(`Base  ${BASE_ID}`);
console.log(`Table ${table.name} (${table.id})`);
console.log(`Fields present: ${table.fields.length}, expected: ${FIELDS.length}, missing: ${missing.length}\n`);

if (missing.length) {
  console.log("Missing fields:");
  missing.forEach((f) => console.log(`  - ${f.name} (${f.type})`));
  console.log("");
}

if (unknown.length) {
  console.log("Fields in the table that the build does not read (left untouched):");
  unknown.forEach((f) => console.log(`  - ${f.name} (${f.type})`));
  console.log("");
}

if (apply && missing.length) {
  const schemaToken = tokenFor("schema-write");
  if (!schemaToken) {
    console.error("--apply needs AIRTABLE_SCHEMA_API_KEY with schema.bases:write. Nothing was changed.");
    process.exit(1);
  }

  let created = 0;
  const failed = [];

  for (const field of missing) {
    const body = { name: field.name, type: field.type };
    if (field.options) body.options = field.options;

    try {
      await airtable(`${schemaUrl}/${TABLE_ID}/fields`, schemaToken, {
        method: "POST",
        body: JSON.stringify(body)
      });
      created++;
      console.log(`  + ${field.name}`);
    } catch (error) {
      // A computed field type can be refused by the API. Report it precisely
      // rather than pretending the schema is complete.
      failed.push({ name: field.name, type: field.type, message: error.message });
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\nCreated ${created} field(s).`);
  if (failed.length) {
    console.log(`\n${failed.length} field(s) could not be created by the API:`);
    failed.forEach((f) => console.log(`  - ${f.name} (${f.type}): ${f.message}`));
    console.log("  Create these by hand with exactly these names, then re-run this script.");
    process.exit(1);
  }
} else if (apply) {
  console.log("Nothing to create. The schema already matches.");
}

/* ------------------------------------------------------------- the views */

const viewNames = new Set((table.views ?? []).map((v) => v.name));
console.log("Views:");
for (const view of VIEWS) {
  const present = viewNames.has(view.name);
  console.log(`  ${present ? "present" : "MISSING"}  ${view.name}`);
  if (!present) {
    if (view.needsFormulaField) {
      console.log(`            first create a formula field "${view.needsFormulaField}":`);
      console.log(`              ${view.formula}`);
    }
    console.log(`            filter: ${view.filter}`);
    console.log(`            why:    ${view.why}`);
  }
}
console.log(
  "\nViews are not created here: the metadata API exposes tables and fields, not views.\n" +
    `Hide these technical fields in the editing view: ${TECHNICAL.join(", ")}.\n`
);

/* -------------------------------------------------------------- seeding */

if (seed) {
  const writeToken = tokenFor("data-write");
  if (!writeToken) {
    console.error("--seed needs AIRTABLE_WRITE_API_KEY. Nothing was written.");
    process.exit(1);
  }
  if (missing.length) {
    console.error("Fields are still missing. Run --apply first. Nothing was written.");
    process.exit(1);
  }

  const dataUrl = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  // Read first, so a second run adds nothing. This is the same anti-duplicate
  // rule the importer uses: identity is the Content ID, never the row id.
  const present = new Set();
  let offset;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const page = await airtable(`${dataUrl}?${params}`, writeToken);
    page.records.forEach((row) => {
      const cid = row.fields["Content ID"];
      if (cid) present.add(cid);
    });
    offset = page.offset;
    if (offset) await new Promise((r) => setTimeout(r, 250));
  } while (offset);

  const toCreate = SEED_RECORDS.filter((r) => !present.has(r["Content ID"]));

  if (!toCreate.length) {
    console.log("All test records already exist. Nothing was written.");
  } else {
    await airtable(dataUrl, writeToken, {
      method: "POST",
      body: JSON.stringify({
        records: toCreate.map((fields) => ({ fields })),
        typecast: true
      })
    });
    console.log(`Created ${toCreate.length} test record(s), none approved for publication:`);
    toCreate.forEach((r) => console.log(`  + ${r["Content ID"]}  ${r.Title}`));
  }
}

/* ------------------------------------------------------------ verifying */

if (verify) {
  const dataUrl = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
  const rows = [];
  let offset;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const page = await airtable(`${dataUrl}?${params}`, readToken);
    rows.push(...page.records);
    offset = page.offset;
    if (offset) await new Promise((r) => setTimeout(r, 250));
  } while (offset);

  const ids = rows.map((r) => r.fields["Content ID"]).filter(Boolean);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  const approved = rows.filter((r) => r.fields["Approved to publish"] === true);
  const live = rows.filter((r) => r.fields["Live version hash"]);
  const noId = rows.filter((r) => !r.fields["Content ID"]);

  console.log("Read back:");
  console.log(`  records:            ${rows.length}`);
  console.log(`  with a Content ID:  ${ids.length}`);
  console.log(`  duplicate ids:      ${duplicates.length ? duplicates.join(", ") : "none"}`);
  console.log(`  approved:           ${approved.length}`);
  console.log(`  confirmed live:     ${live.length}`);
  if (noId.length) console.log(`  WITHOUT a Content ID: ${noId.length} (these cannot be tracked)`);

  console.log(
    "\nFull validation runs in the build itself:\n" +
      "  CONTENT_SOURCE=airtable npm run build"
  );

  if (duplicates.length || noId.length) process.exit(1);
}

if (!apply && !seed && !verify) {
  console.log("Read-only run. Nothing was changed. Add --apply to create the missing fields.");
}
