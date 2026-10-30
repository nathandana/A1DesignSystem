import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalizePatternTree, createPatternNode, normalizePatternItems } from '../../packages/react/src/patterns/patternPolicies.js';
import { validatePatterns, validatePatternEdit } from '../../packages/react/src/patterns/patternValidation.js';
import { migratePatternNode } from '../../packages/react/src/patterns/patternMigrations.js';
const button = (id, variant = 'primary') => ({ id, type: 'Button', props: { variant }, content: { fallback: id } });
const actionArea = node => node.children.find(child => child.props.area === 'actions');

test('starters are empty and self-describe versioned areas', () => {
  for (const type of ['PageTitle', 'OverviewCard']) {
    const node = createPatternNode(type);
    assert.equal(node.patternVersion, '1.0.0');
    assert.ok(node.children.every(area => !('children' in area)));
    assert.equal(validatePatterns(node).valid, true);
  }
});

test('one action policy handles nested groups, preserves behavior, and is idempotent', () => {
  const data = [button('publish'), { id: 'group', type: 'ButtonContainer', children: [button('delete'), button('archive', 'tertiary')] }, button('preview', 'secondary')];
  data[0].actions = { onClick: { type: 'appAction', target: 'publish' } };
  const before = structuredClone(data);
  const normalized = normalizePatternItems('PageTitle', 'actions', data);
  assert.deepEqual(normalized.map(n => n.id), ['group', 'preview', 'publish']);
  assert.equal(normalized[0].children[0].props.variant, 'secondary');
  assert.deepEqual(normalized[2].actions, data[0].actions);
  assert.deepEqual(normalizePatternItems('PageTitle', 'actions', normalized), normalized);
  assert.deepEqual(data, before);
});

test('card policies normalize variants and sizes without discarding items', () => {
  const items = [button('a'), button('b', 'destructive'), { id: 'more', type: 'IconButton', props: { icon: 'more_horiz', label: 'More', variant: 'success', size: 'lg' } }];
  const normalized = normalizePatternItems('OverviewCard', 'actions', items);
  assert.deepEqual(normalized.map(n => n.props.variant), ['secondary', 'secondary', 'tertiary']);
  assert.ok(normalized.every(n => n.props.size === 'sm'));
  const node = createPatternNode('OverviewCard', { areas: { actions: items } });
  const result = validatePatterns(node);
  assert.equal(result.valid, false);
  assert.ok(result.diagnostics.some(d => d.ruleId === 'overview-card-no-primary-action' && d.path.includes('/children')));
  assert.equal(actionArea(node).children.length, 3);
});

test('imported rule and lock overrides cannot weaken a formal zone', () => {
  const node = createPatternNode('OverviewCard');
  const slot = actionArea(node);
  slot.props = { ...slot.props, zone: false, allow: ['Heading'], max: 999 };
  slot.lock = { node: false, props: [] };
  const original = structuredClone(node);
  const canonical = canonicalizePatternTree(node);
  assert.equal(actionArea(canonical).props.max, 2);
  assert.deepEqual(actionArea(canonical).props.allow, ['Button', 'Link', 'IconButton']);
  assert.equal(actionArea(canonical).lock.node, true);
  assert.ok(validatePatterns(node).diagnostics.some(d => d.ruleId === 'pattern.area-rules'));
  assert.deepEqual(node, original);
});

test('validate edits catches duplicating/moving/pasting extra items and removing zones', () => {
  const previous = createPatternNode('OverviewCard', { areas: { actions: [button('a'), button('b')] } });
  const duplicate = structuredClone(previous);
  actionArea(duplicate).children.push(button('copy'));
  assert.equal(validatePatternEdit(previous, duplicate).valid, false);
  const removed = structuredClone(previous);
  removed.children = removed.children.filter(child => child.props.area !== 'actions');
  assert.ok(validatePatternEdit(previous, removed).diagnostics.some(d => d.ruleId === 'pattern.area-locked'));
  assert.equal(validatePatternEdit({ nodes: [previous] }, { nodes: [] }).valid, true);
});

