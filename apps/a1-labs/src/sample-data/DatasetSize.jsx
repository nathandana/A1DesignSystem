import React from 'react'
import { Paragraph, Slider, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { DATASET_COUNTS, DATASET_SIZES } from './sizes.js'

const options = Object.entries(DATASET_SIZES).map(([value]) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))
// Demo configuration only: reusable experiments receive their rows as props.
export function DatasetSize({ value, onChange, disabled = false }) {
  const preset = Object.keys(DATASET_SIZES).find(key => DATASET_SIZES[key] === value) ?? ''
  return <Stack gap={12}>
    <Toolbar label="Data preset"><ToolbarGroup aria-label="Data preset" value={preset} onChange={key => onChange(DATASET_SIZES[key])} disabled={disabled} showLabels options={options} /></Toolbar>
    <Slider label="Data set size" variant="subtle" value={value} onChange={onChange} disabled={disabled}
      detents={DATASET_COUNTS} formatValue={count => `${count.toLocaleString()} rows`} />
    <Paragraph size="sm" color="muted">{value.toLocaleString()} items · Small 10 / Medium 100 / Large 1,000</Paragraph>
  </Stack>
}
