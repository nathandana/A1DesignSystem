import { useState } from 'react'
import {
  Chip,
  ChipGroup,
  Code,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Button,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['sm', 'md', 'lg']
const BEHAVIOR_OPTIONS = [
  { value: 'multiple', label: 'Multiple' },
  { value: 'single', label: 'Single' },
  { value: 'menu', label: 'Menu' },
  { value: 'navigation', label: 'Navigation' },
]

function uid() {
  return `chip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

function createItem(label) {
  return {
    id: uid(),
    title: label,
    icon: '',
    href: '#',
  }
}

function normalizeItems(items) {
  return Array.isArray(items) && items.length > 0
    ? items
    : [createItem('Design')]
}

function tabLabel(label, index, total) {
  const text = (label ?? '').trim() || `${index + 1}`
  if (total <= 4) return text
  return text.length > 4 ? `${text.slice(0, 4)}...` : text
}

export function getDefaultConfig() {
  return {
    behavior: 'multiple',
    size: 'md',
    wrap: true,
    items: [
      { id: 'chip-design', title: 'Design', icon: 'palette', href: '#design' },
      { id: 'chip-code', title: 'Code', icon: 'code', href: '#code' },
      { id: 'chip-docs', title: 'Docs', icon: 'article', href: '#docs' },
      { id: 'chip-release', title: 'Release', icon: 'rocket_launch', href: '#release' },
    ],
  }
}

export function Preview({ config, utilityClass = '' }) {
  const items = normalizeItems(config.items)
  const selectionMode = config.behavior === 'single' ? 'single' : config.behavior === 'multiple' ? 'multiple' : 'none'
  const initialValue = config.behavior === 'multiple'
    ? [items[0]?.id].filter(Boolean)
    : items[0]?.id ?? ''
  const [value, setValue] = useState(initialValue)

  if (config.behavior === 'menu') {
    return (
      <ChipGroup className={utilityClass || undefined} wrap={config.wrap} size={config.size} selectionMode="none">
        <Chip
          icon="filter_list"
          selected
          menuLabel="Filter by category"
          menu={({ close }) => (
            <>
              {items.map((item) => (
                <MenuItem key={item.id} icon={item.icon || undefined} onClick={close}>
                  {item.title || 'Untitled'}
                </MenuItem>
              ))}
            </>
          )}
        >
          Filter
        </Chip>
      </ChipGroup>
    )
  }

  return (
    <ChipGroup
      className={utilityClass || undefined}
      selectionMode={selectionMode}
      value={value}
      onChange={setValue}
      wrap={config.wrap}
      size={config.size}
    >
      {items.map((item) => (
        <Chip
          key={item.id}
          value={item.id}
          icon={item.icon || undefined}
          as={config.behavior === 'navigation' ? 'a' : undefined}
          href={config.behavior === 'navigation' ? (item.href || '#') : undefined}
        >
          {item.title || 'Untitled'}
        </Chip>
      ))}
    </ChipGroup>
  )
}

function ItemEditor({ item, canRemove, behavior, onChange, onRemove }) {
  return (
    <Stack gap="sm">
      <Stack direction="row" justify="end">
        <IconButton
          icon="delete"
          variant="destructive"
          size="sm"
          aria-label="Remove chip"
          disabled={!canRemove}
          onClick={onRemove}
        />
      </Stack>
      <TextField
        label="Title"
        size="compact"
        value={item.title ?? ''}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <Toggle
        label="Icon"
        value={!!item.icon}
        onChange={(checked) => onChange({ icon: checked ? (item.icon || 'star') : '' })}
      />
      {item.icon && (
        <IconSelect value={item.icon} onChange={(icon) => onChange({ icon })} />
      )}
      {behavior === 'navigation' && (
        <TextField
          label="Href"
          size="compact"
          value={item.href ?? ''}
          onChange={(event) => onChange({ href: event.target.value })}
        />
      )}
    </Stack>
  )
}

export function Controls({ config, setConfig, activeItemIndex = null, onSelectItem }) {
  const items = normalizeItems(config.items)
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const externalId = activeItemIndex != null ? items[activeItemIndex]?.id : null
  const activeItemId = items.some((item) => item.id === (externalId ?? activeId)) ? (externalId ?? activeId) : (items[0]?.id ?? '')

  function selectTab(id) {
    setActiveId(id)
    const idx = items.findIndex((item) => item.id === id)
    if (idx >= 0) onSelectItem?.(idx)
  }

  function updateItem(id, patch) {
    setConfig((current) => ({
      ...current,
      items: normalizeItems(current.items).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  function removeItem(id) {
    const idx = items.findIndex((item) => item.id === id)
    const next = items[idx + 1]?.id ?? items[idx - 1]?.id ?? ''
    setConfig((current) => {
      const filtered = normalizeItems(current.items).filter((item) => item.id !== id)
      return { ...current, items: filtered.length > 0 ? filtered : normalizeItems(current.items) }
    })
    setActiveId(next)
  }

  function addItem() {
    const item = createItem(`Chip ${items.length + 1}`)
    setConfig((current) => ({ ...current, items: [...normalizeItems(current.items), item] }))
    setActiveId(item.id)
    onSelectItem?.(items.length)
  }

  return (
    <Stack gap="lg">
      <Choice prop="behavior" label="Behavior" value={config.behavior} onChange={(behavior) => set({ behavior })} options={BEHAVIOR_OPTIONS} />
      <ConfigSlider prop="size" label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      <Toggle prop="wrap" label="Wrap" value={config.wrap} onChange={(wrap) => set({ wrap })} />

      <Divider space="none" />

      <div className="a1-web-item-tabs">
        <Tabs value={activeItemId} onChange={selectTab} variant="line" size="compact">
          <TabList>
            {items.map((item, index) => (
              <Tab key={item.id} value={item.id}>{tabLabel(item.title, index, items.length)}</Tab>
            ))}
          </TabList>
          {items.map((item) => (
            <TabPanel key={item.id} value={item.id}>
              <ItemEditor
                item={item}
                behavior={config.behavior}
                canRemove={items.length > 1}
                onChange={(patch) => updateItem(item.id, patch)}
                onRemove={() => removeItem(item.id)}
              />
            </TabPanel>
          ))}
        </Tabs>
      </div>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
        Add chip
      </Button>
    </Stack>
  )
}

function itemSnippet(item, behavior) {
  const props = [
    `value="${escapeJsString(item.id)}"`,
    item.icon ? `icon="${escapeJsString(item.icon)}"` : null,
    behavior === 'navigation' ? 'as="a"' : null,
    behavior === 'navigation' ? `href="${escapeJsString(item.href || '#')}"` : null,
  ].filter(Boolean).join(' ')
  return `  <Chip ${props}>${escapeJsString(item.title || 'Untitled')}</Chip>`
}

function buildSnippet(config, utilityClass = '') {
  const items = normalizeItems(config.items)
  if (config.behavior === 'menu') {
    return `<ChipGroup${utilityClass ? ` className="${escapeJsString(utilityClass)}"` : ''} selectionMode="none"${config.wrap === false ? ' wrap={false}' : ''}${config.size !== 'md' ? ` size="${config.size}"` : ''}>
  <Chip
    icon="filter_list"
    selected
    menuLabel="Filter by category"
    menu={({ close }) => (
      <>
${items.map((item) => `        <MenuItem${item.icon ? ` icon="${escapeJsString(item.icon)}"` : ''} onClick={close}>${escapeJsString(item.title || 'Untitled')}</MenuItem>`).join('\n')}
      </>
    )}
  >
    Filter
  </Chip>
</ChipGroup>`
  }

  const selectionMode = config.behavior === 'single' ? 'single' : config.behavior === 'multiple' ? 'multiple' : 'none'
  return `<ChipGroup${utilityClass ? ` className="${escapeJsString(utilityClass)}"` : ''} selectionMode="${selectionMode}" value={value} onChange={setValue}${config.wrap === false ? ' wrap={false}' : ''}${config.size !== 'md' ? ` size="${config.size}"` : ''}>
${items.map((item) => itemSnippet(item, config.behavior)).join('\n')}
</ChipGroup>`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
