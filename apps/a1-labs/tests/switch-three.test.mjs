import test from 'node:test'
import assert from 'node:assert/strict'
import tokens from '../../../system/tokens/component/switch-morph.json' with { type: 'json' }
import { strokePose, switchEase } from '../src/switch-three/switch-motion.js'
const g = Object.fromEntries(Object.entries(tokens.component.switchMorph).map(([key, token]) => [key, parseFloat(token.$value)]))
const endpoint = (p, direction) => [p.x + direction * Math.cos(p.angle) * p.length / 2, p.y + direction * Math.sin(p.angle) * p.length / 2]
test('the solid strokes meet at the checkmark joint and the off strokes cross', () => {
  const a = strokePose(0, 1, g), b = strokePose(1, 1, g)
  endpoint(a, 1).forEach((value, i) => assert.ok(Math.abs(value - endpoint(b, -1)[i]) < 0.00001))
  assert.ok(Math.abs(strokePose(0, 0, g).x - strokePose(1, 0, g).x) < 0.00001)
  assert.ok(Math.abs(strokePose(0, 0, g).y - strokePose(1, 0, g).y) < 0.00001)
})
test('easing remains monotonic and reaches both endpoints', () => {
  let previous = -1
  for (let i = 0; i <= 100; i++) {
    const value = switchEase(i / 100)
    assert.ok(value >= previous && value >= 0 && value <= 1); previous = value
  }
  assert.ok(switchEase(0) < 0.0001 && switchEase(1) > 0.9999)
})
