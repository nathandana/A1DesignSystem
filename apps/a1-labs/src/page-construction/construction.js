// Crane choreography for the "Under construction" page loader. Deterministic
// for a given elapsed time: for each block the crane picks it up at its mast,
// carries it out along the jib, lowers it into place, lets go, raises the hook
// and returns to the mast. Once every block is placed it idles until loading
// finishes, bobbing its hook.

// Fractions of one step.
const MOVE_OUT = 0.28
const LOWER = 0.58
const RELEASE = 0.64
const RAISE = 0.8

const clamp = value => Math.min(1, Math.max(0, value))
const lerp = (a, b, t) => a + (b - a) * t
const ease = t => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/**
 * @param {number} time  ms of (unpaused) loading time; negative counts as 0.
 * @param {number} step  ms per block.
 * @param {{ x: number, drop: number }[]} targets  Each block's centre x and the
 *   rope length that lowers its top edge onto its place.
 * @param {{ home: number, raised: number }} crane  Mast x and raised rope length.
 * @returns {{ phase: 'build'|'idle', x: number, rope: number, sway: number,
 *   carrying: number|null, placed: number }}
 */
export function craneState(time, step, targets, { home, raised }) {
  const elapsed = Math.max(0, time)
  const count = targets.length
  const index = Math.floor(elapsed / step)
  if (index >= count) {
    // Built, still loading: wait over the middle of the page, hook bobbing.
    const t = elapsed - count * step
    const settle = ease(clamp(t / (step * 0.4)))
    const centre = targets.length ? (Math.min(...targets.map(target => target.x)) + Math.max(...targets.map(target => target.x))) / 2 : home
    return {
      phase: 'idle',
      x: lerp(home, centre, settle),
      rope: raised + settle * (raised * 2 + Math.sin(t / 380) * raised),
      sway: Math.sin(t / 520) * 3 * settle,
      carrying: null,
      placed: count,
    }
  }
  const f = (elapsed - index * step) / step
  const { x: targetX, drop } = targets[index]
  if (f < MOVE_OUT) {
    const p = f / MOVE_OUT
    // The load swings back against the direction of travel, then catches up.
    return { phase: 'build', x: lerp(home, targetX, ease(p)), rope: raised, sway: Math.sin(p * Math.PI) * 3.5 * Math.sign(home - targetX), carrying: index, placed: index }
  }
  if (f < LOWER) {
    const p = (f - MOVE_OUT) / (LOWER - MOVE_OUT)
    return { phase: 'build', x: targetX, rope: lerp(raised, drop, ease(p)), sway: Math.sin(p * Math.PI * 2) * 2 * (1 - p), carrying: index, placed: index }
  }
  if (f < RELEASE) return { phase: 'build', x: targetX, rope: drop, sway: 0, carrying: index, placed: index }
  if (f < RAISE) {
    const p = (f - RELEASE) / (RAISE - RELEASE)
    return { phase: 'build', x: targetX, rope: lerp(drop, raised, ease(p)), sway: 0, carrying: null, placed: index + 1 }
  }
  const p = (f - RAISE) / (1 - RAISE)
  return { phase: 'build', x: lerp(targetX, home, ease(p)), rope: raised, sway: 0, carrying: null, placed: index + 1 }
}
