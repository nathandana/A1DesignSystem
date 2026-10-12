// Mode logic shared by the switches. Modes are Labs' appearance values:
// 'light', 'dark' and 'system' (shown as Auto).

export const TRI_STATE = ['light', 'system', 'dark']
export const MODE_LABEL = { light: 'Light', dark: 'Dark', system: 'Auto' }

/** What the screen shows: Auto follows the device. */
export const resolveMode = (mode, systemDark) => (mode === 'dark' || (mode === 'system' && systemDark) ? 'dark' : 'light')

/** Binary switches flip what is on screen, choosing an explicit mode. */
export const toggleBinary = (mode, systemDark) => (resolveMode(mode, systemDark) === 'dark' ? 'light' : 'dark')

/** Cycle button order: Light → Dark → Auto → Light. */
export function nextCycle(mode) {
  return mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
}

/** Dial: angle in degrees from straight up (negative left) → nearest detent. */
export function dialIndex(angle, detent) {
  const positions = [-detent, 0, detent]
  return positions.reduce((best, position, index) => (Math.abs(angle - position) < Math.abs(angle - positions[best]) ? index : best), 0)
}

/** Angle in degrees from straight up, for a point relative to the centre. */
export const pointerAngle = (dx, dy) => (Math.atan2(dx, -dy) * 180) / Math.PI

/**
 * One frame of the pull cord's spring: the bead is pulled back to rest
 * (0, 0) and its velocity decays. Returns the next state and whether it has
 * settled.
 */
export function stepSpring({ x, y, vx, vy }, { stiffness, damping }) {
  const nvx = (vx - stiffness * x) * damping
  const nvy = (vy - stiffness * y) * damping
  const next = { x: x + nvx, y: y + nvy, vx: nvx, vy: nvy }
  const settled = Math.abs(next.x) < 0.1 && Math.abs(next.y) < 0.1 && Math.abs(nvx) < 0.1 && Math.abs(nvy) < 0.1
  return { ...(settled ? { x: 0, y: 0, vx: 0, vy: 0 } : next), settled }
}

/** The bead follows the pointer down (not up), with a little sideways give. */
export function dragPosition(dx, dy, maxPull) {
  const y = Math.max(0, Math.min(maxPull, dy))
  const x = Math.max(-maxPull / 3, Math.min(maxPull / 3, dx / 3))
  return { x, y }
}

/**
 * Ball-chain positions: evenly spaced points (by arc length) along the
 * quadratic curve from `start` through control `control` to `end`.
 */
export function chainPoints(start, control, end, spacing) {
  const at = t => ({
    x: (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x,
    y: (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y,
  })
  const samples = Array.from({ length: 257 }, (_, i) => at(i / 256))
  const points = [samples[0]]
  let travelled = 0
  for (let i = 1; i < samples.length; i += 1) {
    travelled += Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y)
    // Carry the remainder so the gaps stay even.
    if (travelled >= spacing) { points.push(samples[i]); travelled -= spacing }
  }
  return points
}
