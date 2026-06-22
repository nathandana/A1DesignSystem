#!/usr/bin/env node
/**
 * lint-a1-css — the CSS arm of the A1 design-rule gate.
 *
 * ESLint covers JS/JSX/TS; this covers the hand-authored stylesheets, enforcing the two CSS
 * laws that carry `enforcement.css: true` in `system/rules/*.yaml`:
 *   • system-no-uppercase-content — no `text-transform: uppercase | lowercase | capitalize`.
 *   • system-tokens-only — no raw `#hex` / `rgb()/rgba()` / `hsl()/hsla()` colour; use a token.
 *     Raw colours inside `var(--token, …)` fallbacks are allowed (the token is the source).
 *
 * Scans only hand-authored CSS (component styles + the pure base/pure files). Generated token
 * and theme stylesheets are excluded — they define the raw values the tokens map to.
 *
 * Exits non-zero on any violation. Usage: node scripts/lint-a1-css.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── Files to scan (hand-authored only) ───────────────────────────────────────
function walkCss(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkCss(full, out);
    else if (name.endsWith('.css')) out.push(full);
  }
  return out;
}

const files = [
  ...walkCss(join(root, 'packages', 'react', 'src', 'components')),
  // a1-base.css = reusable BEM classes (gated). a1-pure.css is the demo/example stylesheet
  // (decorative example gradients) — out of scope, like Storybook stories.
  join(root, 'packages', 'pure', 'dist', 'a1-base.css'),
].filter((f) => existsSync(f));

// ── Checks ───────────────────────────────────────────────────────────────────
const UPPERCASE = /text-transform\s*:\s*(uppercase|lowercase|capitalize)/i;
const RAW_HEX = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;
const RAW_FUNC = /\b(?:rgb|rgba|hsl|hsla)\(\s*[\d.]/i;

/** Remove block comments and `var(...)` (incl. raw fallbacks) so only "live" raw values remain. */
function stripIgnorable(line) {
  return line
    .replace(/\/\*.*?\*\//g, '')          // inline block comments
    .replace(/var\(\s*--[^)]*\)/g, 'TOKEN'); // token refs + their fallbacks are allowed
}

const violations = [];
for (const file of files) {
  const rel = relative(root, file);
  const raw = readFileSync(file, 'utf8');
  // Drop multi-line block comments wholesale first, keeping line count via newline preservation.
  const decommented = raw.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const lines = decommented.split('\n');
  lines.forEach((line, i) => {
    const clean = stripIgnorable(line);
    if (UPPERCASE.test(clean)) {
      violations.push({ rule: 'system-no-uppercase-content', file: rel, line: i + 1, text: line.trim() });
    }
    if (RAW_HEX.test(clean) || RAW_FUNC.test(clean)) {
      violations.push({ rule: 'system-tokens-only', file: rel, line: i + 1, text: line.trim() });
    }
  });
}

if (violations.length) {
  console.error(`✖ A1 CSS gate — ${violations.length} violation(s) in hand-authored CSS:\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  [${v.rule}]\n      ${v.text.slice(0, 100)}`);
  }
  console.error('\nUse a design token (var(--…)) and author sentence case. See system/rules/system.yaml.');
  process.exit(1);
}

console.log(`✓ A1 CSS gate clean — scanned ${files.length} hand-authored stylesheet(s).`);
