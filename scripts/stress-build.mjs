#!/usr/bin/env node
/**
 * Builds the site against a generated volume of editorial content, then runs
 * the full output check against it.
 *
 * This is the test that pagination, orphan-free linking, canonical and noindex
 * agreement, sitemap splitting and lastmod stability are actually measured on:
 * a real build, real HTML, real sitemaps, not a model of them.
 *
 * The env vars are set here rather than on the command line so the same command
 * works in PowerShell and in a POSIX shell.
 *
 * Usage:
 *   npm run content:stress          100 records
 *   npm run content:stress -- 250   any volume
 *
 * The output is deliberately unshippable: every generated record is labelled,
 * and a normal build refuses that label.
 */

import { spawnSync } from "node:child_process";
import process from "node:process";

const count = Number(process.argv[2] ?? "100");
if (!Number.isFinite(count) || count < 1) {
  console.error("Usage: npm run content:stress -- <count>");
  process.exit(1);
}

const env = {
  ...process.env,
  CONTENT_SOURCE: "stress",
  SEO_STRESS_COUNT: String(count)
};

const options = { stdio: "inherit", env, shell: process.platform === "win32" };

console.log(`\n--- building with ${count} generated records ---\n`);
const build = spawnSync("npx", ["astro", "build"], options);
if (build.status !== 0) process.exit(build.status ?? 1);

console.log("\n--- checking the output ---\n");
const check = spawnSync("node", ["scripts/validate-content.mjs"], options);
process.exit(check.status ?? 1);
