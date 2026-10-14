/**
 * /art-installations-dubai/: page copy.
 *
 * Final English copy from docs/money-pages/06-art-installations-dubai.md. This
 * is the most claim-sensitive page of the batch: the studio has no documented
 * spatial installation, so the copy claims artistic direction and coordination
 * only, never in-house fabrication, engineering sign-off, or any specific
 * material, suspended or outdoor scope. Every drawing is labelled illustrative
 * and every dimension on one is left blank ("H ___ M") because the site sets
 * it. The one real image is captioned as scaffold access on a mural, not as an
 * installation. The "selected work" module is absent until a documented piece
 * exists. Presentation lives in
 * src/components/money/pages/ArtInstallations.astro.
 */
import type { Closing, FactorGroup, Faq, GuideRef, PageCta, Step } from "./types";

export type SiteKind = "niche" | "atrium" | "route" | "column" | "temporary";
export type FrameKind = "site" | "material" | "fixing" | "sample" | "care" | "install";

export interface SiteRow {
  name: string;
  kind: SiteKind;
  text: string;
  note: string;
}

export interface Checkpoint {
  n: string;
  kind: FrameKind;
  name: string;
  text: string;
}

export interface Function {
  name: string;
  text: string;
  /** The studio's own row, drawn with an accent rule. */
  own?: boolean;
}

