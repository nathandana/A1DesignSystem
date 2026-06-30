import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Banner,
  Button,
  ButtonContainer,
  Card,
  Code,
  DataTable,
  Divider,
  Dialog,
  Heading,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  RadioGroup,
  Section,
  SegmentedControl,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { RenderPageDefinition } from '../editor/pageRenderer.tsx'
import { PageTitleArea } from './PageTitleArea.jsx'
import { definitionToJsx } from '../editor/definitionToJsx.ts'
import { chooseModel, listLocalModels, localChat } from '../lib/localAi.ts'
import { allComponents } from './components/utils.js'
import {
  deleteComponentProposal,
  listComponentProposals,
  subscribeComponentProposals,
  upsertComponentProposal,
} from '../proposals/componentProposalStore.js'

const STATUSES = ['draft', 'proposal', 'review', 'accepted', 'released']
const STATUS_LABELS = {
  draft: 'Draft',
  proposal: 'Proposal',
  review: 'Review',
  accepted: 'Accepted',
  released: 'Released',
}
const STATUS_BADGES = {
  draft: 'neutral',
  proposal: 'info',
  review: 'warn',
  accepted: 'success',
  released: 'success',
}

const KIND_OPTIONS = [
  { value: 'component', label: 'New component' },
  { value: 'property', label: 'Existing component property' },
]

const EMPTY_FORM = {
  kind: 'component',
  name: '',
  targetComponent: 'Button',
  description: '',
  problem: '',
  prompt: '',
  creator: 'A1 designer',
  visibility: 'reviewers',
}

const ALLOWED_PREVIEW_TYPES = new Set([
  'Section',
  'Stack',
  'Grid',
  'Card',
  'ButtonContainer',
  'Heading',
  'Paragraph',
  'Divider',
  'List',
  'ListItem',
  'Icon',
  'Button',
  'IconButton',
  'Switch',
  'SegmentedControl',
  'Banner',
  'MessageBadge',
  'MessageEmptyState',
  'StatusBar',
  'TextField',
  'TextareaField',
  'SelectField',
  'Fieldset',
  'ChoiceGroup',
  'DefinitionList',
  'Breadcrumb',
  'Accordion',
  'Tabs',
  'DataTable',
])

const PROP_TEXT_ONLY_TYPES = new Set([
  'TextField',
  'TextareaField',
  'SelectField',
  'Switch',
  'SegmentedControl',
  'StatusBar',
  'Icon',
  'IconButton',
  'DataTable',
])

const OLLAMA_SYSTEM_PROMPT = `
You create first-draft A1 Design System component proposals.
Return only valid JSON. No markdown. No commentary.
The JSON object must have:
{
  "name": "Short proposed component or property name",
  "description": "One sentence describing the proposal",
  "problem": "One sentence describing the problem solved",
  "definition": PageDefinition
}

PageDefinition shape:
{
  "schemaVersion": "0.1.0",
  "page": {
    "id": "slug-preview",
    "name": "Name",
    "description": "Description",
    "layout": {
      "type": "PageLayout",
      "props": {},
      "regions": [{ "id": "main", "name": "Main", "nodes": [ComponentNode] }]
    }
  }
}

ComponentNode shape:
{
  "id": "stable-kebab-id",
  "type": "A1 component type",
  "props": {},
  "content": { "fallback": "Visible text" },
  "children": []
}

Use only these component types:
Section, Stack, Grid, Card, ButtonContainer, Heading, Paragraph, Divider, List, ListItem, Icon, Button, IconButton, Switch, SegmentedControl, Banner, MessageBadge, MessageEmptyState, StatusBar, TextField, TextareaField, SelectField, Fieldset, ChoiceGroup, DefinitionList, Breadcrumb, Accordion, Tabs, DataTable.

Rules:
- Use sentence case.
- Use existing A1 props and token-like values only.
- Do not use className, style, raw colors, raw spacing, functions, imports, JSX, HTML tags, or JavaScript expressions.
- Keep the preview compact: one Section with one Stack is enough.
- For text, use content.fallback. For fields, use props.label.
- If this is a property proposal, preview the target component and explain the proposed property.
- The app will turn the returned PageDefinition into a React component source artifact after validation.
`.trim()

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'component-proposal'
}

