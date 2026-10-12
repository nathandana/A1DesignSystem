import test from 'node:test'
import assert from 'node:assert/strict'
import { animationState, perimeterLength } from '../src/image-generation/renderer.js'
import { progressAnnouncement } from '../src/image-generation/accessibility.js'
import { blobState } from '../src/image-generation/blob.js'
import tokens from '../../../system/tokens/component/image-generation.json' with { type: 'json' }

test('blob grows in complexity and brightness while reduced motion preserves its shape', () => {
  const source = tokens.component.imageGeneration
  const visual = Object.fromEntries(['radiusMin', 'radiusMax', 'complexityMin', 'complexityMax', 'brightnessMin', 'brightnessMax', 'amplitude']
    .map(key => [key, source[`blob${key[0].toUpperCase()}${key.slice(1)}`].$value]))
  const early = blobState(0, visual, false), middle = blobState(0.5, visual, false), late = blobState(1, visual, false)
  for (const key of ['radius', 'complexity', 'brightness', 'amplitude']) {
    assert.ok(early[key] < middle[key] && middle[key] < late[key], key)
  }
  assert.deepEqual(blobState(-1, visual, false), early)
  assert.deepEqual(blobState(2, visual, false), late)
  const reducedEarly = blobState(0, visual, true), reducedLate = blobState(1, visual, true)
  for (const key of ['radius', 'complexity', 'amplitude']) assert.equal(reducedEarly[key], reducedLate[key])
  assert.ok(reducedEarly.brightness < reducedLate.brightness)
})

test('live progress announces milestones, not every frame or percent', () => {
  const messages = Array.from({ length: 100 }, (_, percent) => progressAnnouncement({ phase: 'generating', percent }, false))
  assert.deepEqual([...new Set(messages)], [
    'Generating image.', 'Generating image. 25% complete.',
    'Generating image. 50% complete.', 'Generating image. 75% complete.',
  ])
  assert.equal(progressAnnouncement({ phase: 'generating', percent: 42 }, true), 'Animation paused at 42%.')
  assert.equal(progressAnnouncement({ phase: 'generating', percent: 42 }, false), messages[42])
  assert.equal(progressAnnouncement({ phase: 'completing', percent: 100 }, false), progressAnnouncement({ phase: 'revealing', percent: 100 }, false))
  assert.equal(progressAnnouncement({ phase: 'complete', percent: 100 }, false), 'Image ready. Preview complete.')
  assert.match(progressAnnouncement({ phase: 'error', percent: 0 }, false), /could not load.*replaying/)
})

test('percentage completes before the image starts to reveal', () => {
  assert.deepEqual(animationState(7500, 15000, 300, 1500), { progress: 0.5, percent: 50, reveal: 0, phase: 'generating' })
  assert.equal(animationState(14999, 15000, 300, 1500).percent, 99)
  assert.deepEqual(animationState(15000, 15000, 300, 1500), { progress: 1, percent: 100, reveal: 0, phase: 'completing' })
  assert.equal(animationState(15299, 15000, 300, 1500).reveal, 0)
  assert.deepEqual(animationState(16050, 15000, 300, 1500), { progress: 1, percent: 100, reveal: 0.5, phase: 'revealing' })
  assert.equal(animationState(16800, 15000, 300, 1500).phase, 'complete')
})

test('reduced motion reveals instantly at the completion boundary without a partial frame', () => {
  assert.equal(animationState(7500, 15000, 300, 0).percent, 50)
  assert.equal(animationState(15299.999, 15000, 300, 0).reveal, 0)
  assert.deepEqual(animationState(15300, 15000, 300, 0), { progress: 1, percent: 100, reveal: 1, phase: 'complete' })
  assert.equal(animationState(15300.001, 15000, 300, 0).reveal, 1)
})

test('seeking is deterministic, clamped and supports configurable timing', () => {
  assert.equal(animationState(2500, 5000, 300, 1500).percent, 50)
  assert.equal(animationState(7500, 30000, 300, 1500).percent, 25)
  assert.equal(animationState(-1, 15000, 300, 1500).progress, 0)
  assert.equal(animationState(60000, 15000, 300, 1500).reveal, 1)
  const early = animationState(1000, 15000, 300, 1500)
  animationState(17000, 15000, 300, 1500)
  assert.deepEqual(animationState(1000, 15000, 300, 1500), early)
})

test('the border measures rounded rectangular perimeter rather than angular progress', () => {
  assert.equal(perimeterLength(400, 300, 0), 1400)
  assert.equal(perimeterLength(400, 300, 10), 1320 + 20 * Math.PI)
  assert.equal(perimeterLength(300, 400, 10), perimeterLength(400, 300, 10))
})
