import React, { useState } from 'react'
import { Inset, Section, Slider, Stack, Switch } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { MorphSwitch } from './MorphSwitch.jsx'
import motion from '../../../../system/tokens/motion.json'
import tokens from '../../../../system/tokens/component/switch-morph.json'

const scales = ['scaleStandard', 'scaleSmall', 'scaleMedium', 'scaleLarge'].map(key => tokens.component.switchMorph[key].$value)
const speeds = ['quick', 'fast', 'normal', 'slow', 'slowest'].map(value => ({ value, milliseconds: parseFloat(motion.semantic.motion.duration[value].$value) }))

export function SwitchMorphExperiment({ experiment, onOpenSettings }) {
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [scale, setScale] = useState(tokens.component.switchMorph.scaleSmall.$value)
  const [speed, setSpeed] = useState('quick')
  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Slider label="Scale" variant="subtle" value={scale} onChange={setScale}
          detents={scales.map(value => ({ value, label: `${value}×` }))} formatValue={value => `${value} times A1 size`} />
        <Slider label="Transition duration" variant="subtle" value={speeds.find(option => option.value === speed).milliseconds}
          detents={speeds.map(option => ({ value: option.milliseconds, label: `${option.milliseconds} ms` }))}
          formatValue={value => `${value} milliseconds`}
          onChange={value => setSpeed(speeds.find(option => option.milliseconds === value).value)} />
        <Switch label="Disabled" checked={disabled} onChange={setDisabled} />
      </Stack>
    </Inset>
  )
  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding={{ xs: 'none', md: 'lg' }} contentWidth="sm">
        <Stack align="center">
          <MorphSwitch label="Switch" checked={checked} onChange={setChecked} scale={scale} speed={speed} disabled={disabled} />
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
