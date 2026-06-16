import {
  Accordion,
  ChoiceGroup,
  Code,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['sm', 'md', 'lg']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function buildAccordionSnippet(config) {
  const props = [
    `label="${escapeJsxString(config.label || 'Accordion heading')}"`,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.defaultOpen ? 'defaultOpen' : null,
    config.disabled ? 'disabled' : null,
  ].filter(Boolean).join('\n  ')

  return `<Accordion\n  ${props}\n>\n  {/* panel content */}\n</Accordion>`
}

export function getDefaultConfig() {
  return {
    label: 'Accordion heading',
    size: 'md',
    defaultOpen: true,
    disabled: false,
  }
}

export function Preview({ config }) {
  return (
    // key forces re-mount when defaultOpen changes so the accordion reflects the new initial state
    <Accordion
      key={String(config.defaultOpen)}
      label={config.label || 'Accordion heading'}
      size={config.size}
      defaultOpen={config.defaultOpen}
      disabled={config.disabled}
    >
      <Paragraph size="sm">
        Accordion body content. This panel expands and collapses when the trigger is activated.
      </Paragraph>
    </Accordion>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField
        label="Label"
        size="compact"
        value={config.label}
        onChange={(event) => set({ label: event.target.value })}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => set({ size })}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle label="Default open" value={config.defaultOpen} onChange={(defaultOpen) => set({ defaultOpen })} />
      <Toggle label="Disabled" value={config.disabled} onChange={(disabled) => set({ disabled })} />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildAccordionSnippet(config)}</Code>
}
