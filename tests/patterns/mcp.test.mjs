import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../../packages/mcp-server/netlify/functions/mcp.mjs';
import { createPatternNode } from '../../packages/react/src/patterns/patternPolicies.js';
import { validatePatterns } from '../../packages/react/src/patterns/patternValidation.js';
async function call(name, args) {
  const response = await handler(new Request('http://localhost/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) }));
  const rpc = await response.json();
  assert.equal(rpc.error, undefined, JSON.stringify(rpc));
  assert.equal(rpc.result.isError, undefined, JSON.stringify(rpc));
  return JSON.parse(rpc.result.content[0].text);
}
test('MCP discovery exposes the same versioned manifest and empty starter as the editor', async () => {
  const contract = await call('get_pattern', { name: 'OverviewCard' });
  assert.equal(contract.version, '1.0.0');
  assert.deepEqual(contract.starter, createPatternNode('OverviewCard'));
  assert.ok(contract.starter.children.every(area => !area.children));
  const component = await call('get_component', { name: 'OverviewCard' });
  assert.deepEqual(component.pattern, contract);
  const list = await call('list_components', { category: 'Patterns' });
  assert.ok(list.components.every(component => component.kind === 'pattern'));
});
test('MCP and local validation return identical diagnostics without editing the input', async () => {
  const definition = createPatternNode('OverviewCard', { areas: { actions: [{ id: 'bad', type: 'Heading' }] } });
  assert.deepEqual(await call('validate_patterns', { definition }), validatePatterns(definition));
});
test('MCP migrations retain unknown future versions', async () => {
  const node = { ...createPatternNode('PageTitle'), patternVersion: '99.0.0' };
  const result = await call('migrate_pattern', { node });
  assert.equal(result.valid, false);
  assert.deepEqual(result.node, node);
});

test('MCP describes OverflowMenu structured actions and per-action verification', async () => {
  const contract = await call('get_pattern', { name: 'OverflowMenu' });
  assert.equal(contract.collections[0].path, '/props/actions');
  assert.equal(contract.collections[0].policies.activation, 'optional-verification');
  assert.ok(contract.propsSchema.properties.actions.items.properties.verification);
  assert.deepEqual(contract.starter, createPatternNode('OverflowMenu'));
  assert.equal((await call('get_component', { name: 'OverflowMenu' })).pattern.id, 'overflow-menu');
});

test('MCP exposes the reusable VerificationDialog and its nested relationship', async () => {
  const overflow = await call('get_pattern', { name: 'OverflowMenu' });
  assert.equal(overflow.collections[0].patterns.verification, 'VerificationDialog');
  const dialog = await call('get_pattern', { name: 'VerificationDialog' });
  assert.deepEqual(dialog.starter, createPatternNode('VerificationDialog'));
  assert.equal(dialog.areas[0].id, 'content');
  assert.equal((await call('get_component', { name: 'VerificationDialog' })).pattern.id, 'verification-dialog');
});
