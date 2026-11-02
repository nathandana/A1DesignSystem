import assert from 'node:assert/strict';
import test from 'node:test';
import { validateJson, contract } from '../../system/json-model/validate.js';
import { getJsonModel } from '../../system/json-model/model.js';
import { validateImportJson } from '../../apps/a1-web/src/editor/jsonValidation.js';
import { createMcpHandler } from '../../packages/mcp-server/netlify/functions/mcp.mjs';
import { createPreviewHandler } from '../../packages/mcp-server/netlify/functions/previews.mjs';
import { previewFixture } from './preview-fixture.mjs';

const node = (type, text, props = {}, id = 'content') => ({ id, type, props, ...(text == null ? {} : { content: { fallback: text } }) });
const page = (content, lang = 'en') => {
  const document = getJsonModel('page').starter;
  document.page.layout.props = { lang };
  document.page.layout.regions[0].nodes = [content];
  return document;
};
const validate = document => validateJson({ kind: 'page', document });
async function rpc(handler, name, args) {
  const response = await handler(new Request('http://localhost/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) }));
  const body = await response.json();
  assert.equal(body.error, undefined);
  return body.result.structuredContent ?? JSON.parse(body.result.content[0].text);
}

test('all capitalization, proper names and multilingual content are preserved without diagnostics', () => {
  for (const [lang, text] of [
    ['en', 'A LITTLE NEW ENGLAND. WHEREVER YOU ARE.'], ['en', 'Create Your Account'],
    ['en', 'Jerome Kern & Oscar Hammerstein II'], ['en', 'The AIDS crisis'], ['en', 'T.S. Eliot'],
    ['fr', 'CRÉER UN COMPTE'], ['tr', 'İYİ GÜNLER'], ['ja', 'アカウントを作成'],
  ]) {
    const document = page(node('Heading', text), lang);
    const before = structuredClone(document);
    const result = validate(document);
    assert.equal(result.valid, true, text);
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.warnings, []);
    assert.deepEqual(document, before);
  }
});

test('nested content, structured labels and project metadata have no casing gate', () => {
  const tabs = node('Tabs', null, { items: [{ id: 'tab', label: 'ACCOUNT', children: [node('Heading', 'YOUR ACCOUNT', {}, 'heading')] }] });
  assert.equal(validate(page(tabs)).valid, true);
  assert.equal(validate(page(node('DefinitionList', null, { items: [{ label: 'STATUS', value: 'READY' }] }))).valid, true);
  const project = getJsonModel('project').starter;
  project.name = project.pages[0].title = 'CREATE ACCOUNT';
  project.pages[0].definition = JSON.stringify(page(tabs));
  assert.equal(validateJson({ kind: 'project', document: project }).valid, true);
});

test('casing transforms are allowed without executing custom code', () => {
  for (const transform of ['uppercase', 'capitalize', 'lowercase']) {
    const result = validate(page(node('Paragraph', 'Welcome', { style: { textTransform: transform } })));
    assert.equal(result.valid, true);
    assert.ok(result.warnings.every(d => d.code === 'INLINE_STYLE'));
  }
  for (const css of ['.hero { text-transform: uppercase !important }', String.raw`.hero { text-\74 ransform: \75 ppercase; }`]) {
    const result = validate(page(node('CustomBlock', null, { markup: '<h1>WELCOME</h1>', css, js: 'throw new Error("must not execute")' })));
    assert.equal(result.valid, true);
    assert.deepEqual(result.warnings, []);
    assert.ok(result.coverage.deferred.some(d => d.reason === 'rendered-css'));
  }
});

test('coverage and discovery omit removed rules while preserving review boundaries', async () => {
  const result = validate(page(node('Paragraph', '{{ item.title }}', { style: { textTransform: 'var(--case)' } })));
  assert.equal(result.coverage.schema.status, 'checked');
  assert.equal(result.coverage.completeCompliance, false);
  assert.deepEqual(result.coverage.automatedRules, []);
  assert.ok(result.coverage.rulesRequiringReview.some(r => r.ruleId === 'system-tokens-only'));
  assert.ok(result.coverage.deferred.some(d => d.reason === 'runtime-binding'));
  assert.ok(result.coverage.deferred.some(d => d.reason === 'rendered-style'));
  assert.equal(validate('{').coverage.schema.status, 'not-checked');
  const model = await rpc(createMcpHandler(), 'get_json_model', {});
  assert.equal(model.mandatoryRules.length, contract.ruleCatalog.length);
  for (const id of ['system-no-uppercase-content', 'system-heading-sentence-case']) {
    assert.equal(model.mandatoryRules.some(r => r.ruleId === id), false);
    assert.equal(result.coverage.rulesRequiringReview.some(r => r.ruleId === id), false);
  }
  assert.match(model.workflow.join(' '), /preview URL as the primary handoff/);
});

test('MCP, HTTP previews and imports accept capitalization but still reject invalid structure', async () => {
  const { service } = previewFixture();
  const handler = createMcpHandler({ createPreview: input => service.create(input) });
  const http = createPreviewHandler(service);
  const document = page(node('Heading', 'Oscar Hammerstein II, AIDS and T.S. Eliot'));
  const before = structuredClone(document);
  const args = { kind: 'page', document };
  const validation = await rpc(handler, 'validate_json', args);
  assert.deepEqual(validation, validateImportJson(document));
  assert.equal(validation.valid, true);
  const preview = await rpc(handler, 'create_preview', args);
  assert.equal(preview.valid, true);
  assert.match(preview.previewUrl, /\/preview\//);
  const response = await http(new Request('http://localhost/previews', { method: 'POST', body: JSON.stringify(args) }));
  assert.equal(response.status, 201);
  assert.deepEqual(document, before);
  document.page.layout.regions[0].nodes[0].props.size = 'unsupported';
  const invalid = await rpc(handler, 'validate_json', args);
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors[0].code, 'INVALID_VALUE');
  assert.deepEqual(invalid, validateImportJson(document));
  const blocked = await http(new Request('http://localhost/previews', { method: 'POST', body: JSON.stringify(args) }));
  assert.equal(blocked.status, 422);
});
