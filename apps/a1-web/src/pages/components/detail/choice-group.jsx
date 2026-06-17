import {
  Accordion,
  Button,
  ChoiceGroup,
  Code,
  Divider,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, DensityChoice, FieldState, ResponsiveControl } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'
import { IconSelect } from './IconSelect.jsx'

const COLUMN_OPTIONS = ['auto', '1', '2', '3']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function createOption(label) {
  return {
    id: `option-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    subtext: '',
    icon: '',
    disabled: false,
  }
}

function normalizeOptions(options) {
  return Array.isArray(options) && options.length > 0 ? options : [createOption('Option one')]
}

export function getDefaultConfig() {
  return {
    label: 'Plan',
    hint: '',
    error: '',
    success: '',
    size: 'default',
    columns: 'auto',
    multiple: false,
    inlineIcon: false,
    hideIndicator: false,
    required: false,
    options: [
      { id: 'opt-starter', label: 'Starter', subtext: 'For individuals', icon: 'person', disabled: false },
      { id: 'opt-team', label: 'Team', subtext: 'For small teams', icon: 'group', disabled: false },
      { id: 'opt-business', label: 'Business', subtext: 'For organizations', icon: 'apartment', disabled: false },
    ],
    openItems: [],
  }
}

function resolveColumns(columns) {
  // columns can be 'auto' / '1'… or a responsive object of those values.
  if (columns && typeof columns === 'object') {
    const out = {}
    for (const [key, value] of Object.entries(columns)) {
      if (value !== 'auto' && value != null && value !== '') out[key] = Number(value)
    }
    return Object.keys(out).length ? out : undefined
  }
  return columns === 'auto' ? undefined : Number(columns)
}

function columnsSnippet(columns) {
  if (columns && typeof columns === 'object') {
    const entries = ['xs', 'sm', 'md', 'lg', 'xl']
      .filter((key) => columns[key] !== undefined && columns[key] !== 'auto')
      .map((key) => `${key}: ${Number(columns[key])}`)
    return entries.length ? `columns={{ ${entries.join(', ')} }}` : null
  }
  return columns !== 'auto' ? `columns={${Number(columns)}}` : null
}

function buildOptions(options) {
  return normalizeOptions(options).map((opt) => ({
    value: opt.id,
    label: opt.label || 'Untitled',
    subtext: opt.subtext || undefined,
    icon: opt.icon || undefined,
    disabled: opt.disabled || undefined,
  }))
}

export function Preview({ config }) {
  const options = buildOptions(config.options)
  const firstEnabled = options.find((o) => !o.disabled)?.value
  return (
    <ChoiceGroup
      label={config.label || undefined}
      hint={config.hint || undefined}
      error={config.error || undefined}
      success={config.success || undefined}
      size={config.size}
      columns={resolveColumns(config.columns)}
      multiple={config.multiple}
      inlineIcon={config.inlineIcon}
      hideIndicator={config.hideIndicator}
      required={config.required}
      options={options}
      defaultValue={config.multiple ? (firstEnabled ? [firstEnabled] : []) : firstEnabled ?? null}
    />
  )
}

/**
 * `itemsMode` controls how individual options are edited:
 * - "accordion" (default, used on the standalone detail page): each option is an
 *   expandable accordion.
 * - "select" (used in the a1-web Editor): a master-detail picker — click an
 *   option to select it, then edit its props in a dedicated area below. The
 *   selected option id is held in `config.openItems[0]`.
 */
export function Controls({ config, setConfig, itemsMode = 'accordion' }) {
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

  function selectOption(id) {
    setConfig((current) => ({ ...current, openItems: [id] }))
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
      const currentOpen = Array.isArray(current.openItems) ? current.openItems : []
      return {
        ...current,
        options: [...list, next],
        // Select mode: the new option becomes the single selection.
        // Accordion mode: the new option is added to the expanded set.
        openItems: itemsMode === 'select' ? [next.id] : Array.from(new Set([...currentOpen, next.id])),
      }
    })
  }

  const optionFields = (opt) => (
    <Stack gap="md">
      <TextField label="Label" size="compact" value={opt.label} onChange={(e) => updateOption(opt.id, { label: e.target.value })} />
      <TextField label="Subtext" size="compact" value={opt.subtext} onChange={(e) => updateOption(opt.id, { subtext: e.target.value })} />
      <IconSelect label="Icon" value={opt.icon} onChange={(icon) => updateOption(opt.id, { icon })} />
      <Toggle label="Disabled" value={opt.disabled} onChange={(disabled) => updateOption(opt.id, { disabled })} />
      <Button type="button" variant="destructive" size="sm" icon="delete" disabled={options.length <= 1} onClick={() => removeOption(opt.id)}>
        Remove option
      </Button>
    </Stack>
  )

  // Master-detail selection (select mode): fall back to the first option when
  // the stored selection no longer exists (e.g. after a remove).
  const selectedId = options.some((o) => o.id === openItems[0]) ? openItems[0] : options[0]?.id
  const selectedOption = options.find((o) => o.id === selectedId)

  const itemsSection = itemsMode === 'select' ? (
    <Stack gap="sm">
      <Paragraph size="xs" color="muted">Options</Paragraph>
      <Stack gap="xs">
        {options.map((opt, index) => (
          <Button
            key={opt.id}
            type="button"
            variant={opt.id === selectedId ? 'primary' : 'secondary'}
            size="sm"
            fullWidth
            onClick={() => selectOption(opt.id)}
          >
            {`${index + 1}. ${opt.label || 'Untitled option'}`}
          </Button>
        ))}
      </Stack>
      {selectedOption && (
        <>
          <Divider space="xs" />
          {optionFields(selectedOption)}
        </>
      )}
    </Stack>
  ) : (
    <Stack gap="sm">
      {options.map((opt, index) => (
        <Accordion
          key={opt.id}
          label={`${index + 1}. ${opt.label || 'Untitled option'}`}
          size="sm"
          open={openItems.includes(opt.id)}
          onChange={(open) => toggleOption(opt.id, open)}
        >
          {optionFields(opt)}
        </Accordion>
      ))}
    </Stack>
  )

  return (
    <Stack gap="lg">
      <TextField label="Label" size="compact" value={config.label} onChange={(e) => set({ label: e.target.value })} />
      <TextField label="Hint" size="compact" value={config.hint} onChange={(e) => set({ hint: e.target.value })} />
      <TextField label="Error" size="compact" value={config.error} onChange={(e) => set({ error: e.target.value })} />
      <TextField label="Success" size="compact" value={config.success} onChange={(e) => set({ success: e.target.value })} />
      <DensityChoice value={config.size} onChange={(size) => set({ size })} />
      <ResponsiveControl label="Columns" value={config.columns} onChange={(columns) => set({ columns })} defaultValue="auto">
        {(val, setVal) => (
          <Choice
            value={val} onChange={setVal}
            options={COLUMN_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
          />
        )}
      </ResponsiveControl>
      <FieldState
        label="Options"
        items={[
          { key: 'required', label: 'Required', icon: 'asterisk', value: config.required },
          { key: 'hideIndicator', label: 'Hide indicator', icon: 'visibility_off', value: config.hideIndicator },
          { key: 'inlineIcon', label: 'Inline icon', icon: 'align_horizontal_left', value: config.inlineIcon },
          { key: 'multiple', label: 'Multiple', icon: 'select_check_box', value: config.multiple },
        ]}
        onChange={set}
      />

      {itemsSection}

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addOption}>
        Add option
      </Button>
    </Stack>
  )
}

function buildSnippet(config) {
  const props = [
    config.label ? `label="${escapeJsxString(config.label)}"` : null,
    config.hint ? `hint="${escapeJsxString(config.hint)}"` : null,
    config.error ? `error="${escapeJsxString(config.error)}"` : null,
    config.success ? `success="${escapeJsxString(config.success)}"` : null,
    config.size !== 'default' ? `size="${config.size}"` : null,
    columnsSnippet(config.columns),
    config.multiple ? 'multiple' : null,
    config.inlineIcon ? 'inlineIcon' : null,
    config.hideIndicator ? 'hideIndicator' : null,
    config.required ? 'required' : null,
  ].filter(Boolean).join('\n  ')

  const optionLines = normalizeOptions(config.options)
    .map((opt) => {
      const parts = [
        `value: "${escapeJsxString(opt.id)}"`,
        `label: "${escapeJsxString(opt.label || 'Untitled')}"`,
        opt.subtext ? `subtext: "${escapeJsxString(opt.subtext)}"` : null,
        opt.icon ? `icon: "${escapeJsxString(opt.icon)}"` : null,
        opt.disabled ? 'disabled: true' : null,
      ].filter(Boolean).join(', ')
      return `    { ${parts} },`
    })
    .join('\n')

  return `<ChoiceGroup\n  ${props}\n  options={[\n${optionLines}\n  ]}\n/>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
