import {
  Stack, Heading, Paragraph, SelectField, NumberField, Switch, Divider,
} from '@gtivr4/a1-design-system-react'
import { useDataSources } from '../data/DataSourcesContext.jsx'
import { datasetAvailableToProject } from '../services/dataSources/types'
import { datasetBindingKey } from '../data/bindings'
import { collectionTargetFor } from '../data/collections'

const MODE_LABELS = {
  rows: 'Each row',
  fields: 'Each field of the item',
  distinct: 'Distinct values of a column',
}

/**
 * "Fill <items/options> from data" — configures a data-driven collection for a
 * component whose array prop can be generated from a dataset (DefinitionList items,
 * ChoiceGroup / Select / Autocomplete options). Picks a dataset, a mode (each row /
 * each field of the item / distinct values of a column), an optional column→field
 * map, and limit/random. Writes `node.collections[prop]`. See `data/collections.ts`.
 */
export function EditorCollectionControls({ nodeType, collections, projectId, onSetCollections }) {
  const target = collectionTargetFor(nodeType)
  const ctx = useDataSources()
  const datasets = (ctx?.items ?? []).filter((d) => datasetAvailableToProject(d, projectId))
  if (!target || !datasets.length || !onSetCollections) return null

  const current = collections?.[target.prop] ?? null
  const dataset = current ? (datasets.find((d) => datasetBindingKey(d.name) === current.dataset) ?? null) : null
  const columns = dataset?.columns ?? []

  const setBinding = (next) => {
    if (!next) { onSetCollections(null); return }
    onSetCollections({ ...(collections ?? {}), [target.prop]: next })
  }

  return (
    <Stack gap="xs">
      <Divider space="xs" />
      <Stack gap="xs">
        <Heading as="h3" size="xs">Fill {target.label} from data</Heading>
        <Paragraph size="xs" color="muted">Generate this component’s {target.label} from a data source.</Paragraph>
      </Stack>

      <SelectField
        label="Data source"
        size="compact"
        value={current?.dataset ?? ''}
        onChange={(e) => {
          const key = e.target.value
          setBinding(key ? { dataset: key, mode: target.modes[0], map: {} } : null)
        }}
      >
        <option value="">Don’t fill from data</option>
        {datasets.map((d) => <option key={d.id} value={datasetBindingKey(d.name)}>{d.name}</option>)}
      </SelectField>

      {current && dataset && (
        <>
          <SelectField
            label="For"
            size="compact"
            value={current.mode}
            onChange={(e) => setBinding({ ...current, mode: e.target.value })}
          >
            {target.modes.map((m) => <option key={m} value={m}>{MODE_LABELS[m]}</option>)}
          </SelectField>

          {current.mode === 'distinct' && (
            <SelectField
              label="Column"
              size="compact"
              value={current.column ?? columns[0]?.key ?? ''}
              onChange={(e) => setBinding({ ...current, column: e.target.value })}
            >
              {columns.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
            </SelectField>
          )}

          {(current.mode === 'rows' || current.mode === 'distinct') && (
            <Stack gap="xs">
              <Paragraph size="xs" color="muted">Map fields</Paragraph>
              {target.fields.map((f) => (
                <SelectField
                  key={f.key}
                  label={f.label}
                  size="compact"
                  value={current.map?.[f.key] ?? ''}
                  onChange={(e) => {
                    const map = { ...(current.map ?? {}) }
                    if (e.target.value) map[f.key] = e.target.value
                    else delete map[f.key]
                    setBinding({ ...current, map })
                  }}
                >
                  <option value="">
                    {current.mode === 'distinct' && (f.key === 'value' || f.key === 'label') ? 'The distinct value' : '—'}
                  </option>
                  {columns.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
                </SelectField>
              ))}
            </Stack>
          )}

          {current.mode !== 'fields' && (
            <>
              <NumberField
                label="Show at most"
                size="compact"
                min={1}
                value={current.limit ?? ''}
                hint="Leave blank for all"
                onChange={(e) => {
                  const v = e.target.value
                  setBinding({ ...current, limit: v === '' ? null : Math.max(1, parseInt(v, 10) || 1) })
                }}
              />
              <Switch
                label="Pick at random"
                checked={!!current.random}
                onChange={(on) => setBinding({ ...current, random: on })}
              />
            </>
          )}
        </>
      )}
    </Stack>
  )
}
