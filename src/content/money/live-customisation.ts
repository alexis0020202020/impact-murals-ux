/**
 * /live-customisation-dubai/: page copy.
 *
 * Final English copy from docs/money-pages/05-live-customisation-dubai.md. The
 * studio has no footage of an object being customised live, so the page claims
 * no customisation delivery: its pictures are drawings, each labelled
 * illustrative, and the places for real photographs (material tests, a real
 * station) are marked as such. No throughput figure, fee or technique beyond
 * hand painting, illustration and lettering is stated, and a "tested on" note
 * appears only once a material pair has really been tested. The credited
 * "selected applications" module is absent until a brand agrees to one.
 * Presentation lives in src/components/money/pages/LiveCustomisation.astro.
 */
import type { Closing, Faq, GuideRef, PageCta, Step } from "./types";

export type Vignette =
  | "plain"
  | "painting"
  | "finished"
  | "paint"
  | "line"
  | "lettering"
  | "choose"
  | "set"
  | "pack"
  | "collect";

export interface Technique {
  name: string;
  glyph: Vignette;
  text: string;
}

export interface FlowStep {
  n: string;
  label: string;
  glyph: Vignette;
  text: string;
  /** A stage the guest waits through: drawn on a hatched band. */
  waiting?: boolean;
}

export interface Column {
  name: string;
  text: string;
}

