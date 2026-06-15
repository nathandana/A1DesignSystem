import {
  Button,
  ChoiceGroup,
  Code,
  Snackbar,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { useEffect, useState } from 'react'
import { Toggle } from './Toggle.jsx'

const POSITION_OPTIONS = ['bottom', 'bottom-left', 'bottom-right', 'top', 'top-left', 'top-right']

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

function buildSnackbarSnippet(config) {
  const snackbarProps = [
    'open={open}',
    config.position !== 'bottom' ? `position="${config.position}"` : null,
    config.action ? `actionLabel="${escapeJsxString(config.actionLabel || 'Undo')}"` : null,
    config.action ? 'onAction={() => {\n    handleAction()\n    setOpen(false)\n  }}' : null,
    config.dismissible ? 'onClose={() => setOpen(false)}' : null,
  ].filter(Boolean).join('\n  ')

  return `const [open, setOpen] = useState(false)

<>
  <Button onClick={() => setOpen(true)} disabled={open}>
    Show snackbar
  </Button>
  <Snackbar${snackbarProps ? `\n  ${snackbarProps}\n  ` : ' '}>
  ${escapeJsxText(config.children || 'Saved changes.')}
  </Snackbar>
</>`
}

export function getDefaultConfig() {
  return {
    children: 'Saved changes. Your dashboard is up to date.',
    position: 'bottom',
    action: true,
    actionLabel: 'Undo',
    dismissible: true,
  }
}

export function Preview({ config }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [config.children, config.position, config.action, config.actionLabel, config.dismissible])

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} disabled={open}>
        Show snackbar
      </Button>
      <Snackbar
        open={open}
        position={config.position}
        actionLabel={config.action ? (config.actionLabel || 'Undo') : undefined}
        onAction={config.action ? () => setOpen(false) : undefined}
        onClose={config.dismissible ? () => setOpen(false) : undefined}
      >
        {config.children || 'Saved changes.'}
      </Snackbar>
    </>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextareaField
        label="Message"
        size="compact"
        rows="sm"
        value={config.children}
        onChange={(event) => set({ children: event.target.value })}
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
      <Toggle label="Action" value={config.action} onChange={(action) => set({ action })} />
      {config.action && (
        <TextField
          label="Action label"
          size="compact"
          value={config.actionLabel}
          onChange={(event) => set({ actionLabel: event.target.value })}
        />
      )}
      <Toggle
        label="Dismissible"
        value={config.dismissible}
        onChange={(dismissible) => set({ dismissible })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnackbarSnippet(config)}</Code>
}
