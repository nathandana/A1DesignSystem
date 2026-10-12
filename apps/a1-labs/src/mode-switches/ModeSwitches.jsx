import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Icon, Switch } from '@gtivr4/a1-design-system-react'
import { MODE_LABEL, TRI_STATE, chainPoints, dialIndex, dragPosition, nextCycle, pointerAngle, resolveMode, stepSpring, toggleBinary } from './mode-model.js'
import './mode-switches.css'

// Five light/dark mode switches. Each takes the current `mode` ('light',
// 'dark' or 'system'), whether the device prefers dark (`systemDark`) and
// `onChange(mode)`. Binary switches show and flip what is on screen; the
// others can also choose Auto ('system').

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

const toPx = (value, element) => {
  const number = Number.parseFloat(value) || 0
  return value.trim().endsWith('rem') ? number * Number.parseFloat(getComputedStyle(element.ownerDocument.documentElement).fontSize) : number
}

/** 1. A pull cord: pull the bead down past halfway and let go; it springs back. */
export function PullCord({ mode, systemDark, onChange, label = 'Dark mode' }) {
  const dark = resolveMode(mode, systemDark) === 'dark'
  const stageRef = useRef(null)
  const physics = useRef({ x: 0, y: 0, vx: 0, vy: 0 })
  const drag = useRef(null)
  const frame = useRef(0)
  const skipClick = useRef(false)
  const reduced = useReducedMotion()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [geo, setGeo] = useState(null)
  const metalId = `a1-mode-cord-metal-${useId().replace(/:/g, '')}`

  useLayoutEffect(() => {
    const stage = stageRef.current
    const style = getComputedStyle(stage)
    const token = name => style.getPropertyValue(`--component-mode-switches-${name}`)
    setGeo({
      width: stage.offsetWidth,
      length: toPx(token('cord-length'), stage),
      maxPull: toPx(token('cord-max-pull'), stage),
      bead: toPx(token('bead'), stage),
      ball: toPx(token('chain-ball'), stage),
      spacing: toPx(token('chain-spacing'), stage),
      threshold: Number(token('cord-threshold')),
      kick: toPx(token('spring-kick'), stage),
      spring: { stiffness: Number(token('spring-stiffness')), damping: Number(token('spring-damping')) },
    })
    return () => cancelAnimationFrame(frame.current)
  }, [])

  const settle = () => {
    cancelAnimationFrame(frame.current)
    if (reduced) { physics.current = { x: 0, y: 0, vx: 0, vy: 0 }; setPos({ x: 0, y: 0 }); return }
    const loop = () => {
      const next = stepSpring(physics.current, geo.spring)
      physics.current = next
      setPos({ x: next.x, y: next.y })
      if (!next.settled) frame.current = requestAnimationFrame(loop)
    }
    frame.current = requestAnimationFrame(loop)
  }
  const toggle = () => onChange(toggleBinary(mode, systemDark))
  const tug = () => {
    physics.current = { ...physics.current, vy: geo.kick }
    settle()
    toggle()
  }

  return (
    <div ref={stageRef} className="a1-mode-cord">
      <span className="a1-mode-cord__plate" aria-hidden="true" />
      {geo && (() => {
        // A ball chain: metal balls spaced along the curve, on a fine wire.
        const start = { x: geo.width / 2, y: 0 }
        const control = { x: geo.width / 2 + pos.x * 0.2, y: (geo.length + pos.y) / 2 }
        const end = { x: geo.width / 2 + pos.x, y: geo.length + pos.y }
        return (
          <svg className="a1-mode-cord__cord" aria-hidden="true" focusable="false" width={geo.width} height={geo.length + geo.maxPull + geo.bead}>
            <defs>
              <radialGradient id={metalId} cx="35%" cy="35%" r="65%">
                <stop offset="0%" className="a1-mode-cord__metal-light" />
                <stop offset="55%" className="a1-mode-cord__metal-mid" />
                <stop offset="100%" className="a1-mode-cord__metal-dark" />
              </radialGradient>
            </defs>
            <path d={`M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`} />
            {chainPoints(start, control, end, geo.spacing).map((point, i) => (
              <circle key={i} cx={point.x} cy={point.y} r={geo.ball / 2} fill={`url(#${metalId})`} />
            ))}
          </svg>
        )
      })()}
      <button type="button" role="switch" aria-checked={dark} aria-label={`${label}, pull cord`}
        className="a1-mode-cord__bead" style={{ translate: `${pos.x}px ${pos.y}px` }}
        onPointerDown={event => {
          if (event.button !== 0 || !geo) return
          event.currentTarget.setPointerCapture(event.pointerId)
          cancelAnimationFrame(frame.current)
          drag.current = { x: event.clientX, y: event.clientY, moved: false, lastY: 0, lastX: 0 }
        }}
        onPointerMove={event => {
          const session = drag.current
          if (!session) return
          const next = dragPosition(event.clientX - session.x, event.clientY - session.y, geo.maxPull)
          if (Math.abs(next.y) > 4) session.moved = true
          physics.current = { ...next, vx: next.x - session.lastX, vy: next.y - session.lastY }
          session.lastX = next.x
          session.lastY = next.y
          setPos(next)
        }}
        onPointerUp={() => {
          const session = drag.current
          if (!session) return
          drag.current = null
          skipClick.current = true
          if (!session.moved) { tug(); return }
          if (physics.current.y / geo.maxPull >= geo.threshold) toggle()
          settle()
        }}
        onPointerCancel={() => { drag.current = null; settle() }}
        onClick={() => {
          // Pointer pulls are handled on release; this is Enter or Space.
          if (skipClick.current) { skipClick.current = false; return }
          tug()
        }}>
        <Icon name={dark ? 'dark_mode' : 'light_mode'} size="sm" />
      </button>
    </div>
  )
}

