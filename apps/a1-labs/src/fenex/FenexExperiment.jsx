import React, { useEffect, useState } from 'react'
import { Button, Inset, Paragraph, Section, Slider, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { Fenex } from './Fenex.jsx'

// Labs page: Fenex the fox celebrating, large, with playback, size,
// background and confetti controls and a still (reduced motion) preview.

const SPEEDS = [0.5, 1, 1.5, 2]
const SIZES = [
  { value: 1, label: 'S', css: 'var(--base-width-xs)', name: 'Small' },
  { value: 2, label: 'M', css: 'var(--base-width-sm)', name: 'Medium' },
  { value: 3, label: 'L', css: 'var(--base-width-lg)', name: 'Large' },
]
const SURFACES = [
  { value: 'page', label: 'Page', swatch: 'var(--semantic-color-surface-page)' },
  { value: 'panel', label: 'Panel', swatch: 'var(--semantic-color-surface-panel)' },
  { value: 'accent', label: 'Accent', swatch: 'var(--semantic-color-action-background)' },
  { value: 'info', label: 'Info', swatch: 'var(--semantic-color-status-info-background)' },
  { value: 'success', label: 'Success', swatch: 'var(--semantic-color-status-success-background)' },
]

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

export function FenexExperiment({ experiment, onOpenSettings }) {
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [size, setSize] = useState(3)
  const [surface, setSurface] = useState('panel')
  const [inverse, setInverse] = useState(false)
  const [confetti, setConfetti] = useState(true)
  const [still, setStill] = useState(false)
  const [run, setRun] = useState(0)
  const reduced = useReducedMotion()
  const moving = !still && !reduced

  const replay = () => { setPlaying(true); setRun(value => value + 1) }

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Slider label="Speed" variant="subtle" value={speed} disabled={!moving}
          detents={SPEEDS.map(value => ({ value, label: `${value}×` }))} formatValue={value => `${value} times speed`} onChange={setSpeed} />
        <Slider label="Size" variant="subtle" value={size}
          detents={SIZES.map(({ value, label }) => ({ value, label }))}
          formatValue={value => SIZES.find(item => item.value === value).name} onChange={setSize} />
        <Toolbar label="Background">
          <ToolbarGroup aria-label="Background" value={surface} onChange={setSurface} labelMode="selected" options={SURFACES} />
        </Toolbar>
        <Switch label="Inverse" checked={inverse} onChange={setInverse} />
        <Switch label="Stars and confetti" checked={confetti} onChange={setConfetti} />
        <Switch label="Preview reduced motion" checked={still} onChange={setStill} />
        <Paragraph size="sm" color="muted">
          {reduced
            ? 'Your device asks for reduced motion, so Fenex stands still with the confetti scattered around him.'
            : 'With reduced motion, Fenex stands still with the confetti scattered around him. The animation is a single SVG that can be used on its own.'}
        </Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Stack gap={16} align="center">
        <Section surface={surface} inverse={inverse} padding="lg" radius="lg" align="center">
          <Fenex key={run} playing={playing} speed={speed} still={still} confetti={confetti} height={SIZES.find(item => item.value === size).css} />
        </Section>
        <Stack direction="row" gap={8} justify="center">
          <Button variant="secondary" icon={playing ? 'pause' : 'play_arrow'} disabled={!moving} onClick={() => setPlaying(value => !value)}>
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button variant="tertiary" icon="replay" disabled={!moving} onClick={replay}>Replay</Button>
        </Stack>
      </Stack>
    </ExperimentLayout>
  )
}
