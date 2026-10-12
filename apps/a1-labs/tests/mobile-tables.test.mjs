import test from 'node:test'
import assert from 'node:assert/strict'
import { apDate, buildDatasets, cellText, groupRows, stockStatus } from '../src/mobile-tables/table-data.js'

test('simple and complex datasets share the same products', () => {
  const { simple, complex } = buildDatasets(24)
  assert.equal(simple.rows.length, 24)
  assert.equal(complex.rows.length, 24)
  assert.deepEqual(simple.columns.map(c => c.key), ['name', 'stock', 'price'])
  assert.equal(complex.columns.length, 11)
  assert.deepEqual(simple.rows.map(r => r.name), complex.rows.map(r => r.name))
  for (const column of complex.columns) assert.ok(complex.rows.every(row => row[column.key] !== undefined), column.key)
})

test('derived values are sensible', () => {
  const { complex } = buildDatasets(24)
  assert.ok(complex.rows.every(row => row.cost < row.price && row.margin > 0 && row.margin < 100))
  assert.ok(complex.rows.every(row => row.status === stockStatus(row.stock)))
})

test('dates use AP style and cells format their values', () => {
  assert.equal(apDate(new Date(Date.UTC(2026, 8, 3))), 'Sept. 3, 2026')
  assert.equal(apDate(new Date(Date.UTC(2026, 2, 14))), 'March 14, 2026')
  assert.equal(cellText({ key: 'price', format: v => `$${v}` }, { price: 40 }), '$40')
  assert.equal(cellText({ key: 'name' }, { name: 'Oak desk' }), 'Oak desk')
})

test('rows group by a key, alphabetically', () => {
  const groups = groupRows([{ c: 'b', n: 1 }, { c: 'a', n: 2 }, { c: 'b', n: 3 }], 'c')
  assert.deepEqual(groups.map(g => [g.label, g.rows.map(r => r.n)]), [['a', [2]], ['b', [1, 3]]])
})
