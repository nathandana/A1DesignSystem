import {
  BUSINESSES,
  DECISIONS,
  FRANCHISE_REQUIREMENTS,
  MAX_SERVICE_LEVEL,
  MILESTONES,
  OFFLINE_LIMIT_SECONDS,
  SAVE_KEY,
  SAVE_VERSION,
} from './gameData.js'
import { formatMoney } from './formatters.js'

const businessById = new Map(BUSINESSES.map((business) => [business.id, business]))

function freshBusinessState(business, unlocked = false) {
  return {
    id: business.id,
    unlocked,
    level: unlocked ? 1 : 0,
    staff: unlocked ? 1 : 0,
    manager: false,
    lastManualAt: 0,
  }
}

export function createNewGame(now = Date.now()) {
  return {
    version: SAVE_VERSION,
    cash: 120,
    runEarned: 0,
    lifetimeEarned: 0,
    reputation: 0,
    franchises: 0,
    activeBusinessId: BUSINESSES[0].id,
    businesses: Object.fromEntries(
      BUSINESSES.map((business, index) => [
        business.id,
        freshBusinessState(business, index === 0),
      ]),
    ),
    decisionChoices: {},
    claimedMilestones: [],
    createdAt: now,
    lastTickAt: now,
    eventSerial: 0,
    lastEvent: null,
  }
}

function numberOr(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback
}

export function normalizeGame(value, now = Date.now()) {
  const fresh = createNewGame(now)
  if (!value || typeof value !== 'object') return fresh

  const businesses = Object.fromEntries(
    BUSINESSES.map((business, index) => {
      const current = value.businesses?.[business.id]
      const fallback = freshBusinessState(business, index === 0)
      if (!current || typeof current !== 'object') return [business.id, fallback]
      const unlocked = index === 0 || Boolean(current.unlocked)
      return [
        business.id,
        {
          id: business.id,
          unlocked,
          level: unlocked
            ? Math.min(MAX_SERVICE_LEVEL, Math.max(1, Math.floor(numberOr(current.level, 1))))
            : 0,
          staff: unlocked ? Math.min(8, Math.max(1, Math.floor(numberOr(current.staff, 1)))) : 0,
          manager: unlocked && Boolean(current.manager),
          lastManualAt: Math.max(0, numberOr(current.lastManualAt, 0)),
        },
      ]
    }),
  )

  const requestedActiveId = businessById.has(value.activeBusinessId)
    ? value.activeBusinessId
    : BUSINESSES[0].id
  const activeBusinessId = businesses[requestedActiveId]?.unlocked
    ? requestedActiveId
    : BUSINESSES[0].id

  return {
    ...fresh,
    cash: Math.max(0, numberOr(value.cash, fresh.cash)),
    runEarned: Math.max(0, numberOr(value.runEarned, 0)),
    lifetimeEarned: Math.max(0, numberOr(value.lifetimeEarned, 0)),
    reputation: Math.max(0, numberOr(value.reputation, 0)),
    franchises: Math.max(0, Math.floor(numberOr(value.franchises, 0))),
    activeBusinessId,
    businesses,
    decisionChoices:
      value.decisionChoices && typeof value.decisionChoices === 'object'
        ? value.decisionChoices
        : {},
    claimedMilestones: Array.isArray(value.claimedMilestones)
      ? value.claimedMilestones.filter((id) => MILESTONES.some((milestone) => milestone.id === id))
      : [],
    createdAt: Math.max(0, numberOr(value.createdAt, now)),
    lastTickAt: Math.min(now, Math.max(0, numberOr(value.lastTickAt, now))),
    eventSerial: Math.max(0, Math.floor(numberOr(value.eventSerial, 0))),
    lastEvent: null,
    version: SAVE_VERSION,
  }
}

export function getDecisionBonuses(game) {
  return DECISIONS.reduce(
    (bonuses, decision) => {
      const selectedId = game.decisionChoices[decision.id]
      const choice = decision.choices.find((item) => item.id === selectedId)
      if (!choice) return bonuses
      bonuses.revenue += choice.effect.revenue ?? 0
      bonuses.speed += choice.effect.speed ?? 0
      bonuses.reputation += choice.effect.reputation ?? 0
      bonuses.manual += choice.effect.manual ?? 0
      return bonuses
    },
    { revenue: 0, speed: 0, reputation: 0, manual: 0 },
  )
}

