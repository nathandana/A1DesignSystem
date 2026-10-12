import React, { useState } from 'react'
import { ChoiceGroup, Inset, RadioGroup, Section, Slider, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import motion from '../../../../system/tokens/motion.json'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { LivelyRadioGroup, RADIO_VARIANTS } from './LivelyRadioGroup.jsx'

// Labs page: animated radio button variants on a real A1 RadioGroup, with a
// plain A1 group alongside for comparison.

const OPTIONS = [
  { value: 'standard', label: 'Standard', hint: 'Arrives in 3–5 working days' },
  { value: 'express', label: 'Express', hint: 'Arrives in 1–2 working days' },
  { value: 'same-day', label: 'Same day', hint: 'Order by noon for evening delivery' },
  { value: 'collect', label: 'Collect in store', hint: 'Ready in 2 hours', disabled: true },
]
const SPEEDS = ['fast', 'normal', 'slow', 'slower'].map(key => ({ key, ms: Number.parseFloat(motion.semantic.motion.duration[key].$value) }))
const SIZES = [{ value: 'compact', label: 'Compact' }, { value: 'default', label: 'Default' }, { value: 'comfortable', label: 'Comfortable' }]

export function RadioButtonsExperiment({ experiment, onOpenSettings }) {
  const [variant, setVariant] = useState('grow')
  const [speed, setSpeed] = useState('slow')
  const [size, setSize] = useState('default')
  const [compare, setCompare] = useState(false)
  const [value, setValue] = useState('standard')
  const [plain, setPlain] = useState('standard')

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Variant" name="radio-variant" columns={1} size="compact" value={variant} onChange={setVariant}
          options={RADIO_VARIANTS.map(item => ({ value: item.id, label: item.label, subtext: item.summary }))} />
        <Slider label="Animation speed (ms)" variant="subtle" value={SPEEDS.find(item => item.key === speed).ms}
          detents={SPEEDS.map(item => ({ value: item.ms, label: String(item.ms) }))} formatValue={ms => `${ms} milliseconds`}
          onChange={ms => setSpeed(SPEEDS.find(item => item.ms === ms).key)} />
        <Toolbar label="Size">
          <ToolbarGroup aria-label="Size" value={size} onChange={setSize} showLabels options={SIZES} />
        </Toolbar>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="md">
        <Stack gap={32}>
          <LivelyRadioGroup variant={variant} speed={speed} size={size} label="Delivery" hint="Choose how quickly you would like your order."
            name="delivery-lively" value={value} onChange={setValue} options={OPTIONS} />
          {compare && (
            <RadioGroup size={size} label="Delivery (A1 radio)" hint="The standard A1 RadioGroup, for comparison."
              name="delivery-plain" value={plain} onChange={setPlain} options={OPTIONS} />
          )}
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
