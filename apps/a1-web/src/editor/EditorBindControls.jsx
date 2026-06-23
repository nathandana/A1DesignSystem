import {
  Stack, Heading, Paragraph, SelectField, NumberField, Switch, Button, MessageBadge, Divider,
} from '@gtivr4/a1-design-system-react'
import { useDataSources } from '../data/DataSourcesContext.jsx'
import { datasetAvailableToProject } from '../services/dataSources/types'
import { datasetBindingKey, hasBinding } from '../data/bindings'
import { normalizeRepeat } from '../data/repeat'

// Free-text string props worth binding to data — not enums like variant/size/status.
const BINDABLE_PROP_KEYS = new Set([
  'href', 'src', 'alt', 'title', 'caption', 'label', 'value', 'name',
  'description', 'subtitle', 'eyebrow', 'text', 'placeholder', 'unit', 'prefix',
])

function humanize(key) {
  const s = String(key).replace(/[_-]+/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim()
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : key
}

/**
 * "Bind to data" section of the Configure panel. Lists the selected node's bindable
 * fields — its text content + free-text string props — each with a menu to pick a
 * data source and one of its fields. Selecting sets that field to a
 * `{{ key.column }}` binding token, which the renderer resolves on the canvas.
 * Only data sources available to this page's project (global or scoped to it) show.
 * See `data/bindings.ts`.
 */
export function EditorBindControls({ baseUpdate, projectId, contentLocked, lockedProps, onBind, repeat, onSetRepeat }) {
  const ctx = useDataSources()
  const datasets = (ctx?.items ?? []).filter((d) => datasetAvailableToProject(d, projectId))
  if (!datasets.length) return null

  const rc = normalizeRepeat(repeat)

  const targets = []
  if (baseUpdate?.contentFallback !== undefined && !contentLocked) {
    targets.push({ kind: 'content', label: 'Text', value: baseUpdate.contentFallback })
  }
  for (const [k, v] of Object.entries(baseUpdate?.props ?? {})) {
    if (typeof v === 'string' && BINDABLE_PROP_KEYS.has(k) && !lockedProps?.has?.(k)) {
      targets.push({ kind: 'prop', key: k, label: humanize(k), value: v })
    }
  }
  if (!targets.length && !onSetRepeat) return null

  return (
    <Stack gap="sm">
      <Divider space="xs" />
      <Stack gap="xs">
        <Heading as="h3" size="xs">Data</Heading>
        <Paragraph size="xs" color="muted">
          Repeat this element over a data source, or pull values into its fields.
        </Paragraph>
      </Stack>

      {onSetRepeat && (
        <Stack gap="xs">
          <Paragraph size="sm">Repeat for each row</Paragraph>
          <SelectField
            aria-label="Repeat this element for each row of a data source"
            size="compact"
            value={rc?.dataset ?? ''}
            onChange={(e) => onSetRepeat(e.target.value ? { ...(rc ?? {}), dataset: e.target.value } : null)}
          >
            <option value="">Don’t repeat</option>
            {datasets.map((ds) => (
              <option key={ds.id} value={datasetBindingKey(ds.name)}>{ds.name}</option>
            ))}
          </SelectField>
          {rc && (
            <>
              <NumberField
                label="Show at most"
                size="compact"
                min={1}
                value={rc.limit ?? ''}
                hint="Leave blank for all rows"
                onChange={(e) => {
                  const v = e.target.value
                  onSetRepeat({ ...rc, limit: v === '' ? null : Math.max(1, parseInt(v, 10) || 1) })
                }}
              />
              <Switch
                label="Pick rows at random"
                checked={!!rc.random}
                onChange={(on) => onSetRepeat({ ...rc, random: on })}
              />
              <Paragraph size="xs" color="muted">
                Renders once per row — edit the first copy; bindings inside use each row.
              </Paragraph>
            </>
          )}
        </Stack>
      )}

      {targets.map((t) => (
        <BindRow
          key={t.kind === 'content' ? '__content' : `prop:${t.key}`}
          target={t}
          datasets={datasets}
          onBind={onBind}
        />
      ))}
    </Stack>
  )
}

function BindRow({ target, datasets, onBind }) {
  const bound = hasBinding(target.value)
  const handle = (e) => {
    const ref = e.target.value
    if (ref) onBind(target, `{{ ${ref} }}`)
  }
  return (
    <Stack gap="xs">
      <Stack direction="row" gap="xs" align="center" justify="between">
        <Paragraph size="sm">{target.label}</Paragraph>
        {bound && <MessageBadge status="info" subtle size="sm" icon="database">Bound</MessageBadge>}
      </Stack>
      <Stack direction="row" gap="xs" align="end">
        <SelectField
          aria-label={`Bind ${target.label} to a data field`}
          size="compact"
          value=""
          onChange={handle}
        >
          <option value="">{bound ? target.value : 'Choose data field…'}</option>
          {datasets.map((ds) => {
            const key = datasetBindingKey(ds.name)
            return (
              <optgroup key={ds.id} label={ds.name}>
                {ds.columns.map((c) => (
                  <option key={c.key} value={`${key}.${c.key}`}>{c.name}</option>
                ))}
              </optgroup>
            )
          })}
        </SelectField>
        {bound && (
          <Button variant="secondary" size="sm" icon="link_off" onClick={() => onBind(target, '')}>
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
