import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  Dialog,
  Heading,
  IconButton,
  InlineEditable,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  SelectField,
  Snackbar,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import {
  createGuide,
  deleteGuide,
  duplicateGuide,
  getGuide,
  isGuideGroup,
  loadGuides,
  subscribeGuides,
  updateGuide,
} from '../priorityGuide/priorityGuideStore.ts'
import { guideToPageDefinition, pageDefinitionToGuide } from '../priorityGuide/convert.ts'
import {
  addPage,
  commitPageJson,
  loadPages,
  loadProjects,
  resolvePageJson,
} from '../projects/projectStore.ts'
import { PageTitleArea } from './PageTitleArea.jsx'
import '../priorityGuide/priority-guide-editor.css'

const ITEM_COMPONENT_OPTIONS = [
  'Heading', 'Paragraph', 'Button', 'Link', 'Checklist', 'List', 'Details', 'Alert', 'Card',
].map((v) => ({ value: v, label: v }))

const GROUP_COMPONENT_OPTIONS = [
  { value: 'Section', label: 'Section' },
  { value: 'Card', label: 'Card' },
  { value: 'Button container', label: 'Button container' },
]

const PAGE_TYPE_OPTIONS = [
  'Landing', 'Form', 'Detail', 'Dashboard', 'List', 'Article', 'Settings', 'Onboarding',
].map((v) => ({ value: v, label: v }))

const SAMPLE_JSON = JSON.stringify(
  {
    id: 'new-guide',
    title: 'New page',
    context: 'Product area or flow',
    problemStatement: 'What breaks down without this page.',
    audience: 'Who uses this page and what they expect.',
    userGoal: 'The one thing the user needs to do.',
    businessGoal: 'What the organisation needs alongside it.',
    items: [
      { componentType: 'Heading', title: 'Most critical message', content: 'The single most important thing.' },
      { componentType: 'Button', title: 'Primary action', content: 'What the button does.' },
    ],
  },
  null,
  2,
)

/** A blank guide draft used by "New guide → From scratch". */
function blankGuideFields() {
  return {
    title: 'New page',
    context: '',
    pageType: '',
    problemStatement: '',
    audience: '',
    userGoal: '',
    businessGoal: '',
    items: [
      { componentType: 'Heading', title: 'Most critical message', content: '', annotations: [] },
    ],
  }
}

/** Render an array of {value,label} as native <option> children for SelectField. */
function Options({ items }) {
  return items.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
}

function moveInArray(arr, from, to) {
  const copy = arr.slice()
  const [moved] = copy.splice(from, 1)
  copy.splice(to, 0, moved)
  return copy
}

// ── Guide library (list of guides) ────────────────────────────────────────────

function GuideLibrary({ guides, onOpen, onNew, onDuplicate, onDelete }) {
  if (!guides.length) {
    return (
      <MessageEmptyState
        scale="section"
        icon="list_alt"
        title="No priority guides yet"
        description="A priority guide captures the problem, audience, goals, and priority-ranked content for a page — before layout or visual design."
        action={<Button variant="primary" icon="add" onClick={onNew}>New guide</Button>}
      />
    )
  }
  return (
    <Stack direction="column" gap="lg">
      <ButtonContainer align="end">
        <Button variant="primary" icon="add" onClick={onNew}>New guide</Button>
      </ButtonContainer>
      <div className="a1-pg-list">
        {guides.map((guide) => (
          <Card key={guide.id} icon={guide.icon || 'list_alt'}>
            <Stack direction="column" gap="sm">
              <Stack direction="column" gap="xs">
                {guide.pageType ? (
                  <Paragraph as="span" size="xs" color="muted">{guide.pageType}</Paragraph>
                ) : null}
                <Heading as="h3" size="sm">{guide.title}</Heading>
                {guide.problemStatement ? (
                  <Paragraph size="sm" color="muted">{guide.problemStatement}</Paragraph>
                ) : null}
              </Stack>
              <ButtonContainer>
                <Button size="sm" variant="primary" icon="edit" onClick={() => onOpen(guide.id)}>Edit</Button>
                <Button size="sm" variant="tertiary" icon="content_copy" onClick={() => onDuplicate(guide.id)}>Duplicate</Button>
                <Button size="sm" variant="tertiary" icon="delete" onClick={() => onDelete(guide.id)}>Delete</Button>
              </ButtonContainer>
            </Stack>
          </Card>
        ))}
      </div>
    </Stack>
  )
}

