import assert from 'node:assert/strict';
import test from 'node:test';
import { validateJson, formatJsonDiagnostics, contract } from '../../system/json-model/validate.js';
import { getJsonModel } from '../../system/json-model/model.js';
import { validateImportJson } from '../../apps/a1-web/src/editor/jsonValidation.js';
import { createMcpHandler } from '../../packages/mcp-server/netlify/functions/mcp.mjs';
import { createPreviewHandler } from '../../packages/mcp-server/netlify/functions/previews.mjs';
import { createPatternNode } from '../../packages/react/src/patterns/patternPolicies.js';
import { previewFixture } from './preview-fixture.mjs';

const root = '/page/layout/regions/0/nodes/0';
const capsRule = 'system-no-uppercase-content';
const node = (type, text, props = {}, id = 'content') => ({ id, type, props, ...(text == null ? {} : { content: { fallback: text } }) });
const page = (content, lang = 'en') => {
  const document = getJsonModel('page').starter;
  document.page.layout.props = { lang };
  document.page.layout.regions[0].nodes = [content];
  return document;
};
const validate = document => validateJson({ kind: 'page', document });
const violations = result => result.errors.filter(d => d.code === 'RULE_VIOLATION');
async function rpc(handler, method, params = {}) {
  const response = await handler(new Request('http://localhost/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }));
  const body = await response.json();
  assert.equal(body.error, undefined);
  return body.result;
}

test('all-caps diagnostics identify source and offer a nonmutating repair preserving approved names', () => {
  const document = page(node('Heading', 'A LITTLE NEW ENGLAND. WHEREVER YOU ARE.'));
  const before = structuredClone(document);
  const [error] = violations(validate(document));
  assert.equal(error.path, `${root}/content/fallback`);
  assert.equal(error.ruleId, capsRule);
  assert.equal(error.severity, 'error');
  assert.equal(error.offendingText, 'A LITTLE NEW ENGLAND. WHEREVER YOU ARE.');
  assert.equal(error.suggestedValue, 'A little New England. Wherever you are.');
  assert.deepEqual(document, before);
  document.page.layout.regions[0].nodes[0].content.fallback = error.suggestedValue;
  assert.equal(validate(document).valid, true);
  const mixed = violations(validate(page(node('Paragraph', 'Welcome to New England. SAVE NOW'))))[0];
  assert.equal(mixed.suggestedValue, 'Welcome to New England. Save now');
});

test('nested slots, structured labels, inline links and encoded project definitions retain exact paths', () => {
  const nested = node('Slot', null, { allow: ['Button'] });
  nested.children = [node('Button', 'SAVE', {}, 'action')];
  assert.equal(violations(validate(page(nested)))[0].path, `${root}/children/0/content/fallback`);
  const tabs = node('Tabs', null, { items: [{ id: 'tab', label: 'ACCOUNT', children: [node('Heading', 'YOUR ACCOUNT', {}, 'heading')] }] });
  const paths = violations(validate(page(tabs))).map(d => d.path);
  assert.ok(paths.includes(`${root}/props/items/0/label`));
  assert.ok(paths.includes(`${root}/props/items/0/children/0/content/fallback`));
  const list = page(node('DefinitionList', null, { items: [{ label: 'STATUS', value: 'READY' }] }));
  assert.equal(violations(validate(list)).length, 2);
  const inline = node('Paragraph', 'Visit our site');
  inline.content.inlineLinks = [{ start: 0, end: 5, props: { href: 'https://example.com', style: { textTransform: 'uppercase' } } }];
  assert.equal(violations(validate(page(inline)))[0].path, `${root}/content/inlineLinks/0/props/style/textTransform`);
  const pattern = createPatternNode('OverviewCard');
  pattern.props.title = 'ACCOUNT SUMMARY';
  assert.ok(violations(validate(page(pattern))).some(d => d.path === `${root}/props/title`));
  const menu = createPatternNode('OverflowMenu', { props: { actions: [{ id: 'edit', label: 'Edit', verification: createPatternNode('VerificationDialog', { id: 'verify', props: { title: 'CONFIRM CHANGE', message: 'Review the change.', confirmLabel: 'CONTINUE' } }) }] } });
  const menuPaths = violations(validate(page(menu))).map(d => d.path);
  assert.ok(menuPaths.includes(`${root}/props/actions/0/verification/props/title`));
  assert.ok(menuPaths.includes(`${root}/props/actions/0/verification/props/confirmLabel`));
  assert.equal(violations(validate(page(node('TopHeader', null, { logoText: 'WELCOME' }))))[0].path, `${root}/props/logoText`);
  const project = getJsonModel('project').starter;
  project.pages[0].definition = JSON.stringify(page(nested));
  const result = validateJson({ kind: 'project', document: project });
  assert.ok(violations(result).some(d => d.path === `/pages/0/definition${root}/children/0/content/fallback`));
});

test('literal casing styles are blocked including escaped CSS, without executing custom code', () => {
  for (const transform of ['uppercase', 'capitalize', 'lowercase']) {
    const result = validate(page(node('Paragraph', 'Welcome', { style: { textTransform: transform } })));
    assert.equal(violations(result)[0].suggestedValue, 'none');
  }
  for (const css of ['.hero { text-transform: uppercase !important }', '.hero { TEXT-TRANSFORM: LOWERCASE }', String.raw`.hero { text-\74 ransform: \75 ppercase; }`]) {
    const result = validate(page(node('CustomBlock', null, { markup: '<h1>Welcome</h1>', css, js: 'throw new Error("must not execute")' })));
    assert.equal(violations(result)[0].path, `${root}/props/css`);
    assert.equal(violations(result)[0].offendingText, css);
    assert.match(violations(result)[0].recovery, /Remove/);
  }
  const harmless = validate(page(node('CustomBlock', null, { markup: '<p>Welcome</p>', css: '/* text-transform: uppercase */ .hero { content: "text-transform: uppercase"; text-transform: none }' })));
  assert.equal(violations(harmless).length, 0);
  assert.ok(harmless.coverage.deferred.some(d => d.reason === 'opaque-custom-content'));
  const dynamic = validate(page(node('Paragraph', '{{ item.title }}', { style: { textTransform: 'var(--case)' } })));
  assert.ok(dynamic.coverage.deferred.some(d => d.reason === 'runtime-binding'));
  assert.ok(dynamic.coverage.deferred.some(d => d.reason === 'dynamic-style'));
});

test('exceptions are exact and visible; locales and language inheritance avoid English-only assumptions', () => {
  for (const text of ['Canadian GP starts at 3:00 PM ET.', 'A-Z', 'USD', 'S', 'XL', 'SCE', 'API', 'A1:Design', 'New England', 'JSON and CSS']) assert.equal(validate(page(node('Heading', text))).valid, true, text);
  for (const text of ['SAVE', 'GO', 'BUY', 'SCEE']) assert.equal(validate(page(node('Heading', text))).valid, false, text);
  for (const [lang, text, suggestion] of [['fr', 'CRÉER UN COMPTE', 'Créer un compte'], ['es', 'CREAR CUENTA', 'Crear cuenta'], ['de', 'WILLKOMMEN', 'Willkommen'], ['tr', 'İYİ GÜNLER', 'İyi günler']]) {
    const result = validate(page(node('Heading', text), lang));
    assert.equal(violations(result)[0].suggestedValue, suggestion);
    assert.ok(result.coverage.deferred.some(d => d.reason === 'locale-heading-review'));
  }
  for (const [lang, text] of [['ja', 'アカウントを作成'], ['zh', '创建账户'], ['ar', 'إنشاء حساب']]) assert.equal(validate(page(node('Heading', text), lang)).valid, true);
  const subtree = node('Stack', null, { lang: 'tr' });
  subtree.children = [node('Heading', 'İYİ GÜNLER', {}, 'heading')];
  assert.equal(violations(validate(page(subtree)))[0].suggestedValue, 'İyi günler');
  const navigation = createPatternNode('NavigationTree', { props: { items: [], sortLabel: 'A-Z', 'aria-label': 'Project navigation' } });
  assert.equal(validate(page(navigation)).valid, true);
  const title = validate(page(node('Heading', 'Create Your Account')));
  assert.equal(title.valid, true);
  assert.ok(title.warnings.some(d => d.ruleId === 'system-heading-sentence-case' && d.suggestedValue === 'Create your account'));
  assert.equal(validate(page(node('Heading', 'New England'))).warnings.length, 0);
  const project = getJsonModel('project').starter;
  project.name = project.pages[0].title = 'CRÉER UN COMPTE';
  project.pages[0].definition = JSON.stringify(page(node('Heading', 'Bienvenue'), 'fr'));
  const projectResult = validateJson({ kind: 'project', document: project });
  for (const path of ['/name', '/pages/0/title']) assert.equal(violations(projectResult).find(d => d.path === path).suggestedValue, 'Créer un compte');
});

test('coverage distinguishes schema, automated rules, dynamic content and human/rendering review', () => {
  const result = validate(page(node('Code', 'const HTTP_METHOD = "GET";')));
  assert.equal(result.valid, true);
  assert.equal(result.coverage.schema.status, 'checked');
  assert.equal(result.coverage.completeCompliance, false);
  assert.ok(result.coverage.automatedRules.some(r => r.ruleId === capsRule && r.status === 'checked'));
  assert.ok(result.coverage.rulesRequiringReview.some(r => r.ruleId === 'system-tokens-only'));
  assert.ok(result.coverage.requiresRendering.includes('keyboard-and-focus'));
  assert.ok(result.coverage.requiresHumanReview.includes('proper-names-and-approved-content'));
  assert.ok(result.coverage.deferred.some(d => d.reason === 'code-or-icon-content'));
  assert.equal(validate('{').coverage.schema.status, 'not-checked');
  const literal = validate(page(node('Button', 'Visit', { href: 'https://example.com/SAVE/NOW', 'data-key': 'SAVE' }, 'UPPERCASE_ID')));
  assert.equal(literal.valid, true);
});

test('MCP discovery mandates rules and JSON → validate → A1 preview, with React setup as an explicit alternative', async () => {
  const handler = createMcpHandler();
  const init = await rpc(handler, 'initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
  assert.match(init.instructions, /Prioritize A1 JSON/);
  assert.match(init.instructions, /read and follow its mandatory rules/);
  assert.match(init.instructions, /create_preview/);
  const modelResult = await rpc(handler, 'tools/call', { name: 'get_json_model', arguments: {} });
  const model = modelResult.structuredContent ?? JSON.parse(modelResult.content[0].text);
  assert.equal(model.format, 'project');
  assert.equal(model.mandatoryRules.length, contract.ruleCatalog.length);
  assert.ok(model.mandatoryRules.find(r => r.ruleId === capsRule).exceptions.tokens.includes('SCE'));
  assert.ok(model.mandatoryRules.some(r => r.ruleId === 'system-tokens-only'));
  const listedResult = await rpc(handler, 'tools/call', { name: 'list_rules', arguments: { component: 'System' } });
  const listed = listedResult.structuredContent ?? JSON.parse(listedResult.content[0].text);
  assert.deepEqual(listed.rules.find(r => r.id === capsRule).exceptions, model.mandatoryRules.find(r => r.ruleId === capsRule).exceptions);
  assert.equal(model.mandatoryRules.find(r => r.ruleId === capsRule).enforcement.exceptions, undefined);
  assert.match(model.workflow.join(' '), /preview URL as the primary handoff/);
  assert.match(model.guidance.react, /specifically asks/);
  const editableCopy = getJsonModel();
  editableCopy.mandatoryRules.find(r => r.ruleId === capsRule).exceptions.tokens.push('SHOUT');
  assert.equal(validate(page(node('Heading', 'SHOUT'))).valid, false);
});

test('MCP, HTTP previews and import share the same gate and preserve invalid drafts for repair', async () => {
  const { service, records } = previewFixture();
  const handler = createMcpHandler({ createPreview: input => service.create(input) });
  const http = createPreviewHandler(service);
  const document = page(node('Heading', 'CREATE ACCOUNT'));
  const before = structuredClone(document);
  const args = { kind: 'page', document };
  const validation = (await rpc(handler, 'tools/call', { name: 'validate_json', arguments: args })).structuredContent;
  assert.deepEqual(validation, validateImportJson(document));
  const preview = (await rpc(handler, 'tools/call', { name: 'create_preview', arguments: args })).structuredContent;
  assert.deepEqual(preview, validation);
  assert.equal(preview.previewUrl, undefined);
  const response = await http(new Request('http://localhost/previews', { method: 'POST', body: JSON.stringify(args) }));
  assert.equal(response.status, 422);
  assert.deepEqual(await response.json(), validation);
  assert.equal(records.size, 0);
  assert.deepEqual(document, before);
  document.page.layout.regions[0].nodes[0].content.fallback = validation.errors[0].suggestedValue;
  const repaired = await service.create(args);
  assert.equal(repaired.valid, true);
  assert.match(repaired.previewUrl, /\/preview\//);
  assert.equal(records.size, 1);
});

test('UI formatting localizes rule messages and keeps exact paths and authored values', () => {
  const result = validate(page(node('Heading', 'CREATE ACCOUNT')));
  const formatted = formatJsonDiagnostics(result.errors, (key, fallback) => key.endsWith('.CONTENT_UPPERCASE') ? 'Utilisez la casse de phrase.' : fallback);
  assert.match(formatted, /Utilisez la casse de phrase/);
  assert.match(formatted, /system-no-uppercase-content/);
  assert.ok(formatted.includes(`${root}/content/fallback`));
  assert.match(formatted, /"CREATE ACCOUNT"/);
  assert.match(formatted, /"Create account"/);
});
