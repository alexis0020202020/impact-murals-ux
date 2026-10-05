# UX review log: at least 15 real cycles

Status on delivery of this pack: 15/15 minimum cycles COMPLETE, plus a supplementary independent-audit addendum. `npm run check` (0 errors) and `npm test` (89/89) both green after all changes. See cycles below.

Each cycle means: inspect the current result, identify a specific issue or confirm a strength, change what warrants changing, then verify the resulting state. Different perspectives are useful; duplicate notes are not separate evidence.

A change is not mandatory when the current result is strong. In that case explain what was checked and why it should remain. A blocked check is not a completed validation. Do not invent findings, screenshots or elapsed time.

The themes below cover the required breadth; reorder them when useful. Repeat affected checks after later changes. Cycle 15 is a minimum, not a stop instruction while significant in-scope defects remain.

| Cycle | Suggested focus | Status |
| --- | --- | --- |
| 01 | First arrival, proposition, logo and first actionable screen | DONE |
| 02 | Home rhythm, three-offer orientation and repetition | DONE |
| 03 | Brand/marketing lead arriving directly on Art for Brands | DONE |
| 04 | Interior designer/architect arriving on Art for Places | DONE |
| 05 | Public art/site delivery and approved-direction lead | DONE |
| 06 | Smaller mural, uncertain category and early-idea lead | DONE |
| 07 | What We Do, navigation, footer and alternate entry paths | DONE |
| 08 | Work/Studio credibility without case-study requirements | DONE |
| 09 | Enquiry preview: all offers, unsure path, validation and back | DONE |
| 10 | Small mobile widths, wraps, spacing and image treatment | DONE |
| 11 | Large mobile, tablet and short laptop viewports | DONE |
| 12 | Keyboard, focus, menu states, touch and readability | DONE |
| 13 | Motion, reduced motion, stable CTAs and runtime behaviour | DONE |
| 14 | Automatic article/guide layouts, related links and long content | DONE |
| 15 | Full regression and coherent identity across all page families | DONE |

## Entry template

### Cycle NN: short name

- Current pages and viewports:
- Perspective/task:
- Evidence inspected:
- Observation:
- Change made, or reason to preserve:
- Verification actually performed after the change:
- Outcome: PASS / NEEDS WORK / BLOCKED
- Evidence path or command result:
- Impact on other pages and required rechecks:
- Remaining issue and next action:

Store browser captures under `docs/ux-evidence/` when available. Use meaningful names including page, viewport and cycle. Do not include personal data or secrets.

## Cycles performed

### Cycle 01: First arrival, logo and first actionable screen

- Current pages and viewports: Home (`/`), desktop 1920x900, 1280x720 (short laptop), mobile 390x844 and 360x800, via chrome-devtools MCP (real Chromium, CDP screenshots).
- Perspective/task: Cold-email or search visitor landing on Home; can they understand the offer and reach the CTA without scrolling?
- Evidence inspected: Full-viewport and full-page screenshots before and after the change; DOM/computed-style inspection of the hero section's flex layout.
- Observation: The fragmented logo (`HeroLogo`, capped at `max-w-[1180px]`) combined with a `mt-auto` push and `pt-[11vh]` gap meant that at 1920x900 and 1280x720 **only the logo was visible on load** — headline, supporting copy and the primary CTA were entirely below the fold. On mobile (390x844), the opposite defect appeared: the section forced `min-h-[calc(100svh-3.5rem)]` while the logo was small, so `mt-auto` stretched a ~470px dead gap between the logo and the headline. Both directly contradict UX-BRIEF.md section 4: "the logo must coexist with a legible proposition and accessible CTA" and "do not make visitors wait for the animation before they can understand or act."
- Change made: [Hero.astro](src/components/home/Hero.astro) — reduced the logo's desktop cap (`max-w-[1180px]` → `max-w-[720px]`, width steps `88/82/72/68vw` → `76/62/50/44vw`), tightened the pre-headline gap (`pt-14 md:pt-[11vh]` → `mt-14 pt-8 md:mt-auto md:pt-[3vh]`, mobile now uses a fixed margin instead of `mt-auto`), removed the forced `min-h-[calc(100svh-3.5rem)]` on mobile (kept only at `md:`), and trimmed section/notation-row padding slightly. Logo stays prominent and keeps its full fragment-reassembly animation; only its footprint changed.
- Verification actually performed: Re-screenshotted the same four viewports after the change via chrome-devtools MCP. Desktop 1920x900 and 1280x720 now show the full 3-line headline, supporting copy, primary CTA and secondary link on first paint. Mobile 390x844 and 360x800 show the entire hero (logo through the "ARTIST-LED / UAE" notation row) with no dead gap.
- Outcome: PASS.
- Evidence: screenshots taken in-session via chrome-devtools MCP (not persisted to disk; see `docs/ux-evidence/` note below — this pass used live MCP screenshots rather than saved files because no explicit save path was requested. Re-run `npm run dev` and load `/` at the viewports above to reproduce).
- Impact on other pages: Hero.astro is home-only, no other templates import it. PageHeader (used on other pages) is a separate component, unaffected.
- Remaining issue and next action: None outstanding for this cycle. Continue to Cycle 02 (home rhythm below the hero).

### Cycle 02: Home rhythm, three-offer orientation and inter-scene spacing

- Current pages and viewports: Home (`/`), desktop 1440-1920 width, full-page screenshots.
- Perspective/task: Visitor scrolling past the hero into the three offer chapters (Art for Brands / Art for Places / Public Art).
- Evidence inspected: Full-page screenshot; DOM measurement of `.offer-scene` elements and the `offer-scene + offer-scene { margin-top }` rule in [global.css](src/styles/global.css).
- Observation: Each offer scene is a legitimate ~850-1040px "chapter" (heading, image collage, copy) — that pacing is intentional and works well. But scrolling mid-transition between scenes produced a stretch of 300-500px of pure background with no visible content cue (confirmed by scrolling to an exact position between scene 1 and scene 2 and finding the viewport fully empty). Combined with the section's own `pt-24/pt-36` top padding and `mt-20/mt-32` before the first scene, the three-scene section totals roughly 4x viewport height, and the gap-to-content ratio during the empty stretches risks reading as "did the page stop" rather than deliberate rhythm.
- Change made: kept the per-scene composition as-is (it is genuinely strong — collage-style overlapping media, alternating layout per offer, fragment-shape accents). Reduced only the inter-scene gap: `offer-scene + offer-scene { margin-top: clamp(8rem, 17vw, 18rem) }` → `clamp(5rem, 9vw, 9rem)` in [global.css](src/styles/global.css), keeping visible separation between chapters but removing roughly half of the dead-scroll stretch.
- Verification actually performed: Re-screenshotted the full home page and re-measured `.offer-scene` gaps via `getBoundingClientRect`; confirmed the empty stretch between scenes is now under one third of a 900px viewport instead of over half.
- Outcome: PASS.
- Remaining issue and next action: Proceed to Cycle 03 (Art for Brands offer page, brand-manager perspective).

### Cycle 03: Brand-manager lead arriving directly on Art for Brands

- Current pages and viewports: `/what-we-do/art-for-brands`, desktop 1440x900, full-page.
- Perspective/task: A brand/marketing lead who never read Home, landing on this offer page from outreach or search — can they understand the offer, its flexible role and the next action on its own?
- Evidence inspected: Full-page screenshot; source of [\[slug\].astro](src/pages/what-we-do/[slug].astro); cross-referenced against [homepage.ts](src/content/homepage.ts) and [HowWeJoin.astro](src/components/home/HowWeJoin.astro).
- Observation A (content duplication): all three offer pages hardcoded the exact heading and body of the homepage's "BRING US IN EARLY. OR BRING US YOUR DIRECTION." block verbatim, word for word. UX-BRIEF.md section 5 explicitly names this pattern ("the same large generic closing statement") as something to avoid on offer pages. Meanwhile each offer already has a bespoke `firstStep` field in [offers.ts](src/content/offers.ts) (a concrete, offer-specific answer to "how do I start without a finished brief") that was written but never rendered anywhere in the codebase.
- Observation B (rhythm): because this page's `realRelated` and `reading` sections are both legitimately empty right now (no real non-placeholder projects, no published articles tagged to this offer in the dev fallback), the page fell straight from the duplicated dark section into the dark `ProjectCta`, into the dark footer — three consecutive dark blocks with no light relief, contradicting the brief's "purposeful dark moments" (moments, not a wall).
- Change made: [\[slug\].astro](src/pages/what-we-do/[slug].astro) — replaced the hardcoded block with a per-offer `startHeading` (e.g. "SEND THE MOMENT. NOT A FINISHED BRIEF." for Art for Brands, distinct short headlines for the other two) and the offer's own `firstStep` copy; changed that section from `surface-dark` to the page's light surface so the sequence reads light→light→light→light→light(start)→dark(CTA)→dark(footer), i.e. one deliberate dark closing instead of a stacked dark wall. This fix is in the shared `[slug].astro` template, so it applies to all three offer pages.
- Verification actually performed: re-screenshotted `/what-we-do/art-for-brands` full-page after the change; confirmed the offer-specific heading/body render correctly, confirmed light/dark alternation, confirmed no duplicate wording remains against Home.
- Outcome: PASS.
- Impact on other pages and required rechecks: applies to Art for Places and Public Art pages too (shared template) — rechecked in Cycles 04-05 below.
- Remaining issue and next action: Proceed to Cycle 04 (Art for Places, interior-designer perspective).

### Cycle 04: Interior designer/architect arriving on Art for Places

- Current pages and viewports: `/what-we-do/art-for-places`, desktop 1440x900, full-page.
- Perspective/task: An interior designer/architect who needs artwork that respects an already-resolved scheme.
- Evidence inspected: Full-page screenshot after the Cycle 03 template fix.
- Observation: content correctly reassures the designer ("A building, development or interior has a resolved design intent... an off-the-shelf piece would work against the concept"; capabilities "READ THE SPACE / DEVELOP THE ARTWORK / FIT THE REAL SITE"). The Cycle 03 fix now shows offer-specific "SEND THE DRAWINGS. WE BUILD WITHIN THEM." instead of the generic duplicated block, which is a more precise, reassuring instruction for this exact persona. Page rhythm (light throughout, single dark CTA+footer close) confirmed correct here too. The "READ NEXT" section shows a dev-only test fixture ("TEST FIXTURE: scheduled article") — verified this is intentional per [publishing.ts](src/lib/publishing.ts) (`isTestFixture` entries are shown in preview regardless of status/date specifically so templates can be checked without Airtable; they are excluded from production builds). Not a defect; left untouched as directed by the guardrails.
- Change made: none needed beyond the shared Cycle 03 template fix, already verified here.
- Verification actually performed: full-page screenshot inspected against CONTEXT.md's Art for Places description.
- Outcome: PASS.
- Remaining issue and next action: Proceed to Cycle 05 (Public Art, site-delivery perspective).

### Cycle 05: Public art / smaller-project and approved-direction lead

- Current pages and viewports: `/what-we-do/public-art`, desktop 1440x900, full-page.
- Perspective/task: Two personas required by UX-BRIEF.md section 9 — a site owner needing exterior work and confidence in delivery, and someone wanting a smaller mural rather than a full strategy.
- Evidence inspected: Full-page screenshot.
- Observation: capabilities correctly cover access/surface/sequencing ("PLAN FOR THE SITE": "Consider surface, scale, access, sequence and the people required"), and the Cycle 03 fix produced "SEND THE WALL. SIZE IS NOT A BARRIER." for this page specifically, which directly answers the brief's explicit requirement that "smaller projects needing specialist artistic execution should still feel welcome" and that size must not be a qualifying condition. This is a concrete, offer-true statement (drawn straight from the existing `firstStep` copy), not an invented claim.
- Change made: none beyond the shared Cycle 03 fix.
- Verification actually performed: full-page screenshot; confirmed formats list includes "Production of an already approved concept" (serves the "agency with an approved direction" persona) alongside "Urban surface interventions" (serves the smaller-project persona).
- Outcome: PASS.
- Remaining issue and next action: Proceed to Cycle 06 (uncertain/early-idea lead: What We Do routing page).

### Cycle 06: What We Do as a routing page for uncertain/early-idea visitors

- Current pages and viewports: `/what-we-do`, desktop 1440x900, full-page.
- Perspective/task: A visitor with only an early idea, who cannot yet self-classify into one of the three offers.
- Evidence inspected: Full-page screenshot; source of [what-we-do/index.astro](src/pages/what-we-do/index.astro).
- Observation: page framing ("WHAT DO YOU NEED ART TO DO?", "Start with the project rather than the technique") correctly avoids forcing self-classification. Each offer block alternates layout (image-left/right/full-width) so the three do not read as identical cards, each carries its concise summary and a clear "Enter this offer" link, and the whole block is one large click target. The closing dark section explicitly addresses the uncertain visitor: "NOT SURE WHERE THE PROJECT FITS? You do not need to choose a category before speaking to the studio." This matches UX-BRIEF.md section 5 ("Allow uncertainty and overlap") and the persona in section 9 precisely, using existing `ProjectCta` copy rather than a new component.
- Change made: none. This page is already strong and needed no correction.
- Verification actually performed: full-page screenshot reviewed against brief requirements; confirmed no repeated global blocks (audience lists, five-step process) appear here, consistent with the "routing page, not a duplicate homepage" instruction.
- Outcome: PASS (kept as-is).
- Remaining issue and next action: Proceed to Cycle 07 (navigation/footer interactive states).

### Cycle 07: Navigation and footer interactive states

- Current pages and viewports: Home, desktop 1440x900 (What We Do hover/focus dropdown) and mobile 390x844 (hamburger menu), via chrome-devtools MCP keyboard simulation (`press_key` Tab/Escape) and accessibility snapshots.
- Perspective/task: Keyboard-only visitor navigating the header; mobile visitor opening/closing the menu.
- Evidence inspected: Accessibility tree snapshots before/after interaction; `document.activeElement` after each Tab press; computed `inert`/`aria-expanded` state; screenshots.
- Observation A (desktop, strength confirmed): the "What We Do" hover panel in [Header.astro](src/components/Header.astro) uses `group-focus-within`, so tabbing from the "What We Do" link into its offer links correctly reveals the panel with a visible focus ring. No change needed; verified and kept.
- Observation B (mobile, real defect): the closed mobile panel (`#nav-mobile-panel`) was hidden only via `max-height: 0` with `overflow-y: auto`, which does not remove its 6 links from the tab order or the accessibility tree. A keyboard user tabbing past the header landed on 6 invisible, unreachable-looking links (What We Do, the three offers, Work, Studio) with no visible focus indicator anywhere on screen, before ever reaching the hero. This directly fails UX-BRIEF.md's "keyboard access, visible focus and menu dismissal" requirement.
- Change made: [Header.astro](src/components/Header.astro) — added the `inert` attribute to `#nav-mobile-panel` by default and toggled it in `setOpen()` alongside the existing `aria-expanded`/max-height classes, so the closed panel's links are fully removed from focus and the accessibility tree (confirmed via snapshot: the 6 links disappear from the tree when closed, reappear when open). Also added an `Escape` key handler that closes the menu and returns focus to the toggle button, since the brief explicitly requires checking "menu dismissal" and no keyboard-close path existed before (only click-to-toggle and click-a-link).
- Verification actually performed: reloaded and confirmed `panel.hasAttribute('inert')` is `true` when closed (links absent from the a11y snapshot) and `false` when opened via click (links present, screenshot shows the expanded panel with "What We Do" sub-items indented); pressed `Escape` while open and confirmed `inert` returns, `aria-expanded` returns to `"false"`, and focus lands back on the toggle button.
- Outcome: PASS.
- Impact on other pages: Header.astro is shared by every page (via BaseLayout), so this fix applies site-wide with a single change.
- Remaining issue and next action: Proceed to Cycle 08 (Work / Studio credibility pages).

### Cycle 08: Work and Studio credibility, without forced case studies

- Current pages and viewports: `/work`, `/studio`, desktop 1440x900, full-page.
- Perspective/task: does Work establish visual credibility without a Challenge/Strategy/Solution/Results structure or fabricated content? Does Studio establish artistic/human credibility without becoming a second process page?
- Evidence inspected: full-page screenshots; source of [work/index.astro](src/pages/work/index.astro), [projects.ts](src/content/projects.ts), [studio.astro](src/pages/studio.astro).
- Observation (Work, strength confirmed): the placeholder-project guard already works exactly as the guardrails describe. In dev preview, placeholder projects render as non-clickable rhythm visuals labelled by offer title (not the fake "PROJECT 01" title, which would look like an invented case study), with an explicit "Development preview only... without presenting placeholder entries as completed client work" notice. In a production build with no real projects, a distinct honest fallback ("Selected work is being updated... the three offer pages show how the studio approaches...") is shown instead. This is correct and was left untouched.
- Observation (Studio, defect found): the page hardcoded a third verbatim (well, near-verbatim — reworded body, identical heading) copy of "BRING US IN EARLY. OR BRING US YOUR DIRECTION.", the same block already found duplicated on Home and (before Cycle 03) on all three offer pages. On Studio this compounds the brief's explicit instruction "do not turn this into a second process page": the block is about offer flexibility, not studio/artist credibility, so it did not even belong thematically on this page.
- Change made: [studio.astro](src/pages/studio.astro) — replaced the block with Studio-specific content: heading "PROOF IS IN WHAT GETS BUILT." and body about the studio's direction being judged by what survives a real site, plus a "See selected work" link into `/work`. This keeps the light section that separates the two dark sections on the page (avoiding the same dark-stacking problem fixed in Cycle 03), adds a genuine cross-page journey (Studio → Work, supporting credibility) instead of restating a message the visitor already saw on Home, and introduces no new claims (consistent with "do not invent... results").
- Verification actually performed: re-screenshotted `/studio` full-page; confirmed unique copy, confirmed light/dark rhythm (light, light, light, dark, light, dark, dark-footer) reads as deliberate alternation rather than a wall.
- Outcome: PASS.
- Remaining issue and next action: Proceed to Cycle 09 (Enquiry flow: offers, unsure path, validation, back).

### Cycle 09: Enquiry preview - unsure path, validation, back navigation

- Current pages and viewports: `/discuss-a-project`, desktop 1440x900, via chrome-devtools MCP click/fill/snapshot (no real submission at any point; fictitious data only: "Test Visitor" / test@example.invalid).
- Perspective/task: someone with only an early idea starting the enquiry; verify honesty of preview state, validation behaviour, back/edit navigation, flexible contact fields.
- Evidence inspected: accessibility snapshots at each step; screenshots; `list_network_requests` after submission to confirm nothing was actually sent.
- Observation: this flow is already strong and required no changes. Specifically verified: (1) "Something else / not sure yet" correctly skips to a fully-optional step ("Everything on this step is optional", "Nothing to add yet? You can continue as you are."); (2) step transitions move focus to the new step's heading (confirmed via `document.activeElement`), which announces the change to screen reader users; (3) "Change"/"Edit" links let a visitor revise an earlier answer without losing later progress; (4) submitting the contact step empty produces both a live-region error banner (`role=alert`, `aria-live=assertive`) and per-field inline errors, moves focus to the first invalid field, and sets `aria-invalid`/`aria-describedby` correctly; (5) email-or-phone is correctly enforced as "at least one, not both required"; (6) the submit button is honestly labelled "TEST THIS ENQUIRY" with "Preview only. This test will not send or save your details." next to it, never implying a real send; (7) after submitting valid fictitious data the result screen reads "NOTHING WAS SENT. This is a demonstration. No request was sent or saved. Live delivery must be configured before launch."; (8) `list_network_requests` after that submission shows only dev-server GET requests, no POST to Netlify or any endpoint, confirming the preview mode genuinely sent nothing.
- Change made: none. Flagging one non-blocking observation only: the inline field errors from a failed attempt do not live-clear as you correct the field (they only re-evaluate on the next submit attempt). This is a legitimate validate-on-submit pattern, not a defect, and touching it would mean editing the protected `src/lib/enquiry/` module for a cosmetic nicety — left untouched per the guardrails ("preserve validations... field names... transport contracts").
- Verification actually performed: full click-through of the "not sure" path end to end, empty-submit validation check, valid fictitious-data submit, and a network log check.
- Outcome: PASS.
- Remaining issue and next action: Proceed to Cycle 10 (small mobile viewports across the site).

### Cycle 10: Small mobile widths, overflow, and touch targets

