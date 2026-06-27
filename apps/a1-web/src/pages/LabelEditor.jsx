import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  Banner,
  Breadcrumb,
  Button,
  Card,
  ChoiceGroup,
  Cluster,
  ContextMenu,
  Dialog,
  Heading,
  IconButton,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Autocomplete,
} from '@gtivr4/a1-design-system-react'
import { DataGrid, SelectColumn, textEditor } from '@gtivr4/a1-design-system-react/components/data-grid/DataGrid.jsx'
import { getLabels, hydrateLabels, saveLabels, subscribeLabels } from '../labels/labelStore.js'
import actionJson    from '../../../../system/labels/action.json'
import backlogJson   from '../../../../system/labels/backlog.json'
import calendarJson  from '../../../../system/labels/calendar.json'
import codeJson      from '../../../../system/labels/code.json'
import fieldJson     from '../../../../system/labels/field.json'
import statusBarJson from '../../../../system/labels/status-bar.json'

// ── Locale registry ──────────────────────────────────────────────────────────

const ALL_LOCALES = [
  { key: 'en', label: 'English',    dir: 'ltr' },
  { key: 'es', label: 'Spanish',    dir: 'ltr' },
  { key: 'fr', label: 'French',     dir: 'ltr' },
  { key: 'de', label: 'German',     dir: 'ltr' },
  { key: 'pt', label: 'Portuguese', dir: 'ltr' },
  { key: 'ja', label: 'Japanese',   dir: 'ltr' },
  { key: 'zh', label: 'Chinese',    dir: 'ltr' },
  { key: 'ar', label: 'Arabic',     dir: 'rtl' },
]

// MyMemory uses zh-CN rather than zh
const TRANSLATE_LANG = { zh: 'zh-CN' }

// ── System label key flattener ────────────────────────────────────────────────

function flattenSystemKeys(obj, prefix = '') {
  const out = []
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$') || k === 'locale') continue
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') {
      if ('$value' in v) {
        out.push({
          key: path,
          en: String(v.$value ?? ''),
          description: v.$description ?? '',
          ...Object.fromEntries(
            Object.entries(v.locale ?? {}).map(([lk, lv]) => [lk, String(lv)])
          ),
        })
      } else {
        out.push(...flattenSystemKeys(v, path))
      }
    }
  }
  return out
}

// All system label items with full locale values — used for both the All labels
// grid and the system-key Autocomplete suggestions.
const SYSTEM_LABEL_ITEMS = [
  ...flattenSystemKeys(actionJson.label,    'action'),
  ...flattenSystemKeys(backlogJson.label,   'backlog'),
  ...flattenSystemKeys(calendarJson.label,  'calendar'),
  ...flattenSystemKeys(codeJson.label,      'code'),
  ...flattenSystemKeys(fieldJson.label,     'field'),
  ...flattenSystemKeys(statusBarJson.label, 'statusBar'),
]
const SYSTEM_KEY_SET = new Set(SYSTEM_LABEL_ITEMS.map((i) => i.key))
const SYSTEM_KEY_MAP = Object.fromEntries(SYSTEM_LABEL_ITEMS.map((i) => [i.key, i]))
const SYSTEM_KEY_OPTIONS = SYSTEM_LABEL_ITEMS.map((l) => ({
  value: l.key,
  label: l.key,
  subtext: l.description || l.en,
}))

// ── Row-id helpers ────────────────────────────────────────────────────────────

let ridSeq = 0
function rid() { ridSeq += 1; return `r${Date.now().toString(36)}_${ridSeq}` }
function withRid(items) { return items.map((item) => ({ __rid: rid(), ...item })) }
function stripRid(items) { return items.map(({ __rid, ...rest }) => rest) }

// ── Translation helpers ───────────────────────────────────────────────────────

async function translateOne(text, targetLocale) {
  if (!text?.trim()) return ''
  const lang = TRANSLATE_LANG[targetLocale] ?? targetLocale
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (json.responseStatus === 200) return json.responseData?.translatedText ?? ''
  throw new Error(json.responseDetails ?? 'Translation failed')
}

async function translateRow(row, locales) {
  const src = row.en?.trim()
  if (!src) return row
  const result = { ...row }
  await Promise.all(
    locales
      .filter((l) => l.key !== 'en' && !row[l.key]?.trim())
      .map(async (locale) => {
        try { result[locale.key] = await translateOne(src, locale.key) } catch { /* leave empty */ }
      })
  )
  return result
}

// ── Context menu helpers ──────────────────────────────────────────────────────

function rowFromContextMenuEvent(e, rows) {
  const rowEl = e.target.closest('[role="row"]')
  if (!rowEl) return null
  const idx = parseInt(rowEl.getAttribute('aria-rowindex'), 10)
  // aria-rowindex 1 = header, 2+ = data rows
  if (isNaN(idx) || idx < 2) return null
  return rows[idx - 2] ?? null
}

