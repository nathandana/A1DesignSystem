import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  BUTTON_CONTAINER_QUERY_WIDTH,
  buttonContainerDirectionAtWidth,
} from '../src/pure/button-container.js';

const here = dirname(fileURLToPath(import.meta.url));

test('matches the React Button Container 480px query boundary', () => {
  assert.equal(buttonContainerDirectionAtWidth(BUTTON_CONTAINER_QUERY_WIDTH - 0.01), 'stacked');
  assert.equal(buttonContainerDirectionAtWidth(BUTTON_CONTAINER_QUERY_WIDTH), 'inline');
  assert.equal(buttonContainerDirectionAtWidth(BUTTON_CONTAINER_QUERY_WIDTH + 320), 'inline');
});

test('defaults an unavailable width to the non-compact direction', () => {
  assert.equal(buttonContainerDirectionAtWidth(undefined), 'inline');
  assert.equal(buttonContainerDirectionAtWidth(Number.NaN), 'inline');
});

test('resyncs nested Button Containers after an imported screen reaches its final width', () => {
  const source = readFileSync(resolve(here, '../src/code.js'), 'utf8');
  const importFlow = source.match(/async function handleImport[\s\S]*?\n}\n\nfunction breakpointRootName/);
  assert.ok(importFlow, 'handleImport should exist');
  assert.match(
    importFlow[0],
    /appendImportedChild\(targetParent, instance, node, warnings\);[\s\S]*?syncButtonContainersForDimensions\(instance, warnings\);/,
    'responsive descendants must be resynced after the final root resize and placement',
  );
});
