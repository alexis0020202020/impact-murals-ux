export interface CommercialHub {
  code: string;
  title: string;
  href: string;
}

export const commercialHubs: CommercialHub[] = [
  { code: "B01", title: "Brand activations, launches and event artwork", href: "/what-we-do/art-for-brands/brand-activations" },
  { code: "B02", title: "Live painting and live art performances", href: "/what-we-do/art-for-brands/live-painting" },
  { code: "B03", title: "Participatory murals and collaborative artworks", href: "/what-we-do/art-for-brands/participatory-art" },
  { code: "B04", title: "Creative workshops and artist-led sessions", href: "/what-we-do/art-for-brands/creative-workshops" },
  { code: "B05", title: "Product, object and merchandise customisation", href: "/what-we-do/art-for-brands/product-customisation" },
  { code: "B06", title: "Artist collaborations and limited editions", href: "/what-we-do/art-for-brands/artist-collaborations" },
  { code: "B07", title: "Murals and branded environments", href: "/what-we-do/art-for-brands/branded-murals" },
  { code: "B08", title: "Commissioned campaign, product and packaging artwork", href: "/what-we-do/art-for-brands/commissioned-brand-artwork" },
  { code: "P01", title: "Commissioned paintings and canvases", href: "/what-we-do/art-for-places/commissioned-paintings" },
  { code: "P02", title: "Murals", href: "/what-we-do/art-for-places/murals" },
  { code: "P03", title: "Site-specific artworks and installations", href: "/what-we-do/art-for-places/site-specific-artworks" },
  { code: "P04", title: "Coordinated sets of artworks across a space", href: "/what-we-do/art-for-places/coordinated-artworks" },
  { code: "P05", title: "Art consulting", href: "/what-we-do/art-for-places/art-consulting" },
  { code: "P06", title: "Multi-site art programmes", href: "/what-we-do/art-for-places/multi-site-art-programmes" },
  { code: "U01", title: "Large-scale murals", href: "/what-we-do/public-art/large-scale-murals" },
  { code: "U02", title: "Facade and architectural surface artworks", href: "/what-we-do/public-art/facade-artwork" },
  { code: "U03", title: "Site-specific artworks and installations", href: "/what-we-do/public-art/site-specific-artworks" },
  { code: "U04", title: "Ground and pavement artworks", href: "/what-we-do/public-art/ground-pavement-art" },
  { code: "U05", title: "Participatory and community artworks", href: "/what-we-do/public-art/community-art" },
  { code: "U06", title: "Multi-site public art programmes", href: "/what-we-do/public-art/multi-site-public-art" }
];

export function commercialHubFor(code?: string): CommercialHub | undefined {
  if (!code) return undefined;
  return commercialHubs.find((hub) => hub.code === code);
}
