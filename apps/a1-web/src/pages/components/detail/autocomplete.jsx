import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Button,
  Code,
  Divider,
  IconButton,
  Paragraph,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, DensityChoice, FieldState } from './configKit.jsx'

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function tabLabel(label, index, total) {
  const text = (label ?? '').trim() || `${index + 1}`
  if (total <= 4) return text
  return text.length > 4 ? `${text.slice(0, 4)}…` : text
}

function ItemEditor({ option, canRemove, showSwatch, onChange, onRemove }) {
  return (
    <Stack gap="sm">
      <Stack direction="row" justify="end">
        <IconButton icon="delete" variant="destructive" size="sm" aria-label="Remove option" disabled={!canRemove} onClick={onRemove} />
      </Stack>
      <TextField label="Label" size="compact" value={option.label} onChange={(e) => onChange({ label: e.target.value })} />
      {showSwatch && (
        <Stack direction="row" align="center" gap="sm">
          <input type="color" className="a1-web-theme-swatch" aria-label="Swatch colour" value={option.swatch || DEFAULT_SWATCH} onChange={(e) => onChange({ swatch: e.target.value })} />
          <Paragraph size="sm" color="muted">Swatch colour</Paragraph>
        </Stack>
      )}
    </Stack>
  )
}

const DEFAULT_SWATCH = '#7c3aed'

