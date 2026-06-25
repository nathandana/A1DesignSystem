#!/usr/bin/env node
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { DARK_MODE_VARIABLES, LIGHT_MODE_DECLARATIONS } from "../../system/color-modes.mjs";
import { readThemes } from "../../system/theme-config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const checkOnly = process.argv.includes("--check");
const reportFile = join(root, "packages/react/ai/color-token-audit.md");
const tokenRoot = join(root, "system/tokens");
const themeRoot = join(root, "system/themes");
const componentCssRoot = join(root, "packages/react/src/components");
const colorSchemeStaticFile = join(root, "packages/react/src/color-scheme-static.css");
const colorSchemeModesFile = join(root, "packages/react/src/color-scheme-modes.css");
// Keep the entry-point path for backward compat; raw-color scan uses static + modes directly.
const colorSchemeFile = colorSchemeStaticFile;

function walk(dir, predicate, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function flattenTokens(node, file, path = [], out = []) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return out;
  if (Object.hasOwn(node, "$value")) {
    out.push({
      path: path.join("."),
      type: node.$type ?? "unknown",
      value: node.$value,
      file: relative(root, file),
    });
    return out;
  }
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith("$")) flattenTokens(value, file, [...path, key], out);
  }
  return out;
}

function cssName(tokenPath) {
  return `--${tokenPath
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\./g, "-")
    .toLowerCase()}`;
}

function classifyName(name) {
  if (name.startsWith("--base-color-")) return "base";
  if (name.startsWith("--semantic-color-")) return "semantic";
  if (name.startsWith("--component-")) return "component";
  if (name.startsWith("--brand-")) return "brand";
  if (name.startsWith("--a1-")) return "private";
  return "unknown";
}

function lineNumber(text, offset) {
  return text.slice(0, offset).split("\n").length;
}

function declarationsFromCss(file) {
  const text = readFileSync(file, "utf8");
  const declarations = [];
  for (const match of text.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi)) {
    declarations.push({
      name: match[1],
      value: match[2].trim(),
      file: relative(root, file),
      line: lineNumber(text, match.index),
    });
  }
  return declarations;
}