// ── RTL cell editor (Arabic) ──────────────────────────────────────────────────

function RtlEditor({ row, column, onRowChange, onClose }) {
  return (
    <input
      dir="rtl"
      lang={column.key}
      autoFocus
      style={{
        width: '100%',
        height: '100%',
        padding: '0 var(--base-spacing-6)',
        border: 'none',
        outline: 'none',
        background: 'var(--semantic-color-surface-raised)',
        color: 'var(--semantic-color-text-default)',
        fontSize: 'var(--base-font-size-sm)',
        fontFamily: 'inherit',
        textAlign: 'right',
      }}
      value={row[column.key] ?? ''}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
      onBlur={() => onClose()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClose()
        if (e.key === 'Escape') onClose(true)
      }}
    />
  )
}

// ── Build merged rows for the "All labels" grid ───────────────────────────────

function buildAllRows(workspaceItems, enabledLocales) {
  const wsMap = Object.fromEntries(workspaceItems.map((i) => [i.key, i]))

  const systemRows = SYSTEM_LABEL_ITEMS.map((sys) => {
    const ws = wsMap[sys.key]
    const localeVals = {}
    for (const l of enabledLocales) {
      localeVals[l.key] = l.key === 'en'
        ? (ws?.en ?? sys.en ?? '')
        : (ws?.[l.key] ?? sys[l.key] ?? '')
    }
    return {
      __rid: `sys:${sys.key}`,
      key: sys.key,
      _source: ws ? 'overridden' : 'system',
      ...localeVals,
    }
  })

  const customRows = workspaceItems
    .filter((ws) => !SYSTEM_KEY_SET.has(ws.key))
    .map((ws) => {
      const localeVals = {}
      for (const l of enabledLocales) localeVals[l.key] = ws[l.key] ?? ''
      return { __rid: ws.__rid, key: ws.key, _source: 'custom', ...localeVals }
    })

  return [...systemRows, ...customRows]
}

// ── All labels grid (system + workspace merged, editable) ─────────────────────

