import React from 'react'
import { Toolbar } from '@gtivr4/a1-design-system-react'
import { useHoverPause } from './useHoverPause.js'
import './toolbar-group.css'

export const HOVER_TREATMENTS = [
  { id: 'current', label: 'Current state', description: 'The existing A1 hover treatment for each control. Selected single-choice items stay unchanged.' },
  { id: 'none', label: 'No hover state', description: 'Hover leaves each item unchanged. Selection and keyboard focus remain visible.' },
  { id: 'distinct', label: 'Distinct hover state', description: 'A strong action-colored fill marks items you can change. Selected group items stay unchanged.' },
  { id: 'off-only', label: 'Hover when off', description: 'Only off or unselected items show the current subtle hover fill. Selected items stay unchanged.' },
  { id: 'distinct-off-only', label: 'Distinct hover when off', description: 'Only off or unselected items show the strong action-colored hover fill. Selected items stay unchanged.' },
  { id: 'match-active', label: 'Pause after click', description: 'Off items use the selected surface on hover; selected items become transparent. After clicking, hover pauses until you leave the item.' },
]

/** A1 toolbar with an opt-in hover study; children retain A1 state and semantics. */
export function HoverToolbar({ treatment = 'current', className = '', onClickCapture, onPointerOut, ...props }) {
  const resolved = HOVER_TREATMENTS.some(item => item.id === treatment) ? treatment : 'current'
  const events = useHoverPause(resolved, target => {
    const item = target.closest('button[aria-pressed], button[role="radio"]')
    if (!item || item.disabled) return null
    const attribute = item.hasAttribute('aria-pressed') ? 'aria-pressed' : 'aria-checked'
    if (attribute === 'aria-checked' && item.getAttribute(attribute) === 'true') return null
    return { item, before: item.getAttribute(attribute), readState: () => item.getAttribute(attribute) }
  }, { onClickCapture, onPointerOut })
  return <Toolbar {...props} {...events} className={`a1-toolbar-hover ${className}`} data-hover-treatment={resolved} />
}
