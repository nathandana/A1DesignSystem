import React, { useEffect, useRef, useState } from 'react'
import { Button, ChoiceGroup, Heading, Inset, Paragraph, Section, Stack, TextField, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { CELEBRATIONS, Celebration } from './Celebration.jsx'

// Labs page: a short waitlist form whose success screen celebrates in one of
// six ways. Submission is simulated; nothing is sent or stored.

const AMOUNTS = [
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'lots', label: 'Lots' },
]
const SAMPLE = { name: 'Alex Rivera', email: 'alex@example.com' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const sendDelay = () => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--component-celebration-send-delay')) || 0

export function CelebrationsExperiment({ experiment, onOpenSettings }) {
  const [variant, setVariant] = useState('confetti')
  const [amount, setAmount] = useState('normal')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(null)
  const [run, setRun] = useState(0)
  const messageRef = useRef(null)
  const current = CELEBRATIONS.find(item => item.id === variant)

  // Move focus to the success message so it's announced and Tab starts there.
  useEffect(() => { if (done) messageRef.current?.focus() }, [done])

  const succeed = details => { setDone(details); setRun(value => value + 1) }
  const submit = event => {
    event.preventDefault()
    const found = {}
    if (!name.trim()) found.name = 'Enter your name.'
    if (!EMAIL.test(email.trim())) found.email = 'Enter an email address, like name@example.com.'
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(found.name ? 'celebration-name' : 'celebration-email')?.focus()
      return
    }
    setSending(true)
    setTimeout(() => { setSending(false); succeed({ name: name.trim(), email: email.trim() }) }, sendDelay())
  }
  const reset = () => { setDone(null); setName(''); setEmail(''); setErrors({}) }

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Celebration" name="celebration" columns={1} size="compact" inlineIcon value={variant} onChange={setVariant}
          options={CELEBRATIONS.map(item => ({ value: item.id, label: item.label, icon: item.icon, subtext: item.summary }))} />
        <Toolbar label="Amount" fullWidth>
          <ToolbarGroup aria-label="Amount" value={amount} onChange={setAmount} showLabels
            options={AMOUNTS.map(item => ({ ...item, disabled: !current.particles }))} />
        </Toolbar>
        {!current.particles && <Paragraph size="sm" color="muted">Amount applies to Fireworks and Confetti.</Paragraph>}
        <Stack gap={8}>
          <Button variant="secondary" icon="celebration" onClick={() => (done ? setRun(value => value + 1) : succeed(SAMPLE))}>
            {done ? 'Replay celebration' : 'Skip to the celebration'}
          </Button>
          {done && <Button variant="tertiary" icon="undo" onClick={reset}>Return to the form</Button>}
        </Stack>
        <Paragraph size="sm" color="muted">With reduced motion, each celebration shows its still, final state and fireworks and confetti don’t play. The submission is simulated; nothing is sent.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="xs">
        {done ? (
          <Stack gap={16} align="center" className="a1-celebration-host">
            <Celebration variant={variant} amount={amount} run={run} />
            <Stack gap={8} align="center">
              <Heading as="h2" size="lg" align="center" tabIndex={-1} ref={messageRef}>You’re on the list, {done.name.split(/\s+/)[0]}</Heading>
              <Paragraph align="center" color="muted">We’ll email {done.email} when your invite is ready.</Paragraph>
            </Stack>
            <Button variant="tertiary" icon="person_add" onClick={reset}>Add another person</Button>
          </Stack>
        ) : (
          <Stack as="form" gap={16} noValidate onSubmit={submit} aria-labelledby="celebration-title">
            <Stack gap={8}>
              <Heading as="h2" size="lg" id="celebration-title">Join the waitlist</Heading>
              <Paragraph color="muted">Be first to try the new planner. It takes a few seconds.</Paragraph>
            </Stack>
            <TextField id="celebration-name" label="Name" autoComplete="name" value={name} error={errors.name}
              onChange={event => { setName(event.target.value); setErrors(value => ({ ...value, name: undefined })) }} />
            <TextField id="celebration-email" label="Email" type="email" autoComplete="email" value={email} error={errors.email}
              onChange={event => { setEmail(event.target.value); setErrors(value => ({ ...value, email: undefined })) }} />
            <Button type="submit" loading={sending} fullWidth>{sending ? 'Joining…' : 'Join the waitlist'}</Button>
          </Stack>
        )}
      </Section>
    </ExperimentLayout>
  )
}
