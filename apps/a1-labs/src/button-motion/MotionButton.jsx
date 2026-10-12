import React, { useEffect, useState } from 'react'
import { Button } from '@gtivr4/a1-design-system-react'
import './button-motion.css'

export const BUTTON_TREATMENTS = [
  { id: 'subtle', label: 'Subtle', summary: 'A slight expansion on hover and a small squeeze when pressed.' },
  { id: 'lift', label: 'Lift', summary: 'Lifts with a soft shadow, then presses back toward the surface.' },
  { id: 'glow', label: 'Glow', summary: 'A theme-colored glow spreads on hover and tightens when pressed.' },
  { id: 'tilt', label: 'Tilt', summary: 'Leans toward you on hover and rocks the other way when pressed.' },
  { id: 'spring', label: 'Spring', summary: 'Jumps upward, compresses on press and springs back on release.' },
  { id: 'ripple', label: 'Ripple', summary: 'Lifts on hover, presses down and releases an expanding ring without changing shape.' },
]

/** A1 owns the native button; only its decorative wrapper moves. */
export function MotionButton({ treatment = 'subtle', speed = 'normal', size = 'md', disabled, loading,
  onKeyDown, onKeyUp, onBlur, onClick, children, ...props }) {
  const [pressed, setPressed] = useState(false)
  const [activation, setActivation] = useState(0)
  const resolved = BUTTON_TREATMENTS.some(item => item.id === treatment) ? treatment : 'subtle'
  const duration = ['fast', 'normal', 'slow', 'slower', 'slowest'].includes(speed) ? speed : 'normal'
  const inert = Boolean(disabled || loading)
  useEffect(() => { setActivation(0) }, [resolved, inert])
  useEffect(() => {
    const queries = [matchMedia('(prefers-reduced-motion: reduce)'), matchMedia('(forced-colors: active)')]
    const cancel = () => setActivation(0)
    queries.forEach(query => query.addEventListener('change', cancel))
    return () => queries.forEach(query => query.removeEventListener('change', cancel))
  }, [])
  return <span className="a1-button-motion" data-treatment={resolved} data-inert={inert} data-pressed={pressed && !inert}
    style={{ '--a1-button-motion-duration': `var(--semantic-motion-duration-${duration})`,
      '--a1-button-motion-radius': size === 'sm' ? 'var(--component-button-small-border-radius)' : size === 'lg' ? 'var(--component-button-large-border-radius, var(--base-radius-lg))' : 'var(--component-button-border-radius)',
    }}>
    <span className="a1-button-motion__surface">
      <Button {...props} size={size} disabled={disabled} loading={loading}
        onClick={event => { if (!inert) { onClick?.(event); if (resolved === 'ripple' && !event.defaultPrevented && !matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)').matches) setActivation(value => value + 1) } }}
        onKeyDown={event => {
          onKeyDown?.(event)
          if (!event.defaultPrevented && (event.key === ' ' || event.key === 'Enter')) setPressed(true)
        }}
        onKeyUp={event => { onKeyUp?.(event); if (event.key === ' ' || event.key === 'Enter') setPressed(false) }}
        onBlur={event => { setPressed(false); onBlur?.(event) }}>{children}</Button>
    </span>
    {resolved === 'ripple' && activation > 0 && !inert && <span key={activation} className="a1-button-motion__ripple" aria-hidden="true" onAnimationEnd={() => setActivation(0)} />}
  </span>
}
