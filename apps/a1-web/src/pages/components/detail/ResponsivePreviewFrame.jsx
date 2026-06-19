import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ResponsivePreviewContext } from './responsivePreview.js'

// Device presets for the responsive preview control (shared by the component
// detail pages and the editor).
export const VIEWPORT_PRESETS = [
  { value: 'fit', label: 'Fit', icon: 'fit_screen' },
  { value: 'xs', label: 'XS', icon: 'smartphone', width: 390, height: 844 },
  // SM = a wide phone (landscape) — a short, wide viewport.
  { value: 'sm', label: 'SM', icon: 'stay_current_landscape', width: 740, height: 360 },
  { value: 'md', label: 'MD', icon: 'tablet_mac', width: 820, height: 1180 },
  { value: 'lg', label: 'LG', icon: 'laptop', width: 1280, height: 800 },
  { value: 'xl', label: 'XL', icon: 'desktop_windows', width: 1600, height: 1000 },
]

// Resolve a device size from a viewport value, or null for "Fit".
export function viewportSize(value) {
  if (!value || value === 'fit') return null
  const preset = VIEWPORT_PRESETS.find((p) => p.value === value)
  return preset?.width ? { width: preset.width, height: preset.height } : null
}

/**
 * ResponsivePreviewFrame — renders its children inside an iframe sized to a
 * device width (a genuine nested viewport, so @media/container breakpoints
 * apply), then scales the iframe down with a CSS transform so a wide desktop
 * layout is viewable inside a narrow panel. `width` null = "fit" (no simulation;
 * children render normally).
 */
export function ResponsivePreviewFrame({ width, height, children }) {
  const outerRef = useRef(null)
  // Callback ref (state) so the setup effect runs once the iframe is in the DOM.
  const [iframeEl, setIframeEl] = useState(null)
  const [scale, setScale] = useState(1)
  const [body, setBody] = useState(null)

  // Scale = available panel width ÷ device width (never enlarge past 1:1). The
  // device keeps a real fixed height; its page scrolls inside the iframe.
  useLayoutEffect(() => {
    if (!width) return undefined
    const measure = () => {
      const available = outerRef.current?.clientWidth ?? width
      setScale(Math.min(1, available / width))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (outerRef.current) ro.observe(outerRef.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [width])

  // Prepare the iframe document: clone the app stylesheets + theme so A1 CSS
  // applies inside, and expose its <body> as the portal target. A src-less
  // (about:blank) iframe fires `load` unreliably, so set up directly (guarded)
  // and also on `load`.
  useEffect(() => {
    if (!iframeEl) { setBody(null); return undefined }
    const setup = () => {
      const doc = iframeEl.contentDocument
      if (!doc || !doc.body) return
      doc.head.querySelectorAll('[data-a1-cloned]').forEach((node) => node.remove())
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
        const clone = node.cloneNode(true)
        clone.setAttribute('data-a1-cloned', '')
        doc.head.appendChild(clone)
      })
      const html = document.documentElement
      if (html.getAttribute('data-theme')) doc.documentElement.setAttribute('data-theme', html.getAttribute('data-theme'))
      doc.documentElement.style.colorScheme = getComputedStyle(html).colorScheme
      // Force the iframe document to scroll: the cloned app stylesheets set the
      // shell to a fixed-height, overflow-hidden viewport, which would otherwise
      // clip the page instead of letting it scroll inside the device.
      doc.documentElement.style.height = 'auto'
      doc.documentElement.style.overflow = 'auto'
      doc.body.style.margin = '0'
      doc.body.style.height = 'auto'
      doc.body.style.minBlockSize = '100%'
      doc.body.style.overflow = 'visible'
      doc.body.style.background = 'var(--semantic-color-surface-page)'
      setBody(doc.body)
    }
    setup()
    iframeEl.addEventListener('load', setup)
    return () => iframeEl.removeEventListener('load', setup)
  }, [iframeEl])

  if (!width) return children

  return (
    <div ref={outerRef} className="a1-web-responsive-preview">
      <div className="a1-web-responsive-preview__caption">
        {width} × {height}px{scale < 1 ? ` · ${Math.round(scale * 100)}%` : ''}
      </div>
      <div
        className="a1-web-responsive-preview__viewport"
        style={{ inlineSize: `${width * scale}px`, blockSize: `${height * scale}px` }}
      >
        <iframe
          ref={setIframeEl}
          title="Responsive preview"
          className="a1-web-responsive-preview__frame"
          style={{
            inlineSize: `${width}px`,
            blockSize: `${height}px`,
            transform: `scale(${scale})`,
          }}
        />
        {body && createPortal(
          <ResponsivePreviewContext.Provider value={true}>{children}</ResponsivePreviewContext.Provider>,
          body,
        )}
      </div>
    </div>
  )
}
