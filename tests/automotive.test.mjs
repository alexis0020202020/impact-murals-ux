import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

/**
 * /automotive is an outreach page: unlisted, noindex, built around real
 * photographs and clips, with approved final copy that is stored word for word.
 * The artwork leads and the type supports it. These tests pin those properties
 * against the real modules, templates and files.
 */
register("./ts-loader.mjs", pathToFileURL("./tests/"));

const automotive = await import("../src/content/automotive.ts");
const { global } = await import("../src/content/global.ts");
const { sitemapRoutes, buildRoutes } = await import("../src/lib/routes.ts");

const components = readdirSync("src/components/automotive").filter((file) => file.endsWith(".astro"));
const read = (path) => readFileSync(path, "utf8");
const css = read("src/styles/automotive.css");
const page = read("src/pages/automotive.astro");
/** Non-breaking spaces (kept in a headline so a phone wraps it well) read as ordinary spaces. */
const flat = (text) => text.replaceAll(" ", " ");

const strings = [];
(function collect(value) {
  if (typeof value === "string") strings.push(value);
  else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === "object") Object.values(value).forEach(collect);
})(automotive);

/**
 * The approved final copy of the page, exactly as supplied by the owner, block
 * by block. It is the source of truth: the content module must hold it word for
 * word, and nothing else may be visible.
 */
const approved = {
  hero: {
    statement: "ART FOR CAR LOVERS.",
    headline: "MURALS, VEHICLE ART & LIVE PAINTING.",
    intro: "Art-led projects for automotive spaces, brands, events and private collections."
  },
  whatWeDo: {
    headline: "WHAT WE DO.",
    intro: [
      "Cars are personal. The places and experiences built around them can be too.",
      "Led by artist and creative director Alexis, Impact Murals creates original artwork for automotive spaces, vehicles and events, bringing together the artists and production specialists each project needs."
    ],
    offers: [
      {
        title: "MURALS & SPACES",
        body: [
          "A showroom, a performance workshop or a private garage deserves artwork that suits the cars and the people behind it.",
          "We design murals inspired by what makes each place distinctive, whether that's the cars you build, a racing era, a particular marque or the character of a private collection."
        ]
      },
      {
        title: "CUSTOM ARTWORKS",
        body: [
          "A favourite car, a racing icon or a one-off build. We create original paintings and commissioned pieces for enthusiasts, collectors and automotive brands.",
          "The style might be photorealistic, graphic or something more experimental, depending on the subject."
        ]
      },
      {
        title: "VEHICLE PAINTING",
        body: [
          "Original artwork painted directly onto vehicles. Whether it's a personal commission, a special build or a vehicle prepared for an event, the artwork is developed specifically for the car."
        ]
      },
      {
        title: "LIVE PAINTING & ACTIVATIONS",
        body: [
          "There's something different about watching an artwork take shape in real time. Our live painting makes that process part of automotive launches, events and gatherings."
        ]
      }
    ]
  },
  realism: {
    eyebrow: "AUTOMOTIVE REALISM",
    headline: "THE DETAILS CAR PEOPLE NOTICE.",
    body: [
      "When you know a car, you notice everything. The stance, the reflections on the bodywork, the lines that make it instantly recognisable.",
      "We bring that same attention to realistic murals and original paintings, including portraits and subjects drawn from automotive culture and racing history. Each piece has its own artistic character, while staying true to what makes the subject special."
    ]
  },
  bmw: {
    eyebrow: "BMW M5 TOURING / DUBAI, 2025",
    headline: "LIVE VEHICLE PAINTING.",
    body: [
      "As part of AGMC's activation at Binance Blockchain Week 2025, Alexis live-painted a BMW M5 Touring outside Dubai's Coca-Cola Arena.",
      "Visitors could watch the spray-painted artwork take shape directly on the vehicle."
    ],
    also: "Our automotive projects have also included artwork for a BMW booth at the 1 Billion Followers Summit in Dubai.",
    link: "FEATURED BY AGMC: READ THE ARTICLE →",
    href: "https://www.agmc.com/en/news/agmc-supported-the-future-of-blockchain-with-binance-blockchain-week-2025"
  },
  exterior: {
    eyebrow: "PRIVATE COMMISSION / EXTERIOR MURAL",
    headline: "THE SPIRIT OF ECSTASY, AT ARCHITECTURAL SCALE.",
    body: [
      "For this private commission, we painted a large-scale interpretation of the Rolls-Royce Spirit of Ecstasy on the exterior of a building.",
      "The sculptural form was translated into a bold black-and-white composition, using sharp contrasts and chrome-like highlights to give the artwork its depth.",
      "A familiar automotive icon, approached as an original piece of mural art."
    ]
  },
  launch: {
    eyebrow: "AUTOMOTIVE LAUNCHES / LIVE PAINTING",
    headline: "PAINTED LIVE, IN FRONT OF THE AUDIENCE.",
    jetour: {
      name: "JETOUR",
      body: "Bold graphic artwork painted directly onto the vehicle during a live automotive event."
    },
    icaur: {
      name: "iCAUR",
      body: "Arabic calligraphy painted directly onto the vehicle during the launch."
    }
  },
  about: {
    headline: "ARTIST-LED. PROJECT-DRIVEN.",
    body: [
      "Impact Murals is a Dubai-based art studio led by Alexis, a French artist and creative director with 15 years of hands-on experience.",
      "We bring together a carefully selected team of artists and production specialists according to the style, technique and scale of each project.",
      "Alexis leads the creative direction and remains involved throughout production, whether painting himself or directing a larger team."
    ]
  },
  /**
   * Added after the nine blocks, at the owner's request: one editorial note between
   * About and How we work. The range is written with an en dash, as supplied.
   */
  investment: {
    figure: "AED 8,000–25,000+",
    body: "Typical project investment, depending on scale, artistic complexity and production requirements.",
    flexible: "If you're working within a defined budget, we can usually shape the format and scope around it.",
    deposit: "A deposit is required to secure the project and begin creative development, typically 50%."
  },
  process: {
    headline: "HOW WE WORK.",
    steps: [
      {
        title: "THE BRIEF",
        body: "We discuss the idea, the space or vehicle, the timeline and what the project needs to achieve."
      },
      {
        title: "THE PROPOSAL",
        body: "We define the artistic approach, scope, production requirements and budget, then provide a clear proposal for approval."
      },
      {
        title: "THE ARTWORK",
        body: "Once the project is confirmed, we develop the artwork for your review. The agreed revision process gives you the opportunity to refine the design before production begins."
      },
      {
        title: "THE EXECUTION",
        body: "We coordinate preparation, production and painting, working with the right artists and techniques for the project."
      }
    ]
  },
  closing: {
    headline: "LET'S TALK IDEAS.",
    body: [
      "Have a space, a vehicle or an upcoming event in mind?",
      "Let's discuss what we could create for it. A short call is usually the easiest way to explore the possibilities and work out an approach that fits your project."
    ],
    link: "EXPLORE IMPACT MURALS →"
  }
};

