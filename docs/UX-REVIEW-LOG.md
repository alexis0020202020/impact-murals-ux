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

