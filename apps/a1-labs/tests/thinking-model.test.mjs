import assert from 'node:assert/strict'
import test from 'node:test'
import { characters, characterDuration, lineDuration, holdDuration, minimumHold, nextLineIndex, normalizeLines } from '../src/thinking-terminal/thinking-model.js'

test('thinking lines trim blanks and duplicates without evaluating text', () => {
  assert.deepEqual(normalizeLines([' hello ', '', 'hello', '<script>test</script>']), ['hello', '<script>test</script>'])
})
test('random selection reaches every other line but never immediately repeats', () => {
  for (let current = 0; current < 5; current++) {
    const outcomes = [0, .25, .5, .75].map(random => nextLineIndex(5, current, () => random))
    assert.equal(new Set(outcomes).size, 4)
    assert.ok(!outcomes.includes(current))
  }
  assert.equal(nextLineIndex(1, 0), 0)
})
test('longer lines get typing and reading time; short lines remain readable', () => {
  assert.equal(holdDuration('Hi'), minimumHold)
  assert.ok(lineDuration('a'.repeat(100)) > lineDuration('a'.repeat(50)))
  assert.equal(lineDuration('a'.repeat(100)), 100 * characterDuration + 3000)
})
test('typing keeps combining characters and joined emoji intact', () => {
  assert.deepEqual(characters('e\u0301👩‍💻'), ['e\u0301', '👩‍💻'])
})
