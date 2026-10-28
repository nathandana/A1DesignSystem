/**
 * Serialize a page definition to readable React (JSX) source — used by the
 * editor's "Code snippet" view to show the page as React instead of JSON. This
 * is a best-effort, read-only representation (layout regions are rendered as
 * commented children rather than mapped onto named slots).
 */
import type { A11yDefinition, ComponentNode, ComponentProps, PageDefinition } from './pageTypes';
import { utilityClassesFor } from './utilityRegistry';
import { responsiveVisibilityClasses } from './responsiveVisibility.js';
import { applyZoneItemProps, patternAreaProp } from './patternAreas';

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;');
}

function escapeText(value: string): string {
  return value.replace(/[<>{}]/g, (ch) => `{'${ch}'}`);
}

function propToken([key, value]: [string, unknown]): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return `${key}="${escapeAttr(value)}"`;
  if (value === true) return key;
  if (value === false) return `${key}={false}`;
  // numbers, objects, arrays → a JS expression in braces
  return `${key}={${JSON.stringify(value)}}`;
}

function serializeProps(props: ComponentProps | undefined, a11y?: A11yDefinition, literalStrings = false): string {
  const tokens = Object.entries(props ?? {})
    // Custom source must preserve newlines, entities and quotes as literal strings.
    .map(([key, value]) => literalStrings && typeof value === 'string'
      ? `${key}={${JSON.stringify(value)}}`
      : propToken([key, value]))
    .filter((token): token is string => token !== null);
  if (a11y?.label) tokens.push(`aria-label="${escapeAttr(a11y.label)}"`);
  if (a11y?.role) tokens.push(`role="${escapeAttr(a11y.role)}"`);
  return tokens.length ? ` ${tokens.join(' ')}` : '';
}

function propsWithUtilityClass(node: ComponentNode): ComponentProps | undefined {
  const utilityClass = utilityClassesFor(node.type, node.utilities);
  const visibilityClass = responsiveVisibilityClasses(node.visibility);
  const props = node.props ? { ...node.props } : undefined;
  if (props && (node.type === 'TextField' || node.type === 'TextareaField')) {
    delete props.labelKey;
  }
  if (!utilityClass && !visibilityClass) return props;
  return {
    ...(props ?? {}),
    className: [props?.className, utilityClass, visibilityClass].filter(Boolean).join(' '),
  };
}

// A Button with `split` is a SplitButton in code: its `menuActions` data
// becomes the `actions` prop.
function exportedNode(node: ComponentNode): ComponentNode {
  if (node.type !== 'Button' || node.props?.split !== true) return node;
  const { split: _split, menuActions, as: _as, href: _href, fullWidth: _fullWidth, ...props } = node.props;
  const actions = (Array.isArray(menuActions) ? menuActions : []).map((action, index) => ({ id: `action-${index + 1}`, ...action }));
  return { ...node, type: 'SplitButton' as ComponentNode['type'], props: { ...props, actions } };
}

function serializeChildren(children: ComponentNode[], indent: string): string {
  return children.map((child) => serializeNode(child, indent)).join('\n');
}

function serializeNode(rawNode: ComponentNode, indent: string): string {
  const node = exportedNode(rawNode);
  // A blank area (Slot) is editor structure, not a component: a pattern zone's
  // items become the pattern prop it renders into, and any other area's items
  // are written in place.
  const zoneProps: string[] = [];
  const children: ComponentNode[] = [];
  for (const child of node.children ?? []) {
    if (child.type !== 'Slot') { children.push(child); continue; }
    const area = child.props?.area as string | undefined;
    const prop = patternAreaProp(node.type, area);
    const items = applyZoneItemProps(node.type, area, child.children ?? []);
    if (prop && items.length) {
      zoneProps.push(`${prop}={(\n${indent}    <>\n${serializeChildren(items, `${indent}      `)}\n${indent}    </>\n${indent}  )}`);
    } else if (!prop) {
      children.push(...items);
    }
  }
  const zoneTokens = zoneProps.length ? `\n${indent}  ${zoneProps.join(`\n${indent}  `)}\n${indent}` : '';
  const open = `${indent}<${node.type}${serializeProps(propsWithUtilityClass(node), node.a11y, node.type === 'CustomBlock')}${zoneTokens}`;
  const text = node.content?.fallback;

  if (!text && children.length === 0) {
    return `${open} />`;
  }
  const inner = text
    ? `${indent}  ${escapeText(text)}`
    : serializeChildren(children, `${indent}  `);
  return `${open}>\n${inner}\n${indent}</${node.type}>`;
}

export function definitionToJsx(definition: PageDefinition): string {
  const layout = definition?.page?.layout;
  if (!layout) return '// No layout in this page definition.';

  const regions = (layout.regions ?? []).map((region) => {
    const heading = `  {/* region: ${region.name ?? region.id} */}`;
    const nodes = (region.nodes ?? []).map((node) => serializeNode(node, '  ')).join('\n');
    return nodes ? `${heading}\n${nodes}` : heading;
  }).join('\n\n');

  return `<${layout.type}${serializeProps(layout.props)}>\n${regions}\n</${layout.type}>`;
}
