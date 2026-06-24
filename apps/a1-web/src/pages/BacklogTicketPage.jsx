import { useEffect, useMemo, useState } from 'react'
import {
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  DefinitionList,
  Dialog,
  Figure,
  Heading,
  IconButton,
  Link,
  Paragraph,
  Section,
  SelectField,
  Stack,
  TextareaField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarMenu,
} from '@gtivr4/a1-design-system-react'
import { resolveSrc } from '../lib/imageLibrary'
import { ComplexityBadge, PriorityBadge, ScopeBadge, StatusBadge, TypeBadge } from '../backlog/TicketBadges'
import {
  TitleField, DescriptionField, ThreadEntry, ReviewTags,
  PRIMARY_STATUSES, OVERFLOW_STATUSES,
} from '../backlog/TicketDetail'
import { TicketMergePanel } from '../backlog/TicketMergePanel'
import { TicketAiPrompt } from '../backlog/TicketAiPrompt'
import { TicketPersonaReview } from '../backlog/TicketPersonaReview'
import { useBacklog } from '../backlog/BacklogContext'
import {
  COMPLEXITIES, COMPLEXITY_LABELS, PRIORITIES, PRIORITY_LABELS,
  SCOPE_KINDS, SCOPE_LABELS, STATUS_ICON, STATUS_LABELS,
  TYPES, TYPE_ICON, TYPE_LABELS, ticketRef,
} from '../services/backlog/types'

function when(iso) {
  try { return new Date(iso).toLocaleString() } catch { return '' }
}

