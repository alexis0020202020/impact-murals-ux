/**
 * /hotel-artwork-dubai/: page copy.
 *
 * Final English copy from docs/money-pages/04-hotel-artwork-dubai.md. The
 * repository holds no hospitality interior, so the page claims no hotel
 * delivery of any kind: its drawings (the route section, the plan, the two
 * programme tracks) are labelled illustrative and its one real image is a
 * detail of a hand-painted mural, captioned as exactly that. The credited
 * "selected applications" module is deliberately absent until an operator or
 * designer agrees to a credit. No price, quantity or guarantee is stated.
 * Presentation lives in src/components/money/pages/HotelArtwork.astro.
 */
import type { Closing, Faq, GuideRef, PageCta, Step } from "./types";

export interface Stop {
  n: string;
  name: string;
  text: string;
}

export interface Rung {
  name: string;
  glyph: "mural" | "canvas" | "series" | "collaboration" | "dimensional";
  text: string;
  href: string;
  linkLabel: string;
}

export interface Role {
  name: string;
  text: string;
}

export interface Milestone {
  label: string;
  /** The date or event the whole track is planned back from. */
  key?: boolean;
}

export interface TrackPlan {
  name: string;
  milestones: Milestone[];
  text: string;
}

export const ht = {
  hero: {
    statement: "ORIGINAL ART FOR EVERY STOP ON THE GUEST'S ROUTE.",
    support:
      "Commissioned artwork, murals and site-specific pieces for hotels in Dubai and the UAE. Artist-led direction and production, coordinated with your designer, consultant and contractor. One lobby commission or a defined package.",
    event: {
      lead: "Planning a hotel opening event?",
      first: { label: "See Live Painting", href: "/live-painting-dubai/" },
      joiner: "and",
      second: { label: "Live Customisation", href: "/live-customisation-dubai/" }
    },
    routeLabel: "ILLUSTRATIVE SECTION / THE GUEST'S ROUTE, NOT A REAL HOTEL."
  },

  /** 02. Along the route. The numerals match the marks on the section drawing. */
  route: {
    eyebrow: "WHERE ART GOES",
    headline: "ALONG THE ROUTE.",
    stops: [
      {
        n: "1",
        name: "ARRIVAL AND LOBBY",
        text: "The first picture of the hotel. One anchor work, or two in conversation."
      },
      {
        n: "2",
        name: "RESTAURANTS AND BARS",
        text: "Art that works in low light, and for a different crowd after dark."
      },
      {
        n: "3",
        name: "CORRIDORS AND LIFT LOBBIES",
        text: "A rhythm of works that guides a guest without signage."
      },
      {
        n: "4",
        name: "SUITES AND GUEST ROOMS",
        text: "Quieter and more personal, with variation across room types."
      },
      {
        n: "5",
        name: "SPA AND WELLNESS",
        text: "Calm palettes and materials chosen for humidity and cleaning."
      },
      {
        n: "6",
        name: "POOL, TERRACES AND FEATURE AREAS",
        text: "Work chosen for sun, wind and exposure."
      }
    ] as Stop[],
    closing: "Commission one area now and add others later. The direction can be set for all of them."
  },

  /** 03. Formats, from one wall to a whole floor. The destination page owns the detail. */
  formats: {
    eyebrow: "FORMATS",
    headline: "FROM A SINGLE WALL TO A WHOLE FLOOR.",
    rungs: [
      {
        name: "MURALS",
        glyph: "mural",
        text: "Painted on site for lobbies, restaurants and feature walls.",
        href: "/mural-artist-dubai/",
        linkLabel: "See Mural Artist"
      },
      {
        name: "LARGE CANVASES AND ORIGINALS",
        glyph: "canvas",
        text: "Painted off site and delivered finished.",
        href: "/custom-canvas-art-dubai/",
        linkLabel: "See Custom Canvas"
      },
      {
        name: "COORDINATED SERIES",
        glyph: "series",
        text: "One narrative across rooms, corridors or floors.",
        href: "/what-we-do/art-for-places/coordinated-artworks/",
        linkLabel: "See Coordinated Artworks"
      },
      {
        name: "NAMED-ARTIST COLLABORATIONS",
        glyph: "collaboration",
        text: "Where the artist, the rights and the brief allow.",
        href: "/what-we-do/art-for-brands/artist-collaborations/",
        linkLabel: "See Artist Collaborations"
      },
      {
        name: "SPATIAL COMMISSIONS",
        glyph: "dimensional",
        text: "Dimensional or suspended work for atria and voids.",
        href: "/art-installations-dubai/",
        linkLabel: "See Art Installations"
      }
    ] as Rung[],
    note: "Everything here is original work. Where a hotel needs many similar pieces, such as one per room type, we propose hand-painted variations of one direction. We will say if editions or reproductions from another supplier would suit the brief better."
  },

  /** 04. Developed with the interior. */
  interior: {
    eyebrow: "THE INTERIOR",
    headline: "DEVELOPED WITH THE INTERIOR.",
    lead: "We start from the designer's narrative: palette, materials, lighting, proportions and how a guest moves through the building. Plans, elevations, moodboards and FF&E schedules are enough to begin.",
    body: "The art adds a layer of authorship to the scheme and leaves the interior in the designer's hands.",
    caption: "ILLUSTRATIVE PLAN / NOT A REAL HOTEL."
  },

  /** 05. What we take on, and where we stop. Type only: the page's trust module. */
  scope: {
    eyebrow: "RESPONSIBILITY",
    headline: "WHAT WE TAKE ON, AND WHERE WE STOP.",
    roles: [
      { name: "OPERATOR OR OWNER", text: "The brief, the approvals and the opening date." },
      { name: "INTERIOR DESIGNER OR ARCHITECT", text: "The design narrative and the scheme." },
      { name: "ART OR FF&E CONSULTANT, IF APPOINTED", text: "The wider collection and its procurement." },
      { name: "CONTRACTOR", text: "Walls, ceilings, access and fixed installation, as scoped." },
      {
        name: "IMPACT MURALS",
        text: "Art direction or adaptation, artist selection, production and delivery of the commissioned art."
      }
    ] as Role[],
    statement:
      "We are not your FF&E consultant, and we do not procure a whole property's art. We make the commissioned pieces and work comfortably beside whoever holds the rest.",
    includesLabel: "WHAT A COMMISSION CAN INCLUDE, EACH AS SCOPED",
    includes: [
      "ARTIST AND DIRECTION",
      "SAMPLES",
      "PRODUCTION",
      "PACKING AND DELIVERY",
      "INSTALLATION COORDINATION",
      "HANDOVER AND CARE NOTES"
    ]
  },

  /** 06. A new opening, or a hotel that is already open. */
  tracks: {
    eyebrow: "PROGRAMME",
    headline: "A NEW OPENING, OR A HOTEL THAT IS ALREADY OPEN.",
    caption: "ILLUSTRATIVE TRACKS / EXAMPLES ONLY.",
    items: [
      {
        name: "NEW OPENING",
        milestones: [
          { label: "APPROVALS" },
          { label: "SAMPLES" },
          { label: "PRODUCTION" },
          { label: "SITE READY" },
          { label: "OPENING", key: true }
        ],
        text: "Art is timed to the handover. Approvals, samples and production are scheduled backwards from the opening date, and the work arrives when the site is ready for it. Where a model room or sample review is part of the programme, we build it in."
      },
      {
        name: "OPERATING HOTEL",
        milestones: [
          { label: "WINDOWS AGREED" },
          { label: "WING OR FLOOR ONE" },
          { label: "ROOMS RELEASED", key: true },
          { label: "WING OR FLOOR TWO" },
          { label: "ROOMS RELEASED", key: true }
        ],
        text: "Work is phased by wing or floor around guest routes. Working windows, noise and odour are planned with the hotel, and rooms are released in sequence. We plan around the guests who are staying. We do not promise no disturbance."
      }
    ] as TrackPlan[]
  },

  /** 07. Finish, use and care. */
  finish: {
    eyebrow: "FINISH AND CARE",
    headline: "BUILT FOR A BUILDING THAT IS USED.",
    facts: ["Corridors have trolleys.", "Restaurants have cleaning crews.", "Lobbies have sun."],
    lead: "The finish and the fixing are chosen for the medium and the place, and we write down how each work should be cleaned and handled.",
    body: "We do not prescribe one coating for every material, and we do not offer a blanket guarantee."
  },

  /** 09. From brief to the guest's first look. Two dependencies are marked. */
  process: {
    eyebrow: "PROCESS",
    headline: "FROM BRIEF TO THE GUEST'S FIRST LOOK.",
    steps: [
      { title: "BRIEF AND SCOPE", body: "The spaces, the opening or refurbishment date, the stage of design." },
      { title: "APPOINTMENT", body: "Scope and responsibilities agreed in writing." },
      { title: "CONCEPT OR ADAPTATION", body: "We develop the direction, or adapt the approved one." },
      {
        title: "SAMPLE AND APPROVAL, WHERE NEEDED",
        body: "A sample or model-room piece is approved before production.",
        gate: "SAMPLE APPROVED"
      },
      {
        title: "PRODUCTION SCHEDULE",
        body: "Set against site readiness and the other trades.",
        gate: "SITE READY"
      },
      { title: "SITE AND INSTALLATION", body: "Coordinated with the contractor and the operator." },
      { title: "HANDOVER", body: "Care notes and a record of the works." }
    ] as Step[]
  },

  /** 10. A statement piece or a coordinated commission. */
  budget: {
    eyebrow: "SCOPE",
    headline: "A STATEMENT PIECE OR A COORDINATED COMMISSION.",
    lead: "Cost follows whether the work is a single original or a series, the quantities and sizes, the artist, the creative scope, samples, materials, framing and fixings, access and phasing, and care requirements.",
    body: "We do not give a per-room price. A lobby commission and a programme across every floor are different projects with different decision structures. Send the spaces and the stage you are at, and we will scope what is realistic.",
    columns: ["A STATEMENT PIECE", "A COORDINATED COMMISSION"],
    rows: [
      { label: "WHO DECIDES", cells: ["One approver, one decision.", "Several stakeholders, one direction."] },
      {
        label: "SAMPLES",
        cells: ["A sample where the piece calls for one.", "A sample or model-room piece, as the programme needs."]
      },
      {
        label: "INSTALLATION",
        cells: ["One installation.", "Phased, area by area, with the contractor and the operator."]
      }
    ]
  },

  faq: {
    eyebrow: "QUESTIONS",
    headline: "PROCUREMENT QUESTIONS.",
    items: [
      {
        q: "Can you work with our art or FF&E consultant?",
        a: "Yes. They hold the wider collection; we deliver the commissioned pieces and agree the interfaces in writing."
      },
      {
        q: "Do you only take full packages?",
        a: "No. One lobby commission is a complete project. A defined package across several areas is another."
      },
      {
        q: "Do we need an approved design first?",
        a: "No. We can develop the direction with you, or adapt the one your designer has approved. Concepts are developed after appointment, inside the agreed scope."
      },
      {
        q: "Can you work in a hotel that is open?",
        a: "Yes, phased by wing or floor with working windows, noise and odour planned with the hotel. We do not promise that guests will notice nothing."
      },
      {
        q: "Do you make samples or model-room pieces?",
        a: "Where the programme calls for it, a sample or model-room piece is scoped and approved before production."
      },
      {
        q: "How do the works hold up to cleaning and traffic?",
        a: "The finish is chosen for the medium and the location, and care notes are written for each work. We do not offer one blanket guarantee."
      },
      {
        q: "Who installs the work?",
        a: "The scope states who installs: the studio, a specialist or your contractor, depending on the work and the site."
      },
      {
        q: "What happens at refurbishment?",
        a: "A record of the works and care notes are handed over, so a future refurbishment starts from facts. Repeat or replacement production is agreed case by case."
      },
      {
        q: "Are the pieces originals, editions or reproductions, and where do you work?",
        a: "Originals. We take projects in Dubai and across the UAE, case by case."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "FOR THE PROCUREMENT FILE.",
    items: [
      {
        href: "/guides/how-to-procure-art-artist-led-production-for-hotel-owners-operators-in-the-uae/",
        title: "How to procure artist-led art for a hotel",
        why: "Procurement for owners and operators."
      },
      {
        href: "/guides/art-direction-creative-development-for-hotel-owners-operators-in-the-uae/",
        title: "Art direction for hotels",
        why: "How direction is developed for a property."
      },
      {
        href: "/guides/art-project-team-structure-specialist-partners-for-hotel-owners-operators-in-the-uae/",
        title: "Who does what on a hotel art project",
        why: "Team structure and specialist partners."
      },
      {
        href: "/guides/multi-site-art-rollouts-for-hotel-owners-operators-in-the-uae/",
        title: "Rolling art out across several properties",
        why: "Multi-site rollouts for hotel groups."
      },
      {
        href: "/guides/access-safety-live-site-art-delivery-for-hotels-with-art-programming-for-guest-stays-in-the-uae/",
        title: "Access and safety when art is delivered in a live hotel",
        why: "Delivering around guest stays."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "BRING THE BRIEF, OR THE OPENING DATE.",
    lead: "Property, location, opening or refurbishment, the spaces and roughly when.",
    body: "Plans and room types help but are not needed to begin. If the art consultant or designer is already appointed, tell us who."
  } as Closing,

  cta: {
    primary: "Discuss a Hotel Art Project",
    secondaryWhatsApp: "Send the Hotel Brief on WhatsApp",
    secondaryEmail: "Email the Hotel Brief",
    whatsapp: "Hello Impact Murals, I would like to discuss artwork for a hotel project.\nProperty:\nStage:\nSpaces:",
    emailSubject: "Hotel art enquiry",
    emailBody:
      "Hello Impact Murals,\n\nI would like to discuss artwork for a hotel project.\n\nMy role (operator, designer, consultant, contractor):\nProperty type and location:\nNew opening, refurbishment or operating hotel:\nTarget date (or not known):\nSpaces and rough quantity:\nCurrent design stage:\n",
    track: "hotel_artwork"
  } as PageCta
};
