import React, { useState } from 'react'
import { Accordion, ChoiceGroup, Inset, Paragraph, Section, Slider, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import motion from '../../../../system/tokens/motion.json'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ACCORDION_TRANSITIONS, AccordionMotion } from './AccordionMotion.jsx'

// Labs page: the A1 Accordion with a choice of opening and closing transitions.

const SECTIONS = [
  { id: 'delivery', label: 'Delivery', subtext: 'Standard, express and same day', points: [
    'Standard delivery arrives in 3 to 5 working days.',
    'Express delivery arrives in 1 to 2 working days.',
    'Same-day delivery is available for orders placed by noon.',
  ] },
  { id: 'returns', label: 'Returns', subtext: '30 days, free in store', points: [
    'Return any item within 30 days of delivery.',
    'Returns in store are free; postal returns cost a small fee.',
    'Refunds reach your account within 5 working days.',
    'Personalised items can only be returned if faulty.',
  ] },
  { id: 'care', label: 'Product care', subtext: 'Cleaning and storage', points: [
    'Wipe clean with a soft, damp cloth.',
    'Keep out of direct sunlight to stop colours fading.',
  ] },
  { id: 'warranty', label: 'Warranty', subtext: 'Two years as standard', points: [
    'Every product has a two-year warranty from the date of purchase.',
    'Keep your receipt or order confirmation as proof of purchase.',
    'The warranty does not cover accidental damage or normal wear.',
  ] },
]
const SPEEDS = ['fast', 'normal', 'slow', 'slower', 'slowest'].map(key => ({ key, ms: Number.parseFloat(motion.semantic.motion.duration[key].$value) }))
const SIZES = [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]

export function AccordionMotionExperiment({ experiment, onOpenSettings }) {
  const [transition, setTransition] = useState('slide')
  const [speed, setSpeed] = useState('slow')
  const [size, setSize] = useState('md')
  const [divider, setDivider] = useState(true)
  const [single, setSingle] = useState(false)
  const [open, setOpen] = useState(['delivery'])
  const current = ACCORDION_TRANSITIONS.find(item => item.id === transition)
  const toggle = (id, next) => setOpen(list => (next ? (single ? [id] : [...list, id]) : list.filter(item => item !== id)))

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Transition" name="accordion-transition" columns={2} size="compact" value={transition} onChange={setTransition}
          options={ACCORDION_TRANSITIONS.map(item => ({ value: item.id, label: item.label }))} />
        <Paragraph size="sm" color="muted">{current.summary}</Paragraph>
        <Slider label="Duration (ms)" variant="subtle" disabled={transition === 'default'}
          value={SPEEDS.find(item => item.key === speed).ms}
          detents={SPEEDS.map(item => ({ value: item.ms, label: String(item.ms) }))} formatValue={ms => `${ms} milliseconds`}
          onChange={ms => setSpeed(SPEEDS.find(item => item.ms === ms).key)} />
        <Toolbar label="Size" fullWidth>
          <ToolbarGroup aria-label="Size" value={size} onChange={setSize} showLabels options={SIZES} />
        </Toolbar>
        <Switch label="Dividers" checked={divider} onChange={setDivider} />
        <Switch label="One open at a time" checked={single} onChange={next => { setSingle(next); if (next) setOpen(list => list.slice(-1)) }} />
        <Paragraph size="sm" color="muted">Default is the A1 accordion as it ships. With reduced motion every transition is instant.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="md">
        <AccordionMotion transition={transition} speed={speed}>
          {SECTIONS.map(section => (
            <Accordion key={section.id} label={section.label} subtext={section.subtext} size={size} divider={divider}
              open={open.includes(section.id)} onChange={next => toggle(section.id, next)}>
              <Stack gap={8}>
                {section.points.map(point => <Paragraph key={point} size="sm">{point}</Paragraph>)}
              </Stack>
            </Accordion>
          ))}
        </AccordionMotion>
      </Section>
    </ExperimentLayout>
  )
}
