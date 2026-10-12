import React, { useLayoutEffect, useRef, useState } from 'react'
import { SegmentedControl } from '@gtivr4/a1-design-system-react'
import { edges, morphFrames, travelDirection } from './segment-model.js'
import './segmented-motion.css'

// The A1 SegmentedControl with a choice of transitions for its selected
// background. Travelling backgrounds (slide, spring, stretch, morph) are one
// indicator measured from the selected segment, drawn behind the segments;
// per-segment effects (fade, grow, wipe) restyle each segment's background.
// The control, its radios and keyboard are A1's.

export const SEGMENT_TRANSITIONS = [
  { id: 'default', label: 'Default', summary: 'The A1 control as it ships: the new segment lights up.' },
  { id: 'fade', label: 'Fade', summary: 'The old background fades out as the new one fades in.' },
  { id: 'slide', label: 'Slide', summary: 'The background slides to the new segment.' },
  { id: 'spring', label: 'Spring', summary: 'The background slides, overshoots and settles.' },
  { id: 'stretch', label: 'Stretch', summary: 'The leading edge moves first and the trailing edge catches up.' },
  { id: 'grow', label: 'Grow', summary: 'The new background grows from the centre as the old one shrinks away.' },
  { id: 'wipe', label: 'Wipe', summary: 'The background wipes across in the direction you moved.' },
  { id: 'morph', label: 'Morph', summary: 'The background shrinks to a bar, travels, then grows into the new segment.' },
]
const TRAVELLING = ['slide', 'spring', 'stretch', 'morph']

const toPx = (value, element) => {
  const number = Number.parseFloat(value) || 0
  return value.trim().endsWith('rem') ? number * Number.parseFloat(getComputedStyle(element.ownerDocument.documentElement).fontSize) : number
}

/**
 * @param {object} props
 * @param {string} [props.transition='slide']  One of SEGMENT_TRANSITIONS.
 * @param {'fast'|'normal'|'slow'|'slower'|'slowest'} [props.speed='slow']  Semantic motion duration.
 * Other props (options, value, onChange, size, fullWidth, aria-label…) go to the A1 SegmentedControl.
 */
export function AnimatedSegmentedControl({ transition = 'slide', speed = 'slow', options, value, onChange, ...props }) {
  const rootRef = useRef(null)
  const indicatorRef = useRef(null)
  const previous = useRef({ index: options.findIndex(option => (option.value ?? option) === value), rect: null })
  const [rect, setRect] = useState(null)
  const [direction, setDirection] = useState('forward')
  const [ready, setReady] = useState(false)
  const travelling = TRAVELLING.includes(transition)
  const index = options.findIndex(option => (option.value ?? option) === value)

  // Measure the selected segment (and re-measure on resize).
  useLayoutEffect(() => {
    const root = rootRef.current
    const measure = () => {
      const segment = root.querySelector('[role="radio"][aria-checked="true"]')
      if (!segment) return
      const box = root.getBoundingClientRect()
      const r = segment.getBoundingClientRect()
      setRect({ x: r.left - box.left, y: r.top - box.top, width: r.width, height: r.height, box: box.width, index })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [value, index, options.length, props.size, props.fullWidth])

  // Direction of travel, and the morph's shrink-travel-grow. Runs on each new
  // measurement, which carries the index it was measured for.
  useLayoutEffect(() => {
    if (!rect) return
    const index = rect.index
    const last = previous.current
    if (last.index !== index) setDirection(travelDirection(last.index, index))
    const indicator = indicatorRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (transition === 'morph' && indicator && last.rect && last.index !== index && !reduced) {
      const style = getComputedStyle(rootRef.current)
      const bar = { width: toPx(style.getPropertyValue('--component-segmented-motion-morph-width'), indicator), height: toPx(style.getPropertyValue('--component-segmented-motion-morph-bar'), indicator) }
      const value = style.getPropertyValue('--a1-segmented-motion-duration').trim()
      const duration = value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000
      indicator.animate(morphFrames(last.rect, rect, bar, rect.box), { duration, easing: style.getPropertyValue('--semantic-motion-easing-standard').trim() })
    }
    previous.current = { index, rect }
    if (!ready) requestAnimationFrame(() => setReady(true))
  }, [rect])

  return (
    <div ref={rootRef} className="a1-segmented-motion" data-motion={transition} data-direction={direction} data-ready={ready || undefined}
      style={{ '--a1-segmented-motion-duration': `var(--semantic-motion-duration-${speed})` }}>
      <SegmentedControl options={options} value={value} onChange={onChange} {...props} />
      {travelling && rect && (
        <span ref={indicatorRef} className="a1-segmented-motion__indicator" aria-hidden="true"
          style={edges(rect, rect.box)} />
      )}
    </div>
  )
}
