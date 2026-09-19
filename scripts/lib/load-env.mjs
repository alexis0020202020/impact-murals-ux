import { readFileSync, existsSync } from "node:fs";
import process from "node:process";

/**
 * Loads a local `.env` into process.env.
 *
 * The documentation told you to put credentials in a `.env`, but nothing ever
 * read it, so an import with `--apply` silently ran as if unconfigured. Real
 * environment variables always win, so CI is unaffected.
 *
 * Deliberately tiny: no dependency, no interpolation, no export syntax.
 */
export function loadEnvFile(path = ".env") {
  if (!existsSync(path)) return false;

  for (const rawLine of readFileSync(path, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const name = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Never override a value already set by the real environment.
    if (name && process.env[name] === undefined) process.env[name] = value;
  }

  return true;
}