function titleCase(value) {
  return String(value || '')
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function pascalCase(value) {
  const name = titleCase(value).replace(/[^a-zA-Z0-9]/g, '')
  return /^[A-Z]/.test(name) ? name : `A1${name || 'Component'}`
}

function collectComponentTypes(definition) {
  const types = new Set()
  const visit = (node) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.type === 'string') types.add(node.type)
    if (Array.isArray(node.children)) node.children.forEach(visit)
  }
  const layout = definition?.page?.layout
  if (layout?.type) types.add(layout.type)
  for (const region of layout?.regions || []) {
    for (const node of region.nodes || []) visit(node)
  }
  return Array.from(types).sort()
}

function buildComponentSource(name, definition) {
  const componentName = pascalCase(name)
  const imports = collectComponentTypes(definition)
  const jsx = definitionToJsx(definition)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')
  return `import {\n  ${imports.join(',\n  ')},\n} from '@gtivr4/a1-design-system-react'\n\nexport function ${componentName}(props) {\n  return (\n${jsx}\n  )\n}\n`
}

function inferName(form) {
  if (form.name.trim()) return form.name.trim()
  if (form.kind === 'property') return `${form.targetComponent} proposal`
  const prompt = form.prompt || form.description || form.problem
  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !['with', 'that', 'this', 'from', 'component', 'users', 'should'].includes(word.toLowerCase()))
  return `${titleCase(words.join(' ')) || 'Generated'} panel`
}

function inferDescription(form, name) {
  return form.description.trim()
    || form.prompt.trim()
    || `${name} proposed from an A1 component brief.`
}

function inferProblem(form, name) {
  return form.problem.trim()
    || `Teams need a consistent ${name.toLowerCase()} pattern that can be reviewed before it becomes part of the system.`
}

