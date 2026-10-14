# Impact Murals · Money Page Production Master

**Update, 14 October 2026:** the nine pages are now built and reviewable in the branch, still unpublished: see `IMPLEMENTATION.md` for routes, files, how to preview, what is real and what is a placeholder, the decisions taken, and what must be done before publication. The rest of this file is the specification as it was delivered on 13 October.

**Phase:** production specification. **Date:** 13 October 2026. **Nothing is published, migrated, redirected or edited on the live site.** No route, canonical, sitemap entry, navigation item or Search Console setting was changed. No source file of the website was modified; this folder holds documentation only.

## Contents

| File | What it is |
|---|---|
| `00-shared-foundations.md` | Sources used, the shared visual language, copy rules, the facts the copy may rely on, the register of real existing assets, the shared enquiry model |
| `01-live-painting-dubai.md` | Full specification and final copy |
| `02-corporate-artwork-dubai.md` | Full specification and final copy |
| `03-custom-canvas-art-dubai.md` | Full specification and final copy |
| `04-hotel-artwork-dubai.md` | Full specification and final copy |
| `05-live-customisation-dubai.md` | Full specification and final copy |
| `06-art-installations-dubai.md` | Full specification and final copy |
| `07-art-for-interior-designers-dubai.md` | Full specification and final copy |
| `08-public-art-dubai-uae.md` | Public Art, strengthened in place |
| `09-corporate-art-workshops-dubai.md` | Conditional page, specified, launch on hold |

Every page file follows the same five parts (A identity, B architecture and copy, C proof, D conversion, E SEO and GEO). The *page designs* differ; only the specification format is constant, so a writer, designer and implementer can read any file the same way.

## 1. Master Index

| Page | Final URL | Primary intent | Main buyer | Distinctive page idea | Primary CTA | Priority media | Existing page to consolidate | Status |
|---|---|---|---|---|---|---|---|---|
| Live Painting | `/live-painting-dubai/` | live painting Dubai, brand and corporate events | Brand manager, creative director, agency producer, event organiser | The page runs like the event does: a run sheet from first marks to reveal | Discuss a Live Painting Event | Wide event shot with audience and scale; credited performance recap | `/what-we-do/art-for-brands/live-painting/` | Ready for review |
| Corporate Artwork | `/corporate-artwork-dubai/` | corporate artwork Dubai, original art for workplaces | Brand, workplace or facilities lead; designer; fit-out PM | Read the floor plan: zone by zone, and delivery in an occupied office | Discuss a Workplace Art Project | Installed original in a real workplace; protection and clean-down sequence | None (new hub; workplace sections of Art for Places) | Ready for review |
| Custom Canvas | `/custom-canvas-art-dubai/` | custom canvas art Dubai, original commissions | Design team; premium private commissioner | Wall labels: gallery-style works with confirmed facts and a scale figure | Discuss a Canvas Commission | A large canvas on a wall with a person for scale; a second artist's canvas | `/what-we-do/art-for-places/commissioned-paintings/` | Ready for review |
| Hotel Artwork | `/hotel-artwork-dubai/` | hotel artwork Dubai, defined commissioned-art scope | Operator, hospitality designer, art or FF&E consultant, PM | The guest route: art at every stop, two programme tracks, a responsibility ledger | Discuss a Hotel Art Project | A permitted installed hotel context, or a labelled studio sample | None (new hub; hospitality sections of Art for Places) | Ready for review, media-dependent |
| Live Customisation | `/live-customisation-dubai/` | live customisation Dubai, artist-led | Luxury, retail or beauty brand; agency; gifting producer | The station: artist, object, guest; throughput treated as the honest question | Discuss a Live Customisation Event | Close-up of an artist personalising an object for a guest; before and after | `/what-we-do/art-for-brands/product-customisation/` | Ready for review, media-dependent |
| Art Installations | `/art-installations-dubai/` | art installations Dubai, bespoke and site-specific | Creative director, designer, developer, PM | The specification sheet: who is responsible for what is the product | Discuss an Art Installation | A documented spatial work or prototype with scale | `/what-we-do/art-for-places/site-specific-artworks/` | Ready for review, media-dependent |
| Designers & Architects | `/art-for-interior-designers-dubai/` | art for interior designers Dubai | Interior designer, architect, specifier | Send and receive: the page is itself a brief template | Discuss a Design-Team Collaboration | Real plan beside the artwork made from it; two coordination specimens | None (professional-collaboration material from parent pages) | Ready for review |
| Public Art | `/what-we-do/public-art/` (kept) | public art Dubai, commissioning and production | Developer, institution, cultural team, consultant, PM | The site dossier: surface, access, exposure, approvals, programme, care | Discuss a Public Art Project | Wall at full height with scaffold access, before and after (exists, private commission) | The core of `large-scale-murals`, `facade-artwork`, `site-specific-artworks` (public) | Ready for review |
| Corporate Art Workshops | `/corporate-art-workshops-dubai/` | corporate art workshops Dubai | HR, internal comms, events or brand lead | Many hands, one work: output-first, with real facilitation | Discuss a Corporate Art Workshop | A documented facilitated pilot with finished shared artwork | `/what-we-do/art-for-brands/creative-workshops/` (later) | Specified, **launch on hold** (five-item gate) |

