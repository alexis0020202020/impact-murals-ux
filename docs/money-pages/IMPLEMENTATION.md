# Impact Murals · Money Pages: Implementation

**Built:** 14 October 2026, on branch `claude/funny-pascal-r0cn99`. **Nothing is published.** No deploy, no merge, no pull request, no redirect, no sitemap change, no Search Console action. With the launch switch off (what every production build does) the site's output is byte for byte what it was before this work (section 9).

The nine pages specified in `00` to `09` of this folder are built and reviewable: eight new routes and the strengthened Public Art page. One of them, Corporate Art Workshops, is provisional and is held out of any launch behind its own gate.

---

## 1. Run and preview

All commands need `CONTENT_SOURCE=fixtures` locally (the site reads its articles from Airtable otherwise).

| Goal | Command |
|---|---|
| Review the pages while editing | `CONTENT_SOURCE=fixtures npm run dev` then open `http://localhost:4321/live-painting-dubai/` and the other routes below. `astro dev` is always a preview. The footer has a "Preview / unpublished pages" row listing all eight new pages. |
| Build as a review site | `MONEY_PAGES=preview CONTENT_SOURCE=fixtures npm run build`, then `npm run preview`. A Netlify deploy preview or branch deploy does this by itself (`CONTEXT`). |
| Build as production does today | `CONTENT_SOURCE=fixtures npm run build` (no flag). The pages do not exist in this build. |
| Rehearse a launch | `MONEY_PAGES=live CONTENT_SOURCE=fixtures npm run build`. Ignored on Netlify, so an environment variable can never publish anything. It fails while any slot has no picture (section 6). |
| Where every picture stands | `npm run money:media` (`-- --strict` exits 1 while a placeholder remains, `-- --json` for a machine-readable list) |
| Tests and types | `npm test` (155 tests, 34 of them in `tests/money-pages.test.mjs`), `npm run check` |

## 2. Switches and gates

Every decision that publishes something is a constant in a commit, never an environment variable on Netlify.

