import { runConfirmation } from "../../../scripts/confirm-deploy.mjs";
import { assertEditorialScope } from "../../../scripts/lib/editorial-scope.mjs";

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
export const onPreBuild = ({ netlifyConfig }) => {
  checkPreBuild();
  if (process.env.CONTEXT && process.env.CONTEXT !== "production") {
    netlifyConfig.headers ??= [];
    const all = netlifyConfig.headers.find((header) => header.for === "/*");
    if (all) all.values = { ...all.values, "X-Robots-Tag": "noindex, nofollow" };
    else netlifyConfig.headers.push({ for: "/*", values: { "X-Robots-Tag": "noindex, nofollow" } });
  }
};
export const onPostBuild = async ({ utils }) => {
  if (confirmationEnabled()) await utils.cache.save(".deploy");
};
export const onSuccess = async () => {
  if (!confirmationEnabled()) { console.log("Editorial confirmation disabled (or non-production deploy). No Airtable write."); return; }
  // Same build filesystem: no cached manifest is substituted for this deploy.
  await runConfirmation({ apply: true });
};
