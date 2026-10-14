/**
 * /what-we-do/public-art/: strengthened page copy.
 *
 * Final English copy from docs/money-pages/08-public-art-dubai-uae.md. It
 * keeps what the current page says (the audience, the scope and deliverables,
 * and that size is not a qualifying condition) and reworks it around the site.
 *
 * Claims fence: the only exterior work shown is a private commission, so the
 * page says exactly that and never presents it as a public-realm, developer or
 * institutional appointment; the marque it depicts is the subject, not a
 * client. The page claims the artistic access requirement and coordination,
 * never the certification of access equipment, and promises no permit. Its
 * drawings (access, approval map, programme) are labelled illustrative.
 * Presentation lives in src/components/money/pages/PublicArt.astro.
 */
import type { Closing, Faq, GuideRef, PageCta, Row, Step } from "./types";

export interface Part {
  n: string;
  name: string;
  href: string;
}

export interface Way {
  name: string;
  body: string;
}

export const pa = {
  hero: {
    statement: "ART FOR THE PLACES EVERYONE USES.",
    support:
      "Public art, façade artwork and large-scale murals for developments and public spaces in Dubai and the UAE. Artist-led direction, site planning and production, from an open brief or an approved artwork.",
    micro: "Size is not a qualifying condition. Send the site and whatever you already know."
  },

  /** The page as a file on a site: six parts, each leading to where it is dealt with. */
  dossier: {
    label: "THIS PAGE, AS A FILE ON A SITE",
    parts: [
      { n: "01", name: "SURFACE", href: "#pa-site" },
      { n: "02", name: "ACCESS", href: "#pa-site" },
      { n: "03", name: "EXPOSURE", href: "#pa-care" },
      { n: "04", name: "APPROVALS", href: "#pa-approvals" },
      { n: "05", name: "PROGRAMME", href: "#pa-programme" },
      { n: "06", name: "CARE", href: "#pa-care" }
    ] as Part[]
  },

  /** 02. Commissioning contexts. */
  contexts: {
    eyebrow: "CONTEXTS",
    headline: "WHERE PUBLIC ART IS COMMISSIONED.",
    rows: [
      {
        name: "DEVELOPMENTS AND COMMON AREAS",
        text: "Entrances, podiums, amenity areas and the routes between them.",
        href: "/what-we-do/public-art/large-scale-murals/",
        linkLabel: "See Large-Scale Murals"
      },
      {
        name: "FAÇADES AND BUILDING ENVELOPES",
        text: "Art developed around the elevation and the way the building is seen.",
        href: "/what-we-do/public-art/facade-artwork/",
        linkLabel: "See Façade Artwork"
      },
      {
        name: "CIVIC AND CULTURAL SITES",
        text: "Work for places with a public or institutional audience."
      },
      {
        name: "DESTINATIONS AND VENUES",
        text: "Public-facing places people visit, cross and photograph.",
        href: "/what-we-do/public-art/site-specific-artworks/",
        linkLabel: "See Site-Specific Artworks"
      },
      {
        name: "GROUND AND PAVEMENT",
        text: "Horizontal surfaces, with their own material and use requirements.",
        href: "/what-we-do/public-art/ground-pavement-art/",
        linkLabel: "See Ground & Pavement Art"
      },
      {
        name: "COMMUNITY WORK",
        text: "Participation shaped by stakeholders and place.",
        href: "/what-we-do/public-art/community-art/",
        linkLabel: "See Community Art"
      },
      {
        name: "MULTI-SITE ASSETS",
        text: "One direction across several locations.",
        href: "/what-we-do/public-art/multi-site-public-art/",
        linkLabel: "See Multi-site Public Art"
      }
    ] as Row[]
  },

  /** 03. The place writes the brief. */
  place: {
    eyebrow: "ARTIST AND LANGUAGE",
    headline: "THE PLACE WRITES THE BRIEF.",
    lead: "Who passes the work, what the architecture asks for, what the place means locally and what the commissioner wants it to do: these decide the artist and the artistic language, not the other way round.",
    body: "We bring no fixed style, and no assumption about what a place in the UAE should look like."
  },

  /** 04. Three ways to start. */
  ways: {
    eyebrow: "HOW WE START",
    headline: "THREE WAYS TO START.",
    items: [
      {
        name: "AN OPEN BRIEF.",
        body: "You have a site and a purpose. We develop the direction, choose the artist and plan the production."
      },
      {
        name: "AN APPROVED ARTWORK.",
        body: "The design exists. We scale it to the real surface and build the production method around it."
      },
      {
        name: "A SELECTED ARTIST, OR A TENDER PACKAGE.",
        body: "An artist is chosen, or a design or tender package has been issued. We plan the production and price it."
      }
    ] as Way[],
    note: "Creative work specific to your site starts once you appoint us and sits inside the agreed scope."
  },

  /** 05. What the site allows. */
  site: {
    eyebrow: "FILE 01 AND 02 / SURFACE AND ACCESS",
    headline: "WHAT THE SITE ALLOWS.",
    lead: "Surface, height, exposure, access, ground conditions, circulation, public protection and working windows decide what can be made and how. We review them before a design is fixed.",
    body: "Depending on the site, access may mean mobile lifts, scaffolding or another approved solution within the wider project structure. We define the artistic access requirement and coordinate with the contractor or specialist provider. We do not certify access equipment or its use.",
    labels: [
      "SURFACE",
      "HEIGHT",
      "EXPOSURE",
      "ACCESS",
      "GROUND AND CIRCULATION",
      "PUBLIC PROTECTION",
      "WORKING WINDOWS"
    ],
    caption: "ILLUSTRATIVE ACCESS DIAGRAM."
  },

  /** 06. Made to stand outdoors. */
  care: {
    eyebrow: "FILE 03 AND 06 / EXPOSURE AND CARE",
    headline: "MADE TO STAND OUTDOORS.",
    lead: "The substrate sets the preparation, the paint system, the finish and the durability. Outdoor work also faces heat, sun, dust and cleaning. We match the system to the surface and the expected life, and write down how the work should be maintained.",
    body: "We do not offer a universal warranty, and we say plainly what a given system can and cannot be expected to do.",
    frames: [
      { slot: "PA_BEFORE", n: "01", label: "BARE WALL" },
      { slot: "PA_PREP", n: "02", label: "PREPARED SURFACE" },
      { slot: "PA_PAINTED", n: "03", label: "PAINTED" }
    ] as const
  },

  /** 07. Who has to say yes. */
  approvals: {
    eyebrow: "FILE 04 / APPROVALS",
    headline: "WHO HAS TO SAY YES.",
    core: "THE PROJECT",
    roles: [
      "CLIENT OR LANDOWNER",
      "OPERATOR OR PROPERTY MANAGER",
      "ARCHITECT OR LANDSCAPE CONSULTANT",
      "THE ARTIST",
      "COMPETENT TECHNICAL SPECIALISTS",
      "THE RELEVANT AUTHORITIES"
    ],
    body: "Which approvals apply depends on the site and the work. The party responsible for each approval stays responsible for it. We prepare the artistic information an approval needs, and we do not promise to obtain every permit.",
    caption: "ILLUSTRATIVE APPROVAL MAP."
  },

  /** 08. Sequencing the work. */
  programme: {
    eyebrow: "FILE 05 / PROGRAMME",
    headline: "SEQUENCING THE WORK.",
    body: "One site follows a sequence: approvals, production, access windows, handover. Several sites need a rule for what stays the same and what adapts to each wall. We set the direction once, plan access and approvals site by site, and keep quality consistent across artists and locations.",
    bar: [
      { label: "APPROVALS", span: 22 },
      { label: "PRODUCTION", span: 30 },
      { label: "ACCESS WINDOWS", span: 28 },
      { label: "HANDOVER", span: 20 }
    ],
    barCaption: "ILLUSTRATIVE PROGRAMME / ONE SITE.",
    branchCaption: "ILLUSTRATIVE / ONE DIRECTION, THREE SITES, THREE LOCAL ADAPTATIONS.",
    link: { label: "See Multi-site Public Art", href: "/what-we-do/public-art/multi-site-public-art/" }
  },

  /** 09. Scale, on a real wall. A wall label, not a case study. */
  scale: {
    eyebrow: "A REAL WALL",
    headline: "SCALE, ON A REAL WALL.",
    label: ["PRIVATE COMMISSION / EXTERIOR MURAL", "PAINTED ON THE EXTERIOR OF A BUILDING", "SCAFFOLD ACCESS, BEFORE AND AFTER"],
    body: "A large-scale interpretation of the Rolls-Royce Spirit of Ecstasy, painted on the exterior of a building. Scaffolding access, and the wall before and after.",
    note: "The marque is the subject of the artwork, not a client. This is a private commission: it shows exterior scale, scaffold access and a before and after, not a public-realm or institutional appointment."
  },

  /** 10. The procurement route. */
  route: {
    eyebrow: "PROCESS",
    headline: "THE PROCUREMENT ROUTE.",
    steps: [
      { title: "SITE AND BRIEF REVIEW", body: "The site, the audience and what you hold." },
      { title: "SCOPED PROPOSAL AND APPOINTMENT", body: "Responsibilities and exclusions written down." },
      { title: "CREATIVE AND TECHNICAL APPROVALS", body: "Each approval has its owner and its date in the scope." },
      { title: "PRODUCTION", body: "Preparation, materials and painting." },
      { title: "SITE DELIVERY", body: "Sequenced with access and the other trades." },
      { title: "HANDOVER AND CARE", body: "Documentation of the finished work and care notes." }
    ] as Step[],
    receiveLabel: "WHAT YOU RECEIVE",
    receive: [
      "An artistic proposal matched to the actual surface",
      "Artist selection with agreed authorship and terms",
      "A production method covering preparation, materials and access",
      "The completed work",
      "Documentation of the finished work"
    ],
    receiveNote: "Exclusions and technical responsibility are defined in the proposal."
  },

  /** 11. Budget factors. */
  budget: {
    eyebrow: "BUDGET",
    headline: "WHAT A PUBLIC ART BUDGET DEPENDS ON.",
    factors: [
      "THE ARTIST AND THE DESIGN",
      "THE AREA AND LEVEL OF DETAIL",
      "THE SURFACE CONDITION",
      "ACCESS",
      "THE PUBLIC INTERFACE",
      "SPECIALISTS",
      "PROGRAMME",
      "EXPECTED LIFE AND CARE",
      "MULTI-SITE LOGISTICS"
    ],
    body: "We do not quote a rate per square metre, because the surface, the height and the site matter more than the area. Send the site and whatever you already know."
  },

  faq: {
    eyebrow: "QUESTIONS",
    headline: "QUESTIONS FOR THE BRIEF.",
    items: [
      {
        q: "Do we need to have chosen an artist?",
        a: "No. We can develop the direction and select the artist, work from artwork you have approved, or take a selected artist or a tender package through production planning."
      },
      {
        q: "Who do you work with?",
        a: "Developers, destinations, venues, institutions, agencies and direct commissioners. The scope is whatever the site needs, from concept to production."
      },
      {
        q: "Can you deliver façade and large-scale work?",
        a: "Yes, planned around the surface, the height and the access. We define the artistic access requirement and coordinate the contractor or specialist provider who supplies the equipment."
      },
      {
        q: "Who obtains the approvals?",
        a: "The party responsible for each approval stays responsible for it. We prepare the artistic information an approval needs. We do not promise to obtain every permit."
      },
      {
        q: "How is public circulation protected?",
        a: "Public separation, working hours and daily clean-down are planned with the site operator, and the responsible party for each measure is named in the scope."
      },
      {
        q: "How long does exterior work last?",
        a: "It depends on the surface, the paint system, the exposure and the care. We state the expected life of the proposed system and write down maintenance. There is no blanket warranty."
      },
      {
        q: "Can you handle several sites, or a temporary work?",
        a: "Yes. Several sites share one direction with local adaptation. A temporary work is specified for its duration. See Multi-site Public Art and, for dimensional work, Art Installations."
      },
      {
        q: "Do we see a concept before we appoint you?",
        a: "No. The concept is the first piece of creative work in the agreed paid scope, so it follows appointment."
      },
      {
        q: "Who holds the rights, and is the artist credited?",
        a: "Authorship, usage rights and credit are agreed in the commission. We do not assume them."
      }
    ] as Faq[]
  },

  guides: {
    eyebrow: "GUIDES",
    headline: "SITE AND PROCUREMENT GUIDES.",
    items: [
      {
        href: "/guides/access-safety-live-site-art-delivery-for-property-developers-permanent-common-area-art-in-the-uae/",
        title: "Access, safety and live-site delivery for developments",
        why: "Delivering art on a site that is in use."
      },
      {
        href: "/guides/how-to-procure-art-artist-led-production-for-property-developers-permanent-common-area-art-in-the-uae/",
        title: "How to procure artist-led art for a development",
        why: "Procurement for developers."
      },
      {
        href: "/guides/art-copyright-licensing-ownership-for-property-developers-permanent-common-area-art-projects-in-the-uae/",
        title: "Copyright, licensing and ownership for development art",
        why: "Rights and credit."
      },
      {
        href: "/guides/uae-cultural-place-considerations-for-art-in-property-developers-permanent-common-area-art-projects/",
        title: "Cultural and place considerations in the UAE",
        why: "Reading the place before the brief."
      },
      {
        href: "/guides/multi-site-art-rollouts-for-property-developers-permanent-common-area-art-in-the-uae/",
        title: "Rolling art out across several sites",
        why: "One direction, several walls."
      },
      {
        href: "/guides/art-project-team-structure-specialist-partners-for-property-developers-permanent-common-area-art-in-the-uae/",
        title: "Who does what on a public art project",
        why: "Team structure and specialist partners."
      }
    ] as GuideRef[]
  },

  closing: {
    headline: "SHARE THE PROCUREMENT BRIEF.",
    lead: "The site and its location, who it serves, the stage you are at, and roughly when.",
    body: "Photographs, elevations, a site plan or tender documents help, and none is required. If access or approvals are still unknown, say so."
  } as Closing,

  cta: {
    primary: "Discuss a Public Art Project",
    secondaryEmail: "Share a Site or Procurement Brief",
    secondaryChannel: "email",
    whatsapp:
      "Hello Impact Murals, I would like to discuss a public art or large-scale mural project.\nSite:\nStage:\nTiming:",
    emailSubject: "Public art and large-scale mural enquiry",
    emailBody:
      "Hello Impact Murals,\n\nI would like to discuss a public art or large-scale mural project.\n\nOrganisation and role:\nSite and location:\nAudience and context:\nProject, tender or design stage:\nSurface (wall, façade, spatial, ground) or open brief:\nRough dimensions or number of sites (or unsure):\nProgramme:\nExpected life:\nApproved artwork or direction required:\n\nPhotographs, elevations, a site plan or tender documents are attached.\n",
    track: "public_art"
  } as PageCta
};
