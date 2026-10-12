import React, { useRef } from 'react'
import { StepTracker } from '@gtivr4/a1-design-system-react'
import './tracker-variants.css'
import { TRACKER_TRANSITIONS, useTrackerMotion } from './useTrackerMotion.js'
import motion from '../../../../system/tokens/motion.json'

export const TRACKER_VARIANTS = [
  { id: 'default', label: 'A1 default', description: 'A1’s standard active pill and quiet dots.' },
  { id: 'rings', label: 'Rings', description: 'Open circles with a solid center marking your position.' },
  { id: 'segments', label: 'Segments', description: 'Equal horizontal bars give each page the same amount of space.' },
  { id: 'ticks', label: 'Ticks', description: 'A taller tick stands out within a compact row of vertical marks.' },
  { id: 'numbers', label: 'Numbers', description: 'Numbered markers make the position explicit at a glance.' },
  { id: 'spotlight', label: 'Spotlight', description: 'A larger outlined halo picks out one dot without changing the spacing.' },
]

/** Display-only A1 StepTracker. Navigation and announcements belong to the host. */
export function TrackerVariants({ variant = 'default', steps = 5, currentStep = 1, align = 'left', transition = 'standard', duration = parseFloat(motion.semantic.motion.duration.slow.$value), ...props }) {
  const treatment = TRACKER_VARIANTS.some(item => item.id === variant) ? variant : 'default'
  const total = Number.isFinite(Number(steps)) ? Math.max(1, Math.floor(Number(steps))) : 1
  const current = Number.isFinite(Number(currentStep)) ? Math.min(total, Math.max(1, Math.floor(Number(currentStep)))) : 1
  const host = useRef(null)
  const effect = TRACKER_TRANSITIONS.some(item => item.id === transition) ? transition : 'standard'
  const timing = Number.isFinite(Number(duration)) ? Math.max(0, Number(duration)) : parseFloat(motion.semantic.motion.duration.slow.$value)
  useTrackerMotion(host, { current, total, treatment, align, transition: effect, duration: timing })
  return <StepTracker ref={host} {...props} steps={total} currentStep={current} align={align}
    className="a1-tracker-study" data-treatment={treatment} data-transition={effect} style={{ '--a1-tracker-study-duration': `${timing}ms` }} />
}
