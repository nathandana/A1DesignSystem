import { useEffect, useMemo, useState } from 'react'
import {
  Banner,
  Breadcrumb,
  Button,
  Card,
  ContextMenu,
  DataTable,
  Divider,
  Grid,
  Heading,
  Icon,
  Link,
  MessageBadge,
  MessageEmptyState,
  Pagination,
  Paragraph,
  Section,
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
import { VirtualTeamPanel } from '../backlog/VirtualTeamPanel'
import { VirtualArchitectPanel } from '../backlog/VirtualArchitectPanel'
import {
  ComplexityBadge, PriorityBadge, ScopeBadge, StatusBadge, TypeBadge,
} from '../backlog/TicketBadges'
import {
  COMPLEXITIES, COMPLEXITY_LABELS, PRIORITIES, PRIORITY_LABELS, SCOPE_LABELS,
  STATUS_FLOW, STATUS_ICON, STATUS_LABELS,
  STATUS_STRIPE_PULSE, STATUS_STRIPE_TONE,
  STATUSES, TERMINAL_STATUSES, TYPES, TYPE_LABELS, ticketRef,
} from '../services/backlog/types'

// ── Sorting / filtering helpers ──────────────────────────────────────────────

const PRIORITY_RANK = { p0: 0, p1: 1, p2: 2, p3: 3 }

const SORTERS = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  votes: (a, b) => b.voteCount - a.voteCount || b.number - a.number,
  number: (a, b) => b.number - a.number,
  priority: (a, b) =>
    (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9) || b.number - a.number,
}

const SORT_OPTIONS = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'votes', label: 'Most votes' },
  { value: 'priority', label: 'Priority' },
  { value: 'number', label: 'Newest' },
]

// How many cards a swimlane shows per page before paginating.
const LANE_PAGE_SIZE = 5

function applyFilters(items, { type, priority, scope, complexity }) {
  return items.filter((it) =>
    (type === 'all' || it.type === type)
    && (priority === 'all' || it.priority === priority)
    && (complexity === 'all' || it.complexity === complexity)
    && (scope === 'all' || it.scopeKind === scope))
}

// ── Board card ───────────────────────────────────────────────────────────────

