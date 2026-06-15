import {
  Accordion,
  Breadcrumb,
  Button,
  ChoiceGroup,
  Code,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'

const ITEM_BEHAVIOR_OPTIONS = ['link', 'button', 'static']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function createItem(label, behavior = 'link', href = '#') {
  return {
    id: `breadcrumb-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    behavior,
    href,
  }
}

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function normalizeItems(items) {
  return Array.isArray(items) && items.length > 0
    ? items
    : [createItem('Breadcrumb', 'static', '')]
}

function previewItems(config) {
  const items = normalizeItems(config.items)

  return items.map((item, index) => {
    const isLast = index === items.length - 1
    if (isLast || item.behavior === 'static') return { label: item.label || 'Untitled' }
    if (item.behavior === 'button') return { label: item.label || 'Untitled', onClick: () => {} }
    return { label: item.label || 'Untitled', href: item.href || '#' }
  })
}

function snippetItem(item, isLast) {
  const label = escapeJsString(item.label || 'Untitled')
  if (isLast || item.behavior === 'static') return `{ label: '${label}' }`
  if (item.behavior === 'button') return `{ label: '${label}', onClick: () => console.log('${label}') }`

  return `{ label: '${label}', href: '${escapeJsString(item.href || '#')}' }`
}

function buildBreadcrumbSnippet(config) {
  const items = normalizeItems(config.items)
  const itemLines = items
    .map((item, index) => `    ${snippetItem(item, index === items.length - 1)},`)
    .join('\n')
  const backLabelProp = config.backLabel && config.backLabel !== 'Back'
    ? `\n  backLabel="${escapeJsxString(config.backLabel)}"`
    : ''

  return `<Breadcrumb${backLabelProp}
  items={[
${itemLines}
  ]}
/>`
}

export function getDefaultConfig() {
  return {
    backLabel: 'Back',
    items: [
      { id: 'breadcrumb-home', label: 'Home', behavior: 'link', href: '/' },
      { id: 'breadcrumb-components', label: 'Components', behavior: 'link', href: '/components' },
      { id: 'breadcrumb-navigation', label: 'Navigation', behavior: 'button', href: '' },
      { id: 'breadcrumb-current', label: 'Breadcrumb', behavior: 'static', href: '' },
    ],
    openItems: ['breadcrumb-home'],
  }
}

export function Preview({ config }) {
  return (
    <Breadcrumb
      backLabel={config.backLabel || 'Back'}
      items={previewItems(config)}
    />
  )
}

export function Controls({ config, setConfig }) {
  const items = normalizeItems(config.items)
  const openItems = Array.isArray(config.openItems) ? config.openItems : []

  function updateItem(id, patch) {
    setConfig((current) => ({
      ...current,
      items: normalizeItems(current.items).map((item) => (
        item.id === id ? { ...item, ...patch } : item
      )),
    }))
  }

  function toggleItem(id, open) {
    setConfig((current) => {
      const currentOpenItems = Array.isArray(current.openItems) ? current.openItems : []

      return {
        ...current,
        openItems: open
          ? Array.from(new Set([...currentOpenItems, id]))
          : currentOpenItems.filter((itemId) => itemId !== id),
      }
    })
  }

  function removeItem(id) {
    setConfig((current) => {
      const nextItems = normalizeItems(current.items).filter((item) => item.id !== id)
      return {
        ...current,
        items: nextItems.length > 0 ? nextItems : normalizeItems(current.items),
        openItems: Array.isArray(current.openItems)
          ? current.openItems.filter((itemId) => itemId !== id)
          : [],
      }
    })
  }

  function addItem() {
    setConfig((current) => {
      const currentItems = normalizeItems(current.items)
      const nextItem = createItem(`Section ${currentItems.length}`, 'link', '#')
      const currentPage = currentItems[currentItems.length - 1]

      return {
        ...current,
        items: [
          ...currentItems.slice(0, -1),
          nextItem,
          currentPage,
        ],
        openItems: Array.from(new Set([...(current.openItems ?? []), nextItem.id])),
      }
    })
  }

  return (
    <Stack gap="lg">
      <TextField
        label="Back label"
        size="compact"
        value={config.backLabel}
        onChange={(event) => setConfig((current) => ({ ...current, backLabel: event.target.value }))}
      />

      <Stack gap="sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const label = item.label || 'Untitled item'

          return (
            <Accordion
              key={item.id}
              label={`${index + 1}. ${label}${isLast ? ' (current)' : ''}`}
              size="sm"
              open={openItems.includes(item.id)}
              onChange={(open) => toggleItem(item.id, open)}
            >
              <Stack gap="md">
                <TextField
                  label={isLast ? 'Current page label' : 'Label'}
                  size="compact"
                  value={item.label}
                  onChange={(event) => updateItem(item.id, { label: event.target.value })}
                />

                {!isLast && (
                  <ChoiceGroup
                    label="Behavior"
                    size="compact"
                    hideIndicator
                    columns={3}
                    value={item.behavior}
                    onChange={(behavior) => updateItem(item.id, { behavior })}
                    options={ITEM_BEHAVIOR_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
                  />
                )}

                {!isLast && item.behavior === 'link' && (
                  <TextField
                    label="Href"
                    size="compact"
                    value={item.href}
                    onChange={(event) => updateItem(item.id, { href: event.target.value })}
                  />
                )}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  icon="delete"
                  disabled={items.length <= 1}
                  onClick={() => removeItem(item.id)}
                >
                  Remove item
                </Button>
              </Stack>
            </Accordion>
          )
        })}
      </Stack>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
        Add item
      </Button>
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildBreadcrumbSnippet(config)}</Code>
}