## 2. The commercial system

| Destination | The job purchased | The neighbour it must not become |
|---|---|---|
| Mural Artist (reference, not redrafted) | A wall painted by an artist | Public Art for public-realm scope; Corporate and Hotel for sector procurement |
| Live Painting | Watching art being made at an event | Live Customisation (guest objects); Workshops (taught) |
| Corporate Artwork | Original art for a workplace | Company events; a standalone canvas; general murals |
| Custom Canvas | An original painting made for a wall | A print service; a room-and-programme page |
| Hotel Artwork | Commissioned art inside a hospitality project | FF&E procurement; hotel opening events |
| Live Customisation | A personalised object made live | A stage painting; bulk printed gifts |
| Art Installations | An original spatial work for a site | Picture hanging; public-realm commissions |
| Designers & Architects | A collaboration workflow | A rewrite of every service page for designers |
| Public Art | Public-realm production with approvals and access | A private exterior wall; an official cultural programme |
| Corporate Workshops (later) | A facilitated group session with an output | Open classes; passive performance; workplace art purchase |

**Lateral links are deliberate, not universal:** Live Painting to Live Customisation, Participatory Art, Canvas and Automotive; Corporate to Canvas, Mural Artist, Installations, Designers and Live Painting; Canvas to Corporate, Hotel, Mural Artist, Installations, Live Painting and Artist Collaborations; Hotel to Canvas, Installations, Mural Artist, Collaborations, Designers, and Public Art only for a development's public realm; Live Customisation to Live Painting, Participatory Art, Automotive and the pre-produced routes; Installations to Public Art, Hotel, Corporate, Canvas, Mural Artist and Designers; Designers to each format and sector page as applicable; Public Art to Mural Artist, Installations and its three retained children; Workshops to Participatory Art, Live Painting, Live Customisation and Corporate. Every link to Mural Artist is **GATED** on that page being deployed.

## 3. Visual differentiation

| Page | Hero surface | Dominant media | Organising device | Signature diagram |
|---|---|---|---|---|
| Live Painting | Dark, full-bleed vertical footage | Performance clips | Run sheet (time) | Setup plan and timeline |
| Corporate Artwork | Light, two thirds image | Finished work in a workplace | Floor plan (zone) | Plan strip, phasing, schedule |
| Custom Canvas | Pale paper, tall canvas | Macro detail, finished canvases | Gallery wall labels | Elevation with a human figure |
| Hotel Artwork | Warm stone paper, long section drawing | Wide spatial crops | Guest route | Section drawing, two tracks |
| Live Customisation | Dark, macro close-up | Close-ups, before and after | The station | Station layout, menu card |
| Art Installations | Dark drawing sheet | Drawings, samples, making | Specification sheet | Responsibility matrix, development diagram |
| Designers & Architects | Light, plan beside artwork | Documents | Send and receive | Specimen documents, swimlane |
| Public Art | Dark split, full-height wall | Panoramas, the tall wall | Site dossier | Access diagram, approval map |
| Corporate Workshops | Light, shared artwork | People making | Many hands, one work | Tile assembly, session flow |

Four dark heroes and five light ones. Each page has a different organising device and its own diagram family. All keep the animated fragmented logo, the Automotive typographic rules and the same closing block.

## 4. Cross-page audit: what was checked, found and fixed

Checks run on the nine specifications as written:

| Check | Result |
|---|---|
| Em dashes and en dashes in any file | None |
| Banned phrases ("bring your vision to life", "transform your space", "Dubai's #1", "seamless", "stunning", "world-class", "state-of-the-art") | None. "Bespoke" appears only in search-intent rows, never in page copy. |
| Duplicate headlines across the nine pages | None, after fixes |
| Duplicate FAQ questions (77 questions across nine pages) | None, after fixes |
| Repeated sentences across pages | Only specification boilerplate remains; no page copy is repeated |
| Internal paths checked against the 809-record register | 74 of 74 resolve, after two replacements (below) |
| Title and meta length | Titles 45 to 64 characters, descriptions 152 to 158. Google's pixel truncation was not measured. |

