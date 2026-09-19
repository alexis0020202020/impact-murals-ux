/**
 * How the build decides where content comes from, and whether it may publish.
 *
 * A missing token used to fall through to fixtures, which in a production build
 * meant shipping a site with every article silently removed. The empty-snapshot
 * guard never fired, because Airtable was never called. Configuration is now
 * explicit and a production build refuses to guess.
 */

export type SourceMode = "airtable" | "fixtures" | "stress";

export interface SourceConfig {
  mode: SourceMode;
  /** True when publishing is paused. Applies to every build path, not just cron. */
  paused: boolean;
}

function envFlag(name: string): boolean {
  const value = process.env[name];
  return value === "true" || value === "1";
}

/**
 * Resolve the mode.
 *
 * Production requires Airtable credentials unless CONTENT_SOURCE=fixtures is
 * set deliberately, which exists for the very first deploy before the base is
 * populated. A half-configured environment is an error, never a silent
 * fallback: a token without a base id, or the reverse, stops the build.
 */
export function resolveSourceConfig(isProduction: boolean): SourceConfig {
  const explicit = process.env.CONTENT_SOURCE;
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const paused = envFlag("PUBLISHING_PAUSED");
  if (isProduction && paused) throw new Error("PUBLISHING_PAUSED: all production builds are refused; the existing deploy stays online.");
  if (explicit && !["airtable", "fixtures", "stress"].includes(explicit)) throw new Error("Unknown CONTENT_SOURCE.");

  if (explicit === "fixtures") return { mode: "fixtures", paused };

  /*
    Local stress testing only.

    Requires the mode AND a positive volume, so it cannot be reached by a
    partially set environment. Its records are labelled "STRESS TEST" and the
    post-build check fails on that label, which means a stress build can be run
    but never shipped.
  */
  if (explicit === "stress") {
    if (process.env.NETLIFY === "true") throw new Error("Stress content must never be deployed on Netlify.");
    if (!(Number(process.env.SEO_STRESS_COUNT ?? "0") > 0)) {
      throw new Error(
        "CONTENT_SOURCE=stress requires SEO_STRESS_COUNT to be a positive number."
      );
    }
    return { mode: "stress", paused };
  }

  if (explicit === "airtable" && (!apiKey || !baseId)) {
    throw new Error(
      "CONTENT_SOURCE=airtable but AIRTABLE_API_KEY or AIRTABLE_BASE_ID is missing. " +
        "Refusing to build. Set both, or set CONTENT_SOURCE=fixtures deliberately."
    );
  }

  // Partial configuration is always a mistake, in any environment.
  if ((apiKey && !baseId) || (!apiKey && baseId)) {
    throw new Error(
      "Airtable is partially configured: exactly one of AIRTABLE_API_KEY and " +
        "AIRTABLE_BASE_ID is set. Refusing to build rather than publishing a site " +
        "with no editorial content."
    );
  }

  if (apiKey && baseId) return { mode: "airtable", paused };

  if (isProduction) {
    throw new Error(
      "Production build with no Airtable configuration.\n" +
        "Refusing to publish a site with no editorial content, because the previous " +
        "deploy stays live only if this build fails.\n" +
        "Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID, or set CONTENT_SOURCE=fixtures " +
        "if an empty editorial section is genuinely intended."
    );
  }

  return { mode: "fixtures", paused };
}
