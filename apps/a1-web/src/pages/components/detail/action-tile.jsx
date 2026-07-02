import { useRef, useEffect, useState } from 'react'
import {
  ActionTile,
  ActionTiles,
  Button,
  Code,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuSection,
  Paragraph,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Toolbar,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, ResponsiveControl } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'

function uid() {
  return `tile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function tabLabel(label, index, total) {
  const text = (label ?? '').trim() || `${index + 1}`
  if (total <= 4) return text
  return text.length > 5 ? `${text.slice(0, 5)}…` : text
}

const LAYOUT_OPTIONS = [
  { value: 'grid', label: 'Grid', icon: 'grid_view' },
  { value: 'stack', label: 'Stack', icon: 'view_agenda' },
]
const COLUMN_OPTIONS = [1, 2, 3, 4, 5, 6]
const ICON_LAYOUT_OPTIONS = [
  { value: 'auto', label: 'Auto', icon: 'responsive_layout' },
  { value: 'top', label: 'Top', icon: 'vertical_align_top' },
  { value: 'side', label: 'Side', icon: 'left_panel_open' },
  { value: 'none', label: 'None', icon: 'block' },
]
const INTERACTION_OPTIONS = [
  { value: 'static', label: 'Static', icon: 'crop_square' },
  { value: 'interactive', label: 'Interactive', icon: 'ads_click' },
]
const ACCESSORY_OPTIONS = [
  { value: 'none', label: 'None', icon: 'block' },
  { value: 'switch', label: 'Switch', icon: 'toggle_on' },
  { value: 'menu', label: 'Menu', icon: 'more_horiz' },
  { value: 'icon-button', label: 'Icon button', icon: 'more_horiz' },
  { value: 'button', label: 'Button', icon: 'smart_button' },
]
const FOOTER_OPTIONS = [
  { value: 'none', label: 'None', icon: 'block' },
  { value: 'single', label: 'One action', icon: 'smart_button' },
  { value: 'dual', label: 'Two actions', icon: 'buttons_alt' },
]

function createTile(overrides) {
  return {
    id: uid(),
    icon: 'bolt',
    title: 'New tile',
    subtitle: '',
    accessoryKind: 'none',
    switchOn: true,
    footerMode: 'none',
    ...overrides,
  }
}

function propString(name, value, defaultValue) {
  if (value == null || value === '' || value === defaultValue) return null
  return `${name}="${String(value).replaceAll('"', '&quot;')}"`
}

function columnsProp(columns) {
  if (columns == null) return null
  if (columns && typeof columns === 'object') {
    const entries = ['xs', 'sm', 'md', 'lg', 'xl']
      .filter((key) => columns[key] !== undefined)
      .map((key) => `${key}: ${columns[key]}`)
    return entries.length ? `columns={{ ${entries.join(', ')} }}` : null
  }
  return `columns={${columns}}`
}

const ACCESSORY_MENU_ITEMS = [
  { value: 'edit', label: 'Edit', icon: 'edit' },
  { value: 'duplicate', label: 'Duplicate', icon: 'content_copy' },
  { value: 'archive', label: 'Archive', icon: 'archive' },
]

function AccessoryMenu({ item, onChange }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const close = () => setOpen(false)

  return (
    <>
      <span ref={buttonRef}>
        <IconButton
          icon="more_horiz"
          label={`${item.title || 'Tile'} actions`}
          onClick={() => setOpen((value) => !value)}
        />
      </span>
      <Menu open={open} onClose={close} anchorRef={buttonRef} aria-label={`${item.title || 'Tile'} actions`}>
        <MenuSection>
          {ACCESSORY_MENU_ITEMS.map((action) => (
            <MenuItem
              key={action.value}
              icon={action.icon}
              active={item.menuValue === action.value}
              onClick={() => {
                onChange?.({ menuValue: action.value })
                close()
              }}
            >
              {action.label}
            </MenuItem>
          ))}
        </MenuSection>
      </Menu>
    </>
  )
}

function renderAccessory(item, onChange) {
  switch (item.accessoryKind) {
    case 'menu':
      return <AccessoryMenu item={item} onChange={onChange} />
    case 'icon-button':
      return <IconButton icon="more_horiz" label="More actions" />
    case 'button':
      return <Button size="sm" variant="secondary">Open</Button>
    case 'none':
      return undefined
    default:
      return (
        <Switch
          checked={item.switchOn}
          aria-label={`${item.title || 'Tile'} setting enabled`}
          onChange={(switchOn) => onChange?.({ switchOn })}
        />
      )
  }
}

