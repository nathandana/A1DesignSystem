import { useState } from 'react'
import {
  Accordion,
  Button,
  ChoiceGroup,
  Code,
  SegmentedControl,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['sm', 'md', 'lg']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

function createOption(label) {
  return {
    id: `segment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    icon: '',
  }
}

function normalizeOptions(options) {
  return Array.isArray(options) && options.length > 0
    ? options
    : [createOption('One')]
}

export function getDefaultConfig() {
  return {
    size: 'md',
    fullWidth: false,
    options: [
      { id: 'segment-day', label: 'Day', icon: '' },
      { id: 'segment-week', label: 'Week', icon: '' },
      { id: 'segment-month', label: 'Month', icon: '' },
    ],
    openItems: [],
  }
}

export function Preview({ config }) {
  const options = normalizeOptions(config.options)
  const [value, setValue] = useState(options[0]?.id)
  const activeValue = options.some((opt) => opt.id === value) ? value : options[0]?.id

  return (
    <SegmentedControl
      value={activeValue}
      onChange={setValue}
      size={config.size}
      fullWidth={config.fullWidth}
      options={options.map((opt) => ({
        value: opt.id,
        label: opt.label || 'Untitled',
        icon: opt.icon || undefined,
      }))}
    />
  )
}

export function Controls({ config, setConfig }) {
  const options = normalizeOptions(config.options)
  const openItems = Array.isArray(config.openItems) ? config.openItems : []

  function updateOption(id, patch) {
    setConfig((current) => ({
      ...current,
      options: normalizeOptions(current.options).map((opt) => (
        opt.id === id ? { ...opt, ...patch } : opt
      )),
    }))
  }

  function toggleOption(id, open) {
    setConfig((current) => {
      const currentOpen = Array.isArray(current.openItems) ? current.openItems : []
      return {
        ...current,
        openItems: open
          ? Array.from(new Set([...currentOpen, id]))
          : currentOpen.filter((itemId) => itemId !== id),
      }
    })
  }

  function removeOption(id) {
    setConfig((current) => {
      const next = normalizeOptions(current.options).filter((opt) => opt.id !== id)
      return {
        ...current,
        options: next.length > 0 ? next : normalizeOptions(current.options),
        openItems: (current.openItems ?? []).filter((itemId) => itemId !== id),
      }
    })
  }

  function addOption() {
    setConfig((current) => {
      const list = normalizeOptions(current.options)
      const next = createOption(`Option ${list.length + 1}`)
      return {
        ...current,
        options: [...list, next],
        openItems: Array.from(new Set([...(current.openItems ?? []), next.id])),
      }
    })
  }

  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle label="Full width" value={config.fullWidth} onChange={(fullWidth) => setConfig((current) => ({ ...current, fullWidth }))} />

      <Stack gap="sm">
        {options.map((option, index) => {
          const label = option.label || 'Untitled option'
          return (
            <Accordion
              key={option.id}
              label={`${index + 1}. ${label}`}
              size="sm"
              open={openItems.includes(option.id)}
              onChange={(open) => toggleOption(option.id, open)}
            >
              <Stack gap="md">
                <TextField
                  label="Label"
                  size="compact"
                  value={option.label}
                  onChange={(event) => updateOption(option.id, { label: event.target.value })}
                />

                <Toggle
                  label="Icon"
                  value={!!option.icon}
                  onChange={(checked) => updateOption(option.id, { icon: checked ? (option.icon || 'star') : '' })}
                />

                {option.icon && (
                  <IconSelect
                    value={option.icon}
                    onChange={(icon) => updateOption(option.id, { icon })}
                  />
                )}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  icon="delete"
                  disabled={options.length <= 1}
                  onClick={() => removeOption(option.id)}
                >
                  Remove option
                </Button>
              </Stack>
            </Accordion>
          )
        })}
      </Stack>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addOption}>
        Add option
      </Button>
    </Stack>
  )
}

function optionSnippet(option) {
  const props = [
    `value: '${escapeJsString(option.id)}'`,
    `label: '${escapeJsString(option.label || 'Untitled')}'`,
    option.icon ? `icon: '${escapeJsString(option.icon)}'` : null,
  ].filter(Boolean).join(', ')
  return `    { ${props} },`
}

function buildSegmentedSnippet(config) {
  const options = normalizeOptions(config.options)
  const props = [
    `value={value}`,
    `onChange={setValue}`,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.fullWidth ? 'fullWidth' : null,
  ].filter(Boolean).join(' ')

  return `<SegmentedControl ${props}
  options={[
${options.map(optionSnippet).join('\n')}
  ]}
/>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSegmentedSnippet(config)}</Code>
}