function referencesFromCss(file) {
  const text = readFileSync(file, "utf8");
  const references = [];
  for (const declaration of text.matchAll(/([a-z-]+)\s*:\s*([^;{}]+);/gi)) {
    const property = declaration[1];
    const value = declaration[2];
    const colorContext = (
      !/(radius|width|style|spacing|size)$/i.test(property)
      && /(color|background|border|fill|stroke|shadow|outline|caret)/i.test(property)
    );
    for (const match of value.matchAll(/var\(\s*(--[a-z0-9-]+)(\s*,)?/gi)) {
      references.push({
        name: match[1],
        property,
        colorContext,
        hasFallback: Boolean(match[2]),
        file: relative(root, file),
        line: lineNumber(text, declaration.index),
      });
    }
  }
  return references;
}

function selectorDeclarations(text, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escaped}\\s*\\{([^{}]*)\\}`));
  if (!match) return {};
  return Object.fromEntries(
    [...match[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)]
      .map((item) => [item[1], item[2].trim()]),
  );
}

const tokenFiles = walk(tokenRoot, (file) => file.endsWith(".json"));
const tokens = tokenFiles.flatMap((file) => {
  const source = JSON.parse(readFileSync(file, "utf8"));
  return flattenTokens(source, file);
});

const byPath = new Map();
for (const token of tokens) {
  if (!byPath.has(token.path)) byPath.set(token.path, []);
  byPath.get(token.path).push(token);
}

const duplicates = [...byPath.entries()]
  .filter(([, definitions]) => definitions.length > 1)
  .map(([path, definitions]) => ({ path, definitions }));

const aliases = [];
for (const token of tokens) {
  if (typeof token.value !== "string") continue;
  for (const match of token.value.matchAll(/\{([^}]+)\}/g)) {
    aliases.push({ from: token.path, to: match[1], file: token.file });
  }
}
const unresolvedAliases = aliases.filter((alias) => !byPath.has(alias.to));

const cssFiles = [
  ...walk(componentCssRoot, (file) => file.endsWith(".css")),
  colorSchemeFile,
  join(root, "packages/react/src/themes.css"),
  join(root, "packages/react/src/tokens.css"),
].filter(existsSync);
const declarations = cssFiles.flatMap(declarationsFromCss);
const references = cssFiles.flatMap(referencesFromCss);
const sourceFiles = walk(join(root, "packages/react/src"), (file) => /\.(?:js|jsx|ts|tsx)$/.test(file));
const sourceDeclaredNames = new Set();
for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/["'](--[a-z0-9-]+)["']\s*:/gi)) sourceDeclaredNames.add(match[1]);
  for (const match of text.matchAll(/setProperty\(\s*["'](--[a-z0-9-]+)["']/gi)) sourceDeclaredNames.add(match[1]);
}
const declaredNames = new Set([
  ...tokens.map((token) => cssName(token.path)),
  ...declarations.map((item) => item.name),
  ...sourceDeclaredNames,
]);
const unknownReferences = references.filter((reference) => (
  reference.colorContext
  && !reference.hasFallback
  && !declaredNames.has(reference.name)
));

const componentReferences = walk(componentCssRoot, (file) => file.endsWith(".css"))
  .flatMap(referencesFromCss)
  .filter((reference) => reference.colorContext);
const componentUsage = Object.groupBy(componentReferences, (reference) => classifyName(reference.name));

const rawColors = [];
const authoredCssFiles = [
  ...walk(componentCssRoot, (file) => file.endsWith(".css")),
  colorSchemeStaticFile,
  colorSchemeModesFile,
].filter(existsSync);
for (const file of authoredCssFiles) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)) {
    const before = text.slice(Math.max(0, match.index - 80), match.index);
    if (/var\(\s*--[^)]*,\s*$/i.test(before)) continue;
    rawColors.push({
      value: match[0],
      file: relative(root, file),
      line: lineNumber(text, match.index),
    });
  }
}

const themeFiles = walk(themeRoot, (file) => file.endsWith("theme.json"));
const themeSchemaErrors = [];
let rawThemeOverrideCount = 0;
let structuredThemeOverrideCount = 0;
for (const file of themeFiles) {
  const theme = JSON.parse(readFileSync(file, "utf8"));
  if (!theme.name || typeof theme.name !== "string") {
    themeSchemaErrors.push(`${relative(root, file)}: missing string name`);
  }
  if (!Array.isArray(theme.selectors)) {
    themeSchemaErrors.push(`${relative(root, file)}: selectors must be an array`);
  }
}
try {
  const themes = readThemes();
  structuredThemeOverrideCount = themes.reduce(
    (total, theme) => total + theme.selectors.reduce(
      (selectorTotal, entry) => selectorTotal
        + Object.keys(entry.declarations).filter((name) => name.startsWith("--")).length,
      0,
    ),
    0,
  );
} catch (error) {
  themeSchemaErrors.push(error.message);
}

const colorSchemeModesText = existsSync(colorSchemeModesFile)
  ? readFileSync(colorSchemeModesFile, "utf8")
  : "";
const reactDark = selectorDeclarations(colorSchemeModesText, "html.a1-theme-dark");
const darkContractDrift = [];
for (const [name, expected] of Object.entries(DARK_MODE_VARIABLES)) {
  if (reactDark[name] !== expected) {
    darkContractDrift.push({
      name,
      expected,
      actual: reactDark[name] ?? "missing",
    });
  }
}
const reactLight = selectorDeclarations(colorSchemeModesText, "html.a1-theme-light");
const lightContractDrift = [];
for (const [name, expected] of Object.entries(LIGHT_MODE_DECLARATIONS)) {
  if (reactLight[name] !== expected) {
    lightContractDrift.push({
      name,
      expected,
      actual: reactLight[name] ?? "missing",
    });
  }
}

const componentBaseColorRefs = [...new Set(
  (componentUsage.base ?? []).map((ref) => `${ref.file}:${ref.line}`),
)];
const brandTokenDefinitions = tokens.filter((token) => token.path.startsWith("brand."));

const blocking = {
  duplicateTokenPaths: duplicates.length,
  unresolvedAliases: unresolvedAliases.length,
  unknownCssReferences: unknownReferences.length,
  themeSchemaErrors: themeSchemaErrors.length,
  reactDarkContractDrift: darkContractDrift.length,
  reactLightContractDrift: lightContractDrift.length,
  componentBaseColorReferences: componentBaseColorRefs.length,
  brandTokenDefinitions: brandTokenDefinitions.length,
};

const usageRows = ["base", "semantic", "component", "brand", "private", "unknown"]
  .map((tier) => `| ${tier} | ${(componentUsage[tier] ?? []).length} |`)
  .join("\n");

const report = `# Color Token Audit

Generated by \`npm run tokens:audit\`.

## Summary

| Check | Result |
|-------|-------:|
| Token definitions | ${tokens.length} |
| Token aliases | ${aliases.length} |
| Duplicate token paths | ${duplicates.length} |
| Unresolved token aliases | ${unresolvedAliases.length} |
| Theme files | ${themeFiles.length} |
| Raw theme custom-property overrides | ${rawThemeOverrideCount} |
| Structured theme custom-property overrides | ${structuredThemeOverrideCount} |
| Component CSS color references | ${componentReferences.length} |
| Unknown CSS custom-property references | ${unknownReferences.length} |
| Raw colors in authored React CSS | ${rawColors.length} |
| React dark-mode contract differences | ${darkContractDrift.length} |
| React light-mode contract differences | ${lightContractDrift.length} |
| Direct base-color use in component CSS | ${componentBaseColorRefs.length} |
| Brand compatibility token definitions | ${brandTokenDefinitions.length} |

## Component CSS Usage

| Tier | References |
|------|-----------:|
${usageRows}

## Blocking Findings

### Duplicate token paths

${duplicates.length ? duplicates.map((item) => `- \`${item.path}\`: ${item.definitions.map((definition) => definition.file).join(", ")}`).join("\n") : "_None._"}

