/**
 * no-uppercase-text — enforces the system-wide "never uppercase text" law on real code.
 * Maps to YAML rule `system-no-uppercase-content`.
 *
 * Flags:
 *  1. `.toUpperCase()` / `.toLocaleUpperCase()` on a whole string. The ONE allowed use —
 *     capitalising the first letter to make sentence case — is detected and permitted
 *     (`x.charAt(0).toUpperCase()`, `x[0].toUpperCase()`, `x.slice(0,1).toUpperCase()`, …).
 *  2. `textTransform: "uppercase" | "lowercase" | "capitalize"` in style objects / JSX.
 *  3. `text-transform: uppercase|lowercase|capitalize` inside CSS-in-JS string/template literals.
 */
import { UPPERCASE_TRANSFORM, staticString } from '../util.js';

const FIRST_CHAR_METHODS = new Set(['charAt', 'at', 'slice', 'substring', 'substr']);

/** Is `obj` an expression that yields a single character (so `.toUpperCase()` is sentence-case, allowed)? */
function isSingleCharSource(obj) {
  if (!obj) return false;
  // x[0]
  if (obj.type === 'MemberExpression' && obj.computed) {
    const p = obj.property;
    return p.type === 'Literal' && p.value === 0;
  }
  // x.charAt(0) / x.at(0) / x.slice(0,1) / x.substring(0,1) / x.substr(0,1)
  if (obj.type === 'CallExpression' && obj.callee.type === 'MemberExpression') {
    const method = obj.callee.property?.name;
    if (!FIRST_CHAR_METHODS.has(method)) return false;
    const args = obj.arguments;
    if (method === 'charAt' || method === 'at') {
      return args.length >= 1 && args[0].type === 'Literal' && args[0].value === 0;
    }
    // slice/substring/substr(0, 1)
    return args.length >= 2
      && args[0].type === 'Literal' && args[0].value === 0
      && args[1].type === 'Literal' && args[1].value === 1;
  }
  return false;
}

/**
 * Is this `.toUpperCase()` the body of a `String.replace(regex, cb)` callback? That's the
 * capitalize-the-first-letter idiom (`s.replace(/^\w/, c => c.toUpperCase())`) — the regex
 * matches a single character, so it isn't whole-string uppercasing. Allowed.
 */
function isInReplaceCallback(node) {
  let cur = node.parent;
  let fn = null;
  while (cur) {
    if (cur.type === 'ArrowFunctionExpression' || cur.type === 'FunctionExpression') { fn = cur; break; }
    cur = cur.parent;
  }
  if (!fn || fn.parent?.type !== 'CallExpression') return false;
  const call = fn.parent;
  if (!call.arguments.includes(fn)) return false;
  return call.callee?.type === 'MemberExpression' && call.callee.property?.name === 'replace';
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Never transform text to all-uppercase (or lower/capitalize) — author sentence case directly.',
      recommended: true,
    },
    schema: [],
    messages: {
      toUpperCase:
        'Do not uppercase whole strings ({{method}}). Screen readers may spell out letters and it breaks localized text. Author the label in sentence case. (A1 rule: system-no-uppercase-content)',
      textTransform:
        'Do not use text-transform: {{value}} on content text. Author sentence case directly. (A1 rule: system-no-uppercase-content)',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type !== 'MemberExpression') return;
        const method = callee.property?.name;
        if (method !== 'toUpperCase' && method !== 'toLocaleUpperCase') return;
        if (isSingleCharSource(callee.object)) return; // sentence-case first letter — allowed
        if (isInReplaceCallback(node)) return;          // capitalize-first-letter via .replace() — allowed
        context.report({ node, messageId: 'toUpperCase', data: { method: `.${method}()` } });
      },

      // style objects: { textTransform: 'uppercase' } and JSX style={{ textTransform: 'uppercase' }}
      Property(node) {
        const key = node.key;
        const keyName = key?.type === 'Identifier' ? key.name
          : key?.type === 'Literal' ? key.value : null;
        if (keyName !== 'textTransform' && keyName !== 'text-transform') return;
        const val = staticString(node.value);
        if (val && /^(uppercase|lowercase|capitalize)$/i.test(val.trim())) {
          context.report({ node: node.value, messageId: 'textTransform', data: { value: val.trim() } });
        }
      },

      // CSS-in-JS strings: `... text-transform: uppercase ...`
      Literal(node) {
        if (typeof node.value !== 'string') return;
        const m = UPPERCASE_TRANSFORM.exec(node.value);
        if (m) context.report({ node, messageId: 'textTransform', data: { value: m[1] } });
      },
      TemplateLiteral(node) {
        const text = node.quasis.map((q) => q.value.cooked ?? q.value.raw).join(' ');
        const m = UPPERCASE_TRANSFORM.exec(text);
        if (m) context.report({ node, messageId: 'textTransform', data: { value: m[1] } });
      },
    };
  },
};
