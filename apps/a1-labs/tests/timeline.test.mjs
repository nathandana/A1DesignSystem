import test from 'node:test'
import assert from 'node:assert/strict'
import { horizontalConnector, resolveOrientation, sideOf, verticalConnector } from '../src/timeline/timeline-geometry.js'
import { MILESTONES } from '../src/timeline/timeline-data.js'

test('a horizontal connector runs along the axis, wraps its badge and rises to the node', () => {
  const path = horizontalConnector({ fromX: 0, cx: 150, cy: 250, radius: 64, side: 'above', nodeY: 130, nodeRadius: 8 })
  assert.equal(path, 'M 0 250 H 86 A 64 64 0 0 1 150 186 V 138')
})

test('connectors below the axis, and right-to-left, sweep the other way', () => {
  assert.equal(horizontalConnector({ fromX: 200, cx: 400, cy: 250, radius: 64, side: 'below', nodeY: 370, nodeRadius: 8 }),
    'M 200 250 H 336 A 64 64 0 0 0 400 314 V 362')
  assert.equal(horizontalConnector({ fromX: 800, cx: 600, cy: 250, radius: 64, side: 'above', nodeY: 130, nodeRadius: 8, dir: -1 }),
    'M 800 250 H 664 A 64 64 0 0 0 600 186 V 138')
})

test('a vertical connector runs down, wraps its badge and turns towards the details', () => {
  assert.equal(verticalConnector({ fromY: 0, cx: 100, cy: 200, radius: 64, nodeX: 200, nodeRadius: 8 }),
    'M 100 0 V 136 A 64 64 0 0 1 164 200 H 192')
  assert.equal(verticalConnector({ fromY: 0, cx: 300, cy: 200, radius: 64, nodeX: 200, nodeRadius: 8 }),
    'M 300 0 V 136 A 64 64 0 0 0 236 200 H 208')
})

test('milestones alternate; auto layout switches at the minimum width', () => {
  assert.deepEqual([0, 1, 2, 3].map(sideOf), ['above', 'below', 'above', 'below'])
  assert.equal(resolveOrientation('auto', 1200, 960), 'horizontal')
  assert.equal(resolveOrientation('auto', 600, 960), 'vertical')
  assert.equal(resolveOrientation('vertical', 1200, 960), 'vertical')
})

test('four yearly milestones of sample content, in sentence case', () => {
  assert.deepEqual(MILESTONES.map(item => item.year), ['2020', '2021', '2022', '2023'])
  assert.ok(MILESTONES.every(item => item.items.length === 3 && item.icon && item.tone))
  // Sentence case: no word after the first starts with a capital, except proper nouns.
  const proper = new Set(['Lisbon', 'iOS', 'Android'])
  for (const text of MILESTONES.flatMap(item => [item.title, ...item.items])) {
    assert.ok(text.split(' ').slice(1).every(word => proper.has(word) || word[0] !== word[0].toUpperCase() || /\d/.test(word)), text)
  }
})
