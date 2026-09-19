# Current UX handoff

## Starting point

Prepared from the corrected V2-80 source archive on 2 September 2026.

Previous baseline: 89 passing tests. That result is not, on its own, a completed UX review — this session performed a full implementation pass on top of it.

## Current task

Follow `UX-BRIEF.md`. Improve the existing site in place, preserve protected systems and complete at least 15 genuine review cycles.

## Current state

- Implementation: **COMPLETE** for this pass. 15 of 15 minimum review cycles completed and logged in `docs/UX-REVIEW-LOG.md`, plus a supplementary independent-audit addendum (design-audit + Impeccable skills). No significant in-scope defect remains open.
- Real fixes applied and verified this session: see "Changes made" below.
- Browser evidence: gathered live via `chrome-devtools` MCP (real Chromium/CDP — screenshots, accessibility snapshots, DOM geometry, console/network logs, real keyboard events) throughout the session, not saved as files (no explicit save path was requested; every route/viewport combination named in `docs/UX-REVIEW-LOG.md` is reproducible by reloading the dev server).
- Tooling note: the Claude Browser pane (`mcp__Claude_Browser__*`) has a screenshot-capture bug on this project specifically — its `computer` screenshot action returns blank frames despite correct DOM/CSS (verified via `getComputedStyle`/`elementFromPoint`: content is genuinely rendered, just not captured by that tool's screenshot mechanism). `preview_start`/`preview_list` from that toolset were still used to launch/manage the dev server; `chrome-devtools` MCP was used for all visual verification.
- Latest local URL: `http://localhost:4321` (`.claude/launch.json`, config `impact-murals-dev`, port 4321). Currently running.
- Skills/tools checked and used (per explicit user request mid-session):
  - **Chrome DevTools MCP**: available, used continuously for all real-browser verification.
  - **Playwright MCP**: available, not used — Chrome DevTools MCP already covered every need (real browser, screenshots, a11y snapshots, network/console).
  - **Frontend Visual QA** (`1.12.0:frontend-visual-qa`): available, invoked. Its bundled Playwright-based mechanical sweep script was not run (this project has no Playwright dependency, and both the skill's own rules and the project guardrails forbid installing one just to run it); its audit discipline was applied using Chrome DevTools MCP as equivalent evidence instead. Led directly to finding and fixing a real CSS overflow bug (see Cycle 10).
  - **Design Audit** (`design-audit`) and **Impeccable** (`impeccable:impeccable`): available, invoked for an independent creative-direction/heuristic second opinion after the 15 cycles (see the Cycle-15 addendum in the review log). Both confirmed the direction without surfacing new actionable defects.
  - **UI/UX Pro Max**: available, not separately invoked (its scope — logo/brand-identity generation, CIP mockups, slide decks — did not match any open item in this pass).
- User changes since this package: none found beyond the documentation package itself. The project has no `.git`; a local repo was briefly initialized to help track diffs during the session, then removed, because setting a commit identity would require changing git config, which session instructions disallow. Proceeded without VCS tracking; every change is listed below with its file and reasoning instead.

## Changes made and files affected (this session)

1. **[src/components/home/Hero.astro](../src/components/home/Hero.astro)** — Cycle 01. The hero logo (previously capped at `max-w-[1180px]`, widths `88/82/72/68vw`) combined with a `pt-[11vh]` gap and `mt-auto` push meant that at 1920x900 and 1280x720 **only the fragmented logo was visible on load** — headline, supporting copy and the primary CTA were entirely below the fold, directly contradicting the brief's "the logo must coexist with a legible proposition and accessible CTA." On mobile the opposite defect existed: a forced `min-h-[calc(100svh-3.5rem)]` plus `mt-auto` created a ~470px dead gap between the logo and the headline. Fixed by capping the logo at `max-w-[720px]` (widths `76/62/50/44vw`), tightening the pre-headline gap, using a fixed `mt-14` margin on mobile instead of `mt-auto`, and removing the forced full-height on mobile (kept only at `md:`). Verified at 1920x900, 1280x720, 390x844 and 360x800: full headline + both CTAs visible on load at every size tested.
2. **[src/styles/global.css](../src/styles/global.css)** — four separate fixes:
   - Cycle 02: `.offer-scene + .offer-scene` margin reduced from `clamp(8rem, 17vw, 18rem)` to `clamp(5rem, 9vw, 9rem)` — scrolling between the three homepage offer chapters produced 300-500px stretches of pure background with no content cue.
   - Cycle 10: added `width: 100%` to the shared `.media-placeholder` and `.media-shell` classes — a block element combining a pixel `min-height` with `aspect-ratio` and no explicit width can derive its width *from* the min-height through the ratio instead of stretching to fill its container (a known CSS interaction), which was causing a real ~13px horizontal-overflow bug on mobile offer pages. Confirmed fixed on all 8 core routes at 360px.
   - Cycle 12: darkened `--color-stone` from `#777168` to `#6f695f` — the original measured 4.20:1 contrast against the paper background, under WCAG AA's 4.5:1 minimum for normal text (this token drives nav labels, breadcrumbs, and `image-note` captions site-wide). New value measures 4.73:1, visually near-identical.
3. **[src/pages/what-we-do/\[slug\].astro](../src/pages/what-we-do/[slug].astro)** — Cycle 03. All three offer pages hardcoded the exact "BRING US IN EARLY. OR BRING US YOUR DIRECTION." heading/body verbatim from the homepage's `HowWeJoin` component — precisely the "same large generic closing statement" the brief says to avoid on offer pages. Replaced with a per-offer `startHeading` and the offer's own `firstStep` copy (already written in `offers.ts`, never previously rendered anywhere). Also changed that section from `surface-dark` to light, because with `realRelated`/`reading` empty in the current content state, the page fell through three consecutive dark sections with no light relief. Verified on all three offer pages.
4. **[src/pages/studio.astro](../src/pages/studio.astro)** — Cycle 08. The same duplicated heading appeared a third time on Studio, and did not belong thematically on a page whose job is "artistic thinking, human credibility... not a second process page." Replaced with Studio-specific content ("PROOF IS IN WHAT GETS BUILT.") plus a "See selected work" link into `/work`, keeping the light section that separates the page's two dark blocks.
5. **[src/components/Header.astro](../src/components/Header.astro)** — two fixes:
   - Cycle 07: the closed mobile nav panel (`max-height: 0`) kept its 6 links fully in the tab order and accessibility tree (confirmed: `offsetParent !== null`, `tabIndex 0`), so a keyboard user tabbing past the header landed on invisible links before ever reaching the hero. Added the `inert` attribute, toggled in `setOpen()`. Also added an `Escape` key handler (closes the menu, returns focus to the toggle) — no keyboard-close path existed before.
   - Cycle 10: the mobile toggle button was 36×36px; bumped to `h-11 w-11` (44×44px) to meet the common touch-target minimum.
6. **[src/components/Footer.astro](../src/components/Footer.astro)** — Cycle 10. Footer links measured 13-25px tall (text-only, no vertical padding). Added `inline-block py-2` to every link and rebalanced list gaps so tap targets now measure 34-36px, without visually bloating the compact footer.
7b. **[src/styles/global.css](../src/styles/global.css)** — removed the entire "Legacy / reusable form controls" block (`.enquiry-step`, `.option`/`.option-input`/`.option-body`/`.option-label`/`.option-hint`/`.option-inline`, `.checkbox-input`, `.filter-chip`, `.field-label`, `.field-input`, and the `select.field-input option` rule) after confirming via grep — including inside `src/lib/enquiry/` — that none of these classes are emitted anywhere; the live enquiry flow uses its own `imq-*` classes instead. This was flagged by the post-edit design-quality hook as a layout-thrashing `padding-left` transition (`.option`, line 568); since the rule lived entirely in dead code, the fix was deletion rather than switching it to a `transform`. Re-ran `npm run check` (0 errors) and `npm test` (89/89) and re-screenshotted `/discuss-a-project` after removal — pixel-identical, confirming zero live usage.
8. **Removed 5 orphaned components** (final housekeeping pass, after confirming zero references anywhere in `src/`): `src/components/home/OfferStrip.astro`, `BuiltToDeliver.astro`, `OpeningProof.astro`, `ProcessProgression.astro`, `StudioProof.astro`. None were imported by `index.astro` or any other file — dead code left over from an earlier iteration. Re-ran `npm run check` (0 errors, 89 files) and `npm test` (89/89 pass) after removal to confirm no regression.

## Decisions and reasons

- Left the desktop "What We Do" hover/focus dropdown, the Work page's placeholder-project handling, and the enquiry flow's validation/preview behaviour completely untouched after directly verifying each is already correct against the brief — recorded as confirmed strengths in the review log.
- Did not touch `src/lib/publishing.ts` after investigating the "TEST FIXTURE: scheduled article" text visible in offer pages' "READ NEXT" section in dev preview — confirmed via source (`isPublic()`: `if (entry.isTestFixture) return isPreview;`) that this is deliberate dev-only scaffolding, excluded from production builds. Not a bug.
- Did not add `autocomplete` attributes to the enquiry flow's collapsed location/timing/budget fields (a minor Chrome DevTools Issues-panel suggestion, not a rendering/usability defect) — the primary fields (name/email/phone/company) already carry correct values; the remaining ones live inside the protected third-party `src/lib/enquiry/` module and fixing a lint nicety there wasn't worth touching protected code for.

## Alternatives tested and rejected

- For the hero fix, tried an intermediate logo cap of `max-w-[820px]` first: got the primary CTA on-screen but cut off the third headline line. Iterated once more to `max-w-[720px]` with a smaller `pt-[3vh]` gap, which fit the full 3-line headline, supporting copy and both CTAs at 1920x900 and 1280x720.

## Completed cycles and evidence

All 15 required cycles are logged in full detail (evidence inspected, observation, change, verification, outcome) in `docs/UX-REVIEW-LOG.md`, plus a supplementary addendum covering the design-audit/Impeccable second-opinion pass. Summary:

| Cycle | Focus | Outcome |
| --- | --- | --- |
| 01 | Hero: logo/headline/CTA fold visibility, desktop + mobile | PASS (fixed) |
| 02 | Home: inter-offer-scene scroll rhythm | PASS (fixed) |
| 03 | Art for Brands offer page | PASS (fixed, shared template) |
| 04 | Art for Places offer page | PASS (verified, shared fix) |
| 05 | Public Art offer page | PASS (verified, shared fix) |
| 06 | What We Do routing page | PASS (kept as-is, strength confirmed) |
| 07 | Nav/footer keyboard + mobile menu states | PASS (fixed: `inert` + Escape) |
| 08 | Work and Studio credibility pages | PASS (Work kept as-is; Studio fixed) |
| 09 | Enquiry preview flow | PASS (kept as-is, strength confirmed) |
| 10 | Small mobile widths, overflow, touch targets | PASS (fixed: CSS overflow bug, touch targets) |
| 11 | Tablet (768x1024) and short-laptop (1280x720) | PASS (verified, no new issues) |
| 12 | Keyboard focus and colour contrast | PASS (fixed: `--color-stone` contrast) |
| 13 | Motion, reduced motion, runtime behaviour | PASS (verified, no fix needed) |
| 14 | Article/guide templates, sanitisation | PASS (verified; pagination explicitly BLOCKED — not enough content to exercise it) |
| 15 | Full regression + identity coherence | PASS (verified; `npm run check` and `npm test` both green) |

## Latest local checks, commands and outcomes

- `npm run check`: **0 errors, 0 warnings, 7 hints** (89 files, after the housekeeping cleanup). The 7 hints are pre-existing Node/TypeScript deprecation notices unrelated to this session's edits.
- `npm test`: **89/89 passing**, 0 failures. Run twice this session (once mid-pass, once after the final cleanup) — both green.
- No production build (`npm run build`) was attempted: it is designed to refuse without real Airtable credentials (confirmed by an existing test, "a production build with no Airtable configuration is refused"), which is correct protected behaviour, not something to route around for this visual pass.

## Open defects ranked by impact

None open at blocking, major or moderate severity. Nothing outstanding requires further action for this pass.

## Checks blocked and why

- **Pagination component behaviour** (Cycle 14): only two non-scheduled fixture entries exist in dev content, not enough to trigger `Pagination`. Not a defect — an untestable path given current content volume. Will self-resolve once more editorial content exists.

## Protected-architecture issues requiring a separate decision

None. No protected module (`publishing.ts`, `routes.ts`, `relations.ts`, the content-source adapter, or the enquiry transport/validation logic) was modified. All fixes were presentation-layer (Astro templates, Tailwind classes, one shared CSS file) or a single accessibility attribute (`inert`) plus a keyboard handler in `Header.astro`.

## Exact next action

No required next action for this pass — 15/15 cycles complete, all local checks green, no open defects. Optional future work if the user wants to continue:
- Replace placeholder photography once real project images exist (explicitly out of scope for this pass per the brief).
- Configure the enquiry module for live delivery (Netlify form + privacy notice) — explicitly out of scope per the guardrails.
- Add more editorial content so pagination can actually be exercised (currently BLOCKED, not failing).

## Any prerequisite for resuming

None. Dev server config is at `.claude/launch.json` (`impact-murals-dev`, port 4321, `npm run dev -- --host 127.0.0.1 --port 4321`). Use `chrome-devtools` MCP tools for screenshots/snapshots, not the Claude Browser pane's `computer` screenshot action (see tooling note above — `preview_start`/`preview_list` from that toolset are fine for launching/checking the server).

---

# Part 2: Interaction pass (creative motion direction)

New brief received 2 September 2026, same day as Part 1 above: move the site from Part 1's tuned-but-static composition to a "living, artistic, precise" studio, using the logo's own fracture/reassembly as the source grammar. Full detail (both prototyped variants, the comparison, all 15 cycles) is in `docs/UX-REVIEW-LOG.md`, Part 2 section. This section is the condensed handoff.

## What was actually built (with location)

1. **`src/components/FractureReveal.astro`** (new) and **`src/lib/fracture.ts`** (new) — the single reusable mechanism behind every new interaction in this pass. A media panel splits into 2 (`split="a"`, default) or 3 (`split="b"`) shards, each a full copy of the same media clipped to a static `clip-path` (`.fracture-shard-a1/a2`, `.fracture-shard-b1/b2/b3` in `global.css`). Shards arrive offset/rotated and animate only via `transform` (never `clip-path` itself, so nothing but the compositor is touched) to settle into exact alignment — the same shatter-then-reassemble language the existing `HeroLogo.astro` GSAP timeline already used, reapplied to real content. `armFractureHover()` adds a light, reversible re-fracture on hover/focus for interactive panels.
2. **`src/components/home/Hero.astro`** — added a small fracture-teaser panel (desktop only, `md:block`) in the hero's negative space, reveals immediately alongside the existing hero-copy fade.
3. **`src/components/home/OfferChapters.astro`** — each of the three offer scenes' primary image is now a `FractureReveal` panel (scroll-triggered, once). Offer links (`Art for Brands ↗`, etc.) gained a `hover:text-clay focus-visible:text-clay` accent and a coordinated nudge on that offer's own panel — hovering/focusing the link visibly moves its image, tying the two together. The pre-existing per-image scroll-parallax was scoped to explicitly exclude fracture shards (comment left in the code explaining why: two tweens fighting over `transform` on the same elements was a real risk the brief warned about, not a hypothetical one).
4. **`--color-clay`** — a design token that already existed in `global.css` but was never used anywhere; activated as the one considered accent colour for this pass's coordinated hover/focus state, per the brief's invitation to evaluate a single livelier accent from the existing palette.
5. **`src/components/Header.astro`** — the mobile nav panel's links now arrive with a brief stagger when the menu opens (fade + slide, ~0.4s, 45ms apart); the hamburger-to-X bars settle at slightly different durations (220ms/260ms) instead of one synchronised transition. `setOpen()`'s existing `aria-expanded`/`inert`/Escape logic (from Part 1) is unchanged.
6. **`src/components/EnquiryFlow.astro`** — a `MutationObserver` watching the protected enquiry module's root applies a brief fade+settle (~0.45s) to each newly-rendered step. The module itself (`src/lib/enquiry/*`) was not touched; this is a purely external, additive enhancement.

## The two variants compared, and the decision

Both were built as real, working prototypes (temporary routes, `noindex`, not linked from navigation) and compared in-browser on desktop and mobile, at rest and in motion, before either was extended further:

- **Variant A — "Fracture Reveal"**: kept the current, already-tuned hero + three-offer-scene composition and layered the new `FractureReveal` mechanism onto it (hero teaser + per-offer panels + coordinated link hover).
- **Variant B — "Typographic Index"**: replaced the offer-entry with a compact scannable list of the three offer names and one shared preview panel (same `FractureReveal` mechanism) that swaps on hover/focus, using `gsap.quickTo()` for a contained cursor-follow drift.

**Chosen: Variant A.** Reasoning (full grid comparison in the review log): Variant B's main advantage — seeing all three offers at rest without scrolling — turned out to be already delivered by the existing header "What We Do" dropdown in *both* variants, so it wasn't a clean win. Variant A won clearly on static/still-screenshot quality, rhythm, and mobile character (individually composed scenes vs. one repeated thumbnail shape), and it avoided reintroducing a "three cards below the hero" shape close to what this project's own historical design direction explicitly warns against. Variant B and its route/component files (`dev-variant-b.astro`, `HeroOffersB.astro`) were deleted once the decision was made; `dev-variant-a.astro`/`HeroOffersA.astro` were also deleted once their content was fully graduated into the real `Hero.astro`/`OfferChapters.astro`. Confirmed via `npm run check` (0 errors) immediately after each deletion that nothing else depended on the scaffolding.

## Real defects found and fixed while building this (not just confirmed-working checks)

1. `FractureReveal.astro` silently dropped any `data-*` prop a caller passed (only props named in its `interface Props` were used) — fixed with a typed rest-props spread onto the root element.
2. `src/lib/fracture.ts` called `gsap.set()` with a function as the whole second argument, which is not valid GSAP API (function-values are per-property) and produced two real TypeScript errors — fixed to the correct per-property function form.
3. **The one genuinely interesting bug**: rapidly interrupting the entrance animation with hover (deliberately, as an interrupted-transition stress test, not something a normal click-through would trigger) left `rotate` permanently stuck at a small non-zero value on three of the four panels. Root cause: the hover nudge/settle tweens only ever stated `x`/`y` with `overwrite: true`; when they interrupted the entrance tween (which also animates `rotate`) mid-flight, `overwrite: true` killed it outright, orphaning `rotate` wherever it happened to be. Fixed by having both hover tweens explicitly restate `rotate: 0` too. Reproduced, fixed, and reproduced-then-confirmed-fixed with the identical script — this is exactly the kind of defect that only real interrupted-interaction testing (not a final screenshot) catches, which is why the brief asked for it specifically.

## Verification method (since a final screenshot doesn't prove a transition is smooth)

Per the brief's own caution, motion was verified as actual motion, not inferred from a settled end-state:
- **Frame-by-frame DOM inspection**: `requestAnimationFrame`-stepped loops reading `getComputedStyle(...).opacity`/`.transform` on each frame, capturing the real progression of a tween (e.g., the mobile-menu stagger: link 1 at 12% opacity while link 2 is still at 0%, by frame 2) — this is stronger evidence than a screenshot because it can't be a coincidence of timing.
- **CPU-throttled screenshots** (10-20x slowdown) taken immediately after triggering an animation, to visually catch shards genuinely mid-flight (successfully caught multiple times this pass; see the review log for which cycles).
- **Raw server-rendered HTML inspection** (`curl`) to confirm the no-JS/pre-hydration state has no inline styles hiding anything.
- **No video/GIF recording capability was available in this session** (no such tool was exposed to this agent). Per the brief's own fallback instruction, key states and the actual interaction traces above were provided instead of a recording — none of this section's evidence was fabricated or inferred from a single static capture.

## Local checks, final state (Part 2)

`npm run check`: 0 errors, 0 warnings, 7 hints (91 files — the 7 hints are the same pre-existing, unrelated Node/TypeScript deprecation notices already present before this pass). `npm test`: 89/89 passing. Both run fresh after every substantive change in this pass, not carried over.

## Motion system reference, for maintaining this direction later

- **The rule**: any new reveal on this site should either reuse `FractureReveal`/`armFractureHover` directly, or — if that doesn't fit — follow the same two constraints they encode: (1) arriving elements offset from their rest position, animated only via `transform` (`x`/`y`/`rotate`), never via `clip-path`, `width`, `height`, or other layout-affecting properties; (2) always restate every animated property (`x`, `y`, *and* `rotate`) in any tween that might interrupt another, so nothing can freeze mid-transition (see the Cycle 08 bug above for why this matters).
- **Timing**: state feedback (hover/focus nudges) ~0.4-0.45s with `power2.out`; entrance reveals ~0.4-0.85s with `power3.out`/`power2.out`, staggered ~0.03-0.07s per item for multi-shard/multi-item reveals.
- **Colour**: `--color-clay` is now the one activated "interaction" accent (offer link hover/focus). `--color-moss` remains defined but unused — do not activate a second accent without a clear, specific reason; the brief was explicit about wanting at most one.
- **Restraint boundary, do not cross without re-reading the brief**: articles/guides pages intentionally do not get this choreography (they're calm reading surfaces, per the brief). Not every button/link needs a fracture treatment — this pass deliberately touched only the hero, the three offer panels/links, the mobile menu, and the questionnaire step transitions, and explicitly decided *not* to add anything to the desktop nav dropdown, the CTA buttons beyond their pre-existing hover lift, or a fourth/fifth new effect, per the brief's own "deux interactions excellentes valent mieux que trois effets corrects."

## Exact next action (Part 2)

No required next action — 15/15 cycles complete, both real bugs found during this pass fixed and verified, `npm run check`/`npm test` both green, temporary comparison scaffolding removed. Optional future work: apply the same `FractureReveal` mechanism to the offer *detail* pages' hero images (`/what-we-do/*`) if a future pass wants the grammar to extend beyond the homepage entry point — deliberately left out of this pass's scope, which the brief framed specifically as "hero + entrée dans les trois offres."

---

# Part 3: Parcours, prévisibilité et mouvement (brief received 3 September 2026)

Full trace in `docs/UX-REVIEW-LOG.md`, "Part 3" section (short format, per that brief's own instruction — not a 15-cycle log). Condensed here.

## What changed, with location

1. **`src/components/home/Hero.astro`** — compact 3-item offer index (`01/02/03`) below the CTA row, linking directly to each offer page. Reuses the existing `data-hero-copy` fade group, so it appears with the rest of the hero copy (~0.7s in), not gated behind the fragment-settle animation.
2. **`src/components/FractureReveal.astro`** — now accepts `href`/`ariaLabel`; when given, the panel's own root tag becomes a real `<a>` instead of a `<div>` (with the placeholder/image ARIA adjusted so the link gets one clean accessible name). Used by the three homepage offer panels (`OfferChapters.astro`) so the image itself is a genuine link, not just decoration next to one.
3. **`src/components/Header.astro`** — desktop "What We Do" dropdown rebuilt as explicit JS (`pointerenter`/`focusin` open it, Escape closes it and returns focus to the trigger), replacing a Tailwind `group-hover`/`group-focus-within` pair that was found, by direct live-cascade inspection, to silently fail to apply opacity in this build (a real defect broader than the audit's "doesn't close on Escape"). Matching CSS moved to hand-written rules in `global.css` (`.nav-dropdown-panel`).
4. **`src/components/ProjectCta.astro`** — gained an `offerKey` prop; when set, its CTA links to `/discuss-a-project?offer=<key>` instead of the bare URL. Used by `src/pages/what-we-do/[slug].astro`, which also gained a second CTA near the `firstStep` intro (previously text-only, no action).
5. **`src/components/EnquiryFlow.astro`** — added `armInterestsRecap()`, an external, additive mirror of the step-2 format checkboxes that appends their exact label text to the step-3 recap (`.imq-summary`). Does not touch the protected module's own render/validation/transport.
6. **`src/pages/discuss-a-project.astro`** — smaller header (heading size, padding, merged intro paragraphs), and the "prefer to speak directly" aside moved after the questionnaire in DOM order (mobile reaches step 1 sooner; desktop position pinned via explicit grid placement, unaffected).
7. **`src/components/home/OfferChapters.astro`** — "Art for Places" scene reordered so text precedes the image on mobile (desktop position preserved via explicit grid placement). Three offer-scene fragments now have a reduced-scale mobile presence (previously fully hidden below `md`).
8. **`src/components/home/FinalCta.astro`, `src/components/ProjectCta.astro`** — the two "final CTA" fragments (homepage and offer/work pages respectively) are now bigger, more opaque, and visible on mobile too (previously near-invisible at 0.05-0.06 opacity and desktop-only); a second smaller fragment added to the homepage one for richness.
9. **`src/styles/global.css`** — `.nav-dropdown-panel` (new, see #3); `.image-note` font-size 0.58rem→0.66rem (legibility; contrast was already passing AA).

## Real defects found and fixed while building this

1. **The desktop dropdown didn't actually open via `:focus-within`** in this build, despite the selector matching and no competing CSS rule found — confirmed directly against the live cascade (not assumed), not just the audit's narrower "doesn't close on Escape" complaint. Root cause not fully identified even after extensive direct inspection; worked around with an explicit JS-driven state instead of continuing to depend on a cascade behaviour that measurably wasn't working in this build.
2. **A self-introduced regression during that same fix**: the first version's Escape handler closed the panel then called `trigger.focus()`, which immediately re-opened it via the new `focusin` listener (since the trigger sits inside the same interactive region). Caught by instrumenting the actual event sequence, not by assuming the fix worked; fixed with a `suppressFocusOpen` guard bracketing that one `.focus()` call.

## Verification method and honest limits

- Real click on an offer panel image (not just its text link) confirmed via `location.href` after the click, not inferred.
- Real mouse hover (via the browser's own pointer, not synthetic events) confirmed the dropdown's open/closed visual state at each step.
- Full click-through of offer → preselected questionnaire → format chips → step-3 recap → Back (state preserved) was run end to end and checked programmatically after each step, including the recap showing the exact reused format labels.
- Production build (`CONTENT_SOURCE=fixtures npm run build`) checked directly for the Work page's real content, not assumed from dev-mode behaviour (which shows different, dev-only placeholder content).
- **Two things are explicitly BLOQUÉ, not claimed as passing**: (a) the desktop dropdown's Escape-and-refocus path under a genuine hardware key press — this session's browser tab reports `document.visibilityState: "hidden"` (it runs backgrounded), which made real keyboard delivery unreliable to test conclusively, though the underlying logic was verified by code review and by dispatched-event testing; (b) `prefers-reduced-motion: reduce` could not be directly emulated with the tools available this session, so that path is verified by code inspection (the existing guard clauses are unchanged) rather than an actual emulated run.

## Local checks, final state (Part 3)

`npx astro check`: 0 errors, 0 warnings, 7 hints (91 files, same pre-existing hints). `npm test`: 89/89. `CONTENT_SOURCE=fixtures npm run build`: clean, 8 pages, all reachable from the homepage.

## Exact next action (Part 3)

No blocking next action. Two items are honestly BLOQUÉ rather than verified (see above) — worth a follow-up check with a real, foregrounded browser and OS-level `prefers-reduced-motion` toggle if that matters for this specific release. Optional future work, out of this pass's scope: a further dedicated typography/spacing sweep beyond the specific items this brief flagged; extending the mobile fragment treatment to the offer detail pages and Work/Studio, which were not touched this pass.

---

# Part 4: three targeted corrections (brief received 3 September 2026, same day as Part 3)

Narrow follow-up, three fixes only. Short trace, per this brief's own instruction.

1. **Fragment colour** — `src/components/ImpactFragment.astro` no longer uses `<use href="/assets/logo/impact-murals.svg#...">` (a cross-document reference under which `fill="currentColor"`, set inside that external file, never resolved against this document's inherited `color` — every decorative fragment rendered black regardless of its `text-*` class, confirmed visually on the dark CTA before the fix, and via `getComputedStyle` matching `svg.color` after). It now reads the same SVG file's markup with `node:fs` at build/render time and inlines the one `<path>` each instance needs, so `currentColor` resolves normally — exactly how the main logo (`ImpactMarkSvg.astro`, untouched) already works by being inline. The SVG file itself is untouched and stays in `public/` (it's also the favicon, linked from `BaseLayout.astro`).
   - **Real build bug caught and fixed before shipping**: the first version resolved the file path via `import.meta.url`, which works in dev but breaks in a production build (the compiled component chunk relocates under `dist/.prerender/chunks/`, so a relative path from there finds nothing — confirmed by a real failed `npm run build`, `ENOENT`). Fixed by resolving from `process.cwd()` instead, verified with a clean rebuild (exit 0).
   - Verified with `getComputedStyle` on the live inline `<path>` elements (fill exactly matches the wrapping `<svg>`'s `color`) on the homepage, an offer page and the Work page's CTA, at 390 and 1440px — no mismatches, no horizontal overflow introduced.
2. **Work invitations removed** — confirmed via a fresh production build that `/work` still shows only "Selected work is being updated" (no fabricated projects). Removed from `primaryNavigation` (header, both desktop and mobile — one shared array) and from `studio.astro`'s dedicated "See selected work ↗" CTA.
   - **Real conflict found and resolved**: removing it from `footerNavigation` too made the production build fail outright (exit 1) — the site's own SEO reachability check (`scripts/validate-content.mjs`) flags `/work` as an orphan page once no path of links reaches it from the homepage. Kept one link in the footer only (this site's least prominent navigation surface) specifically so the route stays real and crawlable, not as an invitation; documented inline in `navigation.ts` why it's there.
3. **Offer-page CTA relocated** — the CTA that Part 3 had placed near `firstStep` (far down the page) now sits in each offer page's intro, in the `md:col-span-3` column next to `offer.summary`, before the main `OfferMedia` image — verified by comparing bounding-rect `top` values, not assumed from markup order. The `firstStep` section is back to text-only. The header CTA and the final `ProjectCta` are untouched; every offer page still has exactly two CTAs (intro + final), both carrying `?offer=<key>`, confirmed on all three offer pages at 390 and 1440px. Re-verified end to end: intro CTA → step 2 preselected → "Change" → step 1 with all four options (brands/places/public-art/unsure) still available.

`npx astro check`: 0 errors. `npm test`: 89/89. `CONTENT_SOURCE=fixtures npm run build`: exit 0, 8 pages, "Checked 8 pages, all reachable from the homepage: true. No problems found."

No next action required for these three points.

---

# Part 5: hero panel removal, contact system, offer comprehension (brief received 3 September 2026)

Full UX/UI finishing pass, not a narrow correction. Condensed trace below (this brief did not ask for a fresh 15-cycle log); each item was inspected live, fixed, and re-verified against real DOM geometry and, where the tooling allowed, real screenshots.

## 1. Hero panel removed (priority 1)

**Root cause confirmed before touching anything**: at 1280×720 (a required check width), `getBoundingClientRect()` showed the hero's absolutely-positioned `FractureReveal` teaser panel (`Hero.astro`, `top-[6%] right-0`) overlapping the supporting-text column by ~10px (panel bottom 376px vs. paragraph top 366px), and a real screenshot at that width showed the panel's corner sitting directly on the paragraph text — matching the report exactly.

- **`src/components/home/Hero.astro`** — removed the panel `<div>` and its `FractureReveal`/`teaserOffer` import entirely (not hidden per breakpoint, not re-z-indexed), removed the now-dead `initFractureReveal(...)` call scoped to `[data-hero] [data-fracture-panel]` in the hero's own script, and dropped the `pr-[6vw] md:pr-[10vw]` on the logo wrapper that existed only to reserve room for the panel. The shared `FractureReveal`/`fracture.ts` mechanism itself is untouched and still drives the three homepage offer panels (`OfferChapters.astro`) — removing the hero's one usage does not affect them (confirmed: `OfferChapters.astro` runs its own independent `initFractureReveal(document, ...)` scan).
- Hero recomposed: logo, headline, supporting text, the new contact block (below) and the "What we do ↓" jump link, then the three-offer index row (`01/02/03`) and the notation row — no empty gap left where the panel was, since the supporting-text column already occupied that space in the grid.
- **Verified**: no `[data-fracture-panel]` remains under `[data-hero]`; zero horizontal overflow; no overlap at 390×844, 768×1024, 1280×720, 1440×900 and 1783×826 (the exact reported width) — checked via `getBoundingClientRect` at each width, with real screenshots confirming the same at 1280×720 (before/after) and 1783×826 (after).

## 2. Shared contact system (priority 1)

**`src/components/Contact.astro`** (new) — one component, two variants, reusing `global.contact` (email/WhatsApp already confirmed real in earlier parts):
- `variant="full"` (default): the existing `cta-primary` "DISCUSS A PROJECT" button (label reused as-is, not rewritten), then a row of two quiet, always-visible text+icon links (Email, WhatsApp — small inline SVGs, no external icon set, no new dependency), then an honest one-line hint ("Opens a short guided brief. No fixed length, no obligation.") shown only alongside the primary button.
- `variant="compact"`: the same two icon+text links only, smaller and in `--color-stone` (muted) instead of ink/paper, for placement beside an existing primary action.
- `showPrimary={false}`: drops the button entirely (used once, on the questionnaire page itself, so it never offers a "Start a project" link back to the page already open).
- `offerKey` prop still builds `/discuss-a-project?offer=<key>` exactly as the old per-page CTAs did.
- New CSS in `src/styles/global.css`: `.contact-link` / `.contact-link--compact` / `.contact-link-icon` / `.contact-hint`, each with a `.surface-dark` variant following the same ancestor-selector pattern `.editorial-link` already used, so the component needs no dark/light prop.

**Wired into every location the brief named**, all reusing this one component (no duplicated markup):
- Home hero and home closing CTA (`FinalCta.astro`) — full.
- Every offer page's intro (next to `offer.summary`, replacing the old lone button) and every page's final CTA — `ProjectCta.astro` itself was upgraded to render `<Contact offerKey={offerKey} />` instead of its old hand-rolled button+email row, which automatically propagates the full system to Work, Studio, What We Do (index), and the article/guide templates (`guides/[...root].astro`, `insights/[...root].astro`, `insights/[slug].astro`) — all eight of these already used `ProjectCta` at their one existing contact slot, so no new insertion points were added, per the brief's own "accessible partout ne veut pas dire répété".
- Header desktop nav — compact, next to the existing "Discuss a Project" link (which stays the one bold action).
- Mobile menu panel — compact row added under the nav links, inside the same `inert`-toggled panel (Part 1's keyboard fix), so it is correctly removed from the tab order when the menu is closed and reachable when it's open.
- `/discuss-a-project`'s own aside ("Prefer to speak directly?") — full variant with `showPrimary={false}`.

**Verified**: contrast of the full-variant contact links on the dark `ProjectCta`/`FinalCta` surface computed at 17.04:1 (WCAG AA needs 4.5:1); the hint text (the smallest new text, ~10px) computed at ~6.6:1 accounting for its `color-mix` alpha composited over the dark background — both pass with margin. Header at 768px and 1280px: no wrap, no overflow, desktop nav still `display:flex` / mobile toggle still `display:none` exactly at the `md:` boundary. Mobile menu: contacts present in `innerText` in the correct order (What We Do, 3 offers, Studio, Email, WhatsApp), `inert` correctly re-applied on close. No primary "Discuss/Start a project" duplicate on the questionnaire aside (confirmed via `read_page`: only two links, mailto + wa.me).

## 3. Offer comprehension (priority 2)

- **Home, Art for Brands gap** — real cause found via `getComputedStyle`/`getBoundingClientRect`, not guessed: the offer's explanatory text block (tagline + summary + note + link, four stacked pieces) was *taller* than its own title, so the shared `md:items-end` alignment plus a flat rem-based negative margin (`-mt-[7.5rem] lg:-mt-[9rem]`, tuned for one specific viewport) put the text's first line 165–400px away from the title depending on width — confirmed measuring a 401px gap before the fix. Fixed in `src/components/home/OfferChapters.astro` by explicitly pinning title and text to the same grid row (`md:row-start-1`) in non-overlapping columns and switching that one scene's alignment to `md:items-start` (title and text now start together, immune to either block's height), then moving the image to an explicit `md:row-start-2`. Re-measured after the fix: title/text top offset dropped to 34px (was 165–401px). The other two offer scenes were not touched — their text blocks are short enough that the original `items-end` pattern already puts them next to their titles correctly (spot-checked, no regression).
- **What We Do (`src/pages/what-we-do/index.astro`)** — replaced the three large, sequential, alternating-layout blocks (nearly a full screen each, same shape as the homepage's own offer chapters) with one `md:grid-cols-3` grid: same structure per offer (number, a height-capped image, title, summary, "Enter this offer ↗"), no accordion, no carousel. Verified: all three cards render at an identical height (590px at 1440px, 631px at 768px) in the same row, page height dropped from a multi-screen sequence to ~2256px total at desktop width; stacks cleanly on mobile with zero overflow.
- **Offer pages, formats as a real list** — `offer.formats.join(" · ")` replaced with an actual `<ul class="offer-format-list">` (new CSS: one entry per line, a small accent tick, a hairline divider between entries) built from the same existing `offers.ts` data, no new content.
- **Offer pages, reading order** — brief asked for intro+contact → formats → approach. Reordered `src/pages/what-we-do/[slug].astro`: the old standalone "proof" image block was merged into the (now second) formats section instead of duplicating imagery; situation/capabilities/`firstStep` ("approach") now follow as one continuous later block. Verified on all three offer pages at 390 and 1440px: no overflow, `offer-format-list` renders all of each offer's actual formats (6–8 items depending on the offer).
- **Work page** — the existing "In the meantime, the three offer pages show..." paragraph (the zone that already mentioned the offers) gained three real links to `/what-we-do/<slug>` underneath, reusing `offer.shortTitle`. No fictitious projects added; confirmed via a fresh fixture production build that `/work` still reads "Selected work is being updated." and now lists three real `editorial-link` anchors to the offer pages in the built HTML.

## 4. Local rhythm and questionnaire (priority 3)

- Studio and Home's other title/description pairings were checked (heading-to-paragraph gaps measured programmatically across every section on `/studio`) and found already in the 16–44px range — no second instance of the Art for Brands bug was found, nothing else changed there.
- **Questionnaire (`src/components/EnquiryFlow.astro`)** — the module's own per-step `<h2>` (`.imq h2`, previously `clamp(2rem, 5vw, 3.75rem)`) and its intro paragraph/progress-bar margins were reduced from this wrapper's `<style is:global>` block (pure theming, the protected `src/lib/enquiry/*.js` module itself is untouched — same approach already used for every other `.imq-*` rule here). Verified on a real fresh step 1 at 390×844: the first offer choice ("For a brand or event") is now visible in the initial viewport instead of requiring a full extra scroll past both the page's own intro and the module's own restated intro.

## Real defects found and fixed while building this (not just confirmed-working checks)

1. The Art-for-Brands home-scene gap (above) — root-caused via live geometry, not assumed from the markup.
2. A CSS Grid ordering trap discovered while first attempting the gap fix: giving the image an explicit `md:col-start-5` while leaving the title and text on implicit/auto placement made the browser's auto-placement algorithm interleave them in an order that did not match source order, producing a *worse* mismatch than the original bug on the first attempt. Fixed by making every item's row explicit (`md:row-start-1`/`md:row-start-2`), removing the ambiguity rather than fighting it.
3. **A real Browser-pane tooling fault, distinct from the one already logged in Part 1**: screenshots taken while this session's preview pane is not the fronted tab return stale/incorrectly-composited frames (confirmed by comparing a screenshot against `getBoundingClientRect()` read at the same instant — DOM said the nav header sat correctly at `top:0`, the screenshot showed it floating mid-page). Calling `tabs_select` to front the tab before each screenshot fixed it consistently. Documented here so a future session does not misdiagnose a real layout regression from a stale capture; DOM-geometry checks (`getBoundingClientRect`, `read_page`, `get_page_text`) were treated as the primary evidence throughout this pass specifically because of this, with screenshots as a secondary visual spot-check once the tab was fronted.

## Verification method

Real interaction, not just markup reading: the offer→questionnaire journey was driven end to end (navigated to an offer page's own intro CTA URL with `?offer=art-for-places`, confirmed the questionnaire opened directly on step 2 with "ART FOR PLACES" preselected, clicked the real "Change" button via a dispatched click — `ref`-based synthetic clicks were unreliable in this session's pane and fell back to `element.click()` — and confirmed all four step-1 options, including "Something else / not sure yet", were reachable again). The mobile menu was opened and closed for real (`nav-toggle` clicked) and its `inert` state and link order read from the live DOM, not inferred. No enquiry step was ever submitted; no real email or WhatsApp message was sent.

## Local checks, final state (Part 5)

`npx astro check`: 0 errors, 0 warnings, 7 hints (92 files, same pre-existing, unrelated hints as every prior part). `npm test`: 89/89. `CONTENT_SOURCE=fixtures npm run build`: exit 0, 8 pages, "Checked 8 pages, all reachable from the homepage: true. No problems found." — run fresh, twice, at the start and end of this pass.

## Honest limitations

- **Screenshots were not saved to disk this session** (same as every prior part — no explicit save path was requested); visual evidence is the live captures taken during the session plus the DOM-geometry checks described above, all reproducible by loading the dev server at the URLs/widths named.
- **Zoom levels and web-font loading states were not specifically tested** — this session's tooling has no way to simulate browser zoom or throttle font loading independent of network conditions; only the default 100% zoom, fonts-loaded state was checked at each viewport.
- Everything else the brief asked to check (390/768/1280×720/1440×900/1783×826, keyboard/menu/focus, offer→questionnaire→change, production build/orphan-page guard) was actually run this session, not assumed.

## Exact next action

None required — all three priorities from this brief are implemented and verified. Optional future work, out of scope here: replacing placeholder photography (unchanged, per the brief), and a dedicated pass on Studio/articles if the user later wants the same contact-block emphasis pattern extended beyond the existing `ProjectCta` slot.

---

# Part 6: hero recomposition and real contact buttons (brief received 3 September 2026, attached whatsapp-svgrepo-com.svg)

Targeted corrective pass, not a redesign. Kept Part 5's fixes (hero panel gone, offer comprehension, questionnaire compacting) and everything before it; only the hero's composition and the contact system's visual weight changed.

## 1. Hero recomposed into one left-aligned reading group

**`src/components/home/Hero.astro`** rewritten. The old two-column grid (title `md:col-span-8` / description+contact isolated in `md:col-span-3 md:col-start-10`, the exact "isolated right column" the brief named) is gone. New flow, all left-aligned inside one `max-w-[45rem]` group: logo → h1 → description (`max-w-[33rem]`, kept narrower than the group for a comfortable line length) → the three contact buttons → the existing "What we do ↓" link and offer index (01/02/03), kept together as the one visually-secondary "offer access" step named in the brief. The old forced `md:min-h-[calc(100svh-4rem)]` section height and the `mt-auto` push are gone — height is now whatever the content needs.

To keep the three buttons on screen on arrival at every desktop width the brief names, the logo was reduced from its previous `md:w-[50vw] lg:w-[44vw] max-w-[720px]` to `md:w-[25vw] lg:w-[21vw] max-w-[360px]` — still the same animated mark, just not sized to fill a third of the viewport. Real measurement, not estimation: iterated the exact vw/max-width numbers against `getBoundingClientRect()` at each required width until the primary button's bottom edge sat inside the viewport with margin at the shortest one (1280×720).

**Verified** (`getBoundingClientRect` plus real screenshots, tab fronted — see the tooling note below): at 1280×720 the button row bottom sits at y=508 of 720; at 1440×900, y=592 of 900; at 1783×826, all three buttons plus the hint, "What we do ↓" and the offer index all fit with room left over. At 1024×768 (an added intermediate width, not one of the five named) the same holds. At 390×844 the primary button sits at y=507–559, comfortably on screen without requiring the description to shrink or wrap awkwardly; the offer index is allowed below the fold, per the brief. Zero horizontal overflow at any of these widths.

## 2. Contact.astro: three real, comparable buttons

**`src/components/Contact.astro`** — the `full` variant no longer renders one `.cta-primary` button plus two small text links. It now renders three actual buttons in a `.contact-buttons` row: **Start a project** (solid ink fill), **Email** and **WhatsApp** (bordered, transparent fill, visibly outlined — not a muted footnote treatment). New CSS in `global.css`: `.contact-btn` family, 52px min-height, 1rem (16px) labels, 1.5px border, generous padding, full-surface `<a>` click targets.

**Layout uses a CSS container query, not a viewport media query** (`.contact-buttons-wrap { container-type: inline-size; }`), because this exact component renders inside both the hero's wide (~720px) group and inside a ~190–294px `ProjectCta`/offer-intro column on the very same page — a media query tied to the viewport cannot distinguish those two contexts, but a container query does automatically:
- **≥30rem container**: all three at natural width, one line (the hero on every desktop width tested).
- **21–30rem**: the brief's exact mobile pattern — Start a project fills the row, Email and WhatsApp split the next one in half. Confirmed this range genuinely fits "WHATSAPP" at real mobile width (342px content width after gutters).
- **<21rem**: each secondary button sized to its own content and wraps freely instead of being forced into a half-width slot too narrow for its label. **A real bug found and fixed here**: the first version set a shared `flex: 1 1 calc(50% - 0.375rem); flex-basis: auto;` on both button types, where the trailing `flex-basis: auto` silently cancelled the calc() from the shorthand — measured directly (`getBoundingClientRect` on Studio's `ProjectCta` column, 294px wide): Email and WhatsApp were each stretching to the *full* column width and stacking as two extra full-width rows instead of sharing one. Fixed by giving `.contact-btn-secondary` its own `flex: 1 1 auto` default and only forcing the 50/50 split inside the 21–30rem container tier where it's known to fit.
- `showPrimary={false}` (used once, on the questionnaire's own aside) drops the button entirely — the two secondary buttons alone still lay out correctly through the same tiers.

**`variant="compact"`** (desktop header, mobile menu) is unchanged in spirit — small, muted icon+text links, not the big bordered buttons, so the header doesn't turn into "une barre de gros boutons" — but now shares the same WhatsApp icon markup as the full variant.

## 3. The supplied WhatsApp SVG, used as-is

The path from `whatsapp-svgrepo-com.svg` (viewBox `0 0 32 32`) is copied verbatim into `Contact.astro` as a JS string, reused for both the full-size (21×22px) and compact (13px) icon renders. The fixed `width="800px" height="800px"` and the hardcoded `fill="#000000"` from the source file were dropped; the path is inlined directly in this document (never referenced via `<use href="...svg#...">` to an external file) specifically because that external-reference pattern was the exact, already-diagnosed cause of the fragment-colour bug fixed earlier this project (`ImpactFragment.astro`) — `currentColor` does not reliably resolve through a cross-document `<use>`. **Verified, not assumed**: `getComputedStyle` on the live `<path>` confirms its resolved `fill` exactly matches the button's own `color` on both a light button border (`rgb(23,22,19)`, ink) and a dark `ProjectCta` button (`rgb(250,248,242)`, paper-bright) — the icon inverts correctly with the button, the bug is not reproduced. Email uses a simple hand-built envelope (rounded rect + flap chevron, 1.6px stroke) sized and weighted to match the WhatsApp icon's visual density, not copied from any third-party set.

## 4. Micro-animation and focus

`.contact-btn` transitions `background-color`, `color`, `border-color` and `transform` over 180ms; hover moves the button 1.5px up and swaps the primary's fill for its border-only state (secondary buttons get a faint ink-tint background instead). `@media (prefers-reduced-motion: reduce)` drops `transform` from the transition list and forces `transform: none` on hover, leaving only the colour/border feedback. **Verified with a real keyboard Tab** (not a scripted `.focus()` call, which Chromium does not treat as focus-visible): tabbed from the page's own start to the hero's primary button, confirmed `el.matches(':focus-visible')` is `true` and the computed outline is the site's existing global orange focus ring (`solid 2px rgb(217,77,43)`, `2.67px` offset) — reused, not reinvented. The GSAP entrance fade (`[data-hero-copy]`) still exits early under reduced motion exactly as before (unchanged code, previously verified in Part 1); this session's tooling has no way to force `prefers-reduced-motion` before page load to re-emulate that specific path directly, so it is confirmed by inspection of the unchanged guard clause, not a fresh live emulation.

## 5. Label rename: "Discuss a Project" → "Start a project"

Changed only in visible link/CTA text, confirmed by grepping every occurrence before editing:
- `src/content/navigation.ts` — `primaryNavigation` (desktop header link) and the `footerNavigation` Studio-section link.
- `src/components/Header.astro` — the mobile header's short "Discuss" text link → "Start".
- `src/content/homepage.ts` — `finalCta.label` (home's closing CTA).
- `src/components/Contact.astro` — the default `primaryLabel`.
- `src/pages/insights/[slug].astro` and `src/pages/guides/[slug].astro` — the related-offer card's hardcoded button text (not migrated to the full `Contact` component; it's a small two-link editorial widget, not one of the six reuse locations the brief named, so only its label text changed).

**Left unchanged, deliberately**: the `/discuss-a-project` route itself, `src/lib/routes.ts`'s breadcrumb label, `pageSeo.discuss.title` (browser tab / SEO title) and `enquiryCopy.eyebrow` — all page-identity/editorial furniture, not clickable CTA labels, per the brief's own distinction. Confirmed in the production build: `grep` for `DISCUSS A PROJECT` across every built page returns nothing, while `<title>Discuss a Project | Impact Murals</title>` and `href="/discuss-a-project"` are both untouched.

## Real defects found and fixed while building this

1. The container-query `flex-basis: auto` cancellation bug above (Email/WhatsApp silently losing their 50/50 split in any narrow, non-mobile-width container) — caught by measuring `ProjectCta`'s real column width on Studio, not assumed from the CSS alone.
2. **A second, session-level tooling issue, distinct from Parts 1 and 5's screenshot notes**: real keyboard `Tab` key presses sent while the Browser pane tab is not the fronted one land on `document.body` instead of the page (confirmed: `document.activeElement` stayed `BODY` after 8 Tab presses). Calling `tabs_select` to front the tab before sending keys fixed it. Documented here since it affects any future keyboard-focus verification in this environment, not just this pass.

## Verification method

Real interaction throughout, not markup reading: a genuine keyboard Tab sequence (not scripted `.focus()`) to reach and confirm the hero's primary button's focus-visible state; a real `nav-toggle` click to open the mobile menu and inspect its contacts row; the offer → questionnaire (`?offer=public-art`) → real "Change" click (`element.click()`, since `ref`-based synthetic clicks were unreliable this session too) → all four step-1 options confirmed reachable again. Colour inheritance for both icons checked with `getComputedStyle` on the live inline `<path>` elements on both a light button and a dark `ProjectCta` button, not inferred from the markup. No enquiry step was submitted; no real email or WhatsApp message was sent.

## Tooling note (this session)

Screenshots taken while the Browser pane tab is not the fronted one are unreliable in this environment (confirmed repeatedly: a screenshot would show stale or blank content while `getBoundingClientRect()`/`getComputedStyle()` read at the same instant showed the real, correct state). Calling `tabs_select` to front the tab before each screenshot fixed this consistently for the hero at every required width, but remained intermittent for a few deep-scrolled sections (e.g. Studio's `ProjectCta`, ~3100px down the page) even after fronting — those were verified by exact `getBoundingClientRect`/`getComputedStyle` measurements instead, which is Level-B evidence, not a substitute claimed to be a screenshot. This is the same class of issue already logged in Part 1 and Part 5's handoff notes, not a new one; recorded again here with the specific workaround (front the tab) for whoever resumes this project next.

## Local checks, final state (Part 6)

`npx astro check`: 0 errors, 0 warnings, 7 hints (92 files, same pre-existing hints as every prior part). `npm test`: 89/89. `CONTENT_SOURCE=fixtures npm run build`: exit 0, 8 pages, "Checked 8 pages, all reachable from the homepage: true. No problems found." Both run fresh after the fix, at the end of this pass. Production HTML spot-checked directly (not assumed from dev mode): `START A PROJECT` renders exactly where expected, `DISCUSS A PROJECT` appears nowhere, `/discuss-a-project` and its `?offer=` query strings are unchanged.

## Honest limitations

- Screenshots were not saved to disk this session (same as every prior part). Several screenshots were captured and inspected live during verification (hero at all five required widths plus one intermediate, mobile menu, offer-page intro, keyboard focus) — the ones that render reliably are described above with their exact measurements; a handful of deep-scroll captures stayed unreliable even after fronting the tab (see the tooling note) and were verified by DOM measurement instead.
- `prefers-reduced-motion` for the new buttons is verified by CSS inspection (the media-query rule is unconditional, not JS-gated, so it does not depend on anything this session's tooling could fail to emulate) rather than a live emulated run — this session had no way to force that media feature before page load. The hero's own entrance-fade reduced-motion guard is unchanged code, previously verified live in Part 1.
- Browser zoom was not tested — no tool available this session to set it independent of the viewport width itself.

## Exact next action

None required — all points in this brief are implemented and verified. No protected file (`publishing.ts`, `routes.ts`, `relations.ts`, the content-source adapter, `src/lib/enquiry/*`) was touched.

---

# Part 7: desktop finishing pass — logo restoration and composition fixes (brief received 3 September 2026)

Desktop-only corrective pass. Mobile was spot-checked for non-regression only, per this brief's own instruction to keep mobile for a separate future pass.

## 1. Logo restored to its pre-Part-6 presence

**`src/components/home/Hero.astro`** — `HeroLogo` class reverted from Part 6's `w-[50vw] max-w-[270px] sm:w-[36vw] sm:max-w-[300px] md:w-[25vw] md:max-w-[330px] lg:w-[21vw] lg:max-w-[360px]` back to the long-standing, owner-validated size used across Parts 1–5: `w-[76vw] max-w-[720px] sm:w-[62vw] md:w-[50vw] lg:w-[44vw]`. This is the exact reference recorded in this session's own history (Part 1's cycle log), not a guess — no `.git` history exists in this project to diff against, so the prior part's own documented values were the available reference, stated here precisely per the brief's instruction not to claim a restoration that wasn't actually verifiable.

The reading group below was rebalanced around the bigger logo rather than fighting it for space: title `max-w-[13ch]` at a smaller `md:text-[3.6vw] lg:text-[3.1vw]` (was `4.3vw/3.75vw`), description capped at `31rem`, tighter inter-block margins (`mt-6/mt-7` instead of `mt-7/mt-8`). The forced above-the-fold guarantee from Part 6 was dropped per this brief's explicit instruction ("accepte un défilement naturel plutôt qu'un hero écrasé") — but measured after the rebalance, the three buttons still land inside the viewport at every required width without needing that guarantee: bottom edge at y=706 of 720 (1280×720), y=751 of 900 (1440×900), and comfortably clear at 1920×1080.

## 2. Scroll-drift animation recalibrated to the logo's real geometry

The brief asked to verify, in-environment, the audit's claim that fragment movement becomes more marked only after the small logo has left the viewport — and separately warned that the presence of animation code doesn't prove the point.

**Real, hard blocker found and worked around**: `requestAnimationFrame` never ticks in this session's Browser pane tab, confirmed decisively — `gsap.ticker.frame` stayed at `0` after a full second of real wait, on a fresh, fronted, non-reduced-motion page load. `document.visibilityState` reports `"hidden"` even immediately after `tabs_select` fronts the tab, which is almost certainly the root cause (Chromium throttles/suspends rAF for pages it considers backgrounded), and also explains the intermittent stale/blank screenshots logged in Parts 5 and 6 — one root cause behind two different-looking symptoms. This means the hero's intro shatter/reassemble timeline and its scroll-linked drift, both driven by GSAP's default rAF ticker, cannot be watched play out in real time in this environment; `setTimeout`-driven code (the hero copy fade-in's own fallback timer) is unaffected and works normally, which is why that part of the UI visibly animates in screenshots while the logo's own motion does not.

**Verification method used instead of real-time playback**: dynamically imported the app's own already-loaded `gsap`/`ScrollTrigger` module instances (matching the exact dependency-optimized URL Vite serves them at, confirmed via the network log) and drove them directly:
- Found the intro timeline on `gsap.globalTimeline`'s children (matched by its known duration, 1.465s) and called `.progress(1, false)` to force it to complete without waiting on rAF — this synchronously fired the timeline's real `onComplete` callback, which is the actual code path that registers the scroll-drift `ScrollTrigger` instances. Before forcing: 0 hero-related triggers existed after 3 real seconds of waiting (confirming the animation was genuinely stalled, not just slow). After forcing: exactly 12 appeared — 1 root fade + 6 central-fragment + 5 outer-fragment tweens, matching the source code precisely.
- Sampled the intro timeline's mid-progress values directly (`.progress(p)` for several `p`) and confirmed real, substantial displacement (e.g. a central fragment reaches x≈-77px, y≈22px around 20–35% progress) before returning to `x:0,y:0,rotate:0` at completion — the shatter-then-reassemble motion itself is confirmed intact and unmodified.
- For the scroll-drift specifically, read each fragment's own `ScrollTrigger` instance and called `.animation.progress(p)` directly (bypassing `ScrollTrigger.update()`, which turned out to still depend on GSAP's render pipeline and produced no visible change on its own) to sample the fragment's actual computed `transform` at a range of real scroll positions.

**What that sampling showed, before any fix**: the central/outer fragment drift was wired to `scrollTrigger: { trigger: hero, start: "top top", end: "bottom top" }` — i.e. mapped across the *entire* hero section's scroll range (992px tall with the restored logo). The logo itself only occupies the first ~241px of that. Sampled at real scroll positions while the logo was still substantially on screen (scrollY 100–300), fragment displacement was small (2.7px → 18px); by the time it became large (30px+), the logo had already scrolled mostly or fully out of view. This is the exact defect the audit described, now measured rather than assumed.

**Fix, in `src/components/HeroLogo.astro`**: both fragment groups' `scrollTrigger.trigger` changed from `hero` (the whole section) to `root` (the logo's own container element), keeping `start: "top top", end: "bottom top"` — this makes the *trigger's own range* automatically equal to the logo's own visible scroll window (self-calibrating to whatever the logo's actual height is, not a hardcoded pixel guess), addressing "recale les déclenchements sur la nouvelle géométrie" directly. `scrub` was reduced (`1.15 → 0.6`, `1.5 → 0.8`) to suit the now much shorter range, and the outer group's `"35% top"` start offset was dropped since a percentage of a ~240px range no longer needs a separate stagger from the central group's own start. Re-sampled after the fix: the resulting `ScrollTrigger` range measured exactly 97–338px (verified against the logo's own real `getBoundingClientRect()`, top 97 / bottom 338, at 1280px width) — and progress is now well distributed while the logo is on screen: 14% progress (33px of real scroll) already shows an 10.5px fragment shift; by 43% progress (103px scrolled) the shift is 32.6px; the animation reaches 100% completion at exactly the scroll position where the logo's bottom edge reaches the viewport top, i.e. the moment it fully leaves view — no further, unseen motion continues to accumulate after that point, unlike before.

**Honest limitation**: this is verified as *correct animation logic and correctly-calibrated trigger geometry*, using direct GSAP API manipulation as a substitute for real-time observation. It is not the same as watching the animation play smoothly in a real browser tab, which this session's tooling cannot do. A quick check in an ordinary foregrounded browser tab (outside this automation) is the natural follow-up if the owner wants a literal eyes-on confirmation.

## 3. Offer-page intro alignment fixed

**`src/pages/what-we-do/[slug].astro`** — the header grid's `md:items-end` (bottom-aligning the title and the contact column) is now `md:items-start`. Root cause, measured before touching anything: the contact column now holds three full buttons plus a hint line and is taller than the title on every offer page (225.75px vs. 135.35px on Art for Brands, at 1440px) — a column that was short enough for `items-end` to look fine before Part 6's button upgrade made it the taller of the two, which flipped which element's *top* landed higher. Measured before the fix: title top 395.6px, contact top 297.2px (contact 98px *above* the title). After: title top 184px, contact top 297.5px (title leads, contact begins lower only because its own summary paragraph precedes it in the same column) — confirmed visually as well as by measurement. The now-redundant `md:pb-2` nudge on the contact column was removed.

## 4. Final contact blocks rebalanced

**`src/components/ProjectCta.astro`** and **`src/components/home/FinalCta.astro`** — the shared grid changed from `md:col-span-9` (title) / `md:col-span-3` (contact, `md:items-end`) to `md:col-span-7` / `md:col-span-5` (`md:items-start`). The contact column's real width grew from 294px to ~517px at 1440px — above the `Contact.astro` container-query's 30rem one-line threshold (see Part 6), so the three buttons now sit on one line here too, instead of the cramped three-stacked-full-width fallback a 294px column falls back to. Dark surface, current buttons, and existing spacing rhythm (`py-24/28`, `gap-y-11/12`) are all untouched — only the column split and vertical alignment changed. Verified on Studio's `ProjectCta` (a second, independent usage of the same component) at 1280px, where the column measures 450px — just under the one-line threshold at that narrower width, correctly falling back to the readable stacked pattern rather than an awkward squeeze; confirms the fix generalizes rather than being tuned to one page.

## 5. Targeted adjustments

- **`src/pages/what-we-do/index.astro`** — each card's `<h2>` offer name moved to directly follow the `01/02/03` number, before `<OfferMedia>` (previously image, then name). Confirmed in the browser: all three names ("ART FOR BRANDS", "ART FOR PLACES", "PUBLIC ART & LARGE-SCALE MURALS") are now the first content readable in each column. The three-column layout, the card's single click target and the alternating homepage chapters (`OfferChapters.astro`, not touched this pass) are unchanged.
- **`src/pages/what-we-do/[slug].astro`** — the formats-section text column changed from `md:self-end` to `md:self-center` against its very tall paired image. Measured after: the column's content is now vertically centered in the image's height (356px from the row top on a 924px-tall row, matching a centered ~450px-tall text block almost exactly) instead of pinned to the bottom, so it comes into view earlier while scrolling rather than waiting for the entire image to have passed.
- **`src/styles/global.css`** — `.contact-link--compact` (the header's small Email/WhatsApp links) gained `padding: .55rem .4rem` with a matching negative `margin` of the same amount, growing the real click/tap target (measured: 30.6px tall, up from the bare text's own line height) without moving the row's visible spacing or glyph size — confirmed via a before/after screenshot the nav row looks identical at rest.
- **`src/components/EnquiryFlow.astro`** — `.imq h2`'s desktop ceiling lowered (`clamp(1.6rem, 4vw, 3rem)` → `clamp(1.6rem, 3.4vw, 2.6rem)`; the mobile floor, `1.6rem`, is unchanged) and its intro/progress-bar margins tightened slightly further (`1.35rem→1.1rem`, `1.75rem→1.5rem`). No text, step, or validation logic touched — confirmed the page already fit the first offer choice on screen at both 1280×720 and 1440×900 before this change (so it was a modest refinement, not a fix for a broken state), and fits with more room after it.

## Verification method

Real interaction, not markup reading: navigated to an offer page's own intro CTA URL with `?offer=art-for-places`, confirmed the questionnaire opened on step 2 with "ART FOR PLACES" preselected, triggered a real "Change" click (`element.click()` — `ref`-based synthetic clicks remained unreliable this session), and confirmed all four step-1 options were reachable again. The mobile menu was opened via a real toggle click and inspected for layout/overflow regressions. No enquiry step was submitted; no real email or WhatsApp message was sent. Every geometry claim above (column widths, top offsets, `ScrollTrigger` ranges) is a real `getBoundingClientRect()`/`ScrollTrigger` reading taken in this session, not inferred from source.

## Local checks, final state (Part 7)

`npx astro check`: 0 errors, 0 warnings, 7 hints (92 files, same pre-existing hints as every prior part). `npm test`: 89/89. `CONTENT_SOURCE=fixtures npm run build`: exit 0, 8 pages, "Checked 8 pages, all reachable from the homepage: true. No problems found." Production HTML spot-checked directly: the restored `hero-logo` element carries exactly `w-[76vw] max-w-[720px] sm:w-[62vw] md:w-[50vw] lg:w-[44vw]` in the built output, not the dev-only source.

## Honest limitations

- **The hero logo's animation (both the arrival shatter/reassemble and the scroll-drift) could not be watched playing in real time this session.** `requestAnimationFrame` does not tick at all in this session's Browser pane tab (see the detailed finding above) — this is a session/tooling constraint, not something introduced by this pass's changes, and it affects every rAF-driven GSAP animation on the site equally, not just the logo. Verified instead via direct GSAP timeline/ScrollTrigger API manipulation (forcing `.progress()` values and reading the resulting computed `transform`), which confirms the animation *logic* and the *trigger geometry* are both correct, but is not the same evidentiary weight as watching it play. A quick look in an ordinary, foregrounded, non-automated browser tab is the natural follow-up if literal eyes-on confirmation of the smooth motion is wanted.
- Screenshots were not saved to disk this session (same as every prior part). Live screenshots were captured and inspected for the hero at 1280×720, 1440×900 and 1920×1080, the offer intro (before and after), What We Do's card order, the mobile menu, and the questionnaire — a few deep-scrolled captures (the final `ProjectCta` block specifically) stayed unreliable even after fronting the tab, consistent with the deep-scroll screenshot issue already logged in Parts 5–6, and were verified by exact `getBoundingClientRect()` measurement instead.
- Browser zoom was not tested this session (no available tool to set it independent of viewport width).

## Exact next action

None required — every point in this brief is implemented and verified to the extent this session's tooling allows, with the rAF/animation-playback limitation stated plainly above rather than glossed over. No protected file (`publishing.ts`, `routes.ts`, `relations.ts`, the content-source adapter, `src/lib/enquiry/*`) was touched. Mobile was not redesigned this pass, per the brief; only spot-checked for non-regression (390px hero, mobile menu, no new overflow).

---

# Part 8: mobile UX/UI and interactions pass

Scope: mobile only (viewports below the project's existing `md:` / `(max-width: 767px)` breakpoint, the same one already used by `isMobile` checks throughout the codebase). Every change below is either gated behind that breakpoint in CSS (`@media (max-width: 767px)`) or behind the equivalent `window.matchMedia` check in script, or lives in a base (unprefixed) Tailwind class that an existing `md:` class already overrides at desktop widths — verified case by case in §8 below, not assumed.

## 1. Hero mobile: logo size unchanged, scroll-drift fragmentation extended to mobile

The mobile logo's size was confirmed already correct and was **not** touched: `HeroLogo`'s class (`w-[76vw] max-w-[720px] sm:w-[62vw] md:w-[50vw] lg:w-[44vw]`) is shared with desktop and was restored to its validated value in Part 7 — no separate mobile scale-up was applied, per the brief's explicit instruction not to mechanically enlarge it just because the desktop logo grew back.

**The real gap found**: the arrival shatter/reassemble timeline already ran on mobile (with its own smaller `centralRelease`/`outerRelease` amounts), but the *scroll-linked* fragmentation drift added in Part 7 (`initScrollDrift`'s `central`/`outer` loops, retargeted to the logo's own `root` element) had an unconditional `if (isMobile) return;` guard — mobile only ever got the root-level opacity/scale fade, never the per-fragment shatter-on-scroll. Fixed in **`src/components/HeroLogo.astro`**: the early return was removed and a `scrollRelease` factor (`0.45` on mobile, `1` on desktop) now scales every central/outer displacement, echoing the same isMobile-scaling pattern already used by the entrance timeline just above it in the same file — not a new animation system, the existing one extended with a mobile-appropriate amplitude.

**Verified, not assumed** (the session's `requestAnimationFrame` freeze — see Part 7 — still applies, so this used the same direct-GSAP-API method): at 390px width, after force-completing the intro timeline, `ScrollTrigger.getAll()` now returns 11 instances tied to the logo's own `root` box (start 82px / end 209px — matching its real mobile bounding box) that did not exist at all on mobile before this fix, plus the pre-existing root-fade instance. Driving one to 50% progress and reading the resulting `transform` on a sample of fragments showed real, proportionate displacement (≈−14 to −24px x, ≈+2.7 to +19px y) — clearly present, and visibly smaller than the equivalent desktop amounts, consistent with the 0.45 scale factor rather than a bug.

**Contact hierarchy** — checked live against the brief's stated complaint ("Start a project appears simply bordered, barely heavier than Email/WhatsApp") and found already correct in the current build: `.contact-btn-primary` is unconditionally solid ink-filled at every container width, full-width on its own row, with Email/WhatsApp bordered and sharing the row below at real mobile widths (confirmed at 390px via screenshot and the same container-query tiers documented in Part 6). No change made here — documented as verified-pass rather than touched for the sake of it.

## 2. Mobile vertical rhythm reduced at specific, measured gaps

Three concrete gaps were measured with `getBoundingClientRect()` before touching anything, at 390×844:

| Gap | Before | After |
|---|---|---|
| Hero's bottom row → "Art for Brands" title | 202px | 125px |
| Between one offer's image and the next offer's title | 80px | 52px |
| "Inside the studio" link → "HAVE A PROJECT IN MIND?" | 208px | 133px |

Changes, all mobile-only (base Tailwind classes; every `md:` sibling class is untouched, confirmed by reading computed `padding`/`margin` at 1440px after the edit — see §8):

- **`src/components/home/OfferChapters.astro`**: section `pb-28 pt-24` → `pb-16 pt-14`; the intro paragraph's wrapping `mt-20` → `mt-10`.
- **`src/styles/global.css`**: `.offer-scene + .offer-scene`'s desktop clamp (`clamp(5rem, 9vw, 9rem)`) gained a `@media (max-width: 767px)` override to `3.25rem`, rather than editing the clamp itself.
- **`src/components/home/StudioMoment.astro`**: `pb-28` → `pb-16`.
- **`src/components/home/FinalCta.astro`** and **`src/components/ProjectCta.astro`**: `py-24` → `pt-16 pb-24` (top only reduced; the bottom, leading into the footer or staying within the dark block, was not flagged and was left generous).

**Deliberately not touched**: `PointOfView.astro`'s dark `min-h-[74svh]` statement section, even though it has ~157px of trailing whitespace on mobile below its own paragraph. This reads as an intentional editorial pause (a single large all-caps line given room to breathe on a dark background between two lighter, denser sections) rather than an accidental gap, and the brief explicitly asked to preserve alternating "moments denses" and "pauses éditoriales" rather than compress everything uniformly — so it was measured, judged, and left alone rather than trimmed to hit a rhythm quota.

## 3. "Public Art & Large-Scale Murals" title, mobile only

Home's Public Art scene heading wrapped to **4 lines** at 390px width (`max-w-[12ch] text-[15vw]`, the same scale as the other two offers' 2-line titles), reading as disproportionately large against its two siblings. Fixed in **`src/components/home/OfferChapters.astro`** for this heading specifically (not the display type scale generally): `max-w-[15ch] text-[11.5vw] sm:text-[8.5vw]`, with `md:max-w-[12ch] md:text-[5.6vw] lg:text-[5.1vw]` restoring the exact pre-existing desktop values. Verified: now wraps to 3 lines at 390px (confirmed both visually and via `rect.height / fontSize`); desktop font-size and max-width confirmed unchanged via computed style at 1440px (73.44px, matching `lg:text-[5.1vw]` exactly).

## 4. A measured editorial entrance for sections that had none

`PointOfView`, `HowWeJoin`, `StudioMoment`, `FinalCta`, `ProjectCta` and the offers-index intro paragraph had no scroll entrance at all on mobile (unlike `OfferChapters`' own offer headings, which already had one) — they simply sat static, then appeared instantly on load. New **`src/lib/reveal.ts`** (`initEditorialReveal`), mounted once from **`src/components/FragmentMotion.astro`** (already loaded on every page): finds `[data-reveal-group]` containers and fades/rises their `[data-reveal]` children in on scroll, `once: true`, mobile-only (`max-width: 767px`) and `prefers-reduced-motion`-gated. A small per-group variation (alternating rise distance and a touch of x-drift) avoids every section arriving with the identical fade-up. Reuses the same GSAP/ScrollTrigger already driving every other reveal on the site — no second motion system, no new dependency. `data-reveal-group`/`data-reveal` attributes added to the five components above; desktop markup and behaviour otherwise untouched (the attributes are inert without JS matching the mobile media query).

## 5. Mobile menu: scroll lock, focus containment, larger tap targets, touch feedback

Inspected first, per the brief: the existing icon transform, staggered link reveal, Escape-to-close-and-refocus, and click-outside-free (in-flow, not overlay) panel design all already worked and were kept as-is. Two real gaps found and fixed in **`src/components/Header.astro`**:

- **No background scroll lock, no focus containment.** The panel is an in-flow expanding disclosure (not a `position: fixed` overlay), so the rest of the page — pushed down, not covered — stayed fully scrollable and fully in the Tab order while the menu was open. Fixed: `<main id="main">` and `<footer>` now get `inert` toggled alongside the panel's own (pre-existing) `inert` toggle, and `html` gets a new `.nav-scroll-lock` class (`overflow: hidden`, added in `global.css`) while open. No `scrollY` is ever read or set, so there is nothing to restore and no position jump on close.
- **No focus trap.** Added `trapTab()`, a `keydown` listener that loops Tab/Shift+Tab across `[toggle, ...panel's focusable links]` only while open. **Verified without relying on the session's flaky synthetic-click/real-keyboard delivery** (both timed out this session, consistent with the Browser pane's documented focus/hidden-tab issues): focused the panel's last link and the toggle directly via `element.focus()`, then dispatched real `KeyboardEvent('keydown', {key:'Tab'})` / `{key:'Tab', shiftKey:true}` on `document` — the same listener a real keypress would reach — and confirmed focus wrapped correctly both directions, with `defaultPrevented: true` on both. Escape-close was re-verified the same way afterward: `aria-expanded` false, focus back on the toggle, scroll lock and `main`/`footer` inert both cleared.
- **Tap targets under ~44px.** Measured before fixing: the mobile "Start" link ≈ text-only, no padding; `.contact-link--compact` (Email/WhatsApp, shared with the desktop header) ≈ 30.6px tall in the mobile menu footer. Fixed with the same padding-plus-matching-negative-margin technique already used elsewhere in this codebase (grows the hit area without moving surrounding layout): "Start" now measures 44.5px tall; `.contact-link--compact` gained a **mobile-only** (`max-width: 767px`) padding override, now 45px tall in the menu — confirmed the **desktop** header instance of the same class is unaffected (still exactly 30.59px, matching Part 7, since the query never matches there). `.nav-mobile-link` (the main destinations) already measured 45–57.5px — confirmed, not changed.
- **Touch feedback.** `.nav-mobile-link:active` gained a brief background tint (120ms), scoped to a class that only renders inside the mobile-only panel.

## 6. Questionnaire entry recomposed for mobile (priority item)

This was the brief's stated functional priority. Before any change, code review plus the known stacking order (header → breadcrumb → h1 → intro → module's own eyebrow/h2/intro → preview badge → progress → first real choice) made the problem clear without needing a live "before" capture of this specific page (unlike Home, which was screenshotted live before editing) — this is flagged honestly in §9 below rather than implied to have been captured.

- **`src/pages/discuss-a-project.astro`**: header padding `pb-10 pt-10` → `pb-6 pt-6` (mobile only, `md:` unchanged); h1 `text-[10.5vw] sm:text-[7vw]` → `text-[8vw] sm:text-[6vw]`; intro paragraph `text-[14px]` → `text-[13px]`; grid gap `gap-y-5` → `gap-y-3`. `<Breadcrumbs trail={trail} hideOnMobile />` — new opt-in prop (see below), used only on this page.
- **`src/components/Breadcrumbs.astro`**: new optional `hideOnMobile` prop adds `hidden md:block` to the visible `<nav>` only when passed; the `BreadcrumbList` JSON-LD script is a sibling untouched by the CSS `display: none`, so nothing is lost for search engines — only the on-screen row is skipped on this one page, on mobile only. Every other page's breadcrumb (What We Do, offer pages, Work, articles) is unaffected — the prop defaults to `false`.
- **`src/components/EnquiryFlow.astro`**: new `@media (max-width: 767px)` block tightens the module's own theming layer further (not its markup or logic): `.imq h2` to a fixed `1.5rem` (was a `clamp()` already floored at `1.6rem` on mobile — now genuinely smaller, not just clamped), `.imq-intro`/`.imq-preview-badge`/`.imq-progress`/`.imq-eyebrow` margins trimmed. Also hides `.imq-direct` — the module's own small "Prefer a conversation? Email · WhatsApp" link row, which on mobile sat within a short scroll of the page's own "Prefer to speak directly?" aside with the real Contact buttons, reading as a duplicated, weaker echo of the same two contacts. The destinations are not removed — only this one redundant presentation, mobile only; desktop is unaffected (that row was never flagged there and the query doesn't match above 767px).

**Verified live, real interaction** (390×844 and re-checked at 430×932): navigating to `/discuss-a-project` with no offer param now shows, within the very first screen, the compacted header, the module's own heading, and the **first offer choice with its full description already visible** (at 430×932, all four choices fit in the first screen). Selected a chip and typed into the free-text field, clicked **Back**, confirmed the step-1 selection state persisted (bold/highlighted), clicked forward again, confirmed both the chip and the textarea's value were exactly as left. Navigated with `?offer=art-for-places` and confirmed it still opens directly on step 2 with "ART FOR PLACES" preselected and a working "Change" link — this preselection and back/forward behaviour live entirely in the protected `src/lib/enquiry/` module and were not touched, only re-confirmed. No enquiry was submitted.

## 7. Not changed, checked and confirmed correct as-is

Per the brief's own instruction not to modify what already works: the offer pages' three-choice format list, the desktop-only items from Part 7 (offer intro alignment, final CTA column width), the What We Do card order (Part 7), the header's compact-variant desktop sizing, and the questionnaire's step count/validation/selection-state logic (`.imq-chip input:checked + span` already changes both background *and* border, not colour alone) were all inspected and left untouched.

## 8. Desktop non-regression — verified, not assumed

Every mobile-rhythm edit above changed a **base** (unprefixed) Tailwind class while leaving the pre-existing `md:` class on the same element untouched; Tailwind's cascade means the `md:` rule wins at desktop widths regardless of the base value, and this was confirmed empirically rather than trusted on principle — computed `padding-top`/`padding-bottom` read at 1440×900 after every edit:

| Element | Computed at 1440px | Expected from unchanged `md:` class |
|---|---|---|
| `#offers` section | 144px / 176px | `md:pt-36` (144px) / `md:pb-44` (176px) |
| Final CTA section | 128px / 128px | `md:py-32` (128px) |
| StudioMoment section | — / 176px | `md:pb-44` (176px) |
| Public Art `h3` font-size | 73.44px | `lg:text-[5.1vw]` at 1440px |
| Header `.contact-link--compact` | 30.59px tall | unchanged from Part 7 |
| Hero logo width | 633.6px | `lg:w-[44vw]` at 1440px, exact |
| Hero contact buttons bottom edge | 754.7px | within 900px viewport, matches Part 7 |

Screenshots at 1280×720 also visually match Part 7's documented desktop hero baseline exactly (same logo scale, same one-line button row). `.offer-scene + .offer-scene`'s new mobile override lives inside its own `@media (max-width: 767px)` block, never touching the existing desktop `clamp()`. The mobile-only reveal system (`initEditorialReveal`) checks `matchMedia("(max-width: 767px)")` as its very first line and returns immediately above that width, so it never runs at all on desktop — confirmed by design, not just by absence of visible change.

## 9. Verification method and widths tested

Real browser interaction throughout, not markup reading — the same direct-GSAP-API workaround from Part 7 was reused where `requestAnimationFrame`'s freeze (documented there, still present this session) blocked normal observation of scroll-triggered animation. Widths tested: **360×800, 390×844, 412×915, 430×932** (all: no horizontal overflow, `scrollWidth === clientWidth`, confirmed via `document.documentElement.scrollWidth`), a **767px-adjacent width is inherently desktop** under this project's own breakpoint (mobile ends at `max-width: 767px`) so 1280×720 and 1440×900 served as the upper/desktop control; a landscape check at 844×390 (which, being ≥768px wide, correctly renders the already-validated desktop header rather than a squeezed mobile one — real phones in landscape virtually all exceed 767px width, so there is no narrower mobile-breakpoint landscape case to test within realistic device ranges). Journey tested end to end: home arrival → hero → offers index scroll → all three offer scenes → editorial sections → final CTA → mobile menu open/close (keyboard-trap and Escape verified via direct event dispatch, see §5) → an offer page → offer → questionnaire (preselected) → step 2 → Back → forward (data preserved) → direct contacts, without submitting any enquiry or sending a real message. `npx astro check` (0 errors, 7 pre-existing hints, 93 files), `npm test` (89/89), `CONTENT_SOURCE=fixtures npm run build` (8 pages, all reachable, no problems) all re-run clean after every substantive change.

## Honest limitations (Part 8)

- **`prefers-reduced-motion` was not re-tested live this session.** The Browser pane's viewport-resize tool has no reduced-motion emulation control, and injecting an override after page scripts have already run would not affect logic that already checked `matchMedia` at load. Verified by code inspection instead: every animation this pass touched or added (`HeroLogo`'s scroll-drift, `initEditorialReveal`) sits behind the same `if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;` guard already used everywhere else in this codebase, evaluated before any tween is created — not a live confirmation, and stated as such rather than implied.
- **Real virtual-keyboard occlusion of form fields could not be tested.** This Browser pane resizes a viewport but does not render an actual on-screen keyboard, so there is no way to observe whether a focused field stays visible above a real keyboard in this environment. A check on an actual device is the honest follow-up if this matters.
- **Browser zoom and increased system text size were not tested**, same limitation as every prior part (no available tool to set zoom independent of viewport width).
- **No live "before" screenshot exists for `/discuss-a-project`** specifically (unlike Home, which was captured live before any edit this pass) — its problem was clear enough from the DOM structure and known stacking order that it was fixed directly and verified after the fact, live, rather than screenshotted twice. Stated plainly rather than implying a before/after pair that does not exist for this one page.
- The deep-scroll screenshot staleness noted in Parts 5–7 was not specifically re-encountered this pass (mobile pages are shorter and every capture used here returned live content), but the underlying tooling constraint (rAF frozen, `document.visibilityState` reporting `"hidden"`) is unchanged and remains a standing constraint on this session's ability to watch animation play in real time.

## Exact next action (Part 8)

None required for this pass's stated scope. The mobile-specific work above (contact-hierarchy verification, rhythm trims, the Public Art title, the editorial reveal system, the mobile menu's scroll-lock/focus-trap/tap-targets, and the questionnaire-entry compaction) is implemented and verified to the extent this session's tooling allows, with every desktop non-regression claim backed by a computed-style reading rather than assumed from an unchanged-looking diff. No protected file was touched. A genuine follow-up, if wanted: a real-device pass specifically for virtual-keyboard behaviour on the questionnaire's text fields and for `prefers-reduced-motion` with true OS-level playback, both of which this session's tooling cannot exercise.

---

# Part 9: three homepage video sections — loading stability fix (brief received later the same day the real MP4s were wired in)

Narrow, targeted brief: the three real master videos (Art for Brands, Art for Places, Public Art) had just been wired into `offers.ts`/`FractureReveal.astro`/`OfferMedia.astro` earlier in this same session (mapped one MP4 per pillar, reused across the homepage `OfferChapters` teasers and each offer detail page's own hero). The owner then reported two symptoms: videos "sometimes take too long to appear," and the intentional broken/offset fracture-shard effect could look "misaligned or visually broken in the wrong way" while loading. The brief was explicit that the fracture effect itself (2-3 independent `<video>` shards per panel, each clipped to a static `clip-path` slice, GSAP transform-only entrance) is not to be redesigned or simplified — only made stable from first render.

## Diagnosis performed before any change

- **Container/geometry ruled out as a cause**: `.fracture-panel` has no width/height of its own; its aspect ratio comes entirely from Tailwind utility classes at each call site (`aspect-[4/5] min-h-[430px] md:aspect-[5/6]...`), each `.fracture-shard` is `position:absolute;inset:0`, and `.media-shell video/img` is forced to `width:100%;height:100%;object-fit:cover`. Confirmed by reading `FractureReveal.astro`, `fracture.ts` and the relevant `global.css` rules: geometry is 100% CSS-driven and never depends on video intrinsic size or metadata-load timing. This satisfied most of the brief's "visual stability" checklist by construction, before touching anything.
- **Root cause #1 (content-timing, not layout)**: each shard renders its own independent `<video>` pointing at the same source file. With no `poster` set (`offer.image.poster` was `""` for all three), a shard with no decoded frame yet paints black (browser default) while a sibling shard already showing a live frame sits right across the clip-path seam — a real, paintable mismatch that reads as "broken" even though the clip-path geometry itself is exact.
- **Root cause #2 (real markup bug)**: `poster={poster}` in both `FractureReveal.astro` and `OfferMedia.astro` had no `|| undefined` guard (the `EditorialCommercialIntro.astro` component, wired in the same earlier session, already had this guard). With `poster: ""`, Astro rendered a literal `poster=""` attribute, which the browser resolved to the *current page's own URL* as an (invalid, wasted) poster fetch — confirmed via `video.poster` in the live DOM.
- **Root cause #3 (network-storm, confirmed empirically, not theoretical)**: read the first bytes of all three MP4s directly (no `ffmpeg`/`ffprobe` available in this environment, so parsed the ISO-BMFF atom table by hand): all three have `moov` at the very end of the file (`ftyp → mdat → moov`), i.e. **not faststart-encoded**. `read_network_requests` on a fresh homepage load showed dozens of aborted `206 Partial Content` requests for the same file in rapid succession — the classic symptom of a browser repeatedly hunting for a trailing `moov` atom it cannot find near the front — and, before this fix, **all three videos' shards were making requests immediately on page load** regardless of scroll position, because `preload="metadata"` starts this negotiation at parse time, independent of the existing `IntersectionObserver`-gated `.play()` call.
- **Root cause #4 (confirmed via direct instrumentation, not assumed)**: sibling shards within one panel can reach a playable state at meaningfully different wall-clock moments. Measured directly on the live DOM: on the Art for Places panel, one shard reached `readyState 4` (decoding a live frame) while its sibling sat at `readyState 0` (still showing only the poster) — exactly the cross-shard mismatch the brief described, just with a different concrete trigger (async decode timing, not a missing poster).

## Fixes made

1. **Real poster images extracted from the actual master clips** (not stock/placeholder, not fabricated) — `public/videos/impact-murals-art-for-brands-poster.jpg` (5,834 B), `-art-for-places-poster.jpg` (15,884 B), `-public-art-large-scale-murals-poster.jpg` (6,703 B). No `ffmpeg` is installed in this environment, so each was captured with the browser's own `<video>` → seek → `<canvas>` → `toDataURL('image/jpeg')` pipeline, at a representative timestamp (`min(2.5s, duration/3)`), then transcribed via a SHA-256 hash-verification workflow (hash computed in-browser on the raw decoded bytes, compared against the hash of the locally-decoded file before saving — a long/high-entropy base64 payload transcribed by an LLM is not guaranteed byte-perfect, and this check caught one corrupted attempt outright before it could reach the repo). A second failure mode was caught the same way: an early capture attempt fired its canvas draw immediately on the `seeked` event, which can land on an in-flight/black transitional frame before the decoder settles — the fixed capture script adds a two-`requestAnimationFrame` + 300ms settle delay after `seeked` before drawing, and every final poster was visually confirmed in-browser (not just hash-checked) to show real, correct, representative content matching its clip.
2. **`src/content/offers.ts`** — all three offers' `image.poster` now point at their real poster file instead of `""`.
3. **`src/components/FractureReveal.astro`, `src/components/OfferMedia.astro`** — `poster={poster}` → `poster={poster || undefined}` (root cause #2).
4. **`src/components/FractureReveal.astro`, `src/components/OfferMedia.astro`** — `preload="metadata"` → `preload="none"`. Safe specifically because geometry never depended on metadata (see above) and a real poster now exists for every video; confirmed via a fresh network capture that, after this change, only the panel actually near the viewport makes any request on page load — the other two below-the-fold panels made zero requests until scrolled near.
5. **`src/lib/media-autoplay.ts`** — two changes: (a) `rootMargin` widened `200px → 600px`, since `preload="none"` means the `IntersectionObserver` is now the *only* lead-time lever before a shard starts fetching (a small margin plus a `moov`-at-end file left too little buffer); (b) new `startGroup()` logic (root cause #4): instead of calling `.play()` on each shard the instant it individually intersects, shards sharing one `[data-fracture-panel]` ancestor now call `.load()` together, wait for every sibling to reach `canplay` (or a 2.5s safety timeout, so one stalled/broken shard cannot freeze its siblings forever), and only then call `.play()` on all of them in the same tick — eliminating the live-frame-next-to-poster mismatch at its source rather than papering over it.

## Verification performed

- **Network behaviour, real captures, before/after**: before the fix, a fresh homepage load showed dozens of aborted `206` requests for *all three* video files simultaneously. After: DOM inspection immediately after load showed `readyState: 0` for every shard (zero network activity), and a follow-up capture showed only the near-viewport panel (Art for Brands) generating any request — the two below-the-fold panels (Art for Places, Public Art) still showed zero new requests at that point.
- **Shard synchronization, isolated direct proof**: this session's Browser-pane tab reports `document.visibilityState: "hidden"` even immediately after `tabs_select` (the same standing tooling constraint logged in Parts 5-8 — confirmed again here with a bare test `IntersectionObserver` that did not fire within 1.5s on an element clearly within its `rootMargin`), so the real scroll-triggered end-to-end path could not be watched live this session. Instead, the exact `startGroup` event pattern (load → wait for every sibling's `canplay` → play all) was run directly against the real Art for Brands DOM elements: both shards logged their own `canplay` while still `paused: true` (355.9ms and 356.3ms respectively), `playAll` fired once at 356.3ms, and after 4s of real playback both shards measured `currentTime` within 0.04s of each other. This is Level-B evidence (direct DOM/event instrumentation), not a live scroll recording, stated plainly rather than implied.
- **Visual check**: screenshots of all three posters (served directly, navigated to their own URL) confirm real, correct, non-blank content matching each clip. A full-page mobile screenshot (375×812) of the Art for Brands panel after the fix shows a clean two-shard diagonal split with consistent content on both sides of the seam, no black gap, no visible mismatch. A later full-playback screenshot of the Public Art three-shard panel (desktop) shows the diagonal seams reading as continuous, uninterrupted texture, not a discontinuity.
- **Attributes preserved**: `muted`, `loop`, `playsInline` confirmed `true` on all 7 shard videos plus the offer-detail-page hero video, post-fix.
- **Reduced motion**: the existing `if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;` guard at the top of `initAutoplayVideo` was not touched by any edit in this pass — confirmed by inspection, not a live emulated run (this session has no reduced-motion emulation control, the same limitation logged in Parts 6-8).
- **Local checks**: `npx astro check` — 0 errors, 0 warnings, 7 hints (100 files, same pre-existing hints as every prior part). `npm test` — 89/89 passing. `CONTENT_SOURCE=fixtures npm run build` — exit 0, 29 pages, "Checked 29 pages, all reachable from the homepage: true. No problems found." Confirmed directly in the built `dist/`: all three poster files and MP4s copied through unchanged, every built page's video markup carries `preload="none"` and the correct non-empty `poster="/videos/...-poster.jpg"` (no more `poster=""`).

## Reported, not acted on (per the brief's own stop condition)

**The `moov`-at-end finding (root cause #3) is very likely the single largest remaining contributor to "sometimes takes too long to appear," and is not fixed.** Moving the `moov` atom to the front of the file ("faststart") is a **lossless container-level remux — not a re-encode, no quality loss, no bitrate change** — but it requires a tool this environment does not have (`ffmpeg`/`ffprobe` are not installed here; confirmed via `which`). Per the brief's explicit instruction not to independently expand scope around source-file changes, this was reported rather than worked around. The one safe, available mitigation (deferring all three videos' network activity behind the per-panel `IntersectionObserver`, §4-5 above) reduces *how often* a visitor's browser has to pay this cost and *how many* videos pay it at once on a single page load, but does not remove the cost itself for whichever video is actually being requested.

**Current file sizes and resolution** (unchanged from the prior session, not re-measured differently here): `impact-murals-art-for-brands.mp4` 13,178,000 B (1080×1440, 13.806s, ≈7.6 Mbps implied), `impact-murals-art-for-places.mp4` 6,243,405 B, `impact-murals-public-art-large-scale-murals.mp4` 10,191,309 B, 10.033s (measured this session). Exact codec/profile could not be read without `ffprobe`. The implied bitrate for Art for Brands (≈7.6 Mbps) is higher than typical for a cropped, muted, autoplay background loop (usually 1-3 Mbps at comparable resolution), which suggests re-encoding could also reduce size meaningfully — but per the brief's explicit instruction, **no re-encode was performed or even attempted**; this is reported as a preliminary observation only, pending the owner's decision and access to a machine with `ffmpeg` available.

## Exact next action (Part 9)

If the owner wants the `moov`-at-end issue actually fixed: run a lossless remux on a machine with `ffmpeg` available (`ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4` for each of the three files, then replace the files in `public/videos/` — no other code change needed, since the app already references these exact filenames). Optionally re-encode for bitrate at the same time if the owner wants to act on the size observation above, in which case a visible-quality check before/after is warranted (not attempted this session). No protected file was touched (`publishing.ts`, `routes.ts`, `relations.ts`, the content-source adapter, `src/lib/enquiry/*`); every change was scoped to the three video sections and their direct loading/stability path, per the brief's explicit "keep this task focused" instruction.

## Part 9 follow-up: persistent cross-shard drift on the 3-shard panel

The owner reported the shards still showed "un léger décalage" (a slight offset) after the above. Re-diagnosed rather than assumed fixed: direct `currentTime` measurement across 8 samples over 16s of real playback showed the two 2-shard panels (Art for Brands, Art for Places) stayed tightly synced (drift under ~0.03s throughout, imperceptible), but the 3-shard Public Art panel (`split="b"`) carried a **persistent ~0.35-0.42s offset between its three shards that never self-corrected**, present from the very first measurement and unchanged across the whole window.

**Root cause**: `startGroup`'s simultaneous `.play()` call (added in the fix above) guarantees a simultaneous *request* to start, not a simultaneous first rendered frame — with 3 shards decoding at once, decoder warm-up contention measurably delayed some shards' actual playback start relative to others, and since every shard then just keeps looping at the same rate, that initial gap never closes on its own.

**Fix, in `src/lib/media-autoplay.ts`**: new `startDriftCorrection(siblings)`, called right after `playAll()`. Compares every sibling's `currentTime` against shard 0 (wrapped into `(-duration/2, duration/2]` so a shard that has already looped back to near 0 isn't mistaken for a huge drift against a sibling still near the end of the clip), and snaps any sibling whose wrapped offset exceeds 0.12s back to shard 0's position. Checked once early (350ms after playback starts, since warm-up contention is worst right then) and every 1000ms afterward. Only two-shard and larger panels run this (guarded via `siblings.length < 2` early return); a lone `OfferMedia` hero video does nothing extra.

**Verified**: same direct-DOM measurement method as the original fix (this session's Browser-pane tab still reports `document.visibilityState: "hidden"` even when fronted, so the real scroll-triggered `IntersectionObserver` path remains unobservable live — see the standing limitation logged in Parts 5-8). Re-ran the identical harness with the drift-corrector logic attached: Public Art's drift now stays bounded under ~0.11s between corrections and gets snapped to ~0.006-0.007s each time the corrector fires, instead of sitting at 0.35-0.42s indefinitely. A live screenshot of the Public Art panel mid-playback (both visible seams) shows a hand/forearm and wet-paint texture reading as one continuous image across both clip-path cuts, no visible jump. One raw measurement briefly showed a spurious "6.5s drift" on Art for Places — that was this test harness's own naive `max - min` summary failing to account for one shard having already looped back near 0 while its sibling hadn't; the actual correction algorithm's modulo-wrapped math handles that case correctly (confirmed: no unwanted correction fired, and the very next sample showed both shards normally close together again post-loop).

`npx astro check`: 0 errors, 0 warnings, 7 hints (100 files). `npm test`: 89/89. Re-run after this specific fix, not carried over from the earlier Part 9 checks.

## Exact next action (Part 9, updated)

Same as above (the `moov`-at-end remux remains the one reported-not-fixed item, blocked on `ffmpeg` availability). The drift-correction fix closes the specific follow-up report; no further action needed for shard synchronization itself.

---

# Part 10: studio video, and reusing the three offer videos on /what-we-do

New brief: a fourth real clip supplied for the Studio section (`impact-murals-studio.mp4`, copied from a local temp export), to replace the studio media block's placeholder at its own real (horizontal) size, with mobile fit checked; plus reusing the three already-wired homepage offer videos on `/what-we-do`'s own three cards.

## 1. Studio video

- **Inspected first**: 1280x720 (16:9), 11.32s. Same non-faststart pattern as the three offer videos (`ftyp → mdat → moov`, confirmed via the same manual atom-table read used in Part 9) — noted, not acted on, consistent with the Part 9 `ffmpeg`-availability limitation.
- **Poster extraction hit a new, distinct failure mode**: the first two capture attempts (640px-wide and then 400px-wide, both via the same seek+settle-delay+hash-verify pipeline that fixed Part 9's black-frame bug) each produced a **SHA-256 mismatch against the browser-computed hash**, including one where the decoded byte length itself differed from the reported capture size — genuine transcription corruption, not the earlier race condition. On the second attempt, decoding and viewing the file directly (`navigate` to it, screenshot) showed a perfectly valid, correct image — a real photo of the studio's creative director speaking in a blue/pink-lit venue, structurally valid JPEG (correct SOI/EOI, byte length exactly matching the reported capture size). Root-caused by isolating the hash comparison itself: the "expected" hash was retyped by hand into a bash string literal for comparison, and manually retyping a 64-character hex string is itself not risk-free — a second corroborating signal (byte-length match plus direct visual inspection) is more trustworthy than a single manually-retyped hash string. Recorded here so a future session doesn't chase a phantom corruption when the saved file is actually fine: verify hash mismatches with a visual/structural check before assuming the capture itself is bad.
- **`src/content/studio.ts`**: `media.video`/`media.poster` now point at `/videos/impact-murals-studio.mp4` and its poster; comment rewritten (was describing an intended-but-unfulfilled future state, now describes the real, shared, two-call-site asset — same pattern as `offers.ts`).
- **`src/pages/studio.astro`**: the `OfferMedia` call now passes `video`/`poster` from `studio.media`, and its class changed from `aspect-[4/5] md:aspect-[16/10]` (a cropped portrait/near-widescreen treatment built for a placeholder gradient) to `aspect-video` (Tailwind's 16/9 alias) — matching the brief's explicit ask to show the clip at its own real horizontal shape rather than cropping it.
- **`src/components/home/StudioMoment.astro`**: same `aspect-video` change. This component already pulled from `studio.media` (wired inert in an earlier session, per that file's own comment), so setting the real path in `studio.ts` lit up the homepage teaser automatically — a deliberate, not accidental, side effect: same asset, same pattern already used for the three offer videos across their home-teaser + detail-page pairs, not a separate decision made here.
- **Verified**: desktop (1440px) — `getComputedStyle` confirms `aspect-ratio: 16/9`, real rect 851x479px, zero overlap between the media block and its adjacent text column (checked via rect intersection, not assumed). Mobile (375px) — `document.documentElement.scrollWidth === clientWidth` (no horizontal overflow) on both `/studio` and the homepage's `StudioMoment` section; media block measures 335x189px (16:9 confirmed), a real screenshot of each shows the video's poster frame at full mobile width with the heading/body/link flowing cleanly underneath — no cramping, no awkward gap (the previous 4:5 portrait ratio would have produced a ~419px-tall block at this width; 16:9 is 189px, visibly shorter and better-proportioned for a horizontal clip).

## 2. Three offer videos reused on `/what-we-do`

**`src/pages/what-we-do/index.astro`**: each of the three cards' `OfferMedia` call gained `video={offer.image.video} poster={offer.image.poster}` — the exact same data already set in `offers.ts` and already used by the homepage `OfferChapters` teasers and each offer's own detail-page hero. No new asset, no layout change: the existing `class="mt-5 aspect-[5/4] max-h-[280px]"` box is untouched, so each video is cropped into the same fixed card shape the placeholder gradients used before (via the existing `object-fit: cover`).

**Verified**: desktop (1440px) — screenshot of the 3-column grid shows all three cards rendering their correct, distinct, matching video content (Art for Brands: staircase/branding installation; Art for Places: mural artist on scaffolding; Public Art: hand painting a colorful mural), same card height across all three, no overflow. Mobile (375px) — first card checked directly: real video frame, correctly boxed, text flows cleanly below. DOM check confirms all three `<video>` elements carry the correct `src`/`poster` pair and `preload="none"` (the Part 9 loading-strategy fix applies here automatically, since it lives in the shared `OfferMedia`/`media-autoplay.ts` pipeline, not per-page code).

## Local checks, final state (Part 10)

`npx astro check`: 0 errors, 0 warnings, 7 hints (100 files). `npm test`: 89/89. `CONTENT_SOURCE=fixtures npm run build`: exit 0, 29 pages, "Checked 29 pages, all reachable from the homepage: true. No problems found." Confirmed directly in `dist/`: `impact-murals-studio.mp4`/`-poster.jpg` present in `dist/videos/`, `dist/studio/index.html` carries `aspect-video`/`preload="none"`/the correct poster path, `dist/index.html` (homepage) references the same studio asset, `dist/what-we-do/index.html` references all three offer videos/posters.

## Exact next action (Part 10)

None required — both points in this brief are implemented and verified on desktop and mobile. The `moov`-at-end observation on the new studio clip is additional evidence for the existing Part 9 recommendation (a lossless `ffmpeg -movflags +faststart` remux on a machine that has `ffmpeg`), not a new, separate issue.

---

# Part 11: approved copywriting pass (copy only, no structural changes)

Retroactively logged — this pass ran to completion in an earlier session but its handoff entry was never written before that session ended. Reconstructed from the applied diffs and the final verification output.

Brief: a full copy replacement pass across Home, What We Do (index + all three offer detail pages), Studio and Discuss a Project, plus the shared navigation/footer/CTA language — explicitly copy-only (no layout, spacing, structure, media, URL, or SEO-route changes).

## What changed, with location

- **[src/content/homepage.ts](../src/content/homepage.ts)** — `hero.supportingText`, `finalCta.body`. `hero.headline` confirmed already matching the brief, left untouched.
- **[src/content/offers.ts](../src/content/offers.ts)** — `summary` and `situation` for all three offers.
- **[src/pages/what-we-do/\[slug\].astro](../src/pages/what-we-do/[slug].astro)** — `capabilities` bodies (titles kept), `headerLead` extended to an explicit 3-branch ternary with distinct hero paragraphs per offer, `closingBody`.
- **[src/pages/what-we-do/index.astro](../src/pages/what-we-do/index.astro)** — new intro paragraph after the H1; `ProjectCta` body updated.
- **[src/components/home/PointOfView.astro](../src/components/home/PointOfView.astro)**, **[HowWeJoin.astro](../src/components/home/HowWeJoin.astro)**, **[StudioMoment.astro](../src/components/home/StudioMoment.astro)** — bodies replaced, headings kept.
- **[src/content/studio.ts](../src/content/studio.ts)** and **[src/pages/studio.astro](../src/pages/studio.astro)** — `lead`, `model[0].body`, `grounding` and the "THE IDEA HAS TO WORK IN THE REAL WORLD." body updated; both named headings kept exactly (including "THE RIGHT ARTIST, NOT THE SAME ARTIST.", explicitly not renamed per the brief).
- **[src/components/Footer.astro](../src/components/Footer.astro)** — description sentence replaced with the brief's literal text.
- **[src/content/enquiry.ts](../src/content/enquiry.ts)** and **[src/pages/discuss-a-project.astro](../src/pages/discuss-a-project.astro)** — page H1/lead updated; a hardcoded trailing sentence concatenated after the lead in the JSX was removed.
- **[src/lib/enquiry/model.js](../src/lib/enquiry/model.js)** — `OFFERS` array: new `title`/`pillar`/`description`/`formats` per family, plus an additive `whatsappTopic` field (brands/places/public-art only) introduced to fix a real grammar bug (see below). `id` values and every exported function's signature and behaviour left untouched.
- **[src/lib/enquiry/enquiry.js](../src/lib/enquiry/enquiry.js)** — string-literal-only edits: step 1/2/3 labels and help text, the WhatsApp message template, the busy/error/success copy. No render, validation or control-flow logic touched.

## Real defect found and fixed while applying this

The WhatsApp message template built its sentence directly from the `pillar` field (`...I'd like to discuss ${pillar}.`), which is also the on-screen family label. For the "Other/unsure" family this produced a grammatically broken message. Fixed by adding the additive `whatsappTopic` field used only by the template, leaving `pillar` free to keep serving its display/payload roles. Verified live for all four families.

## Deliberately not changed, and why

- **Contact.astro's CTA helper text** ("Share a few details about your project. An early idea is enough to start.") — the brief's own condition was "only show this language if the enquiry route actually works." `global.enquiry.mode`/`global.form.mode` were `"preview"`/`"ui-only"` at the time (still are — see Part 12), so this was not applied.
- **The `Work` footer link** — removing it (as the brief asked) made `/work` an orphan page for `scripts/validate-content.mjs`'s reachability check and broke the production build outright. Reverted, documented in `src/content/navigation.ts`, and flagged for a follow-up decision rather than silently worked around or silently left broken. Resolved in Part 12 below.

## Verification method and honest limits

`chrome-devtools` and `playwright` MCP were both disconnected for this entire session (connection timeouts); `sgai` failed DNS resolution. All live verification — text diffing, screenshots, `resize_window` for mobile/desktop, DOM/href inspection, real interaction — used the Claude Browser pane instead. Every modified page was checked at both viewport classes; the full three-step enquiry flow was exercised for all four families, including the `?offer=` preselection path and every WhatsApp message variant.

## Local checks, final state (Part 11)

`npx astro check`: 0 errors, 0 warnings, 7 hints (100 files). `npm test`: 89/89. `CONTENT_SOURCE=fixtures npm run build`: exit 0, 29 pages, "Checked 29 pages, all reachable from the homepage: true. No problems found."

## Exact next action (Part 11)

Decide the `Work` page conflict (resolved in Part 12) and, separately, decide whether/when to unblock real enquiry delivery (see Part 12 — this needs a published privacy notice and a deploy, neither of which a copy-only or local-code pass can supply).

---

# Part 12: remove `/work` cleanly, and enquiry-delivery activation attempt

New brief: finish the two items Part 11 deliberately left open — delete the `/work` route properly (not just hide its link), and make the enquiry form actually deliver submissions, activating the approved final-CTA/button/success/error copy once it does.

## 1. `/work` removed

Previously the route stayed published (SEO/URL intact) specifically so `scripts/validate-content.mjs`'s reachability walk had one real link to it; this pass removes the route itself, so there is nothing left to walk to.

- **Deleted**: `src/pages/work/index.astro`, `src/pages/work/[slug].astro` (and the now-empty `src/pages/work/` directory).
- **[src/lib/routes.ts](../src/lib/routes.ts)** — removed the `/work` entry from `staticRoutes`; removed the `workIsPlaceholder`/per-route `noIndex` special case (dead once `/work` no longer exists); removed `projectRoutes` generation and its `projectsForBuild` import.
- **[src/pages/what-we-do/\[slug\].astro](../src/pages/what-we-do/[slug].astro)** — removed the "RELATED WORK" section (linked to `/work` and `/work/${slug}`) and its `realRelated` const/`projects`/`isPlaceholderProject` import. It never rendered in the current content state (`realRelated` is always empty while every project is a placeholder), so this has no visible effect today; it exists so a future real project entry doesn't silently resurrect a link to a route that no longer exists.
- **[src/content/navigation.ts](../src/content/navigation.ts)** — removed the `Work` footer item and rewrote the comment explaining the Part 11 conflict and its Part 12 resolution.
- **Left untouched, confirmed harmless**: `src/content/homepage.ts`'s `hero.secondaryCta` (`href: "/work"`) and `src/lib/relations.ts`'s `projectsForOffer` (builds `/work/${slug}` hrefs) are both already dead code — neither is imported/rendered by any live component (`Hero.astro` reads only `hero.headline`/`hero.supportingText`; `projectsForOffer` has no importer outside its own test). Left as-is rather than performing unrelated cleanup; noted here so a future session doesn't mistake them for live links. `tests/meshing.test.mjs` needed no changes — its placeholder-exclusion assertions hold regardless of whether `/work` exists as a route.

**Verified**: `npx astro check` 0 errors; `npm test` 89/89; `CONTENT_SOURCE=fixtures npm run build` — 28 pages (was 29), sitemap 27 URLs, "Checked 28 pages, all reachable from the homepage: true. No problems found." No `/work` reference remains in any generated route.

## 2. Enquiry delivery — blocked, not activated

**Inspected first**, per instruction, rather than building anything new. The delivery architecture already exists and is complete: `src/lib/enquiry/netlify-transport.js` posts the payload to a same-origin endpoint as `application/x-www-form-urlencoded`, matching a static registration `<form>` already present in `EnquiryFlow.astro`'s markup (`id="imq-netlify-registration"`, `data-netlify="true"`, all 14 fields, honeypot) so Netlify's build-time crawler can detect the form even though the real flow is rendered by JavaScript. `netlify.toml` confirms the site is genuinely built for Netlify (`publish = "dist"`, `form-action 'self'` in its CSP). This is the simplest, already-intended mechanism — no new service is needed and none was introduced.

`src/lib/enquiry/enquiry.js` (`onSubmit`, line ~140) already independently gates real sending on two conditions, both currently unmet:

1. `global.enquiry.mode` is `"preview"`.
2. `global.privacyUrl` is empty, and the static registration form has not yet been detected by a live Netlify deploy.

**`global.privacyUrl` has no page to point to**: there is no privacy/legal page anywhere in `src/pages`, and none of the project's own planning docs (`docs/QUALITY-GATES.md` Gate 3, `docs/UX-TECHNICAL-GUARDRAILS.md` §"Enquiry: preserve what actually exists") treat one as in scope for a UX/implementation pass — both explicitly defer "final legal/privacy content" and call it "a separate task," not legal drafting to fold into this one. `docs/FORMULAIRE-INTEGRATION.md` (written when this module was first wired in) documents the exact same two locks and the same required order of operations to clear them:

1. Publish a real privacy notice and set `privacyUrl` in `src/content/global.ts`.
2. Deploy once, so Netlify detects the `impact-project-enquiry` form in the built HTML.
3. Confirm the detection in the Netlify dashboard (14 fields).
4. Configure the Netlify Forms notification recipient in the dashboard — `global.contact.email` is the public link shown to visitors, not the server-side notification target, and nothing from the old plugin's configuration was reused.
5. Only then flip `global.enquiry.mode` to `"netlify"` and redeploy.
6. Test with fictitious data end to end (HTTP 200 confirms the request was accepted, not that a notification email arrived).

Steps 1, 2, 3, 4 and 6 all require something this local, code-only session cannot do without exceeding this task's own scope or its authority: authoring real legal content, pushing a deploy, and reading/writing a Netlify dashboard. Flipping `global.enquiry.mode` to `"netlify"` without the rest would not make the form work — the code would still refuse every submission at the same gate, just with a different, permanently-shown error ("Online enquiries are not connected yet") instead of the current, honestly-labelled preview flow. That is a strictly worse visitor experience than what exists today, and it is not what "a real enquiry can be submitted" means, so this pass leaves `global.enquiry.mode`, `global.privacyUrl` and the approved final-CTA/button/success/error copy exactly as Part 11 left them: unchanged, still gated on the same two locks, ready to activate the moment they clear.

`global.form.mode`/`global.form.notice` (the `"ui-only"` fields) were also checked: confirmed dead code, read by no component, so nothing was blocked or changed there either.

## Verification performed

`npx astro check`, `npm test`, `CONTENT_SOURCE=fixtures npm run build` all re-run after the `/work` removal (results above). No browser verification was needed for the enquiry item, since no enquiry-facing code or copy changed.

## Checks blocked and why

Real end-to-end enquiry delivery (Netlify Forms detection, dashboard notification config, a genuine submission) is **BLOCKED**: it needs a published privacy notice (content authorship outside this pass's scope), an actual deploy, and Netlify dashboard access, none of which exist in this local repository or session.

## Exact next action (Part 12)

1. Decide who writes the privacy notice and where it will live (a new page, or an existing off-site policy) — that page's real URL is the only missing piece of code-side configuration.
2. Once that URL exists: set `global.privacyUrl`, deploy once, verify the `impact-project-enquiry` form appears with 14 fields in Netlify → Forms, and set the notification recipient there.
3. Flip `global.enquiry.mode` to `"netlify"`, redeploy, and test with fictitious data (per `docs/FORMULAIRE-INTEGRATION.md`'s own checklist).
4. Only then apply the already-approved-but-withheld copy: the Contact.astro CTA helper text, and the enquiry module's `"Send enquiry"`/success/error strings already present in `enquiry.js`, which take effect automatically once `mode` is `"netlify"` — no further code change is needed at that point.
