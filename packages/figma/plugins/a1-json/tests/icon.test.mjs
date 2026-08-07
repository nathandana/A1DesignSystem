import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ICON_COLOR_VARIABLE_NAMES,
  iconColorFromVariableName,
  iconNameProp,
  normalizeIconColor,
  normalizeIconSize,
} from '../src/pure/icon.js';

test('normalizes the complete A1 Icon size contract', () => {
  assert.equal(normalizeIconSize('xs'), 'xs');
  assert.equal(normalizeIconSize('xjumbo'), 'xJumbo');
  assert.equal(normalizeIconSize('xJumbo'), 'xJumbo');
  assert.equal(normalizeIconSize('unsupported'), 'md');
  assert.equal(normalizeIconSize(undefined), 'md');
});

test('accepts the React name prop and the legacy icon alias', () => {
  assert.equal(iconNameProp({ name: 'light_mode' }), 'light_mode');
  assert.equal(iconNameProp({ icon: 'dark_mode' }), 'dark_mode');
  assert.equal(iconNameProp({}), 'star');
});

test('maps every Icon color to its semantic Figma variable', () => {
  assert.equal(ICON_COLOR_VARIABLE_NAMES.accent, 'color/text/accent');
  assert.equal(ICON_COLOR_VARIABLE_NAMES.success, 'color/status/success/background');
  assert.equal(normalizeIconColor(' Warn '), 'warn');
  assert.equal(normalizeIconColor('unsupported'), '');
  assert.equal(iconColorFromVariableName('Semantic/color/text/inverse'), 'inverse');
  assert.equal(iconColorFromVariableName('color/status/info/background'), 'info');
});
