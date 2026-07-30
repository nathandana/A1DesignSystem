import { BUSINESSES } from './gameData.js'

export const SCENE_STARTS = {
  workshop: { x: 51, y: 79 },
  road: { x: 15, y: 78 },
  salvage: { x: 53, y: 82 },
}

const workshopStep = (station, instruction) => {
  const stations = {
    service: { x: 24, y: 48, icon: 'car_repair' },
    tools: { x: 48, y: 27, icon: 'handyman' },
    office: { x: 69, y: 29, icon: 'badge' },
    tires: { x: 81, y: 49, icon: 'tire_repair' },
    exit: { x: 87, y: 81, icon: 'location_city' },
  }
  return { scene: 'workshop', station, instruction, ...stations[station] }
}

const roadStep = (x, y, instruction) => ({
  scene: 'road',
  x,
  y,
  instruction,
  icon: 'navigation',
})

const salvageStep = (x, y, instruction) => ({
  scene: 'salvage',
  x,
  y,
  instruction,
  icon: 'search',
  hidden: true,
})

export const CONTRACTS = [
  {
    id: 'roadside-rescue',
    title: 'Roadside rescue',
    summary: 'Reach a stranded driver, diagnose the fault, and bring them home.',
    icon: 'emergency',
    rewardMultiplier: 1.7,
    reputationMultiplier: 1.4,
    targetSeconds: 48,
    steps: [
      workshopStep('tools', 'Pack the roadside tool kit'),
      roadStep(24, 71, 'Clear the downtown intersection'),
      roadStep(50, 57, 'Follow the river road'),
      roadStep(77, 65, 'Reach the stranded driver'),
      roadStep(83, 34, 'Complete the roadside test'),
      workshopStep('office', 'File the rescue report'),
    ],
  },
  {
    id: 'salvage-hunt',
    title: 'Rare parts hunt',
    summary: 'Search the salvage yard for a valuable part before another buyer finds it.',
    icon: 'search',
    rewardMultiplier: 1.85,
    reputationMultiplier: 1.15,
    targetSeconds: 52,
    steps: [
      workshopStep('tools', 'Review the salvage manifest'),
      salvageStep(22, 69, 'Search the old import stack'),
      salvageStep(47, 48, 'Check the engine pallets'),
      salvageStep(77, 55, 'Find the matching assembly'),
      salvageStep(70, 24, 'Collect the rare part'),
      workshopStep('service', 'Install the salvaged part'),
    ],
  },
  {
    id: 'performance-test',
    title: 'Performance test',
    summary: 'Tune a customer car, then prove it on a timed city test loop.',
    icon: 'speed',
    rewardMultiplier: 2.05,
    reputationMultiplier: 1.25,
    targetSeconds: 45,
    steps: [
      workshopStep('service', 'Complete the pre-drive inspection'),
      roadStep(28, 78, 'Launch onto the test route'),
      roadStep(53, 64, 'Clip the downtown apex'),
      roadStep(84, 68, 'Run the riverside sweeper'),
      roadStep(75, 26, 'Brake for the construction turn'),
      roadStep(38, 20, 'Finish the hill section'),
      workshopStep('tools', 'Review the test data'),
    ],
  },
  {
    id: 'auction-flip',
    title: 'Auction flip',
    summary: 'Recover a rough auction car, source parts, and deliver a profitable rebuild.',
    icon: 'gavel',
    rewardMultiplier: 2.25,
    reputationMultiplier: 1.2,
    targetSeconds: 62,
    steps: [
      salvageStep(20, 35, 'Locate the auction car'),
      salvageStep(43, 25, 'Recover a usable engine'),
      salvageStep(83, 30, 'Find a clean wheel set'),
      workshopStep('service', 'Rebuild the auction car'),
      roadStep(36, 67, 'Road-test the rebuild'),
      roadStep(71, 67, 'Deliver the finished car'),
      workshopStep('office', 'Close the auction sale'),
    ],
  },
  {
    id: 'fleet-emergency',
    title: 'Fleet emergency',
    summary: 'Keep three delivery vans moving through a chain of urgent service calls.',
    icon: 'local_shipping',
    rewardMultiplier: 2.4,
    reputationMultiplier: 1.5,
    targetSeconds: 58,
    steps: [
      workshopStep('office', 'Accept the fleet dispatch'),
      roadStep(20, 44, 'Reach van one downtown'),
      roadStep(48, 75, 'Intercept van two'),
      roadStep(88, 59, 'Repair van three by the river'),
      roadStep(62, 18, 'Escort the fleet through the hill'),
      workshopStep('tires', 'Restock the fleet parts'),
      workshopStep('office', 'Complete the fleet invoice'),
    ],
  },
  {
    id: 'mystery-rattle',
    title: 'Mystery rattle',
    summary: 'Chase an intermittent fault across the shop, yard, and city.',
    icon: 'troubleshoot',
    rewardMultiplier: 2.6,
    reputationMultiplier: 1.65,
    targetSeconds: 66,
    steps: [
      workshopStep('service', 'Reproduce the mystery noise'),
      roadStep(32, 72, 'Test it over rough pavement'),
      salvageStep(35, 52, 'Find a matching suspension arm'),
      salvageStep(76, 61, 'Recover the correct bushing'),
      workshopStep('tools', 'Fit and torque the repair'),
      roadStep(80, 32, 'Confirm the fix on the hill'),
      workshopStep('office', 'Return the silent car'),
    ],
  },
]

export const ROAD_HAZARDS = [
  { id: 'puddle', x: 34, y: 68, icon: 'water_drop', label: 'Deep puddle' },
  { id: 'works', x: 72, y: 25, icon: 'construction', label: 'Road works' },
  { id: 'pothole', x: 79, y: 63, icon: 'warning', label: 'Pothole' },
]

export function getContract(contractId) {
  return CONTRACTS.find((contract) => contract.id === contractId) ?? CONTRACTS[0]
}

export function getContractOffers(serial = 0, businessId = BUSINESSES[0].id) {
  const businessIndex = Math.max(0, BUSINESSES.findIndex((business) => business.id === businessId))
  const start = (serial * 2 + businessIndex) % CONTRACTS.length
  return [0, 2, 4].map((offset) => CONTRACTS[(start + offset) % CONTRACTS.length])
}

export function getPerformanceMultiplier(elapsedSeconds, targetSeconds, streak = 0) {
  const paceBonus = elapsedSeconds <= targetSeconds
    ? 0.35
    : elapsedSeconds <= targetSeconds * 1.35
      ? 0.15
      : 0
  return 1 + paceBonus + Math.min(0.3, Math.max(0, streak) * 0.05)
}
