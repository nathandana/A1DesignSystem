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
  assert.match(manifest.imageLibrary?.publicBaseUrl || '', /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\/images\/shared$/);
  for (const key of ['componentSets', 'components', 'iconSets', 'textStyles', 'variables']) {
    assert.equal(typeof manifest[key], 'object', `${key} should be an object`);
  }
  const badgeAndCardIcons = [
    'accessibility', 'accessibility_new', 'account_tree', 'apps', 'auto_awesome',
    'bar_chart', 'bolt', 'campaign', 'category', 'check_circle', 'code', 'construction',
    'dashboard', 'dashboard_customize', 'data_object', 'design_services', 'devices',
    'edit_note', 'error', 'fact_check', 'folder', 'font_download', 'format_paint',
    'foundation', 'gavel', 'hub', 'image', 'info', 'input', 'insert_photo',
    'integration_instructions', 'language', 'layers', 'looks_3', 'looks_4',
    'looks_one', 'looks_two', 'menu', 'near_me', 'palette', 'phone_iphone',
    'photo_library', 'precision_manufacturing', 'publish', 'query_stats', 'route',
    'smart_button', 'star', 'star_border', 'table_chart', 'task_alt', 'terminal',
    'text_fields', 'title', 'token', 'touch_app', 'translate', 'warning', 'web_asset',
    'widgets',
  ];
  for (const icon of ['arrow_forward', 'link', 'open_in_new', ...badgeAndCardIcons]) {
    assert.match(manifest.iconSets[icon] || '', /^[a-f0-9]{40}$/, `${icon} needs a published component-set key`);
  }
  assert.equal(typeof manifest.variables.color, 'object', 'variables.color should be an object');
  assert.equal(typeof manifest.variables.float, 'object', 'variables.float should be an object');
  assert.deepEqual({
    button: manifest.componentSets['POC / Button'],
    checkboxItem: manifest.componentSets['Checkbox Item'],
    checkboxItemLegacy: manifest.componentSets['POC / Checkbox item'],
    checkboxGroup: manifest.componentSets['POC / Checkbox group'],
  }, {
    button: '93c7289bb785c8389d8e987b321e4963850c1d82',
    checkboxItem: '318c659e78e499c4803b45733ee0c44ddaef0ae4',
    checkboxItemLegacy: '318c659e78e499c4803b45733ee0c44ddaef0ae4',
    checkboxGroup: '4ad3f8bbc0ee7beb5929454b124411814a33047b',
  });
});

test('flat POC Checkbox Group names are disambiguated by stable component-set keys', () => {
  const source = readFileSync(resolve(pluginRoot, 'src/code.js'), 'utf8');
  assert.match(source, /componentSetKey\(currentInstance\(instance\)\) === A1_POC_CHECKBOX_GROUP_COMPONENT_SET_KEY/);
  assert.match(source, /componentSetKey\(instance\) === A1_POC_CHECKBOX_ITEM_COMPONENT_SET_KEY/);
  assert.equal(source.includes("componentSetName(currentInstance(instance)) === 'POC / Checkbox group'"), false);
  assert.equal(source.includes("? 'POC / Checkbox item' : optionSetName"), false);
});

test('plugin manifest exposes the A1:Figma relaunch action', () => {
  const manifest = JSON.parse(readFileSync(resolve(pluginRoot, 'manifest.json'), 'utf8'));
  const relaunch = manifest.relaunchButtons?.find((button) => button.command === 'open');
  assert.equal(relaunch?.name, 'Open A1:Figma');
  assert.equal(relaunch?.multipleSelection, true);
  assert.ok(
    manifest.networkAccess?.allowedDomains?.includes('https://pszmkbfvyjkifbyututo.supabase.co'),
    'the public A1 Image Library origin must be available to Figure imports',
  );
  assert.ok(
    manifest.networkAccess?.allowedDomains?.includes('*') && manifest.networkAccess?.reasoning,
    'explicitly imported Figures need network access and a user-facing explanation for direct image URLs',
  );
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

test('material icons use configured keys before enabled-library discovery', () => {
  const source = readFileSync(resolve(pluginRoot, 'src/code.js'), 'utf8');
  const resolver = source.match(/async function findMaterialIconComponentAsync[\s\S]*?\n}\n\nfunction materialIconNameFromInstance/);
  assert.ok(resolver, 'material icon resolver should exist');
  const configured = resolver[0].indexOf('importConfiguredMaterialIconSource(requested)');
  const discovery = resolver[0].indexOf('getAvailableComponentSetsAsync');
  assert.ok(configured >= 0, 'material icons should support configured manifest imports');
  assert.ok(discovery > configured, 'configured icon keys should be attempted before enabled-library discovery');
});

test('Badge and Card imports use the shared async Material icon resolver', () => {
  const source = readFileSync(resolve(pluginRoot, 'src/code.js'), 'utf8');
  const atomic = readFileSync(resolve(pluginRoot, 'src/adapters/atomic.js'), 'utf8');
  const cardApply = source.match(/async function applyCard[\s\S]*?\n}\n\nasync function importCard/);
  const badgeApply = atomic.match(/async function applyBadge[\s\S]*?\n}\n\nasync function importBadge/);
  assert.ok(cardApply?.[0].includes('await findMaterialIconComponentAsync(iconName, warnings)'));
  assert.ok(badgeApply?.[0].includes('await findMaterialIconComponentAsync(iconName, warnings)'));
});
