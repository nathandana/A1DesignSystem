import React, { useState } from 'react'
import { Inset, Paragraph, RadioGroup, Section, SelectField, Slider, Stack } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { SlideDeck } from './SlideDeck.jsx'
import { DECK } from './deck.jsx'
import { BUILDS, TRANSITIONS } from './slide-motion.js'

// Labs page: a sample deck with a choice of transition (simple to
// content-aware), content build and speed.

const SPEEDS = [{ value: 0, key: 'quick', label: 'Quick' }, { value: 1, key: 'standard', label: 'Standard' }, { value: 2, key: 'relaxed', label: 'Relaxed' }]

export function SlidesExperiment({ experiment, onOpenSettings }) {
  const [index, setIndex] = useState(0)
  const [transition, setTransition] = useState('morph')
  const [build, setBuild] = useState('rise')
  const [speed, setSpeed] = useState(1)

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <RadioGroup label="Transition" hint="From simple to content-aware." name="slide-transition" value={transition} onChange={setTransition}
          options={TRANSITIONS.map(item => ({ value: item.id, label: item.label, hint: item.summary }))} />
        <RadioGroup label="Content build" hint="How each slide’s points load." name="slide-build" value={build} onChange={setBuild}
          options={BUILDS.map(item => ({ value: item.id, label: item.label, hint: item.summary }))} />
        <Slider label="Speed" variant="subtle" value={speed} onChange={setSpeed}
          detents={SPEEDS.map(item => ({ value: item.value, label: item.label }))} formatValue={value => SPEEDS[value].label} />
        <SelectField label="Go to slide" value={String(index)} onChange={event => setIndex(Number(event.target.value))}>
          {DECK.map((slide, i) => <option key={slide.id} value={i}>{`${i + 1}. ${slide.title}`}</option>)}
        </SelectField>
        <Paragraph size="sm" color="muted">
          Morph works best between neighbouring slides that share pieces: 2 → 3 (ramp and card), 4 → 5 (header), 7 → 8 (icon and card), and 1 ↔ 10 (logo).
        </Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="lg">
        <SlideDeck slides={DECK} index={index} onIndexChange={setIndex} transition={transition} build={build}
          speed={SPEEDS[speed].key} label="Sample deck: why a design system" />
      </Section>
    </ExperimentLayout>
  )
}
