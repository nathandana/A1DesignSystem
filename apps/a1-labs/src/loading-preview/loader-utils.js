import { useEffect, useRef, useState } from 'react'

// Shared helpers for the Labs page-loading experiments. Each loader is its own
// component; these cover what they all need: finding the page's blocks, drawing
// the page's layout as a skeleton, a pausable animation clock and a progress
// curve for "still waiting".

/** Blocks marked `selector` inside `root`, with boxes relative to the root. */
export function measureBlocks(root, selector = '[data-loading-block]') {
  const box = root.getBoundingClientRect()
  return [...root.querySelectorAll(selector)].map(element => {
    const rect = element.getBoundingClientRect()
    return { element, x: rect.left - box.left, y: rect.top - box.top, width: rect.width, height: rect.height }
  })
}

/**
 * A CSS background that paints each block as a solid rectangle in `color`
 * (any CSS colour, including var()), offset by (`dx`, `dy`) — e.g. to show one
 * tile's slice of the layout.
 */
export function skeletonLayers(blocks, color, dx = 0, dy = 0) {
  return blocks
    .map(block => `linear-gradient(${color}, ${color}) ${block.x - dx}px ${block.y - dy}px / ${block.width}px ${block.height}px no-repeat`)
    .join(', ')
}

/** Progress while waiting: most of the way in `expected` ms, then ever slower; never 1. */
export function waitingProgress(elapsed, expected, limit = 0.85) {
  return limit * (1 - Math.exp((-2 * Math.max(0, elapsed)) / expected))
}

/** Calls onTick(elapsedMs) every frame while `active`; time stands still while `paused`. */
export function useLoaderClock(rootRef, active, paused, onTick) {
  const elapsed = useRef(0)
  const tick = useRef(onTick)
  tick.current = onTick
  useEffect(() => {
    if (!active) return undefined
    const view = rootRef.current.ownerDocument.defaultView
    let last = null
    let frame = 0
    const loop = now => {
      if (last != null && !paused) elapsed.current += now - last
      last = now
      tick.current(elapsed.current)
      frame = view.requestAnimationFrame(loop)
    }
    frame = view.requestAnimationFrame(loop)
    return () => view.cancelAnimationFrame(frame)
  }, [active, paused])
  return elapsed
}

/** The live reduced-motion preference of the document `rootRef` lives in. */
export function useReducedMotion(rootRef) {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = rootRef.current.ownerDocument.defaultView.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const update = event => setReduced(event.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

/** Set an element's data attribute only when it changes (avoids restarting CSS animations). */
export function setData(element, key, value) {
  if (element.dataset[key] !== value) element.dataset[key] = value
}
