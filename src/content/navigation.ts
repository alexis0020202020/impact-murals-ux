export interface NavigationItem {
  label: string;
  href: string;
  emphasis?: "primary" | "standard";
}

/**
 * Primary navigation. Every href resolves to a real route.
 *
 * A 2026-09 copy-pass brief asked for the "Work" link to be removed. That
 * pass kept it as a copy-only change, since deleting it made /work an orphan
 * page for scripts/validate-content.mjs's reachability check. A follow-up
 * pass removed the /work route itself (src/pages/work/, its entry in
 * src/lib/routes.ts) so there is nothing left to link to.
 */
export const primaryNavigation: NavigationItem[] = [
  { label: "What We Do", href: "/what-we-do", emphasis: "standard" },
  { label: "Studio", href: "/studio", emphasis: "standard" },
  { label: "Start a project", href: "/discuss-a-project", emphasis: "primary" }
];

export const footerNavigation: Array<{ heading: string; items: NavigationItem[] }> = [
  {
    heading: "Studio",
    items: [
      { label: "What We Do", href: "/what-we-do" },
      { label: "Studio", href: "/studio" },
      { label: "Start a project", href: "/discuss-a-project" }
    ]
  },
  {
    heading: "What we do",
    items: [
      { label: "Art for Brands", href: "/what-we-do/art-for-brands" },
      { label: "Art for Places", href: "/what-we-do/art-for-places" },
      { label: "Public Art & Large-Scale Murals", href: "/what-we-do/public-art" }
    ]
  }
];

export const ctaLabels = {
  primary: "START A PROJECT",
  secondary: "VIEW SELECTED WORK"
} as const;
