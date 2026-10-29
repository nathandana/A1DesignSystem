import {
  Accordion,
  Button,
  Code,
  Divider,
  IconButton,
  PageTitle,
  Paragraph,
  Stack,
  TextField,
  normalizePageTitleActions,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider, WithHelp, statusOptions } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'
import { SlotPlaceholder } from '../../../editor/SlotPlaceholder.jsx'
import { RenderNode } from '../../../editor/pageRenderer.tsx'
import { nodeToJsx } from '../../../editor/definitionToJsx.ts'
import { patternConfigNode, patternActionFromNode, patternActionToNode } from '../../../editor/patternConfig.js'
import { PATTERN_AREAS } from '../../../editor/patternAreas.ts'

// The configurator owns the pattern's surface, so the detail page renders it
// without the usual Section wrapper and the band spans the full preview width.
export const bareDisplay = true
export const jsonType = 'PageTitle'
export const acceptsJsonChildren = true
// The pattern's areas, from the pattern-area registry: shown as dashed outlines
// in the configurator preview (toggle in the display toolbar) and shipped as
// Slot children of the editor's default node. The Actions zone shows its rule
// sentence; the open Content area shows what it is for.
const PAGE_TITLE_AREAS = PATTERN_AREAS.PageTitle
const ACTIONS_ZONE = PAGE_TITLE_AREAS.find((area) => area.id === 'actions').zone
export const editableAreas = PAGE_TITLE_AREAS.map((area) => ({
  id: area.id,
  label: area.label,
  hint: area.zone ? area.zone.rules : area.hint,
  zone: !!area.zone,
}))

// Patterns are minimally configurable: Page title exposes its content and the
// content width. Surface, title scale and heading level are locked by the
// pattern, and the action rule (one primary, always last) is enforced by it.
const CONTENT_WIDTH_VALUES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
// Action kinds and variants, each with its own icon so the type toolbars read at a glance.
const ACTION_KIND_OPTIONS = [
  { value: 'button', label: 'Button', icon: 'smart_button' },
  { value: 'link', label: 'Link', icon: 'link' },
  { value: 'icon-button', label: 'Icon button', icon: 'radio_button_checked' },
]
const VARIANT_OPTIONS = [
  { value: 'primary', label: 'Primary', icon: 'bolt' },
  { value: 'secondary', label: 'Secondary', icon: 'crop_square' },
  { value: 'tertiary', label: 'Tertiary', icon: 'text_fields' },
  { value: 'destructive', label: 'Destructive', icon: 'delete' },
  { value: 'success', label: 'Success', icon: 'check_circle' },
]
const ICON_BUTTON_VARIANTS = ['tertiary', 'secondary', 'destructive', 'success']
const BADGE_STATUSES = ['neutral', 'info', 'success', 'warn', 'error']
const MAX_ACTIONS = ACTIONS_ZONE.max
const MAX_META = PAGE_TITLE_AREAS.find((area) => area.id === 'meta').zone.max

function freshId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function withIds(items, prefix) {
  return (items ?? []).map((item) => ({ ...item, id: item.id ?? freshId(prefix) }))
}

// ── Props ↔ config ────────────────────────────────────────────────────────────
// The same mapping serves the code snippet, the JSON view and the editor's
// props panel, so a PageTitle node round-trips without losing anything. The
// action list is emitted in its canonical order (primary last).

// The sample trail shown for a page title outside a project (the library preview
// and the code snippet); in a project the trail comes from the page hierarchy.
function sampleBreadcrumb(title) {
  return [{ label: 'Home', href: '/' }, { label: 'Parent page', href: '/' }, { label: title || 'Page title' }]
}

export function propsFromConfig(config) {
  const props = {}
  // Page definitions: `true` = built from the project's page hierarchy at render time.
  if (config.showBreadcrumb) props.breadcrumb = config.breadcrumbItems ?? true
  if (config.eyebrow) props.eyebrow = config.eyebrow
  props.title = config.title
  if (config.description) props.description = config.description
  const meta = (config.meta ?? []).filter((badge) => badge.label)
  if (meta.length) props.meta = meta.map((badge) => ({ label: badge.label, status: badge.status || 'neutral' }))
  if (config.actions?.length) {
    props.actions = normalizePageTitleActions(config.actions.filter(action => action.kind !== 'node')).map((action) => {
      const kind = action.kind ?? 'button'
      const out = { id: action.id, label: action.label }
      if (kind !== 'button') out.kind = kind
      if (kind === 'button' && action.variant && action.variant !== 'secondary') out.variant = action.variant
      if (kind === 'icon-button' && action.variant && action.variant !== 'tertiary') out.variant = action.variant
      if (action.icon) out.icon = action.icon
      if (kind === 'link') out.href = action.href || '#'
      return out
    })
  }
  if (config.contentWidth && config.contentWidth !== 'xl') props.contentWidth = config.contentWidth
  return props
}

