import React, { useEffect, useRef, useState } from 'react'
import { Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { clockParts } from './clock-model.js'
import { createClockScene } from './clock-scene.js'
import { readFlapTokens } from '../split-flap/tokens.js'
import motion from '../../../../system/tokens/motion.json'
import './flip-clock.css'

export function FlipClock({ time, variant = 'station', format = '24', showSeconds = true, inverted = false, view = 'angled', duration = parseFloat(motion.semantic.motion.duration.slower.$value) }) {
  const host = useRef(null), scene = useRef(null)
  const [failed, setFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const parts = clockParts(time, format, showSeconds)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReducedMotion(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    if (failed) return
    const styles = getComputedStyle(host.current)
    const tokens = readFlapTokens(host.current)
    try {
      scene.current = createClockScene(host.current, {
        tokens, inverted, view, housing: variant !== 'compact', count: showSeconds ? 6 : 4,
        font: styles.getPropertyValue('--base-font-family-body').trim(),
        onFailure: () => setFailed(true),
      })
    } catch { setFailed(true) }
    return () => { scene.current?.dispose(); scene.current = null }
  }, [inverted, view, showSeconds, variant, failed])
  useEffect(() => { scene.current?.update(parts.digits, duration, reducedMotion) }, [parts.digits, duration, reducedMotion, inverted, view, showSeconds, variant])
  return (
    <Stack gap={12} align="center" className="a1-flip-clock" data-variant={variant}>
      <div className="a1-flip-clock__stage" ref={host} aria-hidden="true" hidden={failed} />
      <Paragraph size="lg">
        <time role="timer" aria-live="off" dateTime={time.toISOString()} aria-label={`${parts.text} ${parts.period}`.trim()}>
          {parts.text}{parts.period ? ` ${parts.period}` : ''}
        </time>
      </Paragraph>
      {failed && <Paragraph size="sm" color="muted" role="status">The 3D preview is unavailable. The clock above still shows the time.</Paragraph>}
    </Stack>
  )
}
