import test from 'node:test'
import assert from 'node:assert/strict'
import { dialIndex, dragPosition, nextCycle, pointerAngle, resolveMode, stepSpring, toggleBinary } from '../src/mode-switches/mode-model.js'

test('Auto follows the device; binary switches flip what is on screen', () => {
  assert.equal(resolveMode('system', true), 'dark')
  assert.equal(resolveMode('system', false), 'light')
  assert.equal(toggleBinary('system', true), 'light')
  assert.equal(toggleBinary('system', false), 'dark')
  assert.equal(toggleBinary('dark', false), 'light')
  assert.equal(toggleBinary('light', true), 'dark')
})

test('the cycle visits light, dark and auto', () => {
  assert.deepEqual(['light', 'dark', 'system'].map(nextCycle), ['dark', 'system', 'light'])
})

test('the dial snaps to the nearest detent', () => {
  assert.equal(dialIndex(-70, 60), 0)
  assert.equal(dialIndex(-20, 60), 1)
  assert.equal(dialIndex(35, 60), 2)
  assert.equal(Math.round(pointerAngle(0, -10)), 0)
  assert.equal(Math.round(pointerAngle(10, 0)), 90)
  assert.equal(Math.round(pointerAngle(-10, 0)), -90)
})

test('the cord spring returns the bead to rest and settles', () => {
  let state = { x: 10, y: 60, vx: 0, vy: 0 }
  let frames = 0
  let overshoot = false
  while (!state.settled && frames < 600) {
    state = stepSpring(state, { stiffness: 0.12, damping: 0.86 })
    if (state.y < 0) overshoot = true
    frames += 1
  }
  assert.ok(state.settled && frames < 600, 'settles')
  assert.ok(overshoot, 'bounces past rest like a real cord')
  assert.deepEqual([state.x, state.y], [0, 0])
})

test('dragging only pulls down, with limited sway', () => {
  assert.deepEqual(dragPosition(0, -20, 64), { x: 0, y: 0 })
  assert.deepEqual(dragPosition(300, 200, 64), { x: 64 / 3, y: 64 })
})

test('the ball chain spaces its balls evenly along the cord', async () => {
  const { chainPoints } = await import('../src/mode-switches/mode-model.js')
  const points = chainPoints({ x: 0, y: 0 }, { x: 0, y: 50 }, { x: 0, y: 100 }, 8)
  assert.equal(points.length, 13)
  for (let i = 1; i < points.length; i += 1) assert.ok(Math.abs(points[i].y - points[i - 1].y - 8) < 2)
})