/** 2. The A1 Switch, extended with a sun or moon in its thumb. */
export function SunMoonSwitch({ mode, systemDark, onChange, label = 'Dark mode' }) {
  const dark = resolveMode(mode, systemDark) === 'dark'
  return (
    <Switch className="a1-mode-sunmoon" size="comfortable" label={label} checked={dark}
      onChange={checked => onChange(checked ? 'dark' : 'light')} />
  )
}

/** 3. A rotary dial with Light, Auto and Dark detents. */
export function ModeDial({ mode, onChange, label = 'Colour mode' }) {
  const index = TRI_STATE.indexOf(mode)
  const knobRef = useRef(null)
  // While dragging, the knob previews the nearest detent; the mode changes
  // only when the pointer is released.
  const [preview, setPreview] = useState(null)
  const set = next => { if (next !== index) onChange(TRI_STATE[next]) }
  const fromPointer = event => {
    const box = knobRef.current.getBoundingClientRect()
    const detent = Number.parseFloat(getComputedStyle(knobRef.current).getPropertyValue('--component-mode-switches-dial-angle'))
    return dialIndex(pointerAngle(event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2), detent)
  }
  const shownIndex = preview ?? index
  return (
    <div className="a1-mode-dial" style={{ '--a1-mode-dial-step': shownIndex - 1 }}>
      {TRI_STATE.map((value, i) => (
        <span key={value} className="a1-mode-dial__label" aria-hidden="true" data-active={i === shownIndex || undefined}
          style={{ '--a1-mode-dial-label-step': i - 1 }} onClick={() => set(i)}>{MODE_LABEL[value]}</span>
      ))}
      <div ref={knobRef} className="a1-mode-dial__knob" role="slider" tabIndex={0} aria-label={label}
        aria-valuemin={0} aria-valuemax={2} aria-valuenow={index} aria-valuetext={MODE_LABEL[mode]}
        onKeyDown={event => {
          const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key]
          if (step) { event.preventDefault(); set(Math.max(0, Math.min(2, index + step))) }
          else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); set(event.key === 'Home' ? 0 : 2) }
        }}
        onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setPreview(fromPointer(event)) }}
        onPointerMove={event => { if (preview !== null) setPreview(fromPointer(event)) }}
        onPointerUp={() => { if (preview !== null) { set(preview); setPreview(null) } }}
        onPointerCancel={() => setPreview(null)}>
        <span className="a1-mode-dial__notch" aria-hidden="true" />
      </div>
    </div>
  )
}

/** 4. An eclipse: each press moves the moon — Light, Dark (eclipsed), Auto (half). */
export function EclipseButton({ mode, onChange }) {
  const next = nextCycle(mode)
  return (
    <button type="button" className="a1-mode-eclipse" data-mode={mode}
      aria-label={`${MODE_LABEL[mode]} colour mode. Activate for ${MODE_LABEL[next]}.`} onClick={() => onChange(next)}>
      <span className="a1-mode-eclipse__sky" aria-hidden="true">
        <span className="a1-mode-eclipse__sun" />
        <span className="a1-mode-eclipse__moon" />
      </span>
      <span className="a1-mode-eclipse__label">{MODE_LABEL[mode]}</span>
    </button>
  )
}

/**
 * 5. A three-position slide switch: Light, Auto or Dark. Drag the thumb (or
 * press anywhere on the track) and it follows; the mode changes on release,
 * at the nearest position. Native radios provide keyboard and labels.
 */
export function SlideSwitch({ mode, onChange, label = 'Colour mode' }) {
  const name = useId()
  const index = TRI_STATE.indexOf(mode)
  const [drag, setDrag] = useState(null)
  const stepAt = (event, track) => {
    const box = track.getBoundingClientRect()
    return Math.max(0, Math.min(2, ((event.clientX - box.left) / box.width) * 3 - 0.5))
  }
  return (
    <fieldset className="a1-mode-slide" style={{ '--a1-mode-slide-step': drag ?? index }} data-dragging={drag !== null || undefined}>
      <legend className="a1-mode-slide__legend">{label}</legend>
      <span className="a1-mode-slide__track" aria-hidden="true"
        onPointerDown={event => {
          if (event.button !== 0) return
          event.currentTarget.setPointerCapture(event.pointerId)
          setDrag(stepAt(event, event.currentTarget))
        }}
        onPointerMove={event => { if (drag !== null) setDrag(stepAt(event, event.currentTarget)) }}
        onPointerUp={() => {
          if (drag === null) return
          const next = TRI_STATE[Math.round(drag)]
          setDrag(null)
          if (next !== mode) onChange(next)
        }}
        onPointerCancel={() => setDrag(null)}>
        <span className="a1-mode-slide__thumb" />
      </span>
      <div className="a1-mode-slide__options">
        {TRI_STATE.map(value => (
          <label key={value} className="a1-mode-slide__option">
            <input className="a1-mode-slide__input" type="radio" name={name} value={value} checked={mode === value} onChange={() => onChange(value)} />
            <Icon name={value === 'light' ? 'light_mode' : value === 'dark' ? 'dark_mode' : 'brightness_auto'} size="sm" />
            <span>{MODE_LABEL[value]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
