import React from 'react'
import './accordion-motion.css'

// Opening and closing transitions for the A1 Accordion. The accordions keep
// their own markup, semantics and keyboard; this wrapper only restyles how the
// body and its content move, in a scoped namespace. 'default' leaves A1 as is.

export const ACCORDION_TRANSITIONS = [
  { id: 'default', label: 'Default', summary: 'The A1 accordion as it ships: a quick height change.' },
  { id: 'smooth', label: 'Smooth', summary: 'A slower height change while the content fades.' },
  { id: 'slide', label: 'Slide', summary: 'Content slides down into place as it fades in, and back up to close.' },
  { id: 'bounce', label: 'Bounce', summary: 'Content springs into place, slightly overshooting.' },
  { id: 'stagger', label: 'Stagger', summary: 'Each piece of content appears in turn, top to bottom.' },
  { id: 'unfold', label: 'Unfold', summary: 'Content folds down from the header like paper, and folds back up.' },
  { id: 'blur', label: 'Blur', summary: 'Content comes into focus as it opens.' },
  { id: 'wipe', label: 'Wipe', summary: 'Content is revealed from the top down, and hidden bottom up.' },
]

/**
 * @param {object} props
 * @param {string} [props.transition='default']  One of ACCORDION_TRANSITIONS.
 * @param {'fast'|'normal'|'slow'|'slower'|'slowest'} [props.speed='slow']  Semantic motion duration.
 * @param {React.ReactNode} props.children  A1 Accordions. For Stagger, wrap each
 *   accordion's content in one element whose children appear in turn.
 */
export function AccordionMotion({ transition = 'default', speed = 'slow', children, className = '', ...props }) {
  return (
    <div {...props} className={`a1-accordion-motion ${className}`.trim()} data-motion={transition}
      style={{ '--a1-accordion-motion-duration': `var(--semantic-motion-duration-${speed})` }}>
      {children}
    </div>
  )
}
