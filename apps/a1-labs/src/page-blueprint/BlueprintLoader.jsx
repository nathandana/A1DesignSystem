import React, { useLayoutEffect, useRef } from 'react'
import { measureBlocks, setData, useLoaderClock, useReducedMotion } from '../loading-preview/loader-utils.js'
import { draftStates } from './blueprint.js'
import './blueprint.css'

// Blueprint page loader. While `loading`, the page sits on blueprint paper and
// each block marked data-loading-block is drafted in turn: its outline draws
// on, labelled with its measurements. Once drafted, the grid drifts until
// loading finishes; then the blueprint fades into the page.

function durationMs(element, name, fallback) {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  const number = Number.parseFloat(value)
  if (!Number.isFinite(number)) return fallback
  return value.endsWith('ms') ? number : value.endsWith('s') ? number * 1000 : number
}

/**
 * @param {object} props
 * @param {boolean} [props.loading=true]
 * @param {boolean} [props.paused=false]
 * @param {number} [props.stepDuration=900]  ms between drafting one block and the next.
 * @param {string} [props.blockSelector='[data-loading-block]']
 */
export function BlueprintLoader({ loading = true, paused = false, stepDuration = 900, blockSelector = '[data-loading-block]', children, className = '', ...props }) {
  const rootRef = useRef(null)
  const blocks = useRef([])
  const reduced = useReducedMotion(rootRef)

  useLayoutEffect(() => {
    const root = rootRef.current
    const measure = () => {
      blocks.current = measureBlocks(root, blockSelector)
      blocks.current.forEach(({ element, width, height }) => {
        element.dataset.dimensions = `${Math.round(width)} × ${Math.round(height)}`
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [blockSelector])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!loading) {
      setData(root, 'phase', 'exit')
      blocks.current.forEach(({ element }) => setData(element, 'loadingState', 'done'))
    } else if (reduced) {
      setData(root, 'phase', 'idle')
      blocks.current.forEach(({ element }) => setData(element, 'loadingState', 'drafted'))
    }
  }, [loading, reduced])

  useLoaderClock(rootRef, loading && !reduced, paused, elapsed => {
    const root = rootRef.current
    const draw = durationMs(root, '--component-page-blueprint-draw-duration', 750)
    const states = draftStates(elapsed, stepDuration, draw, blocks.current.length)
    states.forEach((state, index) => setData(blocks.current[index].element, 'loadingState', state))
    setData(root, 'phase', states.every(state => state === 'drafted') ? 'idle' : 'draft')
  })

  return (
    <div {...props} ref={rootRef} className={`a1-page-blueprint ${className}`.trim()} data-paused={paused ? 'true' : undefined}>
      {children}
    </div>
  )
}
