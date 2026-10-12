import test from 'node:test'
import assert from 'node:assert/strict'
import { experimentMenu } from '../src/experiment-menu.js'
import { allExperiments, experiments } from '../src/experiments.js'

test('header menu includes every visible experiment once in the sidebar categories', () => {
  const menu = experimentMenu('', '/experiments/mobile-tables')
  const groups = menu.items.filter(item => item.items)
  const links = groups.flatMap(group => group.items)
  assert.deepEqual(links.map(item => item.id).sort(), experiments.map(item => item.id).sort())
  assert.equal(new Set(links.map(item => item.id)).size, links.length)
  assert.equal(links.filter(item => item.active).length, 1)
  assert.equal(groups.filter(item => item.active).length, 1)
  for (const hidden of allExperiments.filter(item => item.hidden)) assert.ok(!links.some(item => item.id === hidden.id))
  assert.equal(menu.items[0].href, '/')
})
test('search uses tags, returns direct links and keeps gallery access for empty results', () => {
  const drag = experimentMenu('drag')
  assert.ok(drag.matches.some(item => item.id === 'reordering'))
  assert.ok(drag.items.filter(item => item.href).every(item => !item.items))
  const empty = experimentMenu('zznothingmatcheszz')
  assert.deepEqual(empty.matches, [])
  assert.equal(empty.items.length, 1)
  assert.equal(empty.items[0].href, '/')
})
