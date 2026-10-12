import test from 'node:test'
import assert from 'node:assert/strict'
import { clockDigitCycle } from '../src/flip-clock/clock-model.js'

test('zero resets unwind all intervening cards for units, tens and hour digits', () => {
  assert.deepEqual(clockDigitCycle('9', '0'), ['8', '7', '6', '5', '4', '3', '2', '1', '0'])
  assert.deepEqual(clockDigitCycle('5', '0'), ['4', '3', '2', '1', '0'])
  assert.deepEqual(clockDigitCycle('3', '0'), ['2', '1', '0'])
  assert.deepEqual(clockDigitCycle('2', '0'), ['1', '0'])
  assert.deepEqual(clockDigitCycle('1', '0'), ['0'])
})
test('unchanged cards stay still and ordinary changes keep a single flip', () => {
  assert.deepEqual(clockDigitCycle('0', '0'), [])
  assert.deepEqual(clockDigitCycle('4', '4'), [])
  assert.deepEqual(clockDigitCycle('8', '9'), ['9'])
  assert.deepEqual(clockDigitCycle('0', '1'), ['1'])
  assert.deepEqual(clockDigitCycle('2', '1'), ['1'])
})
