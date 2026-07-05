import {
  Button,
  Code,
  Snackbar,
  SnackbarStack,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, FieldState, WithHelp } from './configKit.jsx'
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

const MODE_OPTIONS = [
  { value: 'single', label: 'Single', icon: 'crop_16_9' },
  { value: 'multiple', label: 'Multiple', icon: 'layers' },
]

const STACK_MESSAGES = [
  'Saved changes.',
  'Published to the team.',
  'Synced with the backlog.',
  'Updated notification settings.',
]

function autoHideValue(config) {
  const value = Number(config.autoHideDuration)
  return Number.isFinite(value) && value > 0 ? Math.round(value) : 6000
}

function stackItems(config) {
  const count = Math.max(2, Math.min(4, Number(config.stackCount) || 3))
  return STACK_MESSAGES.slice(0, count).map((message, index) => ({
    id: `item-${index}`,
    message,
    actionLabel: config.action ? (config.actionLabel || 'Undo') : undefined,
  }))
}

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
  if (config.mode === 'multiple') {
    const items = stackItems(config)
    const autoHide = config.autoDismiss ? `\n      autoHideDuration: ${autoHideValue(config)},` : ''
    const action = config.action ? `\n      onAction: () => dismissSnackbar(item.id),` : ''
    const close = config.dismissible || config.autoDismiss ? `\n      onClose: () => dismissSnackbar(item.id),` : ''
    const dismissible = !config.dismissible && config.autoDismiss ? '\n      dismissible: false,' : ''

    return `const [snackbars, setSnackbars] = useState(${JSON.stringify(items, null, 2)})

const dismissSnackbar = (id) => {
  setSnackbars((current) => current.filter((item) => item.id !== id))
}

<SnackbarStack
  position="${config.position || 'bottom'}"
  items={snackbars.map((item) => ({
    ...item,${action}${close}${autoHide}${dismissible}
  }))}
/>`
  }

  const snackbarProps = [
    'open={open}',
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
    config.position !== 'bottom' ? `position="${config.position}"` : null,
    config.action ? `actionLabel="${escapeJsxString(config.actionLabel || 'Undo')}"` : null,
    config.autoDismiss ? `autoHideDuration={${autoHideValue(config)}}` : null,
    !config.dismissible && config.autoDismiss ? 'dismissible={false}' : null,
    config.action ? 'onAction={() => {\n    handleAction()\n    setOpen(false)\n  }}' : null,
    config.dismissible || config.autoDismiss ? 'onClose={() => setOpen(false)}' : null,
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
  if (config.mode === 'multiple') {
    return 'SnackbarStack is React-only. For native apps, queue messages and render one Snackbar at a time.'
  }

  const props = [
    'visible={visible}',
    `message="${escapeJsxString(config.children || 'Saved changes.')}"`,
    config.position !== 'bottom' ? `position="${config.position}"` : null,
    config.action ? `actionLabel="${escapeJsxString(config.actionLabel || 'Undo')}"` : null,
    config.autoDismiss ? `duration={${autoHideValue(config)}}` : 'duration={0}',
    config.action ? 'onAction={() => {\n    handleAction()\n    setVisible(false)\n  }}' : null,
    config.dismissible || config.autoDismiss ? 'onDismiss={() => setVisible(false)}' : null,
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
  if (config.mode === 'multiple') {
    return 'Multiple snackbars use the React SnackbarStack host. Queue one snackbar at a time for Pure markup.'
  }

  const pos = config.position || 'bottom'
  const actionBtn = config.action
    ? `\n  <button type="button" class="a1-snackbar__action" onclick="this.closest('.a1-snackbar').style.display='none'">${escapeJsxText(config.actionLabel || 'Undo')}</button>`
    : ''
  const closeBtn = config.dismissible
    ? `\n  <button type="button" class="a1-snackbar__close" aria-label="Dismiss" onclick="this.closest('.a1-snackbar').style.display='none'">\n    <span class="a1-icon" aria-hidden="true">close</span>\n  </button>`
    : ''

  const timer = config.autoDismiss
    ? `\n  window.setTimeout(() => { sb.style.display = 'none' }, ${autoHideValue(config)})`
    : ''

  return `<button type="button" onclick="const sb = document.getElementById('sb'); sb.style.display='flex';${timer}">
  Show snackbar
</button>

<div id="sb" class="a1-snackbar a1-snackbar--default a1-snackbar--${pos}"
  role="status" aria-live="polite" style="display:none">
  <div class="a1-snackbar__content">${escapeJsxText(config.children || 'Saved changes.')}</div>${actionBtn}${closeBtn}
</div>`
}

function buildWebSnippet(config) {
  if (config.mode === 'multiple') {
    return 'Multiple snackbars use the React SnackbarStack host. Queue one <a1-snackbar> at a time for Web Components.'
  }

  const pos = config.position || 'bottom'
  const attrs = [
    pos !== 'bottom' ? `position="${pos}"` : null,
    config.action ? `action-label="${escapeJsxString(config.actionLabel || 'Undo')}"` : null,
    !config.dismissible ? 'dismissible="false"' : null,
    config.autoDismiss ? `auto-hide-duration="${autoHideValue(config)}"` : null,
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
  }, [config.children, config.position, config.action, config.actionLabel, config.dismissible, config.autoDismiss, config.autoHideDuration])

  useEffect(() => {
    if (!open || !config.autoDismiss) return undefined
    const timeout = window.setTimeout(() => setOpen(false), autoHideValue(config))
    return () => window.clearTimeout(timeout)
  }, [config.autoDismiss, config.autoHideDuration, open])

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
  }, [config.children, config.position, config.action, config.actionLabel, config.dismissible, config.autoDismiss, config.autoHideDuration])

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
        auto-hide-duration={config.autoDismiss ? autoHideValue(config) : 0}
      >
        {config.children || 'Saved changes.'}
      </a1-snackbar>
    </>
  )
}

