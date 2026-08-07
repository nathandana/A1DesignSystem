export function componentId(type, instanceOrId) {
  const nodeId = typeof instanceOrId === 'string'
    ? instanceOrId
    : instanceOrId && typeof instanceOrId.id === 'string'
      ? instanceOrId.id
      : '';
  return `${kebabComponentType(type)}-${nodeId.replace(/[^a-zA-Z0-9]+/g, '-')}`;
}

export function kebabComponentType(type) {
  return String(type || 'component')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/^-/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'component';
}

export function slugifyOptionValue(label, usedValues) {
  const used = usedValues && typeof usedValues.has === 'function' && typeof usedValues.add === 'function'
    ? usedValues
    : new Set();
  const base = String(label || 'option')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'option';
  let value = base;
  let index = 2;
  while (used.has(value)) value = `${base}-${index++}`;
  used.add(value);
  return value;
}

// Accept a single node, an array of nodes, or a full page definition / project
// bundle. A node with a type is always kept: supported types render as their
// Figma component. Recursion stops at component nodes because importers own
// their slots.
export function collectSupportedNodes(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectSupportedNodes(item, found);
    return found;
  }
  if (!value || typeof value !== 'object') return found;
  if (typeof value.type === 'string') {
    found.push(value);
    return found;
  }
  for (const key of ['children', 'nodes', 'regions', 'layout', 'page', 'pages', 'definition']) {
    if (value[key]) collectSupportedNodes(value[key], found);
  }
  return found;
}

export function addDefaultTemplateWithId(value, id) {
  if (Array.isArray(value)) return value.map((item) => addDefaultTemplateWithId(item, id));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, addDefaultTemplateWithId(entry, id)]));
  }
  return typeof value === 'string' ? value.replaceAll('$id', id) : value;
}

export function pageTitleFromFigmaFrame(frameOrName) {
  const rawName = typeof frameOrName === 'string' ? frameOrName : frameOrName && frameOrName.name;
  const name = String(rawName || '').trim();
  const linkedTitle = name.match(/^A1\s*·\s*.+?\s*\/\s*(.+)$/);
  return (linkedTitle ? linkedTitle[1] : name) || 'Untitled';
}

// A raw Figma frame exports as a `{ nodes }` bundle, while an A1 Page Layout
// instance already provides the complete page layout contract.
export function pageLayoutForPageExport(node) {
  if (node && node.type === 'PageLayout') return node;
  return {
    type: 'PageLayout',
    regions: [{ id: 'main', name: 'Main', nodes: Array.isArray(node && node.nodes) ? node.nodes : [] }],
  };
}
