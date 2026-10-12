import React, { useEffect, useId, useRef, useState } from 'react'
import { Button, Heading, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'
import { createSplitFlapScene } from '../split-flap/scene.js'
import { useReducedMotion } from '../split-flap/useReducedMotion.js'
import billboardTokens from '../../../../system/tokens/component/flip-billboard.json'
import { characterCycle } from './character-cycle.js'
import { readFlapTokens } from '../split-flap/tokens.js'
import '../../../../packages/react/src/utilities/sr-only.css'
import './flip-billboard.css'

/** Controlled hero: copy, message rotation and destinations belong to the host. */
export function FlapBillboard({ message, eyebrow, description, primaryAction, secondaryAction, playback, inverted = false, duration = parseFloat(billboardTokens.component.flipBillboard.stepDuration.$value), reducedMotion = false }) {
  const host = useRef(null), scene = useRef(null)
  const [failed, setFailed] = useState(false)
  const titleId = useId()
  const deviceReducedMotion = useReducedMotion()
  const still = reducedMotion || deviceReducedMotion
  useEffect(() => {
    if (failed) return
    const tokens = readFlapTokens(host.current, 'flip-billboard', readFlapTokens(host.current))
    try {
      scene.current = createSplitFlapScene(host.current, {
        tokens: { ...tokens, housing: inverted ? tokens.white : tokens.housing }, inverted, view: 'angled', columns: tokens.columns, rows: tokens.rows,
        feet: false, revealInitial: true, characterPath: characterCycle,
        font: host.current.ownerDocument.defaultView.getComputedStyle(host.current).getPropertyValue('--base-font-family-body').trim(),
        onFailure: () => setFailed(true),
      })
    } catch { setFailed(true) }
    return () => { scene.current?.dispose(); scene.current = null }
  }, [inverted, failed])
  useEffect(() => {
    scene.current?.update(message.cards, duration, still)
  }, [message, duration, still, inverted])
  return (
    <Section className="a1-flip-billboard" contentWidth="xl" padding={{ xs: 'sm', lg: 'md' }} gap="lg" aria-labelledby={titleId}>
      <Stack gap={24} align="center">
        {eyebrow && <Paragraph size="sm" weight="semibold">{eyebrow}</Paragraph>}
        <Heading id={titleId} as="h1" type="display" size={{ xs: 'xl', lg: 'xxl' }} className={failed ? undefined : 'a1-sr-only'}>{message.heading}</Heading>
        <div className="a1-flip-billboard__stage" ref={host} data-stock={inverted ? 'light' : 'dark'} hidden={failed} aria-hidden="true" />
        {description && <Section contentWidth="sm" padding="none">
          <Paragraph size={{ xs: 'md', lg: 'lg' }}>{description}</Paragraph>
        </Section>}
        {(primaryAction || secondaryAction) && <Stack direction="row" wrap gap={12} justify="center">
          {primaryAction && <Button as="a" href={primaryAction.href} target={primaryAction.target} icon="arrow_forward" iconPosition="end">{primaryAction.label}</Button>}
          {secondaryAction && <Button as="a" href={secondaryAction.href} target={secondaryAction.target} variant="secondary">{secondaryAction.label}</Button>}
        </Stack>}
        {playback}
        {failed && <Paragraph size="sm" color="muted" role="status">The 3D display is unavailable. Your headline and actions are still available.</Paragraph>}
      </Stack>
    </Section>
  )
}
