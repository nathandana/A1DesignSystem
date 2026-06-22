/**
 * no-raw-color — enforces the "all values from tokens" law for colours on real code.
 * Maps to YAML rule `system-tokens-only`.
 *
 * Flags a raw colour (`#hex`, `rgb()/rgba()`, `hsl()/hsla()`) used as the value of a
 * colour-bearing style property (`color`, `background`, `borderColor`, `boxShadow`, …) in a
 * style object or JSX `style={{…}}`. Values routed through a token (`var(--…)`) are allowed,
 * as are keywords like `transparent` / `currentColor`. Use a design token, never a raw value.
 *
 * Scoped to style declarations (by property name) on purpose, so it does not flag unrelated
 * hex-looking strings elsewhere in code. The component `.css` files are covered by the CSS
 * arm of the gate (`scripts/lint-a1-css.mjs`).
 */
import { containsRawColor, usesToken, staticString } from '../util.js';

// CSS properties whose value carries a colour (camelCase, as written in JS style objects).
const COLOR_PROPS = new Set([
  'color', 'background', 'backgroundColor', 'borderColor', 'border',
  'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
  'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
  'outline', 'outlineColor', 'boxShadow', 'textShadow', 'fill', 'stroke',
  'caretColor', 'columnRuleColor', 'textDecorationColor', 'accentColor',
  'background-color', 'border-color', 'box-shadow', 'outline-color',
]);

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Use design tokens for colour, never a raw hex/rgb/hsl value in a style declaration.',
      recommended: true,
    },
    schema: [{
      type: 'object',
      properties: { allow: { type: 'array', items: { type: 'string' } } },
      additionalProperties: false,
    }],
    messages: {
      rawColor:
        'Raw colour "{{value}}" in `{{prop}}` — use a design token, e.g. var(--semantic-color-…). If no token fits, add one to system/tokens/ first. (A1 rule: system-tokens-only)',
    },
  },
  create(context) {
    const allow = new Set((context.options[0]?.allow) ?? []);

    function checkProperty(node) {
      const key = node.key;
      const keyName = key?.type === 'Identifier' ? key.name
        : key?.type === 'Literal' ? key.value : null;
      if (!keyName || !COLOR_PROPS.has(keyName)) return;
      const val = staticString(node.value);
      if (val == null) return;
      if (allow.has(val.trim())) return;
      if (usesToken(val)) return; // var(--token) — allowed
      if (containsRawColor(val)) {
        context.report({ node: node.value, messageId: 'rawColor', data: { value: val.trim(), prop: keyName } });
      }
    }

    return { Property: checkProperty };
  },
};
