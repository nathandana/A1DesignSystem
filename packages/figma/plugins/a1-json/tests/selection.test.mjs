import assert from 'node:assert/strict';
import test from 'node:test';
import { safeChildren } from '../src/figma/selection.js';

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
