/**
 * The 20 "WHAT WE CAN CREATE" sales pages, one per concrete offer format,
 * nested under their parent offer at /what-we-do/{offer}/{capability}.
 *
 * Source: Impact_Murals_What_We_Can_Create_Sales_Pages_V3_INTERNAL_LINKS.txt.
 * Copy is integrated verbatim (not rewritten, shortened or reformulated).
 * `body` is markdown, rendered through the same renderMarkdown()/ArticleBody
 * pipeline already used for guides and insights, so headings and lists pick up
 * the site's existing typographic system with no new styling.
 */
import type { OfferKey } from "./offers";

export interface RelatedGuideLink {
  title: string;
  href: string;
}

export interface Capability {
  offerKey: OfferKey;
  slug: string;
  /** H1. Stored ALL CAPS, matching how offer/page titles are already stored in this codebase. */
  title: string;
  /** Title Case, for breadcrumbs and navigation labels (mirrors offer.shortTitle). */
  shortTitle: string;
  /** One-line hook, right under the H1. Also used as the meta description. */
  tagline: string;
  /** The longer paragraph before the first CTA. */
  intro: string;
  /** Markdown: every "##" section between the intro and RELATED GUIDES & INSIGHTS. */
  body: string;
  relatedIntro: string;
  relatedGuides: RelatedGuideLink[];
  closingHeading: string;
  closingBody: string;
}

