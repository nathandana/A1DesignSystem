import {
  Accordion,
  Button,
  Code,
  Divider,
  IconButton,
  OverviewCard,
  Stack,
  TextField,
  normalizeOverviewCardActions,
} from '@gtivr4/a1-design-system-react'
import { Choice, WithHelp, statusOptions } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { RenderNode } from '../../../editor/pageRenderer.tsx'
import { nodeToJsx } from '../../../editor/definitionToJsx.ts'
import { SlotPlaceholder } from '../../../editor/SlotPlaceholder.jsx'
import { patternConfigNode, patternActionFromNode, patternActionToNode } from '../../../editor/patternConfig.js'
import { getPatternManifest } from '../../../../../../packages/react/src/patterns/patternPolicies.js'
import { PATTERN_AREAS } from '../../../editor/patternAreas.ts'

export const jsonType = 'OverviewCard'
export const acceptsJsonChildren = true
// The pattern's areas, from the pattern-area registry: outlined in the
// configurator preview (toggle in the display toolbar) and shipped as Slot
// children of the editor's default node.
const ACTIONS_ZONE = PATTERN_AREAS.OverviewCard.find((area) => area.id === 'actions').zone
export const editableAreas = PATTERN_AREAS.OverviewCard.map((area) => ({
  id: area.id,
  label: area.label,
  hint: area.zone ? area.zone.rules : area.hint,
  zone: !!area.zone,
}))

// Patterns are minimally configurable: the card surface, icon block, heading
// size, details layout and action size are locked; the icon glyph, heading text
// and level, status, details, content and actions are open.
const TITLE_LEVELS = ['h2', 'h3', 'h4']
const STATUSES = ['neutral', 'info', 'success', 'warn', 'error']
const ACTION_KIND_OPTIONS = [
  { value: 'button', label: 'Button', icon: 'smart_button' },
  { value: 'link', label: 'Link', icon: 'link' },
  { value: 'icon-button', label: 'Icon button', icon: 'radio_button_checked' },
]
const VARIANT_OPTIONS = [
  { value: 'secondary', label: 'Secondary', icon: 'crop_square' },
  { value: 'tertiary', label: 'Tertiary', icon: 'text_fields' },
]
const MAX_ACTIONS = ACTIONS_ZONE.max
const MAX_DETAILS = getPatternManifest('OverviewCard').propsSchema.properties.details.maxItems

function freshId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

// ── Props ↔ config ────────────────────────────────────────────────────────────
// The same mapping serves the code snippet, the JSON view and the editor's
// props panel. Ids are index-based where the editor rebuilds config from props
// on each render, so a field keeps focus while it is typed in.

export function propsFromConfig(config) {
  const props = {}
  if (config.icon && config.icon !== 'account_circle') props.icon = config.icon
  props.title = config.title
  if (config.titleAs && config.titleAs !== 'h3') props.titleAs = config.titleAs
  if (config.statusLabel) {
    props.status = config.status || 'neutral'
    props.statusLabel = config.statusLabel
  }
  const details = config.details ?? []
  if (details.length) props.details = details.map((detail) => ({ ...detail.sourceDetail, label: detail.label, value: detail.value }))
  if (config.actions?.length) {
    props.actions = normalizeOverviewCardActions(config.actions).map((action) => {
      const out = { id: action.id, label: action.label }
      if (action.kind === 'link') {
        out.kind = 'link'
        out.href = action.href || '#'
      } else if (action.kind === 'icon-button') {
        out.kind = 'icon-button'
        if (action.variant === 'secondary') out.variant = 'secondary'
      } else if (action.variant === 'tertiary') {
        out.variant = 'tertiary'
      }
      if (action.href) out.href = action.href
      if (action.disabled && action.kind !== 'link') out.disabled = true
      if (action.kind === 'icon-button') {
        out.icon = action.icon || 'more_horiz'
      } else if (action.icon) {
        out.icon = action.icon
        if (action.iconPosition === 'end') out.iconPosition = 'end'
      }
      return out
    })
  }
  return props
}

export function configFromProps(props = {}) {
  const base = getDefaultConfig()
  const details = Array.isArray(props.details)
    ? props.details
        .filter((detail) => detail && typeof detail === 'object')
        .map((detail, index) => ({ id: `detail-${index + 1}`, sourceDetail: detail, label: String(detail.label ?? ''), value: detail.value ?? '' }))
    : []
  const actions = Array.isArray(props.actions)
    ? props.actions.map((action, index) => ({
        id: action.id ?? `action-${index + 1}`,
        kind: ['link', 'icon-button'].includes(action.kind) ? action.kind : 'button',
        label: action.label ?? '',
        variant: action.variant === 'tertiary' || (action.kind === 'icon-button' && action.variant !== 'secondary') ? 'tertiary' : 'secondary',
        icon: action.icon ?? '',
        iconPosition: action.iconPosition === 'end' ? 'end' : 'start',
        href: action.href ?? '',
        disabled: action.disabled === true,
      }))
    : []
  return {
    ...base,
    icon: props.icon ?? 'account_circle',
    title: props.title ?? '',
    titleAs: TITLE_LEVELS.includes(props.titleAs) ? props.titleAs : 'h3',
    status: STATUSES.includes(props.status) ? props.status : 'neutral',
    statusLabel: props.statusLabel ?? '',
    details,
    actions,
  }
}

