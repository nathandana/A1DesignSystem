/**
 * Figma component source resolution.
 *
 * This module deliberately keeps the current lookup strategy intact. It owns
 * the Figma-node details so the controller can ask for a source without
 * knowing whether it came from a local component set, a standalone component,
 * or an imported component instance.
 */

export function sourceComponentSet(node) {
  try {
    if (!node) return null;
    if (node.type === 'COMPONENT_SET') return node;
    if (node.type === 'COMPONENT') return node.parent && node.parent.type === 'COMPONENT_SET' ? node.parent : null;
    if (node.type === 'INSTANCE') {
      const main = node.mainComponent;
      return main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function sourceStandaloneComponent(node) {
  try {
    if (!node) return null;
    if (node.type === 'COMPONENT') return node.parent && node.parent.type === 'COMPONENT_SET' ? null : node;
    if (node.type === 'INSTANCE') {
      const main = node.mainComponent;
      return main && (!main.parent || main.parent.type !== 'COMPONENT_SET') ? main : null;
    }
  } catch {
    return null;
  }
  return null;
}

function keyMatchesConfiguredComponentSetName(key, name) {
  if (!key) return false;
  const expected = configuredLibraryKeyForName(A1_FIGMA_COMPONENT_SET_KEYS, name);
  return expected ? key === expected : A1_FIGMA_COMPONENT_SET_KEY_VALUES.has(key);
}

function keyMatchesConfiguredComponentName(key, name) {
  if (!key) return false;
  const expected = configuredLibraryKeyForName(A1_FIGMA_COMPONENT_KEYS, name);
  return expected ? key === expected : A1_FIGMA_COMPONENT_KEY_VALUES.has(key);
}

export function sourceMatchesA1ComponentSetName(source, name) {
  const set = sourceComponentSet(source);
  return Boolean(set && figmaComponentNameMatches(set.name, name) && keyMatchesConfiguredComponentSetName(localPublishedKey(set), name));
}

export function sourceMatchesA1StandaloneComponentName(source, name) {
  const component = sourceStandaloneComponent(source);
  return Boolean(component && figmaComponentNameMatches(component.name, name) && keyMatchesConfiguredComponentName(localPublishedKey(component), name));
}

export function sourceMatchesA1ComponentName(source, name) {
  return sourceMatchesA1ComponentSetName(source, name) || sourceMatchesA1StandaloneComponentName(source, name);
}

export function findComponentSet(name) {
  const page = figma.currentPage;
  if (!page) return null;
  const local = page.findOne((node) =>
    node.type === 'COMPONENT_SET'
    && figmaComponentNameMatches(node.name, name)
    && sourceMatchesA1ComponentSetName(node, name));
  if (local) return local;
  const importedInstance = page.findOne((node) => {
    if (node.type !== 'INSTANCE') return false;
    try {
      const main = node.mainComponent;
      const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
      return Boolean(set && sourceMatchesA1ComponentSetName(set, name));
    } catch {
      return false;
    }
  });
  if (!importedInstance || importedInstance.type !== 'INSTANCE') return null;
  try {
    const main = importedInstance.mainComponent;
    return main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
  } catch {
    return null;
  }
}

export function findComponent(name) {
  const page = figma.currentPage;
  if (!page) return null;
  const local = page.findOne((node) =>
    node.type === 'COMPONENT'
    && figmaComponentNameMatches(node.name, name)
    && sourceMatchesA1StandaloneComponentName(node, name));
  if (local) return local;
  const importedInstance = page.findOne((node) => {
    if (node.type !== 'INSTANCE') return false;
    try {
      const main = node.mainComponent;
      return Boolean(main && sourceMatchesA1StandaloneComponentName(main, name));
    } catch {
      return false;
    }
  });
  if (!importedInstance || importedInstance.type !== 'INSTANCE') return null;
  try {
    return importedInstance.mainComponent || null;
  } catch {
    return null;
  }
}

export function findComponentSource(name) {
  const set = findComponentSet(name);
  if (set) return set.defaultVariant;
  if (A1_COMPONENT_SET_ONLY_NAMES.has(name)) return null;
  return findComponent(name);
}

export function componentSourceFromImported(imported) {
  if (!imported) return null;
  if (imported.type === 'COMPONENT_SET') return imported.defaultVariant || imported.children[0] || null;
  if (imported.type === 'COMPONENT') {
    return imported.parent && imported.parent.type === 'COMPONENT_SET'
      ? imported.parent.defaultVariant || imported
      : imported;
  }
  return null;
}
