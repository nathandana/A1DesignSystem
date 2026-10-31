import assert from 'node:assert/strict';
import test from 'node:test';
import { alphabetizeNavigationItems, filterNavigationItems, navigationAncestors, navigationSearchBranchIds } from '../../packages/react/src/patterns/navigation-tree/navigationTreeModel.js';
import { createPatternNode } from '../../packages/react/src/patterns/patternPolicies.js';
import { validatePatterns } from '../../packages/react/src/patterns/patternValidation.js';

const items = [
  { id: 'root', label: 'Overview', pinned: true },
  { id: 'group', label: 'Account', category: true, children: [
    { id: 'z', label: 'Zulu', keywords: ['profile'], children: [{ id: 'example', label: 'Example', excludeFromAz: true }] },
    { id: 'nested', label: 'Billing', category: true, children: [
      { id: 'a', label: 'Alpha', href: '/alpha' },
    ] },
  ] },
];
test('A–Z flattens arbitrary nesting, omits categories and examples, pins overview without mutation', () => {
  const before = JSON.stringify(items);
  assert.deepEqual(alphabetizeNavigationItems(items).map(x => x.id), ['root', 'a', 'z']);
  assert.equal(JSON.stringify(items), before);
});
test('search retains ancestors, matches keywords, preserves matching item descendants and removes empty categories', () => {
  const filtered = filterNavigationItems(items, ' PROFILE ');
  assert.deepEqual(filtered[1].children.map(x => x.id), ['z']);
  assert.equal(filtered[1].children[0].children[0].id, 'example');
  assert.deepEqual(navigationSearchBranchIds(filtered, 'profile'), ['group']);
  assert.deepEqual(filterNavigationItems(items, 'missing').map(x => x.id), ['root']);
  assert.deepEqual(navigationAncestors(items, 'a'), ['group', 'nested']);
  assert.deepEqual(navigationAncestors(items, 'group'), ['group']);
});
test('catalog ranking and alphabetical filtering are independent', () => {
  const ranked = filterNavigationItems(items, 'anything', item => ({ z: 2, a: 5 })[item.id] ?? 0);
  assert.deepEqual(ranked[1].children.map(x => x.id), ['nested', 'z']);
  assert.deepEqual(alphabetizeNavigationItems(ranked).map(x => x.id), ['root', 'a', 'z']);
});
test('formal navigation accepts unlimited nested data and rejects duplicate IDs and unsafe nested destinations', () => {
  const node = createPatternNode('NavigationTree', { props: { items } });
  assert.equal(validatePatterns(node).valid, true);
  const duplicate = structuredClone(node);
  duplicate.props.items[1].children[1].children[0].id = 'z';
  assert.equal(validatePatterns(duplicate).valid, false);
  const unsafe = structuredClone(node);
  unsafe.props.items[1].children[1].children[0].href = 'javascript:alert(1)';
  assert.equal(validatePatterns(unsafe).valid, false);
  assert.deepEqual(createPatternNode('NavigationTree').props.items, []);
});
