import {
  Accordion,
  Button,
  Code,
  Divider,
  SideNav,
  SideNavItem,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

// SideNav is a layout shell that owns its own surface, border, and full height —
// it is never placed inside a Section. The detail page reads `bareDisplay` to
// render the preview directly and to hide the Section-related Display controls.
export const bareDisplay = true

const PLACEMENT_OPTIONS = ['start', 'end']
const COLLAPSE_BUTTON_OPTIONS = ['header', 'footer']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

function createItem(label, icon = 'chevron_right') {
  return {
    id: `side-nav-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    icon,
    badge: '',
    active: false,
  }
}

function normalizeItems(items) {
  return Array.isArray(items) && items.length > 0
    ? items
    : [createItem('Dashboard', 'dashboard')]
}

export function getDefaultConfig() {
  return {
    header: 'A1 Console',
    placement: 'start',
    collapsed: false,
    collapseButtonPlacement: 'header',
    footerLabel: 'Sign out',
    footerIcon: 'logout',
    items: [
      { id: 'side-nav-dashboard', label: 'Dashboard', icon: 'dashboard', badge: '', active: true },
      { id: 'side-nav-projects', label: 'Projects', icon: 'folder', badge: '4', active: false },
      { id: 'side-nav-team', label: 'Team', icon: 'group', badge: '', active: false },
      { id: 'side-nav-settings', label: 'Settings', icon: 'settings', badge: '', active: false },
    ],
    openItems: ['side-nav-dashboard'],
  }
}

export function Preview({ config }) {
  const items = normalizeItems(config.items)

  return (
    <div className={`a1-web-side-nav-preview a1-web-side-nav-preview--${config.placement}`}>
      <SideNav
        placement={config.placement}
        collapsed={config.collapsed}
        collapseButtonPlacement={config.collapseButtonPlacement}
        header={config.header ? <strong>{config.header}</strong> : undefined}
        footer={config.footerLabel
          ? <SideNavItem icon={config.footerIcon || undefined} label={config.footerLabel} />
          : undefined}
      >
        {items.map((item) => (
          <SideNavItem
            key={item.id}
            icon={item.icon || undefined}
            label={item.label || 'Untitled'}
            badge={item.badge || undefined}
            active={item.active}
          />
        ))}
      </SideNav>
    </div>
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
      const nextItem = createItem(`Item ${currentItems.length + 1}`)
      return {
        ...current,
        items: [...currentItems, nextItem],
        openItems: Array.from(new Set([...(current.openItems ?? []), nextItem.id])),
      }
    })
  }

  return (
    <Stack gap="lg">
      <TextField
        label="Header"
        hint="Leave empty to hide the header."
        size="compact"
        value={config.header}
        onChange={(event) => setConfig((current) => ({ ...current, header: event.target.value }))}
      />
      <Choice
        label="Placement"
        size="compact"
        hideIndicator
        columns={2}
        value={config.placement}
        onChange={(placement) => setConfig((current) => ({ ...current, placement }))}
        options={PLACEMENT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Choice
        label="Collapse button"
        size="compact"
        hideIndicator
        columns={2}
        value={config.collapseButtonPlacement}
        onChange={(collapseButtonPlacement) => setConfig((current) => ({ ...current, collapseButtonPlacement }))}
        options={COLLAPSE_BUTTON_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle label="Collapsed" value={config.collapsed} onChange={(collapsed) => setConfig((current) => ({ ...current, collapsed }))} />
      <Stack gap="sm">
        {items.map((item, index) => {
          const label = item.label || 'Untitled item'
          return (
            <Accordion
              key={item.id}
              label={`${index + 1}. ${label}${item.active ? ' (active)' : ''}`}
              size="sm"
              open={openItems.includes(item.id)}
              onChange={(open) => toggleItem(item.id, open)}
            >
              <Stack gap="md">
                <TextField
                  label="Label"
                  size="compact"
                  value={item.label}
                  onChange={(event) => updateItem(item.id, { label: event.target.value })}
                />

                <Toggle
                  label="Icon"
                  value={!!item.icon}
                  onChange={(checked) => updateItem(item.id, { icon: checked ? (item.icon || 'chevron_right') : '' })}
                />

                {item.icon && (
                  <IconSelect
                    value={item.icon}
                    onChange={(icon) => updateItem(item.id, { icon })}
                  />
                )}

                <TextField
                  label="Badge"
                  size="compact"
                  value={item.badge}
                  onChange={(event) => updateItem(item.id, { badge: event.target.value })}
                />

                <Toggle label="Active" value={item.active} onChange={(active) => updateItem(item.id, { active })} />

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

      <Divider />

      <Accordion label="Footer" size="sm" defaultOpen={false}>
        <Stack gap="md">
          <TextField
            label="Label"
            hint="Leave empty to hide the footer."
            size="compact"
            value={config.footerLabel}
            onChange={(event) => setConfig((current) => ({ ...current, footerLabel: event.target.value }))}
          />
          {config.footerLabel && (
            <>
              <Toggle
                label="Icon"
                value={!!config.footerIcon}
                onChange={(checked) => setConfig((current) => ({ ...current, footerIcon: checked ? (current.footerIcon || 'logout') : '' }))}
              />
              {config.footerIcon && (
                <IconSelect
                  value={config.footerIcon}
                  onChange={(footerIcon) => setConfig((current) => ({ ...current, footerIcon }))}
                />
              )}
            </>
          )}
        </Stack>
      </Accordion>
    </Stack>
  )
}

function propLine(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `  ${name}="${value}"`
}

function snippetItem(item) {
  const props = [
    item.icon ? `icon="${escapeJsString(item.icon)}"` : null,
    `label="${escapeJsString(item.label || 'Untitled')}"`,
    item.badge ? `badge="${escapeJsString(item.badge)}"` : null,
    item.active ? 'active' : null,
  ].filter(Boolean).join(' ')
  return `  <SideNavItem ${props} />`
}

function buildSideNavSnippet(config) {
  const items = normalizeItems(config.items)
  const props = [
    propLine('placement', config.placement, 'start'),
    config.collapsed ? '  collapsed' : null,
    propLine('collapseButtonPlacement', config.collapseButtonPlacement, 'header'),
    config.header ? `  header={<strong>${escapeJsString(config.header)}</strong>}` : null,
    config.footerLabel
      ? `  footer={<SideNavItem ${config.footerIcon ? `icon="${escapeJsString(config.footerIcon)}" ` : ''}label="${escapeJsString(config.footerLabel)}" />}`
      : null,
  ].filter(Boolean).join('\n')

  const itemLines = items.map(snippetItem).join('\n')

  return `<SideNav
${props}
>
${itemLines}
</SideNav>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSideNavSnippet(config)}</Code>
}
