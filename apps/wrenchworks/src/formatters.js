const compactNumber = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const standardNumber = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
})

export function formatMoney(value) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0
  if (safeValue < 1000) return `$${standardNumber.format(Math.floor(safeValue))}`
  return `$${compactNumber.format(safeValue)}`
}

export function formatNumber(value) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0
  if (safeValue < 10000) return standardNumber.format(Math.floor(safeValue))
  return compactNumber.format(safeValue)
}

export function formatRate(value) {
  return `${formatMoney(value)}/sec`
}

export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  if (seconds < 60) return `${seconds} sec`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours} hr`
  return `${hours} hr ${remainingMinutes} min`
}

export function formatClock(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}
