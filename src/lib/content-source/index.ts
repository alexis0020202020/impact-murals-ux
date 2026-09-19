import type { ContentRecord } from "./types";
import { createAirtableSource, readAirtableConfigFromEnv } from "./airtable";
import { fixtureRecords } from "./fixtures";
import { stressRecords, stressCountFromEnv } from "./stress";
import { resolveSourceConfig } from "./config";
import { validateBatch, validateForPublication, hasErrors, formatIssues } from "./validate";
import { isPreviewEnvironment, isPublic } from "@/lib/publishing";

/**
 * Resolves the editorial source once per build and caches the snapshot.
 *
 * Once Airtable is connected it is the only editorial source. Articles are not
 * maintained in both Airtable and a TypeScript file: fixtures exist purely so
 * templates and validation can be exercised without a connection, and they are
 * excluded from production by the shared publishing gate.
 *
 * Everything downstream reads this one snapshot: pages, indexes, relations,
 * sitemaps, redirects and the deploy manifest. They are therefore generated
 * from the same instant, and cannot disagree about what is published.
 */

let cached: ContentRecord[] | null = null;

/**
 * Refuse to publish an emptied site.
 *
 * If Airtable answers but returns nothing, that is far more likely to be a
 * revoked token, a wrong view or an outage than a decision to unpublish
 * everything. Failing the build keeps the current live site intact, because
 * Netlify only swaps in a deploy that built successfully.
 *
 * A deliberate editorial removal is still possible: set ALLOW_EMPTY_CONTENT.
 */
function guardAgainstEmptySnapshot(records: ContentRecord[]) {
  if (records.length > 0) return;
  if (process.env.ALLOW_EMPTY_CONTENT === "true") {
    console.warn("[content] Airtable returned zero records. ALLOW_EMPTY_CONTENT is set, continuing.");
    return;
  }
  throw new Error(
    "Airtable returned zero records. Refusing to build a site with no editorial content. " +
      "The previous deploy stays live. Check the base id, the table name, the view and the " +
      "token scope. Set ALLOW_EMPTY_CONTENT=true only if the removal is intended."
  );
}

export async function loadContentRecords(): Promise<ContentRecord[]> {
  if (cached) return cached;

  const isProduction = !isPreviewEnvironment;
  const { mode, paused } = resolveSourceConfig(isProduction);

  if (mode === "fixtures") {
    cached = fixtureRecords;
    return cached;
  }

  if (mode === "stress") {
    // Local only. Goes through the same validation and pause path as real
    // content, because exercising a path that is not the production path
    // proves nothing about the production path.
    cached = finalise(stressRecords(stressCountFromEnv()), paused, false);
    return cached;
  }

  const config = readAirtableConfigFromEnv();
  if (!config) {
    // resolveSourceConfig already guarantees this cannot happen; kept so a
    // future refactor cannot reintroduce the silent-fallback bug.
    throw new Error("Airtable mode selected but configuration could not be read.");
  }

  const records = await createAirtableSource(config).fetchAll();
  guardAgainstEmptySnapshot(records);
  cached = finalise(records, paused, isPreviewEnvironment);
  return cached;
}

/**
 * Validation, pause and preview merging, applied identically to every source
 * that can carry real content.
 */
function finalise(
  records: ContentRecord[],
  paused: boolean,
  withFixtures: boolean
): ContentRecord[] {
  assertSafeLiveTransitions(records);
  /*
    Two levels of validation.

    Structural checks apply to everything, because a duplicate id or a colliding
    slug is a problem whatever the status. Completeness is only required of a
    record that is actually about to be published, so an unfinished draft sitting
    in the base cannot block the schedule of unrelated finished articles.
  */
  const structural = validateBatch(records);
  if (hasErrors(structural)) {
    throw new Error(
      "Editorial content failed structural validation. Nothing was published.\n" +
        formatIssues(structural)
    );
  }

  const goingLive = records.filter((record) => isPublic(record, new Date(), false));
  const publicationIssues = goingLive.flatMap(validateForPublication);
  if (hasErrors(publicationIssues)) {
    throw new Error(
      "A record approved for publication is incomplete. Nothing was published.\n" +
        formatIssues(publicationIssues)
    );
  }

  const warnings = [...structural, ...publicationIssues].filter((i) => i.severity === "warning");
  if (warnings.length) {
    console.warn(`[content] ${warnings.length} warning(s):\n${formatIssues(warnings)}`);
  }

  const usable = applyPause(records, paused);

  return withFixtures ? [...usable, ...fixtureRecords] : usable;
}

/**
 * A record counts as already live only when a previous deploy confirmed it.
 * Approval and a past date are not evidence of a deploy.
 */
export function assertSafeLiveTransitions(records: ContentRecord[], now = new Date()): void {
  for (const record of records) {
    if (!record.liveVersion) continue;
    if (new Date(record.publishAt).getTime() > now.getTime()) throw new Error(`${record.id}: a published page cannot be re-dated into the future. Keep its original date; prepare a separate draft.`);
    if (record.liveType && record.liveType !== record.type) throw new Error(`${record.id}: changing the section of a published page requires a URL migration.`);
  }
}

/**
 * Pause, applied to the content itself rather than only to the cron.
 *
 * The rule is: while publishing is paused, the site keeps serving exactly what
 * is already online. Nothing new goes out, and nothing already out comes down.
 *
 * That second half is the part a filter alone cannot honour. Keeping a record
 * because it was confirmed live does not keep the *version* that was confirmed:
 * if an editor has since rewritten the body or changed the slug, a paused
 * rebuild would quietly publish the new text, or move the page to a new URL,
 * which is precisely what the pause exists to prevent. The deployed version is
 * not recoverable from the base, because Airtable holds only the current one.
 *
 * So the build is refused instead. Refusing leaves the last successful deploy
 * online untouched, which is the outcome the pause is asking for. Shipping the
 * edits, or dropping the pages, would both be worse.
 *
 * Exported so the behaviour is unit tested rather than assumed.
 */
export function applyPause(records: ContentRecord[], paused: boolean): ContentRecord[] {
  if (!paused) return records;
  throw new Error("PUBLISHING_PAUSED: build refused. The full previously deployed snapshot, including removed or unapproved rows, stays online.");
}

export async function recordsOfType(type: "insight" | "guide"): Promise<ContentRecord[]> {
  const all = await loadContentRecords();
  return all.filter((record) => record.type === type);
}

export * from "./types";
export { resolveSourceConfig } from "./config";
export {
  validateBatch,
  validateRecord,
  validateForPublication,
  findBrokenInternalLinks,
  hasErrors,
  formatIssues
} from "./validate";
