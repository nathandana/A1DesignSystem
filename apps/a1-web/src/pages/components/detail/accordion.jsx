import {
  Accordion,
  Code,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { ConfigSlider, FieldState } from './configKit.jsx'

const SIZE_OPTIONS = ['sm', 'md', 'lg']

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function buildAccordionSnippet(config, utilityClass = '') {
  const props = [
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
    `label="${escapeJsxString(config.label || 'Accordion heading')}"`,
    config.subtext ? `subtext="${escapeJsxString(config.subtext)}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.divider ? 'divider' : null,
    config.defaultOpen ? 'defaultOpen' : null,
    config.disabled ? 'disabled' : null,
  ].filter(Boolean).join('\n  ')

  return `<Accordion\n  ${props}\n>\n  {/* panel content */}\n</Accordion>`
}

export function getDefaultConfig() {
  return {
    label: 'Accordion heading',
    subtext: '',
    size: 'md',
    divider: false,
    defaultOpen: true,
    disabled: false,
  }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    // key forces re-mount when defaultOpen changes so the accordion reflects the new initial state
    <Accordion
      key={String(config.defaultOpen)}
      className={utilityClass || undefined}
      label={config.label || 'Accordion heading'}
      subtext={config.subtext || undefined}
      size={config.size}
      divider={config.divider}
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
      <TextField
        label="Subtext"
        hint="Glanceable summary shown in the trigger while collapsed."
        size="compact"
        value={config.subtext}
        onChange={(event) => set({ subtext: event.target.value })}
      />
      <ConfigSlider prop="size" label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      <FieldState
        items={[
          { key: 'divider', label: 'Divider', icon: 'horizontal_rule', value: config.divider },
          { key: 'defaultOpen', label: 'Default open', icon: 'unfold_more', value: config.defaultOpen },
          { key: 'disabled', label: 'Disabled', icon: 'block', value: config.disabled },
        ]}
        onChange={set}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildAccordionSnippet(config, utilityClass)}</Code>
}
