#!/usr/bin/env node
// Generates apps/a1-web/src/pages/components/componentHistory.generated.js —
// a compact per-component change-history map (A1-2067) mined from the dated
// component maintenance log. Each component's History tab shows these entries
// (unless a hand-curated COMPONENT_HISTORY entry in data.js overrides them).
//
//   npm run history:generate            # regenerate the file
//   npm run history:generate -- --check # fail if the file is stale (CI)
//
// Attribution is intentionally conservative: an entry is attributed to a
// component only when the component's name (title or a known alias) appears as
// a whole word/phrase in the entry's **bold lead-in subject** — not anywhere in
// the prose — so a passing mention in an unrelated entry is not mis-attributed.
// Entries are verbatim summaries from the log; nothing is invented.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const LOG_PATH = resolve(ROOT, 'packages/react/ai/components-maintenance.md')
const DATA_PATH = resolve(ROOT, 'apps/a1-web/src/pages/components/data.js')
const OUT_PATH = resolve(ROOT, 'apps/a1-web/src/pages/components/componentHistory.generated.js')

const MAX_ENTRIES_PER_COMPONENT = 12
const MAX_SUMMARY_LENGTH = 160

// Component titles are single-word English words for a few components; matching
// those against a code changelog produces noise (e.g. "Code" matches "Code
// Connect", "code snippet"). Those fall back to the empty-state / curated entry.
const EXCLUDE_AUTO_MATCH = new Set(['code'])