// ── New-guide dialog ──────────────────────────────────────────────────────────

function NewGuideDialog({ open, onClose, onCreate }) {
  const [mode, setMode] = useState('scratch')
  const [title, setTitle] = useState('New page')
  const [json, setJson] = useState(SAMPLE_JSON)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) { setMode('scratch'); setTitle('New page'); setJson(SAMPLE_JSON); setError('') }
  }, [open])

  const submit = () => {
    if (mode === 'scratch') {
      onCreate({ ...blankGuideFields(), title: title.trim() || 'New page' })
      return
    }
    try {
      const parsed = JSON.parse(json)
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) {
        setError('JSON must be an object with an "items" array.')
        return
      }
      onCreate(parsed)
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New priority guide"
      footer={
        <ButtonContainer align="end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>Create guide</Button>
        </ButtonContainer>
      }
    >
      <Stack direction="column" gap="md">
        <SelectField
          label="Start from"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <Options items={[
            { value: 'scratch', label: 'A blank guide' },
            { value: 'json', label: 'Pasted JSON' },
          ]} />
        </SelectField>
        {mode === 'scratch' ? (
          <TextField label="Page name" value={title} onChange={(e) => setTitle(e.target.value)} />
        ) : (
          <>
            <TextareaField
              label="Guide JSON"
              value={json}
              onChange={(e) => { setJson(e.target.value); setError('') }}
              rows={14}
            />
            {error ? <Banner status="error" variant="inline">{error}</Banner> : null}
          </>
        )}
      </Stack>
    </Dialog>
  )
}

// ── Item editor (a single ranked item; leaf or group) ─────────────────────────

function LeafFields({ item, onPatch }) {
  return (
    <Stack direction="column" gap="sm">
      <Stack direction="row" gap="sm">
        <SelectField
          label="Component"
          value={item.componentType || ''}
          onChange={(e) => onPatch({ componentType: e.target.value })}
        >
          <Options items={[{ value: '', label: '—' }, ...ITEM_COMPONENT_OPTIONS]} />
        </SelectField>
        <TextField
          label="Role"
          value={item.type || ''}
          onChange={(e) => onPatch({ type: e.target.value })}
        />
      </Stack>
      <TextField
        label="Title"
        value={item.title || ''}
        onChange={(e) => onPatch({ title: e.target.value })}
      />
      <TextareaField
        label="Content"
        value={item.content || ''}
        onChange={(e) => onPatch({ content: e.target.value })}
        rows={2}
      />
      <TextareaField
        label="Annotations (one per line)"
        value={(item.annotations || []).join('\n')}
        onChange={(e) => onPatch({ annotations: e.target.value.split('\n').map((s) => s).filter((s, i, a) => s.trim() || i < a.length - 1) })}
        rows={2}
      />
    </Stack>
  )
}

