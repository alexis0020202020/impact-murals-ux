import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

/**
 * The nine money pages are built and reviewable but not published. These tests
 * pin the properties that keep them that way and keep them honest: the launch
 * switch and the workshop gate, the route registry entries, the copy rules
 * (no em dashes, no invented links), the media manifest, the call-to-action
 * logic and the deterministic drawing the Workshops page is built on.
 *
 * They exercise the real modules (plain TypeScript, no framework imports) and
 * read the real templates and files.
 */
register("./ts-loader.mjs", pathToFileURL("./tests/"));

const launch = await import("../src/content/money/launch.ts");
const pagesModule = await import("../src/content/money/pages.ts");
const routes = await import("../src/content/money/routes.ts");
const shared = await import("../src/content/money/shared.ts");
const links = await import("../src/content/money/links.ts");
const media = await import("../src/content/money/media.ts");
const automotive = await import("../src/content/automotive.ts");
const offers = await import("../src/content/offers.ts");
const capabilities = await import("../src/content/capabilities.ts");
const { global } = await import("../src/content/global.ts");
const mosaicModule = await import("../src/components/money/diagrams/mosaic.ts");

const { moneyPages, moneyPage, moneyHref, moneyCanonical } = pagesModule;
const read = (path) => readFileSync(path, "utf8");

const contentModules = {
  "live-painting": await import("../src/content/money/live-painting.ts"),
  "corporate-artwork": await import("../src/content/money/corporate-artwork.ts"),
  "custom-canvas": await import("../src/content/money/custom-canvas.ts"),
  "hotel-artwork": await import("../src/content/money/hotel-artwork.ts"),
  "live-customisation": await import("../src/content/money/live-customisation.ts"),
  "art-installations": await import("../src/content/money/art-installations.ts"),
  designers: await import("../src/content/money/designers.ts"),
  "public-art": await import("../src/content/money/public-art.ts"),
  "corporate-workshops": await import("../src/content/money/corporate-workshops.ts")
};

/** The page's one exported content object (every content module exports exactly one). */
const main = (module) => Object.values(module)[0];

/** Each page's template, by key. */
const componentFiles = {
  "live-painting": "LivePainting",
  "corporate-artwork": "CorporateArtwork",
  "custom-canvas": "CustomCanvas",
  "hotel-artwork": "HotelArtwork",
  "live-customisation": "LiveCustomisation",
  "art-installations": "ArtInstallations",
  designers: "Designers",
  "public-art": "PublicArt",
  "corporate-workshops": "CorporateWorkshops"
};

/** Every string in a value, with the path that leads to it. */
function strings(value, path = "") {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => strings(item, path ? `${path}.${key}` : key));
  }
  return [];
}

const newPages = moneyPages.filter((page) => !page.existing);

/* ----------------------------------------------------------- the registry */

test("nine pages: eight new routes and Public Art strengthened in place", () => {
  assert.equal(moneyPages.length, 9);
  assert.equal(newPages.length, 8);
  assert.equal(new Set(moneyPages.map((page) => page.key)).size, 9);
  assert.equal(new Set(moneyPages.map((page) => page.path)).size, 9);
  assert.deepEqual(moneyPages.filter((page) => page.existing).map((page) => page.key), ["public-art"]);
  assert.equal(moneyPage("public-art").path, "/what-we-do/public-art");
});

test("every new page is one flat slug under the root, spelled without a trailing slash and linked with one", () => {
  for (const page of newPages) {
    assert.match(page.path, /^\/[a-z0-9-]+$/, page.key);
    assert.equal(moneyHref(page.key), `${page.path}/`);
    assert.equal(moneyCanonical(page, global.domain), `${global.domain}${page.path}/`);
  }
});

test("each page has its own title, description and H1 in the specified shape", () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const page of moneyPages) {
    assert.ok(page.title.endsWith("Impact Murals"), `${page.key}: the title carries the studio name, so the layout template is not applied`);
    assert.ok(page.description.length >= 120 && page.description.length <= 165, `${page.key}: description length ${page.description.length}`);
    assert.ok(!page.title.includes("—") && !page.description.includes("—"), `${page.key}: no em dash`);
    titles.add(page.title);
    descriptions.add(page.description);
  }
  assert.equal(titles.size, 9);
  assert.equal(descriptions.size, 9);
});

