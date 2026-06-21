import { useEffect, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Code,
  DefinitionList,
  Dialog,
  Figure,
  Icon,
  IconButton,
  Link,
  List,
  ListItem,
  Paragraph,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextareaField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarMenu,
} from '@gtivr4/a1-design-system-react'
import { resolveSrc } from '../lib/imageLibrary'
import {
  COMPLEXITIES, COMPLEXITY_LABELS, PRIORITIES, PRIORITY_LABELS, STATUS_ICON,
  STATUS_LABELS, STATUSES, ticketRef,
} from '../services/backlog/types'
import { useBacklog } from './BacklogContext'
import {
  ComplexityBadge, PriorityBadge, ScopeBadge, StatusBadge, TypeBadge,
} from './TicketBadges'

function when(iso) {
  try { return new Date(iso).toLocaleString() } catch { return '' }
}

const KIND_ICON = { question: 'help', answer: 'reply', activity: 'history', comment: 'chat' }

// Status toolbar split: the common workflow stages sit inline; the rest live in a
// "More" overflow menu so the bar stays compact.
const PRIMARY_STATUSES = ['new', 'triaged', 'accepted', 'in_progress', 'done']
const OVERFLOW_STATUSES = STATUSES.filter((s) => !PRIMARY_STATUSES.includes(s))

function ThreadEntry({ entry }) {
  const isActivity = entry.kind === 'activity'
  return (
    <Stack direction="row" gap="sm" align="start">
      <Icon name={KIND_ICON[entry.kind] || 'chat'} size="sm" color="muted" />
      <Stack gap="xs">
        <Paragraph size="xs" color="muted">
          {entry.userEmail || 'Someone'}
          {entry.kind === 'question' && ' · asked the requester'}
          {entry.kind === 'answer' && ' · answered'}
          {' · '}{when(entry.createdAt)}
        </Paragraph>
        <Paragraph size="sm" color={isActivity ? 'muted' : undefined}>{entry.body}</Paragraph>
      </Stack>
    </Stack>
  )
}

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

/**
 * Full ticket view, split across two tabs: **Details** (description, metadata, inline
 * triage toolbars, attachments) and **Activity** (the comment / Q&A thread + activity
 * log). A maintainer can "Ask the requester" (routes a question into their queue); the
 * requester answers.
 */
export function TicketDetail({ item, open, onClose }) {
  const backlog = useBacklog()
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('details')

  const me = backlog?.user
  const voted = item ? backlog?.votedSet?.has(item.id) : false
  const isCreator = !!(me && item && item.createdBy === me.id)

  useEffect(() => {
    if (!open || !item) return
    let active = true
    backlog?.loadComments(item.id).then((rows) => { if (active) setThread(rows) })
    return () => { active = false }
  }, [open, item, backlog])

  if (!item) return null

  const reload = () => backlog?.loadComments(item.id).then(setThread)
  async function patch(p) { await backlog?.update(item, p) }

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${ticketRef(item.number)} · ${item.title}`}
      footer={<Button variant="secondary" onClick={onClose}>Done</Button>}
    >
      <Stack gap="md">
        {item.awaitingRequester && (
          <Banner status="warn" variant="inline">
            Awaiting the requester’s answer to a clarifying question.
          </Banner>
        )}

        {/* equalHeight keeps the panel area at the tallest tab's height, so switching
            Details/Activity doesn't resize the dialog and move the footer. */}
        <Tabs value={tab} onChange={setTab} equalHeight>
          <TabList>
            <Tab value="details">Details</Tab>
            <Tab value="activity">Activity</Tab>
          </TabList>

          <TabPanel value="details">
            <Stack gap="md">
              {item.description && <TicketDescription text={item.description} />}

              {/* Triage controls — toolbars */}
              <Stack gap="sm">
                <Toolbar label="Status" aria-label="Status">
                  <ToolbarGroup
                    aria-label="Status"
                    showLabels
                    value={PRIMARY_STATUSES.includes(item.status) ? item.status : ''}
                    onChange={(v) => v && patch({ status: v })}
                    options={PRIMARY_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s], icon: STATUS_ICON[s] }))}
                  />
                  <ToolbarDivider />
                  <ToolbarMenu
                    aria-label="More statuses"
                    label={OVERFLOW_STATUSES.includes(item.status) ? STATUS_LABELS[item.status] : 'More'}
                    value={item.status}
                    onChange={(v) => patch({ status: v })}
                    items={OVERFLOW_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s], icon: STATUS_ICON[s] }))}
                  />
                </Toolbar>
                <Toolbar label="Priority & size" aria-label="Priority and size">
                  <ToolbarGroup
                    aria-label="Priority"
                    showLabels
                    value={item.priority || ''}
                    onChange={(v) => patch({ priority: v || null })}
                    options={[{ value: '', label: 'None' }, ...PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p].split(' · ')[0] }))]}
                  />
                  <ToolbarDivider />
                  <ToolbarGroup
                    aria-label="Size"
                    showLabels
                    value={item.complexity || ''}
                    onChange={(v) => patch({ complexity: v || null })}
                    options={[{ value: '', label: 'None' }, ...COMPLEXITIES.map((c) => ({ value: c, label: COMPLEXITY_LABELS[c] }))]}
                  />
                </Toolbar>
              </Stack>

              <DefinitionList
                direction="row"
                labelWidth="fixed"
                size="md"
                items={[
                  { label: 'Type', value: <TypeBadge type={item.type} /> },
                  { label: 'Status', value: <StatusBadge status={item.status} /> },
                  { label: 'Priority', value: item.priority ? <PriorityBadge priority={item.priority} /> : '—' },
                  { label: 'Size', value: item.complexity ? <ComplexityBadge complexity={item.complexity} full /> : '—' },
                  { label: 'Scope', value: item.scopeKind === 'general' ? 'General' : <ScopeBadge scopeKind={item.scopeKind} scopeLabel={item.scopeLabel} /> },
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
                ]}
              />

              {item.attachmentRefs?.length > 0 && (
                <Stack direction="row" gap="sm" wrap>
                  {item.attachmentRefs.map((ref) => (
                    <a key={ref} href={resolveSrc(ref)} target="_blank" rel="noreferrer">
                      <Figure src={resolveSrc(ref)} alt="Attachment" size="xs" radius="sm" aspectRatio="1:1" />
                    </a>
                  ))}
                </Stack>
              )}
            </Stack>
          </TabPanel>

          <TabPanel value="activity">
            <Stack gap="sm">
              {thread.length === 0
                ? <Paragraph size="sm" color="muted">No comments yet.</Paragraph>
                : thread.map((entry) => <ThreadEntry key={entry.id} entry={entry} />)}

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
        </Tabs>
      </Stack>
    </Dialog>
  )
}
