import { useMemo, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  ContextMenu,
  Icon,
  IconButton,
  Link,
  MessageBadge,
  Paragraph,
  SegmentedControl,
  Stack,
  TextField,
  Toolbar,
  ToolbarGroup,
} from '@gtivr4/a1-design-system-react'
import {
  findSimilar, similarityLabel, similarityTone, suggestCanonical,
} from '../services/backlog/similarity'
import { TYPE_ICON, TYPE_LABELS, TYPES, ticketRef } from '../services/backlog/types'
import { StatusBadge, TypeBadge } from './TicketBadges'

/**
 * "Link Tickets" (A1-161). Surfaces the local similarity finder's matches for a ticket and
 * lets a user **join two similar tickets into one** — picking which survives; the other is
 * closed as a duplicate with its thread, votes, and description moved across (see
 * `services/backlog/{similarity,backlogStore.mergeTickets}`).
 *
 * Three states:
 *  - the ticket was already merged → a banner linking to the canonical (no finder);
 *  - tickets were merged *into* this one → a short "merged in" list;
 *  - otherwise → AI-suggested similar tickets + a manual "merge by ID" fallback.
 */
export function TicketMergePanel({ item, items = [], onMerge, onLink, onUnlink, onOpenItem }) {
  const [pending, setPending] = useState(null) // { other } — the ticket to merge with
  const [keep, setKeep] = useState('current') // which side survives
  const [busy, setBusy] = useState(false)
  const [manual, setManual] = useState('')
  const [manualError, setManualError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // suggestion filter (A1-208)
  const [menu, setMenu] = useState(null) // right-click context menu: { x, y, match }

  // Tickets that were merged into this one (this ticket is the survivor).
  const mergedIn = useMemo(
    () => items.filter((i) => i.duplicateOf === item.id),
    [items, item.id],
  )

  // The canonical this ticket was merged into, if any.
  const canonicalOf = item.duplicateOf
    ? items.find((i) => i.id === item.duplicateOf)
    : null

  // AI-suggested similar, open tickets (skips self + already-merged + terminal).
  const matches = useMemo(
    () => (item.duplicateOf ? [] : findSimilar(item, items)),
    [item, items],
  )

  // Explicitly linked tickets (A1-218) — resolve the stored ids to tickets.
  const linkedItems = useMemo(
    () => (item.links ?? []).map((id) => items.find((i) => i.id === id)).filter(Boolean),
    [item.links, items],
  )
  const isLinked = (other) => (item.links ?? []).includes(other.id)

  // Suggestion filter (A1-208): a toolbar lets the user narrow the suggested
  // tickets by type. Only offer the types actually present (plus "All"), and only
  // show the toolbar when there's more than one type to choose between.
  const presentTypes = useMemo(
    () => TYPES.filter((t) => matches.some((m) => m.item.type === t)),
    [matches],
  )
  const filterOptions = [
    { value: 'all', label: 'All', icon: 'filter_list' },
    ...presentTypes.map((t) => ({ value: t, label: TYPE_LABELS[t], icon: TYPE_ICON[t] })),
  ]
  const showFilter = presentTypes.length > 1
  const effectiveFilter = showFilter ? typeFilter : 'all'
  const visibleMatches = effectiveFilter === 'all'
    ? matches
    : matches.filter((m) => m.item.type === effectiveFilter)

  function copyRef(m) {
    try { navigator.clipboard?.writeText(ticketRef(m.number)) } catch { /* clipboard unavailable */ }
  }

  function startMerge(other) {
    if (!other || other.id === item.id) return
    const canonical = suggestCanonical(item, other)
    setKeep(canonical.id === item.id ? 'current' : 'other')
    setPending({ other })
  }

  // Resolve the "by ID" field to a ticket (or set an error and return null).
  function resolveManual() {
    setManualError('')
    const m = manual.trim().match(/(\d+)/)
    if (!m) { setManualError('Enter a ticket number, e.g. A1-42.'); return null }
    const num = Number(m[1])
    if (num === item.number) { setManualError('That’s this ticket.'); return null }
    const other = items.find((i) => i.number === num)
    if (!other) { setManualError(`No ticket ${ticketRef(num)} found.`); return null }
    return other
  }
  function mergeManual() {
    const other = resolveManual()
    if (!other) return
    setManual('')
    startMerge(other)
  }
  function linkManual() {
    const other = resolveManual()
    if (!other) return
    setManual('')
    onLink?.(item, other)
  }

  async function confirmMerge() {
    if (!pending || busy) return
    const other = pending.other
    const canonical = keep === 'current' ? item : other
    const duplicate = keep === 'current' ? other : item
    setBusy(true)
    try {
      await onMerge?.(duplicate, canonical)
      setPending(null)
      // If the open ticket was the one closed, jump to the survivor.
      if (duplicate.id === item.id) onOpenItem?.(canonical)
    } finally {
      setBusy(false)
    }
  }

  // ── Already merged into another ticket ──────────────────────────────────────
  if (item.duplicateOf) {
    return (
      <Banner status="info" variant="inline">
        <Stack direction="row" gap="xs" align="center" wrap>
          <span>This ticket was merged as a duplicate{canonicalOf ? ' of' : '.'}</span>
          {canonicalOf && (
            <Link href="#" onClick={(e) => { e.preventDefault(); onOpenItem?.(canonicalOf) }}>
              {ticketRef(canonicalOf.number)} · {canonicalOf.title}
            </Link>
          )}
        </Stack>
      </Banner>
    )
  }

  const pendingOther = pending?.other
  const hasContent = mergedIn.length > 0 || matches.length > 0

  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs" align="center">
        <Icon name="merge" size="sm" color="muted" />
        <Paragraph as="span" size="xs" color="muted">Linked &amp; similar tickets</Paragraph>
      </Stack>

      {/* Explicitly linked tickets (A1-218) — related, both stay open. */}
      {linkedItems.length > 0 && (
        <Stack gap="xs">
          <Paragraph as="span" size="xs" color="muted">Linked tickets</Paragraph>
          {linkedItems.map((l) => (
            <Card key={l.id}>
              <Stack direction="row" gap="sm" align="center" justify="between" wrap>
                <Stack direction="row" gap="xs" align="center" wrap>
                  <Paragraph as="span" size="xs" color="muted">{ticketRef(l.number)}</Paragraph>
                  <Paragraph size="sm">{l.title}</Paragraph>
                </Stack>
                <Stack direction="row" gap="xs" align="center" wrap>
                  <TypeBadge type={l.type} size="sm" />
                  <StatusBadge status={l.status} size="sm" />
                  <IconButton
                    size="sm"
                    variant="secondary"
                    icon="open_in_new"
                    label={`Open ${ticketRef(l.number)}`}
                    onClick={() => onOpenItem?.(l)}
                  />
                  <IconButton
                    size="sm"
                    variant="tertiary"
                    icon="link_off"
                    label={`Unlink ${ticketRef(l.number)}`}
                    onClick={() => onUnlink?.(item, l)}
                  />
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      {/* Tickets already merged into this one. */}
      {mergedIn.length > 0 && (
        <Stack gap="xs">
          <Paragraph as="span" size="xs" color="muted">Merged into this ticket</Paragraph>
          <Stack direction="row" gap="xs" wrap>
            {mergedIn.map((d) => (
              <MessageBadge key={d.id} status="neutral" subtle size="sm" icon="merge">
                <Link href="#" onClick={(e) => { e.preventDefault(); onOpenItem?.(d) }}>
                  {ticketRef(d.number)}
                </Link>
              </MessageBadge>
            ))}
          </Stack>
        </Stack>
      )}

      {/* The merge confirmation (shared by the suggestions + the manual entry). */}
      {pendingOther && (
        <Card>
          <Stack gap="sm">
            <Paragraph size="sm">
              Joining {ticketRef(item.number)} and {ticketRef(pendingOther.number)} into one.
              The ticket you keep absorbs the other’s comments, votes, and description; the
              other is closed as a duplicate.
            </Paragraph>
            <Stack gap="xs">
              <Paragraph as="span" size="xs" color="muted">Keep which ticket?</Paragraph>
              <SegmentedControl
                aria-label="Ticket to keep"
                value={keep}
                onChange={setKeep}
                options={[
                  { value: 'current', label: `${ticketRef(item.number)} (this)` },
                  { value: 'other', label: ticketRef(pendingOther.number) },
                ]}
              />
            </Stack>
            <ButtonContainer align="start">
              <Button size="sm" icon="merge" loading={busy} onClick={confirmMerge}>
                Merge tickets
              </Button>
              <Button size="sm" variant="secondary" disabled={busy} onClick={() => setPending(null)}>
                Cancel
              </Button>
            </ButtonContainer>
          </Stack>
        </Card>
      )}

      {/* AI-suggested similar tickets. */}
      {matches.length > 0 ? (
        <Stack gap="xs">
          <Paragraph as="span" size="xs" color="muted">
            These look similar — they may be the same request.
          </Paragraph>

          {/* Filter the suggestions by ticket type (A1-208). */}
          {showFilter && (
            <Toolbar label="Filter suggestions" aria-label="Filter suggestions by type">
              <ToolbarGroup
                aria-label="Filter suggestions by type"
                showLabels
                value={effectiveFilter}
                onChange={setTypeFilter}
                options={filterOptions}
              />
            </Toolbar>
          )}

          {visibleMatches.length === 0 ? (
            <Paragraph size="sm" color="muted">No suggestions match this filter.</Paragraph>
          ) : visibleMatches.map(({ item: m, score, reasons }) => (
            <Card
              key={m.id}
              onContextMenu={(e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY, match: m }) }}
            >
              <Stack gap="xs">
                <Stack direction="row" gap="sm" align="center" justify="between" wrap>
                  <Stack direction="row" gap="xs" align="center" wrap>
                    <Paragraph as="span" size="xs" color="muted">{ticketRef(m.number)}</Paragraph>
                    <MessageBadge status={similarityTone(score)} subtle size="sm" icon="join_inner">
                      {similarityLabel(score)} · {Math.round(score * 100)}%
                    </MessageBadge>
                  </Stack>
                  <Stack direction="row" gap="xs" wrap>
                    <TypeBadge type={m.type} size="sm" />
                    <StatusBadge status={m.status} size="sm" />
                  </Stack>
                </Stack>
                <Paragraph size="sm">{m.title}</Paragraph>
                {reasons.length > 0 && (
                  <Paragraph as="span" size="xs" color="muted">{reasons.join(' · ')}</Paragraph>
                )}
                {/* Compact icon-button actions; right-click the card for the full menu (A1-208). */}
                <ButtonContainer align="start">
                  <IconButton
                    size="sm"
                    variant="secondary"
                    icon="open_in_new"
                    label={`Open ${ticketRef(m.number)}`}
                    onClick={() => onOpenItem?.(m)}
                  />
                  {!isLinked(m) && (
                    <IconButton
                      size="sm"
                      variant="secondary"
                      icon="link"
                      label={`Link ${ticketRef(m.number)} to this ticket`}
                      onClick={() => onLink?.(item, m)}
                    />
                  )}
                  <IconButton
                    size="sm"
                    variant="secondary"
                    icon="merge"
                    label={`Merge ${ticketRef(m.number)} into this ticket`}
                    disabled={busy || pendingOther?.id === m.id}
                    onClick={() => startMerge(m)}
                  />
                  <IconButton
                    size="sm"
                    variant="tertiary"
                    icon="more_vert"
                    label={`More actions for ${ticketRef(m.number)}`}
                    onClick={(e) => {
                      const r = e.currentTarget.getBoundingClientRect()
                      setMenu({ x: r.left, y: r.bottom, match: m })
                    }}
                  />
                </ButtonContainer>
              </Stack>
            </Card>
          ))}
        </Stack>
      ) : (
        !hasContent && (
          <Paragraph size="sm" color="muted">No similar tickets found.</Paragraph>
        )
      )}

      {/* Right-click (or ⋮) actions for a suggested ticket (A1-208). */}
      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        onClose={() => setMenu(null)}
        aria-label="Suggested ticket actions"
        items={menu ? [
          { id: 'open', label: `Open ${ticketRef(menu.match.number)}`, icon: 'open_in_new', onClick: () => onOpenItem?.(menu.match) },
          ...(isLinked(menu.match)
            ? [{ id: 'unlink', label: 'Unlink', icon: 'link_off', onClick: () => onUnlink?.(item, menu.match) }]
            : [{ id: 'link', label: 'Link to this ticket', icon: 'link', onClick: () => onLink?.(item, menu.match) }]),
          { id: 'merge', label: 'Merge into this ticket…', icon: 'merge', disabled: busy || pendingOther?.id === menu.match.id, onClick: () => startMerge(menu.match) },
          { type: 'divider', id: 'sep' },
          { id: 'copy', label: 'Copy reference', icon: 'content_copy', onClick: () => copyRef(menu.match) },
        ] : []}
      />

      {/* Manual fallback — link or merge a ticket the finder didn't surface. */}
      <Stack direction="row" gap="xs" align="end" wrap>
        <TextField
          label="Link or merge a ticket by ID"
          size="compact"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          error={manualError || undefined}
          autoComplete="off"
        />
        <Button size="sm" variant="secondary" icon="link" disabled={busy || !manual.trim()} onClick={linkManual}>
          Link
        </Button>
        <Button size="sm" variant="secondary" icon="merge" disabled={busy || !manual.trim()} onClick={mergeManual}>
          Merge…
        </Button>
      </Stack>
    </Stack>
  )
}
