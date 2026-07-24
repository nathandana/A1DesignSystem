import { useEffect, useRef, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Code,
  DefinitionList,
  Dialog,
  Figure,
  IconButton,
  Link,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  SelectField,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  TextareaField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
} from '@gtivr4/a1-design-system-react'
import { resolveSrc } from '../lib/imageLibrary'
import { useT } from '../labels/useT'
import { getPersona } from '../services/backlog/personas'
import {
  COMPLEXITIES, COMPLEXITY_LABELS, PRIORITIES, PRIORITY_LABELS, SCOPE_KINDS,
  SCOPE_LABELS, STATUS_ICON, STATUS_LABELS, STATUSES, TYPE_ICON, TYPE_LABELS,
  TYPES, ticketRef,
} from '../services/backlog/types'
import { useBacklog } from './BacklogContext'
import { attachImageFiles, attachmentStatus, imageFilesFromClipboard } from './imageAttachments'
import { TicketAiPrompt } from './TicketAiPrompt'
import { TicketMergePanel } from './TicketMergePanel'
import { TicketPersonaReview } from './TicketPersonaReview'
import { ThreadEntry } from './TicketThreadEntry'

function when(iso) {
  try { return new Date(iso).toLocaleString() } catch { return '' }
}
function reviewDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } catch { return '' }
}

// Per-persona "reviewed" tags (Virtual Team). Each shows who reviewed and when.
export function ReviewTags({ reviews }) {
  const entries = Object.entries(reviews || {})
  if (!entries.length) return '—'
  return (
    <Stack direction="row" gap="xs" wrap>
      {entries.map(([pid, r]) => {
        const p = getPersona(pid)
        return (
          <MessageBadge key={pid} status="info" subtle size="sm" icon={p?.icon || 'smart_toy'}>
            {(p?.role || pid)} · reviewed {reviewDate(r.at)}
          </MessageBadge>
        )
      })}
    </Stack>
  )
}

// Common workflow stages stay visible first when the status toolbar overflows.
export const PRIMARY_STATUSES = ['new', 'triaged', 'accepted', 'in_progress', 'paused', 'done']
export const OVERFLOW_STATUSES = STATUSES.filter((s) => !PRIMARY_STATUSES.includes(s))

// ── Lightweight markdown for ticket descriptions (imported from TODO.md) ─────────
// Renders **bold**, _italic_, `code`, and `-` bullet lists into readable A1
// components. Intentionally minimal — descriptions are short prose, not full MD.

function inlineNodes(text) {
  const out = []
  const re = /\*\*(.+?)\*\*|`(.+?)`|(?<![\w*])_(.+?)_(?![\w])/g
  let last = 0
  let m
  let k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1] != null) out.push(<strong key={k++}>{m[1]}</strong>)
    else if (m[2] != null) out.push(<Code key={k++} variant="inline">{m[2]}</Code>)
    else out.push(<em key={k++}>{m[3]}</em>)
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function TicketDescription({ text }) {
  const blocks = []
  let para = []
  let bullets = []
  const flushPara = () => { if (para.length) { blocks.push({ type: 'p', text: para.join(' ') }); para = [] } }
  const flushBullets = () => { if (bullets.length) { blocks.push({ type: 'ul', items: bullets.slice() }); bullets = [] } }
  for (const raw of String(text).split('\n')) {
    const line = raw.trim()
    if (!line) { flushPara(); flushBullets(); continue }
    const bullet = line.match(/^[-*]\s+(.*)$/)
    if (bullet) { flushPara(); bullets.push(bullet[1]) }
    else { flushBullets(); para.push(line) }
  }
  flushPara(); flushBullets()
  return (
    <Stack gap="sm">
      {blocks.map((b, i) => (b.type === 'ul'
        ? <List key={i} variant="unordered" size="sm">{b.items.map((it, j) => <ListItem key={j}>{inlineNodes(it)}</ListItem>)}</List>
        : <Paragraph key={i} size="md">{inlineNodes(b.text)}</Paragraph>))}
    </Stack>
  )
}

// ── Inline-editable content fields (A1-208) ──────────────────────────────────
// "Make all fields editable that can be." Title commits on blur (Enter confirms,
// empty reverts); description toggles to a textarea with Save/Cancel so its
// rendered-markdown view is preserved when not editing. Type, status, priority,
// size and scope are edited via the toolbars/select in the Details tab and commit
// immediately (matching the existing inline-triage pattern).

