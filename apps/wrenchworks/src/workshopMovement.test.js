import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PLAYER_START,
  distanceBetween,
  getJobRoute,
  getNearbyStation,
  getWorldTier,
  stepPosition,
} from './workshopMovement.js'

test('each business has a four-stop movement route', () => {
  assert.equal(getJobRoute('oil-stand').length, 4)
  assert.equal(getJobRoute('national-network').length, 4)
})

test('art tiers follow empire progression', () => {
  assert.equal(getWorldTier('oil-stand'), 'neighborhood')
  assert.equal(getWorldTier('engine-lab'), 'performance')
  assert.equal(getWorldTier('dealership'), 'dealership')
})

test('movement uses consistent world-space speed', () => {
  const start = { x: 50, y: 50 }
  const right = stepPosition(start, { x: 1, y: 0 }, 1)
  const down = stepPosition(start, { x: 0, y: 1 }, 1)
  assert.equal(Math.round((right.x - start.x) * 1.5), 24)
  assert.equal(Math.round(down.y - start.y), 24)
})

test('movement remains inside the walkable floor', () => {
  assert.deepEqual(
    stepPosition({ x: 92, y: 88 }, { x: 1, y: 1 }, 10),
    { x: 93, y: 89 },
  )
})

test('nearby stations use stage aspect ratio', () => {
  const service = getNearbyStation({ x: 24, y: 48 })
  assert.equal(service?.id, 'service')
  assert.ok(distanceBetween({ x: 24, y: 48 }, { x: 30, y: 48 }) > 8)
})
