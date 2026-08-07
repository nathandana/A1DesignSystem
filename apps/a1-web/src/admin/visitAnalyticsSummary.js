const TONES = ['accent', 'info', 'success', 'warn', 'error', 'neutral']

function validDate(value) {
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date : null
}

function utcDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function durationSeconds(visit) {
  const start = validDate(visit?.started_at)
  const end = validDate(visit?.ended_at ?? visit?.last_seen_at)
  if (!start || !end || end < start) return null
  return Math.floor((end.getTime() - start.getTime()) / 1000)
}

function rowsFromCounts(counts) {
  return [...counts.entries()]
    .map(([name, value], index) => ({ name, value, tone: TONES[index % TONES.length] }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
}

export function buildVisitAnalyticsSummary(visits, options = {}) {
  const entries = Array.isArray(visits) ? visits : []
  const referenceDate = validDate(options.endDate) ?? new Date()
  const dayFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })
  const dailyCounts = new Map()

  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate() - offset,
    ))
    dailyCounts.set(utcDateKey(date), 0)
  }

  const deviceCounts = new Map()
  const pageCounts = new Map()
  const locationCounts = new Map()
  const uniqueIps = new Set()
  let pageViews = 0
  let durationTotal = 0
  let durationCount = 0

  for (const visit of entries) {
    const date = validDate(visit?.started_at)
    const dateKey = date ? utcDateKey(date) : null
    if (dateKey && dailyCounts.has(dateKey)) dailyCounts.set(dateKey, dailyCounts.get(dateKey) + 1)

    const device = visit?.visitor_context?.device?.type || 'unknown'
    deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1)

    for (const ip of Array.isArray(visit?.ip_addresses) ? visit.ip_addresses : []) uniqueIps.add(ip)
    for (const page of Array.isArray(visit?.pages) ? visit.pages : []) {
      const path = page?.path || page?.page
      if (!path) continue
      pageViews += 1
      pageCounts.set(path, (pageCounts.get(path) ?? 0) + 1)
    }

    const duration = durationSeconds(visit)
    if (duration !== null) {
      durationTotal += duration
      durationCount += 1
    }

    const geo = visit?.visitor_context?.geo
    if (Number.isFinite(geo?.latitude) && Number.isFinite(geo?.longitude)) {
      const key = `${geo.latitude.toFixed(4)},${geo.longitude.toFixed(4)}`
      const existing = locationCounts.get(key)
      if (existing) {
        existing.value += 1
      } else {
        const name = [geo.city, geo.countryName].filter(Boolean).join(', ') || key
        locationCounts.set(key, {
          name,
          value: 1,
          coordinates: [geo.longitude, geo.latitude],
          countryCode: geo.countryCode ?? null,
        })
      }
    }
  }

  return {
    visits: entries.length,
    pageViews,
    uniqueIps: uniqueIps.size,
    averageDurationSeconds: durationCount ? Math.round(durationTotal / durationCount) : 0,
    visitsByDay: [...dailyCounts].map(([date, value]) => ({
      date,
      name: dayFormatter.format(new Date(`${date}T00:00:00Z`)),
      visits: value,
    })),
    devices: rowsFromCounts(deviceCounts),
    topPages: rowsFromCounts(pageCounts).slice(0, 8),
    locations: [...locationCounts.values()].sort((a, b) => b.value - a.value || a.name.localeCompare(b.name)),
  }
}
