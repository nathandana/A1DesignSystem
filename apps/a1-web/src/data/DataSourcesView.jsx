import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Section, Stack, Cluster, Grid, Heading, Paragraph, Button, IconButton,
  Card, MessageBadge, MessageEmptyState, TextField, TextareaField, SelectField,
  Switch, Autocomplete, Dialog, Banner,
} from '@gtivr4/a1-design-system-react'
import { DataGrid, SelectColumn, textEditor } from '@gtivr4/a1-design-system-react/components/data-grid/DataGrid.jsx'
import { useDataSources } from './DataSourcesContext.jsx'
import { datasetScopeLabel, COLUMN_TYPES } from '../services/dataSources/types'
import { parseDataSourceJson } from '../services/dataSources/importJson'
import { SAMPLE_DATA_SOURCES } from '../services/dataSources/samples'
import { PageTitleArea } from '../pages/PageTitleArea.jsx'

// ── Row-id helpers ──────────────────────────────────────────────────────────
// react-data-grid needs a stable row key. We tag each grid row with a synthetic
// `__rid` while editing and strip it before persisting, so stored rows stay clean.
let ridSeq = 0
function rid() { ridSeq += 1; return `r${Date.now().toString(36)}_${ridSeq}` }
function withRid(rows) { return rows.map((r) => ({ __rid: rid(), ...r })) }
function stripRid(rows) { return rows.map(({ __rid, ...rest }) => rest) }

function slugKey(name, existing) {
  const base = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'col'
  let key = base
  let n = 2
  const taken = new Set(existing.map((c) => c.key))
  while (taken.has(key)) { key = `${base}_${n}`; n += 1 }
  return key
}

