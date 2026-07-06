import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  Card,
  ContextMenu,
  DataTable,
  Dialog,
  Divider,
  Grid,
  Heading,
  Icon,
  IconButton,
  Link,
  MessageBadge,
  MessageEmptyState,
  Pagination,
  Paragraph,
  SearchField,
  Section,
  SegmentedControl,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Toolbar,
  ToolbarGroup,
  ToolbarMenu,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { useBacklog } from '../backlog/BacklogContext'
import { TicketDetail } from '../backlog/TicketDetail'
import {
  ComplexityBadge, PriorityBadge, ScopeBadge, StatusBadge, TypeBadge,
} from '../backlog/TicketBadges'
import {
  COMPLEXITIES, COMPLEXITY_LABELS, PRIORITIES, PRIORITY_LABELS, SCOPE_LABELS,
  STATUS_FLOW, STATUS_ICON, STATUS_LABELS,
  STATUS_STRIPE_PULSE, STATUS_STRIPE_TONE,
  TERMINAL_STATUSES, TYPES, TYPE_LABELS, ticketRef,
} from '../services/backlog/types'
import { smartSearchBacklog } from '../services/backlog/search'
import { useT } from '../labels/useT'

// ── Sorting / filtering helpers ──────────────────────────────────────────────

const PRIORITY_RANK = { p0: 0, p1: 1, p2: 2, p3: 3 }

const SORTERS = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  votes: (a, b) => b.voteCount - a.voteCount || b.number - a.number,
  number: (a, b) => b.number - a.number,
  priority: (a, b) =>
    (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9) || b.number - a.number,
}

const makeSortOptions = (t) => [
  { value: 'updated', label: t('app.backlog.sortRecentlyUpdated', 'Recently updated'), icon: 'history' },
  { value: 'votes', label: t('app.backlog.sortMostVotes', 'Most votes'), icon: 'thumb_up' },
  { value: 'priority', label: t('app.backlog.toolbarPriority', 'Priority'), icon: 'priority_high' },
  { value: 'number', label: t('app.backlog.sortNewest', 'Newest'), icon: 'fiber_new' },
]

// Top-level ticket views shown in the right-side filter panel.
const makeViewOptions = (t) => [
  { value: 'board', label: t('app.backlog.viewBoard', 'Board'), icon: 'view_kanban' },
  { value: 'all', label: t('app.backlog.viewAllTickets', 'All tickets'), icon: 'table_rows' },
  { value: 'queue', label: t('app.backlog.viewMyQueue', 'My queue'), icon: 'assignment_ind' },
]

// How many cards a swimlane shows per page before paginating.
const LANE_PAGE_SIZE = 8

function applyFilters(items, { type, priority, scope, complexity }) {
  return items.filter((it) =>
    (type === 'all' || it.type === type)
    && (priority === 'all' || it.priority === priority)
    && (complexity === 'all' || it.complexity === complexity)
    && (scope === 'all' || it.scopeKind === scope))
}

// ── Filter persistence (A1-154) ───────────────────────────────────────────────
// The board's filters, sort, and search persist across reloads so a working view
// sticks. "Clear filters" resets them in one click.

const DEFAULT_FILTERS = { type: 'all', priority: 'all', scope: 'all', complexity: 'all' }
const FILTER_STORAGE_KEY = 'a1-backlog-filters'

function loadFilterState() {
  try {
    const raw = JSON.parse(localStorage.getItem(FILTER_STORAGE_KEY) || '{}')
    return raw && typeof raw === 'object' ? raw : {}
  } catch { return {} }
}

function loadVisibleLanes(persisted) {
  const valid = new Set([...STATUS_FLOW, ...TERMINAL_STATUSES])
  const stored = Array.isArray(persisted?.visibleLanes)
    ? persisted.visibleLanes.filter((status) => valid.has(status))
    : []
  return new Set(stored.length ? stored : STATUS_FLOW)
}

// How many filter dimensions (incl. the search) are currently narrowing the board.
function countActiveFilters(filters, searching) {
  let n = 0
  if (filters.type !== 'all') n += 1
  if (filters.priority !== 'all') n += 1
  if (filters.complexity !== 'all') n += 1
  if (filters.scope !== 'all') n += 1
  if (searching) n += 1
  return n
}

// ── Ticket card ──────────────────────────────────────────────────────────────

