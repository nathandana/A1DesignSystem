import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeCardHeroColor,
  normalizeCardIconDisplay,
} from '../src/pure/card.js';

test('normalizes Card icon display values and falls back to default', () => {
  assert.equal(normalizeCardIconDisplay('Hero'), 'hero');
  assert.equal(normalizeCardIconDisplay(' none '), 'none');
  assert.equal(normalizeCardIconDisplay('unsupported'), 'default');
  assert.equal(normalizeCardIconDisplay(null), 'default');
});

test('normalizes Card hero colors and falls back to action', () => {
  assert.equal(normalizeCardHeroColor('Success'), 'success');
  assert.equal(normalizeCardHeroColor(' warn '), 'warn');
  assert.equal(normalizeCardHeroColor('unsupported'), 'action');
  assert.equal(normalizeCardHeroColor(undefined), 'action');
});