export function configFromProps(props = {}) {
  const base = getDefaultConfig()
  const actions = Array.isArray(props.actions)
    ? withIds(props.actions.map((action) => ({
        kind: ['button', 'link', 'icon-button'].includes(action.kind) ? action.kind : 'button',
        label: action.label ?? '',
        variant: action.variant ?? (action.kind === 'icon-button' ? 'tertiary' : 'secondary'),
        icon: action.icon ?? '',
        href: action.href ?? '',
      })), 'action')
    : []
  // The metadata row: badge data (one or a list). Index-based ids keep the
  // editor's fields focused, since it rebuilds config from props on each render.
  const metaList = Array.isArray(props.meta) ? props.meta : props.meta && typeof props.meta === 'object' ? [props.meta] : []
  const meta = metaList
    .filter((badge) => badge && typeof badge.label === 'string')
    .map((badge, index) => ({ id: `meta-${index + 1}`, label: badge.label, status: BADGE_STATUSES.includes(badge.status) ? badge.status : 'neutral' }))
  return {
    ...base,
    title: props.title ?? '',
    eyebrow: props.eyebrow ?? '',
    description: props.description ?? '',
    meta,
    breadcrumbItems: Array.isArray(props.breadcrumb) ? props.breadcrumb : undefined,
    showBreadcrumb: props.breadcrumb === true || (Array.isArray(props.breadcrumb) && props.breadcrumb.length > 0),
    actions,
    contentWidth: props.contentWidth ?? 'xl',
  }
}

// Page definitions carry the metadata as badge nodes in the Metadata zone.
function metaNode(badge, index) {
  const source = badge.sourceNode ?? {}
  const content = { ...source.content, fallback: badge.label }
  if (source.content?.fallback !== badge.label) delete content.textKey
  return { ...source, id: source.id ?? badge.id ?? `meta-${index + 1}`, type: 'MessageBadge', props: { ...source.props, status: badge.status || 'neutral' }, content }
}

function metaFromNode(node, index) {
  return { id: node.id ?? `meta-${index + 1}`, sourceNode: node, label: node.content?.fallback ?? '', status: BADGE_STATUSES.includes(node.props?.status) ? node.props.status : 'neutral' }
}

export function toJson(config) {
  const { actions: _actions, meta: _meta, ...props } = propsFromConfig(config)
  const actions = (config.actions ?? []).map(patternActionToNode)
  const meta = (config.meta ?? []).map(metaNode)
  return { node: patternConfigNode('PageTitle', config,
    ['title', 'eyebrow', 'description', 'contentWidth', 'breadcrumb', 'actions', 'meta'],
    props, { actions, meta }), note: null }
}

export function fromJson(node) {
  const config = configFromProps(node?.props ?? {})
  config.sourceNode = node
  const actionsSlot = (node?.children ?? []).find((child) => child.type === 'Slot' && child.props?.area === 'actions')
  const nodes = actionsSlot?.children ?? (Array.isArray(node?.props?.actions) ? null : [])
  if (nodes) config.actions = nodes.map(patternActionFromNode)
  const metaSlot = (node?.children ?? []).find((child) => child.type === 'Slot' && child.props?.area === 'meta')
  if (metaSlot) config.meta = (metaSlot.children ?? []).filter((child) => child.type === 'MessageBadge').map(metaFromNode)
  return config
}

// ── Snippet ───────────────────────────────────────────────────────────────────

function buildSnippet(config, utilityClass = '') {
  const { node } = toJson(config)
  if (node.props.breadcrumb === true) node.props.breadcrumb = sampleBreadcrumb(config.title)
  if (utilityClass) node.props.className = utilityClass
  return nodeToJsx(node)
}

