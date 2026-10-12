import React, { useState } from 'react'
import { CheckboxGroup, ChoiceGroup, Inset, Paragraph, Section, Slider, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import motion from '../../../../system/tokens/motion.json'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { CHECKBOX_VARIANTS, LivelyCheckboxGroup } from './LivelyCheckboxGroup.jsx'
import { parentState } from './checkbox-model.js'

// Labs page: animated checking, unchecking and indeterminate states on a real
// A1 CheckboxGroup. A "Select all" box above the list shows the mixed state
// whenever some, but not all, toppings are chosen.

const TOPPINGS = [
  { value: 'basil', label: 'Basil' },
  { value: 'mushrooms', label: 'Mushrooms' },
  { value: 'olives', label: 'Olives' },
  { value: 'peppers', label: 'Roasted peppers', hint: 'Mildly spicy' },
  { value: 'pineapple', label: 'Pineapple', hint: 'Sold out today', disabled: true },
]
const AVAILABLE = TOPPINGS.filter(option => !option.disabled).map(option => option.value)
const SPEEDS = ['fast', 'normal', 'slow', 'slower'].map(key => ({ key, ms: Number.parseFloat(motion.semantic.motion.duration[key].$value) }))
const SIZES = [{ value: 'compact', label: 'Compact' }, { value: 'default', label: 'Default' }, { value: 'comfortable', label: 'Comfortable' }]

export function CheckboxMotionExperiment({ experiment, onOpenSettings }) {
  const [variant, setVariant] = useState('pop')
  const [speed, setSpeed] = useState('slow')
  const [size, setSize] = useState('default')
  const [compare, setCompare] = useState(false)
  const [toppings, setToppings] = useState(['basil', 'olives'])
  const [plain, setPlain] = useState(['basil', 'olives'])
  const all = parentState(toppings, AVAILABLE)

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Variant" name="checkbox-variant" columns={1} size="compact" value={variant} onChange={setVariant}
          options={CHECKBOX_VARIANTS.map(item => ({ value: item.id, label: item.label, subtext: item.summary }))} />
        <Slider label="Animation speed (ms)" variant="subtle" value={SPEEDS.find(item => item.key === speed).ms}
          detents={SPEEDS.map(item => ({ value: item.ms, label: String(item.ms) }))} formatValue={ms => `${ms} milliseconds`}
          onChange={ms => setSpeed(SPEEDS.find(item => item.ms === ms).key)} />
        <Toolbar label="Size">
          <ToolbarGroup aria-label="Size" value={size} onChange={setSize} showLabels options={SIZES} />
        </Toolbar>
        <Switch label="Compare with the A1 checkbox" checked={compare} onChange={setCompare} />
        <Paragraph size="sm" color="muted">Check and uncheck toppings to see the Select all box move between empty, mixed and checked. With reduced motion, boxes change instantly.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="md">
        <Stack gap={32}>
          <Stack gap={16}>
            <LivelyCheckboxGroup variant={variant} speed={speed} size={size} label="Toppings" name="toppings-all"
              options={[{ value: 'all', label: 'Select all toppings' }]}
              value={all === 'on' ? ['all'] : []} indeterminate={all === 'mixed' ? ['all'] : []}
              onChange={() => setToppings(all === 'on' ? [] : AVAILABLE)} />
            <LivelyCheckboxGroup variant={variant} speed={speed} size={size} label="Choose toppings" hint="Pick as many as you like."
              name="toppings" options={TOPPINGS} value={toppings} onChange={setToppings} />
          </Stack>
          {compare && (
            <CheckboxGroup size={size} label="Choose toppings (A1 checkbox)" hint="The standard A1 CheckboxGroup, for comparison."
              name="toppings-plain" options={TOPPINGS} value={plain} onChange={setPlain} />
          )}
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