function ItemRow({
  item, index, total, onPatch, onMove, onDelete, onDuplicate,
  onAddChild, onPatchChild, onDeleteChild, isDragging, onDragStart, onDragOver, onDrop,
}) {
  const group = isGuideGroup(item)
  return (
    <li
      className={`a1-pg-item${isDragging ? ' a1-pg-item__drag-over' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      <span className="a1-pg-item__rank" aria-hidden="true">{index + 1}</span>
      <div className="a1-pg-item__body">
        <Card>
          <Stack direction="column" gap="sm">
            <Stack direction="row" gap="sm" justify="between" align="center">
              <MessageBadge status={group ? 'info' : 'neutral'} subtle size="sm">
                {group ? `Group · ${item.componentType}` : (item.componentType || 'Item')}
              </MessageBadge>
              <Stack direction="row" gap="xs">
                <IconButton size="sm" variant="tertiary" icon="keyboard_arrow_up" aria-label="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)} />
                <IconButton size="sm" variant="tertiary" icon="keyboard_arrow_down" aria-label="Move down" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} />
                <IconButton size="sm" variant="tertiary" icon="content_copy" aria-label="Duplicate item" onClick={() => onDuplicate(index)} />
                <IconButton size="sm" variant="tertiary" icon="delete" aria-label="Delete item" onClick={() => onDelete(index)} />
              </Stack>
            </Stack>

            {group ? (
              <Stack direction="column" gap="sm">
                <SelectField
                  label="Container"
                  value={item.componentType}
                  onChange={(e) => onPatch(index, { componentType: e.target.value })}
                >
                  <Options items={GROUP_COMPONENT_OPTIONS} />
                </SelectField>
                <TextField label="Group title" value={item.title || ''} onChange={(e) => onPatch(index, { title: e.target.value })} />
                <TextareaField label="Group content" value={item.content || ''} onChange={(e) => onPatch(index, { content: e.target.value })} rows={2} />
                <div className="a1-pg-group__children">
                  <Stack direction="column" gap="md">
                    {(item.children || []).map((child, ci) => (
                      <Stack key={ci} direction="column" gap="xs">
                        <Stack direction="row" gap="xs" justify="between" align="center">
                          <Paragraph as="span" size="xs" color="muted">Child {ci + 1}</Paragraph>
                          <IconButton size="sm" variant="tertiary" icon="delete" aria-label="Delete child" onClick={() => onDeleteChild(index, ci)} />
                        </Stack>
                        <LeafFields item={child} onPatch={(patch) => onPatchChild(index, ci, patch)} />
                      </Stack>
                    ))}
                    <ButtonContainer>
                      <Button size="sm" variant="tertiary" icon="add" onClick={() => onAddChild(index)}>Add child</Button>
                    </ButtonContainer>
                  </Stack>
                </div>
              </Stack>
            ) : (
              <LeafFields item={item} onPatch={(patch) => onPatch(index, patch)} />
            )}
          </Stack>
        </Card>
      </div>
    </li>
  )
}

// ── Overview fields (problem, audience, goals) ────────────────────────────────

function OverviewFields({ guide, onPatch }) {
  return (
    <Stack direction="column" gap="sm">
      <TextField label="Page title" value={guide.title || ''} onChange={(e) => onPatch({ title: e.target.value })} />
      <SelectField
        label="Page type"
        value={guide.pageType || ''}
        onChange={(e) => onPatch({ pageType: e.target.value })}
      >
        <Options items={[{ value: '', label: '—' }, ...PAGE_TYPE_OPTIONS]} />
      </SelectField>
      <TextField label="Context" value={guide.context || ''} onChange={(e) => onPatch({ context: e.target.value })} />
      <TextareaField label="Problem statement" value={guide.problemStatement || ''} onChange={(e) => onPatch({ problemStatement: e.target.value })} rows={2} />
      <TextField label="Audience" value={guide.audience || ''} onChange={(e) => onPatch({ audience: e.target.value })} />
      <TextField label="User goal" value={guide.userGoal || ''} onChange={(e) => onPatch({ userGoal: e.target.value })} />
      <TextField label="Business goal" value={guide.businessGoal || ''} onChange={(e) => onPatch({ businessGoal: e.target.value })} />
    </Stack>
  )
}

// ── JSON panel (two-way) ──────────────────────────────────────────────────────

function JsonPanel({ guide, onReplace }) {
  const [text, setText] = useState(() => JSON.stringify(guide, null, 2))
  const [error, setError] = useState('')
  const guideKey = guide.id + (guide.updatedAt || '')
  useEffect(() => { setText(JSON.stringify(guide, null, 2)); setError('') }, [guideKey])

  const apply = () => {
    try {
      const parsed = JSON.parse(text)
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) {
        setError('JSON must be an object with an "items" array.')
        return
      }
      onReplace(parsed)
      setError('')
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`)
    }
  }

  return (
    <Stack direction="column" gap="sm">
      <TextareaField label="Guide JSON" value={text} onChange={(e) => { setText(e.target.value); setError('') }} rows={18} />
      {error ? <Banner status="error" variant="inline">{error}</Banner> : null}
      <ButtonContainer>
        <Button size="sm" variant="secondary" icon="check" onClick={apply}>Apply JSON</Button>
      </ButtonContainer>
    </Stack>
  )
}

