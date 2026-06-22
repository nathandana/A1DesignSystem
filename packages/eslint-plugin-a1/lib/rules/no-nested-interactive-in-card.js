/**
 * no-nested-interactive-in-card — enforces "no nested interactive controls in interactive cards".
 * Maps to YAML rule `card-navigation-no-nested-interactive`.
 *
 * When a `<Card>` is interactive (`variant="navigation"` or an `href`), its contents must be
 * static. Nesting a button/link/form-control/menu/tabs inside a whole-card link is invalid HTML
 * and a broken interaction model. Flags each interactive descendant.
 */
import { jsxName, getAttr, getStringAttr } from '../util.js';

const INTERACTIVE_HTML = new Set(['a', 'button', 'input', 'select', 'textarea', 'details', 'summary']);
const INTERACTIVE_COMPONENTS = new Set([
  'Button', 'IconButton', 'SplitButton', 'Link', 'Menu', 'ContextMenu', 'Tabs', 'Tab',
  'Switch', 'Slider', 'Select', 'Autocomplete', 'Textarea', 'Checkbox', 'CheckboxGroup',
  'RadioGroup', 'ChoiceGroup', 'FieldRow', 'InlineEditable', 'SegmentedControl', 'Pagination',
  'Accordion', 'Toolbar', 'ToolbarToggle', 'ToolbarButton', 'ToolbarMenu', 'ToolbarGroup',
]);

function isInteractiveName(name) {
  if (!name) return false;
  if (INTERACTIVE_HTML.has(name)) return true;
  if (INTERACTIVE_COMPONENTS.has(name)) return true;
  return /(?:Button|Field)$/.test(name); // TextField, NumberField, DateField, …
}

function isInteractiveCard(opening) {
  const variant = getStringAttr(opening, 'variant');
  if (variant === 'navigation') return true;
  return getAttr(opening, 'href') != null;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Do not place interactive elements inside an interactive (navigation/href) Card.',
      recommended: true,
    },
    schema: [],
    messages: {
      nested:
        'Interactive <{{name}}> inside an interactive Card. A navigation card must contain static content only — move the control outside, or drop variant="navigation". (A1 rule: card-navigation-no-nested-interactive)',
    },
  },
  create(context) {
    function walk(children) {
      for (const child of children) {
        if (child.type === 'JSXFragment') { walk(child.children); continue; }
        if (child.type !== 'JSXElement') {
          // JSXExpressionContainer can hold elements (e.g. {items.map(...)}) — descend best-effort.
          if (child.type === 'JSXExpressionContainer') walkExpr(child.expression);
          continue;
        }
        const name = jsxName(child.openingElement);
        if (name === 'Card') continue; // a nested Card is its own scope
        if (isInteractiveName(name)) {
          context.report({ node: child.openingElement, messageId: 'nested', data: { name } });
          continue; // don't descend into the flagged control
        }
        walk(child.children);
      }
    }

    // Shallow descent into JSX held by expressions (arrow bodies, conditionals, .map callbacks).
    function walkExpr(node) {
      if (!node) return;
      switch (node.type) {
        case 'JSXElement': walk([node]); break;
        case 'JSXFragment': walk(node.children); break;
        case 'ConditionalExpression': walkExpr(node.consequent); walkExpr(node.alternate); break;
        case 'LogicalExpression': walkExpr(node.left); walkExpr(node.right); break;
        case 'CallExpression':
          for (const a of node.arguments) walkExpr(a);
          break;
        case 'ArrowFunctionExpression':
          if (node.body.type === 'BlockStatement') break; // give up on block bodies (cheap, avoids false positives)
          walkExpr(node.body);
          break;
        default: break;
      }
    }

    return {
      JSXElement(node) {
        if (jsxName(node.openingElement) !== 'Card') return;
        if (!isInteractiveCard(node.openingElement)) return;
        walk(node.children);
      },
    };
  },
};
