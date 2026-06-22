/**
 * single-primary-button — enforces "one primary action per decision area".
 * Maps to YAML rule `button-single-primary-action`.
 *
 * Within a single form, Dialog, ButtonContainer, or StickyActions, only ONE primary Button
 * should appear. `<Button>` defaults to variant="primary", so a Button with no `variant`
 * counts as primary. Reports the 2nd (and later) primary buttons in the same decision area.
 */
import { jsxName, getStringAttr, getAttr } from '../util.js';

const DECISION_AREAS = new Set(['form', 'Dialog', 'ButtonContainer', 'StickyActions']);

/** A primary Button: `<Button>` with no variant (default primary) or variant="primary". */
function isPrimaryButton(opening) {
  if (jsxName(opening) !== 'Button') return false;
  const variantAttr = getAttr(opening, 'variant');
  if (!variantAttr) return true;            // default variant is "primary"
  return getStringAttr(opening, 'variant') === 'primary';
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use only one primary button within a single decision area (form, dialog, action group).',
      recommended: true,
    },
    schema: [],
    messages: {
      multiple:
        'More than one primary button in this {{area}}. Only one primary action per decision area — make the others variant="secondary"/"tertiary". (Note: <Button> with no variant is primary.) (A1 rule: button-single-primary-action)',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        const name = jsxName(node.openingElement);
        if (!DECISION_AREAS.has(name)) return;

        const primaries = [];
        const walk = (children) => {
          for (const child of children) {
            if (child.type === 'JSXFragment') { walk(child.children); continue; }
            if (child.type !== 'JSXElement') continue;
            const childName = jsxName(child.openingElement);
            if (DECISION_AREAS.has(childName)) continue; // nested area — its own scope
            if (isPrimaryButton(child.openingElement)) primaries.push(child.openingElement);
            walk(child.children);
          }
        };
        walk(node.children);

        // The first primary is fine; flag every additional one.
        for (let i = 1; i < primaries.length; i += 1) {
          context.report({ node: primaries[i], messageId: 'multiple', data: { area: name } });
        }
      },
    };
  },
};