export const ins = {
  hero: {
    statement: "A NEW WORK, MADE FOR THIS SITE.",
    support:
      "Site-specific art installations for brands and spaces in Dubai and the UAE. We direct the artwork, select the artist and coordinate the specialists who make it buildable. We commission original work. We do not hang existing pictures.",
    block: [
      { label: "TYPE", value: "ORIGINAL COMMISSION" },
      { label: "SCOPE", value: "TEMPORARY OR PERMANENT" },
      { label: "REGION", value: "DUBAI AND UAE" }
    ],
    caption: "ILLUSTRATIVE / ELEVATION OF AN ABSTRACT SPACE."
  },

  /** 02. What the site can take. */
  sites: {
    eyebrow: "THE SITE",
    headline: "WHAT THE SITE CAN TAKE.",
    lead: "An installation starts with a real place. The form is decided after the site and the brief are understood. It might be a painted or mixed-media wall feature, work developed across panels, a dimensional piece, or a suspended or freestanding element, within what the artist and the specialists can deliver.",
    rows: [
      {
        name: "A NICHE OR A VOID",
        kind: "niche",
        text: "An integrated piece made for the opening.",
        note: "H ___ M / W ___ M"
      },
      {
        name: "AN ATRIUM OR DOUBLE HEIGHT",
        kind: "atrium",
        text: "A suspended or tall freestanding form.",
        note: "H ___ M / W ___ M"
      },
      {
        name: "A CIRCULATION ROUTE",
        kind: "route",
        text: "Work that develops as you walk it.",
        note: "L ___ M"
      },
      {
        name: "COLUMNS AND ARCHITECTURAL ELEMENTS",
        kind: "column",
        text: "Work that wraps or integrates.",
        note: "H ___ M / W ___ M"
      },
      {
        name: "A TEMPORARY SPACE",
        kind: "temporary",
        text: "An installation for an opening, a campaign or a festival.",
        note: "AREA ___ M²"
      }
    ] as SiteRow[],
    noteLabel: "ILLUSTRATIVE SKETCHES. EVERY DIMENSION IS SET BY THE SITE."
  },

  /** 03. One site, two ways in. */
  start: {
    eyebrow: "HOW WE START",
    headline: "ONE SITE, TWO WAYS IN.",
    paths: [
      {
        name: "AN OPEN CONCEPT.",
        body: "You have a site and an objective. We develop the idea, choose the artist and define the form."
      },
      {
        name: "AN EXISTING DIRECTION.",
        body: "An artist, a concept or a design package already exists. We help make it buildable and coordinate its production."
      }
    ],
    note: "Plans, elevations, photographs and material samples are enough to begin. Concept work for your site follows appointment and sits inside the agreed scope.",
    designers: { lead: "A design team?", label: "See the collaboration workflow", href: "/art-for-interior-designers-dubai/" }
  },

  /** 04. How the idea becomes buildable: the centrepiece. */
  buildable: {
    eyebrow: "BUILDABILITY",
    headline: "FROM IDEA TO SOMETHING THAT STANDS.",
    lead: "The idea is the easy part to approve. The joints are where an installation is won or lost: a weight no one checked, a fixing no one owns, an access route nobody walked. We work through those questions with the artist before anything is made.",
    caption: "ILLUSTRATIVE DEVELOPMENT / ONE ABSTRACT FORM, SURVEY TO INSTALLED.",
    points: [
      { n: "01", kind: "site", name: "SITE", text: "Dimensions, structure readiness, light and key views." },
      { n: "02", kind: "material", name: "MATERIAL", text: "What it is made of, its weight, finish and exposure." },
      { n: "03", kind: "fixing", name: "FIXING", text: "How it attaches, and who is responsible for the fixing." },
      { n: "04", kind: "sample", name: "SAMPLE OR PROTOTYPE", text: "A physical test before the commitment." },
      {
        n: "05",
        kind: "care",
        name: "MAINTENANCE AND LIFETIME",
        text: "Cleaning, access for care, and how long it is meant to last."
      },
      { n: "06", kind: "install", name: "INSTALLATION", text: "Transport, lifting, the access route and the window." }
    ] as Checkpoint[]
  },

  /** 05. Who is responsible for what. A real table. */
  matrix: {
    eyebrow: "RESPONSIBILITY",
    headline: "WHO IS RESPONSIBLE FOR WHAT.",
    columns: { function: "FUNCTION", responsibility: "RESPONSIBILITY" },
    rows: [
      {
        name: "IMPACT MURALS",
        text: "Artistic direction, artist selection, coordination of the specialists, production planning and the artistic review.",
        own: true
      },
      { name: "THE ARTIST", text: "Authorship and concept, and the hands-on making of their own elements." },
      { name: "FABRICATOR", text: "Structural and dimensional elements made to drawings, as the work requires." },
      { name: "ENGINEER", text: "Structural sign-off on loads and fixings, where the work needs it." },
      { name: "LIGHTING AND ELECTRICAL", text: "Where the work is lit or powered." },
      { name: "INSTALLER", text: "Transport, lifting, rigging and fixing." },
      { name: "SITE OWNER OR CONTRACTOR", text: "Readiness of the structure, access and building approvals." }
    ] as Function[],
    note: "Where a piece needs engineering sign-off, a qualified engineer appointed for the project provides it. Impact Murals does not certify structures. Each proposal names who does what. Not every project needs every role."
  },

  /** 06. For a week, or for years. */
  time: {
    eyebrow: "TIME",
    headline: "FOR A WEEK, OR FOR YEARS.",
    tracks: [
      {
        name: "TEMPORARY",
        text: "Built for dates: an opening, a campaign, a festival. Installation and strike windows, storage, reuse, and materials chosen for the duration.",
        span: "short"
      },
      {
        name: "PERMANENT",
        text: "Built to remain: fixings meant to last, maintenance and cleaning access, and exposure over time.",
        span: "long"
      }
    ],
    axis: "TIME",
    closing: {
      lead: "A permanent work in a public space is a",
      label: "Public Art commission",
      href: "/what-we-do/public-art/"
    }
  },

  /** 07. Meeting the architecture. */
  building: {
    eyebrow: "THE BUILDING",
    headline: "MEETING THE ARCHITECTURE.",
    body: "A piece has to meet ceilings, floors, services and sightlines without fighting them. We review the interface between the work and the building: structure, finishes, lighting, ceiling services, circulation and access. Sample and mock-up reviews are set into the programme, and the structure and the access route must be ready before installation, not during it.",
    caption: "ILLUSTRATIVE INTERFACE / NOT A REAL BUILDING.",
    legend: ["CEILING SERVICES", "STRUCTURE", "LIGHTING", "SIGHTLINE", "ACCESS"]
  },

  /** 08. Making it, and putting it up. */
  production: {
    eyebrow: "PRODUCTION",
    headline: "MAKING IT, AND PUTTING IT UP.",
    steps: [
      { title: "APPROVED CONCEPT OR SAMPLE", body: "" },
      { title: "SPECIALIST PRODUCTION", body: "" },
      { title: "QUALITY CHECKS", body: "" },
      { title: "SITE READINESS", body: "" },
      { title: "INSTALLATION", body: "" },
      { title: "AGREED HANDOVER AND CARE", body: "" }
    ] as Step[],
    note: "Handover is defined in the proposal: what is recorded, what care notes are written and who holds them."
  },

  /** 10. What a reliable proposal needs. */
  fee: {
    eyebrow: "THE FEE",
    headline: "WHAT A RELIABLE PROPOSAL NEEDS.",
    lead: "Fees follow artistic and design development, the material, engineering and prototyping, fabrication, transport and lifting, installation, exposure and programme.",
    body: "Until the site is known we can give a feasibility view, not a price. To go further we need photographs and dimensions of the site, whether the work is temporary or permanent, any structure or fixing information, the access route and the target date.",
    groups: [
      {
        title: "WHAT DRIVES THE FEE",
        items: [
          "Artistic and design development",
          "The material",
          "Engineering and prototyping",
          "Fabrication",
          "Transport and lifting",
          "Installation",
          "Exposure",
          "Programme"
        ]
      },
      {
        title: "WHAT WE NEED FROM YOU",
        items: [
          "Photographs and dimensions of the site",
          "Whether the work is temporary or permanent",
          "Any structure or fixing information",
          "The access route",
          "The target date"
        ]
      }
    ] as FactorGroup[]
  },

  faq: {
    eyebrow: "QUESTIONS",
    headline: "WHAT TO SETTLE FIRST.",
    items: [
      {
        q: "Is this commissioning, or installing art you already own?",
        a: "Commissioning: a new work made for the site. Hanging or placing existing artworks is a different service."
      },
      {
        q: "Can it be temporary or permanent?",
        a: "Both. The choice shapes materials, fixings, care and who is responsible for each."
      },
      {
        q: "Can we bring our own artist?",
        a: "Yes. We can work with an artist you already have, or select one by the brief, the site and the form the work will take. Either way we coordinate the specialists the idea needs."
      },
      {
        q: "Can you produce an installation from an approved concept?",
        a: "Yes. We assess buildability, define the production route and coordinate the specialists. We tell you what may need to change to make the concept stand."
      },
      {
        q: "Which parts do you make yourselves?",
        a: "It depends on the work. The artist makes what the artist should make. Structural and dimensional elements are produced by fabricators suited to the material, coordinated by us. The proposal names who produces what before you appoint."
      },
      {
        q: "Who is responsible for engineering and fixings?",
        a: "Qualified specialists appointed for the project, as the work requires. We separate the artistic feasibility review from technical certification, in writing."
      },
      {
        q: "Will we see a sample or prototype?",
        a: "Where the form, the material or the risk calls for it, a sample or prototype is scoped and approved before production."
      },
      {
        q: "How are access, transport and installation handled?",
        a: "They are reviewed during feasibility and scoped as their own lines. The structure and the access route must be ready before installation starts."
      },
      {
        q: "What is handed over, and how long does it take?",
        a: "A record of the work and care notes, as defined in the proposal. The timeline depends on the concept, the materials, the approvals and the site, and we give a programme once the site is known."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "BUILDABILITY GUIDES.",
    items: [
      {
        href: "/guides/art-installations-artistic-environments-for-commercial-interior-design-studios-in-the-uae/",
        title: "Art installations for interior design studios",
        why: "Briefing and coordinating a work with a design team."
      },
      {
        href: "/guides/art-installations-artistic-environments-for-hotel-owners-operators-in-the-uae/",
        title: "Art installations for hotels",
        why: "For owners and operators."
      },
      {
        href: "/guides/art-installations-artistic-environments-for-residential-communities-community-managers-in-the-uae/",
        title: "Art installations for residential communities",
        why: "For community managers."
      },
      {
        href: "/guides/art-installations-artistic-environments-for-property-developers-permanent-common-area-art-in-the-uae/",
        title: "Permanent installations in developments",
        why: "Common-area art meant to remain."
      },
      {
        href: "/guides/art-installations-artistic-environments-for-seasonal-destinations-themed-attractions-in-the-uae/",
        title: "Temporary installations for seasonal destinations",
        why: "Art built for a season."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "WHAT HAS TO STAND, AND WHERE?",
    lead: "The location, the type of space, the objective, whether it is temporary or permanent, a target date and rough dimensions.",
    body: "Plans and photographs help. Technical details can wait until we have scoped the work."
  } as Closing,

  cta: {
    primary: "Discuss an Art Installation",
    secondaryWhatsApp: "Send the Site Brief on WhatsApp",
    secondaryEmail: "Email the Site Brief",
    whatsapp: "Hello Impact Murals, I would like to discuss a site-specific installation.\nSite:\nTemporary or permanent:\nDate:",
    emailSubject: "Art installation enquiry",
    emailBody:
      "Hello Impact Murals,\n\nI would like to discuss a site-specific installation.\n\nMy role:\nCity and site type:\nWhat the work is for:\nTemporary, permanent or undecided:\nTarget date:\nApproximate dimensions (or unsure):\nIntended medium (or open brief):\nExisting concept or artist:\n",
    track: "art_installations"
  } as PageCta
};
