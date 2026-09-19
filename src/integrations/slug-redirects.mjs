import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";

/**
 * Post-build file placement.
 *
 * Two artefacts are generated through the normal Astro pipeline, because that
 * is the only way they can import the TypeScript content source, then moved
 * here into their final positions:
 *
 *   netlify-redirects.txt  ->  dist/_redirects
 *     Astro refuses to route a filename starting with an underscore, which is
 *     exactly what Netlify expects.
 *
 *   deploy-manifest.json   ->  .deploy/manifest.json  (outside dist)
 *     The manifest records what this build published. It is read by the
 *     confirmation step after a successful deploy and must never be publicly
 *     served, so it is moved out of the published output entirely.
 */
export default function slugRedirects() {
  return {
    name: "impact-murals:build-artifacts",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);

        // --- redirects ---
        const generated = join(outDir, "netlify-redirects.txt");
        try {
          const contents = await readFile(generated, "utf8");
          await writeFile(join(outDir, "_redirects"), contents, "utf8");
          await rm(generated, { force: true });

          const rules = contents.split("\n").filter((line) => line.includes("301!"));
          const skipped = contents.split("\n").filter((line) => line.startsWith("#   /"));

          if (rules.length) {
            logger.warn(
              `${rules.length} slug redirect(s) written:\n` +
                rules.map((r) => `  ${r.trim()}`).join("\n")
            );
          } else {
            logger.info("No slug redirects to write.");
          }
          if (skipped.length) {
            logger.warn(
              `${skipped.length} old URL(s) deliberately left without a redirect:\n` +
                skipped.map((s) => `  ${s.replace(/^#\s+/, "")}`).join("\n")
            );
          }
        } catch (error) {
          throw new Error("Cannot generate _redirects; refusing an incomplete deploy.", { cause: error });
        }

        // --- deploy manifest, moved out of the published output ---
        const manifestIn = join(outDir, "deploy-manifest.json");
        try {
          const manifest = await readFile(manifestIn, "utf8");
          const target = join(dirname(outDir), ".deploy", "manifest.json");
          await mkdir(dirname(target), { recursive: true });
          await writeFile(target, manifest, "utf8");
          // Public commitment only, never the private IDs or content. It binds
          // the local manifest to this exact deployment during confirmation.
          await writeFile(join(outDir, "deploy-proof.json"), JSON.stringify({
            deployId: JSON.parse(manifest).deployId,
            manifestHash: createHash("sha256").update(manifest).digest("hex")
          }), "utf8");
          await rm(manifestIn, { force: true });

          const count = JSON.parse(manifest).entries.length;
          logger.info(`Deploy manifest written with ${count} published record(s).`);
        } catch (error) {
          throw new Error("Cannot isolate and seal the deploy manifest; refusing publication.", { cause: error });
        }
      }
    }
  };
}