function AllLabelsGrid({ workspaceItems, enabledLocales, onWorkspaceChange }) {
  const [rows, setRows] = useState(() => buildAllRows(workspaceItems, enabledLocales))

  useEffect(() => {
    setRows(buildAllRows(workspaceItems, enabledLocales))
  }, [workspaceItems, enabledLocales])

  const handleRowsChange = useCallback((nextRows, { indexes }) => {
    setRows(nextRows)
    const nextWsItems = [...workspaceItems]

    for (const idx of indexes) {
      const row = nextRows[idx]
      const { key, _source, __rid } = row
      const localeVals = { key }
      for (const l of enabledLocales) localeVals[l.key] = row[l.key] ?? ''

      if (_source === 'system' || _source === 'overridden') {
        const existingIdx = nextWsItems.findIndex((i) => i.key === key)
        if (existingIdx >= 0) {
          nextWsItems[existingIdx] = { ...nextWsItems[existingIdx], ...localeVals }
        } else {
          nextWsItems.push({ __rid: rid(), ...localeVals })
        }
      } else if (_source === 'custom') {
        const existingIdx = nextWsItems.findIndex((i) => i.__rid === __rid)
        if (existingIdx >= 0) {
          nextWsItems[existingIdx] = { ...nextWsItems[existingIdx], ...localeVals }
        }
      }
    }

    onWorkspaceChange(nextWsItems)
  }, [workspaceItems, enabledLocales, onWorkspaceChange])

  const [ctxMenu, setCtxMenu] = useState(null) // { x, y, row }

  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    const row = rowFromContextMenuEvent(e, rows)
    if (!row) return
    setCtxMenu({ x: e.clientX, y: e.clientY, row })
  }, [rows])

  const handleCtxRetranslate = useCallback(async () => {
    const { row } = ctxMenu ?? {}
    setCtxMenu(null)
    if (!row?.en?.trim()) return
    const translated = await translateRow(row, enabledLocales)
    const nextWsItems = [...workspaceItems]
    const { key, _source, __rid } = translated
    const localeVals = { key }
    for (const l of enabledLocales) localeVals[l.key] = translated[l.key] ?? ''
    if (_source === 'system' || _source === 'overridden') {
      const existingIdx = nextWsItems.findIndex((i) => i.key === key)
      if (existingIdx >= 0) {
        nextWsItems[existingIdx] = { ...nextWsItems[existingIdx], ...localeVals }
      } else {
        nextWsItems.push({ __rid: rid(), ...localeVals })
      }
    } else if (_source === 'custom') {
      const existingIdx = nextWsItems.findIndex((i) => i.__rid === __rid)
      if (existingIdx >= 0) nextWsItems[existingIdx] = { ...nextWsItems[existingIdx], ...localeVals }
    }
    onWorkspaceChange(nextWsItems)
  }, [ctxMenu, workspaceItems, enabledLocales, onWorkspaceChange])

  const handleCtxDelete = useCallback(() => {
    const { row } = ctxMenu ?? {}
    setCtxMenu(null)
    if (!row) return
    const { key, _source, __rid } = row
    if (_source === 'overridden') {
      // Remove workspace override — reverts to system default
      onWorkspaceChange(workspaceItems.filter((i) => i.key !== key))
    } else if (_source === 'custom') {
      onWorkspaceChange(workspaceItems.filter((i) => i.__rid !== __rid))
    }
  }, [ctxMenu, workspaceItems, onWorkspaceChange])

  const ctxItems = useMemo(() => {
    if (!ctxMenu) return []
    const { _source, en } = ctxMenu.row
    const items = [
      {
        type: 'item',
        id: 'retranslate',
        label: 'Re-translate',
        icon: 'translate',
        disabled: !en?.trim(),
        onClick: handleCtxRetranslate,
      },
    ]
    if (_source === 'overridden' || _source === 'custom') {
      items.push({ type: 'divider', id: 'd1' })
      items.push({
        type: 'item',
        id: 'delete',
        label: _source === 'overridden' ? 'Remove override' : 'Delete',
        icon: _source === 'overridden' ? 'undo' : 'delete',
        variant: 'destructive',
        onClick: handleCtxDelete,
      })
    }
    return items
  }, [ctxMenu, handleCtxRetranslate, handleCtxDelete])

  const columns = useMemo(() => [
    {
      key: 'key',
      name: 'Key',
      frozen: true,
      width: 260,
      resizable: true,
      renderCell: ({ row }) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--base-spacing-6)', minWidth: 0 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {row.key}
          </span>
          {row._source === 'overridden' && (
            <MessageBadge status="info" subtle size="sm" icon={null}>Override</MessageBadge>
          )}
          {row._source === 'custom' && (
            <MessageBadge status="neutral" subtle size="sm" icon={null}>Custom</MessageBadge>
          )}
        </span>
      ),
    },
    ...enabledLocales.map((locale) => ({
      key: locale.key,
      name: locale.label,
      renderEditCell: locale.dir === 'rtl' ? RtlEditor : textEditor,
      renderCell: locale.dir === 'rtl'
        ? ({ row }) => <span dir="rtl" lang={locale.key}>{row[locale.key]}</span>
        : undefined,
      resizable: true,
      width: 180,
    })),
  ], [enabledLocales])

  return (
    <Stack direction="column" gap="xs">
      <div
        style={{ blockSize: '60vh', minBlockSize: '320px' }}
        onContextMenu={handleContextMenu}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          rowKeyGetter={(r) => r.__rid}
          onRowsChange={handleRowsChange}
          defaultColumnOptions={{ resizable: true }}
        />
      </div>
      <Paragraph size="xs" color="muted">
        {rows.length} labels — double-click to edit, right-click for options.
        Editing a system label creates a workspace override visible in the Workspace tab.
      </Paragraph>
      <ContextMenu
        open={!!ctxMenu}
        x={ctxMenu?.x ?? 0}
        y={ctxMenu?.y ?? 0}
        items={ctxItems}
        onClose={() => setCtxMenu(null)}
        aria-label="Label options"
      />
    </Stack>
  )
}

// ── Project overrides grid ────────────────────────────────────────────────────

function buildProjectRows(labelOverrides, enabledLocales) {
  return Object.entries(labelOverrides ?? {}).map(([key, locales]) => ({
    __rid: key,
    key,
    ...Object.fromEntries(enabledLocales.map((l) => [l.key, locales[l.key] ?? ''])),
  }))
}

function rowsToOverrides(rows) {
  const overrides = {}
  for (const row of rows) {
    if (!row.key?.trim()) continue
    const locales = {}
    for (const [k, v] of Object.entries(row)) {
      if (k === '__rid' || k === 'key') continue
      if (v?.trim()) locales[k] = v
    }
    if (Object.keys(locales).length > 0) overrides[row.key] = locales
  }
  return overrides
}