// The whole card is a navigation control — click opens the ticket dialog; right-click
// opens a context menu of actions (rule 6a: a navigation card holds only static
// content, so vote/assign/etc. live in the menu, not inline buttons).
function TicketCard({ item, variant = 'board', onOpen, onContextMenu, onDragStart, actionLabel }) {
  const isQueue = variant === 'queue'
  const cardProps = isQueue
    ? { status: STATUS_STRIPE_TONE[item.status], statusPulse: !!STATUS_STRIPE_PULSE[item.status] }
    : {
        variant: 'navigation',
        status: STATUS_STRIPE_TONE[item.status],
        statusPulse: !!STATUS_STRIPE_PULSE[item.status],
        draggable: onDragStart ? true : undefined,
        onDragStart: onDragStart ? (e) => onDragStart(e, item) : undefined,
        onClick: () => onOpen(item),
        onContextMenu: onContextMenu ? (e) => onContextMenu(item, e) : undefined,
      }

  return (
    <Card {...cardProps}>
      <Stack direction={isQueue ? 'row' : 'column'} gap={isQueue ? 'sm' : 'none'} align={isQueue ? 'center' : undefined} justify={isQueue ? 'between' : undefined} wrap={isQueue}>
        <Stack gap={isQueue ? 'xs' : 'none'}>
          <Paragraph as="span" size="xs" color="muted" className="a1-m-0">{ticketRef(item.number)}</Paragraph>
          <Heading size="xs" className="a1-m-0">{item.title}</Heading>
          {!isQueue && <Divider />}
          <Stack direction="row" gap="xs" wrap>
            {isQueue && <StatusBadge status={item.status} />}
            <TypeBadge type={item.type} />
            <PriorityBadge priority={item.priority} />
            <ComplexityBadge complexity={item.complexity} />
            <ScopeBadge scopeKind={item.scopeKind} scopeLabel={item.scopeLabel} />
          </Stack>
        </Stack>
        {isQueue && (
          <IconButton
            icon="open_in_new"
            label={actionLabel}
            variant="secondary"
            onClick={() => onOpen(item)}
          />
        )}
      </Stack>
    </Card>
  )
}

// True at xs/sm (≤640px, the sm-max boundary) — the board switches from a grid of
// swimlanes to a tab per swimlane.
function useIsSmall() {
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 640px)').matches)
  useEffect(() => {
    if (!window.matchMedia) return undefined
    const mq = window.matchMedia('(max-width: 640px)')
    const handler = (e) => setSmall(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])
  return small
}

// A lane's cards, paginated. Reused by the desktop grid (inside a Section) and the
// xs/sm tabbed board (inside a TabPanel).
function LaneCards({ items, onOpen, onContextMenu, onCardDragStart }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / LANE_PAGE_SIZE))
  const safePage = Math.min(page, totalPages) // clamp if items shrank
  const visible = items.slice((safePage - 1) * LANE_PAGE_SIZE, safePage * LANE_PAGE_SIZE)
  return (
    <Stack gap="sm">
      <Stack gap="sm">
        {visible.map((it) => (
          <TicketCard key={it.id} item={it} onOpen={onOpen} onContextMenu={onContextMenu} onDragStart={onCardDragStart} />
        ))}
      </Stack>
      {totalPages > 1 && (
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} size="sm" siblings={0} />
      )}
    </Stack>
  )
}

// A swimlane: an A1 Section (surface differentiates adjacent lanes) with a left
// border acting as the vertical divider. Laid out in a zero-gap Grid (see Board).
function BoardColumn({ status, items, index, onOpen, onContextMenu, onCardDragStart, onLaneDragOver, onLaneDragLeave, onLaneDrop, isDropTarget }) {
  return (
    <Section
      padding="xs"
      surface={index % 2 === 0 ? 'panel' : 'raised'}
      borderSides={index > 0 ? ['left'] : []}
      borderSize="xs"
      borderVariant="subtle"
      className={`a1-web-backlog-lane a1-min-w-xs a1-max-w-xs${isDropTarget ? ' a1-web-backlog-lane--drop' : ''}`}
      onDragOver={(e) => onLaneDragOver?.(e, status)}
      onDragLeave={onLaneDragLeave}
      onDrop={(e) => onLaneDrop?.(e, status)}
    >
      <Stack gap="sm">
        <Stack direction="row" gap="xs" align="center">
          <Heading as="h2" size="sm">{STATUS_LABELS[status]}</Heading>
                    <Heading as="h2" color='muted' size="xs">{items.length}</Heading>
        </Stack>
        <LaneCards items={items} onOpen={onOpen} onContextMenu={onContextMenu} onCardDragStart={onCardDragStart} />
      </Stack>
    </Section>
  )
}

// ── All-tickets table ────────────────────────────────────────────────────────

// Short priority code (p2 → "P2") for the narrow text column — a single-character
// swap, not a casing transform on a word.
const priorityShort = (p) => (p ? p.replace('p', 'P') : '—')

