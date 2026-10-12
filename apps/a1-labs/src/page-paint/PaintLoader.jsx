import React, { useLayoutEffect, useRef, useState } from 'react'
import { measureBlocks, setData, skeletonLayers, useLoaderClock, useReducedMotion } from '../loading-preview/loader-utils.js'
import { FIDELITY_LAYERS, layerReveal, rollerState } from './paint.js'
import './paint.css'

// Fresh paint page loader. While `loading`, a paint roller sweeps the page and
// each pass reveals it at higher fidelity: first the layout blocks (marked
// data-loading-block), then text lines and buttons, then the real page, still
// soft and grey. Later passes polish until loading finishes; then the roller
// leaves and the paint dries to full colour. The page is inert until then.

const rect = (x, y, width, height, color) => `linear-gradient(${color}, ${color}) ${x}px ${y}px / ${width}px ${height}px no-repeat`

// Text lines and buttons inside the blocks, drawn at their real positions.
function detailLayers(root, blockSelector) {
  const box = root.getBoundingClientRect()
  const layers = []
  root.querySelectorAll(`:is(${blockSelector}) :is(h1, h2, h3, h4, h5, h6, p, button)`).forEach(element => {
    const bounds = element.getBoundingClientRect()
    const x = bounds.left - box.left
    const y = bounds.top - box.top
    if (element.tagName === 'BUTTON') {
      layers.push(rect(x, y, bounds.width, bounds.height, 'var(--semantic-color-action-background)'))
      return
    }
    const style = getComputedStyle(element)
    const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.4
    const lines = Math.max(1, Math.round(bounds.height / lineHeight))
    const range = element.ownerDocument.createRange()
    range.selectNodeContents(element)
    const textWidth = lines === 1 ? Math.min(bounds.width, range.getBoundingClientRect().width) : bounds.width
    const color = /^H\d$/.test(element.tagName)
      ? 'color-mix(in srgb, var(--semantic-color-text-default) 55%, transparent)'
      : 'color-mix(in srgb, var(--semantic-color-text-muted) 45%, transparent)'
    const bar = lineHeight * 0.55
    for (let line = 0; line < lines; line += 1) {
      const width = lines > 1 && line === lines - 1 ? textWidth * 0.6 : textWidth
      layers.push(rect(x, y + line * lineHeight + (lineHeight - bar) / 2, width, bar, color))
    }
  })
  return layers.join(', ') || 'none'
}

// The revealed band is in page-height fractions; layers differ in height (the
// page is only as tall as its content), so convert the band to each layer's
// own pixels.
function clip({ state, top, bottom }, element, height) {
  if (state === 'hidden') return 'inset(0 0 100% 0)'
  const start = element.offsetTop
  const size = element.offsetHeight
  const above = Math.min(size, Math.max(0, top * height - start))
  const below = Math.min(size, Math.max(0, start + size - (1 - bottom) * height))
  return `inset(${above.toFixed(1)}px 0 ${below.toFixed(1)}px 0)`
}

/**
 * @param {object} props
 * @param {boolean} [props.loading=true]
 * @param {boolean} [props.paused=false]
 * @param {number} [props.coatDuration=2600]  ms for one pass of the roller.
 * @param {string} [props.blockSelector='[data-loading-block]']
 */
export function PaintLoader({ loading = true, paused = false, coatDuration = 2600, blockSelector = '[data-loading-block]', children, className = '', ...props }) {
  const rootRef = useRef(null)
  const layerRefs = useRef([])
  const [coats, setCoats] = useState({ blocks: 'none', detail: 'none' })
  const reduced = useReducedMotion(rootRef)

  useLayoutEffect(() => {
    const root = rootRef.current
    const measure = () => setCoats({
      blocks: skeletonLayers(measureBlocks(root, blockSelector), 'var(--semantic-color-surface-raised)') || 'none',
      detail: detailLayers(root, blockSelector),
    })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [blockSelector])

  // layerRefs: [blocks coat, detail coat, page, veil]; the page and its veil
  // share the third fidelity layer.
  const reveal = pass => (y => {
    const height = rootRef.current.offsetHeight
    ;[0, 1, 2, 2].forEach((layer, index) => {
      const element = layerRefs.current[index]
      if (element) element.style.clipPath = clip(layerReveal(pass, y, layer), element, height)
    })
  })

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!loading) {
      setData(root, 'phase', 'exit')
      layerRefs.current.forEach(element => element && element.style.removeProperty('clip-path'))
    } else if (reduced) {
      setData(root, 'phase', 'idle')
      reveal(FIDELITY_LAYERS)(0)
    }
  }, [loading, reduced])

  useLoaderClock(rootRef, loading && !reduced, paused, elapsed => {
    const root = rootRef.current
    const { pass, y, direction } = rollerState(elapsed, coatDuration)
    root.style.setProperty('--a1-page-paint-y', `${y * 100}%`)
    setData(root, 'direction', direction)
    setData(root, 'phase', pass < FIDELITY_LAYERS ? 'paint' : 'idle')
    reveal(pass)(y)
  })

  return (
    <div {...props} ref={rootRef} className={`a1-page-paint ${className}`.trim()} data-paused={paused ? 'true' : undefined}>
      <div ref={node => { layerRefs.current[0] = node }} className="a1-page-paint__coat" aria-hidden="true" style={{ '--a1-page-paint-layer': coats.blocks }} />
      <div ref={node => { layerRefs.current[1] = node }} className="a1-page-paint__coat a1-page-paint__coat--detail" aria-hidden="true" style={{ '--a1-page-paint-layer': coats.detail }} />
      <div ref={node => { layerRefs.current[2] = node }} className="a1-page-paint__page" inert={loading || undefined}>
        {children}
      </div>
      <div ref={node => { layerRefs.current[3] = node }} className="a1-page-paint__veil" aria-hidden="true" />
      <div className="a1-page-paint__wet" aria-hidden="true" />
      <div className="a1-page-paint__roller" aria-hidden="true">
        <span className="a1-page-paint__handle" />
        <span className="a1-page-paint__drum" />
      </div>
    </div>
  )
}