export function getFranchiseMultiplier(game) {
  return 1 + game.franchises * 0.6
}

export function getMaxStaff(serviceState) {
  return Math.min(8, 2 + Math.floor(Math.max(0, serviceState.level - 1) / 4))
}

export function getUpgradeCost(game, businessId) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  if (!business || !serviceState?.unlocked || serviceState.level >= MAX_SERVICE_LEVEL) return Infinity
  return Math.round(business.upgradeBase * 1.65 ** Math.max(0, serviceState.level - 1))
}

export function getHireCost(game, businessId) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  if (!business || !serviceState?.unlocked || serviceState.staff >= getMaxStaff(serviceState)) return Infinity
  return Math.round(business.hireBase * 2.15 ** Math.max(0, serviceState.staff - 1))
}

export function getManagerCost(game, businessId) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  if (!business || !serviceState?.unlocked || serviceState.manager) return Infinity
  return Math.round(business.managerBase * 1.08 ** Math.max(0, serviceState.level - 5))
}

export function canHireManager(game, businessId) {
  const serviceState = game.businesses[businessId]
  return Boolean(
    serviceState?.unlocked
      && !serviceState.manager
      && serviceState.level >= 5
      && serviceState.staff >= 3,
  )
}

export function getBusinessEconomy(game, businessId) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  if (!business || !serviceState?.unlocked) {
    return {
      incomeRate: 0,
      reputationRate: 0,
      jobRevenue: 0,
      jobDuration: business?.duration ?? 0,
      manualRevenue: 0,
    }
  }

  const bonuses = getDecisionBonuses(game)
  const levelMultiplier = 1 + Math.max(0, serviceState.level - 1) * 0.24
  const managerMultiplier = serviceState.manager ? 1.8 : 1
  const franchiseMultiplier = getFranchiseMultiplier(game)
  const revenueMultiplier = (1 + bonuses.revenue) * franchiseMultiplier
  const speedMultiplier = 1 + bonuses.speed
  const reputationMultiplier = 1 + bonuses.reputation
  const jobRevenue = business.baseRevenue * levelMultiplier * revenueMultiplier
  const jobDuration = business.duration / speedMultiplier
  const crewThroughput = serviceState.staff * managerMultiplier

  return {
    incomeRate: (jobRevenue / jobDuration) * crewThroughput,
    reputationRate:
      (business.baseReputation / jobDuration)
      * crewThroughput
      * reputationMultiplier
      * Math.sqrt(franchiseMultiplier),
    jobRevenue,
    jobDuration,
    manualRevenue: jobRevenue * 0.5 * (1 + bonuses.manual),
  }
}

export function getEmpireEconomy(game) {
  return BUSINESSES.reduce(
    (totals, business) => {
      const economy = getBusinessEconomy(game, business.id)
      totals.incomeRate += economy.incomeRate
      totals.reputationRate += economy.reputationRate
      return totals
    },
    { incomeRate: 0, reputationRate: 0 },
  )
}

export function getManualCooldown(game, businessId) {
  const economy = getBusinessEconomy(game, businessId)
  return Math.min(8, Math.max(2, economy.jobDuration / 10))
}

export function getManualSecondsRemaining(game, businessId, now = Date.now()) {
  const serviceState = game.businesses[businessId]
  if (!serviceState?.unlocked) return 0
  const elapsed = Math.max(0, (now - serviceState.lastManualAt) / 1000)
  return Math.max(0, getManualCooldown(game, businessId) - elapsed)
}

export function advanceGame(game, now = Date.now(), limitSeconds = OFFLINE_LIMIT_SECONDS) {
  const elapsed = Math.min(
    Math.max(0, (now - game.lastTickAt) / 1000),
    Math.max(0, limitSeconds),
  )
  if (elapsed <= 0) return game

  const economy = getEmpireEconomy(game)
  const earned = economy.incomeRate * elapsed
  const reputationEarned = economy.reputationRate * elapsed

  return {
    ...game,
    cash: game.cash + earned,
    runEarned: game.runEarned + earned,
    lifetimeEarned: game.lifetimeEarned + earned,
    reputation: game.reputation + reputationEarned,
    lastTickAt: now,
  }
}

