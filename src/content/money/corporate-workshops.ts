/**
 * /corporate-art-workshops-dubai/: page copy.
 *
 * Final English copy from docs/money-pages/09-corporate-art-workshops-dubai.md.
 * This page is PROVISIONAL: it is specified and built, but its launch is held
 * until the studio confirms the five operational facts of the specification's
 * launch gate (src/content/money/launch.ts, WORKSHOP_GATE_CLEARED). The copy
 * therefore makes no capacity, price or timing claim, so it stays true whichever
 * way those come out.
 *
 * Nothing real exists to show yet: every picture is an illustration labelled as
 * one (the tile mosaic, the output glyphs, the session flow, the room layout)
 * or an honest placeholder (the artist with the group), and the "selected
 * sessions" module is absent until a pilot or a real session can be shown.
 * Presentation lives in src/components/money/pages/CorporateWorkshops.astro.
 */
import type { Closing, Faq, GuideRef, PageCta, Step } from "./types";

export type OutputKind = "shared" | "tiles" | "individual" | "specialist";

export interface OutputRow {
  kind: OutputKind;
  name: string;
  text: string;
}

export interface FitRow {
  name: string;
  text: string;
}

export interface VenueLine {
  name: string;
}

/** A sentence that ends in a link: `before`, the link, `after`. */
export interface LinkedSentence {
  before: string;
  label: string;
  href: string;
  after: string;
}

