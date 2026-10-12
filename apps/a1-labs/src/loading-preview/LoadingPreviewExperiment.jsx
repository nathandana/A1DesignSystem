import React, { useState } from 'react'
import { Button, Inset, Slider, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from '../../../a1-web/src/pages/components/detail/ResponsivePreviewFrame.jsx'
import '../../../../packages/react/src/utilities/sr-only.css'

// Shared Labs page for the page-loading experiments: the responsive viewport,
// a speed slider, Finish loading / Pause / Replay and a polite status. Each
// experiment supplies its loader through `children({ loading, paused, speed, run })`.

const devices = { xs: 'Phone', sm: 'Landscape phone', md: 'Tablet', lg: 'Laptop', xl: 'Desktop' }

/**
 * @param {object} props
 * @param {{ label: string, options: { value: number, label: string }[], defaultValue: number, format: (value: number) => string }} props.speed
 * @param {{ loading: string, paused: string, ready: string }} props.status  Screen-reader status text.
 * @param {(state: { loading: boolean, paused: boolean, speed: number, run: number }) => React.ReactNode} props.children
 */
export function LoadingPreviewExperiment({ experiment, onOpenSettings, speed, status, children }) {
  const [viewport, setViewport] = useState('xs')
  const [value, setValue] = useState(speed.defaultValue)
  const [paused, setPaused] = useState(false)
  const [complete, setComplete] = useState(false)
  const [run, setRun] = useState(0)

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Toolbar label="Viewport">
          <ToolbarGroup aria-label="Viewport" value={viewport} onChange={setViewport}
            options={VIEWPORT_PRESETS.filter(preset => devices[preset.value]).map(preset => ({
              value: preset.value, label: devices[preset.value], icon: preset.icon,
            }))} />
        </Toolbar>
        <Slider label={speed.label} variant="subtle" value={value} onChange={setValue}
          detents={speed.options} formatValue={speed.format} />
        <Stack gap={8}>
          <Button icon="done" disabled={complete} onClick={() => { setComplete(true); setPaused(false) }} fullWidth>Finish loading</Button>
          <Button variant="secondary" icon={paused ? 'play_arrow' : 'pause'} disabled={complete} onClick={() => setPaused(!paused)} fullWidth>{paused ? 'Resume' : 'Pause'}</Button>
          <Button variant="secondary" icon="replay" onClick={() => { setComplete(false); setPaused(false); setRun(count => count + 1) }} fullWidth>Replay</Button>
        </Stack>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Stack gap={16}>
        <span className="a1-sr-only" role="status" aria-live="polite" aria-atomic="true">
          {complete ? status.ready : paused ? status.paused : status.loading}
        </span>
        <ResponsivePreviewFrame {...viewportSize(viewport)}>
          <main aria-busy={complete ? 'false' : 'true'} aria-label="Loading preview">
            {children({ loading: !complete, paused, speed: value, run })}
          </main>
        </ResponsivePreviewFrame>
      </Stack>
    </ExperimentLayout>
  )
}