function withEvent(game, type, message) {
  const eventSerial = game.eventSerial + 1
  return {
    ...game,
    eventSerial,
    lastEvent: {
      id: eventSerial,
      type,
      message,
    },
  }
}

function insufficient(game, message) {
  return withEvent(game, 'error', message)
}

export function selectBusiness(game, businessId) {
  const business = businessById.get(businessId)
  if (!business || !game.businesses[businessId]?.unlocked) {
    return insufficient(game, 'Open this business before visiting it.')
  }
  return {
    ...game,
    activeBusinessId: businessId,
  }
}

export function workJob(game, businessId, now = Date.now()) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  if (!business || !serviceState?.unlocked) {
    return insufficient(game, 'Open this business before working a job.')
  }

  const economy = getBusinessEconomy(game, businessId)
  const cooldownSeconds = getManualCooldown(game, businessId)
  const elapsed = (now - serviceState.lastManualAt) / 1000
  if (elapsed < cooldownSeconds) {
    return insufficient(game, `Your bay is busy for ${Math.ceil(cooldownSeconds - elapsed)} more sec.`)
  }

  const reputationEarned = business.baseReputation * 1.5
  return withEvent(
    {
      ...game,
      cash: game.cash + economy.manualRevenue,
      runEarned: game.runEarned + economy.manualRevenue,
      lifetimeEarned: game.lifetimeEarned + economy.manualRevenue,
      reputation: game.reputation + reputationEarned,
      businesses: {
        ...game.businesses,
        [businessId]: {
          ...serviceState,
          lastManualAt: now,
        },
      },
    },
    'success',
    `${business.jobName} complete. You earned ${formatMoney(economy.manualRevenue)}.`,
  )
}

export function completeContract(
  game,
  businessId,
  rewardMultiplier = 1,
  reputationMultiplier = 1,
  contractName = 'Field contract',
  now = Date.now(),
) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  if (!business || !serviceState?.unlocked) {
    return insufficient(game, 'Open this business before taking a contract.')
  }

  const economy = getBusinessEconomy(game, businessId)
  const safeRewardMultiplier = Math.min(4, Math.max(1, numberOr(rewardMultiplier, 1)))
  const safeReputationMultiplier = Math.min(4, Math.max(1, numberOr(reputationMultiplier, 1)))
  const payout = economy.manualRevenue * safeRewardMultiplier
  const reputationEarned = business.baseReputation * 1.5 * safeReputationMultiplier

  return withEvent(
    {
      ...game,
      cash: game.cash + payout,
      runEarned: game.runEarned + payout,
      lifetimeEarned: game.lifetimeEarned + payout,
      reputation: game.reputation + reputationEarned,
      businesses: {
        ...game.businesses,
        [businessId]: {
          ...serviceState,
          lastManualAt: now,
        },
      },
    },
    'success',
    `${contractName} complete. You earned ${formatMoney(payout)}.`,
  )
}

export function upgradeBusiness(game, businessId) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  const cost = getUpgradeCost(game, businessId)
  if (!business || !serviceState?.unlocked) {
    return insufficient(game, 'Open this business before upgrading it.')
  }
  if (serviceState.level >= MAX_SERVICE_LEVEL) {
    return insufficient(game, `${business.shortName} is fully upgraded.`)
  }
  if (game.cash < cost) {
    return insufficient(game, `You need ${formatMoney(cost - game.cash)} more for that upgrade.`)
  }

  return withEvent(
    {
      ...game,
      cash: game.cash - cost,
      businesses: {
        ...game.businesses,
        [businessId]: {
          ...serviceState,
          level: serviceState.level + 1,
        },
      },
    },
    'success',
    `${business.shortName} reached level ${serviceState.level + 1}.`,
  )
}