function defaultColumns() {
  return [
    { key: 'name', name: 'Name', type: 'text' },
    { key: 'value', name: 'Value', type: 'text' },
  ]
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DataSourcesView({ projects = [], onNavigate }) {
  const ctx = useDataSources()
  const items = ctx?.items ?? []
  const [openId, setOpenId] = useState(null)
  const [importOpen, setImportOpen] = useState(false)

  const open = items.find((d) => d.id === openId) || null

  const handleNew = useCallback(async () => {
    if (!ctx) return
    const ds = await ctx.create({ name: 'Untitled dataset', columns: defaultColumns(), rows: [] })
    if (ds) setOpenId(ds.id)
  }, [ctx])

  const handleImport = useCallback(async ({ name, columns, rows }) => {
    if (!ctx) return
    const ds = await ctx.create({ name, columns, rows })
    setImportOpen(false)
    if (ds) setOpenId(ds.id)
  }, [ctx])

  const handleAddSample = useCallback(async (sample) => {
    if (!ctx) return
    const ds = await ctx.create(sample.build())
    if (ds) setOpenId(ds.id)
  }, [ctx])

  return (
    <>
      {!open && (
        <PageTitleArea
          headingId="data-sources-heading"
          breadcrumbItems={[
            { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
            { label: 'Data sources' },
          ]}
          title="Data sources"
          description={`Reusable datasets you can edit, scope to projects, and bind into pages.${ctx ? (ctx.isCloud ? ' Synced to your account.' : ' Stored in this browser (sign in to sync).') : ''}`}
          actions={(
            <>
              <Button variant="secondary" icon="help" onClick={() => onNavigate?.('help')}>Help</Button>
              <Button variant="secondary" icon="upload" onClick={() => setImportOpen(true)}>Import JSON</Button>
              <Button icon="add" onClick={handleNew}>New dataset</Button>
            </>
          )}
        />
      )}

      <Section padding="md" contentWidth="xl" aria-labelledby={!open ? 'data-sources-heading' : undefined}>
        {open ? (
          <DatasetEditor
            key={open.id}
            dataset={open}
            projects={projects}
            ctx={ctx}
            onClose={() => setOpenId(null)}
          />
        ) : (
          <DatasetList items={items} loading={ctx?.loading} onOpen={setOpenId} onNew={handleNew} onAddSample={handleAddSample} />
        )}
      </Section>

      <ImportDialog
        open={importOpen}
        mode="create"
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />
    </>
  )
}

// ── List ────────────────────────────────────────────────────────────────────

function DatasetList({ items, loading, onOpen, onNew, onAddSample }) {
  if (loading) return <Paragraph color="muted">Loading datasets…</Paragraph>
  if (!items.length) {
    return (
      <MessageEmptyState
        scale="section"
        icon="table_chart"
        title="No datasets yet"
        description="Create a dataset to edit values in a spreadsheet-style grid, import a JSON feed, or start from a sample."
        action={(
          <Cluster gap="sm" justify="center">
            <Button variant="primary" icon="add" onClick={onNew}>New dataset</Button>
            {SAMPLE_DATA_SOURCES.map((s) => (
              <Button key={s.id} variant="secondary" icon={s.icon} onClick={() => onAddSample(s)}>
                Add sample: {s.label}
              </Button>
            ))}
          </Cluster>
        )}
      />
    )
  }
  const unaddedSamples = SAMPLE_DATA_SOURCES.filter((s) => !items.some((d) => d.name === s.label))
  return (
    <Stack direction="column" gap="lg">
      <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
        {items.map((ds) => (
          <Card key={ds.id}>
            <Stack direction="column" gap="sm">
              <Stack direction="row" justify="between" align="center">
                <Heading as="h2" size="md">{ds.name}</Heading>
                <MessageBadge status="info" subtle size="sm" icon="folder_open">{datasetScopeLabel(ds)}</MessageBadge>
              </Stack>
              {ds.description && <Paragraph size="sm" color="muted">{ds.description}</Paragraph>}
              <Paragraph size="xs" color="muted">
                {ds.rows.length} {ds.rows.length === 1 ? 'row' : 'rows'} · {ds.columns.length} {ds.columns.length === 1 ? 'column' : 'columns'}
              </Paragraph>
              <Cluster gap="sm">
                <Button variant="secondary" size="sm" icon="edit" onClick={() => onOpen(ds.id)}>Edit</Button>
              </Cluster>
            </Stack>
          </Card>
        ))}
      </Grid>
      {unaddedSamples.length > 0 && (
        <Stack direction="column" gap="sm">
          <Paragraph size="sm" color="muted">Add a sample dataset</Paragraph>
          <Cluster gap="sm">
            {unaddedSamples.map((s) => (
              <Button key={s.id} variant="secondary" size="sm" icon={s.icon} onClick={() => onAddSample(s)}>
                {s.label}
              </Button>
            ))}
          </Cluster>
        </Stack>
      )}
    </Stack>
  )
}

// ── Editor ────────────────────────────────────────────────────────────────────

function DatasetEditor({ dataset, projects, ctx, onClose }) {
  const [name, setName] = useState(dataset.name)
  const [description, setDescription] = useState(dataset.description ?? '')
  const [columns, setColumns] = useState(dataset.columns?.length ? dataset.columns : defaultColumns())
  const [rows, setRows] = useState(() => withRid(dataset.rows ?? []))
  const [projectIds, setProjectIds] = useState(dataset.projectIds ?? [])
  const [selectedRows, setSelectedRows] = useState(() => new Set())
  const [savedAt, setSavedAt] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [replaceOpen, setReplaceOpen] = useState(false)
  const firstRun = useRef(true)
  const saveTimer = useRef(null)

  const scoped = projectIds.length > 0

  // Debounced autosave: persist the working dataset 600ms after the last edit. The
  // component is keyed by dataset.id, so its working state survives the store refresh
  // that each save triggers (the new prop for the same id is ignored after mount).
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await ctx.update(dataset.id, {
        name: name.trim() || 'Untitled dataset',
        description: description.trim() || null,
        columns,
        rows: stripRid(rows),
        projectIds,
      })
      setSavedAt(Date.now())
    }, 600)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [name, description, columns, rows, projectIds, ctx, dataset.id])

  const gridColumns = useMemo(() => [
    SelectColumn,
    ...columns.map((c) => ({ key: c.key, name: c.name, renderEditCell: textEditor, resizable: true })),
  ], [columns])

  const addRow = () => setRows((rs) => [
    ...rs,
    { __rid: rid(), ...Object.fromEntries(columns.map((c) => [c.key, ''])) },
  ])
  const deleteSelected = () => {
    setRows((rs) => rs.filter((r) => !selectedRows.has(r.__rid)))
    setSelectedRows(new Set())
  }
  const addColumn = () => setColumns((cs) => {
    const n = cs.length + 1
    return [...cs, { key: slugKey(`column ${n}`, cs), name: `Column ${n}`, type: 'text' }]
  })
  const renameColumn = (idx, nextName) => setColumns((cs) => cs.map((c, i) => (i === idx ? { ...c, name: nextName } : c)))
  const setColumnType = (idx, type) => setColumns((cs) => cs.map((c, i) => (i === idx ? { ...c, type } : c)))
  const removeColumn = (idx) => {
    const key = columns[idx]?.key
    setColumns((cs) => cs.filter((_, i) => i !== idx))
    if (key) setRows((rs) => rs.map(({ [key]: _drop, ...rest }) => rest))
  }

  const handleDelete = async () => {
    await ctx.remove(dataset.id)
    setConfirmDelete(false)
    onClose()
  }

  const handleReplace = ({ columns: nextCols, rows: nextRows }) => {
    setColumns(nextCols.length ? nextCols : defaultColumns())
    setRows(withRid(nextRows))
    setSelectedRows(new Set())
    setReplaceOpen(false)
  }

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.name }))

  return (
    <Stack direction="column" gap="md">
      {/* Header */}
      <Stack direction="row" justify="between" align="center" gap="sm" wrap>
        <Cluster gap="sm">
          <IconButton icon="arrow_back" aria-label="Back to datasets" onClick={onClose} />
          <TextField aria-label="Dataset name" value={name} onChange={(e) => setName(e.target.value)} />
        </Cluster>
        <Cluster gap="sm">
          <MessageBadge status={ctx?.isCloud ? 'success' : 'neutral'} subtle size="sm" icon={ctx?.isCloud ? 'cloud_done' : 'computer'}>
            {ctx?.isCloud ? 'Synced' : 'Local'}
          </MessageBadge>
          {savedAt && <Paragraph as="span" size="xs" color="muted">Saved</Paragraph>}
          <Button variant="destructive" size="sm" icon="delete" onClick={() => setConfirmDelete(true)}>Delete</Button>
        </Cluster>
      </Stack>

      {/* Scope + description */}
      <Card>
        <Stack direction="column" gap="md">
          <Stack direction="column" gap="sm">
            <Switch
              label="Limit to specific projects"
              hint="Off = available to every project (global). On = only the projects you pick below."
              checked={scoped}
              onChange={(on) => { if (!on) setProjectIds([]) ; else if (!projectIds.length && projects[0]) setProjectIds([projects[0].id]) }}
            />
            {scoped && (
              <Autocomplete
                multiple
                label="Projects"
                options={projectOptions}
                value={projectIds}
                onChange={setProjectIds}
                emptyText="No projects"
              />
            )}
          </Stack>
          <TextareaField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </Stack>
      </Card>

      {/* Columns */}
      <Card>
        <Stack direction="column" gap="sm">
          <Stack direction="row" justify="between" align="center">
            <Heading as="h3" size="sm">Columns</Heading>
            <Button variant="secondary" size="sm" icon="add" onClick={addColumn}>Add column</Button>
          </Stack>
          {columns.map((c, idx) => (
            <Stack key={c.key} direction="row" gap="sm" align="end" wrap>
              <TextField label={idx === 0 ? 'Name' : undefined} aria-label="Column name" size="compact" value={c.name} onChange={(e) => renameColumn(idx, e.target.value)} />
              <SelectField label={idx === 0 ? 'Type' : undefined} aria-label="Column type" size="compact" value={c.type ?? 'text'} onChange={(e) => setColumnType(idx, e.target.value)}>
                {COLUMN_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </SelectField>
              <IconButton icon="delete" aria-label={`Remove column ${c.name}`} size="sm" onClick={() => removeColumn(idx)} disabled={columns.length <= 1} />
            </Stack>
          ))}
        </Stack>
      </Card>

      {/* Data grid */}
      <Stack direction="column" gap="sm">
        <Cluster gap="sm">
          <Button variant="secondary" size="sm" icon="add" onClick={addRow}>Add row</Button>
          <Button variant="secondary" size="sm" icon="delete" onClick={deleteSelected} disabled={selectedRows.size === 0}>
            Delete {selectedRows.size || ''} {selectedRows.size === 1 ? 'row' : 'rows'}
          </Button>
          <Button variant="tertiary" size="sm" icon="upload" onClick={() => setReplaceOpen(true)}>Replace from JSON</Button>
        </Cluster>
        {columns.length === 0 ? (
          <Banner status="info">Add a column to start entering data.</Banner>
        ) : (
          <DataGrid
            columns={gridColumns}
            rows={rows}
            rowKeyGetter={(r) => r.__rid}
            onRowsChange={setRows}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            defaultColumnOptions={{ resizable: true }}
          />
        )}
        <Paragraph size="xs" color="muted">Double-click a cell to edit. {rows.length} {rows.length === 1 ? 'row' : 'rows'}.</Paragraph>
      </Stack>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        status="warn"
        title="Delete dataset?"
        footer={(
          <Cluster gap="sm" justify="end">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" icon="delete" onClick={handleDelete}>Delete</Button>
          </Cluster>
        )}
      >
        <Paragraph>“{name}” and its {rows.length} {rows.length === 1 ? 'row' : 'rows'} will be removed. This can't be undone.</Paragraph>
      </Dialog>

      <ImportDialog
        open={replaceOpen}
        mode="replace"
        onClose={() => setReplaceOpen(false)}
        onImport={handleReplace}
      />
    </Stack>
  )
}

