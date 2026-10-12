import React, { useMemo, useState } from 'react'
import { Inset, Paragraph, Section, Slider, Stack, Switch, TextareaField, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { splitLines } from './fit-model.js'
import { FitText } from './FitText.jsx'

// Labs page: type that fits its container. Each line is scaled to fill the
// width, so lines with fewer letters are larger. Change the text, how it
// breaks into lines, the container's width, the font and a size cap.

const EXAMPLES = [
  { value: 'poster', label: 'Poster', text: 'Make\nsomething\npeople\nlove', breaks: 'written' },
  { value: 'quote', label: 'Quote', text: 'The best way to predict the future is to invent it', breaks: 'balanced' },
  { value: 'event', label: 'Event', text: 'Design systems\nsummit\nOctober 24\nBrooklyn, NY', breaks: 'written' },
]
const BREAKS = [
  { value: 'written', label: 'As written', icon: 'notes' },
  { value: 'words', label: 'Word per line', icon: 'format_list_bulleted' },
  { value: 'balanced', label: 'Balanced', icon: 'format_align_justify' },
]
const MODES = [
  { value: 'each', label: 'Each line fills', icon: 'width_full' },
  { value: 'match', label: 'Match longest', icon: 'format_size' },
]
const FONTS = [
  { value: 'display', label: 'Display', css: 'var(--component-heading-font-family-display)' },
  { value: 'heading', label: 'Heading', css: 'var(--component-heading-font-family-heading)' },
  { value: 'body', label: 'Body', css: 'var(--base-font-family-body)' },
  { value: 'mono', label: 'Mono', css: 'var(--base-font-family-mono)' },
]
const WEIGHTS = [{ value: 'regular', label: 'Regular' }, { value: 'bold', label: 'Bold' }]
const ALIGNS = [{ value: 'start', label: 'Start', icon: 'format_align_left' }, { value: 'center', label: 'Center', icon: 'format_align_center' }]
const WIDTHS = [
  { value: 240, css: 'var(--base-width-xs)' },
  { value: 320, css: 'var(--base-width-sm)' },
  { value: 480, css: 'var(--base-width-lg)' },
  { value: 640, css: 'var(--base-width-xl)' },
  { value: 800, css: 'var(--base-width-2xl)' },
  { value: 1000, css: '100%', label: 'Full' },
]
const CAPS = [
  { value: 72, css: 'var(--semantic-font-size-display-jumbo)' },
  { value: 96, css: 'var(--semantic-font-size-display-x-jumbo)' },
  { value: 128, css: 'var(--component-fit-text-max-large)' },
  { value: 1000, css: 'none', label: 'None' },
]

export function FitTextExperiment({ experiment, onOpenSettings }) {
  const [text, setText] = useState(EXAMPLES[0].text)
  const [example, setExample] = useState('poster')
  const [breaks, setBreaks] = useState('written')
  const [count, setCount] = useState(3)
  const [mode, setMode] = useState('each')
  const [font, setFont] = useState('display')
  const [weight, setWeight] = useState('bold')
  const [align, setAlign] = useState('start')
  const [width, setWidth] = useState(480)
  const [cap, setCap] = useState(1000)
  const [showSizes, setShowSizes] = useState(false)
  const lines = useMemo(() => splitLines(text, breaks, count), [text, breaks, count])

  const chooseExample = value => {
    const chosen = EXAMPLES.find(item => item.value === value)
    setExample(value); setText(chosen.text); setBreaks(chosen.breaks)
  }

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Toolbar label="Example" fullWidth>
          <ToolbarGroup aria-label="Example" value={example} onChange={chooseExample} showLabels options={EXAMPLES.map(({ value, label }) => ({ value, label }))} />
        </Toolbar>
        <TextareaField label="Text" size="compact" rows="sm" value={text} hint="Start a new line to break the text yourself."
          onChange={event => { setText(event.target.value); setExample('') }} />
        <Toolbar label="Line breaks">
          <ToolbarGroup aria-label="Line breaks" value={breaks} onChange={setBreaks} labelMode="selected" options={BREAKS} />
        </Toolbar>
        {breaks === 'balanced' && (
          <Slider label="Lines" variant="subtle" value={count} detents={[2, 3, 4, 5, 6].map(value => ({ value, label: String(value) }))}
            formatValue={value => `${value} lines`} onChange={setCount} />
        )}
        <Toolbar label="Sizing" fullWidth>
          <ToolbarGroup aria-label="Sizing" value={mode} onChange={setMode} showLabels options={MODES} />
        </Toolbar>
        <Slider label="Container width (px)" variant="subtle" value={width} detents={WIDTHS.map(item => ({ value: item.value, label: item.label ?? String(item.value) }))}
          formatValue={value => (value === 1000 ? 'Full width' : `${value} pixels`)} onChange={setWidth} />
        <Slider label="Largest size (px)" variant="subtle" value={cap} detents={CAPS.map(item => ({ value: item.value, label: item.label ?? String(item.value) }))}
          formatValue={value => (value === 1000 ? 'No limit' : `${value} pixels`)} onChange={setCap} />
        <Toolbar label="Font" fullWidth>
          <ToolbarGroup aria-label="Font" value={font} onChange={setFont} showLabels options={FONTS.map(({ value, label }) => ({ value, label }))} />
        </Toolbar>
        <Toolbar label="Weight and alignment" fullWidth>
          <ToolbarGroup aria-label="Weight" value={weight} onChange={setWeight} showLabels options={WEIGHTS} />
          <ToolbarGroup aria-label="Alignment" value={align} onChange={setAlign} options={ALIGNS} />
        </Toolbar>
        <Switch label="Show sizes" checked={showSizes} onChange={setShowSizes} />
        <Paragraph size="sm" color="muted">Lines that would be smaller than the display minimum wrap instead. With a size cap, short lines stop growing and no longer fill the width.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none">
        <Stack gap={16} align={align === 'center' ? 'center' : 'start'}>
          <div className="a1-fit-text-frame" style={{ '--a1-fit-text-frame-width': WIDTHS.find(item => item.value === width).css }}>
            <FitText lines={lines} mode={mode} align={align} weight={weight} showSizes={showSizes}
              font={FONTS.find(item => item.value === font).css} max={CAPS.find(item => item.value === cap).css} />
          </div>
          <Paragraph size="sm" color="muted">The dashed outline is the container. Resize the window or change its width to watch every line refit.</Paragraph>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
