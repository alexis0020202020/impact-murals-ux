/**
 * /automotive: page copy and media slots.
 *
 * The copy is the approved final website copy for this page (nine blocks: hero,
 * what we do, realism and detail, BMW / Binance, the exterior mural, Jetour and
 * iCAUR, about, how we work, closing). It is stored word for word, with the
 * supplied spelling, punctuation and attributions: change it here only when the
 * owner approves a new wording, never to "improve" it. Presentation lives in
 * src/components/automotive/.
 *
 * Nothing here is invented: no client, result, statistic or date beyond what
 * the approved copy states. The Rolls-Royce Spirit of Ecstasy is the subject of
 * a private commission, never a client; AGMC is named only as the activation
 * partner and the publisher of the linked article.
 *
 * Every slot below is backed by a real file (see src/lib/automotive-media.ts and
 * docs/AUTOMOTIVE-MEDIA.md). A slot with no file fails the build, so a page can
 * never ship with a hole where a picture should be.
 */

/**
 * Every media slot on the page. The file for a slot is its lower-case,
 * hyphenated form (`slotStem`), e.g. BMW_BINANCE_MAIN -> bmw-binance-main.
 *
 * AUTOMOTIVE_HERO_MOBILE is the same artwork as AUTOMOTIVE_HERO cut for a
 * phone (art direction, not a second picture): the opening picture is the Ferrari
 * mural, wide on screens and a squarer crop of the same wall on phones.
 * WORKSHOP_MURAL_MAIN and PORSCHE_PORTRAIT are the two realistic artworks shown
 * under "THE DETAILS CAR PEOPLE NOTICE." (see `realism.art`); their names are
 * file names, not captions.
 *
 * Slots the supplied material did not need are not listed: there is no
 * photograph of the summit booth, no close-up of the workshop mural and no
 * portrait of the founder.
 */
export const automotiveSlots = [
  "AUTOMOTIVE_HERO",
  "AUTOMOTIVE_HERO_MOBILE",
  "WHAT_WE_DO_MAIN",
  "WORKSHOP_MURAL_MAIN",
  "PORSCHE_PORTRAIT",
  "BMW_BINANCE_MAIN",
  "BMW_BINANCE_DETAIL",
  "EXTERIOR_MURAL_MAIN",
  "EXTERIOR_MURAL_BEFORE",
  "JETOUR_LAUNCH",
  "ICAUR_LAUNCH"
] as const;

export type AutomotiveSlot = (typeof automotiveSlots)[number];

/** File stem for a slot: `BMW_BINANCE_MAIN` becomes `bmw-binance-main`. */
export function slotStem(slot: AutomotiveSlot): string {
  return slot.toLowerCase().replaceAll("_", "-");
}

export const automotiveSeo = {
  /** The hero's own words; a noindex outreach page needs no separate SEO copy. */
  title: "Murals, Vehicle Art & Live Painting",
  description: "Art-led projects for automotive spaces, brands, events and private collections."
} as const;

/** 01. Hero */
export const hero = {
  eyebrow: "ART FOR CAR LOVERS.",
  /**
   * The headline as three short lines (a list of the three disciplines). The
   * non-breaking spaces keep "VEHICLE ART" and "& LIVE" together when a narrow
   * phone has to wrap them.
   */
  headlineLines: ["MURALS,", "VEHICLE ART", "& LIVE PAINTING."],
  intro: "Art-led projects for automotive spaces, brands, events and private collections.",
  /** Jump link to the contact block, the only navigation on a page with no site header. */
  jump: "CONTACT",
  alt: "Ultra-realistic black-and-white Ferrari mural: a woman in a long white dress between a white horse and a black horse at two stone windows, with a sports car in front"
} as const;

/** 02. What we do */
export const whatWeDo = {
  headline: "WHAT WE DO.",
  /** The first paragraph is the lead, the second is the supporting paragraph beneath it. */
  intro: [
    "Cars are personal. The places and experiences built around them can be too.",
    "Led by artist and creative director Alexis, Impact Murals creates original artwork for automotive spaces, vehicles and events, bringing together the artists and production specialists each project needs."
  ],
  offers: [
    {
      title: "MURALS & SPACES",
      body: [
        "A showroom, a performance workshop or a private garage deserves artwork that suits the cars and the people behind it.",
        "We design murals inspired by what makes each place distinctive, whether that's the cars you build, a racing era, a particular marque or the character of a private collection."
      ]
    },
    {
      title: "CUSTOM ARTWORKS",
      body: [
        "A favourite car, a racing icon or a one-off build. We create original paintings and commissioned pieces for enthusiasts, collectors and automotive brands.",
        "The style might be photorealistic, graphic or something more experimental, depending on the subject."
      ]
    },
    {
      title: "VEHICLE PAINTING",
      body: [
        "Original artwork painted directly onto vehicles. Whether it's a personal commission, a special build or a vehicle prepared for an event, the artwork is developed specifically for the car."
      ]
    },
    {
      title: "LIVE PAINTING & ACTIVATIONS",
      body: [
        "There's something different about watching an artwork take shape in real time. Our live painting makes that process part of automotive launches, events and gatherings."
      ]
    }
  ],
  alt: "A vintage car painted on a small canvas, from the first pencil lines to the finished artwork held up to the camera"
} as const;

/**
 * 03. Realism and detail. One heading and one text for the whole section, not
 * for any one artwork: nothing here captions or describes a single piece.
 *
 * `art` is the list of realistic artworks shown beside the text, in reading
 * order. It holds only what each picture needs (its slot and its description
 * for screen readers); to show another realistic piece, add an entry and a file
 * for its slot. `place` says how the current composition sets it: the larger,
 * taller piece (`lead`) or the smaller companion (`side`).
 */
