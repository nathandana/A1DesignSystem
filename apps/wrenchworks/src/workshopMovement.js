import { BUSINESSES } from './gameData.js'

export const PLAYER_START = { x: 51, y: 79 }

export const WORLD_STATIONS = [
  {
    id: 'service',
    x: 24,
    y: 48,
    label: 'Service bay',
    shortLabel: 'Bay',
    icon: 'car_repair',
    panel: null,
  },
  {
    id: 'tools',
    x: 48,
    y: 27,
    label: 'Tool bench',
    shortLabel: 'Tools',
    icon: 'handyman',
    panel: 'tools',
  },
  {
    id: 'office',
    x: 69,
    y: 29,
    label: 'Front office',
    shortLabel: 'Office',
    icon: 'badge',
    panel: 'office',
  },
  {
    id: 'tires',
    x: 81,
    y: 49,
    label: 'Parts station',
    shortLabel: 'Parts',
    icon: 'tire_repair',
    panel: null,
  },
  {
    id: 'exit',
    x: 87,
    y: 81,
    label: 'City exit',
    shortLabel: 'City',
    icon: 'location_city',
    panel: 'city',
  },
]

const ROUTES = [
  [
    ['service', 'Inspect the customer car'],
    ['tools', 'Collect the oil and filter'],
    ['service', 'Finish the oil change'],
    ['office', 'Return the keys'],
  ],
  [
    ['tires', 'Select the tire set'],
    ['service', 'Raise the customer car'],
    ['tires', 'Balance the wheels'],
    ['office', 'Close the work order'],
  ],
  [
    ['service', 'Inspect the brakes'],
    ['tools', 'Collect pads and tools'],
    ['tires', 'Machine the rotors'],
    ['service', 'Road-test the repair'],
  ],
  [
    ['tools', 'Mix the detailing kit'],
    ['service', 'Correct the paint'],
    ['tires', 'Dress the wheels'],
    ['office', 'Present the finished car'],
  ],
  [
    ['tools', 'Review the diagnostics'],
    ['service', 'Strip the engine'],
    ['tools', 'Tune the new build'],
    ['office', 'Print the dyno sheet'],
  ],
  [
    ['service', 'Measure the frame'],
    ['tools', 'Prepare the repair cart'],
    ['service', 'Finish the restoration'],
    ['office', 'Complete the inspection'],
  ],
  [
    ['service', 'Inspect the trade-in'],
    ['tools', 'Prepare it for sale'],
    ['exit', 'Take the buyer for a drive'],
    ['office', 'Hand over the keys'],
  ],
  [
    ['office', 'Review the customer order'],
    ['service', 'Prepare the new car'],
    ['exit', 'Stage the delivery'],
    ['office', 'Complete the handover'],
  ],
  [
    ['office', 'Assign the fleet order'],
    ['service', 'Inspect the fleet'],
    ['exit', 'Dispatch the transporters'],
    ['office', 'Close the fleet contract'],
  ],
  [
    ['office', 'Choose the next market'],
    ['tools', 'Ready the launch kit'],
    ['exit', 'Open the new territory'],
    ['office', 'Welcome the new team'],
  ],
]

export function getStation(stationId) {
  return WORLD_STATIONS.find((station) => station.id === stationId) ?? WORLD_STATIONS[0]
}

export function getJobRoute(businessId) {
  const index = Math.max(0, BUSINESSES.findIndex((business) => business.id === businessId))
  return ROUTES[index].map(([stationId, instruction]) => ({
    ...getStation(stationId),
    instruction,
  }))
}

export function getWorldTier(businessId) {
  const index = Math.max(0, BUSINESSES.findIndex((business) => business.id === businessId))
  if (index >= 7) return 'dealership'
  if (index >= 4) return 'performance'
  return 'neighborhood'
}

export function distanceBetween(first, second) {
  const xDistance = (first.x - second.x) * 1.5
  const yDistance = first.y - second.y
  return Math.hypot(xDistance, yDistance)
}

export function getNearbyStation(position, radius = 8) {
  return WORLD_STATIONS.find((station) => distanceBetween(position, station) <= radius) ?? null
}

export function stepPosition(position, vector, elapsedSeconds, speed = 24) {
  const magnitude = Math.hypot(vector.x, vector.y)
  if (!magnitude || elapsedSeconds <= 0) return position

  const normalizedX = vector.x / magnitude
  const normalizedY = vector.y / magnitude

  return {
    x: Math.min(93, Math.max(7, position.x + normalizedX * speed * elapsedSeconds / 1.5)),
    y: Math.min(89, Math.max(20, position.y + normalizedY * speed * elapsedSeconds)),
  }
}