- Current pages and viewports: Home, `/what-we-do`, all three offer pages, `/work`, `/studio`, `/discuss-a-project`, at 360x800 (and 390x844 spot checks), via chrome-devtools MCP.
- Perspective/task: a mobile visitor checking the studio after a cold email (brief section 9 persona).
- Tooling note: invoked the installed `frontend-visual-qa` skill (plugin `1.12.0`) for this cycle's audit discipline. Its bundled Playwright-based mechanical sweep script was not run, because this project has no Playwright dependency and both the skill's own instructions ("do not mutate the audited project merely to run the sweep... install a dependency only when authorized") and the project guardrails ("do not install new plugins... introduce a new service") rule out adding one. Instead used chrome-devtools MCP as equivalent Level A/B evidence (real Chromium via CDP, DOM geometry, screenshots) and applied the skill's finding discipline (root-cause before fixing, before/after verification, scope stated per page/viewport).
- Observation A (real bug, found and fixed): `document.documentElement.scrollWidth` exceeded `clientWidth` by 13px on mobile art-for-brands. Root cause traced via `getBoundingClientRect`: the offer header image (`OfferMedia` → `.media-placeholder`, classed `aspect-[4/5] min-h-[440px]`) had no explicit `width`, and a block element combining a pixel `min-height` with `aspect-ratio` without a definite width can have its width *derived from* the min-height through the ratio (440 × 4/5 = 352px measured, exceeding the 320px content column on a 360px viewport) instead of stretching to fill its container — a known CSS `aspect-ratio`/`min-height` interaction. Confirmed the same `min-h-[…px]` + `aspect-[…]` pattern exists in [OfferChapters.astro](src/components/home/OfferChapters.astro) too, so this was a systemic risk, not isolated to one page.
- Change made: [global.css](src/styles/global.css) — added `width: 100%` to the shared `.media-placeholder` and `.media-shell` base classes (the two classes every `OfferMedia` instance site-wide resolves to), which is a no-op everywhere the bug didn't manifest and fixes it everywhere it could.
- Verification actually performed: re-checked `scrollWidth` vs `clientWidth` at 360px on all 8 core routes (`/`, `/what-we-do`, all three offer pages, `/work`, `/studio`, `/discuss-a-project`) after the fix — all report zero overflow.
- Observation B (touch targets): a DOM sweep of every `<a>`/`<button>` on `/discuss-a-project` at 360px found the mobile menu toggle at 36×36px and most footer links at 13-25px tall (text-only, no vertical padding) — under the ~44px common minimum target size the brief's "touch targets and spacing" check calls for.
- Change made: [Header.astro](src/components/Header.astro) — toggle button `h-9 w-9` (36px) → `h-11 w-11` (44px). [Footer.astro](src/components/Footer.astro) — added `inline-block py-2` to every footer link and rebalanced the list gaps (`gap-y-3` → `gap-y-1`, since the added padding now supplies the vertical rhythm) so the tap target grows without visually bloating the footer.
- Verification actually performed: re-measured the same elements after the change — toggle now 44×44, footer links now 34-36px tall; screenshot confirms the footer still reads as compact and unchanged in character.
- Observation C (minor, not fixed): Chrome's DevTools Issues panel flags 3-4 form fields without an `autocomplete` attribute (the collapsed "location/timing/budget" fields inside the protected `src/lib/enquiry/enquiry.js` module, and the intentionally-hidden static Netlify registration form in `EnquiryFlow.astro`). This is a minor best-practice suggestion, not a rendering or usability defect (the visible, primary fields — name/email/phone/company — already carry correct `autocomplete` values). Left as-is: fixing it means editing the protected third-party enquiry module for a cosmetic linting nicety outside the brief's explicit check list.
- Outcome: PASS.
- Impact on other pages: the `.media-placeholder`/`.media-shell` fix applies everywhere `OfferMedia` is used (Home, all offer pages, Work, Studio); the Header/Footer fixes are site-wide (shared layout). Spot-rechecked Home and one offer page visually after the CSS change — no regression.
- Remaining issue and next action: Proceed to Cycle 11 (tablet and short-laptop viewports).

### Cycle 11: Tablet (768x1024) and short-laptop (1280x720) viewports

- Current pages and viewports: Home and `/what-we-do/art-for-brands` at 768x1024; Home and `/discuss-a-project` at 1280x720; via chrome-devtools MCP.
- Perspective/task: the exact breakpoint boundary (768px is Tailwind's `md:` threshold, so this is where two-column grids first activate) and a short 720px-tall laptop, both explicitly named as required checks in the brief.
- Evidence inspected: full-page and viewport screenshots; `scrollWidth`/`clientWidth` overflow check at 768px.
- Observation: at 768px the offer page's staggered 3-column capabilities grid (FIND THE ARTISTIC IDEA / BRING IN THE RIGHT ARTIST / MAKE IT REAL) and the home offer scenes' asymmetric layouts hold up correctly — narrow columns wrap text normally with no overlap or collision, confirmed by direct inspection. No horizontal overflow at 768px on the pages checked. At 1280x720, the Cycle 01 hero fix generalizes correctly: full 3-line headline, supporting text, primary CTA and secondary link all visible without scrolling; `/discuss-a-project`'s intro and step indicator are visible with the step content starting just below the fold, which is expected/acceptable (the page's purpose and next action are already clear before any scroll).
- Change made: none needed; this cycle confirmed the fixes from Cycles 01 and 10 hold at these additional required viewports.
- Verification actually performed: screenshots at both viewports on the pages above; overflow check at 768px.
- Outcome: PASS.
- Remaining issue and next action: Proceed to Cycle 12 (keyboard, focus and readability across remaining pages).

### Cycle 12: Keyboard focus and colour-contrast readability

- Current pages and viewports: Home, desktop, via chrome-devtools MCP (`press_key` Tab, `getComputedStyle` contrast calculation).
- Perspective/task: readability check called for by brief section 6 ("readable text and colour contrast") and keyboard focus visibility ("visible focus").
- Evidence inspected: computed WCAG relative-luminance contrast ratios for every text/background colour pairing defined in the design system; live focus-outline computed style after a real Tab keypress.
- Observation (real defect, found and fixed): `--color-stone` (#777168), the token used for inactive nav links, breadcrumbs, `image-note` captions/labels and various secondary body copy, measured 4.20:1 against the site's paper background (#f2efe7) — under WCAG AA's 4.5:1 minimum for normal-size text (and `image-note` text is small, ~9px, so the stricter threshold applies, not the 3:1 large-text one). All other text/background pairs checked passed comfortably: ink-on-paper 15.7:1, paper-dim-on-paper (the main `body-copy` colour) 7.3:1, and both dark-surface muted-text colours (`.surface-dark .text-stone`/`.notation`, computed via their `color-mix` blend against ink) at 8.1:1 and 6.7:1.
- Change made: [global.css](src/styles/global.css) — darkened `--color-stone` from `#777168` to `#6f695f` (8 of 255 per channel, visually near-identical), which raises the ratio to 4.73:1 on the paper background (4.55→5.12:1 on the brighter `paper-bright` variant used in some cards), clearing AA with a small safety margin. This is a single design-token change, so it applies everywhere `--color-stone`/`text-stone` is used site-wide without touching any component.
- Verification actually performed: recomputed the ratio after the change (4.73:1); reloaded Home and confirmed visually that nav labels, breadcrumbs and captions still read as intentionally secondary/muted, not as a jarring change.
- Observation (focus, strength confirmed): a real Tab keypress from a fresh page load lands on the skip link with a visible `outline: solid` in the signal-orange accent colour, matching the global `:focus-visible` rule — already verified across the nav dropdown (Cycle 07) and the enquiry form (Cycle 09); since the outline rule is a single global CSS rule applied uniformly to every focusable element, these confirmations generalize site-wide rather than needing a per-element recheck.
- Outcome: PASS.
- Remaining issue and next action: Proceed to Cycle 13 (motion, reduced motion, and runtime behaviour).

### Cycle 13: Motion, reduced motion, and runtime behaviour

- Current pages and viewports: Home, desktop 1280x720, via chrome-devtools MCP (`navigate_page` with an `initScript` that overrides `window.matchMedia` so `(prefers-reduced-motion: reduce)` genuinely reports `true` before any page script runs — real Level A/B evidence, not source reading alone).
- Perspective/task: brief section 6 explicitly requires checking "interactions during and after animations," "reduced motion," and section 4 requires the logo "must coexist with a legible proposition... no forced intro, scroll hijacking... Navigation and CTAs remain stable."
- Evidence inspected: screenshot immediately after load with reduced-motion forced true; console messages after that load; console messages after a full programmatic scroll through the entire home page (0 to 6559px) with motion enabled; screenshots at top and bottom of that scroll.
- Observation: confirmed (not just read in source) that with reduced motion active, the hero logo renders in its final settled state immediately (no shatter/reassembly animation plays — `HeroLogo.astro`'s script calls `settle()` and returns before building the GSAP timeline) and the headline/supporting-text/CTA copy is visible immediately (`Hero.astro`'s script returns before ever setting `opacity:0` on them, so there is no flash-of-invisible-content waiting on an animation that will never fire). `OfferChapters.astro` and `FragmentMotion.astro` both gate their `ScrollTrigger` setup behind the same check, so scroll-linked parallax is skipped entirely under reduced motion. Zero console errors in either the reduced-motion load or the full-motion scroll-through. The sticky header (and its "Discuss a Project" CTA) held a fixed position through the entire scroll in both the top and bottom screenshots — no scroll-hijacking, no moving-away buttons.
- Change made: none needed; this cycle confirmed existing motion-safety engineering is correct and did not need correction.
- Verification actually performed: as described above — genuine media-query override (not a source-code assumption), console log inspection, before/after screenshots.
- Outcome: PASS.
- Remaining issue and next action: Proceed to Cycle 14 (article/guide templates on dev fixture content).

### Cycle 14: Automatic article/guide templates, sanitisation, related links

- Current pages and viewports: `/insights`, `/insights/template-test-article`, `/guides/template-test-specialised-page`, desktop 1280x900 and mobile 390x844, via chrome-devtools MCP.
- Perspective/task: a reader arriving on an article wanting a relevant next step (brief section 9 persona); the technical requirement to check "long headings, paragraphs, lists, tables, images, captions, contents navigation, breadcrumbs, related content and offer/enquiry links on representative development content."
- Evidence inspected: full-page screenshots of the article template, the guide template and the insights index; a DOM check for the fixture's embedded XSS payloads (`<script>`, `<iframe>`, `onerror`, `javascript:` link) after render; mobile overflow check.
- Observation: every item on the brief's checklist is present and correctly rendered on the article template: an honest "TEST FIXTURE... excluded from the production build" banner (also present on the index listing, so a developer browsing dev content is never confused about what's real), breadcrumbs, author/published/focus metadata, a placeholder image with an honest caption ("supplied rather than invented"), a sticky "ON THIS PAGE" table of contents matching the h2/h3 structure, ordered/unordered lists, a data table (which uses the existing `overflow-x: auto` handling for narrow viewports), a blockquote, a related-offer card with both "Read the offer" and "Discuss a Project" links, and related-reading cross-links to the guide fixture. The guide template separately confirmed its own intent/sections/metadata and an image dimension-label overlay useful for future content editors. Directly verified sanitisation is real, not just documented: `document.body.innerHTML` contains no trace of the fixture's embedded `<script>`, `<iframe>`, `onerror`, or `javascript:` payloads, and the page-level marker they would have set (`window.__fixtureXssMarker`) was never set.
- Change made: none needed. No horizontal overflow at 390px on the article template.
- Verification actually performed: as described; also confirmed the insights index correctly excludes nothing extra and shows the same honest fixture disclosure.
- Outcome: PASS (with one item explicitly BLOCKED, not assumed passing): pagination behaviour could not be exercised, because only two non-scheduled fixture entries exist in dev content — not enough to trigger the `Pagination` component. Marking this BLOCKED rather than claiming it passed; it is not a defect, just an untestable path with the current dev content volume.
- Remaining issue and next action: Proceed to Cycle 15 (full regression and identity coherence across all page families), then run `npm run check` and `npm test`.

### Cycle 15: Full regression, identity coherence, and local checks

- Current pages and viewports: Home, `/what-we-do`, all three offer pages, `/work`, `/studio`, `/discuss-a-project`, `/insights`, `/insights/template-test-article`, `/guides/template-test-specialised-page`, re-screenshotted full-page at desktop 1440x900 after every change in this session, since the CSS-token edits (`--color-stone`, `.media-placeholder`/`.media-shell` width, `.offer-scene` gap) are global and could have regressed any page.
- Perspective/task: run the required local checks with genuinely fresh results, and make a final creative-director pass — does the site read as one coherent identity, or are some pages weaker cousins of a polished Home?
- Evidence inspected: `npm run check` output; `npm test` output; full-page screenshots of every route above.
- `npm run check`: **0 errors, 0 warnings, 7 hints** (94 files). The 7 hints are pre-existing Node/TypeScript deprecation notices in `src/lib/enquiry/enquiry.js` (unused loop variable) and the `tests/*.test.mjs` loader registration (a deprecated Node API signature) — none are in files touched this session, and none are errors.
- `npm test`: **89/89 passing**, 0 failures — genuinely re-run this session, not carried over from the baseline. Confirms the placeholder-project guard, routing/relations exclusions, sitemap/redirect behaviour, publishing gate (draft/scheduled/fixture rules) and the Airtable adapter's safety checks all still hold after this session's presentation-only edits.
- Creative-director pass: the three offer pages, What We Do, Work and Studio all now share the same visual grammar established on Home (fragment-shape accents, collage-style overlapping media, consistent light/dark rhythm with one deliberate dark closing rather than stacked dark blocks, the same headline/notation type system) — no page reads as an unfinished or generic afterthought behind a polished homepage. The site's overall length dropped from roughly 9950px to 7518px on Home (desktop) purely from tightening dead space, without removing any content, which reads as more resolved/edited rather than shorter for its own sake, in the spirit of "PORTO ROCHA for editing and confidence" cited in the brief's references.
- Change made: none in this cycle; it is a verification pass over the cumulative work.
- Outcome: PASS.
- Remaining issue and next action: none blocking. See `docs/UX-HANDOFF.md` for the small non-blocking housekeeping items (orphaned unused home components; a minor `autocomplete` lint suggestion inside the protected enquiry module) carried forward as optional future work, not required for this pass.

### Addendum: independent skill-based critiques (design-audit, Impeccable)

Run after Cycle 15 as a genuine second opinion, per an explicit user request to verify and actually use the skills named in the brief.

- **design-audit** (heuristic/Nielsen/human-factors lens, applied by hand against the site's actual screenshots and DOM, since the skill's tooling expects a static image/Figma input rather than a live URL): confirmed no critical or major findings beyond what Cycles 01-14 already fixed. Two new, minor, non-actionable observations: (1) the offer pages' staggered 3-column capability grid (different `pt-[Nvh]` offsets per item) trades a small amount of Gestalt "common alignment" for the brief's explicitly requested "controlled asymmetry" — a deliberate trade-off named in UX-BRIEF.md section 4, so kept as-is; typographic similarity (identical heading treatment) still reads the three items as a parallel set. (2) The signal-orange accent colour is reused for both the enquiry's neutral "PREVIEW" status badge and for validation-error states — a theoretical heuristic-10 (error-recognition) overlap, but the same accent is already the site's one deliberate brand colour used decoratively throughout (strike-rule, fragment tints, hover states), so narrowing its meaning to "errors only" would cost more identity than it would gain in clarity; not changed.
- **Impeccable** (`context.mjs` + the `critique` command's evaluation criteria, run in a single bounded pass rather than the full dual-subagent protocol the command normally requires, since this was scoped as a short final gut-check rather than a fresh critique cycle — noted here rather than silently passed off as the full protocol): loaded this project's own historical `PRODUCT.md`/`DESIGN.md` ("Impact Field" identity spine from an earlier V1 pass). Per `CLAUDE.md`, these are historical documents that inform but do not override the active `UX-BRIEF.md`. Checked the current build against DESIGN.md's explicit "Avoid" list (centered generic hero, three service cards below the hero, excessive pills, generic icon grids, glassmorphism, stock illustration, portfolio masonry): none present — confirmed by direct inspection, not assumed. One nuance surfaced and deliberately not acted on: DESIGN.md's V1 vision describes fragment accents radiating from one unified compositional origin; the current build instead scatters varied fragment IDs/rotations per section. Judged this correct as-is, because the *active* UX-BRIEF.md explicitly warns "avoid repeated floating decoration... or unrelated effects" — over-systematizing the fragments into a rigid single field risks exactly the decorative-gimmick failure mode the current, authoritative brief cautions against, so the more restrained, varied current treatment was kept.
- Outcome of both: no changes made. Direction confirmed solid; no single "must-fix" identified beyond the session's completed work.

---

# Part 2: Interaction pass (creative motion direction)

New brief received 2 September 2026: move the site from a "clean but static" editorial composition to a "living, artistic, precise" studio, using the logo's own fracture/reassembly as the source grammar for masks, panel motion and offer reactions. This part's 15-cycle count is independent of Part 1's; checks already performed there are not recounted here.

Status: 15/15 minimum cycles COMPLETE. `npm run check` (0 errors) and `npm test` (89/89) both green after all changes.

| Cycle | Focus | Status |
| --- | --- | --- |
| 01 | Variant A (fracture-panel editorial entry): real evolution, desktop + mobile, at rest and in motion? | DONE |
| 02 | Variant B (typographic index, shared preview): genuinely different, where does it help/hurt? | DONE |
| 03 | Comparison and choice: which defects in the winner need fixing before extending it? | DONE |
| 04 | Building the retained direction into the real pages, extending grammar to menu/questionnaire | DONE |
| 05 | Signature consistency across every new mechanism | DONE |
| 06 | Rhythm across the whole page | DONE |
| 07 | Static quality without motion | DONE |
| 08 | Interrupted transitions: rapid hover, clicks mid-animation, reverse scroll | DONE |
| 09 | Small/common mobile widths | DONE |
| 10 | Keyboard only | DONE |
| 11 | Tablet, short laptop, wide desktop | DONE |
| 12 | Reduced motion and no-JS fallback | DONE |
| 13 | Questionnaire preservation | DONE |
| 14 | Robustness (resize, weight, back navigation) | DONE |
| 15 | Final review, before/after, local checks | DONE |

## Cycle 01: Variant A, fracture-panel editorial entry

- Zone: hero + entry into the three offers, built as a real working prototype at /dev-variant-a (temporary route, not linked, noindex).
- What was built: reused the current, already-tuned hero and three-offer-scene composition, and added the actual new mechanism, FractureReveal.astro plus src/lib/fracture.ts. Each offer's main image (and a new small hero-side teaser) is split into 2 static-clip-path shards (3 for the Public Art scene) that arrive offset and rotated and animate via transform only, never animating clip-path itself, to stay compositor-cheap, to settle into exact alignment. This is the same shatter-then-reassemble grammar already used by the logo's own GSAP timeline, reapplied to real content instead of invented as a new, unrelated effect. Hovering or focusing an offer's link now also nudges that offer's own image panel, a coordinated, not isolated, reaction.
- Verification actually performed, real interaction not just a final screenshot: reloaded with CPU throttled 20x and screenshotted immediately after load or scroll to catch the animation mid-flight, not just its settled end state, for the hero teaser panel and for the Art for Brands scroll-triggered panel; both screenshots show the shards visibly offset and rotated mid-transition, confirming the animation genuinely plays rather than only existing in code. Confirmed the resting state reads as one continuous image with no visible seam by comparing settled screenshots. Checked mobile at 390x844, full page: shards settle correctly, no overflow, hero teaser correctly hidden below md as intended.
- Defect found: none in Variant A itself at this stage; the data-offer-panel forwarding bug affected the shared component and is covered in Cycle 03.
- Outcome: PASS. A real, verified evolution, not a static mockup and not a claim resting on a single end-state screenshot.

## Cycle 02: Variant B, typographic index with shared reactive preview

- Zone: same hero and offers-entry, built as a second, structurally different prototype at /dev-variant-b.
- What was built: a visibly different composition and exploration mode, not a reskin of Variant A. A compact hero, smaller logo, tighter vertical rhythm, leads straight into a scannable list of the three offer names. On desktop, one shared preview panel, same FractureReveal mechanism, sits beside the list and swaps content on hover or focus, with gsap.quickTo() driving a small, contained cursor-follow drift of the panel shards while a pointer moves over the index, bounded to the panel, not a large floating image over the page. On panel swap, the incoming image re-enters via a brief shard offset then settle, keeping the fracture grammar consistent between the two variants rather than inventing a second unrelated effect. Mobile drops the shared-panel mechanic entirely, since hover does not exist on touch, and gives each offer its own inline thumbnail instead, so no content is hover-gated.
- Real defect found and fixed: the preview's caption label picked the wrong DOM node. link.querySelector("span") matched an outer wrapper span containing the headline and the descriptor and the tag list together, so hovering Art for Places produced a garbled label reading ART FOR PLACES followed by the whole descriptor and tags run together. Fixed by targeting the headline element specifically. Re-verified via hover and via programmatic keyboard focus: the label now reads exactly the hovered offer's name, matching what is shown.
- Non-blocking polish note recorded for later, not fixed in the prototype: the accent colour on the index items is driven by native CSS hover and focus-visible, so in the artificial test condition of hovering one item then moving focus to another via a direct focus call without moving the mouse, both a stale-hover item and the truly-focused item could show the accent simultaneously. This can only happen when mouse position and keyboard focus are decoupled, an edge case, and the preview panel itself, the primary indicator, is unaffected because it is driven by JS state, not raw hover. Recorded as a refinement to apply if this direction were chosen.
- Verification: hover interaction screenshotted and confirmed correct after the fix; keyboard-focus parity confirmed, same panel swap, same visible focus outline; mobile confirmed each offer gets its own thumbnail with no hover dependency, and the whole hero plus index fits in roughly one and a half mobile screens at rest, materially more compact than Variant A or the pre-existing baseline.
- Outcome: PASS, defect found and fixed, one deliberate non-blocking note carried to Cycle 03.

## Cycle 03: Comparison and choice

- Compared both variants against the brief's own creative-quality grid, side by side, using the desktop and mobile screenshots captured in Cycles 01-02 plus direct interaction in the browser, not a read of the code alone:
  - Difference perceptible: both qualify; B is the larger structural change, A is a strong new mechanism layered on an already-tuned structure.
  - Identite Impact: tied, both use the exact same FractureReveal and fracture.ts shard grammar, so neither is more on-brand than the other on this axis.
  - Orientation commerciale, the three doors distinguished at rest: B's initial edge here turned out to be smaller than it first appeared. The site's existing header What We Do dropdown, unchanged in both variants and already verified in Part 1 Cycle 07, already lets a desktop visitor see all three offers with a one-line description each without scrolling, in both variants. B still wins this criterion on mobile, where no such shortcut exists, but the site-wide nav dropdown means this is not a clean win for B on desktop.
  - Rythme et retenue, and qualite a l'arret: A wins clearly. Each of A's three offer scenes is an asymmetric, full-bleed editorial composition, convincing as a still image, matching the Porto Rocha editing-and-confidence reference from the brief's own list and the site's established monumental, editorial, architectural character, confirmed by reading this project's own historical DESIGN.md via the Impeccable skill in Part 1. B's list-plus-single-panel view, unhovered, is comparatively plain, one image and a column of text, closer to the three-service-cards pattern the project's own design direction explicitly warns against, even though the shared preview and shard motion dress it up.
  - Mobile concu: A's mobile inherits this session's already-refined, individually composed offer scenes with varied crops and staggered layouts. B's mobile is faster to scan but visually more uniform, one thumbnail shape repeated three times, less character by framing, which the brief asks for explicitly.
  - Continuite du parcours: close to even; B's tighter opening could read as either more continuous, less scroll, or as rushing past the editorial richness the brief also wants kept, a genuine trade-off, not a clear win either way.
- Decision: Variant A, the fracture-panel editorial entry. It keeps and extends the richer, already-tuned composition rather than replacing it with a more compact but visually flatter index pattern, it does not reintroduce the three-cards-below-the-hero shape the project's own design direction warns against, and its mobile experience preserves more per-offer character. Variant B's genuine strength, a fast overview, is already substantially covered by the existing nav dropdown, so choosing B would trade real static and rhythm quality for an orientation benefit the site already delivers another way.
- Corrections carried into the retained direction before extending it further: first, the data-offer-panel and data-offer-preview-panel attribute-forwarding bug in FractureReveal.astro, where props declared in the component's Props interface were not spread onto the root element, so any data attribute passed by a caller was silently dropped, fixed by adding a typed rest-props pattern and spreading it onto the panel div; this fix benefits both variants and the final build. Second, applying the clay-accent idea from Variant B's index, a warm terracotta already defined in the design tokens as --color-clay but never activated by any component, to Variant A's offer-link hover and focus state, so the coordinated reaction between a link and its image panel gets a visible colour cue too, not just motion, and so this pass's one considered accent colour lives in the surviving direction rather than being discarded with Variant B.
- Variant B and its route, /dev-variant-b and HeroOffersB.astro, will be deleted once the chosen direction is fully built and verified, per the brief's explicit instruction not to leave an experimental variant live in the final path. Deletion recorded in a later cycle once confirmed safe.
- Outcome: DONE. Proceeding to build Variant A into the real Hero.astro and OfferChapters.astro.

## Cycle 04: Building the retained direction into the real pages, and extending the grammar to menus/buttons/questionnaire

- Built into real files: [Hero.astro](src/components/home/Hero.astro) gained the small fracture-teaser panel (public-art image, hidden below md, immediate reveal timed with the existing hero-copy fade); [OfferChapters.astro](src/components/home/OfferChapters.astro) now uses FractureReveal for each offer's primary image (2-shard for Art for Brands/Places, 3-shard for Public Art, matching the variant), the old per-media scroll-parallax was scoped to exclude fracture shards specifically to avoid two animations fighting over `transform` on the same elements (see the code comment left in place explaining why), and offer links got `hover:text-clay focus-visible:text-clay` plus the coordinated panel-nudge wiring.
- Grammar extended discreetly, per the brief's explicit "menus, boutons et transitions du questionnaire reprennent discrètement cette grammaire," to exactly two more places, deliberately not more (the brief also warns against needing "un effet spectaculaire" on every element): (1) [Header.astro](src/components/Header.astro) — the mobile nav panel's links now arrive with a brief stagger (fade + 10px slide, ~0.4s, 45ms apart) when the menu opens, and the two hamburger-to-X bars settle at slightly different durations (220ms/260ms) instead of one synchronised transition, echoing fragments arriving a beat apart; (2) [EnquiryFlow.astro](src/components/EnquiryFlow.astro) — a `MutationObserver` watching the (unmodified, protected) enquiry module's root applies a brief fade+settle to each newly-rendered step, entirely from outside the protected `src/lib/enquiry/` files (the module's own render/validation/focus logic is untouched).
- Verification actually performed (not just reading the code): reloaded the real homepage and confirmed via screenshot that the Cycle 01 (Part 1) fold-visibility fix still holds with the new teaser panel present; hovered a real offer link and confirmed the panel nudges and the link turns the clay accent colour; ran `npm run check` (0 errors, caught and fixed two real TypeScript errors introduced by this work — see below) and `npm test` (89/89).
- Real defects found and fixed during this build step: (1) `FractureReveal.astro` did not forward arbitrary `data-*` props to its root element (only the props explicitly named in its `interface Props` were used), so `data-offer-panel="..."` passed by callers was silently dropped and `document.querySelector('[data-offer-panel="..."]')` returned nothing; fixed with a typed rest-props pattern (`[dataAttr: \`data-${string}\`]: string | undefined`) spread onto the root div. (2) `src/lib/fracture.ts` called `gsap.set(shards, (index, el) => ({...}))` — GSAP's function-value syntax is per-property, not a function replacing the whole vars object, which is not valid gsap.set usage and produced two `ts(7006)` implicit-any errors; fixed by using the correct per-property function form (`x: (_i, el) => ..., y: ..., rotate: ...`).
- Deleted the temporary comparison scaffold once the real build was verified working: `src/pages/dev-variant-a.astro`, `src/pages/dev-variant-b.astro`, `src/components/dev-variants/` (both `HeroOffersA.astro` and `HeroOffersB.astro`). Re-ran `npm run check` immediately after: 0 errors (91 files, down from 95, exactly the 4 removed files), confirming no real page depended on the scaffold.
- Outcome: PASS.

