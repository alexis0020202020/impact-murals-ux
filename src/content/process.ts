/**
 * The continuous responsibility from first direction to final delivery.
 * Rendered as one progression, never as five separate service cards.
 */
export interface ProcessStage {
  key: string;
  title: string;
  body: string;
  /** What the client actually receives or signs off at this stage. */
  output: string;
}

export const processIntro = {
  eyebrow: "FROM DIRECTION TO DELIVERY",
  heading: "ONE CREATIVE PARTNER, FROM FIRST DIRECTION TO FINAL DELIVERY.",
  body: "Most projects need more than someone to paint a wall. They need the role of the art decided, the right artistic language found, and the result made buildable on a real site. Impact Murals carries that responsibility end to end."
};

export const processStages: ProcessStage[] = [
  {
    key: "creative-direction",
    title: "CREATIVE DIRECTION",
    body: "Understand the site, the audience and the objective, then decide what the art is actually there to do before any image is proposed.",
    output: "Direction, references, and the role the artwork will play."
  },
  {
    key: "artist-curation",
    title: "ARTIST CURATION AND COMMISSIONING",
    body: "Select the artistic language the project calls for and bring in the right artist or team, with authorship and terms agreed clearly.",
    output: "Artist selection, commissioning terms, and scope of authorship."
  },
  {
    key: "site-specific-development",
    title: "SITE-SPECIFIC DEVELOPMENT",
    body: "Develop the artwork against the real surface: its scale, viewing distances, sightlines, light, and the way people move past it.",
    output: "Developed artwork, scaled to the actual surface."
  },
  {
    key: "production-planning",
    title: "PRODUCTION PLANNING",
    body: "Resolve materials, access, permissions, sequencing and schedule so the work can be executed without surprises on site.",
    output: "Production method, access plan, materials and programme."
  },
  {
    key: "delivery",
    title: "ON-SITE EXECUTION AND DELIVERY",
    body: "Run the work on site, coordinate the artists and trades involved, and hand over a finished, documented result.",
    output: "Completed artwork, site reinstated, documentation handed over."
  }
];