### Unresolved aliases

${unresolvedAliases.length ? unresolvedAliases.map((item) => `- \`${item.from}\` → \`${item.to}\` (${item.file})`).join("\n") : "_None._"}

### Unknown CSS references

${unknownReferences.length ? unknownReferences.map((item) => `- \`${item.name}\` at \`${item.file}:${item.line}\``).join("\n") : "_None._"}

### Theme schema

${themeSchemaErrors.length ? themeSchemaErrors.map((item) => `- ${item}`).join("\n") : "_No structural errors._"}

### React dark-mode contract

${darkContractDrift.length ? darkContractDrift.map((item) => `- \`${item.name}\`: expected \`${item.expected}\`, found \`${item.actual}\``).join("\n") : "_Matches the shared mode contract._"}

### React light-mode contract

${lightContractDrift.length ? lightContractDrift.map((item) => `- \`${item.name}\`: expected \`${item.expected}\`, found \`${item.actual}\``).join("\n") : "_Matches the shared mode contract._"}

### Direct base-color use in component CSS (blocking from Phase 3)

${componentBaseColorRefs.length ? componentBaseColorRefs.map((item) => `- \`${item}\``).join("\n") : "_None — all component color references resolve through semantic or component tokens._"}

### Brand compatibility token definitions

${brandTokenDefinitions.length ? brandTokenDefinitions.map((item) => `- \`${item.path}\` at \`${item.file}\``).join("\n") : "_None — the unused brand alias tier has been removed._"}

## Migration Findings

### Direct base-color use in component CSS

${(componentUsage.base ?? []).length ? [...new Set((componentUsage.base ?? []).map((item) => `- \`${item.name}\` at \`${item.file}:${item.line}\``))].join("\n") : "_None._"}

### Brand aliases used by component CSS

${(componentUsage.brand ?? []).length ? [...new Set((componentUsage.brand ?? []).map((item) => `- \`${item.name}\` at \`${item.file}:${item.line}\``))].join("\n") : "_None._"}

### Raw authored CSS colors

${rawColors.length ? rawColors.map((item) => `- \`${item.value}\` at \`${item.file}:${item.line}\``).join("\n") : "_None._"}
`;

writeFileSync(reportFile, report);

const blockingCount = Object.values(blocking).reduce((total, count) => total + count, 0);
console.log(`Color token audit: ${tokens.length} tokens, ${componentReferences.length} component references.`);
console.log(`Report: ${relative(root, reportFile)}`);
if (blockingCount > 0) {
  console.error(`Blocking findings: ${blockingCount}`, blocking);
  if (checkOnly) process.exit(1);
}
