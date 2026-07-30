import test from 'node:test'
import assert from 'node:assert/strict'
import {
  advanceGame,
  chooseDecision,
  claimMilestone,
  createNewGame,
  getBusinessEconomy,
  getEmpireEconomy,
  getFranchiseMultiplier,
  getFranchiseReadiness,
  getPendingDecision,
  hireStaff,
  loadGame,
  normalizeGame,
  saveGame,
  startFranchise,
  unlockBusiness,
  upgradeBusiness,
  workJob,
} from './gameEngine.js'
import { BUSINESSES, OFFLINE_LIMIT_SECONDS, SAVE_KEY } from './gameData.js'

function createMemoryStorage() {
  const values = new Map()
  return {
    getItem(key) {
      return values.get(key) ?? null
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
    removeItem(key) {
      values.delete(key)
    },
  }
}

test('a new game starts with an automated oil stand', () => {
  const now = 100000
  const game = createNewGame(now)
  const firstBusiness = game.businesses[BUSINESSES[0].id]

  assert.equal(game.cash, 120)
  assert.equal(game.activeBusinessId, BUSINESSES[0].id)
  assert.equal(firstBusiness.unlocked, true)
  assert.equal(firstBusiness.level, 1)
  assert.equal(firstBusiness.staff, 1)
  assert.ok(getEmpireEconomy(game).incomeRate > 0)
})

test('idle progress earns cash and reputation from elapsed time', () => {
  const now = 100000
  const game = createNewGame(now)
  const economy = getEmpireEconomy(game)
  const progressed = advanceGame(game, now + 10000)

  assert.equal(progressed.cash, game.cash + economy.incomeRate * 10)
  assert.equal(progressed.reputation, game.reputation + economy.reputationRate * 10)
  assert.equal(progressed.lastTickAt, now + 10000)
})

test('idle progress never exceeds the 12-hour offline cap', () => {
  const now = 100000
  const game = createNewGame(now)
  const economy = getEmpireEconomy(game)
  const progressed = advanceGame(game, now + OFFLINE_LIMIT_SECONDS * 3000)

  assert.equal(
    progressed.cash,
    game.cash + economy.incomeRate * OFFLINE_LIMIT_SECONDS,
  )
})

test('hands-on jobs pay immediately and respect their cooldown', () => {
  const now = 100000
  const game = createNewGame(now)
  const economy = getBusinessEconomy(game, BUSINESSES[0].id)
  const worked = workJob(game, BUSINESSES[0].id, now)
  const repeated = workJob(worked, BUSINESSES[0].id, now + 100)

  assert.equal(worked.cash, game.cash + economy.manualRevenue)
  assert.equal(worked.lastEvent.type, 'success')
  assert.equal(repeated.cash, worked.cash)
  assert.equal(repeated.lastEvent.type, 'error')
})

test('upgrades and hires spend cash and increase production', () => {
  const firstId = BUSINESSES[0].id
  const game = {
    ...createNewGame(100000),
    cash: 100000,
  }
  const initialRate = getBusinessEconomy(game, firstId).incomeRate
  const upgraded = upgradeBusiness(game, firstId)
  const hired = hireStaff(upgraded, firstId)

  assert.equal(upgraded.businesses[firstId].level, 2)
  assert.equal(hired.businesses[firstId].staff, 2)
  assert.ok(getBusinessEconomy(hired, firstId).incomeRate > initialRate)
  assert.ok(hired.cash < game.cash)
})

test('business unlocks require both reputation and cash', () => {
  const tireBay = BUSINESSES[1]
  const base = createNewGame(100000)
  const blocked = unlockBusiness(base, tireBay.id)
  const prepared = {
    ...base,
    cash: tireBay.unlockCost,
    reputation: tireBay.reputationRequired,
  }
  const unlocked = unlockBusiness(prepared, tireBay.id)

  assert.equal(blocked.businesses[tireBay.id].unlocked, false)
  assert.equal(blocked.lastEvent.type, 'error')
  assert.equal(unlocked.businesses[tireBay.id].unlocked, true)
  assert.equal(unlocked.activeBusinessId, tireBay.id)
  assert.equal(unlocked.cash, 0)
})

test('strategic decisions create permanent production bonuses', () => {
  const base = {
    ...createNewGame(100000),
    lifetimeEarned: 1000,
  }
  const pending = getPendingDecision(base)
  const initialRate = getEmpireEconomy(base).incomeRate
  const choice = pending.choices.find((item) => item.effect.revenue)
  const decided = chooseDecision(base, pending.id, choice.id)

  assert.equal(decided.decisionChoices[pending.id], choice.id)
  assert.ok(getEmpireEconomy(decided).incomeRate > initialRate)
  assert.notEqual(getPendingDecision(decided)?.id, pending.id)
})

test('completed milestones can be claimed once', () => {
  const base = {
    ...createNewGame(100000),
    lifetimeEarned: 100,
  }
  const claimed = claimMilestone(base, 'first-hundred')
  const repeated = claimMilestone(claimed, 'first-hundred')

  assert.equal(claimed.cash, base.cash + 150)
  assert.deepEqual(claimed.claimedMilestones, ['first-hundred'])
  assert.equal(repeated.cash, claimed.cash)
  assert.equal(repeated.lastEvent.type, 'error')
})

test('saved games reload with offline progress', () => {
  const storage = createMemoryStorage()
  const now = 100000
  const game = createNewGame(now)

  assert.equal(saveGame(game, storage), true)
  assert.ok(storage.getItem(SAVE_KEY))

  const loaded = loadGame(storage, now + 60000)
  assert.ok(loaded.game.cash > game.cash)
  assert.ok(loaded.offlineSummary.earned > 0)
  assert.equal(loaded.offlineSummary.elapsedSeconds, 60)
})

test('corrupted saves recover to a playable game', () => {
  const normalized = normalizeGame({
    cash: -50,
    reputation: 'nope',
    businesses: {
      'oil-stand': {
        unlocked: false,
        level: 999,
        staff: -20,
      },
    },
  }, 100000)

  assert.equal(normalized.cash, 0)
  assert.equal(normalized.reputation, 0)
  assert.equal(normalized.businesses['oil-stand'].unlocked, true)
  assert.equal(normalized.businesses['oil-stand'].level, 25)
  assert.equal(normalized.businesses['oil-stand'].staff, 1)
})

test('a franchise resets shops and adds a permanent multiplier', () => {
  const prepared = createNewGame(100000)
  prepared.runEarned = 100000000000
  prepared.cash = 100000000000
  for (const business of BUSINESSES.slice(0, 8)) {
    prepared.businesses[business.id] = {
      ...prepared.businesses[business.id],
      unlocked: true,
      level: 5,
      staff: 3,
    }
  }

  assert.equal(getFranchiseReadiness(prepared).ready, true)
  const franchised = startFranchise(prepared, 200000)

  assert.equal(franchised.franchises, 1)
  assert.equal(franchised.businesses[BUSINESSES[0].id].unlocked, true)
  assert.equal(franchised.businesses[BUSINESSES[1].id].unlocked, false)
  assert.equal(franchised.runEarned, 0)
  assert.equal(getFranchiseMultiplier(franchised), 1.6)
})