test('diagnostics identify duplicate/unknown areas, action names and unsafe navigation', () => {
  const node = createPatternNode('OverviewCard', { areas: { actions: [{ id: 'bad', type: 'IconButton', props: { icon: 'more_horiz', href: 'javascript:alert(1)' } }] } });
  node.children.push({ ...node.children[0], id: 'duplicate' }, { id: 'future', type: 'Slot', props: { area: 'future' } });
  const rules = validatePatterns(node).diagnostics.map(d => d.ruleId);
  for (const id of ['pattern.area-duplicate', 'pattern.area-unknown', 'pattern.action-name', 'pattern.action-target']) assert.ok(rules.includes(id));
});

test('future-version content remains unchanged and has an actionable error', () => {
  const node = { ...createPatternNode('OverviewCard'), patternVersion: '2.0.0', futurePayload: { keep: true } };
  assert.strictEqual(canonicalizePatternTree(node), node);
  assert.ok(validatePatterns(node).diagnostics.some(d => d.ruleId === 'pattern.version'));
  assert.strictEqual(migratePatternNode(node).node, node);
});

test('explicit legacy migration preserves content and refuses ambiguous renames', () => {
  const source = { id: 'legacy', type: 'OverviewCard', props: { title: 'Account', facts: [{ label: 'Plan', value: 'Enterprise' }], actions: [{ label: 'Manage', href: '/manage' }] }, children: [{ id: 'intro', type: 'Paragraph', content: { fallback: 'Original content', textKey: 'intro' } }] };
  const before = structuredClone(source);
  assert.ok(validatePatterns(source).diagnostics.some(d => d.ruleId === 'pattern.migration-required'));
  const result = migratePatternNode(source);
  assert.equal(result.valid, true);
  assert.deepEqual(result.node.props.details, source.props.facts);
  assert.deepEqual(result.node.children[0].children, source.children);
  assert.equal(actionArea(result.node).children[0].props.href, '/manage');
  assert.deepEqual(source, before);
  const ambiguous = { ...source, props: { ...source.props, details: [] } };
  assert.strictEqual(migratePatternNode(ambiguous).node, ambiguous);
});

test('dataset records are not mistaken for pattern nodes; tab children are validated', () => {
  const source = { page: { layout: { type: 'PageLayout', regions: [{ nodes: [{ id: 'tabs', type: 'Tabs', props: { items: [{ id: 'panel', label: 'Panel', children: [{ ...createPatternNode('OverviewCard'), patternVersion: '99.0.0' }] }] } }] }] } }, datasets: [{ type: 'OverviewCard', record: true }] };
  const result = validatePatterns(source);
  assert.equal(result.diagnostics.length, 1);
  assert.ok(result.diagnostics[0].path.includes('/props/items/0/children/0'));
  assert.deepEqual(canonicalizePatternTree(source).datasets, source.datasets);
});

test('starter instances cannot mutate each other or the manifest defaults', () => {
  const first = createPatternNode('OverviewCard');
  first.props.details[0].value = 'Changed';
  assert.equal(createPatternNode('OverviewCard').props.details[0].value, 'Active');
});

test('malformed area/group collections return diagnostics instead of throwing', () => {
  const group = { id: 'group', type: 'ButtonContainer', children: { wrong: true } };
  const node = createPatternNode('PageTitle', { areas: { actions: [group] } });
  assert.equal(validatePatterns(node).valid, false);
  node.children.find(area => area.props.area === 'content').children = 'wrong';
  assert.equal(validatePatterns(node).valid, false);
  const legacy = { id: 'legacy', type: 'OverviewCard', props: { title: 'Legacy' }, children: {} };
  assert.strictEqual(migratePatternNode(legacy).node, legacy);
  assert.equal(validatePatternEdit({ ...legacy, children: [null] }, createPatternNode('OverviewCard', { id: 'legacy' })).valid, true);
});

test('migration keeps authored action IDs and rejects malformed data without loss', () => {
  const source = { id: 'legacy', type: 'OverviewCard', props: { title: 'Legacy', actions: [{ id: 'existing-action', label: 'Manage' }] } };
  assert.equal(actionArea(migratePatternNode(source).node).children[0].id, 'existing-action');
  source.props.actions = [null];
  assert.strictEqual(migratePatternNode(source).node, source);
});