function accessorySnippet(item) {
  switch (item.accessoryKind) {
    case 'menu':
      return `<IconButton icon="more_horiz" label="More actions" onClick={openMenu} />`
    case 'icon-button':
      return '<IconButton icon="more_horiz" label="More actions" />'
    case 'button':
      return '<Button size="sm" variant="secondary">Open</Button>'
    case 'none':
      return null
    default:
      return `<Switch${item.switchOn ? ' checked' : ''} aria-label="Tile setting enabled" />`
  }
}

function footerSnippet(item) {
  if (item.footerMode === 'dual') {
    return `<>
  <Button size="sm" variant="secondary">Open</Button>
  <Button size="sm" variant="secondary">Manage</Button>
</>`
  }
  if (item.footerMode === 'single') return '<Button size="sm" variant="secondary">Open</Button>'
  return null
}

function hasFooter(item) {
  return item.footerMode && item.footerMode !== 'none'
}

function hasAccessory(item) {
  return item.accessoryKind && item.accessoryKind !== 'none'
}

function buildSnippet(config, utilityClass = '') {
  const children = config.items.map((item) => {
    const props = [
      config.interactive ? 'as="button"' : null,
      config.iconLayout !== 'none' && item.icon ? propString('icon', item.icon) : null,
      propString('title', item.title),
      propString('subtitle', item.subtitle),
      !config.interactive && hasAccessory(item) ? `accessory={${accessorySnippet(item)}}` : null,
      !config.interactive && hasFooter(item) ? `footer={${footerSnippet(item)}}` : null,
    ].filter(Boolean).join(' ')

    return `  <ActionTile${props ? ` ${props}` : ''} />`
  }).join('\n')

  const props = [
    utilityClass ? `className="${utilityClass.replaceAll('"', '&quot;')}"` : null,
    config.layout !== 'grid' ? propString('layout', config.layout) : null,
    config.gap === false ? 'gap={false}' : null,
    config.iconLayout !== 'auto' ? propString('iconLayout', config.iconLayout) : null,
    config.layout === 'grid' ? columnsProp(config.columns) : null,
  ].filter(Boolean)

  const openTag = props.length ? `<ActionTiles\n  ${props.join('\n  ')}\n>` : '<ActionTiles>'

  return `${openTag}
${children}
</ActionTiles>`
}

export function getDefaultConfig() {
  return {
    layout: 'grid',
    columns: 3,
    gap: true,
    iconLayout: 'top',
    interactive: true,
    items: [
      createTile({ icon: 'palette', title: 'Patterns' }),
      createTile({ icon: 'imagesmode', title: 'Image library' }),
      createTile({ icon: 'bolt', title: 'Quick actions' }),
    ],
  }
}

