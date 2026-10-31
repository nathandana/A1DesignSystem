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
import { canonicalizePatternTree } from '../../../../packages/react/src/patterns/patternPolicies.js';
import { validatePatterns, formatPatternDiagnostics } from '../../../../packages/react/src/patterns/patternValidation.js';

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
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

function propTokens(props: ComponentProps | undefined, a11y?: A11yDefinition, literalStrings = false): string[] {
  const tokens = Object.entries(props ?? {})
    // Custom source must preserve newlines, entities and quotes as literal strings.
    .map(([key, value]) => literalStrings && typeof value === 'string'
      ? `${key}={${JSON.stringify(value)}}`
      : propToken([key, value]))
    .filter((token): token is string => token !== null);
  if (a11y?.label) tokens.push(`aria-label="${escapeAttr(a11y.label)}"`);
  if (a11y?.labelledBy) tokens.push(`aria-labelledby="${escapeAttr(a11y.labelledBy)}"`);
  if (a11y?.describedBy) tokens.push(`aria-describedby="${escapeAttr(a11y.describedBy)}"`);
  if (a11y?.role) tokens.push(`role="${escapeAttr(a11y.role)}"`);
  return tokens;
}

function serializeProps(props: ComponentProps | undefined): string {
  const tokens = propTokens(props);
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
  let props = { ...propsWithUtilityClass(node) };
  if (node.type === 'VerificationDialog') {
    // Keep each translation binding next to its fallback text.
    const ordered = Object.fromEntries(['title', 'message', 'confirmLabel', 'cancelLabel']
      .flatMap(key => [`${key}Key`, key])
      .filter(key => props[key] !== undefined)
      .map(key => [key, props[key]]));
    props = { ...ordered, ...props };
  }
  if (node.type === 'OverflowMenu' && Array.isArray(props.actions)) {
    const actions = props.actions.map(action => {
      const { verification, ...data } = action;
      const fields = Object.entries(data).filter(([, value]) => value !== undefined).map(([key, value]) =>
        `${indent}      ${/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${JSON.stringify(value)}`);
      if (verification) fields.push(`${indent}      verification: (\n${serializeNode(verification, `${indent}        `)}\n${indent}      )`);
      return `${indent}    {\n${fields.join(',\n')},\n${indent}    }`;
    });
    zoneProps.push(`actions={[\n${actions.join(',\n')}\n${indent}  ]}`);
    delete props.actions;
  }
  if (node.type === 'Card' && Array.isArray(props.actions) && props.actions.length) {
    const actions = props.actions.map((action, index) => {
      const icon = typeof action?.icon === 'string' && action.icon ? action.icon : 'more_horiz';
      const label = typeof action?.label === 'string' && action.label ? action.label : 'Action';
      const href = typeof action?.href === 'string' && action.href ? ` href=${JSON.stringify(action.href)}` : '';
      return `${indent}    <IconButton key=${JSON.stringify(action?.id ?? `card-action-${index}`)} icon=${JSON.stringify(icon)} label=${JSON.stringify(label)}${href} size="sm" />`;
    });
    zoneProps.push(`actions={(\n${indent}  <>\n${actions.join('\n')}\n${indent}  </>\n${indent})}`);
    delete props.actions;
  }
  const children: ComponentNode[] = [];
  for (const child of node.children ?? []) {
    if (child.type !== 'Slot') { children.push(child); continue; }
    const area = child.props?.area as string | undefined;
    const prop = patternAreaProp(node.type, area);
    if (prop) delete props[prop];
    const items = applyZoneItemProps(node.type, area, child.children ?? []);
    if (prop && items.length) {
      zoneProps.push(`${prop}={(\n${indent}    <>\n${serializeChildren(items, `${indent}      `)}\n${indent}    </>\n${indent}  )}`);
    } else if (!prop) {
      if (items.length) {
        // Filled open areas render through Grid in the editor; retain their layout in code.
        const { area: _area, zone: _zone, label: _label, rules: _rules, allow: _allow, allowPatterns: _patterns, min: _min, max: _max, ...layout } = child.props ?? {};
        children.push({ ...child, type: 'Grid', props: { gap: 'md', ...layout }, children: items });
      }
    }
  }
  const text = node.content?.fallback;
  const empty = !text && children.length === 0;
  const tokens = [...propTokens(props, node.a11y, node.type === 'CustomBlock'), ...zoneProps];
  const compact = `${indent}<${node.type}${tokens.length ? ` ${tokens.join(' ')}` : ''}${empty ? ' />' : '>'}`;
  const open = compact.length <= 100 && !compact.includes('\n')
    ? compact
    : `${indent}<${node.type}\n${tokens.map(token => `${indent}  ${token}`).join('\n')}\n${indent}${empty ? '/>' : '>'}`;
  if (empty) return open;
  const inner = [text ? `${indent}  ${escapeText(text)}` : '', serializeChildren(children, `${indent}  `)].filter(Boolean).join('\n');
  return `${open}\n${inner}\n${indent}</${node.type}>`;
}

/** Serialize one component or pattern with the same zone rules as a full page. */
export function nodeToJsx(node: ComponentNode): string {
  const result = validatePatterns(node);
  if (!result.valid) return formatPatternDiagnostics(result.diagnostics).split('\n').map(line => `// ${line}`).join('\n');
  return serializeNode(canonicalizePatternTree(node), '');
}

export function definitionToJsx(definition: PageDefinition): string {
  const result = validatePatterns(definition);
  if (!result.valid) return formatPatternDiagnostics(result.diagnostics).split('\n').map(line => `// ${line}`).join('\n');
  const layout = canonicalizePatternTree(definition)?.page?.layout;
  if (!layout) return '// No layout in this page definition.';

  const regions = (layout.regions ?? []).map((region) => {
    const heading = `  {/* region: ${region.name ?? region.id} */}`;
    const nodes = (region.nodes ?? []).map((node) => serializeNode(node, '  ')).join('\n');
    return nodes ? `${heading}\n${nodes}` : heading;
  }).join('\n\n');

  return `<${layout.type}${serializeProps(layout.props)}>\n${regions}\n</${layout.type}>`;
}