Problems the audit found and corrected:

1. **Mechanical headline formulas.** Eight of nine FAQ headings began "BEFORE YOU ...", five of nine closing headings began "TELL US ...", and eight of nine process headings were "FROM X TO Y". Rewritten so each page has its own.
2. **Identical FAQ and boundary wording.** "Who chooses the artist and the style? The brief does." appeared on three pages, "no house style" on two, and "Appointment comes first. Project-specific concepts ..." on about a dozen lines. Re-expressed per page; the rule itself is kept on every page, as the Strategy requires.
3. **Three diagram-led dark heroes in a row** (Hotel, Customisation, Installations). Hotel moved to a light stone-paper surface.
4. **Two guides the current capability pages link to are absent from the 13 October sitemap** ("How to decide between a mural, painting and art installation" and "How to combine murals, canvas art and installations in one interior"). Replaced by verified guides; recorded as editorial gaps.
5. **A guide suggestion in the Strategy** (a new timed-reveal guide) is unnecessary: an existing guide already covers it.
6. **No fallback hero** on Workshops. Added a labelled illustrative tile diagram.
7. **Missing lateral links:** Hotel and Installations now link to the Designers page.

Judged and kept: every primary CTA starts "Discuss a ...". That is the Strategy's service-labelled convention (hero, mid-page and closing show the same label), and the surrounding language (closing headline, micro-line, WhatsApp text) is different on every page.

## 5. Cross-page QA summary

### 5.1 Factual information still requiring confirmation

| Page | Confirm before launch |
|---|---|
| Live Painting | Artists and formats currently available; performance windows; real setup needs; artwork and content-use terms; permission and credit to reuse the BMW, Jetour and iCAUR assets and the AGMC link; the location of the Jetour and iCAUR events (only the BMW event is placed in Dubai) |
| Corporate Artwork | Actual workplace delivery scope; protection and material approach; whether evening and weekend work can be offered (the copy says "where the building allows it") |
| Custom Canvas | The original-commission route; artist and medium availability; certificates, signature and credit practice; framing and installation inclusion; lead times; the medium, size and artist of `PORSCHE_PORTRAIT` and `CANVAS_PROCESS` |
| Hotel Artwork | The defined art package; the interface with design teams; sample and install scope; whether named-artist collaborations are offered to hotels; the hand-painted-variations approach for repeated room types |
| Live Customisation | That hand painting, illustration, and lettering or calligraphy are all confirmed through the actual network; sample compatibility; tested menu time; staffing; stock and packaging responsibility; that engraving, laser and hot foil are genuinely not offered |
| Art Installations | The artist and fabricator coordination model; real medium evidence; technical appointment boundaries; whether any fabrication is in house (the copy under-claims on purpose) |
| Designers | The "first read" the studio is willing to give before appointment; approval and site interfaces; confidentiality terms; rights and crediting practice |
| Public Art | Height, area, location and permission for the exterior mural; real access experience or the qualified-partner model; material and exposure scope; the stakeholder process |
| Workshops | The five-item launch gate in file 09 |
| Studio-wide | Founder experience ("15 years" on Automotive, "more than a decade" in the studio content); whether to publish the Automotive investment note (AED 8,000 to 25,000+, 50% deposit) on any money page; one spelling of "façade" or "facade" (metadata uses the first, capability titles the second) |

### 5.2 Media that needs to be sourced (and one shoot that unlocks most of it)

**Nothing in the repository covers:** a workplace or hotel interior with installed art, any guest customisation, any sculptural or dimensional work, any group workshop, any wide event shot with an audience, any material or coating sample.

| Priority | Asset | Unlocks |
|---|---|---|
| 1 | **One studio demonstration day:** one artist, three objects, three techniques, before and after, a material test, a station and collection setup; a macro brushwork set; a canvas against a figure for scale; edge, corner and packing details; a second artist's canvas | Live Customisation (all rows), Custom Canvas (scale, edge, range), Hotel and Installations detail |
| 2 | **A permitted installed-art shoot** in one office or reception and one hospitality space, with consent | Corporate and Hotel heroes |
| 3 | **Event capture on the next live job:** a wide shot with audience, a close-up, a reveal, a credited recap | Live Painting, and Live Customisation if combined |
| 4 | **A documented facilitated pilot** with a small group, setup to finished shared artwork | Workshops (launch gate item 5) |
| 5 | **A prototype or sample of a dimensional work, if the studio intends to offer it** | Art Installations, Hotel |
| 6 | **About two dozen illustrative diagrams in one drawing style, drawn in one pass** (setup plan, plan strip, phasing, schedule, elevation, route drawing, station layout, menu card, drawing sheet, development diagram, swimlane, access diagram, approval map, tile grid, session flow and the rest) | Every page; each one carries the word "Illustrative" on the page |

