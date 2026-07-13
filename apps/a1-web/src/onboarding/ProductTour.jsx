import { createPortal } from 'react-dom'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import {
  Button,
  ButtonContainer,
  Heading,
  IconButton,
  Paragraph,
  Stack,
  StepTracker,
} from '@gtivr4/a1-design-system-react'
import './product-tour.css'

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function readTokenPx(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const value = Number.parseFloat(raw)
  if (!Number.isFinite(value)) return 0
  if (raw.endsWith('rem')) {
    return value * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  }
  return value
}

function getTargetRect(selector) {
  const element = selector ? document.querySelector(selector) : null
  if (!(element instanceof HTMLElement)) return null
  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null
  const offset = readTokenPx('--base-spacing-8')
  const top = Math.max(0, rect.top - offset)
  const left = Math.max(0, rect.left - offset)
  return {
    top,
    left,
    width: Math.min(window.innerWidth - left, rect.width + offset * 2),
    height: Math.min(window.innerHeight - top, rect.height + offset * 2),
  }
}

function getCardPosition(target, card) {
  if (!target || !card) return null
  const gutter = readTokenPx('--base-spacing-16')
  const gap = readTokenPx('--base-spacing-16')
  const maxLeft = Math.max(gutter, window.innerWidth - card.width - gutter)
  const left = Math.min(Math.max(gutter, target.left + target.width / 2 - card.width / 2), maxLeft)
  const below = target.top + target.height + gap
  const above = target.top - card.height - gap
  const top = below + card.height <= window.innerHeight - gutter
    ? below
    : Math.max(gutter, above)
  return { left, top }
}

/**
 * A small, app-local product tour. It deliberately owns only the spotlight and
 * target measurement; its visible controls are existing A1 components.
 */
export function ProductTour({ open, steps, labels, onComplete, onDismiss }) {
  const titleId = useId()
  const descriptionId = useId()
  const cardRef = useRef(null)
  const previousFocusRef = useRef(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const [cardPosition, setCardPosition] = useState(null)
  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const updatePosition = useCallback(() => {
    if (!open || !step) return
    const target = getTargetRect(step.target)
    setTargetRect(target)
    const card = cardRef.current?.getBoundingClientRect()
    setCardPosition(getCardPosition(target, card))
  }, [open, step])

  useEffect(() => {
    if (!open) return undefined
    previousFocusRef.current = document.activeElement
    setStepIndex(0)
    return () => previousFocusRef.current?.focus?.()
  }, [open])

  useLayoutEffect(() => {
    if (!open) return undefined
    const frame = window.requestAnimationFrame(() => {
      updatePosition()
      cardRef.current?.querySelector('[data-a1-product-tour-primary]')?.focus()
    })
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, stepIndex, updatePosition])

  if (!open || !step || !steps.length) return null

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.()
      return
    }
    setStepIndex((index) => index + 1)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onDismiss?.()
      return
    }
    if (event.key !== 'Tab') return
    const focusable = [...(cardRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const spotlightStyle = targetRect
    ? {
        '--a1-product-tour-spotlight-block-start': `${targetRect.top}px`,
        '--a1-product-tour-spotlight-inline-start': `${targetRect.left}px`,
        '--a1-product-tour-spotlight-inline-size': `${targetRect.width}px`,
        '--a1-product-tour-spotlight-block-size': `${targetRect.height}px`,
      }
    : undefined
  const cardStyle = cardPosition
    ? {
        '--a1-product-tour-card-block-start': `${cardPosition.top}px`,
        '--a1-product-tour-card-inline-start': `${cardPosition.left}px`,
      }
    : undefined

  return createPortal(
    <div
      className="a1-product-tour"
      style={spotlightStyle}
      onWheel={(event) => event.preventDefault()}
      onTouchMove={(event) => event.preventDefault()}
    >
      <div className="a1-product-tour__backdrop" data-target={targetRect ? 'true' : 'false'} aria-hidden="true">
        <span className="a1-product-tour__scrim a1-product-tour__scrim--top" />
        <span className="a1-product-tour__scrim a1-product-tour__scrim--end" />
        <span className="a1-product-tour__scrim a1-product-tour__scrim--bottom" />
        <span className="a1-product-tour__scrim a1-product-tour__scrim--start" />
      </div>
      {targetRect && <div className="a1-product-tour__spotlight" aria-hidden="true" />}
      <aside
        ref={cardRef}
        className="a1-product-tour__card"
        style={cardStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-label={labels.dialogLabel}
        onKeyDown={handleKeyDown}
      >
        <Stack direction="column" gap="sm">
          <Stack direction="row" justify="between" align="start" gap="sm">
            <StepTracker steps={steps.length} currentStep={stepIndex + 1} aria-label={labels.progress(stepIndex + 1, steps.length)} />
            <IconButton icon="close" label={labels.close} onClick={onDismiss} />
          </Stack>
          <Stack direction="column" gap="xs">
            <Heading id={titleId} as="h2" size="sm">{step.title}</Heading>
            <Paragraph id={descriptionId} size="sm" color="muted">{step.description}</Paragraph>
          </Stack>
          <Paragraph className="a1-product-tour__progress" size="xs" color="muted" aria-live="polite">
            {labels.progress(stepIndex + 1, steps.length)}
          </Paragraph>
          <ButtonContainer align="end">
            <Button variant="tertiary" size="sm" onClick={onDismiss}>{labels.skip}</Button>
            {stepIndex > 0 && <Button variant="secondary" size="sm" onClick={() => setStepIndex((index) => index - 1)}>{labels.previous}</Button>}
            <Button data-a1-product-tour-primary size="sm" onClick={handleNext}>
              {isLastStep ? labels.done : labels.next}
            </Button>
          </ButtonContainer>
        </Stack>
      </aside>
    </div>,
    document.body,
  )
}