// ── Module API ────────────────────────────────────────────────────────────────

export function getDefaultConfig() {
  return {
    title: 'Page title',
    eyebrow: '',
    description: 'A short description tells people what this page is for.',
    meta: [],
    showBreadcrumb: true,
    actions: [],
    contentWidth: 'xl',
  }
}

export function Preview({ config, utilityClass = '', editableAreas: visibleAreas = [] }) {
  const { node } = toJson(config)
  const props = { ...node.props }
  if (props.breadcrumb === true) props.breadcrumb = sampleBreadcrumb(config.title)
  const area = (id) => node.children.find(child => child.props?.area === id)
  const renderArea = (id) => {
    const slot = area(id)
    const outline = visibleAreas.find(candidate => candidate.id === id)
    if (slot?.children?.length) return id === 'content'
      ? <RenderNode node={slot} />
      : slot.children.map(child => <RenderNode key={child.id} node={child} />)
    return outline ? <SlotPlaceholder label={outline.label} hint={outline.hint} /> : null
  }
  return <PageTitle {...props} className={utilityClass || undefined} meta={renderArea('meta')} actions={renderArea('actions')}>
    {renderArea('content')}
  </PageTitle>
}

// One action's controls: the label row carries the remove button; the type and
// variant are icon toolbars that collapse into a menu rather than wrap.
function ActionEditor({ action, onChange, onRemove }) {
  if (action.kind === 'node') return <Stack direction="row" gap="sm" align="center">
    <Paragraph size="sm">{action.label} — edit its items in JSON or the project editor.</Paragraph>
    <IconButton icon="delete" variant="destructive" size="sm" label="Remove action" onClick={onRemove} />
  </Stack>
  const kind = action.kind ?? 'button'
  const variantOptions = kind === 'icon-button'
    ? VARIANT_OPTIONS.filter((option) => ICON_BUTTON_VARIANTS.includes(option.value))
    : VARIANT_OPTIONS
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs" align="end">
        <Stack grow>
          <TextField
            label={kind === 'icon-button' ? 'Accessible name' : 'Label'}
            size="compact"
            value={action.label}
            onChange={(event) => onChange({ label: event.target.value })}
          />
        </Stack>
        <IconButton icon="delete" variant="destructive" size="sm" label="Remove action" onClick={onRemove} />
      </Stack>
      <Choice
        label="Type"
        labelMode="selected"
        overflow
        value={kind}
        onChange={(next) => onChange({ kind: next, ...(next === 'icon-button' && !ICON_BUTTON_VARIANTS.includes(action.variant) ? { variant: 'tertiary' } : {}), ...(next === 'button' && action.variant === 'tertiary' ? { variant: 'secondary' } : {}) })}
        options={ACTION_KIND_OPTIONS}
      />
      {kind !== 'link' && (
        <Choice
          label="Variant"
          labelMode="selected"
          overflow
          value={action.variant}
          onChange={(variant) => onChange({ variant })}
          options={variantOptions}
        />
      )}
      {kind === 'link' && (
        <TextField label="Link" size="compact" value={action.href} onChange={(event) => onChange({ href: event.target.value })} />
      )}
      <IconSelect label={kind === 'icon-button' ? 'Icon' : 'Icon (optional)'} value={action.icon} onChange={(icon) => onChange({ icon })} />
    </Stack>
  )
}

