import test from 'node:test'
import assert from 'node:assert/strict'
import { BUILDS, TRANSITIONS, buildSchedule, layerFrames, mapRect, navigate, staggerDelays, wipeFrames } from '../src/slides/slide-motion.js'

const visual = { width: 800, zoomOut: 1.12, zoomIn: 0.92, handoff: 0.5 }

test('transitions run from simple to content-aware; builds cover the load options', () => {
  assert.deepEqual(TRANSITIONS.map(item => item.id), ['cut', 'fade', 'push', 'zoom', 'wipe', 'cascade', 'morph'])
  assert.deepEqual(BUILDS.map(item => item.id), ['all', 'fade', 'rise', 'step'])
})

test('layer transitions end at rest and mirror going back', () => {
  for (const type of ['push', 'zoom']) assert.equal(layerFrames(type, 'in', 1, visual).at(-1).transform, 'none')
  assert.equal(layerFrames('push', 'in', 1, visual)[0].transform, 'translateX(800px)')
  assert.equal(layerFrames('push', 'in', -1, visual)[0].transform, 'translateX(-800px)')
  assert.equal(layerFrames('push', 'out', 1, visual).at(-1).transform, 'translateX(-800px)')
  assert.equal(layerFrames('cut', 'in', 1, visual), null)
  // The wipe swaps slides at its midpoint, while the panel covers the stage.
  assert.deepEqual(wipeFrames(1, 800).map(frame => frame.transform), ['translateX(-800px)', 'none', 'translateX(800px)'])
  assert.equal(layerFrames('wipe', 'in', 1, visual).find(frame => frame.offset === 0.5 && frame.opacity === 1).offset, 0.5)
  // The handoff point comes from a token.
  assert.equal(layerFrames('wipe', 'in', 1, { ...visual, handoff: 0.4 })[1].offset, 0.4)
  assert.equal(wipeFrames(1, 800, 0.4)[1].offset, 0.4)
  assert.ok(wipeFrames(1, 800).every(frame => frame.visibility === 'visible'))
})

test('morph maps the new box back onto the old one', () => {
  assert.equal(mapRect({ x: 600, y: 400, width: 200, height: 100 }, { x: 600, y: 100, width: 200, height: 100 }), 'translate(0px, 300px) scale(1, 1)')
  assert.equal(mapRect({ x: 0, y: 0, width: 50, height: 50 }, { x: 100, y: 100, width: 100, height: 100 }), 'translate(-100px, -100px) scale(0.5, 0.5)')
})

test('staggers fit their span; builds start after the transition', () => {
  assert.deepEqual(staggerDelays(4, 100, 600), [0, 100, 200, 300])
  assert.deepEqual(staggerDelays(4, 100, 150), [0, 50, 100, 150])
  assert.deepEqual(staggerDelays(1, 100, 600), [0])
  assert.deepEqual(buildSchedule('all', 3, { start: 500, step: 100, shift: 24 }), [])
  assert.deepEqual(buildSchedule('step', 3, { start: 500, step: 100, shift: 24 }), [])
  assert.deepEqual(buildSchedule('fade', 2, { start: 500, step: 100, shift: 24 }).map(item => item.delay), [500, 500])
  const rise = buildSchedule('rise', 3, { start: 500, step: 100, shift: 24 })
  assert.deepEqual(rise.map(item => item.delay), [500, 600, 700])
  assert.match(rise[0].frames[0].transform, /translateY\(24px\)/)
  assert.equal(buildSchedule('rise', 1, { start: 0, step: 100, shift: 24, reduced: true })[0].frames[0].transform, undefined)
})

test('step-through reveals points before moving on', () => {
  const at = { build: 'step', step: 1, count: 3, index: 2, total: 10 }
  assert.deepEqual(navigate(at, 'next'), { type: 'step', step: 2 })
  assert.deepEqual(navigate({ ...at, step: 3 }, 'next'), { type: 'go', index: 3, dir: 1, reveal: 'none' })
  assert.deepEqual(navigate(at, 'previous'), { type: 'go', index: 1, dir: -1, reveal: 'all' })
  assert.deepEqual(navigate({ ...at, build: 'rise', step: 0 }, 'next'), { type: 'go', index: 3, dir: 1, reveal: 'all' })
  assert.deepEqual(navigate({ ...at, step: 3, index: 9 }, 'next'), { type: 'none' })
  assert.deepEqual(navigate({ ...at, index: 0 }, 'previous'), { type: 'none' })
})
