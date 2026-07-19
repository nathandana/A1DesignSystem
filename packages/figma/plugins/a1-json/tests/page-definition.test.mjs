import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addDefaultTemplateWithId,
  collectSupportedNodes,
  componentId,
  kebabComponentType,
  pageTitleFromFigmaFrame,
  slugifyOptionValue,
} from '../src/pure/page-definition.js';

test('creates stable component ids from A1 type and Figma node id', () => {
  assert.equal(kebabComponentType('PageLayout'), 'page-layout');
  assert.equal(kebabComponentType('MessageEmptyState'), 'message-empty-state');
  assert.equal(componentId('GridItem', { id: '12:34;node' }), 'grid-item-12-34-node');
  assert.equal(componentId('Icon', 'I-123'), 'icon-I-123');
});

test('slugifies option values and keeps them unique', () => {
  const used = new Set(['save']);
  assert.equal(slugifyOptionValue('Save', used), 'save-2');
  assert.equal(slugifyOptionValue('Save!', used), 'save-3');
  assert.equal(slugifyOptionValue('', used), 'option');
});

test('collects renderable component nodes from page-definition shapes', () => {
  const heading = { id: 'h', type: 'Heading' };
  const paragraph = { id: 'p', type: 'Paragraph', children: [{ id: 'ignored', type: 'Link' }] };
  const data = {
    page: {
      layout: {
        regions: [
          { nodes: [heading, { children: [paragraph] }] },
        ],
      },
    },
  };
  assert.deepEqual(collectSupportedNodes(data), [heading, paragraph]);
});

test('applies quick-add ids throughout nested templates', () => {
  const template = {
    id: '$id',
    children: [{ id: '$id-child', content: { fallback: '$id copy' } }],
  };
  assert.deepEqual(addDefaultTemplateWithId(template, 'demo'), {
    id: 'demo',
    children: [{ id: 'demo-child', content: { fallback: 'demo copy' } }],
  });
});

test('derives page titles from linked and plain Figma frame names', () => {
  assert.equal(pageTitleFromFigmaFrame('A1 · Project / Dashboard'), 'Dashboard');
  assert.equal(pageTitleFromFigmaFrame({ name: 'Marketing page' }), 'Marketing page');
  assert.equal(pageTitleFromFigmaFrame(''), 'Untitled');
});
