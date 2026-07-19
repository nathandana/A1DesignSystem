/** Shared Figma component-property reads and queued writes. */

export function plainKey(key) {
  return key.split('#')[0];
}

export function readProperties(instance) {
  const out = {};
  const props = instance.componentProperties || {};
  for (const key of Object.keys(props)) out[plainKey(key)] = props[key];
  return out;
}

export function componentSetName(instanceNode) {
  try {
    const main = instanceNode && instanceNode.mainComponent;
    const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    return set ? set.name : main ? main.name : '';
  } catch {
    return '';
  }
}

export function componentProperty(instance, name, type) {
  const wanted = canonicalKey(name);
  const raw = instance.componentProperties || {};
  for (const key of Object.keys(raw)) {
    if (canonicalKey(key) !== wanted) continue;
    if (type && raw[key].type !== type) continue;
    return { key, property: raw[key] };
  }
  return null;
}

export function componentPropertyFromNames(instance, names, type) {
  const wanted = new Set((names || []).map(canonicalKey).filter(Boolean));
  const raw = instance.componentProperties || {};
  for (const key of Object.keys(raw)) {
    if (!wanted.has(canonicalKey(key))) continue;
    if (type && raw[key].type !== type) continue;
    return { key, property: raw[key] };
  }
  return null;
}

export function iconSwapProperty(instance) {
  const named = componentPropertyFromNames(instance, ICON_SWAP_PROPERTY_NAMES, 'INSTANCE_SWAP');
  if (named) return named;
  let raw = {};
  try {
    raw = instance.componentProperties || {};
  } catch {
    return null;
  }
  const candidates = Object.keys(raw)
    .filter((key) => raw[key] && raw[key].type === 'INSTANCE_SWAP')
    .filter((key) => {
      const name = canonicalKey(key);
      return name.includes('icon') || name.includes('glyph') || name.includes('symbol');
    });
  if (candidates.length === 1) return { key: candidates[0], property: raw[candidates[0]] };
  const allSwaps = Object.keys(raw).filter((key) => raw[key] && raw[key].type === 'INSTANCE_SWAP');
  return allSwaps.length === 1 ? { key: allSwaps[0], property: raw[allSwaps[0]] } : null;
}

export function iconTextProperty(instance) {
  const named = componentPropertyFromNames(instance, ICON_SWAP_PROPERTY_NAMES, 'TEXT');
  if (named) return named;
  let raw = {};
  try {
    raw = instance.componentProperties || {};
  } catch {
    return null;
  }
  const candidates = Object.keys(raw)
    .filter((key) => raw[key] && raw[key].type === 'TEXT')
    .filter((key) => {
      const name = canonicalKey(key);
      return name.includes('icon') || name.includes('glyph') || name.includes('symbol');
    });
  return candidates.length === 1 ? { key: candidates[0], property: raw[candidates[0]] } : null;
}

export function iconSwapPropertyValue(instance) {
  const found = iconSwapProperty(instance);
  return found ? found.property.value : undefined;
}

export function iconTextPropertyValue(instance) {
  const found = iconTextProperty(instance);
  return found ? found.property.value : undefined;
}

export function iconTextLayerValue(instance) {
  const text = materialIconTextLayer(nestedIconInstance(instance, 'Icon') || instance);
  try {
    return text && typeof text.characters === 'string' ? text.characters.trim() : '';
  } catch {
    return '';
  }
}

export function iconNameFromTextValue(value) {
  return materialIconNameCandidate(value) || '';
}

export function iconNameFromEditableText(instance) {
  return iconNameFromTextValue(iconTextPropertyValue(instance)) ||
    iconNameFromTextValue(iconTextLayerValue(instance));
}

export function queueIconSwapProperty(instance, assignments, materialIcon) {
  const found = iconSwapProperty(instance);
  if (!found || !materialIcon) return false;
  assignments[found.key] = materialIcon.id;
  return true;
}

export function queueIconTextProperty(instance, assignments, iconName) {
  const found = iconTextProperty(instance);
  if (!found || !iconName) return false;
  assignments[found.key] = iconName;
  return true;
}

export function componentPropertyValue(instance, name, type) {
  const found = componentProperty(instance, name, type);
  return found ? found.property.value : undefined;
}

export function queueComponentProperty(instance, assignments, name, value, type, warnings, description) {
  const found = componentProperty(instance, name, type);
  if (!found) {
    warnings.push(`${description || name} could not be applied — no matching Figma property was found.`);
    return;
  }
  assignments[found.key] = value;
}

export function queueOptionalComponentProperty(instance, assignments, name, value, type) {
  const found = componentProperty(instance, name, type);
  if (!found) return false;
  assignments[found.key] = value;
  return true;
}

export function applyQueuedProperties(instance, assignments, warnings, description) {
  if (Object.keys(assignments).length === 0) return;
  try {
    instance.setProperties(assignments);
  } catch (error) {
    warnings.push(`${description || 'Component properties'} could not be applied: ${error.message}`);
  }
}
