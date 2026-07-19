/** Shared slot and component-content accessors. */

export function namedSlot(instance, name) {
  const wanted = canonicalKey(name);
  const names = wanted === 'contentslot'
    ? new Set(['contentslot', 'content', 'cardcontent', 'cardcontentslot'])
    : new Set([wanted]);
  try {
    const liveInstance = instance && instance.type === 'INSTANCE'
      ? currentInstance(instance)
      : instance;
    return liveInstance && liveInstance.findOne((node) => {
      try {
        if (!names.has(canonicalKey(node.name))) return false;
        return node.type === 'SLOT' || node.type === 'FRAME' || node.type === 'GROUP';
      } catch {
        return false;
      }
    }) || null;
  } catch {
    return null;
  }
}

export function nativeSlot(instance, name) {
  const wanted = canonicalKey(name);
  const liveInstance = instance && instance.type === 'INSTANCE'
    ? currentInstance(instance)
    : instance;
  if (!liveInstance) return null;
  try {
    const slots = liveInstance.findAll((node) => {
      try {
        if (node.type !== 'SLOT' && node.type !== 'FRAME' && node.type !== 'GROUP') return false;
        if (canonicalKey(node.name) === wanted) return true;
        const refs = node.componentPropertyReferences || {};
        return Object.values(refs).some((value) => canonicalKey(String(value || '')).startsWith(wanted));
      } catch {
        return false;
      }
    });
    return slots.find((slot) => canonicalKey(slot.name) === wanted) || slots[0] || null;
  } catch {
    return namedSlot(liveInstance, name);
  }
}

export function componentText(instance, name, fallback = '') {
  const value = componentPropertyValue(instance, name, 'TEXT');
  return typeof value === 'string' ? value : fallback;
}

export function componentBoolean(instance, name, fallback = false) {
  const value = componentPropertyValue(instance, name, 'BOOLEAN');
  return typeof value === 'boolean' ? value : fallback;
}
