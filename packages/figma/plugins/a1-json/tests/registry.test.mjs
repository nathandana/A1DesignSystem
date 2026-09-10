import assert from 'node:assert/strict';
import test from 'node:test';
import {
  componentRegistryInventory,
  validateComponentRegistry,
} from '../scripts/component-registry-inventory.mjs';

test('component adapter registry has unique names and consistent capabilities', () => {
  const result = validateComponentRegistry(componentRegistryInventory());
  assert.deepEqual(result.errors, []);
  assert.equal(result.counts.exportHandlers, 42);
  assert.equal(result.counts.applyHandlers, 41);
  assert.equal(result.counts.importHandlers, 45);
});