function createOption(label) {
  return { id: `option-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label }
}

function normalizeOptions(options) {
  return Array.isArray(options) && options.length > 0 ? options : [createOption('Option one')]
}

export function getDefaultConfig() {
  return {
    label: 'Favorite fruit',
    hint: 'Type to filter',
    size: 'default',
    variant: 'default',
    multiple: false,
    allowCreate: false,
    required: false,
    disabled: false,
    options: [
      { id: 'apple', label: 'Apple', swatch: '#e0383b' },
      { id: 'banana', label: 'Banana', swatch: '#d9b310' },
      { id: 'cherry', label: 'Cherry', swatch: '#a01a2b' },
      { id: 'mango', label: 'Mango', swatch: '#e08a1e' },
      { id: 'orange', label: 'Orange', swatch: '#e2671e' },
    ],
  }
}

// Remounts on the single/multi switch so the value state resets to the right type.
function AutocompletePreview({ config, utilityClass = '' }) {
  const options = normalizeOptions(config.options)
  const [value, setValue] = useState(config.multiple ? [] : '')
  return (
    <Autocomplete
      className={utilityClass || undefined}
      label={config.label || undefined}
      hint={config.hint || undefined}
      size={config.size}
      variant={config.variant}
      multiple={config.multiple}
      allowCreate={config.allowCreate}
      required={config.required}
      disabled={config.disabled}
      options={options.map((o) => ({
        value: o.id,
        label: o.label || 'Untitled',
        swatch: config.variant === 'color' ? (o.swatch || DEFAULT_SWATCH) : undefined,
      }))}
      value={value}
      onChange={setValue}
    />
  )
}

export function Preview({ config, utilityClass = '' }) {
  return <AutocompletePreview key={`${config.multiple ? 'multi' : 'single'}-${config.variant}`} config={config} utilityClass={utilityClass} />
}

export function Controls({ config, setConfig, activeItemIndex = null, onSelectItem }) {
  const options = normalizeOptions(config.options)
  const [activeId, setActiveId] = useState(options[0]?.id ?? '')
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  const externalId = activeItemIndex != null ? options[activeItemIndex]?.id : null
  useEffect(() => {
    if (externalId && externalId !== activeId) setActiveId(externalId)
  }, [externalId]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeItemId = options.some((o) => o.id === activeId) ? activeId : (options[0]?.id ?? '')

  function selectTab(id) {
    setActiveId(id)
    const idx = options.findIndex((o) => o.id === id)
    if (idx >= 0) onSelectItem?.(idx)
  }
  function updateOption(id, patch) {
    setConfig((current) => ({
      ...current,
      options: normalizeOptions(current.options).map((opt) => (opt.id === id ? { ...opt, ...patch } : opt)),
    }))
  }
  function removeOption(id) {
    const idx = options.findIndex((o) => o.id === id)
    const next = options[idx + 1]?.id ?? options[idx - 1]?.id ?? ''
    setConfig((current) => {
      const filtered = normalizeOptions(current.options).filter((opt) => opt.id !== id)
      return { ...current, options: filtered.length > 0 ? filtered : normalizeOptions(current.options) }
    })
    setActiveId(next)
  }
  function addOption() {
    const option = createOption(`Option ${options.length + 1}`)
    const newIndex = options.length
    setConfig((current) => ({ ...current, options: [...normalizeOptions(current.options), option] }))
    setActiveId(option.id)
    onSelectItem?.(newIndex)
  }

  return (
    <Stack gap="lg">
      <TextField label="Label" size="compact" value={config.label} onChange={(e) => set({ label: e.target.value })} />
      <TextField label="Hint" size="compact" value={config.hint} onChange={(e) => set({ hint: e.target.value })} />
      <DensityChoice value={config.size} onChange={(size) => set({ size })} />
      <Choice
        label="Variant"
        prop="variant"
        value={config.variant}
        onChange={(variant) => set({ variant })}
        options={[
          { value: 'default', label: 'Default', icon: 'list' },
          { value: 'color', label: 'Color', icon: 'palette' },
        ]}
      />
      <FieldState
        items={[
          { key: 'multiple', label: 'Multi-select', icon: 'checklist', value: config.multiple },
          { key: 'allowCreate', label: 'Allow create', icon: 'add_circle', value: config.allowCreate },
          { key: 'required', label: 'Required', icon: 'asterisk', value: config.required },
          { key: 'disabled', label: 'Disabled', icon: 'block', value: config.disabled },
        ]}
        onChange={set}
      />

      <Divider space="none" />

      {options.length > 0 ? (
        <div className="a1-web-item-tabs">
          <Tabs value={activeItemId} onChange={selectTab} variant="line" size="compact">
            <TabList>
              {options.map((opt, i) => (
                <Tab key={opt.id} value={opt.id}>{tabLabel(opt.label, i, options.length)}</Tab>
              ))}
            </TabList>
            {options.map((opt) => (
              <TabPanel key={opt.id} value={opt.id}>
                <ItemEditor
                  option={opt}
                  canRemove={options.length > 1}
                  showSwatch={config.variant === 'color'}
                  onChange={(patch) => updateOption(opt.id, patch)}
                  onRemove={() => removeOption(opt.id)}
                />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      ) : (
        <Paragraph size="sm" color="muted">No options. Add one below.</Paragraph>
      )}

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addOption}>
        Add option
      </Button>
    </Stack>
  )
}

function buildSnippet(config, utilityClass = '') {
  const options = normalizeOptions(config.options)
  const isColor = config.variant === 'color'
  const props = [
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
    config.label ? `label="${escapeJsxString(config.label)}"` : null,
    config.hint ? `hint="${escapeJsxString(config.hint)}"` : null,
    config.size !== 'default' ? `size="${config.size}"` : null,
    isColor ? 'variant="color"' : null,
    config.multiple ? 'multiple' : null,
    config.allowCreate ? 'allowCreate' : null,
    config.required ? 'required' : null,
    config.disabled ? 'disabled' : null,
  ].filter(Boolean).join('\n  ')

  const optionsStr = options
    .map((opt) => {
      const swatch = isColor ? `, swatch: '${escapeJsxString(opt.swatch || DEFAULT_SWATCH)}'` : ''
      return `    { value: '${escapeJsxString(opt.id)}', label: '${escapeJsxString(opt.label || 'Untitled')}'${swatch} },`
    })
    .join('\n')

  return `<Autocomplete\n  ${props}\n  options={[\n${optionsStr}\n  ]}\n  value={value}\n  onChange={setValue}\n/>`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
