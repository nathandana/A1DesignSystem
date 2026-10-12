import React, { useLayoutEffect, useRef } from 'react'
import { CheckboxGroup } from '@gtivr4/a1-design-system-react'
import { changedStates } from './checkbox-model.js'
import './checkbox-motion.css'

// The A1 CheckboxGroup with animated checking, unchecking and indeterminate
// states. Labels, hints, keyboard, focus, sizes and disabled options are A1's.
// Only the box that changed animates: it is tagged with its new state
// (on / off / mixed) until its animation ends. `indeterminate` lists option
// values whose box shows the mixed state (set on the native input, so
// assistive technology hears "mixed").

export const CHECKBOX_VARIANTS = [
  { id: 'default', label: 'Default', summary: 'The A1 checkbox as it ships: the box fills and the tick appears.' },
  { id: 'pop', label: 'Pop', summary: 'The box swells and the tick or dash springs in; unchecking shrinks it away.' },
  { id: 'draw', label: 'Draw', summary: 'The tick draws left to right and the dash from the centre out; unchecking erases it.' },
  { id: 'fill', label: 'Fill', summary: 'Colour floods out from the centre, then the tick appears; unchecking drains it.' },
  { id: 'flip', label: 'Flip', summary: 'The box flips edge-on and back to show its new state.' },
  { id: 'jelly', label: 'Jelly', summary: 'The box squashes and wobbles like jelly.' },
  { id: 'pulse', label: 'Pulse', summary: 'A ring pulses out from the box as it is checked.' },
  { id: 'slide', label: 'Slide', summary: 'The tick slides up into the box; unchecking slides it out.' },
]

/**
 * @param {object} props
 * @param {string} [props.variant='pop']  One of CHECKBOX_VARIANTS.
 * @param {'fast'|'normal'|'slow'|'slower'|'slowest'} [props.speed='slow']  Semantic motion duration.
 * @param {string[]} [props.indeterminate=[]]  Option values shown as mixed.
 * Other props (options, value, onChange, label, size…) go to the A1 CheckboxGroup.
 */
export function LivelyCheckboxGroup({ variant = 'pop', speed = 'slow', indeterminate = [], value = [], ...props }) {
  const rootRef = useRef(null)
  const previous = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const values = props.options.map(option => option.value)
    // The mixed state only exists as a DOM property.
    for (const input of root.querySelectorAll('input[type="checkbox"]')) {
      input.indeterminate = indeterminate.includes(input.value) && !value.includes(input.value)
    }
    const now = { checked: value, mixed: indeterminate }
    // Default is the A1 checkbox as it ships, so nothing is tagged.
    if (previous.current && variant !== 'default') {
      for (const [option, state] of Object.entries(changedStates(previous.current, now, values))) {
        const input = root.querySelector(`input[type="checkbox"][value="${CSS.escape(option)}"]`)
        if (input) input.dataset.a1Animate = state
      }
    }
    previous.current = now
  }, [value, indeterminate, props.options, variant])

  return (
    <div ref={rootRef} className="a1-checkbox-lively" data-variant={variant}
      style={{ '--a1-checkbox-lively-duration': `var(--semantic-motion-duration-${speed})` }}
      onAnimationEnd={event => { if (event.target.dataset?.a1Animate) delete event.target.dataset.a1Animate }}>
      <CheckboxGroup value={value} {...props} />
    </div>
  )
}