export function hireStaff(game, businessId) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  const maxStaff = serviceState ? getMaxStaff(serviceState) : 0
  const cost = getHireCost(game, businessId)
  if (!business || !serviceState?.unlocked) {
    return insufficient(game, 'Open this business before hiring a technician.')
  }
  if (serviceState.staff >= maxStaff) {
    return insufficient(game, 'Upgrade this business to make room for another technician.')
  }
  if (game.cash < cost) {
    return insufficient(game, `You need ${formatMoney(cost - game.cash)} more to hire.`)
  }

  return withEvent(
    {
      ...game,
      cash: game.cash - cost,
      businesses: {
        ...game.businesses,
        [businessId]: {
          ...serviceState,
          staff: serviceState.staff + 1,
        },
      },
    },
    'success',
    `A new technician joined ${business.shortName}.`,
  )
}

export function hireManager(game, businessId) {
  const business = businessById.get(businessId)
  const serviceState = game.businesses[businessId]
  const cost = getManagerCost(game, businessId)
  if (!business || !serviceState?.unlocked) {
    return insufficient(game, 'Open this business before promoting a manager.')
  }
  if (!canHireManager(game, businessId)) {
    return insufficient(game, 'Reach level 5 with 3 technicians before promoting a manager.')
  }
  if (game.cash < cost) {
    return insufficient(game, `You need ${formatMoney(cost - game.cash)} more for the promotion.`)
  }

  return withEvent(
    {
      ...game,
      cash: game.cash - cost,
      businesses: {
        ...game.businesses,
        [businessId]: {
          ...serviceState,
          manager: true,
        },
      },
    },
    'success',
    `${business.shortName} now has a manager and earns 80% faster.`,
  )
}

export function unlockBusiness(game, businessId) {
  const businessIndex = BUSINESSES.findIndex((business) => business.id === businessId)
  const business = BUSINESSES[businessIndex]
  const serviceState = game.businesses[businessId]
  if (!business || !serviceState) return insufficient(game, 'That business is not available.')
  if (serviceState.unlocked) return selectBusiness(game, businessId)

  const previous = BUSINESSES[businessIndex - 1]
  if (previous && !game.businesses[previous.id]?.unlocked) {
    return insufficient(game, `Open ${previous.shortName} first.`)
  }
  if (game.reputation < business.reputationRequired) {
    return insufficient(
      game,
      `You need ${Math.ceil(business.reputationRequired - game.reputation)} more reputation.`,
    )
  }
  if (game.cash < business.unlockCost) {
    return insufficient(game, `You need ${formatMoney(business.unlockCost - game.cash)} more to open.`)
  }

  return withEvent(
    {
      ...game,
      cash: game.cash - business.unlockCost,
      activeBusinessId: businessId,
      businesses: {
        ...game.businesses,
        [businessId]: freshBusinessState(business, true),
      },
    },
    'success',
    `${business.name} is open. Your first technician is already working.`,
  )
}

export function getPendingDecision(game) {
  return DECISIONS.find(
    (decision) =>
      game.lifetimeEarned >= decision.requiredLifetime
      && !game.decisionChoices[decision.id],
  ) ?? null
}

export function chooseDecision(game, decisionId, choiceId) {
  const decision = DECISIONS.find((item) => item.id === decisionId)
  const choice = decision?.choices.find((item) => item.id === choiceId)
  if (!decision || !choice) return insufficient(game, 'That choice is not available.')
  if (game.decisionChoices[decisionId]) {
    return insufficient(game, 'You already made this decision.')
  }
  if (game.lifetimeEarned < decision.requiredLifetime) {
    return insufficient(game, 'Keep growing before making this decision.')
  }

  return withEvent(
    {
      ...game,
      decisionChoices: {
        ...game.decisionChoices,
        [decisionId]: choiceId,
      },
    },
    'success',
    `${choice.label} is now part of the Wrenchworks playbook.`,
  )
}

export function getMilestoneValue(game, milestone) {
  if (milestone.metric === 'lifetimeEarned') return game.lifetimeEarned
  if (milestone.metric === 'reputation') return game.reputation
  if (milestone.metric === 'franchises') return game.franchises

  const serviceStates = Object.values(game.businesses)
  if (milestone.metric === 'staff') {
    return serviceStates.reduce((total, service) => total + service.staff, 0)
  }
  if (milestone.metric === 'upgrades') {
    return serviceStates.reduce((total, service) => total + Math.max(0, service.level - 1), 0)
  }
  if (milestone.metric === 'managers') {
    return serviceStates.filter((service) => service.manager).length
  }
  if (milestone.metric === 'businesses') {
    return serviceStates.filter((service) => service.unlocked).length
  }
  return 0
}

