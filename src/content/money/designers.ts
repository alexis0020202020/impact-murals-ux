/**
 * /art-for-interior-designers-dubai/: page copy.
 *
 * Final English copy from docs/money-pages/07-art-for-interior-designers-dubai.md.
 * The page claims no design-team partnership: its drawings (the plan, the two
 * specimen documents, the workflow) are labelled illustrative, its one real
 * image is a hand-painted mural captioned as exactly that, and the credited
 * "selected collaborations" module is absent until a design team agrees to a
 * credit. Nothing here marks the studio as an interior designer or architect.
 * Presentation lives in src/components/money/pages/Designers.astro.
 */
import type { Closing, Faq, GuideRef, PageCta, Step } from "./types";

export interface Doc {
  title: string;
  columns: string[];
  rows: string[][];
}

export interface Format {
  name: string;
  text: string;
  href: string;
}

export interface Project {
  name: string;
  href: string;
}

export interface Signoff {
  name: string;
  text: string;
}

export interface Lane {
  name: string;
  /** For each gate, in order: "signs" (signs off), "submits" (prepares and submits for review) or "" (not at this gate). */
  marks: Array<"signs" | "submits" | "">;
}

export const ds = {
  hero: {
    statement: "AN ART PRODUCTION PARTNER INSIDE YOUR DESIGN TEAM.",
    support:
      "Artist-led artwork and production support for interior designers and architects in Dubai and the UAE. Involve us at concept, during design development, or when the direction is approved and needs to be made.",
    micro: "You can start without naming the client or the project.",
    caption: "ILLUSTRATIVE PLAN. ARTWORK SHOWN IS AN INDEPENDENT ORIGINAL."
  },

  /** 02. Where to involve the studio. */
  involve: {
    eyebrow: "WHEN",
    headline: "FOUR PLACES TO INVOLVE US.",
    steps: [
      {
        title: "CONCEPT",
        body: "We help identify where art can carry the narrative, and what form and budget range suit it."
      },
      {
        title: "DESIGN DEVELOPMENT",
        body: "We develop the art direction with an artist, aligned to materials, lighting and layout."
      },
      {
        title: "APPROVED DESIGN",
        body: "The direction is set. We confirm feasibility, adapt it to the surface and plan production."
      },
      {
        title: "SITE PRODUCTION",
        body: "We produce the work, coordinate with your contractor and hand over."
      }
    ] as Step[]
  },

  /** 03. What you send. What comes back. */
  exchange: {
    eyebrow: "THE EXCHANGE",
    headline: "WHAT YOU SEND. WHAT COMES BACK.",
    sendTitle: "WHAT YOU SEND",
    send: [
      "Moodboards and references",
      "Plans and elevations",
      "Palette and material samples",
      "The dimensions of the surfaces",
      "Audience and use",
      "Programme and milestones"
    ],
    backTitle: "WHAT COMES BACK",
    back: [
      "A first read of where art can do the most, in a sensible order of priority",
      "A recommended format and artist route for each",
      "The dependencies your contractor needs to know: surface, access, fixings, lighting, timing",
      "A scope that can be appointed and priced"
    ],
    note: "Incomplete is fine. Concept development for your project begins after appointment, inside the agreed scope.",
    docsLabel: "ILLUSTRATIVE / SAMPLE DOCUMENTS, NOT FROM A REAL PROJECT.",
    docs: [
      {
        title: "ART OPPORTUNITY SCHEDULE",
        columns: ["Area", "Format", "Priority", "Note"],
        rows: [
          ["Arrival", "Original canvas", "1", "Sets the tone"],
          ["Corridor", "Series", "2", "Read as a sequence"],
          ["Double-height void", "Spatial work", "3", "Needs structure review"]
        ]
      },
      {
        title: "SCOPE AND RESPONSIBILITY SHEET",
        columns: ["Item", "Who", "Status"],
        rows: [
          ["Art direction", "Impact Murals", "Scoped"],
          ["Surface preparation", "Contractor", "To confirm"],
          ["Fixings", "Contractor, with an engineer if needed", "To confirm"],
          ["Installation", "Impact Murals with the contractor", "Scoped"]
        ]
      }
    ] as Doc[]
  },

  /** 04. Creative entry paths. */
  paths: {
    eyebrow: "HOW WE START",
    headline: "YOUR DIRECTION, OR ONE DEVELOPED WITH YOU.",
    items: [
      {
        name: "YOU HOLD THE DIRECTION.",
        body: "An artwork, an artist or a narrative is already set. We adapt it for the surface and produce it, and the design intent stays yours."
      },
      {
        name: "YOU HOLD THE NARRATIVE.",
        body: "The scheme is clear, the artwork is not. We develop an art direction with an artist, in dialogue with your palette and materials, for your approval."
      }
    ],
    note: "The interior stays with the design team in both."
  },

  /** 05. What can be commissioned: names that lead to the pages that own the detail. */
  commission: {
    eyebrow: "WHAT WE MAKE",
    headline: "WHAT CAN BE COMMISSIONED.",
    formatsLabel: "BY FORMAT",
    formats: [
      { name: "MURALS", text: "Painted on the wall.", href: "/mural-artist-dubai/" },
      { name: "ORIGINAL CANVASES", text: "Painted off site, delivered finished.", href: "/custom-canvas-art-dubai/" },
      {
        name: "COORDINATED SERIES",
        text: "One narrative across several spaces.",
        href: "/what-we-do/art-for-places/coordinated-artworks/"
      },
      { name: "SPATIAL ARTWORKS", text: "Dimensional or suspended work.", href: "/art-installations-dubai/" }
    ] as Format[],
    projectsLabel: "BY PROJECT",
    projects: [
      { name: "HOTELS", href: "/hotel-artwork-dubai/" },
      { name: "WORKPLACES", href: "/corporate-artwork-dubai/" },
      { name: "PUBLIC SITES", href: "/what-we-do/public-art/" }
    ] as Project[]
  },

  /** 06. Who signs off what. */
  signoff: {
    eyebrow: "APPROVALS",
    headline: "WHO SIGNS OFF WHAT.",
    rows: [
      { name: "AESTHETIC", text: "The designer and the client approve the artistic direction." },
      { name: "BUDGET", text: "The client and the project manager." },
      { name: "TECHNICAL", text: "The contractor, and an engineer where the work needs one." },
      { name: "PROGRAMME", text: "The project manager." }
    ] as Signoff[],
    body: "One numbered version is current at a time. Changes are logged. Review gates are fixed in the scope.",
    consultant: "If an art or FF&E consultant holds curation, we sit inside their package and take direction from them.",
    gates: ["BRIEF", "DIRECTION", "SCOPE AND BUDGET", "SAMPLE", "SITE PLAN", "HANDOVER"],
    lanes: [
      { name: "DESIGNER", marks: ["", "signs", "", "signs", "", ""] },
      { name: "CLIENT", marks: ["", "signs", "signs", "", "", "signs"] },
      { name: "CONTRACTOR", marks: ["", "", "", "", "signs", "signs"] },
      { name: "IMPACT MURALS", marks: ["submits", "submits", "submits", "submits", "submits", "submits"] }
    ] as Lane[],
    laneCaption: "ILLUSTRATIVE WORKFLOW. THE PROJECT MANAGER SIGNS OFF BUDGET AND PROGRAMME WITH THE CLIENT.",
    key: { signs: "SIGNS OFF", submits: "SUBMITS FOR REVIEW" }
  },

  /** 07. From drawing to wall. */
  wall: {
    eyebrow: "THE SITE",
    headline: "FROM DRAWING TO WALL.",
    body: "The artwork has to meet the building: dimensions and tolerances, fixing and structure, finished surfaces, access, lighting, protection, installation windows and the handoff to your contractor. We state what we need from other trades, and what they can expect from us, in writing before production starts.",
    items: [
      "DIMENSIONS AND TOLERANCES",
      "FIXING AND STRUCTURE",
      "FINISHED SURFACES",
      "ACCESS",
      "LIGHTING",
      "PROTECTION",
      "INSTALLATION WINDOWS",
      "THE HANDOFF TO YOUR CONTRACTOR"
    ]
  },

  /** 08. What you receive. */
  receive: {
    eyebrow: "DELIVERABLES",
    headline: "WHAT YOU RECEIVE.",
    lead: "Deliverables are scoped, not assumed. Depending on the stage you join, they can include an art direction document, an artist proposal, an adaptation of your approved design for the surface, production information (dimensions, materials, substrate preparation, installation notes), samples where needed, and handover and care notes.",
    body: "Rights, credit and confidentiality are agreed in writing at appointment.",
    items: [
      "ART DIRECTION DOCUMENT",
      "ARTIST PROPOSAL",
      "ADAPTATION OF YOUR APPROVED DESIGN",
      "PRODUCTION INFORMATION",
      "SAMPLES WHERE NEEDED",
      "HANDOVER AND CARE NOTES"
    ]
  },

  /** 10. How it runs, and the fee in three parts. */
  process: {
    eyebrow: "PROCESS",
    headline: "HOW IT RUNS.",
    steps: [
      { title: "INITIAL REVIEW", body: "What the project is, what you hold, and what you need." },
      { title: "SCOPE AND APPOINTMENT", body: "Responsibilities and deliverables agreed." },
      { title: "ARTISTIC DEVELOPMENT", body: "The direction developed or adapted." },
      { title: "APPROVALS", body: "Through the gates set in the scope." },
      { title: "PRODUCTION AND SITE DELIVERY", body: "Made, installed and handed over." }
    ] as Step[],
    feeLabel: "FEES ARE SCOPED IN THREE PARTS",
    fee: [
      { name: "CREATIVE", text: "Art direction and artist development." },
      { name: "ARTWORK", text: "The artist's work and the materials." },
      { name: "COORDINATION AND INSTALLATION", text: "Liaison with your contractor, scheduling and the installation scope." }
    ] as Signoff[],
    feeClosing: "You can place each part against your own budget lines."
  },

  faq: {
    eyebrow: "QUESTIONS",
    headline: "QUESTIONS DESIGN TEAMS ASK.",
    items: [
      {
        q: "Can you join at concept stage?",
        a: "Yes. Early involvement lets the art shape the scheme instead of being fitted into it. We help identify where art can do the most and which formats and artists suit it."
      },
      {
        q: "Can you execute a design we have already approved?",
        a: "Yes. We confirm feasibility, adapt the design to the real surface and plan the production. The design intent stays with your studio."
      },
      {
        q: "How do you choose the artist for our scheme?",
        a: "We propose the artist whose language fits it, with our reasons, and you approve. If your client already has an artist in mind, we work within that direction and focus on development and production."
      },
      {
        q: "Who approves what, you or the client?",
        a: "The designer and the client approve the artistic direction, the client and the project manager approve budget and programme, and the contractor approves technical interfaces. The scope fixes the review gates."
      },
      {
        q: "Can you work with an art or FF&E consultant?",
        a: "Yes. If they hold curation, we sit inside their package and take direction from them."
      },
      {
        q: "Who coordinates installation?",
        a: "The scope states it. We coordinate the artistic installation with your contractor and state what we need from other trades."
      },
      {
        q: "Do we pay for concepts?",
        a: "Project-specific concepts and mockups are developed after appointment, inside the paid scope. Before that we discuss feasibility and scope with you."
      },
      {
        q: "Do we have to name the client?",
        a: "No. You can start without naming the client or the project. Share what you are comfortable with."
      },
      {
        q: "Can several projects stay consistent?",
        a: "A direction can be set once and applied across several sites with local adaptation. See Multi-site Art Programmes."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "FOR THE DESIGN FILE.",
    items: [
      {
        href: "/guides/art-direction-creative-development-for-commercial-interior-design-studios-in-the-uae/",
        title: "Art direction for interior design studios",
        why: "How art direction is developed with a studio."
      },
      {
        href: "/guides/commissioned-artwork-for-commercial-interior-design-studios-in-the-uae/",
        title: "Commissioned artwork for interior design studios",
        why: "Briefing and specifying an original."
      },
      {
        href: "/guides/murals-site-specific-painting-for-commercial-interior-design-studios-in-the-uae/",
        title: "Murals and site-specific painting for design studios",
        why: "Painted walls inside a design scheme."
      },
      {
        href: "/guides/specialist-artistic-production-finishing-for-commercial-interior-design-studios-in-the-uae/",
        title: "Specialist production and finishing for design studios",
        why: "Production and finish as their own line."
      },
      {
        href: "/guides/art-installations-artistic-environments-for-commercial-interior-design-studios-in-the-uae/",
        title: "Art installations for design studios",
        why: "Spatial work coordinated with a design team."
      },
      {
        href: "/what-we-do/art-for-places/art-consulting/",
        title: "Defining the art brief before you commission",
        why: "The upstream brief, before a commission."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "SEND THE PLANS, OR JUST THE IDEA.",
    lead: "Tell us the project type, the stage, and where art might sit.",
    body: "Plans, elevations and references help. If you do not know yet who appoints the art, say that too."
  } as Closing,

  cta: {
    primary: "Discuss a Design-Team Collaboration",
    secondaryEmail: "Share Plans or an Artwork Brief",
    secondaryChannel: "email",
    whatsapp:
      "Hello Impact Murals, I am a designer/architect and would like to discuss artwork for a project.\nStage:\nLocation:\nFormat:",
    emailSubject: "Design-team collaboration enquiry",
    emailBody:
      "Hello Impact Murals,\n\nI am a designer/architect and would like to discuss artwork for a project.\n\nStudio and role:\nProject type and location:\nDesign stage:\nWhat the artwork is for:\nTarget milestones:\nArt direction (set, open, in progress):\nWho appoints and approves (or not yet known):\n\nPlans, elevations or a brief are attached.\n",
    track: "designers"
  } as PageCta
};
