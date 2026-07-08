import { useEffect, useMemo, useState } from 'react'
import { useT } from '../labels/useT'
import {
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  DefinitionList,
  Dialog,
  Figure,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Link,
  PageNav,
  Paragraph,
  Section,
  SelectField,
  Stack,
  TextareaField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
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
  SCOPE_KINDS, SCOPE_LABELS, STATUS_ICON, STATUS_LABELS, STATUSES,
  TYPES, TYPE_ICON, TYPE_LABELS, ticketRef,
} from '../services/backlog/types'

function when(iso) {
  try { return new Date(iso).toLocaleString() } catch { return '' }
}

export function BacklogTicketPage({ onNavigate }) {
  const t = useT()
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
    { label: t('label.app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
    { label: t('label.app.page.backlog', 'Backlog'), href: '/backlog', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('backlog') } },
    { label: ticketNumber ? `A1-${ticketNumber}` : 'Ticket' },
  ]

  if (backlog?.loading) {
    return (
      <Section padding="md" contentWidth="xl">
        <Stack gap="md">
          <Breadcrumb items={breadcrumb} />
          <Paragraph size="sm" color="muted">{t('label.app.backlog.loading', 'Loading…')}</Paragraph>
        </Stack>
      </Section>
    )
  }

  if (!item) {
    return (
      <Section padding="md" contentWidth="xl">
        <Stack gap="md">
          <Breadcrumb items={breadcrumb} />
          <Heading as="h1" size="xl">{t('label.app.backlog.notFound', 'Ticket not found')}</Heading>
          <Paragraph size="sm" color="muted">
            {ticketNumber
              ? `A1-${ticketNumber} ${t('label.app.backlog.notFoundDetail', "doesn't exist or hasn't loaded yet.")}`
              : t('label.app.backlog.noTicketNumber', 'No ticket number found in the URL.')}
          </Paragraph>
          <ButtonContainer align="start">
            <Button
              variant="secondary" icon="arrow_back" as="a" href="/backlog"
              onClick={(e) => { e.preventDefault(); onNavigate?.('backlog') }}
            >
              {t('label.app.backlog.backToBacklog', 'Back to backlog')}
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
      <span>{item.assigneeEmail || t('label.app.backlog.unassigned', 'Unassigned')}</span>
      {me && (
        <>
          <span aria-hidden="true">·</span>
          {item.assigneeId ? (
            <Link href="#" onClick={(e) => { e.preventDefault(); patch({ assigneeId: null, assigneeEmail: null }) }}>{t('label.app.backlog.unassign', 'Unassign')}</Link>
          ) : (
            <Link href="#" onClick={(e) => { e.preventDefault(); patch({ assigneeId: me.id, assigneeEmail: me.email }) }}>{t('label.app.backlog.assignToMe', 'Assign to me')}</Link>
          )}
        </>
      )}
    </Stack>
  )

  // In-page navigation: one entry per body section (Virtual PO is dev-only).
  const navSections = [
    { id: 'ticket-details', label: t('label.app.backlog.details', 'Details') },
    { id: 'ticket-activity', label: t('label.app.backlog.activity', 'Activity') },
    { id: 'ticket-linked', label: t('label.app.backlog.linkedTickets', 'Linked tickets') },
    { id: 'ticket-build', label: t('label.app.backlog.buildWithAi', 'Build with AI') },
    ...(import.meta.env.DEV ? [{ id: 'ticket-virtual-po', label: t('label.app.backlog.virtualPo', 'Virtual PO') }] : []),
  ]

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
                {t('label.app.backlog.awaitingRequester', "Awaiting the requester's answer to a clarifying question.")}
              </Banner>
            )}
            {item.duplicateOf && (
              <Banner status="info" variant="inline">
                <Stack direction="row" gap="xs" align="center" wrap>
                  <span>{t('label.app.backlog.mergedAsDuplicate', 'Merged as a duplicate')}{canonical ? ` ${t('label.app.backlog.mergedAsDuplicateOf', 'of')}` : '.'}</span>
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

      {/* ── Body: sections (left) + in-page navigation (right, sticky) ──── */}
      <Section padding="md" contentWidth="xl">
        <Grid columns={{ xs: 1, lg: 4 }} gap="lg">
          <GridItem span={{ xs: 1, lg: 3 }}>
            <Stack gap="lg">

      {/* ── Details ────────────────────────────────────────────────────── */}
      <Section id="ticket-details" padding="md">
        <Stack gap="lg">
          <Heading as="h2" size="lg">{t('label.app.backlog.details', 'Details')}</Heading>

          <TitleField item={item} onSave={patch} />
          <DescriptionField item={item} onSave={patch} />

          <Stack gap="sm">
            <Toolbar label={t('label.app.backlog.toolbarType', 'Type')} aria-label={t('label.app.backlog.toolbarType', 'Type')} fullWidth>
              <ToolbarGroup
                aria-label={t('label.app.backlog.toolbarType', 'Type')}
                overflow
                showLabels
                value={item.type}
                onChange={(v) => v && patch({ type: v })}
                options={TYPES.map((type) => ({ value: type, label: TYPE_LABELS[type], icon: TYPE_ICON[type] }))}
              />
            </Toolbar>

            <Toolbar
              label={t('label.app.backlog.toolbarStatus', 'Status')}
              aria-label={t('label.app.backlog.toolbarStatus', 'Status')}
              fullWidth
            >
              <ToolbarGroup
                aria-label={t('label.app.backlog.toolbarStatus', 'Status')}
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

            <Toolbar
              label={t('label.app.backlog.toolbarPriorityAndSize', 'Priority & size')}
              aria-label={t('label.app.backlog.toolbarPriorityAndSize', 'Priority & size')}
              fullWidth
              overflow
              overflowLabel={t('label.app.backlog.toolbarMorePrioritySizeTools', 'More priority and size tools')}
            >
              <ToolbarGroup
                aria-label={t('label.app.backlog.toolbarPriority', 'Priority')}
                overflow
                showLabels
                value={item.priority || ''}
                onChange={(v) => patch({ priority: v || null })}
                options={[{ value: '', label: t('label.app.backlog.toolbarNone', 'None') }, ...PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p].split(' · ')[0] }))]}
              />
              <ToolbarDivider />
              <ToolbarGroup
                aria-label={t('label.app.backlog.toolbarSize', 'Size')}
                overflow
                showLabels
                value={item.complexity || ''}
                onChange={(v) => patch({ complexity: v || null })}
                options={[{ value: '', label: t('label.app.backlog.toolbarNone', 'None') }, ...COMPLEXITIES.map((c) => ({ value: c, label: COMPLEXITY_LABELS[c] }))]}
              />
            </Toolbar>
          </Stack>

          <SelectField
            label={t('label.app.backlog.scopeLabel', 'Scope')}
            value={item.scopeKind}
            hint={item.scopeLabel ? `${t('label.app.backlog.scopeCurrentlyHint', 'Currently scoped to')} ${item.scopeLabel}` : undefined}
            onChange={(e) => patch({ scopeKind: e.target.value, scopeRef: null, scopeLabel: null })}
          >
            {SCOPE_KINDS.map((k) => <option key={k} value={k}>{SCOPE_LABELS[k]}</option>)}
          </SelectField>

          <DefinitionList
            direction="row"
            labelWidth="fixed"
            size="md"
            items={[
              { label: t('label.app.backlog.requestedBy', 'Requested by'), value: item.createdByEmail || t('label.app.backlog.unknownRequester', 'Unknown') },
              { label: t('label.app.backlog.assignee', 'Assignee'), value: assigneeCell },
              {
                label: t('label.app.backlog.votes', 'Votes'),
                value: (
                  <Stack direction="row" gap="xs" align="center">
                    <Paragraph as="span" size="sm">{item.voteCount}</Paragraph>
                    <IconButton
                      size="sm"
                      variant={voted ? 'secondary' : 'primary'}
                      icon={voted ? 'thumb_down' : 'thumb_up'}
                      aria-label={voted ? t('label.app.backlog.removeVote', 'Remove your vote') : t('label.app.backlog.voteForTicket', 'Vote for this ticket')}
                      onClick={() => backlog?.vote(item, !voted)}
                    />
                  </Stack>
                ),
              },
              { label: t('label.app.backlog.created', 'Created'), value: when(item.createdAt) },
              { label: t('label.app.backlog.updated', 'Updated'), value: when(item.updatedAt) },
              ...(Object.keys(item.reviews ?? {}).length
                ? [{ label: t('label.app.backlog.reviews', 'Reviews'), value: <ReviewTags reviews={item.reviews} /> }]
                : []),
            ]}
          />

          {item.attachmentRefs?.length > 0 && (
            <Stack direction="row" gap="sm" wrap>
              {item.attachmentRefs.map((ref) => (
                <a key={ref} href={resolveSrc(ref)} target="_blank" rel="noreferrer">
                  <Figure src={resolveSrc(ref)} alt={t('label.app.backlog.attachmentAlt', 'Attachment')} size="xs" radius="sm" aspectRatio="1:1" />
                </a>
              ))}
            </Stack>
          )}

          <ButtonContainer align="start">
            <Button variant="destructive" icon="delete" onClick={() => setConfirmDelete(true)}>
              {t('label.app.backlog.deleteTicket', 'Delete ticket')}
            </Button>
          </ButtonContainer>
        </Stack>
      </Section>

      {/* ── Activity ───────────────────────────────────────────────────── */}
      <Section id="ticket-activity" padding="md" surface="panel" radius="md">
        <Stack gap="md">
          <Heading as="h2" size="lg">{t('label.app.backlog.activity', 'Activity')}</Heading>

          {thread.length === 0
            ? <Paragraph size="sm" color="muted">{t('label.app.backlog.noActivity', 'No activity yet.')}</Paragraph>
            : thread.map((entry) => (
              <ThreadEntry
                key={entry.id}
                entry={entry}
                answered={answeredIds.has(entry.id)}
                onAnswer={handleAnswer}
              />
            ))}

          <TextareaField
            label={t('label.app.backlog.addComment', 'Add a comment')}
            rows="sm"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <ButtonContainer>
            <Button icon="send" loading={busy} disabled={!draft.trim()} onClick={() => post('comment')}>
              {t('label.app.backlog.comment', 'Comment')}
            </Button>
            {!isCreator && (
              <Button variant="secondary" icon="help" disabled={busy || !draft.trim()} onClick={() => post('question')}>
                {t('label.app.backlog.askRequester', 'Ask the requester')}
              </Button>
            )}
            {isCreator && item.awaitingRequester && (
              <Button variant="secondary" icon="reply" disabled={busy || !draft.trim()} onClick={() => post('answer')}>
                {t('label.app.backlog.answer', 'Answer')}
              </Button>
            )}
          </ButtonContainer>
        </Stack>
      </Section>

      {/* ── Linked tickets ─────────────────────────────────────────────── */}
      <Section id="ticket-linked" padding="md">
        <Stack gap="md">
          <Heading as="h2" size="lg">{t('label.app.backlog.linkedTickets', 'Linked tickets')}</Heading>
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

      {/* ── Build with AI ──────────────────────────────────────────────── */}
      <Section id="ticket-build" padding="md" surface="panel" radius="md">
        <Stack gap="md">
          <Heading as="h2" size="lg">{t('label.app.backlog.buildWithAi', 'Build with AI')}</Heading>
          <TicketAiPrompt item={item} />
        </Stack>
      </Section>

      {/* ── Virtual PO (dev only) ──────────────────────────────────────── */}
      {import.meta.env.DEV && (
        <Section id="ticket-virtual-po" padding="md">
          <Stack gap="md">
            <Heading as="h2" size="lg">{t('label.app.backlog.virtualPo', 'Virtual PO')}</Heading>
            <Paragraph size="sm" color="muted">{t('label.app.backlog.virtualPoDescription', 'Local, deterministic review — no API credits.')}</Paragraph>
            <TicketPersonaReview item={item} />
          </Stack>
        </Section>
      )}

            </Stack>
          </GridItem>
          <GridItem span={{ xs: 1, lg: 1 }}>
            <PageNav
              sections={navSections}
              label={t('label.app.backlog.onThisPage', 'On this page')}
              style={{ '--a1-page-nav-top': 'var(--component-top-header-height)' }}
            />
          </GridItem>
        </Grid>
      </Section>

      {/* ── Delete confirmation ────────────────────────────────────────── */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`${t('label.app.backlog.deleteDialogConfirm', 'Delete')} ${ticketRef(item.number)}`}
        footer={
          <ButtonContainer>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>{t('label.app.backlog.deleteDialogCancel', 'Cancel')}</Button>
            <Button variant="destructive" icon="delete" onClick={handleDelete}>{t('label.app.backlog.deleteDialogConfirm', 'Delete')}</Button>
          </ButtonContainer>
        }
      >
        <Paragraph>{t('label.app.backlog.deleteDialogBody', 'Permanently delete')} {ticketRef(item.number)}{t('label.app.backlog.deleteDialogBodySuffix', '? This cannot be undone.')}</Paragraph>
      </Dialog>
    </>
  )
}
