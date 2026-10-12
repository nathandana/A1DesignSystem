import test from 'node:test'
import assert from 'node:assert/strict'
import { draftStates } from '../src/page-blueprint/blueprint.js'
import { arrivalOrder, piecesSent, scatter, tileGrid } from '../src/page-puzzle/puzzle.js'
import { FIDELITY_LAYERS, layerReveal, rollerState } from '../src/page-paint/paint.js'
import { daylight } from '../src/page-sunrise/sunrise.js'
import { skeletonLayers, waitingProgress } from '../src/loading-preview/loader-utils.js'

test('blueprint drafts one block per step, each outline drawing before it is drafted', () => {
  assert.deepEqual(draftStates(0, 900, 750, 3), ['drafting', 'pending', 'pending'])
  assert.deepEqual(draftStates(1000, 900, 750, 3), ['drafted', 'drafting', 'pending'])
  assert.deepEqual(draftStates(10000, 900, 750, 3), ['drafted', 'drafted', 'drafted'])
})

test('jigsaw: a grid of roughly square pieces, all sent within the build time, in a fixed shuffled order', () => {
  const grid = tileGrid(390, 844, 80)
  assert.deepEqual([grid.columns, grid.rows], [5, 11])
  assert.ok(Math.abs(grid.tileWidth * grid.columns - 390) < 1e-9)
  const order = arrivalOrder(55)
  assert.deepEqual([...order].sort((a, b) => a - b), Array.from({ length: 55 }, (_, index) => index))
  assert.deepEqual(order, arrivalOrder(55), 'deterministic')
  assert.notDeepEqual(order, Array.from({ length: 55 }, (_, index) => index), 'shuffled')
  assert.equal(piecesSent(0, 5000, 55), 1)
  assert.equal(piecesSent(4999, 5000, 55), 55)
  const from = scatter(3)
  assert.ok(Math.abs(from.x) >= 0.55 && Math.abs(from.rotate) <= 45 && from.scale < 1)
})

test('fresh paint reveals one more fidelity layer per pass, alternating direction', () => {
  assert.equal(FIDELITY_LAYERS, 3)
  const first = rollerState(1300, 2600)
  assert.equal(first.direction, 'down')
  assert.deepEqual(layerReveal(first.pass, first.y, 0), { state: 'partial', top: 0, bottom: 0.5 })
  assert.equal(layerReveal(first.pass, first.y, 1).state, 'hidden')
  const second = rollerState(2600 + 1300, 2600)
  assert.equal(second.direction, 'up')
  assert.equal(layerReveal(second.pass, second.y, 0).state, 'full')
  assert.deepEqual(layerReveal(second.pass, second.y, 1), { state: 'partial', top: 0.5, bottom: 0 }, 'painted from the bottom up')
  const polishing = rollerState(2600 * 5, 2600)
  assert.ok([0, 1, 2].every(layer => layerReveal(polishing.pass, polishing.y, layer).state === 'full'))
})

test('sunrise climbs towards day but never reaches it while loading', () => {
  assert.equal(daylight(0, 4000), 0)
  assert.ok(daylight(4000, 4000) > 0.65)
  assert.ok(daylight(600000, 4000) <= 0.8)
  assert.ok(daylight(8000, 4000) - daylight(6000, 4000) < daylight(2000, 4000) - daylight(0, 4000), 'slows down')
})

test('shared helpers: waiting progress and layout skeleton layers', () => {
  assert.ok(waitingProgress(1e9, 1000) <= 0.85)
  assert.equal(
    skeletonLayers([{ x: 10, y: 20, width: 30, height: 40 }], 'red', 5, 5),
    'linear-gradient(red, red) 5px 15px / 30px 40px no-repeat',
  )
})