const BACKLOG_CSV_COLUMNS = [
  { header: 'ID', value: (it) => ticketRef(it.number) },
  { header: 'Number', value: (it) => it.number },
  { header: 'Title', value: (it) => it.title },
  { header: 'Description', value: (it) => it.description },
  { header: 'Type', value: (it) => TYPE_LABELS[it.type] },
  { header: 'Status', value: (it) => STATUS_LABELS[it.status] },
  { header: 'Priority', value: (it) => (it.priority ? PRIORITY_LABELS[it.priority] : '') },
  { header: 'Size', value: (it) => (it.complexity ? COMPLEXITY_LABELS[it.complexity] : '') },
  {
    header: 'Scope',
    value: (it) => `${SCOPE_LABELS[it.scopeKind] ?? it.scopeKind}${it.scopeLabel ? `: ${it.scopeLabel}` : ''}`,
  },
  { header: 'Scope ref', value: (it) => it.scopeRef },
  { header: 'Requested by', value: (it) => it.createdByEmail },
  { header: 'Assignee', value: (it) => it.assigneeEmail },
  { header: 'Votes', value: (it) => it.voteCount },
  { header: 'Awaiting requester', value: (it) => (it.awaitingRequester ? 'Yes' : 'No') },
  { header: 'Duplicate of', value: (it, context) => (it.duplicateOf ? context.refById.get(it.duplicateOf) || it.duplicateOf : '') },
  { header: 'Linked tickets', value: (it, context) => (it.links || []).map((id) => context.refById.get(id) || id).join(', ') },
  { header: 'Attachments', value: (it) => (it.attachmentRefs || []).join(', ') },
  { header: 'Created', value: (it) => it.createdAt },
  { header: 'Updated', value: (it) => it.updatedAt },
]