## Cycle 05: Signature consistency — does everything share one language?

- Checked every new motion mechanism against the others: the hero teaser panel, all three offer-scene panels, the mobile nav link entrance, and the questionnaire step entrance all use the same underlying vocabulary — elements arrive offset (position and, where relevant, rotation) and settle to their resting alignment with a `power2.out`/`power3.out` ease in the 0.4-0.85s range, the same character as the pre-existing logo shatter/reassembly timeline (`HeroLogo.astro`, untouched). No new easing curve, no new motion direction convention, and no additional accent colour beyond the one considered activation (`--color-clay`, previously defined but unused) were introduced.
- Confirmed by direct inspection this is not five unrelated effects glued together: `FractureReveal`/`fracture.ts` is the single mechanism reused four times (hero teaser, 3 offer panels) rather than four separate implementations; the two "menu/button/questionnaire" touches are a stagger and a fade-settle using the same GSAP defaults, not a new bespoke effect each.
- Outcome: PASS.

## Cycle 06: Rhythm across the whole page

- Re-walked the full homepage sequence: Hero (expressive: logo shatter + teaser panel) → Offer chapters (expressive: three fracture reveals, each with its own asymmetric composition) → "THE ART COMES FROM THE PROJECT" (calm, dark, static text, no motion beyond the existing scroll-fade already verified in Part 1) → "BRING US IN EARLY" / "ARTIST-LED, PROJECT-DRIVEN" (calm-to-moderate, light) → "HAVE A PROJECT IN MIND?" (moderate, dark, the conversion moment) → footer (calm).
- This is the same alternation Part 1 Cycle 02 already tuned the spacing for; this cycle's new interactions sit inside that existing rhythm rather than replacing it, so no page reads as continuously animated. Not every element moves: the dark "THE ART COMES FROM THE PROJECT" section, the footer, and the offer pages' capability grids are still deliberately still.
- Outcome: PASS, kept as-is.

## Cycle 07: Static quality — does it hold up on a still screenshot?

- Reviewed the settled (no interaction, no scroll-in-progress) screenshots of the homepage at 1440x900, 1280x720, 768x1024, 390x844 and 360x800 captured across Cycles 01-06. In every one, the fracture panels read as ordinary, well-composed images (the shard seam is only visible during motion, confirmed in earlier cycles by comparing settled vs. mid-flight captures) — the site does not depend on animation to look considered.
- Outcome: PASS, kept as-is.

## Cycle 08: Interrupted transitions — rapid hover, clicks mid-animation, reverse scroll

- Real defect found and fixed: scripted a rapid, repeated scroll (jumping between two positions 8 times, 15ms apart) combined with rapid hover-in/hover-out cycling across all three offer links (2 full rounds, 10ms apart) on a fresh page load, deliberately interrupting the entrance reveal mid-flight. After settling, three of the four fracture panels were left with a small but permanent residual rotation (matrices like `matrix(0.9996, -0.0283, 0.0283, 0.9996, 0, 0)`, roughly 1.6-4°) — confirmed genuinely stuck by re-checking after a further 600ms wait with an identical reading. Root cause: `armFractureHover`'s `nudge()`/`settle()` tweens only controlled `x`/`y` with `overwrite: true`; when a hover interrupted the one-time entrance tween (which also animates `rotate`) mid-flight, `overwrite: true` killed the entrance tween outright, and because the hover tween never restated `rotate`, that property froze wherever the kill happened.
- Fix: [fracture.ts](src/lib/fracture.ts) — both `nudge()` and `settle()` now explicitly include `rotate` (settle to `0`), so any tween that interrupts another always leaves every animated property in a known, controlled state.
- Verification: re-ran the identical rapid scroll+hover script after the fix — all shards on all four panels report `matrix(1, 0, 0, 1, 0, 0)` (fully settled) afterward. Re-ran `npm run check` (0 errors) and `npm test` (89/89) to confirm no regression from the fix.
- Outcome: PASS, defect found and fixed by deliberately trying to break it, not just checking the happy path.

## Cycle 09: Small/common mobile widths

- Checked 360x800 and 390x844 on the homepage after the real build (not just the earlier prototype): no horizontal overflow (`scrollWidth === clientWidth` at both), hero teaser panel correctly hidden below `md:` (mobile doesn't need a decorative competing element), each offer scene's fracture panel renders and settles correctly, no content is behind a hover-only interaction (the coordinated link-to-panel nudge is a hover/focus *enhancement*, not a requirement — the link and image are both already visible and functional without it). Contact routes (footer email/phone/WhatsApp, "Discuss a Project") remain reachable exactly as verified in Part 1.
- Outcome: PASS.

## Cycle 10: Keyboard only

- Confirmed via real keyboard-equivalent events (`focus`/`blur` dispatch, matching what actual Tab navigation triggers) that the coordinated offer-link → panel nudge fires on focus exactly as it does on hover, so a keyboard user gets the same coordinated cue a mouse user does, not a degraded experience. The mobile menu's focus/`inert`/Escape behaviour verified in Part 1 Cycle 07 is unchanged by this pass (Header.astro's `setOpen` logic itself is untouched; only a `gsap.fromTo` was added alongside it). The enquiry flow's focus-to-new-heading behaviour was directly re-verified after adding the step-transition fade: clicking an offer option still moves focus to the new step's `<h2>` (confirmed via `document.activeElement`), and the empty-submit validation still moves focus to the first invalid field with `aria-invalid`/`aria-describedby` set correctly.
- Outcome: PASS.

## Cycle 11: Tablet, short laptop, wide desktop

- 768x1024 (tablet): full-page screenshot confirms the hero teaser panel and all three fracture-revealed offer scenes compose correctly at exactly the `md:` breakpoint threshold, no overflow, no console errors.
- 1280x720 (short laptop): `scrollWidth === clientWidth`, full hero (logo, teaser, 3-line headline, supporting text, both CTAs) visible without scrolling — the Part 1 Cycle 01 fold fix holds with the new panel added.
- 1440-1920 (wide desktop): already the primary viewport used throughout Cycles 01-08 above.
- Outcome: PASS.

## Cycle 12: Reduced motion and no-JS fallback

- Reduced motion: forced `prefers-reduced-motion: reduce` via a real `matchMedia` override (not a source-code assumption) and reloaded the homepage. All four fracture panels report `matrix(1, 0, 0, 1, 0, 0)` on every shard immediately, confirming the entrance animation is skipped entirely and content is simply shown in its final, aligned state. The mobile-menu stagger and the questionnaire step-fade both check the identical `matchMedia` condition before running (same guard pattern already proven correct for the pre-existing hero/logo/offer-chapter/fragment-motion scripts in Part 1).
- No-JS fallback: fetched the raw server-rendered HTML (`curl`) and confirmed every `[data-fracture-shard]` element ships with **no inline `style` attribute at all** — no `opacity`, no `transform`, nothing hiding it. Because the shard's CSS class only sets `clip-path` (never opacity or a transform), the default, un-animated state *is* the fully visible, correctly aligned image — there is no JS-dependent hidden state to fall back from. This satisfies the brief's explicit requirement that content must never be left at zero opacity, masked, or off-screen if JavaScript fails.
- Outcome: PASS.

## Cycle 13: Questionnaire preservation

- Directly re-verified, after wiring the step-transition fade, that nothing about the protected flow's contract changed: offer preselection into step 2's copy still reflects the chosen offer (tested via "A mural or artwork to produce" → step 2 correctly showed mural-specific format chips and the offer summary "Public Art & Mural Production"), back navigation still works, the empty-contact-step submit still produces the same error banner text ("Please check the highlighted details.") with the same per-field errors and focus management, and the submit button is still honestly labelled "TEST THIS ENQUIRY" / "Preview only. This test will not send or save your details." No real submission was triggered at any point in this pass either.
- Outcome: PASS, kept as-is beyond the additive, external step-transition fade.

## Cycle 14: Robustness

- Resize/orientation: covered by the five viewports checked across Cycles 09 and 11 (360, 390, 768, 1280, 1440-1920), all clean.
- Weight of the new effects: `FractureReveal` adds at most 3 extra DOM copies of a placeholder `<div>` (or, once real photography exists, an `<img>`) per panel — no new network requests for the placeholder case (CSS gradients, not images), and only `transform` is ever animated (never `clip-path`, `width`, `height`, or layout-affecting properties), keeping every new animation compositor-only. Cross-checked against the impeccable design hook's own finding earlier this session (a real `padding-left` transition it flagged in unrelated dead CSS, since removed) — no such layout-thrashing pattern exists anywhere in the new code.
- Browser back/forward: not a new concern introduced by this pass — no client-side routing was added or changed; every offer/CTA link is a normal `<a href>` verified earlier in Part 1 and unchanged here.
- Outcome: PASS.

## Cycle 15: Final review

- Full journey re-walked end to end on the real, built pages (not prototypes): Home → hover/focus an offer → offer detail page → "Discuss a Project" → through the questionnaire to the (non-sent) preview confirmation, at desktop and mobile. No dead link, no console error, no visual regression on pages this pass did not directly touch (spot-checked `/what-we-do/art-for-brands`, which still renders correctly with the Part-1 `--color-stone` and layout work intact).
- Before/after: the homepage went from a fade-and-parallax entrance (Part 1's tuned but comparatively static composition) to a logo-derived shatter/reassembly entrance applied consistently across the hero teaser and all three offer panels, with a coordinated hover reaction (motion + the newly activated clay accent colour) tying each offer's link to its own image, plus the same settle grammar echoed lightly in the mobile menu and the questionnaire.
- Local checks, final state: `npm run check` → 0 errors, 0 warnings, 7 hints (91 files; the 7 hints are the same pre-existing, unrelated Node/TS deprecation notices from Part 1, not introduced by this pass). `npm test` → 89/89 passing.
- Outcome: PASS. Interaction pass complete: 15/15 cycles, with real defects found and fixed in Cycles 02, 04 and 08 (not manufactured busywork — several cycles, like 05-07, 09-13, confirmed correctness without needing a change).

---

# Part 3: Parcours, prévisibilité et mouvement (brief received 3 September 2026)

Short trace only, per this brief's own instruction ("garde seulement une courte trace"), not a 15-cycle log like Parts 1-2. Format: modification — vérification — problème restant.

## 1. Accueil : atteindre les trois offres

- **Modification**: added a compact typographic index (`01 Art for Brands ↗`, `02 Art for Places ↗`, `03 Public Art & Large-Scale Murals ↗`) directly below the hero CTA row (`src/components/home/Hero.astro`), linking straight to each offer page. Kept the existing hero-copy fade group (no new blocking animation) and the immersive chapters/logo unchanged.
- **Vérification**: rendered correctly at 390, 768, 1280 and 1440px (real screenshots, not inferred). Confirmed via `HeroLogo.astro`'s own timeline that hero copy (headline/CTA/new index share `data-hero-copy`) fades in at ~0.7s (`intro.call(settle, ..., 0.52)` + the group's own 0.05-0.18s stagger start), not gated behind the full fragment-settle animation.
- **Problème restant**: none identified.

## 2. Interactions prévisibles

- **Modification**: `FractureReveal.astro` now renders as a real `<a>` when given an `href` (root tag switches `div`→`a`, existing shard/placeholder ARIA adjusted so the link gets one clean accessible name instead of a nested/duplicated one); the three homepage offer panels (`OfferChapters.astro`) now pass `href`/`ariaLabel`, so the image itself is a genuine link to the same destination as its text link, not decoration. Desktop "What We Do" dropdown (`Header.astro`) rebuilt as explicit JS state (hover + focus open it, Escape closes it and returns focus to the trigger) after finding, by direct inspection of the live CSS cascade (not by assumption), that the previous `group-hover`/`group-focus-within` Tailwind utilities silently failed to apply opacity in this build even though the selector matched — a real, pre-existing defect, not only the audit's narrower "doesn't close on Escape" complaint. Found and fixed a real regression in my own first version of this fix (Escape closed the panel, then `trigger.focus()` immediately reopened it via the `focusin` handler) before shipping it.
- **Vérification**: real mouse click directly on an offer panel image navigated to `/what-we-do/art-for-brands` (confirmed via `location.href`, not inferred from a screenshot). Dropdown open/close on real hover confirmed visually (screenshots, cursor genuinely moved). Escape-closes-and-returns-focus confirmed via dispatched keydown + `document.activeElement` checks; a real hardware Escape key-press was flaky to land in this specific sandboxed browser tab (`document.visibilityState` reports `hidden` — the tab runs backgrounded here), so that one path is code-reviewed and partially, not fully, hardware-verified. Work page: confirmed via a clean production build (`CONTENT_SOURCE=fixtures npm run build`) that `dist/work/index.html` contains "Selected work is being updated" and no fabricated project entries — Work is not actually empty for a real visitor, so its nav/CTA presence was left as is, per the brief's own "don't fabricate a portfolio" instruction.
- **Problème restant**: desktop dropdown's Escape-and-refocus path is BLOQUÉ for hardware-level keyboard verification in this session's tooling (see above); logic is sound and mirrors the already-shipped mobile menu pattern, but a real keyboard in a real foregrounded browser has not confirmed it end to end this session.

## 3. Offre → questionnaire → retour

- **Modification**: offer pages' `ProjectCta` and the new mid-page CTA near `firstStep` now link to `/discuss-a-project?offer=<key>` (`ProjectCta.astro` gained an `offerKey` prop); the enquiry module (`src/lib/enquiry/`, not modified) already reads that exact query param and jumps to step 2 with the offer preselected — this was a real, working, documented feature (`config.js`'s `offer` field) that nothing on the site was ever wired to use. Added an external, additive recap of the step-2 format chips at step 3 (`EnquiryFlow.astro`, `armInterestsRecap`) — reuses the exact checkbox label text, never invents copy, and is intentionally NOT gated by reduced-motion since it's content, not animation. Tightened `discuss-a-project.astro`'s header (smaller heading, merged intro paragraphs, less padding) and moved the "prefer to speak directly" aside after the questionnaire in DOM order (mobile now reaches the actual step-1 choices sooner; desktop position unchanged via explicit `md:col-start-1 md:row-start-1`).
- **Vérification**: full real click-through — offer page CTA → `/discuss-a-project?offer=art-for-brands` → step 2 pre-shows "Art for Brands" with formats → checked two format chips → step 3 recap shows both "Art for Brands" AND "Live painting / event · Launch / campaign" (exact reused labels) → Back button returns to step 2 with both checkboxes still checked (state preserved by the untouched module). "Not sure" path re-tested after these changes: still lands on step 2 with no format fieldset (offer has none), unaffected.
- **Problème restant**: none identified.

## 4. Rythme et lisibilité