export function Controls({ config, setConfig, pages }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const actions = config.actions ?? []
  // In the project editor (`pages` is the project's page list) the metadata and
  // actions are nodes in the pattern's Metadata and Actions zones, edited on the
  // canvas and in the Layers tree.
  const inEditor = Array.isArray(pages)
  const actionSummary = actions.length ? actions.map((action) => action.label || 'Untitled').join(' · ') : 'None'

  // One primary at most: making a button primary turns the other primaries secondary.
  function updateAction(id, patch) {
    set({
      actions: actions.map((action) => {
        if (action.id === id) return { ...action, ...patch }
        return patch.variant === 'primary' && action.variant === 'primary' ? { ...action, variant: 'secondary' } : action
      }),
    })
  }
  const removeAction = (id) => set({ actions: actions.filter((action) => action.id !== id) })

  const meta = config.meta ?? []
  const metaSummary = meta.length ? meta.map((badge) => badge.label || 'Untitled').join(' · ') : 'None'
  const updateMeta = (id, patch) => set({ meta: meta.map((badge) => (badge.id === id ? { ...badge, ...patch } : badge)) })
  const removeMeta = (id) => set({ meta: meta.filter((badge) => badge.id !== id) })
  const addMeta = () => set({ meta: [...meta, { id: freshId('meta'), label: 'Badge', status: 'neutral' }] })
  const addAction = () => set({ actions: [...actions, { id: freshId('action'), kind: 'button', label: 'Action', variant: 'secondary', icon: '', href: '' }] })

  return (
    <Stack gap="lg">
      <WithHelp helper="The page heading, always the page's h1. Keep it short; it also ends the breadcrumb trail.">
        <TextField label="Title" size="compact" value={config.title} onChange={(event) => set({ title: event.target.value })} />
      </WithHelp>
      <WithHelp helper="A short category label above the title (the A1 eyebrow composition). Leave empty to hide it.">
        <TextField label="Eyebrow" size="compact" value={config.eyebrow} onChange={(event) => set({ eyebrow: event.target.value })} />
      </WithHelp>
      <WithHelp helper="One or two sentences of supporting text under the title. Leave empty to hide it.">
        <TextField label="Description" size="compact" value={config.description} onChange={(event) => set({ description: event.target.value })} />
      </WithHelp>
      <ConfigSlider
        prop="contentWidth"
        label="Content width"
        values={CONTENT_WIDTH_VALUES}
        value={config.contentWidth}
        onChange={(contentWidth) => set({ contentWidth })}
        helper="Section content width. Match the sections that follow so the page reads as one column. The surface, title size and heading level are fixed by the pattern."
      />

      <Toggle
        prop="breadcrumb"
        label="Show breadcrumb"
        value={config.showBreadcrumb}
        onChange={(showBreadcrumb) => set({ showBreadcrumb })}
        helper="The trail above the title. In a project it's built from the page hierarchy — the home page, this page's parents, then this page; the preview shows a sample trail."
      />

      {!inEditor && (
      <Accordion label="Actions" subtext={actionSummary} size="sm" divider>
        <WithHelp helper="Page actions — buttons, links or icon buttons — sit in a ButtonContainer, so they stack on narrow screens. One button at most is primary, and the pattern always shows it last. In a project the actions live in the pattern's Actions zone, which enforces the same rules.">
          <Stack gap="md">
            {actions.map((action, index) => (
              <Stack key={action.id} gap="md">
                {index > 0 && <Divider space="none" />}
                <ActionEditor action={action} onChange={(patch) => updateAction(action.id, patch)} onRemove={() => removeAction(action.id)} />
              </Stack>
            ))}
            <Button variant="secondary" size="sm" icon="add" disabled={actions.length >= MAX_ACTIONS} onClick={addAction}>
              Add action
            </Button>
          </Stack>
        </WithHelp>
      </Accordion>
      )}

      {!inEditor && (
      <Accordion label="Metadata" subtext={metaSummary} size="sm" divider>
        <WithHelp helper="Short badges about the page — a status, a count, an owner. They always sit directly below the title. Pair colour with a clear label; never rely on colour alone.">
          <Stack gap="md">
            {meta.map((badge, index) => (
              <Stack key={badge.id} gap="sm">
                {index > 0 && <Divider space="none" />}
                <Stack direction="row" gap="xs" align="end">
                  <Stack grow>
                    <TextField label={`Badge ${index + 1}`} size="compact" value={badge.label} onChange={(event) => updateMeta(badge.id, { label: event.target.value })} />
                  </Stack>
                  <IconButton icon="delete" variant="destructive" size="sm" label={`Remove badge ${index + 1}`} onClick={() => removeMeta(badge.id)} />
                </Stack>
                <Choice
                  label="Status"
                  iconOnly
                  value={badge.status}
                  onChange={(status) => updateMeta(badge.id, { status })}
                  options={statusOptions(BADGE_STATUSES)}
                />
              </Stack>
            ))}
            <Button variant="secondary" size="sm" icon="add" disabled={meta.length >= MAX_META} onClick={addMeta}>
              Add badge
            </Button>
          </Stack>
        </WithHelp>
      </Accordion>
      )}
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
