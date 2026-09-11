import assert from 'node:assert/strict';
import test from 'node:test';
import { hasAncestorId, safeChildren } from '../src/figma/selection.js';

test('returns an empty array when a stale Figma node rejects child access', () => {
  const staleNode = {
    get children() {
      throw new Error('The node does not exist');
    },
  };
  assert.deepEqual(safeChildren(staleNode), []);
});

test('returns a snapshot of live Figma children', () => {
  const children = [{ id: 'one' }];
  assert.deepEqual(safeChildren({ children }), children);
  assert.notEqual(safeChildren({ children }), children);
});

test('finds an ancestor without trusting a stale nodechange proxy', () => {
  const target = { id: 'instance' };
  const child = { id: 'child', parent: target };
  assert.equal(hasAncestorId(child, target.id), true);
});

test('returns false when a removed instance sublayer rejects parent access', () => {
  const staleSublayer = {
    id: 'I2:7422;243:1852',
    get parent() {
      throw new Error('The node (instance sublayer or table cell) does not exist');
    },
  };
  assert.equal(hasAncestorId(staleSublayer, 'instance'), false);
});