- **Modification**: "Art for Places" homepage scene reordered so the heading/summary/link render before the image in DOM (mobile now gets context before the large image; desktop position preserved via explicit `md:col-start-1/7` + `md:row-start-1`, geometry-verified afterward). `.image-note` bumped from 0.58rem to 0.66rem for legibility (stone-on-paper contrast was already ≈4.72:1, passing AA at any size — this was a size, not a contrast, fix).
- **Vérification**: `document.documentElement.scrollWidth` checked against `innerWidth` at 390 and 768px on `/`, `/what-we-do/art-for-brands`, `/discuss-a-project` — no horizontal overflow. `#offers` anchor-jump checked against the sticky header's real bottom edge (64.67px) vs. the first visible text's position (144px) — not actually occluded, existing padding already covers it.
- **Problème restant**: this was a targeted pass on the items the brief specifically flagged (mobile image-before-context, one small/muted label), not an exhaustive re-audit of every spacing value on every page; a further dedicated typography/spacing pass could still find more, smaller items.

## 5. Fragments et mouvement

- **Modification**: strengthened two moments — the homepage's real final CTA (`FinalCta.astro`, not `ProjectCta.astro`, which is the offer/work-page CTA) gained a bigger, more visible primary fragment (opacity 0.06→0.16 desktop, now visible on mobile too at 0.1) plus a second smaller fragment for richness, both with the existing scroll-drift mechanism (`drift`/`driftX`/`rotate` props, unchanged `FragmentMotion.astro`); `ProjectCta.astro`'s fragment got the equivalent treatment for consistency across offer/work pages. Enabled mobile presence (previously `hidden` on all three) for the three homepage offer-scene fragments, at reduced size/opacity distinct from their desktop position.
- **Vérification**: `[data-drift-fragment]` elements at 390px checked programmatically — 6 now `display: block` (were `none`), no horizontal overflow introduced (`scrollWidth === innerWidth`, confirmed at 390px on `/`). Did not touch `fracture.ts`/`armFractureHover` at all this pass, so no new double-init risk there; reduced-motion gating in `FragmentMotion.astro` (untouched) still applies to every new/resized fragment.
- **Problème restant**: `prefers-reduced-motion: reduce` could not be directly emulated with the browser tools available in this session (no such control was exposed), so the reduced-motion path is verified by code inspection (the guard clause is unchanged and unconditional) rather than by an actual emulated run this pass — BLOQUÉ, not assumed to pass.

## Local checks, final state (Part 3)

`npx astro check`: 0 errors, 0 warnings, 7 hints (91 files, same pre-existing unrelated hints as Parts 1-2). `npm test`: 89/89. `CONTENT_SOURCE=fixtures npm run build`: clean, 8 pages, all reachable from the homepage.

---

# Part 13: /automotive outreach page (brief received 29 September 2026)

> **Superseded by Part 15.** The page reviewed here was replaced by a rebuild from the deck; its evidence images were removed. Kept as history.

Source: four files supplied from outside the repo (AUTOMOTIVE_CONTEXT, AUTOMOTIVE_CONTENT, AUTOMOTIVE_ASSET_MAP, AUTOMOTIVE_BUILD_PROMPT). Scope: one new route, `/automotive`, inside this Astro site; copy locked; media to be supplied later. Cycles below are review loops actually run this session, against the running dev server and, where stated, the production build and preview, with Chrome DevTools MCP and Playwright MCP. Screenshots of the final no-media state are in `docs/ux-evidence/` (see cycle 15).

Facts recorded before building:

- No automotive media exists in the project (`public/` held only the four offer videos and posters, none automotive). The sibling folder named "Quotation carrefour" holds unrelated client documents and was not touched.
- The site has no analytics or event tracking (CSP `connect-src 'self'`, no tracking code anywhere), so the three event names are left as `data-track` attributes only. Nothing was installed.
- `scripts/validate-content.mjs` (run by `npm run build`) fails any page no link reaches from the homepage. A deliberately unlinked `noindex` page would break the production build, so a narrow, conditional exemption was added (see UX-HANDOFF, Part 13).

### Cycle 01: Opening, layout shift

- Pages and viewports: `/automotive`, 1280, 1440, 1920, 768, 390, 360, with and without media.
- Observation: the composition holds (two-line headline over a dark veil, intro fully inside the first viewport at all seven widths). A `layout-shift` PerformanceObserver on the production preview measured CLS 0.031 to 0.037 on desktop widths, 0 on mobile. Source: the bottom-aligned text block moved 85px when the web font swapped in and the headline dropped from three lines (fallback face) to two.
- Change: at `md` and up the two halves of the headline are block, no-wrap spans (`headlineLines` in the content file; the words are unchanged and a test asserts they join to the approved headline). The character cap on the heading is lifted at the same breakpoint.
- Verification: CLS re-measured on fresh pages with a single observer at 1440, 1920, 1280, 768, 390 and 360, media present, full scroll-through: 0 at all six. Local dev server with locally served fonts, not field data.
- Outcome: PASS.

### Cycle 02: What we do

- Observation: at 1440 a decorative fragment sat behind the intro paragraph (text over a tint). The offer rows read as a ledger, not cards; a thumbnail column exists only on rows that have media.
- Change: fragment moved to the lower right on `md` and up (top of the section on mobile).
- Verification: re-screenshot at 1440 (clean); the text and media overlap audit in cycle 10 reports none.
- Outcome: PASS.

### Cycle 03: BMW / Binance

- Observation: at 768 the two-column layout squeezed the text to about 255px and wrapped the eyebrow onto two lines. On mobile the strongest proof sat below the text; once the media came first, its overhanging detail inset touched the text below.
- Change: two columns start at `lg`; tablet and mobile stack with the media first; extra gap when an inset is present; bottom padding adjusted.
- Verification: screenshots at 390, 768 and 1440 with real (test) media: clean, video playing in the panel on mobile.
- Outcome: PASS.

### Cycle 04: Selected work spacing

- Observation: (a) at 1440 the workshop detail inset, which hangs 64px below its frame, covered the "AUTOMOTIVE WORKSHOP" caption. (b) At 390 with no media the last two ledger rows (Jetour and iCAUR) touched: 0px gap, the next row's hairline under the previous title.
- Change: larger caption margin when an inset exists (workshop, exterior); `gap-y-12` for the no-media pair.
- Verification: 1440 screenshot (inset ends at y=618, caption starts at 682); the pair measured at 48px on mobile.
- Outcome: PASS.

### Cycle 05: Ferrari panel

- Observation: a faint diagonal hairline was visible at rest on a still-image fracture panel (two clipped copies of one photograph, anti-aliased on both edges). At 768 the portrait panel was only 312px wide.
- Change: `automotive.css` extends the first shard's clip 1.5px past the cut (scoped to this route, the shared shard shapes in `global.css` are untouched); the panel takes seven columns at tablet.
- Verification: 1440 screenshot at rest shows one continuous image; 768 screenshot shows the wider panel.
- Outcome: PASS.

### Cycle 06: Creative range mosaic

- Observation: CSS-columns masonry left large holes under landscape tiles when only four tiles existed. Justified rows fixed that, but on phones a lone portrait tile took 60% of the row and left the rest blank, and labels without an image were numbered 03, 06, 07, 08 (a skipping sequence) beside the mosaic.
- Change: justified rows driven by each tile's own aspect ratio (nothing is cropped); the growth cap applies from 768 up, on phones a lone tile takes the full width; numbers show only in the all-typographic state.
- Verification: 1440 shows one full-width row of equal-height tiles; 390 shows full and half-width tiles then the type index.
- Outcome: PASS.

### Cycle 07: Contrast and small text

- Observation: computed ratios: stone (`#6f695f`) on sand (`#ddd5c6`) is 3.73:1 for the 12.5px "PROJECT SCOPE" label, below AA for normal text; the darker `paper-dim` token gives 5.76:1 there. Stone on paper is 4.73:1. The smallest text was 11px mono labels.
- Change: `.auto-eyebrow--on-sand` uses `paper-dim`; eyebrow 0.72rem to 0.78rem; index numbers 11px to 12px.
- Verification: ratios recomputed; the automated accessibility audit in cycle 13 reports no issue.
- Outcome: PASS for everything measurable now. Text over supplied footage in the opening depends on that footage: BLOCKED until real media exists.

### Cycle 08: Keyboard

- Observation: the page has three links plus the skip link, no header or footer, so no early exit routes. Real Tab key presses: skip link, WhatsApp, Email, Explore, each `:focus-visible` with the site's 2px orange outline, visible on the dark surface. The Explore link is 25px tall.
- Change: a pseudo-element extends its hit area without moving the visible box.
- Verification: probing `elementFromPoint` above and below the link gives a 56px hit height at 390 and 1440.
- Outcome: PASS.

### Cycle 09: Reduced motion

- Method: real `prefers-reduced-motion: reduce` emulation (Playwright `emulateMedia`), not a script override.
- Observation and verification on load, without scrolling: all 37 reveal targets at opacity 1 with no transform, the opening's CSS entrance is `none`, hero and BMW videos paused on their poster, fracture panels settled at `translate(0, 0)`.
- Change: none needed.
- Outcome: PASS (kept as is).

### Cycle 10: Viewport matrix, with and without media

- Method: a scripted audit at 360x800, 390x844, 768x1024, 1024x768, 1280x720, 1440x900 and 1920x1080 after a full scroll-through: horizontal overflow, text against media collisions (judged on the visible frame, since parallax scales the image inside a clipping frame), text over text overlaps, headline line count, intro inside the first viewport.
- Observation: the first version of the script reported two collisions at 768 and above; both were the parallax-scaled image rectangle extending past its clipping frame, not a visual defect. The script was corrected, not the page.
- Verification: with media and without, at all seven widths: 0 overflow, 0 collisions, 0 text overlaps, headline 4 lines on phones and 2 from 768, no console error.
- Outcome: PASS.

### Cycle 11: Media states and loading

- Method: the same page in each state a supplied asset can produce.
- Observation and verification: no media (nothing rendered, no placeholder word); video only with no still (plain video, no `poster` attribute, no fracture panel); still only in the hero (eager, `fetchpriority="high"`, decorative empty alt, real dimensions); video plus still (BMW panel with poster shards and crossfade); a below-the-fold video with a poster is `preload="none"`, made 0 requests while 3000px away and started, playing, within about 900px; the hero clip plays immediately.
- Change: `AutoMedia` preloads metadata only for above-the-fold or poster-less video.
- Note: the existing site videos are not faststart-encoded (Part 9); the same will apply to supplied clips. The recommended remux is in `docs/AUTOMOTIVE-MEDIA.md`.
- Outcome: PASS.

### Cycle 12: Build, indexation, protected areas

- Method: `CONTENT_SOURCE=fixtures npm run build`, with test media and without, then read the built HTML.
- Observation and verification: 29 pages (28 before), sitemap unchanged at 27 URLs, `/automotive` is `noindex, follow` with canonical `https://impactmurals.ae/automotive`, no header or footer in the built HTML, no em dash, three `data-track` events present. The validator reports the exempt outreach page explicitly and still fails a page that is exempt but not `noindex`. `routes.ts`, `sitemap.ts`, `publishing.ts`, `relations.ts`, the content-source adapter and the enquiry module were not modified.
- Outcome: PASS.

### Cycle 13: Automated audit on the production preview

- Method: Lighthouse through Chrome DevTools MCP on `npm run preview`, no media, mobile and desktop.
- Observation: Accessibility 100, Best Practices 100, SEO 66, Agentic Browsing 100. The single failed audit is "Page is blocked from indexing", the intended `noindex`.
- Limits: automated checks only, not an accessibility certification; no performance score is claimed (local server, no media).
- Outcome: PASS.

### Cycle 14: No-JS and link preview

- Observation: the built HTML contains no inline `opacity` or `transform` hiding anything; reveals and parallax are JS enhancements over fully visible content, and the opening's entrance is CSS keyframes. This page travels by message, so the preview image matters: with a still supplied, the build emits an absolute `https://impactmurals.ae/_astro/....jpeg` as `og:image` (first still among hero, BMW, Ferrari); with none, the site default applies.
- Verification: read from the built HTML in both states.
- Remaining issue: the site's default preview image is an SVG, which most messengers do not render, so until a still is supplied a WhatsApp or email preview will show no picture.
- Outcome: PASS, with that limit recorded.

### Cycle 15: Final regression

- Method: every check re-run after the last edit, in the final no-media state (temporary stand-in media removed first).
- `npx astro check`: 0 errors, 0 warnings, 10 hints (116 files). Eight hints were already present in the repository (an unused variable each in `enquiry.js` and the capability page, and the deprecated `register` notice, two per existing test file); the two new ones come from `tests/automotive.test.mjs`, which follows the same loader convention as the existing tests.
- `npm test`: 95 of 95 passing (89 existing plus 6 new), 0 failures.
- `CONTENT_SOURCE=fixtures npm run build`: exit 0, 29 pages, sitemap 27 URLs (unchanged), 2 pages `noindex` and excluded, "all reachable from the homepage: true (1 noindex outreach page exempt: /automotive)", "No problems found".
- Working tree: only intended files changed; `src/assets/` absent and no `automotive-*` file left in `public/videos/`; the browser tools' output folder removed.
- Evidence saved at the time: two full-page captures of that version, no media, Astro's dev overlay hidden and the logo at full opacity. They were removed in Part 14 because that composition was replaced; see Part 14 for the current evidence. There was deliberately no capture with stand-in media, since those images are not automotive work and would misrepresent the page.
- Outcome: PASS for everything that can be verified without real media. BLOCKED, not passed: crops, contrast over real footage and pacing with the real work; iOS Safari and real-device autoplay; analytics (no system exists).
- Cycles completed: 15 of the minimum 15, each a real inspection followed by a change or a recorded reason to keep, and a re-check. Cycles 09, 13 and 14 confirmed correct without a change; cycle 12 changed the build check and added tests, not the page.

---

# Part 14: /automotive final art direction pass (brief received 29 September 2026)

> **Superseded by Part 15.** The composition reviewed here was replaced by a rebuild from the deck; its evidence images were removed. Kept as history.

Second brief on the same route, from the owner's review of Part 13: the copy and logic were right but the execution still read as a premium sales landing page. Scope: presentation, composition and pacing only. Approved copy, facts, sections and the technical setup (noindex, no site chrome, outside the sitemap, the narrow build-check exemption) are unchanged. The Influential Walls deck was supplied as a reference for commercial discipline only.

## Deck and diagnosis

- **Deck (read as text; its pages could not be rendered to images here, so its visual design was not seen, which the brief did not need).** Ten pages: cover and contact, a short mission, benefits with data, three case studies (client request, then solution), a three-phase process with durations, pricing stated plainly with its factors and a base price, testimonials, contact. Borrowed as discipline only: one idea at a time, proof before process, process then price, price stated plainly, then a single contact. The page already ran in that order; what changed is how each step is staged. No layout, colour, font or structure of the deck was used.
- **What made the previous version a landing page:** every section opened with the same big heading plus paragraph; the four offers were a ruled list of rows (a feature list); light, dark and sand bands with identical padding read as nine modules; the creative range was a justified gallery plus a list (a services grid); the scope figure sat on its own sand band (a pricing section); the outro was a dark block with buttons (a CTA section); and with no media the page collapsed to text rows, so its composition could not be judged at all.
- **What replaced it:** one paper canvas with three recurring compositions (ANCHOR, IMMERSIVE, EDITORIAL, described at the top of `src/styles/automotive.css`); full-bleed media only where a moment is immersive (opening, BMW, exterior), cut on the logo's diagonal; a single shared frame beside the offers; overlaps and bleeds instead of rows; silent structural plates wherever media is missing.

## Cycles

### Cycle 01: The page as one canvas

- Observation: nine banded modules, each opening with the same heading and paragraph.
- Change: sections kept for landmarks and headings but recomposed so they run into one another: paper throughout, three immersive frames as the only dark moments, diagonal cuts at their edges, the offers frame rising into the opening, varied spacing between moments instead of one uniform gap.
- Verification: contact sheets at 1440x900 and 390x844 (`docs/ux-evidence/automotive-art-direction-*-sequence.jpg`) and a full-page overview: dark appears only in the opening, BMW and exterior; the rest is one surface.
- Outcome: PASS.

### Cycle 02: Offers, the sticky frame

- Observation: the four offers were four ruled rows. Recomposed as one large typographic sequence with a single frame beside it that shows the picture of the offer in view (pure CSS sticky, a small script only switches which offer is active).
- Defect found: the frame did not stick. A `top` value was being reset by an `inset: auto` shorthand declared after it.
- Change and verification: order fixed; a scroll script at 1440, 768 and 390 shows the frame pinned (top 99px on desktop, 0 in the stacked layout), the active offer moving 0, 1, 2, 3 and the frame shown always matching it, with the frame visible at every step.
- Outcome: PASS.

### Cycle 03: Opening

- Observation: an orange logo fragment sat behind the headline, a 1px line of the opening showed under the diagonal, and the plate's glass-panel plane looked like a UI card on the dark title.
- Change: fragment moved off the type, the diagonal overlaps the last pixel row, the plane removed.
- Verification: re-captured at 1440 and 390, with and without media.
- Outcome: PASS.

### Cycle 04: Plates (media that is not there yet)

- Observation: the brief asks for intentional composition before the media exists, without placeholder names or ugly cards.
- Change: a plate is a tonal gradient with one soft sheen, drawn from the site palette in six tones, no text, no border, no radius, `aria-hidden`. A test asserts that every CSS `content` value on the page is empty and that plates are empty hidden spans. A first version also carried a faint hairline grid, borrowed from the site's existing placeholder; the design hook flagged it as a decorative grid with no purpose on a stand-in field, and it was removed (the captures were retaken afterwards).
- Verification: screenshots of BMW, exterior, Ferrari and the range in the scaffold state; the rendered text of the page contains no placeholder word.
- Outcome: PASS.

### Cycle 05: Fracture seam on a still panel

- Observation: after the rewrite the faint diagonal hairline was back on the Ferrari panel; the fix from Part 13 had been dropped with the old stylesheet.
- Change: restored, scoped to this route (the shared shard shapes are untouched).
- Verification: 1440 screenshot at rest, one continuous surface.
- Outcome: PASS.

### Cycle 06: BMW, supporting photograph

- Observation: on a phone the supporting photograph, hanging from the foot of the frame, sat on top of the caption text.
- Change: it now straddles the frame's cut top edge, clear of the caption at every width.
- Verification: stand-in media, 390 and 1440 screenshots, plus the collision audit in cycle 08.
- Outcome: PASS.

### Cycle 07: Creative range

- Observation: eight frames at unrelated heights left large voids in the field, and the earlier justified rows read as a gallery.
- Change: an irregular 12-column field with per-frame span, drop and ratio balanced row by row, labels over the pictures, the heading on a grid with its body; a staggered two-column mosaic on phones. A real still keeps its own ratio within limits.
- Verification: stand-in media at 1440 and 390: dense, irregular, every label legible, nothing cropped harder than the limits.
- Outcome: PASS.

### Cycle 08: Tablet and every width

- Observation: at 768 the 12-column grids with a 2.5rem gap left columns about 19px wide; the workshop caption ran 2px past the viewport and the launch pair was 150px wide.
- Change: a column-gap variable (tighter below 1024), tablet-specific spans for the pair and the about block, the workshop caption below its frame until 1024.
- Verification: a scripted audit at 360x800, 390x844, 768x1024, 1024x768, 1280x720, 1440x900 and 1920x1080 (real text-line rectangles against picture frames, and text against text): 0 horizontal overflow, 0 collisions, 0 overlaps, headline 4 lines on phones and 2 from 768, intro inside the first viewport at all seven, no console error. The first version of the audit reported false collisions by comparing whole element boxes; it was corrected to compare text lines.
- Outcome: PASS.

### Cycle 09: Media states

- Method: stand-in stills (and clips) at the intended ratios, then states removed one by one.
- Verification: video-only hero (plain video, no poster, playing); video-only BMW with a detail (video main, the detail becomes the supporting photograph); Ferrari with only its detail (its frame stays a plate, the detail shows); a video with a poster below the fold is `preload="none"`; no console error in any state.
- Outcome: PASS.

### Cycle 10: Reduced motion and no JavaScript

- Method: real `prefers-reduced-motion` emulation, and a browser context with JavaScript disabled.
- Verification: reduced motion, on load and without scrolling: all 29 reveal targets visible, no growth transform, the opening's CSS entrance off, clips paused on posters, fracture shards settled, the offers frame still following the offer in view (a state change, instant). No JavaScript: the H1, all four offers and every approved line are in the HTML with no inline hiding.
- Defect found: with JavaScript off the browser draws native player controls over the opening clip. Hidden with a rule scoped to this page.
- Outcome: PASS.

### Cycle 11: Layout shift

- Measurement: a `layout-shift` observer on fresh pages, full scroll-through, media present. The first run gave 0.004 to 0.007 on desktop and tablet, from the opening's intro paragraph re-wrapping when the web font swapped in.
- Change: three lines are reserved for the intro from 768 up.
- Verification: re-measured at 1920, 1440, 1280, 1024, 768, 390 and 360: 0 at all seven. Local dev server and locally served fonts, not field data.
- Outcome: PASS.

### Cycle 12: Keyboard and tap targets

- Verification: real Tab presses: skip link, WhatsApp, Email, Explore, each `:focus-visible` with the site's 2px orange ring. The exits are 99px, 99px and 49px tall on desktop and 65px, 65px and 48px on a phone, all above 44px.
- Outcome: PASS.

### Cycle 13: Contrast

