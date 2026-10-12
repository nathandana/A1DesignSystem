import test from 'node:test'
import assert from 'node:assert/strict'
import { experiments, experimentCategories, experimentTypes } from '../src/experiments.js'
import { filterExperiments, readExperimentFilters } from '../src/experiment-filters.js'

test('every experiment has a valid category and unique, governed type tags', () => {
  const categories = new Set(experimentCategories.map(item => item.id))
  const types = new Set(experimentTypes.map(item => item.id))
  for (const item of experiments) {
    assert.ok(categories.has(item.category), item.id)
    assert.ok(item.types.length > 0, item.id)
    assert.equal(new Set(item.types).size, item.types.length)
    assert.ok(item.types.every(type => types.has(type)), item.id)
  }
  for (const type of types) assert.ok(experiments.some(item => item.types.includes(type)), type)
})
test('sorting uses release chronology and names without mutating the registry', () => {
  const before = [...experiments]
  const oldest = filterExperiments(experiments, { sort: 'oldest' })
  assert.equal(oldest[0].id, 'ai-image-generation')
  assert.deepEqual(filterExperiments(experiments), [...oldest].reverse())
  const ascending = filterExperiments(experiments, { sort: 'az' })
  assert.deepEqual(filterExperiments(experiments, { sort: 'za' }).map(item => item.title), ascending.map(item => item.title).reverse())
  assert.deepEqual(experiments, before)
  for (const item of experiments) assert.match(item.addedIn, /^\d+\.\d+\.\d+$/)
  assert.ok(filterExperiments(experiments, { query: 'design tool' }).some(item => item.id === 'token-visualizer'))
})
test('URL state retains search and sort while retiring category/type filters', () => {
  assert.deepEqual(readExperimentFilters('?category=forms&type=form-pattern&q=date+of+birth&sort=az'), { query: 'date of birth', sort: 'az' })
  assert.deepEqual(readExperimentFilters('?sort=unknown'), { query: '', sort: 'newest' })
})

test('all experiments carry unique search aliases and gallery/tree share matching', async () => {
  const { experimentTree } = await import('../src/experiments.js')
  for (const item of experiments) {
    assert.ok(item.tags?.length > 0, `${item.id} needs search tags`)
    assert.ok(item.tags.every(tag => typeof tag === 'string' && tag.trim()), item.id)
    assert.equal(new Set(item.tags.map(tag => tag.toLowerCase())).size, item.tags.length, item.id)
  }
  for (const query of ['Drag', ' DOB ', 'magnetic spring', 'modal', 'micro interaction']) {
    const gallery = filterExperiments(experiments, { query }).map(item => item.id).sort()
    const tree = experimentTree(query).flatMap(group => group.children.map(item => item.id)).sort()
    assert.deepEqual(tree, gallery, query)
    assert.ok(gallery.length, query)
  }
  assert.ok(filterExperiments(experiments, { query: ' DRAG ', category: 'interaction' }).some(item => item.id === 'reordering'))
})

test('experiment tree sorts categories and experiments by name', async () => {
  const { experimentTree } = await import('../src/experiments.js')
  const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true })
  const sorted = labels => [...labels].sort(collator.compare)
  const tree = experimentTree()
  assert.deepEqual(tree.map(group => group.label), sorted(tree.map(group => group.label)))
  for (const group of tree) {
    const labels = group.children.map(item => item.label)
    assert.deepEqual(labels, sorted(labels), group.label)
  }
})

test('hidden experiments stay reachable but are left out of the gallery, sidebar and search', async () => {
  const { allExperiments, experimentTree } = await import('../src/experiments.js')
  const hidden = allExperiments.filter(item => item.hidden)
  assert.ok(hidden.some(item => item.id === 'fenex'))
  for (const item of hidden) {
    assert.ok(!experiments.includes(item), item.id)
    assert.ok(!experimentTree(item.title).some(group => group.children.some(child => child.id === item.id)), item.id)
    assert.ok(!filterExperiments(experiments, { query: item.title }).includes(item), item.id)
  }
  assert.equal(experiments.length, allExperiments.length - hidden.length)
})