export function BacklogTicketPage({ onNavigate }) {
  const ticketNumber = useMemo(() => {
    const m = window.location.pathname.match(/\/backlog\/A1-(\d+)/i)
    return m ? Number(m[1]) : null
  }, [])

  const backlog = useBacklog()
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const items = backlog?.items ?? []
  const item = ticketNumber != null ? items.find((i) => i.number === ticketNumber) ?? null : null
  const me = backlog?.user
  const voted = item ? backlog?.votedSet?.has(item.id) : false
  const isCreator = !!(me && item && item.createdBy === me.id)

  useEffect(() => {
    if (!item) return
    let active = true
    backlog?.loadComments(item.id).then((rows) => { if (active) setThread(rows) })
    return () => { active = false }
  }, [item?.id, backlog])

  const breadcrumb = [
    { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
    { label: 'Backlog', href: '/backlog', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('backlog') } },
    { label: ticketNumber ? `A1-${ticketNumber}` : 'Ticket' },
  ]

  if (backlog?.loading) {
    return (
      <Section padding="md" contentWidth="xl">
        <Stack gap="md">
          <Breadcrumb items={breadcrumb} />
          <Paragraph size="sm" color="muted">Loading…</Paragraph>
        </Stack>
      </Section>
    )
  }

  if (!item) {
    return (
      <Section padding="md" contentWidth="xl">
        <Stack gap="md">
          <Breadcrumb items={breadcrumb} />
          <Heading as="h1" size="xl">Ticket not found</Heading>
          <Paragraph size="sm" color="muted">
            {ticketNumber ? `A1-${ticketNumber} doesn't exist or hasn't loaded yet.` : 'No ticket number found in the URL.'}
          </Paragraph>
          <ButtonContainer align="start">
            <Button
              variant="secondary" icon="arrow_back" as="a" href="/backlog"
              onClick={(e) => { e.preventDefault(); onNavigate?.('backlog') }}
            >
              Back to backlog
            </Button>
          </ButtonContainer>
        </Stack>
      </Section>
    )
  }

  const allItems = items
  const canonical = item.duplicateOf ? allItems.find((i) => i.id === item.duplicateOf) : null

  async function patch(p) { await backlog?.update(item, p) }

  const reload = () => backlog?.loadComments(item.id).then(setThread)

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

  const answeredIds = new Set(
    thread.filter((c) => c.kind === 'answer' && c.meta?.answersCommentId).map((c) => c.meta.answersCommentId),
  )

  async function handleAnswer(questionId, body, choice) {
    if (busy) return
    setBusy(true)
    try {
      await backlog?.answer(item, questionId, body, choice)
      await reload()
    } finally { setBusy(false) }
  }

  async function handleDelete() {
    await backlog?.remove(item)
    setConfirmDelete(false)
    onNavigate?.('backlog')
  }

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
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Section padding="sm" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="subtle" borderSides={['bottom']}>
        <Stack gap="xs">
          <Breadcrumb items={breadcrumb} />
          <Stack direction="row" gap="xs" wrap>
            <StatusBadge status={item.status} />
            <TypeBadge type={item.type} />
            {item.priority && <PriorityBadge priority={item.priority} />}
            {item.complexity && <ComplexityBadge complexity={item.complexity} full />}
            {item.scopeKind && item.scopeKind !== 'general' && <ScopeBadge scopeKind={item.scopeKind} scopeLabel={item.scopeLabel} />}
          </Stack>
          <Heading as="h1" size={{ xs: 'lg', md: 'xxl' }}>
            {ticketRef(item.number)} — {item.title}
          </Heading>
        </Stack>
      </Section>

      {/* ── Alert banners ──────────────────────────────────────────────── */}
      {(item.awaitingRequester || item.duplicateOf) && (
        <Section padding="xs" contentWidth="xl">
          <Stack gap="xs">
            {item.awaitingRequester && (
              <Banner status="warn" variant="inline">
                Awaiting the requester's answer to a clarifying question.
              </Banner>
            )}
            {item.duplicateOf && (
              <Banner status="info" variant="inline">
                <Stack direction="row" gap="xs" align="center" wrap>
                  <span>Merged as a duplicate{canonical ? ' of' : '.'}</span>
                  {canonical && (
                    <Link
                      href={`/backlog/A1-${canonical.number}`}
                      onClick={(e) => { e.preventDefault(); onNavigate?.('backlog-ticket', { path: `/backlog/A1-${canonical.number}` }) }}
                    >
                      {ticketRef(canonical.number)} — {canonical.title}
                    </Link>
                  )}
                </Stack>
              </Banner>
            )}
          </Stack>
        </Section>
      )}

      {/* ── Details ────────────────────────────────────────────────────── */}
      <Section padding="md" contentWidth="xl">
        <Stack gap="lg">
          <Heading as="h2" size="lg">Details</Heading>

          <TitleField item={item} onSave={patch} />
          <DescriptionField item={item} onSave={patch} />

          <Stack gap="sm">
            <Toolbar label="Type" aria-label="Type">
              <ToolbarGroup
                aria-label="Type"
                showLabels
                value={item.type}
                onChange={(v) => v && patch({ type: v })}
                options={TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t], icon: TYPE_ICON[t] }))}
              />
            </Toolbar>

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

          <SelectField
            label="Scope"
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
              { label: 'Updated', value: when(item.updatedAt) },
              ...(Object.keys(item.reviews ?? {}).length
                ? [{ label: 'Reviews', value: <ReviewTags reviews={item.reviews} /> }]
                : []),
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

          <ButtonContainer align="start">
            <Button variant="destructive" icon="delete" onClick={() => setConfirmDelete(true)}>
              Delete ticket
            </Button>
          </ButtonContainer>
        </Stack>
      </Section>

      {/* ── Activity ───────────────────────────────────────────────────── */}
      <Section padding="md" surface="panel" contentWidth="xl">
        <Stack gap="md">
          <Heading as="h2" size="lg">Activity</Heading>

          {thread.length === 0
            ? <Paragraph size="sm" color="muted">No activity yet.</Paragraph>
            : thread.map((entry) => (
              <ThreadEntry
                key={entry.id}
                entry={entry}
                answered={answeredIds.has(entry.id)}
                onAnswer={handleAnswer}
              />
            ))}

          <TextareaField
            label="Add a comment"
            rows="sm"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <ButtonContainer>
            <Button icon="send" loading={busy} disabled={!draft.trim()} onClick={() => post('comment')}>
              Comment
            </Button>
            {!isCreator && (
              <Button variant="secondary" icon="help" disabled={busy || !draft.trim()} onClick={() => post('question')}>
                Ask the requester
              </Button>
            )}
            {isCreator && item.awaitingRequester && (
              <Button variant="secondary" icon="reply" disabled={busy || !draft.trim()} onClick={() => post('answer')}>
                Answer
              </Button>
            )}
          </ButtonContainer>
        </Stack>
      </Section>

      {/* ── Linked tickets ─────────────────────────────────────────────── */}
      <Section padding="md" contentWidth="xl">
        <Stack gap="md">
          <Heading as="h2" size="lg">Linked tickets</Heading>
          <TicketMergePanel
            item={item}
            items={allItems}
            onMerge={(dup, canon) => backlog?.merge(dup, canon)}
            onLink={(a, b) => backlog?.link(a, b)}
            onUnlink={(a, b) => backlog?.unlink(a, b)}
            onOpenItem={(other) => onNavigate?.('backlog-ticket', { path: `/backlog/A1-${other.number}` })}
          />
        </Stack>
      </Section>

      {/* ── Build with AI (dev only) ───────────────────────────────────── */}
      {import.meta.env.DEV && (
        <Section padding="md" surface="panel" contentWidth="xl">
          <Stack gap="md">
            <Heading as="h2" size="lg">Build with AI</Heading>
            <TicketAiPrompt item={item} />
          </Stack>
        </Section>
      )}

      {/* ── Virtual PO (dev only) ──────────────────────────────────────── */}
      {import.meta.env.DEV && (
        <Section padding="md" contentWidth="xl">
          <Stack gap="md">
            <Heading as="h2" size="lg">Virtual PO</Heading>
            <Paragraph size="sm" color="muted">Local, deterministic review — no API credits.</Paragraph>
            <TicketPersonaReview item={item} />
          </Stack>
        </Section>
      )}

      {/* ── Delete confirmation ────────────────────────────────────────── */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Delete ${ticketRef(item.number)}`}
        footer={
          <ButtonContainer>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" icon="delete" onClick={handleDelete}>Delete</Button>
          </ButtonContainer>
        }
      >
        <Paragraph>Permanently delete {ticketRef(item.number)}? This cannot be undone.</Paragraph>
      </Dialog>
    </>
  )
}
