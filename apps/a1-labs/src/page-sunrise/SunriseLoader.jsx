import React, { useLayoutEffect, useRef } from 'react'
import { setData, useLoaderClock, useReducedMotion } from '../loading-preview/loader-utils.js'
import { daylight } from './sunrise.js'
import './sunrise.css'

// Sunrise page loader. While `loading`, the page's blocks (marked
// data-loading-block) are silhouettes under a starry night sky, and a sun rises
// behind them as loading progresses, the sky warming through dawn. When loading
// finishes it becomes full day and the page appears.

/**
 * @param {object} props
 * @param {boolean} [props.loading=true]
 * @param {boolean} [props.paused=false]
 * @param {number} [props.expectedDuration=4000]  A typical load in ms; the sun slows beyond it.
 */
export function SunriseLoader({ loading = true, paused = false, expectedDuration = 4000, children, className = '', ...props }) {
  const rootRef = useRef(null)
  const reduced = useReducedMotion(rootRef)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!loading) {
      // Hand over to CSS, which carries the sun to full day.
      root.style.removeProperty('--a1-page-sunrise-day')
      setData(root, 'phase', 'exit')
    } else if (reduced) {
      root.style.setProperty('--a1-page-sunrise-day', '0.5')
      setData(root, 'phase', 'rise')
    }
  }, [loading, reduced])

  useLoaderClock(rootRef, loading && !reduced, paused, elapsed => {
    const root = rootRef.current
    root.style.setProperty('--a1-page-sunrise-day', daylight(elapsed, expectedDuration).toFixed(4))
    setData(root, 'phase', 'rise')
  })

  return (
    <div {...props} ref={rootRef} className={`a1-page-sunrise ${className}`.trim()} data-paused={paused ? 'true' : undefined}>
      <div className="a1-page-sunrise__sky" aria-hidden="true">
        <span className="a1-page-sunrise__stars" />
      </div>
      {children}
      {/* In front of the silhouettes, screen-blended so it glows through them. */}
      <span className="a1-page-sunrise__sun" aria-hidden="true" />
    </div>
  )
}
