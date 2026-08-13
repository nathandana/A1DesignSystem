import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createInventory } from '../scripts/plugin-inventory.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const contractsPath = resolve(here, '../src/contracts/messages.d.ts');
const uiPath = resolve(here, '../src/ui.html');
const distUiPath = resolve(here, '../dist/ui.html');
const buildPath = resolve(here, '../scripts/build.mjs');

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

test('A1 page pulls forward Figure image sidecars to the controller', () => {
  const source = readFileSync(uiPath, 'utf8');
  const matches = source.match(/assets: data\.page\.assets \|\| \[\]/g) ?? [];

  assert.equal(matches.length, 2, 'selected-page and project-page pulls should both forward image assets');
});

test('context controls use and bundle the A1 Toolbar component styles', () => {
  const ui = readFileSync(uiPath, 'utf8');
  const build = readFileSync(buildPath, 'utf8');

  assert.match(ui, /className = 'a1-toolbar__button'/);
  assert.match(ui, /className = 'a1-toolbar__group a1-toolbar__group-radios'/);
  assert.doesNotMatch(ui, /a1-toolbar-button|a1-toolbar-group|a1-toolbar-full-width/);
  assert.match(build, /packages\/react\/src\/components\/toolbar\/toolbar\.css/);
});

test('breakpoint visibility exposes a five-toggle toolbar and controller message', () => {
  const ui = readFileSync(uiPath, 'utf8');
  const distUi = readFileSync(distUiPath, 'utf8');

  assert.match(ui, /id="breakpoint-visibility-control"/);
  assert.match(ui, /type: 'set-breakpoint-visibility'/);
  assert.match(ui, /A1_BREAKPOINTS\.map/);
  assert.match(ui, /pluginLabel\('breakpointVisibilityLabel'/);
  assert.doesNotMatch(distUi, /__A1_PLUGIN_LABELS__/);
  assert.match(distUi, /"breakpointVisibilitySelectionChanged":\{"en":/);
});
