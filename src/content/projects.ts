import type { OfferKey } from "./offers";

export type MediaRole =
  | "environment-panorama"
  | "architectural-landscape"
  | "portrait-detail"
  | "material-detail"
  | "production-onsite"
  | "split-sequence";

export interface ProjectMedia {
  src: string;
  alt: string;
  role: MediaRole;
  /** Optional short caption shown beneath the image in the gallery. */
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  offer: OfferKey;
  /** Confirmed location only. Use "LOCATION TO BE CONFIRMED" until verified. */
  location: string;
  /** Confirmed scale only. */
  scale: string;
  /** Impact Murals' explicit role. Never inflate. */
  role: string;
  /** Year or period. Leave as placeholder until confirmed. */
  period: string;
  /** One concise neutral statement. */
  statement: string;

  /**
   * Optional narrative fields. A project renders only the sections it has,
   * so early entries can carry imagery alone without looking unfinished.
   */
  objective?: string;
  creativeDevelopment?: string;
  siteAdaptation?: string;
  productionDelivery?: string;

  media: ProjectMedia[];
  /** Appears in the homepage opening proof when true. */
  openingProof: boolean;
  featured: boolean;
}

/**
 * PLACEHOLDER PROJECT DATA.
 *
 * No client names, locations, dimensions, dates or outcomes have been
 * confirmed. Every value below is deliberately neutral and labelled.
 * Replace the values and swap the media paths in this file only. No layout
 * component needs to change when real projects arrive.
 */
export const projects: Project[] = [
  {
    slug: "project-01",
    title: "PROJECT 01",
    offer: "public-art",
    location: "LOCATION TO BE CONFIRMED",
    scale: "SCALE TO BE CONFIRMED",
    role: "ROLE TO BE CONFIRMED",
    period: "PERIOD TO BE CONFIRMED",
    statement: "PROJECT CONTEXT AND OBJECTIVE TO BE ADDED.",
    objective: "CLIENT OBJECTIVE TO BE ADDED.",
    creativeDevelopment: "CREATIVE DEVELOPMENT NOTES TO BE ADDED.",
    siteAdaptation: "SITE ADAPTATION NOTES TO BE ADDED.",
    productionDelivery: "PRODUCTION AND DELIVERY NOTES TO BE ADDED.",
    media: [
      {
        src: "/assets/projects/environment-panorama.svg",
        alt: "Placeholder for a wide public art environment image",
        role: "environment-panorama"
      },
      {
        src: "/assets/projects/production-onsite.svg",
        alt: "Placeholder for an on-site production image",
        role: "production-onsite"
      },
      {
        src: "/assets/projects/material-detail.svg",
        alt: "Placeholder for a material or artwork detail image",
        role: "material-detail"
      }
    ],
    openingProof: true,
    featured: true
  },
  {
    slug: "project-02",
    title: "PROJECT 02",
    offer: "art-for-brands",
    location: "LOCATION TO BE CONFIRMED",
    scale: "SCALE TO BE CONFIRMED",
    role: "ROLE TO BE CONFIRMED",
    period: "PERIOD TO BE CONFIRMED",
    statement: "PROJECT CONTEXT AND OBJECTIVE TO BE ADDED.",
    objective: "CLIENT OBJECTIVE TO BE ADDED.",
    siteAdaptation: "SITE ADAPTATION NOTES TO BE ADDED.",
    media: [
      {
        src: "/assets/projects/portrait-detail.svg",
        alt: "Placeholder for a portrait brand environment detail image",
        role: "portrait-detail"
      },
      {
        src: "/assets/projects/architectural-landscape.svg",
        alt: "Placeholder for a brand environment architectural image",
        role: "architectural-landscape"
      }
    ],
    openingProof: false,
    featured: true
  },
  {
    slug: "project-03",
    title: "PROJECT 03",
    offer: "art-for-places",
    location: "LOCATION TO BE CONFIRMED",
    scale: "SCALE TO BE CONFIRMED",
    role: "ROLE TO BE CONFIRMED",
    period: "PERIOD TO BE CONFIRMED",
    statement: "PROJECT CONTEXT AND OBJECTIVE TO BE ADDED.",
    media: [
      {
        src: "/assets/projects/architectural-landscape.svg",
        alt: "Placeholder for a hospitality or property environment image",
        role: "architectural-landscape"
      },
      {
        src: "/assets/projects/split-sequence.svg",
        alt: "Placeholder for a split project image sequence",
        role: "split-sequence"
      }
    ],
    openingProof: false,
    featured: true
  }
];

export const openingProofProject =
  projects.find((project) => project.openingProof) ?? projects[0];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

export function getProjectsByOffer(offer: OfferKey) {
  return projects.filter((project) => project.offer === offer);
}

/**
 * Development-only content guard. Placeholder entries can stay in the data
 * layer while the visual system is being built, but public-facing templates
 * should never present them as completed work.
 */
export function isPlaceholderProject(project: Project) {
  return (
    /^PROJECT\s+\d+/i.test(project.title) ||
    /TO BE CONFIRMED|TO BE ADDED/i.test(
      `${project.location} ${project.scale} ${project.role} ${project.period} ${project.statement}`
    )
  );
}

/** Keep generated pages, route metadata and related links on the same inventory. */
export function projectsForBuild(preview = false): Project[] {
  return preview ? projects : projects.filter((project) => !isPlaceholderProject(project));
}