export function toJson(config) {
  const { actions: _actions, ...props } = propsFromConfig(config)
  const actions = (config.actions ?? []).map(patternActionToNode)
  return { node: patternConfigNode('OverviewCard', config,
    ['icon', 'title', 'titleAs', 'status', 'statusLabel', 'details', 'actions'],
    props, { actions }), note: null }
}

export function fromJson(node) {
  const config = configFromProps(node?.props ?? {})
  config.sourceNode = node
  config.nodeId = node?.id
  config.contentSlot = (node?.children ?? []).find((child) => child.type === 'Slot' && child.props?.area === 'content')
  const actionsSlot = (node?.children ?? []).find((child) => child.type === 'Slot' && child.props?.area === 'actions')
  config.actionsSlotId = actionsSlot?.id
  if (actionsSlot) config.actions = (actionsSlot.children ?? []).map(patternActionFromNode)
  return config
}

// ── Snippet ───────────────────────────────────────────────────────────────────

function buildSnippet(config, utilityClass = '') {
  const { node } = toJson(config)
  if (utilityClass) node.props.className = utilityClass
  return nodeToJsx(node)
}

// ── Module API ────────────────────────────────────────────────────────────────

export function getDefaultConfig() {
  return {
    icon: 'account_circle',
    title: 'Overview',
    titleAs: 'h3',
    status: 'neutral',
    statusLabel: '',
    details: [
      { id: 'detail-1', label: 'Status', value: 'Active' },
      { id: 'detail-2', label: 'Owner', value: 'Team name' },
      { id: 'detail-3', label: 'Updated', value: 'Today' },
    ],
    actions: [],
  }
}

// The preview host owns the width, just as a parent layout does in a project.
export function Preview({ config, utilityClass = '', editableAreas: visibleAreas = [] }) {
  const props = propsFromConfig(config)
  // Empty areas show editing outlines, never exported sample content.
  const actionsArea = !props.actions?.length ? visibleAreas.find((area) => area.id === 'actions') : null
  const contentArea = visibleAreas.find((area) => area.id === 'content')
  return (
    <OverviewCard
      className={utilityClass || undefined}
      {...props}
      actions={actionsArea ? <SlotPlaceholder label={actionsArea.label} hint={actionsArea.hint} /> : props.actions}
    >
      {config.contentSlot?.children?.length
        ? <RenderNode node={config.contentSlot} />
        : contentArea && <SlotPlaceholder label={contentArea.label} hint={contentArea.hint} />}
    </OverviewCard>
  )
}

function ActionEditor({ action, onChange, onRemove }) {
  const kind = action.kind ?? 'button'
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs" align="end">
        <Stack grow>
          <TextField label={kind === 'icon-button' ? 'Accessible name' : 'Label'} size="compact" value={action.label} onChange={(event) => onChange({ label: event.target.value })} />
        </Stack>
        <IconButton icon="delete" variant="destructive" size="sm" label="Remove action" onClick={onRemove} />
      </Stack>
      <Choice
        label="Type"
        labelMode="selected"
        value={kind}
        onChange={(next) => onChange({ kind: next, ...(next === 'icon-button' ? { variant: 'tertiary', icon: action.icon || 'more_horiz' } : {}) })}
        options={ACTION_KIND_OPTIONS}
      />
      <TextField label={kind === 'link' ? 'Link' : 'Link (optional)'} size="compact" value={action.href ?? ''} onChange={(event) => onChange({ href: event.target.value })} />
      {kind !== 'link' && (
        <Choice label="Variant" labelMode="selected" value={action.variant} onChange={(variant) => onChange({ variant })} options={VARIANT_OPTIONS} />
      )}
      <IconSelect label={kind === 'icon-button' ? 'Icon' : 'Icon (optional)'} value={action.icon} onChange={(icon) => onChange({ icon })} />
      {action.icon && kind !== 'icon-button' && (
        <Choice
          label="Icon position"
          iconOnly
          value={action.iconPosition ?? 'start'}
          onChange={(iconPosition) => onChange({ iconPosition })}
          options={[
            { value: 'start', label: 'Start', icon: 'align_horizontal_left' },
            { value: 'end', label: 'End', icon: 'align_horizontal_right' },
          ]}
        />
      )}
    </Stack>
  )
}

