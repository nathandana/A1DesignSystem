// Slide transition and build logic, kept pure so it can be tested. Distances
// are canvas units; `dir` is 1 moving forward, -1 moving back.

/** Simple to complex. Cascade and morph read the slides' content. */
export const TRANSITIONS = [
  { id: 'cut', label: 'Cut', summary: 'Switches instantly.' },
  { id: 'fade', label: 'Fade', summary: 'Cross-fades the whole slide.' },
  { id: 'push', label: 'Push', summary: 'The next slide pushes the current one off the stage.' },
  { id: 'zoom', label: 'Zoom', summary: 'The current slide grows and fades as the next one settles in.' },
  { id: 'wipe', label: 'Color wipe', summary: 'A panel in the next slide’s colour sweeps across and reveals it.' },
  { id: 'cascade', label: 'Cascade', summary: 'Each piece leaves in turn, then the next slide’s pieces arrive in turn.' },
  { id: 'morph', label: 'Morph', summary: 'Pieces both slides share move, resize and recolour into place; the rest fade.' },
]

/** How each slide's points load once it is on stage. */
export const BUILDS = [
  { id: 'all', label: 'All at once', summary: 'Points arrive with the slide.' },
  { id: 'fade', label: 'Fade in', summary: 'Points fade in together after the transition.' },
  { id: 'rise', label: 'Rise in', summary: 'Points rise into place one after another.' },
  { id: 'step', label: 'Step through', summary: 'Each Next shows one more point before moving on.' },
]

const fadeIn = [{ opacity: 0 }, { opacity: 1 }]
const fadeOut = [{ opacity: 1 }, { opacity: 0 }]

/** Keyframes for the whole incoming ('in') or outgoing ('out') slide. */
export function layerFrames(type, role, dir, { width, zoomOut, zoomIn, handoff = 0.5 }) {
  if (type === 'fade') return role === 'in' ? fadeIn : fadeOut
  if (type === 'push') {
    return role === 'in'
      ? [{ transform: `translateX(${dir * width}px)` }, { transform: 'none' }]
      : [{ transform: 'none' }, { transform: `translateX(${-dir * width}px)` }]
  }
  if (type === 'zoom') {
    return role === 'in'
      ? [{ opacity: 0, transform: `scale(${zoomIn})` }, { opacity: 1, transform: 'none' }]
      : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `scale(${zoomOut})` }]
  }
  if (type === 'wipe') {
    // The slides swap at the midpoint, while the panel covers the stage.
    return role === 'in'
      ? [{ opacity: 0 }, { opacity: 0, offset: handoff }, { opacity: 1, offset: handoff }, { opacity: 1 }]
      : [{ opacity: 1 }, { opacity: 1, offset: handoff }, { opacity: 0, offset: handoff }, { opacity: 0 }]
  }
  return null
}

/** The colour panel for the wipe: in from one side, out the other. */
export function wipeFrames(dir, width, handoff = 0.5) {
  return [
    { visibility: 'visible', transform: `translateX(${-dir * width}px)` },
    { visibility: 'visible', transform: 'none', offset: handoff },
    { visibility: 'visible', transform: `translateX(${dir * width}px)` },
  ]
}

/** Transform that maps a box `to` back onto box `from` (origin top left). */
export function mapRect(from, to) {
  const sx = to.width ? from.width / to.width : 1
  const sy = to.height ? from.height / to.height : 1
  const round = value => Math.round(value * 1000) / 1000
  return `translate(${round(from.x - to.x)}px, ${round(from.y - to.y)}px) scale(${round(sx)}, ${round(sy)})`
}

/** Evenly spaced start times for `count` pieces within `span` ms. */
export function staggerDelays(count, step, span) {
  if (count <= 1) return [0]
  const gap = Math.min(step, span / (count - 1))
  return Array.from({ length: count }, (_, index) => Math.round(index * gap))
}

/**
 * Build animation for each point after the slide arrives.
 * @returns {{ delay: number, frames: Keyframe[] }[]}  Empty when nothing animates.
 */
export function buildSchedule(mode, count, { start, step, shift, reduced }) {
  if (count === 0 || mode === 'all' || mode === 'step') return []
  const rise = reduced ? fadeIn : [{ opacity: 0, transform: `translateY(${shift}px)` }, { opacity: 1, transform: 'none' }]
  if (mode === 'fade') return Array.from({ length: count }, () => ({ delay: start, frames: fadeIn }))
  return Array.from({ length: count }, (_, index) => ({ delay: start + index * step, frames: rise }))
}

/**
 * What Next/Previous does. In step-through, Next reveals the slide's next
 * point before moving on; arriving forward shows none, arriving back shows all.
 */
export function navigate({ build, step, count, index, total }, action) {
  if (action === 'next') {
    if (build === 'step' && step < count) return { type: 'step', step: step + 1 }
    return index < total - 1 ? { type: 'go', index: index + 1, dir: 1, reveal: build === 'step' ? 'none' : 'all' } : { type: 'none' }
  }
  if (action === 'previous') return index > 0 ? { type: 'go', index: index - 1, dir: -1, reveal: 'all' } : { type: 'none' }
  return { type: 'none' }
}
