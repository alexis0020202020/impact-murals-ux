# 00 · Shared foundations

Read once. Every page specification in this folder inherits this file, so it is not repeated on each page.

**Phase:** production specification only. Nothing here edits the live site, routes, redirects, canonicals, sitemap, navigation or Search Console.

## 1. Sources used, and one gap

| Priority | Source | Status in this session |
|---|---|---|
| 1 | Money Page Strategy & Architecture Master (MD and HTML) | Read in full. Binding for roles, architecture, URLs, boundaries. |
| 2 | Original Money Pages Master Context (September 2026) | **Not supplied in this session.** Its positioning and methodology were taken from what the Strategy Master quotes and from `CONTEXT.md` in the repository. See the QA summary. |
| 3 | Full Site Intent & Cannibalization Register | Read from the JSON (809 records). The HTML file is the same dataset in a viewer; it was not read separately. |
| 4 | Competitor Metadata Register | Read in full. |
| 5 | Impact Murals Automotive page | Read from the repository (`src/content/automotive.ts`, `src/components/automotive/*`, `src/styles/automotive.css`, `docs/AUTOMOTIVE-MEDIA.md`). **The live rendered page was not opened**, so the visual language below is taken from source, not from a screenshot. |

## 2. What "Automotive level" means here (the shared visual language)

Taken from the Automotive source, applied to every page:

- Uppercase display headlines that end with a full stop, short enough to read as a statement ("WHAT WE DO.", "THE DETAILS CAR PEOPLE NOTICE.").
- Monospace notation for eyebrows and captions: subject / place, year ("BMW M5 TOURING / DUBAI, 2025").
- Ruled lists in display type instead of cards, icons or boxes. A numbered ledger for processes. Type and whitespace do the work.
- One picture per idea, shown at the aspect ratio of its own file. Portrait clips stay portrait.
- Light paper surfaces with deliberate dark moments (hero and closing). Accent colour is restrained; the art carries the colour.
- Copy volume: a headline, one lead sentence, one supporting paragraph at most. Longer text only where it qualifies, de-risks or answers a buyer's question.
- Closing block: a heading, a short ask, and two large ruled direct routes (WhatsApp and email), with the form as the structured alternative.
- One shared studio line in the footer or closing block of every page, as a component rather than page copy, so that it is the one deliberately repeated sentence: "Impact Murals is an artist-led art direction and production studio in Dubai. The project decides the artist and the artistic language."

**What changes per page** is the organising idea, the proportion of image to text, the dominant media and the diagram that explains the purchase. Each specification names this as its *distinct page idea*.

Display headlines are written below in uppercase, the way the site stores them. The H1 and the metadata are given in the case the Strategy Master set.

## 3. Voice and copy rules applied to every page

- Premium through precision, not adjectives. No "bring your vision to life", "transform your space", "Dubai's #1", "seamless", "stunning", "world-class", "state-of-the-art".
- No em dashes and no en dashes in copy. Commas, full stops and colons only.
- No invented client, project, statistic, fee, capacity, guarantee or accreditation.
- Capability claims are written so they stay true whichever way an unconfirmed fact turns out: "agreed in the proposal", "depending on the brief", "where the venue allows". Nothing unconfirmed is stated as a promise.
- Two creative entry paths on every page: **direction needed** and **direction approved**. Appointment comes before any project-specific concept or mockup.
- "Specialists" and "partners" are named by function only. No permanent-team implication.

## 4. Facts the copy may rely on

All of these are already public on the Automotive page or in `src/content/studio.ts`, in owner-approved wording.

| Fact | Source wording | Used on |
|---|---|---|
| Dubai-based art direction and production studio led by Alexis, creative director and artist, who selects and coordinates artists and production specialists per project | `studio.ts`, `automotive.ts` | All |
| BMW M5 Touring live-painted outside Dubai's Coca-Cola Arena as part of AGMC's activation at Binance Blockchain Week 2025. Visitors watched the spray-painted artwork take shape on the vehicle. AGMC published an article about it. | `automotive.ts` (`bmw`) | Live Painting, Public Art (scale of live work only if relevant) |
| Artwork for a BMW booth at the 1 Billion Followers Summit in Dubai | `automotive.ts` (`bmw.also`) | Live Painting (optional single line) |
| Jetour: bold graphic artwork painted directly onto the vehicle during a live automotive event | `automotive.ts` (`launch.jetour`) | Live Painting |
| iCAUR: Arabic calligraphy painted directly onto the vehicle during the launch | `automotive.ts` (`launch.icaur`) | Live Painting, Live Customisation (technique only) |
| Private commission: a large-scale interpretation of the Rolls-Royce Spirit of Ecstasy on the exterior of a building. The Rolls-Royce marque is the **subject** of the artwork, not a client. | `automotive.ts` (`exterior`) | Public Art, Installations (access illustration only) |
| Photoreal murals and original paintings on automotive subjects (Ferrari mural, McQueen Drives Porsche portrait, a car painted on a small canvas, a workshop wall mural) | `automotive.ts` (`realism`) | Custom Canvas, Corporate, Designers |
| WhatsApp +971 58 195 7567 and email alexis@impactmurals.ae | `global.ts` | All |

**Deliberately not used on the money pages:** the Automotive brand strip (BMW Group, Majid Al Futtaim, Louis Vuitton, Jetour, iCAUR), the "AED 8,000 to 25,000+" typical investment note and the 50% deposit. The Strategy Master forbids a logo wall as substitute proof and says a fee is published only if it can be honoured for a defined repeatable scope. Whether to extend the investment note to any page is an owner decision, listed in the QA summary. No page copy depends on it.

The founder's experience appears as "15 years" on Automotive and "more than a decade" in `studio.ts`. No money page states a number of years. The two should be reconciled before any page does.

