import React, { useRef, useState } from 'react'
import { RadioGroup } from '@gtivr4/a1-design-system-react'
import './radio-variants.css'

// The A1 RadioGroup with an animated radio. Everything else — labels, hints,
// keyboard, focus, sizes, error and disabled states — is the A1 component;
// the variant only restyles the radio control in a scoped namespace.

export const RADIO_VARIANTS = [
  { id: 'grow', label: 'Grow', summary: 'The ring swells on hover, squishes when pressed and the dot springs in.' },
  { id: 'ripple', label: 'Ripple', summary: 'A soft halo on hover; choosing sends a ring rippling outward as the dot appears.' },
  { id: 'bounce', label: 'Bounce', summary: 'The dot falls in from above, the ring squashes and the dot rebounds; deselecting drops it out.' },
  { id: 'thicken', label: 'Thicken', summary: 'The ring grows inward until only a dot-sized centre is left; hover thickens it slightly.' },
  { id: 'travel', label: 'Travel', summary: 'The selection slides from the previous choice to the new one, stretching as it moves.' },
  { id: 'jelly', label: 'Jelly', summary: 'A hovered ring sags; choosing makes it wobble like jelly as the dot grows.' },
]

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const toMs = value => (value.trim().endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000) || 0

/**
 * @param {object} props
 * @param {string} [props.variant='grow']  One of RADIO_VARIANTS.
 * @param {'fast'|'normal'|'slow'|'slower'} [props.speed='slow']  Semantic motion duration.
 * Other props go to the A1 RadioGroup.
 */
export function LivelyRadioGroup({ variant = 'grow', speed = 'slow', onChange, ...props }) {
  // Selection animations play only after a person changes the group, not on load.
  const [touched, setTouched] = useState(false)
  const rootRef = useRef(null)
  const selected = useRef(props.value ?? props.defaultValue)
  const flight = useRef(null)

  // Travel: a copy of the selected radio flies from the old choice to the new
  // one; the new radio looks empty until it lands.
  const travel = (from, to) => {
    const root = rootRef.current
    const input = value => root.querySelector(`input[type="radio"][value="${CSS.escape(String(value))}"]`)
    const start = from == null ? null : input(from)
    const end = input(to)
    flight.current?.cancel()
    if (!start || !end || reducedMotion()) return
    const box = root.getBoundingClientRect()
    const a = start.getBoundingClientRect()
    const b = end.getBoundingClientRect()
    const style = getComputedStyle(root)
    const token = name => Number.parseFloat(style.getPropertyValue(`--component-radio-variants-${name}`)) || 1
    const dx = a.left - b.left
    const dy = a.top - b.top
    const vertical = Math.abs(dy) >= Math.abs(dx)
    const stretch = vertical ? `${token('travel-pinch')} ${token('travel-stretch')}` : `${token('travel-stretch')} ${token('travel-pinch')}`
    const traveller = document.createElement('span')
    traveller.className = 'a1-radio-lively__traveller'
    traveller.setAttribute('aria-hidden', 'true')
    Object.assign(traveller.style, { left: `${b.left - box.left}px`, top: `${b.top - box.top}px`, width: `${b.width}px`, height: `${b.height}px` })
    root.append(traveller)
    root.dataset.traveling = ''
    const animation = traveller.animate([
      { translate: `${dx}px ${dy}px`, scale: '1' },
      { translate: `${dx / 2}px ${dy / 2}px`, scale: stretch, offset: 0.5 },
      { translate: '0px 0px', scale: '1' },
    ], { duration: toMs(style.getPropertyValue('--a1-radio-lively-duration')), easing: 'cubic-bezier(0.4, 0, 0.2, 1)' })
    flight.current = animation
    const land = () => {
      traveller.remove()
      if (flight.current === animation) { delete root.dataset.traveling; flight.current = null }
    }
    animation.onfinish = land
    animation.oncancel = land
  }

  return (
    <div ref={rootRef} className="a1-radio-lively" data-variant={variant} data-touched={touched || undefined}
      style={{ '--a1-radio-lively-duration': `var(--semantic-motion-duration-${speed})` }}>
      <RadioGroup {...props} onChange={value => {
        setTouched(true)
        if (variant === 'travel') travel(selected.current, value)
        selected.current = value
        onChange?.(value)
      }} />
    </div>
  )
}