// ── The editor view for one guide ─────────────────────────────────────────────

function GuideEditorView({ guide, projects, onBack, onChange, onConvert, onConvertPreview }) {
  const dragFrom = useRef(null)
  const [dragOver, setDragOver] = useState(null)

  const patchGuide = useCallback((patch) => onChange({ ...guide, ...patch }), [guide, onChange])

  const patchItem = useCallback((index, patch) => {
    const items = guide.items.slice()
    items[index] = { ...items[index], ...patch }
    patchGuide({ items })
  }, [guide, patchGuide])

  const moveItem = useCallback((from, to) => {
    if (to < 0 || to >= guide.items.length) return
    patchGuide({ items: moveInArray(guide.items, from, to) })
  }, [guide, patchGuide])

  const deleteItem = (index) => patchGuide({ items: guide.items.filter((_, i) => i !== index) })
  const duplicateItem = (index) => {
    const items = guide.items.slice()
    items.splice(index + 1, 0, JSON.parse(JSON.stringify(items[index])))
    patchGuide({ items })
  }
  const addItem = () => patchGuide({ items: [...guide.items, { componentType: 'Paragraph', title: 'New item', content: '', annotations: [] }] })
  const addGroup = () => patchGuide({
    items: [...guide.items, { kind: 'group', componentType: 'Section', title: 'New group', content: '', children: [{ componentType: 'Heading', title: 'Child item', content: '' }] }],
  })

  const addChild = (index) => {
    const items = guide.items.slice()
    const group = { ...items[index] }
    group.children = [...(group.children || []), { componentType: 'Paragraph', title: 'New child', content: '' }]
    items[index] = group
    patchGuide({ items })
  }
  const patchChild = (index, ci, patch) => {
    const items = guide.items.slice()
    const group = { ...items[index] }
    group.children = group.children.map((c, i) => (i === ci ? { ...c, ...patch } : c))
    items[index] = group
    patchGuide({ items })
  }
  const deleteChild = (index, ci) => {
    const items = guide.items.slice()
    const group = { ...items[index] }
    group.children = group.children.filter((_, i) => i !== ci)
    items[index] = group
    patchGuide({ items })
  }

  const onDragStart = (e, index) => { dragFrom.current = index; e.dataTransfer.effectAllowed = 'move' }
  const onDragOver = (e, index) => { e.preventDefault(); setDragOver(index) }
  const onDrop = (e, index) => {
    e.preventDefault()
    const from = dragFrom.current
    setDragOver(null); dragFrom.current = null
    if (from == null || from === index) return
    patchGuide({ items: moveInArray(guide.items, from, index) })
  }

  const projectOptions = useMemo(
    () => [{ value: '', label: 'No project' }, ...projects.map((p) => ({ value: p.id, label: p.name }))],
    [projects],
  )
  const pageOptions = useMemo(() => {
    if (!guide.projectId) return [{ value: '', label: 'New page on convert' }]
    return [
      { value: '', label: 'New page on convert' },
      ...loadPages(guide.projectId).map((p) => ({ value: p.id, label: p.title })),
    ]
  }, [guide.projectId, guide.updatedAt])

  return (
    <Stack direction="column" gap="lg">
      <Stack direction="column" gap="md">
        <Button variant="tertiary" icon="arrow_back" onClick={onBack}>All guides</Button>
        <div className="a1-pg-toolbar">
          <div className="a1-pg-toolbar__destination">
            <SelectField
              label="Project"
              value={guide.projectId || ''}
              onChange={(e) => patchGuide({ projectId: e.target.value || null, pageId: null })}
            >
              <Options items={projectOptions} />
            </SelectField>
            <SelectField
              label="Target page"
              value={guide.pageId || ''}
              onChange={(e) => patchGuide({ pageId: e.target.value || null })}
              disabled={!guide.projectId}
            >
              <Options items={pageOptions} />
            </SelectField>
          </div>
          <ButtonContainer>
            <Button variant="secondary" icon="dashboard" onClick={() => onConvert(guide)}>Convert to page</Button>
            <Button variant="primary" icon="grid_view" onClick={() => onConvertPreview(guide, 'wireframe')}>Preview wireframe</Button>
            <Button variant="tertiary" icon="notes" onClick={() => onConvertPreview(guide, 'wireframe-redacted')}>Preview redacted</Button>
          </ButtonContainer>
        </div>
      </Stack>

      <div className="a1-pg-editor">
        <div>
          <Stack direction="column" gap="lg">
            <Card>
              <InlineEditable value={guide.title || ''} onChange={(v) => patchGuide({ title: v })} seamless placeholder="Page title">
                <Heading as="h2" size="lg">{guide.title || 'Untitled page'}</Heading>
              </InlineEditable>
              {guide.problemStatement ? <Paragraph color="muted">{guide.problemStatement}</Paragraph> : null}
            </Card>

            <Stack direction="column" gap="xs">
              <Heading as="h3" size="sm">Priority-ranked content</Heading>
              <Paragraph size="sm" color="muted">Ordered most-critical first. Drag or use the arrows to reprioritise.</Paragraph>
            </Stack>

            <ol className="a1-pg-items" style={{ display: 'grid', gap: 'var(--base-spacing-16)', listStyle: 'none', margin: 0, padding: 0 }}>
              {guide.items.map((item, index) => (
                <ItemRow
                  key={index}
                  item={item}
                  index={index}
                  total={guide.items.length}
                  onPatch={patchItem}
                  onMove={moveItem}
                  onDelete={deleteItem}
                  onDuplicate={duplicateItem}
                  onAddChild={addChild}
                  onPatchChild={patchChild}
                  onDeleteChild={deleteChild}
                  isDragging={dragOver === index}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                />
              ))}
            </ol>

            <ButtonContainer>
              <Button variant="secondary" icon="add" onClick={addItem}>Add item</Button>
              <Button variant="tertiary" icon="dashboard_customize" onClick={addGroup}>Add group</Button>
            </ButtonContainer>
          </Stack>
        </div>

        <div className="a1-pg-editor__aside">
          <Card>
            <Stack direction="column" gap="lg">
              <Stack direction="column" gap="sm">
                <Heading as="h3" size="sm">Overview</Heading>
                <OverviewFields guide={guide} onPatch={patchGuide} />
              </Stack>
              <Stack direction="column" gap="sm">
                <Heading as="h3" size="sm">JSON</Heading>
                <JsonPanel guide={guide} onReplace={(parsed) => onChange({ ...guide, ...parsed, id: guide.id, projectId: guide.projectId, pageId: guide.pageId })} />
              </Stack>
            </Stack>
          </Card>
        </div>
      </div>
    </Stack>
  )
}