export function Preview({ config, setConfig, utilityClass = '' }) {
  const updateItem = (id, patch) => {
    if (typeof setConfig !== 'function') return
    setConfig((current) => ({
      ...current,
      items: (current.items ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  return (
    <ActionTiles
      className={utilityClass || undefined}
      layout={config.layout}
      columns={config.layout === 'grid' ? config.columns : undefined}
      gap={config.gap}
      iconLayout={config.iconLayout}
    >
      {config.items.map((item) => (
        <ActionTile
          key={item.id}
          as={config.interactive ? 'button' : undefined}
          icon={config.iconLayout !== 'none' ? (item.icon || undefined) : undefined}
          title={item.title}
          subtitle={item.subtitle}
          accessory={!config.interactive && hasAccessory(item) ? renderAccessory(item, (patch) => updateItem(item.id, patch)) : undefined}
          footer={
            !config.interactive && hasFooter(item)
              ? (
                  <>
                    <Button size="sm" variant="secondary">Open</Button>
                    {item.footerMode === 'dual' && <Button size="sm" variant="secondary">Manage</Button>}
                  </>
                )
              : undefined
          }
        />
      ))}
    </ActionTiles>
  )
}

function TileEditor({ item, onChange, onRemove }) {
  return (
    <Stack gap="sm">
      <Stack direction="row" justify="end">
        <IconButton
          icon="delete"
          variant="destructive"
          size="sm"
          label="Remove tile"
          onClick={onRemove}
        />
      </Stack>
      <TextField
        label="Title"
        size="compact"
        value={item.title ?? ''}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextField
        label="Subtitle"
        size="compact"
        value={item.subtitle ?? ''}
        onChange={(event) => onChange({ subtitle: event.target.value })}
      />
      <IconSelect
        label="Icon"
        value={item.icon}
        onChange={(icon) => onChange({ icon })}
      />
      <Choice
        prop="accessoryKind"
        label="Accessory"
        value={item.accessoryKind}
        onChange={(accessoryKind) => onChange({ accessoryKind })}
        options={ACCESSORY_OPTIONS}
        iconOnly
        labelMode="selected"
      />
      <Choice
        prop="footerMode"
        label="Footer"
        value={item.footerMode}
        onChange={(footerMode) => onChange({ footerMode })}
        options={FOOTER_OPTIONS}
        iconOnly
        labelMode="selected"
      />
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  const [activeId, setActiveId] = useState(config.items[0]?.id ?? '')

  useEffect(() => {
    if (!config.items.some((item) => item.id === activeId)) {
      setActiveId(config.items[0]?.id ?? '')
    }
  }, [config.items, activeId])

  function updateItem(id, patch) {
    setConfig((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  function removeItem(id) {
    const index = config.items.findIndex((item) => item.id === id)
    const next = config.items[index + 1]?.id ?? config.items[index - 1]?.id ?? ''
    setConfig((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }))
    setActiveId(next)
  }

  function addItem() {
    const id = uid()
    setConfig((current) => ({
      ...current,
      items: [
        ...current.items,
        createTile({
          id,
          title: 'New tile',
          subtitle: 'Describe the action here.',
        }),
      ],
    }))
    setActiveId(id)
  }

  const activeItemId = config.items.some((item) => item.id === activeId) ? activeId : (config.items[0]?.id ?? '')

  return (
    <Stack gap="lg">
      <Toolbar label="Layout">
        <ToolbarGroup
          aria-label="Layout"
          value={config.layout}
          onChange={(layout) => setConfig((current) => ({ ...current, layout }))}
          options={LAYOUT_OPTIONS}
        />
        <ToolbarToggle
          icon="space_bar"
          label="Gap"
          pressed={config.gap}
          onChange={(gap) => setConfig((current) => ({ ...current, gap }))}
        />
      </Toolbar>
      {config.layout === 'grid' && (
        <ResponsiveControl
          prop="columns"
          label="Columns"
          value={config.columns}
          onChange={(columns) => setConfig((current) => ({ ...current, columns }))}
          defaultValue={3}
        >
          {(value, onChange) => (
            <Choice
              value={value}
              onChange={(next) => onChange(Number(next))}
              options={COLUMN_OPTIONS.map((option) => ({ value: option, label: String(option) }))}
            />
          )}
        </ResponsiveControl>
      )}
      <Choice
        prop="iconLayout"
        label="Icon layout"
        value={config.iconLayout}
        onChange={(iconLayout) => setConfig((current) => ({ ...current, iconLayout }))}
        options={ICON_LAYOUT_OPTIONS}
        iconOnly
        labelMode="selected"
      />
      <Choice
        prop="interactive"
        label="Interaction"
        value={config.interactive ? 'interactive' : 'static'}
        onChange={(value) => setConfig((current) => ({ ...current, interactive: value === 'interactive' }))}
        options={INTERACTION_OPTIONS}
      />
      {config.interactive && (
        <Paragraph size="xs" color="muted">
          Interactive tiles cannot include nested interactive elements. Accessory controls and footer actions are removed automatically.
        </Paragraph>
      )}

      <Divider space="none" />

      {config.items.length > 0 ? (
        <div className="a1-web-item-tabs">
          <Tabs value={activeItemId} onChange={setActiveId} variant="line" size="compact">
            <TabList>
              {config.items.map((item, index) => (
                <Tab key={item.id} value={item.id}>{tabLabel(item.title, index, config.items.length)}</Tab>
              ))}
            </TabList>
            {config.items.map((item) => (
              <TabPanel key={item.id} value={item.id}>
                <TileEditor
                  item={item}
                  onChange={(patch) => updateItem(item.id, patch)}
                  onRemove={() => removeItem(item.id)}
                />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      ) : (
        <Paragraph size="sm" color="muted">No tiles. Add one below.</Paragraph>
      )}

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
        Add tile
      </Button>
    </Stack>
  )
}

export function Snippet({ config, utilityClass }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
