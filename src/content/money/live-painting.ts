/**
 * /live-painting-dubai/: page copy.
 *
 * Final English copy from docs/money-pages/01-live-painting-dubai.md, adjusted
 * where the rendered page asked for it. Nothing here is invented: the three
 * vehicle projects are the ones already published on the Automotive page, in
 * their approved wording, and make no claim beyond what they show (live
 * painting on vehicles at launches and events). No fee, capacity or lead time
 * is stated. Presentation lives in src/components/money/pages/LivePainting.astro.
 */
import type { Closing, Faq, FactorGroup, GuideRef, PageCta, Row, Step } from "./types";

export const lp = {
  hero: {
    statement: "THE ARTWORK IS MADE WHILE YOUR GUESTS WATCH.",
    support:
      "Artist-led live painting for brand launches, corporate events and conferences in Dubai and across the UAE. We shape the direction with you, or work from the one you already have.",
    notation: "BRAND LAUNCHES / CONFERENCES / CLIENT EVENTS / CORPORATE FUNCTIONS",
    micro: "A date, a venue and a rough audience are enough to start."
  },

  /** 02. What guests see: the same story in three frames. */
  audience: {
    eyebrow: "THE PERFORMANCE",
    headline: "WHAT YOUR GUESTS SEE.",
    lead: "A finished artwork gives an event one moment. Live painting gives it a progression.",
    body: "Guests see the first marks, come back as the image builds and are in the room when it resolves. The performance can be quiet and continuous, or built to land on a single cue. How visible the artist is, from the edge of the room to centre stage, is something we decide with you.",
    frames: [
      { slot: "LP_FIRST_MARKS", label: "FIRST MARKS", text: "A blank surface gives guests a reason to stop." },
      { slot: "LP_THE_BUILD", label: "THE BUILD", text: "The work is different each time they pass." },
      { slot: "LP_THE_REVEAL", label: "THE REVEAL", text: "The finished piece, in the room, with the brand around it." }
    ] as const
  },

  /** 03. Formats. Duration is a variable, never a promise. */
  formats: {
    eyebrow: "FORMATS",
    headline: "FOUR WAYS TO RUN IT.",
    note: "Duration depends on the artist, the technique and the scale. The proposal gives an estimate, never a promise of how long a painting will take.",
    rows: [
      {
        name: "CONTINUOUS CREATION",
        text: "The artist works across the event while guests move around them. It suits receptions, exhibitions and longer programmes.",
        note: "YOU END WITH A FINISHED ARTWORK BY CLOSE."
      },
      {
        name: "TIMED REVEAL",
        text: "The work is planned backwards from a cue: a speech, an unveiling, a countdown. It suits launches and keynotes.",
        note: "YOU END WITH THE PIECE REVEALED ON THE CUE, WHERE THE PROGRAMME AND TECHNIQUE ALLOW IT."
      },
      {
        name: "LIVE MURAL OR PANEL",
        text: "A larger surface, painted by one artist or a small team. It can stay as a backdrop afterwards or be installed later.",
        note: "YOU END WITH A WORK THAT OUTLASTS THE EVENING."
      },
      {
        name: "LIVE ON A VEHICLE",
        text: "One hero object painted as the performance. We have painted vehicles live at launches and events, including in Dubai.",
        note: "YOU END WITH THE PAINTED VEHICLE.",
        href: "/automotive/",
        linkLabel: "See Automotive"
      }
    ] as Row[]
  },

  /** 04. Where it works: five occasions, one line each. */
  where: {
    eyebrow: "OCCASIONS",
    headline: "WHERE IT WORKS.",
    items: [
      { name: "PRODUCT AND BRAND LAUNCHES", text: "The reveal becomes the moment guests and cameras gather around." },
      { name: "AUTOMOTIVE EVENTS", text: "An artist paints the vehicle, or the world around it, in front of the audience." },
      { name: "CONFERENCES AND EXHIBITIONS", text: "A stand with a reason to stop, and a piece the brand keeps." },
      { name: "CLIENT AND VIP EVENTS", text: "A quieter, continuous performance guests talk about afterwards." },
      { name: "CORPORATE FUNCTIONS", text: "An artwork made for the occasion, which the company can display afterwards." }
    ]
  },

  /** 05. Two ways in. */
  paths: {
    eyebrow: "HOW WE START",
    headline: "TWO STARTING POINTS.",
    items: [
      {
        name: "YOU NEED DIRECTION.",
        body: "You have a launch, a theme and a date. We develop the artistic direction, choose the artist and decide how directly the brand should appear."
      },
      {
        name: "YOU HAVE DIRECTION.",
        body: "Your agency or team has the campaign or the artwork. We adapt it for live execution and run the performance around it."
      }
    ],
    note: "Appointment comes first. Project-specific concepts are developed inside the agreed scope, not offered speculatively beforehand."
  },

  /** 06. The practical part. */
  production: {
    eyebrow: "BEFORE DOORS",
    headline: "THE PRACTICAL PART, SETTLED BEFORE THE DAY.",
    lead: "Live work has a fixed window and no second take, so these questions are answered in advance.",
    items: [
      { name: "SURFACE AND SCALE", text: "How large the work is, what it is painted on, and how it is displayed or removed." },
      { name: "SIGHTLINES", text: "Where guests stand, and where the cameras do." },
      { name: "LIGHT", text: "Enough to paint by, and to film by." },
      { name: "PROTECTION", text: "Floors, walls and stand finishes covered." },
      { name: "MATERIALS AND AIR", text: "Chosen for the venue. Indoor events agree ventilation and odour with the venue." },
      { name: "LOAD-IN AND STRIKE", text: "Access, timing and what leaves the venue afterwards." },
      { name: "HEAT AND WIND", text: "For outdoor events, shade, wind and surface temperature shape the plan." }
    ],
    caption: "ILLUSTRATIVE LAYOUT / EXAMPLE ONLY. EVERY SETUP IS DRAWN FOR ITS VENUE."
  },

  /** 07. From first cue to handover. */
  runOfShow: {
    eyebrow: "RUN OF SHOW",
    headline: "FROM FIRST CUE TO HANDOVER.",
    lead: "An event team needs to know who does what, and when. The shape is usually the same.",
    stages: [
      { label: "BEFORE DOORS", text: "Set-up and protection." },
      { label: "START CUE", text: "The artist begins.", cue: true },
      { label: "THE BUILD", text: "The work develops, with agreed checkpoints if the format is timed." },
      { label: "REVEAL CUE", text: "Only if the format has one.", cue: true },
      { label: "HANDOVER", text: "Strike, and the finished work handed over." }
    ],
    whoHeadline: "WHO DOES WHAT",
    who: [
      { name: "ARTIST AND IMPACT MURALS", text: "The artwork, the painting set-up and the performance." },
      { name: "YOU OR YOUR AGENCY", text: "The programme, the cues, the venue and access." },
      { name: "YOUR AV AND CONTENT TEAM", text: "Cameras, screens and editing, if commissioned." }
    ],
    av: "We do not assume camera, screen or editing support. If you want them, we plan the sightlines and key moments with your crew and the proposal states what is included.",
    finished: {
      name: "THE FINISHED PIECE",
      text: "Ownership, storage, installation and permitted use of images are agreed in the proposal, before the event. The work can stay with the brand, be installed later or simply complete the evening."
    }
  },

  /** 08. Real proof of live work, on vehicles, in the studio's approved wording. */
  proof: {
    eyebrow: "LIVE WORK",
    headline: "VEHICLES PAINTED LIVE.",
    cards: [
      {
        slot: "LP_PROOF_BMW",
        eyebrow: "BMW M5 TOURING / DUBAI, 2025",
        body: "As part of AGMC's activation at Binance Blockchain Week 2025, Alexis live-painted a BMW M5 Touring outside Dubai's Coca-Cola Arena. Visitors could watch the spray-painted artwork take shape directly on the vehicle.",
        link: {
          label: "FEATURED BY AGMC: READ THE ARTICLE",
          href: "https://www.agmc.com/en/news/agmc-supported-the-future-of-blockchain-with-binance-blockchain-week-2025"
        }
      },
      {
        slot: "LP_PROOF_JETOUR",
        eyebrow: "JETOUR / LAUNCH EVENT",
        body: "Bold graphic artwork painted directly onto the vehicle during a live automotive event."
      },
      {
        slot: "LP_PROOF_ICAUR",
        eyebrow: "iCAUR / LAUNCH",
        body: "Arabic calligraphy painted directly onto the vehicle during the launch."
      }
    ] as const,
    more: { label: "MORE VEHICLE WORK ON AUTOMOTIVE", href: "/automotive/" }
  },

  /** 09. Process. */
  process: {
    eyebrow: "PROCESS",
    headline: "FROM FIRST MESSAGE TO LAST BRUSHSTROKE.",
    steps: [
      { title: "THE DATE AND THE BRIEF", body: "Tell us the event, date, venue and audience. Partial information is fine." },
      { title: "FEASIBILITY", body: "We check the window, space, surface and technique against what an artist can deliver." },
      { title: "PROPOSAL AND APPOINTMENT", body: "You receive a scoped proposal. Creative development begins once you appoint us." },
      { title: "CONCEPT OR ADAPTATION", body: "We develop the artistic direction, or adapt your approved artwork for live execution." },
      { title: "REHEARSAL AND PLANNING", body: "Where the format needs it, a run-through of cues, set-up and access with your team." },
      { title: "THE EVENT AND HANDOVER", body: "The performance, the strike and the handover of the finished work." }
    ] as Step[]
  },

  /** 10. Fee factors. */
  fee: {
    eyebrow: "FEES",
    headline: "WHAT SHAPES THE FEE.",
    groups: [
      {
        title: "THE ARTISTRY",
        items: [
          "The artist and technique",
          "New direction, or adaptation of approved artwork",
          "The surface and scale",
          "How long the performance runs",
          "Any rehearsal"
        ]
      },
      {
        title: "THE PRODUCTION",
        items: [
          "Team size",
          "Materials and protection",
          "Venue access, travel and load-in",
          "Content support",
          "Rights and use of the finished work"
        ]
      }
    ] as FactorGroup[],
    closing:
      "We do not publish an hourly rate. Performance length is only one variable among several. Send the date, venue and window and we will tell you what a proposal would cover."
  },

  faq: {
    eyebrow: "QUESTIONS",
    headline: "WHAT PRODUCERS ASK.",
    items: [
      {
        q: "How far ahead should we book?",
        a: "As early as the date is known. Artist availability and venue approvals set the timeline more than the painting does. If your date is close, send it anyway and we will say plainly whether it is feasible."
      },
      {
        q: "Can the artwork be finished at a fixed moment?",
        a: "Often, when the format is planned around it. A timed reveal is built backwards from the cue. Treat any duration we quote as a programme estimate, confirmed with the artist in the proposal, not a guaranteed finish time."
      },
      {
        q: "Can we choose the artist, or do you?",
        a: "Either. We select the artist whose technique and visual language suit the event, or build the format around an artist you already have in mind. When the audience is watching, presence and pace matter as much as style."
      },
      {
        q: "Can you paint artwork we have already approved?",
        a: "Yes. We adapt approved campaign artwork for live execution and tell you what changes when a design meets a live surface and a fixed window. You are never asked to review speculative artwork before you appoint us."
      },
      {
        q: "Can it run indoors and outdoors?",
        a: "Both are possible. Indoors, material choice and ventilation are agreed with the venue. Outdoors, sun, wind and surface temperature shape the plan. We review the space before we propose."
      },
      {
        q: "What happens to the finished artwork?",
        a: "It is decided before the event. The work can stay with the brand, be installed later or complete the evening as a one-off. The proposal records ownership and how the work and its images may be used."
      },
      {
        q: "Can it be filmed or shown on screens?",
        a: "Yes, if it is planned. We set sightlines and key moments with your content or AV team. Cameras, screens and editing are not included unless the proposal says so."
      },
      {
        q: "Is this for weddings or private parties?",
        a: "Our live work is built for brands and organisations. If your event is private, send the brief and we will tell you whether it fits."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "PLANNING A LIVE EVENT.",
    items: [
      {
        href: "/insights/build-artistic-reveal-product-launch/",
        title: "How to build an artistic reveal into a product launch",
        why: "Planning the cue the whole programme builds towards."
      },
      {
        href: "/insights/how-much-space-live-art-activation-event/",
        title: "How much space a live art activation needs",
        why: "Surface, artist zone and audience distance in practice."
      },
      {
        href: "/insights/plan-event-content-capture-live-artist/",
        title: "Planning content capture around a live artist",
        why: "Sightlines, key moments and who films what."
      },
      {
        href: "/insights/what-happens-finished-artwork-after-event/",
        title: "What happens to the finished artwork after the event",
        why: "Keeping it, installing it or handing it on."
      },
      {
        href: "/insights/what-does-a-live-art-activation-cost-in-dubai/",
        title: "What a live art activation costs in Dubai",
        why: "The variables behind a proposal."
      },
      {
        href: "/insights/how-early-should-you-book-a-live-artist-for-an-event-in-dubai/",
        title: "How early to book a live artist",
        why: "Lead time for the artist and the venue."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "THE DATE, THE VENUE, THE CROWD.",
    lead: "Event type, date, venue and audience are enough.",
    body: "If the date is provisional or the direction is open, say so. We will work with what you have."
  } as Closing,

  cta: {
    primary: "Discuss a Live Painting Event",
    secondaryWhatsApp: "Send the Event Brief on WhatsApp",
    secondaryEmail: "Email the Event Brief",
    whatsapp: "Hello Impact Murals, I would like to discuss a live painting event.\nDate:\nVenue:\nAudience:\nBrief:",
    emailSubject: "Live painting event enquiry",
    emailBody: "Hello Impact Murals,\n\nI would like to discuss a live painting event.\n\nDate:\nVenue:\nAudience:\nBrief:\n",
    track: "live_painting"
  } as PageCta
};
