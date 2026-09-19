/**
 * Minimal TypeScript loader for the test run.
 *
 * The production modules are TypeScript and use the `@/` path alias. Rather
 * than copy their logic into the tests, which is exactly the weakness this
 * replaces, they are resolved and stripped of types on the fly so the tests
 * exercise the real implementation.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve as resolvePath, dirname } from "node:path";
import { transformSync } from "esbuild";

const projectRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * TypeScript imports omit the extension, and a folder import means its
 * index.ts. Node requires the exact file, so the candidates are tried in the
 * same order the TypeScript resolver would.
 */
function resolveTsPath(base) {
  const candidates = [base, `${base}.ts`, resolvePath(base, "index.ts")];
  return candidates.find((candidate) => candidate.endsWith(".ts") && existsSync(candidate));
}

export async function resolve(specifier, context, next) {
  // Mirror the `@/*` -> `src/*` mapping declared in tsconfig.json.
  if (specifier.startsWith("@/")) {
    const target = resolveTsPath(resolvePath(projectRoot, "src", specifier.slice(2)));
    if (target) return { url: pathToFileURL(target).href, shortCircuit: true };
  }

  // Relative imports between TypeScript modules, also extensionless.
  if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
    const parentDir = dirname(fileURLToPath(context.parentURL));
    const target = resolveTsPath(resolvePath(parentDir, specifier));
    if (target) return { url: pathToFileURL(target).href, shortCircuit: true };
  }

  return next(specifier, context);
}

export async function load(url, context, next) {
  if (!url.endsWith(".ts")) return next(url, context);

  const source = await readFile(fileURLToPath(url), "utf8");
  const { code } = transformSync(source, {
    loader: "ts",
    format: "esm",
    target: "node20"
  });

  return { format: "module", shortCircuit: true, source: code };
}
