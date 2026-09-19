/**
 * The three commercial entry points for the studio.
 *
 * These are entry points, not fixed packages or price tiers. Live painting,
 * workshops, artist curation and production are cross-cutting capabilities:
 * they appear as formats inside a pillar, never as competing top-level offers.
 *
 * WORKING COPY. Every string below is provisional wording written to make the
 * structure testable. It contains no client names, no measured outcomes, no
 * prices, no lead times and no contractual commitments. Scope lines are
 * written as "possible", because nothing here is an automatic entitlement.
 */

export type OfferKey = "art-for-brands" | "art-for-places" | "public-art";

export interface Offer {
  key: OfferKey;
  /** Route segment under /what-we-do/ */
  slug: string;
  title: string;
  /** Short label for navigation, metadata rows and the enquiry form. */
  shortTitle: string;
  /** One line. Used on the homepage strip and as the page lead. */
  summary: string;
  /** The situation the client is actually in. */
  situation: string;
  /** The need being addressed. */
  need: string;
  /** Who this is typically for. */
  audience: string[];
  /** What the studio can take on. Possible scope, not automatic entitlement. */
  scope: string[];
  /** Concrete things a client can end up with. */
  deliverables: string[];
  /** Formats this pillar commonly takes. */
  formats: string[];
  /** The first concrete step of working together. */
  firstStep: string;
  image: {
    src: string;
    alt: string;
    /**
     * Master looping MP4 for this pillar. Reused as-is everywhere this offer
     * appears with video: its own offer-page hero (4:5 on every breakpoint),
     * the matching homepage teaser (OfferChapters), StudioMoment where
     * relevant, and every Airtable-driven guide/insight tagged with this
     * `offer` (via EditorialCommercialIntro, which looks this field up by
     * `getOfferByKey` — one asset per pillar, never duplicated per page).
     * Empty means "no video yet": the placeholder renders exactly as before.
     */
    video?: string;
    /**
     * Shown while the video loads and to a prefers-reduced-motion visitor
     * instead of the loop. Extracted directly from each master clip (no
     * re-encode) so every fracture shard has real, matching pixels to paint
     * before its own <video> becomes decode-ready — this is what keeps the
     * shards visually consistent with each other during first load.
     */
    poster?: string;
  };
}

export const offersIntro = {
  eyebrow: "WHAT WE DO",
  heading: "THREE WAYS TO WORK WITH THE STUDIO.",
  body: "Art direction and the selection of the right artist run through all three, together with the production that makes the result real. What changes is the situation you are starting from."
};

/**
 * Present in all three offers, stated once here and surfaced on every offer
 * page. Deciding what the art should be, and choosing who is right to make it,
 * is the studio's core contribution regardless of which entry point applies.
 */
export const alwaysIncluded = {
  heading: "IN ALL THREE",
  items: [
    {
      title: "ART DIRECTION",
      body: "Deciding what the artwork should be for this brief, this audience and this surface, before anything is drawn or painted."
    },
    {
      title: "SELECTING THE RIGHT ARTIST",
      body: "Matching the artistic language to the project and bringing in the artist who fits it, rather than applying one signature style to everything."
    },
    {
      title: "PRODUCTION AND COORDINATION",
      body: "Turning the agreed artwork into a finished result on site, and coordinating everyone involved in getting it there."
    }
  ]
};

