import {
  Button,
  Code,
  Divider,
  Heading,
  IconButton,
  Paragraph,
  Stack,
  TextField,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarMenu,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, FieldState } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

// Bare display: render the preview at full width without the centering Section, so
// `fullWidth` actually has room to fill (a centered Section shrinks it to content).
export const bareDisplay = true

const TYPE_OPTIONS = [
  { value: 'toggle', label: 'Toggle' },
  { value: 'button', label: 'Button' },
  { value: 'menu', label: 'Menu' },
  { value: 'group', label: 'Group' },
  { value: 'divider', label: 'Divider' },
]
const TYPE_LABELS = Object.fromEntries(TYPE_OPTIONS.map((o) => [o.value, o.label]))

// Material Symbols representing each tool type in the "Add tool" menu.
const ADD_ITEMS = [
  { value: 'toggle', label: 'Toggle', icon: 'toggle_on' },
  { value: 'button', label: 'Button', icon: 'smart_button' },
  { value: 'menu', label: 'Menu', icon: 'arrow_drop_down_circle' },
  { value: 'group', label: 'Group', icon: 'view_week' },
  { value: 'divider', label: 'Divider', icon: 'horizontal_rule' },
]

function uid() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function newTool(type) {
  const id = uid()
  switch (type) {
    case 'button': return { id, type, icon: 'add', label: 'Button' }
    case 'menu': return { id, type, icon: 'expand_more', label: 'Menu', value: '', items: [{ id: uid(), label: 'Item 1', icon: '' }] }
    case 'group': return { id, type, label: 'Group', value: '', options: [{ id: uid(), label: 'One', icon: '' }, { id: uid(), label: 'Two', icon: '' }] }
    case 'divider': return { id, type }
    case 'toggle':
    default: return { id, type: 'toggle', icon: 'star', label: 'Toggle' }
  }
}

// Change a tool's type, preserving label/icon and seeding items/options as needed.
function convertType(tool, type) {
  const base = { id: tool.id, type, label: tool.label, icon: tool.icon }
  if (type === 'divider') return { id: tool.id, type }
  if (type === 'menu') return { ...base, value: tool.value ?? '', items: tool.items ?? [{ id: uid(), label: 'Item 1', icon: '' }] }
  if (type === 'group') return { ...base, value: tool.value ?? '', options: tool.options ?? [{ id: uid(), label: 'One', icon: '' }, { id: uid(), label: 'Two', icon: '' }] }
  if (type === 'toggle') return { ...base, pressed: !!tool.pressed }
  return base // button
}

export function getDefaultConfig() {
  return {
    tools: [
      { id: 'bold', type: 'toggle', icon: 'format_bold', label: 'Bold', pressed: true },
      { id: 'italic', type: 'toggle', icon: 'format_italic', label: 'Italic' },
      { id: 'underline', type: 'toggle', icon: 'format_underlined', label: 'Underline' },
      { id: 'd1', type: 'divider' },
      { id: 'size', type: 'menu', icon: 'format_size', label: 'Size', value: 'md', items: [
        { id: 'sm', label: 'SM' }, { id: 'md', label: 'MD' }, { id: 'lg', label: 'LG' },
      ] },
      { id: 'd2', type: 'divider' },
      { id: 'align', type: 'group', label: 'Alignment', value: 'left', options: [
        { id: 'left', label: 'Left', icon: 'format_align_left' },
        { id: 'center', label: 'Center', icon: 'format_align_center' },
        { id: 'right', label: 'Right', icon: 'format_align_right' },
      ] },
      { id: 'link', type: 'button', icon: 'link', label: 'Insert link' },
    ],
    activeId: null,
    showToolbarLabel: false,
    label: 'Formatting',
    showLabels: false,
    overlay: false,
    fullWidth: false,
    disabled: false,
  }
}

// Map a configurator option list ({ id, label, icon }) to component options.
function toOptions(list) {
  return (list ?? []).map((o) => ({ value: o.id, label: o.label || o.id, icon: o.icon || undefined }))
}

// Render a single tool as its real A1 component. Each carries `data-tool-id` so a
// single capture handler on the canvas can select it, and the selected tool gets
// an outline class. The tools' own callbacks are no-ops here — the canvas is for
// selection, not live interaction.
function renderTool(tool, { showLabels, disabled, activeId }) {
  const className = tool.id === activeId ? 'a1-web-tool--selected' : undefined
  const dataId = tool.id
  switch (tool.type) {
    case 'divider':
      return <ToolbarDivider key={tool.id} data-tool-id={dataId} className={className} />
    case 'button':
      return <ToolbarButton key={tool.id} data-tool-id={dataId} className={className} icon={tool.icon || undefined} label={tool.label} showLabel={showLabels} disabled={disabled} onClick={() => {}} />
    case 'menu':
      return <ToolbarMenu key={tool.id} data-tool-id={dataId} className={className} aria-label={tool.label} icon={tool.icon || undefined} label={tool.label} value={tool.value} items={toOptions(tool.items)} showLabel={showLabels} disabled={disabled} onChange={() => {}} />
    case 'group':
      return <ToolbarGroup key={tool.id} data-tool-id={dataId} className={className} aria-label={tool.label} value={tool.value} options={toOptions(tool.options)} showLabels={showLabels} disabled={disabled} onChange={() => {}} />
    case 'toggle':
    default:
      return <ToolbarToggle key={tool.id} data-tool-id={dataId} className={className} icon={tool.icon || undefined} label={tool.label} showLabel={showLabels} pressed={!!tool.pressed} disabled={disabled} onChange={() => {}} />
  }
}

