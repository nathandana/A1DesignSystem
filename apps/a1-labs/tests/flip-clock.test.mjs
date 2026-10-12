import test from 'node:test'
import assert from 'node:assert/strict'
import { clockParts, flapPose } from '../src/flip-clock/clock-model.js'

test('clock carries seconds into minutes and hours, including midnight and noon', () => {
  for (const [before, after, expected] of [
    [[10, 24, 9], [10, 24, 10], [4, 5]],
    [[10, 24, 59], [10, 25, 0], [3, 4, 5]],
    [[10, 59, 59], [11, 0, 0], [1, 2, 3, 4, 5]],
    [[23, 59, 59], [0, 0, 0], [0, 1, 2, 3, 4, 5]],
  ]) {
    const a = clockParts(new Date(2026, 9, 11, ...before)).digits
    const b = clockParts(new Date(2026, 9, 11, ...after)).digits
    assert.deepEqual([...a].flatMap((digit, i) => digit !== b[i] ? [i] : []), expected)
  }
  assert.deepEqual(clockParts(new Date(2026, 9, 11, 0, 0, 0), '12'), { digits: '120000', text: '12:00:00', period: 'a.m.' })
  assert.equal(clockParts(new Date(2026, 9, 11, 12, 0), '12').period, 'p.m.')
  assert.equal(clockParts(new Date(2026, 9, 11, 13, 9), '12', false).text, '01:09')
})

test('flap falls through a half turn with readable faces and settles flat', () => {
  assert.deepEqual(flapPose(-1), flapPose(0))
  assert.deepEqual(flapPose(2), flapPose(1))
  assert.equal(flapPose(0).outgoing, 0)
  assert.equal(flapPose(0.5).outgoing, Math.PI / 2)
  assert.equal(flapPose(0.5).incoming, -Math.PI / 2)
  assert.equal(flapPose(0.5).firstHalf, false)
  assert.equal(Math.abs(flapPose(1).incoming), 0)
  assert.equal(flapPose(1).complete, true)
  assert.ok(flapPose(0.25).firstHalf)
})
