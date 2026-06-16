import { useState } from 'react'
import {
  Button,
  ButtonContainer,
  ChoiceGroup,
  Code,
  Dialog,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
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

function buildDialogSnippet(config) {
  const props = [
    'open={open}',
    config.showClose ? 'onClose={() => setOpen(false)}' : null,
    config.title ? `title="${escapeJsxString(config.title)}"` : null,
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
    showClose: true,
    status: '',
    customIcon: false,
    icon: 'check_circle',
  }
}

export function Preview({ config }) {
  const [open, setOpen] = useState(false)

  return (
    <Stack align="center">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onClose={config.showClose ? () => setOpen(false) : undefined}
        title={config.title || undefined}
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
      <ChoiceGroup
        label="Status"
        hint="Renders a full-bleed hero band at the top with a status icon."
        size="compact"
        hideIndicator
        columns={3}
        value={config.status}
        onChange={(status) => set({ status })}
        options={STATUS_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      {config.status && (
        <>
          <Toggle
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
      <Toggle
        label="Close button"
        hint="Omit onClose to hide the dismiss button entirely."
        value={config.showClose}
        onChange={(showClose) => set({ showClose })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildDialogSnippet(config)}</Code>
}
