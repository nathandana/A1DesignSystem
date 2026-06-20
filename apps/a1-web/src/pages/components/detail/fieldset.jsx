import {
  Code,
  Fieldset,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, DensityChoice, FieldState } from './configKit.jsx'

const LABEL_POSITION_OPTIONS = ['above', 'before']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

export function getDefaultConfig() {
  return {
    legend: 'Contact details',
    size: 'default',
    labelPosition: 'above',
    markRequired: false,
    surface: false,
  }
}

export function Preview({ config }) {
  return (
    <Fieldset
      legend={config.legend || undefined}
      size={config.size}
      labelPosition={config.labelPosition}
      markRequired={config.markRequired}
      surface={config.surface}
    >
      <TextField label="Full name" autoComplete="name" required />
      <TextField label="Email address" type="email" autoComplete="email" required />
      <TextField label="Company" autoComplete="organization" />
    </Fieldset>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField label="Legend" size="compact" value={config.legend} onChange={(e) => set({ legend: e.target.value })} />
      <DensityChoice value={config.size} onChange={(size) => set({ size })} />
      <Choice prop="labelPosition"
        label="Label position" size="compact" hideIndicator columns={2}
        value={config.labelPosition} onChange={(labelPosition) => set({ labelPosition })}
        options={LABEL_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <FieldState
        label="Options"
        items={[
          { key: 'markRequired', label: 'Mark required', icon: 'asterisk', value: config.markRequired },
          { key: 'surface', label: 'Surface', icon: 'border_outer', value: config.surface },
        ]}
        onChange={set}
      />
    </Stack>
  )
}

function buildSnippet(config) {
  const props = [
    config.legend ? `legend="${escapeJsxString(config.legend)}"` : null,
    config.size !== 'default' ? `size="${config.size}"` : null,
    config.labelPosition !== 'above' ? `labelPosition="${config.labelPosition}"` : null,
    config.markRequired ? 'markRequired' : null,
    config.surface ? 'surface' : null,
  ].filter(Boolean).join('\n  ')

  return `<Fieldset${props ? `\n  ${props}\n` : ''}>
  <TextField label="Full name" autoComplete="name" required />
  <TextField label="Email address" type="email" autoComplete="email" required />
  <TextField label="Company" autoComplete="organization" />
</Fieldset>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
