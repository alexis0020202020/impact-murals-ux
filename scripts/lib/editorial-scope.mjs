// Pinned deliberately: never target Artective or another base.
export const BASE_ID = "appwkQjq00zjOBZjt";
export const TABLE_ID = "tblEaF9ks8yJjDqoM";
export const TABLE_NAME = "Contenus";
export function assertEditorialScope(env) {
  if (env.AIRTABLE_BASE_ID !== BASE_ID) throw new Error("AIRTABLE_BASE_ID must identify the dedicated Impact Murals SEO base. No request sent.");
  if (env.AIRTABLE_TABLE_NAME && ![TABLE_NAME, TABLE_ID].includes(env.AIRTABLE_TABLE_NAME)) throw new Error("Only the Impact Murals Contenus table is allowed. No request sent.");
}
export function parseSlugHistory(value) {
  const parts = Array.isArray(value) ? value : String(value ?? "").split(/[,\r\n]+/);
  const slugs = parts.map((part) => String(part).trim()).filter(Boolean);
  if (slugs.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) throw new Error("Invalid slug in Slug history. Correct the history before building.");
  return [...new Set(slugs)];
}
