import React, { useLayoutEffect, useState } from 'react'
import { Dialog } from '@gtivr4/a1-design-system-react'
import './dialog-motion.css'

// The A1 Dialog with enter and exit transitions and a configurable scrim.
// Everything is CSS on the native <dialog> and its ::backdrop: @starting-style
// sets where it enters from, the closed state where it leaves to, and
// display/overlay transitions keep it in the top layer while it leaves (where
// the browser supports that; elsewhere it closes instantly). The A1 Dialog
// still owns focus, Escape, backdrop clicks and returning focus.

export const DIALOG_MOTIONS = [
  { id: 'default', label: 'Default', icon: 'web_asset', directional: false, summary: 'The A1 dialog as it ships: it appears and disappears instantly.' },
  { id: 'fade', label: 'Fade', icon: 'blur_on', directional: false, summary: 'The dialog fades in and out.' },
  { id: 'scale', label: 'Scale', icon: 'zoom_in', directional: false, summary: 'The dialog grows slightly as it fades in, and shrinks as it leaves.' },
  { id: 'pop', label: 'Pop', icon: 'bubble_chart', directional: false, summary: 'The dialog springs past full size and settles.' },
  { id: 'slide', continues: true, label: 'Slide', icon: 'swipe_up', directional: true, summary: 'The dialog slides in from an edge.' },
  { id: 'flip', continues: true, label: 'Flip', icon: 'flip', directional: true, summary: 'The dialog turns to face you, pivoting on its center.' },
  { id: 'swing', label: 'Swing', icon: 'door_front', directional: true, summary: 'The dialog swings open on a hinge along one edge, like a door.' },
  { id: 'blur', label: 'Blur', icon: 'lens_blur', directional: false, summary: 'The dialog comes into focus as it fades in.' },
  { id: 'origin', label: 'From the button', icon: 'open_in_full', directional: false, summary: 'The dialog grows out of the button that opened it, and shrinks back into it.' },
]

export const DIRECTIONS = [
  { value: 'top', label: 'Top', icon: 'south' },
  { value: 'bottom', label: 'Bottom', icon: 'north' },
  { value: 'left', label: 'Left', icon: 'east' },
  { value: 'right', label: 'Right', icon: 'west' },
]

/** Offset from the viewport centre to an element's centre, for "From the button". */
export function originOffset(rect, viewport) {
  return { x: Math.round(rect.left + rect.width / 2 - viewport.width / 2), y: Math.round(rect.top + rect.height / 2 - viewport.height / 2) }
}

/**
 * @param {object} props
 * @param {string} [props.motion='scale']  One of DIALOG_MOTIONS.
 * @param {'top'|'bottom'|'left'|'right'} [props.direction='bottom']  Where directional motions enter from.
 * @param {'reverse'|'continue'} [props.exit='reverse']  Slide and Flip exits: back the way they came, or on through.
 * @param {'fast'|'normal'|'slow'|'slower'|'slowest'} [props.speed='slow']  Semantic motion duration.
 * @param {{ color: string, opacity: number, blur: string }} props.scrim  CSS colour, 0–100 and a CSS length.
 * @param {() => Element | null} [props.opener]  The element that opened it, for "From the button".
 * Other props (open, onClose, title, footer, size, children…) go to the A1 Dialog.
 */
export function MotionDialog({ motion = 'scale', direction = 'bottom', exit = 'reverse', speed = 'slow', scrim, opener, open, className = '', style, ...props }) {
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  // Measure the opener before the dialog opens, so it starts from there.
  useLayoutEffect(() => {
    const element = opener?.()
    if (open && element) setOrigin(originOffset(element.getBoundingClientRect(), { width: window.innerWidth, height: window.innerHeight }))
  }, [open])
  const directional = DIALOG_MOTIONS.find(item => item.id === motion)?.directional
  return (
    <Dialog {...props} open={open} className={`a1-dialog-motion ${className}`.trim()}
      data-motion={motion} data-direction={directional ? direction : undefined} data-exit={DIALOG_MOTIONS.find(item => item.id === motion)?.continues ? exit : undefined}
      style={{
        ...style,
        '--a1-dm-duration': `var(--semantic-motion-duration-${speed})`,
        '--a1-dm-scrim-color': scrim.color,
        '--a1-dm-scrim-opacity': `${scrim.opacity}%`,
        '--a1-dm-scrim-blur': scrim.blur,
        '--a1-dm-origin-x': `${origin.x}px`,
        '--a1-dm-origin-y': `${origin.y}px`,
      }} />
  )
}
