import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  Banner,
  Breadcrumb,
  Button,
  Card,
  ChoiceGroup,
  Cluster,
  Code,
  Dialog,
  Heading,
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
  SearchField,
  Autocomplete,
  ButtonContainer,
} from '@gtivr4/a1-design-system-react'
import { DataGrid, SelectColumn, textEditor } from '@gtivr4/a1-design-system-react/components/data-grid/DataGrid.jsx'
import { useT } from '../labels/useT.js'
import { getLabels, saveLabels, subscribeLabels } from '../labels/labelStore.js'
import { appendHistory, fetchHistory, updateHistoryLabel } from '../services/historyDb.js'
import { EditorHistoryPanel } from '../editor/EditorHistoryPanel.jsx'
import appJson       from '../../../../system/labels/app.json'
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

// ── System label key suggestions ─────────────────────────────────────────────

function flattenSystemKeys(obj, prefix = '') {
  const out = []
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$') || k === 'locale') continue
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') {
      if ('$value' in v) {
        const localeVals = {}
        if (v.locale && typeof v.locale === 'object') {
          for (const [lk, lv] of Object.entries(v.locale)) {
            localeVals[lk] = String(lv ?? '')
          }
        }
        out.push({ key: path, en: String(v.$value ?? ''), description: v.$description ?? '', ...localeVals })
      } else {
        out.push(...flattenSystemKeys(v, path))
      }
    }
  }
  return out
}

const SYSTEM_KEYS = [
  ...flattenSystemKeys(appJson.label),
  ...flattenSystemKeys(actionJson.label),
  ...flattenSystemKeys(backlogJson.label),
  ...flattenSystemKeys(calendarJson.label),
  ...flattenSystemKeys(codeJson.label),
  ...flattenSystemKeys(fieldJson.label),
  ...flattenSystemKeys(statusBarJson.label),
]

const SYSTEM_KEY_OPTIONS = SYSTEM_KEYS.map((l) => ({
  value: l.key,
  label: l.key,
  subtext: l.description || l.en,
}))

const SYSTEM_KEY_MAP = Object.fromEntries(SYSTEM_KEYS.map((l) => [l.key, l]))

// ── Local history (localStorage) ─────────────────────────────────────────────
// Cloud history (Supabase) is layered on top when available. Local history
// means the tab works immediately without sign-in or Supabase config.

const LOCAL_HISTORY_KEY = 'a1-label-history-v1'
const LOCAL_HISTORY_LIMIT = 50

function loadLocalHistory() {
  try { return JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) ?? '[]') } catch { return [] }
}

function saveLocalHistory(entries) {
  try { localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(entries.slice(-LOCAL_HISTORY_LIMIT))) } catch {}
}

function appendLocalHistory(label, snapshot) {
  const entries = loadLocalHistory()
  const entry = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label,
    timestamp: new Date().toISOString(),
    json: snapshot,
    userEmail: null,
  }
  entries.push(entry)
  saveLocalHistory(entries)
  return entries
}

// ── Cloud history row mapper ──────────────────────────────────────────────────

function mapHistoryRow(r) {
  return {
    id: r.id,
    label: r.label,
    timestamp: r.created_at,
    json: r.snapshot,
    userEmail: r.user_email,
  }
}

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

// ── Main page ─────────────────────────────────────────────────────────────────