export function TitleField({ item, onSave }) {
  const [value, setValue] = useState(item.title)
  // Reseed when the ticket (or its title) changes — but not on every keystroke,
  // since item.title only changes after a committed save.
  useEffect(() => { setValue(item.title) }, [item.id, item.title])
  function commit() {
    const next = value.trim()
    if (!next) { setValue(item.title); return } // titles can't be emptied
    if (next !== item.title) onSave({ title: next })
  }
  return (
    <TextField
      label="Title"
      required
      value={value}
      autoComplete="off"
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
    />
  )
}

export function DescriptionField({ item, onSave }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(item.description ?? '')
  const [busy, setBusy] = useState(false)
  function start() { setValue(item.description ?? ''); setEditing(true) }
  async function save() {
    setBusy(true)
    try {
      await onSave({ description: value.trim() ? value : null })
      setEditing(false)
    } finally { setBusy(false) }
  }
  if (editing) {
    return (
      <Stack gap="xs">
        <TextareaField
          label="Description"
          rows="md"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <ButtonContainer align="start">
          <Button size="sm" icon="save" loading={busy} onClick={save}>Save description</Button>
          <Button size="sm" variant="secondary" disabled={busy} onClick={() => setEditing(false)}>Cancel</Button>
        </ButtonContainer>
      </Stack>
    )
  }
  return (
    <Stack gap="xs">
      <Paragraph as="span" size="xs" color="muted">Description</Paragraph>
      {item.description
        ? <TicketDescription text={item.description} />
        : <Paragraph size="sm" color="muted">No description yet.</Paragraph>}
      <ButtonContainer align="start">
        <Button size="sm" variant="tertiary" icon="edit" onClick={start}>Edit description</Button>
      </ButtonContainer>
    </Stack>
  )
}

/**
 * Full ticket view, split across tabs (A1-207):
 *  - **Details** — description, metadata, inline triage toolbars, attachments.
 *  - **Comments** — the comment / Q&A thread + activity log. A maintainer can "Ask the
 *    requester" (routes a question into their queue); the requester answers.
 *  - **Linked tickets** — the similarity finder + merge-duplicates panel.
 *  - **Build with AI** — a copy-pasteable implementation plan built from the ticket (production).
 *  - **Virtual Team** *(dev only)* — Product Owner + virtual-engineer review and build guidance.
 *
 * Virtual Team is gated behind `import.meta.env.DEV` because its review tools are local-only.
 * Build with AI remains production-visible; its plan moves into Virtual Team only in development.
 */
