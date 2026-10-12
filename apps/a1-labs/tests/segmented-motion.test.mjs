import test from 'node:test'
import assert from 'node:assert/strict'
import { edges, morphFrames, travelDirection } from '../src/segmented-motion/segment-model.js'

test('direction of travel follows the option order', () => {
  assert.equal(travelDirection(0, 2), 'forward')
  assert.equal(travelDirection(3, 1), 'back')
})

test('the indicator is placed by its left and right edges', () => {
  assert.deepEqual(edges({ x: 10, y: 4, width: 80, height: 32 }, 300), { left: 10, right: 210, top: 4, height: 32 })
})

test('morph shrinks to a bar under the old segment, travels, then fills the new one', () => {
  const frames = morphFrames({ x: 4, y: 4, width: 100, height: 32 }, { x: 204, y: 4, width: 100, height: 32 }, { width: 24, height: 4 }, 308)
  assert.equal(frames.length, 4)
  assert.deepEqual(frames[0], { left: '4px', right: '204px', top: '4px', height: '32px' })
  assert.deepEqual(frames[1], { left: '42px', right: '242px', top: '32px', height: '4px', offset: 0.3 })
  assert.deepEqual(frames[2], { left: '242px', right: '42px', top: '32px', height: '4px', offset: 0.7 })
  assert.deepEqual(frames[3], { left: '204px', right: '4px', top: '4px', height: '32px' })
})
