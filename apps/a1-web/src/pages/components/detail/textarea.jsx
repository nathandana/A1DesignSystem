import { ChoiceGroup, TextField, TextareaField } from '@gtivr4/a1-design-system-react'
import { createFieldModule } from './fieldKit.jsx'
import { Toggle } from './Toggle.jsx'

const ROWS_OPTIONS = ['sm', 'md', 'lg', 'xl']

function TextareaExtras({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  return (
    <>
      <ChoiceGroup
        label="Rows"
        hint="Initial visible height: sm=2, md=4, lg=8, xl=12."
        size="compact"
        hideIndicator
        columns={4}
        value={config.rows}
        onChange={(rows) => set({ rows })}
        options={ROWS_OPTIONS.map((opt) => ({ label: opt.charAt(0).toUpperCase() + opt.slice(1), value: opt }))}
      />
      <TextField
        label="Max length"
        hint="Maximum character count (enables the counter)."
        size="compact"
        value={config.maxLength}
        onChange={(event) => set({ maxLength: event.target.value.replace(/[^0-9]/g, '') })}
      />
      <Toggle label="Show count" value={config.showCount} onChange={(showCount) => set({ showCount })} />
    </>
  )
}

const mod = createFieldModule({
  Component: TextareaField,
  componentName: 'TextareaField',
  defaults: {
    label: 'Message',
    value: '',
    hint: 'Tell us what you need help with.',
    rows: 'md',
    maxLength: '',
    showCount: false,
  },
  ExtraControls: TextareaExtras,
  fillContainer: true,
  getExtraProps: (config) => ({
    rows: config.rows,
    maxLength: config.maxLength ? Number(config.maxLength) : undefined,
    showCount: config.showCount || undefined,
  }),
  getExtraSnippetProps: (config) => [
    config.rows && config.rows !== 'md' ? `rows="${config.rows}"` : null,
    config.maxLength ? `maxLength={${config.maxLength}}` : null,
    config.showCount ? 'showCount' : null,
  ],
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod
