// A1 JSON Dev Mode codegen entrypoint.
// The shared serializer is inlined into code.js by scripts/build.mjs.
import {
  buttonNodeFromFigma,
  componentValue,
  sanitizeA1Id,
  textComponentValue,
} from '../../a1-json/src/shared/codegen.js';

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
