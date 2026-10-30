import React from 'react'
import { CheckboxGroup } from '@gtivr4/a1-design-system-react'
import { HOVER_TREATMENTS } from './HoverToolbar.jsx'
import { useHoverPause } from './useHoverPause.js'
import './hover-checkbox.css'

/** Controlled A1 checkboxes; hover paints the row without hiding the checkmark. */
export function HoverCheckboxGroup({ treatment = 'current', value = [], className = '', onClickCapture, onPointerOut, ...props }) {
  const resolved = HOVER_TREATMENTS.some(item => item.id === treatment) ? treatment : 'current'
  const events = useHoverPause(resolved, target => {
    const item = target.closest('.a1-checkbox-item')
    const input = item?.querySelector('input[type="checkbox"]')
    if (!input || input.disabled) return null
    // Native inputs toggle before click capture. Controlled value still records
    // the pre-click state, including clicks forwarded from the native label.
    return { item, before: value.includes(input.value), readState: () => input.checked }
  }, { onClickCapture, onPointerOut })
  return <CheckboxGroup {...props} {...events} value={value}
    className={`a1-checkbox-hover ${className}`} data-hover-treatment={resolved} />
}
