import test from 'node:test';
import assert from 'node:assert/strict';
import { createPatternNode, getPatternManifest } from '../../packages/react/src/patterns/patternPolicies.js';
import { validatePatterns } from '../../packages/react/src/patterns/patternValidation.js';

const manifest = getPatternManifest('OverflowMenu');
test('OverflowMenu starts empty and exposes a governed action collection', () => {
  const starter = createPatternNode('OverflowMenu');
  assert.equal(starter.props.actions, undefined);
  assert.deepEqual(starter.children, []);
  assert.equal(manifest.collections[0].policies.activation, 'optional-verification');
  assert.equal(validatePatterns(starter).valid, true);
});
test('verification is valid on any action, independently of destructive styling', () => {
  for (const example of manifest.examples) assert.equal(validatePatterns(createPatternNode('OverflowMenu', example)).valid, true);
  const node = createPatternNode('OverflowMenu', structuredClone(manifest.examples[0]));
  node.props.actions[0].verification = createPatternNode('VerificationDialog', { id: 'verify-edit', props: { title: 'Edit item?', message: 'Open the edit form.' } });
  assert.equal(validatePatterns(node).valid, true);
  node.props.actions[0].verification.props.message = '';
  assert.equal(validatePatterns(node).valid, false);
});
test('duplicate IDs, unnamed actions, executable URLs and invalid verification are rejected without mutation', () => {
  for (const patch of [{ id: 'delete' }, { label: ' ' }, { href: 'javascript:alert(1)' }, { verification: true }, { verification: { title: 'Delete?' } }]) {
    const node = createPatternNode('OverflowMenu', { props: structuredClone(manifest.examples[0].props) });
    Object.assign(node.props.actions[0], patch);
    const original = structuredClone(node);
    assert.equal(validatePatterns(node).valid, false);
    assert.deepEqual(node, original);
  }
});

test('nested VerificationDialog contracts are validated without losing their authored content', () => {
  const node = createPatternNode('OverflowMenu', { props: structuredClone(manifest.examples[0].props) });
  const verification = node.props.actions[2].verification;
  assert.equal(verification.type, 'VerificationDialog');
  assert.ok(!verification.children[0].children);
  verification.patternVersion = '99.0.0';
  const result = validatePatterns(node);
  assert.equal(result.valid, false);
  assert.ok(result.diagnostics.some(d => d.path === '/props/actions/2/verification/patternVersion'));
  verification.patternVersion = '1.0.0';
  verification.props.message = '';
  assert.equal(validatePatterns(node).valid, false);
});
