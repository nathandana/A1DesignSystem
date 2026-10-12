import React, { useEffect, useMemo, useState } from 'react'
import { Button, Inset, Paragraph, Slider, Stack, TextareaField } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { FlapBillboard } from './FlapBillboard.jsx'
import { billboardMessage } from './message-model.js'
import { useReducedMotion } from '../split-flap/useReducedMotion.js'
import tokens from '../../../../system/tokens/component/flip-billboard.json'

const messages = ['A1 Design\nby the rules', 'Small ideas.\nBig moves.', 'Your next\nstarts here.']
const durations = ['stepDurationFast', 'stepDuration', 'stepDurationSlow'].map(key => parseFloat(tokens.component.flipBillboard[key].$value))
const columns = tokens.component.flipBillboard.columns.$value, rows = tokens.component.flipBillboard.rows.$value

export function FlipBillboardExperiment({ experiment, onOpenSettings, appearance }) {
  const [announcement, setAnnouncement] = useState('')
  const [drafts, setDrafts] = useState(messages), [headlines, setHeadlines] = useState(messages)
  const [index, setIndex] = useState(0), [autoplay, setAutoplay] = useState(true)
  const inverted = appearance?.mode === 'light' || (appearance?.mode === 'system' && !appearance.systemDark)
  const [duration, setDuration] = useState(durations[1])
  const reducedMotion = useReducedMotion()
  const message = useMemo(() => billboardMessage(headlines[index], columns, rows), [headlines, index])
  useEffect(() => {
    if (!autoplay || reducedMotion) return
    const timer = setTimeout(() => setIndex(value => (value + 1) % headlines.length), parseFloat(tokens.component.flipBillboard.holdDuration.$value))
    return () => clearTimeout(timer)
  }, [autoplay, reducedMotion, index, headlines])
  function togglePlayback() {
    setAutoplay(value => !value)
    setAnnouncement(autoplay ? 'Automatic headlines paused.' : 'Automatic headlines resumed.')
  }
  function nextHeadline() {
    const next = (index + 1) % headlines.length
    setIndex(next)
    setAnnouncement(`Headline ${next + 1}: ${billboardMessage(headlines[next], columns, rows).heading}`)
  }
  const configuration = <Inset space={16}><Stack gap={24}>
    <span className="a1-sr-only" role="status" aria-live="polite">{announcement}</span>
    <Stack gap={8}>
      <Button variant="secondary" onClick={togglePlayback} disabled={reducedMotion} fullWidth>{autoplay ? 'Pause headlines' : 'Resume headlines'}</Button>
      <Button variant="tertiary" icon="skip_next" onClick={nextHeadline} fullWidth>Next headline</Button>
      <Paragraph size="sm" color="muted">Headline {index + 1} of {headlines.length} · {reducedMotion ? 'Reduced motion. Automatic rotation is off.' : autoplay ? 'Changes every 6 seconds.' : 'Paused.'}</Paragraph>
    </Stack>
    <Slider label="Character flip duration" variant="subtle" value={duration} onChange={setDuration}
      detents={durations.map(value => ({ value, label: `${value} ms` }))} formatValue={value => `${value} milliseconds`} />
    {drafts.map((draft, slot) => <TextareaField key={slot} label={`Headline ${slot + 1}`} value={draft} rows="sm"
      hint={`Two lines, up to ${columns} characters per line. Invalid edits keep the last valid headline.`}
      error={billboardMessage(draft, columns, rows).error || undefined}
      onChange={event => {
        const value = event.target.value
        setDrafts(previous => previous.map((text, i) => i === slot ? value : text))
        if (!billboardMessage(value, columns, rows).error) {
          setHeadlines(previous => previous.map((text, i) => i === slot ? value : text))
          setIndex(slot); setAutoplay(false)
        }
      }} />)}
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <FlapBillboard message={message}
      inverted={inverted} duration={duration} reducedMotion={reducedMotion} />
  </ExperimentLayout>
}
