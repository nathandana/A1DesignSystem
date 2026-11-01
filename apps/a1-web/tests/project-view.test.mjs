import assert from 'node:assert/strict'
import test from 'node:test'
import {
  COMPACT_PROJECT_VIEW_QUERY,
  getDefaultProjectView,
} from '../src/projects/projectView.js'

test('project overview defaults xs and sm to list view', () => {
  const queries = []
  const view = getDefaultProjectView((query) => {
    queries.push(query)
    return { matches: true }
  })

  assert.equal(view, 'list')
  assert.deepEqual(queries, [COMPACT_PROJECT_VIEW_QUERY])
})

test('project overview defaults md and larger to canvas view', () => {
  assert.equal(getDefaultProjectView(() => ({ matches: false })), 'canvas')
})

test('project overview defaults to canvas when matchMedia is unavailable', () => {
  assert.equal(getDefaultProjectView(null), 'canvas')
})
