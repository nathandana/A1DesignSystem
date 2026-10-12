import React from 'react'
import './focus-animation.css'

export const focusStyles = [
  { value: 'settle', label: 'Ring settle' },
  { value: 'halo', label: 'Halo pulse' },
  { value: 'underline', label: 'Underline sweep' },
  { value: 'double', label: 'Double ring' },
  { value: 'zoom', label: 'Subtle zoom' },
  { value: 'lift', label: 'Gentle lift' },
  { value: 'corners', label: 'Corner draw' },
  { value: 'inset', label: 'Inset frame' },
]

// Reusable scope: opt native controls in with data-a1-focus-target.
// No Labs state, navigation or preview dependencies belong here.
export function FocusAnimation({ treatment = 'settle', speed = 'fast', children }) {
  const resolvedTreatment = focusStyles.some(option => option.value === treatment) ? treatment : 'settle'
  const resolvedSpeed = ['quick', 'fast', 'normal'].includes(speed) ? speed : 'fast'
  return (
    <div className="a1-focus-animation" data-style={resolvedTreatment}
      style={{ '--a1-focus-animation-duration': `var(--semantic-motion-duration-${resolvedSpeed})` }}>
      {children}
    </div>
  )
}