export function claimMilestone(game, milestoneId) {
  const milestone = MILESTONES.find((item) => item.id === milestoneId)
  if (!milestone) return insufficient(game, 'That milestone is not available.')
  if (game.claimedMilestones.includes(milestoneId)) {
    return insufficient(game, 'You already claimed this milestone.')
  }
  if (getMilestoneValue(game, milestone) < milestone.target) {
    return insufficient(game, 'Keep building to finish this milestone.')
  }

  return withEvent(
    {
      ...game,
      cash: game.cash + milestone.reward,
      claimedMilestones: [...game.claimedMilestones, milestoneId],
    },
    'success',
    `${milestone.title} complete. ${formatMoney(milestone.reward)} added to the shop.`,
  )
}

export function getFranchiseReadiness(game) {
  const businessCount = Object.values(game.businesses).filter((business) => business.unlocked).length
  return {
    businessCount,
    businessTarget: FRANCHISE_REQUIREMENTS.businessCount,
    runEarned: game.runEarned,
    runEarnedTarget: FRANCHISE_REQUIREMENTS.runEarned,
    ready:
      businessCount >= FRANCHISE_REQUIREMENTS.businessCount
      && game.runEarned >= FRANCHISE_REQUIREMENTS.runEarned,
  }
}

export function startFranchise(game, now = Date.now()) {
  const readiness = getFranchiseReadiness(game)
  if (!readiness.ready) {
    return insufficient(game, 'Open the dealership and earn $100 billion in this run first.')
  }

  const franchises = game.franchises + 1
  const startingCash = 120 * 5 ** franchises
  const retainedReputation = Math.floor(game.reputation * 0.1) + franchises * 25
  const resetBusinesses = Object.fromEntries(
    BUSINESSES.map((business, index) => [
      business.id,
      freshBusinessState(business, index === 0),
    ]),
  )

  return withEvent(
    {
      ...game,
      cash: startingCash,
      runEarned: 0,
      reputation: retainedReputation,
      franchises,
      activeBusinessId: BUSINESSES[0].id,
      businesses: resetBusinesses,
      lastTickAt: now,
    },
    'success',
    `Franchise ${franchises} is open. All income now has a ${Math.round(franchises * 60)}% franchise bonus.`,
  )
}

export function loadGame(storage = globalThis.localStorage, now = Date.now()) {
  if (!storage) {
    return {
      game: createNewGame(now),
      offlineSummary: null,
    }
  }

  try {
    const raw = storage.getItem(SAVE_KEY)
    if (!raw) {
      return {
        game: createNewGame(now),
        offlineSummary: null,
      }
    }

    const normalized = normalizeGame(JSON.parse(raw), now)
    const elapsedSeconds = Math.min(
      Math.max(0, (now - normalized.lastTickAt) / 1000),
      OFFLINE_LIMIT_SECONDS,
    )
    const beforeCash = normalized.cash
    const beforeReputation = normalized.reputation
    const game = advanceGame(normalized, now)
    const earned = game.cash - beforeCash
    const reputationEarned = game.reputation - beforeReputation

    return {
      game,
      offlineSummary:
        elapsedSeconds >= 10 && earned > 0
          ? {
              elapsedSeconds,
              earned,
              reputationEarned,
              capped: now - normalized.lastTickAt > OFFLINE_LIMIT_SECONDS * 1000,
            }
          : null,
    }
  } catch {
    return {
      game: createNewGame(now),
      offlineSummary: null,
    }
  }
}

export function saveGame(game, storage = globalThis.localStorage) {
  if (!storage) return false
  try {
    storage.setItem(
      SAVE_KEY,
      JSON.stringify({
        ...game,
        lastEvent: null,
      }),
    )
    return true
  } catch {
    return false
  }
}

export function clearSavedGame(storage = globalThis.localStorage) {
  if (!storage) return false
  try {
    storage.removeItem(SAVE_KEY)
    return true
  } catch {
    return false
  }
}
