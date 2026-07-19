import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createInventory } from '../scripts/plugin-inventory.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const baselinePath = resolve(here, 'fixtures/structural-inventory.baseline.json');

test('structural inventory matches the current refactor baseline', () => {
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  assert.deepEqual(createInventory(), baseline);
});