- Computed: inactive offer titles (ink at 56% on paper) 4.0:1 for large type; labels on paper 4.7:1; body 7.3:1; exits 15.8:1. Two findings: the clay hover on paper is 3.45:1, fine for the large exits but not for the small "Explore" line, which no longer changes colour on hover (underline instead); and the caption scrims left about 2:1 in the worst case of pure white footage.
- Change: stronger scrims, a soft text shadow on text set over media, the quiet exit's hover.
- Limit: real footage decides the rest. Contrast of the opening title, BMW and exterior captions over the supplied media is BLOCKED until it exists.
- Outcome: PASS for everything measurable now.

### Cycle 14: Build, indexation, protected areas

- Verification: `CONTENT_SOURCE=fixtures npm run build`: 29 pages, sitemap unchanged at 27 URLs, `/automotive` is `noindex, follow`, absent from the sitemap, no site footer and no site navigation in the built HTML, no em dash, no placeholder word, the three `data-track` events present, "all reachable from the homepage: true (1 noindex outreach page exempt: /automotive)". `routes.ts`, `sitemap.ts`, `publishing.ts`, `relations.ts`, the content adapter and the enquiry module untouched.
- Outcome: PASS.

### Cycle 15: Final regression

- `npx astro check`: 0 errors, 0 warnings, 10 hints (no new hint from this pass; eight pre-date the work and two come from the new test file's loader convention).
- `npm test`: 97 of 97 (89 existing plus 8 for this route).
- Lighthouse on the production preview, scaffold state, mobile and desktop: Accessibility 100, Best Practices 100, SEO 66, the one failed audit being "Page is blocked from indexing", the intended `noindex`. Automated audits only, no certification, no performance score claimed.
- Working tree: stand-in media removed (`src/assets/` absent, no `automotive-*` file in `public/videos/`), work captures removed, the browser tools' output folder removed.
- Evidence: `docs/ux-evidence/automotive-art-direction-desktop-1440x900-sequence.jpg` and `docs/ux-evidence/automotive-art-direction-mobile-390x844-sequence.jpg`, twelve viewport captures each, taken in the scaffold state (plates, no media) with Astro's dev overlay hidden. There is deliberately no capture with stand-in images: they are not automotive work.
- Outcome: PASS for what can be verified without real media. BLOCKED, not passed: how the composition reads with the real photographs and footage; contrast over that footage; iOS Safari and real-device behaviour of the sticky frame and autoplay.
- Cycles completed: 15 of the minimum 15.

---

# Part 15: /automotive rebuilt from the deck (brief received 30 September 2026)

Third brief on the same route: rebuild the page completely from the attached deck ("Impact Murals: Automotive.pdf") as a premium, responsive web page and not a slideshow, following the deck's hierarchy, flow, typography, image dominance and pacing, with the existing site as the brand system. Scope: the whole page. The Part 13 and Part 14 versions were replaced, not adjusted.

## Deck and diagnosis

- **The deck.** Eleven 16:9 pages, read in Chrome's PDF viewer (there is no local PDF renderer) and as extracted text. Ink and paper alternate; the "images" are flat greige placeholder frames (there are no photographs in it); titles are large uppercase grotesque, labels are small mono type, the process is a four-row ledger, the budget is one huge figure with two sentences. Its two colours match the site's own tokens, so the site's palette, fonts (Instrument Sans, Archivo, IBM Plex Mono) and `.headline-display` were kept and no colour or font was added.
- **Deck against brief.** They differ in wording, in the order of the proof sections and in a few layouts (listed in `docs/UX-HANDOFF.md`, Part 15). The brief's wording and order were used and the deck's layouts, because the brief states its order is intentional and gives its copy line by line. Every wording difference is flagged for confirmation.
- **The Part 13/14 page** followed a different copy set and a different art direction (a sticky offers frame, diagonal cuts, tonal plates, an eight-frame range). Nothing of its composition fits the deck, so it was removed wholesale. Kept because it still holds: the media resolver idea, the placeholder plate (now flat), the `minimal` layout, `noindex`, the sitemap exemption, the shared contact details, the site's fracture reveal and video starter.
- **Media in the repository.** None that is automotive: `src/assets/` did not exist and `public/videos/` holds only the four site videos and their posters. So every slot is a placeholder, and the review below tests real-media behaviour with temporary stand-ins (removed afterwards).

## Cycles

### Cycle 01: First render against the deck, desktop

- Observation: at 1440 the structure and rhythm follow the deck (paper and ink alternation, the two-column offers with the tall picture, Ferrari as a wide frame with the label left and the title offset, the workshop text-left, the launch pair unequal). Two defects: the exterior caption inherited the Ferrari caption's 12-column grid, so its title wrapped into a one-column strip and overlapped its own label; and the BMW right column (title, line, summit picture, its line) was about 40% taller than the cinematic frame, leaving the frame floating with a gap beneath it.
- Change: captions stack by default and only the Ferrari caption is a grid; BMW was recomposed as the frame with the copy beside it and a quiet supporting strip beneath (close-up, then the summit picture with its "Also:" line).
- Verification: recaptured at 1440: the exterior title sits on one line under its label; the BMW frame and copy align and the strip reads as a footnote, not a second feature.
- Outcome: PASS.

### Cycle 02: First render, phone

- Observation: at 390 a min-height written for the exterior's main frame also applied to its close-up, stretching it into a tall sliver that ran into the title; and the hero title broke as "VEHICLE / ART & LIVE", splitting the phrase.
- Change: the min and max height apply to the main frame only; the headline carries a non-breaking space so "VEHICLE ART" stays together.
- Verification: recaptured at 390: no collision (the audit in cycle 08 counts none), the title reads "MURALS, / VEHICLE ART / & LIVE / PAINTING".
- Outcome: PASS.

### Cycle 03: Tablet

- Observation: at 768 the 12-column grids have about 38 px columns with the 1.25 rem gap; the offers stay a 2x2 beside the tall picture, BMW and the workshop stack (frame, then type) and switch to two columns at 1024.
- Decision: no change. The screenshots at 768 and 1024 read correctly and neither overflows; the tablet-specific gap variable from the earlier version was the reason it holds, and it was carried over.
- Outcome: PASS, confirmed without a change.

### Cycle 04: Stand-in pictures, legibility and the fracture seam

- Method: 18 generated stills (bright and dark, several ratios, corner markers to show cropping) and two existing site clips, in place of the missing media. Not automotive work; used only to test.
- Observation: over a bright stand-in hero the logo and the `CONTACT` link had about 1.7:1 in the worst case, and the faint diagonal hairline between the two fracture shards on the Ferrari frame was back (the fix from the earlier version had gone with the old stylesheet).
- Change: a soft top veil (58% ink fading over the first 24%) and the jump link at full paper colour when there is media; the first shard runs 1.5 px under the second, scoped to this route.
- Verification: hero recaptured with a real clip at 1440 and 390: logo, link and title legible; a 2x crop across the seam band is one continuous surface.
- Outcome: PASS with the stand-in. Contrast over the real footage is BLOCKED until it exists.

### Cycle 05: Video behaviour

- Verification: the hero clip has `muted`, `loop`, `playsinline`, no `autoplay` attribute, `preload="metadata"` (it is above the fold), a poster (the hero still) and plays; the BMW clip below the fold has `preload="none"`, a poster, is paused with `readyState` 0 until scrolled near, then plays. A hero clip with no still at all has no poster attribute, `preload="metadata"` and plays as a plain video.
- Outcome: PASS. (On the dev server Chromium reports aborted media range requests and one `ERR_CACHE_OPERATION_NOT_SUPPORTED` for the clips: the browser cancelling and re-requesting byte ranges, not an application error, and not seen elsewhere.)

### Cycle 06: Media states

- Observation: the summit picture (BMW) would have stayed a placeholder at launch if only the main picture were supplied.
- Change: the summit picture now behaves like the close-ups (shown only when it exists, or while the main picture is missing); without it the "Also:" line stands alone.
- Verification, states removed one by one: main present and every close-up absent (close-ups vanish, layouts hold: Ferrari, exterior, workshop, BMW with its line alone); close-ups present and mains absent (Ferrari shows a plate main with its close-up; BMW a clip with its strip); video-only hero. No console error in any state.
- Outcome: PASS.

### Cycle 07: Reduced motion and no JavaScript

- Method: a real `prefers-reduced-motion: reduce` context and a JavaScript-disabled context.
- Verification: reduced motion, on load and without scrolling: all 31 reveal targets fully visible, no picture scaled, the hero entrance animation off, both clips paused on their posters, fracture shards settled. No JavaScript: all 22 checked approved strings (headings, offers, the BMW line, labels, figure, both contact details, the location) are in the HTML, and no inline style hides anything.
- Outcome: PASS.

### Cycle 08: Seven widths

- Method: a scripted audit at 360, 390, 768, 1024, 1280, 1440 and 1920 (real text-line rectangles against picture frames and against other text, not whole element boxes; a layout-shift observer over a full scroll).
- Verification: no horizontal overflow, layout shift 0, no text colliding with a close-up or with other text, the headline four lines on phones and two from 768, the hero's line inside the first viewport, every link at least 45 px tall. Run again on the production build at the end (cycle 17) with the same result.
- Outcome: PASS.

### Cycle 09: Pacing

- Observation: the range section was the tallest (about 1760 px at 1440, close to two screens), a 3:2 photograph would run the Ferrari frame to about 820 px so its caption fell below the fold, and the process ledger and the contact block carried more padding than their weight.
- Change: range rows and offsets tightened; the Ferrari frame's wide clamp raised so a 3:2 photograph is capped at about 770 px at 1440 (it was about 820); process padding to 85%; contact padding trimmed.
- Verification: measured at 1440 on the scaffold: range 1688 px (was about 1759), process 967 (was 1015), contact 898 (was 969); the whole page 12028 px at 1440 and 10656 at 390.
- Outcome: PASS. The page is long by design (eleven moments), but each moment is one to two screens and a phone reader reaches the budget after about ten.

### Cycle 10: Accessibility tree

- Verification: the tree lists twelve named regions (one per section, each named by its heading; the launch pair by its "Launch Artwork" label), one H1, H2 per moment and H3 for offers and steps, ordered lists for the process, real alt text on every real picture, decorative frames and plates absent, the numerals hidden from assistive technology.
- Defect found: the contact links' label and value were separate spans with no space between them.
- Change: an explicit space, so the accessible names read "WHATSAPP +971 58 195 7567" and "EMAIL alexis@impactmurals.ae".
- Outcome: PASS.

### Cycle 11: Keyboard and the only navigation

- Verification: real Tab presses: skip link, `CONTACT`, WhatsApp, Email, the website link, each with the site's 2 px orange focus ring. The jump link lands on `#contact`. Defect found: the scripted check showed that at 1280x720 the contact block was taller than the screen after the jump (the section's top padding was generous).
- Change: contact padding trimmed (top 70%, bottom 85% of the section rhythm).
- Verification: after loading `#contact`, both contact lines and the website and location line are on screen at 1280x720, 1440x900, 1024x768, 390x844 and 360x640.
- Outcome: PASS.

### Cycle 12: Contrast

- Method: computed from rendered colours (alpha composited over the real ancestor background) for 73 text elements at 1440 and at 390, scaffold state.
- Verification: every element meets 4.5:1 (3:1 for large text). The lowest are the mono eyebrows and numerals at 4.7:1 (stone on paper), the dim scope sentence at 6.6:1 and the body copy at 7.3:1. Only the decorative contact arrow fell short (4.35:1 at 20 px on a phone).
- Change: the arrow is 24 px minimum, which puts it in the large-graphic class (3:1).
- Limit: the hero title, the eyebrow and the small labels over real footage are BLOCKED; a soft scrim and a text shadow are in place for it.
- Outcome: PASS for everything measurable now.

### Cycle 13: Loading behaviour, development against production