test("only the workshops page is provisional, and it names the page it will replace", () => {
  assert.deepEqual(moneyPages.filter((page) => page.status === "provisional").map((page) => page.key), ["corporate-workshops"]);
  assert.equal(moneyPage("corporate-workshops").consolidates, "/what-we-do/art-for-brands/creative-workshops");
});

/* ------------------------------------------------------ the launch switch */

test("production is off: the pages exist only where a build asks for them", () => {
  assert.equal(launch.MONEY_LIVE, false);
  assert.equal(launch.moneyMode({}), "off");
  assert.equal(launch.moneyMode({ NODE_ENV: "production" }), "off");
  assert.equal(launch.moneyMode({ CONTEXT: "production" }), "off");
});

test("development and non-production Netlify builds are preview", () => {
  assert.equal(launch.moneyMode({ NODE_ENV: "development" }), "preview");
  assert.equal(launch.moneyMode({ CONTEXT: "deploy-preview" }), "preview");
  assert.equal(launch.moneyMode({ CONTEXT: "branch-deploy" }), "preview");
});

test("MONEY_PAGES forces a local state, and can never publish from Netlify", () => {
  assert.equal(launch.moneyMode({ MONEY_PAGES: "off", NODE_ENV: "development" }), "off");
  assert.equal(launch.moneyMode({ MONEY_PAGES: "preview" }), "preview");
  assert.equal(launch.moneyMode({ MONEY_PAGES: "live" }), "live");
  assert.equal(launch.moneyMode({ MONEY_PAGES: "live", NETLIFY: "true", CONTEXT: "production" }), "off");
  assert.equal(launch.moneyMode({ MONEY_PAGES: "live", NETLIFY: "true", CONTEXT: "deploy-preview" }), "preview");
});

test("a page exists in a state only as the launch decision allows", () => {
  const active = (mode) => moneyPages.filter((page) => launch.moneyPageActive(page, mode)).map((page) => page.key);
  assert.deepEqual(active("off"), []);
  assert.equal(active("preview").length, 8);
  assert.ok(active("preview").includes("corporate-workshops"));
  // Launch: the workshop page stays out until its gate is cleared, and Public Art is never one of the new pages.
  assert.equal(launch.WORKSHOP_GATE_CLEARED, false);
  assert.equal(active("live").length, 7);
  assert.ok(!active("live").includes("corporate-workshops"));
  assert.ok(!active("live").includes("public-art"));
});

test("the route registry: nothing in off, noindex and outside the sitemap in preview, listed only at launch", () => {
  assert.deepEqual(routes.moneyRouteEntries("off"), []);

  const preview = routes.moneyRouteEntries("preview");
  assert.equal(preview.length, 8);
  for (const entry of preview) {
    assert.equal(entry.noIndex, true, entry.path);
    assert.equal(entry.inSitemap, false, entry.path);
    assert.ok(entry.canonicalUrl.startsWith(global.domain) && entry.canonicalUrl.endsWith("/"), entry.path);
  }

  const live = routes.moneyRouteEntries("live");
  assert.equal(live.length, 7);
  assert.ok(!live.some((entry) => entry.path === "/corporate-art-workshops-dubai"));
  for (const entry of live) {
    assert.equal(entry.noIndex, false, entry.path);
    assert.equal(entry.inSitemap, true, entry.path);
  }
});

test("the footer's preview row lists the eight new pages in preview and nothing otherwise", () => {
  assert.equal(launch.moneyPreviewLinks("off").length, 0);
  assert.equal(launch.moneyPreviewLinks("live").length, 0);
  const preview = launch.moneyPreviewLinks("preview");
  assert.equal(preview.length, 8);
  assert.ok(preview.every((link) => link.href.endsWith("/")));
});

test("every page the dispatcher can draw has a component, and only the dispatcher's own route draws them", () => {
  const dispatcher = read("src/money/[money].astro");
  for (const page of newPages) {
    assert.ok(dispatcher.includes(`"${page.key}"`) || dispatcher.includes(`${page.key}:`), `${page.key} has no entry in the component map`);
  }
  assert.ok(dispatcher.includes("moneyPageActive"), "the dispatcher draws only the pages that are active");
  assert.ok(!existsSync("src/pages/[money].astro"), "a file in src/pages is always built: the dispatcher must not live there");
});