## 5. Real assets that already exist (from `docs/AUTOMOTIVE-MEDIA.md`)

Status vocabulary used on every page: **EXISTS** (a file is in the repository), **TO SOURCE** (not in the repository; described so it can be commissioned or selected), **ILLUSTRATIVE** (a diagram or specimen document to be drawn; it must carry the word "Illustrative" on the page), **CONDITIONAL** (include only when a permitted real example exists; omit the module otherwise).

Reuse of any EXISTS asset on a money page still needs: artist credit, location, usage permission, and confirmation of Impact's exact role. The Automotive page proves the studio used them; it does not by itself grant a licence for other contexts.

| Slot (file stem) | What it is | It evidences | It does **not** evidence |
|---|---|---|---|
| `BMW_BINANCE_MAIN` (clip 9:16, 10.8 s + poster) | Artist painting a BMW live, then close views | A live performance on a vehicle at a public event | A stage reveal, a canvas performance, a conference programme |
| `BMW_BINANCE_DETAIL` (still, 780 px wide) | Finished BMW with blue and yellow hand-painted livery, skyline behind | Finished output of the live vehicle painting | Large-format print quality (low resolution; hold small) |
| `JETOUR_LAUNCH` (clip 9:16, 8.1 s) | Live graffiti-style artwork on a Jetour SUV | Live work at a launch event | Anything beyond vehicles |
| `ICAUR_LAUNCH` (clip 592x1280, 4.9 s) | Arabic calligraphy on an iCAUR SUV | Calligraphy technique, live, at a launch | Customisation of guest objects |
| `STUDIO_AT_WORK` (clip 16:9, 11.3 s) | Artist spray-painting a large mural, then the finished wall with people around it | Mural making and a finished wall; the only 16:9 clip | An event performance (provenance of the setting to confirm) |
| `WORKSHOP_MURAL_MAIN` (clip 9:16, 5.4 s) | Artist airbrushing a photoreal car mural on an automotive workshop wall | A commercial-interior mural being made | A corporate office or HQ |
| `CANVAS_PROCESS` (clip 9:16, 5.4 s) | A vintage car drawn and painted on a small canvas | Original painting on canvas, pencil to finish, by hand | Large or commissioned-for-a-room canvas |
| `PORSCHE_PORTRAIT` (still ~3:5) | B&W photoreal artwork, "McQueen Drives Porsche" | A finished original at portrait format | Medium, size and artist credit (all to confirm) |
| `FERRARI_REALISM` / `AUTOMOTIVE_HERO` (still) | B&W photoreal mural: woman between two horses at stone windows, Ferrari at each side | Photoreal mural capability and scale of detail | Location, wall size, context (to confirm) |
| `WHAT_WE_DO_MAIN` (still 744x1280) | White Porsche 911 painted on a pale wall under cherry blossom, glowing script sign | A painted wall in a designed space | The kind of venue (to confirm) |
| `EXTERIOR_MURAL_MAIN` + `EXTERIOR_MURAL_BEFORE` (stills 1500x2000) | Finished building-scale exterior mural, scaffolding visible, plus the wall before | Exterior scale, scaffold access, before and after | A public-realm or institutional commission (it is a private commission); height and area (to confirm) |

**Not in the repository at all:** a hotel or workplace interior with installed original art, any guest-customisation sequence, any sculptural or dimensional work, any group workshop, any plan or elevation, any material or coating sample, any wide event shot with an audience. These gaps drive the media sourcing plan in `README.md`.

## 6. Shared conversion model

The Strategy Master (section 15.2) is binding. Applied once here; each page adds only its own fields.

- **Flow:** Project (service pre-selected with an editable label, short objective, location and date with "not known yet") → Scope (two or three service questions, optional photo or plan, optional expandable details) → Contact (name, organisation, preferred route, plain statement of what happens next).
- **Never required to start:** a finished concept, final measurements, a budget or an upload. Every planning field accepts "not known yet".
- **Alternatives always visible:** WhatsApp and email, each opening with the service already named in a short prefilled message (one is specified per page).
- **Launch dependency:** the enquiry module currently runs in `preview` mode, with no delivery connected, and no privacy notice URL. No money-page CTA may point at the form until a controlled test shows real receipt, truthful confirmation, failure recovery and mobile completion. Until then the primary CTA label stays the same but resolves to the direct routes.
- **Measurement:** track *enquiry received* separately from CTA clicks and WhatsApp opens. Put no client documents, names or form contents in analytics events or URLs.

## 7. Shared technical baseline (page-specific additions are on each page)

Final HTTP 200, indexable, self-canonical, in the sitemap, one H1, breadcrumbs. Final URLs carry a trailing slash everywhere (internal links, canonicals, sitemap, breadcrumbs) because the live site resolves to the slash form. Internal links use the `www` host: the existing capability pages currently link guides on the non-`www` host, which should be normalised during implementation. Hero image or poster is the LCP element, eager and high priority; video loads after first paint and respects reduced motion. Structured data: one Organization entity reused, WebPage and BreadcrumbList per page, an optional truthful Service. No FAQ rich-result work, no Product or Offer markup, no review markup, no Event markup on service pages.

**Links to `/mural-artist-dubai/`:** the Strategy Master recorded a 404 at that URL. Every specified link to it is marked **GATED** and must not go live before the page is deployed.

## 8. How a page section is specified

Each section gives: **Purpose** (what the module must accomplish), **Headline**, **Copy** (final text), **Composition**, **Media** (ESSENTIAL or OPTIONAL, with status), and **CTA** only where one belongs. Section numbers follow the Strategy Master's module order so the architecture stays traceable. Where a module cannot be honestly filled today, it is marked CONDITIONAL and the page is specified to work without it.
