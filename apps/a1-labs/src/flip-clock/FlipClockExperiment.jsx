import React, { useEffect, useRef, useState } from 'react'
import { Button, ChoiceGroup, Inset, Paragraph, Slider, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { FlipClock } from './FlipClock.jsx'
import motion from '../../../../system/tokens/motion.json'

const durations = ['slow', 'slower', 'slowest'].map(key => parseFloat(motion.semantic.motion.duration[key].$value))
export function FlipClockExperiment({ experiment, onOpenSettings }) {
  const [time, setTime] = useState(() => new Date())
  const [paused, setPaused] = useState(false)
  const [demo, setDemo] = useState(0)
  const [format, setFormat] = useState('24')
  const [view, setView] = useState('angled')
  const [variant, setVariant] = useState('station')
  const [inverted, setInverted] = useState(false)
  const [showSeconds, setShowSeconds] = useState(true)
  const [duration, setDuration] = useState(durations[1])
  const current = useRef(time)
  current.current = time
  useEffect(() => {
    if (paused) return
    const started = Date.now(), base = current.current.getTime()
    let timer
    function tick() {
      const now = Date.now()
      setTime(new Date(demo ? base + Math.floor((now - started) / 1000) * 1000 : now))
      timer = setTimeout(tick, 1000 - (demo ? now - started : now) % 1000)
    }
    tick()
    return () => clearTimeout(timer)
  }, [paused, demo])
  function rollover() {
    const next = new Date(); next.setHours(23, 59, 57, 0)
    current.current = next; setTime(next); setPaused(false)
    // Remount the timer's source even if the demo is already running.
    setDemo(value => value + 1)
  }
  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Clock style" value={variant} onChange={setVariant} columns={1} size="compact"
          options={[{ value: 'station', label: 'Station clock' }, { value: 'compact', label: 'Compact cards' }]} />
        <Toolbar label="Clock format"><ToolbarGroup aria-label="Clock format" showLabels value={format} onChange={setFormat}
          options={[{ value: '24', label: '24 hour' }, { value: '12', label: '12 hour' }]} /></Toolbar>
        <Toolbar label="View"><ToolbarGroup aria-label="View" showLabels value={view} onChange={setView}
          options={[{ value: 'angled', label: 'Angled' }, { value: 'front', label: 'Front' }]} /></Toolbar>
        <Switch label="Show seconds" checked={showSeconds} onChange={setShowSeconds} />
        <Switch label="White cards" checked={inverted} onChange={setInverted} />
        <Slider label="Flip duration" variant="subtle" value={duration} onChange={setDuration}
          detents={durations.map(value => ({ value, label: `${value} ms` }))} formatValue={value => `${value} milliseconds`} />
        <Stack gap={8}>
          <Button variant="secondary" icon={paused ? 'play_arrow' : 'pause'} onClick={() => setPaused(value => !value)} fullWidth>{paused ? 'Resume clock' : 'Pause clock'}</Button>
          <Button variant="secondary" icon="replay" onClick={rollover} fullWidth>Preview midnight rollover</Button>
          {Boolean(demo) && <Button variant="tertiary" onClick={() => { setDemo(0); setPaused(false) }} fullWidth>Return to local time</Button>}
        </Stack>
        <Paragraph size="sm" color="muted">Only changed digits flip. Resets to zero run back through the digit stack. Reduced motion updates instantly.</Paragraph>
      </Stack>
    </Inset>
  )
  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Stack gap={16}>
        <Paragraph size="sm" color="muted" role="status">{demo ? 'Midnight rollover demo' : 'Local time'}{paused ? ' · Paused' : ''}</Paragraph>
        <FlipClock variant={variant} time={time} format={format} showSeconds={showSeconds} inverted={inverted} view={view} duration={duration} />
      </Stack>
    </ExperimentLayout>
  )
}
