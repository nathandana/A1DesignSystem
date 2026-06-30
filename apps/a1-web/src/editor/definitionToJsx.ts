/**
 * Serialize a page definition to readable React (JSX) source — used by the
 * editor's "Code snippet" view to show the page as React instead of JSON. This
 * is a best-effort, read-only representation (layout regions are rendered as
 * commented children rather than mapped onto named slots).
 */
import type { A11yDefinition, ComponentNode, ComponentProps, PageDefinition } from './pageTypes';
import { utilityClassesFor } from './utilityRegistry';

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

function serializeProps(props: ComponentProps | undefined, a11y?: A11yDefinition): string {
  const tokens = Object.entries(props ?? {})
    .map(propToken)
    .filter((token): token is string => token !== null);
  if (a11y?.label) tokens.push(`aria-label="${escapeAttr(a11y.label)}"`);
  if (a11y?.role) tokens.push(`role="${escapeAttr(a11y.role)}"`);
  return tokens.length ? ` ${tokens.join(' ')}` : '';
}

function propsWithUtilityClass(node: ComponentNode): ComponentProps | undefined {
  const utilityClass = utilityClassesFor(node.type, node.utilities);
  const props = node.props ? { ...node.props } : undefined;
  if (props && (node.type === 'TextField' || node.type === 'TextareaField')) {
    delete props.labelKey;
  }
  if (!utilityClass) return props;
  return {
    ...(props ?? {}),
    className: [props?.className, utilityClass].filter(Boolean).join(' '),
  };
}

function serializeNode(node: ComponentNode, indent: string): string {
  const open = `${indent}<${node.type}${serializeProps(propsWithUtilityClass(node), node.a11y)}`;
  const text = node.content?.fallback;
  const children = node.children ?? [];

  if (!text && children.length === 0) {
    return `${open} />`;
  }
  const inner = text
    ? `${indent}  ${escapeText(text)}`
    : children.map((child) => serializeNode(child, `${indent}  `)).join('\n');
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
