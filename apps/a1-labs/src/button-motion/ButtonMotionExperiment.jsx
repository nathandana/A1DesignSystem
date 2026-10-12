import React, { useState } from 'react'
import { ChoiceGroup, Inset, Paragraph, Section, Slider, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { BUTTON_TREATMENTS, MotionButton } from './MotionButton.jsx'
import motion from '../../../../system/tokens/motion.json'

const speeds = ['fast', 'normal', 'slow', 'slower', 'slowest'].map(key => ({ key, ms: parseFloat(motion.semantic.motion.duration[key].$value) }))
export function ButtonMotionExperiment({ experiment, onOpenSettings }) {
  const [treatment, setTreatment] = useState('subtle'), [speed, setSpeed] = useState('normal')
  const [size, setSize] = useState('md'), [disabled, setDisabled] = useState(false)
  const [count, setCount] = useState(0), [status, setStatus] = useState('Ready to try a button.')
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={
    <Inset space={16}><Stack gap={24}>
      <ChoiceGroup label="Interaction treatment" columns={1} size="compact" value={treatment} onChange={setTreatment}
        options={BUTTON_TREATMENTS.map(item => ({ value: item.id, label: item.label }))} />
      <Slider label="Animation duration (ms)" variant="subtle" value={speeds.find(item => item.key === speed).ms}
        detents={speeds.map(item => ({ value: item.ms, label: String(item.ms) }))}
        formatValue={ms => `${ms} milliseconds`} onChange={ms => setSpeed(speeds.find(item => item.ms === ms).key)} />
      <Toolbar label="Button size"><ToolbarGroup aria-label="Button size" showLabels value={size} onChange={setSize}
        options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]} /></Toolbar>
      <Switch label="Disabled" checked={disabled} onChange={setDisabled} />
    </Stack></Inset>
  }>
    <Section padding={{ xs: 'sm', md: 'lg' }} contentWidth="md">
      <Stack gap={32} align="center" className="a1-button-motion-demo">
        <Stack direction="row" wrap justify="center" align="center" gap={32}>
          {['primary', 'secondary', 'tertiary'].map(variant => <MotionButton key={variant} treatment={treatment} speed={speed}
            variant={variant} size={size} disabled={disabled} icon="arrow_forward" iconPosition="end"
            onClick={() => { setCount(count + 1); setStatus(`Button activated ${count + 1} ${count === 0 ? 'time' : 'times'}.`) }}>
            {variant === 'primary' ? 'Try primary' : variant === 'secondary' ? 'Try secondary' : 'Try tertiary'}
          </MotionButton>)}
        </Stack>
        <Paragraph size="sm" color="muted" role="status" aria-live="polite">{status}</Paragraph>
      </Stack>
    </Section>
  </ExperimentLayout>
}
