import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@gtivr4/a1-design-system-react'
import { COMPLETION_TONES, isCompletionActionable } from './CompletionButton.jsx'
import { drawPlaneScene, planeScene, planeTimeline, readPlaneColors, readPlaneTiming } from './paper-plane.js'
import './completion-button.css'
import './send-button.css'

// One large, fixed-size send button. At rest it shows its icon, label and a
// secondary description, centred. On press nothing resizes: the centred
// content slides down and fades, the working label appears in a bottom row,
// and the icon becomes a paper plane launched from a slingshot along an arc
// for as long as the work takes, slowing the longer it runs. The consumer
// reports the truth through `status`; when it becomes success or failed, the
// plane flies out (or crash-lands with a mini explosion), the bottom row shows
// the result label and
// `onSettled(status)` fires. Retry relaunches from the same stage.

const reducedQuery = '(prefers-reduced-motion: reduce)'

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(reducedQuery).matches)
  useEffect(() => {
    const query = window.matchMedia(reducedQuery)
    const update = event => setReduced(event.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

/**
 * @param {object} props
 * @param {'idle'|'working'|'success'|'failed'|'retry'} props.status
 * @param {Record<string, string>} props.labels  Visible label per status. Idle is centred; the rest show in the bottom row.
 * @param {string} [props.description]  Secondary text under the idle label; also the button's accessible description.
 * @param {Record<string, string|null>} [props.icons]  Material Symbols name per status (working shows the plane instead).
 * @param {boolean} [props.fullWidth=false]  Fill the container instead of the stage width token.
 * @param {() => void} [props.onClick]  Called only when idle or retry.
 * @param {(status: 'success'|'failed') => void} [props.onSettled]  The result is showing.
 * @param {React.Ref<HTMLButtonElement>} [props.buttonRef]
 */
export function SendButton({ status, labels, description, icons = {}, fullWidth = false, onClick, onSettled, buttonRef }) {
  const reduced = useReducedMotion()
  const descriptionId = useId()
  const [shown, setShown] = useState(status)
  const run = useRef({ start: 0, resultAt: null, result: null, origin: null, settled: false })
  const elementRef = useRef(null)
  const canvasRef = useRef(null)
  const reducedRef = useRef(reduced)
  const settledRef = useRef(onSettled)
  reducedRef.current = reduced
  settledRef.current = onSettled

  const settle = () => {
    if (run.current.settled) return
    run.current.settled = true
    setShown(run.current.result)
    settledRef.current?.(run.current.result)
  }

  useEffect(() => {
    if (status === 'working') {
      // Record where the visible icon sits so the plane can grow out of it.
      const button = elementRef.current
      const icon = button?.querySelector(`[data-icon-for="${shown}"]`)
      let origin = null
      if (button && icon) {
        const from = button.getBoundingClientRect()
        const glyph = icon.getBoundingClientRect()
        origin = { x: glyph.left - from.left + glyph.width / 2, y: glyph.top - from.top + glyph.height / 2, size: glyph.width }
      }
      // The plane flies at the resting icon's size, measured even while hidden.
      const iconSize = button?.querySelector('[data-icon-for="idle"]')?.getBoundingClientRect().width || null
      run.current = { start: performance.now(), resultAt: null, result: null, origin, iconSize, settled: false }
      setShown('working')
    } else if ((status === 'success' || status === 'failed') && shown === 'working') {
      // Keep flying: the animation finishes the story before the result shows.
      run.current.resultAt = performance.now() - run.current.start
      run.current.result = status
      if (reducedRef.current) settle()
    } else if (status !== 'success' && status !== 'failed') {
      setShown(status)
    }
  }, [status])

  const active = shown !== 'idle'

  // Draw every frame once sending starts, including the finished flight, so
  // theme and mode changes recolour it immediately.
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!active) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      return undefined
    }
    let frame = 0
    const draw = now => {
      const { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      if (canvas.width !== Math.round(cssWidth * ratio)) canvas.width = Math.round(cssWidth * ratio)
      if (canvas.height !== Math.round(cssHeight * ratio)) canvas.height = Math.round(cssHeight * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, cssWidth, cssHeight)
      const host = canvas.parentElement
      const elapsed = now - run.current.start
      const timing = readPlaneTiming(host)
      const timeline = planeTimeline(elapsed, run.current.resultAt, timing, run.current.result)
      // The artwork uses the area above the bottom label row.
      const band = host.querySelector('.a1-button-completion__row')?.offsetHeight ?? 0
      const scene = planeScene(timeline, cssWidth, Math.max(cssHeight - band, 1), run.current.result, elapsed, reducedRef.current, run.current.origin, run.current.iconSize, timing)
      drawPlaneScene(context, scene, readPlaneColors(host))
      // The result (tone and label) arrives with the mark, after the beat.
      if (timeline.stage === 'mark' || timeline.stage === 'done') settle()
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [active])

  const actionable = isCompletionActionable(shown)
  const rowIcon = shown === 'working' ? null : icons[shown]
  return (
    <button
      ref={node => {
        elementRef.current = node
        if (typeof buttonRef === 'function') buttonRef(node)
        else if (buttonRef) buttonRef.current = node
      }}
      type="button"
      className={`a1-button-completion a1-button-completion--send${fullWidth ? ' a1-button-completion--full-width' : ''}`}
      data-status={shown}
      data-tone={COMPLETION_TONES[shown]}
      aria-disabled={actionable ? undefined : 'true'}
      aria-busy={shown === 'working' ? 'true' : undefined}
      aria-describedby={!active && description ? descriptionId : undefined}
      onClick={() => actionable && onClick?.()}
    >
      <canvas ref={canvasRef} className="a1-button-completion__stage" aria-hidden="true" />
      {/* The resting content stays mounted so it can slide down and fade. */}
      <span className="a1-button-completion__intro" aria-hidden={active ? 'true' : undefined}>
        {icons.idle && (
          // Filled and extra large, to match the solid plane it becomes.
          <span className="a1-button-completion__icon" data-icon-for="idle" aria-hidden="true"><Icon name={icons.idle} size="xl" fill /></span>
        )}
        <span className="a1-button-completion__label">{labels.idle}</span>
        {description && (
          <span id={descriptionId} className="a1-button-completion__description" aria-hidden="true">{description}</span>
        )}
      </span>
      {active && (
        <span className="a1-button-completion__row">
          {rowIcon && (
            <span key={rowIcon} className="a1-button-completion__icon" data-icon-for={shown} aria-hidden="true"><Icon name={rowIcon} /></span>
          )}
          <span key={labels[shown]} className="a1-button-completion__label">{labels[shown]}</span>
        </span>
      )}
    </button>
  )
}
