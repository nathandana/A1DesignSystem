import test from 'node:test'
import assert from 'node:assert/strict'
import { changedStates, parentState } from '../src/checkbox-motion/checkbox-model.js'

test('only boxes whose state changed are reported, with their new state', () => {
  const values = ['a', 'b', 'c']
  assert.deepEqual(changedStates({ checked: ['a'], mixed: [] }, { checked: ['a', 'b'], mixed: [] }, values), { b: 'on' })
  assert.deepEqual(changedStates({ checked: ['a', 'b'], mixed: [] }, { checked: ['b'], mixed: [] }, values), { a: 'off' })
  assert.deepEqual(changedStates({ checked: [], mixed: [] }, { checked: [], mixed: [] }, values), {})
})

test('moving into and out of the mixed state is a change', () => {
  assert.deepEqual(changedStates({ checked: [], mixed: [] }, { checked: [], mixed: ['all'] }, ['all']), { all: 'mixed' })
  assert.deepEqual(changedStates({ checked: [], mixed: ['all'] }, { checked: ['all'], mixed: [] }, ['all']), { all: 'on' })
  // Checked wins over mixed, as on the native input.
  assert.deepEqual(changedStates({ checked: ['all'], mixed: [] }, { checked: ['all'], mixed: ['all'] }, ['all']), {})
})

test('a Select all box is empty, mixed or checked from its children', () => {
  const all = ['basil', 'olives', 'peppers']
  assert.equal(parentState([], all), 'off')
  assert.equal(parentState(['olives'], all), 'mixed')
  assert.equal(parentState(['peppers', 'basil', 'olives'], all), 'on')
})
