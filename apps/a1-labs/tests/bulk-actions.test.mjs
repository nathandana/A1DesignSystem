import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeDeleted, readDeleted, removeRows, writeDeleted } from '../src/bulk-actions/bulk-model.js'

const rows = [{ id: 1 }, { id: 2 }, { id: 3 }]

test('deleted rows are removed from the data set, matching ids as strings', () => {
  assert.deepEqual(removeRows(rows, ['1', 3]), { rows: [{ id: 2 }], removed: 2 })
  assert.deepEqual(removeRows(rows, ['9']).removed, 0)
})

test('deleted ids accumulate without duplicates', () => {
  assert.deepEqual(mergeDeleted(['1'], [1, '2']), ['1', '2'])
})

test('deleted ids survive storage round trips and bad storage', () => {
  const store = new Map()
  const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: k => store.delete(k) }
  writeDeleted(storage, 'k', ['4', '7'])
  assert.deepEqual(readDeleted(storage, 'k'), ['4', '7'])
  writeDeleted(storage, 'k', [])
  assert.deepEqual(readDeleted(storage, 'k'), [])
  storage.setItem('k', '{not json')
  assert.deepEqual(readDeleted(storage, 'k'), [])
  const broken = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('full') }, removeItem() {} }
  assert.deepEqual(readDeleted(broken, 'k'), [])
  assert.doesNotThrow(() => writeDeleted(broken, 'k', ['1']))
})

test('page rows follow A1 DataTable sorting and paging', async () => {
  const { pageRows } = await import('../src/bulk-actions/bulk-model.js')
  const items = [{ id: 1, name: 'b', stock: 10 }, { id: 2, name: 'A', stock: 2 }, { id: 3, name: 'c', stock: 7 }, { id: 4, name: 'a2', stock: 7 }]
  assert.deepEqual(pageRows(items, null, 1, 2).map(r => r.id), [1, 2])
  assert.deepEqual(pageRows(items, { key: 'name', direction: 'asc' }, 1, 3).map(r => r.id), [2, 4, 1])
  assert.deepEqual(pageRows(items, { key: 'stock', direction: 'desc' }, 2, 2).map(r => r.id), [4, 2])
  assert.deepEqual(pageRows(items, null, 9, 3).map(r => r.id), [4], 'clamped to the last page')
})

test('select all offers the whole data set only once the page is fully selected', async () => {
  const { selectAllState } = await import('../src/bulk-actions/bulk-model.js')
  assert.equal(selectAllState(['1', '2'], [1, 2], 5), 'page')
  assert.equal(selectAllState(['1'], [1, 2], 5), null)
  assert.equal(selectAllState(['1', '2', '3', '4', '5'], [1, 2], 5), 'all')
  assert.equal(selectAllState(['1', '2'], [1, 2], 2), null, 'everything fits on one page')
})
