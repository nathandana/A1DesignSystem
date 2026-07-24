// Atomic component adapter boundary.
//
// The controller still contains the legacy implementations while this first
// vertical slice is migrated. The registry and workflows now depend on these
// stable adapter functions, so each implementation can move here without a
// second rewrite of the dispatch layer.

function exportBadge(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const status = componentPropertyValue(instance, 'Status', 'VARIANT');
  const subtle = componentPropertyValue(instance, 'Subtle', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (BADGE_STATUSES.includes(status) && status !== 'neutral') props.status = status;
  if (subtle === 'true' || subtle === true) props.subtle = true;
  if (BADGE_SIZES.includes(size)) props.size = size;
  if (!componentBoolean(instance, 'Show icon', true)) props.icon = null;
  else {
    const defaultIcon = BADGE_DEFAULT_ICONS[BADGE_STATUSES.includes(status) ? status : 'neutral'];
    const iconName = iconNameFromInstance(instance) || iconNameFromEditableText(instance) || iconNameFromSwapValue(iconSwapPropertyValue(instance));
    if (iconName && iconName !== defaultIcon) props.icon = iconName;
    else if (!iconName) warnings.push('Badge icon is visible but its Material icon component could not be resolved.');
  }
  const node = { id: componentId('MessageBadge', instance), type: 'MessageBadge', content: { fallback: componentText(instance, 'Label', 'Badge') } };
  if (Object.keys(props).length > 0) node.props = props;
  return { node, warnings };
}

function badgeContextForSelection(instance) {
  instance = currentInstance(instance);
  const statusValue = componentPropertyValue(instance, 'Status', 'VARIANT');
  const status = BADGE_STATUSES.includes(statusValue) ? statusValue : 'neutral';
  const subtle = componentPropertyValue(instance, 'Subtle', 'VARIANT');
  const sizeValue = componentPropertyValue(instance, 'Size', 'VARIANT');
  const size = BADGE_SIZES.includes(sizeValue) ? sizeValue : 'md';
  const showIcon = componentBoolean(instance, 'Show icon', true);
  const defaultIcon = BADGE_DEFAULT_ICONS[status];
  const icon = iconNameFromInstance(instance) || iconNameFromEditableText(instance) || iconNameFromSwapValue(iconSwapPropertyValue(instance)) || defaultIcon;
  return {
    label: componentText(instance, 'Label', 'Badge'), status, statusOptions: BADGE_STATUSES,
    size, sizeOptions: BADGE_SIZES, subtle: subtle === 'true' || subtle === true ? 'true' : 'false',
    subtleOptions: ['false', 'true'], iconMode: showIcon ? 'show' : 'none', iconModeOptions: ['none', 'show'],
    icon, iconCustom: Boolean(icon && icon !== defaultIcon),
  };
}

async function applyBadge(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const status = BADGE_STATUSES.includes(props.status) ? props.status : 'neutral';
  queueComponentProperty(instance, assignments, 'Status', status, 'VARIANT', warnings, 'Badge status');
  queueComponentProperty(instance, assignments, 'Subtle', props.subtle === true ? 'true' : 'false', 'VARIANT', warnings, 'Badge subtle');
  const size = BADGE_SIZES.includes(props.size) ? props.size : 'md';
  queueComponentProperty(instance, assignments, 'Size', size, 'VARIANT', warnings, 'Badge size');
  const hasIconProp = Object.prototype.hasOwnProperty.call(props, 'icon');
  const iconName = typeof props.icon === 'string' && props.icon.length > 0 ? props.icon : BADGE_DEFAULT_ICONS[status];
  const materialIcon = props.icon !== null ? await findMaterialIconComponentAsync(iconName, warnings) : null;
  let iconPropertyApplied = false;
  if (materialIcon) iconPropertyApplied = queueIconSwapProperty(instance, assignments, materialIcon);
  if (!iconPropertyApplied && props.icon !== null) iconPropertyApplied = queueIconTextProperty(instance, assignments, iconName);
  queueComponentProperty(instance, assignments, 'Show icon', props.icon !== null, 'BOOLEAN', warnings, 'Badge icon visibility');
  if (node.content && typeof node.content.fallback === 'string') queueComponentProperty(instance, assignments, 'Label', node.content.fallback, 'TEXT', warnings, 'Badge label');
  applyQueuedProperties(instance, assignments, warnings, 'Badge properties');
  if (props.icon !== null) {
    if (!materialIcon && hasIconProp && !iconPropertyApplied) warnings.push(`No Material icon component named "${iconName}" exists in this file — trying the editable Badge icon text fallback.`);
    await finalizeMaterialIconUpdate(instance, iconName, materialIcon, iconPropertyApplied, warnings, 'Badge Material icon');
  }
  if (props.size !== undefined && !BADGE_SIZES.includes(props.size)) warnings.push(`Badge size="${props.size}" is not available in Figma; md was used.`);
}

async function importBadge(node, warnings) {
  const instance = await createComponentInstance('Badge', warnings);
  await applyBadge(instance, node, warnings);
  return instance;
}

function exportSwitch(instance) {
  const props = {};
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  const checked = componentPropertyValue(instance, 'Checked', 'VARIANT');
  if (SWITCH_SIZES.includes(size) && size !== 'default') props.size = size;
  if (checked === 'true' || checked === true) props.defaultChecked = true;
  const label = componentText(instance, 'Label', namedTextValue(instance, 'Label')).trim();
  const hint = componentText(instance, 'Hint', namedTextValue(instance, 'Hint')).trim();
  const error = componentText(instance, 'Error', namedTextValue(instance, 'Error')).trim();
  const showHint = componentBoolean(instance, 'Show hint', false);
  const showError = componentBoolean(instance, 'Show error', false);
  if (label) props.label = label;
  if (showError && error) props.error = error;
  else if (showHint && hint) props.hint = hint;
  return { node: { id: componentId('Switch', instance), type: 'Switch', props }, warnings: [] };
}

async function applySwitch(instance, node, warnings) {
  const props = node.props || {};
  const live = currentInstance(instance);
  const assignments = {};
  const hint = typeof props.hint === 'string' ? props.hint : '';
  const error = typeof props.error === 'string' ? props.error : '';
  const showError = error.length > 0;
  const showHint = hint.length > 0 && !showError;
  queueComponentProperty(live, assignments, 'Size', SWITCH_SIZES.includes(props.size) ? props.size : 'default', 'VARIANT', warnings, 'Switch Size');
  queueComponentProperty(live, assignments, 'Checked', props.checked === true || props.defaultChecked === true ? 'true' : 'false', 'VARIANT', warnings, 'Switch Checked');
  queueComponentProperty(live, assignments, 'Label', typeof props.label === 'string' ? props.label : 'Enable option', 'TEXT', warnings, 'Switch Label');
  queueComponentProperty(live, assignments, 'Hint', hint || 'Supporting text', 'TEXT', warnings, 'Switch Hint');
  queueComponentProperty(live, assignments, 'Show hint', showHint, 'BOOLEAN', warnings, 'Switch Show hint');
  queueComponentProperty(live, assignments, 'Error', error || 'This setting requires attention.', 'TEXT', warnings, 'Switch Error');
  queueComponentProperty(live, assignments, 'Show error', showError, 'BOOLEAN', warnings, 'Switch Show error');
  applyQueuedProperties(live, assignments, warnings, 'Switch properties');
  if (props.checked !== undefined) warnings.push('Switch controlled checked state is represented as the current Figma Checked visual.');
}

async function importSwitch(node, warnings) {
  const instance = await createComponentInstance('Switch', warnings);
  await applySwitch(instance, node, warnings);
  return instance;
}

function exportTooltip(instance) {
  const props = {};
  const placement = componentPropertyValue(instance, 'Placement', 'VARIANT');
  if (TOOLTIP_PLACEMENTS.includes(placement) && placement !== 'top') props.placement = placement;
  return { node: { id: componentId('Tooltip', instance), type: 'Tooltip', props: { ...props, content: namedTextValue(instance, 'Content', 'Helpful supporting text') } }, warnings: ['Tooltip trigger content is runtime-only and is not included in the standalone Figma surface export.'] };
}

async function applyTooltip(instance, node, warnings) {
  const props = node.props || {};
  setVariant(instance, 'Placement', TOOLTIP_PLACEMENTS.includes(props.placement) ? props.placement : 'top', warnings, 'Tooltip');
  if (typeof props.content === 'string') await writeNamedText(instance, 'Content', props.content, warnings, 'Tooltip');
}

async function importTooltip(node, warnings) {
  const instance = await createComponentInstance('Tooltip', warnings);
  await applyTooltip(instance, node, warnings);
  warnings.push('Tooltip was rendered as its visual surface; add its trigger relationship in Figma manually.');
  return instance;
}

function codeTextValue(instance) {
  const direct = componentText(instance, 'Code',
    componentText(instance, 'Content',
      componentText(instance, 'Value',
        componentText(instance, 'Text', ''))));
  if (direct) return direct;
  try {
    const texts = currentInstance(instance).findAll((node) => node.type === 'TEXT' && node.visible !== false);
    const candidates = texts
      .map((text) => (typeof text.characters === 'string' ? text.characters : ''))
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value) => !/^(copy|show more|show less)$/i.test(value));
    return candidates.sort((a, b) => b.length - a.length)[0] || '';
  } catch {
    return '';
  }
}

