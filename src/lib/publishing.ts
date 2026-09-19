import type { OfferKey } from "@/content/offers";

/**
 * The single publishing rule for every editorial content type.
 *
 * Written once here and imported everywhere, so a new content type cannot
 * accidentally ship drafts, future-dated entries or test fixtures by
 * reimplementing the check slightly differently.
 */

export type PublishStatus = "draft" | "approved" | "published";

/** The fields every publishable content type must carry. */
export interface Publishable {
  /** Stable identifier, never reused, independent of the slug. */
  id: string;
  slug: string;
  title: string;
  description: string;
  /** The pillar this content routes commercial intent into. */
  offer: OfferKey;
  status: PublishStatus;
  /** ISO date. Only meaningful once status is "published". */
  publishAt: string;
  /**
   * Test data. Visible in development so templates can be verified, never
   * present in a production build or in the production ZIP.
   */
  isTestFixture?: boolean;
}

/**
 * True in `astro dev`, false in `astro build`.
 *
 * `import.meta.env` only exists inside the Vite pipeline. It is read
 * defensively so this module can also be imported directly by the test runner,
 * which executes it in plain Node where that object is undefined.
 */
const viteEnv = (import.meta as ImportMeta & { env?: { PROD?: boolean } }).env;
export const isPreviewEnvironment = !viteEnv?.PROD;

/**
 * The rule.
 *
 * - Test fixtures exist in development only.
 * - Anything not `published` is never public, in any environment.
 * - A `publishAt` in the future is not public yet.
 *
 * IMPORTANT: because this is a static site, the date is evaluated at build
 * time, not at request time. An entry dated tomorrow does not appear by itself
 * tomorrow: a build has to run after that date. See `scheduling` below.
 */
export function isPublic(
  entry: Publishable,
  now: Date = new Date(),
  /** Injectable so the rule can be unit tested outside a build. */
  isPreview: boolean = isPreviewEnvironment
): boolean {
  if (entry.isTestFixture) return isPreview;
  if (entry.status !== "published") return false;
  return new Date(entry.publishAt) <= now;
}

export function filterPublic<T extends Publishable>(
  entries: T[],
  now: Date = new Date(),
  isPreview: boolean = isPreviewEnvironment
): T[] {
  return entries.filter((entry) => isPublic(entry, now, isPreview));
}

/** Entries that are ready but whose date has not arrived. Useful for tooling. */
export function pendingScheduled<T extends Publishable>(entries: T[], now: Date = new Date()): T[] {
  return entries.filter(
    (entry) =>
      !entry.isTestFixture &&
      entry.status === "published" &&
      new Date(entry.publishAt) > now
  );
}

/**
 * WHAT REMAINS TO BE CONNECTED for scheduled publishing.
 *
 * Everything below is documentation, not behaviour. Nothing here runs.
 *
 * The content model already carries `status` and `publishAt`, and `isPublic`
 * already enforces them. The only missing piece is something that triggers a
 * rebuild after a scheduled date passes, because a static build freezes the
 * date comparison at build time.
 *
 * To connect it, in order:
 *   1. Netlify, Site settings, Build & deploy, Build hooks: create a hook.
 *      It returns a POST URL of the form
 *      https://api.netlify.com/build_hooks/<id>
 *   2. Point a scheduler at that URL. Options, cheapest first:
 *        - GitHub Actions cron in this repo (free, no new service)
 *        - Netlify Scheduled Functions (needs @netlify/functions)
 *        - Any external cron service
 *      A daily run shortly after midnight Gulf Standard Time is enough for
 *      date-based publishing. Only increase frequency if intraday slots are
 *      genuinely required.
 *   3. Set BUILD_HOOK_URL as a repository or service secret. Never commit it:
 *      anyone holding that URL can trigger unlimited builds.
 *
 * Deliberately NOT built in this pass: article generation, an editorial
 * calendar, a publishing queue and any AI integration.
 */
export const scheduling = {
  supported: true,
  /** Nothing triggers a rebuild yet, so a future date will not self publish. */
  triggerConnected: false,
  mechanism: "netlify-build-hook",
  recommendedCadence: "daily",
  /** Set once a hook exists. Kept out of the repository. */
  buildHookEnvVar: "BUILD_HOOK_URL"
} as const;