function ProjectOverridesGrid({ project, enabledLocales, onUpdateProjectLabels, allKeyOptions }) {
  const [rows, setRows] = useState(() => buildProjectRows(project?.labelOverrides, enabledLocales))
  const [addOpen, setAddOpen] = useState(false)
  const [ctxMenu, setCtxMenu] = useState(null) // { x, y, row }

  useEffect(() => {
    setRows(buildProjectRows(project?.labelOverrides, enabledLocales))
  }, [project?.labelOverrides, enabledLocales])

  const handleRowsChange = useCallback((nextRows) => {
    setRows(nextRows)
    onUpdateProjectLabels(project.id, rowsToOverrides(nextRows))
  }, [project?.id, onUpdateProjectLabels])

  const handleDelete = useCallback((key) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.key !== key)
      onUpdateProjectLabels(project.id, rowsToOverrides(next))
      return next
    })
  }, [project?.id, onUpdateProjectLabels])

  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    const row = rowFromContextMenuEvent(e, rows)
    if (!row) return
    setCtxMenu({ x: e.clientX, y: e.clientY, row })
  }, [rows])

  const handleCtxRetranslate = useCallback(async () => {
    const { row } = ctxMenu ?? {}
    setCtxMenu(null)
    if (!row?.en?.trim()) return
    const translated = await translateRow(row, enabledLocales)
    const next = rows.map((r) => r.key === row.key ? { ...r, ...translated } : r)
    setRows(next)
    onUpdateProjectLabels(project.id, rowsToOverrides(next))
  }, [ctxMenu, rows, enabledLocales, project?.id, onUpdateProjectLabels])

  const handleCtxDelete = useCallback(() => {
    const key = ctxMenu?.row?.key
    setCtxMenu(null)
    if (!key) return
    handleDelete(key)
  }, [ctxMenu, handleDelete])

  const ctxItems = useMemo(() => ctxMenu ? [
    {
      type: 'item',
      id: 'retranslate',
      label: 'Re-translate',
      icon: 'translate',
      disabled: !ctxMenu.row.en?.trim(),
      onClick: handleCtxRetranslate,
    },
    { type: 'divider', id: 'd1' },
    {
      type: 'item',
      id: 'delete',
      label: 'Delete',
      icon: 'delete',
      variant: 'destructive',
      onClick: handleCtxDelete,
    },
  ] : [], [ctxMenu, handleCtxRetranslate, handleCtxDelete])

  const handleAdd = useCallback((item) => {
    setRows((prev) => {
      const next = [
        { __rid: item.key, ...item },
        ...prev.filter((r) => r.key !== item.key),
      ]
      onUpdateProjectLabels(project.id, rowsToOverrides(next))
      return next
    })
    setAddOpen(false)
  }, [project?.id, onUpdateProjectLabels])

  const columns = useMemo(() => [
    {
      key: 'key',
      name: 'Label key',
      frozen: true,
      width: 260,
      resizable: true,
    },
    ...enabledLocales.map((locale) => ({
      key: locale.key,
      name: locale.label,
      renderEditCell: locale.dir === 'rtl' ? RtlEditor : textEditor,
      renderCell: locale.dir === 'rtl'
        ? ({ row }) => <span dir="rtl" lang={locale.key}>{row[locale.key]}</span>
        : undefined,
      resizable: true,
      width: 180,
    })),
    {
      key: '__actions',
      name: '',
      width: 52,
      resizable: false,
      renderCell: ({ row }) => (
        <IconButton
          aria-label={`Remove override for ${row.key}`}
          icon="close"
          size="sm"
          onClick={() => handleDelete(row.key)}
        />
      ),
    },
  ], [enabledLocales, handleDelete])

  if (!project) {
    return (
      <MessageEmptyState
        scale="section"
        icon="folder_open"
        title="No project open"
        description="Open a project in the editor, then return here to add project-specific label overrides."
      />
    )
  }

  return (
    <Stack direction="column" gap="md">
      <Stack direction="row" align="start" justify="between" gap="sm" wrap>
        <Stack direction="column" gap="xs">
          <Paragraph size="sm">
            Overrides for <strong>{project.name}</strong>
          </Paragraph>
          <Paragraph size="xs" color="muted">
            These values replace workspace and system labels only within this project.
          </Paragraph>
        </Stack>
        <Button icon="add" size="sm" onClick={() => setAddOpen(true)}>
          Add override
        </Button>
      </Stack>

      {rows.length === 0 ? (
        <MessageEmptyState
          scale="card"
          icon="edit_note"
          title="No project overrides yet"
          description="Add a label override to customise a label for this project only."
          action={
            <Button icon="add" onClick={() => setAddOpen(true)}>
              Add override
            </Button>
          }
        />
      ) : (
        <Stack direction="column" gap="xs">
          <div
            style={{ blockSize: '50vh', minBlockSize: '240px' }}
            onContextMenu={handleContextMenu}
          >
            <DataGrid
              columns={columns}
              rows={rows}
              rowKeyGetter={(r) => r.__rid}
              onRowsChange={handleRowsChange}
              defaultColumnOptions={{ resizable: true }}
            />
          </div>
          <Paragraph size="xs" color="muted">
            {rows.length} project {rows.length === 1 ? 'override' : 'overrides'} — double-click to edit, right-click for options.
          </Paragraph>
        </Stack>
      )}

      <AddProjectOverrideDialog
        open={addOpen}
        locales={enabledLocales}
        existingKeys={new Set(rows.map((r) => r.key))}
        allKeyOptions={allKeyOptions}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
      <ContextMenu
        open={!!ctxMenu}
        x={ctxMenu?.x ?? 0}
        y={ctxMenu?.y ?? 0}
        items={ctxItems}
        onClose={() => setCtxMenu(null)}
        aria-label="Override options"
      />
    </Stack>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function LabelEditor({ onNavigate, projects = [], activeProjectId = null, onUpdateProjectLabels }) {
  const [data, setData] = useState(() => {
    const stored = getLabels()
    return { ...stored, items: withRid(stored.items) }
  })
  const [selectedRows, setSelectedRows] = useState(() => new Set())
  const [addOpen, setAddOpen] = useState(false)
  const [localesOpen, setLocalesOpen] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const firstRun = useRef(true)
  const saveTimer = useRef(null)

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null

  // Re-hydrate when cloud sync pushes an update
  useEffect(() => {
    hydrateLabels().then((incoming) => {
      setData({ ...incoming, items: withRid(incoming.items) })
    })
    return subscribeLabels((incoming) => {
      setData({ ...incoming, items: withRid(incoming.items) })
    })
  }, [])

  // Debounced save to localStorage (and therefore cloud sync)
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null
      saveLabels({ locales: data.locales, items: stripRid(data.items) })
    }, 600)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [data])

  const enabledLocales = useMemo(
    () => ALL_LOCALES.filter((l) => data.locales.includes(l.key)),
    [data.locales]
  )

  // Workspace tab grid columns (with row selection)
  const gridColumns = useMemo(() => [
    SelectColumn,
    {
      key: 'key',
      name: 'Key',
      renderEditCell: textEditor,
      resizable: true,
      width: 240,
      frozen: true,
    },
    ...enabledLocales.map((locale) => ({
      key: locale.key,
      name: locale.label,
      renderEditCell: locale.dir === 'rtl' ? RtlEditor : textEditor,
      renderCell: locale.dir === 'rtl'
        ? ({ row }) => <span dir="rtl" lang={locale.key}>{row[locale.key]}</span>
        : undefined,
      resizable: true,
      width: 180,
    })),
  ], [enabledLocales])

  const handleRowsChange = useCallback((rows) => {
    setData((prev) => ({ ...prev, items: rows }))
  }, [])

  // Called by AllLabelsGrid when a cell is edited — creates/updates workspace overrides
  const handleWorkspaceChange = useCallback((nextItems) => {
    setData((prev) => ({ ...prev, items: nextItems }))
  }, [])

  const handleAdd = useCallback((item) => {
    setData((prev) => ({ ...prev, items: [{ __rid: rid(), ...item }, ...prev.items] }))
  }, [])

  const handleDeleteSelected = useCallback(() => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((r) => !selectedRows.has(r.__rid)),
    }))
    setSelectedRows(new Set())
  }, [selectedRows])

  const handleTranslate = useCallback(async () => {
    setTranslating(true)
    setTranslateError(null)
    const targets = selectedRows.size > 0
      ? data.items.filter((r) => selectedRows.has(r.__rid))
      : data.items

    try {
      const translated = await Promise.all(targets.map((row) => translateRow(row, enabledLocales)))
      const translatedById = Object.fromEntries(translated.map((r) => [r.__rid, r]))
      setData((prev) => ({
        ...prev,
        items: prev.items.map((r) => translatedById[r.__rid] ?? r),
      }))
    } catch (e) {
      setTranslateError(e.message)
    } finally {
      setTranslating(false)
    }
  }, [data.items, enabledLocales, selectedRows])

  const handleExport = useCallback(() => {
    const payload = { locales: data.locales, items: stripRid(data.items) }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'labels.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  const handleLocaleToggle = useCallback((selected) => {
    const set = new Set(selected)
    setData((prev) => ({
      ...prev,
      locales: ALL_LOCALES.filter((l) => l.key === 'en' || set.has(l.key)).map((l) => l.key),
    }))
  }, [])

  const hasSelected = selectedRows.size > 0
  const hasMissing = data.items.some((row) =>
    enabledLocales.some((l) => l.key !== 'en' && !row[l.key]?.trim())
  )
  const translateLabel = hasSelected
    ? `Translate ${selectedRows.size} ${selectedRows.size === 1 ? 'label' : 'labels'}`
    : 'Translate all missing'

  // Key options for the project override dialog: system keys + custom workspace keys
  const allKeyOptions = useMemo(() => {
    const wsCustomKeys = data.items
      .filter((i) => !SYSTEM_KEY_SET.has(i.key))
      .map((i) => ({ value: i.key, label: i.key, subtext: i.en || 'Custom label' }))
    return [...SYSTEM_KEY_OPTIONS, ...wsCustomKeys]
  }, [data.items])

  // Workspace DataGrid context menu
  const [wsCtxMenu, setWsCtxMenu] = useState(null) // { x, y, row }

  const handleWsContextMenu = useCallback((e) => {
    e.preventDefault()
    const row = rowFromContextMenuEvent(e, data.items)
    if (!row) return
    setWsCtxMenu({ x: e.clientX, y: e.clientY, row })
  }, [data.items])

  const handleWsCtxRetranslate = useCallback(async () => {
    const { row } = wsCtxMenu ?? {}
    setWsCtxMenu(null)
    if (!row?.en?.trim()) return
    const translated = await translateRow(row, enabledLocales)
    setData((prev) => ({
      ...prev,
      items: prev.items.map((i) => i.__rid === row.__rid ? { ...i, ...translated } : i),
    }))
  }, [wsCtxMenu, enabledLocales])

  const handleWsCtxDelete = useCallback(() => {
    const { row } = wsCtxMenu ?? {}
    setWsCtxMenu(null)
    if (!row) return
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.__rid !== row.__rid),
    }))
    setSelectedRows((prev) => {
      const next = new Set(prev)
      next.delete(row.__rid)
      return next
    })
  }, [wsCtxMenu])

  const wsCtxItems = useMemo(() => wsCtxMenu ? [
    {
      type: 'item',
      id: 'retranslate',
      label: 'Re-translate',
      icon: 'translate',
      disabled: !wsCtxMenu.row.en?.trim(),
      onClick: handleWsCtxRetranslate,
    },
    { type: 'divider', id: 'd1' },
    {
      type: 'item',
      id: 'delete',
      label: 'Delete',
      icon: 'delete',
      variant: 'destructive',
      onClick: handleWsCtxDelete,
    },
  ] : [], [wsCtxMenu, handleWsCtxRetranslate, handleWsCtxDelete])

  const workspaceOverridesCount = data.items.filter((i) => SYSTEM_KEY_SET.has(i.key)).length
  const customCount = data.items.filter((i) => !SYSTEM_KEY_SET.has(i.key)).length
  const projectOverridesCount = Object.keys(activeProject?.labelOverrides ?? {}).length

  return (
    <>
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              {
                label: 'Home',
                href: '/',
                onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') },
              },
              { label: 'Label editor' },
            ]}
          />
          <Stack direction="row" justify="between" align="start" gap="sm" wrap>
            <Stack direction="column" gap="xs">
              <Heading as="h1" id="label-editor-heading" size={{ xs: 'lg', md: 'xxl' }}>
                Label editor
              </Heading>
              <Paragraph size="sm" color="muted">
                Manage workspace labels and translations. Labels sync across your team and can be referenced in pages and components.
              </Paragraph>
            </Stack>
            <Cluster gap="xs">
              <MessageBadge status="neutral" subtle size="sm" icon={null}>
                {SYSTEM_LABEL_ITEMS.length} system
              </MessageBadge>
              {workspaceOverridesCount > 0 && (
                <MessageBadge status="info" subtle size="sm" icon={null}>
                  {workspaceOverridesCount} {workspaceOverridesCount === 1 ? 'override' : 'overrides'}
                </MessageBadge>
              )}
              {customCount > 0 && (
                <MessageBadge status="neutral" subtle size="sm" icon={null}>
                  {customCount} custom
                </MessageBadge>
              )}
              {projectOverridesCount > 0 && (
                <MessageBadge status="success" subtle size="sm" icon={null}>
                  {projectOverridesCount} project
                </MessageBadge>
              )}
            </Cluster>
          </Stack>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl">
        <Stack direction="column" gap="md">

          {translateError && (
            <Banner status="error" onDismiss={() => setTranslateError(null)}>
              Translation error: {translateError}. Check your connection and try again.
            </Banner>
          )}

          {/* Global utilities */}
          <Stack direction="row" gap="sm" align="center" justify="end" wrap>
            <Cluster gap="sm">
              <Button
                variant="tertiary"
                icon="language"
                size="sm"
                onClick={() => setLocalesOpen((o) => !o)}
              >
                Languages
              </Button>
              <Button variant="tertiary" icon="download" size="sm" onClick={handleExport}>
                Export JSON
              </Button>
            </Cluster>
          </Stack>

          {/* Language configuration panel */}
          {localesOpen && (
            <Card>
              <Stack direction="column" gap="md">
                <Stack direction="column" gap="xs">
                  <Heading as="h2" size="sm">Enabled languages</Heading>
                  <Paragraph size="sm" color="muted">
                    Choose which languages are shown in the editor. English is always included.
                  </Paragraph>
                </Stack>
                <ChoiceGroup
                  multiple
                  size="compact"
                  columns={4}
                  value={data.locales.filter((k) => k !== 'en')}
                  onChange={handleLocaleToggle}
                  options={ALL_LOCALES
                    .filter((l) => l.key !== 'en')
                    .map((l) => ({
                      value: l.key,
                      label: l.label,
                      subtext: l.dir === 'rtl' ? 'Right-to-left' : undefined,
                    }))}
                />
                <Paragraph size="xs" color="muted">
                  The active locale for the workspace can be set in Settings. Arabic uses right-to-left text direction.
                </Paragraph>
              </Stack>
            </Card>
          )}

          {/* Tabbed label views */}
          <Tabs value={activeTab} onChange={setActiveTab} variant="line">
            <TabList>
              <Tab value="all" icon="list">All labels</Tab>
              <Tab value="workspace" icon="tune">Workspace</Tab>
              <Tab value="project" icon="folder_open">
                {activeProject ? activeProject.name : 'Project'}
              </Tab>
            </TabList>

            {/* ── All labels ────────────────────────────────────────── */}
            <TabPanel value="all">
              <Stack direction="column" gap="md">
                <Paragraph size="sm" color="muted">
                  All system labels with resolved values. Edit any cell to create a workspace override.
                  Overridden labels show a badge and appear in the Workspace tab.
                </Paragraph>
                <AllLabelsGrid
                  workspaceItems={data.items}
                  enabledLocales={enabledLocales}
                  onWorkspaceChange={handleWorkspaceChange}
                />
              </Stack>
            </TabPanel>

            {/* ── Workspace ─────────────────────────────────────────── */}
            <TabPanel value="workspace">
              <Stack direction="column" gap="md">
                <Stack direction="row" gap="sm" align="center" justify="between" wrap>
                  <Paragraph size="sm" color="muted">
                    Custom labels and workspace overrides that apply across all projects.
                  </Paragraph>
                  <Cluster gap="sm">
                    <Button icon="add" onClick={() => setAddOpen(true)}>
                      Add label
                    </Button>
                    <Button
                      variant="secondary"
                      icon="translate"
                      onClick={handleTranslate}
                      loading={translating}
                      disabled={translating || (!hasSelected && !hasMissing)}
                    >
                      {translateLabel}
                    </Button>
                    {hasSelected && (
                      <Button
                        variant="destructive"
                        size="sm"
                        icon="delete"
                        onClick={handleDeleteSelected}
                      >
                        Delete {selectedRows.size} {selectedRows.size === 1 ? 'label' : 'labels'}
                      </Button>
                    )}
                  </Cluster>
                </Stack>

                {data.items.length === 0 ? (
                  <MessageEmptyState
                    scale="section"
                    icon="translate"
                    title="No workspace labels yet"
                    description="Add a custom label or edit a system label in the All labels tab to create a workspace override."
                    action={
                      <Button icon="add" onClick={() => setAddOpen(true)}>
                        Add your first label
                      </Button>
                    }
                  />
                ) : (
                  <Stack direction="column" gap="xs">
                    <div
                      style={{ blockSize: '60vh', minBlockSize: '320px' }}
                      onContextMenu={handleWsContextMenu}
                    >
                      <DataGrid
                        columns={gridColumns}
                        rows={data.items}
                        rowKeyGetter={(r) => r.__rid}
                        onRowsChange={handleRowsChange}
                        selectedRows={selectedRows}
                        onSelectedRowsChange={setSelectedRows}
                        defaultColumnOptions={{ resizable: true }}
                      />
                    </div>
                    <Paragraph size="xs" color="muted">
                      {data.items.length} {data.items.length === 1 ? 'label' : 'labels'} — double-click to edit, right-click for options.
                    </Paragraph>
                  </Stack>
                )}
              </Stack>
            <ContextMenu
              open={!!wsCtxMenu}
              x={wsCtxMenu?.x ?? 0}
              y={wsCtxMenu?.y ?? 0}
              items={wsCtxItems}
              onClose={() => setWsCtxMenu(null)}
              aria-label="Label options"
            />
            </TabPanel>

            {/* ── Project overrides ──────────────────────────────────── */}
            <TabPanel value="project">
              <ProjectOverridesGrid
                project={activeProject}
                enabledLocales={enabledLocales}
                onUpdateProjectLabels={onUpdateProjectLabels ?? (() => {})}
                allKeyOptions={allKeyOptions}
              />
            </TabPanel>
          </Tabs>
        </Stack>
      </Section>

      <AddLabelDialog
        open={addOpen}
        locales={enabledLocales}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
    </>
  )
}

