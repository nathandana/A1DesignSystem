import test from 'node:test'
import assert from 'node:assert/strict'
import { createDataset } from '../src/sample-data/datasets.js'
import { buildInventory, stockStatus } from '../src/sample-data/inventory.js'
import { DATASET_SIZES, DATASET_COUNTS, datasetCount } from '../src/sample-data/sizes.js'
import { buildDatasets } from '../src/mobile-tables/table-data.js'
import { tableColumns } from '../src/data-tables/table-samples.js'

for (const type of ['inventory', 'directory', 'invoices', 'requests']) {
  test(`${type}: deterministic, independent records at every supported size through 1,000`, () => {
    const large = createDataset(type, 'large')
    for (const size of [...Object.keys(DATASET_SIZES), ...DATASET_COUNTS, 0, 127, 321, 999]) {
      const rows = createDataset(type, size)
      assert.equal(rows.length, datasetCount(size))
      assert.equal(new Set(rows.map(row => row.id)).size, rows.length)
      assert.deepEqual(rows, large.slice(0, rows.length))
      if (rows.length) { rows[0].id = 'changed'; assert.notEqual(createDataset(type, size)[0].id, 'changed') }
    }
  })
}
test('invalid counts and types fail clearly rather than truncating', () => {
  for (const invalid of [-1, 1.5, 1001, 5000, NaN, Infinity, '100', 'huge', null]) {
    assert.throws(() => createDataset('inventory', invalid), RangeError)
    assert.throws(() => createDataset('requests', invalid), RangeError)
  }
  assert.throws(() => createDataset('unknown'), RangeError)
})
test('inventory has unique names/SKUs beyond its original 320-item limit and coherent values', () => {
  const rows = buildInventory('large')
  for (const key of ['id', 'name', 'sku']) assert.equal(new Set(rows.map(row => row[key])).size, 1000)
  assert.ok(rows.some(row => row.stock === 0))
  assert.ok(rows.some(row => row.stock > 0 && row.stock < 5))
  assert.ok(rows.every(row => row.price > row.cost && row.cost > 0 && row.price % 5 === 0 && row.status === stockStatus(row.stock)))
  assert.deepEqual(buildInventory(100, 12), buildInventory(1000, 12).slice(0, 100))
  assert.notDeepEqual(buildInventory(100, 12), buildInventory(100, 2026))
})
test('all table schemas and mobile projections use the canonical records', () => {
  for (const type of ['inventory', 'directory', 'invoices']) {
    const rows = createDataset(type, 'large')
    for (const column of tableColumns(type, 'detailed')) assert.ok(rows.every(row => row[column.key] !== undefined), `${type}.${column.key}`)
  }
  const { simple, complex } = buildDatasets(1000), rows = createDataset('inventory', 1000)
  assert.deepEqual(simple.rows, rows.map(({id, name, stock, price}) => ({id, name, stock, price})))
  assert.deepEqual(complex.rows.map(({updated, ...row}) => row), rows.map(({updated, ...row}) => row))
  assert.ok(createDataset('invoices', 1000).every(row => row.due > row.issued))
  assert.equal(createDataset('requests', 1000).at(-1).reference, 'REQ-01000')
})
