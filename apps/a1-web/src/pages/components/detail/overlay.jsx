import { useEffect, useState } from 'react'
import {
  Button,
  ButtonContainer,
  Code,
  Overlay,
  Paragraph,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, FieldState, WithHelp, statusOptions } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'

export const bareDisplay = true

const STATUS_OPTIONS = ['neutral', 'info', 'success', 'warn', 'error']

const ICON_OPTIONS = [
  { value: 'default', label: 'Default', icon: 'auto_awesome' },
  { value: 'custom', label: 'Custom', icon: 'stars' },
  { value: 'none', label: 'None', icon: 'block' },
]

const ACTION_MODE_OPTIONS = [
  { value: 'none', label: 'None', icon: 'block' },
  { value: 'primary', label: 'Primary', icon: 'touch_app' },
  { value: 'primary-secondary', label: 'Two actions', icon: 'call_split' },
]

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function escapeJsxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function overlayIconProp(config) {
  if (config.iconMode === 'none') return 'icon={null}'
  if (config.iconMode === 'custom') return `icon="${escapeJsxString(config.icon || 'workspace_premium')}"`
  return null
}

function actionSnippet(config) {
  if (config.actionMode === 'none') return null
  const secondary = config.actionMode === 'primary-secondary'
    ? '\n      <Button variant="tertiary" icon="replay" onClick={() => setOpen(false)}>Replay</Button>'
    : ''

  return `actions={
    <ButtonContainer align="center">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        ${escapeJsxText(config.primaryLabel || 'Continue')}
      </Button>${secondary}
    </ButtonContainer>
  }`
}

function buildOverlaySnippet(config, utilityClass = '') {
  const props = [
    'open={open}',
    config.dismissible ? 'onClose={() => setOpen(false)}' : null,
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
    config.status !== 'info' ? `status="${config.status}"` : null,
    overlayIconProp(config),
    config.title ? `title="${escapeJsxString(config.title)}"` : null,
    config.body ? `body="${escapeJsxString(config.body)}"` : null,
    actionSnippet(config),
  ].filter(Boolean).join('\n  ')

  const extra = config.extraContent
    ? `\n    <Paragraph>${escapeJsxText(config.extraContent)}</Paragraph>\n  `
    : ''

  return `const [open, setOpen] = useState(false)

<>
  <Button onClick={() => setOpen(true)}>Open overlay</Button>
  <Overlay
  ${props}
  >${extra}</Overlay>
</>`
}

function renderActions(config, close) {
  if (config.actionMode === 'none') return null
  return (
    <ButtonContainer align="center">
      <Button variant="secondary" onClick={close}>
        {config.primaryLabel || 'Continue'}
      </Button>
      {config.actionMode === 'primary-secondary' && (
        <Button variant="tertiary" icon="replay" onClick={close}>
          Replay
        </Button>
      )}
    </ButtonContainer>
  )
}

function resolvedIcon(config) {
  if (config.iconMode === 'none') return null
  if (config.iconMode === 'custom') return config.icon || 'workspace_premium'
  return undefined
}

export function getDefaultConfig() {
  return {
    status: 'success',
    title: 'Level complete',
    body: 'You cleared the challenge and unlocked the next round.',
    iconMode: 'default',
    icon: 'workspace_premium',
    dismissible: true,
    actionMode: 'primary-secondary',
    primaryLabel: 'Continue',
    extraContent: '',
  }
}

export function Preview({ config, utilityClass = '' }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    setOpen(false)
  }, [config.status, config.title, config.body, config.iconMode, config.icon, config.dismissible, config.actionMode, config.primaryLabel, config.extraContent])

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open overlay
      </Button>
      <Overlay
        className={utilityClass || undefined}
        open={open}
        onClose={config.dismissible ? close : undefined}
        status={config.status}
        icon={resolvedIcon(config)}
        title={config.title || undefined}
        body={config.body || undefined}
        actions={renderActions(config, close)}
      >
        {config.extraContent && (
          <Paragraph size="lg">{config.extraContent}</Paragraph>
        )}
      </Overlay>
    </>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const setSafe = (patch) => setConfig((current) => {
    const next = { ...current, ...patch }
    if (!next.dismissible && next.actionMode === 'none') next.actionMode = 'primary'
    return next
  })

  return (
    <Stack gap="lg">
      <Choice
        prop="status"
        label="Status"
        iconOnly
        value={config.status}
        onChange={(status) => set({ status })}
        options={statusOptions(STATUS_OPTIONS)}
        helper="Status sets the full-screen color treatment. Keep the title and icon explicit so color is not the only signal."
      />
      <TextField
        label="Title"
        size="compact"
        value={config.title}
        onChange={(event) => set({ title: event.target.value })}
      />
      <WithHelp helper="Use short body copy that explains what happened and what the user can do next.">
        <TextareaField
          label="Body"
          size="compact"
          rows="sm"
          value={config.body}
          onChange={(event) => set({ body: event.target.value })}
        />
      </WithHelp>
      <Choice
        prop="iconMode"
        label="Icon"
        value={config.iconMode}
        onChange={(iconMode) => set({ iconMode })}
        options={ICON_OPTIONS}
        helper="Default uses the status icon. Custom accepts any A1 icon name. None is available when text alone is the better emphasis."
      />
      {config.iconMode === 'custom' && (
        <IconSelect
          label="Custom icon"
          value={config.icon}
          onChange={(icon) => set({ icon })}
        />
      )}
      <Choice
        prop="actionMode"
        label="Actions"
        value={config.actionMode}
        onChange={(actionMode) => setSafe({ actionMode })}
        options={ACTION_MODE_OPTIONS}
        helper="Keep actions focused: one primary decision and, if needed, one secondary escape or repeat action."
      />
      {config.actionMode !== 'none' && (
        <TextField
          label="Primary label"
          size="compact"
          value={config.primaryLabel}
          onChange={(event) => set({ primaryLabel: event.target.value })}
        />
      )}
      <WithHelp helper="Use children for small supporting content. Move complex layouts into a regular Dialog or page.">
        <TextareaField
          label="Extra content"
          size="compact"
          rows="sm"
          value={config.extraContent}
          onChange={(event) => set({ extraContent: event.target.value })}
        />
      </WithHelp>
      <FieldState
        label="Dismiss"
        items={[
          { key: 'dismissible', label: 'Close button', icon: 'close', value: config.dismissible },
        ]}
        onChange={setSafe}
        helper="When enabled, Overlay renders a close button and Escape calls onClose. If disabled, provide an action that closes the overlay."
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildOverlaySnippet(config, utilityClass)}</Code>
}
