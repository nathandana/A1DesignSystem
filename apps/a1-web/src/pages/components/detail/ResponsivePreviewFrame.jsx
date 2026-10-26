import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Stack } from '@gtivr4/a1-design-system-react'
import { ResponsivePreviewContext } from './responsivePreview.js'
import './responsive-preview-frame.css'
import { previewScale } from './preview-scale.js'

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

// Paper presets for print preview (A1-2707): the printable area of the page at
// the browser's default margins, in CSS px (96 per inch), so viewport media
// queries respond as they do on paper. Print rules apply via `media: 'print'`.
export const PRINT_PRESETS = [
  { value: 'print-letter', label: 'Print (Letter)', icon: 'print', width: 739, height: 979, media: 'print' },
  { value: 'print-a4', label: 'Print (A4)', icon: 'print', width: 718, height: 1047, media: 'print' },
]

// Resolve a device size from a viewport value, or null for "Fit".
export function viewportSize(value) {
  if (!value || value === 'fit') return null
  const preset = [...VIEWPORT_PRESETS, ...PRINT_PRESETS].find((p) => p.value === value)
  return preset?.width ? { width: preset.width, height: preset.height, media: preset.media } : null
}

// Swap the `print` and `screen` media types in a media list, so print-only rules
// match on screen and screen-only rules (dark-mode queries, inverse islands) don't.
function swapMediaTypes(list) {
  if (!list?.length) return
  list.mediaText = Array.from(list)
    .map((medium) => medium.replace(/\b(print|screen)\b/g, (type) => (type === 'print' ? 'screen' : 'print')))
    .join(', ')
}

function emulatePrintRules(rules) {
  for (const rule of Array.from(rules ?? [])) {
    if (rule.media) swapMediaTypes(rule.media)
    if (rule.cssRules) emulatePrintRules(rule.cssRules)
  }
}

// Apply print emulation to one cloned <style>/<link> once its sheet is parsed.
function emulatePrintSheet(node) {
  const apply = () => {
    try {
      swapMediaTypes(node.sheet?.media)
      emulatePrintRules(node.sheet?.cssRules)
    } catch { /* ignore cross-origin sheets (e.g. web fonts) */ }
  }
  if (node.sheet) apply()
  else node.addEventListener('load', apply, { once: true })
}

/**
 * ResponsivePreviewFrame — renders its children inside an iframe sized to a
 * device width (a genuine nested viewport, so @media/container breakpoints
 * apply), then scales the iframe down with a CSS transform so a wide desktop
 * layout is viewable inside a narrow panel. `width` null = "fit" (no simulation;
 * children render normally).
 */
