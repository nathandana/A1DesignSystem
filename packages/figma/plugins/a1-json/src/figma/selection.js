/** Figma node resolution and shared selection geometry helpers. */

export function resolveNodeById(id) {
  if (!id || typeof id !== 'string') return null;
  try {
    return figma.getNodeById(id) || null;
  } catch {
    return null;
  }
}

export async function resolveNodeByIdAsync(id) {
  if (!id || typeof id !== 'string') return null;
  try {
    if (typeof figma.getNodeByIdAsync === 'function') return await figma.getNodeByIdAsync(id);
  } catch {
    return null;
  }
  return resolveNodeById(id);
}

export function liveNode(node) {
  try {
    if (!node || typeof node.id !== 'string') return null;
    return resolveNodeById(node.id);
  } catch {
    return null;
  }
}

export function safeParent(node) {
  try {
    return node && node.parent ? node.parent : null;
  } catch {
    return null;
  }
}

export function stackFlowChildren(frame) {
  let children = [];
  try {
    children = frame && frame.children ? frame.children : [];
  } catch {
    return [];
  }
  return children
    .map(liveNode)
    .filter(Boolean)
    .filter((child) => {
      try {
        return child.layoutPositioning !== 'ABSOLUTE';
      } catch {
        return false;
      }
    });
}

// ── Variable-collection helpers (ContentWidth / Gap / Color modes) ──────────


export function topLevelSelectionNodes(selection) {
  const nodes = (selection || [])
    .map(liveNode)
    .filter(Boolean)
    .filter((node) => !isAuditReportNode(node));
  const selectedIds = new Set(nodes.map((node) => node.id));
  return nodes.filter((node) => {
    try {
      if (node.type === 'PAGE' || !node.parent) return false;
      if (['COMPONENT', 'COMPONENT_SET', 'SLOT'].includes(node.type) || isComponentImplementationNode(node)) return false;
      for (let parent = node.parent; parent && parent.type !== 'PAGE'; parent = parent.parent) {
        if (selectedIds.has(parent.id)) return false;
      }
      return true;
    } catch {
      return false;
    }
  });
}

export function commonParent(nodes) {
  if (!nodes.length) return null;
  const parent = nodes[0].parent;
  return nodes.every((node) => node.parent && node.parent.id === parent.id) ? parent : null;
}

export function selectionBoundsInParent(nodes) {
  if (!nodes.length) return null;
  try {
    const minX = Math.min(...nodes.map((node) => node.x));
    const minY = Math.min(...nodes.map((node) => node.y));
    const maxX = Math.max(...nodes.map((node) => node.x + node.width));
    const maxY = Math.max(...nodes.map((node) => node.y + node.height));
    return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
  } catch {
    return null;
  }
}


export function selectedNodesInParentOrder(parent, nodes) {
  const ids = new Set(nodes.map((node) => node.id));
  try {
    return parent.children.filter((child) => ids.has(child.id));
  } catch {
    return nodes;
  }
}
