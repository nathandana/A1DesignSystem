import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canonicalKey,
  compactKey,
  componentNameCandidatesForAliases,
  figmaComponentNameMatchesForAliases,
} from '../src/pure/name-matching.js';

test('canonicalizes Figma property keys while preserving path separators', () => {
  assert.equal(canonicalKey('Label #12:3'), 'label');
  assert.equal(canonicalKey('Link / Color'), 'link/color');
  assert.equal(compactKey('Link / Color'), 'linkcolor');
});

test('generates component name candidates with aliases and compact names', () => {
  assert.deepEqual(componentNameCandidatesForAliases('IconButton', { IconButton: ['Icon Button'] }), [
    'IconButton',
    'Icon Button',
    'Icon Button',
  ].filter((value, index, all) => all.indexOf(value) === index));
});

test('matches component names across paths, aliases, spacing, and compact casing', () => {
  const aliases = { IconButton: ['Icon Button'], ButtonContainer: ['Button Container'] };
  assert.equal(figmaComponentNameMatchesForAliases('Actions/Icon Button', 'IconButton', aliases), true);
  assert.equal(figmaComponentNameMatchesForAliases('ButtonContainer', 'Button Container', aliases), true);
  assert.equal(figmaComponentNameMatchesForAliases('Navigation › Page Nav', 'PageNav'), true);
  assert.equal(figmaComponentNameMatchesForAliases('Card', 'Grid', aliases), false);
});
