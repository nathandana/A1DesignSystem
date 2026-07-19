/** Shared Figma auto-layout sizing reads and writes. */

export function layoutWidthMode(node) {
  if (!node) return 'hug';
  try {
    if (node.layoutGrow > 0) return 'fill';
  } catch {
    // Non-auto-layout children may not expose layout grow.
  }
  try {
    if (node.layoutAlign === 'STRETCH') return 'fill';
  } catch {
    // Ignore unsupported sizing handles.
  }
  try {
    if (node.layoutSizingHorizontal === 'FILL') return 'fill';
  } catch {
    // Ignore unsupported sizing handles.
  }
  return 'hug';
}

export function trySetLayoutProperty(node, property, value, warnings, label) {
  if (!node) return false;
  try {
    node[property] = value;
    return true;
  } catch (error) {
    if (warnings && label) warnings.push(`${label} could not be changed: ${error.message}`);
    return false;
  }
}

export function syncAutoLayoutOwnSizingMode(node, axis, mode, warnings, label) {
  if (!node || !['HORIZONTAL', 'VERTICAL'].includes(node.layoutMode)) return;
  const property = axis === 'horizontal'
    ? (node.layoutMode === 'HORIZONTAL' ? 'primaryAxisSizingMode' : 'counterAxisSizingMode')
    : (node.layoutMode === 'VERTICAL' ? 'primaryAxisSizingMode' : 'counterAxisSizingMode');
  trySetLayoutProperty(node, property, mode, warnings, `${label} own ${axis} sizing`);
}

export function syncLayoutWidthMode(node, widthMode, warnings, label = 'Layout') {
  const fill = widthMode === 'fill';
  const parent = node && node.parent;
  if (fill) {
    trySetLayoutProperty(node, 'layoutSizingHorizontal', 'FILL', warnings, `${label} width sizing`);
    if (parent && parent.layoutMode === 'HORIZONTAL') {
      trySetLayoutProperty(node, 'layoutGrow', 1, warnings, `${label} width fill`);
    }
    if (parent && ['VERTICAL', 'GRID'].includes(parent.layoutMode)) {
      trySetLayoutProperty(node, 'layoutAlign', 'STRETCH', warnings, `${label} width fill alignment`);
    }
    syncAutoLayoutOwnSizingMode(node, 'horizontal', 'FIXED', warnings, label);
    return;
  }
  trySetLayoutProperty(node, 'layoutSizingHorizontal', 'HUG', warnings, `${label} width sizing`);
  if (parent && parent.layoutMode === 'HORIZONTAL') {
    trySetLayoutProperty(node, 'layoutGrow', 0, warnings, `${label} width hug`);
  }
  if (parent && ['VERTICAL', 'GRID'].includes(parent.layoutMode)) {
    trySetLayoutProperty(node, 'layoutAlign', 'INHERIT', warnings, `${label} width hug alignment`);
  }
  syncAutoLayoutOwnSizingMode(node, 'horizontal', 'AUTO', warnings, label);
}

export function layoutHeightMode(node) {
  if (!node) return 'hug';
  const parent = node.parent;
  try {
    if (parent && parent.layoutMode === 'VERTICAL' && node.layoutGrow > 0) return 'fill';
  } catch {
    // Ignore unsupported layout grow handles.
  }
  try {
    if (parent && parent.layoutMode === 'HORIZONTAL' && node.layoutAlign === 'STRETCH') return 'fill';
  } catch {
    // Ignore unsupported layout align handles.
  }
  try {
    if (node.layoutSizingVertical === 'FILL') return 'fill';
  } catch {
    // Ignore unsupported sizing handles.
  }
  return 'hug';
}

export function syncLayoutHeightMode(node, heightMode, warnings, label = 'Layout') {
  const fill = heightMode === 'fill';
  const parent = node && node.parent;
  if (fill) {
    trySetLayoutProperty(node, 'layoutSizingVertical', 'FILL', warnings, `${label} height sizing`);
    if (parent && parent.layoutMode === 'VERTICAL') {
      trySetLayoutProperty(node, 'layoutGrow', 1, warnings, `${label} height fill`);
    }
    if (parent && parent.layoutMode === 'HORIZONTAL') {
      trySetLayoutProperty(node, 'layoutAlign', 'STRETCH', warnings, `${label} height fill alignment`);
    }
    syncAutoLayoutOwnSizingMode(node, 'vertical', 'FIXED', warnings, label);
    return;
  }
  trySetLayoutProperty(node, 'layoutSizingVertical', 'HUG', warnings, `${label} height sizing`);
  if (parent && parent.layoutMode === 'VERTICAL') {
    trySetLayoutProperty(node, 'layoutGrow', 0, warnings, `${label} height hug`);
  }
  if (parent && parent.layoutMode === 'HORIZONTAL') {
    trySetLayoutProperty(node, 'layoutAlign', 'INHERIT', warnings, `${label} height hug alignment`);
  }
  syncAutoLayoutOwnSizingMode(node, 'vertical', 'AUTO', warnings, label);
}
