// Geometry and timing for the Jigsaw page loader.

/** Split a width × height area into roughly size × size pieces (at least 2 × 2). */
export function tileGrid(width, height, size) {
  const columns = Math.max(2, Math.round(width / size))
  const rows = Math.max(2, Math.round(height / size))
  return { columns, rows, tileWidth: width / columns, tileHeight: height / rows }
}

// Small deterministic PRNG so every run of a given layout looks the same.
function random(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The order pieces arrive in: a seeded shuffle of 0…count-1. */
export function arrivalOrder(count, seed = 7) {
  const next = random(seed)
  const order = Array.from({ length: count }, (_, index) => index)
  for (let index = count - 1; index > 0; index -= 1) {
    const swap = Math.floor(next() * (index + 1))
    ;[order[index], order[swap]] = [order[swap], order[index]]
  }
  return order
}

/** Where a piece starts before flying in: offset (fractions of the area), spin and scale. */
export function scatter(index, seed = 11) {
  const next = random(seed * 1000 + index)
  const side = next() < 0.5 ? -1 : 1
  return {
    x: side * (0.55 + next() * 0.6),
    y: (next() - 0.5) * 1.6,
    rotate: (next() - 0.5) * 90,
    scale: 0.6 + next() * 0.3,
  }
}

/** How many pieces have been sent so far: all of them arrive within `build` ms. */
export function piecesSent(elapsed, build, count) {
  if (count === 0) return 0
  return Math.min(count, Math.floor(Math.max(0, elapsed) / (build / count)) + 1)
}