export function Controls({ config, setConfig, pages }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  // In the project editor (`pages` is the project's page list) the actions are
  // nodes in the card's Actions zone, edited on the canvas and in the Layers tree.
  const inEditor = Array.isArray(pages)

  const details = config.details ?? []
  const detailSummary = details.length ? details.map((detail) => detail.label || 'Untitled').join(' · ') : 'None'
  const updateDetail = (id, patch) => set({ details: details.map((detail) => (detail.id === id ? { ...detail, ...patch } : detail)) })
  const removeDetail = (id) => set({ details: details.filter((detail) => detail.id !== id) })
  const addDetail = () => set({ details: [...details, { id: freshId('detail'), label: 'Label', value: 'Value' }] })

  const actions = config.actions ?? []
  const actionSummary = actions.length ? actions.map((action) => action.label || 'Untitled').join(' · ') : 'None'
  const updateAction = (id, patch) => set({ actions: actions.map((action) => (action.id === id ? { ...action, ...patch } : action)) })
  const removeAction = (id) => set({ actions: actions.filter((action) => action.id !== id) })
  const addAction = () => set({ actions: [...actions, { id: freshId('action'), kind: 'button', label: 'Action', variant: 'secondary', icon: '', iconPosition: 'start', href: '' }] })

  return (
    <Stack gap="lg">
      <WithHelp helper="The card heading. Keep it to a few words that name what the card summarises.">
        <TextField label="Title" size="compact" value={config.title} onChange={(event) => set({ title: event.target.value })} />
      </WithHelp>
      <Choice
        prop="titleAs"
        label="Heading level"
        value={config.titleAs}
        onChange={(titleAs) => set({ titleAs })}
        options={TITLE_LEVELS.map((level) => ({ value: level, label: level.charAt(0).toUpperCase() + level.slice(1) }))}
        helper="The heading's level in the page outline — usually one below the section the cards sit in. Its size is fixed by the pattern."
      />
      <WithHelp helper="The glyph in the card's icon block. The block itself is fixed by the pattern, so every card in a set lines up.">
        <IconSelect label="Icon" value={config.icon} onChange={(icon) => set({ icon })} />
      </WithHelp>

      <Accordion label="Status" subtext={config.statusLabel ? config.statusLabel : 'None'} size="sm" divider>
        <Stack gap="md">
          <WithHelp helper="A short status, such as Active or Overdue. The card shows a stripe and a matching badge; leave it empty for no status.">
            <TextField label="Status label" size="compact" value={config.statusLabel} onChange={(event) => set({ statusLabel: event.target.value })} />
          </WithHelp>
          {config.statusLabel && (
            <Choice
              prop="status"
              label="Status tone"
              iconOnly
              value={config.status}
              onChange={(status) => set({ status })}
              options={statusOptions(STATUSES)}
              helper="The stripe and badge colour. The label carries the meaning; colour only reinforces it."
            />
          )}
        </Stack>
      </Accordion>

      <Accordion label="Details" subtext={detailSummary} size="sm" divider>
        <WithHelp helper="Key details as label–value rows. Keep labels to a word or two and values short; link to a detail page for more.">
          <Stack gap="md">
            {details.map((detail, index) => (
              <Stack key={detail.id} gap="sm">
                {index > 0 && <Divider space="none" />}
                <Stack direction="row" gap="xs" align="end">
                  <Stack grow>
                    <TextField label={`Detail ${index + 1} label`} size="compact" value={detail.label} onChange={(event) => updateDetail(detail.id, { label: event.target.value })} />
                  </Stack>
                  <IconButton icon="delete" variant="destructive" size="sm" label={`Remove detail ${index + 1}`} onClick={() => removeDetail(detail.id)} />
                </Stack>
                <TextField label={`Detail ${index + 1} value`} size="compact" value={detail.value} onChange={(event) => updateDetail(detail.id, { value: event.target.value })} />
              </Stack>
            ))}
            <Button variant="secondary" size="sm" icon="add" disabled={details.length >= MAX_DETAILS} onClick={addDetail}>
              Add detail
            </Button>
          </Stack>
        </WithHelp>
      </Accordion>

      {!inEditor && (
        <Accordion label="Actions" subtext={actionSummary} size="sm" divider>
          <WithHelp helper="Up to two small actions: secondary or tertiary buttons, links or icon buttons (give an icon button an accessible name). Cards have no primary button — they repeat in a set, and the page title holds the page's primary action. In a project the actions live in the card's Actions zone, which enforces the same rules.">
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
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
