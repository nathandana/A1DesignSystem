import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createInventory } from '../scripts/plugin-inventory.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const contractsPath = resolve(here, '../src/contracts/messages.d.ts');

function unionValues(source, typeName) {
  const pattern = new RegExp(`export type ${typeName} =([\\s\\S]*?);`);
  const match = source.match(pattern);
  assert.ok(match, `${typeName} union should exist`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]).sort();
}

test('message contracts match controller and UI message strings', () => {
  const source = readFileSync(contractsPath, 'utf8');
  const inventory = createInventory();
  assert.deepEqual(unionValues(source, 'ControllerCommand'), inventory.code.inboundMessages);
  assert.deepEqual(unionValues(source, 'UiResultMessage'), inventory.ui.handledMessages);
});
