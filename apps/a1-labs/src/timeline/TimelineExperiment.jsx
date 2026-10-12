import React, { useState } from 'react'
import { Heading, Inset, Paragraph, Section, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from '../../../a1-web/src/pages/components/detail/ResponsivePreviewFrame.jsx'
import { Timeline } from './Timeline.jsx'
import { MILESTONES } from './timeline-data.js'

// Labs page: a reference timeline rebuilt as an interface (with sample
// content), in the shared
// responsive preview, with a layout choice.

const devices = { xs: 'Phone', sm: 'Landscape phone', md: 'Tablet', lg: 'Laptop', xl: 'Desktop' }
const layouts = [
  { value: 'auto', label: 'Auto', icon: 'devices' },
  { value: 'horizontal', label: 'Horizontal', icon: 'swap_horiz' },
  { value: 'vertical', label: 'Vertical', icon: 'swap_vert' },
]

export function TimelineExperiment({ experiment, onOpenSettings }) {
  const [viewport, setViewport] = useState('lg')
  const [layout, setLayout] = useState('auto')

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Toolbar label="Viewport">
          <ToolbarGroup aria-label="Viewport" value={viewport} onChange={setViewport}
            options={VIEWPORT_PRESETS.filter(preset => devices[preset.value]).map(preset => ({ value: preset.value, label: devices[preset.value], icon: preset.icon }))} />
        </Toolbar>
        <Toolbar label="Layout">
          <ToolbarGroup aria-label="Layout" value={layout} onChange={setLayout} labelMode="selected" options={layouts} />
        </Toolbar>
        <Paragraph size="sm" color="muted">
          Auto runs horizontally on wide screens and vertically on narrow ones. A horizontal timeline on a narrow screen scrolls sideways.
        </Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <ResponsivePreviewFrame {...viewportSize(viewport)}>
        <main aria-label="Timeline preview">
          <Section padding={{ xs: 'sm', md: 'lg' }} gap="lg">
            <Heading as="h1" size="lg">Timeline</Heading>
            <Timeline milestones={MILESTONES} layout={layout} headingLevel="h2" />
          </Section>
        </main>
      </ResponsivePreviewFrame>
    </ExperimentLayout>
  )
}
