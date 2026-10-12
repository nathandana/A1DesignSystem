import test from 'node:test'
import assert from 'node:assert/strict'
import { acceptEdits, changedCells, sortRows, totals } from '../src/data-grid/grid-model.js'

const rows = [
  { id: 1, name: 'Walnut desk', stock: 4, price: 640 },
  { id: 2, name: 'Oak shelf', stock: 12, price: 180 },
  { id: 3, name: 'ash stool', stock: 12, price: 95 },
]

test('rows sort by number or text, by several columns in order', () => {
  assert.deepEqual(sortRows(rows, [{ columnKey: 'stock', direction: 'DESC' }, { columnKey: 'name', direction: 'ASC' }], ['stock']).map(r => r.id), [3, 2, 1])
  assert.deepEqual(sortRows(rows, [{ columnKey: 'name', direction: 'ASC' }]).map(r => r.id), [3, 2, 1])
  assert.equal(sortRows(rows, []), rows)
})

test('edits to number columns become numbers; invalid ones keep the old value', () => {
  const edited = [{ ...rows[0], stock: '7' }, { ...rows[1], price: 'free' }, { ...rows[2], price: '$1,200' }]
  const { rows: next, rejected } = acceptEdits(rows, edited, ['stock', 'price'])
  assert.equal(next[0].stock, 7)
  assert.equal(next[1].price, 180)
  assert.equal(next[2].price, 1200)
  assert.deepEqual(rejected, [{ id: 2, key: 'price', value: 'free' }])
  assert.equal(acceptEdits(rows, [{ ...rows[0], stock: '-2' }], ['stock']).rejected.length, 1)
  // Edited while sorted: the original order is kept.
  assert.deepEqual(acceptEdits(rows, [rows[2], { ...rows[1], stock: '1' }, rows[0]], ['stock']).rows.map(r => r.id), [1, 2, 3])
})

test('totals add up number columns and count rows', () => {
  assert.deepEqual(totals(rows, ['stock']), { count: 3, stock: 28 })
})

test('edited cells are counted against the original', () => {
  assert.equal(changedCells(rows, [{ ...rows[0], stock: 5, name: 'Desk' }, rows[1], rows[2]]), 2)
  assert.equal(changedCells(rows, rows), 0)
})
