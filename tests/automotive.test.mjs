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
    eyebrow: "ART FOR CAR LOVERS.",
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
const technicalKeys = new Set(["alt", "detailAlt", "beforeAlt", "href", "slot", "place"]);
const visible = [];
(function collectVisible(value, key = "") {
  if (typeof value === "string") {
    if (!technicalKeys.has(key)) visible.push(flat(value));
  } else if (Array.isArray(value)) {
    if (key === "headlineLines") visible.push(flat(value.join(" ")));
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
 * Added for the supplied material: the deck's tall picture beside the offers, the
 * wall before the exterior mural, the Porsche portrait, and the phone crop of the
 * opening picture (the same artwork, cut for a phone).
 */
const addedSlots = ["WHAT_WE_DO_MAIN", "EXTERIOR_MURAL_BEFORE", "PORSCHE_PORTRAIT", "AUTOMOTIVE_HERO_MOBILE"];

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

test("the outreach page is not in the route registry or any sitemap", async () => {
  assert.ok(!(await sitemapRoutes()).some((path) => path.startsWith("/automotive")));
  assert.ok(!(await buildRoutes()).some((route) => route.path.startsWith("/automotive")));
});

test("the page template asks for noindex and drops the site chrome", () => {
  assert.match(page, /<BaseLayout[\s\S]*\bnoindex\b[\s\S]*\bminimal\b[\s\S]*>/);
  const layout = read("src/layouts/BaseLayout.astro");
  assert.match(layout, /\{!minimal && <Header \/>\}/);
  assert.match(layout, /\{!minimal && <Footer \/>\}/);
});

test("the sections run in the approved copy's order, with no budget, range, Ferrari or workshop section", () => {
  const order = ["Hero", "WhatWeDo", "Realism", "Bmw", "Exterior", "Launch", "About", "Process", "ContactCta"];
  const positions = order.map((name) => page.indexOf(`<${name} />`));
  positions.forEach((position, index) => assert.ok(position >= 0, `<${order[index]} /> is missing from the page`));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, "sections are out of order");
  // No component may exist without being on the page (no obsolete leftovers).
  const used = new Set([...order, "AutoMedia", "Tight"]);
  for (const file of components) assert.ok(used.has(file.replace(".astro", "")), `${file} is not part of the page`);
  // The Ferrari is the opening picture, not a section of its own further down; there is no standalone range,
  // no workshop / portraits section, no photoreal-only section and no project budgets section.
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
  assert.equal(hero.eyebrow, approved.hero.eyebrow);
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
    "Hero.astro": ["hero.eyebrow", "hero.headlineLines", "hero.intro", "hero.jump"],
    "WhatWeDo.astro": ["whatWeDo.headline", "whatWeDo.intro", "whatWeDo.offers", "offer.title", "offer.body"],
    "Realism.astro": ["realism.eyebrow", "realism.headline", "realism.body[0]", "realism.body[1]", "realism.art"],
    "Bmw.astro": ["bmw.eyebrow", "bmw.title", "bmw.body[0]", "bmw.body[1]", "bmw.also", "bmw.article.label", "bmw.article.arrow", "bmw.article.href"],
    "Exterior.astro": ["exterior.eyebrow", "exterior.title", "exterior.body", "exterior.beforeLabel"],
    "Launch.astro": ["launch.eyebrow", "launch.headline", "launch.jetour.name", "launch.jetour.body", "launch.icaur.name", "launch.icaur.body"],
    "About.astro": ["about.headline", "about.body"],
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
  for (const file of ["Hero", "WhatWeDo", "Realism", "Bmw", "Exterior", "Launch", "About", "Process", "ContactCta"]) {
    const source = read(`src/components/automotive/${file}.astro`);
    assert.match(source, /import Tight from "\.\/Tight\.astro"/, `${file} imports Tight`);
    assert.ok(!/<p[^>]*class="[^"]*auto-(?:lead|body|hero-intro)[^"]*"[^>]*>\{[^}]*\}<\/p>/.test(source), `${file} draws a paragraph without Tight`);
  }
  assert.match(css, /\.auto-tight\s*\{[^}]*white-space:\s*nowrap/);
});

test("no obsolete copy remains: no workshop heading, no budget section, no old pricing, no range", () => {
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
  // Budget is mentioned in one place, the proposal step; no price, range or currency is stated anywhere.
  const budget = visible.filter((text) => /budget/i.test(text));
  assert.deepEqual(budget, [approved.process.steps[1].body], "budget is mentioned only in the proposal step");
  assert.ok(!/\b(?:AED|USD|EUR|price|prices|pricing|investment)\b|\d,\d{3}|\$\d/i.test(joined), "no pricing is stated in any text");
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
  for (const piece of realism.art) {
    assert.deepEqual(Object.keys(piece).sort(), ["alt", "place", "slot"], "an artwork is a slot, a place and a description for screen readers");
    assert.ok(automotive.automotiveSlots.includes(piece.slot), `${piece.slot} is a real slot`);
    assert.ok(["lead", "side"].includes(piece.place));
  }
  // Placed by role in the stylesheet, at every breakpoint.
  for (const role of ["lead", "side"]) {
    const rules = [...css.matchAll(new RegExp(`\\.auto-real-item--${role}\\s*\\{([^}]*)\\}`, "g"))].map((match) => match[1]);
    assert.ok(rules.length >= 3, `.auto-real-item--${role} is placed at phone, tablet and screen sizes`);
  }
  // The pictures themselves are unchanged by the copy pass: the same two pieces, in the same slots.
  assert.deepEqual(realism.art.map((piece) => piece.slot), ["WORKSHOP_MURAL_MAIN", "PORSCHE_PORTRAIT"]);
  assert.equal(automotive.automotiveSlots.length, 11);
});

test("every picture on the page has alt text that describes it, and only the opening picture is eager", () => {
  const { hero, whatWeDo, realism, bmw, exterior, launch } = automotive;
  const alts = [
    hero.alt, whatWeDo.alt, ...realism.art.map((piece) => piece.alt), bmw.alt, bmw.detailAlt,
    exterior.alt, exterior.beforeAlt, launch.jetour.alt, launch.icaur.alt
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
  // The approved hero is the eyebrow, the headline and the intro: no credit line sits over the artwork.
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
  // Every media section sets its own height cap on a portrait frame, so nothing is taller than the screen allows.
  for (const selector of [".auto-wwd-media", ".auto-real-item--lead", ".auto-bmw-stage", ".auto-exterior-layout", ".auto-launch-layout"]) {
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

test("the build check exempts only the explicit, noindex outreach page", () => {
  const script = read("scripts/validate-content.mjs");
  assert.match(script, /OUTREACH_ROUTES = new Set\(\["\/automotive"\]\)/);
  assert.match(script, /outreach page is unlinked by design, so it must be noindex/);
  assert.match(script, /orphan\. No path of links reaches it from the homepage/);
});
