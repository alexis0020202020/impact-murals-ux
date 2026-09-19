import { global } from "./global";
import type { OfferKey } from "./offers";

export const seo = {
  siteName: global.name,
  canonicalBase: global.domain,
  titleTemplate: "%s | Impact Murals",
  defaultTitle:
    "Impact Murals: Art Direction & Production Studio, Dubai",
  defaultDescription:
    "Art direction and production for site-specific art, public interventions, brand environments and large-scale murals across the UAE.",
  defaultOgImage: "/assets/social/impact-murals-og-placeholder.svg",

  organization: {
    name: global.name,
    legalName: "REPLACE_IF_REQUIRED",
    email: global.contact.email,
    telephone: global.contact.phone,
    areaServed: [global.areaServed]
  }
} as const;

/** Per-route titles and descriptions. Edit here rather than in page files. */
export const pageSeo = {
  home: {
    title: seo.defaultTitle,
    description: seo.defaultDescription
  },
  work: {
    title: "Selected Work",
    description:
      "Selected public art, murals, brand environments and site-specific projects by Impact Murals."
  },
  whatWeDo: {
    title: "What We Do: Art for Brands, Places & Public Spaces",
    description:
      "Where Impact Murals works and what the studio takes responsibility for, from creative direction through to on-site delivery."
  },
  studio: {
    title: "Studio: Art Direction & Production, Dubai",
    description:
      "Impact Murals is a Dubai-based art direction and production studio, working with the artists and specialists each project calls for."
  },
  discuss: {
    title: "Discuss a Project",
    description:
      "Share a location, a brief or an early idea. Impact Murals can help define the right artistic direction and what the project requires."
  }
} as const;

/**
 * SEO-only title/description for the three offer pages, decoupled from
 * `offer.title` (their literal, ALL-CAPS H1 text). This is metadata, not
 * visible copy: the `<title>` tag and meta description read naturally in a
 * search result without touching the page's own heading, which stays exactly
 * as written in `src/content/offers.ts`.
 */
export const pageSeoOffers: Record<OfferKey, { title: string; description: string }> = {
  "art-for-brands": {
    title: "Art for Brands: Art Direction & Production, Dubai",
    description:
      "Art direction and production for brand campaigns, launches, activations and live art, based in Dubai and working across the UAE."
  },
  "art-for-places": {
    title: "Art for Places: Art Direction & Production, Dubai",
    description:
      "Art direction and production for hotels, interiors, retail and developments, based in Dubai and working across the UAE."
  },
  "public-art": {
    title: "Public Art & Large-Scale Murals, Dubai & UAE",
    description:
      "Art direction and specialist production for murals, facades and public art, based in Dubai and working across the UAE."
  }
} as const;
