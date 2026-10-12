import React, { useState } from 'react'
import { Button, ChoiceGroup, Heading, Inset, Paragraph, Section, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { Steps, STEP_TREATMENTS } from './Steps.jsx'

const stages = [
  { id: 'profile', label: 'Profile', description: 'Your name and workspace' },
  { id: 'team', label: 'Team', description: 'People you’ll work with' },
  { id: 'access', label: 'Access', description: 'Roles and permissions' },
  { id: 'preferences', label: 'Preferences', description: 'Make it feel like yours' },
  { id: 'connect', label: 'Connect', description: 'Tools and integrations' },
  { id: 'review', label: 'Review', description: 'Check the final details' },
  { id: 'launch', label: 'Launch', description: 'Your workspace is ready' },
]

export function StepsExperiment({ experiment, onOpenSettings }) {
  const [treatment, setTreatment] = useState('default')
  const [count, setCount] = useState('5')
  const [active, setActive] = useState('team')
  const [completed, setCompleted] = useState(['profile'])
  const [showError, setShowError] = useState(false)
  const [descriptions, setDescriptions] = useState(true)
  const [announcement, setAnnouncement] = useState('')
  const items = count === '3' ? [stages[0], stages[1], stages[6]] : count === '5' ? [stages[0], stages[1], stages[2], stages[5], stages[6]] : stages
  const current = items.find(item => item.id === active) ?? items[0]
  const index = items.indexOf(current), allDone = items.every(item => completed.includes(item.id))
  function finish() {
    if (showError) return
    setCompleted(previous => [...new Set([...previous, current.id])])
    if (index < items.length - 1) {
      setActive(items[index + 1].id)
      setAnnouncement(`${current.label} complete. Step ${index + 2} of ${items.length}: ${items[index + 1].label}.`)
    } else setAnnouncement('Launch complete. Review the steps for any unfinished work.')
  }
  const configuration = <Inset space={16}><Stack gap={24}>
    <ChoiceGroup label="Step treatment" name="step-treatment" columns={2} size="compact" value={treatment} onChange={setTreatment}
      options={STEP_TREATMENTS.map(item => ({ value: item.id, label: item.label }))} />
    <Paragraph size="sm" color="muted">{STEP_TREATMENTS.find(item => item.id === treatment).description}</Paragraph>
    <Toolbar label="Number of steps" fullWidth><ToolbarGroup aria-label="Number of steps" value={count} onChange={setCount} showLabels
      options={['3', '5', '7'].map(value => ({ value, label: value }))} /></Toolbar>
    <Switch label="Tile descriptions" checked={descriptions} onChange={setDescriptions} disabled={treatment !== 'tiles'} />
    <Switch label="Show current step error" checked={showError} onChange={setShowError} />
    <Button variant="tertiary" onClick={() => { setCompleted([]); setActive(items[0].id); setShowError(false); setAnnouncement('Steps reset.') }}>Reset steps</Button>
    <Paragraph size="sm" color="muted">Select a step to explore. Completing a step is separate from visiting it. Use arrow keys, Home or End to navigate.</Paragraph>
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <Section padding="none" contentWidth="lg" className="a1-steps-study-demo">
      <Stack gap={24}>
        <Stack gap={8}>
          <Heading as="h2" size="md">Set up your workspace</Heading>
          <Paragraph size="sm" color="muted">Step {index + 1} of {items.length} · {items.filter(item => completed.includes(item.id) && !(showError && item.id === current.id)).length} complete</Paragraph>
        </Stack>
        <Steps treatment={treatment} items={items.map(item => ({ ...item, content: <Section padding="sm" surface="panel" gap="sm">
          <Heading as="h3" size="sm">{item.label}</Heading>
          <Paragraph>{item.description}. This is a sample setup flow; no data is submitted.</Paragraph>
          <Paragraph size="sm">{showError && item.id === current.id ? 'Needs attention: a sample check failed. Turn off “Show current step error” to continue.' : completed.includes(item.id) ? 'This step is complete. You can still review it.' : 'Ready when you are. Complete this step or explore another.'}</Paragraph>
        </Section> }))} value={current.id} completed={completed} error={showError ? current.id : undefined} onChange={setActive} descriptions={descriptions} />
        <Stack direction="row" gap={12} wrap>
          <Button variant="secondary" disabled={index === 0} onClick={() => setActive(items[index - 1].id)}>Back</Button>
          <Button disabled={showError || (allDone && !showError)} onClick={finish}>{index === items.length - 1 ? 'Complete step' : 'Complete and continue'}</Button>
        </Stack>
        <Paragraph role="status" aria-live="polite" size="sm">{allDone && !showError ? 'All steps complete. Your sample workspace is ready. Nothing was submitted.' : announcement || 'Choose a treatment, then move through the steps.'}</Paragraph>
      </Stack>
    </Section>
  </ExperimentLayout>
}
