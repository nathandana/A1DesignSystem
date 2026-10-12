import React, { useEffect, useId, useRef, useState } from 'react'
import { Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import sampleImage from '../../../../examples/portfolio/img/YosemiteTunnel.jpg'
import { animationState, drawFrame, readVisuals } from './renderer.js'
import { phaseLabels, progressAnnouncement } from './accessibility.js'
import './image-generation.css'

export function ImageGeneration({ ratio, duration, runId, paused, onPhaseChange, borderRadius, borderWidth, animationStyle }) {
  const canvasRef = useRef(null)
  const redrawRef = useRef(null)
  const pausedRef = useRef(paused)
  const styleRef = useRef(animationStyle)
  const descriptionId = useId()
  const progressId = useId()
  const [status, setStatus] = useState({ percent: 0, phase: 'loading' })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let visual = readVisuals(canvas)
    const image = new Image()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    let reducedMotion = motion.matches
    let alive = true, frameId, lastTime, elapsed = 0, width = 0, height = 0
    let lastStatus = ''
    let loaded = false
    let completedState

    function publish(next) {
      const key = `${next.percent}:${next.phase}`
      if (key === lastStatus) return
      lastStatus = key
      setStatus({ percent: next.percent, phase: next.phase })
      onPhaseChange(next.phase)
    }

    function render() {
      if (!loaded || !width || !height) return
      // A finished image must not become partially hidden if motion is enabled
      // again after an instant reveal. Replay starts a new effect/timeline.
      const state = completedState ?? animationState(elapsed, duration, visual.hold, reducedMotion ? 0 : visual.revealDuration)
      if (state.phase === 'complete') completedState = state
      drawFrame(context, width, height, elapsed, state, image, visual, reducedMotion, styleRef.current)
      publish(state)
      return state
    }

    function refreshVisuals() {
      visual = readVisuals(canvas)
      render()
    }
    redrawRef.current = refreshVisuals

    function resize() {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      render()
    }

    function tick(time) {
      if (!alive) return
      if (lastTime !== undefined && !pausedRef.current) elapsed += time - lastTime
      lastTime = time
      const state = render()
      if (state?.phase !== 'complete') frameId = requestAnimationFrame(tick)
    }

    function updateMotion(event) {
      reducedMotion = event.matches
      setPrefersReducedMotion(reducedMotion)
      render()
    }

    publish({ percent: 0, phase: 'loading' })
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const appearanceObserver = new MutationObserver(refreshVisuals)
    appearanceObserver.observe(document.documentElement, {
      attributes: true, attributeFilter: ['class', 'style', 'data-theme'],
    })
    colorScheme.addEventListener('change', refreshVisuals)
    motion.addEventListener('change', updateMotion)
    image.onload = () => {
      if (!alive) return
      loaded = true
      resize()
      frameId = requestAnimationFrame(tick)
    }
    image.onerror = () => {
      if (alive) publish({ percent: 0, phase: 'error' })
    }
    image.src = sampleImage

    return () => {
      alive = false
      redrawRef.current = null
      cancelAnimationFrame(frameId)
      observer.disconnect()
      appearanceObserver.disconnect()
      colorScheme.removeEventListener('change', refreshVisuals)
      motion.removeEventListener('change', updateMotion)
      image.onload = image.onerror = null
    }
  }, [duration, runId, onPhaseChange])

  // Style changes redraw the existing timeline, even after the RAF has ended.
  useEffect(() => { redrawRef.current?.() }, [borderRadius, borderWidth])
  useEffect(() => {
    styleRef.current = animationStyle
    redrawRef.current?.()
  }, [animationStyle])

  const label = paused && !['complete', 'loading', 'error'].includes(status.phase)
    ? 'Animation paused' : phaseLabels[status.phase]

  return (
    <Stack gap={16} className="a1-image-generation">
      <canvas
        ref={canvasRef}
        className="a1-image-generation__canvas"
        style={{
          '--a1-image-generation-ratio': ratio,
          '--component-image-generation-radius': borderRadius || undefined,
          '--component-image-generation-border-width': borderWidth || undefined,
        }}
        role="img"
        aria-busy={!['complete', 'error'].includes(status.phase)}
        aria-describedby={`${progressId} ${descriptionId}`}
        aria-label={status.phase === 'complete'
          ? 'Completed preview: black-and-white photograph of Yosemite Valley.'
          : status.phase === 'error' ? 'Image preview unavailable.'
          : prefersReducedMotion ? 'Developing image shown with a still shape and reduced motion.'
          : animationStyle === 'blob' ? 'Developing image represented by a glowing blob that grows in complexity and contrast.'
          : 'Developing image formed by rotating discs.'}
      />
      <Stack direction="row" justify="between" align="center" gap={16}>
        <Paragraph size="sm" role="status" aria-live="polite" aria-atomic="true">
          {progressAnnouncement(status, paused)}
        </Paragraph>
        <div
          id={progressId}
          role="progressbar"
          aria-label="Animation progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={['loading', 'error'].includes(status.phase) ? undefined : status.percent}
          aria-valuetext={['loading', 'error'].includes(status.phase) ? label : `${status.percent}% — ${label}`}
        >
          <Paragraph className="a1-image-generation__percentage" weight="semibold">{status.percent}%</Paragraph>
        </div>
      </Stack>
      <Paragraph id={descriptionId} size="xs" color="muted">
        Animation preview · Uses a sample image, with no generation service connected. Pause or replay using the experiment controls. {prefersReducedMotion
          ? 'Reduced motion is on: shapes stay still and the completed image appears without a moving reveal.'
          : 'Respects your device’s reduced-motion setting.'}
      </Paragraph>
    </Stack>
  )
}
