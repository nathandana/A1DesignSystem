import { useCallback, useEffect, useRef, useState } from 'react'
import { Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'

// Ratio constraints offered in the floating overlay toolbar. '' = free.
const RATIO_PRESETS = [
  { value: '', label: 'Free' },
  { value: '16:9', label: '16:9' },
  { value: '4:3', label: '4:3' },
  { value: '3:2', label: '3:2' },
  { value: '1:1', label: '1:1' },
  { value: '2:3', label: '2:3' },
  { value: '3:4', label: '3:4' },
  { value: '9:16', label: '9:16' },
  { value: '21:9', label: '21:9' },
]

// 8 resize handles: hx/hy ∈ {-1,0,1} mark which edges the handle moves.
const HANDLES = [
  { id: 'nw', hx: -1, hy: -1 }, { id: 'n', hx: 0, hy: -1 }, { id: 'ne', hx: 1, hy: -1 },
  { id: 'w', hx: -1, hy: 0 }, { id: 'e', hx: 1, hy: 0 },
  { id: 'sw', hx: -1, hy: 1 }, { id: 's', hx: 0, hy: 1 }, { id: 'se', hx: 1, hy: 1 },
]

const clamp01 = (n) => Math.min(1, Math.max(0, n))

function parseRatio(value) {
  if (!value) return null
  const [w, h] = value.split(':').map(Number)
  return w && h ? w / h : null
}

// Reshape an existing rect to a new fraction-space ratio, keeping its centre and
// fitting it within the image bounds.
function reshapeToRatio(rect, fracRatio) {
  const cx = rect.x + rect.width / 2
  const cy = rect.y + rect.height / 2
  let width = rect.width
  let height = width / fracRatio
  if (height > 1) { height = 1; width = height * fracRatio }
  if (width > 1) { width = 1; height = width / fracRatio }
  const x = Math.max(0, Math.min(cx - width / 2, 1 - width))
  const y = Math.max(0, Math.min(cy - height / 2, 1 - height))
  return { x, y, width, height }
}

const DEFAULT_RECT = { x: 0.2, y: 0.2, width: 0.6, height: 0.6 }

/**
 * FigureCropTool — an in-preview, non-destructive crop editor for the Figure
 * configurator. The user drags a freeform rectangle anywhere on the image (it is
 * dimmed outside the selection), then refines it by dragging an edge or corner.
 * Choosing an aspect ratio from the floating overlay Toolbar constrains the
 * rectangle's shape while still allowing it to be positioned freely. The result
 * is stored only as metadata (`{ x, y, width, height }` fractions of the image).
 */
export function FigureCropTool({ src, ratio, onRatioChange, rect, onRectChange }) {
  const stageRef = useRef(null)
  const [imgRatio, setImgRatio] = useState(null)
  const dragRef = useRef(null)

  // Fraction-space width/height ratio that yields the chosen pixel aspect ratio.
  const pixelRatio = parseRatio(ratio)
  const fracRatio = pixelRatio && imgRatio ? pixelRatio / imgRatio : null

  const handleImgLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    if (naturalWidth && naturalHeight) setImgRatio(naturalWidth / naturalHeight)
  }

  const pointerFrac = useCallback((clientX, clientY) => {
    const stage = stageRef.current
    const r = stage.getBoundingClientRect()
    return { x: clamp01((clientX - r.left) / r.width), y: clamp01((clientY - r.top) / r.height) }
  }, [])

  // Fit a rect into the image bounds, scaling down (preserving ratio when set)
  // from the given anchor corner if it overflows.
  const fitRect = useCallback((next) => {
    let { x, y, width, height } = next
    width = Math.min(width, 1)
    height = Math.min(height, 1)
    x = clamp01(Math.min(x, 1 - width))
    y = clamp01(Math.min(y, 1 - height))
    return { x, y, width, height }
  }, [])

  const applyFromPointer = useCallback((clientX, clientY) => {
    const drag = dragRef.current
    if (!drag) return
    const p = pointerFrac(clientX, clientY)

    if (drag.mode === 'move') {
      const width = drag.start.width
      const height = drag.start.height
      onRectChange({
        x: clamp01(Math.min(drag.start.x + (p.x - drag.origin.x), 1 - width)),
        y: clamp01(Math.min(drag.start.y + (p.y - drag.origin.y), 1 - height)),
        width,
        height,
      })
      return
    }

    if (drag.mode === 'draw') {
      let x = Math.min(drag.origin.x, p.x)
      let y = Math.min(drag.origin.y, p.y)
      let width = Math.abs(p.x - drag.origin.x)
      let height = Math.abs(p.y - drag.origin.y)
      if (fracRatio) {
        height = width / fracRatio
        // Anchor to the draw origin; grow toward the pointer.
        x = p.x >= drag.origin.x ? drag.origin.x : drag.origin.x - width
        y = p.y >= drag.origin.y ? drag.origin.y : drag.origin.y - height
      }
      onRectChange(fitRect({ x, y, width, height }))
      return
    }

    // resize
    const { hx, hy } = drag.handle
    const s = drag.start
    let l = s.x
    let t = s.y
    let r = s.x + s.width
    let b = s.y + s.height
    if (hx === -1) l = p.x
    if (hx === 1) r = p.x
    if (hy === -1) t = p.y
    if (hy === 1) b = p.y
    let x = Math.min(l, r)
    let y = Math.min(t, b)
    let width = Math.max(Math.abs(r - l), 0.02)
    let height = Math.max(Math.abs(b - t), 0.02)

    if (fracRatio) {
      if (hx !== 0 && hy !== 0) {
        // Corner: anchor the opposite corner, drive by width.
        const fixedX = hx === -1 ? s.x + s.width : s.x
        const fixedY = hy === -1 ? s.y + s.height : s.y
        height = width / fracRatio
        x = p.x >= fixedX ? fixedX : fixedX - width
        y = hy === 1 ? fixedY : fixedY - height
      } else if (hx !== 0) {
        // Left/right edge: derive height, keep vertical center.
        const cy = s.y + s.height / 2
        height = width / fracRatio
        y = cy - height / 2
      } else {
        // Top/bottom edge: derive width, keep horizontal center.
        const cx = s.x + s.width / 2
        width = height * fracRatio
        x = cx - width / 2
      }
    }

    onRectChange(fitRect({ x, y, width, height }))
  }, [fitRect, fracRatio, onRectChange, pointerFrac])

  useEffect(() => {
    const onMove = (e) => { if (dragRef.current) applyFromPointer(e.clientX, e.clientY) }
    const onUp = () => { dragRef.current = null }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [applyFromPointer])

  const startDraw = (event) => {
    // Ignore pointerdowns on the rect, its handles, or the floating ratio toolbar
    // — only an empty area of the image starts a fresh draw.
    if (event.target.dataset.handle || event.target.dataset.body) return
    if (event.target.closest('.a1-web-figure-crop__bar')) return
    const origin = pointerFrac(event.clientX, event.clientY)
    dragRef.current = { mode: 'draw', origin }
    event.preventDefault()
    onRectChange({ x: origin.x, y: origin.y, width: 0, height: 0 })
  }

  // Changing the ratio re-shapes the current rectangle around its centre rather
  // than clearing it; "Free" leaves the rectangle as-is.
  const changeRatio = (next) => {
    onRatioChange(next)
    const nextPixel = parseRatio(next)
    if (rect && rect.width > 0.005 && nextPixel && imgRatio) {
      onRectChange(reshapeToRatio(rect, nextPixel / imgRatio))
    }
  }

  const startMove = (event) => {
    event.stopPropagation()
    event.preventDefault()
    dragRef.current = { mode: 'move', origin: pointerFrac(event.clientX, event.clientY), start: rect }
  }

  const startResize = (event, handle) => {
    event.stopPropagation()
    event.preventDefault()
    dragRef.current = { mode: 'resize', handle, start: rect }
  }

  const hasRect = rect && rect.width > 0.005 && rect.height > 0.005

  return (
    <div className="a1-web-figure-crop">
      <div
        ref={stageRef}
        className="a1-web-figure-crop__stage"
        style={imgRatio ? { aspectRatio: String(imgRatio) } : undefined}
        onPointerDown={startDraw}
      >
        <img src={src} alt="" className="a1-web-figure-crop__img" onLoad={handleImgLoad} draggable={false} />
        {hasRect ? (
          <div
            className="a1-web-figure-crop__rect"
            data-body="true"
            style={{
              insetInlineStart: `${rect.x * 100}%`,
              insetBlockStart: `${rect.y * 100}%`,
              inlineSize: `${rect.width * 100}%`,
              blockSize: `${rect.height * 100}%`,
            }}
            onPointerDown={startMove}
            role="presentation"
          >
            {HANDLES.map((h) => (
              <span
                key={h.id}
                data-handle={h.id}
                className={`a1-web-figure-crop__handle a1-web-figure-crop__handle--${h.id}`}
                onPointerDown={(e) => startResize(e, h)}
              />
            ))}
          </div>
        ) : null}
      </div>
      <div className="a1-web-figure-crop__bar">
        <Toolbar aria-label="Crop aspect ratio">
          <ToolbarGroup
            aria-label="Aspect ratio"
            showLabels
            value={ratio ?? ''}
            onChange={changeRatio}
            options={RATIO_PRESETS}
          />
        </Toolbar>
      </div>
    </div>
  )
}

export { DEFAULT_RECT }
