import { useState } from 'react'
import {
  Button,
  ButtonContainer,
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

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
]

function buildDialogSnippet(config, utilityClass = '') {
  const props = [
    'open={open}',
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
    config.showClose ? 'onClose={() => setOpen(false)}' : null,
    config.title ? `title="${escapeJsxString(config.title)}"` : null,
    config.size && config.size !== 'md' ? `size="${config.size}"` : null,
    config.status ? `status="${config.status}"` : null,
    config.status && config.customIcon ? `icon="${config.icon || 'info'}"` : null,
    `footer={
    <ButtonContainer align="end">
      <Button onClick={() => setOpen(false)}>Confirm</Button>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    </ButtonContainer>
  }`,
  ].filter(Boolean).join('\n  ')

  return `const [open, setOpen] = useState(false)

<>
  <Button onClick={() => setOpen(true)}>Open dialog</Button>
  <Dialog
  ${props}
  >
    <Paragraph>Dialog body content.</Paragraph>
  </Dialog>
</>`
}

export function getDefaultConfig() {
  return {
    title: 'Confirm action',
    size: 'md',
    showClose: true,
    status: '',
    customIcon: false,
    icon: 'check_circle',
  }
}

export function Preview({ config, utilityClass = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <Stack align="center">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        className={utilityClass || undefined}
        open={open}
        onClose={config.showClose ? () => setOpen(false) : undefined}
        title={config.title || undefined}
        size={config.size || undefined}
        status={config.status || undefined}
        icon={config.status && config.customIcon ? (config.icon || undefined) : undefined}
        footer={
          <ButtonContainer align="end">
            <Button onClick={() => setOpen(false)}>Confirm</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          </ButtonContainer>
        }
      >
        <Paragraph size="sm">
          Dialog body content. Use the footer slot for primary and secondary actions.
        </Paragraph>
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
        value={config.showClose}
        onChange={(showClose) => set({ showClose })}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildDialogSnippet(config, utilityClass)}</Code>
}
