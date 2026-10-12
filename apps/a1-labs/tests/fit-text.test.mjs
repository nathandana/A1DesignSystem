import test from 'node:test'
import assert from 'node:assert/strict'
import { balance, fitSizes, splitLines } from '../src/fit-text/fit-model.js'

test('lines follow the chosen breaking mode', () => {
  assert.deepEqual(splitLines('Make it\n  big   and\n\nbold'), ['Make it', 'big and', 'bold'])
  assert.deepEqual(splitLines('Make it big', 'words'), ['Make', 'it', 'big'])
  assert.deepEqual(splitLines('one two three four', 'balanced', 2), ['one two', 'three four'])
})

test('balanced lines keep word order and minimise the longest line', () => {
  const lines = balance(['a', 'bb', 'ccc', 'dddd', 'eeeee'], 3)
  assert.equal(lines.join(' '), 'a bb ccc dddd eeeee')
  assert.equal(Math.max(...lines.map(line => line.length)), 8)
  assert.deepEqual(balance(['solo'], 4), ['solo'])
  assert.deepEqual(balance([], 3), [])
})

test('narrower lines are set larger so every line fills the width', () => {
  const sizes = fitSizes([500, 250, 1000], 800)
  assert.deepEqual(sizes.map(s => s.size), [160, 320, 80])
})

test('match mode uses one size that fits the longest line', () => {
  assert.deepEqual(fitSizes([500, 250, 1000], 800, { mode: 'match' }).map(s => s.size), [80, 80, 80])
})

test('sizes are clamped, and lines below the minimum wrap', () => {
  const sizes = fitSizes([100, 4000], 800, { min: 24, max: 200 })
  assert.deepEqual(sizes, [{ size: 200, wraps: false }, { size: 24, wraps: true }])
})
