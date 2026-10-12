/** Stable, measured slots keep neighboring spring motion out of hit testing. */
export function magneticTarget(slots, point, previous, radius, hysteresis = 1.2) {
  if (!slots.length) return null
  const distance = index => Math.hypot(slots[index].x - point.x, slots[index].y - point.y)
  const nearest = slots.reduce((best, _, index) => distance(index) < distance(best) ? index : best, 0)
  if (previous != null && slots[previous] && distance(previous) <= radius * hysteresis && distance(previous) <= distance(nearest) + radius * (hysteresis - 1)) return previous
  return distance(nearest) <= radius ? nearest : null
}

export function attractedPoint(point, slot, radius, strength) {
  if (!slot) return point
  const influence = strength * Math.max(0, 1 - Math.hypot(point.x - slot.x, point.y - slot.y) / radius) ** 2
  return { x: point.x + (slot.x - point.x) * influence, y: point.y + (slot.y - point.y) * influence }
}

// Unit-mass damped spring, semi-implicit Euler integration. Positions/velocities
// are advanced in seconds; fixed substeps keep pointer and FLIP physics stable.
export function springStep(position, velocity, target, stiffness, damping, seconds) {
  const count = Math.max(1, Math.ceil(seconds / (1 / 120))), dt = seconds / count
  for (let i = 0; i < count; i++) {
    velocity += ((target - position) * stiffness - velocity * damping) * dt
    position += velocity * dt
  }
  return { position, velocity }
}

export function springFrames(dx, dy, stiffness, damping) {
  let position = 1, velocity = 0
  const frames = [{ transform: `translate(${dx}px, ${dy}px)` }]
  for (let i = 0; i < 90; i++) {
    ;({ position, velocity } = springStep(position, velocity, 0, stiffness, damping, 1 / 60))
    frames.push({ transform: `translate(${dx * position}px, ${dy * position}px)` })
    if (Math.abs(position) < .001 && Math.abs(velocity) < .01) break
  }
  frames.push({ transform: 'none' })
  return { frames, duration: (frames.length - 1) * 1000 / 60 }
}