function previewDefinition(form, name, description, problem) {
  const id = slugify(name)
  const prompt = `${form.prompt} ${description} ${problem}`.toLowerCase()
  const tableLike = prompt.includes('table') || prompt.includes('compare') || prompt.includes('data')
  const formLike = prompt.includes('form') || prompt.includes('input') || prompt.includes('field')
  const statusLike = prompt.includes('status') || prompt.includes('progress') || prompt.includes('approval')

  const mainChildren = [
    {
      id: `${id}-eyebrow`,
      type: 'MessageBadge',
      props: { status: form.kind === 'property' ? 'info' : 'neutral', size: 'sm', subtle: true },
      content: { fallback: form.kind === 'property' ? `${form.targetComponent} property proposal` : 'Component proposal' },
    },
    {
      id: `${id}-heading`,
      type: 'Heading',
      props: { as: 'h2', size: 'lg' },
      content: { fallback: name },
    },
    {
      id: `${id}-body`,
      type: 'Paragraph',
      props: { color: 'muted' },
      content: { fallback: description },
    },
  ]

  if (form.kind === 'property') {
    mainChildren.push(
      {
        id: `${id}-target`,
        type: 'Card',
        props: { icon: 'tune' },
        children: [
          {
            id: `${id}-target-stack`,
            type: 'Stack',
            props: { gap: 'xs' },
            children: [
              {
                id: `${id}-target-title`,
                type: 'Heading',
                props: { as: 'h3', size: 'sm' },
                content: { fallback: `Extend ${form.targetComponent}` },
              },
              {
                id: `${id}-target-copy`,
                type: 'Paragraph',
                props: { size: 'sm', color: 'muted' },
                content: { fallback: problem },
              },
            ],
          },
        ],
      },
      {
        id: `${id}-action`,
        type: 'Button',
        props: { variant: 'secondary', icon: 'approval' },
        content: { fallback: 'Review property proposal' },
      },
    )
  } else if (tableLike) {
    mainChildren.push({
      id: `${id}-table`,
      type: 'DataTable',
      props: {
        caption: `${name} preview`,
        columns: [
          { key: 'item', label: 'Item' },
          { key: 'state', label: 'State' },
          { key: 'owner', label: 'Owner' },
        ],
        rows: [
          { id: 'one', item: 'Primary flow', state: 'Ready', owner: 'Design' },
          { id: 'two', item: 'Variant', state: 'Review', owner: 'Product' },
        ],
        zebra: true,
      },
    })
  } else if (formLike) {
    mainChildren.push(
      {
        id: `${id}-field`,
        type: 'TextField',
        props: { label: 'Name', size: 'compact', placeholder: 'Enter a value' },
      },
      {
        id: `${id}-textarea`,
        type: 'TextareaField',
        props: { label: 'Notes', rows: 'sm' },
      },
      {
        id: `${id}-button`,
        type: 'Button',
        props: { icon: 'check' },
        content: { fallback: 'Save draft' },
      },
    )
  } else if (statusLike) {
    mainChildren.push(
      {
        id: `${id}-status`,
        type: 'StatusBar',
        props: { value: 65, label: 'Proposal readiness' },
      },
      {
        id: `${id}-badge`,
        type: 'MessageBadge',
        props: { status: 'info', icon: 'pending_actions' },
        content: { fallback: 'Ready for review' },
      },
    )
  } else {
    mainChildren.push(
      {
        id: `${id}-summary-card`,
        type: 'Card',
        props: { icon: 'auto_awesome' },
        children: [
          {
            id: `${id}-summary-stack`,
            type: 'Stack',
            props: { gap: 'xs' },
            children: [
              {
                id: `${id}-summary-title`,
                type: 'Heading',
                props: { as: 'h3', size: 'sm' },
                content: { fallback: 'Why this belongs in A1' },
              },
              {
                id: `${id}-summary-copy`,
                type: 'Paragraph',
                props: { size: 'sm', color: 'muted' },
                content: { fallback: problem },
              },
            ],
          },
        ],
      },
      {
        id: `${id}-actions`,
        type: 'ButtonContainer',
        children: [
          {
            id: `${id}-primary-action`,
            type: 'Button',
            props: { icon: 'arrow_forward', iconPosition: 'end' },
            content: { fallback: 'Use proposal' },
          },
          {
            id: `${id}-secondary-action`,
            type: 'Button',
            props: { variant: 'secondary', icon: 'visibility' },
            content: { fallback: 'Preview guidance' },
          },
        ],
      },
    )
  }

  return {
    schemaVersion: '0.1.0',
    page: {
      id: `${id}-preview`,
      name,
      description,
      layout: {
        type: 'PageLayout',
        props: {},
        regions: [
          {
            id: 'main',
            name: 'Main',
            nodes: [
              {
                id: `${id}-section`,
                type: 'Section',
                props: { padding: 'lg', contentWidth: 'md', surface: 'panel', borderSize: 'sm', borderVariant: 'neutral' },
                children: [
                  {
                    id: `${id}-stack`,
                    type: 'Stack',
                    props: { gap: 'sm' },
                    children: mainChildren,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  }
}

function extractJsonObject(text) {
  const trimmed = String(text || '').trim()
  if (!trimmed) throw new Error('Empty model response')
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1].trim() : trimmed.slice(trimmed.indexOf('{'), trimmed.lastIndexOf('}') + 1)
  return JSON.parse(candidate)
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const TYPE_LOOKUP = Array.from(ALLOWED_PREVIEW_TYPES).reduce((map, type) => {
  map.set(type.toLowerCase().replace(/[^a-z0-9]/g, ''), type)
  return map
}, new Map())

function normalizeType(type) {
  if (typeof type !== 'string') return null
  return TYPE_LOOKUP.get(type.toLowerCase().replace(/[^a-z0-9]/g, '')) || null
}

function normalizeContent(content, fallbackText) {
  if (typeof content === 'string') return { fallback: content }
  if (isPlainObject(content) && typeof content.fallback === 'string') return { fallback: content.fallback }
  if (typeof fallbackText === 'string' && fallbackText.trim()) return { fallback: fallbackText.trim() }
  return undefined
}

function normalizeNode(node, fallbackId, depth = 0) {
  if (!isPlainObject(node) || depth > 8) return null
  const type = normalizeType(node.type || node.component)
  if (!type) return null
  const childrenSource = Array.isArray(node.children)
    ? node.children
    : Array.isArray(node.nodes)
      ? node.nodes
      : []
  const children = childrenSource
    .map((child, index) => normalizeNode(child, `${fallbackId}-${index + 1}`, depth + 1))
    .filter(Boolean)
  const props = isPlainObject(node.props) ? { ...node.props } : {}
  const content = normalizeContent(node.content, node.text || node.label)
  if (content && PROP_TEXT_ONLY_TYPES.has(type) && typeof props.label !== 'string') {
    props.label = content.fallback
  }
  const normalized = {
    id: typeof node.id === 'string' && node.id.trim() ? slugify(node.id) : fallbackId,
    type,
  }
  if (Object.keys(props).length) normalized.props = props
  if (content && !PROP_TEXT_ONLY_TYPES.has(type)) normalized.content = content
  if (children.length) normalized.children = children
  return normalized
}

function normalizeDefinition(input, fallback, name, description) {
  const candidate = input?.definition || input?.pageDefinition || input
  if (!isPlainObject(candidate)) return fallback
  const sourcePage = isPlainObject(candidate.page) ? candidate.page : candidate
  const sourceLayout = isPlainObject(sourcePage.layout) ? sourcePage.layout : candidate.layout
  const sourceRegions = Array.isArray(sourceLayout?.regions)
    ? sourceLayout.regions
    : Array.isArray(sourcePage.regions)
      ? sourcePage.regions
      : Array.isArray(sourceLayout?.nodes) || Array.isArray(sourcePage.nodes) || Array.isArray(sourcePage.children)
        ? [{ id: 'main', name: 'Main', nodes: sourceLayout?.nodes || sourcePage.nodes || sourcePage.children }]
        : []
  const regions = sourceRegions
    .map((region, regionIndex) => {
      if (!isPlainObject(region)) return null
      const nodesSource = Array.isArray(region.nodes)
        ? region.nodes
        : Array.isArray(region.children)
          ? region.children
          : []
      const nodes = nodesSource
        .map((node, nodeIndex) => normalizeNode(node, `proposal-${regionIndex + 1}-${nodeIndex + 1}`))
        .filter(Boolean)
      if (!nodes.length) return null
      return {
        id: typeof region.id === 'string' && region.id.trim() ? slugify(region.id) : 'main',
        name: typeof region.name === 'string' && region.name.trim() ? region.name : 'Main',
        nodes,
      }
    })
    .filter(Boolean)
  if (!regions.length) return fallback
  return {
    schemaVersion: '0.1.0',
    page: {
      id: sourcePage.id || `${slugify(name)}-preview`,
      name,
      description,
      layout: {
        type: 'PageLayout',
        props: isPlainObject(sourceLayout?.props) ? sourceLayout.props : {},
        regions,
      },
    },
  }
}

function validateNode(node, depth = 0) {
  if (!isPlainObject(node)) return false
  if (typeof node.id !== 'string' || !node.id.trim()) return false
  if (typeof node.type !== 'string' || !ALLOWED_PREVIEW_TYPES.has(node.type)) return false
  if (node.props !== undefined && !isPlainObject(node.props)) return false
  if (PROP_TEXT_ONLY_TYPES.has(node.type) && node.content !== undefined) return false
  if (node.content !== undefined) {
    if (!isPlainObject(node.content) || typeof node.content.fallback !== 'string') return false
  }
  if (node.children !== undefined) {
    if (!Array.isArray(node.children) || depth > 8) return false
    if (!node.children.every((child) => validateNode(child, depth + 1))) return false
  }
  return true
}

function validateDefinition(definition) {
  if (!isPlainObject(definition)) return false
  const layout = definition.page?.layout
  if (!isPlainObject(definition.page) || !isPlainObject(layout)) return false
  if (layout.type !== 'PageLayout') return false
  if (!Array.isArray(layout.regions) || layout.regions.length === 0) return false
  return layout.regions.every((region) => (
    isPlainObject(region)
    && typeof region.id === 'string'
    && Array.isArray(region.nodes)
    && region.nodes.every((node) => validateNode(node))
  ))
}

function sanitizeAiProposal(form, parsed) {
  if (!isPlainObject(parsed)) throw new Error('The model did not return a valid JSON object.')
  const fallback = buildProposal(form)
  const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : fallback.name
  const description = typeof parsed.description === 'string' && parsed.description.trim() ? parsed.description.trim() : fallback.description
  const problem = typeof parsed.problem === 'string' && parsed.problem.trim() ? parsed.problem.trim() : fallback.problem
  const definition = normalizeDefinition(parsed, fallback.definition, name, description)
  if (!validateDefinition(definition)) throw new Error('The model did not return a valid A1 page definition.')
  return {
    ...fallback,
    name,
    description,
    problem,
    definition,
    source: buildComponentSource(name, definition),
  }
}

async function buildProposalWithOllama(form) {
  const models = await listLocalModels(2000)
  const model = chooseModel(models)
  if (!model) {
    return {
      proposal: buildProposal(form),
      engine: 'deterministic',
      note: 'No local Ollama model was found, so the built-in generator created the draft.',
    }
  }

  const prompt = JSON.stringify({
    request: 'Generate a component proposal preview.',
    kind: form.kind,
    proposedName: form.name,
    targetComponent: form.kind === 'property' ? form.targetComponent : null,
    description: form.description,
    problem: form.problem,
    brief: form.prompt,
    visibility: form.visibility,
  }, null, 2)

  const result = await localChat({
    system: OLLAMA_SYSTEM_PROMPT,
    prompt,
    model,
    temperature: 0.15,
  })
  let proposal
  let repaired = false
  try {
    proposal = sanitizeAiProposal(form, extractJsonObject(result.text))
  } catch (err) {
    const fallback = buildProposal(form)
    const repairPrompt = JSON.stringify({
      request: 'Repair the previous response so it exactly matches the required JSON contract.',
      previousResponse: result.text,
      requiredTemplate: {
        name: fallback.name,
        description: fallback.description,
        problem: fallback.problem,
        definition: fallback.definition,
      },
      instruction: 'Return only valid JSON. Keep the definition shape from requiredTemplate if unsure, but adapt the text to the brief.',
    }, null, 2)
    const repair = await localChat({
      system: OLLAMA_SYSTEM_PROMPT,
      prompt: repairPrompt,
      model,
      temperature: 0,
    })
    proposal = sanitizeAiProposal(form, extractJsonObject(repair.text))
    repaired = true
  }
  return {
    proposal,
    engine: 'ollama',
    model: result.model,
    note: `Generated with Ollama (${result.model})${repaired ? ' after repairing the response' : ''} in ${(result.elapsedMs / 1000).toFixed(1)}s.`,
  }
}

function buildProposal(form) {
  const name = inferName(form)
  const description = inferDescription(form, name)
  const problem = inferProblem(form, name)
  const definition = previewDefinition(form, name, description, problem)
  return {
    kind: form.kind,
    name,
    targetComponent: form.kind === 'property' ? form.targetComponent : '',
    status: 'draft',
    creator: form.creator.trim() || 'A1 designer',
    visibility: form.visibility,
    description,
    problem,
    prompt: form.prompt.trim(),
    definition,
    source: buildComponentSource(name, definition),
    updates: [{ at: new Date().toISOString(), by: form.creator.trim() || 'A1 designer', note: 'Generated draft proposal' }],
  }
}

function statusBadge(status) {
  return (
    <MessageBadge status={STATUS_BADGES[status] || 'neutral'} size="sm" subtle>
      {STATUS_LABELS[status] || status}
    </MessageBadge>
  )
}

function formatDate(value) {
  if (!value) return 'Not saved'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

export function ComponentProposals({ onNavigate }) {
  const [proposals, setProposals] = useState(() => listComponentProposals())
  const [form, setForm] = useState(EMPTY_FORM)
  const [activeId, setActiveId] = useState('')
  const [jsonDraft, setJsonDraft] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [generationStatus, setGenerationStatus] = useState('')
  const [generationError, setGenerationError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [view, setView] = useState('preview')

  useEffect(() => subscribeComponentProposals(() => setProposals(listComponentProposals())), [])

  const activeProposal = useMemo(
    () => proposals.find((proposal) => proposal.id === activeId) || proposals[0] || null,
    [activeId, proposals],
  )

  useEffect(() => {
    if (!activeProposal) {
      setJsonDraft('')
      setJsonError('')
      return
    }
    setActiveId(activeProposal.id)
    setJsonDraft(JSON.stringify(activeProposal.definition, null, 2))
    setJsonError('')
  }, [activeProposal?.id])

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'kind', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'visibility', label: 'Visibility', sortable: true },
    { key: 'updated', label: 'Updated', sortable: true },
    { key: 'actions', label: '', type: 'actions' },
  ]

  const rows = proposals.map((proposal) => ({
    id: proposal.id,
    name: proposal.name,
    kind: proposal.kind === 'property' ? `Property · ${proposal.targetComponent}` : 'Component',
    statusValue: proposal.status,
    status: statusBadge(proposal.status),
    visibility: proposal.visibility === 'builders' ? 'Project builders' : 'Reviewers',
    updated: formatDate(proposal.updatedAt),
    actions: [
      { label: 'Open', icon: 'open_in_new', onClick: () => setActiveId(proposal.id) },
      { label: 'Delete', icon: 'delete', onClick: () => setDeleteTarget(proposal) },
    ],
  }))

  function setField(patch) {
    setForm((current) => ({ ...current, ...patch }))
  }

  async function generateProposal() {
    if (generating) return
    setGenerating(true)
    setGenerationStatus('')
    setGenerationError('')
    try {
      const result = await buildProposalWithOllama(form)
      const note = result.note || 'Generated draft proposal'
      const saved = upsertComponentProposal({
        ...result.proposal,
        updates: [
          ...(result.proposal.updates || []),
          { at: new Date().toISOString(), by: result.proposal.creator, note },
        ],
      })
      setActiveId(saved.id)
      setForm(EMPTY_FORM)
      setGenerationStatus(note)
      setView('preview')
      setDialogOpen(false)
    } catch (err) {
      const fallback = buildProposal(form)
      const note = 'Ollama could not return a usable A1 definition after one repair attempt, so the built-in generator created the draft.'
      const saved = upsertComponentProposal({
        ...fallback,
        updates: [
          ...(fallback.updates || []),
          { at: new Date().toISOString(), by: fallback.creator, note },
        ],
      })
      setActiveId(saved.id)
      setForm(EMPTY_FORM)
      setGenerationStatus(note)
      setGenerationError(err instanceof Error ? err.message : 'Ollama generation failed.')
      setView('preview')
      setDialogOpen(false)
    } finally {
      setGenerating(false)
    }
  }

  function openNewDialog() {
    setForm(EMPTY_FORM)
    setGenerationStatus('')
    setGenerationError('')
    setDialogOpen(true)
  }

  function confirmDeleteProposal() {
    if (!deleteTarget) return
    deleteComponentProposal(deleteTarget.id)
    if (activeId === deleteTarget.id) setActiveId('')
    setDeleteTarget(null)
  }

  function updateActive(patch, note) {
    if (!activeProposal) return
    const next = {
      ...activeProposal,
      ...patch,
      updates: note
        ? [...(activeProposal.updates || []), { at: new Date().toISOString(), by: activeProposal.creator, note }]
        : activeProposal.updates,
    }
    const saved = upsertComponentProposal(next)
    setActiveId(saved.id)
  }

  function advanceStatus() {
    if (!activeProposal) return
    const current = STATUSES.indexOf(activeProposal.status)
    const nextStatus = STATUSES[Math.min(current + 1, STATUSES.length - 1)] || 'draft'
    updateActive({ status: nextStatus }, `Moved to ${STATUS_LABELS[nextStatus]}`)
  }

  function saveJsonDraft(value = jsonDraft) {
    if (!activeProposal) return
    try {
      const definition = JSON.parse(value)
      updateActive({ definition, source: buildComponentSource(activeProposal.name, definition) }, 'Updated generated definition and rebuilt component source in developer mode')
      setJsonError('')
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON')
    }
  }

  function handleJsonChange(value) {
    setJsonDraft(value)
    try {
      JSON.parse(value)
      setJsonError('')
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON')
    }
  }

  const componentOptions = allComponents.map((component) => ({ value: component.title, label: component.title }))
  const activeSource = activeProposal?.source || (activeProposal ? buildComponentSource(activeProposal.name, activeProposal.definition) : '')

  return (
    <>
      <PageTitleArea
        headingId="component-proposals-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (event) => { event?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Component proposals' },
        ]}
        title="Component proposals"
        description="Describe a component or property change, generate a governed draft, and move it through proposal review before release."
        actions={<Button icon="add" onClick={openNewDialog}>New component</Button>}
      />

      <Section padding="sm" contentWidth="xl" aria-labelledby="component-proposals-heading">
        <Stack direction="column" gap="lg">
          {generationStatus && (
            <Banner status={generationError ? 'warn' : 'success'} variant="inline" onDismiss={() => { setGenerationStatus(''); setGenerationError('') }}>
              {generationStatus}{generationError ? ` ${generationError}` : ''}
            </Banner>
          )}

          <Stack direction="column" gap="lg">
            <Stack direction="column" gap="md" grow>
              {proposals.length === 0 ? (
                <MessageEmptyState
                  icon="dashboard_customize"
                  title="No component proposals yet"
                  description="Generate a draft to start the approval pipeline."
                />
              ) : (
                <DataTable
                  caption="Component proposals"
                  columns={columns}
                  rows={rows}
                  getRowId={(row) => row.id}
                  searchableColumns={[{ key: 'name', label: 'Name' }, { key: 'kind', label: 'Type' }]}
                  filters={[
                    {
                      key: 'statusValue',
                      label: 'Status',
                      type: 'single',
                      options: STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
                    },
                  ]}
                  defaultSort={{ key: 'updated', direction: 'desc' }}
                  zebra
                  scrollable
                  emptyTitle="No matching proposals"
                  emptyDescription="Adjust the search or status filter."
                  emptyIcon="search"
                />
              )}
            </Stack>

            <Stack direction="column" gap="md" grow>
              {activeProposal ? (
                <Card>
                  <Stack direction="column" gap="md">
                    <Stack direction={{ xs: 'column', sm: 'row' }} justify="between" align="start" gap="sm">
                      <Stack direction="column" gap="xs">
                        {statusBadge(activeProposal.status)}
                        <Heading as="h2" size="md">{activeProposal.name}</Heading>
                        <Paragraph size="sm" color="muted">{activeProposal.description}</Paragraph>
                      </Stack>
                      <ButtonContainer>
                        <Button
                          variant="secondary"
                          icon="arrow_forward"
                          disabled={activeProposal.status === 'released'}
                          onClick={advanceStatus}
                        >
                          {activeProposal.status === 'released' ? 'Released' : `Move to ${STATUS_LABELS[STATUSES[Math.min(STATUSES.indexOf(activeProposal.status) + 1, STATUSES.length - 1)]]}`}
                        </Button>
                      </ButtonContainer>
                    </Stack>

                    <Divider />

                    <Stack direction={{ xs: 'column', md: 'row' }} gap="sm">
                      <MessageBadge size="sm" subtle icon="person">{activeProposal.creator}</MessageBadge>
                      <MessageBadge size="sm" subtle icon="calendar_month">{formatDate(activeProposal.createdAt)}</MessageBadge>
                      <MessageBadge size="sm" subtle icon="visibility">
                        {activeProposal.visibility === 'builders' ? 'Project builders' : 'Proposal reviewers'}
                      </MessageBadge>
                    </Stack>

                    <Paragraph size="sm"><strong>Problem:</strong> {activeProposal.problem}</Paragraph>

                    <SegmentedControl
                      aria-label="Proposal detail view"
                      labelMode="selected"
                      options={[
                        { value: 'preview', label: 'Preview' },
                        { value: 'component', label: 'Component code' },
                        { value: 'developer', label: 'Developer mode' },
                        { value: 'updates', label: 'Updates' },
                      ]}
                      value={view}
                      onChange={setView}
                    />

                    {view === 'preview' && (
                      <Section padding="none" borderSize="sm" borderVariant="neutral" radius="md">
                        <RenderPageDefinition definition={activeProposal.definition} />
                      </Section>
                    )}

                    {view === 'component' && (
                      <Stack direction="column" gap="sm">
                        <Paragraph size="sm" color="muted">
                          Buildable React source generated from the validated A1 preview definition.
                        </Paragraph>
                        <Code variant="block" wrapping copyCode collapsible collapsedLines={28}>
                          {activeSource}
                        </Code>
                      </Stack>
                    )}

                    {view === 'developer' && (
                      <Stack direction="column" gap="sm">
                        <Paragraph size="sm" color="muted">
                          Edit the generated A1 page definition. Accepted proposals can later become package components or project patterns.
                        </Paragraph>
                        {jsonError && <Banner status="error" variant="inline">{jsonError}</Banner>}
                        <Code variant="block" editable wrapping copyCode onChangeValue={handleJsonChange}>
                          {jsonDraft}
                        </Code>
                        <ButtonContainer>
                          <Button icon="save" disabled={!!jsonError || !jsonDraft.trim()} onClick={() => saveJsonDraft()}>
                            Save generated JSON
                          </Button>
                        </ButtonContainer>
                      </Stack>
                    )}

                    {view === 'updates' && (
                      <Stack direction="column" gap="xs">
                        {(activeProposal.updates || []).map((update) => (
                          <Card key={`${update.at}-${update.note}`}>
                            <Stack direction="column" gap="2xs">
                              <Paragraph size="sm">{update.note}</Paragraph>
                              <Paragraph size="xs" color="muted">{formatDate(update.at)} · {update.by}</Paragraph>
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Card>
              ) : (
                <MessageEmptyState
                  icon="preview"
                  title="Select a proposal"
                  description="Generated drafts appear here with metadata, pipeline state, live preview, and developer mode."
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      </Section>

      <Dialog
        open={dialogOpen}
        onClose={() => { if (!generating) setDialogOpen(false) }}
        title="New component proposal"
        footer={
          <>
            <Button variant="secondary" disabled={generating} onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              icon="auto_awesome"
              loading={generating}
              disabled={generating || (!form.prompt.trim() && !form.name.trim())}
              onClick={generateProposal}
            >
              Generate with Ollama
            </Button>
          </>
        }
      >
        <Stack direction="column" gap="md">
          <Banner status="info" variant="inline">
            Drafts use your local Ollama model when one is available at localhost:11434, then fall back to the built-in generator.
          </Banner>
          <Stack direction="column" gap="md" align='start'>
            <RadioGroup
              label="Proposal type"
              
              options={KIND_OPTIONS}
              value={form.kind}
              onChange={(kind) => setField({ kind })}
            />
            {form.kind === 'property' && (
              <Autocomplete
                label="Target component"
                options={componentOptions}
                value={form.targetComponent}
                onChange={(targetComponent) => setField({ targetComponent })}
              />
            )}
            <RadioGroup
              label="Visibility"
              value={form.visibility}
              onChange={(visibility) => setField({ visibility })}
              options={[
                { value: 'reviewers', label: 'Proposal reviewers' },
                { value: 'builders', label: 'Project builders after acceptance' },
              ]}
            />
          </Stack>

          <TextField
            label="Proposed name"
            required
            value={form.name}
            onChange={(event) => setField({ name: event.target.value })}
            // placeholder={inferName(form)}
            hint="Optional. A suggested name is generated from the brief."
          />
          <TextareaField
            label="Describe the component or property"
            rows="sm"
            value={form.prompt}
            onChange={(event) => setField({ prompt: event.target.value })}
            required
            // placeholder="A compact approval summary card for rollout decisions, with status, owner, and next action."
          />
          <TextareaField
            label="Problem solved"
            rows="sm"
            value={form.problem}
            onChange={(event) => setField({ problem: event.target.value })}
            // placeholder="What user or team problem should this solve?"
          />
          <TextField
            label="Creator"
            
            value={form.creator}
            onChange={(event) => setField({ creator: event.target.value })}
          />
        </Stack>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete component proposal?"
        status="warn"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" icon="delete" onClick={confirmDeleteProposal}>Delete proposal</Button>
          </>
        }
      >
        <Paragraph>
          Delete {deleteTarget ? `"${deleteTarget.name}"` : 'this proposal'}? This removes its generated preview, metadata, and update history.
        </Paragraph>
      </Dialog>
    </>
  )
}