export const ws = {
  /** 01. Many hands, one work. */
  hero: {
    statement: "MANY HANDS, ONE WORK.",
    support:
      "Artist-led workshops for corporate teams and brand events in Dubai and the UAE. Collaborative formats planned around your group, your venue and what you want the day to leave behind.",
    qualifier: "Private sessions for companies and brand groups, not open-enrolment classes.",
    caption: "ILLUSTRATIVE. THE REAL SHARED PIECE REPLACES THIS DRAWING."
  },

  /** 02. What the group ends up with, and where a workshop stops and other formats begin. */
  formats: {
    eyebrow: "FORMATS",
    headline: "FOUR KINDS OF OUTPUT.",
    lead: "A corporate art workshop is a private, artist-led session for a company or brand group in which people make something together. These are the four things a group can end up with.",
    rows: [
      {
        kind: "shared",
        name: "ONE SHARED ARTWORK",
        text: "Everyone adds to a single large piece, led by the artist."
      },
      {
        kind: "tiles",
        name: "CANVAS TILES",
        text: "Each person paints a section. Together the sections assemble into one image."
      },
      {
        kind: "individual",
        name: "INDIVIDUAL WORKS, ONE BRIEF",
        text: "Each person makes their own piece to a shared theme."
      },
      {
        kind: "specialist",
        name: "A SPECIALIST SESSION",
        text: "Lettering or calligraphy, or another technique the artist leads, where it suits the group."
      }
    ] as OutputRow[],
    glyphLabel: "ILLUSTRATIVE OUTPUTS",
    boundary: [
      {
        before: "A workshop is taught. If guests simply add to a shared wall at an event, that is",
        label: "Participatory Art",
        href: "/what-we-do/art-for-brands/participatory-art/",
        after: "."
      },
      {
        before: "If you want to watch an artist paint, that is",
        label: "Live Painting",
        href: "/live-painting-dubai/",
        after: "."
      }
    ] as LinkedSentence[]
  },

  /** 03. Group suitability, and a sample session. */
  fit: {
    eyebrow: "THE GROUP",
    headline: "FITS THE GROUP YOU HAVE.",
    rows: [
      { name: "THE OBJECTIVE", text: "A creative break, a team moment, or a shared piece for the office." },
      { name: "EXPERIENCE", text: "No previous experience is assumed." },
      {
        name: "THE NUMBERS",
        text: "The group size is set with the artist and any assistants after a staffing and space review."
      },
      { name: "THE SESSION", text: "A fixed session or a drop-in format, and how long it runs." },
      { name: "THE ROOM", text: "Language and access needs are planned in from the start." }
    ] as FitRow[],
    note: "We do not promise every format for every group size.",
    flowTitle: "A SESSION, IN FIVE PARTS",
    flow: ["WELCOME", "DEMONSTRATION", "GUIDED MAKING", "FINISHING", "DISPLAY"],
    flowCaption: "ILLUSTRATIVE SESSION FLOW."
  },

  /** 04. The artist leads. */
  artist: {
    eyebrow: "FACILITATION",
    headline: "THE ARTIST LEADS THE ROOM.",
    standInCaption: "ILLUSTRATIVE. A REAL SESSION REPLACES THIS DRAWING.",
    paragraphs: [
      "The artist introduces the idea, shows the technique, gives people enough structure to start with confidence and responds to what they actually make. Assistants support the room where the group size calls for them.",
      "The result has a single artistic coherence, however many hands made it."
    ]
  },

  /** 05. Venue and materials. */
  venue: {
    eyebrow: "PLANNING",
    headline: "THE ROOM, THE TABLES, THE CLEAN-UP.",
    lines: [
      { name: "WORKSPACE AND TABLES" },
      { name: "PROTECTION FOR FLOORS AND SURFACES" },
      { name: "MATERIALS, SUPPLIED AND HANDLED" },
      { name: "DRYING" },
      { name: "SETUP AND CLEAN-UP" },
      { name: "STORAGE AND TRANSPORT OF FINISHED WORK" }
    ] as VenueLine[],
    note: "Where the venue has rules on materials or setup windows, we plan inside them.",
    layoutCaption: "ILLUSTRATIVE LAYOUT."
  },

  /** 06. The finished work. */
  output: {
    eyebrow: "THE OUTPUT",
    headline: "WHAT THE GROUP LEAVES WITH.",
    frames: ["FINISHED TILES", "ASSEMBLED WORK", "ON A WALL"],
    framesCaption: "ILLUSTRATIVE END RESULT.",
    lead: "The piece can be displayed together, taken home by each person, assembled and framed, or installed in your office. The right answer depends on the purpose of the session.",
    scope: {
      before:
        "Assembly, framing and installation are agreed as separate scope. If the piece is meant to hang permanently, tell us. A commissioned artwork for your workplace is",
      label: "a different brief",
      href: "/corporate-artwork-dubai/",
      after: ", and we will say so."
    } as LinkedSentence
  },

  /** 07. Process and fee factors. */
  process: {
    eyebrow: "PROCESS",
    headline: "HOW A SESSION COMES TOGETHER.",
    steps: [
      { title: "BRIEF", body: "Objective, group, date and venue." },
      { title: "FORMAT AND FEASIBILITY", body: "Format, numbers and staffing checked." },
      { title: "APPOINTMENT", body: "Scope agreed." },
      { title: "SESSION DESIGN", body: "The session and the artwork brief developed." },
      { title: "PREPARATION", body: "Materials, setup and the room." },
      { title: "THE SESSION AND THE OUTPUT", body: "Led by the artist, finished and handed over." }
    ] as Step[],
    fee: {
      lead: "COST DEPENDS ON",
      items: [
        "the size of the group",
        "the length of the session",
        "the complexity of the format",
        "the number of assistants",
        "the materials",
        "the venue",
        "the cost of the final work"
      ],
      closing:
        "We do not publish a per-head price, because group size, format and the finished work change the costs together."
    }
  },

  /** 08. Questions and guides. */
  faq: {
    eyebrow: "QUESTIONS",
    headline: "ORGANISER QUESTIONS.",
    items: [
      {
        q: "Do participants need experience?",
        a: "No. The session is built so a first-time painter can take part, and the artist adjusts the pace to the room."
      },
      {
        q: "How many people can take part?",
        a: "It depends on the format, the room and the number of assistants. We confirm the numbers after a staffing and space review. We do not promise every format for every group size."
      },
      {
        q: "Is it a fixed session or a drop-in?",
        a: "Either can be planned. A fixed session suits a team; a drop-in suits a larger event. The duration is set with you."
      },
      {
        q: "Can the session reflect our brand or theme?",
        a: "Yes. The theme, the palette or a campaign idea can shape the brief, and the artist keeps the result coherent."
      },
      {
        q: "Do you bring the materials and set up?",
        a: "The proposal states what is supplied, the setup and the clean-up. Where the venue has rules, we plan inside them."
      },
      {
        q: "What happens to the artwork afterwards?",
        a: "It can be displayed, assembled, framed, taken home or installed. Anything beyond the session itself is agreed as separate scope."
      },
      {
        q: "Do we pay for session design before we commit?",
        a: "Session design follows appointment and sits inside the agreed scope. Before that we confirm the format, the numbers and the venue with you."
      },
      {
        q: "Can you accommodate language and access needs?",
        a: "Tell us early. They are planned into the format, the room and the pace."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "SESSION IDEAS AND PLANNING.",
    items: [
      {
        href: "/guides/canvas-painting-workshops-corporate-events-dubai/",
        title: "Canvas painting workshops for corporate events",
        why: "How a canvas session is planned."
      },
      {
        href: "/guides/collaborative-canvas-painting-corporate-events/",
        title: "Collaborative canvas painting for corporate events",
        why: "One image made by many hands."
      },
      {
        href: "/insights/how-to-run-art-workshop-100-plus-participants/",
        title: "Running an art workshop for a large group",
        why: "What a large session asks of the planning."
      },
      {
        href: "/insights/take-home-keepsake-vs-shared-artwork-event/",
        title: "Take-home keepsake or shared artwork",
        why: "Choosing what the group leaves with."
      },
      {
        href: "/insights/30-minute-creative-workshop-ideas-corporate-events/",
        title: "Thirty-minute creative workshop ideas",
        why: "Short formats for a tight programme."
      },
      {
        href: "/insights/creative-art-workshops-conferences-delegate-breakouts/",
        title: "Creative workshops for conferences and breakouts",
        why: "Sessions inside a conference programme."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "WHO IS IN THE ROOM?",
    lead: "Who is taking part, roughly how many, the date if you have one and the venue.",
    body: "Say whether you want a shared piece or individual ones. Details can be rough."
  } as Closing,

  cta: {
    primary: "Discuss a Corporate Art Workshop",
    secondaryWhatsApp: "Send the Group Details on WhatsApp",
    secondaryEmail: "Email the Group Details",
    whatsapp: "Hello Impact Murals, I would like to discuss a corporate art workshop.\nGroup size:\nDate:\nVenue:",
    emailSubject: "Corporate art workshop enquiry",
    emailBody:
      "Hello Impact Murals,\n\nI would like to discuss a corporate art workshop.\n\nCompany and objective:\nDate (or unknown):\nVenue and city:\nParticipant estimate:\nSession length:\nFixed session or drop-in:\nShared piece or individual works:\n\nAny format or reference in mind, access or language needs, what happens to the finished work, budget:\n",
    track: "corporate_workshops"
  } as PageCta
};
