import React, { useState } from 'react'
import { Button, ChoiceGroup, Heading, Inset, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { DATE_OF_BIRTH_EXPERIMENTS } from './DateOfBirthExamples.jsx'

// One Labs experiment for the seven date-of-birth studies (shared with A1 Web
// through DateOfBirthExamples.jsx). A ChoiceGroup in the configuration panel
// picks the study. The choice is kept in ?study= so
// links (and the old per-study addresses) open the right one.

const fallbackLabel = (_key, fallback) => fallback
const initialStudy = () => {
  const requested = new URLSearchParams(window.location.search).get('study')
  return DATE_OF_BIRTH_EXPERIMENTS.some(item => item.id === requested) ? requested : DATE_OF_BIRTH_EXPERIMENTS[0].id
}

export function DateOfBirthExperiment({ experiment, onOpenSettings }) {
  const [study, setStudy] = useState(initialStudy)
  const [revision, setRevision] = useState(0)
  const example = DATE_OF_BIRTH_EXPERIMENTS.find(item => item.id === study)
  const Example = example.render
  const choose = id => {
    setStudy(id)
    const url = new URL(window.location.href)
    url.searchParams.set('study', id)
    window.history.replaceState(null, '', url)
  }

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Input study" name="dob-study" columns={1} size="compact"
          value={study} onChange={choose}
          options={DATE_OF_BIRTH_EXPERIMENTS.map(item => ({ value: item.id, label: item.title }))} />
        <Button variant="secondary" onClick={() => setRevision(value => value + 1)}>Reset example</Button>
        <Paragraph size="sm" color="muted">These are the existing A1 input studies. Formatting and numeric ranges do not validate a complete calendar date. Use fictional dates; nothing is saved or submitted.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Stack as="section" gap={24} className="a1-date-of-birth" aria-labelledby="dob-study-title">
        <Heading as="h2" size="lg" id="dob-study-title">{example.title}</Heading>
        <Example key={`${study}-${revision}`} t={fallbackLabel} description={example.summary} />
      </Stack>
    </ExperimentLayout>
  )
}
