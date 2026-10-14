import { moneyMode } from "../content/money/launch.ts";

/**
 * Adds the money pages' routes to the build, and only when they are wanted.
 *
 * The routes live outside src/pages (in src/money) on purpose. A file in
 * src/pages is always part of the build: its components, stylesheets and
 * scripts are bundled and attached to pages even when a flag keeps it from
 * rendering, which would change a production build before launch. A route that
 * is not injected is not in the build at all, so with the pages off the output
 * of the whole site is byte for byte what it was.
 *
 *   off      nothing is added.
 *   preview  the dispatcher for the eight new pages, and the strengthened
 *            Public Art route (src/pages/what-we-do/[slug].astro steps aside
 *            for it).
 *   live     the same; the launch decision is in src/content/money/launch.ts.
 *
 * `astro dev` is always a preview unless MONEY_PAGES says otherwise.
 */
export default function moneyPages() {
  return {
    name: "impact-murals:money-pages",
    hooks: {
      "astro:config:setup": ({ command, injectRoute, logger }) => {
        const env = command === "dev" ? { ...process.env, NODE_ENV: "development" } : process.env;
        const mode = moneyMode(env);
        if (mode === "off") return;

        injectRoute({ pattern: "/[money]", entrypoint: "./src/money/[money].astro" });
        injectRoute({ pattern: "/what-we-do/public-art", entrypoint: "./src/money/public-art.astro" });
        logger.info(`Money pages: ${mode}. Routes added.`);
      }
    }
  };
}
