import {
  Accordion,
  Button,
  Code,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { DensityChoice, FieldState } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

// Shared configurator factory for CheckboxGroup and RadioGroup. They share the
// same option shape ({ value, label, hint, disabled }) and group props; the only
// difference is multi- vs single-select default value handling.

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

function createOption(label) {
  return {
    id: `choice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    hint: '',
    disabled: false,
    selected: false,
  }
}

export function createGroupModule({ Component, componentName, multiple }) {
  function normalizeOptions(options) {
    return Array.isArray(options) && options.length > 0 ? options : [createOption('Option one')]
  }

  function selectedIds(options) {
    const chosen = options.filter((opt) => opt.selected).map((opt) => opt.id)
    if (multiple) return chosen
    return chosen.length > 0 ? chosen[0] : undefined
  }

  function Preview({ config }) {
    const options = normalizeOptions(config.options)
    const defaultValue = selectedIds(options)
    return (
      <Component
        key={JSON.stringify(defaultValue ?? null)}
        label={config.label || undefined}
        hint={config.hint || undefined}
        error={config.error || undefined}
        size={config.size}
        required={config.required}
        disabled={config.disabled}
        inline={config.inline}
        defaultValue={defaultValue}
        options={options.map((opt) => ({
          value: opt.id,
          label: opt.label || 'Untitled',
          hint: opt.hint || undefined,
          disabled: opt.disabled || undefined,
        }))}
      />
    )
  }

  function Controls({ config, setConfig }) {
    const options = normalizeOptions(config.options)
    const openItems = Array.isArray(config.openItems) ? config.openItems : []
    const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

    function updateOption(id, patch) {
      setConfig((current) => ({
        ...current,
        options: normalizeOptions(current.options).map((opt) => {
          if (opt.id !== id) {
            // Single-select: turning one on clears the others.
            if (!multiple && patch.selected === true) return { ...opt, selected: false }
            return opt
          }
          return { ...opt, ...patch }
        }),
      }))
    }

    function toggleOpen(id, open) {
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
        <TextField label="Legend" size="compact" value={config.label} onChange={(e) => set({ label: e.target.value })} />
        <TextField label="Hint" size="compact" value={config.hint} onChange={(e) => set({ hint: e.target.value })} />
        <TextField label="Error" size="compact" value={config.error} onChange={(e) => set({ error: e.target.value })} />
        <DensityChoice value={config.size} onChange={(size) => set({ size })} />
        <Toggle prop="inline" label="Inline" value={config.inline} onChange={(inline) => set({ inline })} />
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
              label={`${index + 1}. ${opt.label || 'Untitled'}${opt.selected ? ' (selected)' : ''}`}
              size="sm"
              open={openItems.includes(opt.id)}
              onChange={(open) => toggleOpen(opt.id, open)}
            >
              <Stack gap="md">
                <TextField
                  label="Label" size="compact" value={opt.label}
                  onChange={(e) => updateOption(opt.id, { label: e.target.value })}
                />
                <TextField
                  label="Hint" size="compact" value={opt.hint}
                  onChange={(e) => updateOption(opt.id, { hint: e.target.value })}
                />
                <Toggle label="Selected" value={opt.selected} onChange={(selected) => updateOption(opt.id, { selected })} />
                <Toggle label="Disabled" value={opt.disabled} onChange={(disabled) => updateOption(opt.id, { disabled })} />
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

  function optionSnippet(opt) {
    const props = [
      `value: '${escapeJsString(opt.id)}'`,
      `label: '${escapeJsString(opt.label || 'Untitled')}'`,
      opt.hint ? `hint: '${escapeJsString(opt.hint)}'` : null,
      opt.disabled ? 'disabled: true' : null,
    ].filter(Boolean).join(', ')
    return `    { ${props} },`
  }

  function buildSnippet(config) {
    const options = normalizeOptions(config.options)
    const defaultValue = selectedIds(options)
    const defaultValueStr = multiple
      ? (defaultValue.length > 0 ? `[${defaultValue.map((v) => `'${escapeJsString(v)}'`).join(', ')}]` : null)
      : (defaultValue ? `'${escapeJsString(defaultValue)}'` : null)

    const props = [
      config.label ? `label="${escapeJsString(config.label)}"` : null,
      config.hint ? `hint="${escapeJsString(config.hint)}"` : null,
      config.error ? `error="${escapeJsString(config.error)}"` : null,
      config.size !== 'default' ? `size="${config.size}"` : null,
      config.inline ? 'inline' : null,
      config.required ? 'required' : null,
      config.disabled ? 'disabled' : null,
      defaultValueStr ? `defaultValue={${defaultValueStr}}` : null,
    ].filter(Boolean).join('\n  ')

    return `<${componentName}\n  ${props ? `${props}\n  ` : ''}options={[\n${options.map(optionSnippet).join('\n')}\n  ]}\n/>`
  }

  function Snippet({ config }) {
    return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
  }

  function getDefaultConfig() {
    return {
      label: multiple ? 'Notifications' : 'Plan',
      hint: '',
      error: '',
      size: 'default',
      inline: false,
      required: false,
      disabled: false,
      options: multiple
        ? [
            { id: 'opt-email', label: 'Email', hint: '', disabled: false, selected: true },
            { id: 'opt-sms', label: 'SMS', hint: '', disabled: false, selected: false },
            { id: 'opt-push', label: 'Push', hint: '', disabled: false, selected: false },
          ]
        : [
            { id: 'opt-starter', label: 'Starter', hint: '', disabled: false, selected: true },
            { id: 'opt-pro', label: 'Professional', hint: '', disabled: false, selected: false },
            { id: 'opt-ent', label: 'Enterprise', hint: '', disabled: false, selected: false },
          ],
      openItems: [],
    }
  }

  return { getDefaultConfig, Preview, Controls, Snippet }
}