function csvCell(value) {
  const text = value == null ? '' : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function buildBacklogCsv(items) {
  const rows = items.slice().sort((a, b) => a.number - b.number)
  const context = { refById: new Map(rows.map((it) => [it.id, ticketRef(it.number)])) }
  return [
    BACKLOG_CSV_COLUMNS.map((column) => csvCell(column.header)).join(','),
    ...rows.map((it) => BACKLOG_CSV_COLUMNS
      .map((column) => csvCell(column.value(it, context)))
      .join(',')),
  ].join('\r\n')
}

function downloadBacklogCsv(items) {
  const csv = buildBacklogCsv(items)
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `a1-backlog-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

// Date on one line ("Jun 24, 2026"), time smaller + muted underneath.
function DateTimeCell({ iso }) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return (
    <Stack gap={2}>
      <span>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      <Paragraph as="span" size="xs" color="muted">
        {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </Paragraph>
    </Stack>
  )
}

const makeTableColumns = (t) => [
  { key: 'title', label: t('app.backlog.columnTitle', 'Title'), sortable: true, sortAccessor: (r) => r.titleText },
  { key: 'ref', label: t('app.backlog.columnId', 'ID'), sortable: true, sortAccessor: (r) => r.number, width: '5rem' },
  { key: 'type', label: t('app.backlog.toolbarType', 'Type'), width: '6rem' },
  { key: 'status', label: t('app.backlog.toolbarStatus', 'Status'), width: '6rem' },
  { key: 'priority', label: t('app.backlog.toolbarPriority', 'Priority'), sortable: true, sortAccessor: (r) => r.priorityRank, width: '6rem' },
  { key: 'votes', label: t('app.backlog.votes', 'Votes'), type: 'number', sortable: true, width: '2rem' },
  { key: 'requester', label: t('app.backlog.requestedBy', 'Requested by') },
  { key: 'created', label: t('app.backlog.created', 'Created'), sortable: true, sortAccessor: (r) => r.createdAt },
  { key: 'updated', label: t('app.backlog.updated', 'Updated'), sortable: true, sortAccessor: (r) => r.updatedAt },
]

const TABLE_UNSET_FILTER = '__unset__'

const makeTableFilters = (t) => [
  {
    key: 'typeFilter',
    label: t('app.backlog.toolbarType', 'Type'),
    type: 'multi',
    options: TYPES.map((value) => ({ value, label: TYPE_LABELS[value] })),
  },
  {
    key: 'statusFilter',
    label: t('app.backlog.toolbarStatus', 'Status'),
    type: 'multi',
    options: [...STATUS_FLOW, ...TERMINAL_STATUSES].map((value) => ({ value, label: STATUS_LABELS[value] })),
  },
  {
    key: 'priorityFilter',
    label: t('app.backlog.toolbarPriority', 'Priority'),
    type: 'multi',
    options: [
      ...PRIORITIES.map((value) => ({ value, label: PRIORITY_LABELS[value] })),
      { value: TABLE_UNSET_FILTER, label: t('app.backlog.filterNoPriority', 'No priority') },
    ],
  },
  {
    key: 'complexityFilter',
    label: t('app.backlog.toolbarSize', 'Size'),
    type: 'multi',
    options: [
      ...COMPLEXITIES.map((value) => ({ value, label: COMPLEXITY_LABELS[value] })),
      { value: TABLE_UNSET_FILTER, label: t('app.backlog.filterNoSize', 'No size') },
    ],
  },
  {
    key: 'scopeFilter',
    label: t('app.backlog.scopeLabel', 'Scope'),
    type: 'multi',
    options: Object.keys(SCOPE_LABELS).map((value) => ({ value, label: SCOPE_LABELS[value] })),
  },
]

function AllTable({ items, onOpen, onNavigate, t }) {
  const rows = items.map((it) => ({
    id: it.id,
    number: it.number,
    // The ID is a link to the ticket's standalone page; clicking the title opens the dialog.
    ref: (
      <Link
        href={`/backlog/A1-${it.number}`}
        onClick={(e) => {
          if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey && e.button === 0) {
            e.preventDefault()
            onNavigate?.('backlog-ticket', { path: `/backlog/A1-${it.number}` })
          }
        }}
      >
        {ticketRef(it.number)}
      </Link>
    ),
    title: <Link href="#" onClick={(e) => { e.preventDefault(); onOpen(it) }}><strong>{it.title}</strong></Link>,
    titleText: it.title,
    type: TYPE_LABELS[it.type],
    typeFilter: it.type,
    status: STATUS_LABELS[it.status],
    statusFilter: it.status,
    priority: priorityShort(it.priority),
    priorityFilter: it.priority || TABLE_UNSET_FILTER,
    priorityRank: PRIORITY_RANK[it.priority] ?? 9,
    complexityFilter: it.complexity || TABLE_UNSET_FILTER,
    scopeFilter: it.scopeKind,
    votes: it.voteCount,
    requester: it.createdByEmail || '—',
    created: <DateTimeCell iso={it.createdAt} />,
    createdAt: it.createdAt,
    updated: <DateTimeCell iso={it.updatedAt} />,
    updatedAt: it.updatedAt,
  }))
  return (
    <DataTable
      columns={makeTableColumns(t)}
      rows={rows}
      defaultSort={{ key: 'ref', direction: 'desc' }}
      filters={makeTableFilters(t)}
      caption={t('app.backlog.tableCaption', 'All backlog tickets')}
      emptyTitle={t('app.backlog.tableEmptyTitle', 'No matching tickets')}
      emptyDescription={t('app.backlog.tableEmptyDesc', 'Adjust the filters in the panel, or create the first ticket.')}
      defaultPageSize={10}
      pageSizeOptions={[10, 25, 50]}
      scrollable
    />
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function Backlog({ onNavigate }) {
  const t = useT()
  const backlog = useBacklog()
  const [tab, setTab] = useState('board')
  const [selected, setSelected] = useState(null)
  // Filters, sort, and search restore from the last session (A1-154).
  const persisted = useMemo(loadFilterState, [])
  const [query, setQuery] = useState(() => (typeof persisted.query === 'string' ? persisted.query : ''))
  const [sort, setSort] = useState(() => (SORTERS[persisted.sort] ? persisted.sort : 'updated'))
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS, ...(persisted.filters || {}) }))
  const [menu, setMenu] = useState(null) // right-click context menu: { item, x, y } | null
  const [deleteTarget, setDeleteTarget] = useState(null) // ticket pending delete confirmation
  const [dragOverStatus, setDragOverStatus] = useState(null) // swimlane being dragged over
  // Visible swimlanes — workflow lanes on by default, terminal ones (Won't fix / Duplicate) off.
  const [visibleLanes, setVisibleLanes] = useState(() => loadVisibleLanes(persisted))
  const isSmall = useIsSmall() // xs/sm → tab-per-swimlane instead of a grid
  const [activeLane, setActiveLane] = useState(null) // active tab on the small board
  // The filters render into the app's right-hand aside rail (A1-154) — the same slot the
  // editor/theme configurators use. It moves into a BottomSheet at xs/sm (handled by main.jsx).
  const [asideNode, setAsideNode] = useState(null)
  useLayoutEffect(() => {
    const find = () => setAsideNode(document.getElementById('a1-web-backlog-aside-slot'))
    find()
    window.addEventListener('resize', find) // the slot moves rail ↔ bottom sheet across the sm breakpoint
    return () => window.removeEventListener('resize', find)
  }, [])

  const items = backlog?.items ?? []
  const voteFor = backlog?.votedSet ?? new Set()
  const me = backlog?.user
  const searching = !!query.trim()

  // Smart search ranks the whole backlog (A1-187); an empty query passes items through.
  const searched = useMemo(() => smartSearchBacklog(items, query), [items, query])

  // Search + the panel filters (Type/Priority/Size/Scope) — the shared set behind EVERY view
  // (board, the all-tickets table, and my queue), so one panel drives them all.
  const filteredItems = useMemo(() => applyFilters(searched, filters), [searched, filters])

  // Board additionally applies the chosen sort (relevance order while searching).
  const filtered = useMemo(
    () => (searching ? filteredItems : filteredItems.slice().sort(SORTERS[sort])),
    [filteredItems, sort, searching],
  )

  const activeFilterCount = countActiveFilters(filters, searching)
  const boardFilterCount = countActiveFilters(filters, false) // the panel's dimensions only (no search)
  const clearFilters = () => { setFilters(DEFAULT_FILTERS); setQuery('') }

  // Persist the board's filters / sort / search so the view sticks across reloads (A1-154).
  useEffect(() => {
    try { localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify({ filters, sort, query, visibleLanes: [...visibleLanes] })) } catch { /* ignore */ }
  }, [filters, sort, query, visibleLanes])

  const byStatus = useMemo(() => {
    const map = {}
    for (const s of [...STATUS_FLOW, ...TERMINAL_STATUSES]) map[s] = []
    for (const it of filtered) (map[it.status] ||= []).push(it)
    return map
  }, [filtered])

  const queue = useMemo(() => {
    if (!me) return { awaiting: [], mine: [], assigned: [] }
    const base = filteredItems // honour the panel's search + filters
    const awaiting = base.filter((it) => it.awaitingRequester && it.createdBy === me.id)
    const mine = base.filter((it) => it.createdBy === me.id && !awaiting.includes(it))
    const assigned = base.filter((it) => it.assigneeId === me.id && it.createdBy !== me.id)
    return { awaiting, mine, assigned }
  }, [filteredItems, me])

  const reviewItems = useMemo(() => {
    if (tab === 'queue') return [...queue.awaiting, ...queue.assigned, ...queue.mine]
    if (tab === 'all') return filteredItems.slice().sort(SORTERS.number)
    return filtered
  }, [filtered, filteredItems, queue, tab])

  const open = (it) => setSelected(it)
  const vote = (it, v) => backlog?.vote(it, v)
  const scopeOptions = Object.keys(SCOPE_LABELS)

  const openMenu = (it, e) => { e.preventDefault(); setMenu({ item: it, x: e.clientX, y: e.clientY }) }

  // Drag a card onto another swimlane to change its status.
  const handleCardDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleLaneDragOver = (e, status) => {
    e.preventDefault() // allow the drop
    e.dataTransfer.dropEffect = 'move'
    setDragOverStatus(status)
  }
  const handleLaneDrop = (e, status) => {
    e.preventDefault()
    setDragOverStatus(null)
    const id = e.dataTransfer.getData('text/plain')
    const item = items.find((i) => i.id === id)
    if (item && item.status !== status) backlog?.update(item, { status })
  }

  // Actions available on a ticket from the board's right-click context menu.
  const ticketMenuItems = (it) => {
    const isVoted = voteFor.has(it.id)
    const entries = [
      { id: 'open', label: t('app.backlog.menuOpenTicket', 'Open ticket'), icon: 'open_in_new', onClick: () => open(it) },
      { id: 'view-page', label: t('app.backlog.menuViewPage', 'View ticket page'), icon: 'article', onClick: () => onNavigate?.('backlog-ticket', { path: `/backlog/A1-${it.number}` }) },
      { type: 'divider', id: 'd1' },
      { id: 'vote', label: isVoted ? t('app.backlog.removeVote', 'Remove your vote') : t('app.backlog.menuVote', 'Vote'), icon: isVoted ? 'thumb_down' : 'thumb_up', onClick: () => vote(it, !isVoted) },
    ]
    if (me) {
      entries.push(it.assigneeId === me.id
        ? { id: 'unassign', label: t('app.backlog.menuUnassignMe', 'Unassign me'), icon: 'person_remove', onClick: () => backlog?.update(it, { assigneeId: null, assigneeEmail: null }) }
        : { id: 'assign', label: t('app.backlog.assignToMe', 'Assign to me'), icon: 'person_add', onClick: () => backlog?.update(it, { assigneeId: me.id, assigneeEmail: me.email }) })
    }
    entries.push(
      { type: 'divider', id: 'd2' },
      { id: 'copy', label: t('app.backlog.menuCopyId', 'Copy ID'), icon: 'content_copy', onClick: () => { try { navigator.clipboard?.writeText(ticketRef(it.number)) } catch { /* ignore */ } } },
      { type: 'divider', id: 'd3' },
      { id: 'delete', label: t('app.backlog.deleteTicket', 'Delete ticket'), icon: 'delete', variant: 'destructive', onClick: () => setDeleteTarget(it) },
    )
    return entries
  }

  // Keep the open detail dialog in sync with refreshed data.
  const selectedLive = selected ? items.find((i) => i.id === selected.id) || selected : null
  const selectedReviewIndex = selectedLive ? reviewItems.findIndex((it) => it.id === selectedLive.id) : -1
  const previousReviewItem = selectedReviewIndex > 0 ? reviewItems[selectedReviewIndex - 1] : null
  const nextReviewItem = selectedReviewIndex >= 0 && selectedReviewIndex < reviewItems.length - 1
    ? reviewItems[selectedReviewIndex + 1]
    : null

  const counts = {
    open: items.filter((i) => !['released', 'wont_fix', 'duplicate', 'cancelled'].includes(i.status)).length,
    total: items.length,
  }

  return (
    <>

      <Section padding="xs" aria-label={t('app.page.backlog', 'Backlog')}>
        <Stack direction="column" gap="none">
          <Breadcrumb
            items={[
              { label: t('app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: t('app.page.backlog', 'Backlog') },
            ]}
          />
          {/* Search + New ticket now live in the right-hand panel (A1-154). */}
          <Stack direction="row" gap="xs" align="center" wrap>
          <Heading as="h1" size={{ xs: 'lg', md: 'xxl' }}>{t('app.page.backlog', 'Backlog')}</Heading>
            {/* <Paragraph size="sm" color="muted">
              A lightweight, shared ticket tracker. Suggest a priority, complexity and type; vote;
              and follow what's in flight.
            </Paragraph> */}
            <MessageBadge status="info"  size="md">{counts.open} open</MessageBadge>
            <MessageBadge status="neutral" subtle size="mdprefe">{counts.total} total</MessageBadge>
          </Stack>
          {backlog && !backlog.isCloud && (
            <Banner status="info" variant="inline">
              {t('app.backlog.notSignedInBanner', "You're not signed in — tickets are saved in this browser only. Sign in to share the backlog with the team.")}
            </Banner>
          )}
        </Stack>
        <Stack gap="md">
        {/* The search lives in the left-side panel; here we echo the result count +
            the smart-search syntax hint while a query is active. */}
        {searching && (
          <Paragraph size="sm" color="muted">
            {searched.length} result{searched.length === 1 ? '' : 's'} for {'"'}{query.trim()}{'"'} {'—'} {t('app.backlog.searchHint', 'search text, an A1 number, or filters like type:bug · is:open · priority:p1 · scope:component')}.
          </Paragraph>
        )}

        {/* The view switcher (Board / All tickets / My queue) lives in the
            left-side panel now (A1) — here we just render the active view. */}
        {tab === 'board' && (
            <Stack gap="md">
              {/* Sort + the Type/Priority/Size/Scope filters live in the page's left-side
                  panel (A1-154, portaled into the app aside rail). Here we keep only the
                  swimlane view toggles and the board itself. */}
              {!isSmall && (
                <Toolbar
                  aria-label={t('app.backlog.swimlanesToolbarLabel', 'Show or hide swimlanes')}
                  overflow
                  overflowLabel={t('app.backlog.moreSwimlanes', 'More swimlanes')}
                >
                  {[...STATUS_FLOW, ...TERMINAL_STATUSES].map((s) => (
                    <ToolbarToggle
                      key={s}
                      icon={STATUS_ICON[s]}
                      label={STATUS_LABELS[s]}
                      showLabel={{ xs: false, lg: true }}
                      pressed={visibleLanes.has(s)}
                      onChange={(pressed) => setVisibleLanes((prev) => {
                        const next = new Set(prev)
                        if (pressed) next.add(s); else next.delete(s)
                        return next
                      })}
                    />
                  ))}
                </Toolbar>
              )}

              {(() => {
                // A swimlane shows whenever it's toggled on — never hidden because it's empty
                // or filtered down. So the board is stable as you filter / drag cards across it.
                const lanes = [...STATUS_FLOW, ...TERMINAL_STATUSES].filter((s) => visibleLanes.has(s))
                if (lanes.length === 0) {
                  return <MessageEmptyState icon="visibility_off" title={t('app.backlog.noLanesTitle', 'No swimlanes shown')} description={t('app.backlog.noLanesDesc', 'Turn a swimlane on above to see its tickets.')} />
                }
                // xs/sm: one tab per swimlane (a single scrollable column). md+: the grid.
                if (isSmall) {
                  const activeSafe = lanes.includes(activeLane) ? activeLane : lanes[0]
                  return (
                    <Tabs value={activeSafe} onChange={setActiveLane} variant="line" size="compact" labelMode="selected">
                      <TabList>
                        {lanes.map((s) => (
                          <Tab key={s} value={s} icon={STATUS_ICON[s]} count={byStatus[s].length}>{STATUS_LABELS[s]}</Tab>
                        ))}
                      </TabList>
                      {lanes.map((s) => (
                        <TabPanel key={s} value={s}>
                          <LaneCards items={byStatus[s]} onOpen={open} onContextMenu={openMenu} />
                        </TabPanel>
                      ))}
                    </Tabs>
                  )
                }
                return (
                  <div className="a1-web-backlog-board-strip" tabIndex={0} aria-label={t('app.backlog.boardAreaLabel', 'Backlog swimlanes')}>
                    <Grid columns={lanes.length} gap="none" className="a1-web-backlog-board-grid">
                      {lanes.map((s, i) => (
                        <BoardColumn
                          key={s}
                          status={s}
                          items={byStatus[s]}
                          index={i}
                          onOpen={open}
                          onContextMenu={openMenu}
                          onCardDragStart={handleCardDragStart}
                          onLaneDragOver={handleLaneDragOver}
                          onLaneDragLeave={() => setDragOverStatus(null)}
                          onLaneDrop={handleLaneDrop}
                          isDropTarget={dragOverStatus === s}
                        />
                      ))}
                    </Grid>
                  </div>
                )
              })()}
            </Stack>
        )}

        {tab === 'all' && (
          <AllTable items={filteredItems} onOpen={open} onNavigate={onNavigate} t={t} />
        )}

        {tab === 'queue' && (
          !me ? (
            <MessageEmptyState icon="person" title={t('app.backlog.signInForQueueTitle', 'Sign in for your queue')} description={t('app.backlog.signInForQueueDesc', 'Your queue shows tickets you created or are assigned.')} />
          ) : (
            <Stack gap="lg">
              <QueueGroup
                title={t('app.backlog.queueAwaiting', 'Awaiting your answer')}
                icon="help"
                items={queue.awaiting}
                empty={t('app.backlog.queueAwaitingEmpty', 'No clarifying questions for you right now.')}
                openLabel={t('app.backlog.queueOpen', 'Open')}
                onOpen={open}
              />
              <QueueGroup
                title={t('app.backlog.queueAssigned', 'Assigned to you')}
                icon="engineering"
                items={queue.assigned}
                empty={t('app.backlog.queueAssignedEmpty', 'Nothing assigned to you yet.')}
                openLabel={t('app.backlog.queueOpen', 'Open')}
                onOpen={open}
              />
              <QueueGroup
                title={t('app.backlog.queueCreated', 'Created by you')}
                icon="edit_note"
                items={queue.mine}
                empty={t('app.backlog.queueCreatedEmpty', "You haven't created any tickets yet.")}
                openLabel={t('app.backlog.queueOpen', 'Open')}
                onOpen={open}
              />
            </Stack>
          )
        )}

        </Stack>
      </Section>

      <TicketDetail
        item={selectedLive}
        open={!!selected}
        onClose={() => setSelected(null)}
        onOpenItem={(it) => setSelected(it)}
        previousItem={previousReviewItem}
        nextItem={nextReviewItem}
        onPreviousItem={previousReviewItem ? () => setSelected(previousReviewItem) : undefined}
        onNextItem={nextReviewItem ? () => setSelected(nextReviewItem) : undefined}
      />

      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        items={menu ? ticketMenuItems(menu.item) : []}
        onClose={() => setMenu(null)}
        aria-label={t('app.backlog.contextMenuLabel', 'Ticket actions')}
      />

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('app.backlog.deleteTicket', 'Delete ticket')}
        footer={
          <ButtonContainer>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>{t('app.backlog.deleteDialogCancel', 'Cancel')}</Button>
            <Button variant="destructive" icon="delete" onClick={async () => { await backlog?.remove(deleteTarget); setDeleteTarget(null) }}>{t('app.backlog.deleteDialogConfirm', 'Delete')}</Button>
          </ButtonContainer>
        }
      >
        <Paragraph>
          {t('app.backlog.deleteDialogBody', 'Permanently delete')} {deleteTarget ? ticketRef(deleteTarget.number) : ''}{t('app.backlog.deleteDialogBodySuffix', '? This cannot be undone.')}
        </Paragraph>
      </Dialog>

      {/* Filters panel (A1-154) — sort + Type/Priority/Size/Scope, rendered into the app's
          left aside rail (a BottomSheet at xs/sm). Filters the board. */}
      {asideNode && createPortal(
        <div className="a1-web-config-aside__inner">
          <Stack gap="lg">
            {/* View switcher (A1) — replaces the old top-level tabs. */}
            <SegmentedControl
              aria-label={t('app.backlog.viewLabel', 'Backlog view')}
              fullWidth
              labelMode="selected"
              options={makeViewOptions(t)}
              value={tab}
              onChange={setTab}
            />

            <SearchField
              data-a1-page-search=""
              aria-label={t('app.backlog.searchLabel', 'Search backlog')}
              size="compact"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Filters drive every ticket view; sort is board-only because the table
                sorts by column and the queue is grouped. */}
            <>
              <Divider space="none" />

              <Stack direction="row" gap="xs" align="center">
                <Heading as="h2" size="sm">{t('app.action.filters', 'Filters')}</Heading>
                {boardFilterCount > 0 && <MessageBadge status="info" subtle size="sm">{boardFilterCount}</MessageBadge>}
              </Stack>

              {tab === 'board' && (
                <Toolbar label={t('app.backlog.sortByLabel', 'Sort by')} aria-label={t('app.backlog.sortToolbarLabel', 'Sort tickets')}>
                  <ToolbarGroup
                    aria-label={t('app.backlog.sortByLabel', 'Sort by')}
                    labelMode="selected"
                    value={sort}
                    onChange={setSort}
                    options={makeSortOptions(t)}
                  />
                </Toolbar>
              )}
              <Toolbar label={t('app.backlog.toolbarType', 'Type')} aria-label={t('app.backlog.filterTypePanelLabel', 'Filter by type')}>
                <ToolbarGroup
                  aria-label={t('app.backlog.toolbarType', 'Type')}
                  showLabels
                  value={filters.type}
                  onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
                  options={[{ value: 'all', label: t('app.backlog.filterAllOption', 'All') }, ...TYPES.map((tp) => ({ value: tp, label: TYPE_LABELS[tp] }))]}
                />
              </Toolbar>
              <Toolbar label={t('app.backlog.toolbarPriority', 'Priority')} aria-label={t('app.backlog.filterPriorityPanelLabel', 'Filter by priority')} fullWidth>
                <ToolbarGroup
                  aria-label={t('app.backlog.toolbarPriority', 'Priority')}
                  showLabels
                  value={filters.priority}
                  onChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
                  options={[{ value: 'all', label: t('app.backlog.filterAllOption', 'All') }, ...PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p].split(' · ')[0] }))]}
                />
              </Toolbar>
              <Toolbar label={t('app.backlog.toolbarSize', 'Size')} aria-label={t('app.backlog.filterSizePanelLabel', 'Filter by size')} fullWidth>
                <ToolbarGroup
                  aria-label={t('app.backlog.toolbarSize', 'Size')}
                  showLabels
                  value={filters.complexity}
                  onChange={(v) => setFilters((f) => ({ ...f, complexity: v }))}
                  options={[{ value: 'all', label: t('app.backlog.filterAllOption', 'All') }, ...COMPLEXITIES.map((c) => ({ value: c, label: COMPLEXITY_LABELS[c] }))]}
                />
              </Toolbar>
              <Toolbar label={t('app.backlog.scopeLabel', 'Scope')} aria-label={t('app.backlog.filterScopePanelLabel', 'Filter by scope')}>
                <ToolbarMenu
                  aria-label={t('app.backlog.scopeLabel', 'Scope')}
                  showLabel
                  label={filters.scope === 'all' ? t('app.backlog.filterAllScopes', 'All scopes') : SCOPE_LABELS[filters.scope]}
                  value={filters.scope}
                  onChange={(v) => setFilters((f) => ({ ...f, scope: v }))}
                  items={[{ value: 'all', label: t('app.backlog.filterAllScopes', 'All scopes') }, ...scopeOptions.map((s) => ({ value: s, label: SCOPE_LABELS[s] }))]}
                />
              </Toolbar>
              {activeFilterCount > 0 && (
                <Button size="sm" variant="tertiary" icon="filter_alt_off" onClick={clearFilters}>
                  {t('app.backlog.clearFilters', 'Clear filters')} ({activeFilterCount})
                </Button>
              )}
            </>
          </Stack>

          {/* New ticket — pinned to the bottom of the panel as a sticky footer. */}
          <div className="a1-web-config-panel__footer">
            <ButtonContainer>
              <Button
                fullWidth
                variant="secondary"
                icon="download"
                disabled={items.length === 0}
                onClick={() => downloadBacklogCsv(items)}
              >
                {t('app.backlog.exportCsv', 'Export CSV')}
              </Button>
              <Button fullWidth icon="add" onClick={() => backlog?.openCreate({ kind: 'general' })}>
                {t('app.backlog.newTicket', 'New ticket')}
              </Button>
            </ButtonContainer>
          </div>
        </div>,
        asideNode,
      )}
    </>
  )
}

function QueueGroup({ title, icon, items, empty, openLabel, onOpen }) {
  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs" align="center">
        <Icon name={icon} size="sm" color="muted" />
        <Heading as="h2" size="sm">{title}</Heading>
        <MessageBadge status="neutral" subtle size="sm">{items.length}</MessageBadge>
      </Stack>
      {items.length === 0 ? (
        <Paragraph size="sm" color="muted">{empty}</Paragraph>
      ) : (
        <Stack gap="xs">
          {items.map((it) => (
            <TicketCard
              key={it.id}
              item={it}
              variant="queue"
              onOpen={onOpen}
              actionLabel={`${openLabel ?? 'Open'} ${ticketRef(it.number)}`}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
