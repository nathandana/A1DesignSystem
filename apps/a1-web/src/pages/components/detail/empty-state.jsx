import {
  Button,
  ChoiceGroup,
  Code,
  MessageEmptyState,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const SCALE_OPTIONS = ['page', 'section', 'card']
const ACTION_VARIANT_OPTIONS = ['primary', 'secondary', 'tertiary']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function escapeJsxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function buildEmptyStateSnippet(config) {
  const action = config.showAction
    ? `action={<Button variant="${config.actionVariant}">${escapeJsxText(config.actionLabel || 'Get started')}</Button>}`
    : null

  const props = [
    config.scale !== 'section' ? `scale="${config.scale}"` : null,
    config.icon !== 'inbox' ? `icon="${config.icon || 'inbox'}"` : null,
    config.title ? `title="${escapeJsxString(config.title)}"` : null,
    config.description ? `description="${escapeJsxString(config.description)}"` : null,
    action,
  ].filter(Boolean).join('\n  ')

  return props
    ? `<MessageEmptyState\n  ${props}\n/>`
    : '<MessageEmptyState />'
}

export function getDefaultConfig() {
  return {
    scale: 'section',
    icon: 'inbox',
    title: 'Nothing here yet',
    description: "Content will appear here once it's available.",
    showAction: true,
    actionLabel: 'Get started',
    actionVariant: 'secondary',
  }
}

export function Preview({ config }) {
  return (
    <MessageEmptyState
      scale={config.scale}
      icon={config.icon || 'inbox'}
      title={config.title || undefined}
      description={config.description || undefined}
      action={config.showAction ? (
        <Button variant={config.actionVariant}>
          {config.actionLabel || 'Get started'}
        </Button>
      ) : undefined}
    />
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField
        label="Title"
        size="compact"
        value={config.title}
        onChange={(event) => set({ title: event.target.value })}
      />
      <TextareaField
        label="Description"
        size="compact"
        rows="sm"
        value={config.description}
        onChange={(event) => set({ description: event.target.value })}
      />
      <IconSelect
        label="Icon"
        value={config.icon}
        onChange={(icon) => set({ icon })}
      />
      <ChoiceGroup
        label="Scale"
        size="compact"
        hideIndicator
        columns={3}
        value={config.scale}
        onChange={(scale) => set({ scale })}
        options={SCALE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle
        label="Action"
        value={config.showAction}
        onChange={(showAction) => set({ showAction })}
      />
      {config.showAction && (
        <>
          <TextField
            label="Action label"
            size="compact"
            value={config.actionLabel}
            onChange={(event) => set({ actionLabel: event.target.value })}
          />
          <ChoiceGroup
            label="Action variant"
            size="compact"
            hideIndicator
            columns={3}
            value={config.actionVariant}
            onChange={(actionVariant) => set({ actionVariant })}
            options={ACTION_VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
          />
        </>
      )}
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildEmptyStateSnippet(config)}</Code>
}
