import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { craneState } from './construction.js'
import './page-construction.css'

// Reusable core of the "Under construction" page loader, independent of the
// Labs shell. Wrap a page and mark its main pieces with data-construction-block
// (use plain wrapper elements: the block's ::before and ::after are used);
// while `loading`, a tower crane places them one by one as placeholders. When
// loading finishes the crane lifts away and the placeholders become the page.
// Each block gets data-construction-state: pending | placed | done.

function toPx(value, element) {
  const number = Number.parseFloat(value)
  if (!Number.isFinite(number)) return 0
  if (String(value).trim().endsWith('rem')) {
    return number * Number.parseFloat(getComputedStyle(element.ownerDocument.documentElement).fontSize)
  }
  return number
}

/**
 * @param {object} props
 * @param {boolean} [props.loading=true]  While true the crane builds; false reveals the page.
 * @param {boolean} [props.paused=false]  Freeze the crane where it is.
 * @param {number} [props.stepDuration=1300]  ms for the crane to place one block.
 * @param {string} [props.blockSelector='[data-construction-block]']  Which descendants are blocks.
 * @param {React.ReactNode} props.children  The page; mark blocks with data-construction-block (or blockSelector).
 */
export function PageConstruction({ loading = true, paused = false, stepDuration = 1300, blockSelector = '[data-construction-block]', children, className = '', ...props }) {
  const rootRef = useRef(null)
  const craneRef = useRef(null)
  const layout = useRef({ blocks: [], targets: [], home: 0, raised: 0 })
  const clock = useRef({ elapsed: 0, last: null, carrying: undefined, placed: -1 })

  // Measure every block, the mast and the rope's origin, relative to the root.
  useLayoutEffect(() => {
    const root = rootRef.current
    const measure = () => {
      const crane = craneRef.current
      const box = root.getBoundingClientRect()
      const rig = crane.querySelector('.a1-page-construction__rig').getBoundingClientRect()
      const mast = crane.querySelector('.a1-page-construction__mast').getBoundingClientRect()
      const hook = crane.querySelector('.a1-page-construction__hook').offsetHeight
      const blocks = [...root.querySelectorAll(blockSelector)]
      layout.current = {
        blocks,
        home: mast.left - box.left + mast.width / 2,
        raised: toPx(getComputedStyle(root).getPropertyValue('--component-page-construction-raised-rope'), root),
        targets: blocks.map(block => {
          const rect = block.getBoundingClientRect()
          return {
            x: rect.left - box.left + rect.width / 2,
            drop: Math.max(0, rect.top - rig.top - hook),
            width: rect.width,
            height: rect.height,
          }
        }),
      }
      clock.current.carrying = undefined
      clock.current.placed = -1
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [blockSelector])

  useEffect(() => {
    const root = rootRef.current
    const crane = craneRef.current
    const view = root.ownerDocument.defaultView
    const reduced = view.matchMedia('(prefers-reduced-motion: reduce)').matches

    const setBlocks = state => layout.current.blocks.forEach((block, index) => {
      const next = typeof state === 'function' ? state(index) : state
      if (block.dataset.constructionState !== next) block.dataset.constructionState = next
    })
    const apply = ({ x, rope, sway, carrying, placed }) => {
      crane.style.setProperty('--a1-page-construction-x', `${x}px`)
      crane.style.setProperty('--a1-page-construction-rope', `${rope}px`)
      crane.style.setProperty('--a1-page-construction-sway', `${sway}deg`)
      if (carrying !== clock.current.carrying) {
        clock.current.carrying = carrying
        const target = carrying == null ? null : layout.current.targets[carrying]
        crane.dataset.carrying = target ? 'true' : 'false'
        if (target) {
          crane.style.setProperty('--a1-page-construction-load-width', `${target.width}px`)
          crane.style.setProperty('--a1-page-construction-load-height', `${target.height}px`)
        }
      }
      if (placed !== clock.current.placed) {
        clock.current.placed = placed
        setBlocks(index => (index < placed ? 'placed' : 'pending'))
      }
    }

    if (!loading) {
      root.dataset.phase = 'exit'
      setBlocks('done')
      return undefined
    }
    if (reduced) {
      // No crane motion: every placeholder is shown at once, the crane parked.
      root.dataset.phase = 'idle'
      apply({ x: layout.current.home, rope: layout.current.raised, sway: 0, carrying: null, placed: layout.current.blocks.length })
      return undefined
    }

    let frame = 0
    const tick = now => {
      const state = clock.current
      if (state.last != null && !paused) state.elapsed += now - state.last
      state.last = now
      const { targets, home, raised } = layout.current
      const scene = craneState(state.elapsed, stepDuration, targets, { home, raised })
      if (root.dataset.phase !== scene.phase) root.dataset.phase = scene.phase
      apply(scene)
      frame = view.requestAnimationFrame(tick)
    }
    frame = view.requestAnimationFrame(tick)
    return () => {
      view.cancelAnimationFrame(frame)
      clock.current.last = null
    }
  }, [loading, paused, stepDuration])

  return (
    <div {...props} ref={rootRef} className={`a1-page-construction ${className}`.trim()} data-paused={paused ? 'true' : undefined}>
      {children}
      <div ref={craneRef} className="a1-page-construction__crane" aria-hidden="true">
        <span className="a1-page-construction__jib" />
        <span className="a1-page-construction__mast" />
        <span className="a1-page-construction__cab" />
        <span className="a1-page-construction__trolley">
          <span className="a1-page-construction__rig">
            <span className="a1-page-construction__rope" />
            <span className="a1-page-construction__hook" />
            <span className="a1-page-construction__load" />
          </span>
        </span>
      </div>
    </div>
  )
}
