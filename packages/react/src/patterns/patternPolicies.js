import { patternManifests } from './contracts.generated.js';

export { patternManifests };
export const ZONE_RULE_PROPS = ['area', 'zone', 'label', 'rules', 'allow', 'allowPatterns', 'min', 'max', 'columns', 'gap'];
export const getPatternManifest = (type) => patternManifests.find(m => m.type === type || m.id === type);
export const getPatternAreaContract = (type, id) => getPatternManifest(type)?.areas.find(area => area.id === id);
export const supportsPatternVersion = (node) => {
  const manifest = getPatternManifest(node?.type);
  return !!manifest && (node.patternVersion == null || node.patternVersion === manifest.version);
};

export function createPatternArea(type, id, { id: nodeId, children } = {}) {
  const area = getPatternAreaContract(type, id);
  if (!area) throw new Error(`Unknown pattern area ${type}.${id}`);
  const props = area.kind === 'zone'
    ? { area: id, zone: true, label: area.label, rules: area.rules, allow: [...area.allow], max: area.max }
    : { area: id, label: area.label, ...area.layout };
  return { ...(nodeId ? { id: nodeId } : {}), type: 'Slot', props, ...(children?.length ? { children } : {}) };
}

/** Empty by default. Examples are explicit, separately requested compositions. */
export function createPatternNode(type, { id, props, areas = {} } = {}) {
  const manifest = getPatternManifest(type);
  if (!manifest) throw new Error(`Unknown pattern ${type}`);
  const nodeId = id ?? manifest.id;
  return {
    id: nodeId, type: manifest.type, patternVersion: manifest.version,
    props: { ...structuredClone(manifest.starter.props), ...props },
    children: manifest.areas.map(area => createPatternArea(type, area.id, {
      id: `${nodeId}-${area.id}`, children: areas[area.id],
    })),
  };
}

/** Pure, non-destructive style/order policy shared by JSON and React adapters. */
export function normalizePatternItems(type, areaId, items) {
  const policy = getPatternAreaContract(type, areaId)?.policies;
  if (!policy) return items;
  let primarySeen = 0;
  function normalize(list) {
    let primary = null;
    const rest = [];
    for (const original of list) {
      let item = original;
      let props = { ...item.props, ...policy.fixedProps?.[item.type] };
      const variants = policy.variants?.[item.type];
      if (variants && !variants.allow.includes(props.variant)) props.variant = variants.fallback;
      item = { ...item, ...(item.props || Object.keys(props).length ? { props } : {}) };
      if (policy.groups?.[item.type] && Array.isArray(item.children)) {
        const before = primarySeen;
        item = { ...item, children: normalize(item.children) };
        if (primarySeen > before && policy.ordering === 'primary-last') { primary = item; continue; }
      } else if (policy.primary?.types.includes(item.type) && (props.variant ?? policy.primary.defaultVariant) === 'primary') {
        if (primarySeen >= policy.primary.max) {
          item = { ...item, props: { ...props, variant: policy.primary.overflowVariant } };
        } else {
          primarySeen++;
          if (policy.ordering === 'primary-last') { primary = item; continue; }
        }
      }
      rest.push(item);
    }
    return primary ? [...rest, primary] : rest;
  }
  return normalize(items);
}

/** Structural child locations only: records/datasets and arbitrary prop objects are not nodes. */
export function patternTreeEntries(value) {
  const entries = ['page', 'layout', 'regions', 'nodes', 'children', 'pages', 'definition']
    .filter(key => value[key] && typeof value[key] === 'object')
    .map(key => [key, value[key]]);
  for (const key of ['items', 'panels']) {
    if (Array.isArray(value.props?.[key])) value.props[key].forEach((item, index) => {
      if (item?.children) entries.push([`props/${key}/${index}/children`, item.children]);
    });
  }
  for (const collection of getPatternManifest(value.type)?.collections ?? []) {
    const key = collection.path.split('/').at(-1);
    if (!Array.isArray(value.props?.[key])) continue;
    value.props[key].forEach((item, index) => {
      for (const field of Object.keys(collection.patterns ?? {})) {
        if (item?.[field]) entries.push([`props/${key}/${index}/${field}`, item[field]]);
      }
    });
  }
  return entries;
}

/** Source data stays untouched. Only known patterns receive authoritative rules. */
export function canonicalizePatternTree(value) {
  if (Array.isArray(value)) return value.map(canonicalizePatternTree);
  if (!value || typeof value !== 'object') return value;
  if (getPatternManifest(value.type) && !supportsPatternVersion(value)) return value;
  const out = { ...value };
  for (const [location, child] of patternTreeEntries(value)) {
    const parts = location.split('/');
    if (parts.length === 1) out[location] = canonicalizePatternTree(child);
    else {
      const [, key, index, field] = parts;
      out.props = { ...out.props };
      out.props[key] = [...out.props[key]];
      out.props[key][index] = { ...out.props[key][index], [field]: canonicalizePatternTree(child) };
    }
  }
  if (!supportsPatternVersion(out)) return out;
  if (Array.isArray(out.children)) out.children = out.children.map(child => {
    const area = child?.type === 'Slot' ? getPatternAreaContract(out.type, child.props?.area) : null;
    if (area?.kind !== 'zone') return child;
    const props = { ...child.props };
    for (const key of ZONE_RULE_PROPS) delete props[key];
    Object.assign(props, createPatternArea(out.type, area.id).props);
    // A weaker authored lock cannot override the formal pattern's lock.
    const lock = { ...child.lock, node: true, props: [...new Set([...(Array.isArray(child.lock?.props) ? child.lock.props : []), ...ZONE_RULE_PROPS])] };
    const { utilities: _utilities, visibility: _visibility, ...rest } = child;
    return { ...rest, props, lock };
  });
  if (Array.isArray(out.children)) {
    const order = getPatternManifest(out.type).areas.map(area => area.id);
    const rank = child => child?.type === 'Slot' && order.includes(child.props?.area) ? order.indexOf(child.props.area) : order.length;
    out.children = [...out.children].sort((a, b) => rank(a) - rank(b));
  }
  return out;
}