/** Every approved string a visitor reads, flattened (the one address is checked on its own). */
const approvedStrings = [];
(function gather(value) {
  if (typeof value === "string") {
    if (!/^https?:\/\//.test(value)) approvedStrings.push(value);
  } else if (Array.isArray(value)) value.forEach(gather);
  else if (value && typeof value === "object") Object.values(value).forEach(gather);
})(approved);

/**
 * Functional labels that are not part of the approved copy and stay: the jump
 * link (the page's only navigation), the labels of the two direct contact
 * routes, the location line, and the one-word tag that says which picture is
 * the wall before the mural. The arrow glyphs are drawn apart from the words.
 */
const functionalLabels = ["CONTACT", "WHATSAPP", "EMAIL", "Dubai, UAE", "BEFORE", "→"];

/** The words a visitor can read (alt text, addresses and technical keys are not among them). */
const technicalKeys = new Set(["alt", "detailAlt", "beforeAlt", "href", "slot", "place", "ariaLabel", "id"]);
const visible = [];
(function collectVisible(value, key = "") {
  if (typeof value === "string") {
    if (!technicalKeys.has(key)) visible.push(flat(value));
  } else if (Array.isArray(value)) {
    if (key === "headlineLines" || key === "statementLines") visible.push(flat(value.join(" ")));
    else value.forEach((item) => collectVisible(item, key));
  } else if (value && typeof value === "object") {
    // A link is its label and its arrow, which read as one string.
    if ("label" in value && "arrow" in value) visible.push(`${value.label} ${value.arrow}`);
    else for (const [name, child] of Object.entries(value)) collectVisible(child, name);
  }
})(Object.fromEntries(Object.entries(automotive).filter(([name]) => !["automotiveSlots", "slotStem", "automotiveSeo"].includes(name))));

/** The identifiers agreed in the brief that are still on the page. */
const briefSlots = [
  "AUTOMOTIVE_HERO",
  "BMW_BINANCE_MAIN",
  "BMW_BINANCE_DETAIL",
  "EXTERIOR_MURAL_MAIN",
  "WORKSHOP_MURAL_MAIN",
  "JETOUR_LAUNCH",
  "ICAUR_LAUNCH"
];
/**
 * Added for the supplied material: the picture beside the offers, the wall before
 * the exterior mural, the Porsche portrait, the phone crop of the opening picture
 * (the same artwork, cut for a phone), and, for the media-density pass, the
 * supplied Ferrari picture and the process clip of the realism wall, and the
 * studio clip shared with the homepage.
 */
const addedSlots = [
  "WHAT_WE_DO_MAIN", "EXTERIOR_MURAL_BEFORE", "PORSCHE_PORTRAIT", "AUTOMOTIVE_HERO_MOBILE",
  "FERRARI_REALISM", "CANVAS_PROCESS", "STUDIO_AT_WORK"
];

const stills = readdirSync("src/assets/automotive");
const clips = readdirSync("public/videos/automotive").filter((file) => file.endsWith(".mp4"));

/** The largest size a font-size rule can reach, in rem, read from its clamp() or plain value. */
function maxRem(selector, atWidth = "wide") {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blocks = [...css.matchAll(new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`, "g"))].map((match) => match[1]);
  const sizes = blocks
    .map((block) => block.match(/font-size:\s*clamp\([^,]+,[^,]+,\s*([\d.]+)rem\)/)?.[1])
    .filter(Boolean)
    .map(Number);
  assert.ok(sizes.length, `no clamp() font-size for ${selector}`);
  return atWidth === "wide" ? sizes[sizes.length - 1] : sizes[0];
}

test("the page is indexable: in the registry and the sitemap, canonical on the www address, linked from a crawlable page", async () => {
  assert.ok((await sitemapRoutes()).includes("/automotive"));
  const entry = (await buildRoutes()).find((route) => route.path === "/automotive");
  assert.equal(entry.noIndex, false);
  assert.equal(entry.inSitemap, true);
  assert.equal(entry.canonicalUrl, "https://www.impactmurals.ae/automotive/");
  assert.match(page, /canonical=\{AUTOMOTIVE_CANONICAL\}/);
  assert.ok(!/\bnoindex\b/.test(page.replace(/\/\*[\s\S]*?\*\//g, "")), "no noindex on the page");
  // One normal internal link, from the branded murals page's related list, and none in the main navigation.
  const capabilities = read("src/content/capabilities.ts");
  assert.match(capabilities, /relatedPages: \[\{ title: "[^"]+", href: "\/automotive\/" \}\]/);
  assert.ok(!/automotive/i.test(read("src/components/Header.astro")));
});

test("the page template drops the site chrome", () => {
  assert.match(page, /<BaseLayout[\s\S]*\bminimal\b[\s\S]*>/);
  const layout = read("src/layouts/BaseLayout.astro");
  assert.match(layout, /\{!minimal && <Header \/>\}/);
  assert.match(layout, /\{!minimal && <Footer \/>\}/);
});

test("the sections run in the approved copy's order, with the brand strip under the hero and the investment note before How we work", () => {
  const order = ["Hero", "Brands", "WhatWeDo", "Realism", "Bmw", "Exterior", "Launch", "About", "Investment", "Process", "ContactCta"];
  const positions = order.map((name) => page.indexOf(`<${name} />`));
  positions.forEach((position, index) => assert.ok(position >= 0, `<${order[index]} /> is missing from the page`));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, "sections are out of order");
  // No component may exist without being on the page (no obsolete leftovers).
  const used = new Set([...order, "AutoMedia", "Tight"]);
  for (const file of components) assert.ok(used.has(file.replace(".astro", "")), `${file} is not part of the page`);
  // The Ferrari is the opening picture, not a section of its own further down; there is no standalone range,
  // no workshop / portraits section, no photoreal-only section and no project scope section. (Budget is the
  // investment note, which sits directly before How we work: see the investment test.)
  for (const gone of ["Ferrari", "Range", "Workshop", "Photoreal", "Scope"]) {
    assert.ok(!components.includes(`${gone}.astro`), `${gone}.astro should not exist`);
    assert.ok(!page.includes(`<${gone} />`), `<${gone} /> should not be on the page`);
  }
  assert.ok(!/creative range/i.test(strings.join(" ") + css), "the Creative Range copy and styles are gone");
  for (const key of ["range", "scope", "photoreal", "workshop", "ferrari"]) assert.ok(!(key in automotive), `the ${key} content is gone`);
  assert.ok(!/auto-scope|auto-hero-credit|auto-real-(?:clip|porsche|note)/.test(css), "the styles of the removed blocks are gone");
});

test("the copy is the approved copy, word for word, and nothing else is visible", () => {
  const { hero, whatWeDo, realism, bmw, exterior, launch, about, process, contact } = automotive;

  // Block by block, in the content module.
  assert.equal(flat(hero.statementLines.join(" ")), approved.hero.statement);
  assert.equal(flat(hero.headlineLines.join(" ")), approved.hero.headline);
  assert.equal(hero.intro, approved.hero.intro);

  assert.equal(whatWeDo.headline, approved.whatWeDo.headline);
  assert.deepEqual([...whatWeDo.intro], approved.whatWeDo.intro);
  assert.deepEqual(
    whatWeDo.offers.map((offer) => ({ title: offer.title, body: [...offer.body] })),
    approved.whatWeDo.offers
  );

  assert.equal(realism.eyebrow, approved.realism.eyebrow);
  assert.equal(realism.headline, approved.realism.headline);
  assert.deepEqual([...realism.body], approved.realism.body);

  assert.equal(bmw.eyebrow, approved.bmw.eyebrow);
  assert.equal(bmw.title, approved.bmw.headline);
  assert.deepEqual([...bmw.body], approved.bmw.body);
  assert.equal(bmw.also, approved.bmw.also);
  assert.equal(`${bmw.article.label} ${bmw.article.arrow}`, approved.bmw.link);
  assert.equal(bmw.article.href, approved.bmw.href);

  assert.equal(exterior.eyebrow, approved.exterior.eyebrow);
  assert.equal(exterior.title, approved.exterior.headline);
  assert.deepEqual([...exterior.body], approved.exterior.body);

  assert.equal(launch.eyebrow, approved.launch.eyebrow);
  assert.equal(launch.headline, approved.launch.headline);
  assert.equal(launch.jetour.name, approved.launch.jetour.name);
  assert.equal(launch.jetour.body, approved.launch.jetour.body);
  assert.equal(launch.icaur.name, approved.launch.icaur.name, "iCAUR is written with a lower-case i");
  assert.equal(launch.icaur.body, approved.launch.icaur.body);

  assert.equal(about.headline, approved.about.headline);
  assert.deepEqual([...about.body], approved.about.body);

  assert.deepEqual({ ...automotive.investment }, approved.investment);

  assert.equal(process.headline, approved.process.headline);
  assert.deepEqual(process.steps.map((step) => ({ title: step.title, body: step.body })), approved.process.steps);

  assert.equal(contact.headline, approved.closing.headline);
  assert.deepEqual([...contact.body], approved.closing.body);
  assert.equal(`${contact.site.label} ${contact.site.arrow}`, approved.closing.link);

  // Every approved block is present and every visible string is either approved or a documented functional label.
  const known = new Set([...approvedStrings, ...functionalLabels].map(flat));
  for (const text of approvedStrings) assert.ok(visible.includes(flat(text)), `approved copy is missing: ${text}`);
  for (const text of visible) assert.ok(known.has(text), `visible text that is not approved copy: ${text}`);

  // The page's own title and description are the hero's words.
  assert.equal(automotive.automotiveSeo.title, "Murals, Vehicle Art & Live Painting");
  assert.equal(automotive.automotiveSeo.description, approved.hero.intro);

  // Website copy has no em dash anywhere, alt text included.
  assert.ok(strings.length > 30);
  for (const text of strings) assert.ok(!text.includes("—"), `em dash in: ${text}`);
});

test("every approved block is drawn by its section, and no other wording is written into a template", () => {
  const drawn = {
    "Hero.astro": ["hero.statementLines", "hero.headlineLines", "hero.intro", "hero.jump"],
    "Brands.astro": ["brands.items", "brands.ariaLabel", "brand.alt"],
    "WhatWeDo.astro": ["whatWeDo.headline", "whatWeDo.intro", "whatWeDo.offers", "offer.title", "offer.body"],
    "Realism.astro": ["realism.eyebrow", "realism.headline", "realism.body[0]", "realism.body[1]", "realism.art"],
    "Bmw.astro": ["bmw.eyebrow", "bmw.title", "bmw.body[0]", "bmw.body[1]", "bmw.also", "bmw.article.label", "bmw.article.arrow", "bmw.article.href"],
    "Exterior.astro": ["exterior.eyebrow", "exterior.title", "exterior.body", "exterior.beforeLabel"],
    "Launch.astro": ["launch.eyebrow", "launch.headline", "launch.jetour.name", "launch.jetour.body", "launch.icaur.name", "launch.icaur.body"],
    "About.astro": ["about.headline", "about.body"],
    "Investment.astro": ["investment.figure", "investment.body", "investment.flexible", "investment.deposit"],
    "Process.astro": ["process.headline", "process.steps", "step.title", "step.body"],
    "ContactCta.astro": ["contact.headline", "contact.body[0]", "contact.body[1]", "contact.site.label", "contact.site.arrow", "contact.whatsapp", "contact.email", "contact.location"]
  };
  for (const [file, expressions] of Object.entries(drawn)) {
    const source = read(`src/components/automotive/${file}`);
    for (const expression of expressions) assert.ok(source.includes(expression), `${file} does not draw ${expression}`);
  }
  // Wording lives in src/content/automotive.ts: a template holds markup, never a sentence.
  for (const file of components.filter((name) => name !== "Tight.astro")) {
    const markup = read(`src/components/automotive/${file}`)
      .replace(/^---[\s\S]*?---/, "")
      .replace(/<!--[\s\S]*?-->/g, "");
    const literal = [...markup.matchAll(/>([^<>{}]*[A-Za-z]{3,}[^<>{}]*)</g)].map((match) => match[1].trim()).filter(Boolean);
    assert.deepEqual(literal, [], `${file} writes visible wording into the template`);
  }
});

test("paragraph text keeps its hyphenated words whole across lines, without changing a character of the copy", async () => {
  const { tightRuns } = await import("../src/lib/automotive-text.ts");
  const sentence = approved.bmw.body[0];
  const runs = tightRuns(sentence);
  // The runs are the sentence, character for character.
  assert.equal(runs.map((run) => run.text).join(""), sentence);
  assert.deepEqual(
    runs.filter((run) => run.tight).map((run) => run.text),
    ["live-painted", "Coca-Cola"]
  );
  // Every approved paragraph survives the split unchanged, and brand names and compounds are never split.
  const paragraphs = approvedStrings.filter((text) => text.length > 60);
  assert.ok(paragraphs.length >= 20);
  for (const text of paragraphs) assert.equal(tightRuns(text).map((run) => run.text).join(""), text);
  const tight = paragraphs.flatMap((text) => tightRuns(text).filter((run) => run.tight).map((run) => run.text));
  for (const word of ["Coca-Cola", "Rolls-Royce", "hands-on", "black-and-white", "spray-painted", "Dubai-based", "Art-led"]) {
    assert.ok(tight.includes(word), `${word} is kept whole`);
  }
  assert.equal(tightRuns("No compound here.").length, 1);
  // Every paragraph of the page goes through it (headlines do not: a long compound must stay free to wrap on a phone).
  for (const file of ["Hero", "WhatWeDo", "Realism", "Bmw", "Exterior", "Launch", "About", "Investment", "Process", "ContactCta"]) {
    const source = read(`src/components/automotive/${file}.astro`);
    assert.match(source, /import Tight from "\.\/Tight\.astro"/, `${file} imports Tight`);
    assert.ok(!/<p[^>]*class="[^"]*auto-(?:lead|body|hero-intro)[^"]*"[^>]*>\{[^}]*\}<\/p>/.test(source), `${file} draws a paragraph without Tight`);
  }
  assert.match(css, /\.auto-tight\s*\{[^}]*white-space:\s*nowrap/);
});

test("no obsolete copy remains: no workshop heading, no old pricing or scope section, and money is spoken of only where the owner put it", () => {
  const joined = visible.join("\n");
  const sources = [...components.map((file) => read(`src/components/automotive/${file}`)), page, css].join("\n");
  for (const old of [
    "Automotive Portraits", "AUTOMOTIVE WORKSHOP", "PHOTOREAL MURAL", "PHOTOREALISM", "PORSCHE PORTRAIT",
    "FROM WALLS", "TO VEHICLES", "LAUNCH ARTWORK", "SCOPE & BOOKING", "HAVE A PROJECT IN MIND",
    "PRIVATE CLIENT", "ULTRA-REALISTIC FERRARI MURAL", "IMPACT MURALS / AUTOMOTIVE", "LARGE-SCALE EXTERIOR MURAL",
    "PROJECT SCOPE", "Most projects fall within", "Have a defined budget", "Send over the brief", "impactmurals.ae"
  ]) {
    assert.ok(!joined.includes(old), `old copy is still visible: ${old}`);
    assert.ok(!sources.includes(old), `old copy is still in a template or stylesheet: ${old}`);
  }
  // No visible text about workshops or Porsche (only the descriptions for screen readers speak of the pictures).
  assert.ok(!/porsche/i.test(joined), "a visible text names the Porsche artwork");
  assert.ok(!/workshop mural|workshop clip/i.test(joined), "a visible text names the workshop artwork");
  // Budget is spoken of in two places: the investment note (a defined budget) and the proposal step. The range
  // and the currency are stated once, in the investment note, and nowhere else; no template or stylesheet writes one.
  const budget = visible.filter((text) => /budget/i.test(text));
  assert.deepEqual(budget, [approved.investment.flexible, approved.process.steps[1].body], "budget is mentioned only in the investment note and the proposal step");
  const money = visible.filter((text) => /\b(?:AED|USD|EUR|price|prices|pricing|investment)\b|\d,\d{3}|\$\d/i.test(text));
  assert.deepEqual(money, [approved.investment.figure, approved.investment.body], "the range is stated only in the investment note");
  assert.ok(!/\bAED\b|\d,\d{3}\b/.test(sources), "no price or currency is written in a template or stylesheet");
});

test("the contact block reuses the site's own contact details, and its secondary link goes to the site", () => {
  const block = read("src/components/automotive/ContactCta.astro");
  assert.match(block, /global\.contact\.whatsapp/);
  assert.match(block, /global\.contact\.email/);
  assert.match(block, /global\.contact\.phoneDisplay/);
  assert.ok(!/\+971|@impactmurals\.ae/.test(block), "contact details must come from src/content/global.ts");
  assert.equal(automotive.contact.location, "Dubai, UAE");
  assert.equal(global.contact.phoneDisplay, "+971 58 195 7567");
  assert.equal(global.contact.email, "alexis@impactmurals.ae");
  // The secondary link is the studio's own site (the root, wherever this page is served from), with its arrow drawn apart.
  assert.match(block, /<a href="\/"[^>]*data-track="automotive_website_click"[\s\S]*?contact\.site\.label[\s\S]*?aria-hidden="true"[^>]*>\{contact\.site\.arrow\}/);
  // The closing sits where the page's jump link points.
  assert.match(block, /<section id="contact"/);
  assert.match(read("src/components/automotive/Hero.astro"), /href="#contact"/);
});

test("the BMW section ends on the link to AGMC's own article, opened in a new tab", () => {
  const { bmw } = automotive;
  assert.equal(
    bmw.article.href,
    "https://www.agmc.com/en/news/agmc-supported-the-future-of-blockchain-with-binance-blockchain-week-2025"
  );
  const url = new URL(bmw.article.href);
  assert.equal(url.protocol, "https:");
  assert.equal(url.hostname, "www.agmc.com");
  assert.equal(`${bmw.article.label} ${bmw.article.arrow}`, "FEATURED BY AGMC: READ THE ARTICLE →");

  const markup = read("src/components/automotive/Bmw.astro");
  const link = markup.match(/<a\b[\s\S]*?<\/a>/)?.[0] ?? "";
  assert.match(link, /href=\{bmw\.article\.href\}/);
  assert.match(link, /target="_blank"/);
  assert.match(link, /rel="noopener noreferrer"/);
  assert.match(link, /data-track="automotive_agmc_article_click"/);
  assert.match(link, /class="auto-link"/);
  assert.match(link, /<span[^>]*aria-hidden="true"[^>]*>\{bmw\.article\.arrow\}<\/span>/, "the arrow is drawn apart and hidden from screen readers");
  // It is the only link in the section, and it comes after the summit line.
  assert.equal([...markup.matchAll(/<a\b/g)].length, 1);
  assert.ok(markup.indexOf("bmw.also") < markup.indexOf("bmw.article.href"), "the link follows the summit line");
  // The only absolute address on the page is that article's.
  const addresses = strings.filter((text) => /^https?:\/\//.test(text));
  assert.deepEqual(addresses, [bmw.article.href]);
});

test("client labelling stays accurate", () => {
  const { hero, bmw, exterior } = automotive;
  const joined = visible.join(" ");
  // AGMC is named as the activation partner and the article's publisher, in the BMW section only.
  for (const text of strings.filter((value) => /AGMC/.test(value) && !/^https?:/.test(value))) {
    assert.ok([bmw.body[0], bmw.article.label].includes(text), `AGMC is named outside the BMW section: ${text}`);
  }
  assert.match(bmw.body[0], /AGMC's activation at Binance Blockchain Week 2025/);
  // The Rolls-Royce Spirit of Ecstasy is the subject of a private commission, never a client.
  assert.equal(exterior.eyebrow, "PRIVATE COMMISSION / EXTERIOR MURAL");
  assert.match(exterior.body[0], /^For this private commission, we painted/);
  const naming = visible.filter((text) => /rolls|spirit of ecstasy/i.test(text));
  assert.deepEqual(naming, [exterior.title, exterior.body[0]], "the marque is named only as the mural's subject");
  assert.ok(!/(?:official|authori[sz]ed|sponsor|partner(?:ed)?\b|commissioned by|client)/i.test(exterior.body.join(" ") + exterior.title), "the exterior copy implies no client");
  assert.ok(!/(?:official|authori[sz]ed|commissioned by|for rolls|for ferrari|ferrari commission)/i.test(joined), "no text implies a marque is the client");
  // Ferrari is the subject of the opening picture only (its description for screen readers), never named as a client.
  for (const text of strings.filter((value) => /ferrari/i.test(value))) {
    assert.ok(!/commission|official|for ferrari|client/i.test(text), `implies a Ferrari commission: ${text}`);
  }
  assert.ok(!/ferrari/i.test(visible.join(" ")), "no visible text names Ferrari");
  assert.match(hero.alt, /Ferrari mural/);
});

test("section 03 is about automotive realism, not about one artwork: one text, no captions, room for more pieces", () => {
  const { realism } = automotive;
  assert.equal(realism.headline, "THE DETAILS CAR PEOPLE NOTICE.");
  const markup = read("src/components/automotive/Realism.astro");
  // No figure is captioned and no template names a picture: the section's text speaks for the section.
  assert.ok(!/<figcaption/.test(markup), "no artwork in this section is captioned");
  assert.ok(!/porsche|workshop|mural/i.test(markup.replace(/\/\*[\s\S]*?\*\//g, "")), "the template names no particular artwork");
  assert.ok(!/porsche|workshop/i.test([realism.eyebrow, realism.headline, ...realism.body].join(" ")), "the section's own text names no particular artwork");
  // The artworks come from a list, so another realistic piece is one more entry, not a new template.
  assert.match(markup, /realism\.art\.map/);
  assert.match(markup, /<figure class=\{`auto-real-item auto-real-item--\$\{piece\.place\}`\}/);
  assert.ok(Array.isArray(realism.art) && realism.art.length >= 2);
  const roles = ["lead", "tall", "side", "aside"];
  for (const piece of realism.art) {
    assert.deepEqual(Object.keys(piece).sort(), ["alt", "place", "slot"], "an artwork is a slot, a place and a description for screen readers");
    assert.ok(automotive.automotiveSlots.includes(piece.slot), `${piece.slot} is a real slot`);
    assert.ok(roles.includes(piece.place), `${piece.place} is a role the stylesheet places`);
  }
  // Every role is placed by the stylesheet (on a phone, in the layout grid), and the wide piece at every size.
  for (const role of roles) {
    const rules = [...css.matchAll(new RegExp(`\\.auto-real-item--${role}\\s*\\{([^}]*)\\}`, "g"))].map((match) => match[1]);
    assert.ok(rules.some((rule) => /grid-column/.test(rule)), `.auto-real-item--${role} is placed in the stylesheet`);
  }
  const lead = [...css.matchAll(/\.auto-real-item--lead\s*\{([^}]*)\}/g)].map((match) => match[1]);
  assert.ok(lead.length >= 3, "the wide piece is set for phones, tablets and screens");
  // The media-density pass: four pieces (the supplied Ferrari picture first, then the workshop clip, the portrait and the moved process clip).
  // Reading order = row order on screens = tab order of the two clips on every size: the wide still, the process clip, the workshop clip, the portrait.
  assert.deepEqual(realism.art.map((piece) => piece.slot), ["FERRARI_REALISM", "CANVAS_PROCESS", "WORKSHOP_MURAL_MAIN", "PORSCHE_PORTRAIT"]);
  assert.deepEqual(realism.art.map((piece) => piece.place), ["lead", "aside", "tall", "side"]);
  assert.equal(automotive.automotiveSlots.length, 14);
});

test("what we do is one picture that supports the whole section: no clip, no per-offer image, nothing added to the copy", async () => {
  const markup = read("src/components/automotive/WhatWeDo.astro");
  // One frame for the section, set apart from the four offers (which are plain text).
  assert.equal([...markup.matchAll(/<AutoMedia/g)].length, 1, "one picture for the whole section");
  assert.match(markup, /mediaSlot="WHAT_WE_DO_MAIN"/);
  const list = markup.match(/<ul class="auto-wwd-list"[\s\S]*?<\/ul>/)?.[0] ?? "";
  assert.ok(list && !/AutoMedia|<img|<picture|<svg|<video/.test(list), "no offer has its own picture or icon");
  // The video that stood here moved to the realism wall: the slot is a still now, and its old clip is gone.
  assert.ok(!clips.includes("what-we-do-main.mp4"), "the clip left the offers section");
  assert.ok(clips.includes("canvas-process.mp4"), "the clip is the realism wall's process clip");
  // The picture is the supplied portrait photograph, kept as supplied (744x1280).
  const picture = stills.find((file) => file.startsWith("what-we-do-main"));
  assert.ok(picture, "the picture of the section exists");
  const { width, height } = await sharp(`src/assets/automotive/${picture}`).metadata();
  assert.equal(`${width}x${height}`, "744x1280");
  // The pass adds no wording: the visible copy is still exactly the approved copy (see the test above).
  assert.ok(automotive.whatWeDo.alt.length > 20);
});

test("the realism wall shows the supplied Ferrari picture and the moved clip, and does not repeat the opening picture", async () => {
  const { realism } = automotive;
  const slots = realism.art.map((piece) => piece.slot);
  for (const slot of ["FERRARI_REALISM", "CANVAS_PROCESS", "WORKSHOP_MURAL_MAIN", "PORSCHE_PORTRAIT"]) assert.ok(slots.includes(slot), `${slot} is on the wall`);
  // Two clips (the workshop and the moved process clip) and two stills (the supplied Ferrari picture and the portrait).
  const stems = (list) => list.map((slot) => automotive.slotStem(slot));
  for (const stem of stems(["WORKSHOP_MURAL_MAIN", "CANVAS_PROCESS"])) assert.ok(clips.includes(`${stem}.mp4`), `${stem}.mp4 is a clip`);
  for (const stem of stems(["FERRARI_REALISM", "PORSCHE_PORTRAIT"])) assert.ok(!clips.includes(`${stem}.mp4`), `${stem} is a still`);
  // The Ferrari picture is its own file, cut apart from the opening picture (not the hero's crop and not the hero's file).
  const own = await sharp("src/assets/automotive/ferrari-realism.jpg").metadata();
  const hero = await sharp("src/assets/automotive/automotive-hero.jpg").metadata();
  assert.ok(Math.abs(own.width / own.height - hero.width / hero.height) > 0.2, "a different cut from the opening picture");
  assert.ok(!/ferrari-realism|FERRARI_REALISM/.test(read("src/components/automotive/Hero.astro")), "the opening picture does not use it");
  assert.ok(!/AUTOMOTIVE_HERO/.test(read("src/components/automotive/Realism.astro")), "the wall does not reuse the opening picture");
  // The poster of the moved clip shows the painting, not the pencil sketch: it is the clip's own 9:16 frame.
  const poster = await sharp("src/assets/automotive/canvas-process.jpg").metadata();
  assert.equal(`${poster.width}x${poster.height}`, "720x1280");
  // The wall is one row of four on screens (about as tall as the old two pieces), and recomposed, not stacked, on phones.
  assert.match(css, /\.auto-real-wall\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap/, "tablets wrap the wall into two rows");
  assert.match(css, /@media \(min-width: 1024px\) \{\s*\.auto-real-wall \{[^}]*flex-wrap:\s*nowrap/, "screens keep the four pieces in one row");
  assert.match(css, /\.auto-real-wall\s*\{\s*display:\s*contents;/, "on phones the pieces are items of the layout grid");
  assert.match(css, /\.auto-real-item--aside\s*\{[^}]*grid-column:\s*2;[^}]*grid-row:\s*2;/, "on phones the process clip stands beside the lead line");
  assert.match(css, /\.auto-real-item--lead\s*\{[^}]*margin-inline:\s*calc\(var\(--gutter\) \* -1\)/, "the wide piece runs edge to edge on phones");
  // In a row each piece takes a share equal to its own proportion, which is what makes the heights match.
  assert.match(css, /\.auto-real-item\s*\{[^}]*flex:\s*var\(--r-art\) 1 0/);
});

test("the about section reuses the homepage's studio clip by address: one file, no copy, a poster of its own", async () => {
  const { studio } = await import("../src/content/studio.ts");
  const { about } = automotive;
  const lib = read("src/lib/automotive-media.ts");
  // The very source the homepage section reads (src/content/studio.ts, drawn by StudioMoment.astro), not a path written twice.
  assert.match(lib, /import \{ studio \} from "@\/content\/studio"/);
  assert.match(lib, /sharedClips[\s\S]*STUDIO_AT_WORK:\s*studio\.media\.video/);
  assert.match(read("src/components/home/StudioMoment.astro"), /video=\{studio\.media\.video\}/, "the homepage still plays it");
  assert.equal(studio.media.video, "/videos/impact-murals-studio.mp4");
  assert.ok(statSync(`public${studio.media.video}`).size > 0, "the shared file exists");
  // It was not duplicated into this page's folder, and the homepage's file was not touched.
  assert.ok(!clips.includes("studio-at-work.mp4") && !clips.some((file) => /studio/.test(file)), "no second copy of the clip");
  assert.match(read("src/components/OfferMedia.astro"), /data-autoplay-video/, "the homepage's own player is unchanged");
  // Its poster is a file of this page (the homepage's is only 400x225), at the clip's native 16:9.
  const poster = await sharp("src/assets/automotive/studio-at-work.jpg").metadata();
  assert.equal(`${poster.width}x${poster.height}`, "1280x720");
  // It sits inside the existing section, beside the approved words, as a muted deferred clip like the others, with no caption.
  const markup = read("src/components/automotive/About.astro");
  assert.match(markup, /mediaSlot="STUDIO_AT_WORK"/);
  assert.ok(!/<figcaption|<figure/.test(markup), "no caption or project block around the clip");
  assert.ok(about.alt.length > 20 && !/finance/i.test(about.alt), "the description names no client");
  assert.deepEqual([...about.body], approved.about.body, "the approved copy is untouched");
  assert.ok(markup.indexOf("auto-about-head") < markup.indexOf("auto-about-media") && markup.indexOf("auto-about-media") < markup.indexOf("auto-about-copy"), "heading, clip, words");
});

test("every picture on the page has alt text that describes it, and only the opening picture is eager", () => {
  const { hero, whatWeDo, realism, bmw, exterior, launch, about } = automotive;
  const alts = [
    hero.alt, whatWeDo.alt, ...realism.art.map((piece) => piece.alt), bmw.alt, bmw.detailAlt,
    exterior.alt, exterior.beforeAlt, launch.jetour.alt, launch.icaur.alt, about.alt
  ];
  // One description per picture; the phone crop of the opening picture is the same picture and shares its description.
  assert.equal(alts.length, automotive.automotiveSlots.length - 1, "one description per picture");
  assert.equal(new Set(alts).size, alts.length, "each description is its own");
  for (const alt of alts) {
    assert.ok(alt.length >= 20, `alt text too thin to describe a picture: ${alt}`);
    assert.ok(!/^(image|photo|picture|video) of/i.test(alt), `alt text should not announce itself: ${alt}`);
  }
  // Eager loading is for the opening picture alone (the LCP element); everything else is lazy.
  for (const file of components) {
    const text = read(`src/components/automotive/${file}`);
    const eager = [...text.matchAll(/loading="eager"/g)];
    assert.equal(eager.length, file === "Hero.astro" ? 1 : 0, `${file} sets loading="eager" ${eager.length} times`);
    assert.equal([...text.matchAll(/fetchpriority="high"/g)].length, file === "Hero.astro" ? 1 : 0, `${file} sets a fetch priority`);
  }
  assert.ok(!/\beager\b/.test(read("src/components/automotive/AutoMedia.astro").replace(/\/\*[\s\S]*?\*\//g, "")), "AutoMedia has no eager mode: every frame it draws is lazy");
});

test("the opening picture is the Ferrari mural: wide for screens, a squarer crop for phones, one request each", () => {
  const hero = read("src/components/automotive/Hero.astro");
  assert.match(hero, /resolveMedia\("AUTOMOTIVE_HERO"\)/);
  assert.match(hero, /resolveMedia\("AUTOMOTIVE_HERO_MOBILE"\)/);
  // Art direction by media query, with the real dimensions on both so nothing shifts.
  assert.match(hero, /<picture[\s\S]*<source[\s\S]*media="\(max-width: 767px\)"[\s\S]*<\/picture>/);
  assert.match(hero, /<source[\s\S]*width=\{narrow\.image\.width\}[\s\S]*height=\{narrow\.image\.height\}/);
  assert.match(hero, /<img[\s\S]*width=\{wide\.image\.width\}[\s\S]*height=\{wide\.image\.height\}/);
  // The picture fills the screen on large displays, with the type over it.
  assert.match(css, /\.auto-hero-art\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0/);
  // The approved hero is the campaign line, the secondary title and the intro: no credit line sits over the artwork.
  assert.ok(!/hero\.credit|auto-hero-credit/.test(hero), "the old credit line is gone");
});

test("every slot is the brief's identifier or a documented addition, is documented, and is only ever a prop or a data attribute", () => {
  const slots = automotive.automotiveSlots;
  assert.equal(new Set(slots).size, slots.length, "duplicate slot");
  for (const id of slots) assert.ok([...briefSlots, ...addedSlots].includes(id), `${id} is not a brief or documented slot`);
  for (const id of [...briefSlots, ...addedSlots]) assert.ok(slots.includes(id), `${id} is missing`);

  assert.equal(automotive.slotStem("BMW_BINANCE_MAIN"), "bmw-binance-main");
  assert.equal(automotive.slotStem("AUTOMOTIVE_HERO"), "automotive-hero");

  const docs = read("docs/AUTOMOTIVE-MEDIA.md");
  for (const id of slots) assert.ok(docs.includes(id), `${id} is not documented in docs/AUTOMOTIVE-MEDIA.md`);

  // An identifier may only appear as a media slot, never inside text a visitor could read.
  for (const file of components) {
    const text = read(`src/components/automotive/${file}`);
    for (const match of text.matchAll(/\b[A-Z]+(?:_[A-Z0-9]+)+\b/g)) {
      const before = text.slice(Math.max(0, match.index - 17), match.index);
      assert.match(before, /(mediaSlot="|resolveMedia\("|data-media-slot=")$/, `${file} mentions ${match[0]} outside a slot prop`);
    }
    assert.ok(!/to be added|placeholder/i.test(text), `${file} renders placeholder wording`);
  }
});

test("every slot is backed by a real file, and there is no placeholder logic left", () => {
  const names = new Set(stills.map((file) => file.replace(/\.[^.]+$/, "")));
  for (const id of automotive.automotiveSlots) {
    assert.ok(names.has(automotive.slotStem(id)), `${id} has no image in src/assets/automotive`);
  }
  // A still with no slot is an unused asset left in the project.
  for (const name of names) {
    assert.ok(automotive.automotiveSlots.some((id) => automotive.slotStem(id) === name), `${name} is not a slot`);
  }
  // A clip needs its still (poster and reduced-motion picture) and must belong to a slot.
  for (const clip of clips) {
    const stem = clip.replace(/\.mp4$/, "");
    assert.ok(names.has(stem), `${clip} has no poster image of the same name`);
    assert.ok(automotive.automotiveSlots.some((id) => automotive.slotStem(id) === stem), `${clip} is not a slot`);
  }

  const media = read("src/components/automotive/AutoMedia.astro");
  assert.ok(!/auto-plate|\btone=|data-media-state="plate"/.test(media + css + components.map((file) => read(`src/components/automotive/${file}`)).join("")), "no placeholder plates remain");
  const lib = read("src/lib/automotive-media.ts");
  assert.match(lib, /throw new Error/, "a slot with no image must fail the build, not render a hole");
});

test("the supplied files are web-ready: modest masters, faststart H.264 clips with no audio", async () => {
  for (const file of stills) {
    const { width, height } = await sharp(`src/assets/automotive/${file}`).metadata();
    assert.ok(Math.max(width, height) <= 2000, `${file} is ${width}x${height}: keep masters at 2000 px or less`);
    assert.ok(statSync(`src/assets/automotive/${file}`).size <= 800 * 1024, `${file} is over 800 KB`);
  }
  // The two crops of the opening picture are the same wall: one wide, one squarer.
  const wide = await sharp("src/assets/automotive/automotive-hero.jpg").metadata();
  const narrow = await sharp("src/assets/automotive/automotive-hero-mobile.jpg").metadata();
  assert.ok(wide.width / wide.height > 1.5, "the screen crop of the opening picture is wide");
  assert.ok(narrow.width / narrow.height < 1.2, "the phone crop of the opening picture is square or taller");
  assert.ok(clips.length >= 1);
  for (const clip of clips) {
    const bytes = readFileSync(`public/videos/automotive/${clip}`);
    assert.ok(bytes.length <= 3 * 1024 * 1024, `${clip} is over 3 MB: re-export it`);
    // Top-level boxes: the index (moov) must come before the data (mdat) so playback starts at once.
    const boxes = [];
    for (let at = 0; at + 8 <= bytes.length; ) {
      const size = bytes.readUInt32BE(at);
      boxes.push(bytes.toString("latin1", at + 4, at + 8));
      if (size < 8) break;
      at += size;
    }
    assert.ok(boxes.indexOf("moov") !== -1 && boxes.indexOf("moov") < boxes.indexOf("mdat"), `${clip} is not faststart (boxes: ${boxes.join(",")})`);
    const text = bytes.toString("latin1");
    assert.ok(text.includes("avc1"), `${clip} is not H.264: Chrome, Firefox and Edge do not play HEVC reliably`);
    assert.ok(!text.includes("mp4a"), `${clip} carries an audio track: the page is silent by design`);
  }
});

test("the offers are a plain scannable list, each with its own paragraphs, not a features grid", () => {
  const offers = read("src/components/automotive/WhatWeDo.astro");
  assert.ok(!/<svg|grid-cols-/.test(offers), "no icons and no utility grid of cards");
  assert.match(offers, /<ul class="auto-wwd-list"/);
  assert.match(offers, /whatWeDo\.offers\.map[\s\S]*auto-wwd-item/);
  assert.match(offers, /offer\.body\.map/, "an offer's paragraphs each get their own line of text");
  const item = css.match(/\.auto-wwd-item\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.ok(!/radius|shadow|background/.test(item), "an offer is a ruled line, not a card");
});

test("the artwork leads: titles stay modest, and the longer approved headlines are set at project-title size", () => {
  // The brief: artwork was overshadowed by oversized type. Section titles are capped; only the opening title may be large.
  assert.ok(maxRem(".auto-title-lg") <= 4.5, "section titles stay at 4.5rem or less");
  assert.ok(maxRem(".auto-title-md") <= 3.6, "project titles stay at 3.6rem or less");
  assert.ok(maxRem(".auto-title-sm") <= 2.3, "captions stay at 2.3rem or less");
  // A long headline is a project title (md), not a section title (lg), so a longer sentence never outsizes the work.
  for (const [file, headline] of [
    ["Realism.astro", "realism.headline"],
    ["Bmw.astro", "bmw.title"],
    ["Exterior.astro", "exterior.title"],
    ["Launch.astro", "launch.headline"]
  ]) {
    const source = read(`src/components/automotive/${file}`);
    assert.match(source, new RegExp(`class="headline-display auto-title-md">\\{${headline.replace(".", "\\.")}\\}`), `${file} sets its headline at project-title size`);
  }
  // Every media section that sizes a portrait frame from its column sets its own height cap, so nothing is taller than the screen allows.
  // (The realism wall is the exception: its pieces share one row whose height is the row's width divided by the pieces' proportions.)
  for (const selector of [".auto-wwd-media", ".auto-bmw-stage", ".auto-exterior-layout", ".auto-launch-layout"]) {
    assert.ok(new RegExp(`${selector.replaceAll(".", "\\.")}\\s*\\{[^}]*--cap:`).test(css), `${selector} sets a height cap`);
  }
});

test("the exterior wall is the dominant frame; the before is smaller with a one-word label, and the title and text are their own grid items", () => {
  const exterior = read("src/components/automotive/Exterior.astro");
  assert.match(exterior, /mediaSlot="EXTERIOR_MURAL_MAIN"/);
  assert.match(exterior, /<figure class="auto-exterior-before"[\s\S]*mediaSlot="EXTERIOR_MURAL_BEFORE"[\s\S]*<figcaption/);
  // The title and the three paragraphs are their own grid items, so a phone can put the wall between them.
  assert.match(exterior, /<h2 id="auto-exterior-title"[^>]*auto-exterior-title/);
  assert.match(exterior, /<div class="auto-exterior-text"[\s\S]*exterior\.body\.map/);
  // The wall's own proportions size its column; the before is held to a fraction of it.
  assert.match(css, /grid-template-columns:\s*min\(52vw, calc\(var\(--cap\) \* var\(--r-main/);
  assert.match(css, /\.auto-exterior-before\s*\{[^}]*width:\s*min\(100%, 24rem\)/);
});

test("the launch pair is one section: two clips on one baseline at the same height, each named and described", () => {
  const launch = read("src/components/automotive/Launch.astro");
  assert.match(launch, /class="auto-launch-pair"[\s\S]*--ra:[\s\S]*--rb:/);
  assert.match(launch, /mediaSlot="JETOUR_LAUNCH"/);
  assert.match(launch, /mediaSlot="ICAUR_LAUNCH"/);
  assert.match(launch, /<figcaption>\s*<h3[^>]*>\{launch\.jetour\.name\}<\/h3>\s*<p[^>]*><Tight text=\{launch\.jetour\.body\} \/><\/p>/);
  assert.match(launch, /<figcaption>\s*<h3[^>]*auto-title--mixed[^>]*>\{launch\.icaur\.name\}<\/h3>\s*<p[^>]*><Tight text=\{launch\.icaur\.body\} \/><\/p>/);
  // Each clip takes a share of the row equal to its own proportion, which is what equalises the heights.
  assert.match(css, /\.auto-launch-a\s*\{[^}]*flex:\s*var\(--ra/);
  assert.match(css, /\.auto-launch-b\s*\{[^}]*flex:\s*var\(--rb/);
});

test("longer approved text never clips: the exterior's title and \"before\" stack in their own rows, long words break last, the hero's top row wraps", () => {
  // From tablets up the title, the "before" and the text are separate rows, so none can sit over another.
  const tablet = css.match(/@media \(min-width: 768px\) \{\s*\.auto-exterior-layout \{([^}]*)\}/)?.[1] ?? "";
  assert.match(tablet, /grid-template-rows:\s*auto 1fr auto/, "title, then the before, then the text");
  assert.match(css, /\.auto-exterior-before\s*\{[^}]*grid-column:\s*9 \/ span 4;\s*grid-row:\s*2;/, "the before has its own row from tablets up");
  assert.match(css, /\.auto-exterior-text\s*\{[^}]*grid-column:\s*1 \/ -1;\s*grid-row:\s*3;[^}]*columns:\s*2/, "under the pair, in two columns, on tablets and small laptops");
  // Beside the wall only where the screen is wide and tall enough for the text not to outrun the wall.
  assert.match(css, /@media \(min-width: 1280px\) and \(min-height: 760px\)/);
  // A long word breaks inside itself as a last resort (`anywhere` also stops it widening a grid column).
  const titles = css.match(/\.auto-title-hero,[\s\S]*?\.auto-step-name\s*\{([^}]*)\}/g)?.find((block) => /overflow-wrap/.test(block)) ?? "";
  assert.match(titles, /overflow-wrap:\s*anywhere/);
  for (const selector of [".auto-title-hero", ".auto-title-lg", ".auto-title-md", ".auto-title-sm", ".auto-wwd-name", ".auto-step-name"]) {
    assert.ok(titles.includes(selector), `${selector} may break a long word`);
  }
  // The jump link drops under the mark instead of being clipped when the text is large.
  assert.match(css, /\.auto-hero-top\s*\{[^}]*flex-wrap:\s*wrap/);
});

test("CSS content is always empty, so no text can hide in a stylesheet", () => {
  const contents = [...css.matchAll(/(?<![\w-])content:\s*([^;]+);/g)].map((match) => match[1].trim());
  assert.ok(contents.length > 0);
  for (const value of contents) assert.equal(value, '""', `CSS content must be empty, found ${value}`);
});

test("the design stays restrained: no cards, no snapping, nothing pinned", () => {
  for (const banned of [/border-radius/, /box-shadow/, /scroll-snap/, /position:\s*(?:sticky|fixed)/, /backdrop-filter/]) {
    assert.ok(!banned.test(css), `automotive.css must not use ${banned}`);
  }
  // Full-height is for the opening only (the one grid that holds the hero).
  let withoutHero = css;
  for (const block of css.match(/\.auto-hero-layout\s*\{[^}]*\}/g) ?? []) withoutHero = withoutHero.replace(block, "");
  assert.ok(!/(?<![\d.])100(?:s|d|l)?vh/.test(withoutHero), "only the opening may be full height");

  const motion = read("src/lib/automotive-motion.ts");
  const motionCode = motion.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.ok(!/\bpin\b|snap|scrub/.test(motionCode), "no pinning, snapping or scrubbed scroll motion");
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.ok(
    motion.indexOf("prefers-reduced-motion") < motion.indexOf("gsap.from"),
    "reduced motion is checked before any reveal is created"
  );
});

test("a clip is muted, inline, looped, deferred and never in the markup as a source", () => {
  const media = read("src/components/automotive/AutoMedia.astro");
  const video = media.match(/<video[\s\S]*?<\/video>/)?.[0] ?? "";
  assert.ok(video, "AutoMedia draws a <video>");
  for (const attribute of ["muted", "loop", "playsinline", 'preload="none"', "data-auto-video", "data-src={video.src}", 'aria-hidden="true"', "disablepictureinpicture"]) {
    assert.ok(video.includes(attribute), `AutoMedia video lacks ${attribute}`);
  }
  assert.ok(!/\bautoplay\b|<source|\ssrc=/.test(video), "no autoplay attribute and no src in the markup: the script attaches it");
  assert.ok(!/\bposter=/.test(video), "the poster is a real responsive image under the clip, not a second request");
  // The poster is a real image carrying the alt text, lazy always (the opening picture is not a clip).
  assert.match(media, /class="auto-poster"/);
  assert.match(media, /loading="lazy"/);
  // The pause / play control exists, hidden until the script takes over.
  assert.match(media, /<button[\s\S]*?hidden[\s\S]*?data-video-toggle/);
  assert.match(media, /Pause video/);
});

test("playback is deferred, capped, paused when away, and off for reduced motion and saved data", () => {
  const script = read("src/lib/automotive-video.ts");
  const code = script.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.match(code, /prefers-reduced-motion: reduce/);
  assert.match(code, /saveData/);
  assert.match(code, /IntersectionObserver/);
  assert.match(code, /visibilitychange/);
  assert.match(code, /\.pause\(\)/);
  assert.match(code, /rootMargin: LOAD_AHEAD/);
  assert.match(code, /wide\.matches \? 2 : 1/, "two clips at once on large screens, one elsewhere");
  assert.match(code, /\(slow-2g\|2g\|3g\)/, "no clips on 3G or slower");
  assert.match(code, /error[\s\S]*?retried[\s\S]*?failed = true/, "an error is retried once, then the poster stays");
  assert.match(code, /pageshow/, "clips resume after the back/forward cache");
  // Nothing is observed (so nothing is fetched) before the visitor goes below the opening screen.
  for (const event of ["scroll", "wheel", "touchstart", "keydown", "pointerdown"]) assert.ok(code.includes(`"${event}"`), `waits for ${event}`);
  // Reduced motion is decided before any observer exists.
  assert.ok(code.indexOf("reduced.matches") < code.indexOf("new IntersectionObserver"));
  assert.match(page, /initAutomotiveVideo\(document\)/);
  // The shared autoplay helper is not used for these clips.
  assert.ok(!/media-autoplay/.test(read("src/components/automotive/AutoMedia.astro")));
});

test("the build check no longer exempts any page from the orphan rule", () => {
  const script = read("scripts/validate-content.mjs");
  assert.ok(!/OUTREACH_ROUTES|exemptOutreach/.test(script));
  assert.match(script, /orphan\. No path of links reaches it from the homepage/);
});

test("the hero reads the campaign line first: one H1 with both lines, the statement far larger than the secondary title", () => {
  const hero = read("src/components/automotive/Hero.astro");
  // One heading holds the campaign line and then the discipline words, so the H1 keeps the page's own keywords.
  assert.equal([...hero.matchAll(/<h1\b/g)].length, 1);
  const h1 = hero.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? "";
  assert.ok(h1.includes("hero.statementLines") && h1.includes("hero.headlineLines"), "the heading draws both lines");
  assert.ok(h1.indexOf("hero.statementLines") < h1.indexOf("hero.headlineLines"), "the campaign line comes first");
  assert.match(h1, /class="[^"]*auto-hero-statement[^"]*"/);
  assert.match(h1, /class="[^"]*auto-hero-sub[^"]*"/);
  assert.ok(!/auto-eyebrow/.test(hero), "the campaign line is no longer a small label");
  // The two block lines are separated by a real space, so the heading reads "ART FOR CAR LOVERS." (not "ART FORCAR LOVERS.") to assistive technology and search engines.
  assert.match(h1, /hero\.statementLines\.map\(\(line, index\)[\s\S]*index < hero\.statementLines\.length - 1 && " "/);
  // It is set in two lines at every width, and it is the largest type on the page.
  assert.match(css, /\.auto-hero-statement \.auto-line\s*\{[^}]*display:\s*block/, "two lines at every width");
  const sizes = (selector) =>
    [...css.matchAll(new RegExp(`(?:^|\\n)\\s*${selector.replaceAll(".", "\\.")}\\s*\\{([^}]*)\\}`, "g"))]
      .map((match) => match[1].match(/font-size:\s*clamp\([^,]+,[^,]+,\s*([\d.]+)rem\)/)?.[1])
      .filter(Boolean)
      .map(Number);
  const statement = sizes(".auto-hero-statement");
  const secondary = sizes(".auto-hero-sub");
  assert.equal(statement.length, 3, "the campaign line is sized for phones, tablets and screens");
  assert.equal(secondary.length, 3, "and so is the secondary title");
  statement.forEach((size, step) => assert.ok(size >= secondary[step] * 2.5, `step ${step}: ${size}rem is not clearly larger than ${secondary[step]}rem`));
  assert.ok(Math.max(...statement) > maxRem(".auto-title-lg"), "the campaign line is larger than any section title");
  // On a phone the size follows the width between the page margins, so "CAR LOVERS." never reaches the screen edge.
  assert.match(css, /\.auto-hero-statement\s*\{[^}]*calc\(\(100vw - 2 \* var\(--gutter\)\) \/ [\d.]+\)/);
});

test("the brand strip is five trimmed logos in the owner's order: no heading, link, caption, card or carousel, and on the first screen", async () => {
  const { brands } = automotive;
  assert.deepEqual(brands.items.map((brand) => brand.id), ["bmw-group", "majid-al-futtaim", "louis-vuitton", "jetour", "icaur"]);
  assert.equal(new Set(brands.items.map((brand) => brand.alt)).size, brands.items.length, "each logo has its own name for screen readers");
  const markup = read("src/components/automotive/Brands.astro");
  const body = markup.replace(/^---[\s\S]*?---/, "").replace(/<!--[\s\S]*?-->/g, "");
  assert.ok(!/<h[1-6]|<a\b|<svg|<video|<figcaption|<p\b|<button/.test(body), "the marks are the whole strip: no heading, link, caption or text");
  assert.match(body, /<ul class="auto-brands-list" role="list">/);
  assert.match(body, /alt=\{brand\.alt\}/);
  assert.match(body, /loading="lazy"/);
  assert.ok(!/loading="eager"/.test(body), "only the opening picture is eager");
  // The files are the supplied marks: white on a transparent ground, trimmed to the ink (so a height is the mark's own height) and light.
  for (const { id } of brands.items) {
    const path = `src/assets/automotive-brands/${id}.webp`;
    assert.ok(statSync(path).size <= 25 * 1024, `${id} is over 25 KB`);
    const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alpha = (x, y) => data[(y * info.width + x) * 4 + 3];
    let top = false;
    let bottom = false;
    let left = false;
    let right = false;
    for (let x = 0; x < info.width; x++) {
      top ||= alpha(x, 0) > 6;
      bottom ||= alpha(x, info.height - 1) > 6;
    }
    for (let y = 0; y < info.height; y++) {
      left ||= alpha(0, y) > 6;
      right ||= alpha(info.width - 1, y) > 6;
    }
    assert.ok(top && bottom && left && right, `${id} is trimmed to its ink: the mark touches all four edges`);
    for (let at = 0; at < data.length; at += 4) {
      if (data[at + 3] > 200) assert.ok(data[at] >= 250 && data[at + 1] >= 250 && data[at + 2] >= 250, `${id} is white where it is opaque`);
    }
    // Each mark is sized on its own (never one common height), by a `--h` the stylesheet sets for it.
    assert.match(css, new RegExp(`\\.auto-brand--${id}\\s*\\{[^}]*--h:\\s*[\\d.]+px`), `${id} has its own size, in px: a mark does not grow with the default text size`);
  }
  // No card, box, rule, shadow or filter around a mark; nothing moves.
  const marks = [...css.matchAll(/(?:^|\n)\.auto-brand(?: img)?\s*\{([^}]*)\}/g)].map((match) => match[1]).join("\n");
  assert.ok(marks.length > 50 && !/background|border|padding|shadow|radius|filter|animation|transition/.test(marks), "a mark has no box around it");
  const stripCss = css.slice(css.indexOf("/* ----------------------------------------------------------------- brands */"), css.indexOf("/* ------------------------------------------------------------ what we do */"));
  assert.ok(stripCss.length > 500 && !/overflow-x|scroll|@keyframes|animation/.test(stripCss), "no carousel and nothing that moves");
  // Phones: three and two, never one row of five; tablets and screens: one row.
  assert.match(css, /\.auto-brands-list\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(3, auto\)/);
  assert.match(css, /@media \(min-width: 768px\) \{\s*\.auto-brands-list \{[^}]*display:\s*flex;[^}]*justify-content:\s*space-between/);
  // On screens the opening gives up the strip's height, so the strip is on the first screen.
  assert.match(css, /--brands-h:\s*[\d.]+px/);
  assert.match(css, /\.auto-hero-layout\s*\{[^}]*min-height:\s*max\(34rem, min\(calc\(100svh - var\(--brands-h\)\), 62rem\)\)/);
  assert.match(css, /\.auto-brands\s*\{[^}]*min-height:\s*var\(--brands-h\)/);
});

test("the investment note is the owner's words directly before How we work: a ruled editorial note, not a pricing card", () => {
  const { investment } = automotive;
  assert.equal(investment.figure, "AED 8,000\u201325,000+");
  assert.ok(!/\u2014/.test(Object.values(investment).join(" ")), "no em dash: the range uses an en dash");
  assert.match(investment.deposit, /typically 50%\.$/);
  // Directly before How we work, after About, with nothing between the note and the process.
  const note = page.indexOf("<Investment />");
  const process = page.indexOf("<Process />");
  assert.ok(page.indexOf("<About />") < note && note < process);
  assert.equal(page.slice(note + "<Investment />".length, process).trim(), "", "the note is immediately before How we work");
  const markup = read("src/components/automotive/Investment.astro");
  const body = markup.replace(/^---[\s\S]*?---/, "").replace(/<!--[\s\S]*?-->/g, "");
  assert.ok(!/<a\b|<button|<form|<ul|<ol|<li\b|<table|<svg|<img|<picture/.test(body), "no tier, feature list, button, link or picture");
  // The figure is the section's heading, in two parts (a small currency and the large range); the sentences are paragraphs.
  assert.match(body, /<h2 id="auto-invest-title"[^>]*>[\s\S]*auto-invest-unit[\s\S]*auto-invest-amount[\s\S]*<\/h2>/);
  assert.equal([...body.matchAll(/<p\b/g)].length, 3, "the explanation, the defined-budget sentence and the deposit");
  const section = css.slice(css.indexOf("/* ------------------------------------------------------------- investment */"), css.indexOf("/* ---------------------------------------------------------------- process */"));
  assert.ok(section.length > 500);
  assert.ok(!/gradient|box-shadow|border-radius|background-image/.test(section), "no gradient, shadow or card");
  assert.ok(!/\.auto-invest\s*\{[^}]*background/.test(section), "the note sits on the page's own paper");
  // The figure is the anchor and the deposit is the quietest line of the note.
  const rems = (pattern) => [...section.matchAll(pattern)].map((match) => Number(match[1]));
  const figure = rems(/\.auto-invest-figure\s*\{[^}]*font-size:\s*clamp\([^,]+,[^,]+,\s*([\d.]+)rem\)/g);
  const deposit = rems(/\.auto-invest-deposit\s*\{[^}]*font-size:\s*([\d.]+)rem/g);
  assert.ok(figure.length >= 3 && Math.max(...figure) > maxRem(".auto-title-lg"), "the figure is larger than a section title");
  assert.ok(deposit.length >= 2 && Math.max(...deposit) <= 1, "the deposit is set at body size or smaller, under the explanation");
  assert.match(section, /\.auto-invest-unit\s*\{[^}]*font-size:\s*0\.\d+em/, "the currency is smaller than the figure");
});