export const offers: Offer[] = [
  {
    key: "art-for-brands",
    slug: "art-for-brands",
    title: "ART FOR BRANDS",
    shortTitle: "Art for Brands",
    summary:
      "Art shaped around a brand and its audience, from campaigns and launches to live experiences, products and collaborations.",
    situation:
      "A campaign may need a single artwork; a launch may call for something experienced in person. We start with what the brand needs to express, then choose the artistic response that fits.",
    need:
      "An artistic idea that belongs to the brand rather than decorating it, the right artist to author it, and someone able to carry it through to a physical result and the content it generates.",
    audience: [
      "Brand, marketing and communication teams",
      "Creative, experiential and PR agencies",
      "Product and packaging teams",
      "Retail and hospitality operators",
      "Event and launch producers"
    ],
    scope: [
      "Art direction tied to an existing brand platform",
      "Selecting and commissioning the artist whose language fits the brand",
      "Artwork for launches, campaigns and communication",
      "Artwork applied to packaging, products and limited editions",
      "Live painting and art moments at events",
      "Developing the artwork for the specific space or moment",
      "Producing and installing the finished work",
      "Photo and video content built around the artwork and its making"
    ],
    deliverables: [
      "An artistic direction documented well enough to approve",
      "Artist selection with agreed authorship and terms",
      "Artwork produced on site, on panel, or applied to a product",
      "Photo and video content of the work and the process",
      "Documentation of the finished work"
    ],
    formats: [
      "Brand activations, launches and event artwork",
      "Live painting and live art performances",
      "Participatory murals and collaborative artworks",
      "Creative workshops and artist-led sessions",
      "Product, object and merchandise customisation",
      "Artist collaborations and limited editions",
      "Murals and branded environments",
      "Commissioned campaign, product and packaging artwork"
    ],
    firstStep:
      "Send the brand context and what the moment is: a launch, an event, a campaign or a product. The studio comes back with the artistic direction it would recommend, who could author it, and what producing it would involve.",
    image: {
      src: "/assets/projects/portrait-detail.svg",
      alt: "Placeholder for a brand environment artwork detail",
      video: "/videos/impact-murals-art-for-brands.mp4",
      poster: "/videos/impact-murals-art-for-brands-poster.jpg"
    }
  },
  {
    key: "art-for-places",
    slug: "art-for-places",
    title: "ART FOR PLACES",
    shortTitle: "Art for Places",
    summary:
      "Art conceived as part of a place, across interiors, hospitality, retail, workplaces and developments.",
    situation:
      "The architecture, materials, proportions and way people use a place shape the work. We consider them from the beginning, so the art belongs to the wider project.",
    need:
      "Artworks made for this project rather than selected from a catalogue, developed within the designer's language, and coordinated on site alongside everyone else already working there.",
    audience: [
      "Architects and interior designers",
      "Hotel and hospitality operators",
      "Developers and property owners",
      "Workplace and community clients",
      "Direct commissioners"
    ],
    scope: [
      "Reading the design intent and proposing the role art should play within it",
      "Art direction developed to sit inside the project's identity, not beside it",
      "Selecting artists whose language suits the scheme and the setting",
      "Creating bespoke works for the specific space, materials and palette",
      "Adapting artwork to real surfaces, lighting and sightlines",
      "Coordinating artists alongside fit-out and other trades"
    ],
    deliverables: [
      "An art direction that holds to the project's design intent",
      "Proposed artists, with agreed authorship and terms",
      "Bespoke works created for this place, painted or produced",
      "A coordinated set of works rather than unrelated pieces",
      "Handover documentation for the operator"
    ],
    formats: [
      "Commissioned paintings and canvases",
      "Murals",
      "Site-specific artworks and installations",
      "Coordinated sets of artworks across a space",
      "Art consulting",
      "Multi-site art programmes"
    ],
    firstStep:
      "Share the drawings, mood boards or photographs and the design intent behind them. The studio comes back with an approach that works within it and the artists it would put forward.",
    image: {
      src: "/assets/projects/architectural-landscape.svg",
      alt: "Placeholder for artwork integrated into an architectural interior",
      video: "/videos/impact-murals-art-for-places.mp4",
      poster: "/videos/impact-murals-art-for-places-poster.jpg"
    }
  },
  {
    key: "public-art",
    slug: "public-art",
    title: "PUBLIC ART & LARGE-SCALE MURALS",
    shortTitle: "Public Art & Large-Scale Murals",
    summary:
      "Art for facades and public sites, developed around the setting, scale and production conditions.",
    situation:
      "At this scale, artistic and production decisions belong together. Surface, access, materials, working hours and site restrictions can all shape the work, so we address them early.",
    need:
      "An artistic proposal suited to the surface, the right artist to paint it, and the production capability and coordination to get it done to a standard that lasts.",
    audience: [
      "Developers and master developers",
      "Municipalities and public-realm stakeholders",
      "Destination and placemaking teams",
      "Facility and asset managers",
      "Agencies commissioning on behalf of clients",
      "Direct commissioners of a single wall"
    ],
    scope: [
      "Art direction and the artistic proposal for the surface",
      "Selecting the artist whose language suits the commission",
      "Surface preparation and coating systems, interior or exterior",
      "Access, permissions and the sequence of work where the scale calls for it",
      "Mural production and painting on site",
      "Coordinating artists, suppliers and site teams through to completion"
    ],
    deliverables: [
      "An artistic proposal matched to the actual surface",
      "Artist selection with agreed authorship and terms",
      "A production method covering preparation, materials and access",
      "The completed mural or commission, painted on site",
      "Documentation of the finished work"
    ],
    formats: [
      "Large-scale murals",
      "Facade and architectural surface artworks",
      "Site-specific artworks and installations",
      "Ground and pavement artworks",
      "Participatory murals and community artworks",
      "Multi-site public art programmes"
    ],
    firstStep:
      "Send photographs of the wall or the site and any constraints you already know about. The studio comes back on feasibility, who could paint it, and what a proposal would cover. Size is not a qualifying condition.",
    image: {
      src: "/assets/projects/environment-panorama.svg",
      alt: "Placeholder for a large-scale exterior mural in its environment",
      video: "/videos/impact-murals-public-art-large-scale-murals.mp4",
      poster: "/videos/impact-murals-public-art-large-scale-murals-poster.jpg"
    }
  }
];

/** Stable option used when a visitor has not decided which pillar applies. */
export const NOT_SURE_KEY = "not-sure" as const;
export type OfferOrUndecided = OfferKey | typeof NOT_SURE_KEY;

export function getOfferBySlug(slug: string) {
  return offers.find((offer) => offer.slug === slug);
}

export function getOfferByKey(key: string) {
  return offers.find((offer) => offer.key === key);
}

/**
 * Legacy route segments kept working. The five earlier context pages collapse
 * into three pillars, so each old URL maps to the pillar that now covers it.
 */
export const legacyOfferRedirects: Record<string, OfferKey> = {
  "brand-retail-environments": "art-for-brands",
  "art-activations": "art-for-brands",
  "hospitality-property-destinations": "art-for-places",
  "workshops-community": "art-for-places"
};