function exportCode(instance) {
  instance = currentInstance(instance);
  const warnings = [];
  const props = {};
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  if (variant === 'inline' || variant === 'block') props.variant = variant;
  const wrapping = componentBoolean(instance, 'Wrapping', undefined);
  if (typeof wrapping === 'boolean') props.wrapping = wrapping;
  const editable = componentBoolean(instance, 'Editable', undefined);
  if (typeof editable === 'boolean') props.editable = editable;
  const copyCode = componentBoolean(instance, 'Copy code', componentBoolean(instance, 'Copy Code', undefined));
  if (typeof copyCode === 'boolean') props.copyCode = copyCode;
  const copyText = componentText(instance, 'Copy text', componentText(instance, 'Copy Text', '')).trim();
  if (copyText) props.copyText = copyText;
  const collapsedLines = componentPropertyValue(instance, 'Collapsed lines', 'TEXT') || componentPropertyValue(instance, 'Collapsed Lines', 'TEXT');
  const numericCollapsedLines = Number(collapsedLines);
  if (Number.isFinite(numericCollapsedLines) && numericCollapsedLines > 0) props.collapsedLines = numericCollapsedLines;
  return { node: { id: componentId('Code', instance), type: 'Code', props, content: { fallback: codeTextValue(instance) || 'Code sample' } }, warnings };
}

