import {
  Accordion,
  Button,
  Code,
  SelectField,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, DensityChoice, FieldState } from './configKit.jsx'

const LABEL_POSITION_OPTIONS = ['above', 'before']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
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

function createOption(label) {
  return { id: `option-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label }
}

function normalizeOptions(options) {
  return Array.isArray(options) && options.length > 0 ? options : [createOption('Option one')]
}

export function getDefaultConfig() {
  return {
    label: 'Country',
    hint: '',
    error: '',
    size: 'default',
    labelPosition: 'above',
    required: false,
    disabled: false,
    options: [
      { id: 'opt-us', label: 'United States' },
      { id: 'opt-ca', label: 'Canada' },
      { id: 'opt-mx', label: 'Mexico' },
    ],
    openItems: [],
  }
}

export function Preview({ config }) {
  const options = normalizeOptions(config.options)
  return (
    <SelectField
      label={config.label || undefined}
      hint={config.hint || undefined}
      error={config.error || undefined}
      size={config.size}
      labelPosition={config.labelPosition}
      required={config.required}
      disabled={config.disabled}
      defaultValue={options[0]?.id}
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.label || 'Untitled'}</option>
      ))}
    </SelectField>
  )
}

export function Controls({ config, setConfig }) {
  const options = normalizeOptions(config.options)
  const openItems = Array.isArray(config.openItems) ? config.openItems : []
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  function updateOption(id, patch) {
    setConfig((current) => ({
      ...current,
      options: normalizeOptions(current.options).map((opt) => (opt.id === id ? { ...opt, ...patch } : opt)),
    }))
  }

  function toggleOption(id, open) {
    setConfig((current) => {
      const currentOpen = Array.isArray(current.openItems) ? current.openItems : []
      return {
        ...current,
        openItems: open ? Array.from(new Set([...currentOpen, id])) : currentOpen.filter((x) => x !== id),
      }
    })
  }

  function removeOption(id) {
    setConfig((current) => {
      const next = normalizeOptions(current.options).filter((opt) => opt.id !== id)
      return {
        ...current,
        options: next.length > 0 ? next : normalizeOptions(current.options),
        openItems: (current.openItems ?? []).filter((x) => x !== id),
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
      <TextField label="Label" size="compact" value={config.label} onChange={(e) => set({ label: e.target.value })} />
      <TextField label="Hint" size="compact" value={config.hint} onChange={(e) => set({ hint: e.target.value })} />
      <TextField label="Error" size="compact" value={config.error} onChange={(e) => set({ error: e.target.value })} />
      <DensityChoice value={config.size} onChange={(size) => set({ size })} />
      <Choice prop="labelPosition"
        label="Label position" size="compact" hideIndicator columns={2}
        value={config.labelPosition} onChange={(labelPosition) => set({ labelPosition })}
        options={LABEL_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <FieldState
        items={[
          { key: 'required', label: 'Required', icon: 'asterisk', value: config.required },
          { key: 'disabled', label: 'Disabled', icon: 'block', value: config.disabled },
        ]}
        onChange={set}
      />

      <Stack gap="sm">
        {options.map((opt, index) => (
          <Accordion
            key={opt.id}
            label={`${index + 1}. ${opt.label || 'Untitled option'}`}
            size="sm"
            open={openItems.includes(opt.id)}
            onChange={(open) => toggleOption(opt.id, open)}
          >
            <Stack gap="md">
              <TextField
                label="Label"
                size="compact"
                value={opt.label}
                onChange={(e) => updateOption(opt.id, { label: e.target.value })}
              />
              <Button
                type="button" variant="destructive" size="sm" icon="delete"
                disabled={options.length <= 1}
                onClick={() => removeOption(opt.id)}
              >
                Remove option
              </Button>
            </Stack>
          </Accordion>
        ))}
      </Stack>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addOption}>
        Add option
      </Button>
    </Stack>
  )
}

function buildSelectSnippet(config) {
  const options = normalizeOptions(config.options)
  const props = [
    config.label ? `label="${escapeJsxString(config.label)}"` : null,
    config.hint ? `hint="${escapeJsxString(config.hint)}"` : null,
    config.error ? `error="${escapeJsxString(config.error)}"` : null,
    config.size !== 'default' ? `size="${config.size}"` : null,
    config.labelPosition !== 'above' ? `labelPosition="${config.labelPosition}"` : null,
    config.required ? 'required' : null,
    config.disabled ? 'disabled' : null,
  ].filter(Boolean).join('\n  ')

  const optionLines = options
    .map((opt) => `  <option value="${escapeJsxString(opt.id)}">${escapeJsxText(opt.label || 'Untitled')}</option>`)
    .join('\n')

  return `<SelectField\n  ${props}\n>\n${optionLines}\n</SelectField>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSelectSnippet(config)}</Code>
}
