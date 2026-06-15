import {
  Button,
  ChoiceGroup,
  Code,
  IconButton,
  Notification,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const STATUS_OPTIONS = ['neutral', 'info', 'success', 'warn', 'error']
const POSITION_OPTIONS = ['top-right', 'top-left', 'bottom-right', 'bottom-left']
const CONTENT_OPTIONS = ['count', 'label', 'dot']
const ANCHOR_OPTIONS = ['icon', 'button']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
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

function numberValue(value, fallback) {
  const next = Number(value)
  return Number.isFinite(next) ? next : fallback
}

function anchorElement(config) {
  if (config.anchor === 'button') {
    return (
      <Button variant="secondary" size="sm" icon={config.anchorIcon || 'notifications'}>
        {config.anchorLabel || 'Updates'}
      </Button>
    )
  }

  return (
    <IconButton
      icon={config.anchorIcon || 'notifications'}
      label={config.anchorLabel || 'Notifications'}
      variant="secondary"
    />
  )
}

function anchorSnippet(config) {
  if (config.anchor === 'button') {
    return `  <Button variant="secondary" size="sm" icon="${escapeJsxString(config.anchorIcon || 'notifications')}">
    ${escapeJsxText(config.anchorLabel || 'Updates')}
  </Button>`
  }

  return `  <IconButton
    icon="${escapeJsxString(config.anchorIcon || 'notifications')}"
    label="${escapeJsxString(config.anchorLabel || 'Notifications')}"
    variant="secondary"
  />`
}

function buildNotificationSnippet(config) {
  const props = [
    config.content === 'count' ? `count={${numberValue(config.count, 0)}}` : null,
    config.content === 'label' ? `label="${escapeJsxString(config.label || 'New')}"` : null,
    config.content === 'dot' ? 'dot' : null,
    config.status !== 'neutral' ? `status="${config.status}"` : null,
    config.position !== 'top-right' ? `position="${config.position}"` : null,
    numberValue(config.max, 99) !== 99 ? `max={${numberValue(config.max, 99)}}` : null,
  ].filter(Boolean).join('\n  ')

  return `<Notification${props ? `\n  ${props}\n` : ''}>
${anchorSnippet(config)}
</Notification>`
}

export function getDefaultConfig() {
  return {
    anchor: 'icon',
    anchorIcon: 'notifications',
    anchorLabel: 'Notifications',
    content: 'count',
    count: 12,
    label: 'New',
    dot: false,
    status: 'info',
    position: 'top-right',
    max: 99,
  }
}

export function Preview({ config }) {
  return (
    <Notification
      count={config.content === 'count' ? numberValue(config.count, 0) : undefined}
      label={config.content === 'label' ? (config.label || 'New') : undefined}
      dot={config.content === 'dot'}
      status={config.status}
      position={config.position}
      max={numberValue(config.max, 99)}
    >
      {anchorElement(config)}
    </Notification>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Anchor"
        size="compact"
        hideIndicator
        columns={2}
        value={config.anchor}
        onChange={(anchor) => set({ anchor, anchorLabel: anchor === 'button' ? 'Updates' : 'Notifications' })}
        options={ANCHOR_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <IconSelect
        label="Anchor icon"
        value={config.anchorIcon}
        onChange={(anchorIcon) => set({ anchorIcon })}
      />
      <TextField
        label="Anchor label"
        size="compact"
        value={config.anchorLabel}
        onChange={(event) => set({ anchorLabel: event.target.value })}
      />
      <ChoiceGroup
        label="Content"
        size="compact"
        hideIndicator
        columns={3}
        value={config.content}
        onChange={(content) => set({ content })}
        options={CONTENT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      {config.content === 'count' && (
        <>
          <TextField
            label="Count"
            size="compact"
            type="number"
            value={String(config.count)}
            onChange={(event) => set({ count: event.target.value })}
          />
          <TextField
            label="Maximum"
            size="compact"
            type="number"
            value={String(config.max)}
            onChange={(event) => set({ max: event.target.value })}
          />
        </>
      )}
      {config.content === 'label' && (
        <TextField
          label="Badge label"
          size="compact"
          value={config.label}
          onChange={(event) => set({ label: event.target.value })}
        />
      )}
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
        label="Position"
        size="compact"
        hideIndicator
        columns={2}
        value={config.position}
        onChange={(position) => set({ position })}
        options={POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle
        label="Dot"
        hint="Switches the badge to dot-only content."
        value={config.content === 'dot'}
        onChange={(checked) => set({ content: checked ? 'dot' : 'count' })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildNotificationSnippet(config)}</Code>
}
