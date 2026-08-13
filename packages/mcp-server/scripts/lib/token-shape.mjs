// Shared shape helpers for flattening token trees and resolving DTCG alias
// references (`{dotted.path}`) against a base value lookup. Used by both
// parse-tokens.mjs (the resolved build/json/tokens.json tree) and
// parse-themes.mjs (the raw DTCG override trees under system/themes/).

export function toKebab(segment) {
  return String(segment).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function cssVarName(pathSegments) {
  return `--${pathSegments.map(toKebab).join('-')}`;
}

/** Flatten a plain resolved tree (leaves are primitives, e.g. build/json/tokens.json). */
export function flattenResolvedTree(node, pathSegments = [], out = []) {
  if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) {
      flattenResolvedTree(value, [...pathSegments, key], out);
    }
    return out;
  }
  out.push({ path: pathSegments.join('.'), cssVar: cssVarName(pathSegments), value: node });
  return out;
}

/** Flatten a DTCG tree (leaves are `{ $type, $value }`, e.g. theme override files). */
export function flattenDtcgTree(node, pathSegments = [], out = []) {
  if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
    if (Object.prototype.hasOwnProperty.call(node, '$value')) {
      out.push({
        path: pathSegments.join('.'),
        cssVar: cssVarName(pathSegments),
        type: node.$type ?? null,
        value: node.$value,
      });
      return out;
    }
    for (const [key, value] of Object.entries(node)) {
      flattenDtcgTree(value, [...pathSegments, key], out);
    }
  }
  return out;
}

const ALIAS_RE = /^\{([\w.]+)\}$/;

/**
 * Resolve a DTCG alias string (`{base.color.accent.500}`) against a dotted-path
 * lookup, following chained aliases up to a small depth. Returns the original
 * value unchanged when it isn't an alias or the alias can't be resolved — this
 * is a lookup convenience, not a full alias-graph resolver (see plan notes).
 */
export function resolveAlias(value, lookupByPath, depth = 0) {
  if (depth > 6) return value;
  const match = typeof value === 'string' ? value.match(ALIAS_RE) : null;
  if (!match) return value;
  const resolved = lookupByPath.get(match[1]);
  if (resolved === undefined) return value;
  return resolveAlias(resolved, lookupByPath, depth + 1);
}
