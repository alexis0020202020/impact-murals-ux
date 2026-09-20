import { assertEditorialScope } from "../../../scripts/lib/editorial-scope.mjs";

/**
 * Plain helpers used by index.js and by tests.
 *
 * Kept out of index.js on purpose: Netlify's plugin loader treats every named
 * export of a plugin's entry file as a purported lifecycle event and throws
 * ("Invalid event '<name>'") on any export that isn't one of its known hook
 * names (onPreBuild, onBuild, onPostBuild, onSuccess, onError, onEnd). These
 * two are ordinary functions, not hooks, so they live here instead.
 */

export function confirmationEnabled(env = process.env) {
  return env.NETLIFY === "true" && env.CONTEXT === "production" && env.CONTENT_CONFIRMATION_ENABLED === "true";
}
export function checkPreBuild(env = process.env) {
  if (env.CONTEXT === "production" && ["true", "1"].includes(env.PUBLISHING_PAUSED)) throw new Error("PUBLISHING_PAUSED: no production rebuild allowed.");
  if (!confirmationEnabled(env)) return;
  assertEditorialScope(env);
  if (env.CONTENT_SOURCE !== "airtable") throw new Error("Automatic confirmation requires CONTENT_SOURCE=airtable.");
  for (const key of ["AIRTABLE_API_KEY", "AIRTABLE_WRITE_API_KEY", "NETLIFY_AUTH_TOKEN", "SITE_ID", "DEPLOY_ID"]) if (!env[key]) throw new Error(`Missing ${key}; refusing publication without its confirmation path.`);
}