### 5.3 Proof gaps

- Live painting is evidenced **on vehicles only**; no stage, canvas or conference reveal is documented.
- No hospitality, workplace, installation or workshop credential exists. Four pages (Hotel, Customisation, Installations, Designers) therefore omit their "selected applications" module until a permitted example exists; the Workshops page omits it too.
- The only large-scale exterior proof is a **private commission**, labelled as such. It evidences scale and access, not public-realm or institutional appointment.
- Artist credit, medium and usage permission are unrecorded for every existing asset. Reuse of the Automotive assets is assumed possible, not granted.

### 5.4 Technical dependencies for later implementation

- **Enquiry delivery.** The form runs in `preview` mode with no delivery connected and an empty privacy-notice URL. No money-page CTA may point at the form until a controlled test shows real receipt, truthful confirmation and failure recovery. Until then, CTAs resolve to the WhatsApp and email routes, with the prefilled messages in each file.
- **Mural Artist is gated.** The Strategy Master recorded a 404 at `/mural-artist-dubai/`. Six pages link to it; each link is marked GATED.
- **URL consistency.** 807 of 809 sitemap entries differ from their final served URL by the trailing slash. Use the slash form everywhere in the new pages and align canonicals, sitemap, breadcrumbs and links. Capability pages in the source also link guides on the non-`www` host.
- **Possibly broken related links.** In `src/content/capabilities.ts`, 35 of 106 hard-coded related-guide links are not in the 13 October sitemap crawl. They may be unpublished or redirected, which was not tested here. Check them before consolidating those pages, because several of them are the exterior-durability, hotel-supply and office-art guides the new pages would want.
- **Redirect order** (later, never in this phase): build and link the destination first, then one-hop 301 the old route: Live Painting, Commissioned Paintings, Product Customisation, interior Site-Specific Artworks, the three Public Art children being merged, and Creative Workshops last and only if the gate clears.
- **Images.** The crawl found no `<img>` elements in server HTML on 807 pages. Every new page needs semantic, responsive, original images with captions and credits; hero posters are the LCP element.
- **Guide families.** 153 articles carry the register's "broad commercial heading" flag, and the hotel guides come as near-duplicate pairs ("hotel owners and operators" versus "hotels with art programming for guest stays"). Only one variant of each is linked. Narrow or merge before linking more.

### 5.5 Genuine unresolved strategic points

1. **The original Money Pages Master Context was not supplied in this session.** Positioning and methodology came from the Strategy Master's quotations and from `CONTEXT.md`. Please re-read the nine pages against the original before approving.
2. **Live on a vehicle sits on two pages.** It is a format on Live Painting (the performance, with real proof) and a service on Automotive (the vehicle brief). The overlap is intended and linked both ways; confirm the owner is content with it.
3. **The existing Creative Workshops page serves more than companies** (families, public events, hospitality). A narrow corporate page cannot simply replace it, so a decision on the other audiences is needed before migration.
4. **Whether to publish any fee guidance.** No page publishes a price or a starting rate, as the Strategy requires. The Automotive investment note is an owner decision.
5. **Visual language was taken from source, not from a rendered page.** Open the live Automotive page once next to these specifications before design starts.

## 6. What was and was not verified

| Item | Outcome |
|---|---|
| Spec files complete for all nine pages | Done |
| Internal links against the register (74 paths) | **PASS** |
| Dash, banned phrase, duplicate heading and duplicate FAQ scans | **PASS** after fixes |
| Title and meta character counts | **PASS**; Google pixel width **not measured** |
| Rendered Automotive page, any browser inspection, any design skill | **BLOCKED / not done.** Not opened; no browser or design skill was used. The language comes from the repository source. |
| Live-site facts (Mural Artist 404, preview-mode form, URL mismatch) | **Taken from the Strategy Master, not re-checked** in this session |
| Original Master Context | **Not available** |
| Competitor and SERP evidence | Taken from the supplied registers; no new search was run |

## 7. Handoff and next steps

**State:** complete specification package, ready for the owner's review. Nothing else is in progress.

**Suggested order:** (1) answer the confirmation table in 5.1; (2) approve or amend the nine specifications; (3) schedule the media work in 5.2, starting with the studio demonstration day; (4) clear the enquiry-delivery dependency; (5) only then brief the implementation, building destinations before any redirect.
