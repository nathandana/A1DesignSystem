import { TextField, SearchField } from '@gtivr4/a1-design-system-react'
import { createFieldModule, escapeJsxString } from './fieldKit.jsx'

function ClearLabelControl({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  return (
    <TextField
      label="Clear button label"
      hint="Accessible name (aria-label) for the trailing clear button. Defaults to “Clear search”."
      size="compact"
      value={config.clearLabel}
      onChange={(event) => set({ clearLabel: event.target.value })}
    />
  )
}

const mod = createFieldModule({
  Component: SearchField,
  componentName: 'SearchField',
  defaults: { label: 'Search', value: 'navigation', clearLabel: '' },
  ExtraControls: ClearLabelControl,
  getExtraProps: (config) => ({ clearLabel: config.clearLabel || undefined }),
  getExtraSnippetProps: (config) => [
    config.clearLabel ? `clearLabel="${escapeJsxString(config.clearLabel)}"` : null,
  ],
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod
