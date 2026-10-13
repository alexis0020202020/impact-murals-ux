/**
 * /custom-canvas-art-dubai/: page copy.
 *
 * Final English copy from docs/money-pages/03-custom-canvas-art-dubai.md. Real
 * imagery is the studio's own: one finished portrait (labelled only as "Original
 * artwork", its medium not confirmed) and one real canvas painted from pencil to
 * finish. No client, artist credit, size, place or price is invented: a wall
 * label shows only what is confirmed. The "selected works" and the credited
 * gallery of different approaches wait for confirmed credits (see
 * docs/money-pages/IMPLEMENTATION.md). Presentation lives in
 * src/components/money/pages/CustomCanvas.astro.
 */
import type { Closing, Faq, GuideRef, PageCta, Step } from "./types";

export interface CommissionType {
  name: string;
  glyph: "statement" | "oversized" | "triptych" | "coordinated";
  text: string;
}

export const cc = {
  hero: {
    statement: "PAINTED BY HAND, FOR ONE WALL.",
    support:
      "Original canvas paintings commissioned for commercial spaces and private interiors in Dubai and the UAE. A statement work, an oversized canvas, a diptych or a series, by the artist whose language suits the room.",
    qualifier: "ORIGINAL PAINT ON CANVAS. NOT A PRINT. NOT A REPRODUCTION.",
    /** The wall label beside the picture: only facts that are confirmed. */
    label: ["ORIGINAL ARTWORK", "BLACK-AND-WHITE PHOTOREAL PORTRAIT", "STUDIO WORK"]
  },

  /** 02. Material and making. */
  hand: {
    eyebrow: "MATERIAL AND MAKING",
    headline: "YOU CAN SEE THE HAND.",
    lead: "A painted canvas carries what a print cannot: texture, depth, the direction of the brush and the weight of a real object on a wall.",
    body: "Every commission is painted by an artist, on a canvas or panel built for its size."
  },

  /** 03. Commission types. */
  types: {
    eyebrow: "COMMISSIONS",
    headline: "ONE WORK OR A FAMILY OF WORKS.",
    rows: [
      { name: "STATEMENT WORK", glyph: "statement", text: "One canvas that carries the room." },
      {
        name: "OVERSIZED CANVAS",
        glyph: "oversized",
        text: "Made at the scale of the wall. A very large work may be built in sections and assembled on site."
      },
      {
        name: "DIPTYCH OR TRIPTYCH",
        glyph: "triptych",
        text: "Two or three panels that read as one image across a wall or a corner."
      },
      {
        name: "COORDINATED SERIES",
        glyph: "coordinated",
        text: "Related originals for adjacent rooms or a long route."
      }
    ] as CommissionType[],
    note: "Dimensions are shown only where we know them."
  },

  /** 04. The artist follows the room. */
  artist: {
    eyebrow: "THE ARTIST",
    headline: "THE ARTIST FOLLOWS THE ROOM.",
    lead: "We have no house style, and we do not ask you to choose from one.",
    body: "We look at the room, the brief and the people who will live with the work, then select the artist whose language fits. It might be photoreal, graphic or more experimental.",
    aside: "We would rather tell you early that a brief is a poor fit than deliver it badly.",
    approaches: ["PHOTOREAL", "GRAPHIC", "MORE EXPERIMENTAL"],
    criteriaLabel: "FOUR THINGS GUIDE THE CHOICE",
    criteria: [
      "THE SCALE OF THE WORK",
      "THE PALETTE AND LIGHT OF THE ROOM",
      "HOW CLOSE PEOPLE WILL STAND",
      "WHAT THE PIECE IS THERE TO DO"
    ]
  },

  /** 05. The room first. */
  room: {
    eyebrow: "SCALE",
    headline: "MEASURE THE ROOM BEFORE YOU CHOOSE THE SUBJECT.",
    lead: "Scale is the first decision. We work from the wall's proportions, the furniture around it, the light across the day, the viewing distance and the way people arrive in the room.",
    body: "Send a photograph and rough measurements and we will suggest a range of sizes before an artist is appointed. A visualisation for your project follows appointment, inside the agreed scope.",
    caption: "ILLUSTRATIVE ELEVATION / NOT TO SCALE."
  },

  /** 06. A design you have, or one we develop. */
  design: {
    eyebrow: "HOW WE START",
    headline: "A DESIGN YOU HAVE, OR ONE WE DEVELOP.",
    paths: [
      {
        name: "THE DESIGN EXISTS.",
        body: "You have an approved palette, scheme or artwork reference. We adapt it where the rights allow. We do not copy a living artist's signature work."
      },
      {
        name: "THE COMMISSION IS OPEN.",
        body: "You describe the room and what the piece should do. After appointment, the artist develops the work for your review."
      }
    ],
    helpsLabel: "WHAT HELPS",
    helps: ["A PHOTOGRAPH OF THE WALL", "ITS DIMENSIONS, OR \"UNSURE\"", "A PALETTE OR REFERENCES", "YOUR DEADLINE"]
  },

  /** 07. Approval and production. */
  production: {
    eyebrow: "PROCESS",
    headline: "HOW A COMMISSION IS PAINTED.",
    framesCaption: "STUDIO WORK / ONE SMALL CANVAS, PENCIL TO FINISH.",
    steps: [
      { title: "SCOPE AND ARTIST", body: "We define the commission and select the artist." },
      { title: "APPOINTMENT", body: "You appoint us; development begins." },
      { title: "DEVELOPMENT AND REVIEW", body: "The artwork is developed for your review. Review rounds are set in the scope." },
      { title: "PAINTING", body: "Progress is shared at the stages agreed in the scope." },
      { title: "FINISH AND FINAL APPROVAL", body: "The finished work is reviewed before delivery." }
    ] as Step[],
    note: "Revisions are a scope term, not an open promise: how many review rounds, at which stage, before painting begins."
  },

  /** 08. Framing, packing and installation. */
  delivery: {
    eyebrow: "DELIVERY",
    headline: "FINISH, FRAME, DELIVER.",
    lead: "What is included is stated in the proposal. Framing or edge finish, protective packing, transport and installation are separate lines of scope, supplied by the studio or by a specialist, never assumed.",
    body: "Fixings, access and wall conditions are reviewed before the work is delivered, so the piece arrives ready to hang.",
    lines: ["FRAMING OR EDGE FINISH", "PROTECTIVE PACKING", "TRANSPORT", "INSTALLATION"]
  },

  /** 10. Cost and time. */
  costs: {
    eyebrow: "COST AND TIME",
    headline: "WHAT DETERMINES COST AND TIME.",
    cost: {
      title: "COST",
      body: "Cost follows the artist, the size, the medium and level of detail, the number of works, the creative scope, the finish, framing, transport and installation, and the deadline."
    },
    time: {
      title: "TIME",
      body: "A painting cannot be hurried past its drying and finishing. Size, detail and the artist's method set the schedule, and your deadline sets what is feasible. We confirm both in the proposal."
    }
  },

  faq: {
    eyebrow: "QUESTIONS",
    headline: "ABOUT THE COMMISSION.",
    items: [
      {
        q: "Is this an original painting or a print?",
        a: "An original, painted by hand by an artist. Photo-to-canvas printing and ready-made décor are different products, and not what this page covers."
      },
      {
        q: "How is the artist chosen?",
        a: "By the brief. We select the artist whose language fits the room, the scale and the purpose, or work with an artist you already have in mind. There is no catalogue of house styles."
      },
      {
        q: "Do you take both commercial and private commissions?",
        a: "Yes: hotels, workplaces, retail interiors, residences and development projects, from a single piece to a small family of works."
      },
      {
        q: "How large can a canvas be?",
        a: "As large as the wall and the access allow. Very large works may be built in sections and assembled on site. We review the wall, the access and the handling before proposing a size."
      },
      {
        q: "Can you match our palette or an existing design?",
        a: "Yes. Send the palette, scheme or references. We adapt an approved direction where the rights allow, and we do not copy a living artist's signature work."
      },
      {
        q: "Do we see a concept first, and how do revisions work?",
        a: "The concept comes after appointment, inside the agreed scope. Review rounds and the stage at which each takes place are set in the scope. They are not unlimited."
      },
      {
        q: "Are framing and installation included?",
        a: "They are scoped separately and never assumed. The proposal states what the studio supplies and what a specialist supplies."
      },
      {
        q: "How long does it take?",
        a: "It depends on size, detail, the artist's method and drying and finishing time. The proposal gives a programme, and we say plainly if a deadline is not feasible."
      },
      {
        q: "Who owns the work, and is it signed?",
        a: "Ownership of the physical painting, any right to reproduce the image, the artist's credit and the signature are agreed in the commission. We do not assume them."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "READ BEFORE YOU BRIEF.",
    items: [
      {
        href: "/guides/commissioned-artwork-for-commercial-interior-design-studios-in-the-uae/",
        title: "Commissioned artwork for interior design studios",
        why: "How a design studio briefs and specifies an original."
      },
      {
        href: "/guides/commissioned-artwork-for-hotel-owners-operators-in-the-uae/",
        title: "Commissioned artwork for hotels",
        why: "Commissioning for owners and operators."
      },
      {
        href: "/guides/commissioned-artwork-for-residential-communities-community-managers-in-the-uae/",
        title: "Commissioned artwork for residential communities",
        why: "Commissioning for community managers."
      },
      {
        href: "/guides/commissioned-artwork-for-private-clinics-patient-facing-healthcare-spaces-in-the-uae/",
        title: "Commissioned artwork for private clinics",
        why: "Commissioning for patient-facing spaces."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "SEND US THE WALL.",
    lead: "A photograph of the space is the most useful thing you can send.",
    body: "Rough measurements help, \"unsure\" is fine, and so is an idea that is still taking shape."
  } as Closing,

  cta: {
    primary: "Discuss a Canvas Commission",
    secondaryWhatsApp: "Send a Photo of the Wall on WhatsApp",
    secondaryEmail: "Email a Photo of the Wall",
    whatsapp:
      "Hello Impact Murals, I would like to discuss a canvas commission.\nSpace:\nApproximate size:\nDeadline:\n(I will send a photograph of the wall in my next message.)",
    emailSubject: "Canvas commission enquiry",
    emailBody:
      "Hello Impact Murals,\n\nI would like to discuss a canvas commission.\n\nSpace (workplace, hotel, retail, residence, other):\nCity:\nApproximate size (or unsure):\nNumber of works:\nPalette or references:\nDeadline:\n\nI have attached a photograph of the wall.\n",
    track: "custom_canvas"
  } as PageCta
};