export function Preview({ config, setConfig }) {
  const { tools = [], activeId, showToolbarLabel, label, showLabels, overlay, fullWidth, disabled } = config
  const selectable = typeof setConfig === 'function'

  const onClickCapture = selectable
    ? (e) => {
        const el = e.target.closest('[data-tool-id]')
        if (!el) return
        e.preventDefault()
        e.stopPropagation()
        setConfig((c) => ({ ...c, activeId: el.getAttribute('data-tool-id') }))
      }
    : undefined

  const bar = (
    <div className="a1-web-toolbar-canvas" onClickCapture={onClickCapture}>
      <Toolbar
        aria-label="Toolbar"
        label={showToolbarLabel ? (label || 'Toolbar') : undefined}
        overlay={overlay}
        fullWidth={fullWidth}
      >
        {tools.map((tool) => renderTool(tool, { showLabels, disabled, activeId }))}
      </Toolbar>
    </div>
  )

  if (overlay) {
    return (
      <div className="a1-web-toolbar-overlay-demo">
        <Stack gap="sm">
          <Heading as="h3" size="sm">Tasting menu</Heading>
          <Paragraph>
            An overlay toolbar floats on its own elevated surface above page content. Click any tool
            in the bar to configure it in the panel.
          </Paragraph>
        </Stack>
        <div className="a1-web-toolbar-overlay-demo__bar">{bar}</div>
      </div>
    )
  }
  return <div style={{ padding: 'var(--base-spacing-16)' }}>{bar}</div>
}

function OptionListEditor({ label, options = [], onChange }) {
  const update = (i, patch) => onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)))
  const remove = (i) => onChange(options.filter((_, idx) => idx !== i))
  const add = () => onChange([...options, { id: uid(), label: `Item ${options.length + 1}`, icon: '' }])
  return (
    <Stack gap="sm">
      <Paragraph size="xs" color="muted">{label}</Paragraph>
      {options.map((o, i) => (
        <Stack key={o.id} gap="xs" className="a1-web-tool-option">
          <Stack direction="row" gap="xs" align="end">
            <div className="a1-web-field-grow">
              <TextField label="Label" size="compact" value={o.label ?? ''} onChange={(e) => update(i, { label: e.target.value })} />
            </div>
            <IconButton icon="delete" size="sm" variant="destructive" aria-label="Remove option" disabled={options.length <= 1} onClick={() => remove(i)} />
          </Stack>
          <IconSelect label="Icon" size="compact" value={o.icon || ''} onChange={(icon) => update(i, { icon })} />
        </Stack>
      ))}
      <Button variant="secondary" size="sm" icon="add" onClick={add}>Add</Button>
    </Stack>
  )
}

