import React, { useRef, useState } from 'react'
import { Button, Card, ChoiceGroup, Heading, Inset, Paragraph, RadioGroup, Section, Slider, Stack, TextareaField, TextField } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { FocusAnimation, focusStyles } from './FocusAnimation.jsx'
import motion from '../../../../system/tokens/motion.json'

const speeds = ['quick', 'fast', 'normal'].map(value => ({ value, milliseconds: parseFloat(motion.semantic.motion.duration[value].$value) }))

export function FocusAnimationsExperiment({ experiment, onOpenSettings }) {
  const [treatment, setTreatment] = useState('settle')
  const [speed, setSpeed] = useState('fast')
  const [status, setStatus] = useState('')
  const [topic, setTopic] = useState('feedback')
  const firstField = useRef(null)
  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Focus treatment" size="compact" columns={1}
          options={focusStyles} value={treatment} onChange={setTreatment} />
        <Slider label="Animation duration" variant="subtle" value={speeds.find(option => option.value === speed).milliseconds}
          detents={speeds.map(option => ({ value: option.milliseconds, label: `${option.milliseconds} ms` }))}
          formatValue={value => `${value} milliseconds`}
          onChange={value => setSpeed(speeds.find(option => option.milliseconds === value).value)} />
        <Button variant="secondary" onClick={() => firstField.current?.focus()}>Try focus</Button>
        <Paragraph size="sm" color="muted">Tab or Shift+Tab through the form. Each animation settles into a visible focus indicator. Reduced motion shows that indicator immediately.</Paragraph>
      </Stack>
    </Inset>
  )
  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="sm">
        <Card>
          <FocusAnimation treatment={treatment} speed={speed}>
            <Stack as="form" gap={24} aria-label="Focus animation demo" onSubmit={event => {
              event.preventDefault()
              setStatus('Demo submitted. No information was sent.')
            }} onReset={() => { setTopic('feedback'); setStatus('Demo cleared.') }}>
              <Stack gap={8}>
                <Heading as="h2" size="lg">Send a note</Heading>
              </Stack>
              <TextField ref={firstField} label="Name" name="name" autoComplete="off" data-a1-focus-target />
              <TextField label="Email" name="email" type="email" autoComplete="off" data-a1-focus-target />
              <RadioGroup label="Topic" name="topic" value={topic} onChange={setTopic}
                data-a1-focus-radios options={[
                  { value: 'feedback', label: 'Feedback' },
                  { value: 'idea', label: 'An idea' },
                  { value: 'question', label: 'A question' },
                ]} />
              <TextareaField label="Message" name="message" rows="sm" data-a1-focus-target />
              <Stack direction="row" wrap gap={12}>
                <Button type="submit" data-a1-focus-target>Submit</Button>
                <Button type="reset" variant="tertiary" data-a1-focus-target>Cancel</Button>
              </Stack>
              <Paragraph size="sm" role="status" aria-live="polite" aria-atomic="true">{status}</Paragraph>
            </Stack>
          </FocusAnimation>
        </Card>
      </Section>
    </ExperimentLayout>
  )
}
