/**
 * All homepage copy. Layout components read from here so wording can change
 * without touching markup or animation code.
 */
export const homepage = {
  hero: {
    eyebrow: "ARTIST-LED ART DIRECTION + PRODUCTION · UAE",
    headline:
      "ART DIRECTION & PRODUCTION FOR BRANDS, PLACES & PUBLIC SPACES.",
    /*
      Explicit line structure so the headline silhouette stays intentional
      instead of wrapping wherever the viewport happens to break it.
      The `headline` value above remains the single accessible sentence.
    */
    headlineLines: {
      desktop: [
        "WE SHAPE AND DELIVER ART",
        "FOR BRANDS, SPACES AND",
        "THE PUBLIC REALM."
      ],
      mobile: [
        "WE SHAPE AND",
        "DELIVER ART FOR",
        "BRANDS, SPACES AND",
        "THE PUBLIC REALM."
      ]
    },
    supportingText:
      "We shape the artistic direction around each brief, then bring together the right artists and production specialists to realise it.",
    primaryCta: { label: "DISCUSS A PROJECT", href: "/discuss-a-project" },
    secondaryCta: { label: "VIEW SELECTED WORK", href: "/work" }
  },

  openingProof: {
    eyebrow: "RECENT OUTPUT"
  },

  repositioningStatement:
    "The right art does more than occupy a surface. It changes how a place is seen, experienced and remembered.",

  /*
    A scannable answer to "so what do you actually do", placed early for the
    decision-maker who will not read the whole page. Deliberately concrete.
  */
  offerSummary: {
    label: "IN PRACTICE",
    lead: "Impact Murals is the single partner for site-specific art: deciding what the work should be, finding the right artist for it, and getting it built on a real site.",
    pillars: [
      { label: "We decide", value: "What the art needs to achieve on this site" },
      { label: "We curate", value: "The artistic language and the artist to deliver it" },
      { label: "We build", value: "The finished work, on site, to a handover standard" }
    ]
  },

  /*
    This section answers one question only: why can this studio be trusted to
    execute? It deliberately avoids restating the process stages. These are the
    real-world conditions a project has to survive, which is what separates a
    proposal that gets approved from one that gets built.
  */
  delivery: {
    eyebrow: "BUILT TO DELIVER",
    heading: "THE CONDITIONS THE WORK HAS TO SURVIVE.",
    body: "Ambitious artwork rarely fails on the idea. It fails on access, substrate, permissions, heat and trading hours. These are the constraints the studio plans against from the first conversation.",
    points: [
      {
        title: "HEIGHT AND ACCESS",
        body: "Facade and high-level work planned around scaffold, powered access or rope, including the lead times and permits that come with them."
      },
      {
        title: "UAE EXTERIOR CONDITIONS",
        body: "Coating systems chosen for heat, humidity, UV and dust, so an exterior piece still reads correctly after a few summers."
      },
      {
        title: "LIVE AND OCCUPIED SITES",
        body: "Work phased around trading hours, guests, residents and other trades, in environments that cannot simply close."
      },
      {
        title: "APPROVALS AND STAKEHOLDERS",
        body: "Building management, landlords, developers and authorities each need something different. That coordination sits with the studio."
      },
      {
        title: "SUBSTRATE AND PREPARATION",
        body: "Concrete, render, block, metal and glazing all behave differently. Preparation is specified before the artwork is finalised."
      },
      {
        title: "HANDOVER AND AFTERCARE",
        body: "Completed work is documented and handed over with the maintenance guidance the operator needs to keep it."
      }
    ],
    partnerNote:
      "One studio holds the project from first direction to final handover, so responsibility never falls between suppliers."
  },

  studioSection: {
    eyebrow: "THE STUDIO",
    workLinkLabel: "SEE SELECTED WORK"
  },

  finalCta: {
    eyebrow: "START A CONVERSATION",
    heading: "HAVE A PROJECT IN MIND?",
    body: "Tell us what you are planning and where the art needs to work. A brief, location or early idea is enough to begin.",
    label: "DISCUSS A PROJECT"
  }
} as const;
