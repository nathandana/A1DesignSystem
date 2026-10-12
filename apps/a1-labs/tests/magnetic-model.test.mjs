import test from 'node:test'
import assert from 'node:assert/strict'
import { magneticTarget, attractedPoint, springStep, springFrames } from '../src/reordering/magnetic-model.js'

test('magnetic targets use fixed slots, bounded snapping and hysteresis', () => {
  const slots = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 }]
  assert.equal(magneticTarget(slots, { x: 90, y: 5 }, null, 60), 1)
  assert.equal(magneticTarget(slots, { x: 200, y: 200 }, 1, 60), null)
  assert.equal(magneticTarget(slots, { x: 53, y: 0 }, 0, 60), 0)
  assert.equal(magneticTarget(slots, { x: 65, y: 0 }, 0, 60), 1)
  assert.equal(magneticTarget([], { x: 0, y: 0 }, null, 60), null)
  const point = { x: 30, y: 0 }, result = attractedPoint(point, slots[0], 60, .75)
  assert.ok(result.x > 0 && result.x < point.x)
  assert.deepEqual(attractedPoint(point, null, 60, .75), point)
  assert.deepEqual(attractedPoint(point, slots[0], 20, .75), point)
})
test('spring physics converge and displacement ends at the actual layout', () => {
  for (const stiffness of [180, 260, 360]) for (const damping of [18, 24, 32]) {
    let state = { position: 120, velocity: 0 }
    for (let i = 0; i < 180; i++) state = springStep(state.position, state.velocity, 0, stiffness, damping, 1 / 60)
    assert.ok(Math.abs(state.position) < .001)
    const spring = springFrames(120, -80, stiffness, damping)
    assert.deepEqual(spring.frames[0], { transform: 'translate(120px, -80px)' })
    assert.deepEqual(spring.frames.at(-1), { transform: 'none' })
    assert.ok(spring.duration > 0 && spring.duration < 1600)
  }
  assert.notDeepEqual(springFrames(100, 0, 180, 18), springFrames(100, 0, 360, 32))
})