function ToolEditor({ tool, canMoveLeft, canMoveRight, onMove, onRemove, onChange }) {
  const hasText = tool.type === 'toggle' || tool.type === 'button' || tool.type === 'menu'
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs" justify="between" align="center">
        <Paragraph size="xs" color="muted">{TYPE_LABELS[tool.type]}</Paragraph>
        <Stack direction="row" gap="xs">
          <IconButton icon="chevron_left" size="sm" variant="tertiary" aria-label="Move left" disabled={!canMoveLeft} onClick={() => onMove(-1)} />
          <IconButton icon="chevron_right" size="sm" variant="tertiary" aria-label="Move right" disabled={!canMoveRight} onClick={() => onMove(1)} />
          <IconButton icon="delete" size="sm" variant="destructive" aria-label="Remove tool" onClick={onRemove} />
        </Stack>
      </Stack>

      <Choice label="Type" value={tool.type} onChange={(type) => onChange(convertType(tool, type))} options={TYPE_OPTIONS} />

      {tool.type === 'divider' && <Paragraph size="sm" color="muted">A divider has no options.</Paragraph>}

      {hasText && (
        <TextField label="Label" size="compact" value={tool.label ?? ''} onChange={(e) => onChange({ label: e.target.value })} />
      )}
      {hasText && (
        <IconSelect label="Icon" size="compact" value={tool.icon || ''} onChange={(icon) => onChange({ icon })} />
      )}
      {tool.type === 'group' && (
        <TextField label="Accessible name" size="compact" value={tool.label ?? ''} onChange={(e) => onChange({ label: e.target.value })} />
      )}

      {tool.type === 'menu' && (
        <OptionListEditor label="Menu items" options={tool.items} onChange={(items) => onChange({ items })} />
      )}
      {tool.type === 'group' && (
        <OptionListEditor label="Options" options={tool.options} onChange={(options) => onChange({ options })} />
      )}
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const tools = config.tools ?? []
  const activeIndex = tools.findIndex((t) => t.id === config.activeId)
  const active = activeIndex >= 0 ? tools[activeIndex] : null

  const updateTool = (id, patch) => set({ tools: tools.map((t) => (t.id === id ? { ...t, ...patch } : t)) })
  const removeTool = (id) => {
    const idx = tools.findIndex((t) => t.id === id)
    const nextActive = tools[idx + 1]?.id ?? tools[idx - 1]?.id ?? null
    set({ tools: tools.filter((t) => t.id !== id), activeId: nextActive })
  }
  const moveTool = (id, dir) => {
    const idx = tools.findIndex((t) => t.id === id)
    const j = idx + dir
    if (idx < 0 || j < 0 || j >= tools.length) return
    const next = [...tools]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    set({ tools: next })
  }
  const addTool = (type) => {
    const tool = newTool(type)
    set({ tools: [...tools, tool], activeId: tool.id })
  }

  return (
    <Stack gap="lg">
      <FieldState
        label="Toolbar"
        items={[
          { key: 'showLabels', label: 'Tool labels', icon: 'text_fields', value: config.showLabels },
          { key: 'fullWidth', label: 'Full width', icon: 'width_full', value: config.fullWidth },
          { key: 'overlay', label: 'Overlay', icon: 'layers', value: config.overlay },
          { key: 'disabled', label: 'Disabled', icon: 'block', value: config.disabled },
        ]}
        onChange={set}
      />
      <Toggle label="Toolbar label" value={config.showToolbarLabel} onChange={(showToolbarLabel) => set({ showToolbarLabel })} />
      {config.showToolbarLabel && (
        <TextField label="Label text" size="compact" value={config.label} onChange={(e) => set({ label: e.target.value })} />
      )}

      <Divider space="none" />

      <Stack gap="sm">
        <Stack direction="row" align="center" justify="between">
          <Paragraph size="sm" color="muted">{active ? 'Selected tool' : 'Tools'}</Paragraph>
          <ToolbarMenu aria-label="Add tool" icon="add" label="Add" showLabel value="" onChange={addTool} items={ADD_ITEMS} />
        </Stack>
        {active ? (
          <ToolEditor
            tool={active}
            canMoveLeft={activeIndex > 0}
            canMoveRight={activeIndex < tools.length - 1}
            onMove={(dir) => moveTool(active.id, dir)}
            onRemove={() => removeTool(active.id)}
            onChange={(patch) => updateTool(active.id, patch)}
          />
        ) : (
          <Paragraph size="sm" color="muted">Click a tool in the preview to edit it.</Paragraph>
        )}
      </Stack>
    </Stack>
  )
}

function serializeOptions(list) {
  const rows = (list ?? []).map((o) => {
    const parts = [`value: '${o.id}'`, `label: '${String(o.label ?? '').replaceAll("'", "\\'")}'`]
    if (o.icon) parts.push(`icon: '${o.icon}'`)
    return `      { ${parts.join(', ')} }`
  }).join(',\n')
  return `[\n${rows},\n    ]`
}

function toolSnippet(tool, showLabels) {
  const sl = showLabels ? ' showLabel' : ''
  const icon = tool.icon ? ` icon="${tool.icon}"` : ''
  const label = tool.label ? ` label="${String(tool.label).replaceAll('"', '&quot;')}"` : ''
  switch (tool.type) {
    case 'divider': return '<ToolbarDivider />'
    case 'button': return `<ToolbarButton${icon}${label}${sl} onClick={handleClick} />`
    case 'menu': return `<ToolbarMenu${icon}${label} value={value} onChange={setValue}${sl} items={${serializeOptions(tool.items)}} />`
    case 'group': return `<ToolbarGroup aria-label="${String(tool.label ?? '').replaceAll('"', '&quot;')}" value={value} onChange={setValue}${showLabels ? ' showLabels' : ''} options={${serializeOptions(tool.options)}} />`
    case 'toggle':
    default: return `<ToolbarToggle${icon}${label}${sl} pressed={pressed} onChange={setPressed} />`
  }
}

function buildToolbarSnippet(config) {
  const { tools = [], showToolbarLabel, label, showLabels, overlay, fullWidth } = config
  const attrs = [
    'aria-label="Toolbar"',
    showToolbarLabel && label ? `label="${String(label).replaceAll('"', '&quot;')}"` : null,
    overlay ? 'overlay' : null,
    fullWidth ? 'fullWidth' : null,
  ].filter(Boolean).join(' ')
  const body = tools.map((t) => toolSnippet(t, showLabels)).join('\n  ')
  return `<Toolbar ${attrs}>\n  ${body}\n</Toolbar>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildToolbarSnippet(config)}</Code>
}
