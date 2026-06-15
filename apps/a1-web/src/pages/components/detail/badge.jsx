import {
  ChoiceGroup,
  Code,
  MessageBadge,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const STATUS_OPTIONS = ['neutral', 'info', 'success', 'warn', 'error']
const SIZE_OPTIONS = ['sm', 'md', 'lg']
const ICON_MODE_OPTIONS = ['default', 'custom', 'none']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function buildBadgeSnippet(config) {
  const props = [
    config.status !== 'neutral' ? `status="${config.status}"` : null,
    config.subtle ? 'subtle' : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.iconMode === 'custom' ? `icon="${config.icon || 'info'}"` : null,
    config.iconMode === 'none' ? 'icon={null}' : null,
  ].filter(Boolean).join(' ')

  return `<MessageBadge${props ? ` ${props}` : ''}>${escapeJsxText(config.children || 'Badge')}</MessageBadge>`
}

export function getDefaultConfig() {
  return {
    children: 'In progress',
    status: 'info',
    subtle: false,
    size: 'md',
    iconMode: 'default',
    icon: 'info',
  }
}

export function Preview({ config }) {
  const icon = config.iconMode === 'none'
    ? null
    : config.iconMode === 'custom'
      ? config.icon || 'info'
      : undefined

  return (
    <MessageBadge
      status={config.status}
      subtle={config.subtle}
      size={config.size}
      icon={icon}
    >
      {config.children || 'Badge'}
    </MessageBadge>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField
        label="Label"
        size="compact"
        value={config.children}
        onChange={(event) => set({ children: event.target.value })}
      />
      <ChoiceGroup
        label="Status"
        size="compact"
        hideIndicator
        columns={2}
        value={config.status}
        onChange={(status) => set({ status })}
        options={STATUS_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
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
      <ChoiceGroup
        label="Icon"
        size="compact"
        hideIndicator
        columns={3}
        value={config.iconMode}
        onChange={(iconMode) => set({ iconMode })}
        options={ICON_MODE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      {config.iconMode === 'custom' && (
        <IconSelect
          label="Icon name"
          value={config.icon}
          onChange={(icon) => set({ icon })}
        />
      )}
      <Toggle
        label="Subtle"
        value={config.subtle}
        onChange={(subtle) => set({ subtle })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildBadgeSnippet(config)}</Code>
}