export const realism = {
  eyebrow: "AUTOMOTIVE REALISM",
  headline: "THE DETAILS CAR PEOPLE NOTICE.",
  body: [
    "When you know a car, you notice everything. The stance, the reflections on the bodywork, the lines that make it instantly recognisable.",
    "We bring that same attention to realistic murals and original paintings, including portraits and subjects drawn from automotive culture and racing history. Each piece has its own artistic character, while staying true to what makes the subject special."
  ],
  art: [
    {
      slot: "WORKSHOP_MURAL_MAIN",
      place: "lead",
      alt: "An artist airbrushing a photoreal classic car mural on the wall of an automotive workshop"
    },
    {
      slot: "PORSCHE_PORTRAIT",
      place: "side",
      alt: "Black-and-white photoreal artwork reading McQueen Drives Porsche: a driver's portrait above a number 48 racing car"
    }
  ]
} as const;

/** 04. BMW / Binance Blockchain Week */
export const bmw = {
  eyebrow: "BMW M5 TOURING / DUBAI, 2025",
  title: "LIVE VEHICLE PAINTING.",
  body: [
    "As part of AGMC's activation at Binance Blockchain Week 2025, Alexis live-painted a BMW M5 Touring outside Dubai's Coca-Cola Arena.",
    "Visitors could watch the spray-painted artwork take shape directly on the vehicle."
  ],
  also: "Our automotive projects have also included artwork for a BMW booth at the 1 Billion Followers Summit in Dubai.",
  /** The editorial link: AGMC's own article about the event. The arrow is drawn separately, hidden from screen readers. */
  article: {
    label: "FEATURED BY AGMC: READ THE ARTICLE",
    arrow: "→",
    href: "https://www.agmc.com/en/news/agmc-supported-the-future-of-blockchain-with-binance-blockchain-week-2025"
  },
  alt: "A BMW painted live during Binance Blockchain Week: an artist at work on the hood, then close views of the finished livery",
  detailAlt: "The finished BMW M5 Touring with a hand-painted blue and yellow graffiti livery, outdoors with a city skyline behind it"
} as const;

/** 05. Large-scale exterior mural */
export const exterior = {
  eyebrow: "PRIVATE COMMISSION / EXTERIOR MURAL",
  title: "THE SPIRIT OF ECSTASY, AT ARCHITECTURAL SCALE.",
  body: [
    "For this private commission, we painted a large-scale interpretation of the Rolls-Royce Spirit of Ecstasy on the exterior of a building.",
    "The sculptural form was translated into a bold black-and-white composition, using sharp contrasts and chrome-like highlights to give the artwork its depth.",
    "A familiar automotive icon, approached as an original piece of mural art."
  ],
  alt: "The finished mural seen in full: a winged figure on a pedestal covering a building wall, with scaffolding at its side",
  /** The one-word tag on the second picture: it says which wall state that picture shows, it is not copy. */
  beforeLabel: "BEFORE",
  beforeAlt: "The wall before the mural was painted"
} as const;

/** 06. Jetour + iCAUR */
export const launch = {
  eyebrow: "AUTOMOTIVE LAUNCHES / LIVE PAINTING",
  headline: "PAINTED LIVE, IN FRONT OF THE AUDIENCE.",
  jetour: {
    name: "JETOUR",
    body: "Bold graphic artwork painted directly onto the vehicle during a live automotive event.",
    alt: "Live graffiti artwork being painted on a Jetour SUV at a launch event"
  },
  /** Mixed case on purpose: the marque is written iCAUR, so this title is never upper-cased. */
  icaur: {
    name: "iCAUR",
    body: "Arabic calligraphy painted directly onto the vehicle during the launch.",
    alt: "Arabic calligraphy hand-painted on an iCAUR SUV at a launch event"
  }
} as const;

/** 07. About Impact Murals. The first paragraph is the lead, the others follow it. */
export const about = {
  headline: "ARTIST-LED. PROJECT-DRIVEN.",
  body: [
    "Impact Murals is a Dubai-based art studio led by Alexis, a French artist and creative director with 15 years of hands-on experience.",
    "We bring together a carefully selected team of artists and production specialists according to the style, technique and scale of each project.",
    "Alexis leads the creative direction and remains involved throughout production, whether painting himself or directing a larger team."
  ]
} as const;

/** 08. How we work. Budget is mentioned here, in the proposal step, and nowhere else. */
export const process = {
  headline: "HOW WE WORK.",
  steps: [
    {
      title: "THE BRIEF",
      body: "We discuss the idea, the space or vehicle, the timeline and what the project needs to achieve."
    },
    {
      title: "THE PROPOSAL",
      body: "We define the artistic approach, scope, production requirements and budget, then provide a clear proposal for approval."
    },
    {
      title: "THE ARTWORK",
      body: "Once the project is confirmed, we develop the artwork for your review. The agreed revision process gives you the opportunity to refine the design before production begins."
    },
    {
      title: "THE EXECUTION",
      body: "We coordinate preparation, production and painting, working with the right artists and techniques for the project."
    }
  ]
} as const;

/** 09. Closing */
export const contact = {
  headline: "LET'S TALK IDEAS.",
  body: [
    "Have a space, a vehicle or an upcoming event in mind?",
    "Let's discuss what we could create for it. A short call is usually the easiest way to explore the possibilities and work out an approach that fits your project."
  ],
  /** Secondary link, to the studio's main site (the site root, wherever this page is served from). */
  site: { label: "EXPLORE IMPACT MURALS", arrow: "→" },
  /** Labels of the direct routes, whose values come from src/content/global.ts. */
  whatsapp: "WHATSAPP",
  email: "EMAIL",
  location: "Dubai, UAE"
} as const;
