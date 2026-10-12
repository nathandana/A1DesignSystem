export function clockParts(date, format = '24', showSeconds = true) {
  const hour = date.getHours()
  const values = [format === '12' ? hour % 12 || 12 : hour, date.getMinutes()]
  if (showSeconds) values.push(date.getSeconds())
  return {
    digits: values.map(value => String(value).padStart(2, '0')).join(''),
    text: values.map(value => String(value).padStart(2, '0')).join(':'),
    period: format === '12' ? (hour < 12 ? 'a.m.' : 'p.m.') : '',
  }
}

export { flapPose } from '../split-flap/flap-model.js'

// A zero reset winds the digit stack back through every intervening card.
// Regular increments remain a single flip; the host still supplies real time.
export function clockDigitCycle(from, to) {
  if (from === to) return []
  if (to === '0' && /^[1-9]$/.test(from)) {
    return Array.from({ length: Number(from) }, (_, index) => String(Number(from) - index - 1))
  }
  return [to]
}