async function applyCode(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const variant = props.variant === 'inline' ? 'inline' : 'block';
  queueOptionalComponentProperty(instance, assignments, 'Variant', variant, 'VARIANT');
  if (props.wrapping !== undefined) queueOptionalComponentProperty(instance, assignments, 'Wrapping', props.wrapping === true, 'BOOLEAN');
  if (props.editable !== undefined) queueOptionalComponentProperty(instance, assignments, 'Editable', props.editable === true, 'BOOLEAN');
  if (props.copyCode !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Copy code', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Copy Code', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Show copy', props.copyCode === true, 'BOOLEAN')
      || queueOptionalComponentProperty(instance, assignments, 'Show copy button', props.copyCode === true, 'BOOLEAN');
  }
  if (typeof props.copyText === 'string') {
    queueOptionalComponentProperty(instance, assignments, 'Copy text', props.copyText, 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Copy Text', props.copyText, 'TEXT');
  }
  if (props.collapsedLines !== undefined) {
    queueOptionalComponentProperty(instance, assignments, 'Collapsed lines', String(props.collapsedLines), 'TEXT')
      || queueOptionalComponentProperty(instance, assignments, 'Collapsed Lines', String(props.collapsedLines), 'TEXT');
  }
  const value = node.content && typeof node.content.fallback === 'string' ? node.content.fallback : typeof props.children === 'string' ? props.children : 'Code sample';
  const appliedTextProperty = queueOptionalComponentProperty(instance, assignments, 'Code', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Content', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Value', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Text', value, 'TEXT');
  applyQueuedProperties(instance, assignments, warnings, 'Code properties');
  if (!appliedTextProperty) await writeFirstNamedText(instance, ['Code', 'Content', 'Value', 'Text'], value, warnings, 'Code text');
  for (const runtimeProp of ['onChangeValue', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
  }
}

async function importCode(node, warnings) {
  const instance = await createComponentInstance('Code', warnings);
  await applyCode(instance, node, warnings);
  return instance;
}

function inlineTextValue(instance) {
  const direct = componentText(instance, 'Markdown', componentText(instance, 'Content', componentText(instance, 'Value', componentText(instance, 'Text', ''))));
  if (direct) return direct;
  try {
    const texts = currentInstance(instance).findAll((node) => node.type === 'TEXT' && node.visible !== false);
    return texts.map((text) => (typeof text.characters === 'string' ? text.characters : '')).map((value) => value.trim()).filter(Boolean).sort((a, b) => b.length - a.length)[0] || '';
  } catch {
    return '';
  }
}

function inlineElementValue(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return '';
  const compact = normalized.toLowerCase().replace(/\s+/g, '-');
  return INLINE_ELEMENTS.includes(compact) ? compact : '';
}

function exportInline(instance) {
  instance = currentInstance(instance);
  const props = {};
  const element = inlineElementValue(componentPropertyValue(instance, 'Inline element', 'VARIANT') || componentPropertyValue(instance, 'Element', 'VARIANT') || componentPropertyValue(instance, 'Type', 'VARIANT') || componentText(instance, 'Inline element', ''));
  if (element && element !== 'all') props.inlineElement = element;
  return { node: { id: componentId('Inline', instance), type: 'Inline', props, content: { fallback: inlineTextValue(instance) || 'Inline text' } }, warnings: [] };
}

async function applyInline(instance, node, warnings) {
  await loadInstanceFonts(instance);
  const props = node.props || {};
  const assignments = {};
  const requestedElement = typeof props.inlineElement === 'string' ? props.inlineElement : 'all';
  const element = INLINE_ELEMENTS.includes(requestedElement) ? requestedElement : 'all';
  queueOptionalComponentProperty(instance, assignments, 'Inline element', element, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Element', element, 'VARIANT')
    || queueOptionalComponentProperty(instance, assignments, 'Type', element, 'VARIANT');
  const value = node.content && typeof node.content.fallback === 'string' ? node.content.fallback : typeof props.children === 'string' ? props.children : 'Inline text';
  const appliedTextProperty = queueOptionalComponentProperty(instance, assignments, 'Markdown', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Content', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Value', value, 'TEXT')
    || queueOptionalComponentProperty(instance, assignments, 'Text', value, 'TEXT');
  applyQueuedProperties(instance, assignments, warnings, 'Inline properties');
  if (!appliedTextProperty) await writeFirstNamedText(instance, ['Markdown', 'Content', 'Value', 'Text'], value, warnings, 'Inline text');
  for (const runtimeProp of ['className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" is a runtime prop with no Figma representation — ignored.`);
  }
}

async function importInline(node, warnings) {
  const instance = await createComponentInstance('Inline', warnings);
  await applyInline(instance, node, warnings);
  return instance;
}

function exportDivider(instance) {
  const warnings = [];
  const props = {};
  const orientation = componentPropertyValue(instance, 'Orientation', 'VARIANT');
  const variant = componentPropertyValue(instance, 'Variant', 'VARIANT');
  const lineStyle = componentPropertyValue(instance, 'Line style', 'VARIANT');
  const size = componentPropertyValue(instance, 'Size', 'VARIANT');
  if (DIVIDER_ORIENTATIONS.includes(orientation) && orientation !== 'horizontal') props.orientation = orientation;
  if (DIVIDER_VARIANTS.includes(variant) && variant !== 'subtle') props.variant = variant;
  if (DIVIDER_LINE_STYLES.includes(lineStyle) && lineStyle !== 'solid') props.lineStyle = lineStyle;
  if (DIVIDER_SIZES.includes(size) && size !== 'xs') props.size = size;
  return {
    node: { id: componentId('Divider', instance), type: 'Divider', ...(Object.keys(props).length ? { props } : {}) },
    warnings,
  };
}

function staticDividerOrientation(value, warnings) {
  if (DIVIDER_ORIENTATIONS.includes(value)) return value;
  if (value && typeof value === 'object') warnings.push('Responsive Divider orientation has no static Figma representation; horizontal was used.');
  else if (value !== undefined) warnings.push(`Unsupported Divider orientation "${value}" was ignored.`);
  return 'horizontal';
}

function applyDivider(instance, node, warnings) {
  const props = node.props || {};
  const assignments = {};
  queueComponentProperty(instance, assignments, 'Orientation', staticDividerOrientation(props.orientation, warnings), 'VARIANT', warnings, 'Divider orientation');
  queueComponentProperty(instance, assignments, 'Variant', DIVIDER_VARIANTS.includes(props.variant) ? props.variant : 'subtle', 'VARIANT', warnings, 'Divider variant');
  queueComponentProperty(instance, assignments, 'Line style', DIVIDER_LINE_STYLES.includes(props.lineStyle) ? props.lineStyle : 'solid', 'VARIANT', warnings, 'Divider line style');
  queueComponentProperty(instance, assignments, 'Size', DIVIDER_SIZES.includes(props.size) ? props.size : 'xs', 'VARIANT', warnings, 'Divider size');
  applyQueuedProperties(instance, assignments, warnings, 'Divider properties');
  for (const runtimeProp of ['space', 'decorative', 'className', 'id']) {
    if (props[runtimeProp] !== undefined) warnings.push(`"${runtimeProp}" has no Figma representation — ignored.`);
  }
}

async function importDivider(node, warnings) {
  const instance = await createComponentInstance('Divider', warnings);
  applyDivider(instance, node, warnings);
  return instance;
}
