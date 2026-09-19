export const editorialCommercial = {
  eyebrow: "IMPACT MURALS",
  heading: "ART DIRECTION & PRODUCTION FOR BRANDS, PLACES & PUBLIC SPACES.",
  body: "From murals and commissioned artworks to brand activations and large-scale art projects, we help shape the artistic direction and take the work through production.",
  ctaLabel: "DISCUSS A PROJECT",
  ctaHref: "/discuss-a-project",
  video: {
    /**
     * Fallback only. Each guide/insight now shows its own pillar's master
     * video automatically (EditorialCommercialIntro looks it up from
     * src/content/offers.ts by the record's `offer` field), so this rarely
     * matters in practice. Leave empty: it only applies on the defensive
     * path where `offer` is unexpectedly absent, and an empty value there
     * means "no video" rather than one unrelated to the page's content.
     */
    src: "",
    poster: ""
  }
} as const;
