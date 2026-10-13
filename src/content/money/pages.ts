/**
 * The nine money pages: identity, metadata and the way each one starts a
 * conversation.
 *
 * Everything here is taken from docs/money-pages (the production
 * specification) and is the one place the titles, descriptions, H1s and
 * routes of these pages are written. The route registry, the footer preview
 * row, the breadcrumbs, the structured data and the tests all read from here.
 *
 * This module is plain TypeScript with no framework imports, so the tests can
 * load it directly.
 */
import type { OfferKey } from "@/content/offers";

export type MoneyKey =
  | "live-painting"
  | "corporate-artwork"
  | "custom-canvas"
  | "hotel-artwork"
  | "live-customisation"
  | "art-installations"
  | "designers"
  | "public-art"
  | "corporate-workshops";

export interface MoneyPage {
  key: MoneyKey;
  /** Route without a trailing slash, the form the route registry uses. */
  path: string;
  /** Short label for breadcrumbs and the preview row. */
  label: string;
  /** Registry parent: drives the breadcrumb trail. */
  parent: string;
  /** Carried to the enquiry flow's first step while the guided form is connected. */
  offer: OfferKey;
  /** The full document title. These already end with the studio name, so the layout template is not applied. */
  title: string;
  description: string;
  /** The page's one H1, in the case the Strategy Master set (the display style uppercases it). */
  h1: string;
  /** schema.org `serviceType` for the optional Service entity. */
  serviceType: string;
  /** True for a page that already exists in production and is strengthened in place. */
  existing?: boolean;
  /** "provisional" pages are specified but their launch is on hold. */
  status: "ready" | "provisional";
  /** The route this page will replace at launch. Documentation only: no redirect is created. */
  consolidates?: string;
}

export const moneyPages: MoneyPage[] = [
  {
    key: "live-painting",
    path: "/live-painting-dubai",
    label: "Live Painting",
    parent: "/what-we-do/art-for-brands",
    offer: "art-for-brands",
    title: "Live Painting Dubai | Brand & Corporate Events | Impact Murals",
    description:
      "Live painting for brand launches, corporate events and conferences in Dubai and the UAE. Artist-led direction, performance planning and on-site production.",
    h1: "Live Painting Dubai",
    serviceType: "Live painting for brand and corporate events",
    status: "ready",
    consolidates: "/what-we-do/art-for-brands/live-painting"
  },
  {
    key: "corporate-artwork",
    path: "/corporate-artwork-dubai",
    label: "Corporate Artwork",
    parent: "/what-we-do/art-for-places",
    offer: "art-for-places",
    title: "Corporate Artwork Dubai | Workplace Art | Impact Murals",
    description:
      "Commissioned artwork for offices and headquarters in Dubai and the UAE. Murals, canvas works and site-specific art, planned around your space and programme.",
    h1: "Corporate Artwork Dubai",
    serviceType: "Commissioned artwork for workplaces",
    status: "ready"
  },
  {
    key: "custom-canvas",
    path: "/custom-canvas-art-dubai",
    label: "Custom Canvas Art",
    parent: "/what-we-do/art-for-places",
    offer: "art-for-places",
    title: "Custom Canvas Art Dubai | Original Commissions | Impact Murals",
    description:
      "Original canvas paintings commissioned for commercial spaces and private interiors in Dubai and the UAE. Artist selection, creative direction and production.",
    h1: "Custom Canvas Art Dubai",
    serviceType: "Commissioned original paintings",
    status: "ready",
    consolidates: "/what-we-do/art-for-places/commissioned-paintings"
  },
  {
    key: "hotel-artwork",
    path: "/hotel-artwork-dubai",
    label: "Hotel Artwork",
    parent: "/what-we-do/art-for-places",
    offer: "art-for-places",
    title: "Hotel Artwork Dubai | Hospitality Commissions | Impact Murals",
    description:
      "Commissioned artwork, murals and site-specific art for hotels in Dubai and the UAE. Artist-led direction and production coordinated with your design team.",
    h1: "Hotel Artwork Dubai",
    serviceType: "Commissioned hospitality artwork",
    status: "ready"
  },
  {
    key: "live-customisation",
    path: "/live-customisation-dubai",
    label: "Live Customisation",
    parent: "/what-we-do/art-for-brands",
    offer: "art-for-brands",
    title: "Live Customisation Dubai | Brand & Retail Events | Impact Murals",
    description:
      "Artist-led live product customisation for retail launches, brand events and VIP experiences in Dubai and the UAE, planned around materials and guest flow.",
    h1: "Live Customisation Dubai",
    serviceType: "Artist-led live product customisation",
    status: "ready",
    consolidates: "/what-we-do/art-for-brands/product-customisation"
  },
  {
    key: "art-installations",
    path: "/art-installations-dubai",
    label: "Art Installations",
    parent: "/what-we-do/art-for-places",
    offer: "art-for-places",
    title: "Art Installations Dubai | Site-Specific Art | Impact Murals",
    description:
      "Site-specific art installations for brands and spaces in Dubai and the UAE. Creative direction, artist selection and specialist production coordination.",
    h1: "Art Installations Dubai",
    serviceType: "Artistic commissioning and coordination of site-specific installations",
    status: "ready",
    consolidates: "/what-we-do/art-for-places/site-specific-artworks"
  },
  {
    key: "designers",
    path: "/art-for-interior-designers-dubai",
    label: "Art for Designers & Architects",
    parent: "/what-we-do/art-for-places",
    offer: "art-for-places",
    title: "Art for Interior Designers Dubai | Impact Murals",
    description:
      "Artist-led artwork and production support for interior designers and architects in Dubai and the UAE, from an early brief or approved design through delivery.",
    h1: "Art for Interior Designers & Architects in Dubai",
    serviceType: "Artist-led artwork production support for design teams",
    status: "ready"
  },
  {
    key: "public-art",
    path: "/what-we-do/public-art",
    label: "Public Art & Large-Scale Murals",
    parent: "/what-we-do",
    offer: "public-art",
    title: "Public Art Dubai & UAE | Large-Scale Murals | Impact Murals",
    description:
      "Public art, façade artwork and large-scale murals for developments and public spaces in Dubai and the UAE. Artist-led direction and site production planning.",
    h1: "Public Art Dubai & UAE",
    serviceType: "Public art and large-scale mural production planning",
    existing: true,
    status: "ready"
  },
  {
    key: "corporate-workshops",
    path: "/corporate-art-workshops-dubai",
    label: "Corporate Art Workshops",
    parent: "/what-we-do/art-for-brands",
    offer: "art-for-brands",
    title: "Corporate Art Workshops Dubai | Impact Murals",
    description:
      "Artist-led art workshops for corporate teams and brand events in Dubai and the UAE. Collaborative formats planned around your group, venue and objective.",
    h1: "Corporate Art Workshops Dubai",
    serviceType: "Facilitated corporate art workshops",
    status: "provisional",
    consolidates: "/what-we-do/art-for-brands/creative-workshops"
  }
];

export function moneyPage(key: MoneyKey): MoneyPage {
  const page = moneyPages.find((entry) => entry.key === key);
  if (!page) throw new Error(`Unknown money page: ${key}`);
  return page;
}

/** The www address with the trailing slash the live site resolves to, the form its canonical uses. */
export function moneyCanonical(page: MoneyPage, base: string): string {
  return `${base}${page.path}/`;
}

/** The route as a link target: the trailing slash form the pages are served at. */
export function moneyHref(key: MoneyKey): string {
  return `${moneyPage(key).path}/`;
}
