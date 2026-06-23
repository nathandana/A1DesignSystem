import {
  Button,
  Code,
  Snackbar,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, FieldState } from './configKit.jsx'
import { useEffect, useState } from 'react'

// A 3×2 grid of directional arrows matching the on-screen corners/edges.
const POSITION_OPTIONS = [
  { value: 'top-left', label: 'Top left', icon: 'north_west' },
  { value: 'top', label: 'Top', icon: 'north' },
  { value: 'top-right', label: 'Top right', icon: 'north_east' },
  { value: 'bottom-left', label: 'Bottom left', icon: 'south_west' },
  { value: 'bottom', label: 'Bottom', icon: 'south' },
  { value: 'bottom-right', label: 'Bottom right', icon: 'south_east' },
]

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function escapeJsxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function buildSnackbarSnippet(config, utilityClass = '') {
  const snackbarProps = [
    'open={open}',
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
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

export function Preview({ config, utilityClass = '' }) {
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
        className={utilityClass || undefined}
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
      <Choice prop="position"
        label="Position"
        iconOnly
        columns={3}
        value={config.position}
        onChange={(position) => set({ position })}
        options={POSITION_OPTIONS}
      />
      <FieldState
        label="Options"
        items={[
          { key: 'action', label: 'Action', icon: 'touch_app', value: config.action },
          { key: 'dismissible', label: 'Dismissible', icon: 'close', value: config.dismissible },
        ]}
        onChange={set}
      />
      {config.action && (
        <TextField
          label="Action label"
          size="compact"
          value={config.actionLabel}
          onChange={(event) => set({ actionLabel: event.target.value })}
        />
      )}
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnackbarSnippet(config, utilityClass)}</Code>
}