export function ResponsivePreviewFrame({ width, height, media, children }) {
  const print = media === 'print'
  const outerRef = useRef(null)
  // Callback ref (state) so the setup effect runs once the iframe is in the DOM.
  const [iframeEl, setIframeEl] = useState(null)
  const [scale, setScale] = useState(1)
  const [body, setBody] = useState(null)

  // Fit both dimensions, including caption, bezel and any bottom configuration
  // sheet. Measure the host's scrolling panel; content still scrolls in the iframe.
  useLayoutEffect(() => {
    if (!width || !height) return undefined
    const outer = outerRef.current
    if (!outer) return undefined
    const host = outer.ownerDocument.defaultView
    const viewport = outer.querySelector('.a1-web-responsive-preview__viewport')
    const ancestors = []
    for (let node = outer.parentElement; node; node = node.parentElement) ancestors.push(node)
    const panels = ancestors.filter(node => /auto|scroll|hidden|clip/.test(host.getComputedStyle(node).overflowY))
    const observedSheets = new Set()
    let ro
    let frame
    const measure = () => {
      const rect = outer.getBoundingClientRect()
      const device = viewport.getBoundingClientRect()
      const style = host.getComputedStyle(viewport)
      let bottom = host.visualViewport ? host.visualViewport.offsetTop + host.visualViewport.height : host.innerHeight
      for (const panel of panels) {
        const bounds = panel.getBoundingClientRect()
        bottom = Math.min(bottom, bounds.top + panel.clientTop + panel.clientHeight)
      }
      // Account for the host's existing token-backed bottom padding.
      let padding = 0
      for (const ancestor of ancestors) {
        padding += parseFloat(host.getComputedStyle(ancestor).paddingBottom) || 0
        if (panels.includes(ancestor)) break
      }
      bottom -= padding
      for (const sheet of outer.ownerDocument.querySelectorAll('.a1-bottom-sheet')) {
        if (ro && !observedSheets.has(sheet)) { ro.observe(sheet); observedSheets.add(sheet) }
        const bounds = sheet.getBoundingClientRect()
        if (bounds.width && bounds.height && bounds.right > rect.left && bounds.left < rect.right) {
          bottom = Math.min(bottom, bounds.top)
        }
      }
      setScale(previewScale({ width, height,
        availableWidth: outer.clientWidth,
        availableHeight: bottom - device.top,
        bezelWidth: parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth),
        bezelHeight: parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth),
      }))
    }
    const schedule = () => { host.cancelAnimationFrame(frame); frame = host.requestAnimationFrame(measure) }
    measure()
    ro = new ResizeObserver(schedule)
    for (const node of [outer, outer.firstElementChild, ...ancestors]) if (node) ro.observe(node)
    // The configuration sheet can mount after crossing the host breakpoint.
    const chromeObserver = new MutationObserver(schedule)
    chromeObserver.observe(panels[0] || outer.parentElement, { childList: true, subtree: true })
    schedule()
    host.addEventListener('resize', schedule)
    host.addEventListener('scroll', schedule, true)
    host.visualViewport?.addEventListener('resize', schedule)
    host.visualViewport?.addEventListener('scroll', schedule)
    return () => {
      ro.disconnect(); chromeObserver.disconnect(); host.cancelAnimationFrame(frame)
      host.removeEventListener('resize', schedule)
      host.removeEventListener('scroll', schedule, true)
      host.visualViewport?.removeEventListener('resize', schedule)
      host.visualViewport?.removeEventListener('scroll', schedule)
    }
  }, [width, height])

  // Prepare the iframe document: clone the app stylesheets + theme so A1 CSS
  // applies inside, and expose its <body> as the portal target. A src-less
  // (about:blank) iframe fires `load` unreliably, so set up directly (guarded)
  // and also on `load`.
  useEffect(() => {
    if (!iframeEl) { setBody(null); return undefined }
    const syncAppearance = () => {
      const doc = iframeEl.contentDocument
      if (!doc) return
      const html = document.documentElement
      doc.documentElement.className = html.className
      doc.documentElement.style.cssText = html.style.cssText
      if (html.hasAttribute('data-theme')) doc.documentElement.setAttribute('data-theme', html.getAttribute('data-theme'))
      else doc.documentElement.removeAttribute('data-theme')
      doc.documentElement.style.colorScheme = getComputedStyle(html).colorScheme
      // Paper is always light: mirror the before-print swap of an explicit dark class.
      if (print) {
        doc.documentElement.classList.remove('a1-theme-dark')
        doc.documentElement.classList.add('a1-theme-light')
        doc.documentElement.style.colorScheme = 'light'
      }
      doc.documentElement.style.height = 'auto'
      doc.documentElement.style.overflow = 'auto'
    }
    const setup = () => {
      const doc = iframeEl.contentDocument
      if (!doc || !doc.body) return
      doc.head.querySelectorAll('[data-a1-cloned]').forEach((node) => node.remove())
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
        const clone = node.cloneNode(true)
        clone.setAttribute('data-a1-cloned', '')
        doc.head.appendChild(clone)
        if (print) emulatePrintSheet(clone)
      })
      syncAppearance()
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
    const appearanceObserver = new MutationObserver(syncAppearance)
    appearanceObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    iframeEl.addEventListener('load', setup)
    return () => { appearanceObserver.disconnect(); iframeEl.removeEventListener('load', setup) }
  }, [iframeEl, print])

  if (!width) return children

  return (
    <Stack ref={outerRef} align="center" gap={8} className="a1-web-responsive-preview">
      <div className="a1-web-responsive-preview__caption">
        {width} × {height}px{scale < 1 ? ` · ${Math.round(scale * 100)}%` : ''}
      </div>
      <div
        className={`a1-web-responsive-preview__viewport${print ? ' a1-web-responsive-preview__viewport--paper' : ''}`}
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
    </Stack>
  )
}
