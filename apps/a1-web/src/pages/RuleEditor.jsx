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
import { formatUsage, hasApiKey, setApiKey, AI_ENABLED } from '../lib/aiImages.ts'
import { allComponents } from './components/utils.js'
import { useT } from '../labels/useT.js'

const COMPONENT_OPTIONS = (() => {
  const set = new Set(['General', 'Typography', ...allComponents.map((c) => c.title)])
  return Array.from(set).map((c) => ({ value: c, label: c }))
})()
const CATEGORY_OPTIONS = RULE_CATEGORIES.map((c) => ({ value: c, label: c }))

const EMPTY_FORM = { id: '', component: '', requirement: '', do: '', dont: '', appliesTo: [] }

export function RuleEditor({ onNavigate }) {
  const t = useT()
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
  const [aiUsage, setAiUsage] = useState(null)

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

  const colComponent = t('app.rules.colComponent', 'Component')
  const colRequirement = t('app.rules.colRequirement', 'Requirement')
  const colAppliesTo = t('app.rules.colAppliesTo', 'Applies to')
  const colEnforced = t('app.rules.colEnforced', 'Enforced')
  const colSource = t('app.rules.colSource', 'Source')

  const COLUMNS = [
    { key: 'component', label: colComponent, sortable: true },
    { key: 'requirement', label: colRequirement, sortable: true },
    { key: 'appliesTo', label: colAppliesTo },
    { key: 'enforced', label: colEnforced },
    { key: 'source', label: colSource, sortable: true },
    { key: 'actions', label: '', type: 'actions' },
  ]

  const TABLE_FILTERS = [
    { key: 'component', label: colComponent, type: 'single', options: componentFilterOptions },
    { key: 'appliesToValues', label: colAppliesTo, type: 'single', options: categoryFilterOptions },
    { key: 'sourceValue', label: colSource, type: 'single', options: [
      { value: 'builtin', label: t('app.rules.sourceBuiltin', 'Built-in') },
      { value: 'user', label: t('app.rules.sourceCustom', 'Custom') },
    ]},
    { key: 'enforcedValue', label: t('app.rules.filterEnforcement', 'Enforcement'), type: 'single', options: [
      { value: 'enforced', label: t('app.rules.filterEnforcedLint', 'Enforced (lint)') },
      { value: 'docs', label: t('app.rules.filterDocsOnly', 'Docs only') },
    ]},
  ]
  const SEARCHABLE = [
    { key: 'component', label: colComponent },
    { key: 'requirement', label: colRequirement },
    { key: 'appliesTo', label: colAppliesTo },
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
        {rule.enforcement.css
          ? t('app.rules.enforcedLintCss', 'Lint + CSS')
          : t('app.rules.enforcedLint', 'Lint')}
      </MessageBadge>
    ) : (
      <MessageBadge size="sm" subtle status="neutral">{t('app.rules.enforcedDocs', 'Docs')}</MessageBadge>
    ),
    source: (
      <MessageBadge size="sm" subtle status={rule.source === 'user' ? 'info' : 'neutral'}>
        {rule.source === 'user'
          ? t('app.rules.sourceCustom', 'Custom')
          : t('app.rules.sourceBuiltin', 'Built-in')}
      </MessageBadge>
    ),
    actions: rule.source === 'user'
      ? [{ label: t('app.rules.rowActionDelete', 'Delete'), icon: 'delete', onClick: () => setConfirmDelete(rule) }]
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
    setAiLoading(true); setAiError(''); setAiResult(null); setAiUsage(null)
    try {
      const { rule, usage } = await generateRule(aiPrompt.trim(), aiHint.trim() || undefined)
      setAiResult(rule)
      setAiUsage(usage)
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
            { label: t('app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
            { label: t('app.page.rules', 'Rules') },
          ]}
        />
          <Heading as="h1" id="rules-heading" size={{ xs: 'lg', md: 'xxl' }}>{t('app.page.rules', 'Rules')}</Heading>
          <Paragraph size="sm" color="muted">
              {t('app.rules.description', 'Every design rule in the system')} — {rules.length} {t('app.rules.descriptionTotal', 'total')}{userCount ? `, ${userCount} ${t('app.rules.descriptionCustom', 'custom')}` : ''}.
            </Paragraph>
          {AI_ENABLED ? (
            <SplitButton
              icon="add"
              onClick={() => { setForm(EMPTY_FORM); setNewOpen(true) }}
              menuLabel={t('app.rules.moreWaysToAdd', 'More ways to add a rule')}
              toggleLabel={t('app.rules.moreWaysToAdd', 'More ways to add a rule')}
              actions={[{ id: 'ai', label: t('app.rules.generateWithAi', 'Generate with AI'), icon: 'auto_awesome', onClick: () => setAiOpen(true) }]}
            >
              {t('app.rules.newRule', 'New rule')}
            </SplitButton>
          ) : (
            <Button icon="add" onClick={() => { setForm(EMPTY_FORM); setNewOpen(true) }}>{t('app.rules.newRule', 'New rule')}</Button>
          )}
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="rules-heading">
        <Stack direction="column" gap="lg">

        {rules.length === 0 ? (
          <MessageEmptyState
            icon="gavel"
            title={t('app.rules.emptyTitle', 'No rules yet')}
            description={t('app.rules.emptyDescription', 'Add a rule by hand or with AI.')}
            action={<Button icon="add" onClick={() => setNewOpen(true)}>{t('app.rules.newRule', 'New rule')}</Button>}
          />
        ) : (
          <DataTable
            caption={t('app.rules.tableCaption', 'A1 design rules')}
            columns={COLUMNS}
            rows={rows}
            getRowId={(r) => r.id}
            zebra
            scrollable
            defaultSort={{ key: 'component', direction: 'asc' }}
            searchableColumns={SEARCHABLE}
            filters={TABLE_FILTERS}
            emptyTitle={t('app.rules.emptyMatchTitle', 'No matching rules')}
            emptyDescription={t('app.rules.emptyMatchDescription', 'Adjust the search or filters.')}
            emptyIcon="gavel"
          />
        )}
      </Stack>

      {/* New / edit rule */}
      <Dialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title={t('app.rules.dialogNewTitle', 'New rule')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewOpen(false)}>{t('app.rules.dialogCancel', 'Cancel')}</Button>
            <Button icon="check" disabled={!form.requirement.trim()} onClick={saveNewRule}>{t('app.rules.dialogAddRule', 'Add rule')}</Button>
          </>
        }
      >
        <Stack gap="sm">
          <Autocomplete label={t('app.rules.formComponent', 'Component')} size="compact" allowCreate options={COMPONENT_OPTIONS} value={form.component} onChange={(v) => setField({ component: v })} />
          <TextareaField label={t('app.rules.formRequirement', 'Requirement')} rows="sm" value={form.requirement} onChange={(e) => setField({ requirement: e.target.value })} required />
          <TextareaField label={t('app.rules.formDo', 'Do')} rows="sm" value={form.do} onChange={(e) => setField({ do: e.target.value })} hint={t('app.rules.formDoHint', 'A concrete example of following the rule')} />
          <TextareaField label={t('app.rules.formDont', "Don't")} rows="sm" value={form.dont} onChange={(e) => setField({ dont: e.target.value })} hint={t('app.rules.formDontHint', 'A concrete example of breaking it')} />
          <Autocomplete label={t('app.rules.formAppliesTo', 'Applies to')} size="compact" multiple allowCreate options={CATEGORY_OPTIONS} value={form.appliesTo} onChange={(v) => setField({ appliesTo: v })} />
          <TextField label={t('app.rules.formRuleId', 'Rule id')} size="compact" value={form.id} onChange={(e) => setField({ id: e.target.value })} hint={t('app.rules.formRuleIdHint', 'Optional — generated from the component if blank')} />
        </Stack>
      </Dialog>

      {/* AI generate */}
      <Dialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title={t('app.rules.aiDialogTitle', 'Generate a rule with AI')}
        footer={
          aiResult ? (
            <>
              <Button variant="secondary" icon="refresh" loading={aiLoading} onClick={runGenerate}>{t('app.rules.aiRegenerate', 'Regenerate')}</Button>
              <Button icon="check" onClick={acceptAiRule}>{t('app.rules.aiAddRule', 'Add rule')}</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setAiOpen(false)}>{t('app.rules.dialogCancel', 'Cancel')}</Button>
              <Button icon="auto_awesome" loading={aiLoading} disabled={!keyReady || !aiPrompt.trim()} onClick={runGenerate}>{t('app.rules.aiGenerate', 'Generate')}</Button>
            </>
          )
        }
      >
        {!keyReady ? (
          <Stack gap="sm">
            <Paragraph size="sm" color="muted">{t('app.rules.aiKeyParagraph', 'Paste an Anthropic API key (stored only in this browser).')} <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">{t('app.rules.aiKeyGetLink', 'Get a key')}</Link>.</Paragraph>
            <TextField label={t('app.rules.aiKeyLabel', 'Anthropic API key')} type="password" size="compact" autoComplete="off" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
            <ButtonContainer><Button size="sm" disabled={!keyInput.trim()} onClick={saveKey}>{t('app.rules.aiSaveKey', 'Save key')}</Button></ButtonContainer>
          </Stack>
        ) : (
          <Stack gap="sm">
            <TextareaField label={t('app.rules.aiPromptLabel', 'Describe the rule')} rows="sm" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} hint={t('app.rules.aiPromptHint', "e.g. 'tooltips should never be the only way to access important information'")} />
            <Autocomplete label={t('app.rules.aiComponentLabel', 'Component (optional)')} size="compact" allowCreate options={COMPONENT_OPTIONS} value={aiHint} onChange={setAiHint} />
            {aiError && <Banner status="error" variant="inline" onDismiss={() => setAiError('')}>{aiError}</Banner>}
            {aiResult && (
              <Card>
                <Stack gap="xs">
                  <MessageBadge size="sm" subtle>{aiResult.component}</MessageBadge>
                  <Heading as="h3" size="sm">{aiResult.id}</Heading>
                  <Paragraph size="sm">{aiResult.requirement}</Paragraph>
                  {aiResult.do && <Paragraph size="sm" color="muted"><strong>{t('app.rules.aiResultDo', 'Do:')}</strong> {aiResult.do}</Paragraph>}
                  {aiResult.dont && <Paragraph size="sm" color="muted"><strong>{t('app.rules.aiResultDont', "Don't:")}</strong> {aiResult.dont}</Paragraph>}
                  {aiResult.appliesTo?.length > 0 && <Paragraph size="xs" color="muted">{t('app.rules.aiResultAppliesTo', 'Applies to:')} {aiResult.appliesTo.join(', ')}</Paragraph>}
                  {aiUsage && <Paragraph size="xs" color="muted">{formatUsage(aiUsage)}</Paragraph>}
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
        title={t('app.rules.deleteDialogTitle', 'Delete rule?')}
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>{t('app.rules.dialogCancel', 'Cancel')}</Button>
            <Button variant="destructive" icon="delete" onClick={() => { deleteRule(confirmDelete.id); setConfirmDelete(null) }}>{t('app.rules.deleteDialogConfirm', 'Delete')}</Button>
          </>
        }
      >
        <Paragraph>'{confirmDelete?.id}' {t('app.rules.deleteDialogBodySuffix', 'will be removed.')}</Paragraph>
      </Dialog>
      </Section>
    </>
  )
}
