import { createPatternArea, getPatternManifest, normalizePatternItems } from '../../../../packages/react/src/patterns/patternPolicies.js';

/** Keep the authored tree and metadata; change only fields the form actually owns. */
export function patternConfigNode(type, config, controlledProps, props, areaItems) {
  const source = config.sourceNode ?? {};
  const manifest = getPatternManifest(type);
  const mergedProps = { ...source.props };
  for (const key of controlledProps) delete mergedProps[key];
  Object.assign(mergedProps, props);
  const id = source.id ?? config.nodeId ?? `${manifest.id}-1`;
  const children = manifest.areas.map(area => {
    const existing = source.children?.find(child => child.type === 'Slot' && child.props?.area === area.id)
      ?? (area.id === 'content' ? config.contentSlot : undefined);
    const slot = existing ? { ...existing, props: { ...existing.props } } : createPatternArea(type, area.id, { id: `${id}-${area.id}` });
    if (area.kind === 'zone') {
      slot.props = { ...slot.props, ...createPatternArea(type, area.id).props };
      const items = areaItems[area.id] ?? slot.children ?? [];
      if (items.length) slot.children = normalizePatternItems(type, area.id, items);
      else delete slot.children;
    }
    return slot;
  });
  // Unknown areas remain intact for diagnostics instead of disappearing on export.
  for (const child of source.children ?? []) {
    if (child.type !== 'Slot' || !manifest.areas.some(a => a.id === child.props?.area)) children.push(child);
  }
  return { ...source, id, type, patternVersion: source.patternVersion ?? manifest.version, props: mergedProps, children };
}

export function patternActionFromNode(node, index) {
  const props = node.props ?? {};
  const composed = !['Button', 'Link', 'IconButton'].includes(node.type) || props.split;
  return {
    id: node.id ?? `action-${index + 1}`, sourceNode: node,
    kind: composed ? 'node' : node.type === 'Link' ? 'link' : node.type === 'IconButton' ? 'icon-button' : 'button',
    label: composed ? node.name ?? (props.split ? 'Split button' : node.type) : node.type === 'IconButton' ? props.label ?? '' : node.content?.fallback ?? '',
    variant: props.variant ?? (node.type === 'IconButton' ? 'tertiary' : 'primary'),
    icon: props.icon ?? '', iconPosition: props.iconPosition ?? 'start', href: props.href ?? '', disabled: props.disabled === true,
  };
}

export function patternActionToNode(action, index) {
  if (action.kind === 'node') return action.sourceNode;
  const source = action.sourceNode ?? {};
  const type = action.kind === 'link' ? 'Link' : action.kind === 'icon-button' ? 'IconButton' : 'Button';
  const props = type === source.type ? { ...source.props } : {};
  for (const key of ['icon', 'iconPosition', 'label', 'variant', 'href', 'as', 'disabled']) delete props[key];
  if (action.icon) props.icon = action.icon;
  if (action.icon && action.iconPosition === 'end' && type !== 'IconButton') props.iconPosition = 'end';
  if (action.href) { props.href = action.href; if (type !== 'Link') props.as = 'a'; }
  if (type === 'Link') props.href ||= '#';
  else {
    props.variant = action.variant ?? (type === 'IconButton' ? 'tertiary' : 'secondary');
    if (action.disabled) props.disabled = true;
  }
  const node = { ...source, id: source.id ?? action.id ?? `action-${index + 1}`, type, props };
  if (type === 'IconButton') {
    props.icon ||= 'more_horiz'; props.label = action.label;
    if (source.props?.label !== action.label) {
      delete props.labelKey;
      if (node.a11y?.label) { node.a11y = { ...node.a11y }; delete node.a11y.label; }
    }
    delete node.content;
  } else {
    node.content = { ...source.content, fallback: action.label };
    if (source.content?.fallback !== action.label) delete node.content.textKey;
  }
  return node;
}
