import { TextField, NumberField } from '@gtivr4/a1-design-system-react'
import { createFieldModule, escapeJsxString } from './fieldKit.jsx'

function PrefixUnitControls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  return (
    <>
      <TextField
        label="Prefix"
        hint="Shown before the value at full size (e.g. $)."
        size="compact"
        value={config.prefix}
        onChange={(event) => set({ prefix: event.target.value })}
      />
      <TextField
        label="Unit"
        hint="Shown after the value, smaller and muted (e.g. lbs)."
        size="compact"
        value={config.unit}
        onChange={(event) => set({ unit: event.target.value })}
      />
    </>
  )
}

const mod = createFieldModule({
  Component: NumberField,
  componentName: 'NumberField',
  defaults: { label: 'Amount', value: '1200', prefix: '$', unit: '' },
  ExtraControls: PrefixUnitControls,
  getExtraProps: (config) => ({
    prefix: config.prefix || undefined,
    unit: config.unit || undefined,
  }),
  getExtraSnippetProps: (config) => [
    config.prefix ? `prefix="${escapeJsxString(config.prefix)}"` : null,
    config.unit ? `unit="${escapeJsxString(config.unit)}"` : null,
  ],
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod
