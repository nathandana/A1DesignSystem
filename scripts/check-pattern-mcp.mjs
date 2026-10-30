#!/usr/bin/env node
// Post-deploy parity check; also accepts a Netlify preview MCP URL.
import assert from 'node:assert/strict';
import { patternManifests, createPatternNode } from '../packages/react/src/patterns/patternPolicies.js';
import { validatePatterns } from '../packages/react/src/patterns/patternValidation.js';
const endpoint = process.argv[2] ?? process.env.MCP_VERIFY_URL;
if (!endpoint) throw new Error('Pass the deployed MCP URL: npm run patterns:verify-mcp -- https://mcp.a1design.app/mcp');
let id = 0;
async function call(name, args) {
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method: 'tools/call', params: { name, arguments: args } }),
    signal: AbortSignal.timeout(30_000),
  });
  assert.ok(response.ok, `HTTP ${response.status}`);
  const rpc = await response.json();
  assert.ok(!rpc.error && !rpc.result?.isError, JSON.stringify(rpc));
  return JSON.parse(rpc.result.content[0].text);
}
for (const manifest of patternManifests) {
  const remote = await call('get_pattern', { name: manifest.type });
  for (const key of ['version', 'schemaVersion', 'propsSchema', 'areas', 'collections', 'lockedProps', 'migrations']) assert.deepEqual(remote[key], manifest[key], `${manifest.type}.${key} drift`);
  assert.deepEqual(remote.starter, createPatternNode(manifest.type));
  assert.equal((await call('get_component', { name: manifest.type })).pattern.version, manifest.version);
  const invalid = { ...remote.starter, patternVersion: 'unsupported-version' };
  assert.deepEqual(await call('validate_patterns', { definition: invalid }), validatePatterns(invalid));
}
console.log(`Verified ${patternManifests.length} deployed pattern contracts at ${endpoint}`);
