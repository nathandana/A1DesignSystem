import React, { useState } from 'react'
import { Inset, Paragraph, Section, Stack, Switch } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { TouchActionCard } from './TouchActionCard.jsx'

export function TouchCardExperiment({ experiment, onOpenSettings }) {
  const [showEnlarged, setShowEnlarged] = useState(false)
  const configuration = (
    <Inset space={16}>
      <Stack gap={12}>
        <Switch
          label="Show enlarged controls"
          checked={showEnlarged}
          onChange={setShowEnlarged}
        />
        <Paragraph size="sm" color="muted">Preview the 44×44px touch controls on devices without touch input.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding={{ xs: 'md', md: 'xl' }} contentWidth="sm">
        <TouchActionCard enlargeOnHover={showEnlarged} />
      </Section>
    </ExperimentLayout>
  )
}
