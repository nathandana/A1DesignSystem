import React, { useState } from 'react'
import { Button, Card, Grid, Heading, Inset, Paragraph, Section, Slider, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from '../../../a1-web/src/pages/components/detail/ResponsivePreviewFrame.jsx'
import tokens from '../../../../system/tokens/component/page-loading.json'
import '../../../../packages/react/src/utilities/sr-only.css'
import './page-loading.css'

const motion = tokens.component.pageLoading
const duration = key => Number.parseFloat(motion[key].$value)
const devices = { xs: 'Phone', sm: 'Landscape phone', md: 'Tablet', lg: 'Laptop', xl: 'Desktop' }

export function PageLoadingExperiment({ experiment, onOpenSettings }) {
  const [viewport, setViewport] = useState('xs')
  const [cycle, setCycle] = useState(duration('cycleDuration'))
  const [paused, setPaused] = useState(false)
  const [complete, setComplete] = useState(false)
  const [run, setRun] = useState(0)
  const phase = complete ? 'complete' : paused ? 'paused' : 'loading'
  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Toolbar label="Viewport">
          <ToolbarGroup aria-label="Viewport" value={viewport} onChange={setViewport}
            options={VIEWPORT_PRESETS.filter(preset => devices[preset.value]).map(preset => ({
              value: preset.value, label: devices[preset.value], icon: preset.icon,
            }))} />
        </Toolbar>
        <Slider label="Cycle duration" variant="subtle" value={cycle} onChange={setCycle}
          detents={['cycleFast', 'cycleDuration', 'cycleSlow'].map(key => ({ value: duration(key), label: `${duration(key) / 1000} sec` }))}
          formatValue={value => `${value / 1000} seconds`} />
        <Stack gap={8}>
          <Button icon="done" disabled={complete} onClick={() => { setComplete(true); setPaused(false) }} fullWidth>Finish loading</Button>
          <Button variant="secondary" icon={paused ? 'play_arrow' : 'pause'} disabled={complete} onClick={() => setPaused(!paused)} fullWidth>{paused ? 'Resume' : 'Pause'}</Button>
          <Button variant="secondary" icon="replay" onClick={() => { setComplete(false); setPaused(false); setRun(value => value + 1) }} fullWidth>Replay animation</Button>
        </Stack>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Stack gap={16}>
        <span className="a1-sr-only" role="status" aria-live="polite" aria-atomic="true">
          {complete ? 'Page ready. Loading complete.' : paused ? 'Loading animation paused.' : 'Loading page. The border indicates ongoing activity.'}
        </span>
        <ResponsivePreviewFrame {...viewportSize(viewport)}>
          {!complete ? (
            <Section as={Stack} role="main" height="screen" justify="center" padding="sm" aria-label="Loading preview" aria-busy="true">
              <Section padding="none" contentWidth="xs">
                <Stack gap={16} align="center">
                  <Heading as="h1" size="lg" align="center">{paused ? 'Loading paused' : 'Loading...'}</Heading>
                  <Button variant="tertiary" size="sm" onClick={() => setPaused(value => !value)}>
                    {paused ? 'Resume animation' : 'Stop animation'}
                  </Button>
                </Stack>
              </Section>
            </Section>
          ) : (
            <Section as="main" padding="sm" gap="lg" aria-label="Sample page" aria-busy="false">
              <Stack gap={8}>
                <Paragraph size="sm" color="muted">A1 Labs / Preview</Paragraph>
                <Heading as="h1" size="lg">Your next idea starts here.</Heading>
                <Paragraph color="muted">A sample page inside a responsive viewport.</Paragraph>
              </Stack>
              <Grid columns={{ xs: 1, md: 2 }} gap={16}>
                {[
                  ['Explore', 'Make room for a different perspective.'],
                  ['Create', 'Turn a small idea into something you can try.'],
                  ['Refine', 'Adjust the details and see what changes.'],
                  ['Share', 'Bring the next version into view.'],
                ].map(([title, text]) => (
                  <Card key={title}><Stack gap={8}>
                    <Heading as="h2" size="sm">{title}</Heading>
                    <Paragraph size="sm" color="muted">{text}</Paragraph>
                  </Stack></Card>
                ))}
              </Grid>
            </Section>
          )}
          <div key={run} className="a1-page-loading-border" data-phase={phase} aria-hidden="true"
            style={{ '--component-page-loading-cycle-duration': `${cycle}ms` }}>
            <span className="a1-page-loading-border__glow" />
            <span className="a1-page-loading-border__glow a1-page-loading-border__glow--inner" />
          </div>
        </ResponsivePreviewFrame>
      </Stack>
    </ExperimentLayout>
  )
}
