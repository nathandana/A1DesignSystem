import React, { useState } from 'react'
import { Button, Inset, Paragraph, Section, Slider, Stack, TextField } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { VerifyButton, defaultHoldDuration } from './VerifyButton.jsx'
import tokens from '../../../../system/tokens/component/verify-button.json'

const detents = ['holdShort', 'holdDefault', 'holdLong'].map(key => ({ value: parseFloat(tokens.component.verifyButton[key].$value), label: `${parseFloat(tokens.component.verifyButton[key].$value) / 1000} s` }))
export function VerifyButtonExperiment({ experiment, onOpenSettings }) {
  const [duration, setDuration] = useState(defaultHoldDuration)
  const [actionLabel, setActionLabel] = useState('Launch')
  const [session, setSession] = useState(0)
  const [verified, setVerified] = useState(false)
  const reset = () => { setVerified(false); setSession(value => value + 1) }
  const configuration = <Inset space={16}><Stack gap={24}>
    <TextField label="Action label" value={actionLabel} maxLength={32} onChange={event => { setActionLabel(event.target.value); reset() }} />
    <Slider label="Hold duration" variant="subtle" value={duration} onChange={value => { setDuration(value); reset() }} detents={detents} formatValue={value => `${value / 1000} seconds`} />
    <Button variant="secondary" onClick={reset}>Reset verification</Button>
    <Paragraph size="sm" color="muted">Space holds to verify. Enter offers a separate confirmation. Escape cancels.</Paragraph>
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <Section contentWidth="sm" padding={{ xs: 'none', md: 'lg' }}>
      <Stack align="center" gap={24}>
        <VerifyButton key={session} actionLabel={actionLabel.trim() || 'Launch'} holdDuration={duration} onVerify={() => setVerified(true)} />
        <Paragraph size="sm" color="muted">{verified ? 'Simulation complete. Nothing was submitted.' : 'A simulated critical submission.'}</Paragraph>
      </Stack>
    </Section>
  </ExperimentLayout>
}