// The whole card is a navigation control — click opens the ticket dialog; right-click
// opens a context menu of actions (rule 6a: a navigation card holds only static
// content, so vote/assign/etc. live in the menu, not inline buttons).
function BoardCard({ item, onOpen, onContextMenu }) {
  return (
    <Card
      variant="navigation"
      status={STATUS_STRIPE_TONE[item.status]}
      statusPulse={!!STATUS_STRIPE_PULSE[item.status]}
      onClick={() => onOpen(item)}
      onContextMenu={(e) => onContextMenu(item, e)}
    >
      <Stack gap="xs">
          <Paragraph as="span" size="xs" color="muted">{ticketRef(item.number)}</Paragraph>
        <Heading size="xs">{item.title}</Heading>
        <Divider/>
        <Stack direction="row" gap="xs" wrap>
          <TypeBadge type={item.type} /><PriorityBadge priority={item.priority} />
          <ComplexityBadge complexity={item.complexity} />
          <ScopeBadge scopeKind={item.scopeKind} scopeLabel={item.scopeLabel} />
        </Stack>
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
function LaneCards({ items, onOpen, onContextMenu }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / LANE_PAGE_SIZE))
  const safePage = Math.min(page, totalPages) // clamp if items shrank
  const visible = items.slice((safePage - 1) * LANE_PAGE_SIZE, safePage * LANE_PAGE_SIZE)
  return (
    <Stack gap="sm">
      <Stack gap="sm">
        {visible.map((it) => (
          <BoardCard key={it.id} item={it} onOpen={onOpen} onContextMenu={onContextMenu} />
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
function BoardColumn({ status, items, index, onOpen, onContextMenu }) {
  return (
    <Section
      padding="xs"
      surface={index % 2 === 0 ? 'panel' : 'raised'}
      borderSides={index > 0 ? ['left'] : []}
      borderSize="xs"
      borderVariant="subtle"
    >
      <Stack gap="sm">
        <Stack direction="row" gap="xs" align="center">
          <Heading as="h2" size="sm">{STATUS_LABELS[status]}</Heading>
                    <Heading as="h2" color='muted' size="xs">{items.length}</Heading>
        </Stack>
        <LaneCards items={items} onOpen={onOpen} onContextMenu={onContextMenu} />
      </Stack>
    </Section>
  )
}

// ── All-tickets table ────────────────────────────────────────────────────────

// Short priority code (p2 → "P2") for the narrow text column — a single-character
// swap, not a casing transform on a word.
const priorityShort = (p) => (p ? p.replace('p', 'P') : '—')

// Filter controls (multi-select). Keyed to the label fields the cells display, so a
// selected option's value matches the row value (DataTable filters by equality).
const TABLE_FILTERS = [
  { key: 'type', label: 'Type', type: 'multi', options: TYPES.map((t) => ({ value: TYPE_LABELS[t], label: TYPE_LABELS[t] })) },
  { key: 'status', label: 'Status', type: 'multi', options: STATUSES.map((s) => ({ value: STATUS_LABELS[s], label: STATUS_LABELS[s] })) },
  {
    key: 'priority',
    label: 'Priority',
    type: 'multi',
    options: [...PRIORITIES.map((p) => ({ value: priorityShort(p), label: PRIORITY_LABELS[p] })), { value: '—', label: 'No priority' }],
  },
]

// Search title + requester. Normalise whitespace to underscores to match DataTable's
// query normalisation (so multi-word searches match), and to avoid stringifying the
// title cell's React node.
const TABLE_SEARCH_COLUMNS = [
  { key: 'title', label: 'Title', searchAccessor: (r) => String(r.titleText).replace(/\s+/g, '_') },
  { key: 'requester', label: 'Requested by', searchAccessor: (r) => String(r.requester).replace(/\s+/g, '_') },
]

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

const TABLE_COLUMNS = [
  { key: 'title', label: 'Title', sortable: true, sortAccessor: (r) => r.titleText },
    { key: 'ref', label: 'ID', sortable: true, sortAccessor: (r) => r.number, width: '5rem' },
{ key: 'type', label: 'Type', width: '6rem' },
  { key: 'status', label: 'Status', width: '6rem' },
  { key: 'priority', label: 'Priority', sortable: true, sortAccessor: (r) => r.priorityRank, width: '6rem' },
  { key: 'votes', label: 'Votes', type: 'number', sortable: true, width: '2rem' },
  { key: 'requester', label: 'Requested by' },
  { key: 'created', label: 'Created', sortable: true, sortAccessor: (r) => r.createdAt },
  { key: 'updated', label: 'Updated', sortable: true, sortAccessor: (r) => r.updatedAt },
]

function AllTable({ items, onOpen }) {
  const rows = items.map((it) => ({
    id: it.id,
    number: it.number,
    // The ID is the link that opens the ticket (no separate Open button).
    ref: it.number,
    title: <Link href="#" onClick={(e) => { e.preventDefault(); onOpen(it) }}><strong>{it.title}</strong></Link>,
    titleText: it.title,
    type: TYPE_LABELS[it.type],
    status: STATUS_LABELS[it.status],
    priority: priorityShort(it.priority),
    priorityRank: PRIORITY_RANK[it.priority] ?? 9,
    votes: it.voteCount,
    requester: it.createdByEmail || '—',
    created: <DateTimeCell iso={it.createdAt} />,
    createdAt: it.createdAt,
    updated: <DateTimeCell iso={it.updatedAt} />,
    updatedAt: it.updatedAt,
  }))
  return (
    <DataTable
      columns={TABLE_COLUMNS}
      rows={rows}
      filters={TABLE_FILTERS}
      searchableColumns={TABLE_SEARCH_COLUMNS}
      defaultSort={{ key: 'ref', direction: 'desc' }}
      caption="All backlog tickets"
      emptyTitle="No matching tickets"
      emptyDescription="Try clearing the search or filters."
      pageSize={10}
    />
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function Backlog({ onNavigate }) {
  const backlog = useBacklog()
  const [tab, setTab] = useState('board')
  const [selected, setSelected] = useState(null)
  const [sort, setSort] = useState('updated')
  const [filters, setFilters] = useState({ type: 'all', priority: 'all', scope: 'all', complexity: 'all' })
  const [menu, setMenu] = useState(null) // right-click context menu: { item, x, y } | null
  // Visible swimlanes — workflow lanes on by default, terminal ones (Won't fix / Duplicate) off.
  const [visibleLanes, setVisibleLanes] = useState(() => new Set(STATUS_FLOW))
  const isSmall = useIsSmall() // xs/sm → tab-per-swimlane instead of a grid
  const [activeLane, setActiveLane] = useState(null) // active tab on the small board

  const items = backlog?.items ?? []
  const voteFor = backlog?.votedSet ?? new Set()
  const me = backlog?.user

  const filtered = useMemo(
    () => applyFilters(items, filters).slice().sort(SORTERS[sort]),
    [items, filters, sort],
  )

  const byStatus = useMemo(() => {
    const map = {}
    for (const s of [...STATUS_FLOW, ...TERMINAL_STATUSES]) map[s] = []
    for (const it of filtered) (map[it.status] ||= []).push(it)
    return map
  }, [filtered])

  const queue = useMemo(() => {
    if (!me) return { awaiting: [], mine: [], assigned: [] }
    const awaiting = items.filter((it) => it.awaitingRequester && it.createdBy === me.id)
    const mine = items.filter((it) => it.createdBy === me.id && !awaiting.includes(it))
    const assigned = items.filter((it) => it.assigneeId === me.id && it.createdBy !== me.id)
    return { awaiting, mine, assigned }
  }, [items, me])

  const open = (it) => setSelected(it)
  const vote = (it, v) => backlog?.vote(it, v)
  const scopeOptions = Object.keys(SCOPE_LABELS)

  const openMenu = (it, e) => { e.preventDefault(); setMenu({ item: it, x: e.clientX, y: e.clientY }) }

  // Actions available on a ticket from the board's right-click context menu.
  const ticketMenuItems = (it) => {
    const isVoted = voteFor.has(it.id)
    const entries = [
      { id: 'open', label: 'Open ticket', icon: 'open_in_new', onClick: () => open(it) },
      { type: 'divider', id: 'd1' },
      { id: 'vote', label: isVoted ? 'Remove your vote' : 'Vote', icon: isVoted ? 'thumb_down' : 'thumb_up', onClick: () => vote(it, !isVoted) },
    ]
    if (me) {
      entries.push(it.assigneeId === me.id
        ? { id: 'unassign', label: 'Unassign me', icon: 'person_remove', onClick: () => backlog?.update(it, { assigneeId: null, assigneeEmail: null }) }
        : { id: 'assign', label: 'Assign to me', icon: 'person_add', onClick: () => backlog?.update(it, { assigneeId: me.id, assigneeEmail: me.email }) })
    }
    entries.push(
      { type: 'divider', id: 'd2' },
      { id: 'copy', label: 'Copy ID', icon: 'content_copy', onClick: () => { try { navigator.clipboard?.writeText(ticketRef(it.number)) } catch { /* ignore */ } } },
    )
    return entries
  }

  // Keep the open detail dialog in sync with refreshed data.
  const selectedLive = selected ? items.find((i) => i.id === selected.id) || selected : null

  const counts = {
    open: items.filter((i) => !['released', 'wont_fix', 'duplicate'].includes(i.status)).length,
    total: items.length,
  }

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Backlog' },
            ]}
          />
          <Stack direction="row" gap="sm" align="center" justify="between" wrap>
            <Heading as="h1" size={{ xs: 'lg', md: 'xxl' }}>Backlog</Heading>
            <Button icon="add" onClick={() => backlog?.openCreate({ kind: 'general' })}>New ticket</Button>
          </Stack>
          <Stack direction="row" gap="xs" align="center" wrap>
            <Paragraph size="sm" color="muted">
              A lightweight, shared ticket tracker. Suggest a priority, complexity and type; vote;
              and follow what’s in flight.
            </Paragraph>
            <MessageBadge status="info" subtle size="sm">{counts.open} open</MessageBadge>
            <MessageBadge status="neutral" subtle size="sm">{counts.total} total</MessageBadge>
          </Stack>
          {backlog && !backlog.isCloud && (
            <Banner status="info" variant="inline">
              You’re not signed in — tickets are saved in this browser only. Sign in to share the
              backlog with the team.
            </Banner>
          )}
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="2xl" aria-label="Backlog">
        <Tabs value={tab} onChange={setTab}>
          <TabList>
            <Tab value="board">Board</Tab>
            <Tab value="all">All tickets</Tab>
            <Tab value="queue">My queue</Tab>
            {import.meta.env.DEV && <Tab value="team" icon="groups">Virtual team</Tab>}
          </TabList>

          <TabPanel value="board">
            <Stack gap="md">
              {/* Filters + sort */}
              <Stack direction="row" gap="md" wrap align="end">
                <Toolbar label="Type" aria-label="Filter by type">
                  <ToolbarGroup
                    aria-label="Type"
                    showLabels
                    value={filters.type}
                    onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
                    options={[{ value: 'all', label: 'All' }, ...TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t] }))]}
                  />
                </Toolbar>
                <Toolbar label="Priority" aria-label="Filter by priority">
                  <ToolbarGroup
                    aria-label="Priority"
                    showLabels
                    value={filters.priority}
                    onChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
                    options={[{ value: 'all', label: 'All' }, ...PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p].split(' · ')[0] }))]}
                  />
                </Toolbar>
                <Toolbar label="Size" aria-label="Filter by size">
                  <ToolbarGroup
                    aria-label="Size"
                    showLabels
                    value={filters.complexity}
                    onChange={(v) => setFilters((f) => ({ ...f, complexity: v }))}
                    options={[{ value: 'all', label: 'All' }, ...COMPLEXITIES.map((c) => ({ value: c, label: COMPLEXITY_LABELS[c] }))]}
                  />
                </Toolbar>
                <Toolbar label="Scope" aria-label="Filter by scope">
                  <ToolbarMenu
                    aria-label="Scope"
                    showLabel
                    label={filters.scope === 'all' ? 'All scopes' : SCOPE_LABELS[filters.scope]}
                    value={filters.scope}
                    onChange={(v) => setFilters((f) => ({ ...f, scope: v }))}
                    items={[{ value: 'all', label: 'All scopes' }, ...scopeOptions.map((s) => ({ value: s, label: SCOPE_LABELS[s] }))]}
                  />
                </Toolbar>
                <Toolbar label="Sort by" aria-label="Sort tickets">
                  <ToolbarMenu
                    aria-label="Sort by"
                    showLabel
                    label={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'}
                    value={sort}
                    onChange={setSort}
                    items={SORT_OPTIONS}
                  />
                </Toolbar>

              {/* Show / hide swimlanes — workflow lanes on by default, terminal
                  (Won't fix / Duplicate) off; ordered important-first. */}
              <Toolbar label="Swimlanes" aria-label="Show or hide swimlanes">
                {[...STATUS_FLOW, ...TERMINAL_STATUSES].map((s) => (
                  <ToolbarToggle
                    key={s}
                    icon={STATUS_ICON[s]}
                    label={STATUS_LABELS[s]}
                    showLabel={{ xs: false, md: true }}
                    pressed={visibleLanes.has(s)}
                    onChange={(pressed) => setVisibleLanes((prev) => {
                      const next = new Set(prev)
                      if (pressed) next.add(s); else next.delete(s)
                      return next
                    })}
                  />
                ))}
              </Toolbar>
              </Stack>


              {filtered.length === 0 ? (
                <MessageEmptyState icon="task_alt" title="No tickets match" description="Adjust the filters, or create the first ticket." />
              ) : (
                (() => {
                  const lanes = [...STATUS_FLOW, ...TERMINAL_STATUSES].filter((s) => visibleLanes.has(s) && byStatus[s].length > 0)
                  if (lanes.length === 0) {
                    return <MessageEmptyState icon="visibility_off" title="All matching swimlanes are hidden" description="Turn a swimlane on above to see its tickets." />
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
                    <Grid columns={lanes.length} gap="none">
                      {lanes.map((s, i) => (
                        <BoardColumn key={s} status={s} items={byStatus[s]} index={i} onOpen={open} onContextMenu={openMenu} />
                      ))}
                    </Grid>
                  )
                })()
              )}
            </Stack>
          </TabPanel>

          <TabPanel value="all">
            <AllTable items={items} onOpen={open} />
          </TabPanel>

          <TabPanel value="queue">
            {!me ? (
              <MessageEmptyState icon="person" title="Sign in for your queue" description="Your queue shows tickets you created or are assigned." />
            ) : (
              <Stack gap="lg">
                <QueueGroup
                  title="Awaiting your answer"
                  icon="help"
                  items={queue.awaiting}
                  empty="No clarifying questions for you right now."
                  onOpen={open}
                />
                <QueueGroup
                  title="Assigned to you"
                  icon="engineering"
                  items={queue.assigned}
                  empty="Nothing assigned to you yet."
                  onOpen={open}
                />
                <QueueGroup
                  title="Created by you"
                  icon="edit_note"
                  items={queue.mine}
                  empty="You haven’t created any tickets yet."
                  onOpen={open}
                />
              </Stack>
            )}
          </TabPanel>

          {import.meta.env.DEV && (
            <TabPanel value="team">
              <Stack gap="xl">
                <VirtualTeamPanel />
                <Divider />
                <VirtualArchitectPanel />
              </Stack>
            </TabPanel>
          )}
        </Tabs>
      </Section>

      <TicketDetail
        item={selectedLive}
        open={!!selected}
        onClose={() => setSelected(null)}
        onOpenItem={(it) => setSelected(it)}
      />

      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        items={menu ? ticketMenuItems(menu.item) : []}
        onClose={() => setMenu(null)}
        aria-label="Ticket actions"
      />
    </>
  )
}

function QueueGroup({ title, icon, items, empty, onOpen }) {
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
            <Card key={it.id} status={STATUS_STRIPE_TONE[it.status]} statusPulse={!!STATUS_STRIPE_PULSE[it.status]}>
              <Stack direction="row" gap="sm" align="center" justify="between" wrap>
                <Stack gap="xs">
                  <Paragraph size="sm">{ticketRef(it.number)} · {it.title}</Paragraph>
                  <Stack direction="row" gap="xs" wrap>
                    <StatusBadge status={it.status} />
                    <PriorityBadge priority={it.priority} />
                    <ScopeBadge scopeKind={it.scopeKind} scopeLabel={it.scopeLabel} />
                  </Stack>
                </Stack>
                <Button size="sm" variant="secondary" icon="open_in_new" onClick={() => onOpen(it)}>Open</Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
