import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Autocomplete,
  Banner,
  Button,
  ButtonContainer,
  Card,
  Code,
  DataTable,
  Dialog,
  Figure,
  Heading,
  IconButton,
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
import { addImage, resolveSrc, toImageRef } from '../lib/imageLibrary.ts'
import { allComponents } from './components/utils.js'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from './PageTitleArea.jsx'

const COMPONENT_OPTIONS = (() => {
  const set = new Set(['General', 'Typography', ...allComponents.map((c) => c.title)])
  return Array.from(set).map((c) => ({ value: c, label: c }))
})()
const CATEGORY_OPTIONS = RULE_CATEGORIES.map((c) => ({ value: c, label: c }))

const EMPTY_FORM = { id: '', component: '', requirement: '', do: '', dont: '', appliesTo: [], examples: [] }

function exampleId() {
  return `example_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function imageFilesFromClipboard(clipboardData) {
  const files = []
  const seen = new Set()

  function addFile(file) {
    if (!file?.type?.startsWith('image/')) return
    const key = `${file.name}:${file.type}:${file.size}:${file.lastModified}`
    if (seen.has(key)) return
    seen.add(key)
    files.push(file)
  }

  Array.from(clipboardData?.items || []).forEach((item) => {
    if (item.kind === 'file' && item.type?.startsWith('image/')) {
      addFile(item.getAsFile())
    }
  })
  Array.from(clipboardData?.files || []).forEach(addFile)
  return files
}

export function RuleEditor({ onNavigate }) {
  const t = useT()
  const [rules, setRules] = useState(() => listAllRules())
  const [newOpen, setNewOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingRule, setEditingRule] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const imageInputRef = useRef(null)
  const [exampleMessage, setExampleMessage] = useState('')

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
  const colExamples = t('app.rules.colExamples', 'Examples')
  const colEnforced = t('app.rules.colEnforced', 'Enforced')
  const colSource = t('app.rules.colSource', 'Source')

  const COLUMNS = [
    { key: 'component', label: colComponent, sortable: true },
    { key: 'requirement', label: colRequirement, sortable: true },
    { key: 'appliesTo', label: colAppliesTo },
    { key: 'examples', label: colExamples },
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
    examples: rule.examples?.length ? (
      <Stack direction="row" gap="xs" wrap>
        {rule.examples.slice(0, 3).map((example) => (
          example.type === 'image' ? (
            <Figure
              key={example.id}
              src={resolveSrc(example.imageRef)}
              alt={example.alt || example.label || 'Rule example'}
              size="3xs"
              radius="sm"
              aspectRatio="1:1"
            />
          ) : (
            <Code key={example.id} variant="inline">{example.label || 'Code'}</Code>
          )
        ))}
        {rule.examples.length > 3 && (
          <MessageBadge size="sm" subtle>+{rule.examples.length - 3}</MessageBadge>
        )}
      </Stack>
    ) : '—',
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
    actions: [
      { label: t('app.rules.rowActionEdit', 'Edit'), icon: 'edit', iconOnly: true, onClick: () => openRuleDialog(rule) },
      ...(rule.source === 'user'
        ? [{ label: t('app.rules.rowActionDelete', 'Delete'), icon: 'delete', iconOnly: true, variant: 'destructive', onClick: () => setConfirmDelete(rule) }]
        : []),
    ],
  }))

  const setField = (patch) => setForm((f) => ({ ...f, ...patch }))

  function openRuleDialog(rule = null) {
    setEditingRule(rule)
    setExampleMessage('')
    setForm(rule ? {
      id: rule.id,
      component: rule.component,
      requirement: rule.requirement,
      do: rule.do ?? '',
      dont: rule.dont ?? '',
      appliesTo: rule.appliesTo ?? [],
      examples: (rule.examples ?? []).map((example) => ({ ...example })),
    } : EMPTY_FORM)
    setNewOpen(true)
  }

  function closeRuleDialog() {
    setNewOpen(false)
    setEditingRule(null)
    setForm(EMPTY_FORM)
    setExampleMessage('')
  }

  function updateExample(id, patch) {
    setForm((current) => ({
      ...current,
      examples: (current.examples ?? []).map((example) => (
        example.id === id ? { ...example, ...patch } : example
      )),
    }))
  }

  function removeExample(id) {
    setForm((current) => ({
      ...current,
      examples: (current.examples ?? []).filter((example) => example.id !== id),
    }))
  }

  function addCodeExample() {
    setForm((current) => ({
      ...current,
      examples: [
        ...(current.examples ?? []),
        { id: exampleId(), type: 'code', label: '', code: '' },
      ],
    }))
  }

  async function addImageExamples(files) {
    const imageFiles = Array.from(files || []).filter((file) => file?.type?.startsWith('image/'))
    if (!imageFiles.length) return
    try {
      const uploaded = []
      for (const file of imageFiles) {
        const meta = await addImage(file)
        uploaded.push({
          id: exampleId(),
          type: 'image',
          label: file.name.replace(/\.[^.]+$/, ''),
          imageRef: toImageRef(meta.id),
          alt: '',
        })
      }
      setForm((current) => ({ ...current, examples: [...(current.examples ?? []), ...uploaded] }))
      const label = uploaded.length === 1 ? 'image example' : 'image examples'
      setExampleMessage(`Added ${uploaded.length} ${label}.`)
    } catch {
      setExampleMessage(t('app.rules.examplesImageError', 'Could not add the image example.'))
    }
  }

  async function handleExampleFiles(event) {
    try {
      await addImageExamples(event.target.files)
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  async function handleExamplesPaste(event) {
    const files = imageFilesFromClipboard(event.clipboardData)
    if (!files.length) return
    event.preventDefault()
    await addImageExamples(files)
  }

  function saveRule() {
    if (!form.requirement.trim()) return
    addRule(form)
    closeRuleDialog()
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
      <PageTitleArea
        headingId="rules-heading"
        breadcrumbItems={[
          { label: t('app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: t('app.page.rules', 'Rules') },
        ]}
        title={t('app.page.rules', 'Rules')}
        description={`${t('app.rules.description', 'Every design rule in the system')} — ${rules.length} ${t('app.rules.descriptionTotal', 'total')}${userCount ? `, ${userCount} ${t('app.rules.descriptionCustom', 'custom')}` : ''}.`}
        actions={AI_ENABLED ? (
            <SplitButton
              icon="add"
              onClick={() => openRuleDialog()}
              menuLabel={t('app.rules.moreWaysToAdd', 'More ways to add a rule')}
              toggleLabel={t('app.rules.moreWaysToAdd', 'More ways to add a rule')}
              actions={[{ id: 'ai', label: t('app.rules.generateWithAi', 'Generate with AI'), icon: 'auto_awesome', onClick: () => setAiOpen(true) }]}
            >
              {t('app.rules.newRule', 'New rule')}
            </SplitButton>
          ) : (
            <Button icon="add" onClick={() => openRuleDialog()}>{t('app.rules.newRule', 'New rule')}</Button>
          )}
      />

      <Section padding="sm" contentWidth="xl" aria-labelledby="rules-heading">
        <Stack direction="column" gap="lg">

        {rules.length === 0 ? (
          <MessageEmptyState
            icon="gavel"
            title={t('app.rules.emptyTitle', 'No rules yet')}
            description={t('app.rules.emptyDescription', 'Add a rule by hand or with AI.')}
            action={<Button icon="add" onClick={() => openRuleDialog()}>{t('app.rules.newRule', 'New rule')}</Button>}
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
        onClose={closeRuleDialog}
        title={editingRule ? t('app.rules.dialogEditTitle', 'Edit rule') : t('app.rules.dialogNewTitle', 'New rule')}
        footer={
          <>
            <Button variant="secondary" onClick={closeRuleDialog}>{t('app.rules.dialogCancel', 'Cancel')}</Button>
            <Button icon="check" disabled={!form.requirement.trim()} onClick={saveRule}>
              {editingRule ? t('app.rules.dialogSaveRule', 'Save rule') : t('app.rules.dialogAddRule', 'Add rule')}
            </Button>
          </>
        }
      >
        <Stack gap="sm">
          <Autocomplete label={t('app.rules.formComponent', 'Component')} size="compact" allowCreate options={COMPONENT_OPTIONS} value={form.component} onChange={(v) => setField({ component: v })} />
          <TextareaField label={t('app.rules.formRequirement', 'Requirement')} rows="sm" value={form.requirement} onChange={(e) => setField({ requirement: e.target.value })} required />
          <TextareaField label={t('app.rules.formDo', 'Do')} rows="sm" value={form.do} onChange={(e) => setField({ do: e.target.value })} hint={t('app.rules.formDoHint', 'A concrete example of following the rule')} />
          <TextareaField label={t('app.rules.formDont', "Don't")} rows="sm" value={form.dont} onChange={(e) => setField({ dont: e.target.value })} hint={t('app.rules.formDontHint', 'A concrete example of breaking it')} />
          <Stack gap="xs" onPaste={handleExamplesPaste}>
            <Stack direction="row" gap="sm" align="center" justify="between" wrap>
              <Paragraph as="span" size="xs" color="muted">{t('app.rules.examplesLabel', 'Examples')}</Paragraph>
              <ButtonContainer align="end">
                <Button size="sm" variant="secondary" icon="code" onClick={addCodeExample}>{t('app.rules.examplesAddCode', 'Add code')}</Button>
                <Button size="sm" variant="secondary" icon="image" onClick={() => imageInputRef.current?.click()}>{t('app.rules.examplesAddImage', 'Add image')}</Button>
              </ButtonContainer>
            </Stack>
            <Paragraph size="sm" color="muted">{t('app.rules.examplesHint', 'Add short code examples or paste an image here to upload it.')}</Paragraph>
            <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleExampleFiles} />
            {exampleMessage && <Paragraph size="sm" color="muted" aria-live="polite">{exampleMessage}</Paragraph>}
            {form.examples?.length ? (
              <Stack gap="sm">
                {form.examples.map((example, index) => (
                  <Card key={example.id}>
                    <Stack gap="sm">
                      <Stack direction="row" gap="sm" align="center" justify="between">
                        <MessageBadge size="sm" subtle icon={example.type === 'image' ? 'image' : 'code'}>
                          {example.type === 'image'
                            ? t('app.rules.examplesImageTitle', 'Image example')
                            : t('app.rules.examplesCodeTitle', 'Code example')} {index + 1}
                        </MessageBadge>
                        <IconButton
                          icon="delete"
                          label={t('app.rules.examplesRemove', 'Remove example')}
                          size="sm"
                          variant="destructive"
                          onClick={() => removeExample(example.id)}
                        />
                      </Stack>
                      <TextField
                        label={t('app.rules.examplesFieldLabel', 'Label')}
                        size="compact"
                        value={example.label ?? ''}
                        onChange={(e) => updateExample(example.id, { label: e.target.value })}
                      />
                      {example.type === 'image' ? (
                        <>
                          <Figure
                            src={resolveSrc(example.imageRef)}
                            alt={example.alt || example.label || 'Rule example'}
                            size="xs"
                            radius="sm"
                            aspectRatio="16:9"
                          />
                          <TextField
                            label={t('app.rules.examplesAltLabel', 'Alt text')}
                            size="compact"
                            value={example.alt ?? ''}
                            onChange={(e) => updateExample(example.id, { alt: e.target.value })}
                          />
                        </>
                      ) : (
                        <TextareaField
                          label={t('app.rules.examplesCodeLabel', 'Code')}
                          rows="sm"
                          value={example.code}
                          onChange={(e) => updateExample(example.id, { code: e.target.value })}
                        />
                      )}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Paragraph size="sm" color="muted">{t('app.rules.examplesEmpty', 'No examples yet.')}</Paragraph>
            )}
          </Stack>
          <Autocomplete label={t('app.rules.formAppliesTo', 'Applies to')} size="compact" multiple allowCreate options={CATEGORY_OPTIONS} value={form.appliesTo} onChange={(v) => setField({ appliesTo: v })} />
          <TextField
            label={t('app.rules.formRuleId', 'Rule id')}
            size="compact"
            value={form.id}
            onChange={(e) => setField({ id: e.target.value })}
            disabled={!!editingRule}
            hint={editingRule
              ? t('app.rules.formRuleIdEditHint', 'Rule id stays fixed while editing.')
              : t('app.rules.formRuleIdHint', 'Optional — generated from the component if blank')}
          />
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
