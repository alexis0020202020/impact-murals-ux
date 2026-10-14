/**
 * The launch switch for the money pages.
 *
 * Three states, decided in one place:
 *
 *   off      The pages do not exist in the build. The route registry, the
 *            sitemap, the redirects and every existing page are exactly what
 *            they were before the money pages were written. This is what any
 *            production build produces until launch.
 *   preview  The pages are generated for review, in `astro dev` and in
 *            non-production Netlify builds. They carry `noindex`, are absent
 *            from the sitemap, and are reachable through a clearly labelled
 *            "preview" row in the footer, so the build's orphan check still
 *            passes without exempting anything.
 *   live     The pages are indexable and listed in the sitemap. Reaching this
 *            state is a deliberate edit: flip `MONEY_LIVE` below, make sure
 *            the umbrella pages link to the new pages (see MoneyRelated.astro)
 *            and replace every media placeholder (the build refuses to ship a
 *            hole). docs/money-pages/IMPLEMENTATION.md lists the whole
 *            checklist.
 *
 * Nothing in this module reads Airtable, writes a redirect or touches the
 * sitemap by itself. It only answers "which state is this build in?".
 */
import { moneyPages, type MoneyPage } from "./pages";

export type MoneyMode = "off" | "preview" | "live";

/** The launch decision. Leave false until the owner has reviewed the pages and approved the checklist. */
export const MONEY_LIVE = false;

/**
 * The second, separate gate: the Corporate Art Workshops page.
 *
 * That page is specified, built and reviewable, but its launch is on hold
 * until the studio confirms five operational facts (facilitator availability,
 * realistic group sizes, setup and clean-up labour, delivery economics and
 * one documented pilot session; docs/money-pages/09-corporate-art-workshops-dubai.md).
 * While this is false the page exists only in preview: a live build does not
 * generate it at all, so it has no URL, no sitemap entry and no link.
 */
export const WORKSHOP_GATE_CLEARED = false;

type Env = Record<string, string | undefined>;

/**
 * Which state a build is in.
 *
 * `MONEY_PAGES=off|preview` forces a local state (useful to prove that "off"
 * changes nothing). `MONEY_PAGES=live` simulates launch for a local build
 * only: it is ignored on Netlify, so an environment variable can never
 * publish these pages. Launch is the `MONEY_LIVE` constant, in a commit.
 */
export function moneyMode(env: Env = process.env): MoneyMode {
  if (MONEY_LIVE) return "live";

  const forced = env.MONEY_PAGES;
  if (forced === "off" || forced === "preview") return forced;
  if (forced === "live" && env.NETLIFY !== "true") return "live";

  if (env.NODE_ENV === "development") return "preview";
  // Netlify deploy previews and branch deploys: never the production context.
  if (env.CONTEXT === "deploy-preview" || env.CONTEXT === "branch-deploy") return "preview";

  return "off";
}

/**
 * Whether one of the new pages exists in a given state of the build: none in
 * "off", all in "preview", and in "live" every page whose launch is not on
 * hold. Public Art, an existing page, is never one of the new pages.
 */
export function moneyPageActive(page: Pick<MoneyPage, "existing" | "status">, mode: MoneyMode = moneyMode()): boolean {
  if (page.existing || mode === "off") return false;
  if (mode === "preview") return true;
  return page.status !== "provisional" || WORKSHOP_GATE_CLEARED;
}

export interface PreviewLink {
  label: string;
  href: string;
}

/**
 * The footer's preview row: every new money page, only while the build is in
 * preview. Public Art is not listed because it is an existing page that every
 * build already reaches.
 */
export function moneyPreviewLinks(mode: MoneyMode = moneyMode()): PreviewLink[] {
  if (mode !== "preview") return [];
  return moneyPages
    .filter((page) => !page.existing)
    .map((page) => ({ label: page.label, href: `${page.path}/` }));
}
