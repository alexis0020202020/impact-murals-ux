/**
 * /corporate-artwork-dubai/: page copy.
 *
 * Final English copy from docs/money-pages/02-corporate-artwork-dubai.md. The
 * page claims no workplace commission: its only real imagery is a hand-painted
 * mural in a working automotive workshop, captioned as exactly that, and every
 * drawing (the plan, the phasing, the schedule) is labelled illustrative. No
 * fee, lead time or working-hours promise is stated. Presentation lives in
 * src/components/money/pages/CorporateArtwork.astro.
 */
import type { Closing, Faq, GuideRef, PageCta, Step } from "./types";

export interface Zone {
  n: string;
  name: string;
  text: string;
}

export interface FormatRow {
  name: string;
  glyph: "mural" | "canvas" | "series" | "dimensional";
  what: string;
  suits: string;
  know: string;
  href: string;
  linkLabel: string;
}

export interface ScheduleRow {
  location: string;
  format: string;
  size: string;
  window: string;
  status: string;
}

export const ca = {
  hero: {
    notation: "OFFICES / HEADQUARTERS / RECEPTIONS / MULTI-FLOOR PROGRAMMES",
    statement: "ORIGINAL ARTWORK FOR OFFICES AND HEADQUARTERS.",
    support:
      "Murals, commissioned canvases and site-specific work, developed around your architecture, your brand and the people who use the building every day. One reception wall or a programme across several floors.",
    event: {
      lead: "Looking for art at a company event?",
      label: "See Live Painting",
      href: "/live-painting-dubai/"
    }
  },

  /** 02. The brief and the brand. */
  brief: {
    eyebrow: "THE BRIEF",
    headline: "FROM BRAND GUIDELINES TO AN ARTISTIC ANSWER.",
    lead: "Brand guidelines tell us who you are. They do not tell us what a wall should say.",
    body: "We read them for colour, tone and values, then look at the architecture, the audience and what the workplace is for. The artist's own language does the rest.",
    aside:
      "A logo on a wall is rarely good art. Where a mark or a line of text belongs in the work, we place it on purpose, not by default."
  },

  /** 03. Zone by zone. The numerals tie each line to a position on the plan. */
  zones: {
    eyebrow: "WHERE ART GOES",
    headline: "ZONE BY ZONE.",
    caption: "ILLUSTRATIVE PLAN / NOT A REAL FLOOR.",
    items: [
      {
        n: "1",
        name: "ARRIVAL AND RECEPTION",
        text: "The first work every visitor meets. One strong piece, sized for how people wait and for the light in the room."
      },
      {
        n: "2",
        name: "BOARDROOMS AND MEETING ROOMS",
        text: "Presence without distraction. Quiet palettes, careful scale, work that holds up behind a speaker on a video call."
      },
      {
        n: "3",
        name: "CORRIDORS AND SHARED SPACE",
        text: "Long, narrow and walked past. Sequence matters: a series reads differently from a single piece."
      },
      {
        n: "4",
        name: "FLOORS, ATRIA AND STAIRWELLS",
        text: "A multi-floor programme with one thread and different works, delivered in phases."
      }
    ] as Zone[],
    closing: "One room is a perfectly good place to start."
  },

  /** 04. Choosing the format. The destination page owns the detail. */
  formats: {
    eyebrow: "FORMATS",
    headline: "MURAL, CANVAS, SERIES OR SOMETHING DIMENSIONAL.",
    labels: { what: "WHAT IT IS", suits: "SUITS", know: "WORTH KNOWING" },
    rows: [
      {
        name: "MURAL",
        glyph: "mural",
        what: "Painted on the wall, on site.",
        suits: "Reception walls and feature walls.",
        know: "It needs a prepared wall and an agreed working window.",
        href: "/mural-artist-dubai/",
        linkLabel: "See Mural Artist"
      },
      {
        name: "COMMISSIONED CANVAS",
        glyph: "canvas",
        what: "Painted off site and delivered finished.",
        suits: "Boardrooms and walls that cannot be painted.",
        know: "It can move with you if the office does.",
        href: "/custom-canvas-art-dubai/",
        linkLabel: "See Custom Canvas"
      },
      {
        name: "ART SERIES",
        glyph: "series",
        what: "Several works commissioned as one.",
        suits: "Corridors, floors and meeting rooms.",
        know: "A series is planned as a whole, even when it is delivered in phases.",
        href: "/what-we-do/art-for-places/coordinated-artworks/",
        linkLabel: "See Coordinated Artworks"
      },
      {
        name: "DIMENSIONAL WORK",
        glyph: "dimensional",
        what: "A piece with depth or structure.",
        suits: "Atria, voids and double-height spaces.",
        know: "Weight, fixings and access are part of the brief.",
        href: "/art-installations-dubai/",
        linkLabel: "See Art Installations"
      }
    ] as FormatRow[]
  },

  /** 05. Existing direction, or direction needed. */
  direction: {
    eyebrow: "HOW WE START",
    headline: "YOUR DESIGN TEAM KEEPS THE BRIEF.",
    paths: [
      {
        name: "THE DIRECTION EXISTS.",
        body: "Your brand team, designer or fit-out contractor has already defined it. We work inside it and leave their scope alone."
      },
      {
        name: "THE DIRECTION IS OPEN.",
        body: "You have guidelines and a space, but not yet an artistic answer. We develop the direction with an artist, for your approval."
      }
    ],
    sendLabel: "WHAT HELPS MOST TO SEND",
    send: ["PLANS OR ELEVATIONS", "THE BRAND SYSTEM", "PHOTOGRAPHS OF THE WALLS"],
    sendNote: "None is required to begin.",
    note: "Concepts for your project are developed once you have appointed us, inside the agreed scope."
  },

  /** 06. Working around an occupied office. */
  occupied: {
    eyebrow: "DELIVERY",
    headline: "WORKING AROUND AN OFFICE THAT IS STILL IN USE.",
    body: "Painting in an occupied building is a scheduling and protection problem as much as an artistic one. We plan zone by zone: what is protected, what is closed and when, which materials suit the space and how each area is cleaned down.",
    hours:
      "Evening and weekend working can be arranged where the building and your facilities team allow it. We plan to keep disruption low. We do not promise none.",
    items: [
      "OCCUPANCY AND ACCESS",
      "WORKING WINDOWS",
      "PROTECTION",
      "MATERIAL CHOICE, NOISE AND ODOUR",
      "PHASING BY ZONE"
    ],
    sequence: [
      { slot: "CA_PROTECT", n: "01", label: "PROTECTED", text: "Floor, furniture and surfaces covered." },
      { slot: "CA_IN_PROGRESS", n: "02", label: "IN PROGRESS", text: "Edges masked, the artist in a respirator." },
      { slot: "CA_CLEAN_DOWN", n: "03", label: "CLEANED DOWN", text: "Each zone handed back." }
    ] as const,
    phasingCaption: "ILLUSTRATIVE PHASING / EXAMPLE ONLY. EVERY BUILDING IS PLANNED ON ITS OWN TERMS."
  },

  /** 07. Who decides what, and the schedule that records it. */
  decides: {
    eyebrow: "COORDINATION",
    headline: "WHO DECIDES WHAT.",
    roles: [
      { name: "ONE APPROVER ON YOUR SIDE", text: "A named person signs off the artistic direction." },
      { name: "FACILITIES AND BUILDING MANAGEMENT", text: "Access, permissions and working windows." },
      { name: "DESIGNER OR CONTRACTOR", text: "Surfaces, services, lighting and programme." },
      {
        name: "IMPACT MURALS",
        text: "The artist, the development, the production schedule, the installation scope agreed and the handover."
      }
    ],
    scheduleLabel: "ILLUSTRATIVE SCHEDULE",
    scheduleNote: "SAMPLE ROWS, NOT A REAL PROJECT.",
    columns: { location: "LOCATION", format: "FORMAT", size: "SIZE", window: "INSTALL WINDOW", status: "STATUS" },
    rows: [
      { location: "Reception wall", format: "Mural", size: "6 × 3 m", window: "Evening block", status: "Scope agreed" },
      { location: "Boardroom", format: "Canvas", size: "2.4 × 1.2 m", window: "Fitted in one visit", status: "In development" },
      { location: "Level 3 corridor", format: "Series of five", size: "0.8 × 0.8 m each", window: "Phase 2", status: "Direction approved" },
      { location: "Atrium void", format: "Dimensional work", size: "To be measured", window: "Phase 3", status: "To be scoped" }
    ] as ScheduleRow[]
  },

  /** 09. Six steps, two decisions. */
  process: {
    eyebrow: "PROCESS",
    headline: "SIX STEPS, TWO DECISIONS.",
    steps: [
      { title: "BRIEF", body: "Objectives, spaces and programme." },
      { title: "AREAS AND FORMATS", body: "Where art belongs and in which form." },
      { title: "SCOPE AND APPOINTMENT", body: "The scope is agreed in writing.", gate: "SCOPE AGREED" },
      { title: "DEVELOPMENT AND APPROVAL", body: "Artistic direction developed for your sign-off.", gate: "DIRECTION APPROVED" },
      { title: "PRODUCTION AND INSTALLATION", body: "Phased by zone around the building." },
      { title: "HANDOVER", body: "Care notes and a record of the works, useful if the office moves." }
    ] as Step[]
  },

  /** 10. What a workplace art budget is made of. */
  budget: {
    eyebrow: "BUDGET",
    headline: "WHAT A WORKPLACE ART BUDGET IS MADE OF.",
    body: "Cost follows the number of works and areas, whether each is an original or part of a series, the artist, the medium, the dimensions, framing and fixings, access and phasing.",
    closing: "We scope each from the spaces you send, not from a headline figure.",
    columns: ["ONE FEATURE PIECE", "A MULTI-FLOOR PROGRAMME"],
    rows: [
      { label: "DECISION MAKERS", cells: ["One approver", "One direction, signed off once"] },
      { label: "WORKING WINDOWS", cells: ["One", "One for each phase or zone"] },
      { label: "INSTALLATION", cells: ["One visit", "Phased production on a schedule that holds across teams"] }
    ]
  },

  faq: {
    eyebrow: "QUESTIONS",
    headline: "THE OFFICE QUESTIONS.",
    items: [
      {
        q: "Can you work from our brand guidelines?",
        a: "Yes. Guidelines are a starting input, not a template. We read them for colour, tone and values, then develop an artistic direction for the architecture and audience."
      },
      {
        q: "How do you choose an artist for an office?",
        a: "By reading the architecture, the audience and the brand, then selecting the artist whose language suits them. A reception wall and a boardroom may call for different hands."
      },
      {
        q: "Is this for one piece or a programme?",
        a: "Either. One reception wall is a complete project. A programme across floors is planned as a whole and delivered in phases."
      },
      {
        q: "Can you install while staff are in the building?",
        a: "Often, with planning. We work zone by zone, protect surfaces, choose materials for the space and tell you what to expect before work starts."
      },
      {
        q: "Can you work at night or at weekends?",
        a: "Where the building and your facilities team allow it. It is agreed during scoping and is not assumed."
      },
      {
        q: "How do you work with our designer and contractor?",
        a: "We work beside them. They keep the interior; we deliver the artwork and the production around it, and agree the interfaces in writing."
      },
      {
        q: "What if we move or rebrand?",
        a: "Canvases and panels can move with you. Murals can be repainted or adapted, and we tell you early which parts of a commission are portable."
      },
      {
        q: "Do we see concepts before we commit?",
        a: "You appoint us first, and the concepts are developed inside the scope you agreed. Review rounds are set out in that scope and are not unlimited. Before that we go through the brief, the spaces and feasibility with you."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "ART PROGRAMMES, EXPLAINED.",
    items: [
      {
        href: "/guides/how-to-structure-an-art-programme-for-corporate-office-projects-in-the-uae/",
        title: "How to structure an art programme for corporate office projects",
        why: "Scope, phasing and sign-off across several areas."
      },
      {
        href: "/guides/art-for-corporate-campuses-dubai/",
        title: "Art for corporate campuses",
        why: "One thread across several buildings."
      },
      {
        href: "/guides/art-for-banks-and-financial-headquarters-dubai/",
        title: "Art for banks and financial headquarters",
        why: "Formal settings and careful approvals."
      },
      {
        href: "/insights/should-an-existing-mural-be-repainted-adapted-or-removed-during-a-rebrand/",
        title: "Repaint, adapt or remove a mural after a rebrand",
        why: "What to do with a wall when the brand changes."
      },
      {
        href: "/insights/what-happens-to-artwork-when-a-space-changes-operator-or-tenant/",
        title: "What happens to artwork when a space changes tenant",
        why: "Ownership and portability at the end of a lease."
      },
      {
        href: "/guides/art-programmes-coworking-flexible-workspaces-dubai/",
        title: "Art programmes for coworking and flexible workspaces",
        why: "Art for shared space and changing tenants."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "WHERE SHOULD THE ART GO?",
    lead: "Where it is, what is being built or refreshed, which spaces you have in mind and roughly when.",
    body: "Photos and plans help but are not required. If you are not sure where art belongs, say that too."
  } as Closing,

  cta: {
    primary: "Discuss a Workplace Art Project",
    secondaryWhatsApp: "Send the Workplace Brief on WhatsApp",
    secondaryEmail: "Email the Workplace Brief",
    whatsapp: "Hello Impact Murals, I would like to discuss artwork for a workplace.\nLocation:\nSpaces:\nTiming:",
    emailSubject: "Workplace art enquiry",
    emailBody:
      "Hello Impact Murals,\n\nI would like to discuss artwork for a workplace.\n\nLocation:\nSpaces:\nTiming:\nNew fit-out, refurbishment or occupied office:\nExisting creative direction (yes, no, in progress):\n",
    track: "corporate_artwork"
  } as PageCta
};
