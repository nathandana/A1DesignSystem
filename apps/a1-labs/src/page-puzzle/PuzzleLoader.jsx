import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { measureBlocks, setData, skeletonLayers, useLoaderClock, useReducedMotion } from '../loading-preview/loader-utils.js'
import { arrivalOrder, piecesSent, scatter, tileGrid } from './puzzle.js'
import './puzzle.css'

// Jigsaw page loader. While `loading`, the page arrives as puzzle pieces that
// fly in, spinning, and snap into place. Each piece shows its slice of the
// page's layout (blocks marked data-loading-block), so the finished puzzle is
// the page's skeleton. A shine sweeps it while still loading; when loading
// finishes the pieces fall away to reveal the page.

const SKELETON = 'var(--semantic-color-surface-raised)'

/**
 * @param {object} props
 * @param {boolean} [props.loading=true]
 * @param {boolean} [props.paused=false]  Stop sending pieces (pieces in flight land).
 * @param {number} [props.buildDuration=5000]  ms for every piece to be sent.
 * @param {string} [props.blockSelector='[data-loading-block]']
 */
export function PuzzleLoader({ loading = true, paused = false, buildDuration = 5000, blockSelector = '[data-loading-block]', children, className = '', ...props }) {
  const rootRef = useRef(null)
  const pieceRefs = useRef([])
  const [layout, setLayout] = useState(null)
  const reduced = useReducedMotion(rootRef)

  useLayoutEffect(() => {
    const root = rootRef.current
    const measure = () => {
      const box = root.getBoundingClientRect()
      const size = Number.parseFloat(getComputedStyle(root).getPropertyValue('--component-page-puzzle-tile-size'))
        * Number.parseFloat(getComputedStyle(root.ownerDocument.documentElement).fontSize)
      setLayout({ width: box.width, height: box.height, size: size || 80, blocks: measureBlocks(root, blockSelector) })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [blockSelector])

  const pieces = useMemo(() => {
    if (!layout) return []
    const { columns, rows, tileWidth, tileHeight } = tileGrid(layout.width, layout.height, layout.size)
    const order = arrivalOrder(columns * rows)
    const arrival = new Array(order.length)
    order.forEach((piece, position) => { arrival[piece] = position })
    return Array.from({ length: columns * rows }, (_, index) => {
      const x = (index % columns) * tileWidth
      const y = Math.floor(index / columns) * tileHeight
      const from = scatter(index)
      return {
        index, arrival: arrival[index],
        style: {
          left: `${x}px`, top: `${y}px`, width: `${tileWidth}px`, height: `${tileHeight}px`,
          background: `${skeletonLayers(layout.blocks, SKELETON, x, y)}, var(--semantic-color-surface-page)`,
          '--a1-page-puzzle-from': `translate(${from.x * layout.width}px, ${from.y * layout.height}px) rotate(${from.rotate}deg) scale(${from.scale})`,
          '--a1-page-puzzle-order': arrival[index],
        },
      }
    })
  }, [layout])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!loading) {
      setData(root, 'phase', 'exit')
    } else if (reduced) {
      setData(root, 'phase', 'idle')
      pieceRefs.current.forEach(piece => piece && setData(piece, 'placed', 'true'))
    }
  }, [loading, reduced, pieces])

  useLoaderClock(rootRef, loading && !reduced && pieces.length > 0, paused, elapsed => {
    const sent = piecesSent(elapsed, buildDuration, pieces.length)
    pieces.forEach(piece => {
      const element = pieceRefs.current[piece.index]
      if (element) setData(element, 'placed', piece.arrival < sent ? 'true' : 'false')
    })
    // Once the last piece has had time to land, the puzzle is complete.
    const settled = elapsed > buildDuration + 700
    setData(rootRef.current, 'phase', sent === pieces.length && settled ? 'idle' : 'build')
  })

  return (
    <div {...props} ref={rootRef} className={`a1-page-puzzle ${className}`.trim()} data-paused={paused ? 'true' : undefined}>
      {children}
      <div className="a1-page-puzzle__board" aria-hidden="true">
        {pieces.map(piece => (
          <span key={`${pieces.length}-${piece.index}`} ref={node => { pieceRefs.current[piece.index] = node }}
            className="a1-page-puzzle__piece" data-placed="false" style={piece.style} />
        ))}
        <span className="a1-page-puzzle__shine" />
      </div>
    </div>
  )
}