// ── Add workspace label dialog ────────────────────────────────────────────────

function AddLabelDialog({ open, locales, onClose, onAdd }) {
  const [labelKey, setLabelKey] = useState('')
  const [enValue, setEnValue] = useState('')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState(null)

  const systemMatch = labelKey ? SYSTEM_KEY_MAP[labelKey] : null

  useEffect(() => {
    if (open) { setLabelKey(''); setEnValue(''); setError(null) }
  }, [open])

  const handleKeyChange = useCallback((val) => {
    setLabelKey(val ?? '')
    const match = val ? SYSTEM_KEY_MAP[val] : null
    if (match?.en) setEnValue((prev) => prev || match.en)
  }, [])

  const handleSubmit = useCallback(async () => {
    const key = labelKey.trim()
    const en = enValue.trim()
    if (!key) { setError('A label key is required.'); return }
    setError(null)

    const baseItem = { key, en }

    if (autoTranslate && en) {
      setTranslating(true)
      try {
        const translated = await translateRow(baseItem, locales)
        onAdd(translated)
      } catch (e) {
        setError(`Translation failed: ${e.message}`)
        onAdd(baseItem)
      } finally {
        setTranslating(false)
      }
    } else {
      onAdd(baseItem)
    }

    onClose()
  }, [labelKey, enValue, autoTranslate, locales, onAdd, onClose])

  const canSubmit = labelKey.trim().length > 0 && !translating

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add label"
      footer={
        <Cluster gap="sm" justify="end">
          <Button variant="secondary" onClick={onClose} disabled={translating}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon="add"
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={translating}
          >
            Add label
          </Button>
        </Cluster>
      }
    >
      <Stack direction="column" gap="md">
        <Autocomplete
          label="Label key"
          hint="Dot-notation path, e.g. hero.title or button.save"
          options={SYSTEM_KEY_OPTIONS}
          value={labelKey}
          onChange={handleKeyChange}
          allowCreate
          onCreate={handleKeyChange}
          createLabel={(q) => `Use "${q}"`}
          emptyText="No matching system labels"
        />

        {systemMatch && (
          <Banner status="info">
            This key overrides the system label "{systemMatch.en}".
          </Banner>
        )}

        <TextField
          label="English value"
          hint="The default text for this label."
          value={enValue}
          onChange={(e) => setEnValue(e.target.value)}
        />

        {locales.some((l) => l.key !== 'en') && (
          <Switch
            label="Auto-translate to enabled languages"
            hint="Fills in translations using MyMemory. Requires an internet connection."
            checked={autoTranslate}
            onChange={setAutoTranslate}
          />
        )}

        {error && <Banner status="error">{error}</Banner>}
      </Stack>
    </Dialog>
  )
}

