import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { validateJson, contract, messages } from '../../system/json-model/validate.js';
import { getJsonModel } from '../../system/json-model/model.js';
import { validateJson as validateInEditor, validateImportJson } from '../../apps/a1-web/src/editor/jsonValidation.js';
import { createPatternNode, patternManifests } from '../../packages/react/src/patterns/patternPolicies.js';
import handler from '../../packages/mcp-server/netlify/functions/mcp.mjs';

const page = (...nodes) => {
  const document = getJsonModel('page').starter;
  document.page.layout.regions[0].nodes = nodes;
  return document;
};
const validate = document => validateJson({ kind: 'page', document });
const node = (type, props = {}, id = 'node') => ({ id, type, props });
const has = (result, code, path) => result.errors.some(d => d.code === code && (!path || d.path === path));
const root = '/page/layout/regions/0/nodes/0';
async function rpc(method, params = {}) {
  const response = await handler(new Request('http://localhost/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }));
  const body = await response.json();
  assert.equal(body.error, undefined, JSON.stringify(body));
  return body.result;
}
async function call(name, args) {
  const result = await rpc('tools/call', { name, arguments: args });
  assert.notEqual(result.isError, true);
  return result.structuredContent ?? JSON.parse(result.content[0].text);
}

test('MCP discovery → generation → repair loop matches editor for pages and projects', async () => {
  const tools = (await rpc('tools/list')).tools;
  const tool = tools.find(t => t.name === 'validate_json');
  assert.ok(tool.outputSchema.properties.errors);
  assert.equal(tool.annotations.readOnlyHint, true);
  for (const kind of ['page', 'project']) {
    const model = await call('get_json_model', { format: kind });
    const document = model.starter;
    assert.equal((await call('validate_json', { kind, document })).valid, true);
    const definition = kind === 'page' ? document : document.pages[0].definition;
    definition.page.layout.regions[0].nodes = [node('Button', { variant: 'prominent' })];
    const before = structuredClone(document);
    const result = await call('validate_json', { kind, document });
    assert.equal(result.valid, false);
    assert.deepEqual(result, validateInEditor({ kind, document }));
    assert.deepEqual(result, validateImportJson(document));
    assert.deepEqual(document, before);
    assert.ok(result.errors.find(d => d.path.endsWith('/props/variant')).allowedValues.includes('primary'));
    definition.page.layout.regions[0].nodes[0].props.variant = 'primary';
    assert.equal((await call('validate_json', { kind, document })).valid, true);
  }
});

test('canonical editor and MCP starters remain valid, including all formal patterns', async () => {
  const source = stripTypeScriptTypes(fs.readFileSync(new URL('../../apps/a1-web/src/editor/examples/editorExamplePage.ts', import.meta.url), 'utf8'));
  const { editorExamplePage } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  assert.deepEqual(validate(editorExamplePage).errors, []);
  for (const manifest of patternManifests) {
    for (const config of [{}, ...manifest.examples]) {
      const result = validate(page(createPatternNode(manifest.type, config)));
      assert.deepEqual(result.errors, [], `${manifest.type}: ${JSON.stringify(result.errors)}`);
    }
  }
});

test('malformed values and versions produce diagnostics, never throw', () => {
  for (const document of [null, [], 42, '{', {}, { page: null }, { page: { layout: { regions: [null] } } }]) {
    assert.equal(validate(document).valid, false);
  }
  const document = page();
  for (const version of contract.supportedVersions) {
    document.schemaVersion = version;
    assert.equal(validate(document).valid, true);
  }
  document.schemaVersion = '99.0.0';
  assert.ok(has(validate(document), 'UNSUPPORTED_VERSION', '/schemaVersion'));
  assert.ok(has(validateJson({ kind: 'page', document: page(), contractVersion: '99' }), 'UNSUPPORTED_VERSION'));
  assert.ok(has(validateJson({ kind: 'other', document }), 'INVALID_KIND'));
  const cycle = {}; cycle.self = cycle;
  assert.ok(has(validate(cycle), 'INVALID_JSON'));
  assert.ok(has(validate('x'.repeat(2_000_001)), 'LIMIT_EXCEEDED'));
});

test('props are derived from declarations including inherited attributes and responsive values', () => {
  assert.ok(has(validate(page({ id: 'image', type: 'Figure' })), 'REQUIRED_FIELD', `${root}/props/src`));
  assert.ok(has(validate(page(node('Figure'))), 'REQUIRED_FIELD', `${root}/props/src`));
  assert.equal(validate(page(node('Button', { variant: 'primary', disabled: true, 'data-test': 'x' }))).valid, true);
  assert.ok(has(validate(page(node('Button', { disabled: 'yes' }))), 'INVALID_TYPE', `${root}/props/disabled`));
  assert.ok(has(validate(page(node('Button', { invented: true }))), 'UNKNOWN_PROP', `${root}/props/invented`));
  assert.ok(has(validate(page(node('div'))), 'UNKNOWN_COMPONENT', `${root}/type`));
  assert.equal(validate(page(node('Grid', { columns: { xs: 1, md: 3 } }))).valid, true);
  assert.equal(validate(page(node('Grid', { columns: { xs: 'three' } }))).valid, false);
  const bound = validate(page(node('Button', { disabled: '{{ item.disabled }}' })));
  assert.equal(bound.valid, true);
  assert.ok(bound.warnings.some(d => d.code === 'BOUND_VALUE'));
  assert.equal(validate(page(node('DefinitionList', { items: [{ label: 'Name', value: 'A1' }] }))).valid, true);
  assert.equal(validate(page(node('DefinitionList', { items: [{ term: 'Name', value: 'A1' }] }))).valid, false);
  const action = { ...node('Button'), actions: { onClick: { type: 'navigate', target: '/settings' } } };
  assert.equal(validate(page(action)).valid, true);
  assert.equal(validate(page(node('Button', { onClick: 'alert(1)' }))).valid, false);
});

test('placement, IDs, slots, nested Tabs nodes and formal patterns are checked', () => {
  assert.ok(has(validate(page(node('GridItem'))), 'INVALID_PLACEMENT', root));
  assert.ok(has(validate(page(node('Button'), node('Button'))), 'DUPLICATE_ID'));
  const slot = { ...node('Slot', { allow: ['Button'] }), children: [node('Heading', {}, 'child')] };
  assert.ok(has(validate(page(slot)), 'INVALID_PLACEMENT', `${root}/children/0`));
  const tabs = node('Tabs', { items: [{ id: 'a', label: 'One', children: [node('Button', { variant: 'wrong' }, 'nested')] }] });
  assert.ok(has(validate(page(tabs)), 'INVALID_VALUE', `${root}/props/items/0/children/0/props/variant`));
  const good = createPatternNode('OverviewCard');
  assert.equal(validate(page(good)).valid, true, JSON.stringify(validate(page(good))));
  const bad = createPatternNode('OverviewCard', { areas: { actions: [node('Heading')] } });
  assert.ok(has(validate(page(bad)), 'PATTERN_CONTRACT'));
  assert.ok(has(validate(page({ ...good, patternVersion: '99.0.0' })), 'PATTERN_CONTRACT'));
});

test('project links, parent references, cycles, empty pages and encoded definitions', () => {
  const document = getJsonModel('project').starter;
  document.pages[0].definition = page(node('Button', { href: '/?page=missing' }));
  assert.ok(has(validateJson({ kind: 'project', document }), 'BROKEN_REFERENCE'));
  document.pages[0].definition.page.layout.regions[0].nodes[0].props.href = '/?page=home';
  assert.equal(validateJson({ kind: 'project', document }).valid, true);
  document.pages[0].definition = JSON.stringify(document.pages[0].definition);
  assert.equal(validateJson({ kind: 'project', document }).valid, true);
  document.pages[0].parentId = 'home';
  assert.ok(has(validateJson({ kind: 'project', document }), 'PARENT_CYCLE'));
  document.pages[0].parentId = 'missing';
  assert.ok(has(validateJson({ kind: 'project', document }), 'BROKEN_REFERENCE', '/pages/0/parentId'));
  assert.equal(validateJson({ kind: 'project', document: { pages: [{ title: 'Blank' }] } }).valid, true);
  assert.ok(has(validateJson({ kind: 'project', document: { pages: [] } }), 'EMPTY_PROJECT'));
});

test('design warnings remain advisory and diagnostics have translations', () => {
  const result = validate(page(node('Section')));
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some(d => d.code === 'SECTION_WIDTH'));
  const labels = JSON.parse(fs.readFileSync(new URL('../../system/labels/json-validation.json', import.meta.url))).label.jsonValidation;
  for (const [code, message] of Object.entries(messages)) assert.equal(labels[code].$value, message);
  for (const value of Object.values(labels)) for (const locale of ['es', 'fr', 'de', 'pt', 'ja', 'zh', 'ar']) assert.ok(value.locale[locale]);
});
