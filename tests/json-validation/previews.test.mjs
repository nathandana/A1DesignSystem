import assert from 'node:assert/strict';
import test from 'node:test';
import { getJsonModel } from '../../system/json-model/model.js';
import { PREVIEW_TTL_MS, createPreviewService } from '../../packages/mcp-server/lib/previews.mjs';
import { createPreviewHandler } from '../../packages/mcp-server/netlify/functions/previews.mjs';
import { createMcpHandler } from '../../packages/mcp-server/netlify/functions/mcp.mjs';
import { previewFixture } from './preview-fixture.mjs';
import { schedulePreviewExpiry } from '../../apps/a1-web/src/preview/previewExpiry.js';

const invoke = async (handler, name, args) => {
  const response = await handler(new Request('https://mcp.a1design.app/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: name === 'list' ? 'tools/list' : 'tools/call', params: { name, arguments: args } }) }));
  return response.json();
};

test('MCP creates page/project previews only after validation; HTTP retrieves exact immutable snapshots', async () => {
  const { service, records } = previewFixture({ appUrl: () => 'https://preview.example' });
  const mcp = createMcpHandler({ createPreview: input => service.create(input) });
  const http = createPreviewHandler(service);
  const tool = (await invoke(mcp, 'list')).result.tools.find(t => t.name === 'create_preview');
  assert.equal(tool.annotations.readOnlyHint, false);
  assert.ok(tool.outputSchema.properties.previewUrl);
  for (const kind of ['page', 'project']) {
    const document = getJsonModel(kind).starter;
    const before = structuredClone(document);
    const created = (await invoke(mcp, 'create_preview', { kind, document })).result;
    assert.deepEqual(JSON.parse(created.content[0].text), created.structuredContent);
    const { previewId, previewUrl, expiresAt } = created.structuredContent;
    assert.equal(previewUrl, `https://preview.example/preview/${previewId}`);
    assert.ok(Date.parse(expiresAt) > Date.now());
    const response = await http(new Request(`https://mcp.a1design.app/previews/${previewId}`));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual((await response.json()).document, document);
    assert.deepEqual(document, before);
  }
  assert.equal(records.size, 2);
  const invalid = (await invoke(mcp, 'create_preview', { kind: 'page', document: '{' })).result.structuredContent;
  assert.equal(invalid.valid, false);
  assert.equal(invalid.previewUrl, undefined);
  assert.equal(records.size, 2);
  assert.equal((await invoke(mcp, 'create_preview', { kind: 'page', document: getJsonModel('page').starter, contractVersion: '99' })).result.structuredContent.valid, false);
  assert.equal(records.size, 2);
});

test('HTTP creation, missing/expired previews, automatic cleanup and storage errors are explicit', async () => {
  let time = Date.now();
  const { service, records } = previewFixture({ now: () => time });
  const http = createPreviewHandler(service);
  const post = body => http(new Request('https://mcp.a1design.app/previews', { method: 'POST', body }));
  assert.equal((await post('{')).status, 400);
  assert.equal((await post('null')).status, 422);
  assert.equal((await post('x'.repeat(3_000_001))).status, 413);
  const created = await post(JSON.stringify({ kind: 'page', document: JSON.stringify(getJsonModel('page').starter) }));
  assert.equal(created.status, 201);
  const { previewId, expiresAt } = await created.json();
  const day = 24 * 60 * 60 * 1000;
  assert.equal(Date.parse(expiresAt), time + 30 * day);
  assert.equal((await http(new Request('https://mcp.a1design.app/previews/missing'))).status, 404);
  assert.equal((await http(new Request(`https://mcp.a1design.app/previews/${time + PREVIEW_TTL_MS}-${'a'.repeat(48)}`))).status, 404);
  time += 29 * day;
  assert.equal((await http(new Request(`https://mcp.a1design.app/previews/${previewId}`))).status, 200);
  assert.deepEqual(await service.cleanup(), { deleted: 0 });
  time += day;
  assert.equal((await http(new Request(`https://mcp.a1design.app/previews/${previewId}`))).status, 410);
  assert.equal(records.size, 1);
  assert.deepEqual(await service.cleanup(), { deleted: 1 });
  assert.equal(records.size, 0);
  const broken = createPreviewService({ getStore() { throw new Error('private storage credentials'); } });
  const failed = await createPreviewHandler(broken)(new Request('https://mcp.a1design.app/previews', { method: 'POST', body: JSON.stringify({ kind: 'page', document: getJsonModel('page').starter }) }));
  assert.equal(failed.status, 503);
  assert.deepEqual(await failed.json(), { error: 'PREVIEW_UNAVAILABLE' });
  const mcp = await invoke(createMcpHandler({ createPreview: input => broken.create(input) }), 'create_preview', { kind: 'page', document: getJsonModel('page').starter });
  assert.equal(mcp.result.isError, true);
  assert.doesNotMatch(JSON.stringify(mcp), /credentials/);
});

test('browser expiry spans the timer limit and can be cancelled between waits', t => {
  const start = Date.parse('2026-11-01T00:00:00Z');
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: start });
  const lifetime = 30 * 24 * 60 * 60 * 1000;
  let expired = 0;
  schedulePreviewExpiry(new Date(start + lifetime).toISOString(), () => expired++);
  t.mock.timers.tick(1);
  assert.equal(expired, 0);
  t.mock.timers.tick(2 ** 31 - 2);
  assert.equal(expired, 0);
  t.mock.timers.tick(lifetime - (2 ** 31 - 1) - 1);
  assert.equal(expired, 0);
  t.mock.timers.tick(1);
  assert.equal(expired, 1);

  const cancel = schedulePreviewExpiry(new Date(Date.now() + lifetime).toISOString(), () => expired++);
  t.mock.timers.tick(2 ** 31 - 1);
  cancel();
  t.mock.timers.tick(lifetime);
  assert.equal(expired, 1);
});

test('project import remaps page identities and links without changing authored content', async () => {
  const { remapImportedDefinition } = await import('../../apps/a1-web/src/projects/projectImportLinks.js');
  const document = getJsonModel('page').starter;
  document.page.layout.regions[0].nodes = [{ id: 'link', type: 'Button', props: { href: '/?page=details&item=one#section' }, content: { fallback: '/?page=details' }, actions: { onClick: { type: 'navigate', target: '?page=details' } } }];
  const input = JSON.stringify(document);
  const result = JSON.parse(remapImportedDefinition(input, 'new-home', new Map([['details', 'new-details']])));
  assert.equal(result.page.id, 'new-home');
  const node = result.page.layout.regions[0].nodes[0];
  assert.equal(node.props.href, '/?page=new-details&item=one#section');
  assert.equal(node.actions.onClick.target, '?page=new-details');
  assert.equal(node.content.fallback, '/?page=details');
  assert.equal(JSON.stringify(document), input);
});
