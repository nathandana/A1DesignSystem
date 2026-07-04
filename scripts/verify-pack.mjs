#!/usr/bin/env node
/**
 * verify-pack.mjs — guard against publishing a broken npm tarball.
 *
 * Runs `npm pack --dry-run` for packages/react and verifies, without
 * publishing anything, that:
 *   1. every relative import in shipped .js/.jsx files resolves to a file
 *      that is also in the tarball (catches `files` whitelist gaps);
 *   2. every entry point in package.json (main, types, exports) ships;
 *   3. every guidelines/*.md on disk ships, including the five companion
 *      files that Guidelines.md promises;
 *   4. the "All exported components" list in guidelines/Guidelines.md matches
 *      the named exports of src/index.js;
 *   5. src/index.d.ts declares the same export names as src/index.js, and
 *      every module it references resolves to a shipped .d.ts file.
 *
 * Usage: npm run pack:check
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = path.join(repoRoot, "packages", "react");
const failures = [];

// ── 1. Shipped file list from npm pack --dry-run ────────────────────────────
const packJson = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  cwd: pkgDir,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const shipped = new Set(JSON.parse(packJson)[0].files.map((f) => f.path));
console.log(`Tarball contains ${shipped.size} files.`);

// ── 2. Relative imports in shipped JS/JSX must resolve inside the tarball ──
const importRe = /(?:from|import)\s*\(?\s*["'](\.[^"']+)["']/g;
for (const file of shipped) {
  if (!/\.(js|jsx)$/.test(file)) continue;
  const source = readFileSync(path.join(pkgDir, file), "utf8");
  for (const match of source.matchAll(importRe)) {
    const spec = match[1];
    const base = path.posix.join(path.posix.dirname(file), spec);
    const candidates = spec.match(/\.(js|jsx|css|json)$/)
      ? [base]
      : [`${base}.js`, `${base}.jsx`, `${base}/index.js`];
    if (!candidates.some((c) => shipped.has(c))) {
      failures.push(`unresolvable import in shipped file: ${file} -> ${spec}`);
    }
  }
}

// ── 3. package.json entry points must ship ─────────────────────────────────
const manifest = JSON.parse(readFileSync(path.join(pkgDir, "package.json"), "utf8"));
const entryPoints = [manifest.main, manifest.types];
for (const target of Object.values(manifest.exports ?? {})) {
  if (typeof target === "string" && !target.includes("*")) entryPoints.push(target);
}
for (const entry of entryPoints.filter(Boolean)) {
  const rel = entry.replace(/^\.\//, "");
  if (!shipped.has(rel)) failures.push(`package.json entry point not in tarball: ${entry}`);
}

// ── 4. Guidelines: all on-disk .md files ship + promised companions exist ──
const companions = ["Guidelines.md", "setup.md", "components.md", "icon-discovery.md", "tokens.md", "styles.md"];
for (const name of companions) {
  if (!existsSync(path.join(pkgDir, "guidelines", name))) {
    failures.push(`promised guideline file missing on disk: guidelines/${name}`);
  }
}
for (const name of readdirSync(path.join(pkgDir, "guidelines"))) {
  if (name.endsWith(".md") && !shipped.has(`guidelines/${name}`)) {
    failures.push(`guideline file not in tarball: guidelines/${name}`);
  }
}

// ── 5. Guidelines export list matches src/index.js ─────────────────────────
const indexSrc = readFileSync(path.join(pkgDir, "src", "index.js"), "utf8");
const actualExports = new Set(
  [...indexSrc.matchAll(/export\s*\{([^}]+)\}/g)].flatMap((m) =>
    m[1].split(",").map((n) => n.trim()).filter(Boolean)
  )
);
const hub = readFileSync(path.join(pkgDir, "guidelines", "Guidelines.md"), "utf8");
const section = hub.split("## All exported components")[1]?.split("\n## ")[0] ?? "";
const listedExports = new Set(
  [...section.matchAll(/`([A-Za-z_][A-Za-z0-9_]*)`/g)].map((m) => m[1])
);
for (const name of actualExports) {
  if (!listedExports.has(name)) failures.push(`export missing from Guidelines.md list: ${name}`);
}
for (const name of listedExports) {
  if (!actualExports.has(name)) failures.push(`Guidelines.md lists a non-existent export: ${name}`);
}

// ── 6. index.d.ts parity with index.js ─────────────────────────────────────
const dtsSrc = readFileSync(path.join(pkgDir, "src", "index.d.ts"), "utf8");
const dtsExports = new Set(
  [...dtsSrc.matchAll(/export\s*\{([^}]+)\}/g)].flatMap((m) =>
    m[1].split(",").map((n) => n.trim()).filter(Boolean)
  )
);
for (const name of actualExports) {
  if (!dtsExports.has(name)) failures.push(`export missing from index.d.ts: ${name}`);
}
for (const name of dtsExports) {
  if (!actualExports.has(name)) failures.push(`index.d.ts declares a non-existent export: ${name}`);
}
for (const m of dtsSrc.matchAll(/from\s*"(\.[^"]+)"/g)) {
  const rel = path.posix.join("src", m[1].replace(/\.jsx?$/, "") + ".d.ts");
  if (!shipped.has(rel)) failures.push(`index.d.ts references a module with no shipped .d.ts: ${m[1]}`);
}

// ── Report ──────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error(`\npack:check FAILED — ${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("pack:check passed — tarball is self-contained and docs are in sync.");