export function TicketDetail({ item, open, onClose, onOpenItem, previousItem, nextItem, onPreviousItem, onNextItem }) {
  const backlog = useBacklog()
  const t = useT()
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('details')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [attachmentMessage, setAttachmentMessage] = useState('')
  const [attachmentError, setAttachmentError] = useState('')
  const [teamAction, setTeamAction] = useState(null)
  const engineerRef = useRef(null)
  const productOwnerRef = useRef(null)

  const me = backlog?.user
  const voted = item ? backlog?.votedSet?.has(item.id) : false
  const isCreator = !!(me && item && item.createdBy === me.id)

  useEffect(() => {
    if (!open || !item) return
    let active = true
    backlog?.loadComments(item.id).then((rows) => { if (active) setThread(rows) })
    return () => { active = false }
  }, [open, item, backlog])

  useEffect(() => {
    if (!open || !item) return
    setAttachmentMessage('')
    setAttachmentError('')
  }, [open, item?.id])

  if (!item) return null

  const allItems = backlog?.items ?? []
  const attachments = item.attachmentRefs ?? []
  // The ticket this one was merged into (when it's a duplicate).
  const canonical = item.duplicateOf ? allItems.find((i) => i.id === item.duplicateOf) : null

  const reload = () => backlog?.loadComments(item.id).then(setThread)
  async function patch(p) { await backlog?.update(item, p) }

  async function addAttachments(files, source = 'paste') {
    try {
      setAttachmentError('')
      const refs = await attachImageFiles(files)
      if (!refs.length) return
      await patch({ attachmentRefs: [...attachments, ...refs] })
      setAttachmentMessage(attachmentStatus(refs.length, source))
    } catch {
      setAttachmentMessage('')
      setAttachmentError('Could not attach an image.')
    }
  }

  function handlePaste(e) {
    const files = imageFilesFromClipboard(e.clipboardData)
    if (!files.length) return
    e.preventDefault()
    addAttachments(files, 'paste')
  }

  function removeAttachment(ref) {
    patch({ attachmentRefs: attachments.filter((r) => r !== ref) })
  }

  async function post(kind) {
    const body = draft.trim()
    if (!body || busy) return
    setBusy(true)
    try {
      await backlog?.comment(item, kind, body)
      setDraft('')
      await reload()
    } finally { setBusy(false) }
  }

  // Which questions already have an answer (so their inline choice form is hidden).
  const answeredIds = new Set(
    thread.filter((c) => c.kind === 'answer' && c.meta?.answersCommentId).map((c) => c.meta.answersCommentId),
  )
  // Comment-tab badge counts only real messages (comments / questions / answers), not the
  // activity log. Virtual PO wraps local-only tooling.
  const commentCount = thread.filter((c) => c.kind !== 'activity').length
  const isDev = import.meta.env.DEV
  async function runTeamAction(kind) {
    const action = kind === 'engineer' ? engineerRef.current?.review : productOwnerRef.current?.review
    if (!action) return
    setTeamAction(kind)
    try { await action() } finally { setTeamAction(null) }
  }
  async function handleAnswer(questionId, body, choice) {
    if (busy) return
    setBusy(true)
    try {
      await backlog?.answer(item, questionId, body, choice)
      await reload()
    } finally { setBusy(false) }
  }

  // Assignee value with an inline assign / unassign link (only when signed in).
  const assigneeCell = (
    <Stack direction="row" gap="xs" align="center" wrap>
      <span>{item.assigneeEmail || 'Unassigned'}</span>
      {me && (
        <>
          <span aria-hidden="true">·</span>
          {item.assigneeId ? (
            <Link href="#" onClick={(e) => { e.preventDefault(); patch({ assigneeId: null, assigneeEmail: null }) }}>Unassign</Link>
          ) : (
            <Link href="#" onClick={(e) => { e.preventDefault(); patch({ assigneeId: me.id, assigneeEmail: me.email }) }}>Assign to me</Link>
          )}
        </>
      )}
    </Stack>
  )

  async function handleDelete() {
    await backlog?.remove(item)
    setConfirmDelete(false)
    onClose()
  }

  return (
    <>
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title={`${ticketRef(item.number)} · ${item.title}`}
      footer={
        <Stack direction="row" gap="md" align="center" justify="between" wrap>
          <Stack direction="row" gap="xs" align="center" wrap>
            <IconButton
              icon="chevron_left"
              label={previousItem ? `Previous ticket, ${ticketRef(previousItem.number)}` : 'Previous ticket'}
              variant="secondary"
              disabled={!previousItem}
              onClick={onPreviousItem}
            />
            <IconButton
              icon="chevron_right"
              label={nextItem ? `Next ticket, ${ticketRef(nextItem.number)}` : 'Next ticket'}
              variant="secondary"
              disabled={!nextItem}
              onClick={onNextItem}
            />
            <Link href={`/backlog/A1-${item.number}`} size="sm" weight="semibold">View as page</Link>
          </Stack>
          <Button variant="secondary" onClick={onClose}>Done</Button>
        </Stack>
      }
    >
      <Stack gap="md" onPaste={handlePaste}>
        {item.awaitingRequester && (
          <Banner status="warn" variant="inline">
            Awaiting the requester’s answer to a clarifying question.
          </Banner>
        )}

        {item.duplicateOf && (
          <Banner status="info" variant="inline">
            <Stack direction="row" gap="xs" align="center" wrap>
              <span>Merged as a duplicate{canonical ? ' of' : '.'}</span>
              {canonical && (
                <Link href="#" onClick={(e) => { e.preventDefault(); onOpenItem?.(canonical) }}>
                  {ticketRef(canonical.number)} · {canonical.title}
                </Link>
              )}
            </Stack>
          </Banner>
        )}

        {/* equalHeight keeps the panel area at the tallest tab's height, so switching
            tabs doesn't resize the dialog and move the footer. size="compact" = small
            tabs (A1-208), which suit the denser, wider ticket dialog. */}
        <Tabs value={tab} onChange={setTab} equalHeight size="compact">
          <TabList>
            <Tab value="details" icon="info">Details</Tab>
            <Tab value="comments" icon="forum" count={commentCount || undefined}>Comments</Tab>
            <Tab value="linked" icon="merge">Linked tickets</Tab>
            {!isDev && <Tab value="build" icon="smart_toy">Build with AI</Tab>}
            {isDev && <Tab value="team" icon="groups">{t('label.app.backlog.virtualTeam', 'Virtual Team')}</Tab>}
          </TabList>

          <TabPanel value="details">
            <Stack gap="md">
              {/* Editable content (A1-208): title + description */}
              <TitleField item={item} onSave={patch} />
              <DescriptionField item={item} onSave={patch} />

              {/* Triage controls — toolbars (commit immediately) */}
              <Stack gap="sm">
                <Toolbar label="Type" aria-label="Type" fullWidth>
                  <ToolbarGroup
                    aria-label="Type"
                    overflow
                    showLabels
                    value={item.type}
                    onChange={(v) => v && patch({ type: v })}
                    options={TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t], icon: TYPE_ICON[t] }))}
                  />
                </Toolbar>
                <Toolbar label="Status" aria-label="Status" fullWidth>
                  <ToolbarGroup
                    aria-label="Status"
                    overflow
                    showLabels
                    value={item.status}
                    onChange={(v) => v && patch({ status: v })}
                    options={STATUSES.map((s) => ({
                      value: s,
                      label: STATUS_LABELS[s],
                      icon: STATUS_ICON[s],
                      overflowPriority: PRIMARY_STATUSES.includes(s) ? PRIMARY_STATUSES.indexOf(s) : 100 + OVERFLOW_STATUSES.indexOf(s),
                    }))}
                  />
                </Toolbar>
                <Toolbar label="Priority & size" aria-label="Priority and size" fullWidth overflow overflowLabel="More priority and size tools">
                  <ToolbarGroup
                    aria-label="Priority"
                    overflow
                    showLabels
                    value={item.priority || ''}
                    onChange={(v) => patch({ priority: v || null })}
                    options={[{ value: '', label: 'None' }, ...PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p].split(' · ')[0] }))]}
                  />
                  <ToolbarDivider />
                  <ToolbarGroup
                    aria-label="Size"
                    overflow
                    showLabels
                    value={item.complexity || ''}
                    onChange={(v) => patch({ complexity: v || null })}
                    options={[{ value: '', label: 'None' }, ...COMPLEXITIES.map((c) => ({ value: c, label: COMPLEXITY_LABELS[c] }))]}
                  />
                </Toolbar>
              </Stack>

              {/* Scope kind (commits immediately; a specific ref/label resets on kind change) */}
              <SelectField
                label="Scope"
                size="compact"
                value={item.scopeKind}
                hint={item.scopeLabel ? `Currently scoped to ${item.scopeLabel}` : undefined}
                onChange={(e) => patch({ scopeKind: e.target.value, scopeRef: null, scopeLabel: null })}
              >
                {SCOPE_KINDS.map((k) => <option key={k} value={k}>{SCOPE_LABELS[k]}</option>)}
              </SelectField>

              <DefinitionList
                direction="row"
                labelWidth="fixed"
                size="md"
                items={[
                  { label: 'Requested by', value: item.createdByEmail || 'Unknown' },
                  { label: 'Assignee', value: assigneeCell },
                  {
                    label: 'Votes',
                    value: (
                      <Stack direction="row" gap="xs" align="center">
                        <Paragraph as="span" size="sm">{item.voteCount}</Paragraph>
                        <IconButton
                          size="sm"
                          variant={voted ? 'secondary' : 'primary'}
                          icon={voted ? 'thumb_down' : 'thumb_up'}
                          aria-label={voted ? 'Remove your vote' : 'Vote for this ticket'}
                          onClick={() => backlog?.vote(item, !voted)}
                        />
                      </Stack>
                    ),
                  },
                  { label: 'Created', value: when(item.createdAt) },
                  ...(Object.keys(item.reviews ?? {}).length
                    ? [{ label: 'Reviews', value: <ReviewTags reviews={item.reviews} /> }]
                    : []),
                ]}
              />

              <Stack gap="xs">
                <Paragraph as="span" size="xs" color="muted">Screenshots</Paragraph>
                <Paragraph size="sm" color="muted">
                  Paste an image anywhere in this dialog to attach it to the ticket.
                </Paragraph>
                {attachmentError && <Banner status="error" variant="inline">{attachmentError}</Banner>}
                {attachmentMessage && (
                  <Paragraph size="sm" color="muted" aria-live="polite">{attachmentMessage}</Paragraph>
                )}
                {attachments.length > 0 ? (
                  <Stack direction="row" gap="sm" wrap>
                    {attachments.map((ref) => (
                      <div key={ref} className="a1-backlog-attach">
                        <a href={resolveSrc(ref)} target="_blank" rel="noreferrer" aria-label="Open attachment">
                          <Figure src={resolveSrc(ref)} alt="Attachment" size="xs" radius="sm" aspectRatio="1:1" />
                        </a>
                        <IconButton
                          size="sm"
                          variant="secondary"
                          icon="close"
                          aria-label="Remove attachment"
                          onClick={() => removeAttachment(ref)}
                        />
                      </div>
                    ))}
                  </Stack>
                ) : (
                  <Paragraph size="sm" color="muted">No screenshots yet.</Paragraph>
                )}
              </Stack>

              <ButtonContainer align="start">
                <Button size="sm" variant="destructive" icon="delete" onClick={() => setConfirmDelete(true)}>
                  Delete ticket
                </Button>
              </ButtonContainer>

            </Stack>
          </TabPanel>

          <TabPanel value="comments">
            <Stack gap="sm">
              {thread.length === 0
                ? <Paragraph size="sm" color="muted">No comments yet.</Paragraph>
                : thread.map((entry) => (
                  <ThreadEntry
                    key={entry.id}
                    entry={entry}
                    answered={answeredIds.has(entry.id)}
                    onAnswer={handleAnswer}
                  />
                ))}

              <TextareaField
                label="Add to the thread"
                rows="sm"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <ButtonContainer>
                <Button size="sm" icon="send" loading={busy} disabled={!draft.trim()} onClick={() => post('comment')}>
                  Comment
                </Button>
                {!isCreator && (
                  <Button size="sm" variant="secondary" icon="help" disabled={busy || !draft.trim()} onClick={() => post('question')}>
                    Ask the requester
                  </Button>
                )}
                {isCreator && item.awaitingRequester && (
                  <Button size="sm" variant="secondary" icon="reply" disabled={busy || !draft.trim()} onClick={() => post('answer')}>
                    Answer
                  </Button>
                )}
              </ButtonContainer>
            </Stack>
          </TabPanel>

          <TabPanel value="linked">
            {/* Renders the duplicate→canonical banner when this ticket is itself a
                duplicate, otherwise the similarity finder + merge controls. */}
            <TicketMergePanel
              item={item}
              items={allItems}
              onMerge={(dup, canon) => backlog?.merge(dup, canon)}
              onLink={(a, b) => backlog?.link(a, b)}
              onUnlink={(a, b) => backlog?.unlink(a, b)}
              onOpenItem={onOpenItem}
            />
          </TabPanel>

          <TabPanel value="build">
            <TicketAiPrompt item={item} />
          </TabPanel>

          {isDev && (
            <TabPanel value="team">
              <Stack gap="md">
                <ButtonContainer align="start">
                  <Button
                    size="md"
                    variant="secondary"
                    icon="reviews"
                    loading={teamAction === 'product-owner'}
                    onClick={() => runTeamAction('product-owner')}
                  >
                    {t('label.app.backlog.virtualPoCodex', 'Review with Product Owner')}
                  </Button>
                  <Button
                    size="md"
                    variant="secondary"
                    icon="auto_awesome"
                    loading={teamAction === 'engineer'}
                    onClick={() => runTeamAction('engineer')}
                  >
                    {t('label.app.backlog.buildWithAiReviewEngineer', 'Review with Engineer')}
                  </Button>
                </ButtonContainer>
                <Stack gap="xs">
                  <Paragraph as="span" size="xs" color="muted">
                    {t('label.app.backlog.virtualTeamDescription', 'Product and engineering review the ticket together. Their questions and guidance stay with the build instructions.')}
                  </Paragraph>
                  <TicketPersonaReview ref={productOwnerRef} item={item} hideActions />
                  <TicketAiPrompt ref={engineerRef} item={item} hideEngineerAction />
                </Stack>
              </Stack>
            </TabPanel>
          )}
        </Tabs>
      </Stack>
    </Dialog>

    <Dialog
      open={confirmDelete}
      onClose={() => setConfirmDelete(false)}
      title="Delete ticket"
      footer={
        <ButtonContainer>
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="destructive" icon="delete" onClick={handleDelete}>Delete</Button>
        </ButtonContainer>
      }
    >
      <Paragraph>
        Permanently delete {ticketRef(item.number)}? This cannot be undone.
      </Paragraph>
    </Dialog>
    </>
  )
}
