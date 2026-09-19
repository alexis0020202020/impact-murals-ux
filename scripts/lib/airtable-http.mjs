import { BASE_ID, TABLE_ID, assertEditorialScope } from "./editorial-scope.mjs";

/** GET may retry; a mutation is sent ONCE, including on a lost response. */
export function createAirtableClient({ env, key, fetchImpl = fetch, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  assertEditorialScope(env);
  if (!key) throw new Error("The required Airtable token is missing.");
  return async function request(path = "", options = {}) {
    const method = options.method ?? "GET";
    for (let attempt = 0; ; attempt++) {
      let response;
      try {
        response = await fetchImpl(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}${path}`, {
          ...options, method, signal: AbortSignal.timeout(30000),
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }
        });
      } catch {
        if (method === "GET" && attempt < 4) { await sleep(1000 * 2 ** attempt); continue; }
        throw new Error("Airtable request failed or timed out. A write may have reached the server; do not replay blindly.");
      }
      if (method === "GET" && (response.status === 429 || response.status >= 500) && attempt < 4) {
        await sleep(response.status === 429 ? 30000 : 1000 * 2 ** attempt); continue;
      }
      if (!response.ok) throw new Error(`Airtable HTTP ${response.status}.`);
      return response.json();
    }
  };
}
export async function readAllRows(request, fields = []) {
  const rows = [], offsets = new Set();
  let offset;
  do {
    const query = new URLSearchParams({ pageSize: "100" });
    fields.forEach((field) => query.append("fields[]", field));
    if (offset) query.set("offset", offset);
    const page = await request(`?${query}`);
    if (!Array.isArray(page.records)) throw new Error("Invalid Airtable response.");
    rows.push(...page.records);
    offset = page.offset;
    if (offset && offsets.has(offset)) throw new Error("Repeated Airtable pagination cursor.");
    if (offset) offsets.add(offset);
  } while (offset);
  return rows;
}
