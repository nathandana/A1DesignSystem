/**
 * Shared helpers for the A1 ESLint rules.
 *
 * These rules enforce, on real JS/JSX/TS code, the design rules authored in
 * `system/rules/*.yaml`. The YAML stays the single source of truth: each rule below carries
 * the `a1RuleId` of the YAML rule it enforces, and `scripts/build-eslint-rules.mjs` keeps the
 * descriptions/links in sync (and fails CI if the mapping drifts).
 */

/** Where a rule's human-readable spec lives (the YAML, also viewable on the a1-web Rules page). */
export function docUrl(yamlFile) {
  return `system/rules/${yamlFile ?? '*.yaml'} (also: a1-web → Components → Rules)`;
}

// ── Colour literals ──────────────────────────────────────────────────────────

/** A string whose *entire* value is a raw colour (`#abc`, `#aabbcc(aa)`, `rgb()/rgba()`, `hsl()/hsla()`). */
const EXACT_HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const EXACT_FUNC = /^(?:rgb|rgba|hsl|hsla)\(\s*[\d.]/i;
export function isExactColor(value) {
  const v = String(value).trim();
  return EXACT_HEX.test(v) || EXACT_FUNC.test(v);
}

/** A raw colour appearing *anywhere* in a longer value (e.g. `1px solid #ccc`). */
const ANY_HEX = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;
const ANY_FUNC = /\b(?:rgb|rgba|hsl|hsla)\(\s*[\d.]/i;
export function containsRawColor(value) {
  const v = String(value);
  return ANY_HEX.test(v) || ANY_FUNC.test(v);
}

/** True when the value routes the colour through a token (`var(--…)`) — always allowed. */
export function usesToken(value) {
  return /var\(\s*--/.test(String(value));
}

// ── text-transform in CSS-ish strings ────────────────────────────────────────

export const UPPERCASE_TRANSFORM = /text-transform\s*:\s*(uppercase|lowercase|capitalize)/i;

// ── JSX helpers ──────────────────────────────────────────────────────────────

/** The element/component name of a JSXOpeningElement, e.g. `Card`, `button`, `Foo.Bar` → `Bar`. */
export function jsxName(opening) {
  const n = opening.name;
  if (!n) return null;
  if (n.type === 'JSXIdentifier') return n.name;
  if (n.type === 'JSXMemberExpression') return n.property?.name ?? null;
  return null;
}

/** Find a JSX attribute node by name on an opening element. */
export function getAttr(opening, name) {
  return (opening.attributes ?? []).find(
    (a) => a.type === 'JSXAttribute' && a.name?.name === name,
  );
}

/** The literal string value of a JSX attribute, or null when it isn't a plain string. */
export function getStringAttr(opening, name) {
  const attr = getAttr(opening, name);
  if (!attr) return undefined;
  const v = attr.value;
  if (!v) return true; // boolean shorthand, e.g. <Card href>
  if (v.type === 'Literal' && typeof v.value === 'string') return v.value;
  if (v.type === 'JSXExpressionContainer' && v.expression?.type === 'Literal'
    && typeof v.expression.value === 'string') return v.expression.value;
  return undefined;
}

/** Static string value of a Literal or simple (expressionless) TemplateLiteral, else null. */
export function staticString(node) {
  if (!node) return null;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis.map((q) => q.value.cooked ?? q.value.raw).join('');
  }
  return null;
}
