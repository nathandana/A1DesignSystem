import React, { useEffect, useId, useRef, useState } from 'react'
import { Button, Icon, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { initialVerification, verificationTransition } from './verification.js'
import tokens from '../../../../system/tokens/component/verify-button.json'
import './verify-button.css'

export const defaultHoldDuration = parseFloat(tokens.component.verifyButton.holdDefault.$value)

/** Intent gate only: onVerify signals approval, not successful server work. */
export function VerifyButton({ actionLabel = 'Launch', holdDuration = defaultHoldDuration, onVerify }) {
  const [state, setState] = useState(initialVerification)
  const current = useRef(state)
  const active = useRef(null)
  const frame = useRef(0)
  const root = useRef(null)
  const hintId = useId()
  const duration = Number.isFinite(holdDuration) && holdDuration > 0 ? holdDuration : defaultHoldDuration
  const { phase, progress } = state
  const send = event => {
    const previous = current.current
    const next = verificationTransition(previous, event)
    current.current = next
    setState(next)
    if (next.phase === 'complete' && previous.phase !== 'complete') onVerify?.()
  }
  const stop = () => {
    cancelAnimationFrame(frame.current)
    active.current = null
  }
  const cancel = () => { stop(); send({ type: 'cancel' }) }
  const disarm = () => { stop(); send({ type: 'disarm' }) }
  useEffect(() => {
    const interrupt = () => { stop(); current.current = verificationTransition(current.current, { type: 'disarm' }); setState(current.current) }
    const hidden = () => { if (document.hidden) interrupt() }
    window.addEventListener('blur', interrupt)
    document.addEventListener('visibilitychange', hidden)
    return () => { stop(); window.removeEventListener('blur', interrupt); document.removeEventListener('visibilitychange', hidden) }
  }, [])
  useEffect(() => { stop(); current.current = initialVerification; setState(initialVerification) }, [duration, actionLabel])

  const start = input => {
    if (current.current.phase !== 'armed' || active.current) return
    active.current = input
    send({ type: 'start' })
    const started = performance.now()
    const tick = now => {
      if (!active.current) return
      send({ type: 'tick', progress: (now - started) / duration })
      if (current.current.phase === 'holding') frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }
  const release = () => { stop(); send({ type: 'release' }) }
  const focusPrimary = () => root.current?.querySelector('[data-verify-primary]')?.focus()
  const messages = {
    locked: 'Safety on. Arm the action to continue.',
    armed: `Hold for ${duration / 1000} seconds, then release. Or choose confirmation without holding.`,
    holding: 'Keep holding. Release early to cancel.',
    ready: 'Intent verified. Release to confirm, or press Escape to cancel.',
    review: `Confirm ${actionLabel.toLocaleLowerCase()}? This is your final confirmation.`,
    complete: 'Intent confirmed.',
  }
  const label = phase === 'locked' ? `Arm ${actionLabel.toLocaleLowerCase()}` : phase === 'complete' ? 'Verified' : phase === 'ready' ? 'Release to confirm' : phase === 'review' ? `Confirm ${actionLabel.toLocaleLowerCase()}` : `Hold to verify ${actionLabel.toLocaleLowerCase()}`
  return (
    <Stack ref={root} className="a1-verify-button" gap={24} align="center" data-phase={phase}
      style={{ '--a1-verify-button-progress': `${progress * 100}%` }}
      onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); disarm(); focusPrimary() } }}>
      <div className="a1-verify-button__mechanism" aria-hidden="true">
        <div className="a1-verify-button__shutter a1-verify-button__shutter--left" />
        <div className="a1-verify-button__shutter a1-verify-button__shutter--right" />
        <Stack className="a1-verify-button__dial" align="center" justify="center" gap={8}>
          <span className="a1-verify-button__symbol"><Icon name={phase === 'locked' ? 'lock' : phase === 'complete' ? 'check' : 'rocket_launch'} size="lg" /></span>
          <Paragraph size="sm">{phase === 'locked' ? 'Safety on' : phase === 'complete' ? 'Verified' : phase === 'review' ? 'Confirm intent' : `${Math.round(progress * 100)}%`}</Paragraph>
        </Stack>
      </div>
      <Stack gap={12} align="center">
        <Button data-verify-primary size="lg" variant={phase === 'complete' ? 'success' : 'primary'}
          aria-describedby={hintId} aria-disabled={phase === 'complete' || undefined}
          onContextMenu={event => event.preventDefault()}
          onPointerDown={event => {
            if (event.button !== 0 || !event.isPrimary || current.current.phase !== 'armed') return
            event.currentTarget.setPointerCapture(event.pointerId)
            start({ pointerId: event.pointerId })
          }}
          onPointerMove={event => {
            if (active.current?.pointerId !== event.pointerId) return
            const rect = event.currentTarget.getBoundingClientRect()
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) cancel()
          }}
          onPointerUp={event => { if (active.current?.pointerId === event.pointerId) release() }}
          onPointerCancel={cancel} onLostPointerCapture={cancel} onBlur={cancel}
          onKeyDown={event => {
            if (event.key === ' ' && ['armed', 'holding', 'ready'].includes(current.current.phase)) {
              event.preventDefault()
              if (!event.repeat) start({ keyboard: true })
            } else if (event.key === 'Enter' && current.current.phase === 'armed') {
              event.preventDefault(); send({ type: 'review' })
            } else if (event.repeat) event.preventDefault()
          }}
          onKeyUp={event => { if (event.key === ' ' && active.current?.keyboard) { event.preventDefault(); release() } }}
          onClick={event => {
            if (current.current.phase === 'locked') send({ type: 'arm' })
            else if (current.current.phase === 'review') send({ type: 'confirm' })
            // Screen-reader virtual clicks do not dispatch pointer/key events.
            else if (current.current.phase === 'armed' && event.detail === 0) send({ type: 'review' })
          }}>
          {label}
        </Button>
        {['armed', 'holding', 'ready', 'review'].includes(phase) && <Stack direction="row" wrap justify="center" gap={8}>
          {phase === 'armed' && <Button variant="tertiary" size="sm" onClick={() => { send({ type: 'review' }); focusPrimary() }}>Confirm without holding</Button>}
          <Button variant="tertiary" size="sm" onClick={() => { disarm(); focusPrimary() }}>Cancel</Button>
        </Stack>}
      </Stack>
      {['holding', 'ready'].includes(phase) && <span className="a1-sr-only" role="progressbar" aria-label="Intent verification" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} />}
      <Paragraph id={hintId} size="sm" color="muted" role="status" aria-live="polite" aria-atomic="true">{messages[phase]}</Paragraph>
    </Stack>
  )
}
