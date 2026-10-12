import React, { useState } from 'react'
import { ChoiceGroup, Inset, Paragraph, Section, Slider, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import motion from '../../../../system/tokens/motion.json'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { AnimatedSegmentedControl, SEGMENT_TRANSITIONS } from './AnimatedSegmentedControl.jsx'

// Labs page: the A1 SegmentedControl with a choice of transitions for its
// selected background.

const ALL_OPTIONS = [
  { value: 'day', label: 'Day', icon: 'today' },
  { value: 'week', label: 'Week', icon: 'date_range' },
  { value: 'month', label: 'Month', icon: 'calendar_month' },
  { value: 'quarter', label: 'Quarter', icon: 'event_note' },
  { value: 'year', label: 'Year', icon: 'event' },
]
const SPEEDS = ['fast', 'normal', 'slow', 'slower', 'slowest'].map(key => ({ key, ms: Number.parseFloat(motion.semantic.motion.duration[key].$value) }))
const COUNTS = [2, 3, 4, 5].map(count => ({ value: String(count), label: String(count) }))
const SIZES = [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]

export function SegmentedMotionExperiment({ experiment, onOpenSettings }) {
  const [transition, setTransition] = useState('slide')
  const [speed, setSpeed] = useState('slow')
  const [count, setCount] = useState('4')
  const [size, setSize] = useState('md')
  const [icons, setIcons] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [value, setValue] = useState('week')
  const current = SEGMENT_TRANSITIONS.find(item => item.id === transition)
  const options = ALL_OPTIONS.slice(0, Number(count)).map(option => (icons ? option : { value: option.value, label: option.label }))
  const chosen = options.some(option => option.value === value) ? value : options[0].value

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Transition" name="segment-transition" columns={2} size="compact" value={transition} onChange={setTransition}
          options={SEGMENT_TRANSITIONS.map(item => ({ value: item.id, label: item.label }))} />
        <Paragraph size="sm" color="muted">{current.summary}</Paragraph>
        <Slider label="Duration (ms)" variant="subtle" disabled={transition === 'default'}
          value={SPEEDS.find(item => item.key === speed).ms}
          detents={SPEEDS.map(item => ({ value: item.ms, label: String(item.ms) }))} formatValue={ms => `${ms} milliseconds`}
          onChange={ms => setSpeed(SPEEDS.find(item => item.ms === ms).key)} />
        <Toolbar label="Options" fullWidth>
          <ToolbarGroup aria-label="Options" value={count} onChange={setCount} showLabels options={COUNTS} />
        </Toolbar>
        <Toolbar label="Size" fullWidth>
          <ToolbarGroup aria-label="Size" value={size} onChange={setSize} showLabels options={SIZES} />
        </Toolbar>
        <Switch label="Icons" checked={icons} onChange={setIcons} />
        <Switch label="Full width" checked={fullWidth} onChange={setFullWidth} />
        <Paragraph size="sm" color="muted">Click or use the arrow keys. Default is the A1 control as it ships; with reduced motion the background moves instantly.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="md">
        <Stack gap={16} align={fullWidth ? 'stretch' : 'center'} className="a1-segmented-motion-stage">
          <AnimatedSegmentedControl key={`${count}-${icons}`} transition={transition} speed={speed} aria-label="Time period"
            options={options} value={chosen} onChange={setValue} size={size} fullWidth={fullWidth} />
          <Paragraph size="sm" color="muted" align="center">{`Showing ${options.find(option => option.value === chosen).label.toLowerCase()}`}</Paragraph>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
