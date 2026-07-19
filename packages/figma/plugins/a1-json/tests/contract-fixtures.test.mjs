import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesRoot = resolve(here, 'fixtures');

const fixtureNames = [
  'all-new-components.contract.json',
  'responsive-grid.contract.json',
];
const pluginRoot = resolve(here, '..');

function countNodes(value) {
  if (!value || typeof value !== 'object') return 0;
  const children = [
    ...(Array.isArray(value) ? value : []),
    ...(Array.isArray(value.nodes) ? value.nodes : []),
    ...(Array.isArray(value.children) ? value.children : []),
    ...(Array.isArray(value.regions) ? value.regions : []),
  ];
  return (value.type ? 1 : 0) + children.reduce((total, child) => total + countNodes(child), 0);
}

test('contract fixtures remain valid JSON with supported page nodes', () => {
  for (const name of fixtureNames) {
    const path = resolve(fixturesRoot, name);
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    assert.ok(countNodes(parsed) > 0, `${name} should include at least one page node`);
  }
});

test('library manifest has the expected published-key sections', () => {
  const manifest = JSON.parse(readFileSync(resolve(pluginRoot, 'a1-library-manifest.json'), 'utf8'));
  assert.equal(manifest.schemaVersion, '1.0');
  assert.ok(manifest.library?.fileKey, 'library fileKey is required');
  for (const key of ['componentSets', 'components', 'textStyles', 'variables']) {
    assert.equal(typeof manifest[key], 'object', `${key} should be an object`);
  }
  assert.equal(typeof manifest.variables.color, 'object', 'variables.color should be an object');
  assert.equal(typeof manifest.variables.float, 'object', 'variables.float should be an object');
});

test('plugin manifest exposes the A1:Figma relaunch action', () => {
  const manifest = JSON.parse(readFileSync(resolve(pluginRoot, 'manifest.json'), 'utf8'));
  const relaunch = manifest.relaunchButtons?.find((button) => button.command === 'open');
  assert.equal(relaunch?.name, 'Open A1:Figma');
  assert.equal(relaunch?.multipleSelection, true);
});

test('configured manifest imports are trusted without fragile name revalidation', () => {
  const source = readFileSync(resolve(pluginRoot, 'src/code.js'), 'utf8');
  const configuredImportBranch = source.match(/source = await importConfiguredLibraryComponentSource\(name\);[\s\S]*?return source;/);
  assert.ok(configuredImportBranch, 'configured manifest import branch should exist');
  assert.equal(
    configuredImportBranch[0].includes('sourceMatchesA1ComponentName'),
    false,
    'exact configured component keys must not be rejected because default variants have different names',
  );
});