export const capabilities: Capability[] = [
  // ---------------------------------------------------------------- ART FOR BRANDS
  {
    offerKey: "art-for-brands",
    slug: "brand-activations",
    title: "BRAND ACTIVATIONS, LAUNCHES & EVENT ARTWORK",
    shortTitle: "Brand Activations, Launches & Event Artwork",
    tagline: "Art-led brand activations for launches, events and campaign moments.",
    intro:
      "Impact Murals helps brands, agencies and event teams turn a brief into a physical artistic experience. The format can be live, participatory, temporary, permanent or built around a commissioned artwork. We start with what the moment needs to achieve, then shape the art around the audience, venue, programme and brand.",
    body: `## WHAT ROLE SHOULD THE ART PLAY?

A launch and an event may both need art, but for very different reasons.

The artwork might become the main reveal, give guests something to watch, invite participation, create a strong physical focal point or leave the brand with a finished piece after the event.

Before choosing a format, we look at:

- what is being launched or communicated;
- who will experience it;
- how long people will engage with the work;
- what already exists in the campaign or event concept;
- whether the making process matters;
- what should remain after the event.

That keeps the activation centred on the purpose of the event and lets the format follow the brief.

## POSSIBLE ACTIVATION FORMATS

Depending on the brief, the artistic response can include:

- live painting or live mural creation;
- participatory murals and collaborative artworks;
- artist-led product or object customisation;
- a commissioned artwork revealed during the event;
- an artist collaboration or limited edition;
- a mural or temporary art environment;
- creative workshops or guided sessions;
- a hero artwork developed around a product, campaign or milestone.

One activation can combine several of these elements when the programme genuinely benefits from it.

## FROM CAMPAIGN DIRECTION TO PHYSICAL EXPERIENCE

If the campaign is already developed, we work within it.

Brand guidelines, key visuals, product references, launch assets, event narratives and approved concepts can all inform the artistic response. The goal is to identify what should carry into the physical experience and what needs to change for the real space.

If the artistic direction is still open, we can help define that part from the beginning.

For projects in Dubai and across the UAE, this flexibility is useful when agencies, production teams and brand stakeholders are already moving in parallel and the art needs to slot cleanly into an established programme.

## BUILT INTO THE EVENT

Event artwork has to work in the live programme as convincingly as it works in a presentation.

Timing, venue access, audience movement, event lighting, installation windows, materials, protection, photography and programme cues can all affect the final approach.

A live piece needs a different production rhythm from a commissioned reveal. A participatory activation needs a clear flow for guests. A customisation station needs realistic throughput. We plan the artistic production around those conditions before the event opens.

## WORKING WITH THE WIDER TEAM

Impact Murals can work directly with the brand or as the specialist artistic partner within an agency or event-production team.

Our scope can include:

- artistic direction;
- artist selection and briefing;
- artwork development;
- material and format planning;
- production coordination;
- on-site artistic execution;
- final artwork handover where relevant.

The wider event team keeps control of the overall production. We focus on making the artistic intervention work inside it.`,
    relatedIntro: "For specific launch, event and sector use cases, these guides go deeper:",
    relatedGuides: [
      { title: "Art Activations for Beauty & Cosmetics Launch Events Dubai", href: "https://impactmurals.ae/guides/art-activations-beauty-cosmetics-launch-events-dubai" },
      { title: "Art Activations for Automotive Launches & Motorsport Events", href: "https://impactmurals.ae/guides/art-activations-automotive-launches-motorsport-events" },
      { title: "Art Activations for Real Estate Launches & Property Events Dubai", href: "https://impactmurals.ae/guides/art-activations-real-estate-launches-property-events-dubai" },
      { title: "Art Activations for Hotel Openings & Hospitality Launch Events", href: "https://impactmurals.ae/guides/art-activations-hotel-openings-hospitality-launch-events" },
      { title: "10 Art Activation Ideas for Mall Events & In-Store Campaigns", href: "https://impactmurals.ae/insights/10-art-activation-ideas-mall-events-in-store-campaigns" },
      { title: "15 Art Activation Ideas for Product Launches", href: "https://impactmurals.ae/insights/art-activation-ideas-product-launches" }
    ],
    closingHeading: "PLANNING A BRAND ACTIVATION, LAUNCH OR EVENT?",
    closingBody:
      "Share the event brief, campaign direction, venue, date and what you want people to experience. The artistic format can still be completely open."
  },
  {
    offerKey: "art-for-brands",
    slug: "live-painting",
    title: "LIVE PAINTING & LIVE ART PERFORMANCES",
    shortTitle: "Live Painting & Live Art Performances",
    tagline: "Live art turns the making of the artwork into part of the event.",
    intro:
      "For launches, hospitality, corporate events, exhibitions and brand experiences, the artist can create in front of the audience while the work develops across the programme. The performance can be subtle and continuous or built around a clear reveal.",
    body: `## WHEN THE PROCESS IS PART OF THE EXPERIENCE

A finished artwork gives people one moment. Live painting gives them a progression.

Guests can see the first marks, return to the piece later, watch the image take shape and experience the final result in context. That creates a natural focal point, with the performance kept as subtle or theatrical as the programme needs.

The live element can work:

- as a central performance;
- beside a product launch;
- within a VIP or hospitality programme;
- across a longer event;
- around a scheduled reveal;
- as one part of a wider activation.

The right level of visibility depends on the event.

## LIVE ART CAN TAKE DIFFERENT FORMS

A project might involve:

- live canvas painting;
- live mural creation;
- calligraphy or lettering;
- portrait or figurative painting;
- product or object painting;
- a timed artwork reveal;
- a collaborative piece with selected guests;
- an artwork developed in stages across an event.

The finished work can remain with the brand, be installed later or simply complete the live experience.

## DEVELOPED AROUND THE BRAND AND MOMENT

The artist needs something meaningful to work from.

That starting point can be a product story, campaign direction, launch theme, location, cultural reference, brand world or existing visual system. We decide how directly the brand should appear and how much freedom the artist should have before the event begins.

That balance is especially important for live painting because there is less room to correct a weak brief once the performance is underway.

## THE ARTIST CHANGES THE EXPERIENCE

Technique matters, but so does presence.

The pace of the work, the scale of the piece, the way the artist moves and the amount of interaction with guests all affect how the performance feels. We select the artist according to the brief, medium, visual direction and event context.

If the brand already has an artist in mind, Impact Murals can develop the live format around that collaboration.

## PLANNED FOR REAL EVENT CONDITIONS

Live work has a fixed window.

Before the event, we review:

- available production time;
- working area and audience distance;
- surface and materials;
- lighting;
- protection requirements;
- access and setup;
- drying or finishing time;
- the point at which the artwork must be complete.

For events in Dubai and across the UAE, venue rules, operating hours and event production schedules can also shape the setup. The artistic plan needs to be realistic inside those conditions.

## CONTENT CAN COME NATURALLY FROM THE PROCESS

Live painting gives photographers and content teams real moments to capture: the artist at work, details, audience reactions and the final reveal.

When content capture matters, we can consider sight lines, key stages and the finished presentation. The artwork still needs to work as an artwork first.`,
    relatedIntro: "For event planning, timing, cost and production detail, continue with:",
    relatedGuides: [
      { title: "Live Art Activations for Exhibitions & Trade Shows Dubai", href: "https://impactmurals.ae/guides/live-art-activations-exhibitions-trade-shows-dubai" },
      { title: "What Does a Live Art Activation Cost in Dubai?", href: "https://impactmurals.ae/insights/what-does-a-live-art-activation-cost-in-dubai" },
      { title: "How Early Should You Book a Live Artist for an Event in Dubai?", href: "https://impactmurals.ae/insights/how-early-should-you-book-a-live-artist-for-an-event-in-dubai" },
      { title: "High-Throughput Live Art Activations: What Works for Busy Events?", href: "https://impactmurals.ae/insights/high-throughput-live-art-activations-busy-events" },
      { title: "How to Plan a Multi-Day Live Art Activation", href: "https://impactmurals.ae/insights/plan-multi-day-live-art-activation" },
      { title: "Live Art Activation Production Checklist for Event Agencies UAE", href: "https://impactmurals.ae/insights/live-art-activation-production-checklist-event-agencies-uae" }
    ],
    closingHeading: "PLANNING LIVE ART FOR AN EVENT OR BRAND?",
    closingBody:
      "Send the event type, venue, date, audience and any existing campaign references. We can shape the live format around the real programme."
  },
  {
    offerKey: "art-for-brands",
    slug: "participatory-art",
    title: "PARTICIPATORY MURALS & COLLABORATIVE ARTWORKS",
    shortTitle: "Participatory Murals & Collaborative Artworks",
    tagline: "Create an artwork people can genuinely contribute to, while keeping the final result artist-led and resolved.",
    intro:
      "For brand activations, workplace programmes and events, participation can become part of the experience and part of the finished piece. Impact Murals structures the contribution around the audience and occasion, while the artist prepares the composition, guides the process and completes the final artwork.",
    body: `## THE SHARED ARTWORK IS THE CENTRE OF THE FORMAT

Participatory art works best when the collective piece matters.

Guests or employees may paint selected areas, add marks, contribute words, create smaller elements or take part in a guided stage of the artwork. Their contribution becomes visible in the final result.

If the main objective is teaching a technique or giving participants a stand-alone creative session, an artist-led workshop may be the better format. Here, the shared artwork is the main outcome.

## PARTICIPATION NEEDS A CLEAR SYSTEM

The contribution should be easy to understand when someone arrives.

The artist can define:

- the overall composition;
- the palette;
- which areas are open to participants;
- how long each interaction takes;
- the order of participation;
- what the artist completes afterwards.

This makes the experience accessible while keeping the final composition resolved.

## DIFFERENT LEVELS OF PARTICIPATION

The format can be light or highly involved.

Examples include:

- guests painting prepared areas of a mural;
- individual marks forming part of a larger composition;
- employees contributing words or ideas that inform the work;
- smaller participant pieces assembled into one final artwork;
- a collaborative canvas;
- a mural developed throughout an event;
- selected participants working directly with the artist.

The level of contribution depends on participant numbers, available time, age range where relevant and the role of the final piece.

## CONNECTED TO THE BRAND OR OCCASION

Participation becomes more meaningful when the mechanic belongs to the project.

A company event might use a shared internal theme. A launch might build the piece towards a reveal. A retail activation may need a fast contribution that works continuously as people arrive. A workplace programme may give employees more time and input.

The artistic framework is shaped around that context.

## DESIGNED FOR THE NUMBER OF PEOPLE INVOLVED

Twenty participants and five hundred participants require different systems.

We consider:

- expected volume;
- average interaction time;
- queue flow;
- working space;
- supervision;
- material handling;
- drying time;
- protection;
- artist finishing.

For higher-footfall activations, the participation normally needs to become simpler and more repeatable. Smaller groups can support a deeper contribution.

## WHAT HAPPENS TO THE FINAL ARTWORK?

The finished piece can:

- remain at the event;
- move into an office or venue;
- be retained by the brand;
- develop across several sessions;
- become a permanent mural;
- be documented as part of the event story.

Knowing the afterlife early helps determine the scale, surface and production method.`,
    relatedIntro: "For participation mechanics and related event formats, see:",
    relatedGuides: [
      { title: "Guest-Painted Murals: How Participatory Event Artwork Works", href: "https://impactmurals.ae/insights/guest-painted-murals-how-participatory-event-artwork-works" },
      { title: "Employee Art Activations for Corporate Events Dubai", href: "https://impactmurals.ae/insights/employee-art-activations-for-corporate-events-dubai" },
      { title: "Collaborative Canvas Painting for Corporate Events", href: "https://impactmurals.ae/guides/collaborative-canvas-painting-corporate-events" },
      { title: "Collaborative Abstract Painting Workshops for Corporate Teams", href: "https://impactmurals.ae/guides/collaborative-abstract-painting-workshops-corporate-teams" }
    ],
    closingHeading: "PLANNING A PARTICIPATORY ART PROJECT?",
    closingBody:
      "Tell us who will take part, the event or programme, approximate numbers and what you want to keep at the end."
  },
  {
    offerKey: "art-for-brands",
    slug: "creative-workshops",
    title: "CREATIVE WORKSHOPS & ARTIST-LED SESSIONS",
    shortTitle: "Creative Workshops & Artist-Led Sessions",
    tagline: "Artist-led workshops designed around the people taking part, the time available and the reason for bringing them together.",
    intro:
      "For corporate teams, clients, families, events and hospitality programmes, Impact Murals develops creative sessions that feel considered and accessible. The experience of making is the main focus, whether participants leave with an individual piece or contribute to something larger.",
    body: `## START WITH THE PEOPLE IN THE ROOM

A useful workshop begins with the audience.

A leadership team, a group of clients, families at a public event and a staff programme all need a different level of guidance, pace and complexity.

We look at:

- who is taking part;
- whether they have any previous experience;
- the size of the group;
- how long the session can run;
- whether the goal is learning, making, collaboration or simply a creative break;
- what participants should leave with.

That gives the workshop a clear purpose before the activity is chosen.

## POSSIBLE WORKSHOP FORMATS

Depending on the venue and brief, sessions can include:

- guided painting on canvas or panels;
- lettering or calligraphy;
- stencil-based painting;
- spray-paint sessions where the setup allows;
- product or object customisation;
- collaborative group pieces;
- individual works that combine into a larger final artwork;
- artist demonstrations followed by guided participant work.

The format can be simplified for a short drop-in session or developed in more depth for a smaller group.

## THE ARTIST LEADS THE EXPERIENCE

The artist does more than demonstrate a sequence of steps.

They introduce the idea, show the technique, give people enough structure to begin confidently and respond to what participants actually make. That direct guidance is what gives the session a real connection to artistic practice.

For brands and companies, the workshop can also respond to a wider theme, campaign, local context or internal programme when that adds value.

## ONE SESSION OR A REPEATABLE PROGRAMME

A workshop can stand alone or become part of a wider initiative.

It can:

- sit inside a conference or event;
- support employee engagement;
- accompany a mural project;
- run across several days;
- repeat across offices or locations;
- form one part of a community programme.

Where several sessions are planned, we can create a framework that stays consistent while allowing the artist and participants enough freedom.

## PRACTICAL PLANNING

A strong session also needs to run smoothly.

We consider participant numbers, tables or working surfaces, material handling, protection, setup, reset, drying time, take-home packaging and the need for assistants.

Venue rules, setup windows and material restrictions can be factored into the workshop format before the session is confirmed.

## WHAT SHOULD PEOPLE LEAVE WITH?

The outcome can be individual, collective or simply experiential.

Participants might take home their own artwork, contribute to one shared piece or leave with the experience of working directly with an artist. The right answer depends on the purpose of the programme.`,
    relatedIntro: "For specific workshop formats and session planning, see:",
    relatedGuides: [
      { title: "Calligraphy Workshops for Corporate & Brand Events Dubai", href: "https://impactmurals.ae/guides/calligraphy-workshops-corporate-brand-events-dubai" },
      { title: "Graffiti Workshops for Corporate Events in Dubai", href: "https://impactmurals.ae/guides/graffiti-workshops-corporate-events-dubai" },
      { title: "Canvas Painting Workshops for Corporate Events in Dubai", href: "https://impactmurals.ae/guides/canvas-painting-workshops-corporate-events-dubai" },
      { title: "Mural Workshops for Corporate Teams & Community Events", href: "https://impactmurals.ae/guides/mural-workshops-corporate-teams-community-events" },
      { title: "Tote Bag Painting Workshops for Brand & Corporate Events", href: "https://impactmurals.ae/guides/tote-bag-painting-workshops-brand-corporate-events" },
      { title: "30-Minute Creative Workshop Ideas for Corporate Events", href: "https://impactmurals.ae/insights/30-minute-creative-workshop-ideas-corporate-events" }
    ],
    closingHeading: "PLANNING AN ARTIST-LED WORKSHOP?",
    closingBody:
      "Share the audience, occasion, approximate group size, venue and available time. We can shape the session around the real programme."
  },
  {
    offerKey: "art-for-brands",
    slug: "product-customisation",
    title: "PRODUCT, OBJECT & MERCHANDISE CUSTOMISATION",
    shortTitle: "Product, Object & Merchandise Customisation",
    tagline: "Turn the product or object itself into the surface for the artwork.",
    intro:
      "Impact Murals develops artist-led customisation for launches, retail activations, VIP gifting, events, hero objects and limited runs. The work can happen live in front of guests or be produced in advance, depending on the level of detail, quantity and role of the finished piece.",
    body: `## FROM ONE HERO OBJECT TO LIVE PERSONALISATION

Customisation can solve very different briefs.

A launch may need one highly finished statement object. A retail activation may need personalised items produced continuously for guests. An automotive project may centre on a painted vehicle or component. A campaign may need a small hand-finished edition.

The first question is what the customised object needs to do for the project.

## WHAT CAN BE CUSTOMISED?

Potential surfaces include:

- products and packaging;
- footwear and fashion items;
- bags, cases and accessories;
- merchandise and gifting pieces;
- display objects;
- selected furniture or interior objects;
- automotive surfaces or components;
- one-off hero pieces;
- limited hand-finished editions.

The material needs to be reviewed before the artistic method is confirmed. Surface compatibility, handling and intended use all matter.

## LIVE OR PRE-PRODUCED

Live customisation works when the interaction with the artist is part of the experience.

It can be effective for retail openings, product launches, exhibitions, hospitality and VIP events. The artistic system needs to be fast enough for the expected volume while still giving each item a meaningful finish.

Pre-produced work allows more time for detail and suits hero objects, gifts, campaign assets and limited editions where the finished result carries more weight than the live process.

## THROUGHPUT CHANGES THE CREATIVE SYSTEM

Volume directly affects what can be offered.

A low-volume VIP programme can support more individual variation. A high-footfall activation needs a clearer menu of options, faster interaction and a repeatable rhythm.

Before proposing the format, we consider:

- number of items;
- expected guests;
- interaction time;
- number of artists;
- drying or curing;
- handling and packaging;
- queue flow;
- level of variation.

That keeps the experience realistic on the day.

## DEVELOPED AROUND THE BRAND

The customisation can respond to a campaign, product story, palette, launch theme, cultural reference or wider brand world.

Direct branding can be prominent or restrained. The important part is that the artistic system feels intentional on the object and makes sense for the audience receiving it.

## MATERIALS, DURABILITY AND USE

An item that will be worn, handled, displayed or gifted needs the right production approach.

We review the expected use and the permanence required. Where the object has manufacturer, safety or technical restrictions, those boundaries need to be confirmed before production.`,
    relatedIntro: "For product-specific customisation formats and live planning, see:",
    relatedGuides: [
      { title: "Live Sneaker Customisation for Brand Activations in Dubai", href: "https://impactmurals.ae/guides/live-sneaker-customisation-brand-activations-dubai" },
      { title: "Live Packaging Customisation for Product Launches & Retail Activations", href: "https://impactmurals.ae/guides/live-packaging-customisation-product-launches-retail-activations" },
      { title: "Live Denim Jacket Customisation for Events & Retail Activations", href: "https://impactmurals.ae/guides/live-denim-jacket-customisation-events-retail-activations" },
      { title: "Live Perfume Bottle Painting for Fragrance Brand Activations", href: "https://impactmurals.ae/guides/live-perfume-bottle-painting-fragrance-brand-activations" },
      { title: "Live Bag, Pouch & Small Leather Goods Painting for Events", href: "https://impactmurals.ae/guides/live-bag-pouch-small-leather-goods-painting-events" },
      { title: "How to Choose the Right Product for a Live Customisation Activation", href: "https://impactmurals.ae/insights/choose-right-product-live-customisation-activation" }
    ],
    closingHeading: "PLANNING A CUSTOMISATION PROJECT?",
    closingBody:
      "Send the product or object, quantity, event context if live, timing and any existing campaign direction."
  },
  {
    offerKey: "art-for-brands",
    slug: "artist-collaborations",
    title: "ARTIST COLLABORATIONS & LIMITED EDITIONS",
    shortTitle: "Artist Collaborations & Limited Editions",
    tagline: "Bring the right artist into a brand project, then build the collaboration around a clear brief, output and production plan.",
    intro:
      "Impact Murals can support artist collaborations from early direction through artwork development and physical production. The outcome might be a limited edition, product collaboration, campaign artwork, live intervention, mural or a connected family of pieces.",
    body: `## START WITH WHAT THE COLLABORATION NEEDS TO ACHIEVE

The artist should be chosen for a reason.

A brand may want to introduce a new visual voice, create a culturally relevant launch, reinterpret a product, develop a limited edition, reach a particular audience or build an artistic moment around a campaign.

We clarify:

- the purpose of the collaboration;
- the audience;
- the desired output;
- the level of artist freedom;
- where the work will appear;
- what needs to be produced;
- what usage rights are required.

That gives both the artist and the brand a stronger starting point.

## FINDING OR WORKING WITH THE RIGHT ARTIST

The artist needs to suit the project creatively and practically.

Medium, visual direction, scale, production conditions, public role, timing and deliverables can all affect the choice.

Impact Murals can:

- work with an artist already selected by the client;
- recommend artists according to the brief;
- coordinate several artists where the project requires more than one voice;
- help translate the collaboration into a production-ready format.

The artist remains central to the work, while the project keeps a clear commercial and production structure.

## WHAT THE COLLABORATION CAN BECOME

Possible outputs include:

- original campaign artwork;
- limited-edition products or objects;
- hand-finished numbered pieces;
- packaging artwork;
- mural or installation work;
- live painting or live customisation;
- launch or event artwork;
- commissioned pieces for display, gifting or retail;
- physical artwork that extends into campaign use.

The output is defined around the brief and the way the collaboration will be used.

## KEEPING THE PARTS ALIGNED

Artist collaborations often involve brand teams, agencies, production partners, manufacturers and content teams.

Impact Murals can help keep the artistic brief, artist input and final production connected. That may include artwork adaptation, prototype review, production coordination and on-site delivery where relevant.

For brands working in Dubai and across the UAE, this can make it easier to integrate an artist into an existing campaign or launch structure while keeping the artistic production connected to the wider programme.

## LIMITED EDITIONS NEED A CLEAR PRODUCTION MODEL

A one-off original and a run of twenty pieces are different projects.

Quantity, reproduction method, hand finishing, variation, signatures, packaging, handling and consistency all need to be defined before production begins.

The more clearly those decisions are made, the easier it is to protect the value of the artist's contribution.

## RIGHTS AND USAGE

Physical ownership and reproduction rights are separate.

If the collaboration will appear in advertising, packaging, merchandising, digital media or future campaigns, the intended usage should be agreed clearly within the project scope and documented with the relevant parties.`,
    relatedIntro: "For collaboration structures, retail ideas and related brand applications, see:",
    relatedGuides: [
      { title: "Artist Collaborations & Commissioned Art for Furniture and Home Brands UAE", href: "https://impactmurals.ae/guides/artist-collaborations-commissioned-art-for-furniture-and-home-brands-uae" },
      { title: "10 Artist Collaboration Ideas for Retail Pop-Ups", href: "https://impactmurals.ae/insights/10-artist-collaboration-ideas-retail-pop-ups" },
      { title: "How to Build an Art-Led Brand Activation in Dubai", href: "https://impactmurals.ae/insights/how-to-build-an-art-led-brand-activation-in-dubai" },
      { title: "Artist Collaborations & Source Artwork for OOH Media Owners & Special-Execution Agencies in the UAE", href: "https://impactmurals.ae/guides/artist-collaborations-source-artwork-for-ooh-media-owners-special-execution-agencies-in-the-uae" }
    ],
    closingHeading: "PLANNING AN ARTIST COLLABORATION?",
    closingBody:
      "Bring us the brand brief, intended output and any artist already being considered. If the artist is still open, we can start from the project itself."
  },
  {
    offerKey: "art-for-brands",
    slug: "branded-murals",
    title: "MURALS & BRANDED ENVIRONMENTS",
    shortTitle: "Murals & Branded Environments",
    tagline: "Turn brand communication into artwork that belongs to the physical space.",
    intro:
      "For retail, offices, showrooms, launches, hospitality and temporary environments, Impact Murals develops murals around the brand, the architecture and the way people experience the location. We can create the artistic direction or work from an approved concept.",
    body: `## FROM BRAND WORLD TO WALL

A mural can carry more than a logo or graphic asset.

The starting material might include:

- brand guidelines;
- campaign visuals;
- product forms;
- typography;
- colour systems;
- photography;
- packaging;
- heritage or company stories;
- local or cultural references;
- an approved concept from an agency or design team.

We identify which parts of that system should become artwork and how much freedom the mural needs to feel natural at scale.

## WHERE BRANDED MURALS CAN WORK

Projects can include:

- flagship retail walls;
- office and headquarters murals;
- showrooms and sales spaces;
- launch and pop-up environments;
- exhibition and event walls;
- hospitality spaces;
- temporary campaign murals;
- permanent customer-facing artwork;
- multi-wall brand environments;
- murals adapted across several locations.

The same brand may need a different response in a flagship store, event space and workplace.

## DESIGNED FOR THE SPACE

A mural is experienced inside architecture.

Wall proportion, viewing distance, furniture, circulation, lighting, doors, screens, signage and surrounding graphics can all affect the composition.

We develop or adapt the artwork from the viewpoints that matter in the real space. For temporary environments, the wall system and installation programme also influence how the artwork should be produced.

## WHEN THE BRAND EXTENDS BEYOND ONE WALL

A branded environment can use the mural as one part of a wider artistic system.

Depending on the project, that can include connected painted surfaces, panels, temporary structures, selected objects or several artworks developed around the same brand or campaign direction. The goal is to make the physical environment feel coherent while keeping the art appropriate to each surface.

This is especially useful for pop-ups, launches, showrooms and spaces where the brand experience moves across several touchpoints.

## OPEN BRIEF OR APPROVED ARTWORK

Some projects need artistic development from the beginning.

Others arrive through an agency or internal creative team with the direction already approved.

Impact Murals can:

- develop a mural concept from the brand brief;
- collaborate with an existing creative team;
- adapt supplied artwork for a real wall;
- provide specialist mural execution for an approved design.

This keeps the service useful for both direct brand commissions and agency-led production.

## PRODUCTION STAYS CONNECTED TO THE ARTWORK

Surface condition, preparation, materials, access, protection and working windows can all affect the final execution.

For larger walls or multi-location programmes, production planning may also involve several artists, phased work and consistency checks across sites.

The objective is a finished mural that still feels like the approved creative direction once it exists at full scale.`,
    relatedIntro: "For sector-specific branded mural applications, see:",
    relatedGuides: [
      { title: "Retail Murals in Dubai", href: "https://impactmurals.ae/guides/retail-murals-in-dubai" },
      { title: "Showroom Murals in Dubai", href: "https://impactmurals.ae/guides/showroom-murals-in-dubai" },
      { title: "Mural Advertising in Dubai", href: "https://impactmurals.ae/guides/mural-advertising-in-dubai" },
      { title: "How Murals Can Strengthen Brand Identity in Physical Spaces", href: "https://impactmurals.ae/insights/how-murals-can-strengthen-brand-identity-in-physical-spaces" },
      { title: "Murals & Site-Specific Painting for Automotive Importers & Dealership Groups in the UAE", href: "https://impactmurals.ae/guides/murals-site-specific-painting-for-automotive-importers-dealership-groups-in-the-uae" },
      { title: "Art for Luxury Brands in Dubai", href: "https://impactmurals.ae/guides/art-for-luxury-brands-in-dubai" }
    ],
    closingHeading: "PLANNING A BRANDED MURAL?",
    closingBody:
      "Send the location, wall information, brand references and whatever creative direction already exists."
  },
  {
    offerKey: "art-for-brands",
    slug: "commissioned-brand-artwork",
    title: "COMMISSIONED CAMPAIGN, PRODUCT & PACKAGING ARTWORK",
    shortTitle: "Commissioned Campaign, Product & Packaging Artwork",
    tagline: "Original artwork developed specifically for a campaign, product or packaging brief.",
    intro:
      "Impact Murals works with brands and creative teams to commission artist-led artwork that can begin as a physical original, drawing, painted composition or other artistic source, then be prepared for the applications the project actually needs.",
    body: `## START WITH THE APPLICATION

The artwork needs a clear job.

It may become the main visual for a campaign, sit on packaging, support a product launch, appear on a limited edition, move into retail or extend into a physical mural.

Before commissioning, we define:

- what the artwork needs to communicate;
- the main application;
- the formats it must work across;
- how directly it should connect to the brand;
- the level of artist freedom;
- whether a physical original matters;
- the reproduction and usage requirements.

That gives the artist a useful creative brief and gives the brand a clearer production scope.

## POSSIBLE APPLICATIONS

Commissioned artwork can be developed for:

- campaign master artwork;
- product launches;
- packaging artwork;
- limited-edition packaging;
- product graphics;
- key visuals derived from original artwork;
- retail and event applications;
- printed brand touchpoints;
- artwork used in photography or film;
- physical originals retained by the brand;
- murals or spatial applications derived from the same source.

One commission can stay focused on a single use or become the artistic source for a wider family of outputs.

## PHYSICAL ORIGINALS AND SOURCE ARTWORK

Where material presence is useful, the commission can begin as a real artwork.

Paint, drawing, hand lettering and other physical processes can create marks and texture that become part of the final visual language. The original can then be photographed, scanned or adapted for the required applications.

Some briefs are better developed digitally from the start. The production route follows the application, audience and creative brief.

## PACKAGING ARTWORK

For packaging commissions, Impact Murals focuses on the artistic layer.

We can create or adapt artwork to work with the required surfaces, proportions and dielines, in coordination with the brand, agency or packaging team.

Structural packaging engineering, regulatory copy, printing specifications and manufacturing remain with the relevant packaging specialists unless separately included by the project team.

## DESIGNED TO ADAPT

A bottle, box, billboard, social crop and mural all use artwork differently.

If the same commission needs to move across several formats, we consider hierarchy, crops, detail, repeatable elements and alternate compositions early enough that the artwork remains useful beyond one master image.

## ARTIST SELECTION

Different briefs call for different hands.

The project may need figurative painting, illustration, calligraphy, lettering, abstraction or another artistic direction. Impact Murals brings in the artist according to the brief and coordinates the development between artist, brand and production requirements.

## USAGE AND OWNERSHIP

The physical artwork and the right to reproduce it are separate.

Campaign, packaging, advertising, merchandising and future reuse should be defined clearly so the client and artist both understand the intended scope.`,
    relatedIntro: "For artistic direction, commissioning decisions and adjacent applications, see:",
    relatedGuides: [
      { title: "Artistic Direction for Brands in Dubai", href: "https://impactmurals.ae/guides/artistic-direction-for-brands-in-dubai" },
      { title: "Art for Luxury Brands in Dubai", href: "https://impactmurals.ae/guides/art-for-luxury-brands-in-dubai" },
      { title: "Live Packaging Customisation for Product Launches & Retail Activations", href: "https://impactmurals.ae/guides/live-packaging-customisation-product-launches-retail-activations" },
      { title: "Commercial Art Commission Rights: Questions Brands and Artists Should Clarify", href: "https://impactmurals.ae/insights/commercial-art-commission-rights-questions-brands-and-artists-should-clarify" },
      { title: "Can a Brand Reuse a Mural Design Across Multiple Locations?", href: "https://impactmurals.ae/insights/can-a-brand-reuse-a-mural-design-across-multiple-locations" }
    ],
    closingHeading: "COMMISSIONING ARTWORK FOR A CAMPAIGN OR PRODUCT?",
    closingBody:
      "Send the brand brief, application, references and the formats the artwork needs to work across."
  },

  // ---------------------------------------------------------------- ART FOR PLACES
  {
    offerKey: "art-for-places",
    slug: "commissioned-paintings",
    title: "COMMISSIONED PAINTINGS & CANVASES",
    shortTitle: "Commissioned Paintings & Canvases",
    tagline: "Original paintings and canvases developed around the interior they are made for.",
    intro:
      "For hotels, workplaces, retail interiors, residences and development projects, Impact Murals commissions artwork according to the real space, dimensions, materials and design direction. The result can be one focal piece or a small family of related works.",
    body: `## MADE FOR A SPECIFIC PLACE

A commissioned painting starts with the room as a whole.

We look at:

- architecture and proportions;
- furniture and finishes;
- lighting;
- viewing distance;
- surrounding objects;
- palette and materials;
- project narrative;
- the role the artwork should play.

A lobby may need a visual anchor. A suite may need something quieter. A boardroom may need a piece with presence that still sits comfortably within the interior.

The commission is shaped around that role.

## ONE PIECE OR A SMALL SERIES

Possible formats include:

- one large statement painting;
- diptychs or triptychs;
- a group of related canvases;
- artwork developed for a niche or specific wall;
- pieces coordinated across adjacent rooms;
- a work connected to local or cultural context;
- paintings developed around a hospitality or development narrative.

The format follows the spatial requirement.

## DEVELOPED FROM THE DESIGN DIRECTION

Interior projects often already contain enough information to create a strong art brief.

Plans, elevations, moodboards, FF&E selections, materials, colour references, lighting and brand information can all help define what the artwork should contribute.

A few clear references and an understanding of the space are often enough to begin.

## THE RIGHT ARTIST FOR THE PIECE

Impact Murals is artist-led, with artists selected according to each brief.

We select the artist according to the brief, medium, scale and character of the interior. If the designer or client already has an artist in mind, we can work within that direction and focus on development and production.

## SCALE, MATERIAL AND FINISH

The artwork is also a physical object.

Canvas depth, panel construction, framing, surface finish, transport, access and installation can all affect how the piece should be made. Large works may need to be divided or assembled differently from smaller commissions.

Those decisions are considered during development so the finished piece can be delivered cleanly into the space.

## WORKING WITH DESIGNERS AND PROJECT TEAMS

Impact Murals can work directly with the client or alongside interior designers, architects, art consultants, fit-out teams and project managers.

The wider design team keeps control of the interior. We focus on the artwork and the production needed to make it real.`,
    relatedIntro: "For commissioned artwork in specific interior and operational contexts, see:",
    relatedGuides: [
      { title: "Commissioned Artwork for Hotel Owners & Operators in the UAE", href: "https://impactmurals.ae/guides/commissioned-artwork-for-hotel-owners-operators-in-the-uae" },
      { title: "Commissioned Artwork for Residential Communities & Community Managers in the UAE", href: "https://impactmurals.ae/guides/commissioned-artwork-for-residential-communities-community-managers-in-the-uae" },
      { title: "Commissioned Artwork for Commercial Interior Design Studios in the UAE", href: "https://impactmurals.ae/guides/commissioned-artwork-for-commercial-interior-design-studios-in-the-uae" },
      { title: "Commissioned Artwork for Private Clinics & Patient-Facing Healthcare Spaces in the UAE", href: "https://impactmurals.ae/guides/commissioned-artwork-for-private-clinics-patient-facing-healthcare-spaces-in-the-uae" },
      { title: "Commissioned Artwork for Fitness Chains in the UAE", href: "https://impactmurals.ae/guides/commissioned-artwork-for-fitness-chains-in-the-uae" },
      { title: "Commissioned Artwork for Industrial Sites in the UAE", href: "https://impactmurals.ae/guides/commissioned-artwork-for-industrial-sites-in-the-uae" }
    ],
    closingHeading: "COMMISSIONING ART FOR A SPACE?",
    closingBody:
      "Share the location, approximate dimensions, plans or references and what the artwork should contribute to the room."
  },
  {
    offerKey: "art-for-places",
    slug: "murals",
    title: "MURALS FOR INTERIORS & PLACES",
    shortTitle: "Murals for Interiors & Places",
    tagline: "Murals developed as an integral part of the interior.",
    intro:
      "For hospitality, workplaces, retail, residences and developments, Impact Murals shapes mural artwork around the architecture, established design direction and the way people move through the space.",
    body: `## START WITH THE INTERIOR

The wall already belongs to a wider project.

Materials, furniture, lighting, circulation, signage, colour and architectural proportions all influence how the mural will sit in the finished environment.

We begin with those conditions so the artwork can support the interior as a whole.

## WHERE MURALS CAN WORK

Interior and place-led murals can be developed for:

- hotel lobbies, corridors and guest areas;
- restaurants and hospitality environments;
- offices and headquarters;
- retail spaces and showrooms;
- residences and shared amenities;
- sales galleries;
- entertainment and leisure venues;
- staircases and double-height walls;
- long circulation areas;
- feature walls that need a bespoke artistic response.

Each location has a different relationship with scale, movement and audience.

## FROM DESIGN NARRATIVE TO ARTWORK

A mural can draw from the project and interpret its ideas artistically.

Useful source material can include architecture, interior narrative, palette, textures, location, cultural context, brand identity or an existing visual direction.

The mural may be subtle or highly visible. What matters is that the role of the artwork is deliberate.

## OPEN BRIEF OR EXISTING DIRECTION

Some designers want help defining what should happen on the wall.

Others already have a concept, reference or approved composition and need specialist artistic development and execution.

Impact Murals can work from either point. The level of creative input is set around what the project already has.

## THE REAL WALL SHAPES THE COMPOSITION

Corners, doors, services, furniture, sight lines and viewing distance all affect the work.

A double-height mural may need to read from several floors. A corridor may need a sequence that works in movement. A hospitality wall may need to coexist with signage, screens and lighting.

The composition is adapted to those conditions before execution.

## PRODUCTION WITHIN THE PROJECT PROGRAMME

Murals are often produced while other work is happening around them.

We coordinate artistic production with the relevant fit-out, design or project team, taking account of surface readiness, protection, access windows and installation sequence.

In active fit-outs and operating venues across the UAE, this coordination can be as important as the artwork itself.`,
    relatedIntro: "For murals in specific types of interiors and projects, see:",
    relatedGuides: [
      { title: "Hotel Murals in Dubai", href: "https://impactmurals.ae/guides/hotel-murals-in-dubai" },
      { title: "Office & Corporate Murals in Dubai", href: "https://impactmurals.ae/guides/office-and-corporate-murals-in-dubai" },
      { title: "Retail Murals in Dubai", href: "https://impactmurals.ae/guides/retail-murals-in-dubai" },
      { title: "School & Education Murals in Dubai", href: "https://impactmurals.ae/guides/school-and-education-murals-in-dubai" },
      { title: "Restaurant & Café Murals in Dubai", href: "https://impactmurals.ae/guides/restaurant-and-caf-murals-in-dubai" },
      { title: "Murals for Interior Designers & Architects in Dubai", href: "https://impactmurals.ae/guides/murals-for-interior-designers-and-architects-in-dubai" }
    ],
    closingHeading: "PLANNING A MURAL FOR AN INTERIOR OR DEVELOPMENT?",
    closingBody:
      "Send the wall, location, plans or visual references and whatever direction already exists."
  },
  {
    offerKey: "art-for-places",
    slug: "site-specific-artworks",
    title: "SITE-SPECIFIC ARTWORKS & INSTALLATIONS",
    shortTitle: "Site-Specific Artworks & Installations",
    tagline: "Artworks developed around a particular architectural opportunity.",
    intro:
      "Some architectural opportunities call for a more specific intervention than a standard canvas or mural. Impact Murals can develop the work directly from a niche, void, wall system, circulation route, architectural element or another part of the interior.",
    body: `## LET THE SPACE DEFINE THE OPPORTUNITY

Site-specific work begins with the real location.

We look at:

- dimensions;
- materials;
- light;
- movement;
- key views;
- surrounding finishes;
- available structure;
- access and installation conditions;
- the role of the space.

Those factors help determine the right artistic form.

## POSSIBLE FORMS WITHIN AN INTERIOR

Depending on the project, the intervention may include:

- painted or mixed-media wall features;
- artwork developed across panels;
- dimensional artistic pieces;
- suspended or freestanding elements;
- integrated works for niches or columns;
- art across several connected surfaces;
- pieces developed around circulation or transition areas;
- temporary installations for openings or changing spaces.

The final form is decided after the site and brief are understood.

## ARTISTIC DEVELOPMENT WITH REAL MATERIALS IN MIND

Site-specific work often moves beyond direct painting.

Material, weight, fixing, fabrication, maintenance, access and surrounding finishes can all influence the concept.

Where specialist fabrication, engineering or installation is required, Impact Murals develops the artistic layer in coordination with the competent technical partners. This keeps the idea strong while each discipline retains responsibility for its own scope.

## WORKING INSIDE AN ESTABLISHED DESIGN

The artwork may enter a project that already has a clear architectural or interior direction.

Plans, elevations, moodboards and material samples can become the starting point. We develop an intervention that contributes something distinct while staying connected to the wider design.

If the art opportunity is still undefined, we can also help identify where an intervention would have the most value.

## ONE ARTIST OR SEVERAL SPECIALISTS

Some pieces can be led by one artist from start to finish. Others require several creative and production skills.

Impact Murals can bring together the artists and specialist partners required for the work and keep the artistic direction coherent across development, fabrication and installation.

## FROM CONCEPT TO INSTALLATION

The route can include:

- site and brief review;
- artistic concept development;
- scale and material resolution;
- specialist production coordination;
- installation planning;
- final artistic review.

The process stays proportional to the complexity of the piece.`,
    relatedIntro: "For sector-specific installation briefs and format decisions, see:",
    relatedGuides: [
      { title: "Art Installations & Artistic Environments for Hotel Owners & Operators in the UAE", href: "https://impactmurals.ae/guides/art-installations-artistic-environments-for-hotel-owners-operators-in-the-uae" },
      { title: "Art Installations & Artistic Environments for Commercial Interior Design Studios in the UAE", href: "https://impactmurals.ae/guides/art-installations-artistic-environments-for-commercial-interior-design-studios-in-the-uae" },
      { title: "Art Installations & Artistic Environments for Private Clinics & Patient-Facing Healthcare Spaces in the UAE", href: "https://impactmurals.ae/guides/art-installations-artistic-environments-for-private-clinics-patient-facing-healthcare-spaces-in-the-uae" },
      { title: "Art Installations & Artistic Environments for Residential Communities & Community Managers in the UAE", href: "https://impactmurals.ae/guides/art-installations-artistic-environments-for-residential-communities-community-managers-in-the-uae" },
      { title: "How to Decide Between a Mural, Painting and Art Installation", href: "https://impactmurals.ae/insights/how-to-decide-between-a-mural-painting-and-art-installation" },
      { title: "How to Combine Murals, Canvas Art and Installations in One Interior", href: "https://impactmurals.ae/insights/how-to-combine-murals-canvas-art-and-installations-in-one-interior" }
    ],
    closingHeading: "HAVE A SPACE THAT NEEDS A SITE-SPECIFIC ARTWORK?",
    closingBody:
      "Share the plans, photographs, location and what the area needs from art."
  },
  {
    offerKey: "art-for-places",
    slug: "coordinated-artworks",
    title: "COORDINATED SETS OF ARTWORKS ACROSS A SPACE",
    shortTitle: "Coordinated Sets of Artworks Across a Space",
    tagline: "Plan several artworks as one coherent part of the interior.",
    intro:
      "Hotels, workplaces, residences, retail environments and developments often need art across more than one room or wall. Impact Murals can structure the relationship between the pieces so the project feels connected while each area keeps its own role.",
    body: `## THINK BEYOND THE SINGLE ARTWORK

Different areas need different levels of visual emphasis.

A lobby may need a strong focal piece. Corridors may need rhythm. Guest rooms, meeting spaces or amenities may need smaller work. Treating every location the same can flatten the interior, while completely unrelated pieces can make the project feel fragmented.

A coordinated artwork set gives the space a shared artistic logic.

## WHAT CAN CONNECT THE WORKS

The relationship between pieces can come from:

- a shared palette;
- one narrative interpreted in several ways;
- a common material or technique;
- recurring forms;
- related proportions;
- local or cultural references;
- one artist working across a series;
- several artists working within one broader direction.

The connection can be visible or subtle depending on the project.

## STRUCTURING THE ARTIST MIX

One artist may be right for a focused collection.

A larger hotel, workplace or mixed-use project may benefit from several artists so the programme has enough variation across different spaces.

Impact Murals can recommend the structure, brief the artists and coordinate the work so the overall programme remains coherent.

## DEVELOPED AROUND THE PLAN

Artwork planning becomes more useful when it follows the actual layout.

We can review plans, elevations, room schedules and key viewpoints to identify:

- where art should lead;
- where it should support the interior;
- where a repeated family makes sense;
- where a distinct commission is justified;
- where no artwork is needed.

This gives the programme hierarchy before individual pieces are commissioned.

## DISTRIBUTING SCALE AND BUDGET

Different spaces can carry different levels of investment.

A few major commissions may carry the project, supported by smaller pieces elsewhere. In another interior, a consistent family of medium-scale works may create more value than one dominant piece.

The programme can be structured around the project's priorities and available artwork budget.

## PRODUCTION AND INSTALLATION AS ONE PROGRAMME

Several artworks create coordination requirements.

Dimensions, artist schedules, finishing, framing, transport, access, labelling, room readiness and installation sequence need to stay organised.

Impact Murals can coordinate that artistic production as one programme, giving the client or design team a clearer route from artwork planning to final installation.`,
    relatedIntro: "For artwork programmes, procurement and mixed-format interiors, see:",
    relatedGuides: [
      { title: "Hospitality Artwork Supply for Procurement & FF&E in the UAE", href: "https://impactmurals.ae/guides/hospitality-artwork-supply-for-procurement-and-ff-and-e-in-the-uae" },
      { title: "Hospitality Art in Dubai", href: "https://impactmurals.ae/guides/hospitality-art-in-dubai" },
      { title: "Office Artwork & Workplace Art in Dubai", href: "https://impactmurals.ae/guides/office-artwork-and-workplace-art-in-dubai" },
      { title: "Art for Retail Environments in Dubai", href: "https://impactmurals.ae/guides/art-for-retail-environments-in-dubai" },
      { title: "How to Combine Murals, Canvas Art and Installations in One Interior", href: "https://impactmurals.ae/insights/how-to-combine-murals-canvas-art-and-installations-in-one-interior" }
    ],
    closingHeading: "PLANNING ART ACROSS SEVERAL SPACES?",
    closingBody:
      "Share the plans, room list, design direction and areas already identified for art."
  },
  {
    offerKey: "art-for-places",
    slug: "art-consulting",
    title: "ART CONSULTING",
    shortTitle: "Art Consulting",
    tagline: "Turn an open art requirement into a clear plan for the project.",
    intro:
      "Impact Murals provides art consulting for interiors, hospitality, workplaces and developments where the design team needs specialist input before individual works are commissioned. We help define where art can contribute, what kind of work makes sense and how the artistic direction can move into real production.",
    body: `## DEFINE THE ART LAYER EARLY

The most useful art decisions often happen before individual pieces are selected.

At that stage, the questions are broader:

- Which spaces actually need art?
- Where should the strongest intervention sit?
- Should the work be painted, framed, dimensional or integrated?
- Does the project need one artist or several?
- Should different areas feel connected?
- Which opportunities should be permanent?
- What needs to be considered before finishes and access are locked?

Answering those questions early can make commissioning and budgeting much clearer later.

## WHAT ART CONSULTING CAN COVER

Depending on the project, the scope can include:

- reviewing plans and identifying art opportunities;
- helping define the art brief;
- recommending suitable artwork formats;
- developing an artistic direction around the interior;
- advising on scale and placement;
- structuring a collection or artwork programme;
- identifying where different artists may be appropriate;
- coordinating commissioned artwork development;
- bringing production and installation considerations into early decisions.

The scope can focus on one key area or extend across the whole project.

## COMMISSIONED AND SITE-RELEVANT ART

Impact Murals is strongest when the artwork is developed around the project.

That may mean commissioning new work, integrating murals, developing site-specific pieces or coordinating several artists across a wider programme.

Existing artwork can still be considered where it genuinely fits. The objective is to build the right art layer for the project and choose the sourcing route accordingly.

## WORKING WITH THE DESIGN TEAM

Art consulting should support the architecture and interior direction.

We can work alongside interior designers, architects, developers, hospitality teams, project managers and other art consultants when a specialist artistic resource is useful.

The wider design team keeps ownership of the overall project. Impact Murals focuses on the art, artists and the route from brief to production.

## CONNECTING CREATIVE DECISIONS TO DELIVERY

A recommendation becomes more valuable when production realities are considered early.

Scale, access, wall condition, fabrication, framing, installation, artist availability and programme can all affect what is practical.

Because Impact Murals also works through production, those factors can be introduced while the art plan is still flexible.

## WHEN ART CONSULTING IS USEFUL

It can be particularly valuable:

- during concept or design development;
- before artwork budgets are allocated;
- when a project has many possible art locations;
- when a developer or operator wants a coherent approach across several areas;
- when the design team needs artist or format recommendations;
- when an existing project needs a clearer art plan.

An early project brief is enough to start.`,
    relatedIntro: "For art direction and consulting in specific project contexts, see:",
    relatedGuides: [
      { title: "Murals for Interior Designers & Architects in Dubai", href: "https://impactmurals.ae/guides/murals-for-interior-designers-and-architects-in-dubai" },
      { title: "Art & Murals for Fit-Out Companies in the UAE", href: "https://impactmurals.ae/guides/art-and-murals-for-fit-out-companies-in-the-uae" },
      { title: "Hospitality Art in Dubai", href: "https://impactmurals.ae/guides/hospitality-art-in-dubai" },
      { title: "Art for Real Estate Developers in Dubai", href: "https://impactmurals.ae/guides/art-for-real-estate-developers-in-dubai" },
      { title: "Art Direction & Creative Development for Hotel Owners & Operators in the UAE", href: "https://impactmurals.ae/guides/art-direction-creative-development-for-hotel-owners-operators-in-the-uae" }
    ],
    closingHeading: "NEED HELP DEFINING THE ART FOR A PROJECT?",
    closingBody:
      "Send the plans, project stage and what has already been decided."
  },
  {
    offerKey: "art-for-places",
    slug: "multi-site-art-programmes",
    title: "MULTI-SITE ART PROGRAMMES",
    shortTitle: "Multi-Site Art Programmes",
    tagline: "Create a consistent art programme across several interiors or properties, with room for each location to keep its own identity.",
    intro:
      "For hotel groups, operators, developers, retail networks and workplace portfolios, Impact Murals can build one artistic framework and adapt it across multiple sites.",
    body: `## ONE SYSTEM, DIFFERENT PLACES

A multi-site programme needs enough consistency to feel connected and enough flexibility to respond to each interior.

The framework might use:

- one artistic idea interpreted differently at each site;
- a shared palette or set of principles;
- one artist across several locations;
- different artists selected for different properties;
- a family of commissioned artworks;
- murals adapted to different wall dimensions;
- local references within a wider group identity;
- a repeatable approval and production process.

The system should make rollout clearer while leaving room for the actual spaces.

## WHO MULTI-SITE ART PROGRAMMES CAN WORK FOR

Typical contexts include:

- hotel and hospitality groups;
- office portfolios;
- retail networks;
- branded residences;
- residential communities;
- developers with several assets;
- operators refreshing multiple properties;
- companies with regional workplaces.

The programme can cover a handful of locations or develop in phases over time.

## DEFINE WHAT STAYS CONSISTENT

Before individual artworks are developed, we identify what the programme needs to protect.

That may include:

- overall narrative;
- artistic quality;
- approval standard;
- palette;
- material approach;
- relationship to the brand or operator;
- documentation;
- production method.

Other elements can remain open so each location responds to its own architecture and audience.

## LOCAL ADAPTATION

A long hotel lobby, compact reception and residential amenity space each call for a different response, even within the same group.

Dimensions, interior direction, local context and the role of each property all influence the final response.

The programme works as a flexible system, with enough control to remain recognisable across sites.

## ARTIST AND PRODUCTION COORDINATION

Larger programmes can involve several artists, framers, fabricators, installers and project teams.

Impact Murals can coordinate:

- artist briefing;
- artwork review;
- consistency checks;
- site adaptation;
- production planning;
- installation sequencing;
- communication with project teams;
- final artistic review.

The client gets one clear artistic structure across the full programme.

## PHASED ROLLOUTS

Locations can launch in phases.

A programme can begin with a pilot site and expand across openings, refurbishments or annual investment cycles. Future locations can build on the same core artistic system.`,
    relatedIntro: "For rollout structures across different property and operator types, see:",
    relatedGuides: [
      { title: "Multi-Site Art Rollouts for Hotel Owners & Operators in the UAE", href: "https://impactmurals.ae/guides/multi-site-art-rollouts-for-hotel-owners-operators-in-the-uae" },
      { title: "Art Programmes for Coworking & Flexible Workspaces Dubai", href: "https://impactmurals.ae/guides/art-programmes-coworking-flexible-workspaces-dubai" },
      { title: "How to Structure an Art Programme for Corporate Office Projects in the UAE", href: "https://impactmurals.ae/guides/how-to-structure-an-art-programme-for-corporate-office-projects-in-the-uae" },
      { title: "Multi-Site Rollouts for Commissioned Original Artwork & Series in Shopping Malls", href: "https://impactmurals.ae/guides/multi-site-rollouts-for-commissioned-original-artwork-series-in-shopping-malls-with-funded-art-programming-uae" },
      { title: "How to Structure an Art Programme for Exhibition, Museography & Interpretation-Experience Designers in the UAE", href: "https://impactmurals.ae/guides/how-to-structure-an-art-programme-for-exhibition-museography-and-interpretation-experience-designers-in-the-ua" },
      { title: "How to Plan a Rotating Art Programme as a Development Amenity", href: "https://impactmurals.ae/insights/how-to-plan-a-rotating-art-programme-as-a-development-amenity" }
    ],
    closingHeading: "PLANNING ART ACROSS MULTIPLE LOCATIONS?",
    closingBody:
      "Share the number and type of sites, what needs to feel consistent and how much variation the programme should allow."
  },

  // -------------------------------------------------- PUBLIC ART & LARGE-SCALE MURALS
  {
    offerKey: "public-art",
    slug: "large-scale-murals",
    title: "LARGE-SCALE MURALS",
    shortTitle: "Large-Scale Murals",
    tagline: "Large murals planned around the real wall, access, team and site programme.",
    intro:
      "Impact Murals develops and executes large-scale murals for facades, developments, car parks, boundary walls, infrastructure, destinations and other high-visibility surfaces in Dubai and across the UAE. We can start from an open brief or take approved artwork through scaling, adaptation and specialist production.",
    body: `## LARGE SCALE CHANGES THE PROJECT

A mural spanning several storeys or hundreds of square metres needs a different production approach from a standard interior wall.

The project may need to account for:

- viewing distance;
- architectural interruptions;
- surface condition;
- height and access;
- artist team size;
- material quantities;
- working windows;
- weather exposure;
- active-site operations;
- programme and sequencing;
- coordination with other project teams.

Those conditions are reviewed before execution starts.

## APPROVED ARTWORK OR OPEN BRIEF

Some projects begin with a creative brief and no artwork.

Others arrive with a concept already approved by a client, consultant, agency or design team.

Impact Murals can support both.

Where creative development is required, the artwork is shaped around the site and scale. Where the design already exists, we focus on preparing it for the real wall and building a production method that respects the approved direction.

## DESIGNED TO READ AT THE RIGHT DISTANCE

Large-scale composition behaves differently.

Fine details can disappear from across a road or plaza. Columns, windows and structural breaks can interrupt important areas. Long walls may be experienced while people are moving past them.

The artwork is developed or adapted for the viewpoints that actually matter.

## ACCESS IS PART OF THE PRODUCTION PLAN

Height access affects how artists move, how the wall is divided and how production is sequenced.

Depending on the site, execution may involve mobile lifts, scaffolding or another approved access solution within the wider project structure.

Impact Murals defines the artistic access requirement and coordinates with the relevant contractor or specialist provider so the production plan fits the site.

## SURFACE AND MATERIALS

The substrate affects preparation, paint system, finish and durability.

Exterior work may also need to account for heat, sun, dust, maintenance expectations and intended lifespan. Surface readiness should be established before painting begins.

The production method is matched to the actual wall.

## TEAM, SEQUENCING AND SITE COORDINATION

Large murals may require several artists and phased production.

Impact Murals can coordinate artwork scaling, artist teams, working sequence and the artistic interfaces with project managers, contractors, access providers and site operations.

Working hours, public separation, material storage and daily clean-down can all affect how an active site is managed.

## WHAT TO SEND

Useful starting information includes:

- site location;
- wall dimensions or drawings;
- photographs;
- approximate height;
- surface information if available;
- target programme;
- known access restrictions;
- whether artwork is open or approved.

That is enough to begin a serious production discussion.`,
    relatedIntro: "For specific large-scale surfaces and project environments, see:",
    relatedGuides: [
      { title: "Construction Hoarding Murals in Dubai", href: "https://impactmurals.ae/guides/construction-hoarding-murals-in-dubai" },
      { title: "Warehouse & Industrial Murals UAE", href: "https://impactmurals.ae/guides/warehouse-industrial-murals-uae" },
      { title: "Car Park & Parking Garage Murals Dubai", href: "https://impactmurals.ae/guides/car-park-parking-garage-murals-dubai" },
      { title: "Art & Murals for Farms, Factories and Production-Site Visitor Experiences UAE", href: "https://impactmurals.ae/guides/art-murals-for-farms-factories-and-production-site-visitor-experiences-uae" },
      { title: "Theme Park & Attraction Murals UAE", href: "https://impactmurals.ae/guides/theme-park-attraction-murals-uae" },
      { title: "Artwork for Landscape and Outdoor Public Realm Structures UAE", href: "https://impactmurals.ae/insights/artwork-for-landscape-and-outdoor-public-realm-structures-uae" }
    ],
    closingHeading: "PLANNING A LARGE-SCALE MURAL?",
    closingBody: "Send the site and whatever information is already available."
  },
  {
    offerKey: "public-art",
    slug: "facade-artwork",
    title: "FACADE & ARCHITECTURAL SURFACE ARTWORKS",
    shortTitle: "Facade & Architectural Surface Artworks",
    tagline: "Artwork developed around the building, its elevations and the way the architecture is experienced.",
    intro:
      "Impact Murals creates and produces facade and architectural-surface artwork for developments, parking structures, entrances, underpasses, boundary walls and other large public-facing surfaces. The work can begin as a new concept or from an approved design that needs specialist execution.",
    body: `## THE BUILDING SHAPES THE COMPOSITION

A facade is rarely one uninterrupted rectangle.

Windows, joints, columns, recesses, doors, services, material changes and structural rhythm all influence the artwork.

The composition can be developed around those elements so the architecture and artwork read together at full scale.

## WHERE ARCHITECTURAL SURFACE ART CAN WORK

Potential applications include:

- building facades;
- parking structures;
- podium walls;
- development entrances;
- underpasses;
- long boundary walls;
- service structures;
- public-facing infrastructure;
- architectural panels where the material allows;
- connected elevations across one building or development.

The right format depends on the surface and its main viewpoints.

## VIEWING DISTANCE AND MOVEMENT

Facade artwork may be seen from a road, pedestrian route, another building or several levels of a development.

That changes the hierarchy of the composition.

A long elevation may need rhythm and progression. A tall facade may need stronger large-scale forms. A building seen from several directions may need a composition that works across multiple viewpoints.

These conditions are considered during artwork development or adaptation.

## FROM APPROVED ELEVATION TO PAINTED SURFACE

Where the artwork is already approved, Impact Murals can prepare it for execution.

The production stage can include:

- reviewing the elevation;
- adapting the composition to actual dimensions;
- resolving architectural interruptions;
- preparing scale references;
- planning colour and sequence;
- coordinating the artist team;
- working around approved access and site windows;
- carrying the artwork through on-site execution.

If the artistic direction is still open, the same information can be used earlier to shape the concept.

## WORKING WITH ARCHITECTS AND PROJECT TEAMS

Facade projects sit inside a wider architectural and construction process.

We can work alongside architects, developers, consultants, main contractors, project managers and facade teams to understand the artistic opportunity and the real production boundaries.

Impact Murals remains focused on the artwork and specialist artistic execution. Structural, facade-system and access approvals remain with the competent project specialists responsible for those areas.

## MATERIAL AND DURABILITY

Concrete, painted render, blockwork, metal panels and other surfaces may require different preparation or production methods.

The intended lifespan, exposure and maintenance expectations should be understood before the approach is confirmed.`,
    relatedIntro: "For exterior production, climate and scale considerations, see:",
    relatedGuides: [
      { title: "Exterior Murals in the UAE: Paint, Durability & Climate", href: "https://impactmurals.ae/insights/exterior-murals-in-the-uae-paint-durability-and-climate" },
      { title: "Weather Delays for Exterior Murals in the UAE: Rain, Wind, Dust & Humidity", href: "https://impactmurals.ae/insights/weather-delays-exterior-murals-uae-rain-wind-dust-humidity" },
      { title: "Artwork for Landscape and Outdoor Public Realm Structures UAE", href: "https://impactmurals.ae/insights/artwork-for-landscape-and-outdoor-public-realm-structures-uae" }
    ],
    closingHeading: "PLANNING ARTWORK FOR A FACADE?",
    closingBody: "Share the elevation, site photographs, dimensions and whatever concept already exists."
  },
  {
    offerKey: "public-art",
    slug: "site-specific-artworks",
    title: "SITE-SPECIFIC PUBLIC ARTWORKS & INSTALLATIONS",
    shortTitle: "Site-Specific Public Artworks & Installations",
    tagline: "Public art developed from the place, audience and physical conditions of the site.",
    intro:
      "For developments, destinations and public spaces, Impact Murals can shape an artistic intervention around architecture, landscape, movement, local context and the role the work needs to play in the wider project.",
    body: `## START WITH THE PLACE

A site-specific public artwork needs a clear relationship with its location.

We review:

- architecture;
- landscape;
- circulation;
- entrances and routes;
- viewing distance;
- surrounding materials;
- day and night visibility;
- audience;
- local or cultural context;
- intended lifespan;
- maintenance;
- access and installation.

Those conditions help define the artistic opportunity before the format is fixed.

## POSSIBLE PUBLIC ART FORMS

Depending on the brief, a public artwork may include:

- integrated painted interventions;
- freestanding artistic features;
- sculptural or dimensional pieces;
- artwork across several surfaces;
- landmark elements at entrances or gathering points;
- temporary installations;
- work connected to landscape or pedestrian movement;
- mixed-media pieces developed with specialist fabricators;
- a family of related interventions across one public area.

The final form comes from the site and project role.

## PART OF A WIDER PUBLIC-SPACE PROJECT

Public spaces are usually developed by several disciplines.

Architecture, landscape, lighting, wayfinding, engineering and operations may already be established when the artwork begins.

Impact Murals can work as the specialist artistic partner within that structure, focusing on concept, artists, artwork development and artistic production while coordinating with the relevant technical teams around fabrication, fixing, access and installation.

## CULTURAL AND LOCAL CONTEXT

Public-facing work is experienced by a broad audience.

Where local history, language, landscape, community stories or cultural references are relevant, they can inform the artwork in a way that feels specific to the place.

The response may be abstract, narrative or somewhere between the two. The brief and context determine how directly those references appear.

## TEMPORARY OR PERMANENT

The intended lifespan changes both the creative and production route.

Temporary work can support an opening, festival, development phase or seasonal programme. Permanent work requires greater attention to materials, maintenance, exposure, fixing and long-term relevance.

That distinction should be clear early.

## FABRICATION AND SPECIALIST PARTNERS

Some concepts require capabilities beyond direct painting.

Where fabrication, structural support, lighting, engineering or specialist installation is involved, Impact Murals can develop the artistic concept in coordination with qualified partners.

The technical specialists retain responsibility for their professional scope while we protect the artistic direction through production.`,
    relatedIntro: "For public-space, development and destination applications, see:",
    relatedGuides: [
      { title: "Murals & Site-Specific Painting for Seasonal Destinations & Themed Attractions in the UAE", href: "https://impactmurals.ae/guides/murals-site-specific-painting-for-seasonal-destinations-themed-attractions-in-the-uae" },
      { title: "Art Installations & Artistic Environments for Seasonal Destinations & Themed Attractions in the UAE", href: "https://impactmurals.ae/guides/art-installations-artistic-environments-for-seasonal-destinations-themed-attractions-in-the-uae" },
      { title: "Art Installations & Artistic Environments for Property Developers: Permanent Common-Area Art in the UAE", href: "https://impactmurals.ae/guides/art-installations-artistic-environments-for-property-developers-permanent-common-area-art-in-the-uae" },
      { title: "Artwork for Landscape and Outdoor Public Realm Structures UAE", href: "https://impactmurals.ae/insights/artwork-for-landscape-and-outdoor-public-realm-structures-uae" },
      { title: "Art for Real Estate Developers in Dubai", href: "https://impactmurals.ae/guides/art-for-real-estate-developers-in-dubai" }
    ],
    closingHeading: "HAVE A PUBLIC SITE THAT NEEDS AN ARTISTIC INTERVENTION?",
    closingBody: "Share the location, plans, photographs, audience and project stage."
  },
  {
    offerKey: "public-art",
    slug: "ground-pavement-art",
    title: "GROUND & PAVEMENT ARTWORKS",
    shortTitle: "Ground & Pavement Artworks",
    tagline: "Art developed for horizontal surfaces, circulation and real public use.",
    intro:
      "Ground and pavement artwork can create a focal point, route or visual layer across plazas, developments, events and pedestrian environments. Impact Murals plans the artistic response around the surface, viewing angle, movement, intended lifespan and operating conditions of the site.",
    body: `## HORIZONTAL ARTWORK IS EXPERIENCED DIFFERENTLY

People move through ground artwork.

The piece may be seen while walking, from an upper level, in photographs or from several directions at once. Parts of the work may also be obscured by people, furniture, vehicles or event activity.

That changes the composition.

The artwork needs to work with movement, perspective and the way the space is actually used.

## WHERE GROUND ART CAN WORK

Potential applications include:

- public plazas;
- pedestrian routes;
- courtyards;
- development entrances;
- community spaces;
- leisure destinations;
- event zones;
- temporary activation areas;
- selected parking or circulation areas where the technical conditions allow;
- routes connecting several artistic interventions.

The surface and intended use are reviewed before the format is confirmed.

## ARTWORK DEVELOPED AROUND MOVEMENT

Ground artwork can operate in several ways.

One project may use a single large composition. Another may use repeated elements that create a route. A plaza viewed from above may support one clear overhead image, while a pedestrian path may need a sequence that makes sense at human scale.

The main viewpoints and movement pattern become part of the brief.

## SURFACE, USE AND DURABILITY

Horizontal surfaces receive direct wear.

Footfall, vehicle movement, cleaning, exposure, existing coatings, texture, drainage and intended lifespan can all affect whether a painted intervention is suitable and which production route should be considered.

Where slip resistance, traffic performance, structural or regulatory requirements apply, those need to be handled with the competent project specialists and approved product systems for the site.

Impact Murals focuses on the artistic requirement and coordinates the production around the approved technical solution.

## TEMPORARY OR LONGER-LIFE WORK

An event artwork and a long-term public-space intervention have different requirements.

Temporary work may be designed around a campaign, festival, opening or seasonal programme, with removal or short lifespan considered from the beginning.

Longer-life work needs greater attention to surface compatibility, wear, maintenance and how the area will continue to operate after installation.

## COORDINATING WITH THE SITE

Ground artwork can affect active circulation.

Production may need phased access, temporary closure of sections, protection while materials cure or coordination around operating hours.

For larger areas, sequencing also helps keep the composition consistent across the full surface.`,
    relatedIntro: "For specific ground surfaces, exterior exposure and related applications, see:",
    relatedGuides: [
      { title: "Car Park & Parking Garage Murals Dubai", href: "https://impactmurals.ae/guides/car-park-parking-garage-murals-dubai" },
      { title: "Basketball Court Murals Dubai", href: "https://impactmurals.ae/guides/basketball-court-murals-dubai" },
      { title: "Outdoor Courtyard Murals: Planning for Exposure and Use", href: "https://impactmurals.ae/insights/outdoor-courtyard-murals-planning-for-exposure-and-use" },
      { title: "Exterior Murals in the UAE: Paint, Durability & Climate", href: "https://impactmurals.ae/insights/exterior-murals-in-the-uae-paint-durability-and-climate" }
    ],
    closingHeading: "PLANNING ARTWORK FOR A GROUND OR PAVEMENT SURFACE?",
    closingBody: "Send the location, photographs, approximate area, surface information and how the space is used."
  },
  {
    offerKey: "public-art",
    slug: "community-art",
    title: "PARTICIPATORY MURALS & COMMUNITY ARTWORKS",
    shortTitle: "Participatory Murals & Community Artworks",
    tagline: "Artist-led public and community projects that give people a real role in the making of the work.",
    intro:
      "For schools, developments, public programmes and community settings, Impact Murals can create a participation structure that is accessible, organised and capable of producing a finished artwork that works long after the activity is over.",
    body: `## PARTICIPATION SHOULD SERVE THE PROJECT

Community involvement can add meaning when people have a genuine reason to take part.

A project may:

- involve students in their environment;
- invite residents into a development programme;
- connect a public artwork to a local story;
- support a cultural or seasonal initiative;
- give a community event a visible final outcome.

The level of participation should follow the purpose of the project.

## A CLEAR ARTISTIC FRAMEWORK

The artist creates the overall structure before public participation begins.

That can include:

- composition;
- palette;
- prepared areas;
- contribution method;
- sequence;
- material choices;
- artist finishing.

Participants can then contribute confidently while the artist remains responsible for the final artistic result.

## HOW PEOPLE CAN TAKE PART

Depending on the project, participants might:

- paint prepared sections;
- add individual marks or shapes;
- contribute words or ideas that inform the artwork;
- create smaller pieces that become part of one larger work;
- join guided painting sessions;
- participate by class, group or community segment;
- contribute during an event before the artist completes the piece.

The mechanic is chosen around the audience and available time.

## SCHOOL AND EDUCATION PROJECTS

Schools are a strong fit for participatory murals when the structure is age-appropriate and manageable.

Students can take part in selected areas while the artist develops the main composition and completes the final finish.

Participation can be organised by class, year group or scheduled session. The theme may connect to the school, learning, community, local context or another approved brief.

Schools can also commission a standard mural when the brief is focused solely on the finished artwork.

## COMMUNITY AND DEVELOPMENT PROGRAMMES

Developers, municipalities, cultural organisations and community teams may use participation to strengthen the relationship between people and place.

The artwork can respond to a neighbourhood, shared theme, local reference or wider public programme. Participation may happen through workshops, community days or controlled painting sessions.

## DESIGNED AROUND REAL NUMBERS

Twenty participants and several hundred participants need different systems.

We consider:

- participant numbers and age;
- session length;
- supervision;
- access;
- material handling;
- protection;
- drying time;
- weather where relevant;
- accessibility;
- artist finishing.

Those decisions are made before the activity opens to the public.

## THE FINAL ARTWORK

After the participatory stage, the artist can refine the composition, complete detail and resolve the final finish.

That is especially important when the mural will remain permanently in a school, development or public space.`,
    relatedIntro: "For public participation, family audiences and municipal programmes, see:",
    relatedGuides: [
      { title: "Family & Kids Collaborative Art Activations for Public Events", href: "https://impactmurals.ae/insights/family-kids-collaborative-art-activations-public-events" },
      { title: "Guest-Painted Murals: How Participatory Event Artwork Works", href: "https://impactmurals.ae/insights/guest-painted-murals-how-participatory-event-artwork-works" },
      { title: "Festival Art Walls: Designing for Continuous Drop-In Participation", href: "https://impactmurals.ae/insights/festival-art-walls-continuous-drop-in-participation" },
      { title: "Art Direction & Creative Development for Residential Communities & Community Managers in the UAE", href: "https://impactmurals.ae/guides/art-direction-creative-development-for-residential-communities-community-managers-in-the-uae" },
      { title: "How to Specify Participatory Art & Creative Workshops for Municipalities & Cultural Authorities Projects in the UAE", href: "https://impactmurals.ae/guides/how-to-specify-participatory-art-creative-workshops-for-municipalities-cultural-authorities-projects-in-the-ua" }
    ],
    closingHeading: "PLANNING A SCHOOL OR COMMUNITY ART PROJECT?",
    closingBody: "Share the site, participant group, approximate numbers and the outcome the programme should create."
  },
  {
    offerKey: "public-art",
    slug: "multi-site-public-art",
    title: "MULTI-SITE PUBLIC ART PROGRAMMES",
    shortTitle: "Multi-Site Public Art Programmes",
    tagline: "Plan public art across several walls, zones, buildings or locations as one connected programme.",
    intro:
      "For developments, destinations, municipalities and operators, Impact Murals can structure the artistic direction and production across multiple sites while allowing each location to respond to its own architecture, audience and context.",
    body: `## FROM ONE COMMISSION TO A CONNECTED PROGRAMME

A large development may contain very different opportunities for art.

One site may need a landmark mural. Another may suit a ground intervention. A pedestrian route may benefit from smaller connected works. A community area may call for participation. A facade may require a different artist and production method.

Planning those interventions together creates a stronger programme than commissioning each one in isolation.

## WHAT CONNECTS THE PROGRAMME

Consistency can come from:

- one place narrative;
- a shared artistic direction;
- recurring themes;
- a common palette or material logic;
- coordinated artist selection;
- a family of related forms;
- local stories interpreted site by site;
- a consistent approval framework;
- a shared production standard.

The programme should feel connected while giving each location its own identity.

## STRUCTURING THE ARTIST ROSTER

Some programmes are best led by one artist across several surfaces.

Others benefit from several artists under one broader direction.

Impact Murals can help define that structure, brief the artists, coordinate artwork development and keep the separate commissions aligned.

Where a public-art consultant, curator or existing strategy is already in place, we can work inside that framework and focus on commissioned artistic production.

## PLANNED AROUND REAL SITES

Every location has different constraints.

Scale, surface, access, visibility, public movement, operations, programme and durability can all change from one site to another.

We review what should remain fixed across the programme and what needs to adapt locally.

## PRODUCTION ACROSS MULTIPLE LOCATIONS

Once several sites are involved, coordination becomes a major part of the work.

A programme may require:

- site information gathering;
- artwork schedules;
- artist briefing;
- approval tracking;
- surface and access review;
- materials planning;
- production sequencing;
- multiple artist teams;
- coordination with different site managers;
- phased handovers;
- artistic quality control.

Impact Murals can coordinate the artistic production so the programme remains coherent from the first site to the last.

## PHASED DELIVERY

Public art programmes often develop over time.

A developer may release zones in stages. A municipality may work across an annual calendar. A destination may begin with key interventions and expand as new areas open.

The programme can be structured so later commissions join the same system and remain coherent with earlier work.

## WORKING WITH CONSULTANTS, CONTRACTORS AND PUBLIC TEAMS

Large programmes sit inside wider project structures.

Impact Murals can work alongside public-art consultants, architects, landscape teams, developers, project managers, contractors, access providers and operators.

Our focus remains the artistic layer, artist coordination and specialist production. Technical responsibilities stay with the competent teams responsible for those areas.`,
    relatedIntro: "For programme structures across public, institutional and destination contexts, see:",
    relatedGuides: [
      { title: "How to Structure an Art Programme for Free Zones & Business Districts with Cultural Programmes in the UAE", href: "https://impactmurals.ae/guides/how-to-structure-an-art-programme-for-free-zones-and-business-districts-with-cultural-programmes-in-the-uae" },
      { title: "How to Structure an Art Programme for Water & Energy Operators Commissioning Art on Public Assets in the UAE", href: "https://impactmurals.ae/guides/how-to-structure-an-art-programme-for-water-and-energy-operators-commissioning-art-on-public-assets-in-the-uae" },
      { title: "How to Structure an Art Programme for Aquariums & Animal Parks Using Art in Visitor Experiences in the UAE", href: "https://impactmurals.ae/guides/how-to-structure-an-art-programme-for-aquariums-and-animal-parks-using-art-in-visitor-experiences-in-the-uae" },
      { title: "How to Structure an Art Programme for Cultural Institutes & Diplomatic Representations with Paid Programmes in the UAE", href: "https://impactmurals.ae/guides/how-to-structure-an-art-programme-for-cultural-institutes-and-diplomatic-representations-with-paid-programmes" },
      { title: "How to Structure an Art Programme for Science Centres Using Artistic Interpretation or Illustrated Journeys in the UAE", href: "https://impactmurals.ae/guides/how-to-structure-an-art-programme-for-science-centres-using-artistic-interpretation-or-illustrated-journeys-in" },
      { title: "Multi-Site Rollouts for Specialist Artistic Production & Finishing in Airports Programming Art Through the Passenger Journey UAE", href: "https://impactmurals.ae/guides/multi-site-rollouts-for-specialist-artistic-production-finishing-in-airports-programming-art-through-the-passe" }
    ],
    closingHeading: "PLANNING PUBLIC ART ACROSS MULTIPLE SITES OR ZONES?",
    closingBody: "Share the locations, project stage, existing strategy and what needs to connect the programme."
  }
];

export function capabilitiesForOffer(offerKey: OfferKey): Capability[] {
  return capabilities.filter((c) => c.offerKey === offerKey);
}

export function getCapability(offerKey: string, slug: string): Capability | undefined {
  return capabilities.find((c) => c.offerKey === offerKey && c.slug === slug);
}
