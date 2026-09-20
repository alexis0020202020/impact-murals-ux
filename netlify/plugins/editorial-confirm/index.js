import { runConfirmation } from "../../../scripts/confirm-deploy.mjs";
import { confirmationEnabled, checkPreBuild } from "./logic.mjs";

/*
 * Netlify's plugin loader treats every named export of this file as a
 * purported lifecycle event, so only real hooks (onPreBuild, onPostBuild,
 * onSuccess) are exported here. `checkPreBuild`/`confirmationEnabled` live in
 * ./logic.mjs — importing them here without re-exporting them keeps this
 * file's export surface exactly the set of events Netlify recognises.
 */
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