| Switch | Where | Now | What it controls |
|---|---|---|---|
| `MONEY_LIVE` | `src/content/money/launch.ts` | `false` | The launch itself: indexable, in the sitemap, linked from the offer pages, no preview strip. |
| `WORKSHOP_GATE_CLEARED` | `launch.ts` | `false` | A live build does not generate the Workshops page at all (no URL, no sitemap entry, no link) until the studio confirms the five operational facts in `09`. |
| `INVESTMENT_NOTE_APPROVED` | `launch.ts` | `false` | Whether the typical-investment note (the owner's Automotive wording) appears on three pages in a live build. Preview shows it, tagged provisional. |
| `moneyConversion.formConnected` | `src/content/money/shared.ts` | `false` | While false every primary call to action opens WhatsApp with the service and the first useful questions already written, and the quiet second route is email. Flip only after a controlled test shows real receipt, truthful confirmation and failure recovery. |
| `gatedRoutes["/mural-artist-dubai/"].deployed` | `src/content/money/links.ts` | `false` | Links to Mural Artist (a page the Strategy Master recorded as a 404) are written as plain text until it exists. |
| `consolidatedRoutes[...].redirected` | `links.ts` | all `false` | `large-scale-murals`, `facade-artwork` and `site-specific-artworks` are merged into Public Art by a later 301. Until it is live they are real pages and Public Art links them (else each is an orphan and the build refuses). Switch to `true` in the same commit as the redirect: the links become plain text. |

The build also **refuses a hole**: in a live build a slot that resolves to a placeholder throws, naming the file to add (`Money pages: PA_PREP has no image. Add src/assets/money/pa-prep.jpg ...`).

## 3. Routes

**New (preview and live only; absent from a production build until launch):**

| Route | Page | Notes |
|---|---|---|
| `/live-painting-dubai/` | Live Painting | consolidates `/what-we-do/art-for-brands/live-painting` later |
| `/corporate-artwork-dubai/` | Corporate Artwork | |
| `/custom-canvas-art-dubai/` | Custom Canvas | consolidates `commissioned-paintings` later |
| `/hotel-artwork-dubai/` | Hotel Artwork | |
| `/live-customisation-dubai/` | Live Customisation | consolidates `product-customisation` later |
| `/art-installations-dubai/` | Art Installations | |
| `/art-for-interior-designers-dubai/` | Designers & Architects | |
| `/corporate-art-workshops-dubai/` | Corporate Art Workshops | **provisional**: preview only until `WORKSHOP_GATE_CLEARED` |

All eight carry `noindex, follow`, are outside the sitemap and use a trailing-slash canonical until launch (`routes.ts`); at launch seven are indexable and listed.

**Modified:**

- `/what-we-do/public-art/`: the strengthened page replaces the existing template in preview and live. Its canonical, address and indexation are the existing page's own (it stays indexed throughout). A production build before launch keeps the current page exactly.
- `/what-we-do/art-for-brands/` and `/what-we-do/art-for-places/`: a "DUBAI SERVICES" list under the formats, in the page's own list style (`MoneyRelated.astro`). These are the inbound links that keep each launched page out of the orphan check. Preview and live only.
- The footer: a "Preview / unpublished pages" row, preview only.

## 4. Files

**Existing files changed (five, all gated):** `astro.config.mjs` (registers the integration), `package.json` (one script, `money:media`; dependencies and lockfile untouched), `src/components/Footer.astro` (preview row), `src/lib/routes.ts` (spreads the money route entries, empty when off), `src/pages/what-we-do/[slug].astro` (steps aside for the strengthened Public Art when the pages are on; carries `MoneyRelated`). Nothing in `src/lib/automotive-video.ts` or any Automotive file changed.

**New:**

- `src/integrations/money-pages.mjs`: injects the routes only when the pages are on. `src/money/[money].astro` (dispatcher for the eight pages) and `src/money/public-art.astro` live **outside** `src/pages` on purpose: a file in `src/pages` is always bundled, with its stylesheets and scripts attached to pages, which changes a production build even when a flag keeps it from rendering.
- `src/content/money/`: `pages.ts` (registry), `launch.ts` (switches), `routes.ts`, `shared.ts`, `links.ts`, `types.ts`, `media.ts` (the slot manifest) and one copy module per page (`live-painting.ts`, `corporate-artwork.ts`, `custom-canvas.ts`, `hotel-artwork.ts`, `live-customisation.ts`, `art-installations.ts`, `designers.ts`, `public-art.ts`, `corporate-workshops.ts`).
- `src/components/money/`: the shared kit (`Section`, `Media`, `Cta`, `Closing`, `Faq`, `Guides`, `Paths`, `Rows`, `Ledger`, `Track`, `Milestones`, `Factors`, `Link`, `Tight`, `WallLabel`, `InvestmentNote`, `PreviewBar`, `JsonLd`, `MoneyBody`, `MoneyRelated`), `pages/` (nine page compositions) and `diagrams/` (twenty-eight illustrative drawings and the small generator behind the Workshops mosaic, each drawing labelled "illustrative" wherever it appears).
- `src/styles/money/`: `base.css` (the shared vocabulary) and one stylesheet per page.
- `src/lib/money-links.ts`, `money-media.ts`, `money-video.ts` (a deliberate copy of the Automotive clip playback, so the Automotive module stays untouched: fold the two together at launch).
- `src/assets/money/`: fifteen stills (section 6).
- `scripts/money-media-report.mjs`, `tests/money-pages.test.mjs`.

## 5. The nine pages

| Page | Organising idea | Hero | What carries it | Open points |
|---|---|---|---|---|
| Live Painting | A run sheet: first marks to reveal | Dark triptych of three vertical clips | Real Automotive clips and stills; setup plan; timeline; vehicle proof in the owner's approved wording | 2 placeholders (`LP_PREP`, `LP_SETUP_WIDE` with a drawing); investment note |
| Corporate Artwork | The floor plan, zone by zone | Light, one tall framed photograph | Plan strip, phasing, schedule drawings; delivery sequence | 2 placeholders (protection, clean-down); hero is a mural at an automotive workshop, captioned as exactly that; investment note |
| Custom Canvas | Gallery wall labels | Pale paper, a tall canvas and its label | Real canvas, a brush detail, five stills from pencil to finish; elevations with a figure for scale | 1 placeholder (`CC_EDGE`); investment note |
| Hotel Artwork | The guest's route | Warm stone paper, a section drawing | Route drawing, six stops, scale ladder, responsibility ledger, two programme tracks | 1 placeholder (`HT_SAMPLES`, with a drawing); no hotel proof exists |
| Live Customisation | The station: artist, object, guest | Dark, a drawn station | Station scene and plan, guest flow with the waiting drawn as a band, a tested menu | 2 placeholders (`LC_MATERIALS` with a drawing, `LC_STATION`); no customisation imagery exists |
| Art Installations | The specification sheet | Dark drawing sheet with a title block | Six buildability checkpoints, a real responsibility table, time bars | No spatial work is documented: direction and coordination only are claimed |
| Designers & Architects | Send and receive | Light, a plan beside a plate | Two specimen documents, a sign-off swimlane (a real table), a three-part fee | No design-team partnership is claimed |
| Public Art (strengthened) | The site dossier | Dark split, the wall at full height, its "before" lapping the corner | Access diagram, approval map (real text), programme bar, a wall label for the one real wall | 1 placeholder (`PA_PREP`); the wall is a private commission, labelled so |
| Corporate Art Workshops (**provisional**) | Many hands, one work | Light, a mosaic that paints in tile by tile | Output glyphs, session flow, room layout, end-result sequence: all illustrations | Nothing real exists; 1 placeholder (`WS_FACILITATION`, with a drawing); "selected sessions" omitted |

Four dark heroes (Live Painting, Live Customisation, Art Installations, Public Art) and five light ones. Each page has its own organising device and diagram family; all keep the animated fragmented logo (the site header), the Automotive typographic rules and the same closing block.

## 6. Media

`npm run money:media` is the source of truth. A slot resolves in this order: its own file `src/assets/money/<stem>.jpg` (and an optional clip `public/videos/money/<stem>.mp4`), an Automotive asset it reuses, a drawing or nothing where the manifest allows it, otherwise a placeholder. **To replace anything, add the file; the layout is already built for the proportion.**

At the last run: 46 slots: 15 own stills, 15 reusing an Automotive asset, 4 drawn, 2 omitted, 10 placeholders.

**Placeholders (a live build refuses these):** `LP_PREP`, `LP_SETUP_WIDE`, `CA_PROTECT`, `CA_CLEAN_DOWN`, `CC_EDGE`, `HT_SAMPLES`, `LC_MATERIALS`, `LC_STATION`, `PA_PREP`, and `WS_FACILITATION` (only if the workshops gate clears). Four of them (`LP_SETUP_WIDE`, `HT_SAMPLES`, `LC_MATERIALS`, `WS_FACILITATION`) show a labelled illustration inside the frame until the file arrives; the tag "Asset to come / essential" stays.

**Own stills:** fifteen frames and crops taken from real material already on the site (the Automotive page's clips and stills): `lp-first-marks`, `lp-the-build`, `lp-proof-jetour`, `lp-proof-icaur`, `ca-brief-detail`, `ca-in-progress`, `cc-detail`, `cc-step-*` (five), `ht-plate`, `pa-scaffold`, `pa-painted`. No picture was created or altered to show something the studio did not do. Permission and credit are unrecorded for all of it (see 8).

**Reused Automotive assets (15):** the three live reels and the reveal on Live Painting; the hero of Corporate Artwork (`WORKSHOP_MURAL_MAIN`), Custom Canvas (`PORSCHE_PORTRAIT`, `CANVAS_PROCESS` clip), the plate of Designers (`AUTOMOTIVE_HERO`); the scaffold image on Art Installations and the wall and its "before" on Public Art (`EXTERIOR_MURAL_MAIN` and `_BEFORE`); the three range frames on Public Art. Each carries a caption that says what it is. None is presented as proof of unrelated experience: no automotive work stands in for a hotel, a workplace, an installation or a workshop.

**Drawn stand-ins and omissions (the Workshops page only):** `WS_HERO_PIECE`, `WS_OUT_TILES`, `WS_OUT_ASSEMBLED`, `WS_OUT_WALL` are illustrations that give way to a real picture the moment a file exists (tested with temporary stand-in files, since removed). `WS_HERO_GROUP` and `WS_SETUP` are additions: absent until a real picture exists.

## 7. Provisional decisions (recorded, none is a blocker)

1. **Three-state launch switch** (off / preview / live) plus a separate workshop gate and a separate investment-note approval, so launching never decides these by accident.
2. **WhatsApp first, email second** on every call to action while the form is not connected; the page pins email as the quiet route on Designers and Public Art (documents travel by email).
3. **Investment note on three pages only** (Live Painting, Corporate Artwork, Custom Canvas): the owner's own range from the Automotive page (AED 8,000 to 25,000+, 50% deposit), verbatim, tagged provisional in preview, left out of a live build until approved. Every other page explains fee factors and says projects are scoped individually: no price is invented.
4. **The Automotive assets are reused with truthful captions**, never as proof of a different job.
5. **Public Art keeps linking the three pages that a later 301 will merge into it**, because they exist and leaving them out would orphan them. The links turn to plain text with one flag.
6. **The Workshops page is excluded from a live build** (not merely noindexed) until its gate is cleared, as the specification says: "hold the page out of the sitemap and out of navigation".
7. **Inbound links** are one list per offer page ("DUBAI SERVICES"), in the offer page's own style, only when the pages are on.
8. **The shared clip playback is a copy** (`money-video.ts`), to keep the Automotive module and production output untouched.
9. **Small text in the stone grey is one shade darker on the soft surface** inside the money pages (4.2:1 became 5.1:1); the shared stylesheet is untouched.
10. **Titles over 60 characters** (Live Painting 62, Custom Canvas 62, Live Customisation 64) are the specification's own; not shortened.
11. **New pages use trailing-slash canonicals** as the specification says (the site's existing pages do not): see section 10.
12. **Two inaccuracies in the specification were corrected, not copied:** the Designers page has eight dependencies, not nine; the `STUDIO_AT_WORK` clip does not show a team on a large wall, so Public Art does not use it as scale proof.
13. **No Event, Product, Offer, Review, FAQ or Video structured data**; each page carries WebPage, Service (provider Organization, areaServed Dubai and the UAE) and BreadcrumbList.
14. **Phones get the call to action before the supporting paragraph** on Custom Canvas and Public Art, so it is on the first screen (the DOM order is unchanged).

## 8. Facts that still need the owner's confirmation

The full per-page table is in `README.md`, section 5.1; it still applies. Added by the build:

- **Reused real work.** Recognisable people and marques appear in work the pages now show in new contexts (a painted portrait on Custom Canvas, a Rolls-Royce mural on Public Art, BMW, Jetour, iCAUR and a Ferrari mural). Confirm that showing each as studio work, on these pages and with these captions, is cleared; confirm artist credit, medium and size for each (`README.md`, 5.3).
- **Public Art wall label.** It says the wall is a large-scale interpretation of the Rolls-Royce Spirit of Ecstasy, painted on the exterior of a building, a private commission, "the marque is the subject, not a client". Confirm the wording and that the client allows it.
- **Live Customisation negatives.** The page says machine printing, laser engraving and hot foil are not offered. Confirm.
- **Process promises.** Protection of floors and surfaces, testing before a menu is promised, "revisions are a scope term", evening and weekend work "where the building allows it", sample and model-room pieces for hotels, sign-off gates for design teams. Each is the specification's wording; confirm each is how the studio actually works.
- **Art Installations** claims direction and coordination only. Confirm the coordination model and whether any fabrication is in house (the copy under-claims on purpose).
- **Contact data** in every closing block is the site's own (`global.contact`): WhatsApp number and email.
- **Workshops:** the five-item gate in `09`.

## 9. Verification

| Check | Result |
|---|---|
| `npm test` | **PASS**, 155 of 155 (34 new). They pin the launch switch and the gates, the route entries in each state, the dispatcher and the offer template, the em-dash and link rules over every page's copy, every internal link against the real routes, the call-to-action logic in both states, the media manifest, the Tailwind-safe class names and the deterministic Workshops mosaic. |
| `npm run check` (`astro check`, 203 files) | **PASS**: 0 errors, 0 warnings, 14 hints (two pre-existing in `[capability].astro` and `enquiry.js`; the rest are the deprecated `register` in the test files). |
| Production build, switch off | **PASS**: 29 pages, validator "No problems found". **Output identical to the pre-money baseline** (built from the specification commit `9775e31`): all 166 files byte for byte; the only difference is `deploy-proof.json`, whose `manifestHash` changes on every build of identical code. |
| Preview build | **PASS**: 37 pages, all reachable from the homepage, sitemap unchanged at 28 URLs with 9 pages noindex and excluded, validator "No problems found". |
| Live build, rehearsed | **PASS with the placeholders filled by temporary stand-in files (since removed):** 36 pages (the workshops page is held out), sitemap 35 URLs (the 28 existing plus the seven new pages), every page reachable, validator "No problems found". **Without them it fails**, as designed, naming the missing slot. |
| Rendering | Every page at 1440 by 900 and 390 by 844, full length; first screens compared side by side. No horizontal overflow and no console error (the only failed requests are the browser aborting paused video loads, as on `/automotive`). |
| Width sweep | Twelve widths from 320 to 1920 on all nine pages: **0 elements cut off** after one fix (the tablet approval map on Public Art). |
| Call to action on the first screen | Above the fold on all nine at 390 by 844 and 1440 by 900. At 1280 by 720 all but Corporate Artwork (by 19 px) and Hotel Artwork; at 360 by 740 six pages are below it. |
| Copy | No em dash anywhere (text, alt, aria, meta), no repeated FAQ question across the 77 questions, no placeholder text, unique titles and descriptions. |
| Links | 29 internal links resolve (HTTP 200 in the dev server); all 52 distinct guide and insight links are in the 809-record intent register; the one external link (AGMC) is the Automotive page's own. |
| Structure | One H1 per page, no skipped heading level, every image has alt text, no duplicate id, every `aria-labelledby` resolves, `rel="noopener"` on every `_blank`, `lang="en"`. |
| Progressive enhancement | On all nine pages: with `prefers-reduced-motion` no clip is attached, nothing is left transparent and the Workshops mosaic does not animate; with JavaScript off nothing is left invisible. |
| Weight (preview build, compressed) | HTML 15 to 21 kB, CSS 26 kB (Public Art 19 kB), JavaScript 2 kB per page; no clip is fetched before the visitor nears it. Smallest first-screen image candidates 5 to 35 kB. |
| Structured data | WebPage, Service, BreadcrumbList on every page; valid JSON. |
| Contrast | Computed for the colour pairs the pages use (normal text). Stone on the soft surface was 4.17:1 and is now 5.07:1 inside the money pages. Two small signal-red numerals are decorative ordinals read by assistive technology as list order (3.6:1). |

**BLOCKED, not done, never marked as passed:** an automated accessibility audit (axe, pa11y) and Lighthouse (none is installed and the dependencies are not to change); Safari, Firefox and a real phone (Chromium only); a screen reader; print styles; the original Money Pages Master Context (never supplied).

**To re-verify that a production build is unchanged:** in a clean worktree of commit `9775e31` and in this branch, run `CONTENT_SOURCE=fixtures npm run build`, hash every file under `dist`, and compare, ignoring `dist/deploy-proof.json`. Two things would break it: a new import of a money component, stylesheet or script from an existing template, or a class name in any file of the project that Tailwind knows as a utility (it reads every file; `tests/money-pages.test.mjs` guards both).

## 10. Technical issues that genuinely remain

1. **The enquiry form is not connected** (`global.enquiry.mode` is `preview`, no privacy notice URL). Every call to action is WhatsApp or email until a controlled test passes (section 2).
2. **Inline styles under a report-only CSP.** The pages set layout custom properties with `style` attributes, as `/automotive` already does, and the site ships `Content-Security-Policy-Report-Only` with `style-src 'self'`. `netlify.toml` already records the open question. Moving the policy to enforcing needs a decision for all of these pages together.
3. **Canonical convention.** New pages use the trailing-slash form (what Netlify serves and the specification asks for); the existing pages and sitemap entries do not. Align the whole site in one decision, not page by page.
4. **`money-video.ts` duplicates the Automotive clip module** on purpose (section 7). Fold them at launch and re-run the identity check afterwards.
5. **A rehearsed live build needs temporary files for the ten placeholders**, since it refuses holes. There is no switch to bypass this, deliberately.
6. **Real-device and cross-browser testing is outstanding** (section 9).

## 11. Before publication

### MUST FIX

1. Answer the confirmation table in `README.md` 5.1 and the additions in section 8; none of the pages' factual claims has been confirmed by the studio.
2. Replace the ten placeholders (section 6) with real pictures, and confirm permission and credit for every reused or extracted image. A live build cannot succeed until the first nine exist.
3. Connect and test the enquiry form, or confirm that WhatsApp and email are the official first routes, then set `moneyConversion.formConnected` accordingly.
4. Decide `INVESTMENT_NOTE_APPROVED` (publish the Automotive range on three pages, or not).
5. Confirm or fix the Mural Artist page (`/mural-artist-dubai/`, recorded as a 404) before any link to it is switched on.
6. Plan the redirects and the consolidation order (`README.md` 5.4) and, when they are executed, switch the matching `consolidatedRoutes` flags in the same commit. Nothing was redirected.
7. Clear the workshops gate (five facts and one documented pilot) before `WORKSHOP_GATE_CLEARED` is set; until then the page stays out of any live build.
8. Review the whole system together in a deploy preview, then set `MONEY_LIVE = true` in a deliberate commit.

### SHOULD REVIEW

1. The three titles over 60 characters; whether to keep the specification's wording.
2. The trailing-slash convention (section 10.3).
3. The CSP question for inline styles (10.2).
4. Hero images reused across pages (the `iCAUR` pictures on Live Painting and Public Art; the exterior mural on Public Art and Art Installations): fine for review, thin once the real material arrives.
5. The Workshops illustrations (mosaic, glyphs, flow, layout, scene): decide whether any should stay once real photographs exist.
6. The "DUBAI SERVICES" list on the two offer pages and its wording.
7. The decision on the non-corporate audiences of the existing Creative Workshops page before it is consolidated (`README.md` 5.5).
8. Safari, Firefox, a real phone, a screen reader, and an automated accessibility and Lighthouse pass.

### OPTIONAL refinements

1. Fold `money-video.ts` into `automotive-video.ts` after launch.
2. Wire the `data-track` hooks (present on every call to action) to the analytics the studio chooses.
3. Add the "selected sessions", "selected applications" and "selected collaborations" modules, which the specification makes conditional on a permitted real example.
4. A taller crop of the tiny-screen drawings (the Live Customisation test sheet is small on a phone).
5. Visual regression tests, if the project ever adds a browser test dependency.

## 12. Launch order

1. Review in a Netlify deploy preview of this branch (no flag needed).
2. Clear the MUST FIX list above.
3. In one commit: `MONEY_LIVE = true`, the matching switches (`INVESTMENT_NOTE_APPROVED`, `moneyConversion.formConnected`, `gatedRoutes`), and the pictures.
4. Build with the production content source: the validator, the sitemap (seven new pages) and the reachability check must pass.
5. Only then submit to Search Console, and only then plan the redirects, destination first, one hop each.