// ── Import dialog ─────────────────────────────────────────────────────────────

function ImportDialog({ open, mode = 'create', onClose, onImport }) {
  const [name, setName] = useState('Imported dataset')
  const [text, setText] = useState('')
  const parsed = useMemo(() => (text.trim() ? parseDataSourceJson(text) : null), [text])
  const error = text.trim() && !parsed ? 'That isn’t valid JSON, or not an array/object of rows.' : null

  // Reset the form whenever the dialog opens.
  useEffect(() => { if (open) { setText(''); setName('Imported dataset') } }, [open])

  const canImport = !!parsed && (mode === 'replace' || name.trim().length > 0)

  const submit = () => {
    if (!parsed) return
    onImport(mode === 'create'
      ? { name: name.trim() || 'Imported dataset', columns: parsed.columns, rows: parsed.rows }
      : { columns: parsed.columns, rows: parsed.rows })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Import dataset from JSON' : 'Replace data from JSON'}
      footer={(
        <Cluster gap="sm" justify="end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="upload" onClick={submit} disabled={!canImport}>
            {mode === 'create' ? 'Import' : 'Replace'}
          </Button>
        </Cluster>
      )}
    >
      <Stack direction="column" gap="md">
        <Paragraph size="sm" color="muted">
          Paste a JSON array of objects (each object becomes a row; its keys become columns) or an array of values.
        </Paragraph>
        {mode === 'create' && (
          <TextField label="Dataset name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <TextareaField
          label="JSON"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          error={error || undefined}
        />
        {parsed && (
          <Banner status="success">
            {parsed.rows.length} {parsed.rows.length === 1 ? 'row' : 'rows'} · {parsed.columns.length} {parsed.columns.length === 1 ? 'column' : 'columns'} detected.
          </Banner>
        )}
      </Stack>
    </Dialog>
  )
}