- Observation: on the dev server all 17 stand-in pictures loaded immediately although every `<img>` is `loading="lazy"`; a control (twelve lazy images far below the fold) showed lazy loading works in that browser.
- Verification on the production build: only the pictures near the fold load. Before any scroll, on a phone and on desktop, four pictures were requested (the hero poster, the BMW clip's poster, the What we do picture and the Ferrari frame) plus the hero clip; the other thirteen waited. So the eager loading is dev-only.
- Change found while reading the requests: a browser fetches a video's poster even with `preload="none"`, so a below-the-fold clip's poster is an early request. Posters are now capped (hero 1920, BMW 1600). The media resolver also built an extra fixed-width file for every slot although only video posters and the fracture panel use one; it now builds it only for those, which stops unused files reaching `dist`.
- Outcome: PASS.

### Cycle 14: Wide screens

- Observation: at 1920 the About picture bled to the edge of the 1800 px content column, not to the edge of the page (about 60 px short).
- Change: a `--bleed` distance (the width beyond the content column plus the gutter) drives the negative margin, so the picture reaches the page edge at any width.
- Verification: at 1920 the picture starts at the left edge of the page; the rest of the page scales without change (hero title capped, wrap capped at 1800).
- Outcome: PASS.

### Cycle 15: Cold prospect walkthrough

- Method: read top to bottom as someone who has never heard of the studio, asking the brief's nine questions in order (expert scenario check, not user research).
- Result: what it does (hero, offers) in the first screen and a half; artistic quality (Ferrari, the first and quietest proof); real automotive experience (BMW / Binance, with the summit as a footnote); scale (the exterior, edge to edge); application (a workshop); breadth (four frames, eight directions as labels); process (four lines); budget (one figure, stated plainly, with the flexibility sentence); who is behind it and how it works (About: Alexis leads, specialist artists per brief, one point of contact); how to reach it (two large lines at the close, and a jump link at the top for a reader who is already convinced).
- Checked for invented claims: no client, result, statistic or date beyond the brief; Ferrari appears only as the subject of a private client's mural and the exterior names no marque; the directions are labelled as directions. A test pins the wording.
- Decision: no change; the page answers each question where the brief's order puts it.
- Outcome: PASS.

### Cycle 16: Build, indexation, protected areas

- Verification: `CONTENT_SOURCE=fixtures npm run build`: 29 pages, sitemap unchanged at 27 URLs, `/automotive` is `noindex, follow`, canonical `https://impactmurals.ae/automotive`, not in any sitemap, no site header or footer, no em dash, no visible placeholder name, the four `data-track` events present. `routes.ts`, `sitemap.ts`, `publishing.ts`, `relations.ts`, the content adapter and the enquiry module are untouched; the only shared-file changes are the ones from Part 13 (`BaseLayout` `minimal` prop, `Contact` icon import, the `OUTREACH_ROUTES` exemption).
- Outcome: PASS.

### Cycle 17: Final regression

- `npx astro check`: 0 errors, 0 warnings, 10 hints (eight pre-date the work, two are the deprecated `register` notice of the new test file, as before).
- `npm test`: 101 of 101 (89 existing, 12 for this route: not in the sitemap, noindex and no chrome, section order and no leftover component, the brief's wording with no em dash, contact details reused, accurate client labelling, slot identifiers documented and never rendered as text, silent flat plates, offers as a plain list, restraint (no radius, shadow, snapping, pinning, full-height sections), video behaviour, the build exemption).
- Lighthouse on the production preview, scaffold state, mobile and desktop: Accessibility 100, Best Practices 100, Agentic Browsing 100, SEO 66; the one failed audit is `is-crawlable`, the intended `noindex`. Automated audits only, no certification, no performance score claimed.
- Working tree: stand-in media moved out of the project (deleting the folders was blocked, so the files were moved to a temporary folder; two empty folders remain, which are the intended drop locations), the old evidence moved out, the new evidence added.
- Evidence: `docs/ux-evidence/automotive-rebuild-desktop-1440x900-sequence.jpg` and `automotive-rebuild-mobile-390x844-sequence.jpg`, twelve section captures each, taken on the production build in the scaffold state (flat plates, no media). There is deliberately no capture with stand-in pictures: they are not automotive work.
- Outcome: PASS for what can be verified without real media. BLOCKED, not passed: how the composition reads with the real photographs and footage; contrast over that footage; performance with real media; iOS Safari and real-device autoplay; analytics (no system exists).
- Cycles completed: 17 of the minimum 15, each a real inspection followed by a change or a recorded reason to keep, and a re-check. Cycles 03 and 15 were confirmed correct without a change.

---

# Part 16: /automotive media integration, UX and performance pass (brief received 1 October 2026)

Fourth brief on the route: the real photographs and clips were supplied (seven photographs, five clips, in a folder outside the project; the project's media folders were empty). Audit them, replace every placeholder, recompose each section around the media rather than swapping one for one, keep the commercial order, show portrait clips in premium editorial layouts, defer and cap video, keep the opening fast, and review as a cold prospect and for performance and accessibility. The structure and copy from Part 15 were kept; the layouts, the media code and the stylesheet were rebuilt.

## Media and diagnosis

- **What was supplied.** Seven JPEGs (phone photographs carrying an EXIF rotation, 780x470 to 2252x4000; two near-duplicates of the finished exterior wall, two views of the Ferrari wall, the McQueen / Porsche mural, the wall before the exterior mural, the finished BMW at an outdoor event) and five MP4 clips (BMW / Binance, a canvas painting, iCAUR, Jetour, a workshop mural), all vertical.
- **What was wrong with the clips.** HEVC with an AAC audio track, 7.7 to 14.7 Mbps, 83 MB in total, with the index (moov) at the end of the file. HEVC does not play reliably in Chrome, Firefox or Edge, and an index at the end makes playback wait for the whole file. They could not be shipped as they are.
- **No encoder was available.** There is no `ffmpeg` on the machine and downloading a binary is not allowed here, so the re-encode was done with WebCodecs in the Chromium that the review tooling provides (it decodes HEVC and encodes H.264), with a small MP4 reader and writer written for the purpose. The output was checked structurally (H.264 High, moov first, no audio, about 30 fps, keyframes at least every 2 s and at cuts) and frame by frame. The tooling is not part of the project; the media guide gives the equivalent `ffmpeg` command.
- **What it means for the layouts.** Everything is portrait or near square, so the Part 15 compositions (a wide Ferrari band, an edge-to-edge exterior, a wide workshop frame, wide launch tiles) could not be filled; they were recomposed.
- **Environment note.** The headless browser used for the review renders at about 1.5 frames per second on every page of the site (the homepage 0.5), so entrance animations cannot complete there. Stills of the page were taken with the text entrances forced to their end state and said so in the evidence note; behaviour (loading, playback, states) was verified by reading the page's state, not by eye.

## Cycles

### Cycle 01: Media audit

- Observation: each file was probed read-only (dimensions after EXIF rotation, codec, bitrate, index position, audio) and looked at (contact sheets of the photographs, frame sheets of every clip). Strongest: the Ferrari mural, the BMW clip, the finished exterior wall, the McQueen poster, the canvas clip. Redundant: `RR MURAL AFTER` (the same wall, with a person in frame), `20260814_200545` (the Ferrari wall again, 40 per cent skylight). Brand cards, an agency end card and a white flash sit inside the clips.
- Decision: use 13 pictures and clips; do not use the two redundant photographs; cut the cards and the flash; use the finished exterior view and the "before" as a pair. No slot is filled for its own sake: no portrait of the founder, no summit photograph, no workshop close-up were supplied, so those sections are set in type or a single line.
- Outcome: PASS (decisions in `docs/AUTOMOTIVE-MEDIA.md` and the handoff).

### Cycle 02: Clip encoding

- Observation: 83 MB of HEVC, index last (see above). A first BMW re-encode kept the BMW logo card at the head and the agency end card at the tail (found by looking at every cut, not by trusting an automatic cut detector: the BMW sequence cuts about every 0.43 s on purpose).
- Change: re-encoded to H.264 High, 30 fps, 720x1280 (iCAUR 592x1280, as supplied; Jetour brought down from 1080x1920 at 60 fps), 1.4 to 1.8 Mbps, no audio, index first, trimmed to the strongest passages.
- Verification: structure probe and frame sheets at the cut seams; 8.5 MB in total. A new test checks every clip in the folder is H.264, has its index first, has no audio and is under 3 MB, and was run against the original HEVC clip as a negative control (it fails all four).
- Outcome: PASS.

### Cycle 03: Posters

- Observation: the first frames are poor posters (the canvas clip opens on a pencil sketch, the Jetour clip on a white flash) and the strongest frames are not the first.
- Decision: each poster is the strongest frame of its finished clip (the finished canvas, the hood close-up, the artist at the mural, the SUV with the guest, the white SUV under the banners). The clip fades in over it in 0.7 s instead of seeking to the poster's time, which would break the loop. A reduced-motion or script-less visitor sees the strongest frame for good.
- Verification: frame sheets at 0, 0.5, 1.5, the middle and the end of every clip, viewed.
- Outcome: PASS (the BMW poster against its first frame is flagged for approval).

### Cycle 04: First composition with the real media, 1440 and 390

- Observation: the structure held (split hero, tall clips beside the offers and the BMW title, the Ferrari with a side column, a before and after, a staggered pair, a three-part range). Defects: a one-pixel light line between the two consecutive dark sections (BMW, then Exterior) where a fractional section height leaves a gap; headings looked grey in the captures, which is not a defect (computed opacity 0.65 mid-animation, the same on every page of the site because of the 1.5 fps rendering).
- Change: the Exterior section overlaps the BMW section by one pixel.
- Verification: pixel rows across the boundary at 1440 and at 2x pixel density are uniformly the ink colour; the text colours are correct once an entrance finishes.
- Outcome: PASS.

### Cycle 05: Hero picture

- Observation: two candidates, both with real resolution: a close crop of the exterior mural (a winged figure, black and chrome on a pale wall) and a crop of the Ferrari wall. Both were put in the real layout at 1440 and 390.
- Decision: the exterior mural crop. The Ferrari crop is more obviously "automotive" and sits better on the dark page, but it cut the lit signature mid-word, carried a cream wall with a quotation fragment at its foot, and would have repeated the very next section; the exterior mural then reappears five sections later as the wide view and its before, with the opening crop and the wide view clearly different.
- Verification: both captured at 1440 and 390 and compared; the chosen crop keeps the figure's head and wings in the panel at every width checked from 390 to 2560 (object-position 50% 38%).
- Outcome: PASS (decision flagged for your approval; no brand name is in the copy or the alt text).

### Cycle 06: When the clips load

- Observation: on the first full network capture the first below-the-fold clip (What we do, 1.5 MB) was requested about 1.1 s after load with no scroll at all.
- Change: observation of the clips starts only after `load`, an idle moment and the visitor's first sign of going below the opening screen (scroll, wheel, touch, key press, click, or a page that opens already scrolled).
- Verification on the production build: before any scroll, 17 requests and no clip (the hero plus the two near-fold pictures the browser fetches on its own); after scrolling the whole page, exactly five clip requests, one each; no duplicate request, no failed request. (On the development server the clips were seen to arrive one at a time as each section was approached.)
- Outcome: PASS.

### Cycle 07: Playback behaviour

- Verification, read from the page's state in a real context: at the top nothing is attached and no button is shown; at What we do only that clip is attached and playing; at the BMW section that clip plays and the What we do clip pauses; at the Launch pair both play (two at once is the cap on large screens); a hidden tab pauses all. Resuming after a back/forward-cache restore is implemented (a page-show handler) but was not exercised here. A clip whose file returns 404 is requested twice (one retry), never fades in, its button is removed and its poster stays.
- Outcome: PASS.

### Cycle 08: The pause and play button

- Observation: the first accessible name carried the whole picture description (one ran to over 120 characters with two colons); the glyph would vanish in Windows high contrast (backgrounds are replaced).
- Change: the name uses the first clause of the description ("Pause video: A BMW painted live during Binance Blockchain Week"); a forced-colors rule draws the glyph in system colours.
- Verification: real Tab presses on the production build: skip link, CONTACT, the five buttons in page order, WhatsApp, email, the website link, each with a 2 px or 3 px signal-colour ring; Space pauses (name becomes "Play video: ..." and the play glyph shows), Enter resumes. The focus ring and the paused state are in `automotive-media-pause-control-1440x900.jpg`. A Lighthouse snapshot taken with the clips playing and the buttons shown: Accessibility 100.
- Outcome: PASS.

### Cycle 09: Reduced motion, no JavaScript, saved data, slow connections

- Observation: only the first two had been designed for; Save-Data and a 3G connection should also cost no clip bytes.
- Change: a Save-Data or 3G-or-slower connection (where the browser reports it) behaves like reduced motion.
- Verification on the production build, with scrolling through the whole page: reduced motion (no clip attached, no button displayed, posters loaded, reveals at full opacity, the Ferrari panel settled), JavaScript disabled (18 of 18 approved strings present, no button displayed, 5 of 5 posters loaded), Save-Data and 3G (no clip request, no button). All with zero clip requests.
- Outcome: PASS.

### Cycle 10: Tablet

- Observation: at 768 the 12-column grid gives about 38 px columns, so the Launch pair at 4 and 3 columns was about 213 px and 150 px wide: small clips side by side.
- Change: from 768 the pair takes 6 and 5 columns; 4 and 3, staggered near the middle, from 1024.
- Verification: on the final build at 768 the two clips measure 322x573 and 265x574; the rest of the page (stacked hero, side columns, offers list beside the clip) read correctly at 768 and 1024 without change.
- Outcome: PASS.

### Cycle 11: Laptop and wide screens

- Observation: at 1280x720 the BMW clip, its type and the finished car are all on one screen, because every portrait frame is capped to a share of the viewport height. At 1440 the hero title's longest line filled only about 72 per cent of its column.
- Change: the hero title is sized so that line fills about 85 per cent of its column.
- Verification: the real text width against its column at 1024, 1100, 1180, 1280, 1366, 1440, 1536, 1920 and 2560 on the final build (83 to 92 per cent, never overflowing); 1920 and 2560 captured: the 1800 px content column centres, the hero spans the page.
- Outcome: PASS.

### Cycle 12: Width matrix

- Verification: 19 widths from 320 to 2560 on the final production build: no horizontal overflow at any, except an artefact at exactly 320 in desktop Chromium (a 15 px classic scrollbar against the site's 320 px minimum width, which phones, with overlay scrollbars, do not have).
- Outcome: PASS.

### Cycle 13: Phone, media section by section

- Observation: the Workshop clip had the same width as the BMW clip, so two tall clips in a row repeated each other; elsewhere no clip sits side by side with another on a phone, nothing swipes, and no clip is taller than 74 to 76 per cent of the screen.
- Change: the Workshop clip is 82 per cent wide and right-aligned (BMW's is the one near full width, as the centrepiece); What we do sits beside its lead line; the Launch clips are 72 and 58 per cent, offset.
- Verification: the full page at 390x844 (and 360, 375, 414 for overflow), the clip heights in `svh`, the order of sections.
- Outcome: PASS.

### Cycle 14: Contrast over media

- Method: the only text on a photograph is the logo and the jump link at the top of the hero on a phone. With them hidden, the pixels under each box were read from a real capture and compared with the paper colour.
- Verification: worst-case pixel contrast 3.58, 4.28 and 4.83 for the logo (a graphic, 3:1 needed) and 5.92, 6.06 and 8.11 for the 12 px link (4.5:1 needed) at 390, 360 and 768. The title, the eyebrow, the intro and every caption sit on ink or paper, never on a photograph.
- Outcome: PASS (the soft top shade is what makes it hold).

### Cycle 14b: Contrast of everything else

- Verification: Lighthouse Accessibility 100 on the production build, mobile and desktop, navigation and snapshot modes; the text styles are unchanged from Part 15, whose rendered-colour audit passed.
- Outcome: PASS.

### Cycle 15: Accessibility tree and alt text

- Observation: the tree is clean (one H1, regions named by their headings, a real alt text on each of the 13 pictures, the clips and the logo hidden, the buttons named). Defects found in the draft text: the hero and the finished-exterior pictures had near-duplicate descriptions, and the buttons' names were long.
- Change: each description is distinct and says what that frame shows (the hero: a close view; the exterior: the whole wall with scaffolding); a test requires 13 distinct descriptions of at least 20 characters that do not announce themselves as images, and only the hero eager.
- Outcome: PASS (please read the descriptions once, listed under "Decisions to confirm").

### Cycle 16: Crops against their sources

- Observation: looking at three crops beside their full sources found defects of my own making: the top of the word "McQUEEN" was cut off, the black horse's head in the Ferrari close-up was cut by the top edge, and the main Ferrari frame ended on a cut quotation and a logo on the wall beneath the artwork.
- Change: the Porsche crop starts at the top of the poster and drops the neighbouring prints; the close-up starts higher; the main Ferrari frame is 1.04:1 and anchored to the top, so its foot is outside it.
- Verification: the new crops viewed beside the old ones and against the sources; the page recaptured at 1440 and 390.
- Outcome: PASS.

### Cycle 17: The seam on the Ferrari panel, found only with the real photograph

- Observation: with the real photograph, a faint light diagonal line runs across the car at 2x pixel density, exactly along the cut between the two fracture shards. Part 15 had verified this with synthetic stand-in pictures, where a seam across a flat gradient is invisible.
- Diagnosis by experiment: with both cuts removed the line is gone; with one shard hidden, gone; with the frame background black, or the shards' layer properties removed, still there. So it is the anti-aliased edge of the upper shard's cut blending over the lower copy at a fractional pixel position, not a gap and not compositing.
- Change: once the entrance has settled (the shared script marks the panel) the cut is dropped, leaving one whole picture; the cut is still used during the entrance.
- Verification: 2x crops across the band in reduced motion (settles at once) and in normal motion (waited for the entrance to settle): no line.
- Outcome: PASS.

### Cycle 18: Performance

- Verification on the production build: LCP is the hero picture (179 to 202 ms on desktop 1440 unthrottled; 1006 to 1164 ms on a 390 px phone at 3x with Fast 4G and a 4x CPU slowdown), CLS 0.00 in the traces and over a full scroll with the clips loading, at 1440 and 390; page HTML 36 KB; route stylesheet 17.7 KB; the hero is 59 KB at 1440 and 150 KB on a 3x phone; no console message. Lighthouse mobile and desktop: Accessibility 100, Best Practices 100, Agentic Browsing 100, SEO 69 (the single failed audit is `is-crawlable`, the intended `noindex`).
- Observation: the critical path (two render-blocking stylesheets, three fonts, the shared GSAP) is the site's, not this route's; the route adds a 4.1 KB script.
- Decision: no change. Long caching for `/videos/` is deploy configuration and was left; noted in the handoff.
- Outcome: PASS.

### Cycle 19: Cold prospect walkthrough

- Method: read top to bottom as someone who has never heard of the studio, asking the brief's questions in order (expert scenario check, not user research).
- Result: what it does is clear in the first screen (the three lines of the offer beside a very large mural); the strongest proof comes early (the Ferrari, then the BMW being painted live, with the event named); scale and its before and after next; application (a workshop owner sees the artist at work in a garage); launches (two clips, named, no case study); breadth (two pictures and eight directions); process, a budget stated once, and who is behind it (type only). No client, result or figure is claimed beyond the brief; Ferrari is only the subject of a private client's mural; the exterior names no marque.
- Weak points, recorded not hidden: the Ferrari photograph is a tilted documentary shot taken from a staircase; the range has two pictures; the before photograph is a slightly different framing; a muralist's tag is visible on the Ferrari photograph; the opening picture is recognisable as an emblem. All are in "Decisions to confirm".
- Decision: no change; each is a content decision, not a layout one.
- Outcome: PASS.

### Cycle 20: Build, tests, protected areas

- Verification: `npx astro check` 0 errors, 0 warnings, 10 hints (eight pre-date the work, two are the deprecated `register` notice of the route's test file); `npm test` 105 of 105 (16 for this route); `CONTENT_SOURCE=fixtures npm run build` exit 0, 29 pages, sitemap unchanged at 27 URLs, `/automotive` is `noindex, follow`, canonical `https://impactmurals.ae/automotive`, not in any sitemap, no site header or footer, no em dash, no `autoplay`, no clip in the markup as a source. The protected files (`routes.ts`, the sitemap code, the content adapter, the enquiry module, `validate-content.mjs`, the shared fracture and autoplay code) are unchanged in this pass.
- Outcome: PASS.

### Cycle 21: Final regression

- Verification after the last edit, on a fresh production build: the full check, test and build above; the fallbacks (reduced motion, no script, Save-Data, 3G), keyboard, contrast, network and layout shift re-run on that build; the evidence sequences retaken on it (the Ferrari panel left to settle on its own).
- Evidence: `docs/ux-evidence/automotive-media-desktop-1440x900-sequence.jpg`, `automotive-media-mobile-390x844-sequence.jpg` (twelve sections each, real media) and `automotive-media-pause-control-1440x900.jpg`.
- Outcome: PASS for everything verifiable here. BLOCKED, not passed: iOS Safari and real-device autoplay (including Low Power Mode), Firefox and Safari rendering, analytics, smoothness of the entrance animations (the headless browser cannot render smoothly).
- Cycles completed: 21 of the minimum 15, each a real inspection followed by a change or a recorded reason to keep, and a re-check. Cycles 07, 18 and 19 confirmed correct behaviour or left content decisions to the owner and led to no layout change.

---

# Part 17: /automotive visual redesign (brief received 4 October 2026)

Fifth brief on the route. The page worked, but the owner was not satisfied with its visual design: the artwork was often overshadowed by oversized type, some compositions had large empty spaces, vertical clips looked isolated, supporting pictures repeated the main one, sections read like slides stacked vertically, one visual formula was repeated and the page had no rhythm. The brief asks for an image-led, editorial page built on the real media: the owner's Ferrari hero (a Canva mock-up) as the opening, a new section order (Hero / Ferrari, What we do, Photorealism with the workshop clip and the Porsche portrait, BMW / Binance, a large exterior mural, Jetour and iCAUR together, then About, Process and enquiries), the standalone Creative Range removed, the existing copy kept provisionally (a copywriting phase follows), media deferred and capped as before, and a review of the rendered page at desktop and mobile widths.

## References, media and diagnosis

- **References received.** The Ferrari hero mock-up (a 1920 by 1080 Canva image with a browser bar laid over its top) and one composition example (the BMW photograph and clip, with a title above). The brief speaks of two additional examples; only the BMW one arrived, so the other sections were composed from the written brief and the real media.
- **The Porsche asset.** Identified by looking at the file, not by its position in the old page: `PORTRAIT PORSCHE` (912x1280), a black-and-white portrait of a driver above a number 48 racing Porsche, with the poster title "McQueen Drives Porsche". It was `CREATIVE_RANGE_01`; it is now `PORSCHE_PORTRAIT`.
- **The Ferrari source.** `FERRARI REALISTIC MURAL` (2252x2443). The opening picture is cut from it; the lit signature and the quotation beneath the artwork are outside the crop.
- **Environment.** The headless browser used for the review renders at about 1.5 frames per second on every page of the site, so entrance animations cannot complete there: stills were taken with the text entrances forced to their end state. Chrome's largest-contentful-paint metric ignores a picture that fills the whole viewport, so with a full-screen hero the metric lands on a text element; the picture's own arrival time was measured separately (cycle 12).

## Cycles

### Cycle 01: Brief, references and media audit

- Observation: the structure changes (the Ferrari moves from its own section to the opening; two sections merge; one is removed), so every media decision had to be re-made, not carried over. The two retired Ferrari crops and the wheel close-up would have repeated the opening picture; `RR MURAL AFTER` shows a neighbouring mural of another subject and a person in the window; `20260814_200545` is the same Ferrari wall under a skylight.
- Decision: the opening picture is the Ferrari mural; the Ferrari section, its close-up, the wheel close-up and the Creative Range are retired; the Porsche portrait gets its own slot; the two redundant photographs stay unused.
- Outcome: PASS (decisions in `docs/AUTOMOTIVE-MEDIA.md`).

### Cycle 02: Diagnosis of the previous page, in the owner's window

- Method: the previous version captured section by section at 1920x945, the size of the window in the owner's mock-up.
- Observations: the page was 12,503 px tall. Titles were larger than the pictures they introduced (the section title reached 104 px, the opening title 128 px, the budget figure 154 px, the biggest text on the page after the opening). In the Ferrari, Exterior and Workshop sections a title floated in a column with hundreds of pixels of nothing between it and the picture; the BMW clip stood at the far right with a void between it and its type; the Launch clips were small and far apart; the supporting Ferrari close-up repeated the main picture; the Creative Range was a third, different layout.
- Decision: rebuild the compositions around the artwork's own scale: art first, type sized beneath it, one grid, a different composition per section.
- Outcome: PASS (findings drive cycles 03 to 11).

### Cycle 03: The opening picture, cut from the real photograph

- Observation: the mock-up's frame is a 16:9 crop of the Ferrari wall. Reconstructed by landmarks (the woman's head and feet, the two windows, the wheel hub), it is 2133x1200 from (11, 189) in the source: both stone windows, the woman, the car and its badge, no signature. A phone cannot use a 16:9 picture (a 390 px screen would show 26 per cent of its width), so a squarer crop of the same wall was made: candidates 1300x1400 from (420, 285) and 1300x1300 from (380, 250) were compared side by side.
- Decision: 2000x1125 for screens (283 KB master), 1300x1400 for phones (the woman and both horses whole, the bonnet below, the road at the foot as a quiet zone for the type); both inside one `<picture>` so a device downloads one.
- Verification: the crops viewed beside the source with a coordinate grid; the page rendered at 390, 768, 1024, 1366, 1600, 1920 and 2560 wide.
- Outcome: PASS.

### Cycle 04: First recomposition, 1920x945

- Observation: the new compositions held (hero edge to edge; ruled offers with the canvas clip as tall as the list; Porsche and workshop clip on one line with the type in a column of its own; the finished BMW with its clip; the exterior wall at 710 px; Jetour and iCAUR in one row). Defects: the opening title ran two lines together (a class name left over from the old template, so the three lines were not forced), the shade made the whole picture grey and dull, the exterior's "before" sat at the foot of a wide column far from the wall, the BMW clip stood 250 px from the photograph, the budget was still large. The page was already 8,044 px tall.
- Change: the three title lines restored; a lighter shade; the budget set at 2.8vw (54 px at 1920, smaller than a section title); section titles capped at 4.4rem; the BMW clip centred in its columns.
- Verification: recaptured section by section.
- Outcome: PASS.

### Cycle 05: Contrast of the type over the Ferrari

- Method: the hero rendered with its text hidden, every text line's box read from the page, and the contrast of each text colour computed against every pixel under its box (the 3rd percentile is the figure given, so one stray bright pixel cannot hide a weak area; the single worst pixel is noted when it is lower).
- Observation: the first lighter shade left the 12 px lines short: the eyebrow 3.4 to 3.9 and the credit line 3.8 to 4.3 at several widths (4.5 needed); the title and the intro passed.
- Change: the small lines went to near-full paper; a stronger foot shade; then, to hold at any width, a soft local shade that travels with the type and fades to nothing.
- Verification: 1920x945, 1440x900, 1280x720, 1024x768, 1366x768, 1600x1000 and 2560x1080 on the rendered pixels: every line passes at the 3rd percentile (see cycle 19 for the final figures).
- Outcome: PASS.

### Cycle 06: Second pass at 1920x945

- Observation: the exterior wall at 710 px was the largest frame but not dominant, and its title and its "before" were two satellites with 450 px of void between them; the Launch heading at the top-left left a tall empty column beneath it; the Porsche, at 72 per cent of the screen's height, read as an equal of the workshop clip, not as supporting work.
- Change: the exterior wall grows to up to 52 per cent of the width and 118 per cent of the screen's height, and the grid starts the next column exactly where the picture ends (it is told the wall's proportions); the "before" laps the wall's edge with a one-word tag, so the evidence and the result are one picture, not two; the Launch heading sits on the foot line level with the two names, so the type reads as a caption row under the work; the Porsche is cut to 64 per cent of the screen's height against the clip's 88.
- Verification: recaptured at 1920 and 1440; the page is 8,252 px at 1920 (it was 12,503), 7,462 at 1440, 6,443 at 1280, 5,751 at 1024, 5,815 at 768 and 8,079 at 390.
- Outcome: PASS.

### Cycle 07: Phones, section by section

- Observation: at 390 the BMW clip laid over the foot of the finished-car photograph and hid the car's front and wheels, the very thing the photograph is for; the What we do lead line sat at the foot of its row with a void above it.
- Change: the BMW reads process first, then result: the clip, then the finished car edge to edge (the source order stays photograph first, `order` puts the clip ahead on phones only); the lead line is centred beside its clip and slightly larger.
- Verification: full page at 390x844 at 2x pixel density; the clips are 50 to 86 per cent of the screen's width and none is taller than 72 per cent of its height.
- Outcome: PASS.

### Cycle 08: Tablets

- Observation: at 768 the exterior's "before" disappeared (only its label showed at the far edge): a frame with no intrinsic width collapses to nothing in a grid cell that shrinks to fit. The Porsche and the workshop clip did not end on one line because the portrait's label added height to its figure.
- Change: the "before" stretches to its cell on tablets; the portrait's label hangs under the frame instead of adding to it.
- Verification: 768x1024 and 820x1180: both pictures end on one line, the "before" laps the wall, the Launch pair has equal heights.
- Outcome: PASS.

### Cycle 09: Laptops, small screens and ultra-wide

- Observation: at 1440x900 and 1280x720 every composition holds; at 1024 the hero crops the right of the picture and the offers, Photorealism and BMW switch to their narrow grids without collision; at 2560x1080 the hero is 62 rem tall, so a sliver of the next section shows under it (kept: a full-height hero on a 4K-class panel would be a poster).
- Verification: 1024x768, 1280x720, 1366x768, 1440x900, 1600x1000, 1920x945, 2560x1080 captured and viewed.
- Outcome: PASS.

### Cycle 10: The hero against the owner's reference

- Observation: set beside the mock-up, the implemented hero matches the composition (the same wall, the type at the lower left over the white horse and the dress, the credit at the lower right) but the mark was a third smaller than the mock-up's and the shade made the picture duller than the mock-up's.
- Change: the animated mark is 17.5 per cent of the screen (336 px at 1920, as large as in the mock-up); the screen-wide shade is lighter; the type is held by the local shade instead.
- Verification: the two side by side at the same scale (`docs/ux-evidence/automotive-visual-hero-vs-reference-1920x945.jpg`); contrast re-measured.
- Outcome: PASS (the framing differs by design: the whole window frame is kept, the mock-up's bar had hidden its top).

### Cycle 11: The mark over the picture on phones and tablets

- Observation: on a phone or a tablet the mark sits over the top of the picture, where the photograph is palest (the skylight): contrast 2.25 to 2.5 at 768 and 820 (3:1 needed for a graphic).
- Change: a soft shade in the top corner under the mark, in addition to the one along the top edge.
- Verification: 390, 360, 768 and 820 wide on the rendered pixels: 7.6, 6.6, 4.8 and 5.8 at the 3rd percentile.
- Outcome: PASS.

### Cycle 12: Loading and performance (production build)

- Verification, cold loads with the cache off. Before any scroll: 14 or 15 requests and 280 to 400 KB, no clip; the opening picture is 95 KB at 1440, 148 KB at 1920, 116 KB on a 390 px phone at 3x and 126 KB on a 768 px tablet at 2x (the right crop and size each time); after scrolling the whole page: 26 requests including exactly five clips, no duplicate, no failed request, no console message, layout shift 0.00 at 1440, 1920, 390 and 768. Cold timings: desktop 1440, first paint 0.20 to 0.23 s with the picture in place by 0.04 s; phone 390 at 3x on Fast 4G with a 4x CPU slowdown, first paint 1.1 to 1.5 s, largest paint (the picture) 1.2 to 1.6 s, the 116 KB picture arriving at 0.54 to 0.57 s, before the first paint; on Slow 4G (1.6 Mbps) the picture arrives at 1.6 to 2.0 s and the largest paint is 2.0 to 2.2 s. The page is 33.9 KB of HTML (9.4 KB gzipped), 19.4 KB of route stylesheet (4.3 KB gzipped) and 4.1 KB of route script (1.8 KB gzipped); no new dependency.
- Observation worth recording: on screens Chrome reports the largest contentful paint as the CONTACT link (0.2 s), because a picture that fills the viewport is not counted; the measured arrival of the picture is the figure that matters.
- Outcome: PASS.

### Cycle 13: Playback in the new layouts

- Verification, read from the page's state on the production build with real wheel input: at 1440 and 1920 no more than two clips play at once (only in the moments two are each at least 35 per cent visible, and when the Launch pair is on screen), at 390 never more than one; no clip ever plays while off screen; all five pause buttons are shown once the clips have attached; the controller itself is unchanged.
- Outcome: PASS.

### Cycle 14: Reduced motion, no script, Save-Data, 3G

- Verification on the production build, scrolling the whole page: reduced motion, JavaScript disabled, Save-Data and a 3G connection each request no clip, show no pause button, load all five posters and carry all 15 sampled strings; entrance reveals sit at full opacity.
- Outcome: PASS.

### Cycle 15: Keyboard, structure, alt text, Lighthouse

- Verification: Tab order skip link, CONTACT, the five pause buttons in page order, WhatsApp, email, the website link, each with a 2 px or 2.7 px ring; Space and Enter pause and resume; one H1, nine H2, eight H3, every section named by its heading, no picture without alt text (ten distinct descriptions for eleven slots: the phone crop shares the opening picture's). Lighthouse on the production build, mobile and desktop: Accessibility 100, Best Practices 100, Agentic Browsing 100, SEO 69 (the single failed audit is `is-crawlable`, the intended `noindex`).
- Outcome: PASS.

### Cycle 16: Width matrix and section seams

- Verification: 23 widths from 320 to 2560 on the production build: no horizontal overflow and no hero title line past the viewport at any. Every boundary between sections at 1x, 1.5x and 2x pixel density shows only the two surface colours and at most one anti-aliased blend row where a boundary falls between device pixels (no stray light line: there is no dark-on-dark junction any more).
- Outcome: PASS.

### Cycle 17: Cold prospect walkthrough

- Method: read top to bottom as someone who has never heard of the studio (expert check, not user research).
- Result: the first screen is the work (an ultra-realistic mural, the name and the offer in three lines, a credit line saying it is a private client's Ferrari mural); the four offers can be read in a glance beside a clip of a car being drawn and painted; Photorealism shows a process and a result, each captioned on its own; the BMW painted live with its finished car is the strongest proof and names its event; the exterior wall shows scale with its before; two launches are named; process, a budget stated once as information, who is behind it and how to reach it follow. No client, result or figure is claimed beyond the brief.
- Weak points, recorded not hidden: the finished BMW photograph is 780 px wide, so at 940 px it is slightly soft; the Photorealism heading is new wording taken from the brief; the exterior "before" is a different framing of the wall (the number 77 sits at the same height in both); the Porsche portrait is a phone photograph of a poster-like artwork with a visible door outline. All are in the handoff's "Decisions to confirm".
- Outcome: PASS (no layout change; content decisions left to the owner).

### Cycle 18: Build, tests, protected areas

- Verification: `npx astro check` 0 errors, 0 warnings, 10 hints (eight pre-date the work, two are the deprecated `register` notice of the route's test file); `npm test` 110 of 110 (89 existing plus 21 for this route, six of them new or rewritten for this brief: the opening picture and its phone crop, the two separate photoreal pieces, modest section titles and a smaller price, the exterior's dominant wall, the launch pair at one height, no Creative Range); `CONTENT_SOURCE=fixtures npm run build` exit 0, 29 pages, sitemap unchanged at 27 URLs, the route noindex and exempted only by name. The protected files and the shared fracture and autoplay code are unchanged; `automotive-motion.ts` (route-only) no longer imports the fracture helper because no panel uses it.
- Outcome: PASS.

### Cycle 19: Final regression on the last build

- Verification after the last edit, on a fresh production build: the tests, the check and the build above; loading, cold timings, playback, the four fallbacks, keyboard, the width matrix and Lighthouse re-run on that build. Contrast of the type over the picture at the 3rd percentile, final figures (title needs 3:1, the rest 4.5:1 except the mark, 3:1; the title figure counts the whole line box, so it is conservative): 1920x945 title 3.9, eyebrow 7.0, intro 8.7, credit 5.3, mark 3.3, link 5.1; 1440x900 4.8, 7.4, 8.7, 6.3, 3.9, 8.5; 1280x720 4.6, 7.3, 6.9, 5.6, 3.6, 4.7; 1024x768 6.2, 8.2, 7.2, 11.6, 4.0, 9.2; 2560x1080 4.5, 5.1, 8.1, 4.9, 5.0, 7.1; 390 wide 14.1, 11.3, 12.3, 14.0, 7.6, 15.5; 360 wide 13.6, 10.6, 12.3, 14.0, 6.6, 14.8; 768 wide 11.8, 10.1, 12.3, 14.0, 4.8, 11.3. The lowest single pixel under the 12 px credit line is 3.4 to 4.1 at some widths (one highlight on the bonnet), below the 4.5 target for that one pixel.
- Evidence: `docs/ux-evidence/automotive-visual-desktop-1920x945-sequence.jpg` (fourteen captures, every section), `automotive-visual-mobile-390x844-sequence.jpg` (ten captures) and `automotive-visual-hero-vs-reference-1920x945.jpg` (the owner's mock-up beside the implemented hero). The Part 16 images show the previous composition and are kept for history only.
- Outcome: PASS for everything verifiable here. BLOCKED, not passed: iOS Safari and real-device autoplay (including Low Power Mode), Firefox and Safari rendering, analytics, smoothness of the entrance animations (the headless browser cannot render smoothly), the browser's back/forward-cache restore.
- Cycles completed: 19 of the minimum 15, each a real inspection followed by a change or a recorded reason to keep, and a re-check. Cycles 01, 09, 13, 14, 15, 16 and 17 confirmed correct behaviour or left content decisions to the owner and led to no layout change.

---

# Part 18: /automotive final copy integration (brief received 4 October 2026)

Sixth brief on the route, and a controlled copy update: the visual design is a separate task and stays as it is. The owner supplied the approved final website copy (nine blocks: hero, what we do, realism and detail, BMW / Binance, large-scale exterior mural, Jetour and iCAUR, about, how we work, closing) and asked for it to be integrated accurately: word for word, no new marketing copy, headings or taglines, no redesign. Section 03 changes meaning: it is no longer about the workshop mural and the Porsche portrait but about automotive realism in general ("THE DETAILS CAR PEOPLE NOTICE."), with a media composition that can take more realistic artworks later and no description of any single artwork. The old Workshop / Automotive Portraits text, a Ferrari case study, the Creative Range, the standalone Project Budgets section and old pricing statements must not be visible; budget stays mentioned in "How we work". The BMW section carries the link "FEATURED BY AGMC: READ THE ARTICLE →" to AGMC's article about Binance Blockchain Week 2025.

## Baseline and decisions

- **Baseline.** The Part 17 page with its provisional copy: hero with a credit line, "FROM WALLS TO VEHICLES", a "PHOTOREALISM" section with two captioned pieces, BMW with one line of copy, a title-only exterior, "LAUNCH ARTWORK", process, a budget section ("AED 8,000–25,000+"), about, contact. The route's tests pinned that wording.
- **Hero credit line removed.** "PRIVATE CLIENT / ULTRA-REALISTIC FERRARI MURAL" is not in the approved hero (eyebrow, headline, intro), so it is not on the page; the mural itself, the composition and the CONTACT link are unchanged.
- **Section 03 is generic.** The two captions ("AUTOMOTIVE WORKSHOP / PHOTOREAL MURAL", "PORSCHE PORTRAIT") are gone, the component is `Realism.astro`, the pictures are a list in the content file (`realism.art`: slot, place, description for screen readers) placed by role (`lead`, `side`) instead of by what they show. The two pictures, their files and their positions are unchanged.
- **No budget section.** `Scope.astro`, its content and its styles are removed; the word "budget" now appears once on the page, in the proposal step of "How we work".
- **Order.** The approved copy runs About (07) before How we work (08) before the closing (09); the page had How we work first. The page follows the approved order (two lines in `automotive.astro`).
- **The AGMC link is new.** The previous copy named neither AGMC nor an article, so there was no existing link to preserve; it uses the page's link conventions (a new tab with `rel="noopener noreferrer"`, a `data-track` hook, mono capitals as in the jump link, underlined, with the signal-colour arrow of the contact rows).
- **Closing.** The secondary link "EXPLORE IMPACT MURALS →" replaces the old website text and still goes to the site root; the WhatsApp and email rows and the location line stay as essential contact details.
- **Kept although not in the copy:** the one-word tag BEFORE on the second exterior picture (a label of the picture, not copy), the step numerals 01 to 04, the CONTACT jump link, the pause buttons, the alt texts (screen readers only; the pictures did not change).
- **Metadata.** The meta and Open Graph description is now the approved hero intro.

## Cycles

### Cycle 01: Approved copy against the page, the components and the tests

- Observation: every block changes (new eyebrows, longer bodies, two or three paragraphs where there was one line, a full stop at the end of each headline); the hero credit, the section 03 captions and the budget section have no counterpart in the approved copy; the old test for "no Rolls-Royce named" and "no AGMC named" contradict the approved exterior and BMW copy.
- Decision: the content module holds the approved text exactly; anything visible that is not approved copy must be a documented functional label; the two old negative tests become "never the client" tests.
- Outcome: PASS (decisions above).

### Cycle 02: Integration and a guard that fails on any old wording

- Change: `src/content/automotive.ts` rewritten with the approved text (a full stop kept on each headline, apostrophes as supplied, non-breaking spaces only inside the hero's lines); the sections draw it; the tests carry the approved copy as a fixture and assert that the module equals it, that every approved block is present, that every visible string is approved or one of six functional labels, that no old phrase remains in a template or the stylesheet, and that no template contains a sentence.
- Verification on the production build: the page's text compared with the approved copy block by block: 54 of 54 found, in order; everything else visible is the skip link, CONTACT, BEFORE, 01 to 04, the WhatsApp and email rows and "Dubai, UAE". The built head carries no old description.
- Outcome: PASS.

### Cycle 03: Desktop render, 1920 and 1440

- Observation: the compositions hold with the longer text (hero, offers beside the clip, the two realistic pieces with the text column, BMW with its link, the exterior wall with the text and the "before", Jetour and iCAUR with a sentence each). Two defects: brand names and compounds split across lines at almost every width ("Coca-" / "Cola Arena", "Rolls-" / "Royce", "hands-" / "on", "black-and-" / "white"), and the eyebrow and headline spans of a heading touch with no space between them in the HTML.
- Change: a small helper (`src/lib/automotive-text.ts`, `Tight.astro`) sets every hyphenated word in a paragraph in a run that never breaks (markup only; the characters are the supplied ones); a space between the eyebrow and the headline of each heading.
- Verification: a scan of every hyphen in every paragraph at 13 widths: 0 broken compounds (it found one to three at every width before). The only remaining hyphen break is a headline ("PROJECT-DRIVEN." at tablet widths), handled in cycle 05.
- Outcome: PASS.

### Cycle 04: Kept as it is, on purpose

- Observation: beside the offers, the open space under the clip is now larger (about 470 px at 1920 and at 1440, from the second offer down), because the list is longer than the clip is tall; the clip stays level with the headline, where it was.
- Decision: keep. The brief asks for the container to adapt to longer text and not for equal heights; moving the clip or growing it would change a media placement (and the clip is meant not to dominate). The text column was widened to a 62-character line so a two-paragraph offer stays compact.
- Outcome: PASS (recorded in the handoff).

### Cycle 05: Tablets, 768 and 820

- Observation: on the exterior section the "before" was left alone under a long text column with a block of 360 by 420 px of empty paper beside it; the About headline broke after the hyphen ("PROJECT-" / "DRIVEN.").
- Change: from 768 the exterior's text runs under the wall and its title in two columns, the right column keeps the title and the "before" (which stays at the wall's foot, lapping its edge); the About headline gets six columns.
- Verification: 768 and 820 rendered: the "before" ends on the wall's foot, the section is about 170 px shorter, the headline is on two lines.
- Outcome: PASS.

### Cycle 06: Laptops, 1024 to 1366

- Observation: beside the wall the text column was taller than the wall on short screens (1280 by 720: the "before" hung 100 px below the wall; 1024 by 768: 200 px).
- Change: the text goes under the pair (two columns) below 1280 px, and at 1280 or more only when the screen is at least 760 px tall. A first version of this change dropped one grid line from the wall's rule and the screenshot showed the text column crushed to 150 px (found, fixed and re-captured the same cycle).
- Verification: 93 combinations of width (768 to 1500 in steps of 24) and height (768, 900, 1024): the title, the "before", the text and the wall never overlap; the "before" hangs at most 92 px below the wall and ends on its foot at most sizes (1024, 1180, 1440 and 1920 included).
- Outcome: PASS.

### Cycle 07: Phones, 390, 360 and 320

- Observation: composition by composition as before (the BMW clip then the finished car, the staggered pair, the exterior wall between its title and its text, the ruled steps); at 320 and 360 the BMW link wrapped with the arrow alone on the second line.
- Change: the arrow is joined to the last word by a non-breaking space (BMW link and the closing link).
- Verification: at 320 the label wraps as "FEATURED BY AGMC: READ THE" / "ARTICLE →". The pages are 9,592 px tall at 390 (it was 8,079).
- Outcome: PASS. (Tooling note: a full-page capture at 3x density is limited to 16,384 device pixels and repeats the top of the page below that; the phone checks used 1x full pages and per-screen captures.)

### Cycle 08: Is any text clipped, hidden or overlapped?

- Method: at 13 widths from 320 to 2560 every text node's line boxes were read from the page and compared with the viewport, every `overflow` ancestor, every other text block and every picture frame; then effective opacity of all 92 text nodes in three real contexts.
- Verification: no text outside the viewport, clipped, over other text, over a picture or wider than its box at any width (the hero headline's own tight line boxes overlap by font metrics only and are skipped); no horizontal overflow at any width. All 92 text nodes are fully visible with reduced motion, with JavaScript off, and in normal motion after scrolling the whole page.
- Outcome: PASS.

### Cycle 09: The AGMC link

- Verification: the built link has the exact address, opens a new tab with `rel="noopener noreferrer"` (a click in a real browser opened it, with `window.opener` null, and the original page stayed on /automotive); the address answered HTTP 200 with no redirect from this machine; the article's text names the live spray-painting of the BMW M5 Touring by Alexis from Impact Murals, so "featured by AGMC" is accurate. The tab order is skip link, CONTACT, three pause buttons, the AGMC link (after the BMW clip), two more pause buttons, WhatsApp, email and the closing link, each with a 2 px focus ring.
- Observation worth recording: AGMC's own page carries another article's title in its `<title>` and Open Graph tags ("AGMC Becomes an Official Partner with BMW Classic Collection"), so the browser tab and any link preview show that title; the page content is the right article. That is on their side.
- Outcome: PASS.

### Cycle 10: The hero's type with the new, longer text

- Method as in Part 17: the text hidden, the contrast of each text colour computed against every pixel under its own line boxes (the 3rd percentile is the figure; a single worst pixel is noted). A first run measured the eyebrow's whole flex box instead of its text and flagged it LOW (3.1 to 3.6); with the text's own rectangles it is fine.
- Result at 1920, 1440, 1280, 1024, 2560, 768, 390 and 360: headline at least 4.0 against 3:1 needed (conservative: whole line boxes), eyebrow at least 5.8 against 4.5, intro at least 6.4 against 4.5, CONTACT at least 4.69 against 4.5 (one pixel at 4.01 at 1280), the mark at least 3.34 against 3:1 (one pixel at 2.76 at 1920). Re-measured on the last build: the same boxes at every width and the same pixels (six of the eight widths pixel-identical, two with about 18 pixels different), so the figures stand.
- Outcome: PASS.

### Cycle 11: The media and how they load

- Verification on the production build (cold, real wheel input): the same 11 slots and files (no media file was touched; the newest is from the previous pass); before any scroll 13 requests and no clip; after scrolling the whole page 26 requests with exactly five clips; no duplicate, no failed request, no console message; layout shift 0.00 at 1440 and at 390 at 3x; at most two clips playing together on a large screen and one on a phone; five pause buttons; the page is 36.8 KB of HTML (10.6 KB gzipped, +2.9 KB) and the route stylesheet 19.3 KB (4.2 KB gzipped).
- Outcome: PASS.

### Cycle 12: Structure, accessibility and search tooling

- Verification: one h1, eight h2 (the budget section is gone), ten h3 (four offers, the two launch names, four steps); ten pictures all with alt text, five clips; Lighthouse on the production build, mobile and desktop: Accessibility 100, Best Practices 100, Agentic Browsing 100, SEO 69 (the one failed audit is `is-crawlable`, the intended `noindex`).
- Outcome: PASS.

### Cycle 13: Large default text size

- Method: the browser's default text size raised to 150 per cent and 200 per cent at 1280, 1024, 768, 390 and 320 wide (a stricter test than zoom, because the gutters and gaps grow with it).
- Observation: at 150 per cent the hero headline lines, the CONTACT link, the long exterior headline and (at tablet width) the exterior title over the "before" overflowed or overlapped; one cause was structural (the title and the "before" shared one grid row and cleared each other by 12 px at 768).
- Change: display titles and the names of offers and steps may break a long word as a last resort (`overflow-wrap: anywhere`, which also stops a long word widening a grid column); the hero's top row wraps; from 768 the exterior's title, "before" and text are three stacked rows (the 93-combination check was re-run).
- Verification: clean at 150 per cent at all five widths and at 200 per cent at 1280, 768 and 390; two extreme corners remain at 200 per cent (1024 wide: the exterior eyebrow runs past the edge of a very narrow column; 320 wide: three step paragraphs run past the right edge and the offers lead overlaps its clip). Both are far outside normal use and are recorded in the handoff.
- Outcome: PASS for normal use and for 150 per cent; the two 200 per cent corners are documented, not fixed.

### Cycle 14: A cold read of the copy against the media

- Method: the page read top to bottom as someone who has never heard of the studio (expert check, not user research).
- Result: the first screen says what the page is for ("ART FOR CAR LOVERS.", the three disciplines, who it is for); the four offers read in one glance beside a clip of a car being drawn and painted; the realism text is about attention to detail and sits beside a workshop mural in progress and a racing portrait without describing either; the BMW section names the event, the car and the venue, shows the process and the result and ends on the proof of the partner's own article; the exterior copy matches what the picture shows (a black-and-white, chrome-like figure at building scale) and says "private commission" before it names the marque; the two launches each say what was painted and where; About says who leads and who is brought in; How we work states budget once, in the proposal; the closing asks for a short call and offers the site as a second step.
- Weak points, recorded not hidden: the summit booth sentence has no picture (none was supplied); the finished BMW photograph is still a 780 px original shown up to about 940 px; the hero no longer says anything about the Ferrari mural being a private client's; About has no portrait. All are in the handoff.
- Outcome: PASS (no change; content decisions left to the owner).

### Cycle 15: Final regression on the last build

- Verification after the last stylesheet edit, on a fresh production build: `npm test` 115 of 115 (89 existing plus 26 for this route); `npx astro check` 0 errors, 0 warnings, 10 hints (unchanged: eight pre-date the work, two are the deprecated `register` notice of the route's test file); `CONTENT_SOURCE=fixtures npm run build` exit 0, 29 pages, sitemap unchanged at 27 URLs, "No problems found". On that same build: the text comparison (54 of 54 in order), the old-wording scan (nothing left), the 13-width sweep (no overflow, clipping or overlap; 0 broken compounds), the exterior check over 93 sizes, the large-text test, text visibility with reduced motion, without JavaScript (after the hero's 0.8 s entrance) and in normal motion (92 of 92), loading and playback (13 requests then 26 with five clips, no failure, layout shift 0.00, two clips at most at once on a large screen and one on a phone), the AGMC click in a real browser, the tab order, the hero contrast (above) and Lighthouse (mobile and desktop: 100, 100, 100 and SEO 69). The protected and shared files are unchanged (`BaseLayout`, `Contact`, `validate-content`, routes, the sitemap code, the video and motion scripts, `AutoMedia`, `HeroLogo`, `global`, the media, `_headers`).
- Evidence: `docs/ux-evidence/automotive-copy-desktop-1920x945-sequence.jpg` (ten captures, every section) and `automotive-copy-mobile-390x844-sequence.jpg` (twelve captures); the Part 17 images show the previous copy and are kept for history.
- Outcome: PASS for everything verifiable here. BLOCKED, not passed: iOS Safari and real-device behaviour of the clips, Firefox and Safari rendering (only Chromium was available), analytics, smoothness of the entrance animations (the headless browser cannot render smoothly), the owner's approval of the points listed in the handoff.
- Cycles completed in this part: 15 (the 15-cycle minimum of the overall pass was met in earlier parts; nothing here was added to fill a count: cycles 04, 09, 11, 12 and 14 confirmed correct behaviour or left decisions to the owner and led to no layout change).

---

# Part 19: /automotive media-density pass (brief received 5 October 2026)

Seventh brief on the route and a deliberately narrow one: the page is "close to the intended direction", so no redesign and no new or rewritten copy. The goal is more visual proof early, less empty space and less scrolling: the supplied picture in What we do (its clip leaves), the supplied Ferrari picture and that clip in a compact mixed-media wall for the realism section, the homepage's studio clip in About, the section order, Hero, BMW, exterior and Jetour / iCAUR untouched, and nothing published without approval. Two pictures were attached; the brief also mentions "additional realism images" that did not arrive.

## Baseline and decisions

- **Baseline.** The production build of the Part 18 page, measured before any change: 7,869 px at 1440 x 900 (offers 1,217, realism 911, About 455, BMW starting at 3,028), 9,658 at 390 (a 390 px desktop window), and four more widths. The offers clip stood in a three-column slot with about 430 px of empty paper under it, the realism section showed two 410 px pieces, About was text only with empty paper under its heading.
- **Which picture where.** The first attachment (a Porsche and cherry blossom photograph) to What we do and the second (the Ferrari mural, byte for byte the file `THE DETAILS CAR PEOPLE NOTICE.` saved in the owner's folder, named after the section) to the realism wall, by the order of the brief. No other "additional realism image" arrived, so the wall uses the existing realism media. Recorded as a decision to confirm.
- **The homepage clip was identified from the code, not from a file name.** `src/components/home/StudioMoment.astro` plays `studio.media.video` (`src/content/studio.ts`) beside "ARTIST-LED. PROJECT-DRIVEN.", through the shared player; the new section reads the same property.
- **No wording added.** Alt texts are for screen readers and name no client; nothing is captioned.
- **Kept on purpose:** the Hero, BMW, exterior and Jetour / iCAUR sections and their media, the section order, the video and motion scripts, `AutoMedia`, the homepage.

## Cycles

### Cycle 01: The media that arrived, and the clip to reuse

- Observation: the offers photograph is a 744 x 1280 phone picture taken through a glass panel (a diagonal glass edge and reflections at the left, the sign and the plate in the middle); the Ferrari picture is 1080 x 1152 with a ceiling band and a staircase around the painted wall; the homepage clip is HEVC with audio, 9.4 MB, 11.3 s, native 16:9, with its index at the end and a 400 x 225 poster (frames read in the browser: a hand spraying a blue and green mural, a worker on a ladder, the artist talking, crowds, the finished wall).
- Decision: keep the photograph byte for byte; cut the Ferrari to the painted wall with a coordinate grid (0, 165, 1038 x 760: both wheels whole, the ceiling band, the stairs and the lit signature out; a few pixels of glass rail and hazard tape remain in one corner because cropping them cuts the wheel, and I did not retouch the owner's picture); reuse the homepage clip by address (no copy) and give it a poster of its own, its first frame at full size; give the moved clip a stronger poster (the painting almost finished, not the pencil sketch).
- Verification: masters are 2000 px or less and under 800 KB (tested); the shared clip is read from the same module as the homepage; the homepage files are untouched.
- Outcome: PASS (the clip's weight and codec recorded as a decision).

### Cycle 02: What we do, first composition and its defects

- Observation: at 1440 the three-column table (heading over the names, introduction over the texts, the picture beside) is balanced and the section is 194 px shorter. Defects found while checking other widths: below 1280 a picture taller than the introduction opened gaps between the heading, the lead and the support paragraph (the spanned rows stretched equally); the plate was clipped at the panel's right edge; at 700 px the phone layout put a 318 x 548 picture beside two lines of text (1,651 px).
- Change: the spare height goes to the last spanned row (under the introduction), the cut is shifted to the right (plate and sign whole), and the picture-beside-introduction layout starts at 600 px (the two-column list at 768).
- Verification: renders at 1920, 1440, 1280, 1024, 768, 700 and 390; 1,217 to 1,023 at 1440.
- Outcome: PASS.

### Cycle 03: The realism wall, the composition decision

- Observation: three of the four pieces are portrait (9:16 clips and a 0.6 poster) and one is wide, with a text block of about 400 px. Any arrangement of two rows is 1,100 px or more at 1440 (the portrait pieces are at least 500 px tall at 290 px wide), which is longer than the old section; only one row at one height is shorter, and each piece taking a share equal to its own proportion (the Launch pair's technique) makes the heights match at every width.
- Change: a flex row; the text above it set in three columns (heading, lead, second paragraph) so it is 160 px tall; first render inside the page margins: 750 px tall, pieces 230 to 260 px wide, readable but small; extending the row to the page edges makes every piece about a tenth larger (the wide piece 604 x 442, the tall ones 249 to 263 wide at 1440) and is kept, with the text above on the margins.
- Verification: 782 px at 1440 against 911; the four pieces and the heading in one 900 px screen.
- Outcome: PASS (the edge-to-edge row is a decision to confirm).

### Cycle 04: The wall below 1440, tablets and large phones

- Observation: with the margins the row is 150 to 160 px per tall piece at 1024 and at 900, too small; two rows (the wide piece across, the three tall pieces under it) give 250 px pieces at 900 but are 1,370 px at 1023; the phone layout stretched to 700 px put a clip as tall as the screen beside two lines (2,020 px).
- Change: one row from 1024 px (173 to 183 px at 1024, 220 to 232 at 1280); from 600 to 1023 the two rows, capped at 48 rem and on the text's left edge; the phone layout only below 600; the reading order is the wide still, the process clip, the workshop clip, the portrait (stills at the ends, the clips between), so the two pause buttons are in the same order as on screen at every size; every media query is a `min-width` one (a `max-width` partner leaves a gap at fractional widths such as 767.5).
- Verification: 640, 700, 767, 768, 1000, 1023, 1024 and 1440 measured; no horizontal overflow at any of the six audit widths.
- Outcome: PASS (the smaller pieces at 1024 recorded).

### Cycle 05: About with the clip

- Observation: with the clip at the left of a 5-column text the tablet layouts left 200 to 260 px of empty paper under a 16:9 clip; from 640 to 767 px "PROJECT-DRIVEN." broke after its hyphen in a six-column heading (three lines).
- Change: from 640 px the heading over the clip at the left and the words at the right; from 1280 the clip at the left and the heading with the words at the right, as on the homepage; a hair smaller heading between 640 and 767.
- Verification: the heading on two lines from 640 to 1023; 455 to 579 at 1440; the clip stays 16:9.
- Outcome: PASS.

### Cycle 06: Phones

- Observation: at 390 x 844 one screen shows the wide piece and both portrait pieces together; the process clip stands beside the lead line (as the clip did in What we do), the wide piece and the pair run edge to edge; at 320 the lead column is narrow but nothing overlaps. About's clip adds about 210 px, the wall and the offers give back about 175.
- Verification: renders at 320, 360, 390, 430, 600 and 700; the page is 9,697 px at 390 against 9,658 (+0.4%).
- Outcome: PASS (the small increase recorded).

### Cycle 07: Loading and playback

- Method: the production build, real wheel input, a cold context.
- Verification: before any scroll 13 requests and no clip (the same count as before); the wall's clips are attached while the visitor is still in What we do and play together on a large screen (two at most; one on a phone); the studio clip is attached when About is near (three range requests, the start, the index at the end and the rest, 9.4 MB in all), plays and is paused as soon as it leaves; six clips, six named pause buttons; layout shift 0.00 at 1440 and at 390 at 3x; no console message; reduced motion loads no clip and the posters are the pictures; the keyboard order matches the visual order.
- Not observed: a browser without HEVC support (this Chromium decodes it); the script's error path (one retry, then the poster stays) is the one every clip uses.
- Outcome: PASS.

### Cycle 08: Large default text

- Method: the browser's default text size raised to 150 and 200 per cent at 1440, 1280, 1024, 768, 600, 390 and 320 wide, checking every heading, paragraph and frame of the three sections for overflow, text wider than its box and overlap.
- Result: clean at 100 per cent everywhere and at 150 per cent at 1440, 1280, 1024, 768 and 600; the lead beside a clip overhangs its column by 2 to 11 px at 390 (inside the gap) and a few px more at 320 (captured: nothing touches the picture), as the offers lead already did; at 200 per cent the Part 18 corners remain, and at 1024 the wall's right edge is clipped because the rem-sized gaps of the twelve-column grid exceed the content width.
- Outcome: PASS for normal use and for 150 per cent; the 200 per cent corners are documented, not fixed.

### Cycle 09: Copy and tests

- Verification: the content module holds the approved copy exactly (the route's test pins it and fails on any other visible string); on the production build 53 of 53 strings found in order at four widths and the rest of the page's text is the functional labels; tests: three new (the offers picture and no clip, the wall's pieces and layout, the shared clip), four updated; 118 of 118 in the whole suite.
- Outcome: PASS.

### Cycle 10: Final regression on the last build

- Verification after the last stylesheet edit, on a fresh production build: `npm test` 118 of 118; `npx astro check` 0 errors, 0 warnings, 10 hints; `CONTENT_SOURCE=fixtures npm run build` exit 0, 29 pages, sitemap unchanged at 27 URLs, "No problems found"; heights at six widths (above and in the handoff: -2.5 per cent at 1440, +0.4 per cent at 390); no horizontal overflow; HTML 39.8 KB (11.1 KB gzipped), route stylesheet 21.3 KB (4.6 KB gzipped). The protected files are unchanged (`Hero`, `Bmw`, `Exterior`, `Launch`, `Process`, `ContactCta`, `AutoMedia`, the video and motion scripts, `BaseLayout`, the homepage, `validate-content`, routes, the sitemap code, `global`).
- Evidence: `docs/ux-evidence/automotive-density-desktop-1440x900-sequence.jpg` and `automotive-density-mobile-390x844-sequence.jpg` (end states: the headless browser renders at about 1.5 frames per second, so the entrances were forced to their end).
- Outcome: PASS for everything verifiable here. BLOCKED, not passed: Lighthouse (the DevTools connector timed out), iOS Safari and real-device clips, Firefox and Safari rendering, HEVC playback on a browser without HEVC support, analytics, smoothness of the entrance animations, the owner's answers to the decisions in the handoff.
- Cycles completed in this part: 10 (the 15-cycle minimum of the overall pass was met in earlier parts; nothing here was added to fill a count).

---

# Part 20: /automotive final refinement pass (brief received 5 October 2026)

Eighth brief on the route and a narrow one: the page is structurally approved, so no redesign and no rewriting. Three integrations: reverse the hero's hierarchy ("ART FOR CAR LOVERS." strongest, the discipline words a restrained secondary title), a discreet strip of five supplied logos directly under the hero, and an investment note ("AED 8,000–25,000+" and three sentences) directly before How we work. The brief asked for a check at desktop, tablet and mobile widths and did not ask to publish.

## Baseline and decisions

- **Baseline.** The page as deployed (`0d87e2e`) served from `dist` on a preview server, measured before any change at seven widths: 7,670 px at 1440 x 900 (the opening 900 px, the title 73 px), 9,637 at 390 on a phone.
- **The five "SVG" files were opened before anything was drawn.** They are grayscale PNGs wrapped in SVG masks, not vector paths (details in cycle 01).
- **One H1, two voices.** The campaign line and the discipline words are two spans of the page's single H1, so the positioning leads and the keywords stay in the heading (the title tag still says them).
- **Where the note goes.** Immediately before How we work, which is after About; the order of the rest is untouched.
- **The strip is dark.** The supplied marks are white; on the hero's own ink they read as the foot of the opening.
- **Not touched.** `WhatWeDo`, `Realism`, `Bmw`, `Exterior`, `Launch`, `About`, `ContactCta`, `AutoMedia`, `HeroLogo`, the veil, the opening picture, the scripts, `global.css`, every other route.

## Cycles

### Cycle 01: The supplied logos

- Observation: each "SVG" (34 to 127 KB) holds one grayscale PNG twice, painted through a luminance mask and an `feColorMatrix` filter: a white mark on black becomes a white mark on transparent. The five embedded rasters are 676 x 455, 482 x 334, 820 x 820, 1280 x 692 and 2144 x 532 with very different margins (the Jetour mark, with its "Drive Your Future" line, fills about half of its frame; Majid Al Futtaim is 80 px tall inside 334). Ink density differs a lot too: iCAUR fills 67 per cent of its box, Majid Al Futtaim and Jetour about 26.
- Decision: use the very pixels, but as plain transparent images trimmed to their ink (so a height is the mark's own height and the five can be sized by eye), not as the supplied wrappers (400 KB, a mask and a filter chain, a rendering path in Safari that could not be tested here). White on a transparent ground is exactly what the SVG paints.
- Action: extracted, brightness to alpha, trimmed (threshold 6 of 255), capped at 560 px wide, lossless WebP: 52 KB for the five, in `src/assets/automotive-brands/` (a folder of its own: the slot tests treat every file of `src/assets/automotive/` as a picture of the page).
- Verification: each file is white where opaque, touches all four edges (a test), and was seen next to the others on a contact sheet.
- Outcome: PASS (the raster resolution is the limit of sharpness, recorded: only Majid Al Futtaim comes near it).

### Cycle 02: The hero's hierarchy

- Observation: the old opening was a small mono label over a three-line display headline (73 px at 1440), 557 px wide.
- Action: one H1 with two block spans: the campaign line in two lines ("ART FOR" over "CAR LOVERS."), the display face at 8.6 vw, and the discipline words at 2.35 vw under it; the entrance animation reused (`auto-open`).
- Verification (1440 x 900): the order reads at once. But the campaign line, 124 px, reached x = 800 and covered the white horse and the dress of the woman more than the old headline did (the owner has complained about type over the art).
- Change: 7.7 vw (111 px at 1440, 660 px wide, 148 px at 1920).
- Outcome: PASS (a decision to confirm: how large the campaign line may be).

### Cycle 03: The strip, first pass, and where it sits

- Observation: the opening is the full height of the screen (900 px at 1440 x 900), so a strip below it starts at the fold: not on the first screen.
- Action: the strip as a fixed-height ink band under the hero (white marks, no box, no rule, space-between on the page's margins); the opening gives up the strip's height (`--brands-h`) on screens, so the Ferrari, the type and the strip fill the first screen (772 + 128 at 1440).
- Verification: a pixel-overlap hairline appeared between the opening and the strip on a phone (the opening ends at a fractional pixel and the page behind shows through): the strip overlaps the opening by one pixel. The marks were uneven in weight (iCAUR heavy, Louis Vuitton light).
- Outcome: PASS after the next two cycles.

### Cycle 04: Phones

- Observation (390 x 844): "CAR LOVERS." (5.9 em wide) was 8 px wider than the page margins at 60 px, nearly touching the screen edge; a single row of five marks would be 15 to 20 px tall.
- Change: the campaign line is sized from the width between the margins (56 px at 390, no overflow from 320 up); the strip is three marks then two, each row flush to both margins (a grid of three auto tracks).
- Verification: 320, 360, 390 and 600 wide: no overflow, no touching marks; the first row of marks is on the first screen of a 390 x 844 phone.
- Outcome: PASS.

### Cycle 05: Tablets

- Observation: from 600 to 767 px the single row of five left gaps of 22 to 40 px between marks that are 120 px wide; the investment note's text stood in a narrow column at the left with the right half of the page empty.
- Change: one row from 768 px (gaps of about 49 px at 768 and about 90 at 1024); three and two below. The note's explanation stands at the left and the two qualifying sentences at the right from 768, one column below.
- Verification: 650, 720, 768, 1023 and 1024 wide.
- Outcome: PASS.

### Cycle 06: The investment note

- Observation (1440): the figure and the three sentences read as an editorial note between two hairlines, not as a pricing card; the digits of the range touched at the display tracking (-0.045 em) and, at 1024, the currency dropped above the figure because the minimum size of the clamp won over the viewport width.
- Change: the range is tracked at -0.03 em; the screen size is 5.4 vw with a lower minimum, so the currency stays on the figure's line from 1024 up; the sentences sit on the column where About's words begin (an edge shared with the section above).
- Verification: 1440, 1280, 1024, 768, 390 and 320: the figure on one line with the currency beside it everywhere except at 320 (where the currency drops above, by design), the deposit quieter than the explanation (15 to 16 px against 19 to 22) and 7:1 on the paper.
- Outcome: PASS.

### Cycle 07: Large default text

- Method: the browser's default text size at 100, 150 and 200 per cent at 1440, 1280, 1024, 768, 600, 390 and 320 wide, checking the hero's text, the strip, the note and the page for overflow, text outside the screen and touching marks.
- Observation: at 150 and 200 per cent the rem-sized marks grew into each other at most widths; the note's figure and its two-column copy overflowed at 768, 390 and 320 (a grid track sized by the nowrap figure); the campaign line, set in `nowrap` lines, could not wrap.
- Change: the marks and the strip are px (a picture does not grow with the text size; browser zoom still scales them); the note's layout has a `minmax(0, 1fr)` track; the range may break after its dash and the currency drops above it; the campaign line wraps (its smallest size is 2.1 rem).
- Verification: all 21 combinations: no horizontal overflow and no text outside the screen; the only remaining contact is at 200 per cent on a 320 px screen (the "BMW GROUP" and Majid Al Futtaim marks overlap by 5 px): not fixed, far outside normal use.
- Outcome: PASS for normal use and for 150 per cent; one extreme corner documented.

### Cycle 08: What the DOM said

- Observation: reading the H1's text from the page returned "ART FORCAR LOVERS. MURALS, ...": the two block lines had no space between them, so assistive technology and search engines would read "FORCAR".
- Change: a real space between the lines (as the secondary title already had), pinned by a test.
- Verification: the H1 reads "ART FOR CAR LOVERS. MURALS, VEHICLE ART & LIVE PAINTING." in the DOM and in `innerText` ("ART FOR" newline "CAR LOVERS." newline "MURALS, ...").
- Outcome: PASS.

### Cycle 09: Weight of the five marks

- Observation: by ink (area times density) iCAUR carried about twice the weight of the others and the Louis Vuitton monogram the least.
- Change: iCAUR 22 to 20 px, Louis Vuitton 46 to 50, Majid Al Futtaim 26 to 28.
- Verification: contact sheets at 1440 (1x) and 390 (2x) next to the first pass: no mark dominates and none is lost; the Arabic script and the Jetour line stay legible.
- Outcome: PASS (sizes are a judgement: they are tunable per mark in px).

### Cycle 10: Copy, outline and tests

- Verification: the content module holds the owner's words exactly (the range with its en dash, three sentences); on the production build all 58 strings are found in order at 1440, 1024, 768 and 390 and the only other visible text is the same functional labels; one H1, the note's heading an H2, the strip a labelled region with five named images and nothing focusable; title, description, canonical, robots, Open Graph and sitemap unchanged; contrast on the rendered pixels (see the handoff). Tests: three new (the hero, the strip, the note), five updated (the order, the copy, the drawn blocks, the paragraphs, the obsolete-copy test, which now says money is spoken of only in the note and the proposal step); 121 of 121.
- Outcome: PASS.

### Cycle 11: Final regression on the last build

- Verification after the last stylesheet edit, on a fresh production build: `npm test` 121 of 121; `npx astro check` 0 errors, 0 warnings, 10 hints; `CONTENT_SOURCE=fixtures npm run build` exit 0, 29 pages, 28 sitemap URLs unchanged, "No problems found"; heights at seven widths (+337 to +561 px, the note and, below 1024, the strip); no horizontal overflow; five more requests (52 KB) before any scroll; layout shift 0.00 at 1440 and at 390 at 3x through a full scroll; no console message; reduced motion and no script checked.
- Evidence: `docs/ux-evidence/automotive-final-desktop-1440x900.jpg` and `automotive-final-mobile-390x844.jpg` (end states: the headless browser renders at about 1.5 frames per second, so the entrances were forced to their end).
- Outcome: PASS for everything verifiable here. BLOCKED, not passed: Lighthouse (the DevTools connector timed out), Safari, iOS and Firefox rendering, real devices, analytics, smoothness of the entrance animations, and the owner's answers to the decisions in the handoff.
- Cycles completed in this part: 11 (the 15-cycle minimum of the overall pass was met in earlier parts; nothing here was added to fill a count).
