import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  Card,
  DataTable,
  Dialog,
  Heading,
  Link,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  SplitButton,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { addRule, deleteRule, listAllRules, RULE_CATEGORIES, subscribeRules } from '../rules/ruleStore.ts'
import { describeError, generateRule } from '../rules/aiRule.ts'
import { hasApiKey, setApiKey, AI_ENABLED } from '../lib/aiImages.ts'
import { allComponents } from './components/utils.js'

const COMPONENT_OPTIONS = (() => {
  const set = new Set(['General', 'Typography', ...allComponents.map((c) => c.title)])
  return Array.from(set).map((c) => ({ value: c, label: c }))
})()
const CATEGORY_OPTIONS = RULE_CATEGORIES.map((c) => ({ value: c, label: c }))

const EMPTY_FORM = { id: '', component: '', requirement: '', do: '', dont: '', appliesTo: [] }

const COLUMNS = [
  { key: 'component', label: 'Component', sortable: true },
  { key: 'requirement', label: 'Requirement', sortable: true },
  { key: 'appliesTo', label: 'Applies to' },
  { key: 'enforced', label: 'Enforced' },
  { key: 'source', label: 'Source', sortable: true },
  { key: 'actions', label: '', type: 'actions' },
]

export function RuleEditor({ onNavigate }) {
  const [rules, setRules] = useState(() => listAllRules())
  const [newOpen, setNewOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // AI dialog
  const [aiOpen, setAiOpen] = useState(false)
  const [keyReady, setKeyReady] = useState(() => hasApiKey())
  const [keyInput, setKeyInput] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiHint, setAiHint] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiResult, setAiResult] = useState(null)

  useEffect(() => subscribeRules(() => setRules(listAllRules())), [])

  // Filter option lists derived from the current rules.
  const componentFilterOptions = useMemo(
    () => Array.from(new Set(rules.map((r) => r.component))).sort().map((c) => ({ value: c, label: c })),
    [rules],
  )
  const categoryFilterOptions = useMemo(
    () => Array.from(new Set(rules.flatMap((r) => r.appliesTo))).sort().map((c) => ({ value: c, label: c })),
    [rules],
  )
  const TABLE_FILTERS = [
    { key: 'component', label: 'Component', type: 'single', options: componentFilterOptions },
    { key: 'appliesToValues', label: 'Applies to', type: 'single', options: categoryFilterOptions },
    { key: 'sourceValue', label: 'Source', type: 'single', options: [{ value: 'builtin', label: 'Built-in' }, { value: 'user', label: 'Custom' }] },
    { key: 'enforcedValue', label: 'Enforcement', type: 'single', options: [{ value: 'enforced', label: 'Enforced (lint)' }, { value: 'docs', label: 'Docs only' }] },
  ]
  const SEARCHABLE = [
    { key: 'component', label: 'Component' },
    { key: 'requirement', label: 'Requirement' },
    { key: 'appliesTo', label: 'Applies to' },
  ]

  const rows = rules.map((rule) => ({
    id: rule.id,
    component: rule.component,
    requirement: rule.requirement,
    appliesTo: rule.appliesTo.join(', ') || '—',
    appliesToValues: rule.appliesTo, // array — for the "Applies to" filter
    sourceValue: rule.source,        // 'builtin' | 'user' — for the Source filter
    enforcedValue: rule.enforcement ? 'enforced' : 'docs',
    enforced: rule.enforcement ? (
      <MessageBadge size="sm" subtle status="success" icon="gpp_good">
        {rule.enforcement.css ? 'Lint + CSS' : 'Lint'}
      </MessageBadge>
    ) : (
      <MessageBadge size="sm" subtle status="neutral">Docs</MessageBadge>
    ),
    source: (
      <MessageBadge size="sm" subtle status={rule.source === 'user' ? 'info' : 'neutral'}>
        {rule.source === 'user' ? 'Custom' : 'Built-in'}
      </MessageBadge>
    ),
    actions: rule.source === 'user'
      ? [{ label: 'Delete', icon: 'delete', onClick: () => setConfirmDelete(rule) }]
      : [],
  }))

  const setField = (patch) => setForm((f) => ({ ...f, ...patch }))

  function saveNewRule() {
    if (!form.requirement.trim()) return
    addRule(form)
    setForm(EMPTY_FORM)
    setNewOpen(false)
  }

  function saveKey() { setApiKey(keyInput); if (keyInput.trim()) setKeyReady(true) }

  async function runGenerate() {
    if (!aiPrompt.trim()) return
    setAiLoading(true); setAiError(''); setAiResult(null)
    try {
      setAiResult(await generateRule(aiPrompt.trim(), aiHint.trim() || undefined))
    } catch (err) {
      setAiError(describeError(err))
      if (err instanceof Error && err.message === 'NO_API_KEY') setKeyReady(false)
    } finally { setAiLoading(false) }
  }

  function acceptAiRule() {
    if (!aiResult) return
    addRule(aiResult)
    setAiResult(null); setAiPrompt(''); setAiHint(''); setAiOpen(false)
  }

  const userCount = rules.filter((r) => r.source === 'user').length

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
            { label: 'Rules' },
          ]}
        />
          <Heading as="h1" id="rules-heading" size={{ xs: 'lg', md: 'xxl' }}>Rules</Heading>
          <Paragraph size="sm" color="muted">
              Every design rule in the system — {rules.length} total{userCount ? `, ${userCount} custom` : ''}. Add your own by hand or with AI; built-in rules are read-only.
            </Paragraph>
          {AI_ENABLED ? (
            <SplitButton
              icon="add"
              onClick={() => { setForm(EMPTY_FORM); setNewOpen(true) }}
              menuLabel="More ways to add a rule"
              toggleLabel="More ways to add a rule"
              actions={[{ id: 'ai', label: 'Generate with AI', icon: 'auto_awesome', onClick: () => setAiOpen(true) }]}
            >
              New rule
            </SplitButton>
          ) : (
            <Button icon="add" onClick={() => { setForm(EMPTY_FORM); setNewOpen(true) }}>New rule</Button>
          )}
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="rules-heading">
        <Stack direction="column" gap="lg">

        {rules.length === 0 ? (
          <MessageEmptyState icon="gavel" title="No rules yet" description="Add a rule by hand or with AI." action={<Button icon="add" onClick={() => setNewOpen(true)}>New rule</Button>} />
        ) : (
          <DataTable
            caption="A1 design rules"
            columns={COLUMNS}
            rows={rows}
            getRowId={(r) => r.id}
            zebra
            scrollable
            defaultSort={{ key: 'component', direction: 'asc' }}
            searchableColumns={SEARCHABLE}
            filters={TABLE_FILTERS}
            emptyTitle="No matching rules"
            emptyDescription="Adjust the search or filters."
            emptyIcon="gavel"
          />
        )}
      </Stack>

      {/* New / edit rule */}
      <Dialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New rule"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button icon="check" disabled={!form.requirement.trim()} onClick={saveNewRule}>Add rule</Button>
          </>
        }
      >
        <Stack gap="sm">
          <Autocomplete label="Component" size="compact" allowCreate options={COMPONENT_OPTIONS} value={form.component} onChange={(v) => setField({ component: v })} />
          <TextareaField label="Requirement" rows="sm" value={form.requirement} onChange={(e) => setField({ requirement: e.target.value })} required />
          <TextareaField label="Do" rows="sm" value={form.do} onChange={(e) => setField({ do: e.target.value })} hint="A concrete example of following the rule" />
          <TextareaField label="Don’t" rows="sm" value={form.dont} onChange={(e) => setField({ dont: e.target.value })} hint="A concrete example of breaking it" />
          <Autocomplete label="Applies to" size="compact" multiple allowCreate options={CATEGORY_OPTIONS} value={form.appliesTo} onChange={(v) => setField({ appliesTo: v })} />
          <TextField label="Rule id" size="compact" value={form.id} onChange={(e) => setField({ id: e.target.value })} hint="Optional — generated from the component if blank" />
        </Stack>
      </Dialog>

      {/* AI generate */}
      <Dialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="Generate a rule with AI"
        footer={
          aiResult ? (
            <>
              <Button variant="secondary" icon="refresh" loading={aiLoading} onClick={runGenerate}>Regenerate</Button>
              <Button icon="check" onClick={acceptAiRule}>Add rule</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setAiOpen(false)}>Cancel</Button>
              <Button icon="auto_awesome" loading={aiLoading} disabled={!keyReady || !aiPrompt.trim()} onClick={runGenerate}>Generate</Button>
            </>
          )
        }
      >
        {!keyReady ? (
          <Stack gap="sm">
            <Paragraph size="sm" color="muted">Paste an Anthropic API key (stored only in this browser). <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a key</Link>.</Paragraph>
            <TextField label="Anthropic API key" type="password" size="compact" autoComplete="off" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
            <ButtonContainer><Button size="sm" disabled={!keyInput.trim()} onClick={saveKey}>Save key</Button></ButtonContainer>
          </Stack>
        ) : (
          <Stack gap="sm">
            <TextareaField label="Describe the rule" rows="sm" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} hint="e.g. “tooltips should never be the only way to access important information”" />
            <Autocomplete label="Component (optional)" size="compact" allowCreate options={COMPONENT_OPTIONS} value={aiHint} onChange={setAiHint} />
            {aiError && <Banner status="error" variant="inline" onDismiss={() => setAiError('')}>{aiError}</Banner>}
            {aiResult && (
              <Card>
                <Stack gap="xs">
                  <MessageBadge size="sm" subtle>{aiResult.component}</MessageBadge>
                  <Heading as="h3" size="sm">{aiResult.id}</Heading>
                  <Paragraph size="sm">{aiResult.requirement}</Paragraph>
                  {aiResult.do && <Paragraph size="sm" color="muted"><strong>Do:</strong> {aiResult.do}</Paragraph>}
                  {aiResult.dont && <Paragraph size="sm" color="muted"><strong>Don’t:</strong> {aiResult.dont}</Paragraph>}
                  {aiResult.appliesTo?.length > 0 && <Paragraph size="xs" color="muted">Applies to: {aiResult.appliesTo.join(', ')}</Paragraph>}
                </Stack>
              </Card>
            )}
          </Stack>
        )}
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete rule?"
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" icon="delete" onClick={() => { deleteRule(confirmDelete.id); setConfirmDelete(null) }}>Delete</Button>
          </>
        }
      >
        <Paragraph>“{confirmDelete?.id}” will be removed.</Paragraph>
      </Dialog>
      </Section>
    </>
  )
}
