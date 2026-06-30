import { useEffect, useState } from 'react'
import {
  Button,
  Code,
  Divider,
  IconButton,
  Paragraph,
  SegmentedControl,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['sm', 'md', 'lg']
const LABEL_MODE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'selected', label: 'Selected' },
  { value: 'none', label: 'None' },
]

// Tab labels: full label for a few items; clamp to the first few characters once
// there are many so the tab strip stays compact. (Mirrors DefinitionList.)
function tabLabel(label, index, total) {
  const text = (label ?? '').trim() || `${index + 1}`
  if (total <= 4) return text
  return text.length > 4 ? `${text.slice(0, 4)}…` : text
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
    labelMode: 'all',
    options: [
      { id: 'segment-day', label: 'Day', icon: 'calendar_view_day' },
      { id: 'segment-week', label: 'Week', icon: 'calendar_view_week' },
      { id: 'segment-month', label: 'Month', icon: 'calendar_month' },
    ],
  }
}

export function Preview({ config, utilityClass = '' }) {
  const options = normalizeOptions(config.options)
  const [value, setValue] = useState(options[0]?.id)
  const activeValue = options.some((opt) => opt.id === value) ? value : options[0]?.id

  return (
    <SegmentedControl
      className={utilityClass || undefined}
      value={activeValue}
      onChange={setValue}
      size={config.size}
      fullWidth={config.fullWidth}
      labelMode={config.labelMode}
      options={options.map((opt) => ({
        value: opt.id,
        label: opt.label || 'Untitled',
        icon: opt.icon || undefined,
      }))}
    />
  )
}

function ItemEditor({ option, canRemove, onChange, onRemove }) {
  return (
    <Stack gap="sm">
      <Stack direction="row" justify="end">
        <IconButton
          icon="delete"
          variant="destructive"
          size="sm"
          aria-label="Remove option"
          disabled={!canRemove}
          onClick={onRemove}
        />
      </Stack>
      <TextField
        label="Label"
        size="compact"
        value={option.label ?? ''}
        onChange={(event) => onChange({ label: event.target.value })}
      />
      <Toggle
        label="Icon"
        value={!!option.icon}
        onChange={(checked) => onChange({ icon: checked ? (option.icon || 'star') : '' })}
      />
      {option.icon && (
        <IconSelect value={option.icon} onChange={(icon) => onChange({ icon })} />
      )}
    </Stack>
  )
}

export function Controls({ config, setConfig, activeItemIndex = null, onSelectItem }) {
  const options = normalizeOptions(config.options)
  const [activeId, setActiveId] = useState(options[0]?.id ?? '')
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  // The canvas drives the active tab when a segment is clicked there.
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
      <ConfigSlider prop="size" label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      <Choice prop="labelMode" label="Labels" value={config.labelMode} onChange={(labelMode) => set({ labelMode })} options={LABEL_MODE_OPTIONS} />
      <Toggle prop="fullWidth" label="Full width" value={config.fullWidth} onChange={(fullWidth) => set({ fullWidth })} />

      <Divider space="none" />

      {options.length > 0 ? (
        <div className="a1-web-item-tabs">
          <Tabs value={activeItemId} onChange={selectTab} variant="line" size="compact">
            <TabList>
              {options.map((option, i) => (
                <Tab key={option.id} value={option.id}>{tabLabel(option.label, i, options.length)}</Tab>
              ))}
            </TabList>
            {options.map((option) => (
              <TabPanel key={option.id} value={option.id}>
                <ItemEditor
                  option={option}
                  canRemove={options.length > 1}
                  onChange={(patch) => updateOption(option.id, patch)}
                  onRemove={() => removeOption(option.id)}
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

function optionSnippet(option) {
  const props = [
    `value: '${escapeJsString(option.id)}'`,
    `label: '${escapeJsString(option.label || 'Untitled')}'`,
    option.icon ? `icon: '${escapeJsString(option.icon)}'` : null,
  ].filter(Boolean).join(', ')
  return `    { ${props} },`
}

function buildSegmentedSnippet(config, utilityClass = '') {
  const options = normalizeOptions(config.options)
  const props = [
    utilityClass ? `className="${escapeJsString(utilityClass)}"` : null,
    `value={value}`,
    `onChange={setValue}`,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.labelMode !== 'all' ? `labelMode="${config.labelMode}"` : null,
    config.fullWidth ? 'fullWidth' : null,
  ].filter(Boolean).join(' ')

  return `<SegmentedControl ${props}
  options={[
${options.map(optionSnippet).join('\n')}
  ]}
/>`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSegmentedSnippet(config, utilityClass)}</Code>
}
