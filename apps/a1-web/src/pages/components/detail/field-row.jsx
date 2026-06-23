import {
  Code,
  FieldRow,
  Fieldset,
  SelectField,
  Stack,
  TextField,
  ZipField,
} from '@gtivr4/a1-design-system-react'
import { Choice, DensityChoice } from './configKit.jsx'

const EXAMPLE_OPTIONS = ['name', 'address']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getDefaultConfig() {
  return {
    legend: 'Shipping address',
    size: 'default',
    example: 'name',
  }
}

function RowFields({ example, utilityClass = '' }) {
  if (example === 'address') {
    return (
      <FieldRow className={utilityClass || undefined}>
        <TextField label="City" autoComplete="address-level2" />
        <SelectField label="State" autoComplete="address-level1" defaultValue="">
          <option value="">—</option>
          <option value="ca">California</option>
          <option value="ny">New York</option>
          <option value="tx">Texas</option>
        </SelectField>
        <ZipField label="ZIP" autoComplete="postal-code" />
      </FieldRow>
    )
  }
  return (
    <FieldRow className={utilityClass || undefined}>
      <TextField label="First name" autoComplete="given-name" />
      <TextField label="Last name" autoComplete="family-name" />
    </FieldRow>
  )
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <Fieldset legend={config.legend || undefined} size={config.size}>
      <RowFields example={config.example} utilityClass={utilityClass} />
    </Fieldset>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField label="Legend" size="compact" value={config.legend} onChange={(e) => set({ legend: e.target.value })} />
      <DensityChoice value={config.size} onChange={(size) => set({ size })} />
      <Choice prop="example"
        label="Example" size="compact" hideIndicator columns={2}
        value={config.example} onChange={(example) => set({ example })}
        options={EXAMPLE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
    </Stack>
  )
}

function fieldRowProps(utilityClass = '') {
  return utilityClass ? ` className="${utilityClass.replaceAll('"', '&quot;')}"` : ''
}

function rowSnippet(example, utilityClass = '') {
  const props = fieldRowProps(utilityClass)
  const snippets = {
    name: `  <FieldRow${props}>
    <TextField label="First name" autoComplete="given-name" />
    <TextField label="Last name" autoComplete="family-name" />
  </FieldRow>`,
    address: `  <FieldRow${props}>
    <TextField label="City" autoComplete="address-level2" />
    <SelectField label="State" autoComplete="address-level1">
      <option value="">—</option>
      <option value="ca">California</option>
      <option value="ny">New York</option>
      <option value="tx">Texas</option>
    </SelectField>
    <ZipField label="ZIP" autoComplete="postal-code" />
  </FieldRow>`,
  }
  return snippets[example] ?? snippets.name
}

function buildSnippet(config, utilityClass = '') {
  const props = [
    config.legend ? `legend="${config.legend.replaceAll('"', '&quot;')}"` : null,
    config.size !== 'default' ? `size="${config.size}"` : null,
  ].filter(Boolean).join(' ')

  return `<Fieldset${props ? ` ${props}` : ''}>
${rowSnippet(config.example, utilityClass)}
</Fieldset>`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
