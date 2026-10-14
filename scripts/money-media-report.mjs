/**
 * Where every picture of the money pages stands.
 *
 *   npm run money:media            a table of every slot, by page
 *   npm run money:media -- --strict   exit 1 while any slot is still a placeholder
 *   npm run money:media -- --json     the same, as JSON
 *
 * It reads the manifest (src/content/money/media.ts) and the files on disk, and
 * applies the same order of resolution as the pages (src/lib/money-media.ts):
 * its own file, an Automotive asset it reuses, the drawing or nothing a slot may
 * declare, and otherwise a placeholder. Nothing here changes a file.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("../tests/ts-loader.mjs", pathToFileURL("./scripts/"));

const { mediaSlots, slotStem } = await import("../src/content/money/media.ts");
const { slotStem: automotiveStem } = await import("../src/content/automotive.ts");

const args = new Set(process.argv.slice(2));
const root = process.cwd();
const extensions = ["jpg", "jpeg", "png", "webp", "avif"];
const found = (directory, stem) => extensions.map((ext) => `${directory}/${stem}.${ext}`).find((path) => existsSync(join(root, path)));
const clip = (path) => existsSync(join(root, "public", path));

const rows = Object.entries(mediaSlots).map(([id, def]) => {
  const stem = slotStem(id);
  const own = found("src/assets/money", stem);
  let state;
  let source;
  let video = "";

  if (own) {
    state = "own";
    source = own;
    if (clip(`videos/money/${stem}.mp4`)) video = `videos/money/${stem}.mp4`;
    else if (def.clipAlias && clip(`videos/automotive/${automotiveStem(def.clipAlias)}.mp4`)) video = `videos/automotive/${automotiveStem(def.clipAlias)}.mp4 (Automotive clip)`;
  } else if (def.alias && found("src/assets/automotive", automotiveStem(def.alias))) {
    state = "alias";
    source = `Automotive ${def.alias}${def.stillOnly ? " (still only)" : ""}`;
    if (!def.stillOnly && clip(`videos/automotive/${automotiveStem(def.alias)}.mp4`)) video = `videos/automotive/${automotiveStem(def.alias)}.mp4`;
  } else if (def.fallback) {
    state = def.fallback === "drawing" ? "drawing" : "absent";
    source = def.fallback === "drawing" ? "illustration drawn by the page" : "none: the page has no picture here";
  } else {
    state = "placeholder";
    source = `add src/assets/money/${stem}.jpg`;
  }
  return { id, page: def.page, priority: def.priority, state, ratio: def.ratio, source, video, brief: def.brief };
});

if (args.has("--json")) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  let current = "";
  for (const row of rows) {
    if (row.page !== current) {
      current = row.page;
      console.log(`\n${current}`);
    }
    const flag = row.state === "placeholder" ? "!!" : row.state === "alias" ? "~~" : row.state === "drawing" || row.state === "absent" ? ".." : "ok";
    console.log(`  ${flag} ${row.id.padEnd(22)} ${row.state.padEnd(11)} ${row.priority.padEnd(9)} ${row.ratio.padEnd(7)} ${row.source}${row.video ? `  + ${row.video}` : ""}`);
  }
  const count = (state) => rows.filter((row) => row.state === state).length;
  console.log(
    `\n${rows.length} slots: ${count("own")} own, ${count("alias")} reuse an Automotive asset, ${count("drawing")} drawn, ${count("absent")} omitted, ${count("placeholder")} placeholder.`
  );
  console.log("ok own file   ~~ Automotive asset reused (check the caption is still true)   .. stand-in declared by the slot   !! placeholder");
}

if (args.has("--strict") && rows.some((row) => row.state === "placeholder")) process.exit(1);