// React export names / spelling variants that also appear in the log, beyond
// each component's display title (which is always included automatically).
const ALIASES = {
  chip: ['ChipGroup'],
  'segmented-control': ['SegmentedControl'],
  'top-header': ['TopHeader'],
  'side-nav': ['SideNav'],
  'page-nav': ['PageNav'],
  'tree-menu': ['TreeMenu'],
  'bottom-drawer': ['BottomDrawer'],
  'bottom-sheet': ['BottomSheet'],
  'context-menu': ['ContextMenu'],
  'split-button': ['SplitButton'],
  'icon-button': ['IconButton'],
  'button-container': ['ButtonContainer'],
  'action-tile': ['ActionTiles', 'ActionTile'],
  'data-table': ['DataTable'],
  'definition-list': ['DefinitionList'],
  'choice-group': ['ChoiceGroup'],
  'checkbox-group': ['CheckboxGroup'],
  'radio-group': ['RadioGroup'],
  'text-field': ['TextField'],
  'search-field': ['SearchField'],
  'number-field': ['NumberField'],
  'date-field': ['DateField'],
  'time-field': ['TimeField'],
  'phone-field': ['PhoneField'],
  'zip-field': ['ZipField'],
  'credit-card-field': ['CreditCardField'],
  textarea: ['TextareaField'],
  select: ['SelectField'],
  badge: ['MessageBadge'],
  'empty-state': ['MessageEmptyState'],
  snackbar: ['SnackbarStack'],
  'status-bar': ['StatusBar'],
  'circular-progress': ['CircularProgress'],
  'step-tracker': ['StepTracker'],
  'section-separator': ['SectionSeparator'],
  'page-layout': ['PageLayout'],
  'inline-editable': ['InlineEditable'],
  'sticky-actions': ['StickyActions'],
  'canvas-edge': ['CanvasEdge'],
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Extract { id -> [matchPhrases] } from data.js's componentCategories. Component
// entries are `{ id: 'x', icon: 'y', title: 'Z', ... }` (id, icon, title order);
// category entries use id, title, icon order and so don't match this pattern.
function readComponentPhrases() {
  const src = readFileSync(DATA_PATH, 'utf8')
  const re = /id:\s*'([a-z0-9-]+)',\s*icon:\s*'[^']*',\s*title:\s*'([^']+)'/g
  const phrases = {}
  let match
  while ((match = re.exec(src)) !== null) {
    const [, id, title] = match
    const list = [title, ...(ALIASES[id] ?? [])]
    phrases[id] = [...new Set(list)]
  }
  return phrases
}

// One compiled matcher per component, anchored to the START of the subject so
// the component name has to LEAD the entry (after prefix-stripping) rather than
// appear anywhere in it. This is what keeps generic uses of a word out —
// "report card" / "nav icon" don't start the (stripped) subject, so they are
// not attributed to Card / Icon.
function buildMatchers(phrases) {
  const matchers = []
  for (const [id, list] of Object.entries(phrases)) {
    if (EXCLUDE_AUTO_MATCH.has(id)) continue
    for (const phrase of list) {
      matchers.push({ id, phrase, re: new RegExp(`^${escapeRegExp(phrase)}\\b`, 'i') })
    }
  }
  return matchers
}

function leadInSubject(cell) {
  const bold = cell.match(/\*\*(.+?)\*\*/)
  let subject = bold ? bold[1] : cell.split(':')[0]
  subject = subject.replace(/:\s*$/, '').replace(/\s+/g, ' ').trim()
  return subject
}

// Strip a leading platform/tool prefix and plugin verb so the component name is
// at the front of the subject: "A1:Figma Convert to Tree Menu" → "Tree Menu",
// "a1-web Dialog close default" → "Dialog close default".
function subjectHead(subject) {
  let head = subject.replace(/^(A1:Figma|A1-Figma|Figma|a1-web|A1-Web|A1 web|React Native|React|Pure)\s+/i, '')
  head = head.replace(/^(Convert to|AutoFix|Audit|Build|Fix|Add)\s+/i, '')
  return head.trim()
}

function clampSummary(text) {
  if (text.length <= MAX_SUMMARY_LENGTH) return text
  const clipped = text.slice(0, MAX_SUMMARY_LENGTH)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${clipped.slice(0, lastSpace > 40 ? lastSpace : MAX_SUMMARY_LENGTH).trimEnd()}…`
}

// Attribute a subject to components. Match by phrase, then drop a shorter match
// that is fully contained in a longer matched phrase (so "Section Separator"
// wins over "Section", "Definition List" over "List", "Context Menu" over "Menu").
function matchComponents(subject, matchers) {
  const head = subjectHead(subject)
  const hits = []
  for (const { id, phrase, re } of matchers) {
    if (re.test(head) && !hits.some((h) => h.id === id)) hits.push({ id, phrase: phrase.toLowerCase() })
  }
  return hits
    .filter((a) => !hits.some((b) => b.id !== a.id && b.phrase.includes(a.phrase) && b.phrase !== a.phrase))
    .map((h) => h.id)
}

function build() {
  const phrases = readComponentPhrases()
  const matchers = buildMatchers(phrases)
  const log = readFileSync(LOG_PATH, 'utf8')
  const rowRe = /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.*?)\s*\|\s*$/gm

  const byId = {}
  let row
  while ((row = rowRe.exec(log)) !== null) {
    const [, date, cell] = row
    const subject = leadInSubject(cell)
    if (!subject) continue
    const ids = matchComponents(subject, matchers)
    if (ids.length === 0) continue
    const ticketMatch = subject.match(/\bA1-\d+\b/) ?? cell.match(/\bA1-\d+\b/)
    const entry = { date, type: 'code', summary: clampSummary(subject) }
    if (ticketMatch) entry.ticket = ticketMatch[0]
    for (const id of ids) {
      ;(byId[id] ??= []).push({ ...entry })
    }
  }

  // Sort newest-first, drop exact dupes, cap per component.
  const result = {}
  for (const id of Object.keys(byId).sort()) {
    const seen = new Set()
    const entries = byId[id]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .filter((e) => {
        const key = `${e.date}|${e.summary}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, MAX_ENTRIES_PER_COMPONENT)
    result[id] = entries
  }
  return result
}

function serialize(map) {
  const lines = []
  lines.push('// Generated by scripts/build-component-history.mjs from')
  lines.push('// packages/react/ai/components-maintenance.md (A1-2067).')
  lines.push('// Run `npm run history:generate` after editing the maintenance log.')
  lines.push('// Hand-curated entries in COMPONENT_HISTORY (data.js) override these per component.')
  lines.push('')
  lines.push('export const GENERATED_COMPONENT_HISTORY = {')
  for (const [id, entries] of Object.entries(map)) {
    lines.push(`  ${JSON.stringify(id)}: [`)
    for (const entry of entries) {
      lines.push(`    ${JSON.stringify(entry)},`)
    }
    lines.push('  ],')
  }
  lines.push('}')
  lines.push('')
  return lines.join('\n')
}

const output = serialize(build())
const isCheck = process.argv.includes('--check')

if (isCheck) {
  let current = ''
  try {
    current = readFileSync(OUT_PATH, 'utf8')
  } catch {
    // missing file counts as stale
  }
  if (current !== output) {
    console.error('componentHistory.generated.js is stale. Run: npm run history:generate')
    process.exit(1)
  }
  console.log('componentHistory.generated.js is up to date.')
} else {
  writeFileSync(OUT_PATH, output)
  const count = Object.keys(JSON.parse(JSON.stringify(build()))).length
  console.log(`Wrote ${OUT_PATH} — ${count} components with mined history.`)
}