// ── Top-level page ────────────────────────────────────────────────────────────

export function PriorityGuideEditor({ onNavigate }) {
  const [guides, setGuides] = useState(() => loadGuides())
  const [projects, setProjects] = useState(() => loadProjects())
  const [activeId, setActiveId] = useState(null)
  const [newOpen, setNewOpen] = useState(false)
  const [snack, setSnack] = useState(null)

  useEffect(() => subscribeGuides(() => setGuides(loadGuides())), [])
  useEffect(() => { setProjects(loadProjects()) }, [])

  const active = useMemo(() => (activeId ? getGuide(activeId) : null), [activeId, guides])

  const handleCreate = (fields) => {
    const guide = createGuide(fields)
    setNewOpen(false)
    setActiveId(guide.id)
  }

  const handleChange = (next) => {
    updateGuide(next.id, next)
  }

  const handleDelete = (id) => {
    const removed = getGuide(id)
    deleteGuide(id)
    if (activeId === id) setActiveId(null)
    setSnack({ message: `Deleted "${removed?.title || id}"`, undo: () => createGuide({ ...removed, id: undefined }) })
  }

  const handleDuplicate = (id) => {
    const copy = duplicateGuide(id)
    if (copy) setSnack({ message: `Duplicated as "${copy.title}"` })
  }

  /** Write the guide to a project page (creating one if none is attached). */
  const convertToPage = useCallback((guide, { preview, theme = 'wireframe' } = {}) => {
    if (!guide.projectId) {
      setSnack({ message: 'Choose a project first to convert this guide to a page.' })
      return
    }
    let pageId = guide.pageId
    if (!pageId) {
      const { page } = addPage(guide.projectId, { title: guide.title })
      pageId = page.id
      updateGuide(guide.id, { pageId })
    }
    const def = guideToPageDefinition({ ...guide, pageId }, { pageId })
    commitPageJson(pageId, JSON.stringify(def), 'From priority guide')
    if (preview) {
      const url = `/editor-preview?standalone&screen=${encodeURIComponent(pageId)}&project=${encodeURIComponent(guide.projectId)}&theme=${encodeURIComponent(theme)}`
      window.open(url, '_blank', 'noopener')
      return
    }
    const editorPath = `/editor?project=${encodeURIComponent(guide.projectId)}&doc=${encodeURIComponent(pageId)}`
    setSnack({
      message: 'Converted to page.',
      actionLabel: 'Open in editor',
      onAction: () => onNavigate?.('editor', { path: editorPath }),
    })
  }, [onNavigate])

  const breadcrumbItems = [
    { label: 'Editors', href: '/editor' },
    { label: 'Priority guides', current: true },
  ]

  return (
    <>
      <PageTitleArea
        breadcrumbItems={breadcrumbItems}
        title="Priority guides"
        description="Align on the problem, audience, goals, and priority-ranked content for a page — then convert it into an A1 page or a wireframe."
      />
      <Section padding="lg" contentWidth="xl">
        {active ? (
          <GuideEditorView
            guide={active}
            projects={projects}
            onBack={() => setActiveId(null)}
            onChange={handleChange}
            onConvert={(g) => convertToPage(g)}
            onConvertPreview={(g, theme) => convertToPage(g, { preview: true, theme })}
          />
        ) : (
          <GuideLibrary
            guides={guides}
            onOpen={setActiveId}
            onNew={() => setNewOpen(true)}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}
      </Section>

      <NewGuideDialog open={newOpen} onClose={() => setNewOpen(false)} onCreate={handleCreate} />

      {snack ? (
        <Snackbar
          open
          position="bottom"
          actionLabel={snack.actionLabel || (snack.undo ? 'Undo' : undefined)}
          onAction={snack.onAction || snack.undo}
          onClose={() => setSnack(null)}
        >
          {snack.message}
        </Snackbar>
      ) : null}
    </>
  )
}

export default PriorityGuideEditor
