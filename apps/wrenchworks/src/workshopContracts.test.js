import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CONTRACTS,
  getContract,
  getContractOffers,
  getPerformanceMultiplier,
} from './workshopContracts.js'

test('contracts span multiple scenes and have complete reward metadata', () => {
  for (const contract of CONTRACTS) {
    assert.ok(contract.steps.length >= 6)
    assert.ok(new Set(contract.steps.map((step) => step.scene)).size >= 2)
    assert.ok(contract.rewardMultiplier > 1)
    assert.ok(contract.targetSeconds > 0)
  }
})

test('dispatch offers rotate without duplicates', () => {
  const first = getContractOffers(0, 'oil-stand')
  const second = getContractOffers(1, 'oil-stand')
  assert.equal(new Set(first.map((contract) => contract.id)).size, 3)
  assert.notDeepEqual(first.map((contract) => contract.id), second.map((contract) => contract.id))
})

test('performance rewards speed and bounded streaks', () => {
  assert.equal(getPerformanceMultiplier(30, 45, 0), 1.35)
  assert.equal(getPerformanceMultiplier(50, 45, 0), 1.15)
  assert.equal(getPerformanceMultiplier(80, 45, 20), 1.3)
})

test('unknown contracts fall back to the first dispatch', () => {
  assert.equal(getContract('missing').id, CONTRACTS[0].id)
})
