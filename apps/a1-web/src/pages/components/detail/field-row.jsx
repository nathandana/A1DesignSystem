import {
  ChoiceGroup,
  Code,
  FieldRow,
  Fieldset,
  SelectField,
  Stack,
  TextField,
  ZipField,
} from '@gtivr4/a1-design-system-react'

const SIZE_OPTIONS = ['compact', 'default', 'comfortable']
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

function RowFields({ example }) {
  if (example === 'address') {
    return (
      <FieldRow>
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
    <FieldRow>
      <TextField label="First name" autoComplete="given-name" />
      <TextField label="Last name" autoComplete="family-name" />
    </FieldRow>
  )
}

export function Preview({ config }) {
  return (
    <Fieldset legend={config.legend || undefined} size={config.size}>
      <RowFields example={config.example} />
    </Fieldset>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField label="Legend" size="compact" value={config.legend} onChange={(e) => set({ legend: e.target.value })} />
      <ChoiceGroup
        label="Size" size="compact" hideIndicator columns={3}
        value={config.size} onChange={(size) => set({ size })}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Example" size="compact" hideIndicator columns={2}
        value={config.example} onChange={(example) => set({ example })}
        options={EXAMPLE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
    </Stack>
  )
}

const ROW_SNIPPETS = {
  name: `  <FieldRow>
    <TextField label="First name" autoComplete="given-name" />
    <TextField label="Last name" autoComplete="family-name" />
  </FieldRow>`,
  address: `  <FieldRow>
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

function buildSnippet(config) {
  const props = [
    config.legend ? `legend="${config.legend.replaceAll('"', '&quot;')}"` : null,
    config.size !== 'default' ? `size="${config.size}"` : null,
  ].filter(Boolean).join(' ')

  return `<Fieldset${props ? ` ${props}` : ''}>
${ROW_SNIPPETS[config.example] ?? ROW_SNIPPETS.name}
</Fieldset>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
