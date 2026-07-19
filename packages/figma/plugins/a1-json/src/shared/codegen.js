/** Shared, runtime-safe helpers used by the A1 exporter and Dev Mode codegen. */

export const A1_BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'success'];
export const A1_BUTTON_SIZES = ['sm', 'md', 'lg'];

export function plainComponentKey(key) {
  return String(key || '').split('#')[0].toLowerCase().replace(/[\s_-]+/g, '');
}

export function componentValue(properties, names, fallback) {
  const wanted = (Array.isArray(names) ? names : [names]).map(plainComponentKey);
  for (const [key, entry] of Object.entries(properties || {})) {
    if (!wanted.includes(plainComponentKey(key))) continue;
    if (entry && typeof entry === 'object' && 'value' in entry) return entry.value;
    return entry;
  }
  return fallback;
}

export function textComponentValue(properties, names, fallback = '') {
  const value = componentValue(properties, names, fallback);
  return typeof value === 'string' ? value : fallback;
}

export function sanitizeA1Id(prefix, id) {
  return `${prefix}-${String(id || 'selection').replace(/[^a-z0-9]+/gi, '-')}`;
}

/**
 * Serialize the canonical Button contract. The main plugin supplies resolved
 * icon/action data; Dev Mode supplies the same values directly from the node.
 */
export function buttonNodeFromFigma({ id, properties = {}, label, iconName, fullWidth = false }) {
  const props = {};
  const variant = componentValue(properties, ['Variant'], 'primary');
  const size = componentValue(properties, ['Size'], 'md');
  const state = componentValue(properties, ['State'], 'default');
  const iconPosition = componentValue(properties, ['IconPosition', 'Icon position'], 'start');
  const showIcon = componentValue(properties, ['Show icon', 'ShowIcon'], false) === true ||
    componentValue(properties, ['Show icon', 'ShowIcon'], false) === 'true';

  if (A1_BUTTON_VARIANTS.includes(variant) && variant !== 'primary') props.variant = variant;
  if (A1_BUTTON_SIZES.includes(size) && size !== 'md') props.size = size;
  if (state === 'disabled') props.disabled = true;
  if (state === 'loading') props.loading = true;
  if (fullWidth === true) props.fullWidth = true;
  if (showIcon && iconName) {
    props.icon = iconName;
    if (iconPosition === 'end') props.iconPosition = 'end';
  }

  const content = typeof label === 'string' && label.trim() ? label.trim() : 'Button';
  const node = { id: sanitizeA1Id('button', id), type: 'Button', content: { fallback: content } };
  if (Object.keys(props).length) node.props = props;
  return node;
}
