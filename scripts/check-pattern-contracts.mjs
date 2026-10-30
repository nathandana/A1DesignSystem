import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import { patternManifests, createPatternNode } from '../packages/react/src/patterns/patternPolicies.js';
import { validatePatterns, formatPatternDiagnostics } from '../packages/react/src/patterns/patternValidation.js';
const rules = fs.readdirSync('system/rules').filter(name => name.endsWith('.yaml')).flatMap(name => YAML.parse(fs.readFileSync(`system/rules/${name}`, 'utf8')).rules ?? []);
const registry = fs.readFileSync('apps/a1-web/src/editor/componentRegistry.ts', 'utf8');
const types = fs.readFileSync('apps/a1-web/src/editor/pageTypes.ts', 'utf8');
const exports = fs.readFileSync('packages/react/src/index.js', 'utf8');
for (const manifest of patternManifests) {
  assert.ok(registry.includes(manifest.type) && types.includes(`"${manifest.type}"`) && exports.includes(manifest.type), `Missing registration ${manifest.type}`);
  for (const rule of manifest.rules) assert.ok(rules.some(r => r.id === rule.id), `Unknown rule ${rule.id}`);
  for (const area of manifest.areas) {
    if (area.kind === 'zone') assert.ok(manifest.rules.some(rule => rule.id === area.ruleId), `Undeclared area rule ${area.ruleId}`);
    for (const allowed of Object.values(area.policies?.groups ?? {})) for (const type of allowed) assert.ok(types.includes(`"${type}"`), `Unknown group type ${type}`);
    for (const type of area.allow ?? []) assert.ok(types.includes(`"${type}"`), `Unknown area type ${type}`);
    for (const policy of Object.values(area.policies?.variants ?? {})) assert.ok(policy.allow.includes(policy.fallback));
  }
  for (const migration of manifest.migrations) {
    assert.equal(migration.to, manifest.version, 'Migration target must be the current contract');
    for (const operation of migration.operations) assert.ok(['renameProp', 'adoptAreas'].includes(operation.op));
  }
  for (const collection of manifest.collections ?? []) {
    assert.ok(manifest.rules.some(rule => rule.id === collection.ruleId));
    for (const type of Object.values(collection.patterns ?? {})) assert.ok(patternManifests.some(pattern => pattern.type === type), `Unknown nested pattern ${type}`);
    const key = collection.path.split('/').at(-1);
    assert.equal(manifest.propsSchema.properties[key]?.type, 'array');
    assert.ok(['optional-verification', 'selection'].includes(collection.policies.activation));
    assert.ok(!manifest.starter.props[key]?.length, 'Collection starters must be empty');
  }
  const starter = createPatternNode(manifest.type);
  assert.ok(starter.children.every(area => !Object.hasOwn(area, 'children')), 'Starters must not contain demo items');
  for (const node of [starter, ...manifest.examples.map(example => createPatternNode(manifest.type, example))]) {
    const result = validatePatterns(node);
    assert.ok(result.valid, formatPatternDiagnostics(result.diagnostics));
  }
}
console.log(`${patternManifests.length} formal pattern contracts are consistent.`);
