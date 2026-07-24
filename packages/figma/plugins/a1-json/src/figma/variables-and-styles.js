/** Figma variable collections, modes, and shared gap-variable bindings. */

export function localCollection(name) {
  const collections = figma.variables.getLocalVariableCollections();
  const exact = collections.find((collection) => collection.name === name);
  if (exact) return exact;
  const requestedCanonical = canonicalKey(name);
  const loose = collections.find((collection) => canonicalKey(collection.name) === requestedCanonical);
  if (loose) return loose;
  if (requestedCanonical === 'color') {
    return collections.find((collection) => {
      const modeNames = collection.modes.map((mode) => canonicalKey(mode.name));
      return modeNames.includes('light') && modeNames.includes('dark');
    }) || null;
  }
  return null;
}

export function collectionModeByName(collection, modeName) {
  const requested = canonicalKey(modeName);
  return collection && collection.modes
    ? collection.modes.find((entry) => canonicalKey(entry.name) === requested) || null
    : null;
}

export function collectionHasModes(collection, modeNames) {
  if (!collection || !Array.isArray(collection.modes)) return false;
  const available = collection.modes.map((mode) => canonicalKey(mode.name));
  return modeNames.every((modeName) => available.includes(canonicalKey(modeName)));
}

export function variableModeNodes(root) {
  if (!root) return [];
  const liveRoot = root.type === 'INSTANCE' ? currentInstance(root) : root;
  let descendants = [];
  try {
    descendants = liveRoot.findAll((node) => node.type === 'FRAME' || node.type === 'INSTANCE');
  } catch {
    descendants = [];
  }
  return [liveRoot].concat(descendants).filter(Boolean);
}

export function resolvedCollectionsForRoot(root) {
  const collections = [];
  const seen = new Set();
  for (const node of variableModeNodes(root)) {
    let modes = {};
    try {
      modes = node.resolvedVariableModes || node.explicitVariableModes || {};
    } catch {
      modes = {};
    }
    for (const collectionId of Object.keys(modes)) {
      if (seen.has(collectionId)) continue;
      seen.add(collectionId);
      try {
        const collection = figma.variables.getVariableCollectionById(collectionId);
        if (collection) collections.push(collection);
      } catch {
        // Some remote or stale collection handles may not resolve synchronously.
      }
    }
  }
  return collections;
}

export function collectionForRoot(root, name) {
  const requested = canonicalKey(name);
  const resolved = resolvedCollectionsForRoot(root);
  const exact = resolved.find((collection) => collection.name === name)
    || resolved.find((collection) => canonicalKey(collection.name) === requested);
  if (exact) return exact;
  if (requested === 'color') {
    const colorCollection = resolved.find((collection) => collectionHasModes(collection, ['Light', 'Dark']));
    if (colorCollection) return colorCollection;
  }
  return localCollection(name);
}

export function collectionModeName(collection, modeId) {
  const mode = collection.modes.find((entry) => entry.modeId === modeId);
  return mode ? mode.name : null;
}

export function explicitCollectionMode(root, collectionName) {
  const collection = collectionForRoot(root, collectionName);
  if (!collection) return null;
  for (const node of variableModeNodes(root)) {
    try {
      const modes = node.explicitVariableModes || {};
      if (modes[collection.id]) return collectionModeName(collection, modes[collection.id]);
    } catch {
      // A component variant swap can leave an internal frame/instance handle
      // stale until Figma completes the document-change turn.
    }
  }
  return null;
}

export function applyCollectionMode(target, collectionName, wantedModeName) {
  const collection = collectionForRoot(target, collectionName);
  if (!collection) return false;
  const mode = collectionModeByName(collection, wantedModeName);
  if (!mode) return false;
  try {
    target.setExplicitVariableModeForCollection(collection, mode.modeId);
    return true;
  } catch {
    return false;
  }
}

export function applyCollectionModeToTree(root, collectionName, wantedModeName) {
  const collection = collectionForRoot(root, collectionName);
  if (!collection || !root) return false;
  const mode = collectionModeByName(collection, wantedModeName);
  if (!mode) return false;
  const nodes = variableModeNodes(root);
  const liveRoot = nodes[0] || null;
  let rootApplied = false;
  for (const node of nodes) {
    try {
      node.setExplicitVariableModeForCollection(collection, mode.modeId);
      if (node === liveRoot) rootApplied = true;
    } catch {
      // Some descendants are stale or do not accept explicit modes; keep going.
    }
  }
  return rootApplied;
}

export function clearCollectionMode(root, collectionName) {
  const collection = collectionForRoot(root, collectionName);
  if (!collection || !root) return false;
  let cleared = false;
  for (const node of variableModeNodes(root)) {
    try {
      const modes = node.explicitVariableModes || {};
      if (!modes[collection.id]) continue;
      node.clearExplicitVariableModeForCollection(collection);
      cleared = true;
    } catch {
      // Ignore stale inner Section layers and continue clearing the rest.
    }
  }
  return cleared;
}

export function pushGapVariableWarning(warnings, message) {
  if (!warnings || gapVariableWarnings.has(message)) return;
  gapVariableWarnings.add(message);
  warnings.push(message);
}

export function localFloatVariables() {
  try {
    if (typeof figma.variables.getLocalVariables === 'function') {
      return figma.variables.getLocalVariables('FLOAT');
    }
  } catch {
    return [];
  }
  return [];
}

export async function importConfiguredFloatVariable(name) {
  if (!figma.variables || typeof figma.variables.importVariableByKeyAsync !== 'function') return null;
  try {
    const stored = await readClientComponentKeyRegistry();
    const map = { ...A1_FIGMA_FLOAT_VARIABLE_KEYS, ...stored.variables.float };
    const key = configuredVariableKeyForName(map, name);
    return key ? await figma.variables.importVariableByKeyAsync(key) : null;
  } catch {
    return null;
  }
}

export async function ensureGapFloatVariable(gap, warnings) {
  const value = nearestStackGap(Number(gap));
  const name = STACK_GAP_VARIABLE_NAMES[value] || `gap/${value}`;
  const variable = localFloatVariables().find((candidate) => candidate && candidate.name === name);
  if (variable) return variable;
  const imported = await importConfiguredFloatVariable(name);
  if (imported) return imported;
  if (!localCollection('Spacing')) {
    pushGapVariableWarning(warnings, 'Spacing variable collection was not found. The plugin will not create local variables, so Stack/Grid gaps were normalized with pixel values only.');
  } else {
    pushGapVariableWarning(warnings, `Spacing variable "${name}" was not found. The plugin will not create local variables, so ${value}px was used directly.`);
  }
  return null;
}

export async function bindGapProperty(node, property, value, warnings, label) {
  const gap = nearestStackGap(Number(value));
  try {
    node[property] = gap;
  } catch (error) {
    warnings.push(`${label || property} could not be set to ${gap}px: ${error.message}`);
    return gap;
  }
  if (gap === 0) return gap;
  const variable = await ensureGapFloatVariable(gap, warnings);
  if (!variable) return gap;
  try {
    node.setBoundVariable(property, variable);
  } catch (error) {
    warnings.push(`${label || property} could not be bound to ${variable.name}: ${error.message}`);
  }
  return gap;
}

export function propertyHasBoundVariable(node, property) {
  try {
    const bound = node && node.boundVariables && node.boundVariables[property];
    if (Array.isArray(bound)) return bound.some((entry) => entry && entry.id);
    return Boolean(bound && bound.id);
  } catch {
    return false;
  }
}

export function gapNeedsVariableBinding(value) {
  return nearestStackGap(Number(value)) !== 0;
}
