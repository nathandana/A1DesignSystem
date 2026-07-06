import { useEffect, useMemo, useRef, useState } from 'react'
import { Banner, Button, ButtonContainer, DataTable, Dialog, IconButton, Menu, MenuItem, MenuSection, MessageEmptyState, Paragraph, Stack, TextField } from '@gtivr4/a1-design-system-react'
import { getLabels, hydrateLabels, saveLabels, subscribeLabels } from '../labels/labelStore.js'
import appJson from '../../../../system/labels/app.json'
import actionJson from '../../../../system/labels/action.json'
import backlogJson from '../../../../system/labels/backlog.json'
import calendarJson from '../../../../system/labels/calendar.json'
import codeJson from '../../../../system/labels/code.json'
import fieldJson from '../../../../system/labels/field.json'
import overlayJson from '../../../../system/labels/overlay.json'
import statusBarJson from '../../../../system/labels/status-bar.json'
import treeMenuJson from '../../../../system/labels/tree-menu.json'

function flattenSystemLabels(obj, prefix = '') {
  const out = []
  for (const [k, v] of Object.entries(obj ?? {})) {
    if (k.startsWith('$') || k === 'locale') continue
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') {
      if ('$value' in v) {
        out.push({
          key: path,
          value: String(v.$value ?? ''),
          description: v.$description ?? '',
          source: 'System',
        })
      } else {
        out.push(...flattenSystemLabels(v, path))
      }
    }
  }
  return out
}

const SYSTEM_LABEL_OPTIONS = [
  ...flattenSystemLabels(appJson.label.app, 'app'),
  ...flattenSystemLabels(actionJson.label.action, 'action'),
  ...flattenSystemLabels(backlogJson.label.backlog, 'backlog'),
  ...flattenSystemLabels(calendarJson.label.calendar, 'calendar'),
  ...flattenSystemLabels(codeJson.label.code, 'code'),
  ...flattenSystemLabels(fieldJson.label.field, 'field'),
  ...flattenSystemLabels(overlayJson.label.overlay, 'overlay'),
  ...flattenSystemLabels(statusBarJson.label.statusBar, 'statusBar'),
  ...flattenSystemLabels(treeMenuJson.label.treeMenu, 'treeMenu'),
]

const TRANSLATE_LANG = { zh: 'zh-CN' }

const LABEL_LOOKUP_COLUMNS = [
  { key: 'key', label: 'Key', sortable: true },
  { key: 'source', label: 'Source', type: 'badge', statusMap: { System: 'neutral', Workspace: 'info', 'Workspace override': 'success' } },
  { key: 'value', label: 'English value' },
  { key: 'description', label: 'Description' },
]

const LABEL_LOOKUP_SEARCH_COLUMNS = [
  { key: 'key', label: 'Key' },
  { key: 'value', label: 'English value' },
  { key: 'description', label: 'Description' },
  { key: 'source', label: 'Source' },
]

function labelOptionSubtext(item) {
  return [item.source, item.description || item.value].filter(Boolean).join(' - ')
}

