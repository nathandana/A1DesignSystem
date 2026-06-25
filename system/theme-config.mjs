import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const systemDir = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(systemDir);
const themesDir = join(systemDir, "themes");
const tokensDir = join(systemDir, "tokens");

function walk(dir, predicate, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walk(file, predicate, out);
    else if (predicate(file)) out.push(file);
  }
  return out;
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`${relative(rootDir, file)}: ${error.message}`);
  }
}

function flattenTokens(node, path = [], out = []) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return out;
  if (Object.hasOwn(node, "$value")) {
    out.push({
      path: path.join("."),
      type: node.$type,
      value: node.$value,
    });
    return out;
  }
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith("$")) flattenTokens(value, [...path, key], out);
  }
  return out;
}

export function tokenPathToCssName(path) {
  return `--${path
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\./g, "-")
    .toLowerCase()}`;
}

const tokenDefinitions = new Map();
for (const file of walk(tokensDir, (item) => item.endsWith(".json"))) {
  for (const token of flattenTokens(readJson(file))) {
    tokenDefinitions.set(token.path, token);
  }
}

function assertRelativeFile(themeDir, reference, label) {
  if (typeof reference !== "string" || !reference.endsWith(".json")) {
    throw new Error(`${label} must reference a JSON file`);
  }
  const file = resolve(themeDir, reference);
  if (!file.startsWith(`${themeDir}/`) || !existsSync(file)) {
    throw new Error(`${label} references missing or external file: ${reference}`);
  }
  return file;
}

function valueToCss(value) {
  if (typeof value !== "string") return String(value);
  return value.replace(/\{([^}]+)\}/g, (_, path) => {
    if (!tokenDefinitions.has(path)) {
      throw new Error(`Unknown token alias {${path}}`);
    }
    return `var(${tokenPathToCssName(path)})`;
  });
}

function readOverrides(themeDir, reference) {
  const file = assertRelativeFile(themeDir, reference, "overrides");
  const source = readJson(file);
  const declarations = {};
  const allowedKeys = new Set(["tokens", "customProperties"]);
  for (const key of Object.keys(source)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`${relative(rootDir, file)}: unsupported property ${key}`);
    }
  }

  for (const token of flattenTokens(source.tokens ?? {})) {
    const definition = tokenDefinitions.get(token.path);
    if (!definition) {
      throw new Error(
        `${relative(rootDir, file)}: override path ${token.path} is not a canonical token`,
      );
    }
    if (!token.type) {
      throw new Error(`${relative(rootDir, file)}: ${token.path} is missing $type`);
    }
    if (token.type !== definition.type) {
      throw new Error(
        `${relative(rootDir, file)}: ${token.path} has type ${token.type}; expected ${definition.type}`,
      );
    }
    declarations[tokenPathToCssName(token.path)] = valueToCss(token.value);
  }

  const customProperties = source.customProperties ?? {};
  if (!customProperties || typeof customProperties !== "object" || Array.isArray(customProperties)) {
    throw new Error(`${relative(rootDir, file)}: customProperties must be an object`);
  }
  for (const [name, token] of Object.entries(customProperties)) {
    if (!name.startsWith("--")) {
      throw new Error(`${relative(rootDir, file)}: ${name} is not a custom property`);
    }
    if (!token || typeof token !== "object" || !Object.hasOwn(token, "$value") || !token.$type) {
      throw new Error(`${relative(rootDir, file)}: ${name} must have $type and $value`);
    }
    declarations[name] = valueToCss(token.$value);
  }

  return declarations;
}

function readStyles(themeDir, reference) {
  const file = assertRelativeFile(themeDir, reference, "styles");
  const source = readJson(file);
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error(`${relative(rootDir, file)}: styles must be an object`);
  }
  for (const name of Object.keys(source)) {
    if (name.startsWith("--")) {
      throw new Error(
        `${relative(rootDir, file)}: custom properties belong in an overrides file`,
      );
    }
  }
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== ""),
  );
}

export function readTheme(themeFile) {
  const theme = readJson(themeFile);
  const themeDir = dirname(themeFile);
  const id = themeDir.split("/").at(-1);
  const allowedThemeKeys = new Set(["$schema", "name", "description", "selectors", "labels"]);
  for (const key of Object.keys(theme)) {
    if (!allowedThemeKeys.has(key)) {
      throw new Error(`${relative(rootDir, themeFile)}: unsupported property ${key}`);
    }
  }

  if (typeof theme.name !== "string" || !theme.name.trim()) {
    throw new Error(`${relative(rootDir, themeFile)}: name must be a non-empty string`);
  }
  if (!Array.isArray(theme.selectors)) {
    throw new Error(`${relative(rootDir, themeFile)}: selectors must be an array`);
  }

  const selectors = theme.selectors.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${relative(rootDir, themeFile)}: selectors[${index}] must be an object`);
    }
    if (typeof entry.selector !== "string" || !entry.selector.trim()) {
      throw new Error(`${relative(rootDir, themeFile)}: selectors[${index}] needs a selector`);
    }
    const allowedSelectorKeys = new Set(["selector", "overrides", "styles"]);
    for (const key of Object.keys(entry)) {
      if (!allowedSelectorKeys.has(key)) {
        throw new Error(
          `${relative(rootDir, themeFile)}: selectors[${index}] has unsupported property ${key}`,
        );
      }
    }
    if (!entry.overrides && !entry.styles) {
      throw new Error(
        `${relative(rootDir, themeFile)}: selectors[${index}] needs overrides or styles`,
      );
    }
    return {
      selector: entry.selector,
      declarations: {
        ...(entry.overrides ? readOverrides(themeDir, entry.overrides) : {}),
        ...(entry.styles ? readStyles(themeDir, entry.styles) : {}),
      },
    };
  });

  return {
    id,
    file: themeFile,
    name: theme.name,
    description: theme.description,
    labels: theme.labels,
    selectors,
  };
}

export function readThemes() {
  return readdirSync(themesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(themesDir, entry.name, "theme.json"))
    .filter(existsSync)
    .map(readTheme)
    .sort((a, b) => {
      if (a.id === "base") return -1;
      if (b.id === "base") return 1;
      return a.id.localeCompare(b.id);
    });
}

export function canonicalTokenDefinitions() {
  return new Map(tokenDefinitions);
}
