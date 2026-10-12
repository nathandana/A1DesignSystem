// Particle physics for the confetti and fireworks celebrations. Pure and
// deterministic for a given random source, so it can be tested.

/** A small seeded random number generator (mulberry32), returning 0–1. */
export function seededRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const between = (random, [min, max]) => min + random() * (max - min)

/**
 * Confetti thrown from one point: pieces fly out across `spread` radians
 * centred on `angle` (−π/2 is straight up), then tumble and fall.
 */
export function createConfetti({ count, origin, angle = -Math.PI / 2, spread = Math.PI * 1.2, speed = [300, 900], size = [6, 12], colors, random }) {
  return Array.from({ length: count }, () => {
    const direction = angle + (random() - 0.5) * spread
    const velocity = between(random, speed)
    const width = between(random, size)
    return {
      kind: 'confetti',
      x: origin.x,
      y: origin.y,
      vx: Math.cos(direction) * velocity,
      vy: Math.sin(direction) * velocity,
      rotation: random() * Math.PI * 2,
      spin: (random() - 0.5) * 12,
      flip: random() * Math.PI * 2,
      width,
      height: width * between(random, [0.4, 0.7]),
      color: colors[Math.floor(random() * colors.length)],
      round: random() < 0.25,
      age: 0,
    }
  })
}

/** A firework burst: sparks spread evenly in a circle, with a little jitter. */
export function createBurst({ count, origin, speed = [180, 460], colors, random }) {
  const color = colors[Math.floor(random() * colors.length)]
  return Array.from({ length: count }, (_, i) => {
    const direction = (i / count) * Math.PI * 2 + (random() - 0.5) * 0.2
    const velocity = between(random, speed)
    return { kind: 'spark', x: origin.x, y: origin.y, vx: Math.cos(direction) * velocity, vy: Math.sin(direction) * velocity, color, size: between(random, [2.5, 4.5]), age: 0 }
  })
}

/** A rocket rising from the bottom to burst at `target`. */
export function createRocket({ from, target, delay = 0, duration = 0.7 }) {
  return { kind: 'rocket', x: from.x, y: from.y, from, target, delay, duration, age: 0 }
}

/**
 * Advance every particle by `dt` seconds. Confetti and sparks feel gravity and
 * air drag; confetti also spins and flutters. Rockets rise along an ease-out
 * path. Returns the same array for convenience.
 */
export function stepParticles(particles, dt, { gravity = 900, drag = 1.6, sparkGravity = 160, sparkDrag = 1.2 } = {}) {
  for (const p of particles) {
    p.age += dt
    if (p.kind === 'rocket') {
      const t = Math.min(1, Math.max(0, (p.age - p.delay) / p.duration))
      const eased = 1 - (1 - t) ** 3
      p.x = p.from.x + (p.target.x - p.from.x) * eased
      p.y = p.from.y + (p.target.y - p.from.y) * eased
      continue
    }
    const isSpark = p.kind === 'spark'
    const slow = Math.exp(-(isSpark ? sparkDrag : drag) * dt)
    p.vx *= slow
    p.vy = p.vy * slow + (isSpark ? sparkGravity : gravity) * dt
    p.x += p.vx * dt
    p.y += p.vy * dt
    if (!isSpark) {
      p.rotation += p.spin * dt
      p.flip += 8 * dt
    }
  }
  return particles
}

/** True while a rocket hasn't burst (its delay plus duration hasn't passed). */
export const rocketLanded = rocket => rocket.age >= rocket.delay + rocket.duration

/** Particles still worth drawing: on screen and, for sparks, not yet faded. */
export function stillVisible(p, height, sparkLife) {
  if (p.kind === 'rocket') return !rocketLanded(p)
  if (p.kind === 'spark') return p.age < sparkLife
  return p.y < height + 40
}