function slugSegment(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function suggestLabelKey(sourceText, prefix = 'content', existingKeys = new Set()) {
  const base = slugSegment(sourceText) || 'label'
  const cleanPrefix = String(prefix || 'content').replace(/[^a-zA-Z0-9.]+/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '') || 'content'
  let key = `${cleanPrefix}.${base}`
  let counter = 2
  while (existingKeys.has(key)) {
    key = `${cleanPrefix}.${base}${counter}`
    counter += 1
  }
  return key
}

async function translateOne(text, targetLocale) {
  if (!text?.trim()) return ''
  const lang = TRANSLATE_LANG[targetLocale] ?? targetLocale
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`,
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (json.responseStatus === 200) return json.responseData?.translatedText ?? ''
  throw new Error(json.responseDetails ?? 'Translation failed')
}

async function translateValues(values, locales) {
  const src = values.en?.trim()
  if (!src) return values
  const result = { ...values }
  await Promise.all(
    locales
      .filter((locale) => locale !== 'en' && !values[locale]?.trim())
      .map(async (locale) => {
        result[locale] = await translateOne(src, locale)
      }),
  )
  return result
}

function useLabelLookupOptions() {
  const [workspaceLabels, setWorkspaceLabels] = useState(() => getLabels())

  useEffect(() => {
    hydrateLabels().then(setWorkspaceLabels)
    return subscribeLabels(setWorkspaceLabels)
  }, [])

  return useMemo(() => {
    const map = new Map()
    for (const item of SYSTEM_LABEL_OPTIONS) map.set(item.key, item)
    for (const item of workspaceLabels.items ?? []) {
      if (!item.key) continue
      map.set(item.key, {
        key: item.key,
        value: item.en ?? '',
        description: '',
        source: map.has(item.key) ? 'Workspace override' : 'Workspace',
      })
    }
    return [...map.values()]
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((item) => ({
        id: item.key,
        key: item.key,
        source: item.source,
        value: item.value,
        description: item.description,
        summary: labelOptionSubtext(item),
      }))
  }, [workspaceLabels])
}

export function LabelLookupDialog({ open, value, onChange, onClose }) {
  const [selectedKey, setSelectedKey] = useState(value ?? '')
  const options = useLabelLookupOptions()

  useEffect(() => {
    if (open) setSelectedKey(value ?? '')
  }, [open, value])

  const selectedOption = options.find((option) => option.id === selectedKey)

  function handleSelectionChange(ids) {
    const next = ids[ids.length - 1] ?? ''
    setSelectedKey(next)
  }

  function applySelection() {
    const option = selectedOption ?? options.find((item) => item.id === selectedKey)
    const key = option?.key || selectedKey
    if (!key) return
    onChange(key, option ?? null)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Choose label"
      size="lg"
      footer={
        <ButtonContainer align="end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={applySelection} disabled={!selectedKey}>Use label</Button>
        </ButtonContainer>
      }
    >
      <Stack gap="md">
        {options.length > 0 ? (
          <>
            <DataTable
              caption="Labels"
              size="compact"
              searchableColumns={LABEL_LOOKUP_SEARCH_COLUMNS}
              selectable
              selectedRowIds={selectedKey ? [selectedKey] : []}
              onSelectedRowIdsChange={handleSelectionChange}
              columns={LABEL_LOOKUP_COLUMNS}
              rows={options}
              getRowId={(row) => row.id}
              pageSize={8}
              emptyTitle="No labels found"
              emptyDescription="Try a different key, value, description, or source."
              emptyIcon="search_off"
            />
            {selectedOption && (
              <Stack gap="xs">
                <Paragraph size="sm">{selectedOption.key}</Paragraph>
                {selectedOption.summary && (
                  <Paragraph size="xs" color="muted">{selectedOption.summary}</Paragraph>
                )}
              </Stack>
            )}
          </>
        ) : (
          <MessageEmptyState
            scale="card"
            icon="translate"
            title="No labels available"
            description="Add labels in the Label editor, then return here to select one."
          />
        )}
      </Stack>
    </Dialog>
  )
}

function AddLabelDialog({ open, sourceText = '', suggestedKeyPrefix = 'content', onAdd, onClose }) {
  const [labelsData, setLabelsData] = useState(() => getLabels())
  const locales = useMemo(() => labelsData.locales?.length ? labelsData.locales : ['en'], [labelsData.locales])
  const existingKeys = useMemo(() => new Set(labelsData.items?.map((item) => item.key).filter(Boolean)), [labelsData.items])
  const [labelKey, setLabelKey] = useState('')
  const [values, setValues] = useState({ en: '' })
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    let active = true
    hydrateLabels().then((data) => {
      if (!active) return
      const nextData = data ?? getLabels()
      const nextLocales = nextData.locales?.length ? nextData.locales : ['en']
      const nextExistingKeys = new Set(nextData.items?.map((item) => item.key).filter(Boolean))
      setLabelsData(nextData)
      setLabelKey(suggestLabelKey(sourceText, suggestedKeyPrefix, nextExistingKeys))
      setValues(Object.fromEntries(nextLocales.map((locale) => [locale, locale === 'en' ? sourceText : ''])))
      setError('')
    })
    return () => { active = false }
  }, [open, sourceText, suggestedKeyPrefix])

  async function handleAutoTranslate() {
    setError('')
    setTranslating(true)
    try {
      setValues(await translateValues(values, locales))
    } catch (err) {
      setError(`Translation failed: ${err.message}`)
    } finally {
      setTranslating(false)
    }
  }

  function handleSubmit() {
    const key = labelKey.trim()
    const en = values.en?.trim() ?? ''
    if (!key) { setError('A label key is required.'); return }
    if (!en) { setError('An English value is required.'); return }

    const item = { key, ...Object.fromEntries(locales.map((locale) => [locale, values[locale]?.trim() ?? ''])) }
    const current = getLabels()
    const currentItems = current.items ?? []
    const existingIndex = currentItems.findIndex((entry) => entry.key === key)
    const items = existingIndex >= 0
      ? currentItems.map((entry, index) => index === existingIndex ? { ...entry, ...item } : entry)
      : [...currentItems, item]
    const nextData = { locales: current.locales ?? locales, items }
    saveLabels(nextData)
    onAdd(item)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add label"
      footer={
        <ButtonContainer align="end">
          <Button variant="secondary" onClick={onClose} disabled={translating}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={translating || !labelKey.trim() || !values.en?.trim()}>Add label</Button>
        </ButtonContainer>
      }
    >
      <Stack gap="md">
        <TextField
          label="Label key"
          hint="Suggested from the selected text. Use dot notation."
          value={labelKey}
          onChange={(event) => setLabelKey(event.target.value)}
        />
        <TextField
          label="English value"
          value={values.en ?? ''}
          onChange={(event) => setValues((current) => ({ ...current, en: event.target.value }))}
        />
        {locales.length > 1 && (
          <>
            <Button variant="secondary" icon="translate" onClick={handleAutoTranslate} loading={translating} disabled={!values.en?.trim()}>
              Auto translate
            </Button>
            {locales.filter((locale) => locale !== 'en').map((locale) => (
              <TextField
                key={locale}
                label={locale}
                value={values[locale] ?? ''}
                onChange={(event) => setValues((current) => ({ ...current, [locale]: event.target.value }))}
              />
            ))}
          </>
        )}
        {existingKeys.has(labelKey.trim()) && (
          <Banner status="info">This will update the existing workspace label.</Banner>
        )}
        {error && <Banner status="error">{error}</Banner>}
      </Stack>
    </Dialog>
  )
}

export function LabelLookupButton({
  value,
  onChange,
  label = 'Label actions',
  sourceText = '',
  suggestedKeyPrefix = 'content',
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const anchorRef = useRef(null)

  function handleAdd(item) {
    onChange(item.key, {
      id: item.key,
      key: item.key,
      source: 'Workspace',
      value: item.en ?? '',
      description: '',
      summary: ['Workspace', item.en].filter(Boolean).join(' - '),
    })
  }

  return (
    <>
      <span ref={anchorRef} style={{ display: 'inline-flex' }}>
        <IconButton
          icon="more_vert"
          label={label}
          size="sm"
          variant="secondary"
          onClick={() => setMenuOpen(true)}
        />
      </span>
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} anchorRef={anchorRef} aria-label="Label actions">
        <MenuSection>
          <MenuItem
            icon="manage_search"
            onClick={() => {
              setMenuOpen(false)
              setPickerOpen(true)
            }}
          >
            Choose label
          </MenuItem>
          <MenuItem
            icon="add"
            onClick={() => {
              setMenuOpen(false)
              setAddOpen(true)
            }}
          >
            Add label
          </MenuItem>
        </MenuSection>
      </Menu>
      <LabelLookupDialog
        open={pickerOpen}
        value={value}
        onChange={onChange}
        onClose={() => setPickerOpen(false)}
      />
      <AddLabelDialog
        open={addOpen}
        sourceText={sourceText}
        suggestedKeyPrefix={suggestedKeyPrefix}
        onAdd={handleAdd}
        onClose={() => setAddOpen(false)}
      />
    </>
  )
}
