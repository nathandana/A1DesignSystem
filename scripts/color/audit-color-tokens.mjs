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
import { DARK_MODE_VARIABLES } from "../../system/color-modes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const checkOnly = process.argv.includes("--check");
const reportFile = join(root, "packages/react/ai/color-token-audit.md");
const tokenRoot = join(root, "system/tokens");
const themeRoot = join(root, "system/themes");
const componentCssRoot = join(root, "packages/react/src/components");
const colorSchemeFile = join(root, "packages/react/src/color-scheme.css");

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
const themeTokenFiles = walk(themeRoot, (file) => file.includes("/tokens/") && file.endsWith(".json"));
const tokens = [...tokenFiles, ...themeTokenFiles].flatMap((file) => {
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
  colorSchemeFile,
];
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
for (const file of themeFiles) {
  const theme = JSON.parse(readFileSync(file, "utf8"));
  if (!theme.name || typeof theme.name !== "string") {
    themeSchemaErrors.push(`${relative(root, file)}: missing string name`);
  }
  if (!theme.selectors || typeof theme.selectors !== "object" || Array.isArray(theme.selectors)) {
    themeSchemaErrors.push(`${relative(root, file)}: selectors must be an object`);
    continue;
  }
  for (const [selector, properties] of Object.entries(theme.selectors)) {
    if (!selector.trim()) themeSchemaErrors.push(`${relative(root, file)}: empty selector`);
    if (!properties || typeof properties !== "object" || Array.isArray(properties)) {
      themeSchemaErrors.push(`${relative(root, file)}: ${selector} declarations must be an object`);
      continue;
    }
    rawThemeOverrideCount += Object.keys(properties).filter((name) => name.startsWith("--")).length;
  }
}

const colorSchemeText = readFileSync(colorSchemeFile, "utf8");
const reactDark = selectorDeclarations(colorSchemeText, "html.a1-theme-dark");
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

const blocking = {
  duplicateTokenPaths: duplicates.length,
  unresolvedAliases: unresolvedAliases.length,
  unknownCssReferences: unknownReferences.length,
  themeSchemaErrors: themeSchemaErrors.length,
  reactDarkContractDrift: darkContractDrift.length,
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
| Component CSS color references | ${componentReferences.length} |
| Unknown CSS custom-property references | ${unknownReferences.length} |
| Raw colors in authored React CSS | ${rawColors.length} |
| React dark-mode contract differences | ${darkContractDrift.length} |

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
