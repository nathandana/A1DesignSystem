import { sampleChargingHistory, sampleRangeTrend, sampleVehicleData, sampleVehicles } from './sampleData.js'

const API_BASE = import.meta.env.VITE_TESLA_API_BASE || '/api/tesla'

async function getJson(path, options) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.error || body.response || `Request failed with ${response.status}`)
  }
  return body
}

export async function getTeslaConfig() {
  try {
    return await getJson('/config')
  } catch {
    return {
      connected: false,
      configured: false,
      demo: true,
    }
  }
}

export function getConnectUrl() {
  return `${API_BASE}/oauth/start`
}

export function getLogoutUrl() {
  return `${API_BASE}/logout`
}

export async function fetchVehicleOverview() {
  const config = await getTeslaConfig()
  if (!config.connected) {
    return {
      config,
      vehicles: sampleVehicles,
      selectedVehicle: sampleVehicles[0],
      vehicleData: sampleVehicleData,
      chargingHistory: sampleChargingHistory,
      rangeTrend: sampleRangeTrend,
      mode: 'demo',
    }
  }

  const vehiclesBody = await getJson('/vehicles')
  const vehicles = vehiclesBody.response || vehiclesBody.vehicles || []
  const selectedVehicle = vehicles[0] || null
  let vehicleData = null
  let chargingHistory = []

  if (selectedVehicle?.vin) {
    const vehicleDataBody = await getJson(`/vehicles/${selectedVehicle.vin}/vehicle_data`)
    vehicleData = vehicleDataBody.response ? vehicleDataBody : vehicleDataBody
  }

  try {
    const historyBody = await getJson('/charging/history?page_size=10')
    chargingHistory = normalizeChargingHistory(historyBody.response?.data || historyBody.response || historyBody.data || [])
  } catch {
    chargingHistory = []
  }

  return {
    config,
    vehicles,
    selectedVehicle,
    vehicleData,
    chargingHistory,
    rangeTrend: buildRangeTrend(vehicleData),
    mode: 'live',
  }
}

function miles(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : null
}

export function normalizeVehicle(vehicleData, fallbackVehicle) {
  const response = vehicleData?.response || vehicleData || {}
  const charge = response.charge_state || {}
  const climate = response.climate_state || {}
  const drive = response.drive_state || {}
  const vehicle = response.vehicle_state || {}
  const displayName = vehicleData?.display_name || response.display_name || fallbackVehicle?.display_name || 'Tesla'
  const state = vehicleData?.state || response.state || fallbackVehicle?.state || 'unknown'
  const odometer = typeof vehicle.odometer === 'number' ? Math.round(vehicle.odometer) : null
  const batteryLevel = typeof charge.battery_level === 'number' ? charge.battery_level : null
  const range = miles(charge.est_battery_range ?? charge.battery_range)
  const chargeLimit = typeof charge.charge_limit_soc === 'number' ? charge.charge_limit_soc : null
  const chargingState = charge.charging_state || 'Unknown'
  const chargerPower = typeof charge.charger_power === 'number' ? charge.charger_power : null
  const chargeRate = typeof charge.charge_rate === 'number' ? Math.round(charge.charge_rate) : null
  const minutesToFull = typeof charge.minutes_to_full_charge === 'number' ? charge.minutes_to_full_charge : null
  const insideTemp = celsiusToFahrenheit(climate.inside_temp)
  const outsideTemp = celsiusToFahrenheit(climate.outside_temp)

  return {
    displayName,
    vin: vehicleData?.vin || response.vin || fallbackVehicle?.vin || '',
    state,
    firmware: vehicle.car_version || 'Unknown',
    locked: vehicle.locked,
    sentryMode: vehicle.sentry_mode,
    odometer,
    batteryLevel,
    range,
    chargeLimit,
    chargingState,
    chargerPower,
    chargeRate,
    minutesToFull,
    cable: charge.conn_charge_cable || 'Unknown',
    chargePortOpen: charge.charge_port_door_open,
    energyAdded: numberOrNull(charge.charge_energy_added),
    ratedMilesAdded: miles(charge.charge_miles_added_rated),
    climateOn: climate.is_climate_on,
    preconditioning: climate.is_preconditioning,
    insideTemp,
    outsideTemp,
    heading: drive.heading,
    speed: drive.speed,
    latitude: drive.latitude,
    longitude: drive.longitude,
  }
}

function numberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function celsiusToFahrenheit(value) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.round((value * 9) / 5 + 32)
    : null
}

function normalizeChargingHistory(items) {
  return items.map((item, index) => ({
    id: item.id || item.session_id || `${index}`,
    date: item.charge_start_date_time || item.start_date_time || item.date || '',
    site: item.site_location_name || item.location || item.site || 'Charging session',
    kwh: numberOrNull(item.energy_added || item.kwh || item.total_energy),
    cost: numberOrNull(item.fees || item.cost || item.total_cost),
    rangeAdded: numberOrNull(item.range_added || item.charge_miles_added_rated),
  }))
}

function buildRangeTrend(vehicleData) {
  const vehicle = normalizeVehicle(vehicleData)
  if (!vehicle.batteryLevel && !vehicle.range) return []
  return [
    { date: 'Current', soc: vehicle.batteryLevel || 0, range: vehicle.range || 0 },
  ]
}
