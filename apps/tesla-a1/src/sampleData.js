export const sampleVehicles = [
  {
    id: 'demo-model-y',
    vehicle_id: 1182601247,
    vin: 'DEMOY123456789012',
    display_name: 'Juniper',
    state: 'online',
    option_codes: '',
  },
]

export const sampleVehicleData = {
  id: 'demo-model-y',
  vehicle_id: 1182601247,
  vin: 'DEMOY123456789012',
  display_name: 'Juniper',
  state: 'online',
  response: {
    charge_state: {
      battery_level: 68,
      battery_range: 211.4,
      est_battery_range: 203.8,
      ideal_battery_range: 254.5,
      charge_limit_soc: 80,
      charging_state: 'Charging',
      charger_actual_current: 32,
      charger_power: 7,
      charge_rate: 27.8,
      minutes_to_full_charge: 95,
      time_to_full_charge: 1.58,
      conn_charge_cable: 'SAE',
      charge_port_door_open: true,
      charge_energy_added: 18.2,
      charge_miles_added_rated: 72.4,
      battery_heater_on: false,
    },
    climate_state: {
      inside_temp: 22.1,
      outside_temp: 31.3,
      driver_temp_setting: 21,
      passenger_temp_setting: 21,
      is_climate_on: true,
      is_preconditioning: false,
      fan_status: 2,
    },
    drive_state: {
      latitude: 35.7796,
      longitude: -78.6382,
      heading: 92,
      speed: null,
      power: 0,
      shift_state: null,
    },
    vehicle_state: {
      car_version: '2026.20.3',
      locked: true,
      odometer: 18428.7,
      sentry_mode: true,
      valet_mode: false,
      fd_window: 0,
      fp_window: 0,
      rd_window: 0,
      rp_window: 0,
    },
  },
}

export const sampleChargingHistory = [
  { id: '1', date: '2026-07-20', site: 'Home', kwh: 31.2, cost: 3.74, rangeAdded: 126 },
  { id: '2', date: '2026-07-18', site: 'Raleigh Supercharger', kwh: 42.8, cost: 16.91, rangeAdded: 172 },
  { id: '3', date: '2026-07-15', site: 'Home', kwh: 24.6, cost: 2.95, rangeAdded: 98 },
  { id: '4', date: '2026-07-11', site: 'Home', kwh: 28.4, cost: 3.41, rangeAdded: 113 },
  { id: '5', date: '2026-07-08', site: 'Durham Supercharger', kwh: 39.1, cost: 14.86, rangeAdded: 156 },
]

export const sampleRangeTrend = [
  { date: 'Jul 1', soc: 54, range: 162 },
  { date: 'Jul 5', soc: 82, range: 248 },
  { date: 'Jul 9', soc: 37, range: 113 },
  { date: 'Jul 13', soc: 76, range: 231 },
  { date: 'Jul 17', soc: 61, range: 184 },
  { date: 'Jul 21', soc: 68, range: 204 },
  { date: 'Jul 25', soc: 68, range: 204 },
]