test("with the money pages off nothing of them is in the build: no route, no component, stylesheet or script reaches an existing template", () => {
  // The routes are injected only when the pages are on.
  const integration = read("src/integrations/money-pages.mjs");
  assert.match(integration, /if \(mode === "off"\) return;/);
  assert.match(integration, /injectRoute\(\{ pattern: "\/\[money\]"/);
  assert.match(integration, /injectRoute\(\{ pattern: "\/what-we-do\/public-art"/);
  assert.ok(read("astro.config.mjs").includes("moneyPages()"));
  assert.ok(existsSync("src/money/public-art.astro") && !existsSync("src/pages/what-we-do/public-art.astro"));

  // The offer template steps aside for the strengthened Public Art page, and imports no component that carries a stylesheet or a script.
  const offer = read("src/pages/what-we-do/[slug].astro");
  assert.match(offer, /const strengthenedElsewhere = moneyMode\(\) !== "off";/);
  assert.match(offer, /\.filter\(\(offer\) => !\(strengthenedElsewhere && offer\.key === "public-art"\)\)/);
  for (const forbidden of ["MoneyBody", "pages/PublicArt", "styles/money"]) {
    assert.ok(!offer.includes(forbidden), `the offer template imports ${forbidden}`);
  }

  // The inbound links draw nothing while the pages are off, and import no stylesheet or script.
  const related = read("src/components/money/MoneyRelated.astro");
  assert.match(related, /moneyMode\(\) === "off"\s*\?\s*\[\]/);
  assert.ok(related.includes("moneyPageActive"), "a page on hold is not linked from a live build");
  assert.ok(!/\.css"|<script/.test(related), "MoneyRelated carries no stylesheet or script");

  // The shared footer's preview row uses only utilities the stylesheet already has, so the shared stylesheet does not change.
  // (The tokens are assembled here because Tailwind reads every file of the project, this one included.)
  assert.ok(!read("src/components/Footer.astro").includes(["text-paper", "40"].join("/")));
});

test("no class of a drawing is one Tailwind would turn into a rule of the shared stylesheet", () => {
  // A name Tailwind knows as a utility changes the stylesheet of every page, because it reads every source file for them. "fill" and "ink" joined by a hyphen was one.
  const token = ["fill", "ink"].join("-");
  const walk = (directory, out = []) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path, out);
      else if (/\.(astro|ts|css)$/.test(entry.name)) out.push(path);
    }
    return out;
  };
  for (const file of [...walk("src/components/money"), ...walk("src/styles/money"), ...walk("src/money"), ...walk("src/content/money")]) {
    const source = read(file);
    assert.ok(!new RegExp(`\\b${token}\\b`).test(source), `${file} uses ${token}`);
  }
});

/* --------------------------------------------------------------- the copy */

test("no em dash in any word of any page", () => {
  for (const [key, module] of Object.entries(contentModules)) {
    for (const [path, text] of strings(module)) {
      assert.ok(!text.includes("—"), `${key} ${path}: ${text.slice(0, 60)}`);
    }
  }
  for (const [path, text] of strings({ investment: shared.provisionalInvestment, studio: shared.studioLine })) {
    assert.ok(!text.includes("—"), path);
  }
});

test("copy has no double spaces, stray markup or placeholders", () => {
  for (const [key, module] of Object.entries(contentModules)) {
    for (const [path, text] of strings(module)) {
      assert.ok(!/ {2,}/.test(text), `${key} ${path}: double space`);
      assert.ok(!/[<>{}]|\bTODO\b|\bTBD\b|lorem/i.test(text), `${key} ${path}: ${text.slice(0, 60)}`);
    }
  }
});

test("every page has a call to action that names its service and starts a message with the useful questions", () => {
  for (const [key, module] of Object.entries(contentModules)) {
    const cta = main(module).cta;
    assert.ok(cta, `${key}: cta`);
    assert.ok(cta.primary.length > 10 && cta.primary.startsWith("Discuss"), `${key}: ${cta.primary}`);
    assert.ok(cta.whatsapp.startsWith("Hello Impact Murals"), key);
    assert.ok(cta.whatsapp.includes(":"), `${key}: the prefill leaves a question to answer`);
    assert.ok(cta.emailSubject.length > 8 && cta.emailBody.includes("Hello Impact Murals"), key);
    assert.match(cta.track, /^[a-z_]+$/, key);
  }
});

test("each page keeps one set of questions, all answered", () => {
  let questions = 0;
  const seen = new Set();
  for (const [key, module] of Object.entries(contentModules)) {
    const faq = main(module).faq?.items;
    assert.ok(faq && faq.length >= 6, `${key}: at least six questions`);
    for (const item of faq) {
      assert.ok(item.q.endsWith("?"), `${key}: ${item.q}`);
      assert.ok(item.a.length > 40, `${key}: ${item.q}`);
      assert.ok(!seen.has(item.q.toLowerCase()), `${key}: a question already on another page: ${item.q}`);
      seen.add(item.q.toLowerCase());
      questions += 1;
    }
  }
  assert.ok(questions >= 60);
});

/* ---------------------------------------------------------------- the links */

/** Every internal destination a page's content names, from href fields and in-sentence links. */
function destinations(module) {
  return strings(module)
    .map(([, text]) => text)
    .filter((text) => /^\/[a-z0-9\-\/]*$/.test(text) && text.length > 1);
}

const offerSlugs = new Set(offers.offers.map((offer) => offer.slug));
const offerPathFor = (key) => offers.offers.find((offer) => offer.key === key)?.slug;
const capabilityRoutes = new Set(
  capabilities.capabilities.map((capability) => `/what-we-do/${offerPathFor(capability.offerKey)}/${capability.slug}`)
);

test("every internal link a page writes leads to a route that exists, an editorial piece, or a gated route written as plain text", () => {
  const moneyRoutes = new Set(moneyPages.filter((page) => !page.existing).map((page) => `${page.path}/`));
  const corePaths = new Set(["/studio/", "/automotive/", "/discuss-a-project/", "/what-we-do/"]);

  for (const [key, module] of Object.entries(contentModules)) {
    for (const href of destinations(module)) {
      const clean = href.endsWith("/") ? href : `${href}/`;
      const bare = clean.replace(/\/$/, "");
      const known =
        moneyRoutes.has(clean) ||
        corePaths.has(clean) ||
        links.isEditorial(clean) ||
        links.gatedState(clean).gated ||
        capabilityRoutes.has(bare) ||
        [...offerSlugs].some((slug) => bare === `/what-we-do/${slug}`);
      assert.ok(known, `${key}: ${href} is not a route of this site`);
    }
  }
});

test("no page links to a page whose launch is on hold, because a live build does not generate it", () => {
  const onHold = moneyPages.filter((page) => page.status === "provisional").map((page) => `${page.path}/`);
  for (const [key, module] of Object.entries(contentModules)) {
    if (key === "corporate-workshops") continue;
    for (const href of destinations(module)) {
      assert.ok(!onHold.includes(href.endsWith("/") ? href : `${href}/`), `${key} links to ${href}`);
    }
  }
});

test("a gated route is written as plain text until it is deployed", () => {
  assert.equal(links.gatedState("/mural-artist-dubai/").gated, true);
  assert.equal(links.gatedState("/mural-artist-dubai/").deployed, false);
  assert.equal(links.gatedState("/live-painting-dubai/").gated, false);
  assert.equal(links.isEditorial("/guides/x/"), true);
  assert.equal(links.isEditorial("/live-painting-dubai/"), false);
  assert.equal(links.registryPath("/live-painting-dubai/?a=1#b"), "/live-painting-dubai");
});

test("the three pages the strategy consolidates into Public Art stay linked until their redirect is live, then are written as plain text", () => {
  const names = Object.keys(links.consolidatedRoutes);
  assert.equal(names.length, 3);
  const written = new Set(destinations(contentModules["public-art"]).map((href) => href.replace(/\/$/, "")));
  for (const route of names) {
    assert.equal(links.consolidatedRoutes[route].into, "/what-we-do/public-art");
    // Every one is still a real page, so a page that does not link it leaves it an orphan and the build refuses.
    assert.ok(written.has(route), `${route} is no longer linked from Public Art`);
    assert.equal(links.isRedirected(`${route}/`), false);
  }
  assert.equal(links.isRedirected("/live-painting-dubai/"), false);
});

/* ------------------------------------------------------------ the enquiry */

test("until the form really delivers, the primary action is WhatsApp with the service already written, and email is the quiet second route", () => {
  assert.equal(shared.moneyConversion.formConnected, false);
  for (const page of moneyPages) {
    const cta = main(contentModules[page.key]).cta;
    const resolved = shared.resolveCta(page, cta);
    assert.equal(resolved.primary.kind, "whatsapp", page.key);
    assert.ok(resolved.primary.href.startsWith(global.contact.whatsapp), page.key);
    assert.ok(decodeURIComponent(resolved.primary.href).includes(cta.whatsapp.split("\n")[0]), page.key);
    assert.ok(resolved.email.startsWith(`mailto:${global.contact.email}`), page.key);
    if (resolved.secondary) assert.equal(resolved.secondary.kind, "email", page.key);
  }
});

test("once the form is connected the primary action opens it with the offer chosen, and the second route is WhatsApp unless the page pins email", () => {
  const live = moneyPage("live-painting");
  const resolved = shared.resolveCta(live, main(contentModules["live-painting"]).cta, true);
  assert.equal(resolved.primary.kind, "form");
  assert.equal(resolved.primary.href, `/discuss-a-project?offer=${live.offer}`);
  assert.equal(resolved.secondary?.kind, "whatsapp");

  const pinned = shared.resolveCta(moneyPage("designers"), main(contentModules.designers).cta, true);
  assert.equal(pinned.secondary?.kind, "email");
});

test("the provisional investment note is on exactly the three pages the owner's own range suits", () => {
  assert.deepEqual([...shared.investmentPages], ["live-painting", "corporate-artwork", "custom-canvas"]);
  assert.equal(shared.provisionalInvestment.currency, "AED");
  for (const key of Object.keys(contentModules)) {
    const source = read(`src/components/money/pages/${componentFiles[key]}.astro`);
    assert.equal(source.includes("InvestmentNote"), shared.investmentPages.includes(key), `${key}: investment note`);
  }
});

/* ------------------------------------------------------------------- media */

test("slot stems and ratios", () => {
  assert.equal(media.slotStem("LP_FIRST_MARKS"), "lp-first-marks");
  assert.equal(media.ratioValue("9:16"), 0.5625);
  assert.equal(media.ratioValue("0.4625"), 0.4625);
  assert.equal(media.ratioValue("3:2"), 1.5);
});

const slotPrefix = {
  "live-painting": "LP",
  "corporate-artwork": "CA",
  "custom-canvas": "CC",
  "hotel-artwork": "HT",
  "live-customisation": "LC",
  "art-installations": "INS",
  designers: "DS",
  "public-art": "PA",
  "corporate-workshops": "WS"
};

test("every slot belongs to a page, names a real Automotive asset if it reuses one, and says what a placeholder stands for", () => {
  const keys = new Set(moneyPages.map((page) => page.key));
  for (const [id, def] of Object.entries(media.mediaSlots)) {
    assert.ok(keys.has(def.page), `${id}: page ${def.page}`);
    assert.ok(id.startsWith(`${slotPrefix[def.page]}_`), `${id}: the slot is named for its page`);
    assert.ok(def.alt.length > 30 && def.brief.length >= 8, id);
    assert.match(def.ratio, /^(\d+(\.\d+)?:\d+(\.\d+)?|\d+(\.\d+)?)$/, `${id}: ratio`);
    assert.ok(def.priority === "essential" || def.priority === "optional", id);
    if (def.alias) assert.ok(automotive.automotiveSlots.includes(def.alias), `${id}: alias ${def.alias}`);
    if (def.clipAlias) assert.ok(automotive.automotiveSlots.includes(def.clipAlias), `${id}: clipAlias ${def.clipAlias}`);
    assert.ok(!def.alt.includes("—") && !(def.caption ?? "").includes("—"), id);
  }
});

test("every file in the money assets folder is the file of a slot, and every slot a page draws exists", () => {
  const stems = new Set(Object.keys(media.mediaSlots).map(media.slotStem));
  for (const file of readdirSync("src/assets/money")) {
    assert.ok(stems.has(file.replace(/\.[^.]+$/, "")), `${file} belongs to no slot`);
  }

  // A slot is drawn where a template names it or where a content module hands it to a template.
  const used = new Set();
  const scan = (path) => {
    const source = read(path);
    for (const match of source.matchAll(/"([A-Z]{2,3}_[A-Z_]+)"/g)) if (media.mediaSlots[match[1]]) used.add(match[1]);
  };
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith(".astro")) scan(path);
    }
  };
  for (const file of readdirSync("src/content/money").filter((name) => name.endsWith(".ts") && name !== "media.ts")) {
    scan(join("src/content/money", file));
  }
  walk("src/components/money");
  for (const id of used) assert.ok(media.mediaSlots[id], `${id} is drawn but is not in the manifest`);
  for (const id of Object.keys(media.mediaSlots)) assert.ok(used.has(id), `${id} is in the manifest but no page draws it`);
});

