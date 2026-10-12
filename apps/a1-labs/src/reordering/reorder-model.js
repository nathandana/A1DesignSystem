export function moveItem(items, id, targetIndex) {
  const from = items.findIndex(item => item.id === id)
  if (from < 0 || !Number.isInteger(targetIndex)) return items
  const to = Math.max(0, Math.min(items.length - 1, targetIndex))
  if (from === to) return items
  const result = [...items]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

// Slots are measured before transforms, so displaced neighbors cannot make the
// insertion target oscillate under a stationary pointer.
export function insertionIndex(centers, pointerY) {
  if (!centers.length) return 0
  return centers.reduce((best, center, index) => Math.abs(center - pointerY) < Math.abs(centers[best] - pointerY) ? index : best, 0)
}

export function placementFrames(style, visual) {
  const rest = { transform: 'none' }
  if (style === 'plop') return [
    { transform: `translateY(calc(-1 * ${visual.lift})) scale(${visual.liftScale})` },
    { transform: `scale(${visual.squashX}, ${visual.squashY})`, offset: .6 },
    { transform: `translateY(calc(-1 * ${visual.bounce}))`, offset: .8 }, rest,
  ]
  if (style === 'tilt') return [
    { transform: `translateY(calc(-1 * ${visual.lift})) rotate(${visual.tilt}) scale(${visual.liftScale})` },
    { transform: `rotate(${visual.counterTilt})`, offset: .7 }, rest,
  ]
  if (style === 'spring') return [
    { transform: `translateY(calc(-1 * ${visual.lift}))` },
    { transform: `translateY(${visual.bounce})`, offset: .45 },
    { transform: `translateY(calc(-.5 * ${visual.bounce}))`, offset: .7 },
    { transform: `translateY(calc(.25 * ${visual.bounce}))`, offset: .85 }, rest,
  ]
  if (style === 'pop') return [
    { transform: 'scale(1)' },
    { transform: `scale(${visual.popScale})`, offset: .35 },
    { transform: `scale(${visual.popSettle})`, offset: .7 }, rest,
  ]
  if (style === 'slide') return [
    // Slides in from the inline start (left, or right in right-to-left).
    { transform: `translateX(calc(${visual.direction === 'rtl' ? 1 : -1} * ${visual.slide}))`, opacity: 0 },
    { transform: 'none', opacity: 1 },
  ]
  if (style === 'fade') return [
    { transform: `scale(${visual.fadeScale})`, opacity: 0 },
    { transform: 'none', opacity: 1 },
  ]
  return [{ transform: `translateY(calc(-1 * ${visual.bounce}))` }, rest]
}

export function cssDurationMs(value) {
  const input = value.trim()
  const number = parseFloat(input)
  if (!Number.isFinite(number)) return 0
  return input.endsWith('ms') ? number : input.endsWith('s') ? number * 1000 : 0
}
