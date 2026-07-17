import { useState } from 'react'
import {
  Button,
  Code,
  Dialog,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, statusOptions } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'
import { IconSelect } from './IconSelect.jsx'

export const bareDisplay = true

const STATUS_OPTIONS = ['', 'success', 'error', 'warn', 'info', 'neutral']

function optionLabel(value) {
  if (!value) return 'None'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function dialogShowsClose(config) {
  return config.showClose !== false
}

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
]

const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'success']
const BUTTON_SIZES = ['sm', 'md', 'lg']

function footerActions(config) {
  if (Array.isArray(config.footerActions)) {
    return config.footerActions.filter((action) => action?.type === 'Button')
  }
  return [
    { id: 'confirm', type: 'Button', content: { fallback: 'Confirm' } },
    { id: 'cancel', type: 'Button', content: { fallback: 'Cancel' }, props: { variant: 'secondary' } },
  ]
}

function DialogFooterActions({ actions, onClose }) {
  return actions.map((action) => {
    const props = action.props ?? {}
    const variant = BUTTON_VARIANTS.includes(props.variant) ? props.variant : 'primary'
    const size = BUTTON_SIZES.includes(props.size) ? props.size : undefined
    const label = typeof action.content?.fallback === 'string' ? action.content.fallback : 'Button'
    return (
      <Button
        key={action.id}
        variant={variant}
        size={size}
        icon={typeof props.icon === 'string' ? props.icon : undefined}
        iconPosition={props.iconPosition === 'end' ? 'end' : undefined}
        fullWidth={props.fullWidth === true || undefined}
        loading={props.loading === true || undefined}
        disabled={props.disabled === true || undefined}
        onClick={onClose}
      >
        {label}
      </Button>
    )
  })
}

function buildDialogSnippet(config, utilityClass = '') {
  const props = [
    'open={open}',
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
    dialogShowsClose(config) ? 'onClose={() => setOpen(false)}' : null,
    config.title ? `title="${escapeJsxString(config.title)}"` : null,
    config.size && config.size !== 'md' ? `size="${config.size}"` : null,
    config.status ? `status="${config.status}"` : null,
    config.status && config.customIcon ? `icon="${config.icon || 'info'}"` : null,
    config.showFooter !== false ? `footer={
    <ButtonContainer align="end">
      <Button onClick={() => setOpen(false)}>Confirm</Button>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    </ButtonContainer>
  }` : null,
  ].filter(Boolean).join('\n  ')

  return `const [open, setOpen] = useState(false)

<>
  <Button onClick={() => setOpen(true)}>Open dialog</Button>
  <Dialog
  ${props}
  >
    <Paragraph>${escapeJsxString(config.body || 'Dialog body content.')}</Paragraph>
  </Dialog>
</>`
}

export function getDefaultConfig() {
  return {
    title: 'Confirm action',
    body: 'Dialog body content. Use the footer slot for primary and secondary actions.',
    size: 'md',
    showClose: true,
    showFooter: true,
    status: '',
    customIcon: false,
    icon: 'check_circle',
    footerActions: null,
  }
}

export const jsonType = 'Dialog'

export function toJson(config) {
  const props = {}
  if (config.title) props.title = config.title
  if (config.body) props.body = config.body
  if (config.size && config.size !== 'md') props.size = config.size
  if (config.status) props.status = config.status
  if (config.showClose === false) props.showClose = false
  if (config.showFooter === false) props.showFooter = false
  if (config.status && config.customIcon && config.icon) props.icon = config.icon
  if (Array.isArray(config.footerActions)) props.footerActions = config.footerActions
  return { node: { id: 'dialog-1', type: jsonType, props } }
}

export function fromJson(node) {
  const config = getDefaultConfig()
  const props = node.props ?? {}
  if (typeof props.title === 'string') config.title = props.title
  if (typeof props.body === 'string') config.body = props.body
  if (['sm', 'md', 'lg', 'xl'].includes(props.size)) config.size = props.size
  if (STATUS_OPTIONS.includes(props.status)) config.status = props.status
  config.showClose = props.showClose !== false
  config.showFooter = props.showFooter !== false
  if (typeof props.icon === 'string' && props.icon) {
    config.icon = props.icon
    config.customIcon = true
  }
  if (Array.isArray(props.footerActions)) {
    config.footerActions = props.footerActions.filter((action) => action?.type === 'Button')
  }
  return config
}

export function Preview({ config, utilityClass = '' }) {
  const [open, setOpen] = useState(false)
  const actions = footerActions(config)
  const footer = config.footer ?? <DialogFooterActions actions={actions} onClose={() => setOpen(false)} />
  const hasSlotChildren = config.children !== undefined
    && config.children !== null
    && !(Array.isArray(config.children) && config.children.length === 0)

  return (
    <Stack align="center">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        className={utilityClass || undefined}
        open={open}
        onClose={dialogShowsClose(config) ? () => setOpen(false) : undefined}
        title={config.title || undefined}
        size={config.size || undefined}
        status={config.status || undefined}
        icon={config.status && config.customIcon ? (config.icon || undefined) : undefined}
        footer={config.showFooter !== false ? footer : undefined}
      >
        {hasSlotChildren
          ? config.children
          : (
            <Paragraph size="sm">
              {config.body || 'Dialog body content.'}
            </Paragraph>
          )}
      </Dialog>
    </Stack>
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
      <TextField
        label="Body"
        size="compact"
        value={config.body ?? ''}
        onChange={(event) => set({ body: event.target.value })}
      />
      <Choice prop="size"
        label="Width"
        value={config.size}
        onChange={(size) => set({ size })}
        options={SIZE_OPTIONS}
        helper="Dialog width: Small (440px) for short confirmations, Medium (560px, default), Large (720px) and Extra large (920px) for wide, content-rich or tabbed dialogs. Every size caps at the viewport."
      />
      <Choice prop="status"
        label="Status"
        iconOnly
        value={config.status}
        onChange={(status) => set({ status })}
        options={statusOptions(STATUS_OPTIONS)}
      />
      {config.status && (
        <>
          <Toggle prop="customIcon"
            label="Custom icon"
            value={config.customIcon}
            onChange={(customIcon) => set({ customIcon })}
          />
          {config.customIcon && (
            <IconSelect
              label="Icon"
              value={config.icon}
              onChange={(icon) => set({ icon })}
            />
          )}
        </>
      )}
      <Toggle prop="showClose"
        label="Close button"
        hint="Omit onClose to hide the dismiss button entirely."
        value={dialogShowsClose(config)}
        onChange={(showClose) => set({ showClose })}
      />
      <Toggle prop="showFooter"
        label="Footer"
        hint="Shows representative primary and secondary actions in the preview."
        value={config.showFooter !== false}
        onChange={(showFooter) => set({ showFooter })}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildDialogSnippet(config, utilityClass)}</Code>
}
