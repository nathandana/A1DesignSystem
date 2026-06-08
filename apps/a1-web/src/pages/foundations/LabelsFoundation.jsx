import { useState } from 'react'
import {
  Breadcrumb,
  DataTable,
  Heading,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import actionJson   from '../../../../../system/labels/action.json'
import calendarJson from '../../../../../system/labels/calendar.json'
import codeJson     from '../../../../../system/labels/code.json'
import fieldJson    from '../../../../../system/labels/field.json'

// ── Locale column definitions (canonical order) ──────────────────────────────

const LOCALE_COLS = [
  { key: 'en', label: 'EN' },
  { key: 'es', label: 'ES' },
  { key: 'fr', label: 'FR' },
  { key: 'de', label: 'DE' },
  { key: 'pt', label: 'PT' },
  { key: 'ja', label: 'JA' },
  { key: 'zh', label: 'ZH' },
  { key: 'ar', label: 'AR' },
]

// ── Flatten label JSON into table rows ────────────────────────────────────────
// Each leaf node (has $value) becomes a row keyed by dot-notation path.

function flattenLabels(obj, prefix = '') {
  const rows = []
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$') || key === 'locale') continue
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') {
      if ('$value' in value) {
        rows.push({
          id: path,
          en: String(value.$value ?? ''),
          ...Object.fromEntries(
            Object.entries(value.locale || {}).map(([k, v]) => [k, String(v)])
          ),
        })
      } else {
        rows.push(...flattenLabels(value, path))
      }
    }
  }
  return rows
}

// Build table rows + columns from a label JSON file.
// Only includes locale columns that have at least one translation in the data.

function buildTableData(json) {
  const raw = flattenLabels(json.label)

  const rows = raw.map((row) => ({
    ...row,
    keyDisplay: <code className="a1-web-token-code">{row.id}</code>,
    // Wrap Arabic text with inline RTL so it renders correctly in an LTR table
    ar: row.ar ? <span dir="rtl" lang="ar">{row.ar}</span> : undefined,
  }))

  const populated = new Set(
    LOCALE_COLS
      .filter((l) => raw.some((r) => r[l.key] != null && r[l.key] !== ''))
      .map((l) => l.key)
  )

  const columns = [
    { key: 'keyDisplay', label: 'Key', sortable: true, sortAccessor: (r) => r.id },
    ...LOCALE_COLS
      .filter((l) => populated.has(l.key))
      .map((l) => ({ key: l.key, label: l.label })),
  ]

  return { rows, columns }
}

// ── Module-level data (static, computed once) ─────────────────────────────────

const calendarData = buildTableData(calendarJson)
const codeData     = buildTableData(codeJson)
const fieldData    = buildTableData(fieldJson)
const actionData   = buildTableData(actionJson)

// ── Component ─────────────────────────────────────────────────────────────────

export function LabelsFoundationPage() {
  const [activeTab, setActiveTab] = useState('calendar')

  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="xl"
        gap="lg"
        aria-labelledby="labels-heading"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '?page=foundations', label: 'Foundations' },
              { label: 'Labels' },
            ]}
          />
          <Heading as="h1" id="labels-heading" type="heading" size={{ xs: 'xl', md: 'xxl' }} textWrap="balance">
            Labels
          </Heading>
          <Paragraph size="sm" color="muted">
            Localised UI strings used by A1 components. Every user-facing string is a named label with a default English value and optional per-locale translations. Use the locale selector in Settings to preview translations across the site.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="labels-browser-heading">

          <Tabs value={activeTab} onChange={setActiveTab} variant="line">
            <TabList>
              <Tab value="calendar" icon="calendar_month">Calendar</Tab>
              <Tab value="code" icon="code">Code</Tab>
              <Tab value="field" icon="edit_note">Field</Tab>
              <Tab value="action" icon="touch_app">Action</Tab>
            </TabList>

            <TabPanel value="calendar">
              <DataTable
                columns={calendarData.columns}
                rows={calendarData.rows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Calendar component labels and locale translations"
              />
            </TabPanel>

            <TabPanel value="code">
              <DataTable
                columns={codeData.columns}
                rows={codeData.rows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Code component labels and locale translations"
              />
            </TabPanel>

            <TabPanel value="field">
              <DataTable
                columns={fieldData.columns}
                rows={fieldData.rows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Field component labels and locale translations"
              />
            </TabPanel>

            <TabPanel value="action">
              <DataTable
                columns={actionData.columns}
                rows={actionData.rows}
                getRowId={(r) => r.id}
                size="compact"
                scrollable
                caption="Action labels and locale translations"
              />
            </TabPanel>
          </Tabs>
      </Section>
    </>
  )
}
