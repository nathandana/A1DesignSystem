import test from 'node:test'
import assert from 'node:assert/strict'
import { craneState } from '../src/page-construction/construction.js'

const crane = { home: 380, raised: 8 }
const targets = [{ x: 200, drop: 20 }, { x: 200, drop: 120 }, { x: 100, drop: 300 }]
const step = 1000

test('each step fetches from the mast, lowers, releases and returns', () => {
  const start = craneState(0, step, targets, crane)
  assert.equal(start.x, crane.home)
  assert.equal(start.carrying, 0)
  assert.equal(start.placed, 0)
  const lowered = craneState(600, step, targets, crane)
  assert.equal(lowered.x, 200)
  assert.equal(lowered.rope, 20)
  assert.equal(lowered.carrying, 0, 'still holding while it settles')
  const released = craneState(700, step, targets, crane)
  assert.equal(released.carrying, null)
  assert.equal(released.placed, 1, 'placed once let go')
  const home = craneState(999.9, step, targets, crane)
  assert.ok(Math.abs(home.x - crane.home) < 1)
})

test('blocks are placed in order, one per step', () => {
  assert.deepEqual([0, 650, 1650, 2650].map(t => craneState(t, step, targets, crane).placed), [0, 1, 2, 3])
  assert.equal(craneState(2600, step, targets, crane).rope, 300, 'deeper blocks need a longer rope')
})

test('once built, the crane idles over the page until loading finishes', () => {
  const idle = craneState(3 * step + 5000, step, targets, crane)
  assert.equal(idle.phase, 'idle')
  assert.equal(idle.placed, 3)
  assert.equal(idle.carrying, null)
  assert.ok(Math.abs(idle.x - 150) < 1, 'centred over the blocks')
})

test('time before the start is treated as the start', () => {
  assert.deepEqual(craneState(-50, step, targets, crane), craneState(0, step, targets, crane))
})