export function LabelEditor({ onNavigate }) {
  const t = useT()
  const [data, setData] = useState(() => {
    const stored = getLabels()
    return { ...stored, items: withRid(stored.items) }
  })
  const [selectedRows, setSelectedRows] = useState(() => new Set())
  const [addOpen, setAddOpen] = useState(false)
  const [viewJsonOpen, setViewJsonOpen] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState(null)
  const [historyEntries, setHistoryEntries] = useState([])
  const firstRun = useRef(true)
  const saveTimer = useRef(null)
  const histTimer = useRef(null)

  // Re-hydrate when cloud sync pushes an update
  useEffect(() => {
    return subscribeLabels((incoming) => {
      setData({ ...incoming, items: withRid(incoming.items) })
    })
  }, [])

  // Load local history immediately; replace with cloud entries if available
  useEffect(() => {
    setHistoryEntries(loadLocalHistory())
    fetchHistory('labels', 'workspace').then((rows) => {
      if (rows.length > 0) setHistoryEntries(rows.map(mapHistoryRow))
    })
  }, [])

  // Debounced save (600ms) + debounced history append (4s)
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null
      saveLabels({ locales: data.locales, items: stripRid(data.items) })
    }, 600)
    if (histTimer.current) clearTimeout(histTimer.current)
    histTimer.current = setTimeout(() => {
      histTimer.current = null
      const clean = { locales: data.locales, items: stripRid(data.items) }
      const snapshot = JSON.stringify(clean)
      const histLabel = `Edited labels`
      // Always write to local history
      const localEntries = appendLocalHistory(histLabel, snapshot)
      setHistoryEntries(localEntries)
      // Also write to cloud when signed in
      appendHistory({ entityType: 'labels', entityId: 'workspace', label: histLabel, snapshot })
        .then(() => fetchHistory('labels', 'workspace'))
        .then((rows) => { if (rows.length > 0) setHistoryEntries(rows.map(mapHistoryRow)) })
    }, 4000)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      if (histTimer.current) clearTimeout(histTimer.current)
    }
  }, [data])

  const enabledLocales = useMemo(
    () => ALL_LOCALES.filter((l) => data.locales.includes(l.key)),
    [data.locales]
  )

  const gridColumns = useMemo(() => [
    SelectColumn,
    {
      key: 'key',
      name: t('app.labelEditor.columnKey', 'Key'),
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

  const jsonString = useMemo(() => {
    if (!viewJsonOpen) return ''
    return JSON.stringify({ locales: data.locales, items: stripRid(data.items) }, null, 2)
  }, [viewJsonOpen, data])

  // System labels — all keys from JSON files not yet overridden in the workspace
  const systemRows = useMemo(() => {
    const workspaceKeys = new Set(data.items.map((i) => i.key))
    return SYSTEM_KEYS.filter((k) => !workspaceKeys.has(k.key))
  }, [data.items])

  const handleOverride = useCallback((systemRow) => {
    // eslint-disable-next-line no-unused-vars
    const { description, ...item } = systemRow
    setData((prev) => ({
      ...prev,
      items: [{ __rid: rid(), ...item }, ...prev.items],
    }))
  }, [])

  // When a cell is edited in the system grid, auto-promote only the changed row
  // DataGrid passes the full rows array — we detect the changed row by comparing
  // each row's values against the original system key map entry.
  const handleSystemRowChange = useCallback((updatedRows) => {
    setData((prev) => {
      const workspaceKeys = new Set(prev.items.map((i) => i.key))
      const newItems = [...prev.items]
      for (const row of updatedRows) {
        const original = SYSTEM_KEY_MAP[row.key]
        if (!original) continue
        // Only promote if at least one locale value actually changed
        const hasChange = Object.keys(row).some(
          (k) => k !== 'description' && (row[k] ?? '') !== (original[k] ?? '')
        )
        if (!hasChange) continue
        // eslint-disable-next-line no-unused-vars
        const { description, ...item } = row
        if (workspaceKeys.has(item.key)) {
          const idx = newItems.findIndex((i) => i.key === item.key)
          if (idx !== -1) newItems[idx] = { ...newItems[idx], ...item }
        } else {
          newItems.unshift({ __rid: rid(), ...item })
        }
      }
      return { ...prev, items: newItems }
    })
  }, [])

  const systemGridColumns = useMemo(() => [
    {
      key: 'key',
      name: t('app.labelEditor.columnKey', 'Key'),
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
    {
      key: '__action',
      name: '',
      width: 120,
      renderCell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--base-spacing-4)' }}>
          <Button size="sm" variant="secondary" onClick={() => handleOverride(row)}>{t('app.labelEditor.copyAll', 'Copy all')}</Button>
        </div>
      ),
    },
  ], [enabledLocales, handleOverride])

  const handleHistoryRestore = useCallback((entryId) => {
    const entry = historyEntries.find((e) => e.id === entryId)
    if (!entry?.json) return
    try {
      const snapshot = JSON.parse(entry.json)
      setData({ ...snapshot, items: withRid(snapshot.items) })
      const restoreLabel = `Restored to "${entry.label}"`
      const localEntries = appendLocalHistory(restoreLabel, entry.json)
      setHistoryEntries(localEntries)
      appendHistory({ entityType: 'labels', entityId: 'workspace', label: restoreLabel, snapshot: entry.json })
        .then(() => fetchHistory('labels', 'workspace'))
        .then((rows) => { if (rows.length > 0) setHistoryEntries(rows.map(mapHistoryRow)) })
    } catch { /* ignore parse errors */ }
  }, [historyEntries])

  const handleHistoryRename = useCallback((entryId, label) => {
    const local = loadLocalHistory().map((e) => e.id === entryId ? { ...e, label } : e)
    saveLocalHistory(local)
    setHistoryEntries(local)
    updateHistoryLabel(entryId, label)
  }, [])

  const [activeTab, setActiveTab] = useState('workspace')
  const [search, setSearch] = useState('')

  const filteredWorkspaceRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data.items
    return data.items.filter((row) =>
      Object.values(row).some((v) => typeof v === 'string' && v.toLowerCase().includes(q))
    )
  }, [data.items, search])

  const filteredSystemRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return systemRows
    return systemRows.filter((row) =>
      Object.values(row).some((v) => typeof v === 'string' && v.toLowerCase().includes(q))
    )
  }, [systemRows, search])

  const hasSelected = selectedRows.size > 0
  const hasMissing = data.items.some((row) =>
    enabledLocales.some((l) => l.key !== 'en' && !row[l.key]?.trim())
  )
  const n = selectedRows.size
  const translateLabel = hasSelected
    ? `${t('app.labelEditor.translatePrefix', 'Translate')} ${n} ${n === 1 ? t('app.labelEditor.labelSingular', 'label') : t('app.labelEditor.labelPlural', 'labels')}`
    : t('app.labelEditor.translateAllMissing', 'Translate all missing')

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
                label: t('app.labelEditor.breadcrumbHome', 'Home'),
                href: '/',
                onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') },
              },
              { label: t('app.labelEditor.pageTitle', 'Label editor') },
            ]}
          />
          <Stack direction="row" justify="between" align="start" gap="sm" wrap>
            <Stack direction="column" gap="xs">
              <Heading as="h1" id="label-editor-heading" size={{ xs: 'lg', md: 'xxl' }}>
                {t('app.labelEditor.pageTitle', 'Label editor')}
              </Heading>
              <Paragraph size="sm" color="muted">
                {t('app.labelEditor.pageDescription', 'Manage workspace labels and translations. Labels sync across your team and can be referenced in pages and components.')}
              </Paragraph>
            </Stack>
            <MessageBadge status="info" subtle size="sm" icon="translate">
              {data.items.length} {t('app.labelEditor.badgeWorkspace', 'workspace')} · {SYSTEM_KEYS.length} {t('app.labelEditor.badgeSystem', 'system')}
            </MessageBadge>
          </Stack>
        </Stack>
        <ButtonContainer>
          <Button icon="add" onClick={() => setAddOpen(true)}>
            {t('app.labelEditor.addLabel', 'Add label')}
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
        </ButtonContainer>
      </Section>

      <Section padding="sm" contentWidth="xl">
        <Stack direction="column" gap="md">

          {translateError && (
            <Banner status="error" onDismiss={() => setTranslateError(null)}>
              {t('app.labelEditor.translateError', 'Translation error')}: {translateError}. {t('app.labelEditor.checkConnection', 'Check your connection and try again.')}
            </Banner>
          )}

          <SearchField
            aria-label={t('app.labelEditor.searchAriaLabel', 'Search labels')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            size="compact"
          />

          <Tabs value={activeTab} onChange={setActiveTab} variant="line">
            <TabList>
              <Tab value="workspace" count={filteredWorkspaceRows.length}>{t('app.labelEditor.tabWorkspace', 'Workspace')}</Tab>
              <Tab value="system" count={filteredSystemRows.length}>{t('app.labelEditor.tabSystem', 'System')}</Tab>
              <Tab value="history" icon="history">{t('app.labelEditor.tabHistory', 'History')}</Tab>
            </TabList>

          <TabPanel value="workspace">
            <Stack direction="column" gap="md">
              {/* Workspace actions */}
              <Stack direction="row" gap="sm" align="center" justify="between" wrap>
                <Cluster gap="sm">
                  {hasSelected && (
                    <Button
                      variant="destructive"
                      size="sm"
                      icon="delete"
                      onClick={handleDeleteSelected}
                    >
                      {t('app.labelEditor.deletePrefix', 'Delete')} {selectedRows.size} {selectedRows.size === 1 ? t('app.labelEditor.labelSingular', 'label') : t('app.labelEditor.labelPlural', 'labels')}
                    </Button>
                  )}
                  <Button variant="tertiary" icon="data_object" size="sm" onClick={() => setViewJsonOpen(true)}>
                    {t('app.labelEditor.viewAsJson', 'View as JSON')}
                  </Button>
                </Cluster>
              </Stack>

              {/* Workspace label grid */}
              {data.items.length === 0 ? (
                <MessageEmptyState
                  scale="section"
                  icon="translate"
                  title={t('app.labelEditor.emptyTitle', 'No workspace labels yet')}
                  description={t('app.labelEditor.emptyDescription', 'Add a label to override a system default, or create a custom label for pages and components. Use the System tab to browse all built-in labels.')}
                  action={
                    <Button icon="add" onClick={() => setAddOpen(true)}>
                      {t('app.labelEditor.addFirstLabel', 'Add your first label')}
                    </Button>
                  }
                />
              ) : (
                <Stack direction="column" gap="xs">
                  <div style={{ blockSize: '60vh', minBlockSize: '320px' }}>
                    <DataGrid
                      columns={gridColumns}
                      rows={filteredWorkspaceRows}
                      rowKeyGetter={(r) => r.__rid}
                      onRowsChange={handleRowsChange}
                      selectedRows={selectedRows}
                      onSelectedRowsChange={setSelectedRows}
                      defaultColumnOptions={{ resizable: true }}
                    />
                  </div>
                  <Paragraph size="xs" color="muted">
                    {filteredWorkspaceRows.length === data.items.length
                      ? `${data.items.length} ${data.items.length === 1 ? t('app.labelEditor.labelSingular', 'label') : t('app.labelEditor.labelPlural', 'labels')}`
                      : `${filteredWorkspaceRows.length} of ${data.items.length} ${t('app.labelEditor.labelPlural', 'labels')}`} — {t('app.labelEditor.doubleClickToEdit', 'double-click a cell to edit')}.
                  </Paragraph>
                </Stack>
              )}
            </Stack>
          </TabPanel>

          <TabPanel value="system">
            <Stack direction="column" gap="md">
              <Paragraph size="sm" color="muted">
                {t('app.labelEditor.systemDescription', 'Built-in defaults from the design system JSON files. Double-click any translation cell to edit — it automatically creates a workspace override. Use Copy all to promote all translations at once.')}
              </Paragraph>
              <div style={{ blockSize: '60vh', minBlockSize: '320px' }}>
                <DataGrid
                  columns={systemGridColumns}
                  rows={filteredSystemRows}
                  rowKeyGetter={(r) => r.key}
                  onRowsChange={handleSystemRowChange}
                  defaultColumnOptions={{ resizable: true }}
                />
              </div>
              <Paragraph size="xs" color="muted">
                {filteredSystemRows.length === systemRows.length
                  ? `${systemRows.length} ${systemRows.length === 1 ? t('app.labelEditor.systemLabelSingular', 'system label') : t('app.labelEditor.systemLabelPlural', 'system labels')}`
                  : `${filteredSystemRows.length} of ${systemRows.length} ${t('app.labelEditor.systemLabelPlural', 'system labels')}`} — {SYSTEM_KEYS.length - systemRows.length} {t('app.labelEditor.overriddenInWorkspace', 'overridden in workspace')}.
              </Paragraph>
            </Stack>
          </TabPanel>
          <TabPanel value="history">
            {historyEntries.length === 0 ? (
              <Paragraph size="sm" color="muted">
                {t('app.labelEditor.historyEmpty', 'No history yet. Make a change and wait a moment for it to be recorded.')}
              </Paragraph>
            ) : (
              <EditorHistoryPanel
                entries={historyEntries}
                currentIndex={historyEntries.length - 1}
                onRestore={handleHistoryRestore}
                onRename={handleHistoryRename}
              />
            )}
          </TabPanel>
          </Tabs>

        </Stack>
      </Section>

      <Dialog
        open={viewJsonOpen}
        onClose={() => setViewJsonOpen(false)}
        title={t('app.labelEditor.jsonDialogTitle', 'Labels JSON')}
        footer={
          <Cluster gap="sm" justify="end">
            <Button variant="secondary" icon="download" onClick={handleExport}>
              {t('app.labelEditor.downloadJson', 'Download')}
            </Button>
            <Button onClick={() => setViewJsonOpen(false)}>
              {t('app.labelEditor.close', 'Close')}
            </Button>
          </Cluster>
        }
      >
        <Code variant="block" copyCode collapsible collapsedLines={15}>{jsonString}</Code>
      </Dialog>

      <AddLabelDialog
        open={addOpen}
        locales={enabledLocales}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
    </>
  )
}