export const lc = {
  hero: {
    statement: "MADE BY HAND, FOR THE PERSON HOLDING IT.",
    support:
      "Artist-led live customisation for retail launches, brand events and VIP experiences in Dubai and the UAE. Hand painting, illustration and lettering on your products, planned around the material and the guest flow.",
    qualifier: "Every piece is finished by an artist, by hand. This is not a print or engraving station.",
    micro: "Date, product and guest numbers are enough to start. A photograph of the product helps.",
    hands: ["THE ARTIST", "THE OBJECT", "THE GUEST"],
    sceneCaption: "ILLUSTRATIVE STATION / THREE HANDS, ONE OBJECT."
  },

  /** 02. What guests receive. */
  receive: {
    eyebrow: "WHAT GUESTS RECEIVE",
    headline: "ONE OBJECT BECOMES THEIRS.",
    body: "A guest chooses from a short menu. The artist makes the object theirs while they watch. They leave with a piece nobody else has, and the memory of how it was made. The design can be a painted motif, a drawn detail or their name in lettering.",
    frames: [
      { kind: "plain", label: "SUPPLIED BY THE BRAND" },
      { kind: "painting", label: "IN THE ARTIST'S HAND" },
      { kind: "finished", label: "FINISHED" }
    ] as Array<{ kind: Vignette; label: string }>,
    caption: "ILLUSTRATION / ONE OBJECT, BEFORE, DURING AND AFTER."
  },

  /** 03. Techniques and surfaces. */
  techniques: {
    eyebrow: "TECHNIQUES",
    headline: "TECHNIQUES, MATCHED TO THE MATERIAL.",
    rows: [
      { name: "HAND PAINTING", glyph: "paint", text: "Colour and form applied directly by the artist." },
      { name: "ILLUSTRATION", glyph: "line", text: "Drawn line work and detail." },
      {
        name: "LETTERING AND CALLIGRAPHY",
        glyph: "lettering",
        text: "Names, words or Arabic calligraphy, by hand."
      }
    ] as Technique[],
    /** The sentence naming common starting points; each product word links to its own guide. */
    starting: {
      lead: "",
      links: [
        { word: "Footwear", href: "/guides/live-sneaker-customisation-brand-activations-dubai/" },
        { word: "jackets", href: "/guides/live-denim-jacket-customisation-events-retail-activations/" },
        { word: "bags and small leather goods", href: "/guides/live-bag-pouch-small-leather-goods-painting-events/" },
        { word: "packaging", href: "/guides/live-packaging-customisation-product-launches-retail-activations/" },
        { word: "bottles", href: "/guides/live-perfume-bottle-painting-fragrance-brand-activations/" }
      ],
      tail: "Whether a technique suits a material is confirmed by a sample, never assumed."
    },
    notOffered: "Machine printing, laser engraving and hot foil are different services, and not what this page offers."
  },

  /** 04. Where it sits in a programme. */
  programme: {
    eyebrow: "OCCASIONS",
    headline: "WHERE IT SITS IN A PROGRAMME.",
    rows: [
      {
        name: "RETAIL LAUNCHES AND CLIENTELING",
        text: "A private appointment becomes a personal one."
      },
      {
        name: "LUXURY AND VIP EVENTS",
        text: "A small room, an unhurried artist, a considered piece."
      },
      {
        name: "FRAGRANCE AND BEAUTY",
        text: "Bottles, boxes and cases made individual."
      },
      {
        name: "FASHION AND ACCESSORIES",
        text: "Footwear, bags and small goods finished by hand."
      },
      {
        name: "GIFTING AND CORPORATE HOSPITALITY",
        text: "Something made for the person, not for the whole group."
      }
    ] as Column[],
    footer: { lead: "Painting a vehicle is a different brief.", label: "See Automotive", href: "/automotive/" }
  },

  /** 05. Guest journey. */
  flow: {
    eyebrow: "GUEST JOURNEY",
    headline: "FROM CHOICE TO COLLECTION.",
    steps: [
      { n: "1", label: "CHOOSE", glyph: "choose", text: "The guest picks from a short menu." },
      { n: "2", label: "MAKE", glyph: "painting", text: "The artist works while they watch." },
      { n: "3", label: "SET", glyph: "set", text: "The piece dries or finishes.", waiting: true },
      { n: "4", label: "PACK", glyph: "pack", text: "It is wrapped under your brand.", waiting: true },
      { n: "5", label: "COLLECT", glyph: "collect", text: "The guest takes it, or it is delivered." }
    ] as FlowStep[],
    note: "The wait guests notice is often drying and collection, not painting, so we plan them as a flow of their own.",
    caption: "ILLUSTRATIVE FLOW / THE HATCHED BAND IS THE WAITING."
  },

  /** 06. Capacity and station design. */
  capacity: {
    eyebrow: "CAPACITY",
    headline: "HOW MANY CAN WE FINISH?",
    lead: "Throughput is the honest question, so we answer it first. We work it out from your brief, not from a number quoted in the abstract: how long an approved design really takes on your product, how many artists and stations the space allows, how many guests arrive at once, and the time lost to breaks, handling and rework.",
    body: "A short, tested menu moves faster than unlimited choice. Unlimited choice suits a small VIP room.",
    closing: "We do not promise a number until the design has been tested on your product.",
    planCaption: "ILLUSTRATIVE STATION LAYOUT / EXAMPLE ONLY.",
    stops: ["QUEUE", "MENU", "STATION", "DRYING", "PACKING", "COLLECTION"],
    menu: {
      label: "ILLUSTRATIVE MENU",
      title: "CHOOSE ONE",
      options: ["A SMALL MOTIF", "A DRAWN DETAIL", "YOUR NAME IN LETTERING"]
    }
  },

  /** 07. Who supplies what, and how we test. */
  responsibility: {
    eyebrow: "PRODUCT AND SAMPLES",
    headline: "WHO SUPPLIES WHAT, AND HOW WE TEST.",
    columns: [
      {
        name: "YOUR SIDE",
        text: "The products, the stock including spares for damage or rework, and any manufacturer guidance on the material."
      },
      {
        name: "OUR SIDE",
        text: "The artist or artists, the materials, test pieces, the handling plan and the finish."
      },
      {
        name: "TOGETHER",
        text: "Sample approval, menu approval, and who is responsible if a piece is damaged."
      }
    ] as Column[],
    body: "We test on your actual product before any menu is promised. Samples are developed after appointment, or in an agreed paid test, so you are never asked to approve speculative work. We do not promise water or wear resistance beyond what the tested finish supports."
  },

  /** 08. What the station needs. */
  needs: {
    eyebrow: "SET-UP",
    headline: "WHAT THE STATION NEEDS.",
    items: [
      "TABLES AND SEATING",
      "LIGHT",
      "POWER, WHERE THE SET-UP NEEDS IT",
      "FLOOR AND SURFACE PROTECTION",
      "STORAGE FOR STOCK AND FINISHED PIECES",
      "A PACKING AREA",
      "LOAD-IN AND STRIKE WINDOWS",
      "VENUE RULES ON MATERIALS AND VENTILATION"
    ]
  },

  /** 09. Tested before it is promised. */
  process: {
    eyebrow: "PROCESS",
    headline: "TESTED BEFORE IT IS PROMISED.",
    steps: [
      { title: "BRIEF", body: "The date, the product, the guests and the venue." },
      { title: "FEASIBILITY", body: "Product, volume and window checked against what an artist can do." },
      { title: "APPOINTMENT", body: "Scope agreed." },
      { title: "SAMPLE AND MENU APPROVAL", body: "Tested on your product, then approved." },
      { title: "EVENT PLAN", body: "Stations, flow, stock, packing and strike." },
      { title: "LIVE DELIVERY", body: "The artists and the team on the day." }
    ] as Step[]
  },

  /** 10. The fee, and when not to go live. */
  fee: {
    eyebrow: "THE FEE",
    headline: "THE FEE, AND WHEN NOT TO GO LIVE.",
    lead: "The fee follows the technique, the quantity, the complexity of the menu, the number of artists and stations, the hours, the samples, the stock and packaging, the venue and the finish.",
    columns: [
      { name: "LIVE", text: "When the interaction is the experience." },
      {
        name: "PRE-PRODUCED",
        text: "When the object carries more weight than the process: a hero piece, a gift, a small edition."
      }
    ] as Column[],
    closing: {
      lead: "Both can sit in one project. For pre-produced hero pieces and editions, see",
      first: { label: "Artist Collaborations", href: "/what-we-do/art-for-brands/artist-collaborations/" },
      joiner: "and",
      second: { label: "Commissioned Brand Artwork", href: "/what-we-do/art-for-brands/commissioned-brand-artwork/" }
    }
  },

  faq: {
    eyebrow: "QUESTIONS",
    headline: "THE PRACTICAL QUESTIONS.",
    items: [
      {
        q: "Which products and materials can be customised?",
        a: "Footwear, bags and small leather goods, accessories, packaging, bottles and gifts are common. Whether a technique suits a material is confirmed with a sample, never assumed."
      },
      {
        q: "Who supplies the products?",
        a: "Usually the brand, including spares. Stock, packaging and responsibility for damage are agreed in the proposal."
      },
      {
        q: "Which techniques do you offer?",
        a: "Hand painting, illustration, and lettering or calligraphy. Printing, laser engraving and hot foil are different services."
      },
      {
        q: "How is it tested and approved?",
        a: "We test the technique on your actual product, then approve a short menu with you. Both steps follow appointment, or an agreed paid test."
      },
      {
        q: "How many pieces can be finished in the event window?",
        a: "It depends on the design, the product, the number of artists and stations and how guests arrive. An illustrative figure is not a tested one. We give a number only after the design has been tested on your product."
      },
      {
        q: "How many artists and stations will we need?",
        a: "That is set from the tested time per piece and the expected arrival pattern, with allowances for breaks and rework. More stations shorten queues but need space and stock."
      },
      {
        q: "How are drying and collection handled?",
        a: "As their own flow: time or racks for setting, packing, and collection or delivery. Some pieces can go home at once. Others are collected later or delivered. The plan says which."
      },
      {
        q: "What if a product is damaged or the manufacturer restricts the material?",
        a: "Spares are planned for rework, responsibilities are agreed in the proposal, and any manufacturer or safety restriction is confirmed before production."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "THE FLOW, IN DETAIL.",
    items: [
      {
        href: "/insights/choose-right-product-live-customisation-activation/",
        title: "Choosing the right product for live customisation",
        why: "Which products suit a live station."
      },
      {
        href: "/insights/calculate-guest-throughput-live-art-activation/",
        title: "Calculating guest throughput",
        why: "How a live art activation is sized."
      },
      {
        href: "/insights/why-product-material-testing-live-customisation/",
        title: "Why material testing comes first",
        why: "What a sample proves before a menu is promised."
      },
      {
        href: "/insights/manage-wet-paint-drying-guest-collection-live-event/",
        title: "Managing drying and guest collection",
        why: "Wet paint, racks and handover."
      },
      {
        href: "/insights/how-many-artists-customisation-stations-event-needs/",
        title: "How many artists and stations an event needs",
        why: "Staffing a station for the room."
      },
      {
        href: "/insights/queue-management-live-customisation-events/",
        title: "Queue management for live customisation",
        why: "Keeping the line moving."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "SHOW US THE PRODUCT.",
    lead: "The product, how many guests, the hours and the venue.",
    body: "A photograph of the product helps most. If you are not sure which technique suits it, ask us to recommend one."
  } as Closing,

  cta: {
    primary: "Discuss a Live Customisation Event",
    secondaryWhatsApp: "Send the Product on WhatsApp",
    secondaryEmail: "Email the Product Brief",
    whatsapp: "Hello Impact Murals, I would like to discuss live customisation for an event.\nDate:\nProduct:\nGuests:\nHours:",
    emailSubject: "Live customisation enquiry",
    emailBody:
      "Hello Impact Murals,\n\nI would like to discuss live customisation for an event.\n\nBrand or agency:\nDate (or unknown):\nVenue and city:\nProduct, material and a photograph:\nQuantity, guest estimate and hours:\nTechnique (or recommend one):\nWhat the live interaction is for:\n",
    track: "live_customisation"
  } as PageCta
};
