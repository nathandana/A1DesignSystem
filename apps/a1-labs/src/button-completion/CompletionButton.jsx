import React, { useLayoutEffect, useRef, useState } from 'react'
import { CircularProgress, Icon } from '@gtivr4/a1-design-system-react'
import './completion-button.css'

// Reusable core of the button completion experiment, independent of the Labs
// shell. The consumer owns the work and drives `status`; the button turns into
// its own result without changing width.
//
// idle → working → success
//               ↘ failed → retry → working …

export const COMPLETION_STATUSES = ['idle', 'working', 'success', 'failed', 'retry']

const DEFAULT_ICONS = { idle: null, success: 'check', failed: 'priority_high', retry: 'refresh' }
export const COMPLETION_TONES = { idle: 'primary', working: 'primary', success: 'success', failed: 'error', retry: 'error' }

/** Only idle and retry accept a press; other statuses keep focus but are inert. */
export function isCompletionActionable(status) {
  return status === 'idle' || status === 'retry'
}

export function CompletionFace({ status, label, icon }) {
  return (
    <>
      {(status === 'working' || icon) && (
        <span key={icon ?? 'working'} className="a1-button-completion__icon" aria-hidden="true">
          {status === 'working'
            ? <CircularProgress size="xs" indeterminate aria-hidden="true" className="a1-button-completion__spinner" />
            : <Icon name={icon} />}
        </span>
      )}
      <span key={label} className="a1-button-completion__label">{label}</span>
    </>
  )
}

/**
 * Width of the widest face for the current size, labels and theme. Render
 * `measure` (hidden copies of each face) next to the button. Font loading and
 * theme changes resize the copies, so the observer keeps the width current.
 */
export function useWidestFace({ statuses, labels, icons, size }) {
  const measureRefs = useRef({})
  const [width, setWidth] = useState(0)
  const iconFor = key => ({ ...DEFAULT_ICONS, ...icons })[key]
  const labelKey = statuses.map(key => `${labels[key]}:${iconFor(key)}`).join('|')

  useLayoutEffect(() => {
    const faces = statuses.map(key => measureRefs.current[key]).filter(Boolean)
    const measure = () => setWidth(Math.ceil(Math.max(...faces.map(face => face.getBoundingClientRect().width))))
    measure()
    const observer = new ResizeObserver(measure)
    faces.forEach(face => observer.observe(face))
    return () => observer.disconnect()
  }, [size, labelKey])

  const measure = (
    <span className="a1-button-completion-measure" aria-hidden="true">
      {statuses.map(key => (
        <span key={key} ref={node => { measureRefs.current[key] = node }}
          className={`a1-button-completion a1-button-completion--${size}`} data-status={key}>
          <CompletionFace status={key} label={labels[key]} icon={iconFor(key)} />
        </span>
      ))}
    </span>
  )
  return { width, measure, iconFor }
}

/**
 * @param {object} props
 * @param {'idle'|'working'|'success'|'failed'|'retry'} props.status
 * @param {Record<string, string>} props.labels  Visible label for every status.
 * @param {Record<string, string|null>} [props.icons]  Material Symbols name per status (working always shows a spinner).
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.fullWidth=false]  Fill the container instead of the widest face.
 * @param {() => void} [props.onClick]  Called only when idle or retry.
 * @param {React.Ref<HTMLButtonElement>} [props.buttonRef]
 */
export function CompletionButton({ status, labels, icons, size = 'md', fullWidth = false, onClick, buttonRef }) {
  const { width, measure, iconFor } = useWidestFace({ statuses: COMPLETION_STATUSES, labels, icons, size })
  const actionable = isCompletionActionable(status)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`a1-button-completion a1-button-completion--${size}${fullWidth ? ' a1-button-completion--full-width' : ''}`}
        data-status={status}
        data-tone={COMPLETION_TONES[status]}
        aria-disabled={actionable ? undefined : 'true'}
        aria-busy={status === 'working' ? 'true' : undefined}
        style={width && !fullWidth ? { '--a1-button-completion-width': `${width}px` } : undefined}
        onClick={() => actionable && onClick?.()}
      >
        <CompletionFace status={status} label={labels[status]} icon={iconFor(status)} />
      </button>
      {measure}
    </>
  )
}
