import React, { useState } from 'react'
import { Button, ButtonContainer, ChoiceGroup, Heading, Inset, Paragraph, Section, Slider, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { TrackerVariants, TRACKER_VARIANTS } from './TrackerVariants.jsx'
import { TRACKER_TRANSITIONS } from './useTrackerMotion.js'
import motion from '../../../../system/tokens/motion.json'

const durations = ['quick', 'slow', 'slower'].map(key => parseFloat(motion.semantic.motion.duration[key].$value))

const chapters = [
  ['A place for your next idea', 'Create a workspace for the things you want to explore.'],
  ['Bring your people', 'Good ideas get better when you can share them.'],
  ['Make it yours', 'Choose the details that help you feel at home.'],
  ['Keep things organized', 'Give each project a place to grow.'],
  ['Connect your tools', 'Bring your everyday work into one place.'],
  ['Take a look around', 'Review the setup before you get started.'],
  ['Ready for what’s next', 'Your next idea can start here.'],
]

export function StepTrackerExperiment({ experiment, onOpenSettings }) {
  const [variant, setVariant] = useState('default')
  const [transition, setTransition] = useState('standard')
  const [duration, setDuration] = useState(durations[1])
  const [steps, setSteps] = useState('5')
  const [current, setCurrent] = useState(2)
  const [align, setAlign] = useState('center')
  const total = Number(steps), position = Math.min(current, total)
  const chapter = chapters[position === total ? chapters.length - 1 : position - 1]
  const changeCount = value => { setSteps(value); setCurrent(previous => Math.min(previous, Number(value))) }
  const configuration = <Inset space={16}><Stack gap={24}>
    <ChoiceGroup label="Tracker treatment" name="tracker-treatment" columns={2} size="compact" value={variant} onChange={setVariant}
      options={TRACKER_VARIANTS.map(item => ({ value: item.id, label: item.label }))} />
    <Paragraph size="sm" color="muted">{TRACKER_VARIANTS.find(item => item.id === variant).description}</Paragraph>
    <ChoiceGroup label="Transition" name="tracker-transition" columns={2} size="compact" value={transition} onChange={setTransition}
      options={TRACKER_TRANSITIONS.map(item => ({ value: item.id, label: item.label }))} />
    <Slider label="Transition duration (ms)" variant="subtle" value={duration} onChange={setDuration} disabled={transition === 'instant'}
      detents={durations.map(value => ({ value, label: String(value) }))} formatValue={value => `${value} milliseconds`} />
    <Toolbar label="Number of steps" fullWidth><ToolbarGroup aria-label="Number of steps" value={steps} onChange={changeCount} showLabels
      options={['3', '5', '7'].map(value => ({ value, label: value }))} /></Toolbar>
    <Slider label="Current step" value={position} onChange={setCurrent} variant="subtle"
      detents={Array.from({ length: total }, (_, index) => ({ value: index + 1, label: String(index + 1) }))} />
    <ChoiceGroup label="Alignment" name="tracker-align" columns={2} size="compact" value={align} onChange={setAlign}
      options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }, { value: 'full', label: 'Full' }]} />
    <Paragraph size="sm" color="muted">This is a position indicator. Use Back and Next to navigate; the markers themselves are not controls.</Paragraph>
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <Section padding="none" contentWidth="sm" className="a1-tracker-study-demo">
      <Stack gap={32}>
        <Stack gap={12}>
          <Paragraph size="sm" color="muted">Workspace tour</Paragraph>
          <Heading as="h2" size="lg">{chapter[0]}</Heading>
          <Paragraph>{chapter[1]}</Paragraph>
        </Stack>
        <Stack gap={16}>
          <TrackerVariants variant={variant} transition={transition} duration={duration} steps={total} currentStep={position} align={align} />
          <Paragraph size="sm" align="center" role="status" aria-live="polite" aria-atomic="true">Step {position} of {total}</Paragraph>
        </Stack>
        <ButtonContainer align="start">
          <Button variant="secondary" disabled={position === 1} onClick={() => setCurrent(value => value - 1)}>Back</Button>
          <Button onClick={() => setCurrent(position === total ? 1 : position + 1)}>{position === total ? 'Start again' : 'Next'}</Button>
        </ButtonContainer>
      </Stack>
    </Section>
  </ExperimentLayout>
}
