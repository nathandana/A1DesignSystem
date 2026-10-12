import React, { useMemo, useState } from 'react'
import { ChoiceGroup, Heading, Inset, Paragraph, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from '../../../a1-web/src/pages/components/detail/ResponsivePreviewFrame.jsx'
import { MOBILE_PATTERNS, ResponsiveInventory } from './MobileTablePatterns.jsx'
import { DatasetSize } from '../sample-data/DatasetSize.jsx'
import { DATASET_SIZES } from '../sample-data/sizes.js'
import { buildDatasets } from './table-data.js'

// Labs page: ways to show a data table on a phone, in a real device-sized
// viewport (the same device presets as the other Labs previews). Viewports
// below the md breakpoint (641px) show the chosen mobile pattern; md and up
// show the standard A1 Data Table.

const DATA_OPTIONS = [
  { value: 'simple', label: 'Simple (3 columns)', icon: 'table_rows' },
  { value: 'complex', label: 'Complex (11 columns)', icon: 'table_chart' },
]
const devices = { xs: 'Phone', sm: 'Landscape phone', md: 'Tablet', lg: 'Laptop', xl: 'Desktop' }

export function MobileTablesExperiment({ experiment, onOpenSettings }) {
  const [count, setCount] = useState(DATASET_SIZES.small)
  const datasets = useMemo(() => buildDatasets(count), [count])
  const [pattern, setPattern] = useState('cards')
  const [data, setData] = useState('complex')
  const [viewport, setViewport] = useState('xs')
  const dataset = datasets[data]

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <DatasetSize value={count} onChange={setCount} />
        <Toolbar label="Viewport">
          <ToolbarGroup aria-label="Viewport" value={viewport} onChange={setViewport}
            options={VIEWPORT_PRESETS.filter(preset => devices[preset.value]).map(preset => ({
              value: preset.value, label: devices[preset.value], icon: preset.icon,
            }))} />
        </Toolbar>
        <ChoiceGroup label="Mobile pattern" name="mobile-pattern" columns={1} size="compact" inlineIcon value={pattern} onChange={setPattern}
          options={MOBILE_PATTERNS.map(item => ({ value: item.id, label: item.label, icon: item.icon, subtext: item.summary }))} />
        <Toolbar label="Data">
          <ToolbarGroup aria-label="Data" value={data} onChange={setData} labelMode="selected" options={DATA_OPTIONS} />
        </Toolbar>
        <Paragraph size="sm" color="muted">Phone is below the md breakpoint (641px) and shows the chosen pattern. Landscape phone (740px) and wider show the standard A1 Data Table.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Stack gap={16}>
        <ResponsivePreviewFrame {...viewportSize(viewport)}>
          <main aria-label="Inventory preview">
            <Inset space={16}>
              <Stack gap={16}>
                <Heading as="h1" size="md">Inventory</Heading>
                <ResponsiveInventory key={`${data}-${count}`} pattern={pattern} dataset={dataset} />
              </Stack>
            </Inset>
          </main>
        </ResponsivePreviewFrame>
      </Stack>
    </ExperimentLayout>
  )
}
