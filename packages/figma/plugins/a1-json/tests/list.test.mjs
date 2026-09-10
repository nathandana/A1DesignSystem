import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LIST_MAX_ITEMS,
  LIST_VARIANTS,
  listItemTexts,
  listPropsFromVariant,
  listVariantFromProps,
} from '../src/pure/list.js';

test('maps A1 List props to the four Figma variants', () => {
  assert.deepEqual(LIST_VARIANTS, ['unordered', 'ordered', 'icon', 'divider']);
  assert.equal(LIST_MAX_ITEMS, 3);
  assert.equal(listVariantFromProps({}), 'unordered');
  assert.equal(listVariantFromProps({ as: 'ol' }), 'ordered');
  assert.equal(listVariantFromProps({ icon: 'star' }), 'icon');
  assert.equal(listVariantFromProps({ variant: 'divider' }), 'divider');
  assert.deepEqual(listPropsFromVariant('ordered'), { as: 'ol' });
  assert.deepEqual(listPropsFromVariant('icon'), { icon: 'check_circle' });
});

test('extracts serializable ListItem children in order', () => {
  assert.deepEqual(listItemTexts({ children: [
    { type: 'ListItem', content: { fallback: 'First' } },
    { type: 'Paragraph', content: { fallback: 'Ignored' } },
    { type: 'ListItem', content: { fallback: ' Second ' } },
  ] }), ['First', 'Second']);
});
