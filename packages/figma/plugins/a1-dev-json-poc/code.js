// A1 JSON Dev Mode codegen entrypoint.
// The shared serializer is inlined into code.js by scripts/build.mjs.
/** Shared, runtime-safe helpers used by the A1 exporter and Dev Mode codegen. */

const A1_BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'success'];
const A1_BUTTON_SIZES = ['sm', 'md', 'lg'];

function plainComponentKey(key) {
  return String(key || '').split('#')[0].toLowerCase().replace(/[\s_-]+/g, '');
}

function componentValue(properties, names, fallback) {
  const wanted = (Array.isArray(names) ? names : [names]).map(plainComponentKey);
  for (const [key, entry] of Object.entries(properties || {})) {
    if (!wanted.includes(plainComponentKey(key))) continue;
    if (entry && typeof entry === 'object' && 'value' in entry) return entry.value;
    return entry;
  }
  return fallback;
}

function textComponentValue(properties, names, fallback = '') {
  const value = componentValue(properties, names, fallback);
  return typeof value === 'string' ? value : fallback;
}

function sanitizeA1Id(prefix, id) {
  return `${prefix}-${String(id || 'selection').replace(/[^a-z0-9]+/gi, '-')}`;
}

/**
 * Serialize the canonical Button contract. The main plugin supplies resolved
 * icon/action data; Dev Mode supplies the same values directly from the node.
 */
function buttonNodeFromFigma({ id, properties = {}, label, iconName, fullWidth = false }) {
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


function textContent(node) {
  if (!node) return '';
  if (node.type === 'TEXT') return typeof node.characters === 'string' ? node.characters : '';
  if (typeof node.findOne !== 'function') return '';
  try {
    const text = node.findOne((child) => child.type === 'TEXT' && child.visible !== false);
    return text && typeof text.characters === 'string' ? text.characters : '';
  } catch {
    return '';
  }
}

function isButton(node) {
  if (!node) return false;
  const names = [node.name];
  try {
    if (node.mainComponent && node.mainComponent.name) names.push(node.mainComponent.name);
  } catch {
    // Some Dev Mode nodes do not expose their main component.
  }
  return names.some((name) => /(^|\s|[-_])icon[-_ ]?button|(^|\s|[-_])button(\s|$)/i.test(String(name || '')));
}

function componentProperties(node) {
  try {
    return node && node.componentProperties && typeof node.componentProperties === 'object'
      ? node.componentProperties
      : {};
  } catch {
    return {};
  }
}

function iconName(node, properties) {
  const configured = componentValue(properties, ['Icon'], '');
  if (typeof configured === 'string' && /^[a-z0-9_ -]+$/i.test(configured) && configured.length < 80) {
    return configured.trim();
  }
  try {
    const icon = node.findOne((child) => child.type === 'INSTANCE' && /icon/i.test(child.name || ''));
    const main = icon && icon.mainComponent;
    return main && typeof main.name === 'string' ? main.name.split('/').pop().trim() : '';
  } catch {
    return '';
  }
}

function buttonJson(node) {
  const properties = componentProperties(node);
  return buttonNodeFromFigma({
    id: node && node.id,
    properties,
    label: textComponentValue(properties, ['Label'], textContent(node).trim() || 'Button'),
    iconName: iconName(node, properties),
    fullWidth: /\{\s*fullWidth\s*:\s*true\s*\}/i.test(String(node && node.name || '')),
  });
}

function selectionJson(node) {
  if (isButton(node)) return buttonJson(node);
  return {
    id: sanitizeA1Id('selection', node && node.id),
    type: 'Selection',
    props: {
      name: node && node.name ? node.name : 'Nothing selected',
      figmaType: node && node.type ? node.type : 'NONE',
    },
  };
}

if (figma.editorType === 'dev' && figma.mode === 'codegen') {
  figma.codegen.on('generate', ({ node }) => [{
    title: isButton(node) ? 'A1 Button JSON' : 'A1 Selection JSON',
    language: 'JSON',
    code: JSON.stringify(selectionJson(node), null, 2),
  }]);
}