export function getDefaultConfig() {
  return {
    mode: 'single',
    children: 'Saved changes. Your dashboard is up to date.',
    position: 'bottom',
    action: true,
    actionLabel: 'Undo',
    dismissible: true,
    autoDismiss: false,
    autoHideDuration: 6000,
    stackCount: 3,
  }
}

export function Preview({ config, viewAs = 'react', utilityClass = '' }) {
  const [open, setOpen] = useState(false)
  const [snackbars, setSnackbars] = useState([])

  useEffect(() => {
    setOpen(false)
    setSnackbars([])
  }, [viewAs, config.children, config.position, config.action, config.actionLabel, config.dismissible, config.autoDismiss, config.autoHideDuration, config.mode, config.stackCount])

  if (config.mode === 'multiple' && viewAs !== 'react') {
    return (
      <Code variant="block" wrapping>
        Multiple snackbars use the React SnackbarStack host. Queue one snackbar at a time for this package.
      </Code>
    )
  }

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
          onClose={config.dismissible || config.autoDismiss ? () => setOpen(false) : undefined}
          autoHideDuration={config.autoDismiss ? autoHideValue(config) : undefined}
          dismissible={config.dismissible}
        >
          {config.children || 'Saved changes.'}
        </Snackbar>
      </>
    )
  }

  if (config.mode === 'multiple') {
    const showStack = () => setSnackbars(stackItems(config))
    const dismiss = (id) => setSnackbars((current) => current.filter((item) => item.id !== id))

    return (
      <>
        <Button type="button" onClick={showStack} disabled={snackbars.length > 0}>
          Show snackbars
        </Button>
        <SnackbarStack
          position={config.position}
          items={snackbars.map((item) => ({
            ...item,
            onAction: config.action ? () => dismiss(item.id) : undefined,
            onClose: config.dismissible || config.autoDismiss ? () => dismiss(item.id) : undefined,
            autoHideDuration: config.autoDismiss ? autoHideValue(config) : undefined,
            dismissible: config.dismissible,
          }))}
        />
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
        onClose={config.dismissible || config.autoDismiss ? () => setOpen(false) : undefined}
        autoHideDuration={config.autoDismiss ? autoHideValue(config) : undefined}
        dismissible={config.dismissible}
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
      <Choice
        prop="mode"
        label="Mode"
        value={config.mode || 'single'}
        onChange={(mode) => set({ mode })}
        options={MODE_OPTIONS}
        helper="Use Single for the standard one-message snackbar. Use Multiple only when several short confirmations must stay visible together."
      />
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
          { key: 'autoDismiss', label: 'Auto dismiss', icon: 'timer', value: config.autoDismiss },
        ]}
        onChange={set}
        helper="Auto dismiss calls the close handler after the duration and pauses while the snackbar is hovered or focused."
      />
      {config.mode === 'multiple' && (
        <TextField
          label="Visible snackbars"
          size="compact"
          type="number"
          min="2"
          max="4"
          value={config.stackCount ?? 3}
          onChange={(event) => set({ stackCount: event.target.value })}
        />
      )}
      {config.autoDismiss && (
        <WithHelp helper="Use milliseconds. Leave enough time for people to read the message and reach any action.">
          <TextField
            label="Dismiss after"
            size="compact"
            type="number"
            min="1000"
            step="500"
            value={config.autoHideDuration ?? 6000}
            onChange={(event) => set({ autoHideDuration: event.target.value })}
          />
        </WithHelp>
      )}
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
