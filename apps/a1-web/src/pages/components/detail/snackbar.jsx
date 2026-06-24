import {
  Button,
  Code,
  Snackbar,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, FieldState } from './configKit.jsx'
import { useEffect, useRef, useState } from 'react'

// A 3×2 grid of directional arrows matching the on-screen corners/edges.
const POSITION_OPTIONS = [
  { value: 'top-left', label: 'Top left', icon: 'north_west' },
  { value: 'top', label: 'Top', icon: 'north' },
  { value: 'top-right', label: 'Top right', icon: 'north_east' },
  { value: 'bottom-left', label: 'Bottom left', icon: 'south_west' },
  { value: 'bottom', label: 'Bottom', icon: 'south' },
  { value: 'bottom-right', label: 'Bottom right', icon: 'south_east' },
]

export const viewAsModes = [
  { value: 'react', label: 'React' },
  { value: 'native', label: 'Native' },
  { value: 'pure', label: 'Pure' },
  { value: 'web', label: 'Web' },
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

function buildNativeSnippet(config) {
  const props = [
    'visible={visible}',
    `message="${escapeJsxString(config.children || 'Saved changes.')}"`,
    config.position !== 'bottom' ? `position="${config.position}"` : null,
    config.action ? `actionLabel="${escapeJsxString(config.actionLabel || 'Undo')}"` : null,
    config.action ? 'onAction={() => {\n    handleAction()\n    setVisible(false)\n  }}' : null,
    config.dismissible ? 'onDismiss={() => setVisible(false)}' : null,
  ].filter(Boolean).join('\n  ')

  return `const [visible, setVisible] = useState(false)

<>
  <Button onPress={() => setVisible(true)} disabled={visible}>
    Show snackbar
  </Button>
  <Snackbar
  ${props}
  />
</>`
}

function buildPureSnippet(config) {
  const pos = config.position || 'bottom'
  const actionBtn = config.action
    ? `\n  <button type="button" class="a1-snackbar__action" onclick="this.closest('.a1-snackbar').style.display='none'">${escapeJsxText(config.actionLabel || 'Undo')}</button>`
    : ''
  const closeBtn = config.dismissible
    ? `\n  <button type="button" class="a1-snackbar__close" aria-label="Dismiss" onclick="this.closest('.a1-snackbar').style.display='none'">\n    <span class="a1-icon" aria-hidden="true">close</span>\n  </button>`
    : ''

  return `<button type="button" onclick="document.getElementById('sb').style.display='flex'">
  Show snackbar
</button>

<div id="sb" class="a1-snackbar a1-snackbar--default a1-snackbar--${pos}"
  role="status" aria-live="polite" style="display:none">
  <div class="a1-snackbar__content">${escapeJsxText(config.children || 'Saved changes.')}</div>${actionBtn}${closeBtn}
</div>`
}

function buildWebSnippet(config) {
  const pos = config.position || 'bottom'
  const attrs = [
    pos !== 'bottom' ? `position="${pos}"` : null,
    config.action ? `action-label="${escapeJsxString(config.actionLabel || 'Undo')}"` : null,
    !config.dismissible ? 'dismissible="false"' : null,
  ].filter(Boolean)
  const attrsStr = attrs.length ? ` ${attrs.join(' ')}` : ''

  return `import '@gtivr4/a1-design-system-web/snackbar'

const sb = document.getElementById('sb')
document.querySelector('#show-btn').addEventListener('click', () => { sb.open = true })
sb.addEventListener('a1-close',  () => { sb.open = false })
sb.addEventListener('a1-action', () => {
  handleAction()
  sb.open = false
})

<button id="show-btn" type="button">Show snackbar</button>

<a1-snackbar id="sb"${attrsStr}>
  ${escapeJsxText(config.children || 'Saved changes.')}
</a1-snackbar>`
}

function PureSnackbarPreview({ config }) {
  const [open, setOpen] = useState(false)
  const pos = config.position || 'bottom'

  useEffect(() => {
    setOpen(false)
  }, [config.children, config.position, config.action, config.actionLabel, config.dismissible])

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} disabled={open}>
        Show snackbar
      </Button>
      {open && (
        <div
          className={`a1-snackbar a1-snackbar--default a1-snackbar--${pos}`}
          role="status"
          aria-live="polite"
        >
          <div className="a1-snackbar__content">
            {config.children || 'Saved changes.'}
          </div>
          {config.action && (
            <button
              type="button"
              className="a1-snackbar__action"
              onClick={() => setOpen(false)}
            >
              {config.actionLabel || 'Undo'}
            </button>
          )}
          {config.dismissible && (
            <button
              type="button"
              className="a1-snackbar__close"
              aria-label="Dismiss"
              onClick={() => setOpen(false)}
            >
              <span className="a1-icon" aria-hidden="true">close</span>
            </button>
          )}
        </div>
      )}
    </>
  )
}

function WebSnackbarPreview({ config }) {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const sbRef = useRef(null)

  useEffect(() => {
    import('@gtivr4/a1-design-system-web/snackbar').then(() => setReady(true))
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [config.children, config.position, config.action, config.actionLabel, config.dismissible])

  useEffect(() => {
    const el = sbRef.current
    if (!el || !ready) return
    const onClose = () => setOpen(false)
    const onAction = () => setOpen(false)
    el.addEventListener('a1-close', onClose)
    el.addEventListener('a1-action', onAction)
    return () => {
      el.removeEventListener('a1-close', onClose)
      el.removeEventListener('a1-action', onAction)
    }
  }, [ready])

  if (!ready) return null

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} disabled={open}>
        Show snackbar
      </Button>
      <a1-snackbar
        ref={sbRef}
        open={open || undefined}
        position={config.position}
        action-label={config.action ? (config.actionLabel || 'Undo') : ''}
        dismissible={config.dismissible}
      >
        {config.children || 'Saved changes.'}
      </a1-snackbar>
    </>
  )
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

export function Preview({ config, viewAs = 'react', utilityClass = '' }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [viewAs, config.children, config.position, config.action, config.actionLabel, config.dismissible])

  if (viewAs === 'pure') return <PureSnackbarPreview config={config} />
  if (viewAs === 'web') return <WebSnackbarPreview config={config} />

  if (viewAs === 'native') {
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

export function Snippet({ config, viewAs = 'react', utilityClass = '' }) {
  if (viewAs === 'native') {
    return <Code variant="block" wrapping copyCode>{buildNativeSnippet(config)}</Code>
  }
  if (viewAs === 'pure') {
    return <Code variant="block" wrapping copyCode>{buildPureSnippet(config)}</Code>
  }
  if (viewAs === 'web') {
    return <Code variant="block" wrapping copyCode>{buildWebSnippet(config)}</Code>
  }
  return <Code variant="block" wrapping copyCode>{buildSnackbarSnippet(config, utilityClass)}</Code>
}