// ── Add label dialog ──────────────────────────────────────────────────────────

function AddLabelDialog({ open, locales, onClose, onAdd }) {
  const t = useT()
  const [labelKey, setLabelKey] = useState('')
  const [enValue, setEnValue] = useState('')
  const [prefillLocales, setPrefillLocales] = useState({})
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState(null)

  const systemMatch = labelKey ? SYSTEM_KEY_MAP[labelKey] : null

  useEffect(() => {
    if (open) { setLabelKey(''); setEnValue(''); setPrefillLocales({}); setError(null) }
  }, [open])

  const handleKeyChange = useCallback((val) => {
    setLabelKey(val ?? '')
    const match = val ? SYSTEM_KEY_MAP[val] : null
    if (match) {
      if (match.en) setEnValue((prev) => prev || match.en)
      // Pre-fill locale translations that are already defined in the system key so
      // translateRow skips them (it only fills empty locales).
      const fills = {}
      for (const locale of locales) {
        if (locale.key !== 'en' && match[locale.key]) fills[locale.key] = match[locale.key]
      }
      setPrefillLocales(fills)
    } else {
      setPrefillLocales({})
    }
  }, [locales])

  const handleSubmit = useCallback(async () => {
    const key = labelKey.trim()
    const en = enValue.trim()
    if (!key) { setError(t('app.labelEditor.errorKeyRequired', 'A label key is required.')); return }
    setError(null)

    // Seed with any locale values already known from the system key
    const baseItem = { key, en, ...prefillLocales }

    if (autoTranslate && en) {
      setTranslating(true)
      try {
        const translated = await translateRow(baseItem, locales)
        onAdd(translated)
      } catch (e) {
        setError(`${t('app.labelEditor.errorTranslateFailed', 'Translation failed')}: ${e.message}`)
        onAdd(baseItem)
      } finally {
        setTranslating(false)
      }
    } else {
      onAdd(baseItem)
    }

    onClose()
  }, [labelKey, enValue, prefillLocales, autoTranslate, locales, onAdd, onClose])

  const canSubmit = labelKey.trim().length > 0 && !translating

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('app.labelEditor.addLabel', 'Add label')}
      footer={
        <Cluster gap="sm" justify="end">
          <Button variant="secondary" onClick={onClose} disabled={translating}>
            {t('app.labelEditor.cancel', 'Cancel')}
          </Button>
          <Button
            variant="primary"
            icon="add"
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={translating}
          >
            {t('app.labelEditor.addLabel', 'Add label')}
          </Button>
        </Cluster>
      }
    >
      <Stack direction="column" gap="md">
        <Autocomplete
          label={t('app.labelEditor.fieldKey', 'Label key')}
          hint={t('app.labelEditor.fieldKeyHint', 'Dot-notation path, e.g. hero.title or button.save')}
          options={SYSTEM_KEY_OPTIONS}
          value={labelKey}
          onChange={handleKeyChange}
          allowCreate
          onCreate={handleKeyChange}
          createLabel={(q) => `${t('app.labelEditor.useKey', 'Use')} "${q}"`}
          emptyText={t('app.labelEditor.noMatchingKeys', 'No matching system labels')}
        />

        {systemMatch && (
          <Banner status="info">
            {t('app.labelEditor.overrideNotice', 'This key overrides the system label')} &ldquo;{systemMatch.en}&rdquo;.
          </Banner>
        )}

        <TextField
          label={t('app.labelEditor.fieldEnValue', 'English value')}
          hint={t('app.labelEditor.fieldEnValueHint', 'The default text for this label.')}
          value={enValue}
          onChange={(e) => setEnValue(e.target.value)}
        />

        {locales.some((l) => l.key !== 'en') && (
          <Switch
            label={t('app.labelEditor.autoTranslateLabel', 'Auto-translate to enabled languages')}
            hint={t('app.labelEditor.autoTranslateHint', 'Fills in translations using MyMemory. Requires an internet connection.')}
            checked={autoTranslate}
            onChange={setAutoTranslate}
          />
        )}

        {error && <Banner status="error">{error}</Banner>}
      </Stack>
    </Dialog>
  )
}