test("a slot may name its own stand-in only where the specification does, and nothing else is a silent hole", () => {
  const withFallback = Object.entries(media.mediaSlots).filter(([, def]) => def.fallback);
  assert.deepEqual(
    withFallback.map(([id]) => id).sort(),
    ["WS_HERO_GROUP", "WS_HERO_PIECE", "WS_OUT_ASSEMBLED", "WS_OUT_TILES", "WS_OUT_WALL", "WS_SETUP"]
  );
  // The one picture the workshops page cannot do without has no stand-in: a launch build refuses it.
  assert.equal(media.mediaSlots.WS_FACILITATION.fallback, undefined);
  assert.equal(media.mediaSlots.WS_FACILITATION.priority, "essential");
});

test("an Automotive clip a money page borrows exists, and a still-only slot is always a reused asset", () => {
  for (const [id, def] of Object.entries(media.mediaSlots)) {
    if (def.stillOnly) assert.ok(def.alias, `${id}: stillOnly applies to an Automotive asset`);
    if (def.clipAlias) {
      assert.ok(existsSync(`public/videos/automotive/${automotive.slotStem(def.clipAlias)}.mp4`), `${id}: clip of ${def.clipAlias}`);
    }
  }
});

/* --------------------------------------------------------------- the drawing */

test("the workshops mosaic is deterministic: the same piece, tile for tile, on every build", () => {
  const hero = mosaicModule.mosaic(12, 8);
  assert.equal(hero.length, 96);
  assert.deepEqual(hero.map((tile) => tile.order).sort((a, b) => a - b), Array.from({ length: 96 }, (_, index) => index));
  assert.deepEqual(mosaicModule.mosaic(12, 8), hero);
  assert.equal(mosaicModule.mosaic(6, 4).length, 24);
  for (const tile of hero) assert.match(tile.fill, /^#[0-9a-f]{6}$/);
  // The picture has a sun, hills and a tower: the signal red and the ink are both there.
  const fills = new Set(hero.map((tile) => tile.fill));
  assert.ok(fills.size > 40, "each hand paints its own shade");
});

test("the studio palette the drawings use is the site's own", () => {
  const css = read("src/styles/global.css");
  for (const [name, hex] of Object.entries(mosaicModule.palette)) {
    const token = { bright: "paper-bright" }[name] ?? name;
    assert.ok(css.toLowerCase().includes(`--color-${token}: ${hex}`), `${name} ${hex} is not a token of the site`);
  }
});

/* ----------------------------------------------------- accessible structure */

test("each page template draws one H1 from the registry, leads with a labelled section and ends with the shared close", () => {
  for (const [key, file] of Object.entries(componentFiles)) {
    const source = read(`src/components/money/pages/${file}.astro`);
    assert.equal((source.match(/<h1[\s>]/g) ?? []).length, 1, `${key}: one h1`);
    assert.ok(source.includes("{page.h1}"), `${key}: the h1 is the registry's`);
    assert.match(source, /<Closing\s+pageKey=/, `${key}: the shared close`);
    assert.match(source, /aria-labelledby=/, `${key}: labelled sections`);
  }
});

test("decorative drawings are hidden from assistive technology and informative ones carry a label", () => {
  const directory = "src/components/money/diagrams";
  for (const file of readdirSync(directory).filter((name) => name.endsWith(".astro"))) {
    const source = read(join(directory, file));
    for (const svg of source.match(/<svg\b[^>]*>/g) ?? []) {
      assert.ok(/aria-hidden="true"|role="img"|aria-label=|\{\.\.\.|aria-hidden=/.test(svg), `${file}: ${svg.slice(0, 80)}`);
    }
  }
});