// ── Add project override dialog ───────────────────────────────────────────────

function AddProjectOverrideDialog({ open, locales, existingKeys, allKeyOptions, onClose, onAdd }) {
  const [labelKey, setLabelKey] = useState('')
  const [values, setValues] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) { setLabelKey(''); setValues({}); setError(null) }
  }, [open])

  const handleKeyChange = useCallback((val) => {
    setLabelKey(val ?? '')
    // Pre-fill with system defaults so the user only edits what differs
    const match = val ? SYSTEM_KEY_MAP[val] : null
    if (match) {
      const pre = {}
      for (const l of locales) pre[l.key] = match[l.key] ?? ''
      setValues(pre)
    }
  }, [locales])

  const handleSubmit = useCallback(() => {
    const key = labelKey.trim()
    if (!key) { setError('A label key is required.'); return }
    if (existingKeys.has(key)) { setError('This key already has a project override.'); return }
    setError(null)
    const item = { key }
    for (const l of locales) item[l.key] = values[l.key] ?? ''
    onAdd(item)
  }, [labelKey, existingKeys, locales, values, onAdd])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add project override"
      footer={
        <Cluster gap="sm" justify="end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            icon="add"
            onClick={handleSubmit}
            disabled={!labelKey.trim()}
          >
            Add override
          </Button>
        </Cluster>
      }
    >
      <Stack direction="column" gap="md">
        <Autocomplete
          label="Label key"
          hint="Pick a system or workspace label key to override for this project."
          options={allKeyOptions}
          value={labelKey}
          onChange={handleKeyChange}
          allowCreate
          onCreate={handleKeyChange}
          createLabel={(q) => `Use "${q}"`}
          emptyText="No matching labels"
        />

        {locales.map((locale) => (
          <TextField
            key={locale.key}
            label={locale.label}
            hint={locale.dir === 'rtl' ? 'Right-to-left text' : undefined}
            value={values[locale.key] ?? ''}
            onChange={(e) => setValues((prev) => ({ ...prev, [locale.key]: e.target.value }))}
          />
        ))}

        {error && <Banner status="error">{error}</Banner>}
      </Stack>
    </Dialog>
  )
}
