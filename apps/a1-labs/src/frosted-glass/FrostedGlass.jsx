import React, { createContext, useContext, useLayoutEffect, useRef } from 'react'
import './frosted-glass.css'

// Reusable core of the frosted glass experiment, independent of the Labs
// shell. `FrostedGlass` is the scene: it sets the frost strength and starts
// the depth count. Every `GlassPane` inside it is a slab of frosted glass one
// layer above its nearest pane ancestor, so stacked panes gain a little more
// frost and a deeper shadow. An `inlay` pane instead sits flush in a hole cut
// in its parent, at the same depth — e.g. a form in the page sheet, or a field
// in the form. Anything marked data-a1-glass-cutout cuts such a hole.

const DepthContext = createContext(0)

export const FROST_LEVELS = ['light', 'medium', 'heavy']

// The seam between an inlaid pane and the hole it sits in.
const INLAY_SEAM = 3
const CUTOUTS = '[data-a1-glass-cutout]'

/**
 * @param {object} props
 * @param {'light'|'medium'|'heavy'} [props.frost='medium']  Blur strength behind every pane.
 * @param {React.ReactNode} [props.backdrop]  Content painted behind the glass (decorative).
 * @param {React.ReactNode} props.children
 */
export function FrostedGlass({ frost = 'medium', backdrop, children, className = '', ...props }) {
  return (
    <div {...props} className={`a1-frosted-glass ${className}`.trim()} data-frost={FROST_LEVELS.includes(frost) ? frost : 'medium'}>
      {backdrop && <div className="a1-frosted-glass__backdrop" aria-hidden="true">{backdrop}</div>}
      <DepthContext.Provider value={0}>{children}</DepthContext.Provider>
    </div>
  )
}

// Cut holes in a pane's frosted face wherever its own cutouts sit: an SVG
// mask of rounded rectangles, redrawn when the pane or a cutout resizes.
function useCutouts(ref) {
  useLayoutEffect(() => {
    const pane = ref.current
    if (!pane) return undefined
    const owned = () => [...pane.querySelectorAll(CUTOUTS)]
      .filter(element => element.parentElement?.closest('.a1-frosted-glass__pane') === pane)
    const update = () => {
      const cutouts = owned()
      if (!cutouts.length) {
        pane.style.removeProperty('--a1-frosted-glass-mask')
        return
      }
      const box = pane.getBoundingClientRect()
      const holes = cutouts.map(element => {
        const rect = element.getBoundingClientRect()
        const gap = Number(element.dataset.a1GlassCutout) || 0
        const radius = (Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0) + gap
        return `<rect x="${rect.left - box.left - gap}" y="${rect.top - box.top - gap}" width="${rect.width + gap * 2}" height="${rect.height + gap * 2}" rx="${radius}" fill="black"/>`
      })
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}"><mask id="m"><rect width="100%" height="100%" fill="white"/>${holes.join('')}</mask><rect width="100%" height="100%" fill="white" mask="url(#m)"/></svg>`
      pane.style.setProperty('--a1-frosted-glass-mask', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(pane)
    owned().forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [ref])
}

/**
 * A frosted pane: a slab of glass about 2 mm thick with a lit rim, a visible
 * side and a contact shadow, one layer above its nearest GlassPane ancestor.
 * @param {object} props
 * @param {React.ElementType} [props.as='div']  Element to render, e.g. header, main, form.
 * @param {boolean} [props.sheet=false]  A base sheet that fills its container
 *   edge to edge (e.g. the whole viewport), with no lift of its own.
 * @param {boolean} [props.inlay=false]  A separate piece set flush into a hole
 *   cut in the parent pane, at the parent's depth, with a thin seam around it.
 */
export function GlassPane({ as: Element = 'div', sheet = false, inlay = false, className = '', style, children, ...props }) {
  const parentDepth = useContext(DepthContext)
  const depth = inlay ? Math.max(parentDepth, 1) : parentDepth + 1
  const ref = useRef(null)
  useCutouts(ref)
  const modifiers = `${sheet ? ' a1-frosted-glass__pane--sheet' : ''}${inlay ? ' a1-frosted-glass__pane--inlay' : ''}`
  return (
    <Element
      {...props}
      ref={ref}
      className={`a1-frosted-glass__pane${modifiers} ${className}`.trim()}
      data-depth={depth}
      data-a1-glass-cutout={inlay ? INLAY_SEAM : undefined}
      style={{ '--a1-frosted-glass-depth': depth, ...style }}
    >
      <DepthContext.Provider value={depth}>{children}</DepthContext.Provider>
    </Element>
  )
}

/** The current glass depth (0 outside any pane), for controls drawn on glass. */
export function useGlassDepth() {
  return useContext(DepthContext)
}
