import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePage } from '../src/pagination-types/pagination-model.js'

test('direct-page entry accepts whole pages only, within the current result set', () => {
  assert.equal(parsePage(' 12 ', 50), 12)
  assert.equal(parsePage('1', 1), 1)
  assert.equal(parsePage('50', 50), 50)
  for (const invalid of ['', ' ', '0', '-1', '51', '1.5', '1e1', 'NaN', 'Infinity', '9007199254740992']) assert.equal(parsePage(invalid, 50), null, invalid)
  assert.equal(parsePage('12', 5), null)
})
